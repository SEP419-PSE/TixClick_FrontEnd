import { useRef } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import Top0Img from "../../assets/number-0-svgrepo-com.svg";
import Top1Img from "../../assets/number-1-svgrepo-com.svg";
import Top2Img from "../../assets/number-2-svgrepo-com.svg";
import Top3Img from "../../assets/number-3-svgrepo-com.svg";
import Top4Img from "../../assets/number-4-svgrepo-com.svg";
import Top5Img from "../../assets/number-5-svgrepo-com.svg";
import Top6Img from "../../assets/number-6-svgrepo-com.svg";
import Top7Img from "../../assets/number-7-svgrepo-com.svg";
import Top8Img from "../../assets/number-8-svgrepo-com.svg";
import Top9Img from "../../assets/number-9-svgrepo-com.svg";
import Top10Img from "../../assets/number_10.svg";
import { EventForConsumer } from "../../interface/EventInterface";
import { NavLink } from "react-router";
const top10Img = [
  Top1Img,
  Top2Img,
  Top3Img,
  Top4Img,
  Top5Img,
  Top6Img,
  Top7Img,
  Top8Img,
  Top9Img,
  Top10Img,
];

type Props = {
  data: EventForConsumer[];
};

const Top10Event: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="my-10 mx-4 lg:mx-14">
      <div className="sm:text-sm md:text-base font-bold text-white my-2">
        Top 10 sự kiện nổi bật
      </div>
      <div className="relative">
        <div
          className="flex gap-4 overflow-x-scroll lg:overflow-hidden "
          ref={containerRef}
        >
          {data.map((events, index) => (
            <div key={index} className="flex items-center">
              <NavLink to={`/event-detail/${events.eventId}`}>
                <div className="lg:relative lg:flex group w-[340px] overflow-hidden cursor-pointer rounded-lg">
                  <img
                    src={top10Img[index]}
                    className="w-12 top-2 max-lg:hidden lg:absolute z-10"
                  />
                  <img
                    src={events.bannerURL}
                    className="rounded-lg w-full lg:group-hover:opacity-50 transition-all duration-300"
                  />
                  <div className="lg:absolute hidden inset-0 lg:flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
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

export default Top10Event;
