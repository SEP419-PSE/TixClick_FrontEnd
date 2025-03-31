import { Bell, BellOff } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import NotificationList, { Notification } from "./NotificationList"


export default function NotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filter, setFilter] = useState<string>("all")
  
    console.log(error)
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          setLoading(true)
          const response = await fetch("http://160.191.175.172:8080/notification/notifications", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
  
          if (!response.ok) {
            throw new Error("Lỗi khi tải thông báo")
          }
  
          const data = await response.json()
          console.log("Dữ liệu từ API:", data)
  
          if (data && Array.isArray(data.result)) {
            const enhancedNotifications = data.result.map((notification: Notification) => ({
              ...notification,
              type:
                notification.type ||
                ["message", "order", "user", "document", "system", "email"][Math.floor(Math.random() * 6)],
            }))
            setNotifications(enhancedNotifications)
          } else {
            console.error("Dữ liệu từ API không đúng định dạng:", data)
            setNotifications([])
          }
  
          setError(null)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
          console.error("Error fetching notifications:", err)
        } finally {
          setLoading(false)
        }
      }
  
      fetchNotifications()
    }, [])
  
    // Connect to WebSocket for real-time notifications
    useEffect(() => {
      // Địa chỉ WebSocket server
      const wsUrl = "ws://160.191.175.172:8080/ws/notifications"
  
      // Tạo kết nối WebSocket
      const socket = new WebSocket(wsUrl)
  
      // Xử lý khi kết nối mở
      socket.onopen = () => {
        console.log("WebSocket connection established")
        // Có thể gửi token xác thực nếu cần
        // socket.send(JSON.stringify({ token: 'your-auth-token' }));
      }
  
      // Xử lý khi nhận thông báo mới
      socket.onmessage = (event) => {
        try {
          const newNotification = JSON.parse(event.data)
  
          // Cập nhật danh sách thông báo
          setNotifications((prev) => [
            {
              ...newNotification,
              // Add random type for demo - remove in production
              type: ["message", "order", "user", "document", "system", "email"][Math.floor(Math.random() * 6)],
            },
            ...prev,
          ])
  
          // Hiển thị toast thông báo
          toast.success("Thông báo mới", {
            description: newNotification.content || newNotification.message || "Bạn có thông báo mới",
          })
        } catch (err) {
          console.error("Error processing WebSocket message:", err)
        }
      }
  
      socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        setError("Lỗi kết nối WebSocket")
      }
  
      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason)
  
        if (event.code !== 1000) {
          setTimeout(() => {
            console.log("Attempting to reconnect WebSocket...")
          }, 5000)
        }
      }
  
      return () => {
        socket.close()
      }
    }, [])
  
  
    const filteredNotifications = notifications.filter((notification) => {
      if (filter === "unread" && notification.read) return false
      if (filter === "read" && !notification.read) return false
  
      return true
    })
  
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
        <div className="w-full max-w-2xl mx-auto bg-background dark:bg-muted/5 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">Thông báo của bạn</h1>
  
          </div>
  
          {/* {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>} */}
  
          <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Chưa đọc
              </TabsTrigger>
              <TabsTrigger value="read" className="flex items-center gap-2">
                <BellOff className="h-4 w-4" />
                Đã đọc
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <NotificationList
                notifications={filteredNotifications}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="unread" className="mt-4">
              <NotificationList
                notifications={filteredNotifications}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="read" className="mt-4">
              <NotificationList
                notifications={filteredNotifications}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    )
  }

