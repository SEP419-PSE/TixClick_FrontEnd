import axios from "axios";
import authApi from "./authApi";

const axiosClient = axios.create({
  baseURL: "https://160.191.175.172:8443",
  // httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry lần nào
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const data = await authApi.refreshAccessToken();
        console.log("Get new accessToken", data);
        const newAccessToken = data.result.accessToken;

        // Lưu accessToken mới
        localStorage.setItem("accessToken", newAccessToken);
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest); // retry lại request gốc
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login"; // redirect về login nếu refresh fail
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
