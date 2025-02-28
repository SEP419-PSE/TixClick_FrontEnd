import { BarChartIcon, Calendar, DollarSign, LogOut, Menu, Settings, Ticket, User, Users, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Select } from "@radix-ui/react-select"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Logo from "../../assets/Logo.png"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import DashboardCard from "./DashboardCard"
import NavItem from "./NavItem"


const generateDailyData = (days:any) => {
  return Array.from({ length: days }, (_, i) => ({
    name: `Day ${i + 1}`,
    revenue: Math.floor(Math.random() * 1000) + 500,
    tickets: Math.floor(Math.random() * 100) + 50,
  }))
}

const generateMonthlyData = (months:any) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return Array.from({ length: months }, (_, i) => ({
    name: monthNames[i],
    revenue: Math.floor(Math.random() * 10000) + 5000,
    tickets: Math.floor(Math.random() * 1000) + 500,
  }))
}

const generateYearlyData = (years:any) => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: years }, (_, i) => ({
    name: `${currentYear - years + i + 1}`,
    revenue: Math.floor(Math.random() * 100000) + 50000,
    tickets: Math.floor(Math.random() * 10000) + 5000,
  }))
}



export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeRange, setTimeRange] = useState("month")
  const [chartData, setChartData] = useState([
    {
      name: "Jan",
      revenue: 5000,
      tickets: 500,
    }
  ])

  useEffect(() => {
    switch (timeRange) {
      case "day":
        setChartData(generateDailyData(30))
        break
      case "month":
        setChartData(generateMonthlyData(12))
        break
      case "year":
        setChartData(generateYearlyData(5))
        break
      default:
        setChartData(generateMonthlyData(12))
    }
  }, [timeRange])

  const eventTypeData = [
    { name: "Concerts", value: 400 },
    { name: "Conferences", value: 300 },
    { name: "Sports", value: 300 },
    { name: "Theater", value: 200 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const upcomingEvents = [
    { id: 1, name: "Summer Music Festival", date: "2023-07-15", ticketsSold: 1500, revenue: 75000 },
    { id: 2, name: "Tech Conference 2023", date: "2023-08-22", ticketsSold: 800, revenue: 40000 },
    { id: 3, name: "Comedy Night", date: "2023-06-30", ticketsSold: 300, revenue: 9000 },
    { id: 4, name: "Local Theater Play", date: "2023-07-08", ticketsSold: 200, revenue: 5000 },
  ]

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-[#2A2A2A] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4">
      <img src={Logo} alt="Logo" className="h-12 w-13"/>

          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-8">
          <NavItem icon={BarChartIcon} label="Dashboard" href="/" />
          <NavItem icon={Calendar} label="Events" href="/events" />
          <NavItem icon={Ticket} label="Tickets" href="/tickets" />
          <NavItem icon={Users} label="Attendees" href="/attendees" />
          <NavItem icon={DollarSign} label="Revenue" href="/revenue" />
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span>Admin User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="flex items-center justify-between p-4 bg-[#2A2A2A]">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#00B14F] hover:bg-[#00963F] text-white">Generate Report</Button>
          </div>
        </header>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Overview Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Tickets Sold"
              value={chartData.reduce((sum, item) => sum + item.tickets, 0).toLocaleString()}
              icon={Ticket}
            />
            <DashboardCard
              title="Total Revenue"
              value={`$${chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}`}
              icon={DollarSign}
            />
            <DashboardCard title="Upcoming Events" value={upcomingEvents.length.toString()} icon={Calendar} />
            <DashboardCard
              title="Average Ticket Price"
              value={`$${Math.round(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.reduce((sum, item) => sum + item.tickets, 0)).toLocaleString()}`}
              icon={Users}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Revenue and Ticket Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis yAxisId="left" stroke="#888" />
                      <YAxis yAxisId="right" orientation="right" stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#00B14F" />
                      <Bar yAxisId="right" dataKey="tickets" name="Tickets" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-white">Event Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {eventTypeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A] mb-8">
            <CardHeader>
              <CardTitle className="text-white">Ticket Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="tickets" name="Tickets Sold" stroke="#00B14F" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white font-bold">Event Name</TableHead>
                    <TableHead className="text-white font-bold">Date</TableHead>
                    <TableHead className="text-white font-bold">Tickets Sold</TableHead>
                    <TableHead className="text-white font-bold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-white">
                  {upcomingEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.ticketsSold}</TableCell>
                      <TableCell>${event.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}








