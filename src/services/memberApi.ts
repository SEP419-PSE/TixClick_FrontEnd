import { CreateMemberRequest } from "../interface/consumer/Member";
import axiosClient from "./axiosClient";

const memberUrl = `/member`;

const memberApi = {
  create: (data: CreateMemberRequest) => {
    const url = `${memberUrl}/create`;
    return axiosClient.post(url, data);
  },
};

export default memberApi;
