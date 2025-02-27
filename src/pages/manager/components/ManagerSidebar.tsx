import {
  CalendarDays,
  ClipboardSignature,
  CreditCard,
  LayoutDashboard,
  LogOut,
  UserCheck
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import Logo from "../../../assets/Logo.png"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../../components/ui/sidebar"

export function DashboardSidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    toast.success(
       "Logged out",{ description: "You have been successfully logged out.",
  })
  }

  return (
    <Sidebar>
      
      <SidebarHeader className="border-b border-[#333333] px-6 py-4">

      <div className="flex items-center gap-2">
      <img src={Logo} alt="Logo" className="h-12 w-13"/>
        <h1 className="text-xl font-bold text-black">Manager Dashboard</h1>
      </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="" className="flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="company-approvals" className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5" />
                <span>Company Approvals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="events" className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                <span>Event Approvals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="contracts" className="flex items-center">
                <ClipboardSignature className="mr-2 h-5 w-5" />
                <span>Contracts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="payments" className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                <span>Payments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#333333] p-6">
        <div className="flex flex-col space-y-4">
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span>Admin Account</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2A2A2A] text-white">
              <DialogHeader>
                <DialogTitle>Admin Profile</DialogTitle>
                <DialogDescription>View and manage your admin account details.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-4 py-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">Admin User</h3>
                  <p className="text-sm text-gray-400">admin@example.com</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button className="w-full text-black  hover:bg-orange-300" variant="outline">
                  Edit Profile
                </Button>
                <Button className="w-full text-black hover:bg-orange-300" variant="outline">
                  Change Password
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" className="w-full justify-start px-2" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-4">© 2023 Your Company</p>
      </SidebarFooter>
    </Sidebar>
  )
}

