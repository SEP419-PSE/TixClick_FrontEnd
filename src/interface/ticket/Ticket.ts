export interface TicketResponse {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventStartTime: string;
  location: string | null;
  price: number;
  seatCode: string | null;
  ticketType: string;
  qrCode: string | null;
  zoneName: string | null;
  quantity: number;
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
