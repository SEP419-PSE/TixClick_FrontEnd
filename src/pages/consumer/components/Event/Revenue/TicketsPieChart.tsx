import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../../components/ui/card";

// Dữ liệu từng hoạt động
const activitiesData = [
  {
    eventActivity: "Hoạt động 1",
    tickets: [
      { name: "Vé thường", value: 123 },
      { name: "Vé Vip", value: 150 },
    ],
  },
  {
    eventActivity: "Hoạt động 2",
    tickets: [
      { name: "Vé thường", value: 98 },
      { name: "Vé Vip", value: 180 },
    ],
  },
];

console.log(JSON.stringify(activitiesData, null, 2));

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

// ✅ Tooltip hiển thị phần trăm đúng
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const { name, value, __total } = item.payload;
    const percent = ((value / __total) * 100).toFixed(1);

    return (
      <div className="rounded-md bg-background px-3 py-2 text-sm shadow-md border border-border">
        <div>
          <span className="font-medium">{name}</span>: <span>{value} vé</span> (
          <span className="text-muted-foreground">{percent}%</span>)
        </div>
      </div>
    );
  }

  return null;
};

const TicketsPieChart = () => {
  return (
    <div className="grid grid-rows-1 md:grid-rows-2 gap-8">
      {activitiesData.map((activity, index) => {
        const total = activity.tickets.reduce((sum, t) => sum + t.value, 0);
        const pieData = activity.tickets.map((t) => ({
          ...t,
          __total: total,
        }));

        return (
          <Card
            key={index}
            className="bg-background text-foreground shadow-md rounded-2xl border"
          >
            <CardHeader>
              <CardTitle>{activity.eventActivity}</CardTitle>
              <CardDescription>Tỉ lệ vé bán ra</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) =>
                      `${name}: ${((value / total) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TicketsPieChart;
