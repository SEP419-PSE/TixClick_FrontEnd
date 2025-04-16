import axiosClient from "./axiosClient";

const transactionUrl = "/transaction";

const transactionApi = {
  getByEventId: (eventId: number) => {
    const url = `${transactionUrl}/total_transaction_company/${eventId}`;
    return axiosClient.get(url);
  },
};

export default transactionApi;
