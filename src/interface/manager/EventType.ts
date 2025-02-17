export interface EventType {
    id: number;
    name: string;
    status: "pending" | "approved" | "rejected";
    date: string;
  };

export interface Event  {
    name: string;
    date: string;
    location: string;
    attendees: number;
    priceRange: string;
    status: "pending" | "approved" | "rejected";
  };
  
  