import {
  LoginRequest,
  RefreshToken,
  RegisterRequest,
} from "../interface/AuthInterface";
import axiosClient from "./axiosClient";

const baseURL = "/auth";

const authApi = {
  signIn: (data: LoginRequest) => {
    const url = `${baseURL}/login`;
    return axiosClient.post(url, data);
  },
  signUp: (data: RegisterRequest) => {
    const url = `${baseURL}/register`;
    return axiosClient.post(url, data);
  },
  sendOTP: (email: string) => {
    const url = `${baseURL}/send-otp?email=${email}`;
    return axiosClient.post(url);
  },
  verifyOTP: (email: string, otpCode: string) => {
    const url = `${baseURL}/verify-otp?email=${email}&otpCode=${otpCode}`;
    return axiosClient.post(url);
  },
  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Missing refresh token");

    const res = await axiosClient.post("/auth/refresh-token", {
      refreshToken,
    });

    return res.data; // { accessToken: string }
  },
};

export default authApi;
