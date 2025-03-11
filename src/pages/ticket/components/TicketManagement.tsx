import { useState } from "react"
import NoEvent from "../../../assets/NoEvent.png"
import { Button } from "../../../components/ui/button"
import { cn } from "../../../lib/utils"


export default function TicketManagement() {
  const [status, setStatus] = useState("all")
  const [timeFilter, setTimeFilter] = useState("upcoming")

  const statusTabs = [
    { value: "all", label: "Tất cả" },
    { value: "success", label: "Thành công" },
    { value: "processing", label: "Đang xử lý" },
    { value: "cancelled", label: "Đã hủy" },
  ]

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
        <h1 className="text-2xl font-bold text-white mb-6">Vé đã mua</h1>

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
              timeFilter === "upcoming" ? "text-[#ff8a00] border-b-2 border-[#ff8a00]" : "text-white hover:text-[#ff8a00]",
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

        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-64 h-64 mb-6">
            <img
              src={NoEvent}
              alt="No tickets"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-gray-400 mb-6">Bạn chưa có vé nào</p>
          <Button className="bg-pse-green hover:bg-[#00B14F]/90">Mua vé ngay</Button>
        </div>
      </div>
    </div>
  )
}

