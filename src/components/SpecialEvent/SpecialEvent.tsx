import { useRef } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { NavLink } from "react-router";
import { EventForConsumer } from "../../interface/EventInterface";

// const list = [SE1, SE2, SE3, SE4, SE5, SE6, SE7, SE8];

type Props = {
  specialEvents: EventForConsumer[];
};

const SpecialEvent: React.FC<Props> = ({ specialEvents }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -948, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 948, behavior: "smooth" });
    }
  };
  return (
    <div className="my-10 mx-4 lg:mx-14">
      <div className="sm:text-sm md:text-base font-bold text-white my-2">
        Sự kiện đặc biệt
      </div>
      <div className="relative">
        <div
          className="flex gap-4 overflow-x-scroll lg:overflow-hidden "
          ref={containerRef}
        >
          {specialEvents.map((events, index) => (
            <div key={index}>
              <NavLink to={`/event-detail/${events.eventId}`}>
                <div className="lg:relative group w-[300px] overflow-hidden cursor-pointer">
                  <img
                    src={events.logoURL}
                    className="rounded-lg w-full lg:group-hover:opacity-50 transition-all duration-300"
                  />
                  <div className="lg:absolute inset-0 flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-[14px] font-semibold px-4 py-2 rounded-sm bg-pse-green-third">
                      Mua vé
                    </span>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}

          <div
            onClick={scrollLeft}
            className="absolute hidden lg:block bg-black/60 top-[42%] cursor-pointer p-3 left-0 rounded-r-lg"
          >
            <FaAngleLeft size={18} />
          </div>
          <div
            onClick={scrollRight}
            className="absolute hidden lg:block bg-black/60 top-[42%] cursor-pointer p-3 right-0 rounded-l-lg"
          >
            <FaAngleRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialEvent;
