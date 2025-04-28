import { useEffect, useRef, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { NavLink } from "react-router";
import eventApi from "../../services/eventApi";
import { EventForConsumer } from "../../interface/EventInterface";
import { formatDateVietnamese, formatMoney } from "../../lib/utils";

const TabEvent = () => {
  const nowMonth = new Date().getMonth() + 1;
  const [activeTab, setActiveTab] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [eventWeek, setEventWeek] = useState<EventForConsumer[]>([]);
  const [eventMonth, setEventMonth] = useState<EventForConsumer[]>([]);
  const [activeEvents, setActiveEvents] = useState<EventForConsumer[]>([]);

  const fetchEventWeekend = async () => {
    const response = await eventApi.getWeekend();
    // console.log(response);
    if (response.data.result.length != 0) {
      setEventWeek(response.data.result);
      setActiveEvents(response.data.result);
    }
  };

  const fetchEventMoth = async () => {
    const response = await eventApi.getMonth(nowMonth);
    // console.log(response);
    if (response.data.result.length != 0) {
      setEventMonth(response.data.result);
    }
  };

  useEffect(() => {
    fetchEventWeekend();
    fetchEventMoth();
  }, [nowMonth]);

  const changeActiveEvent = () => {
    if (activeTab === 1) {
      setActiveEvents(eventWeek);
    } else {
      setActiveEvents(eventMonth);
    }
  };

  useEffect(() => {
    changeActiveEvent();
  }, [activeTab]);

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

  const tabs = [
    { id: 1, label: "Tuần này" },
    { id: 2, label: "Tháng này" },
  ];

  return (
    <div className="mx-4 my-10 lg:mx-14">
      {/* Tab Headers */}
      <div className="flex gap-4 border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 sm:text-sm md:text-base font-bold focus:outline-none ${
              activeTab === tab.id
                ? "text-pse-green border-b-2 border-pse-green  transition-all duration-300"
                : "text-white border-b-2 border-transparent hover:"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="relative">
        <div
          ref={containerRef}
          className=" pt-4 pb-2 flex overflow-x-auto lg:overflow-x-hidden gap-4"
        >
          {activeEvents.map((item) => (
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

export default TabEvent;
