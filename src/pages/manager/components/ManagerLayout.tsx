import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"
import { useState } from "react"
import { Outlet } from "react-router"
import { cn } from "../../../lib/utils"
import { DashboardSidebar } from "./ManagerSidebar"

export const metadata: Metadata = {
  title: "Manager Dashboard",
  description: "Manage companies, events, contracts, and payments",
}

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
    <div className="relative">
      {/* Collapse toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg"
      >
        <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed ? "" : "rotate-180")} />
      </button>

      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "240px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen"
      >
        <DashboardSidebar  />
      </motion.div>
    </div>

    <Outlet/>
  </div>
)
}

