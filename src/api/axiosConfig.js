import axios from "axios";
import { API_SERVER } from "./apiServer";

const axiosConfig = axios.create({
  baseURL: API_SERVER,
  withCredentials: true, // Cực kỳ quan trọng để tự động gửi/nhận Cookie HttpOnly
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// REFRESH TOKEN
// ==============================
const refreshToken = async () => {
  try {
    // Không cần truyền thêm { withCredentials: true } ở đây nữa vì đã cấu hình ở axios.create phía trên
    const response = await axiosConfig.post("/c08/auth/requestRefreshToken", {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==============================
// HANDLE MULTIPLE REQUEST 401
// ==============================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// ==============================
// REQUEST INTERCEPTOR
// ==============================
axiosConfig.interceptors.request.use(
  async function (config) {
    // LƯU Ý: Nếu Backend của bạn xác thực bằng Cookie (req.cookies.accessToken_thitracnghiem)
    // Thì bạn giữ nguyên hàm này, không cần thêm gì cả vì thuộc tính `withCredentials: true` tự động đính kèm cookie rồi.
    
    // NẾU: Backend của bạn vẫn dùng Header "Authorization: Bearer <Token>" thì bạn phải viết như sau:
    // const token = ... lấy từ localStorage hoặc một nơi nào đó ...
    // if (token) { config.headers.Authorization = `Bearer ${token}`; }
    
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
axiosConfig.interceptors.response.use(
  function (response) {
    return response;
  },

  async function (error) {
    console.log('Error interceptor:', error);
    const originalRequest = error.config;

    // Nếu chính requestRefreshToken cũng bị lỗi 401/403 -> Chuyển hướng sang Login luôn
    if (originalRequest.url.includes("requestRefreshToken")) {
      localStorage.clear(); // Xóa thông tin user cũ (nếu có)
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Access token hết hạn (Backend trả về lỗi 401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Nếu đang trong quá trình refresh token từ một request lỗi trước đó
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosConfig(originalRequest); // Gọi lại request cũ sau khi refresh thành công
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi hàm refresh token
        await refreshToken();
        
        // Chạy tiếp các request đang đợi trong hàng đợi (queue)
        processQueue();

        // Thực hiện lại request ban đầu bị lỗi 401
        return axiosConfig(originalRequest);
      } catch (err) {
        // Nếu refresh thất bại (ví dụ: Refresh Token hết hạn)
        // console.log(first)
        processQueue(err);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý lỗi 403 (Cấm truy cập - Không đủ quyền) độc lập với lỗi 401 tránh bị lặp vô hạn
    if (error.response?.status === 403) {
      alert("Bạn không có quyền truy cập vào tài nguyên này!");
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosConfig;