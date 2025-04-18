import { useEffect } from "react";
import TicketTable from "./CheckInTable";
import FilterCheckIn from "./FilterCheckIn";
import eventApi from "../../../../../services/eventApi";
import { useParams } from "react-router";
const tickets = [
  { type: "Vé VIP", price: 1200000, total: 100, checkedIn: 85 },
  { type: "Vé Thường", price: 450000, total: 300, checkedIn: 150 },
  { type: "Vé Sinh viên", price: 300000, total: 50, checkedIn: 15 },
];

const CheckIn = () => {
  const { eventId } = useParams();

  const fetchCheckin = async () => {
    try {
      const response = await eventApi.getCheckIn(Number(eventId));
      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <FilterCheckIn />
      <div className="my-6">
        <TicketTable data={tickets} />
      </div>
    </div>
  );
};

export default CheckIn;
