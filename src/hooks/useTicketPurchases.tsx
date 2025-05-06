import { useEffect, useState } from "react";
import { TicketResponse } from "../interface/ticket/Ticket";
import ticketPurchase from "../services/TicketPurchase/ticketPurchase";

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
};

const useTicketsPurchases = () => {
  const [ticketPurchases, setTicketPurchases] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 3,
  });

  const fetchTicketPurchases = async (pageToFetch: number) => {
    setLoading(true);
    try {
      const res = await ticketPurchase.getAll(pageToFetch);
      const result = res.data.result;

      setTicketPurchases(result.items || []);
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalElements: result.totalElements,
        pageSize: result.pageSize,
      });
    } catch (error) {
      console.error("Lỗi fetch ticket purchases:", error);
      setTicketPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketPurchases(page);
  }, [page]);

  return {
    ticketPurchases,
    loading,
    pagination,
    page,
    setPage,
    refetch: () => fetchTicketPurchases(page),
  };
};

export default useTicketsPurchases;
