export interface CreateEvent {
  eventName: string;
  location: string;
  typeEvent: string;
  description: string;
  categoryId: string;
  files: ImageEvent[];
}

export interface EventType {
  id: number;
  name: string;
  englishName?: string;
}

interface ImageEvent {
  file: File | null;
}

export interface EventForConsumer {
  bannerURL: string;
  eventId: number;
  logoURL: string;
}

export interface EventDetailResponse {
  eventId: number;
  eventName: string;
  locationName: string;
  location: string;
  status: EventStatus;
  typeEvent: string;
  countView: number;
  logoURL: string;
  bannerURL: string;
  description: string;
  startDate: string;
  endDate: string;
  urlOnline: null;
  eventCategory: string;
  eventCategoryId: number;
  countTicketSold: null;
  totalRevenue: null;
  haveSeatMap: boolean;
  eventActivityDTOList: EventActivityDTOList[];
}

export interface EventActivityDTOList {
  eventActivityId: number;
  activityName: string;
  dateEvent: Date;
  startTimeEvent: string;
  endTimeEvent: string;
  startTicketSale: Date;
  endTicketSale: Date;
  seatMapId: number;
  eventId: number;
  createdBy: number;
  tickets: Ticket[];
}

export interface Ticket {
  ticketId: number;
  ticketName: string;
  ticketCode: string;
  createdDate: Date;
  price: number;
  minQuantity: number;
  maxQuantity: number;
  status: boolean;
  textColor: string;
  seatBackgroundColor: string;
  accountId: number;
  eventId: number;
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPOREVAL",
  SCHEDULED = "SCHEDULED",
  ON_GOING = "ON_GOING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}
