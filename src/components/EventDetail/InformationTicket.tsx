import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { EventDetailProps } from "./InformationEvent";
import {
  formatDateVietnamese,
  formatMoney,
  formatTimeFe,
} from "../../lib/utils";
import { NavLink } from "react-router";

// const tickets = [
//   {
//     id: 1,
//     time: "19:00 - 21:00",
//     date: "16 Tháng 02, 2025",
//     ticketType: [
//       {
//         type: "VIP1",
//         price: "6.500.000",
//       },
//       {
//         type: "VIP2",
//         price: "6.000.000",
//       },
//       {
//         type: "VIP3",
//         price: "5.500.000",
//       },
//     ],
//   },
//   {
//     id: 2,
//     time: "19:00 - 21:00",
//     date: "15 Tháng 02, 2025",
//     ticketType: [
//       {
//         type: "VIP1",
//         price: "6.500.000",
//       },
//       {
//         type: "VIP2",
//         price: "6.000.000",
//       },
//       {
//         type: "VIP3",
//         price: "5.500.000",
//       },
//     ],
//   },
// ];

const InformationTicket: React.FC<EventDetailProps> = ({ eventDetail }) => {
  const [activeShowTicket, setActiveShowTicket] = useState<number | null>(null);

  const onChangeActiveTicket = (id: number) => {
    setActiveShowTicket(activeShowTicket === id ? null : id);
  };

  return (
    <div className="p-3 bg-white/80 ">
      <div className="bg-pse-black-light space-y-4 rounded-md w-full max-w-[700px] mx-auto">
        <div className="p-3 border-b text-[18px] text-pse-green-second border-white font-extrabold">
          Thông tin vé
        </div>
        {eventDetail?.eventActivityDTOList?.map((activity) => (
          <div key={activity.eventActivityId} className="border-b border-white">
            <div
              onClick={() => onChangeActiveTicket(activity.eventActivityId)}
              className="px-3 pb-3 font-semibold flex items-center cursor-pointer"
            >
              <span>
                <MdExpandMore
                  size={22}
                  // className={`mr-2 transition-all duration-500 ${
                  //   activeShowTicket === ticket.id && "rotate-180"
                  // }`}
                />
              </span>
              <p className="flex flex-col">
                {formatTimeFe(activity.startTimeEvent)} -{" "}
                {formatTimeFe(activity.endTimeEvent)},{" "}
                <span>
                  {" "}
                  {formatDateVietnamese(activity.dateEvent.toString())}
                </span>
              </p>
              <NavLink
                className={"ml-auto"}
                to={`booking-ticket?eventId=${activity.eventId}&eventActivityId=${activity.eventActivityId}`}
              >
                <button className="ml-auto bg-pse-green-second text-white font-semibold hover:bg-pse-green-third px-4 py-2 rounded-md transition-all duration-300">
                  Mua vé ngay
                </button>
              </NavLink>
            </div>
            {activeShowTicket === activity.eventActivityId && (
              <div className="bg-black border-t border-white transition-all duration-500">
                <ul className="">
                  {activity.tickets?.map((ticket) => (
                    <li
                      key={ticket.ticketId}
                      className="odd:bg-pse-black-light/80 even:bg-pse-black-light/95 py-4 pl-11 pr-4 flex justify-between"
                    >
                      <span className="font-semibold">{ticket.ticketName}</span>
                      <span className="text-pse-green-second font-semibold ">
                        {formatMoney(ticket.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InformationTicket;
