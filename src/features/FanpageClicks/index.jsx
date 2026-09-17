import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { writeSearchParams } from "../../utils/searchParams";
import { useSnackbar } from "notistack";
import {
  Autocomplete,
  Button,
  CircularProgress,
  TablePagination,
  TextField,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import FacebookIcon from "@mui/icons-material/Facebook";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import dayjs from "dayjs";
import monthiApi from "../../api/monthiApi";
import ModalLoading from "../../components/ModalLoading";

const CUOCTHI_OPTION_LIMIT = 30;
const CUOCTHI_SEARCH_DEBOUNCE_MS = 300;

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

const FanpageClicks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const qFromDate = searchParams.get("fromDate") || "";
  const qToDate = searchParams.get("toDate") || "";
  const qName = searchParams.get("name") || "";
  const qCuocthi = searchParams.get("cuocthi") || "";
  const qPage = Math.max(0, Number(searchParams.get("page") || 0));

  const [fromDate, setFromDate] = useState(qFromDate);
  const [toDate, setToDate] = useState(qToDate);
  const [name, setName] = useState(qName);
  const [cuocthi, setCuocthi] = useState(qCuocthi);
  const [selectedCuocthi, setSelectedCuocthi] = useState(null);
  const [cuocthiOptions, setCuocthiOptions] = useState([]);
  const [cuocthiInput, setCuocthiInput] = useState("");
  const [cuocthiLoading, setCuocthiLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(qPage);
  const [tongbanghi, setTongbanghi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const cuocthiReqIdRef = useRef(0);
  const cuocthiDebounceRef = useRef(null);
  const cuocthiCachedEmptyRef = useRef(null);

  const handleAuthError = useCallback(
    (message) => {
      if (
        message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
      }
    },
    [navigate]
  );

  const searchCuocthiOptions = useCallback(
    async (q, { includeSelectedId } = {}) => {
      const reqId = ++cuocthiReqIdRef.current;
      setCuocthiLoading(true);
      try {
        const params = { q: q || "", limit: CUOCTHI_OPTION_LIMIT };
        if (includeSelectedId) params.id = includeSelectedId;
        const res = await monthiApi.listFanpageCuocthiOptions(params);
        if (reqId !== cuocthiReqIdRef.current) return;
        const items = res.data.items || [];
        setCuocthiOptions(items);
        if (!q && !includeSelectedId) {
          cuocthiCachedEmptyRef.current = items;
        }
        return items;
      } catch (error) {
        if (reqId !== cuocthiReqIdRef.current) return;
        const message = error.message || "Không tải được danh sách cuộc thi";
        handleAuthError(message);
        enqueueSnackbar(message, {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
        });
        return [];
      } finally {
        if (reqId === cuocthiReqIdRef.current) setCuocthiLoading(false);
      }
    },
    [enqueueSnackbar, handleAuthError]
  );

  useEffect(() => {
    setFromDate(qFromDate);
    setToDate(qToDate);
    setName(qName);
    setCuocthi(qCuocthi);
    setPage(qPage);
  }, [qFromDate, qToDate, qName, qCuocthi, qPage]);

  // Khôi phục option đã chọn từ URL (không load cả list)
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      if (!qCuocthi) {
        setSelectedCuocthi(null);
        setCuocthiInput("");
        return;
      }
      if (
        selectedCuocthi &&
        String(selectedCuocthi._id) === String(qCuocthi)
      ) {
        return;
      }
      try {
        const res = await monthiApi.listFanpageCuocthiOptions({
          id: qCuocthi,
          hydrateOnly: 1,
        });
        if (cancelled) return;
        const item = (res.data.items || []).find(
          (o) => String(o._id) === String(qCuocthi)
        );
        if (item) {
          setSelectedCuocthi(item);
          setCuocthiInput(item.tencuocthi || "");
          setCuocthiOptions((prev) => {
            if (prev.some((o) => String(o._id) === String(item._id))) return prev;
            return [item, ...prev];
          });
        } else {
          setSelectedCuocthi(null);
        }
      } catch (_) {
        if (!cancelled) setSelectedCuocthi(null);
      }
    };
    hydrate();
    return () => {
      cancelled = true;
    };
    // chỉ phụ thuộc id trên URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qCuocthi]);

  useEffect(() => {
    return () => {
      if (cuocthiDebounceRef.current) clearTimeout(cuocthiDebounceRef.current);
    };
  }, []);

  const scheduleCuocthiSearch = useCallback(
    (q) => {
      if (cuocthiDebounceRef.current) clearTimeout(cuocthiDebounceRef.current);
      cuocthiDebounceRef.current = setTimeout(() => {
        searchCuocthiOptions(q);
      }, CUOCTHI_SEARCH_DEBOUNCE_MS);
    },
    [searchCuocthiOptions]
  );

  const fetchList = useCallback(
    async (filters) => {
      setLoading(true);
      try {
        const res = await monthiApi.listFanpageClicks({
          fromDate: filters.fromDate || "",
          toDate: filters.toDate || "",
          name: filters.name || "",
          cuocthi: filters.cuocthi || "",
          page: (filters.page ?? 0) + 1,
        });
        setItems(res.data.items || []);
        setTongbanghi(res.data.tongbanghi || 0);
        setPage(Math.max(0, (res.data.page || 1) - 1));
      } catch (error) {
        const message = error.message || "Không tải được danh sách";
        if (
          message ===
          "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
        ) {
          navigate("/login");
        }
        enqueueSnackbar(message, {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
        });
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
      name: qName,
      cuocthi: qCuocthi,
      page: qPage,
    });
  }, [qFromDate, qToDate, qName, qCuocthi, qPage, fetchList]);

  const handleSearch = (e) => {
    e.preventDefault();
    writeSearchParams(searchParams, setSearchParams, {
      fromDate,
      toDate,
      name,
      cuocthi,
      page: 0,
    });
  };

  const handleChangePage = (_event, newPage) => {
    writeSearchParams(searchParams, setSearchParams, { page: newPage });
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const res = await monthiApi.exportFanpageClicksExcel({
        fromDate: qFromDate,
        toDate: qToDate,
        name: qName,
        cuocthi: qCuocthi,
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
      a.download = `FanpageClicks_${dayjs().format("YYYYMMDD_HHmm")}.xlsx`;
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#fff5f5_0%,_#f7f9fb_45%,_#f1f5f9_100%)] font-['Be_Vietnam_Pro',sans-serif]">
      <ModalLoading open={loading} />
      <main className="p-4 md:p-8  mx-auto space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-red-100/80 bg-white shadow-sm">
          <div className="absolute inset-y-0 right-0 w-1/2 max-w-md bg-[radial-gradient(circle_at_80%_20%,rgba(24,119,242,0.12),transparent_55%),radial-gradient(circle_at_60%_80%,rgba(171,0,0,0.08),transparent_50%)] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 p-5 md:p-7">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-lg shadow-blue-200">
                <FacebookIcon />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#ab0000]">
                  Quản trị fanpage
                </p>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                  Lượt theo dõi fanpage
                </h1>
                <p className="text-slate-500 mt-1.5 text-sm max-w-xl leading-relaxed">
                  Theo dõi thí sinh bấm theo dõi fanpage sau khi hoàn thành bài
                  thi trong phạm vi cuộc thi được phân quyền.
                </p>
              </div>
            </div>
            <div className="shrink-0 rounded-2xl bg-gradient-to-br from-[#ab0000] to-[#7a0000] text-white px-6 py-4 shadow-xl shadow-red-200/60 min-w-[148px]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/75">
                Tổng lượt
              </p>
              <p className="text-3xl font-bold mt-1 tabular-nums tracking-tight">
                {tongbanghi.toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white/90 backdrop-blur rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 md:px-6 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/70">
            <FilterAltOutlinedIcon sx={{ fontSize: 18, color: "#ab0000" }} />
            <h2 className="text-sm font-bold text-slate-800">Bộ lọc tìm kiếm</h2>
          </div>
          <form className="p-5 md:p-6 space-y-5" onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-0.5">
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
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-0.5">
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
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-0.5">
                  Họ tên thí sinh
                </label>
                <TextField
                  size="small"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên để tìm..."
                  sx={fieldSx}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-0.5">
                  Cuộc thi
                </label>
                <Autocomplete
                  options={cuocthiOptions}
                  value={selectedCuocthi}
                  inputValue={cuocthiInput}
                  loading={cuocthiLoading}
                  filterOptions={(x) => x}
                  onOpen={() => {
                    if (cuocthiCachedEmptyRef.current && !cuocthiInput.trim()) {
                      setCuocthiOptions(cuocthiCachedEmptyRef.current);
                      return;
                    }
                    searchCuocthiOptions(cuocthiInput.trim(), {
                      includeSelectedId: cuocthi || undefined,
                    });
                  }}
                  onChange={(_e, value) => {
                    setSelectedCuocthi(value);
                    setCuocthi(value?._id || "");
                    setCuocthiInput(value?.tencuocthi || "");
                  }}
                  onInputChange={(_e, value, reason) => {
                    if (reason === "reset") return;
                    setCuocthiInput(value);
                    if (reason === "clear") {
                      setSelectedCuocthi(null);
                      setCuocthi("");
                      searchCuocthiOptions("");
                      return;
                    }
                    if (reason === "input") {
                      scheduleCuocthiSearch(value.trim());
                    }
                  }}
                  getOptionLabel={(option) => option?.tencuocthi || ""}
                  isOptionEqualToValue={(a, b) =>
                    String(a?._id) === String(b?._id)
                  }
                  clearOnEscape
                  noOptionsText={
                    cuocthiLoading
                      ? "Đang tìm..."
                      : cuocthiInput.trim()
                        ? "Không tìm thấy cuộc thi"
                        : "Gõ tên để tìm cuộc thi"
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Gõ tên cuộc thi để tìm..."
                      sx={fieldSx}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {cuocthiLoading ? (
                              <CircularProgress color="inherit" size={18} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  ListboxProps={{ style: { maxHeight: 280 } }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
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
              {selectedCuocthi && (
                <span className="inline-flex items-center gap-1.5 text-xs text-[#ab0000] bg-red-50 border border-red-100 rounded-full px-3 py-1.5 max-w-full truncate">
                  <span className="opacity-70">Đang lọc</span>
                  <span className="font-semibold truncate">
                    {selectedCuocthi.tencuocthi}
                  </span>
                </span>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 md:px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
            <p className="text-sm text-slate-600">
              Hiển thị{" "}
              <span className="font-bold text-slate-900">{items.length}</span> /{" "}
              <span className="font-bold text-slate-900">
                {tongbanghi.toLocaleString("vi-VN")}
              </span>{" "}
              lượt
            </p>
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
                    "Tỉnh / TP",
                    "Xã / Phường",
                    "Giới tính",
                    "Loại xe",
                    "GPLX",
                    "Nghề",
                    "Cuộc thi",
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
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-20 text-center">
                      <div className="inline-flex flex-col items-center gap-2 text-slate-400">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <InboxOutlinedIcon sx={{ fontSize: 28 }} />
                        </div>
                        <p className="text-base font-semibold text-slate-600">
                          Không có dữ liệu
                        </p>
                        <p className="text-sm max-w-sm">
                          Thử đổi bộ lọc ngày, tên hoặc cuộc thi rồi tìm lại.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr
                      key={row._id}
                      className="border-t border-slate-100 hover:bg-[#fff8f8] transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                        {row.createdAt
                          ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")
                          : ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                        {row.name || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap tabular-nums text-slate-700">
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
                      <td className="px-4 py-3 min-w-[180px] text-slate-700">
                        {row.tencuocthi || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(row.hostname || row.origin) && (
                          <span className="inline-flex text-[11px] font-medium text-[#1877F2] bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">
                            {row.hostname || row.origin}
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
              count={tongbanghi}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={20}
              rowsPerPageOptions={[20]}
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

export default FanpageClicks;
