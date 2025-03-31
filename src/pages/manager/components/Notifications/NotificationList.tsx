import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Bell } from "lucide-react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Skeleton } from "../../../../components/ui/skeleton"

interface NotificationListProps {
  notifications: Notification[]
  loading: boolean
}

export interface Notification {
    id: string
    content: string
    read: boolean
    createdAt: string
    type?: string
    link?: string
  }

  export default function NotificationList({ notifications, loading }: NotificationListProps) {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
  
    if (!Array.isArray(notifications)) {
      console.error("Lỗi: notifications không phải là mảng", notifications);
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Dữ liệu thông báo không hợp lệ</p>
          </CardContent>
        </Card>
      )
    }
  
    if (notifications.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Bạn chưa có thông báo nào</p>
          </CardContent>
        </Card>
      )
    }
  
    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "" : "border-primary"}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {!notification.read && <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-primary" />}
                <div className="grid gap-1">
                  <p className="text-sm font-medium">{notification.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {notification.createdAt
                      ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })
                      : "Vừa xong"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
