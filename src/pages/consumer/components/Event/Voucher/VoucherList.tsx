import EmptyList from "../../../../../components/EmptyList/EmptyList";
import {
  VoucherResponse,
  VoucherStatus,
} from "../../../../../interface/company/Voucher";
import VoucherCard from "./VoucherCard";

type Props = {
  vouchers: VoucherResponse[];
  onChangeStatus: (voucherId: number, newStatus: VoucherStatus) => void;
  deleteVoucher: (voucher: VoucherResponse) => void;
};

const VoucherList = ({ vouchers, onChangeStatus, deleteVoucher }: Props) => {
  if (vouchers.length == 0) return <EmptyList label="Chưa có voucher nào" />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {vouchers.map((voucher) => (
        <VoucherCard
          key={voucher.voucherId}
          voucher={voucher}
          onChangeStatus={onChangeStatus}
          deleteVoucher={deleteVoucher}
        />
      ))}
    </div>
  );
};

export default VoucherList;
