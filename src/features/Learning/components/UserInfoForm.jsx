// components/UserInfoForm.jsx
import { useState } from 'react';
import { saveThongTinThiSinh } from './utils';

export default function UserInfoForm({ onSubmit, error }) {
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hoTen.trim() || !ngaySinh) {
      setLocalError('Vui lòng nhập đầy đủ họ tên và ngày sinh');
      return;
    }
    setLocalError('');
    setSubmitting(true);
    await onSubmit({ name: hoTen.trim(), birthday: ngaySinh, phone: "***", donvi:"Tự kiểm tra", hokhau:""  });
    setSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <h3 className="font-semibold text-center mb-4">Nhập thông tin trước khi làm bài</h3>

      <div className="mb-3">
        <label className="block text-sm mb-1">Họ và tên</label>
        <input
          type="text"
          value={hoTen}
          onChange={(e) => setHoTen(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Họ và tên"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Ngày sinh</label>
        <input
          type="date"
          value={ngaySinh}
          onChange={(e) => setNgaySinh(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

     {(localError || error) && <p className="text-red-500 text-sm mb-3">{localError || error}</p>}
      <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white rounded py-2 font-semibold">
        {submitting ? 'Đang xử lý...' : 'Bắt đầu làm bài'}
      </button>
    </form>
  );
}