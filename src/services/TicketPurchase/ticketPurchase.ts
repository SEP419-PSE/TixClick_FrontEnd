import { ChangeTicket } from "../../interface/ticket/Ticket";
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
  changeTicket(data: TicketPurchaseRequest, params: ChangeTicket) {
    const url = `/payment/change-ticket`;
    return axiosClient.post(url, data, { params: params });
  },
};

export default ticketPurchase;
