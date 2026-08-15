import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  CircleHelp,
  Users,
  RefreshCw,
  BookOpen,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import monthiApi from "../../../api/monthiApi";
import { API_SERVER } from "../../../api/apiServer";


/** Ngưỡng màu sắc mức độ nghiêm trọng, dùng chung cho thanh tỷ lệ và nhãn */
function mucDoNghiemTrong(tiLeSai) {
  if (tiLeSai >= 60) {
    return {
      nhan: "Rất nghiêm trọng",
      vach: "bg-rose-500",
      chu: "text-rose-600",
      vien: "border-rose-200",
      nen: "bg-rose-50",
    };
  }
  if (tiLeSai >= 35) {
    return {
      nhan: "Nghiêm trọng",
      vach: "bg-amber-500",
      chu: "text-amber-600",
      vien: "border-amber-200",
      nen: "bg-amber-50",
    };
  }
  return {
    nhan: "Bình thường",
    vach: "bg-emerald-500",
    chu: "text-emerald-600",
    vien: "border-emerald-200",
    nen: "bg-emerald-50",
  };
}

const NHAN_DAP_AN = {
  option_a: "A",
  option_b: "B",
  option_c: "C",
  option_d: "D",
  option_e: "E",
};

function TheCauHoi({ item, thuHang }) {
  const mucDo = mucDoNghiemTrong(item.ti_le_sai);
  const noiDungDapAnDung = item[item.answer];

  return (
    <div
      className={`relative overflow-hidden rounded-xl my-2 border w-full md:w-[48%] ${mucDo.vien} bg-white shadow-sm transition-shadow hover:shadow-md`}
    >
      {/* Số thứ hạng lớn, mờ, nằm phía sau — có ý nghĩa vì đây là bảng xếp hạng thật theo số lượt sai */}
      <span className="pointer-events-none absolute -right-2 -top-5 select-none font-mono text-7xl font-bold text-slate-100">
        {String(thuHang).padStart(2, "0")}
      </span>

      <div className="relative p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
            <BookOpen className="h-3 w-3" />
            {item.chuyendeString}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${mucDo.nen} ${mucDo.chu}`}
          >
            {mucDo.nhan}
          </span>
        </div>

        <h3 className="text-[12px] font-semibold leading-snug text-slate-900">
          {item.question}
        </h3>

        {item.image !== "" && (
          <div className="mx-2 flex justify-center items-center">
            <img src={`${API_SERVER}api/uploads/${item.image}`} className="w-full my-1 md:w-[300px] h-auto" />
          </div>
        )}
        <div>

        </div>

        {/* Đáp án đúng — chỉ hiện đáp án đúng, không liệt kê hết các phương án */}
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
            {NHAN_DAP_AN[item.answer]}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">
              Đáp án đúng
            </p>
            <p className="text-[12px] text-emerald-900">{noiDungDapAnDung}</p>
          </div>
          <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />
        </div>

        {/* Thanh tỷ lệ sai — tín hiệu trực quan chính của mỗi thẻ */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>Tỷ lệ chọn sai (trong số đã trả lời)</span>
            <span className={`font-mono font-semibold ${mucDo.chu}`}>
              {item.ti_le_sai}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${mucDo.vach} transition-all duration-500`}
              style={{ width: `${Math.min(item.ti_le_sai, 100)}%` }}
            />
          </div>
        </div>

        {/* Chỉ số thống kê */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <div className="flex items-center justify-center gap-1 text-slate-400">
              <Users className="h-3.5 w-3.5" />
              <span className="text-[11px]">Tổng lượt làm</span>
            </div>
            <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
              {item.tong_luot_lam}
            </p>
          </div>
          <div className="rounded-lg bg-rose-100 px-2 py-2">
            <div className="flex items-center justify-center gap-1 text-red-800">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-[11px]">Lượt chọn sai</span>
            </div>
            <p className="mt-1 font-mono text-sm font-semibold text-rose-600">
              {item.so_luot_sai}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <div className="flex items-center justify-center gap-1 text-slate-400">
              <CircleHelp className="h-3.5 w-3.5" />
              <span className="text-[11px]">Bỏ trống</span>
            </div>
            <p className="mt-1 font-mono text-sm font-semibold text-slate-600">
              {item.so_luot_khong_tra_loi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrangThaiTai() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-100/60"
        />
      ))}
    </div>
  );
}

function TrangThaiRong() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <Inbox className="h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm font-medium text-slate-700">
        Chưa có dữ liệu để phân tích
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Cuộc thi này chưa có lượt làm bài nào được ghi nhận.
      </p>
    </div>
  );
}

function TrangThaiLoi({ onThuLai }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-rose-500" />
      <p className="mt-3 text-sm font-medium text-slate-800">
        Không tải được dữ liệu thống kê
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Kiểm tra kết nối mạng hoặc thử lại sau ít phút.
      </p>
      <button
        onClick={onThuLai}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Thử lại
      </button>
    </div>
  );
}

export default function TopCauHoiSai({ idCuocThi }) {
  const [listTraloiSai, setListTraloiSai] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);

  const taiDuLieu = useCallback(async () => {
    setDangTai(true);
    setLoi(null);
    try {
      const res = await monthiApi.thongkeCauhoiSai({ idCuocThi });
      setListTraloiSai(res.data);
    } catch (err) {
      setLoi(err);
    } finally {
      setDangTai(false);
    }
  }, [idCuocThi]);

  useEffect(() => {
    taiDuLieu();
  }, [taiDuLieu]);

  return (
    <div className="bg-slate-50 px-4 py-2">
      <div>
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Hỗ trợ phân tích kết quả đánh giá phục vụ công tác tuyên truyền, phổ biến lại nội dung kiến thức chưa nắm vững
            </p>
            <h1 className="mt-1 text-[14px] font-bold text-slate-900">
              Top 10 câu hỏi bị trả lời sai nhiều nhất
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:flex-wrap my-2">
          {listTraloiSai.map((item, index) => (
            <TheCauHoi key={item._id} item={item} thuHang={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}