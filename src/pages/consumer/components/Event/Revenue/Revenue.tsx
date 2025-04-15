import { RevenueLineChart } from "./RevenueLineChart";
import TicketsBarChart from "./TicketsBarChart";
import TicketsPieChart from "./TicketsPieChart";
import TicketsRevenuePieChart from "./TicketsRevenuePieChart";

const Revenue = () => {
  return (
    <div className="p-6 bg-white text-black">
      <div className="font-bold text-3xl mb-8">Doanh thu</div>
      <div className="grid lg:grid-cols-2 gap-8">
        <TicketsBarChart />
        <TicketsPieChart />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <RevenueLineChart />
        <TicketsRevenuePieChart />
      </div>
    </div>
  );
};

export default Revenue;
