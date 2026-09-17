import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { writeSearchParams } from "../../utils/searchParams";
import { useSnackbar } from "notistack";
import {
  Autocomplete,
  Button,
  TablePagination,
  TextField,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import FacebookIcon from "@mui/icons-material/Facebook";
import PublicIcon from "@mui/icons-material/Public";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import c08Api from "../../api/c08Api";
import ModalLoading from "../../components/ModalLoading";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "#fff",
    fontSize: "0.9rem",
    minHeight: 44,
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: "#cbd5e1" },
    "&.Mui-focused fieldset": { borderColor: "#ab0000", borderWidth: "1.5px" },
  },
};

const btnPrimarySx = {
  bgcolor: "#ab0000",
  "&:hover": { bgcolor: "#8e0000" },
  borderRadius: "14px",
  px: 3,
  py: 1.15,
  textTransform: "none",
  fontWeight: 700,
  boxShadow: "0 10px 24px rgba(171,0,0,0.18)",
};

const btnOutlineSx = {
  borderRadius: "14px",
  px: 3,
  py: 1.15,
  textTransform: "none",
  fontWeight: 700,
  borderColor: "#e2e8f0",
  color: "#334155",
  bgcolor: "#fff",
  "&:hover": {
    borderColor: "#ab0000",
    bgcolor: "rgba(171,0,0,0.04)",
  },
};

const PAGE_SIZE = 20;

const FanpageToanquoc = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const qFromDate = searchParams.get("fromDate") || "";
  const qToDate = searchParams.get("toDate") || "";
  const qIdsStr = searchParams.get("ids") || "";
  const qDomain = searchParams.get("domain") || "";
  const qPage = Math.max(0, Number(searchParams.get("page") || 0));
  const daChay = searchParams.get("run") === "1";

  const [fromDate, setFromDate] = useState(qFromDate);
  const [toDate, setToDate] = useState(qToDate);
  const [selectedIds, setSelectedIds] = useState(
    qIdsStr.split(",").filter(Boolean)
  );
  const [domainFilter, setDomainFilter] = useState(qDomain);
  const [diaphuongs, setDiaphuongs] = useState([]);
  const [items, setItems] = useState([]);
  const [listError, setListError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(qPage);
  const fetchReqIdRef = useRef(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await c08Api.getDiaphuongs();
        setDiaphuongs(res.data || []);
      } catch (error) {
        enqueueSnackbar(error.message || "Không tải được danh sách địa phương", {
          variant: "error",
        });
      }
    };
    load();
  }, [enqueueSnackbar]);

  useEffect(() => {
    setFromDate(qFromDate);
    setToDate(qToDate);
    setSelectedIds(qIdsStr.split(",").filter(Boolean));
    setDomainFilter(qDomain);
    setPage(qPage);
  }, [qFromDate, qToDate, qIdsStr, qDomain, qPage]);

  const fetchData = useCallback(
    async (filters) => {
      setLoading(true);
      const reqId = ++fetchReqIdRef.current;
      try {
        const res = await c08Api.fetchFanpageToanquoc({
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          list: filters.list,
        });
        if (reqId !== fetchReqIdRef.current) return;
        setItems(res.data?.items || []);
        setListError(res.data?.listError || []);
      } catch (error) {
        if (reqId !== fetchReqIdRef.current) return;
        enqueueSnackbar(error.message || "Không tổng hợp được fanpage", {
          variant: "error",
        });
        setItems([]);
        setListError([]);
      } finally {
        if (reqId === fetchReqIdRef.current) setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (!daChay) return;
    fetchData({
      fromDate: qFromDate,
      toDate: qToDate,
      list: qIdsStr.split(",").filter(Boolean),
    });
  }, [daChay, qFromDate, qToDate, qIdsStr, fetchData]);

  useEffect(() => {
    setPage(0);
  }, [domainFilter]);

  const domainOptions = useMemo(() => {
    const set = new Set();
    items.forEach((row) => {
      if (row.diaphuongText) set.add(row.diaphuongText);
      if (row.diaphuongDomain) set.add(row.diaphuongDomain);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "vi"));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!domainFilter) return items;
    const q = domainFilter.toLowerCase();
    return items.filter((row) => {
      const hay = [
        row.diaphuongText,
        row.diaphuongDomain,
        row.hostname,
        row.origin,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, domainFilter]);

  const pagedItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page]);

  const diaphuongCount = useMemo(() => {
    const set = new Set(
      filteredItems.map((r) => r.diaphuongText || r.diaphuongDomain).filter(Boolean)
    );
    return set.size;
  }, [filteredItems]);

  const handleChangeAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(diaphuongs.map((item) => String(item._id)));
    } else {
      setSelectedIds([]);
    }
  };

  const handleChangeCheckbox = (e) => {
    const id = String(e.target.value);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      enqueueSnackbar("Vui lòng chọn từ ngày và đến ngày", {
        variant: "warning",
      });
      return;
    }
    if (selectedIds.length === 0) {
      enqueueSnackbar("Vui lòng chọn ít nhất một địa phương", {
        variant: "warning",
      });
      return;
    }
    writeSearchParams(searchParams, setSearchParams, {
      fromDate,
      toDate,
      ids: selectedIds.join(","),
      domain: domainFilter,
      page: 0,
      run: "1",
    });
  };

  const handleChangePage = (_e, newPage) => {
    setPage(newPage);
    writeSearchParams(searchParams, setSearchParams, { page: newPage });
  };

  const exportExcel = async () => {
    if (filteredItems.length === 0) {
      enqueueSnackbar("Không có dữ liệu để xuất", { variant: "warning" });
      return;
    }
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const dataExport = filteredItems.map((row, index) => ({
        STT: index + 1,
        "Thời gian": row.createdAt
          ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm:ss")
          : "",
        "Họ tên": row.name || "",
        SĐT: row.donvi || "",
        "Năm sinh": row.birthday ?? "",
        "Tỉnh/TP": row.hokhau || "",
        "Xã/Phường": row.phone || "",
        "Giới tính": row.gioitinh || "",
        "Loại xe": row.loaixe || "",
        GPLX: row.hang_gplx || "",
        Nghề: row.nghenghiep || "",
        "Cuộc thi": row.tencuocthi || "",
        "Địa phương": row.diaphuongText || "",
        Domain: row.diaphuongDomain || row.hostname || row.origin || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataExport);
      worksheet["!cols"] = [
        { wch: 6 },
        { wch: 20 },
        { wch: 22 },
        { wch: 14 },
        { wch: 10 },
        { wch: 16 },
        { wch: 16 },
        { wch: 10 },
        { wch: 14 },
        { wch: 10 },
        { wch: 14 },
        { wch: 32 },
        { wch: 28 },
        { wch: 28 },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "FanpageToanQuoc");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAs(
        new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }),
        `FanpageToanQuoc_${dayjs().format("YYYYMMDD_HHmm")}.xlsx`
      );
    } catch (err) {
      enqueueSnackbar(err?.message || "Không xuất được Excel", {
        variant: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const safePage = Math.min(
    page,
    Math.max(0, Math.ceil(filteredItems.length / PAGE_SIZE) - 1 || 0)
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#eff6ff_0%,_#f7f9fb_42%,_#f1f5f9_100%)] font-['Be_Vietnam_Pro',sans-serif] pb-12">
      <ModalLoading open={loading} />
      <main className="p-4 md:p-8 mx-auto space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-blue-100/80 bg-white shadow-sm">
          <div className="absolute inset-y-0 right-0 w-1/2 max-w-md bg-[radial-gradient(circle_at_75%_15%,rgba(24,119,242,0.16),transparent_55%),radial-gradient(circle_at_50%_90%,rgba(171,0,0,0.07),transparent_50%)] pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-5 md:p-7">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1877F2] to-[#0b5ed7] text-white flex items-center justify-center shadow-lg shadow-blue-200">
                <PublicIcon />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1877F2]">
                  Tổng hợp toàn quốc
                </p>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                  Fanpage toàn quốc
                </h1>
                <p className="text-slate-500 mt-1.5 text-sm max-w-xl leading-relaxed">
                  Kéo danh sách lượt theo dõi fanpage từ các domain địa phương,
                  gộp theo thời gian ấn nút, lọc và xuất Excel.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-[#ab0000] to-[#7a0000] text-white px-5 py-3.5 shadow-xl shadow-red-200/50 min-w-[120px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/75">
                  Tổng lượt
                </p>
                <p className="text-2xl font-bold mt-0.5 tabular-nums">
                  {filteredItems.length.toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 px-5 py-3.5 min-w-[120px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Địa phương
                </p>
                <p className="text-2xl font-bold mt-0.5 tabular-nums text-slate-800">
                  {diaphuongCount}
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 px-5 py-3.5 min-w-[120px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Đã chọn
                </p>
                <p className="text-2xl font-bold mt-0.5 tabular-nums text-slate-800">
                  {selectedIds.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/90 backdrop-blur rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 md:px-6 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/70">
            <FilterAltOutlinedIcon sx={{ fontSize: 18, color: "#ab0000" }} />
            <h2 className="text-sm font-bold text-slate-800">
              Chọn địa phương & khoảng ngày
            </h2>
          </div>
          <div className="p-5 md:p-6 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80">
                <label
                  htmlFor="fp-select-all"
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer select-none"
                >
                  <input
                    id="fp-select-all"
                    type="checkbox"
                    className="w-4 h-4 rounded accent-[#ab0000] cursor-pointer"
                    checked={
                      diaphuongs.length > 0 &&
                      selectedIds.length === diaphuongs.length
                    }
                    onChange={handleChangeAll}
                  />
                  Chọn toàn quốc
                </label>
                <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full px-2.5 py-1">
                  {selectedIds.length}/{diaphuongs.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                {diaphuongs.map((i) => {
                  const checked = selectedIds.includes(String(i._id));
                  return (
                    <label
                      key={i._id}
                      htmlFor={`fp-dp-${i._id}`}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                        checked
                          ? "bg-red-50 border-red-200"
                          : "bg-white border-transparent hover:border-slate-200 hover:bg-white"
                      }`}
                      title={i.text}
                    >
                      <input
                        id={`fp-dp-${i._id}`}
                        type="checkbox"
                        className="w-4 h-4 rounded accent-[#ab0000] cursor-pointer shrink-0"
                        checked={checked}
                        value={String(i._id)}
                        onChange={handleChangeCheckbox}
                      />
                      <span className="text-sm text-slate-700 truncate">
                        {i.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-0.5">
                    Từ ngày
                  </label>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-0.5">
                    Đến ngày
                  </label>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-0.5">
                    Lọc địa phương / domain (sau khi đã kéo dữ liệu)
                  </label>
                  <Autocomplete
                    freeSolo
                    options={domainOptions}
                    value={domainFilter}
                    onChange={(_e, v) => setDomainFilter(v || "")}
                    onInputChange={(_e, v, reason) => {
                      if (reason === "input" || reason === "clear") {
                        setDomainFilter(v || "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Gõ tên địa phương hoặc domain..."
                        sx={fieldSx}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SearchIcon />}
                  sx={btnPrimarySx}
                >
                  Tổng hợp
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  disabled={exporting || filteredItems.length === 0}
                  onClick={exportExcel}
                  sx={btnOutlineSx}
                >
                  {exporting ? "Đang xuất..." : "Xuất Excel"}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {listError.length > 0 && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/90 px-5 py-4 text-sm text-amber-900 shadow-sm">
            <div className="flex items-start gap-3">
              <WarningAmberRoundedIcon sx={{ color: "#d97706", mt: "1px" }} />
              <div>
                <p className="font-bold mb-1">
                  {listError.length} địa phương không lấy được dữ liệu
                </p>
                <ul className="list-disc pl-5 space-y-1 text-amber-800/90">
                  {listError.map((err) => (
                    <li key={`${err.text}-${err.domain}`} className="break-all">
                      <span className="font-medium">{err.text}</span>
                      {err.error ? ` — ${err.error}` : ""}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-amber-800/80">
                  Gợi ý: trong Quản lý domain chỉ lưu tới{" "}
                  <code className="bg-amber-100 px-1 rounded">.../api</code>{" "}
                  (vd. https://tenmien.vn/api). Backend tự gọi{" "}
                  <code className="bg-amber-100 px-1 rounded">
                    /public/sumary/fanpage
                  </code>
                  . Máy đích cần đã deploy API này.
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 md:px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
            <p className="text-sm text-slate-600">
              Hiển thị{" "}
              <span className="font-bold text-slate-900">
                {pagedItems.length}
              </span>{" "}
              /{" "}
              <span className="font-bold text-slate-900">
                {filteredItems.length.toLocaleString("vi-VN")}
              </span>{" "}
              lượt
              <span className="text-slate-400">
                {" "}
                · đã gộp {items.length.toLocaleString("vi-VN")}
              </span>
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1877F2] bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
              <FacebookIcon sx={{ fontSize: 14 }} />
              Sort theo thời gian ấn nút
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#fafbfc] text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  {[
                    "Thời gian",
                    "Họ tên",
                    "SĐT",
                    "Năm sinh",
                    "Tỉnh/TP",
                    "Xã/Phường",
                    "Giới tính",
                    "Loại xe",
                    "GPLX",
                    "Nghề",
                    "Cuộc thi",
                    "Địa phương",
                    "Domain",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 font-bold whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!daChay ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-20 text-center">
                      <div className="inline-flex flex-col items-center gap-2 text-slate-400">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1877F2] flex items-center justify-center">
                          <PublicIcon />
                        </div>
                        <p className="text-base font-semibold text-slate-600">
                          Chưa tổng hợp dữ liệu
                        </p>
                        <p className="text-sm max-w-sm">
                          Chọn địa phương, khoảng ngày rồi bấm Tổng hợp.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : pagedItems.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-20 text-center">
                      <div className="inline-flex flex-col items-center gap-2 text-slate-400">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <InboxOutlinedIcon sx={{ fontSize: 28 }} />
                        </div>
                        <p className="text-base font-semibold text-slate-600">
                          Không có dữ liệu
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedItems.map((row, idx) => (
                    <tr
                      key={
                        row._id ||
                        `${row.diaphuongId}-${row.createdAt}-${idx}`
                      }
                      className="border-t border-slate-100 hover:bg-[#f8fbff] transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                        {row.createdAt
                          ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")
                          : ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                        {row.name || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                        {row.donvi || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.birthday ?? ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.hokhau || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.phone || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.gioitinh || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.loaixe || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.hang_gplx || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.nghenghiep || ""}
                      </td>
                      <td className="px-4 py-3 min-w-[160px]">
                        {row.tencuocthi || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.diaphuongText && (
                          <span className="inline-flex text-[11px] font-semibold text-[#ab0000] bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
                            {row.diaphuongText}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(row.diaphuongDomain || row.hostname) && (
                          <span className="inline-flex text-[11px] font-medium text-[#1877F2] bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">
                            {row.diaphuongDomain || row.hostname}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/40">
            <TablePagination
              component="div"
              count={filteredItems.length}
              page={safePage}
              onPageChange={handleChangePage}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
              labelRowsPerPage="Mỗi trang"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} / ${count !== -1 ? count : `hơn ${to}`}`
              }
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default FanpageToanquoc;
