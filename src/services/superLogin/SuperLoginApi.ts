import { LoginRequest } from "../../interface/superLogin/Login";
import axiosClient from "../axiosClient";

const superLoginApi = {
    login(data: LoginRequest){
        const url = "/auth/login_with_manager_and_admin";
        return axiosClient.post(url, data);
    }
}

export default superLoginApi;