import { AccountRequest } from "../../interface/manager/Account"
import axiosClient from "../axiosClient"

const adminApi ={
    createManager(data:AccountRequest) {
        const url = "/account/create-account"
        return axiosClient.post(url, data)
    }
}

export default adminApi;