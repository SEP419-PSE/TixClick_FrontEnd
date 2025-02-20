import { Calendar, Ticket, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import Huy from "../../../assets/AvatarHuy.jpg";
import { cn } from "../../../lib/utils";


const menuItems = [
  {
    icon: User,
    label: "Thông tin tài khoản",
    href: "/account",
  },
  {
    icon: Ticket,
    label: "Vé đã mua",
    href: "/tickets",
  },
  {
    icon: Calendar,
    label: "Sự kiện của tôi",
    href: "/my-events",
  },
]

export function SidebarProfile() {
    const { pathname } = useLocation(); 


  return (
    <div className="w-64 min-h-screen bg-[#1E1E1E] p-6 border-r border-gray-800">
      {/* User Profile */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <img src={Huy} alt="" className="w-12 h-12 rounded-full object-cover" />
        </div>
        <div>
          <div className="text-sm text-gray-400">Tài khoản của</div>
          <div className="text-white font-medium">Le Quang Huy (K17 HCM)</div>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10",
                isActive && "bg-white/10 text-white",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

