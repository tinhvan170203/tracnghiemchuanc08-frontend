/** Tỷ giá hiển thị fallback khi API chưa trả estimatedVnd */
export const USD_TO_VND = 32000;

export function fmtUsd(n) {
  return Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

export function fmtVnd(n) {
  return `${Math.round(Number(n || 0)).toLocaleString("vi-VN")} ₫`;
}

export function resolveVnd(row) {
  if (row?.estimatedVnd != null && row.estimatedVnd !== "") {
    return Number(row.estimatedVnd) || 0;
  }
  return Math.round((Number(row?.estimatedUsd) || 0) * USD_TO_VND);
}
