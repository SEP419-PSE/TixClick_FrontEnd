export interface TicketResponse {
  eventId: number;
  eventActivityId: number;
  ticketPurchaseId: number;
  eventName: string;
  eventDate: Date;
  eventStartTime: string;
  location: string;
  price: number;
  seatCode: null;
  ticketType: string;
  qrCode: string;
  zoneName: null;
  quantity: number;
  ishaveSeatmap: boolean;
  logo: string;
  banner: string;
}
export interface TicketPurchaseRequest {
  zoneId: number;
  seatId: number;
  eventActivityId: number;
  ticketId: number;
  eventId: number;
  quantity: number;
}

export interface TicketCheckin {
  ticketType: string;
  price: number;
  checkedIn: number;
  total: number;
  percentage: number;
}

export interface ChangeTicket {
  ticketPurchaseId: number;
  caseTicket: string;
}
