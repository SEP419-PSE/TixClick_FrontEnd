import {
  CreateMemberRequest,
  MemberStatus,
} from "../interface/consumer/Member";
import axiosClient from "./axiosClient";

const memberUrl = `/member`;

const memberApi = {
  create: (data: CreateMemberRequest) => {
    const url = `${memberUrl}/create`;
    return axiosClient.post(url, data);
  },
  getMembers: (companyId: number) => {
    const url = `${memberUrl}/get/${companyId}`;
    return axiosClient.get(url);
  },
  editSubRole: (id: number, subrole: string) => {
    const url = `${memberUrl}/update/${id}/${subrole}`;
    return axiosClient.put(url);
  },
  changeStatus: (id: number, status: MemberStatus) => {
    const url = `${memberUrl}/update-status/${id}/${status}`;
    return axiosClient.put(url);
  },
};

export default memberApi;
