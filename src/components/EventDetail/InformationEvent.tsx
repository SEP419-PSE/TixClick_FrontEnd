import Img1 from "../../assets/c9d60e7974b86bb46ff88e96ae91b3cc.jpg";
import { CiCalendar } from "react-icons/ci";
import { FaMapMarkerAlt } from "react-icons/fa";

const InformationEvent = () => {
  return (
    <div className="mx-3 my-4 lg:my-8 lg:flex lg:justify-center">
      <div>
        <img src={Img1} className="w-full" />
      </div>
      <div className="relative bg-[#2a2d34] p-4 leading-10">
        <p className="font-extrabold text-[18px] leading-6">
          Liveshow "Hơn 1000 Năm Sau Chưa Quên Người Yêu Cũ"
        </p>
        <p className="flex items-center text-pse-green font-bold">
          <span>
            <CiCalendar size={18} color="white" className="mr-1" />
          </span>
          20:30 - 22:30, 15 Tháng 03, 2025
        </p>
        <p className="relative flex items-center text-[#c4c4cf]">
          <span>
            <FaMapMarkerAlt size={18} className="mr-1" color="white" />
          </span>
          <div>Nhà hát hồ gươm</div>
          <div className="absolute top-5 left-5">
            40 Trần Hung Đạo, Thành phố Hà Nội
          </div>
        </p>
        <div className="max-[1150px]:hidden absolute bottom-28 w-[95%] h-[1px] bg-white rounded-full">
          <div className="text-[20px] font-extrabold my-2">
            Giá từ <span className="text-pse-green">800.000 VND</span>
          </div>
          <button className="bg-pse-green w-full rounded-lg font-bold hover:bg-white hover:text-pse-black transition-all duration-500">
            Mua vé ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformationEvent;
