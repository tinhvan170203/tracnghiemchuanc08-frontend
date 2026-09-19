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
    // Backend: GET /api/auth/requestRefreshToken (cookie refreshToken)
    const response = await axiosConfig.get("/api/auth/requestRefreshToken");
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
    const status = error.response?.status;
    const message = error.response?.data?.message || "";

    // Nếu chính requestRefreshToken cũng bị lỗi -> Login
    if (originalRequest?.url?.includes("requestRefreshToken")) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    const isUnauthenticated = status === 401;
    const isTokenExpired =
      status === 403 && String(message).toLowerCase().includes("hết hạn");

    // Access token thiếu/hết hạn -> thử refresh cookie
    if ((isUnauthenticated || isTokenExpired) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosConfig(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshToken();
        processQueue();
        return axiosConfig(originalRequest);
      } catch (err) {
        processQueue(err);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 quyền thật sự (không phải hết hạn token)
    if (status === 403 && !isTokenExpired) {
      const detail =
        (typeof message === "string" && message.trim()) ||
        "Bạn không có quyền truy cập vào tài nguyên này!";
      alert(detail);
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosConfig;