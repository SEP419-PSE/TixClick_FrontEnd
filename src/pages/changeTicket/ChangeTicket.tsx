import { useLocation } from "react-router";
import Header from "../../components/Header/Header";
import { OrderResponse } from "../../interface/ticket/Ticket";
import { useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { formatMoney, parseSeatCode } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setTicketPurchase } from "../../redux/features/ticketPurchase/ticketPurchaseSlice";

const ChangeTicket = () => {
  const location = useLocation();
  const state: OrderResponse = location.state;
  const oldTicketPurchase = useAppSelector((state) => state.ticketPurchase);
  const dispatch = useAppDispatch();

  const handleToggle = (ticketId: number, checked: boolean) => {
    const updatedIds = checked
      ? [...oldTicketPurchase.ticketPurchaseId, ticketId]
      : oldTicketPurchase.ticketPurchaseId.filter((id) => id !== ticketId);

    // Tìm danh sách vé đã được chọn theo ID
    const selectedTickets = state.ticketPurchases.filter((ticket) =>
      updatedIds.includes(ticket.ticketPurchaseId)
    );

    // Tính lại quantity dựa trên seatCode
    const newQuantity = selectedTickets.reduce((acc, ticket) => {
      // Nếu có ghế thì cộng 1, nếu không thì cộng số lượng thực tế
      return acc + (ticket.seatCode ? 1 : ticket.quantity);
    }, 0);

    dispatch(
      setTicketPurchase({
        orderCode: state.orderCode,
        ticketPurchaseId: updatedIds,
        quantity: newQuantity,
      })
    );
  };

  console.log(JSON.stringify(oldTicketPurchase, null, 2));
  return (
    <div className="mt-20 px-4 lg:px-14">
      <Header />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Danh sách vé đã mua trong đơn hàng: {state.orderCode}
        </h2>
        {state.ticketPurchases.map((ticket) => (
          <div
            key={ticket.ticketPurchaseId}
            className="flex items-center gap-4 p-4 border rounded-xl shadow-sm"
          >
            <Checkbox
              id={`ticket-${ticket.ticketPurchaseId}`}
              checked={oldTicketPurchase.ticketPurchaseId.includes(
                ticket.ticketPurchaseId
              )}
              onCheckedChange={(checked) =>
                handleToggle(ticket.ticketPurchaseId, !!checked)
              }
            />
            <label
              htmlFor={`ticket-${ticket.ticketPurchaseId}`}
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">{ticket.ticketType}</span>
              <span className="text-sm text-muted-foreground">
                {ticket.zoneName} - {parseSeatCode(ticket.seatCode)}
              </span>
              <span className="text-sm text-muted-foreground">
                Số lượng: {ticket.quantity} - Giá: {formatMoney(ticket.price)}
              </span>
            </label>
          </div>
        ))}

        <div className="mt-4 text-sm text-muted-foreground">
          Vé đã chọn:{" "}
          {oldTicketPurchase.ticketPurchaseId.join(", ") || "Không có"}
        </div>
      </div>
    </div>
  );
};

export default ChangeTicket;
