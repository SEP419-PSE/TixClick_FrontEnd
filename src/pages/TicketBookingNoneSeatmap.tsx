import { Calendar, MapPin, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import CustomDivider from "../components/Divider/CustomDivider";
import { formatDateVietnamese, formatMoney, formatTimeFe } from "../lib/utils";
import { Input } from "../components/ui/input";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { useSearchParams } from "react-router";
import ticketMappingApi from "../services/ticketMappingApi";
import eventApi from "../services/eventApi";
import { EventDetailResponse } from "../interface/EventInterface";

interface Ticket {
  id: number;
  ticket: TicketClass;
  quantity: number;
  status: boolean;
  purchaseQuantity?: number;
}

interface TicketClass {
  ticketId: number;
  ticketName: string;
  ticketCode: string;
  createdDate: Date;
  price: number;
  minQuantity: number;
  maxQuantity: number;
  status: boolean;
  textColor: null;
  seatBackgroundColor: null;
  accountId: number;
  eventId: number;
}
const TicketBookingNoneSeatmap = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const activityEventId = searchParams.get("eventActivityId");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [eventInfor, setEventInfor] =
    useState<
      Pick<
        EventDetailResponse,
        "eventName" | "eventActivityDTOList" | "locationName"
      >
    >();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketResponse = await ticketMappingApi.getAllByAcitivityEventId(
          Number(activityEventId)
        );
        // console.log(ticketResponse);
        if (ticketResponse.data.result.length !== 0) {
          const updatedTickets = ticketResponse.data.result.map(
            (ticket: Ticket) => ({
              ...ticket,
              purchaseQuantity: 0,
            })
          );
          setTickets(updatedTickets);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTickets();
  }, [activityEventId]);

  useEffect(() => {
    const newTotal = tickets.reduce(
      (acc, ticket) =>
        acc + (ticket.purchaseQuantity || 0) * ticket.ticket.price,
      0
    );
    setTotalPrice(newTotal);
  }, [tickets]);

  useEffect(() => {
    const fetchEventInfor = async () => {
      const response = await eventApi.getEventDetail(Number(eventId));
      if (response.data.result.length != 0) {
        setEventInfor(response.data.result);
      }
    };
    fetchEventInfor();
  }, [eventId]);

  const handleIncreaseQuantity = (ticketId: number) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticket.ticketId === ticketId
          ? {
              ...ticket,
              purchaseQuantity: (ticket.purchaseQuantity || 0) + 1,
            }
          : ticket
      )
    );
    setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + 1);
  };

  const handleDecreaseQuantity = (ticketId: number) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticket.ticketId === ticketId
          ? {
              ...ticket,
              purchaseQuantity: Math.max((ticket.purchaseQuantity || 0) - 1, 0),
            }
          : ticket
      )
    );
    setTotalQuantity((prevTotalQuantity) => prevTotalQuantity - 1);
  };

  return (
    <div className="flex flex-col h-auto lg:min-h-screen lg:flex-row">
      <div className="lg:w-[80%]">
        <div className="text-center bg-pse-black-light py-4">Chọn vé</div>
        <div className="flex flex-col lg:w-[600px] mx-auto my-10">
          <div className="flex justify-between w-full bg-pse-green p-4 rounded-t-lg">
            <div className="font-bold">Loại vé</div>
            <div className="font-bold">Số lượng</div>
          </div>
          {tickets.map((ticket) => (
            <Card
              key={ticket.ticket.ticketId}
              className="flex justify-between items-center p-4 bg-transparent rounded-none last:rounded-b-lg "
            >
              <div>
                <div className="flex items-center gap-1 font-semibold text-base text-pse-green-second">
                  {ticket.ticket.ticketName}
                  <p className="text-xs text-pse-gray font-medium">
                    (Còn {ticket.quantity} vé )
                  </p>
                </div>
                <div className="text-white">
                  {formatMoney(ticket.ticket.price)}
                </div>
              </div>
              {ticket.quantity == 0 || ticket.status == false ? (
                <p className="bg-red-200 text-pse-error/80 flex w-fit h-fit px-2 py-1 rounded-md">
                  Hết vé
                </p>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleDecreaseQuantity(ticket.ticket.ticketId)
                    }
                    disabled={ticket.purchaseQuantity == 0 ? true : false}
                    className="bg-transparent border border-white"
                  >
                    -
                  </Button>
                  <Input
                    value={ticket.purchaseQuantity}
                    className="text-black w-[50px] text-center"
                    readOnly
                  />
                  <Button
                    onClick={() =>
                      handleIncreaseQuantity(ticket.ticket.ticketId)
                    }
                    disabled={
                      ticket.purchaseQuantity == ticket.ticket.maxQuantity
                    }
                    className={`${
                      ticket.purchaseQuantity == ticket.ticket.maxQuantity &&
                      "cursor-not-allowed"
                    } bg-transparent border border-white`}
                  >
                    +
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:ml-auto lg:h-screen lg:w-[20%] text-black bg-white p-6 shadow-md border border-gray-200">
        <div className="mb-4 space-y-4">
          <div className="text-[18px] font-semibold">
            {eventInfor?.eventName}
          </div>
          <div className="flex items-center gap-1 font-medium">
            <span>
              <Calendar
                size={20}
                fill="white"
                className="text-pse-green-second"
              />
            </span>
            {eventInfor?.eventActivityDTOList != undefined &&
              formatTimeFe(
                eventInfor.eventActivityDTOList.find(
                  (x) => x.eventActivityId == Number(activityEventId)
                )?.startTimeEvent
              ) +
                ` - ` +
                formatTimeFe(
                  eventInfor.eventActivityDTOList.find(
                    (x) => x.eventActivityId == Number(activityEventId)
                  )?.endTimeEvent
                ) +
                `, ` +
                formatDateVietnamese(
                  eventInfor.eventActivityDTOList
                    .find((x) => x.eventActivityId == Number(activityEventId))
                    ?.dateEvent.toString()
                )}
          </div>
          <div className="flex items-center gap-1">
            <span>
              <MapPin
                size={20}
                fill="white"
                className="text-pse-green-second"
              />
            </span>
            {eventInfor?.locationName}
          </div>
        </div>
        <CustomDivider />

        <div className="space-y-3">
          <h3 className="text-black font-semibold mb-4">Chú thích loại vé</h3>

          {tickets.map((ticket) => (
            <div
              key={ticket.ticket.ticketId}
              className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
            >
              <div>
                <div className="font-medium text-gray-900">
                  {ticket.ticket.ticketName}
                </div>
                <div className="text-sm text-gray-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(ticket.ticket.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto bg-pse-black-light text-white -mx-[26px] -my-[24px] p-4 pb-4">
          <div className="mb-2 flex items-center text-xs gap-1">
            <Ticket fill="white" className="text-pse-black-light" />
            {totalQuantity != 0 ? `x ${totalQuantity}` : "Chưa chọn vé nào"}
          </div>

          <Button
            className={`w-full ${
              totalPrice != 0
                ? "bg-pse-green text-white"
                : "bg-white text-pse-gray"
            }  font-semibold hover:bg-opacity-70 transition-all duration-300`}
            disabled={totalPrice != 0 ? false : true}
          >
            {totalPrice != 0
              ? `Tiếp tục - ${formatMoney(totalPrice)}`
              : "Vui lòng chọn vé"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketBookingNoneSeatmap;
