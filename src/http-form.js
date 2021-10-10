import axios from "axios";
import LoginDataService from "./service/login-http";

  const token = window.localStorage.getItem("access");
  const refreshToken = window.localStorage.getItem("refresh");
  
  const axiosInstance = axios.create({
    baseURL: "https://cz3002.kado.sg/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const {
          data: { access },
        } = await LoginDataService.postRefreshToken({ refresh: refreshToken });
        error.config.headers.Authorization = `Bearer ${access}`;
        window.localStorage.setItem("access", access);
        return axiosInstance(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  export default axiosInstance
