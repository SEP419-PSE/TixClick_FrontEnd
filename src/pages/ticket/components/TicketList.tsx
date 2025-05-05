import { Card } from "../../../components/ui/card";
import { eventTypes } from "../../../constants/constants";
import React from "react";
import { TicketResponse } from "../../../interface/ticket/Ticket";
import { formatDateVietnamese, formatTimeFe } from "../../../lib/utils";
import { Ellipsis } from "lucide-react";

type Props = {
  clickOpenPopup: () => void;
  ticketList: TicketResponse[];
  onClickSelectTicket: (ticket: TicketResponse) => void;
};

const TicketList: React.FC<Props> = ({
  clickOpenPopup,
  ticketList,
  onClickSelectTicket,
}) => {
  return (
    <div className="mx-20 my-5">
      {ticketList.map((ticket) => (
        <Card
          onClick={() => onClickSelectTicket(ticket)}
          className="relative flex items-center px-6 py-3 mb-10 w-auto shadow-box hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-r-full"></div>
          <div className="flex gap-4 items-center">
            <img src={ticket.banner} alt="" className="w-32 h-16 rounded-md" />
            <div>
              <div className="font-semibold text-black text-xl w-60 truncate">
                {ticket.eventName}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-pse-gray font-medium">
                  {ticket.ticketType}
                </span>
                <p
                  style={{
                    backgroundColor: eventTypes.find(
                      (x) => x.id == ticket.eventCategoryId
                    )?.color,
                  }}
                  className="text-white text-xs text-center font-medium rounded-md w-fit px-2 py-1"
                >
                  {
                    eventTypes.find((x) => x.id == ticket.eventCategoryId)
                      ?.vietnamName
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="ml-auto w-80">
            <p className="w-full truncate">
              <span className="text-pse-green font-semibold">
                {ticket.locationName}
              </span>
              {" - "}
              {ticket.location}
            </p>
            <p className="w-full truncate">
              {formatTimeFe(ticket.eventStartTime)}
              {" - "}
              <span className="font-semibold">
                {formatDateVietnamese(ticket.eventDate.toString())}
              </span>
            </p>
          </div>
          <button
            onClick={clickOpenPopup}
            className="ml-auto text-pse-green font-bold underline-offset-4 underline"
          >
            Chi tiết
          </button>
          <div className="absolute right-1 top-1/2 translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-l-full"></div>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;
