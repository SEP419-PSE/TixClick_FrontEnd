import { useRef } from "react";
import SE1 from "../../assets/008fe98bf531ad500181e4b4b9c1d4d5.webp";
import SE2 from "../../assets/0598952cf9656146d43efa084fc58d94.webp";
import SE3 from "../../assets/3867b8b5aa85507843dc0eec0bf49390.webp";
import SE4 from "../../assets/62e40cb66523799d70938ac814722a0d.webp";
import SE5 from "../../assets/a173fbbd1a2778c3cc8761feb31ff56d.webp";
import SE6 from "../../assets/a2eef8299ee0bc3ce3f1d9d3169f65da.webp";
import SE7 from "../../assets/a611bc0f0562598572a92225f62ec244.webp";
import SE8 from "../../assets/d6997bd78df37aa54e1b6283080e0909.webp";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const list = [SE1, SE2, SE3, SE4, SE5, SE6, SE7, SE8];

const SpecialEvent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -1120, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 1120, behavior: "smooth" });
    }
  };
  return (
    <div className="my-8 mx-4 lg:mx-14">
      <div className="text-[16px] my-2">Sự kiện đặc biệt</div>
      <div className="relative">
        <div
          className="flex gap-4 overflow-auto md:overflow-hidden"
          ref={containerRef}
        >
          {list.map((index) => (
            <img src={index} className="rounded-lg" />
          ))}
          <div
            onClick={scrollLeft}
            className="absolute hidden md:block bg-black/60 top-[50%] cursor-pointer p-2 left-0"
          >
            <FaAngleLeft size={20} />
          </div>
          <div
            onClick={scrollRight}
            className="absolute hidden md:block bg-black/60 top-[50%] cursor-pointer p-2 right-0"
          >
            <FaAngleRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialEvent;
