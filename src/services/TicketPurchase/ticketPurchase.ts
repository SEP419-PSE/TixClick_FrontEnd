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

  // unblockTicket: (ticketPurchaseId: number) => {
  //   const url = "/ticket-purchase/cancel";
  //   return axiosClient.post(url);
  // }
};

export default ticketPurchase;
