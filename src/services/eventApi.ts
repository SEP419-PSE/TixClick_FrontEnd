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
  update: (data: FormData) => {
    const url = `${baseURL}/update`;
    return axiosClient.put(url, data, {
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
  search: (params: {
    startDate?: string;
    endDate?: string;
    eventType?: string;
    eventName?: string;
    eventCategory?: string[];
    maxPrice?: number;
  }) => {
    const queryParams = new URLSearchParams();

    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.eventType) queryParams.append("eventType", params.eventType);
    if (params.eventName) queryParams.append("eventName", params.eventName);
    if (params.eventCategory && params.eventCategory.length > 0)
      queryParams.append("eventCategory", params.eventCategory.join(","));
    queryParams.append("minPrice", "0"); // luôn có minPrice
    if (params.maxPrice !== undefined)
      queryParams.append("maxPrice", params.maxPrice.toString());

    const url = `${baseURL}/filter?${queryParams.toString()}`;
    return axiosClient.get(url);
  },
  getAllByCompany: (companyId: number) => {
    const url = `${baseURL}/dashboard/${companyId}`;
    return axiosClient.get(url);
  },
  getRevenue: (eventId: number) => {
    const url = `${baseURL}/dashboard/event-activity/${eventId}`;
    return axiosClient.get(url);
  },
  getCheckIn: (eventActivityId: number) => {
    const url = `${baseURL}/checkin/ticket-type/${eventActivityId}`;
    return axiosClient.get(url);
  },
  getSummary: (eventId: number) => {
    const url = `${baseURL}/summary/${eventId}`;
    return axiosClient.get(url);
  },
  getWeekend: () => {
    const url = `${baseURL}/consumer/weekend`;
    return axiosClient.get(url);
  },
  getMonth: (month: number) => {
    const url = `${baseURL}/consumer/month/${month}`;
    return axiosClient.get(url);
  },
  getByCategory: (eventCategoryId: number, status: string) => {
    const url = `${baseURL}/consumer/event-category/${eventCategoryId}?status=${status}`;
    return axiosClient.get(url);
  },
  getTop10: () => {
    const url = `${baseURL}/consumer/top-10`;
    return axiosClient.get(url);
  },
};

export default eventApi;
