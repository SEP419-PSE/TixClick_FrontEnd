"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../../../components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

// Dữ liệu cho 2 hoạt động
const activityData = {
  activity1: [
    { month: "January", revenue: 186 },
    { month: "February", revenue: 305 },
    { month: "March", revenue: 237 },
    { month: "April", revenue: 73 },
    { month: "May", revenue: 209 },
    { month: "June", revenue: 214 },
  ],
  activity2: [
    { month: "January", revenue: 100 },
    { month: "February", revenue: 150 },
    { month: "March", revenue: 120 },
    { month: "April", revenue: 90 },
    { month: "May", revenue: 130 },
    { month: "June", revenue: 180 },
  ],
};

console.log(JSON.stringify(activityData, null, 2));

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueLineChart() {
  // Cập nhật kiểu cho selectedActivity
  const [selectedActivity, setSelectedActivity] =
    useState<keyof typeof activityData>("activity1");

  // Xử lý sự kiện chuyển đổi giữa 2 hoạt động
  const handleActivityChange = () => {
    setSelectedActivity((prev) =>
      prev === "activity1" ? "activity2" : "activity1"
    );
  };

  return (
    <Card className="mt-8 bg-background text-foreground shadow-md rounded-2xl border">
      <div className="flex justify-left mt-4 mx-4">
        <Select onValueChange={handleActivityChange} value={selectedActivity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn hoạt động" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activity1">Hoạt động 1</SelectItem>
            <SelectItem value="activity2">Hoạt động 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <CardHeader>
        <CardTitle>Doanh thu theo hoạt động</CardTitle>
        <CardDescription>Biểu đồ doanh thu từ các hoạt động</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={activityData[selectedActivity]}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenue)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tăng 5,2% so với ngày hôm trước <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Tổng doanh thu theo từng hoạt động
        </div>
      </CardFooter>
    </Card>
  );
}
