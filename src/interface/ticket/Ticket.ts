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