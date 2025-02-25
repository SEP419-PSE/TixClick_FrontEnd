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
