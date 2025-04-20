import { useParams } from "react-router";
import CreateVoucher from "./CreateVoucher";
import FilterVoucher from "./FilterVoucher";
import VoucherList from "./VoucherList";
import useVouchers from "../../../../../hooks/useVouchers";
import { useState } from "react";
import { VoucherStatus } from "../../../../../interface/company/Voucher";
import LoadingFullScreen from "../../../../../components/Loading/LoadingFullScreen";

const Voucher = () => {
  const { eventId } = useParams();
  const [status, setStatus] = useState<VoucherStatus>("ACTIVE");
  const { data, loading, error, refetch } = useVouchers(
    Number(eventId),
    status
  );
  console.log(data);

  const onChangeStatusVoucher = (e: string) => {
    setStatus(e.toUpperCase() as VoucherStatus);
  };
  console.log(status);

  if (error) return <div>Lỗi fetch API</div>;

  return (
    <div className="p-6 min-h-screen bg-background text-foreground">
      {loading && <LoadingFullScreen />}
      <div className="font-bold text-xl">Mã giảm giá</div>
      <div className="flex justify-between items-center">
        <CreateVoucher onCreated={refetch} />
        <FilterVoucher onChange={onChangeStatusVoucher} />
      </div>

      <VoucherList vouchers={data} />
    </div>
  );
};

export default Voucher;
