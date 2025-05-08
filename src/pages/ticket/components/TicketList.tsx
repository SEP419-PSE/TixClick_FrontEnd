import React from "react";
import { Card } from "../../../components/ui/card";
import { eventTypes } from "../../../constants/constants";
import { TicketResponse } from "../../../interface/ticket/Ticket";
import { formatDateVietnamese, formatTimeFe } from "../../../lib/utils";
type Props = {
  clickOpenPopup: () => void
  ticketList: TicketResponse[]
  onClickSelectTicket: (ticket: TicketResponse) => void
}

const TicketList: React.FC<Props> = ({
  clickOpenPopup,
  ticketList = [], 
  onClickSelectTicket,
}) => {
  const tickets = Array.isArray(ticketList) ? ticketList : []

  return (
    <div className="mx-20 my-5">
      {tickets.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No tickets available</div>
      ) : (
        tickets.map((ticket, index) => (
          <Card
            key={ticket.ticketId || index} 
            onClick={() => onClickSelectTicket(ticket)}
            className="relative flex items-center px-6 py-3 mb-10 w-auto shadow-box hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-r-full"></div>
            <div className="flex gap-4 items-center">
              <img src={ticket.banner || "/placeholder.svg"} alt="" className="w-32 h-16 rounded-md" />
              <div>
                <div className="font-semibold text-black text-xl w-60 truncate">{ticket.eventName}</div>
                <div className="flex items-center gap-1">
                  <span className="text-pse-gray font-medium">{ticket.ticketType}</span>
                  <p
                    style={{
                      backgroundColor: eventTypes.find((x) => x.name === "Music")?.color,
                    }}
                    className="text-white text-xs text-center font-medium rounded-md w-fit px-2 py-1"
                  >
                    {eventTypes.find((x) => x.name === "Music")?.vietnamName}
                  </p>
                </div>
              </div>
            </div>
            <div className="ml-auto w-80">
              <p className="w-full truncate">
                <span className="text-pse-green font-semibold">FPT University</span>
                {" - "}
                {ticket.location}
              </p>
              <p className="w-full truncate">
                {formatTimeFe(ticket.eventStartTime)}
                {" - "}
                <span className="font-semibold">{formatDateVietnamese(ticket.eventDate.toString())}</span>
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation() // Prevent card click event
                clickOpenPopup()
              }}
              className="ml-auto text-pse-green font-bold underline-offset-4 underline"
            >
              Chi tiết
            </button>
            <div className="absolute right-1 top-1/2 translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-l-full"></div>
          </Card>
        ))
      )}
    </div>
  )
}

export default TicketList