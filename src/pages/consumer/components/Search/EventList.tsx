import React from "react";
import Img from "../../../../assets/1c7973947f9b163b2376dc6bdc0c6540.jpg";
import { EventDetailResponse } from "../../../../interface/EventInterface";
import { formatDateVietnamese, formatMoney } from "../../../../lib/utils";
import { CiCalendar } from "react-icons/ci";
import EmptyList from "../../../../components/EmptyList/EmptyList";

type Props = {
  eventList: EventDetailResponse[];
};

const EventList: React.FC<Props> = ({ eventList }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
      {eventList.length == 0 && (
        <div className="col-span-2 md:col-span-4">
          <EmptyList label="Không có sự kiện phù hợp" />
        </div>
      )}
      {eventList.map((event) => (
        <div key={event.bannerURL} className="flex-col space-y-1">
          <img
            src={event.bannerURL}
            alt="Ảnh sự kiện"
            className=" rounded-md"
          />
          <div className="font-bold">{event.eventName}</div>
          <div className="text-pse-green font-semibold">
            Từ {formatMoney(event.price)}
          </div>
          <div className="flex items-center gap-1">
            <CiCalendar size={20} />
            <p>
              {formatDateVietnamese(
                event.eventActivityDTOList[0].dateEvent.toString()
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
