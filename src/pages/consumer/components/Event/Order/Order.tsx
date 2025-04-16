import { useEffect, useState } from "react";
import { OrderList } from "./OrderList";
import { TransactionResponse } from "../../../../../interface/company/Transaction";
import { useParams } from "react-router";
import transactionApi from "../../../../../services/transactionApi";

const Order = () => {
  const { eventId } = useParams();
  const [transactions, setTransactions] = useState<TransactionResponse[]>();

  const fetchTransaction = async () => {
    try {
      const response = await transactionApi.getByEventId(Number(eventId));
      if (response.data.result.length != 0) {
        setTransactions(response.data.result);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log(error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [eventId]);
  return (
    <div className="p-6 bg-white w-auto min-h-screen">
      <p className="font-bold text-foreground text-3xl"></p>
      <OrderList transactions={transactions} />
    </div>
  );
};

export default Order;
