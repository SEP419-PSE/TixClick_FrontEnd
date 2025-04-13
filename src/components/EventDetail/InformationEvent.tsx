import React from "react";
import { CiCalendar } from "react-icons/ci";
import { FaMapMarkerAlt } from "react-icons/fa";
import { EventDetailResponse } from "../../interface/EventInterface";
import {
  formatDateVietnamese,
  formatMoney,
  formatTimeFe,
} from "../../lib/utils";
import { NavLink, } from "react-router";

export type EventDetailProps = {
  eventDetail: Partial<EventDetailResponse> | undefined;
};

const InformationEvent: React.FC<EventDetailProps> = ({ eventDetail }) => {
  return (
    <div className="mx-3 mt-24 mb-8 lg:flex lg:justify-center bg-pse-black ">
      <div>
        <img
          src={eventDetail?.bannerURL}
          loading="lazy"
          className="w-full lg:w-[614px] lg:h-[350px]"
        />
      </div>
      <div className="relative bg-pse-black-light p-4 leading-10 shadow-box min-w-[600px]">
        <p className="font-extrabold text-[18px] leading-6">
          {eventDetail?.eventName}
        </p>
        <p className="flex items-center text-pse-green-second font-bold">
          <span>
            <CiCalendar size={18} color="white" className="mr-1" />
          </span>
          <div>
            {eventDetail?.eventActivityDTOList != undefined &&
              formatTimeFe(eventDetail.eventActivityDTOList[0].startTimeEvent) +
                ` - ` +
                formatTimeFe(eventDetail.eventActivityDTOList[0].endTimeEvent) +
                `, ` +
                formatDateVietnamese(
                  eventDetail.eventActivityDTOList[0].dateEvent.toString()
                )}
          </div>
        </p>
        <p className="relative flex items-center text-[#c4c4cf]">
          <span>
            <FaMapMarkerAlt size={18} className="mr-1" color="white" />
          </span>
          <div className="text-pse-green-second font-semibold">
            {eventDetail?.locationName}
          </div>
          <div className="absolute top-5 left-5 truncate">
            {eventDetail?.location}
          </div>
        </p>
        <div className="max-[1150px]:hidden absolute bottom-28 w-[95%] h-[1px] bg-white rounded-full">
          <div className="text-[20px] font-extrabold my-2">
            Giá từ{" "}
            <span className="text-pse-green-second">
              {formatMoney(eventDetail?.price)}
            </span>
          </div>
          <NavLink
            to={{
              pathname: eventDetail?.haveSeatMap
                ? "booking-ticket"
                : "booking-ticket-no-seatmap",
              search: `?eventId=${eventDetail?.eventId}&eventActivityId=${eventDetail?.eventActivityDTOList?.[0].eventActivityId}`,
            }}
          >
            <button className="bg-pse-green-second hover:bg-pse-green-third text-white w-full rounded-lg font-semibold transition-all duration-500">
              Mua vé ngay
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default InformationEvent;
