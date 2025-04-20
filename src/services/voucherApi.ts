import { VoucherRequest } from "../interface/company/Voucher";
import axiosClient from "./axiosClient";

const voucherUrl = `/voucher`;

const voucherApi = {
  create: (data: VoucherRequest) => {
    const url = `${voucherUrl}/create`;
    return axiosClient.post(url, data);
  },
  getAll: (eventId: number, status: string) => {
    const url = `${voucherUrl}/all/${eventId}/${status}`;
    return axiosClient.get(url);
  },
};

export default voucherApi;
