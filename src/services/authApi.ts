import { LoginRequest } from "../interface/AuthInterface";
import axiosClient from "./axiosClient";

const baseURL = "/auth";

const authApi = {
  signIn: (data: LoginRequest) => {
    const url = `${baseURL}/login`;
    return axiosClient.post(url, data);
  },
};

export default authApi;
