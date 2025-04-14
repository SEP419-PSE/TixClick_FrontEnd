import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleDollarSign,
  ClipboardList,
  PieChart,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { cn } from "../../../../lib/utils";
import { FaTasks } from "react-icons/fa";

export function EventSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: "Tổng kết", href: "summary-revenue", icon: PieChart },
    { name: "Danh sách đơn hàng", href: "orders", icon: ClipboardList },
    { name: "Checkin", href: "check-in", icon: CircleCheck },
    {
      name: "Doanh thu",
      href: "revenue",
      icon: CircleDollarSign,
    },
    { name: "Phân chia công việc", href: "tasks", icon: FaTasks },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8A00] text-white shadow-lg"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed ? "" : "rotate-180"
          )}
        />
      </button>

      <motion.nav
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "240px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex h-screen flex-col bg-gradient-to-b from-[#121212] to-[#1A1A1A] border-r border-[#2A2A2A]"
      >
        {/* Header with decorative element */}
        {/* <div className="relative h-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A00]/20 to-transparent"></div>
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#FF8A00] to-transparent"></div>
          <div className="flex h-full items-center px-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF8A00] to-[#FF9A20] flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">{isCollapsed ? "C" : ""}</span>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute left-[70px] text-white text-lg font-medium"
                >
                  Consumer Center
                </motion.span>
              )}
            </div>
          </div>
        </div> */}

        <div className="flex-1 px-3 py-6">
          {isCollapsed == false && (
            <NavLink to="/company">
              <button className="bg-white text-black flex items-center justify-center mb-4  py-2 rounded-lg w-full">
                <ChevronLeft />
                <span>Quản lý sự kiện</span>
              </button>
            </NavLink>
          )}

          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group relative flex h-12 items-center overflow-hidden rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-[#2A2A2A] text-white"
                      : "text-gray-400 hover:bg-[#2A2A2A]/50 hover:text-white",
                    isCollapsed ? "justify-center" : "px-4"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-[#FF8A00]"></div>
                    )}
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                        isActive
                          ? "bg-[#FF8A00]/10 text-[#FF8A00]"
                          : "text-gray-400 group-hover:text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-medium">
                        {item.name}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
