import { TicketPurchaseRequest } from "../../pages/TicketBookingNoneSeatmap";
import axiosClient from "../axiosClient";

const ticketPurchaseUrl = "/ticket-purchase";

const ticketPurchase = {
  create: () => {
    const url = `${ticketPurchaseUrl}/create`;
    return axiosClient.post(url);
  },
  createPurchase: (data: TicketPurchaseRequest) => {
    const url = `${ticketPurchaseUrl}/create`;
    return axiosClient.post(url, data);
  },

};

export default ticketPurchase;
