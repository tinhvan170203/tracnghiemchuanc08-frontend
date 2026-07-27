import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Users, 
  FileCheck, 
  TrendingUp,
  BarChart3,
  Download
} from 'lucide-react';
import c08Api from '../../api/c08Api';
// import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ModalLoading from '../../components/ModalLoading';
const exportExcel = async (listSuccess) => {
   const XLSX = await import('xlsx');
  const dataExport = listSuccess.map((item, index) => ({
    STT: index + 1,
    "Đơn vị": item.text,
    "Tổng cuộc thi": item.data?.total_cuocthi || 0,
    "Tổng lượt thi": item.data?.total || 0,
    "Tổng nộp bài": item.data?.total_nopbai || 0,
    "Không đạt": item.data?.total_khongdat || 0,
    "Trung bình": item.data?.total_trungbinh || 0,
    "Khá": item.data?.total_kha || 0,
    "Giỏi": item.data?.total_gioi || 0,
    "Xuất sắc": item.data?.total_xuatsac || 0,
  }));

  // dòng tổng cộng
  dataExport.push({
    STT: "",
    "Đơn vị": "TỔNG CỘNG",
    "Tổng cuộc thi": dataExport.reduce((a, b) => a + b["Tổng cuộc thi"], 0),
    "Tổng lượt thi": dataExport.reduce((a, b) => a + b["Tổng lượt thi"], 0),
    "Tổng nộp bài": dataExport.reduce((a, b) => a + b["Tổng nộp bài"], 0),
    "Không đạt": dataExport.reduce((a, b) => a + b["Không đạt"], 0),
    "Trung bình": dataExport.reduce((a, b) => a + b["Trung bình"], 0),
    "Khá": dataExport.reduce((a, b) => a + b["Khá"], 0),
    "Giỏi": dataExport.reduce((a, b) => a + b["Giỏi"], 0),
    "Xuất sắc": dataExport.reduce((a, b) => a + b["Xuất sắc"], 0),
  });

  const worksheet = XLSX.utils.json_to_sheet(dataExport);

  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 35 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "ThongKeToanQuoc"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    blob,
    `ThongKeToanQuoc_${new Date().getTime()}.xlsx`
  );
};

// --- HOOK HIỆU ỨNG NHẢY SỐ ĐỘNG (COUNT UP ANIMATION) ---
const useAnimatedNumber = (targetValue, duration = 1000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(targetValue, 10) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    
    const totalMiliseconds = duration;
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(totalMiliseconds / frameRate);
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      // Sử dụng hàm Ease-Out Cạnh để số chạy chậm dần về cuối nhìn mượt hơn
      const progress = currentFrame / totalFrames;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3); 
      
      const currentCount = Math.round(easeOutProgress * end);
      
      if (currentFrame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [targetValue, duration]);

  return count;
};

// Thẻ hiển thị KPI tổng quan kèm hiệu ứng nhảy số
const StatCard = ({ label, value, trend, subValue, icon, isPrimary, bgCustom }) => {
  const animatedValue = useAnimatedNumber(value);

  return (
    <div className={`p-6 rounded-2xl border ${bgCustom} ${isPrimary ? 'border-blue-200 ring-4 ring-blue-50' : 'border-slate-200'} bg-white relative overflow-hidden group transition-all duration-300 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-white font-medium text-sm">{label}</p>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-black text-slate-800 mb-2 transition-all">
        {animatedValue.toLocaleString()}
      </p>
      {trend && (
        <p className="text-white text-xs font-bold flex items-center gap-1">
          <TrendingUp size={14} /> {trend}
        </p>
      )}
      {subValue && <p className="text-white text-xs font-medium">{subValue}</p>}
      {isPrimary && <div className="absolute bottom-0 left-0 h-1 bg-blue-600 w-full"></div>}
    </div>
  );
};

// Thanh phân phối phổ điểm đơn lẻ toàn quốc (Animation rộng dần từ 0%)
const HorizontalBar = ({ label, value, color, max }) => {
  const [width, setWidth] = useState(0);
  const percentage = max > 0 ? (value / max) * 100 : 0;

  useEffect(() => {
    // Trì hoãn nhẹ một chút để trình duyệt kịp kích hoạt CSS Transition
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
        <span>{label}</span>
        <span>{value.toLocaleString()} ({percentage.toFixed(2)}%)</span>
      </div>
      <div className="h-10 bg-slate-100 rounded-lg overflow-hidden relative shadow-inner">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out rounded-lg`} 
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, percent }) => (
  <div className="flex items-center gap-2 transform hover:translate-x-1 transition-transform">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-slate-500 flex-1">{label}</span>
    <span className="font-bold text-slate-700">{percent}</span>
  </div>
);

// Thanh biểu đồ đơn giản cho Top 10 đơn vị (Hiệu ứng mọc thanh)
const TopUnitBar = ({ rank, name, percentage, barColor }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="space-y-1 py-1 group">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700 truncate max-w-[75%] group-hover:text-slate-900 transition-colors">
          <span className="text-slate-400 font-bold mr-1">#{rank}</span> {name}
        </span>
        <span className="font-bold text-slate-600">{percentage.toFixed(2)}%</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

// --- COMPONENT CHI TIẾT THEO ẢNH MẪU: Biểu đồ thanh ngang chồng có Animation kéo dài từng phân đoạn ---
const StackedRowUnit = ({ name, id, data }) => {
  const total = data.total_nopbai || 1;
  const [widths, setWidths] = useState({ kDat: 0, tBinh: 0, kha: 0, gioi: 0, xSac: 0 });

  const pKhongDat = ((data.total_khongdat || 0) / total) * 100;
  const pTrungBinh = ((data.total_trungbinh || 0) / total) * 100;
  const pKha = ((data.total_kha || 0) / total) * 100;
  const pGioi = ((data.total_gioi || 0) / total) * 100;
  const pXuatSac = ((data.total_xuatsac || 0) / total) * 100;

  useEffect(() => {
    // Kích hoạt animation khi component nhận dữ liệu thực tế
    const timer = setTimeout(() => {
      setWidths({
        kDat: pKhongDat,
        tBinh: pTrungBinh,
        kha: pKha,
        gioi: pGioi,
        xSac: pXuatSac
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [pKhongDat, pTrungBinh, pKha, pGioi, pXuatSac]);

  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-slate-100 last:border-0 gap-4 hover:bg-slate-50/80 px-1 transition-colors duration-150">
      {/* Tên đơn vị */}
      <div className="col-span-12 md:col-span-3">
        <p className="font-bold text-slate-800 text-[14px]">{name}</p>
      </div>

      {/* Biểu đồ thanh ngang chồng hoạt họa mượt mà (Stacked Bar) */}
      <div className="col-span-12 md:col-span-7">
        <div className="h-6 w-full rounded-lg overflow-hidden flex bg-slate-100 shadow-inner">
          {widths.kDat > 0 && (
            <div 
              style={{ width: `${widths.kDat}%` }} 
              className="bg-red-500 h-full transition-all duration-1000 ease-out border-r border-white/10 last:border-0" 
              title={`Không đạt: ${pKhongDat.toFixed(2)}%`} 
            />
          )}
          {widths.tBinh > 0 && (
            <div 
              style={{ width: `${widths.tBinh}%` }} 
              className="bg-amber-500 h-full transition-all duration-1000 ease-out border-r border-white/10 last:border-0" 
              title={`Trung bình: ${pTrungBinh.toFixed(2)}%`} 
            />
          )}
          {widths.kha > 0 && (
            <div 
              style={{ width: `${widths.kha}%` }} 
              className="bg-blue-500 h-full transition-all duration-1000 ease-out border-r border-white/10 last:border-0" 
              title={`Khá: ${pKha.toFixed(2)}%`} 
            />
          )}
          {widths.gioi > 0 && (
            <div 
              style={{ width: `${widths.gioi}%` }} 
              className="bg-purple-500 h-full transition-all duration-1000 ease-out border-r border-white/10 last:border-0" 
              title={`Giỏi: ${pGioi.toFixed(2)}%`} 
            />
          )}
          {widths.xSac > 0 && (
            <div 
              style={{ width: `${widths.xSac}%` }} 
              className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
              title={`Xuất sắc: ${pXuatSac.toFixed(2)}%`} 
            />
          )}
        </div>
      </div>

      {/* Lượt nộp */}
      <div className="col-span-12 md:col-span-2 text-right">
        <p className="font-black text-slate-700 text-[15px]">{total.toLocaleString()}</p>
        <p className="text-[11px] text-emerald-500 font-bold">100%</p>
      </div>
    </div>
  );
};

const ThongkeDiaphuong = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [list, setList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [listSuccess, setListSuccess] = useState([]);
  const [listError, setListError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDiaphuongs = async () => {
      try {
        let res = await c08Api.getDiaphuongs();
        setList(res.data || []);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchDiaphuongs();
  }, []);

 const handleThongke = async () => {
  try {
    setIsLoading(true);

    const res = await c08Api.thongkeToanquoc({
      fromDate,
      toDate,
      list: selectedIds,
    });

    setListSuccess(res.data?.listSuccess || []);
    setListError(res.data?.listError || []);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleChangeAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(list.map(item => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  const hanleChangeCheckBox = (e) => {
    const id = e.target.value;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Logic tổng hợp dữ liệu
  const tongHop = useMemo(() => {
    return listSuccess.reduce(
      (acc, item) => {
        const d = item.data || {};
        acc.totalCuocThi += d.total_cuocthi || 0;
        acc.totalLuotThi += d.total || 0;
        acc.totalNopBai += d.total_nopbai || 0;
        acc.khongDat += d.total_khongdat || 0;
        acc.trungBinh += d.total_trungbinh || 0;
        acc.kha += d.total_kha || 0;
        acc.gioi += d.total_gioi || 0;
        acc.xuatSac += d.total_xuatsac || 0;
        return acc;
      },
      { totalCuocThi: 0, totalLuotThi: 0, totalNopBai: 0, khongDat: 0, trungBinh: 0, kha: 0, gioi: 0, xuatSac: 0 }
    );
  }, [listSuccess]);

  const phanTramDong = useMemo(() => {
    const total = tongHop.totalNopBai || 1;
    return {
      khongDat: ((tongHop.khongDat / total) * 100).toFixed(2),
      trungBinh: ((tongHop.trungBinh / total) * 100).toFixed(2),
      kha: ((tongHop.kha / total) * 100).toFixed(2),
      gioi: ((tongHop.gioi / total) * 100).toFixed(2),
      xuatSac: ((tongHop.xuatSac / total) * 100).toFixed(2),
    };
  }, [tongHop]);

  // Top 10 Hiệu suất Giỏi + Xuất sắc
  const top10Performance = useMemo(() => {
    return [...listSuccess]
      .map(item => {
        const totalNop = item.data?.total_nopbai || 0;
        const totalGood = (item.data?.total_gioi || 0) + (item.data?.total_xuatsac || 0);
        return { name: item.text, percentage: totalNop > 0 ? (totalGood / totalNop) * 100 : 0 };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
  }, [listSuccess]);

  // Top 10 ít Không cao nhất
  const top10LowFailure = useMemo(() => {
    return [...listSuccess]
      .filter(item => (item.data?.total_nopbai || 0) > 0)
      .map(item => {
        const totalNop = item.data?.total_nopbai || 0;
        const totalFail = item.data?.total_khongdat || 0;
        return { name: item.text, percentage: (totalFail / totalNop) * 100 };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
  }, [listSuccess]);

  const completionRate = tongHop.totalLuotThi > 0 
    ? ((tongHop.totalNopBai / tongHop.totalLuotThi) * 100).toFixed(2) 
    : '0.00';

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-['Be_Vietnam_Pro',sans-serif] pb-12">
      {/* Thẻ Lựa chọn Địa Phương */}
      <div className="pt-8 max-w-7xl mx-auto px-4">
        <div className="bg-white p-6 h-[400px]  overflow-y-scroll rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
            <input
              id="select-all"
              type="checkbox" 
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={list.length > 0 && selectedIds.length === list.length}
              onChange={handleChangeAll}
            />
            <label htmlFor="select-all" className="text-sm font-bold text-slate-700 cursor-pointer select-none">Chọn toàn quốc</label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2">
            {list.map(i => (
              <div key={i._id} className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded transition-colors">
                <input
                  id={`checkbox-${i._id}`}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  type="checkbox"
                  checked={selectedIds.includes(i._id)}
                  value={i._id}
                  onChange={hanleChangeCheckBox}
                />
                <label htmlFor={`checkbox-${i._id}`} className="text-sm text-slate-600 truncate cursor-pointer select-none" title={i.text}>
                  {i.text}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">Báo cáo Thống kê</h2>
          <p className="text-slate-500 mt-1">Phân tích kết quả đánh giá nhận thức về trật tự an toàn giao thông trên phạm vi toàn quốc</p>
        </div>

        {/* Bộ lọc ngày tháng */}
        <div className="bg-white py-4 px-6 rounded-2xl border border-slate-200 shadow-sm mt-4">
          <form className="flex flex-wrap items-end gap-6" onSubmit={(e) => { e.preventDefault(); handleThongke(); }}>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Từ ngày</label>
              <input
                type="date" required value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all cursor-pointer"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Đến ngày</label>
              <input
                type="date" required value={toDate} onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all cursor-pointer"
              />
            </div>
            <button type="submit" className="px-8 py-2 bg-[#ab0000] text-white font-bold rounded-xl hover:bg-[#8e0000] shadow-lg shadow-red-100 flex items-center gap-2 transition-all active:scale-[0.98]">
              Thống kê dữ liệu
            </button>
          </form>
        </div>
      </div>

      {/* Grid Dashboard Hiển Thị Kết Quả */}
      <main className="p-4 max-w-7xl mx-auto space-y-8 mt-4">
        {/* KPI Thẻ Trạng Thái */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard bgCustom={"bg-gradient-to-br from-blue-500 to-white"} label="Tổng cuộc tuyên truyền" value={tongHop.totalCuocThi} trend="Đã được tổ chức đánh giá" icon={<Trophy className="text-emerald-500" />} />
          <StatCard bgCustom={"bg-gradient-to-br from-red-500 to-white"} label="Tổng lượt tham gia" value={tongHop.totalLuotThi} icon={<Users className="text-blue-500" />} isPrimary />
          <StatCard bgCustom={"bg-gradient-to-br from-green-500 to-white"} label="Tổng nộp bài" value={tongHop.totalNopBai} subValue={`Tỷ lệ hoàn thành: ${completionRate}%`} icon={<FileCheck className="text-emerald-500" />} />
        </div>

        {/* Biểu đồ Phổ Điểm */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thanh Tiến Độ Ngang Toàn Quốc */}
          <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Phân Phối Điểm Số Toàn Quốc</h3>
              <span className="text-slate-400 text-xs font-medium">Theo số lượng nộp bài</span>
            </div>
            <div className="space-y-5 pt-2">
              <HorizontalBar label="Không đạt" value={tongHop.khongDat} color="bg-red-600" max={tongHop.totalNopBai} />
              <HorizontalBar label="Trung bình" value={tongHop.trungBinh} color="bg-yellow-500" max={tongHop.totalNopBai} />
              <HorizontalBar label="Khá" value={tongHop.kha} color="bg-blue-600" max={tongHop.totalNopBai} />
              <HorizontalBar label="Giỏi" value={tongHop.gioi} color="bg-purple-600" max={tongHop.totalNopBai} />
              <HorizontalBar label="Xuất sắc" value={tongHop.xuatSac} color="bg-emerald-600" max={tongHop.totalNopBai} />
            </div>
          </div>
        </div>

        {/* Danh Sách Xếp Hạng Đơn Vị */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-50">
              <Trophy className="text-emerald-500" size={20} />
              <h3 className="font-bold text-lg text-slate-800">Top 10 Đơn vị có Tỷ lệ Giỏi & Xuất sắc cao nhất</h3>
            </div>
            <div className="space-y-4">
              {top10Performance.length > 0 ? top10Performance.map((unit, i) => (
                <TopUnitBar key={i} rank={i + 1} name={unit.name} percentage={unit.percentage} barColor="bg-emerald-500" />
              )) : <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu thống kê</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-50">
              <BarChart3 className="text-blue-500" size={20} />
              <h3 className="font-bold text-lg text-slate-800">Top 10 Đơn vị có Tỷ lệ Không đạt cao nhất</h3>
            </div>
            <div className="space-y-4">
              {top10LowFailure.length > 0 ? top10LowFailure.map((unit, i) => (
                <TopUnitBar key={i} rank={i + 1} name={unit.name} percentage={unit.percentage} barColor="bg-blue-500" />
              )) : <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu thống kê</p>}
            </div>
          </div>
        </div>

        {/* BẢNG PHÂN TÍCH CHI TIẾT THEO ĐƠN VỊ (STACKED BAR CHART HOẠT HỌA) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xl text-slate-800">Phân tích chi tiết theo đơn vị</h3>
              <p className="text-xs text-slate-400 mt-1">Biểu đồ thanh ngang chồng thể hiện tỷ lệ phổ điểm của từng đơn vị</p>
            </div>
            <button onClick={()=> exportExcel(listSuccess)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors self-start shadow-sm shadow-slate-200 active:scale-95">
              <Download size={14} />
              Xuất Excel Chi Tiết
            </button>
          </div>

          {/* Tiêu đề cột */}
          <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50 px-1 md:grid">
            <div className="col-span-3">Đơn vị</div>
            <div className="col-span-7 text-center">Phân bổ phổ điểm (%)</div>
            <div className="col-span-2 text-right">Lượt nộp</div>
          </div>

          {/* Danh sách dữ liệu */}
          <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto pr-2 space-y-1">
            {listSuccess.length > 0 ? (
              listSuccess.map((item, index) => (
                <StackedRowUnit 
                  key={index}
                  name={item.text}
                  id={item._id}
                  data={item.data || {}}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-8 animate-pulse">Vui lòng chọn ngày và bấm "Thống kê dữ liệu" để xem danh sách chi tiết.</p>
            )}
          </div>
        </div>

        {/* Danh sách domain mất kết nối  */}
        {listError && listError.length > 0 && (
  <div className="max-w-7xl mx-auto my-6 animate-[fadeIn_0.3s_ease-out]">
    <div className="bg-white border border-red-200 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Tiêu đề của Hộp lỗi */}
      <div className="bg-red-50 px-5 py-3.5 border-b border-red-100 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 text-red-800 font-bold">
          <div className="p-1.5 bg-red-100 text-red-600 rounded-lg shrink-0 animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="text-sm md:text-base">Danh sách đơn vị cấu hình lỗi hoặc mất kết nối ({listError.length})</span>
        </div>
      </div>

      {/* Nội dung danh sách lỗi */}
      <div className="p-4 max-h-[300px] overflow-y-auto divide-y divide-slate-100">
        {listError.map((item, index) => (
          <div key={index} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            
            {/* Tên địa phương và Domain cấu hình */}
            <div className="flex items-start space-x-3">
              <span className="flex h-2 w-2 translate-y-2 rounded-full bg-red-500 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-800 text-sm md:text-md leading-snug">
                  {item.text}
                </h5>
                <p className="text-xs text-slate-400 font-mono mt-0.5 break-all">
                  Domain: {item.domain}
                </p>
              </div>
            </div>

            {/* Chi tiết mã lỗi hệ thống */}
            <div className="sm:text-right shrink-0">
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 border border-red-100 truncate" title={item.error}>
                {item.error.includes("HTTP") ? `Lỗi mạng: ${item.error}` : "Sai cấu hình URL hoặc chưa chạy bản phần mềm của đơn vị"}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  </div>
)}
      </main>
<ModalLoading open={isLoading} />
    </div>
  );
};

export default ThongkeDiaphuong;