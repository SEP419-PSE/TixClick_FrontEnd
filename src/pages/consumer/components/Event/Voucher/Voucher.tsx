import { useParams } from "react-router";
import CreateVoucher from "./CreateVoucher";
import FilterVoucher from "./FilterVoucher";
import VoucherList from "./VoucherList";
import useVouchers from "../../../../../hooks/useVouchers";
import { useState } from "react";
import { VoucherStatus } from "../../../../../interface/company/Voucher";
import LoadingFullScreen from "../../../../../components/Loading/LoadingFullScreen";
import voucherApi from "../../../../../services/voucherApi";

const Voucher = () => {
  const { eventId } = useParams();
  const [status, setStatus] = useState<VoucherStatus>("ACTIVE");
  const { data, loading, error, refetch } = useVouchers(
    Number(eventId),
    status
  );

  const onChangeStatusVoucher = (e: string) => {
    setStatus(e.toUpperCase() as VoucherStatus);
  };

  const handleChangeStatus = async (
    voucherId: number,
    newStatus: VoucherStatus
  ) => {
    try {
      const response = await voucherApi.changeStatus(voucherId, newStatus);
      console.log("Change status", response);
      refetch();
    } catch (error) {
      console.error("Error change status voucher", error);
    }
  };

  if (error) return <div>Lỗi fetch API</div>;

  return (
    <div className="p-6 min-h-screen bg-background text-foreground">
      {loading && <LoadingFullScreen />}
      <div className="font-bold text-xl">Mã giảm giá</div>
      <div className="flex justify-between items-center">
        <CreateVoucher onCreated={refetch} />
        <FilterVoucher status={status} onChange={onChangeStatusVoucher} />
      </div>

      <VoucherList vouchers={data} onChangeStatus={handleChangeStatus} />
    </div>
  );
};

export default Voucher;
