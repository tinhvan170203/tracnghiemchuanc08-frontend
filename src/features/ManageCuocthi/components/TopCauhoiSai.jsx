import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  RefreshCw,
  Inbox,
} from "lucide-react";
import monthiApi from "../../../api/monthiApi";
import TheCauHoiSai from "./TheCauHoiSai";

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

export default function TopCauHoiSai({
  idCuocThi,
  ageFrom = "",
  ageTo = "",
  gioitinh = "",
  loaixe = "",
}) {
  const [listTraloiSai, setListTraloiSai] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);

  const taiDuLieu = useCallback(async () => {
    setDangTai(true);
    setLoi(null);
    try {
      const res = await monthiApi.thongkeCauhoiSai({
        idCuocThi,
        ageFrom,
        ageTo,
        gioitinh,
        loaixe,
      });
      setListTraloiSai(res.data);
    } catch (err) {
      setLoi(err);
    } finally {
      setDangTai(false);
    }
  }, [idCuocThi, ageFrom, ageTo, gioitinh, loaixe]);

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
            <TheCauHoiSai key={item._id} item={item} thuHang={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}