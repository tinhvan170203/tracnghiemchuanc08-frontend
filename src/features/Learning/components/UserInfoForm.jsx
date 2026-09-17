import { useState } from 'react';
import { HEADER_1, HEADER_2 } from '../../../../constant/constant';

const inputClass =
  'w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

const YEAR_RE = /^\d{4}$/;

export default function UserInfoForm({ onSubmit, error }) {
  const [form, setForm] = useState({
    name: '',
    birthday: '',
    gioitinh: 'Nam',
    loaixe: 'Xe mô tô',
    hang_gplx: '',
    nghenghiep: '',
    donvi: '',
    phone: '',
    hokhau: '',
  });
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => {
    let value = e.target.value;
    if (key === 'birthday') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      birthday,
      gioitinh,
      loaixe,
      hang_gplx,
      nghenghiep,
      donvi,
      phone,
      hokhau,
    } = form;

    if (!name.trim()) {
      setLocalError('Vui lòng nhập họ tên');
      return;
    }
    if (!YEAR_RE.test(String(birthday).trim())) {
      setLocalError('Năm sinh phải gồm đúng 4 chữ số');
      return;
    }
    if (!gioitinh) {
      setLocalError('Vui lòng chọn giới tính');
      return;
    }
    if (!loaixe) {
      setLocalError('Vui lòng chọn loại xe điều khiển');
      return;
    }
    if (!hang_gplx.trim()) {
      setLocalError('Vui lòng nhập hạng GPLX');
      return;
    }
    if (!nghenghiep.trim()) {
      setLocalError('Vui lòng nhập nghề nghiệp');
      return;
    }
    if (!donvi.trim()) {
      setLocalError('Vui lòng nhập số điện thoại liên hệ');
      return;
    }
    if (!phone.trim()) {
      setLocalError('Vui lòng nhập xã, phường');
      return;
    }
    if (!hokhau.trim()) {
      setLocalError('Vui lòng nhập tỉnh, thành phố');
      return;
    }

    setLocalError('');
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        birthday: String(birthday).trim(),
        gioitinh,
        loaixe,
        hang_gplx: hang_gplx.trim(),
        nghenghiep: nghenghiep.trim(),
        donvi: donvi.trim(),
        phone: phone.trim(),
        hokhau: hokhau.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="shadow-md shadow-slate-400 mb-4 md:h-auto bg-center py-2 bg-cover  bg-[url('/nentrongdong.png')] z-10 flex justify-center">
        <div className="">
          <div className="flex items-center justify-center">
            <img src="/cong-an-hieu.png" className="md:w-24 w-12" alt="" />
            <img src="/logoc08.png" className="md:w-[64px] w-8" alt="" />
          </div>
          <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
            {HEADER_1}
          </h3>
          <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
            {HEADER_2}
          </h3>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-4 bg-white shadow-2xl rounded-3xl border border-gray-100"
      >
        <div className="text-center mb-2">
          {/* <h3 className="text-xl font-extrabold text-gray-800">
            Thông tin dự thi
          </h3> */}
          <p className="text-gray-500 text-sm mt-2">
            Vui lòng điền đầy đủ thông tin trước khi bắt đầu làm bài
          </p>
        </div>

        <div className="space-y-2">
          <div>
            <label className={labelClass}>Họ và tên</label>
            <input
              type="text"
              value={form.name}
              onChange={setField('name')}
              className={inputClass}
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Năm sinh</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={form.birthday}
                onChange={setField('birthday')}
                className={inputClass}
                placeholder="Ví dụ: 1995"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Giới tính</label>
              <select
                value={form.gioitinh}
                onChange={setField('gioitinh')}
                className={inputClass}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Loại xe điều khiển</label>
              <select
                value={form.loaixe}
                onChange={setField('loaixe')}
                className={inputClass}
              >
                <option value="Ô tô khách">Ô tô khách</option>
                <option value="Xe tải">Xe tải</option>
                <option value="Xe đầu kéo">Xe đầu kéo</option>
                <option value="Xe mô tô">Xe mô tô</option>
                <option value="Xe con">Xe con</option>
                <option value="Xe gắn máy">Xe gắn máy</option>
              </select>
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Hạng GPLX</label>
              <input
                type="text"
                value={form.hang_gplx}
                onChange={setField('hang_gplx')}
                className={inputClass}
                placeholder="A1, B1..."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Nghề nghiệp</label>
              <input
                type="text"
                value={form.nghenghiep}
                onChange={setField('nghenghiep')}
                className={inputClass}
                placeholder="Nghề nghiệp"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelClass}>SĐT</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.donvi}
                onChange={setField('donvi')}
                className={inputClass}
                placeholder="Số điện thoại"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Xã/Phường</label>
              <input
                type="text"
                value={form.phone}
                onChange={setField('phone')}
                className={inputClass}
                placeholder="Xã/Phường"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelClass}>Tỉnh/Thành phố</label>
              <input
                type="text"
                value={form.hokhau}
                onChange={setField('hokhau')}
                className={inputClass}
                placeholder="Tỉnh/Thành phố"
              />
            </div>
          </div>
        </div>

        {(localError || error) && (
          <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{localError || (typeof error === 'string' ? error : error?.message)}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl py-2 font-semibold text-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center"
        >
          {submitting ? 'Đang xử lý...' : 'Bắt đầu làm bài'}
        </button>
      </form>
    </>
  );
}
