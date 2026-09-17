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
import PublicIcon from "@mui/icons-material/Public";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import c08Api from "../../api/c08Api";
import ModalLoading from "../../components/ModalLoading";
import {
  fmtUsd,
  fmtVnd,
  resolveVnd,
  USD_TO_VND,
} from "../../utils/aiCostFormat";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
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
  borderRadius: "12px",
  px: 3,
  py: 1.1,
  textTransform: "none",
  fontWeight: 700,
  boxShadow: "none",
  width: { xs: "100%", sm: "auto" },
};

const btnOutlineSx = {
  borderRadius: "12px",
  px: 3,
  py: 1.1,
  textTransform: "none",
  fontWeight: 700,
  borderColor: "#e2e8f0",
  color: "#334155",
  bgcolor: "#fff",
  boxShadow: "none",
  width: { xs: "100%", sm: "auto" },
  "&:hover": {
    borderColor: "#ab0000",
    bgcolor: "rgba(171,0,0,0.04)",
  },
};

const PAGE_SIZE = 20;

const AiChatToanquoc = () => {
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
  const [domainSummaries, setDomainSummaries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(qPage);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fetchReqIdRef = useRef(0);

  useEffect(() => {
    setFromDate(qFromDate);
    setToDate(qToDate);
    setSelectedIds(qIdsStr.split(",").filter(Boolean));
    setDomainFilter(qDomain);
    setPage(qPage);
  }, [qFromDate, qToDate, qIdsStr, qDomain, qPage]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await c08Api.getDiaphuongs();
        setDiaphuongs(res.data || []);
      } catch (error) {
        enqueueSnackbar(error.message || "Không tải được địa phương", {
          variant: "error",
        });
      }
    };
    load();
  }, [enqueueSnackbar]);

  const fetchData = useCallback(
    async (filters) => {
      setLoading(true);
      const reqId = ++fetchReqIdRef.current;
      try {
        const res = await c08Api.fetchAiChatToanquoc({
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          list: filters.list,
        });
        if (reqId !== fetchReqIdRef.current) return;
        setItems(res.data?.items || []);
        setListError(res.data?.listError || []);
        setDomainSummaries(res.data?.domainSummaries || []);
        setSummary(res.data?.summary || null);
      } catch (error) {
        if (reqId !== fetchReqIdRef.current) return;
        enqueueSnackbar(error.message || "Không tổng hợp được hỏi đáp AI", {
          variant: "error",
        });
        setItems([]);
        setListError([]);
        setDomainSummaries([]);
        setSummary(null);
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

  const domainOptions = useMemo(() => {
    const set = new Set();
    for (const row of items) {
      const v = row.diaphuongDomain || row.hostname || row.origin || "";
      if (v) set.add(v);
      if (row.diaphuongText) set.add(row.diaphuongText);
    }
    return Array.from(set).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const f = (domainFilter || "").trim().toLowerCase();
    if (!f) return items;
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
      return hay.includes(f);
    });
  }, [items, domainFilter]);

  const filteredDomainSummaries = useMemo(() => {
    const f = (domainFilter || "").trim().toLowerCase();
    if (!f) return domainSummaries;
    return domainSummaries.filter((ds) => {
      const hay = [ds.diaphuongText, ds.hostname, ds.domain]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(f);
    });
  }, [domainSummaries, domainFilter]);

  const handleChangeAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(diaphuongs.map((i) => String(i._id)));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggle = (id) => {
    const sid = String(id);
    setSelectedIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
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
    if (filteredItems.length === 0 && filteredDomainSummaries.length === 0) {
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
        "Câu hỏi": row.question || "",
        "Trả lời": row.answer || "",
        Nguồn: row.sourceType || "",
        Model: row.chatModel || "",
        "Prompt tokens": row.promptTokens || 0,
        "Completion tokens": row.completionTokens || 0,
        "Embed tokens": row.embeddingTokens || 0,
        "USD ước tính": row.estimatedUsd ?? 0,
        "VNĐ ước tính": resolveVnd(row),
        "Địa phương": row.diaphuongText || "",
        Domain: row.diaphuongDomain || row.hostname || row.origin || "",
      }));

      const costExport = filteredDomainSummaries.map((ds, index) => ({
        STT: index + 1,
        "Địa phương": ds.diaphuongText || "",
        Hostname: ds.hostname || "",
        Domain: ds.domain || "",
        "Số request": ds.requestCount || 0,
        "Prompt tokens": ds.promptTokens || 0,
        "Completion tokens": ds.completionTokens || 0,
        "Embed tokens": ds.embeddingTokens || 0,
        "USD ước tính": ds.estimatedUsd ?? 0,
        "VNĐ ước tính": resolveVnd(ds),
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(dataExport),
        "ChiTiet"
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(costExport),
        "ChiPhiTheoDomain"
      );
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAs(
        new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }),
        `AiChatToanQuoc_${dayjs().format("YYYYMMDD_HHmm")}.xlsx`
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
  const pagedItems = filteredItems.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE
  );

  const totalVnd = resolveVnd(summary || {});
  const rate = summary?.prices?.usdToVnd || USD_TO_VND;

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-['Be_Vietnam_Pro',sans-serif] pb-10">
      <ModalLoading open={loading} />
      <main className="p-3 sm:p-5 md:p-8 mx-auto space-y-4 sm:space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-[#ab0000] text-white flex items-center justify-center">
                <PublicIcon sx={{ fontSize: 22 }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ab0000]">
                  Tổng hợp toàn quốc
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  Hỏi đáp AI toàn quốc
                </h1>
                {/* <p className="text-slate-500 mt-1.5 text-sm leading-relaxed max-w-xl">
                  Kéo log từ domain địa phương. Phí = input + output + embedding tài liệu nội bộ
                  
                  · VNĐ (1 USD = {rate.toLocaleString("vi-VN")} ₫).
                </p> */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full lg:w-auto lg:min-w-[300px]">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Tổng chi phí
                </p>
                <p className="text-lg sm:text-xl font-bold tabular-nums text-slate-900 mt-1 break-all">
                  {fmtVnd(totalVnd)}
                </p>
                <p className="text-[11px] text-slate-400 tabular-nums mt-0.5">
                  {/* ${fmtUsd(summary?.estimatedUsd)} ·{" "} */}
                  {(
                    summary?.requestCount ?? filteredItems.length
                  ).toLocaleString("vi-VN")}{" "}
                  lượt
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Đã chọn
                </p>
                <p className="text-lg sm:text-xl font-bold tabular-nums text-slate-900 mt-1">
                  {selectedIds.length}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  / {diaphuongs.length} địa phương
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
            <FilterAltOutlinedIcon sx={{ fontSize: 18, color: "#ab0000" }} />
            <h2 className="text-sm font-bold text-slate-800">
              Chọn địa phương & khoảng ngày
            </h2>
          </div>
          <div className="p-4 sm:p-5">
            <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3 pb-3 border-b border-slate-200/80">
                  <label
                    htmlFor="ai-select-all"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      id="ai-select-all"
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
                  <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full px-2.5 py-1 w-fit">
                    {selectedIds.length}/{diaphuongs.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
                  {diaphuongs.map((i) => {
                    const checked = selectedIds.includes(String(i._id));
                    return (
                      <label
                        key={i._id}
                        htmlFor={`ai-dp-${i._id}`}
                        className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          checked
                            ? "bg-red-50 border-red-200"
                            : "bg-white border-transparent hover:border-slate-200"
                        }`}
                        title={i.text}
                      >
                        <input
                          id={`ai-dp-${i._id}`}
                          type="checkbox"
                          className="w-4 h-4 mt-0.5 rounded accent-[#ab0000] shrink-0"
                          checked={checked}
                          onChange={() => handleToggle(i._id)}
                        />
                        <span className="text-xs text-slate-700 leading-snug line-clamp-2">
                          {i.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
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
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
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
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Lọc địa phương / domain
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
                        placeholder="Gõ tên hoặc domain..."
                        sx={fieldSx}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                  disabled={exporting}
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
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-900">
            <div className="flex items-start gap-3">
              <WarningAmberRoundedIcon sx={{ color: "#d97706", mt: "1px", fontSize: 20 }} />
              <div className="min-w-0">
                <p className="font-semibold mb-1">
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
                  Domain lưu tới <code className="bg-amber-100 px-1 rounded">.../api</code>,
                  máy đích cần{" "}
                  <code className="bg-amber-100 px-1 rounded">/public/sumary/ai-chat</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredDomainSummaries.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800">
                Chi phí theo domain (VNĐ)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-sm">
                <thead>
                  <tr className="bg-[#fafbfc] text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    {[
                      "Địa phương",
                      "Hostname",
                      "Requests",
                      "Input",
                      "Output",
                      "Embed",
                      "Chi phí VNĐ",
                    ].map((h) => (
                      <th key={h} className="px-3 sm:px-4 py-3 font-bold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDomainSummaries.map((ds) => (
                    <tr
                      key={ds.diaphuongId || ds.hostname}
                      className="border-b border-slate-50 hover:bg-slate-50/80"
                    >
                      <td className="px-3 sm:px-4 py-3 font-medium text-slate-800">
                        {ds.diaphuongText}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-slate-500 break-all">
                        {ds.hostname}
                      </td>
                      <td className="px-3 sm:px-4 py-3 tabular-nums">
                        {(ds.requestCount || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 sm:px-4 py-3 tabular-nums">
                        {(ds.promptTokens || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 sm:px-4 py-3 tabular-nums">
                        {(ds.completionTokens || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 sm:px-4 py-3 tabular-nums">
                        {(ds.embeddingTokens || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <p className="tabular-nums font-bold text-slate-900">
                          {fmtVnd(resolveVnd(ds))}
                        </p>
                        {/* <p className="text-[11px] text-slate-400 tabular-nums">
                          ${fmtUsd(ds.estimatedUsd)}
                        </p> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-slate-100 text-sm text-slate-600 bg-slate-50">
            Hiển thị{" "}
            <span className="font-bold text-slate-900">{pagedItems.length}</span> /{" "}
            <span className="font-bold text-slate-900">
              {filteredItems.length.toLocaleString("vi-VN")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead>
                <tr className="bg-[#fafbfc] text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  {[
                    "Thời gian",
                    "Câu hỏi",
                    "Trả lời",
                    "Nguồn",
                    "Tokens",
                    "Chi phí VNĐ",
                    "Địa phương",
                    "Domain",
                  ].map((h) => (
                    <th key={h} className="px-3 sm:px-4 py-3 font-bold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!daChay ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center">
                      <InboxOutlinedIcon sx={{ fontSize: 36, color: "#cbd5e1" }} />
                      <p className="text-slate-400 mt-2 text-sm px-4">
                        Chọn địa phương, khoảng ngày rồi bấm Tổng hợp
                      </p>
                    </td>
                  </tr>
                ) : pagedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center text-slate-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  pagedItems.map((row, idx) => (
                    <tr
                      key={`${row._id || idx}-${row.createdAt}`}
                      className="border-b border-slate-50 align-top hover:bg-slate-50/80"
                    >
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-slate-600">
                        {row.createdAt
                          ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")
                          : ""}
                      </td>
                      <td className="px-3 sm:px-4 py-3 max-w-[180px]">
                        <p className="line-clamp-3">{row.question || ""}</p>
                      </td>
                      <td className="px-3 sm:px-4 py-3 max-w-[200px]">
                        <p className="line-clamp-3 text-slate-600">
                          {row.answer || ""}
                        </p>
                      </td>
                      <td className="px-3 sm:px-4 py-3">{row.sourceType || ""}</td>
                      <td className="px-3 sm:px-4 py-3 text-xs tabular-nums whitespace-nowrap text-slate-600">
                        <div>in {(row.promptTokens || 0).toLocaleString("vi-VN")}</div>
                        <div>out {(row.completionTokens || 0).toLocaleString("vi-VN")}</div>
                        <div>emb {(row.embeddingTokens || 0).toLocaleString("vi-VN")}</div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <p className="tabular-nums font-bold text-slate-900">
                          {fmtVnd(resolveVnd(row))}
                        </p>
                        {/* <p className="text-[11px] text-slate-400 tabular-nums">
                          ${fmtUsd(row.estimatedUsd)}
                        </p> */}
                      </td>
                      <td className="px-3 sm:px-4 py-3">{row.diaphuongText || ""}</td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-slate-500 break-all">
                        {row.diaphuongDomain || row.hostname || ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {daChay && filteredItems.length > 0 && (
            <TablePagination
              component="div"
              count={filteredItems.length}
              page={safePage}
              onPageChange={handleChangePage}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
              sx={{
                ".MuiTablePagination-toolbar": {
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                  gap: 1,
                  px: 1,
                },
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default AiChatToanquoc;
