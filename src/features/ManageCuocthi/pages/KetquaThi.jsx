import React, { lazy, Suspense, useEffect, useState } from 'react';
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

const ChartResult = lazy(() => import('../components/ChartResult'));

const KetquaThi = () => {
  let { id } = useParams();
  const [link, setLink] = useState('');
  const [openModalLoading, setOpenModalLoading] = useState(true);
  const [excelData, setExcelData] = useState([]);
  const [totalNopbai, setTotalNopbai] = useState(0);
  let [totalLuotthi, setTotalLuotthi] = useState(0);
  let [cuocthi, setCuocthi] = useState(null);
  let [list, setList] = useState([]);
  let [listBase, setListBase] = useState([]);
  const [openDialogEdit, setOpenDialogEdit] = useState({
    status: false,
    item: null,
  });

  const [name, setName] = useState("");
  const [dataKhongdat, setDataKhongdat] = useState(0);
  const [dataTrungbinh, setDataTrungbinh] = useState(0);
  const [dataKha, setDataKha] = useState(0);
  const [dataGioi, setDataGioi] = useState(0);
  const [dataXuatsac, setDataXuatsac] = useState(0);

  const [tungay, setTungay] = useState("")
  const [denngay, setDenngay] = useState("")

  const exportToExcel = async () => {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "KetQua");
    XLSX.writeFile(workbook, `KetQuaThi_${name}.xlsx`);
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
    const getKetquaThi = async () => {
      let [res] = await Promise.all([
        monthiApi.getKetquaThi(id, { tungay: "", denngay: "" }),
        // monthiApi.thongkeCauhoiSai({idCuocthi: id})
      ]);

      // console.log(res1)
      const data = res.data.data;
      const cauHoiCount = res.data.cuocthi.soluongcauhoi;
      let khongDat = 0, trungBinh = 0, kha = 0, gioi = 0, xuatSac = 0, nopBai = 0;

      data.forEach(item => {
        if (item.time > 0) {
          nopBai++;
          const ratio = item.socaudung / cauHoiCount;
          if (ratio < 0.5) khongDat++;
          else if (ratio < 0.7) trungBinh++;
          else if (ratio < 0.8) kha++;
          else if (ratio < 0.9) gioi++;
          else xuatSac++;
        }
      });

      setLink(`${API_SERVER}${id}`);
      setTotalNopbai(nopBai);
      setDataKhongdat(khongDat);
      setDataTrungbinh(trungBinh);
      setDataKha(kha);
      setDataGioi(gioi);
      setDataXuatsac(xuatSac);
      setTotalLuotthi(res.data.total);
      setCuocthi(res.data.cuocthi);
      setList(res.data.data);
      setListBase(res.data.data);
      setOpenModalLoading(false);
      setExcelData(res.data.data.map(item => ({
        xephang: item.rank,
        hoten: item.thongtinthisinh.name,
        ngaysinh: item.thongtinthisinh.birthday,
        donvi: item.thongtinthisinh.phone,
        phone: item.thongtinthisinh.donvi,
        socaudung: item.socaudung,
        thoigianhoanthanh: item.time < 0 ? "" : item.time
      })));
    };

    getKetquaThi();
  }, [id]);

  const handleSearch = async (e) => {
    e.preventDefault();
    let res = await monthiApi.getKetquaThi(id, { tungay, denngay });
    const data = res.data.data;
    const cauHoiCount = res.data.cuocthi.soluongcauhoi;
    let khongDat = 0, trungBinh = 0, kha = 0, gioi = 0, xuatSac = 0, nopBai = 0;

    data.forEach(item => {
      if (item.time > 0) {
        nopBai++;
        const ratio = item.socaudung / cauHoiCount;
        if (ratio < 0.5) khongDat++;
        else if (ratio < 0.7) trungBinh++;
        else if (ratio < 0.8) kha++;
        else if (ratio < 0.9) gioi++;
        else xuatSac++;
      }
    });

    // setLink(`${API_SERVER}${id}`);
    setTotalNopbai(nopBai);
    setDataKhongdat(khongDat);
    setDataTrungbinh(trungBinh);
    setDataKha(kha);
    setDataGioi(gioi);
    setDataXuatsac(xuatSac);
    setTotalLuotthi(res.data.total);
    // setCuocthi(res.data.cuocthi);
    setList(res.data.data);
    setListBase(res.data.data);
    setOpenModalLoading(false);
    setExcelData(res.data.data.map(item => ({
      xephang: item.rank,
      hoten: item.thongtinthisinh.name,
      ngaysinh: item.thongtinthisinh.birthday,
      donvi: item.thongtinthisinh.phone,
      phone: item.thongtinthisinh.donvi,
      socaudung: item.socaudung,
      thoigianhoanthanh: item.time < 0 ? "" : item.time
    })));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

      <main className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Title & Badge */}
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

          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
            {/* Exam Info Card */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              {/* <h4 className="text-lg font-bold mb-6 text-slate-800 border-b border-slate-50 pb-2">Thông tin kỳ thi</h4> */}
              <div className="flex justify-center mb-2">
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <QRCodeComponent link={link} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">Link dự thi</p>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-hidden">
                    <a href={link} target='_blank' className="text-blue-600 text-xs truncate flex-1">{link}</a>
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
                    <p className="text-xl font-bold text-slate-800 flex items-center justify-between">{totalLuotthi} <span className='font-normal italic text-green-700 text-[12px]'>{list.length} luợt nộp bài</span></p>
                  </div>
                </div>
              </div>
            </section>

            {/* Statistics Card */}
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

            {/* Chart Card */}
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

          {/* Data Table Section */}
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
                    <label className='text-[12px] font-semibold'>Từ ngày</label>
                    <input type="date" value={tungay} onChange={(e) => setTungay(e.target.value)} required className='outline-none border text-[12px] p-1 bg-gray-100' />
                  </div>
                  <div className='flex items-center justify-between space-x-2'>
                    <label className='text-[12px] font-semibold'>Đến ngày</label>
                    <input type="date" required value={denngay} onChange={(e) => setDenngay(e.target.value)} className='outline-none border text-[12px] p-1 bg-gray-100' />
                  </div>
                  <IconButton type='submit'>
                    <SearchIcon />
                  </IconButton>
                </div>
              </form>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg pl-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-none outline-none py-2 text-sm w-full md:w-48 placeholder:text-slate-400"
                  placeholder="Tên file excel..."
                />
                <Button
                  onClick={exportToExcel}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-none capitalize rounded-l-none px-4"
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                >
                  Tải Excel
                </Button>
              </div>
            </div>

            <div className="p-2">
              <CustomPaginationActionsTableKetquaThi
                list={list}
                cuocthi={cuocthi}
                item={openDialogEdit.item}
                onClickOpenDialogEdit={handleOpenDialogEdit}
              />
            </div>
          </section>
        </div>

      </main>

      {/* Modals & Loading */}
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