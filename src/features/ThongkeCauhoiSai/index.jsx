import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import monthiApi from "../../api/monthiApi";
import ModalLoading from "../../components/ModalLoading";
import TheCauHoiSai from "../ManageCuocthi/components/TheCauHoiSai";
import { writeSearchParams } from "../../utils/searchParams";
import CreatorAccountAutocomplete from "../../components/CreatorAccountAutocomplete";

const ThongkeCauhoiSai = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromDate = searchParams.get("fromDate") || "";
  const qToDate = searchParams.get("toDate") || "";
  const qMonthi = searchParams.get("monthi") || "";
  const qChuyende = searchParams.get("chuyende") || "";
  const qCreatorIds = searchParams.get("creatorIds") || "";
  const daThongke = searchParams.get("run") === "1";
  const [fromDate, setFromDate] = useState(qFromDate);
  const [toDate, setToDate] = useState(qToDate);
  const [monthi, setMonthi] = useState(qMonthi);
  const [chuyende, setChuyende] = useState(qChuyende);
  const [creatorIds, setCreatorIds] = useState(qCreatorIds);
  const [monthiList, setMonthiList] = useState([]);
  const [chuyendeList, setChuyendeList] = useState([]);
  const [creatorOptions, setCreatorOptions] = useState([]);
  const [isContestSuperAdmin, setIsContestSuperAdmin] = useState(false);
  const [scopeReady, setScopeReady] = useState(false);
  const [items, setItems] = useState([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [loi, setLoi] = useState(null);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFromDate(qFromDate);
    setToDate(qToDate);
    setMonthi(qMonthi);
    setChuyende(qChuyende);
    setCreatorIds(qCreatorIds);
  }, [qFromDate, qToDate, qMonthi, qChuyende, qCreatorIds]);

  useEffect(() => {
    const loadMonthi = async () => {
      try {
        const res = await monthiApi.getMonthiOfUser();
        setMonthiList(res.data.quantrinhommonthi || []);
        setIsContestSuperAdmin(!!res.data.isContestSuperAdmin);
        if (res.data.isContestSuperAdmin) {
          const scope = await monthiApi.getContestScopeOptions();
          setCreatorOptions(scope.data.creators || []);
          setIsContestSuperAdmin(!!scope.data.isContestSuperAdmin);
          if (scope.data.monthiList?.length) {
            setMonthiList(scope.data.monthiList);
          }
        }
      } catch (error) {
        const message = error.message || "Không tải được danh sách kiến thức đánh giá";
        if (message === "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại") {
          navigate("/login");
        }
        enqueueSnackbar(message, {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
        });
      } finally {
        setScopeReady(true);
      }
    };
    loadMonthi();
  }, [navigate, enqueueSnackbar]);

  useEffect(() => {
    if (!monthi) {
      setChuyendeList([]);
      return;
    }
    const loadChuyende = async () => {
      try {
        const res = await monthiApi.getChuyendes({ id_monthi: monthi });
        setChuyendeList(res.data || []);
      } catch (error) {
        setChuyendeList([]);
        enqueueSnackbar(error.message || "Không tải được chuyên đề", {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
        });
      }
    };
    loadChuyende();
  }, [monthi, enqueueSnackbar]);

  const handleThongke = useCallback(async (filters) => {
    setOpenModalLoading(true);
    setLoi(null);
    try {
      const res = await monthiApi.thongkeCauhoiSaiTonghop(filters);
      setItems(res.data.items || []);
      setTotalAttempts(res.data.totalAttempts || 0);
    } catch (error) {
      setLoi(error);
      enqueueSnackbar(error.message || "Không thống kê được", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    } finally {
      setOpenModalLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (!daThongke || !scopeReady) return;
    handleThongke({
      monthi: qMonthi,
      chuyende: qChuyende,
      fromDate: qFromDate,
      toDate: qToDate,
      creatorIds: isContestSuperAdmin ? qCreatorIds : "",
    });
  }, [
    daThongke,
    scopeReady,
    isContestSuperAdmin,
    qMonthi,
    qChuyende,
    qFromDate,
    qToDate,
    qCreatorIds,
    handleThongke,
  ]);

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-['Be_Vietnam_Pro',sans-serif]">
      <main className="p-8 mx-auto space-y-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Thống kê câu hỏi hay trả lời sai
          </h1>
          <p className="text-slate-500 mt-1">
            {isContestSuperAdmin
              ? "Top 15 câu sai — có thể lọc theo tài khoản tạo cuộc, kiến thức và chuyên đề."
              : "Top 15 câu sai trong các cuộc đánh giá do tài khoản của bạn tạo."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <form
            className="flex flex-wrap items-end gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              writeSearchParams(searchParams, setSearchParams, {
                fromDate,
                toDate,
                monthi,
                chuyende,
                creatorIds: isContestSuperAdmin ? creatorIds : "",
                run: "1",
              });
            }}
          >
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Kiến thức đánh giá
              </label>
              <select
                value={monthi}
                onChange={(e) => {
                  setMonthi(e.target.value);
                  setChuyende("");
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all appearance-none"
              >
                <option value="">Tất cả kiến thức được quản lý</option>
                {monthiList.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.tenmonthi}
                  </option>
                ))}
              </select>
            </div>
            {isContestSuperAdmin && (
              <div className="flex-1 min-w-[220px]">
                <CreatorAccountAutocomplete
                  label="Tài khoản tạo cuộc"
                  options={creatorOptions}
                  value={creatorIds}
                  onChange={setCreatorIds}
                />
              </div>
            )}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Chuyên đề
              </label>
              <select
                value={chuyende}
                onChange={(e) => setChuyende(e.target.value)}
                disabled={!monthi}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all appearance-none disabled:opacity-60"
              >
                <option value="">
                  {monthi ? "Tất cả chuyên đề" : "Chọn kiến thức đánh giá trước"}
                </option>
                {chuyendeList.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#ab0000] text-white font-bold rounded-xl hover:bg-[#8e0000] shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
            >
              Thống kê
            </button>
          </form>
        </div>

        {daThongke && (
          <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600">
            Số bài thi trong phạm vi lọc:{" "}
            <span className="font-bold text-slate-900">
              {totalAttempts.toLocaleString()}
            </span>
            {" · "}
            Hiển thị {items.length} câu sai nhiều nhất
          </div>
        )}

        {loi && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 py-16 text-center">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
            <p className="mt-3 text-sm font-medium text-slate-800">
              Không tải được dữ liệu thống kê
            </p>
            <button
              onClick={() => handleThongke({ monthi: qMonthi, chuyende: qChuyende, fromDate: qFromDate, toDate: qToDate })}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Thử lại
            </button>
          </div>
        )}

        {!loi && daThongke && items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Inbox className="h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-700">
              Chưa có dữ liệu để phân tích
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Không có lượt thi khớp bộ lọc, hoặc chưa có câu hỏi nào được ghi nhận.
            </p>
          </div>
        )}

        {!loi && items.length > 0 && (
          <div className="flex flex-col md:flex-row md:justify-between md:flex-wrap">
            {items.map((item, index) => (
              <TheCauHoiSai key={item._id} item={item} thuHang={index + 1} />
            ))}
          </div>
        )}
      </main>

      {openModalLoading && <ModalLoading open={openModalLoading} />}
    </div>
  );
};

export default ThongkeCauhoiSai;
