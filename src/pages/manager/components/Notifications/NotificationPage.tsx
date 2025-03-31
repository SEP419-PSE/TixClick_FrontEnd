import { useEffect, useState } from "react"
import { toast } from "sonner"
import NotificationList, { Notification } from "./NotificationList"


export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://160.191.175.172:8080/notification/notifications", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Lỗi khi tải thông báo");
        }
  
        const data = await response.json();
        console.log("Dữ liệu từ API:", data);
  
            if (data && Array.isArray(data.result)) {
          setNotifications(data.result);
        } else {
          console.error("Dữ liệu từ API không đúng định dạng:", data);
          setNotifications([]);
        }
  
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotifications();
  }, []);
  

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
        setNotifications((prev) => [newNotification, ...prev])

        // Hiển thị toast thông báo
        toast.success("Thông báo mới", {
            description: newNotification.content || "Bạn có thông báo mới",
          });
      } catch (err) {
        console.error("Error processing WebSocket message:", err)
      }
    }

    // Xử lý lỗi
    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
      setError("Lỗi kết nối WebSocket")
    }

    // Xử lý khi kết nối đóng
    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason)

      // Thử kết nối lại sau 5 giây nếu kết nối bị đóng không mong muốn
      if (event.code !== 1000) {
        setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...")
          // Có thể thêm logic kết nối lại ở đây
        }, 5000)
      }
    }

    // Dọn dẹp khi component unmount
    return () => {
      socket.close()
    }
  }, [toast])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Thông báo của bạn</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <NotificationList notifications={notifications} loading={loading} />
      </div>
    </main>
  )
}

