const KEY_PREFIX = 'hoctap_progress_';

// Lấy danh sách _id các câu đã học của 1 chuyên đề
export function getLearnedIds(chuyendeId) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + chuyendeId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return []; // phòng trường hợp dữ liệu localStorage bị hỏng/không parse được
  }
}

// Đánh dấu 1 câu đã học (không trùng lặp)
export function markAsLearned(chuyendeId, cauhoiId) {
  const learned = getLearnedIds(chuyendeId);
  if (!learned.includes(cauhoiId)) {
    learned.push(cauhoiId);
    localStorage.setItem(KEY_PREFIX + chuyendeId, JSON.stringify(learned));
  }
}

// Tìm vị trí (index) câu tiếp theo cần học, dựa trên danh sách cauhois đã sort cố định từ server
export function getResumeIndex(chuyendeId, cauhoisFromServer) {
  const learnedIds = getLearnedIds(chuyendeId);
  if (learnedIds.length === 0) return 0;

  const idx = cauhoisFromServer.findIndex(c => !learnedIds.includes(c._id));
  // idx === -1 nghĩa là đã học hết toàn bộ danh sách
  return idx === -1 ? cauhoisFromServer.length - 1 : idx;
}

export function isDoneAll(chuyendeId, cauhoisFromServer) {
  const learnedIds = getLearnedIds(chuyendeId);
  return cauhoisFromServer.length > 0 && cauhoisFromServer.every(c => learnedIds.includes(c._id));
}

// Reset tiến trình 1 chuyên đề (nút "Học lại từ đầu")
export function resetProgress(chuyendeId) {
  localStorage.removeItem(KEY_PREFIX + chuyendeId);
}

const KEY = 'thongtinthisinh';

export function getThongTinThiSinh() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function hasThongTinThiSinh() {
  const info = getThongTinThiSinh();
  return !!(info && info.hoTen && info.ngaySinh);
}

// Lưu theo đúng format "thongtinthisinh" đã dùng ở luồng thi cũ,
// merge thêm id_cuocthi của lần tự kiểm tra hiện tại
export function saveThongTinThiSinh({ hoTen, ngaySinh, id_cuocthi }) {
  const data = { hoTen, ngaySinh, id_cuocthi };
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

const saveEncryptedExam = (questionList, secretKey) => {
  try {
    const dataString = JSON.stringify(questionList);
    const encrypted = CryptoJS.AES.encrypt(dataString, secretKey).toString();
    localStorage.setItem('question_list', encrypted);
  } catch (error) {
    console.error("Lỗi mã hóa:", error);
  }
};
