import axiosClient from "./axiosClient";

const eventActivityUrl = `/event-activity`;

const eventActivityApi = {
  getByEventId: (eventId: number) => {
    const url = `${eventActivityUrl}/get-by-event-id/${eventId}`;
    return axiosClient.get(url);
  },
};

export default eventActivityApi;
