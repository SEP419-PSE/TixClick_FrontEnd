import axios from "axios";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast, Toaster } from "sonner";
import CustomDivider from "../components/Divider/CustomDivider";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import type { EventDetailResponse } from "../interface/EventInterface";
import { formatDateVietnamese, formatMoney, formatTimeFe } from "../lib/utils";
import eventApi from "../services/eventApi";
import ticketMappingApi from "../services/ticketMappingApi";
import useWebSocket from "../hooks/useWebSocket";

const ticketPurchaseApi = {
  createTicketPurchase: async (data: any, accessToken: string) => {
    try {
      console.log("Data purchase:", data);
      const response = await fetch(
        "https://tixclick.site/api/ticket-purchase/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      console.log("response", response);

      if (!response.ok) {
        throw new Error("Failed to create ticket purchase");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating ticket purchase:", error);
      throw error;
    }
  },
};

export interface TicketResponse {
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

export interface TicketPurchaseRequest {
  ticketPurchaseRequests: TicketPurchaseRequestElement[];
}

export interface TicketPurchaseRequestElement {
  zoneId: number;
  seatId: number;
  eventActivityId: number;
  ticketId: number;
  eventId: number;
  quantity: number;
}

const TicketBookingNoneSeatmap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const activityEventId = searchParams.get("eventActivityId");
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [eventInfor, setEventInfor] =
    useState<
      Pick<
        EventDetailResponse,
        "eventName" | "eventActivityDTOList" | "locationName"
      >
    >();
  const [isLoading, setIsLoading] = useState(false);
  const message = useWebSocket();

  const fetchTickets = async () => {
    try {
      const ticketResponse = await ticketMappingApi.getAllByAcitivityEventId(
        Number(activityEventId)
      );
      // console.log(ticketResponse);
      if (ticketResponse.data.result.length !== 0) {
        const updatedTickets = ticketResponse.data.result.map(
          (ticket: TicketResponse) => ({
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
  useEffect(() => {
    fetchTickets();
    setTotalQuantity(0);
  }, [activityEventId, message]);

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

  const createTicketPurchase = async () => {
    setIsLoading(true);

    const ticketPurchaseRequest: TicketPurchaseRequest = {
      ticketPurchaseRequests: tickets
        .filter(
          (ticket) => ticket.purchaseQuantity && ticket.purchaseQuantity > 0
        )
        .map((ticket) => ({
          ticketId: ticket.ticket.ticketId,
          quantity: ticket.purchaseQuantity as number,
          eventId: ticket.ticket.eventId,
          eventActivityId: Number(activityEventId),
          seatId: 0,
          zoneId: 0,
        })),
    };

    try {
      console.log("Đang gửi yêu cầu mua vé:", ticketPurchaseRequest);

      // Store the ticket purchase request in localStorage
      localStorage.setItem(
        "ticketPurchaseRequest",
        JSON.stringify(ticketPurchaseRequest)
      );

      // Call the API to create the ticket purchase
      const response = await ticketPurchaseApi.createTicketPurchase(
        ticketPurchaseRequest,
        localStorage.getItem("accessToken") || ""
      );

      console.log("Ticket purchase response:", response);

      // Store the full purchase response in localStorage
      localStorage.setItem("purchaseResponse", JSON.stringify(response));

      // Prepare selected seats data for the payment page
      const selectedSeats = tickets
        .filter(
          (ticket) => ticket.purchaseQuantity && ticket.purchaseQuantity > 0
        )
        .map((ticket) => ({
          ticketId: ticket.ticket.ticketId,
          typeName: ticket.ticket.ticketName,
          sectionName: "General",
          seatLabel: "Non-reserved",
          formattedPrice: formatMoney(ticket.ticket.price),
          price: ticket.ticket.price,
          quantity: ticket.purchaseQuantity,
        }));

      // Store event information for the payment page
      const eventInfo = {
        id: eventId,
        activityId: activityEventId,
        name: eventInfor?.eventName,
        location: eventInfor?.locationName,
        date:
          formatDateVietnamese(
            eventInfor?.eventActivityDTOList
              ?.find((x) => x.eventActivityId == Number(activityEventId))
              ?.dateEvent.toString()
          ) +
          " - " +
          formatTimeFe(
            eventInfor?.eventActivityDTOList?.find(
              (x) => x.eventActivityId == Number(activityEventId)
            )?.startTimeEvent
          ),
      };

      // Store all the necessary data in localStorage
      localStorage.setItem(
        "selectedSeats",
        JSON.stringify({
          eventInfo,
          seats: selectedSeats,
          totalAmount: totalPrice,
          apiResponses: {
            purchase: ticketPurchaseRequest,
            purchaseResponse: response,
          },
        })
      );

      localStorage.setItem("eventInfo", JSON.stringify(eventInfo));
      localStorage.setItem("totalPrice", totalPrice.toString());
      localStorage.setItem("totalQuantity", totalQuantity.toString());

      // Navigate to payment page with the purchase response
      navigate(`/payment?eventId=${eventId}`, {
        state: {
          ticketPurchaseRequest,
          eventInfo,
          totalPrice,
          totalQuantity,
          purchaseResponse: response,
        },
      });

      toast.success("Đặt vé thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Lỗi từ server không xác định";
        console.error("Lỗi Axios:", errorMessage, error.response?.data);

        toast.error(`Lỗi khi mua vé: ${errorMessage}`);
      } else {
        console.error("Lỗi không phải Axios:", error);
        toast.error("Có lỗi xảy ra khi mua vé");
      }
    } finally {
      setIsLoading(false);
    }
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
            onClick={createTicketPurchase}
            className={`w-full ${
              totalPrice != 0
                ? "bg-pse-green text-white"
                : "bg-white text-pse-gray"
            }  font-semibold hover:bg-opacity-70 transition-all duration-300`}
            disabled={totalPrice != 0 || isLoading ? false : true}
          >
            {isLoading
              ? "Đang xử lý..."
              : totalPrice != 0
              ? `Tiếp tục - ${formatMoney(totalPrice)}`
              : "Vui lòng chọn vé"}
          </Button>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default TicketBookingNoneSeatmap;
