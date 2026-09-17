import {
  AlertTriangle,
  CircleHelp,
  Users,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { API_SERVER } from "../../../api/apiServer";

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

export default function TheCauHoiSai({ item, thuHang }) {
  const mucDo = mucDoNghiemTrong(item.ti_le_sai);
  const noiDungDapAnDung = item[item.answer];

  return (
    <div
      className={`relative overflow-hidden rounded-xl my-2 border w-full md:w-[48%] ${mucDo.vien} bg-white shadow-sm transition-shadow hover:shadow-md`}
    >
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

        {item.image !== "" && item.image && (
          <div className="mx-2 flex justify-center items-center">
            <img
              src={`${API_SERVER}api/uploads/${item.image}`}
              className="w-full my-1 md:w-[300px] h-auto"
              alt=""
            />
          </div>
        )}

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
