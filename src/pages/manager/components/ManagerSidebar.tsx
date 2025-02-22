import { Calendar, Home, Settings } from "lucide-react"
import { Link } from "react-router"

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#1E1E1E] border-r border-gray-800 min-h-screen p-6">
      <nav className="space-y-1">
        <Link
          to="/manager/dashboard"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white  hover:bg-gray-800 hover:text-white"
        >
          <Home className="w-5 h-5" />
          <span>Overview</span>
        </Link>
        <Link
          to="/manager/events"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white hover:bg-gray-800 hover:text-white"
        >
          <Calendar className="w-5 h-5" />
          <span>Events</span>
        </Link>
        
        <Link
          to="/manager/events"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white hover:bg-gray-800 hover:text-white"
        >
          <Calendar className="w-5 h-5" />
          <span>Companies</span>
        </Link>
        <Link
          to="/manager/contracts"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white hover:bg-gray-800 hover:text-white"
        >
          <Settings className="w-5 h-5" />
          <span>Contract</span>
        </Link>
        <Link
          to="/manager/payments"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white hover:bg-gray-800 hover:text-white"
        >
          <Settings className="w-5 h-5" />
          <span>Payment</span>
        </Link>
      </nav>
    </aside>
  )
}

