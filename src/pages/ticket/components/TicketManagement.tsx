import { useState } from "react";
import TicketList from "./TicketList";
import Popup from "../../../components/Popup/Popup";
import Img from "../../../assets/2aff26681043246ebef537f075e2f861.webp";
import { eventTypes } from "../../../constants/constants";
import DashDivider from "../../../components/Divider/DashDivider";
import { formatMoney } from "../../DataTranfer";

export default function TicketManagement() {
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <div className="px-6 py-4 border-b border-gray-800">
        <nav className="text-sm text-gray-400">
          <span className="hover:text-white">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-white">Vé đã mua</span>
        </nav>
      </div>

      <section className="px-6 py-4">
        <h1 className="text-xl font-semibold">Vé đã mua </h1>
        <TicketList clickOpenPopup={handleOpenPopup} />
      </section>

      <Popup
        className="w-auto max-w-xs p-4"
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
      >
        <div className="overflow-x-hidden text-black">
          <div className="flex flex-col justify-center items-center">
            <img src={Img} alt="" className="w-40 h-20 rounded-md" />
            <div className="font-semibold mt-1 text-black text-xl text-center break-words">
              Sự kiện haha
            </div>
            <p
              style={{
                backgroundColor: eventTypes.find((x) => x.name == "Music")
                  ?.color,
              }}
              className="text-white text-xs text-center font-medium rounded-md w-fit px-2 py-1"
            >
              {eventTypes.find((x) => x.name == "Music")?.vietnamName}
            </p>
          </div>
          <DashDivider />
          <div className="space-y-2">
            <p className="break-words">
              <span className="text-pse-green font-semibold">
                FPT University
              </span>{" "}
              {"- "}
              124 Khu công nghệ cao,Phường Linh Trung,Thành phố Thủ Đức,Thành
              phố Hồ Chí Minh
            </p>
            <p className="w-full truncate">
              Giờ bắt đầu: 19:22 {"-"}
              <span className="font-semibold"> 21 tháng 5, 2025</span>
            </p>
          </div>
          <DashDivider />
          <div>
            Ghế {"- "}
            <span className="font-bold">A2</span>{" "}
          </div>
        </div>
        <DashDivider />
        <section className="flex justify-between text-black">
          <div>
            <h1 className="text-left">Mã vé</h1>
            <p className="text-left font-bold">352727</p>
          </div>
          <div>
            <h1 className="text-right">Giá</h1>
            <p className="text-right font-bold">{formatMoney(100000)}</p>
          </div>
        </section>
      </Popup>
    </div>
  );
}
