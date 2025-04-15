import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../../../components/ui/chart";

const chartData = [
  { eventActivity: "Hoạt động 1", "Vé thường": 123, "Vé Vip": 150 },
  { eventActivity: "Hoạt động 2", "Vé thường": 98, "Vé Vip": 180 },
];

console.log(JSON.stringify(chartData, null, 2));

const chartConfig = {
  "Vé thường": {
    label: "Vé thường",
    color: "hsl(var(--chart-1))",
  },
  "Vé Vip": {
    label: "Vé Vip",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const TicketsBarChart = () => {
  return (
    <Card className="text-black max-w-2xl bg-background text-foreground shadow-md rounded-2xl border">
      <CardHeader>
        <CardTitle>Số vé bán được theo hoạt động</CardTitle>
        <CardDescription>Thống kê vé đã bán</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={400} height={250} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="eventActivity"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="Vé thường"
              stackId="a"
              fill={chartConfig["Vé thường"].color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="Vé Vip"
              stackId="a"
              fill={chartConfig["Vé Vip"].color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tăng 5,2% so với ngày hôm trước <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Tổng vé bán được theo từng hoạt động
        </div>
      </CardFooter>
    </Card>
  );
};

export default TicketsBarChart;
