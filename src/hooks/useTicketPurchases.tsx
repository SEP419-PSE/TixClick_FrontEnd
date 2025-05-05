import { useEffect, useState } from "react";
import { TicketResponse } from "../interface/ticket/Ticket";
import ticketPurchase from "../services/TicketPurchase/ticketPurchase";

const useTicketsPurchases = () => {
  const [ticketPurchases, setTicketPurchases] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTicketPurchases = async () => {
    setLoading(true);
    try {
      const res = await ticketPurchase.getAll();
      if (res.data.result.length != 0) {
        setTicketPurchases(res.data.result);
      } else {
        setTicketPurchases(res.data.result);
      }
    } catch (error) {
      console.log(error);
      setTicketPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketPurchases();
  }, []);
  return { ticketPurchases, loading, refetch: fetchTicketPurchases };
};

export default useTicketsPurchases;
