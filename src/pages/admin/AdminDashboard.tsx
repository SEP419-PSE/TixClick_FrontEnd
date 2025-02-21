import { BarChart, Menu, Settings, ShoppingCart, Users, X } from "lucide-react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import DashboardCard from "./DashboardCard"
import NavItem from "./NavItem"


export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-[#2A2A2A] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-8">
          <NavItem icon={BarChart} label="Dashboard" active />
          <NavItem icon={Users} label="Users" />
          <NavItem icon={ShoppingCart} label="Products" />
          <NavItem icon={Settings} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="flex items-center justify-between p-4 bg-[#2A2A2A]">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 bg-[#3A3A3A] border-[#4A4A4A] text-white placeholder-gray-400"
            />
            <Button variant="outline" className="border-[#00B14F] text-[#00B14F] hover:bg-[#00B14F] hover:text-white">
              Notifications
            </Button>
          </div>
        </header>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="Total Users" value="1,234" icon={Users} />
            <DashboardCard title="Total Products" value="567" icon={ShoppingCart} />
            <DashboardCard title="Revenue" value="$12,345" icon={BarChart} />
            <DashboardCard title="Orders" value="89" icon={ShoppingCart} />
          </div>
        </div>
      </main>
    </div>
  )
}