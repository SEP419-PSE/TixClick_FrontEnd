import { ArrowUpDown, Calendar, Clock, MapPin, Search, Tag, Ticket } from "lucide-react"
import { useState } from "react"
import NoEvent from "../../../assets/NoEvent.png"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { cn } from "../../../lib/utils"


const mockTickets = [
  {
    id: "1",
    eventName: "Lễ hội âm nhạc mùa hè",
    date: "2025-06-15",
    time: "19:00",
    location: "Công viên Thống Nhất, Hà Nội",
    price: "350,000 VND",
    status: "success",
    type: "VIP",
    qrCode: "/placeholder.svg?height=200&width=200",
    isUpcoming: true,
  },
  {
    id: "2",
    eventName: "Triển lãm nghệ thuật đương đại",
    date: "2025-05-20",
    time: "10:00",
    location: "Bảo tàng Mỹ thuật, TP.HCM",
    price: "150,000 VND",
    status: "processing",
    type: "Standard",
    qrCode: "/placeholder.svg?height=200&width=200",
    isUpcoming: true,
  },
  {
    id: "3",
    eventName: "Workshop Thiết kế UX/UI",
    date: "2025-04-10",
    time: "14:00",
    location: "Toong Coworking Space, Hà Nội",
    price: "500,000 VND",
    status: "cancelled",
    type: "Standard",
    qrCode: "/placeholder.svg?height=200&width=200",
    isUpcoming: false,
  },
  {
    id: "4",
    eventName: "Hội thảo Khởi nghiệp 2025",
    date: "2025-07-05",
    time: "09:00",
    location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
    price: "250,000 VND",
    status: "success",
    type: "VIP",
    qrCode: "/placeholder.svg?height=200&width=200",
    isUpcoming: true,
  },
]


export default function TicketManagement() {
  const [status, setStatus] = useState("all")
  const [timeFilter, setTimeFilter] = useState("upcoming")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState({
    id: "",
    eventName: "",
    date: "",
    time: "",
    location: "",
    price: "",
    status: "",
    type: "",
    qrCode: "",
    isUpcoming: false,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const statusTabs = [
    { value: "all", label: "Tất cả" },
    { value: "success", label: "Thành công" },
    { value: "processing", label: "Đang xử lý" },
    { value: "cancelled", label: "Đã hủy" },
  ]

  const filteredTickets = mockTickets.filter((ticket) => {
    if (status !== "all" && ticket.status !== status) {
      return false
    }

    if (timeFilter === "upcoming" && !ticket.isUpcoming) {
      return false
    }

    if (timeFilter === "ended" && ticket.isUpcoming) {
      return false
    }

    return true
  })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket)
    setIsDialogOpen(true)
  }

  const StatusIndicator = ({ status }: { status: string }) => {
    let bgColor = ""
    let textColor = ""
    let statusText = ""

    switch (status) {
      case "success":
        bgColor = "bg-blue-300"
        textColor = "text-black"
        // statusText = "Thành công"
        break
      case "processing":
        bgColor = "bg-yellow-500"
        textColor = "text-black"
        // statusText = "Đang xử lý"
        break
      case "cancelled":
        bgColor = "bg-red-500"
        textColor = "text-white"
        // statusText = "Đã hủy"
        break
      default:
        bgColor = "bg-gray-500"
        textColor = "text-white"
        // statusText = "Không xác định"
    }

    return <div className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{statusText}</div>
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <div className="px-6 py-4 border-b border-gray-800">
        <nav className="text-sm text-gray-400">
          <span className="hover:text-white">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-white">Vé đã mua</span>
        </nav>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-6">Vé đã mua</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm vé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-gray-800 text-white w-64"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-gray-800 text-white">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-800 text-white">
                <SelectItem value="date">Ngày sự kiện</SelectItem>
                <SelectItem value="price">Giá vé</SelectItem>
                <SelectItem value="name">Tên sự kiện</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={toggleSortOrder} className="border-gray-800">
              <ArrowUpDown className={cn("h-4 w-4", sortOrder === "asc" ? "text-gray-400" : "text-white")} />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-px bg-gray-800 rounded-lg p-1 mb-6">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={cn(
                "py-2 text-sm font-medium rounded-md transition-colors",
                status === tab.value ? "bg-pse-green text-white" : "text-gray-400 hover:text-white",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <Button
            variant="underline"
            onClick={() => setTimeFilter("upcoming")}
            className={cn(
              "pb-2 px-0",
              timeFilter === "upcoming"
                ? "text-[#ff8a00] border-b-2 border-[#ff8a00]"
                : "text-white hover:text-[#ff8a00]",
            )}
          >
            Sắp diễn ra
          </Button>
          <Button
            variant="underline"
            onClick={() => setTimeFilter("ended")}
            className={cn(
              "pb-2 px-0",
              timeFilter === "ended" ? "text-[#ff8a00] border-b-2 border-[#ff8a00]" : "text-white hover:text-[#ff8a00]",
            )}
          >
            Đã kết thúc
          </Button>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleTicketClick(ticket)}
              >
                <div className="p-4 border-b border-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-medium text-lg">{ticket.eventName}</h3>
                    <StatusIndicator status={ticket.status} />
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(ticket.date).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{ticket.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{ticket.location}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{ticket.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{ticket.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6">
              <img src={NoEvent || "/placeholder.svg"} alt="No tickets" className="w-full h-full object-contain" />
            </div>
            <p className="text-gray-400 mb-6">Bạn chưa có vé nào</p>
            <Button className="bg-pse-green hover:bg-[#00B14F]/90">Mua vé ngay</Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTicket && (
          <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Chi tiết vé</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{selectedTicket.eventName}</h3>
                  <StatusIndicator status={selectedTicket.status} />
                </div>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Ngày</p>
                      <p>{new Date(selectedTicket.date).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Giờ</p>
                      <p>{selectedTicket.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Địa điểm</p>
                      <p>{selectedTicket.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Giá vé</p>
                      <p>{selectedTicket.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Ticket className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Loại vé</p>
                      <p>{selectedTicket.type}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-4">Mã QR vé của bạn</p>
                <img
                  src={selectedTicket.qrCode || "/placeholder.svg"}
                  alt="Ticket QR Code"
                  className="w-48 h-48 object-contain bg-white p-2 rounded-lg"
                />
                <p className="text-xs text-gray-400 mt-4">Mã vé: {selectedTicket.id}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" className="border-gray-700 text-black hover:bg-gray-400">
                Hủy vé
              </Button>
              <Button className="bg-pse-green hover:bg-[#00B14F]/90">Tải vé</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
