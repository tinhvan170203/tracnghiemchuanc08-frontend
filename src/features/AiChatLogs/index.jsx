import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { writeSearchParams } from "../../utils/searchParams";
import { useSnackbar } from "notistack";
import { Button, TablePagination, TextField } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import dayjs from "dayjs";
import monthiApi from "../../api/monthiApi";
import ModalLoading from "../../components/ModalLoading";
import { formatAiSourceType } from "../../utils/aiSourceType";

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

const AiChatLogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const qFromDate = searchParams.get("fromDate") || "";
  const qToDate = searchParams.get("toDate") || "";
  const qQ = searchParams.get("q") || "";
  const qHostname = searchParams.get("hostname") || "";
  const qPage = Math.max(0, Number(searchParams.get("page") || 0));

  const [fromDate, setFromDate] = useState(qFromDate);
  const [toDate, setToDate] = useState(qToDate);
  const [q, setQ] = useState(qQ);
  const [hostname, setHostname] = useState(qHostname);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(qPage);
  const [tongbanghi, setTongbanghi] = useState(0);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setFromDate(qFromDate);
    setToDate(qToDate);
    setQ(qQ);
    setHostname(qHostname);
    setPage(qPage);
  }, [qFromDate, qToDate, qQ, qHostname, qPage]);

  const fetchList = useCallback(
    async (filters) => {
      setLoading(true);
      try {
        const res = await monthiApi.listAiChatLogs({
          fromDate: filters.fromDate || "",
          toDate: filters.toDate || "",
          q: filters.q || "",
          hostname: filters.hostname || "",
          page: (filters.page ?? 0) + 1,
        });
        setItems(res.data.items || []);
        setTongbanghi(res.data.tongbanghi || 0);
        setSummary(res.data.summary || null);
        setPage(Math.max(0, (res.data.page || 1) - 1));
      } catch (error) {
        const message = error.message || "Không tải được danh sách";
        if (
          message ===
          "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
        ) {
          navigate("/login");
        }
        enqueueSnackbar(message, { variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [navigate, enqueueSnackbar]
  );

  useEffect(() => {
    fetchList({
      fromDate: qFromDate,
      toDate: qToDate,
      q: qQ,
      hostname: qHostname,
      page: qPage,
    });
  }, [qFromDate, qToDate, qQ, qHostname, qPage, fetchList]);

  const handleSearch = (e) => {
    e.preventDefault();
    writeSearchParams(searchParams, setSearchParams, {
      fromDate,
      toDate,
      q,
      hostname,
      page: 0,
    });
  };

  const handleChangePage = (_event, newPage) => {
    writeSearchParams(searchParams, setSearchParams, { page: newPage });
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const res = await monthiApi.exportAiChatLogsExcel({
        fromDate: qFromDate,
        toDate: qToDate,
        q: qQ,
        hostname: qHostname,
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
      a.download = `AiChatLogs_${dayjs().format("YYYYMMDD_HHmm")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      enqueueSnackbar(err?.message || "Không xuất được file Excel", {
        variant: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-['Be_Vietnam_Pro',sans-serif]">
      <ModalLoading open={loading} />
      <main className="p-3 sm:p-5 md:p-8 mx-auto space-y-4 sm:space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-[#ab0000] text-white flex items-center justify-center">
                <SmartToyIcon sx={{ fontSize: 22 }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ab0000]">
                  Quản trị hỏi đáp AI từ người dùng
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  Hỏi đáp AI
                </h1>
                <p className="text-slate-500 mt-1.5 text-sm leading-relaxed">
                  Theo dõi Q&amp;A và token (input + output + embedding).
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[140px]">
              <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Tổng lượt
                </p>
                <p className="text-lg sm:text-xl font-bold tabular-nums text-slate-900 mt-1">
                  {(summary?.requestCount ?? tongbanghi).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {summary && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {[
              ["Input", summary.promptTokens],
              ["Output", summary.completionTokens],
              ["Embedding", summary.embeddingTokens],
              ["Chat tokens", summary.totalTokens],
            ].map(([label, val]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {label}
                </p>
                <p className="text-base sm:text-lg font-bold tabular-nums text-slate-800 mt-1">
                  {Number(val || 0).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
            <FilterAltOutlinedIcon sx={{ fontSize: 18, color: "#ab0000" }} />
            <h2 className="text-sm font-bold text-slate-800">Bộ lọc</h2>
          </div>
          <form onSubmit={handleSearch} className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Từ ngày
                </label>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
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
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Câu hỏi
                </label>
                <TextField
                  size="small"
                  fullWidth
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm trong câu hỏi..."
                  sx={fieldSx}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Hostname
                </label>
                <TextField
                  size="small"
                  fullWidth
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  placeholder="vd: tenmien.vn"
                  sx={fieldSx}
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
                Tìm kiếm
              </Button>
              <Button
                type="button"
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                disabled={exporting}
                onClick={exportToExcel}
                sx={btnOutlineSx}
              >
                {exporting ? "Đang xuất..." : "Xuất Excel"}
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-slate-100 text-sm text-slate-600 bg-slate-50">
            Chi tiết hỏi đáp
          </div>
          <div className="overflow-x-auto -mx-0">
            <table className="min-w-[860px] w-full text-sm">
              <thead>
                <tr className="bg-[#fafbfc] text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  {[
                    "Thời gian",
                    "Câu hỏi",
                    "Trả lời",
                    "Nguồn",
                    "Model",
                    "Tokens",
                    "Hostname",
                  ].map((h) => (
                    <th key={h} className="px-3 sm:px-4 py-3 font-bold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center">
                      <InboxOutlinedIcon sx={{ fontSize: 36, color: "#cbd5e1" }} />
                      <p className="text-slate-400 mt-2 text-sm">
                        Chưa có dữ liệu trong bộ lọc này
                      </p>
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr
                      key={row._id}
                      className="border-b border-slate-50 hover:bg-slate-50/80 align-top"
                    >
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-slate-600">
                        {row.createdAt
                          ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")
                          : ""}
                      </td>
                      <td className="px-3 sm:px-4 py-3 max-w-[200px]">
                        <p className="line-clamp-3 text-slate-800">
                          {row.question || ""}
                        </p>
                      </td>
                      <td className="px-3 sm:px-4 py-3 max-w-[240px]">
                        <p className="line-clamp-3 text-slate-600">
                          {row.answer || ""}
                        </p>
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-slate-600">
                        {formatAiSourceType(row.sourceType)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                        {row.chatModel || ""}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs tabular-nums text-slate-600">
                        <div>in {(row.promptTokens || 0).toLocaleString("vi-VN")}</div>
                        <div>out {(row.completionTokens || 0).toLocaleString("vi-VN")}</div>
                        <div>emb {(row.embeddingTokens || 0).toLocaleString("vi-VN")}</div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                        {row.hostname || ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            component="div"
            count={tongbanghi}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={20}
            rowsPerPageOptions={[20]}
            labelRowsPerPage="Số dòng"
            sx={{
              ".MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                justifyContent: "flex-end",
                gap: 1,
                px: 1,
              },
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default AiChatLogs;
