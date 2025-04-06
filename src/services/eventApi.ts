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
  countView: (eventId: number) => {
    const url = `${baseURL}/count-view/${eventId}`;
    return axiosClient.post(url);
  },
  search: (
    startDate?: string,
    endDate?: string,
    eventType?: string,
    eventName?: string,
    eventCategory?: string[]
  ) => {
    const url = `${baseURL}/filter?startDate=${startDate}&endDate=${endDate}&eventType=${eventType}&eventName=${eventName}&eventCategory=${eventCategory}`;
    return axiosClient.get(url);
  },
};

export default eventApi;
