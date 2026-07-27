import axios from 'axios'
import { API_SERVER } from './apiServer';

const axiosCommon = axios.create({
    // baseURL: 'https://thitracnghiem.onrender.com/',
    // baseURL: 'http://192.168.1.200:4444/',
    // baseURL: 'http://20.1.146.27:80/',
    baseURL: API_SERVER,

    headers: {
    // 'Content-Type': 'multipart/form-data',
    },
    withCredentials: true, // Để request gửi kèm cookie
});

//Interceptors : nơi làm gì đấy cho tất cả các request hoặc respone thì gắn interceptors
// Add a request interceptor
axiosCommon.interceptors.request.use(function (config) {
    // Do something before request is sent
    // config.headers.token = "Bearer hello"
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axiosCommon.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error


    return Promise.reject(error);
  });



export default axiosCommon;