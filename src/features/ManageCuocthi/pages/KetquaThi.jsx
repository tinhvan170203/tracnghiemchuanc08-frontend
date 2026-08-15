import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import monthiApi from '../../../api/monthiApi';
import DashboardIcon from "@mui/icons-material/Dashboard";
import dayjs from 'dayjs';
import CustomPaginationActionsTableKetquaThi from '../components/CustomPaginationActionsTableKetquaThi';
import { Button, IconButton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ModalLoading from '../../../components/ModalLoading';
import PreviewBaithi from '../../../components/PreviewBaithi';
import QRCodeComponent from '../../../components/QRCode';
import { API_SERVER } from '../../../api/apiServer';
import SearchIcon from '@mui/icons-material/Search'
import TopCauHoiSai from '../components/TopCauhoiSai';
import { useSnackbar } from 'notistack';

const ChartResult = lazy(() => import('../components/ChartResult'));

const KetquaThi = () => {
  let { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [link, setLink] = useState('');
  const [openModalLoading, setOpenModalLoading] = useState(true);
  const [totalNopbai, setTotalNopbai] = useState(0);
  let [totalLuotthi, setTotalLuotthi] = useState(0);
  let [cuocthi, setCuocthi] = useState(null);
  let [list, setList] = useState([]);
  const [openDialogEdit, setOpenDialogEdit] = useState({
    status: false,
    item: null,
  });

  const [fileName, setFileName] = useState("");
  const [dataKhongdat, setDataKhongdat] = useState(0);
  const [dataTrungbinh, setDataTrungbinh] = useState(0);
  const [dataKha, setDataKha] = useState(0);
  const [dataGioi, setDataGioi] = useState(0);
  const [dataXuatsac, setDataXuatsac] = useState(0);

  const [tungay, setTungay] = useState("");
  const [denngay, setDenngay] = useState("");
  const [xeploai, setXeploai] = useState("");
  const [hoten, setHoten] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [exporting, setExporting] = useState(false);

  const applyResponse = useCallback((res) => {
    const s = res.data.summary || {};
    setLink(`${API_SERVER}${id}`);
    setTotalNopbai(s.totalNopbai || 0);
    setDataKhongdat(s.khongdat || 0);
    setDataTrungbinh(s.trungbinh || 0);
    setDataKha(s.kha || 0);
    setDataGioi(s.gioi || 0);
    setDataXuatsac(s.xuatsac || 0);
    setTotalLuotthi(s.totalLuotthi ?? res.data.total ?? 0);
    setCuocthi(res.data.cuocthi);
    setList(res.data.data || []);
    setTotal(res.data.total || 0);
    setPage(Math.max(0, (res.data.page || 1) - 1));
    if (res.data.limit) setRowsPerPage(res.data.limit);
  }, [id]);

  const fetchKetqua = useCallback(async ({
    page: pageArg,
    limit: limitArg,
    tungay: tungayArg,
    denngay: denngayArg,
    xeploai: xeploaiArg,
    hoten: hotenArg,
    showLoading = true,
  } = {}) => {
    if (showLoading) setOpenModalLoading(true);
    try {
      const res = await monthiApi.getKetquaThi(id, {
        tungay: tungayArg ?? tungay,
        denngay: denngayArg ?? denngay,
        xeploai: xeploaiArg ?? xeploai,
        hoten: hotenArg ?? hoten,
        page: (pageArg ?? page) + 1,
        limit: limitArg ?? rowsPerPage,
      });
      applyResponse(res);
    } finally {
      if (showLoading) setOpenModalLoading(false);
    }
  }, [id, tungay, denngay, xeploai, hoten, page, rowsPerPage, applyResponse]);

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const res = await monthiApi.exportKetquaExcel(id, {
        tungay,
        denngay,
        xeploai,
        hoten,
      });
      const contentType = res.headers?.["content-type"] || "";
      if (contentType.includes("application/json")) {
        const text = await res.data.text();
        const parsed = JSON.parse(text);
        throw new Error(parsed.message || "Không xuất được file Excel");
      }
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe =
        (fileName || cuocthi?.tencuocthi || "export")
          .replace(/[^\w\-]+/g, "_")
          .slice(0, 60) || "export";
      a.download = `KetQuaThi_${safe}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err?.message || "Không xuất được file Excel", {
        variant: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleOpenDialogEdit = (item) => {
    setOpenDialogEdit({
      item,
      status: true,
    });
  };

  const handleCloseDialogEdit = () => {
    setOpenDialogEdit({
      ...openDialogEdit,
      status: false,
    });
  };

  useEffect(() => {
    const load = async () => {
      setOpenModalLoading(true);
      try {
        const res = await monthiApi.getKetquaThi(id, {
          tungay: "",
          denngay: "",
          xeploai: "",
          hoten: "",
          page: 1,
          limit: 20,
        });
        applyResponse(res);
      } finally {
        setOpenModalLoading(false);
      }
    };
    load();
  }, [id, applyResponse]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(0);
    await fetchKetqua({ page: 0 });
  };

  const handleChangePage = async (_event, newPage) => {
    setPage(newPage);
    await fetchKetqua({ page: newPage, showLoading: false });
  };

  const handleChangeRowsPerPage = async (event) => {
    const next = parseInt(event.target.value, 10);
    setRowsPerPage(next);
    setPage(0);
    await fetchKetqua({ page: 0, limit: next, showLoading: false });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

      <main className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="mb-2">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-100 p-1 rounded-lg text-blue-600">
                <DashboardIcon />
              </div>
              <div>
                <h3 className="text-md font-semibold text-slate-900 leading-tight">
                  Kết quả cuộc đánh giá: {cuocthi?.tencuocthi || 'Đang tải...'}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-center mb-2">
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <QRCodeComponent link={link} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">Link dự thi</p>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-hidden">
                    <a href={link} target='_blank' rel="noreferrer" className="text-blue-600 text-xs truncate flex-1">{link}</a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Câu hỏi</p>
                    <p className="text-xl font-bold text-slate-800">{cuocthi?.soluongcauhoi || 0}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                    <p className="text-[10px] font-bold text-green-600 uppercase">Thời gian</p>
                    <p className="text-xl font-bold text-slate-800">{cuocthi?.thoigianthi || 0}p</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <p className="text-[10px] font-bold text-orange-600 uppercase">Ngày thi</p>
                    <p className="text-lg font-bold text-slate-800">{dayjs(cuocthi?.ngaytochucthi).format('DD/MM/YY')}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Lượt thi</p>
                    <p className="text-xl font-bold text-slate-800 flex items-center justify-between">{totalLuotthi} <span className='font-normal italic text-green-700 text-[12px]'>{totalNopbai} lượt nộp bài</span></p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="text-lg font-bold mb-6 text-slate-800 border-b border-slate-50 pb-2">Thống kê xếp loại</h4>
              <div className="space-y-3">
                {[
                  { label: "Không đạt", value: dataKhongdat, color: "bg-red-500", light: "bg-red-50" },
                  { label: "Trung bình", value: dataTrungbinh, color: "bg-orange-500", light: "bg-orange-50" },
                  { label: "Khá", value: dataKha, color: "bg-blue-500", light: "bg-blue-50" },
                  { label: "Giỏi", value: dataGioi, color: "bg-green-600", light: "bg-green-50" },
                  { label: "Xuất sắc", value: dataXuatsac, color: "bg-yellow-500", light: "bg-yellow-50" },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${item.light} border border-transparent hover:border-slate-200 transition-all`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-1 h-8 rounded-full ${item.color}`}></div>
                      <span className="font-semibold text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-6 italic">
                * Lưu ý: Số liệu được cập nhật thời gian thực mỗi khi thí sinh hoàn thành bài thi.
              </p>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-slate-800">Biểu đồ phân bổ điểm</h4>
                <IconButton size="small"><DashboardIcon fontSize="small" /></IconButton>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-slate-400">Đang tải biểu đồ...</div>}>
                  <ChartResult
                    dataKhongdat={dataKhongdat}
                    dataTrungbinh={dataTrungbinh}
                    dataKha={dataKha}
                    dataGioi={dataGioi}
                    dataXuatsac={dataXuatsac}
                    total={totalNopbai}
                  />
                </Suspense>
              </div>
            </section>
          </div>

          <div>
            <TopCauHoiSai idCuocThi={id} />
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h4 className="text-[14px] text-slate-800 uppercase tracking-tight flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <DashboardIcon fontSize="small" />
                </span>
                Bảng xếp hạng kết quả kiểm tra
              </h4>
              <form onSubmit={(e) => handleSearch(e)}>
                <div className='flex md:items-center flex-col md:flex-row justify-between md:space-x-4 space-y-1'>
                  <div className='flex items-center justify-between space-x-2'>
                    <label className='text-[12px] font-semibold'>Họ tên</label>
                    <input type="text" value={hoten} onChange={(e) => setHoten(e.target.value)} className='outline-none border text-[12px] p-1 bg-gray-100' />
                  </div>
                  <div className='flex items-center justify-between space-x-2'>
                    <label className='text-[12px] font-semibold'>Từ ngày</label>
                    <input type="date" value={tungay} onChange={(e) => setTungay(e.target.value)} className='outline-none border text-[12px] p-1 bg-gray-100' />
                  </div>
                  <div className='flex items-center justify-between space-x-2'>
                    <label className='text-[12px] font-semibold'>Đến ngày</label>
                    <input type="date" value={denngay} onChange={(e) => setDenngay(e.target.value)} className='outline-none border text-[12px] p-1 bg-gray-100' />
                  </div>
                  <div className='flex items-center justify-between space-x-2'>
                    <label className='text-[12px] font-semibold'>Xếp loại</label>
                   
                   <select value={xeploai} onChange={(e)=>setXeploai(e.target.value)} className='outline-none border text-[12px] p-1 bg-gray-100'>
                      <option value="">Tất cả</option>
                      <option value="Xuất sắc">Xuất sắc</option>
                      <option value="Giỏi">Giỏi</option>
                      <option value="Khá">Khá</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Không đạt">Không đạt</option>
                   </select>
                  </div>
                  <IconButton type='submit'>
                    <SearchIcon />
                  </IconButton>
                </div>
              </form>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg pl-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-transparent border-none outline-none py-2 text-sm w-full md:w-48 placeholder:text-slate-400"
                  placeholder="Tên file excel..."
                />
                <Button
                  onClick={exportToExcel}
                  disabled={exporting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-none capitalize rounded-l-none px-4"
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                >
                  {exporting ? "Đang tải..." : "Tải Excel"}
                </Button>
              </div>
            </div>

            <div className="p-2">
              <CustomPaginationActionsTableKetquaThi
                list={list}
                cuocthi={cuocthi}
                total={total}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                item={openDialogEdit.item}
                onClickOpenDialogEdit={handleOpenDialogEdit}
              />
            </div>
          </section>
        </div>

      </main>

      {openModalLoading && <ModalLoading open={openModalLoading} />}
      <PreviewBaithi
        open={openDialogEdit.status}
        item={openDialogEdit.item}
        onCloseDialogPreviewBaithi={handleCloseDialogEdit}
        idBaithi={openDialogEdit.item?._id}

      />
    </div>
  );
};

export default KetquaThi;
