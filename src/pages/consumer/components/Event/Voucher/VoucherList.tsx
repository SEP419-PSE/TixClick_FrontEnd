import EmptyList from "../../../../../components/EmptyList/EmptyList";
import { VoucherResponse } from "../../../../../interface/company/Voucher";
import VoucherCard from "./VoucherCard";

type Props = {
  vouchers: VoucherResponse[];
};

const VoucherList = ({ vouchers }: Props) => {
  if (vouchers.length == 0) return <EmptyList label="Chưa có voucher nào" />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {vouchers.map((voucher) => (
        <VoucherCard key={voucher.voucherId} voucher={voucher} />
      ))}
    </div>
  );
};

export default VoucherList;
