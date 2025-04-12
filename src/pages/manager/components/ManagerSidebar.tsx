"use client"

import { Bell, CalendarDays, ClipboardSignature, CreditCard, LayoutDashboard, LogOut, UserCheck } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router"
import { toast, Toaster } from "sonner"
import Logo from "../../../assets/Logo.png"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { ScrollArea } from "../../../components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar"
import { cn } from "../../../lib/utils"
// Import the AuthContext and Client from stomp/stompjs at the top
import { Client } from "@stomp/stompjs"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../../contexts/AuthProvider"

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentPath, setCurrentPath] = useState("")
  // Replace the existing notifications state and add these new states
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<string>("unknown")
  const stompClient = useRef<Client | null>(null)
  const context = useContext(AuthContext)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(5) // Example count
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Add this type definition
  type Notification = {
    id: number
    content?: string
    message?: string
    title?: string
    type?: string
    read: boolean
    createdAt?: string
    time?: string
  }

  useEffect(() => {
    const path = location.pathname.replace(/^\/manager\/?/, "")
    setCurrentPath(path)
  }, [location.pathname])

  // Add these useEffects after the existing useEffect for currentPath
  // Extract username from token
  useEffect(() => {
    if (context?.accessToken2) {
      try {
        const tokenParts = context.accessToken2.split(".")
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]))
          setCurrentUser(payload.sub || "unknown")
        }
      } catch (e) {
        console.error("Error parsing token:", e)
      }
    }
  }, [context?.accessToken2])

  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    const connectWebSocket = () => {
      if (!context?.accessToken2 || currentUser === "unknown") {
        return
      }

      const client = new Client({
        brokerURL: "ws://160.191.175.172:8080/ws",
        connectHeaders: {
          Authorization: `Bearer ${context.accessToken2}`,
        },
        debug: (str) => {
          console.log("STOMP: " + str)
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      })

      client.onConnect = () => {
        client.subscribe(`/user/${currentUser}/queue/notifications`, (message) => {
          try {
            const newNotification = JSON.parse(message.body)

            // Add to notifications list
            setNotifications((prev) => [
              {
                ...newNotification,
                type:
                  newNotification.type ||
                  ["message", "order", "user", "document", "system", "email"][Math.floor(Math.random() * 6)],
                time: "Just now",
              },
              ...prev,
            ])

            // Update unread count
            setUnreadNotifications((prev) => prev + 1)

            // Show toast notification
            toast.success("Thông báo mới", {
              description: newNotification.content || newNotification.message || "Bạn có thông báo mới",
            })
          } catch (err) {
            console.error("Error processing WebSocket message:", err)
          }
        })
      }

      client.activate()
      stompClient.current = client
    }

    if (currentUser !== "unknown") {
      if (stompClient.current) {
        stompClient.current.deactivate()
      }
      connectWebSocket()
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate()
      }
    }
  }, [currentUser, context?.accessToken2])

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!context?.accessToken2) return

      try {
        setLoading(true)
        const response = await fetch("https://tixclick.site/api/notification/notifications", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context.accessToken2}`,
          },
        })

        if (!response.ok) {
          throw new Error("Lỗi khi tải thông báo")
        }

        const data = await response.json()

        if (data && Array.isArray(data.result)) {
          const enhancedNotifications = data.result.map((notification: Notification) => ({
            ...notification,
            type:
              notification.type ||
              ["message", "order", "user", "document", "system", "email"][Math.floor(Math.random() * 6)],
            time: formatNotificationTime(notification.createdAt),
          }))
          setNotifications(enhancedNotifications)

          const unreadCount = enhancedNotifications.filter((n:any) => !n.read).length
          setUnreadNotifications(unreadCount)
        } else {
          setNotifications([])
        }
      } catch (err) {
        console.error("Error fetching notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [context?.accessToken2])

  const formatNotificationTime = (createdAt?: string) => {
    if (!createdAt) return "Unknown time"

    const date = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return "Yesterday"
    return `${diffDays} days ago`
  }

  // Add this function to mark notifications as read
  const markAllAsRead = async () => {
    if (!context?.accessToken2) return

    try {
      // You would typically call an API endpoint to mark all as read
      // For now, we'll just update the local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadNotifications(0)
      toast.success("All notifications marked as read")
    } catch (err) {
      console.error("Error marking notifications as read:", err)
      toast.error("Failed to mark notifications as read")
    }
  }

  const isActive = (path: string) => {
    if (path === "" && (location.pathname === "/manager" || location.pathname === "/manager/")) {
      return true
    }
    return currentPath === path || currentPath.startsWith(`${path}/`)
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userName")
    toast.success("Logged out", {
      description: "You have been successfully logged out.",
      duration: 5000,
    })

    setTimeout(() => {
      navigate("/superLogin")
    }, 1000)
  }

  return (
    <Sidebar>
      <Toaster position="top-right" />
      <SidebarHeader className="border-b border-[#333333] px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={Logo || "/placeholder.svg"} alt="Logo" className="h-12 w-13" />
          <h1 className="text-xl font-bold text-black">Manager Dashboard</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={cn(isActive("") && "bg-orange-100 text-orange-600 font-medium")}>
              <Link to="" className="flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(isActive("company-approvals") && "bg-orange-100 text-orange-600 font-medium")}
            >
              <Link to="company-approvals" className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5" />
                <span>Company Approvals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(isActive("events") && "bg-orange-100 text-orange-600 font-medium")}
            >
              <Link to="events" className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                <span>Event Approvals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(isActive("contracts") && "bg-orange-100 text-orange-600 font-medium")}
            >
              <Link to="contracts" className="flex items-center">
                <ClipboardSignature className="mr-2 h-5 w-5" />
                <span>Contracts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(isActive("payments") && "bg-orange-100 text-orange-600 font-medium")}
            >
              <Link to="payments" className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                <span>Payments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Redesigned Notification Button with Popover */}
          <SidebarMenuItem>
            <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  className={cn(
                    "relative",
                    isActive("notifications") && "bg-orange-100 text-orange-600 font-medium",
                    isNotificationsOpen && !isActive("notifications") && "bg-orange-50",
                  )}
                >
                  <Bell className="mr-2 h-5 w-5" />
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <SidebarMenuBadge className="bg-orange-500 text-white">{unreadNotifications}</SidebarMenuBadge>
                  )}
                </SidebarMenuButton>
              </PopoverTrigger>
              {/* Replace the PopoverContent in the Notification Popover with this updated version */}
              <PopoverContent className="w-80 p-0" align="start" side="right" sideOffset={20}>
                <div className="flex items-center justify-between border-b p-3">
                  <h3 className="font-medium">Thông báo</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    disabled={unreadNotifications === 0}
                  >
                    Đánh dấu đã đọc
                  </Button>
                </div>
                <ScrollArea className="h-[300px]">
                  {loading ? (
                    <div className="flex flex-col gap-2 p-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-2 p-2 border-b animate-pulse">
                          <div className="h-2 w-2 rounded-full bg-gray-200 mt-2"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-2 p-3 border-b hover:bg-orange-50 cursor-pointer transition-colors",
                            !notification.read && "bg-orange-50",
                          )}
                          onClick={() => {
                            // Mark as read logic would go here
                            // For now, we'll just navigate to the notifications page
                            navigate("notifications")
                            setIsNotificationsOpen(false)
                          }}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {!notification.read && <div className="h-2 w-2 rounded-full bg-orange-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {notification.title || notification.content || notification.message || "Thông báo mới"}
                            </p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full p-4">
                      <p className="text-sm text-gray-500">Không có thông báo</p>
                    </div>
                  )}
                </ScrollArea>
                <div className="p-3 border-t">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <Link to="notifications">Xem tất cả thông báo</Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#333333] p-6">
        <div className="flex flex-col space-y-4">
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/" alt="Manager" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span>Manager Account</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2A2A2A] text-white">
              <DialogHeader>
                <DialogTitle>Manager Profile</DialogTitle>
                <DialogDescription>View and manage your manager account details.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-4 py-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">Manager User</h3>
                  <p className="text-sm text-gray-400">manager@example.com</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button className="w-full text-black hover:bg-orange-300" variant="outline">
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
        <p className="text-xs text-gray-400 mt-4">© 2025 TixClick</p>
      </SidebarFooter>
    </Sidebar>
  )
}
