import { useEffect, useState } from "react";
import { VoucherResponse, VoucherStatus } from "../interface/company/Voucher";
import voucherApi from "../services/voucherApi";
import { AxiosError } from "axios";

const useVouchers = (eventId: number, status: VoucherStatus) => {
  const [data, setData] = useState<VoucherResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherApi.getAll(eventId, status);

      setData(response.data.result);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(axiosError);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId, status]);
  return { data, loading, error, refetch: fetchData };
};

export default useVouchers;
