"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";

// Data mẫu: mỗi loại vé có doanh thu riêng
const ticketRevenueData = [
  { type: "Vé Thường", revenue: 3200000 },
  { type: "Vé VIP", revenue: 5800000 },
  { type: "Vé VVIP", revenue: 2400000 },
];

console.log(JSON.stringify(ticketRevenueData, null, 2));

// Màu tương ứng từng loại vé
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

// Custom tooltip để hiển thị % và số tiền
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const total = ticketRevenueData.reduce((acc, cur) => acc + cur.revenue, 0);
    const value = payload[0].value;
    const percent = ((value / total) * 100).toFixed(1);
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm text-sm">
        <div className="font-medium">{payload[0].name}</div>
        <div>{value.toLocaleString()} đ</div>
        <div>{percent}% tổng doanh thu</div>
      </div>
    );
  }
  return null;
};

const TicketsRevenuePieChart = () => {
  return (
    <Card className="bg-background text-foreground shadow-md rounded-2xl mt-8 border">
      <CardHeader>
        <CardTitle>Doanh thu theo loại vé</CardTitle>
        <CardDescription>Tỉ lệ doanh thu từng loại vé</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ticketRevenueData}
              dataKey="revenue"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {ticketRevenueData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TicketsRevenuePieChart;
