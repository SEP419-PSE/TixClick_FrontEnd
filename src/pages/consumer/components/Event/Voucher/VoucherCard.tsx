import { Card } from "../../../../../components/ui/card";
import { Switch } from "../../../../../components/ui/switch";
import { VoucherResponse } from "../../../../../interface/company/Voucher";
import { formatDateVietnamese } from "../../../../../lib/utils";
import { TicketMinus } from "lucide-react";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

type Props = {
  voucher: VoucherResponse;
};

const VoucherCard = ({ voucher }: Props) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative flex items-center gap-4 max-w-md shadow-md rounded-lg border bg-white px-6 py-4 border-gray-200"
    >
      <div className="absolute bg-pse-green left-0 top-0 h-full w-2 rounded-l-lg"></div>
      <div className="hidden lg:flex lg:flex-col items-center w-[20%] bg-pse-green-second text-white p-4 rounded-lg">
        <TicketMinus />
        <p className="font-semibold">{voucher.discount}%</p>
      </div>
      <div className="flex flex-col">
        <p className="font-bold text-base mb-1">{voucher.voucherCode}</p>
        <p className="font-bold text-sm max-w-sm truncate">
          {voucher.voucherName}
        </p>
        <p className="text-xs">
          Hạn sử dụng:{" "}
          <span className="text-pse-green-second">
            {formatDateVietnamese(voucher.startDate)} -{" "}
            {formatDateVietnamese(voucher.endDate)}
          </span>
        </p>
      </div>
      <div className="flex flex-col ml-auto items-center">
        <Switch checked={voucher.status === "ACTIVE" ? true : false} />
      </div>
    </MotionCard>
  );
};

export default VoucherCard;
