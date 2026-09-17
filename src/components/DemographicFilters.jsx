import React from "react";

export const GENDER_OPTIONS = ["Nam", "Nữ"];
export const VEHICLE_OPTIONS = [
  "Ô tô khách",
  "Xe tải",
  "Xe đầu kéo",
  "Xe mô tô",
  "Xe con",
  "Xe gắn máy",
];

export const validateDemographicAge = (ageFrom, ageTo) => {
  const values = [
    ["Tuổi từ", ageFrom],
    ["Tuổi đến", ageTo],
  ];
  for (const [label, value] of values) {
    if (value === "" || value == null) continue;
    const age = Number(value);
    if (!Number.isInteger(age) || age < 0 || age > 120) {
      return `${label} phải là số nguyên từ 0 đến 120`;
    }
  }
  if (
    ageFrom !== "" &&
    ageTo !== "" &&
    Number(ageFrom) > Number(ageTo)
  ) {
    return "Tuổi từ không được lớn hơn tuổi đến";
  }
  return "";
};

const inputClass =
  "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#ab0000] transition-all";

const DemographicFilters = ({
  ageFrom = "",
  ageTo = "",
  gioitinh = "",
  loaixe = "",
  onChange,
  onClear,
  idPrefix = "demographic",
  className = "",
}) => {
  const setField = (field) => (event) => onChange(field, event.target.value);
  const hasValue = ageFrom || ageTo || gioitinh || loaixe;

  return (
    <div
      className={`rounded-2xl border border-red-100 bg-gradient-to-r from-red-50/80 to-white p-4 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#ab0000]">
            Đối tượng thống kê
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Lọc theo độ tuổi, giới tính và phương tiện đang sử dụng
          </p>
        </div>
        {hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-200 hover:text-[#ab0000]"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor={`${idPrefix}-age-from`}
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500"
          >
            Từ tuổi
          </label>
          <input
            id={`${idPrefix}-age-from`}
            type="number"
            min="0"
            max="120"
            step="1"
            value={ageFrom}
            onChange={setField("ageFrom")}
            placeholder="Ví dụ: 18"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-age-to`}
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500"
          >
            Đến tuổi
          </label>
          <input
            id={`${idPrefix}-age-to`}
            type="number"
            min="0"
            max="120"
            step="1"
            value={ageTo}
            onChange={setField("ageTo")}
            placeholder="Ví dụ: 35"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-gender`}
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500"
          >
            Giới tính
          </label>
          <select
            id={`${idPrefix}-gender`}
            value={gioitinh}
            onChange={setField("gioitinh")}
            className={inputClass}
          >
            <option value="">Tất cả giới tính</option>
            {GENDER_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-vehicle`}
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500"
          >
            Loại phương tiện
          </label>
          <select
            id={`${idPrefix}-vehicle`}
            value={loaixe}
            onChange={setField("loaixe")}
            className={inputClass}
          >
            <option value="">Tất cả phương tiện</option>
            {VEHICLE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DemographicFilters;
