import axiosClient from "./axiosClient";

const baseURL = "/event";

const eventApi = {
  create: (data: FormData) => {
    const url = `${baseURL}/create`;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  approveEvent: (eventId: number) => {
    const url = `${baseURL}/request-approval/${eventId}`;
    return axiosClient.get(url);
  },
  getEventList: () => {
    const url = `${baseURL}/consumer/scheduled`;
    return axiosClient.get(url);
  },
  getEventDetail: (id: number) => {
    const url = `${baseURL}/consumer/${id}`;
    return axiosClient.get(url);
  },
};

export default eventApi;
