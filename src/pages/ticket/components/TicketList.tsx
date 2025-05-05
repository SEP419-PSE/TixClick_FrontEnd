import { Card } from "../../../components/ui/card";
import Img from "../../../assets/2aff26681043246ebef537f075e2f861.webp";
import { eventTypes } from "../../../constants/constants";
import React from "react";

type Props = {
  clickOpenPopup: () => void;
};

const TicketList: React.FC<Props> = ({ clickOpenPopup }) => {
  return (
    <div className="mx-20 my-5">
      <Card
        onClick={clickOpenPopup}
        className="relative flex items-center px-6 py-3 w-auto shadow-box hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div className="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] w-3 h-5 rounded-r-full"></div>
        <div className="flex gap-4 items-center">
          <img src={Img} alt="" className="w-32 h-16 rounded-md" />
          <div>
            <div className="font-semibold text-black text-xl w-60 truncate">
              Sự kiện haha
            </div>
            <p
              style={{
                backgroundColor: eventTypes.find((x) => x.name == "Music")
                  ?.color,
              }}
              className="text-white text-xs text-center font-medium rounded-md  w-fit px-2 py-1"
            >
              {eventTypes.find((x) => x.name == "Music")?.vietnamName}
            </p>
          </div>
        </div>
        <div className="ml-auto w-80">
          <p className="w-full truncate">
            <span className="text-pse-green font-semibold">FPT University</span>
            {" - "}124 Khu công nghệ cao,Phường Linh Trung,Thành phố Thủ
            Đức,Thành phố Hồ Chí Minh
          </p>
          <p className="w-full truncate">
            19:22{" - "}
            <span className="font-semibold"> 21 tháng 5, 2025</span>
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
    </div>
  );
};

export default TicketList;
