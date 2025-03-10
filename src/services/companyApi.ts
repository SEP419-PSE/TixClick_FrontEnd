import axiosClient from "./axiosClient";

const baseUrl = "/company";
const companyApi = {
  create: (data: FormData) => {
    const url = `${baseUrl}/create`;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  createDocumentCompany: (data: FormData) => {
    const url = `/company-document/create`;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default companyApi;
