import { useEffect, useRef, useState } from "react";
import { EventForConsumer } from "../../interface/EventInterface";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { formatDateVietnamese, formatMoney } from "../../lib/utils";
import { CiCalendar } from "react-icons/ci";
import { NavLink } from "react-router";
import eventApi from "../../services/eventApi";
import { eventTypes } from "../../constants/constants";

type Props = {
  eventCategoryId: number;
  status: string;
};

const EventsByCategory = ({ eventCategoryId, status }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEvents, setActiveEvents] = useState<EventForConsumer[]>();

  const fetchEvents = async () => {
    const response = await eventApi.getByCategory(eventCategoryId, status);
    if (response.data.code == 200) {
      setActiveEvents(response.data.result);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [eventCategoryId, status]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -1264, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 1264, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-4 my-10 lg:mx-14">
      <div className="sm:text-sm md:text-base font-bold">
        {eventTypes.find((type) => type.id === eventCategoryId)?.vietnamName}
      </div>
      <div className="relative">
        <div
          ref={containerRef}
          className=" pt-4 pb-2 flex overflow-x-auto lg:overflow-x-hidden gap-4"
        >
          {activeEvents?.map((item) => (
            <div key={item.eventId}>
              <NavLink to={`event-detail/${item.eventId}`}>
                <div className="lg:relative group w-[340px] overflow-hidden cursor-pointer">
                  <img
                    className="rounded-lg w-full lg:group-hover:opacity-50 transition-all duration-300"
                    src={item.bannerURL}
                  />

                  <div className="lg:absolute hidden inset-0 lg:flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-[14px] font-semibold px-4 py-2 rounded-sm bg-pse-green-third">
                      Mua vé
                    </span>
                  </div>
                </div>
              </NavLink>
              <div className="mt-2 text">{item.eventName}</div>
              <div className="text-pse-green-second font-semibold">
                Từ {formatMoney(item.minPrice)}
              </div>
              <div className="flex items-center gap-1">
                <span>
                  <CiCalendar size={18} />
                </span>
                {formatDateVietnamese(item.date)}
              </div>
              <div
                onClick={scrollLeft}
                className="absolute hidden lg:block bg-black/60 top-[33%] cursor-pointer p-3 left-0 rounded-r-lg"
              >
                <FaAngleLeft size={18} />
              </div>
              <div
                onClick={scrollRight}
                className="absolute hidden lg:block bg-black/60 top-[33%] cursor-pointer p-3 right-0 rounded-l-lg"
              >
                <FaAngleRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsByCategory;
