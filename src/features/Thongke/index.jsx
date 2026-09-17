
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { writeSearchParams } from '../../utils/searchParams';
import { useSnackbar } from "notistack";
import monthiApi from '../../api/monthiApi';
import ChartResult from './components/ChartResult';
import ModalLoading from '../../components/ModalLoading';
import DemographicFilters, {
  validateDemographicAge,
} from '../../components/DemographicFilters';
import CreatorAccountAutocomplete from '../../components/CreatorAccountAutocomplete';

/**
 * Redesigned Thongke (Statistics) component for Cục Cảnh sát giao thông.
 * This component implements the visual design of SCREEN_33 while 
 * preserving the functional logic from the original source.
 */

const Thongke = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromDate = searchParams.get("fromDate") || "";
  const qToDate = searchParams.get("toDate") || "";
  const qMonthi = searchParams.get("monthi") || "";
  const qChuyende = searchParams.get("chuyende") || "";
  const qCreatorIds = searchParams.get("creatorIds") || "";
  const qAgeFrom = searchParams.get("ageFrom") || "";
  const qAgeTo = searchParams.get("ageTo") || "";
  const qGioitinh = searchParams.get("gioitinh") || "";
  const qLoaixe = searchParams.get("loaixe") || "";
  const daThongke = searchParams.get("run") === "1";
  const [fromDate, setFromDate] = useState(qFromDate);
  const [toDate, setToDate] = useState(qToDate);
  const [monthi, setMonthi] = useState(qMonthi);
  const [chuyende, setChuyende] = useState(qChuyende);
  const [creatorIds, setCreatorIds] = useState(qCreatorIds);
  const [ageFrom, setAgeFrom] = useState(qAgeFrom);
  const [ageTo, setAgeTo] = useState(qAgeTo);
  const [gioitinh, setGioitinh] = useState(qGioitinh);
  const [loaixe, setLoaixe] = useState(qLoaixe);
  const [monthiList, setMonthiList] = useState([]);
  const [chuyendeList, setChuyendeList] = useState([]);
  const [creatorOptions, setCreatorOptions] = useState([]);
  const [isContestSuperAdmin, setIsContestSuperAdmin] = useState(false);
  const [scopeReady, setScopeReady] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [totalNopbai, setTotalNopbai] = useState(0);
  const [totalLuotthi, setTotalLuotthi] = useState(0);
  const [totalCuocthi, setTotalCuocthi] = useState(0);
  const [dataKhongdat, setDataKhongdat] = useState(0);
  const [dataTrungbinh, setDataTrungbinh] = useState(0);
  const [dataKha, setDataKha] = useState(0);
  const [dataGioi, setDataGioi] = useState(0);
  const [dataXuatsac, setDataXuatsac] = useState(0);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getMonthiOfUser = async () => {
      try {
        let res = await monthiApi.getMonthiOfUser();
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
        const message = error.message || "Đã xảy ra lỗi khi tải danh sách môn thi";
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
    getMonthiOfUser();
  }, [navigate, enqueueSnackbar]);

  useEffect(() => {
    setFromDate(qFromDate);
    setToDate(qToDate);
    setMonthi(qMonthi);
    setChuyende(qChuyende);
    setCreatorIds(qCreatorIds);
    setAgeFrom(qAgeFrom);
    setAgeTo(qAgeTo);
    setGioitinh(qGioitinh);
    setLoaixe(qLoaixe);
  }, [qFromDate, qToDate, qMonthi, qChuyende, qCreatorIds, qAgeFrom, qAgeTo, qGioitinh, qLoaixe]);

  useEffect(() => {
    if (!monthi) {
      setChuyendeList([]);
      return;
    }
    const loadChuyende = async () => {
      try {
        const res = await monthiApi.getChuyendes({ id_monthi: monthi });
        setChuyendeList(res.data || []);
      } catch (_) {
        setChuyendeList([]);
      }
    };
    loadChuyende();
  }, [monthi]);

  const handleThongke = useCallback(async (filters) => {
    try {
      setOpenModalLoading(true);
      let res = await monthiApi.thongke(filters);
      setOpenModalLoading(false);
      setTotalNopbai(res.data.total_nopbai);
      setDataKhongdat(res.data.total_khongdat);
      setDataTrungbinh(res.data.total_trungbinh);
      setDataKha(res.data.total_kha);
      setDataGioi(res.data.total_gioi);
      setDataXuatsac(res.data.total_xuatsac);
      setTotalLuotthi(res.data.total);
      setTotalCuocthi(res.data.total_cuocthi || 0);
    } catch (error) {
      setOpenModalLoading(false);
      alert(error.message);
    }
  }, []);

  useEffect(() => {
    if (!daThongke || !scopeReady) return;
    handleThongke({
      fromDate: qFromDate,
      toDate: qToDate,
      monthi: qMonthi,
      chuyende: qChuyende,
      creatorIds: isContestSuperAdmin ? qCreatorIds : "",
      ageFrom: qAgeFrom,
      ageTo: qAgeTo,
      gioitinh: qGioitinh,
      loaixe: qLoaixe,
    });
  }, [
    daThongke,
    scopeReady,
    isContestSuperAdmin,
    qFromDate,
    qToDate,
    qMonthi,
    qChuyende,
    qCreatorIds,
    qAgeFrom,
    qAgeTo,
    qGioitinh,
    qLoaixe,
    handleThongke,
  ]);

  const handleDemographicChange = (field, value) => {
    const setters = {
      ageFrom: setAgeFrom,
      ageTo: setAgeTo,
      gioitinh: setGioitinh,
      loaixe: setLoaixe,
    };
    setters[field]?.(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ageError = validateDemographicAge(ageFrom, ageTo);
    if (ageError) {
      enqueueSnackbar(ageError, { variant: "warning" });
      return;
    }
    writeSearchParams(searchParams, setSearchParams, {
      fromDate,
      toDate,
      monthi,
      chuyende,
      creatorIds: isContestSuperAdmin ? creatorIds : "",
      ageFrom,
      ageTo,
      gioitinh,
      loaixe,
      run: "1",
    });
  };

  const handleClearDemographics = () => {
    setAgeFrom("");
    setAgeTo("");
    setGioitinh("");
    setLoaixe("");
    if (daThongke) {
      writeSearchParams(searchParams, setSearchParams, {
        ageFrom: "",
        ageTo: "",
        gioitinh: "",
        loaixe: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-['Be_Vietnam_Pro',sans-serif]">
    
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Page Title */}
        <div>
          <p className="text-slate-500 mt-1">
            {isContestSuperAdmin
              ? "Thống kê toàn hệ thống — có thể lọc theo tài khoản tạo cuộc, kiến thức và chuyên đề."
              : "Thống kê các cuộc đánh giá do tài khoản của bạn tạo (trong kiến thức được phân quyền)."}
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {monthiList.length === 0 && !isContestSuperAdmin && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
              Tài khoản chưa được phân quyền kiến thức đánh giá nào. Liên hệ quản trị viên (mục Phân quyền QL kiến thức đánh giá) để được cấp quyền trước khi thống kê.
            </p>
          )}
          <form className="flex flex-wrap items-end gap-6" onSubmit={handleSubmit}>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Từ ngày</label>
              <input 
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Đến ngày</label>
              <input 
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Kiến thức đánh giá</label>
              <select 
                value={monthi} 
                onChange={(e) => {
                  setMonthi(e.target.value);
                  setChuyende("");
                }} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all appearance-none"
              >
                <option value="">{isContestSuperAdmin ? "Tất cả kiến thức" : "Tất cả kiến thức được phân quyền"}</option>
                {monthiList.map(i => <option key={i._id} value={i._id}>{i.tenmonthi}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Chuyên đề</label>
              <select
                value={chuyende}
                onChange={(e) => setChuyende(e.target.value)}
                disabled={!monthi}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all appearance-none disabled:opacity-60"
              >
                <option value="">Tất cả chuyên đề</option>
                {chuyendeList.map((i) => (
                  <option key={i._id} value={i._id}>{i.title}</option>
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
            <button 
              type="submit"
              className="px-8 py-3 bg-[#ab0000] text-white font-bold rounded-xl hover:bg-[#8e0000] shadow-lg shadow-red-100 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              Thống kê
            </button>
            <DemographicFilters
              idPrefix="thongke-hethong"
              ageFrom={ageFrom}
              ageTo={ageTo}
              gioitinh={gioitinh}
              loaixe={loaixe}
              onChange={handleDemographicChange}
              onClear={handleClearDemographics}
              className="basis-full"
            />
          </form>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Summary Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#ab0000] p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-red-100">
              <div className="relative z-10">
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Tổng số lượt dự thi</p>
                <h3 className="text-5xl font-black">{totalLuotthi.toLocaleString()}</h3>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-bold bg-white/20 w-fit px-3 py-1 rounded-full">
                  Dữ liệu thời gian thực
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="relative z-10">
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Tổng số cuộc đánh giá</p>
                <h3 className="text-5xl font-black">{totalCuocthi.toLocaleString()}</h3>
                <p className="text-[11px] font-bold mt-2 opacity-80">Theo bộ lọc hiện tại</p>
              </div>
            </div>

            <div className="bg-orange-500 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-orange-100">
              <div className="relative z-10">
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Bài thi đã nộp</p>
                <h3 className="text-5xl font-black">{totalNopbai.toLocaleString()}</h3>
                <p className="text-[11px] font-bold mt-2 opacity-80">Tỷ lệ hoàn thành: {totalLuotthi > 0 ? ((totalNopbai/totalLuotthi)*100).toFixed(1) : 0}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6">Phân loại kết quả</h4>
              <div className="space-y-4">
                {[
                  { label: "Xuất sắc", value: dataXuatsac, color: "bg-yellow-400" },
                  { label: "Giỏi", value: dataGioi, color: "bg-green-500" },
                  { label: "Khá", value: dataKha, color: "bg-blue-500" },
                  { label: "Trung bình", value: dataTrungbinh, color: "bg-orange-400" },
                  { label: "Không đạt", value: dataKhongdat, color: "bg-red-500" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-6 rounded-full ${item.color}`} />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Chart */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative min-h-[500px]">
             <div className="absolute top-8 left-8 text-left">
                <h4 className="md:text-xl text-[14px] font-semibold text-slate-900">Biểu đồ phân tích kết quả</h4>
             </div>
             <div className="w-full max-w-[500px] mt-10">
                <ChartResult 
                  text={``}
                  dataKhongdat={dataKhongdat} 
                  dataTrungbinh={dataTrungbinh} 
                  dataKha={dataKha} 
                  dataGioi={dataGioi} 
                  dataXuatsac={dataXuatsac}
                  total={totalNopbai} 
                />
             </div>
             {/* Chart Legend Placeholder */}
             <div className="mt-8 flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-[11px] font-bold text-slate-600">Xuất sắc</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-[11px] font-bold text-slate-600">Giỏi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-[11px] font-bold text-slate-600">Khá</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-[11px] font-bold text-slate-600">Trung bình</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-[11px] font-bold text-slate-600">Không đạt</span>
                </div>
             </div>
          </div>
        </div>
      </main>

  

      {openModalLoading && <ModalLoading open={openModalLoading} />}
    </div>
  );
};

export default Thongke;
