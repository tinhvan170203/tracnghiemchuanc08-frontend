import axios from 'axios'
// import jwt_decode from "jwt-decode"
import Cookies from 'js-cookie';
import { API_SERVER } from './apiServer.js';



const axiosMulter = axios.create({
  baseURL: API_SERVER,
  // baseURL: 'http://localhost:4000/',
  // baseURL: 'http://localhost:4000/',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true, // Để request gửi kèm cookie
});

// ==============================
// REFRESH TOKEN
// ==============================

const refreshToken = async () => {
  try {

    const response = await axios.post(
      `${API_SERVER}/api/auth/requestRefreshToken`,
      {},
      {
        withCredentials: true,
      }
    );

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

axiosMulter.interceptors.request.use(
  async function (config) {
    return config;

  },
  function (error) {
    return Promise.reject(error);
  }
);



// ==============================
// RESPONSE INTERCEPTOR
// ==============================

axiosMulter.interceptors.response.use(

  function (response) {
    return response;
  },

  async function (error) {

    const originalRequest = error.config;

    // Nếu refresh token cũng lỗi
    if (
      originalRequest.url.includes("requestRefreshToken")
    ) {

      window.location.href = "/login";

      return Promise.reject(error);
    }

    // Access token hết hạn
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      // Nếu đang refresh rồi
      if (isRefreshing) {

        return new Promise((resolve, reject) => {

          failedQueue.push({
            resolve,
            reject,
          });

        }).then(() => {

          return axiosMulter(originalRequest);

        }).catch((err) => {

          return Promise.reject(err);

        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {

        await refreshToken();

        processQueue();

        return axiosMulter(originalRequest);

      } catch (err) {

        processQueue(err);

        localStorage.clear();

        window.location.href = "/login";

        return Promise.reject(err);

      } finally {

        isRefreshing = false;
      }
    }

    // Forbidden
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log(error.response)
      alert("Bạn không có quyền truy cập");

    }

    return Promise.reject(error.response?.data || error);
  }
);


export default axiosMulter;