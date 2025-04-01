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
  eventName: string;
  location: string;
  locationName: string;
  logoURL: string;
  bannerURL: string;
  companyURL: string;
  companyName: string;
  descriptionCompany: string;
  status: string;
  typeEvent: string;
  description: string;
  categoryId: string;
  eventActivityDTOList: EventActivityDTOList[];
  price: number;
  haveSeatMap: boolean;
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
}
