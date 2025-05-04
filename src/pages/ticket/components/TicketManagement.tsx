import {
  Armchair,
  ArrowUpDown,
  Calendar,
  Clock,
  LocateFixed,
  MapPin,
  Search,
  Tag,
  Ticket,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { TicketResponse } from "../../../interface/ticket/Ticket";
import { cn } from "../../../lib/utils";
import ticketApi from "../../../services/ticket/TicketApi";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setTicketPurchase } from "../../../redux/features/ticketPurchase/ticketPurchaseSlice";

export default function TicketManagement() {
  // const [status, setStatus] = useState("all")
  const ticketPurchase = useAppSelector((state) => state.ticketPurchase);
  const dispatch = useAppDispatch();

  const [ticket, setTicket] = useState<TicketResponse[]>([]);
  const [timeFilter, setTimeFilter] = useState("upcoming");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const qrValue: string | string[] = selectedTicket?.qrCode as string;

  // const statusTabs = [
  //   { value: "all", label: "Tất cả" },
  //   { value: "success", label: "Thành công" },
  //   { value: "cancelled", label: "Đã hủy" },
  // ]

  // const filteredTickets = ticket.filter((ticket) => {
  //   if (status !== "all" && ticket.status !== status) {
  //     return false
  //   }

  //   if (timeFilter === "upcoming" && !ticket.isUpcoming) {
  //     return false
  //   }

  //   if (timeFilter === "ended" && ticket.isUpcoming) {
  //     return false
  //   }

  //   return true
  // })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };

  // const StatusIndicator = ({ status }: { status: string }) => {
  //   let bgColor = ""
  //   let textColor = ""
  //   let statusText = ""

  //   switch (status) {
  //     case "success":
  //       bgColor = "bg-blue-300"
  //       textColor = "text-black"
  //       break
  //     case "processing":
  //       bgColor = "bg-yellow-500"
  //       textColor = "text-black"
  //       break
  //     case "cancelled":
  //       bgColor = "bg-red-500"
  //       textColor = "text-white"
  //       break
  //     default:
  //       bgColor = "bg-gray-500"
  //       textColor = "text-white"
  //   }

  //   return <div className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{statusText}</div>
  // }

  const fetchTicketsList = async () => {
    try {
      const res = await ticketApi.getAllTickets();
      // console.log("Ticket List:", res.data.result);
      if (res.data.result && res.data.result.length > 0) {
        setTicket(res.data.result);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies");
    }
  };

  useEffect(() => {
    const initUseEffect = async () => {
      await fetchTicketsList();
    };
    initUseEffect();
  }, []);

  const handleChangeTicket = (oldTicket: TicketResponse) => {
    console.log(oldTicket);
    const payload: number = oldTicket.ticketPurchaseId;

    dispatch(setTicketPurchase(payload));
  };

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
                <SelectValue placeholder="Sắp theo" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-800 text-white">
                <SelectItem value="date">Ngày sự kiện</SelectItem>
                <SelectItem value="price">Giá vé</SelectItem>
                <SelectItem value="name">Tên sự kiện</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              className="border-gray-800"
            >
              <ArrowUpDown
                className={cn(
                  "h-4 w-4",
                  sortOrder === "asc" ? "text-gray-400" : "text-white"
                )}
              />
            </Button>
          </div>
        </div>
        {/* <div className="grid grid-cols-3 gap-px bg-gray-800 rounded-lg p-1 mb-6">
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
        </div> */}

        <div className="flex justify-center gap-8 mb-8">
          <Button
            variant="underline"
            onClick={() => setTimeFilter("upcoming")}
            className={cn(
              "pb-2 px-0",
              timeFilter === "upcoming"
                ? "text-[#ff8a00] border-b-2 border-[#ff8a00]"
                : "text-white hover:text-[#ff8a00]"
            )}
          >
            Sắp diễn ra
          </Button>
          <Button
            variant="underline"
            onClick={() => setTimeFilter("ended")}
            className={cn(
              "pb-2 px-0",
              timeFilter === "ended"
                ? "text-[#ff8a00] border-b-2 border-[#ff8a00]"
                : "text-white hover:text-[#ff8a00]"
            )}
          >
            Đã kết thúc
          </Button>
        </div>

        {/* {filteredTickets.length > 0 ? ( */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ticket.map((ticket) => (
            <div
              key={ticket.eventId}
              className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTicketClick(ticket)}
            >
              <div className="p-4 border-b border-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-medium text-lg">
                    {ticket.eventName}
                  </h3>
                  {/* <StatusIndicator status={ticket.status} /> */}
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(ticket.eventDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{ticket.eventStartTime}</span>
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
                  <span className="text-white">{ticket.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* ) : ( */}
        {/* <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6">
              <img src={NoEvent || "/placeholder.svg"} alt="No tickets" className="w-full h-full object-contain" />
            </div>
            <p className="text-gray-400 mb-6">Không có vé nào</p>
            <Button className="bg-pse-green hover:bg-[#00B14F]/90">Mua vé ngay</Button>
          </div> */}
        {/* )} */}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTicket && (
          <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Chi tiết vé
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {selectedTicket.eventName}
                  </h3>
                  {/* <StatusIndicator status={selectedTicket.status} /> */}
                </div>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Ngày</p>
                      <p>
                        {new Date(selectedTicket.eventDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <LocateFixed className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Khu vực</p>
                      <p>{selectedTicket.zoneName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Armchair className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Mã ghế</p>
                      <p>{selectedTicket.seatCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Giờ</p>
                      <p>{selectedTicket.eventStartTime}</p>
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
                      <p>{selectedTicket.ticketType}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-4">Mã QR vé của bạn</p>
                {/* <img
                  src={selectedTicket.qrCode || "/placeholder.svg"}
                  alt="Ticket QR Code"
                  className="w-48 h-48 object-contain bg-white p-2 rounded-lg"
                /> */}
                <div>
                  <div
                    className="w-48 h-48 object-contain bg-white p-2 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {selectedTicket.qrCode ? (
                      <QRCodeSVG
                        value={selectedTicket.qrCode}
                        size={176}
                        bgColor={"#FFFFFF"}
                        fgColor={"#000000"}
                        level={"L"}
                      />
                    ) : (
                      <img
                        src="/placeholder.svg"
                        alt="Ticket QR Code"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  {isModalOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <div
                        className="bg-white p-4 rounded-lg relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
                          onClick={() => setIsModalOpen(false)}
                        ></button>
                        <QRCodeSVG
                          value={qrValue}
                          size={300}
                          bgColor={"#FFFFFF"}
                          fgColor={"#000000"}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Mã vé: {selectedTicket.eventId}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={() => handleChangeTicket(selectedTicket)}
                className="bg-orange-500/70 hover:bg-orange-700/70"
              >
                Đổi vé
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-black hover:bg-gray-400"
              >
                Hủy vé
              </Button>
              <Button className="bg-pse-green hover:bg-[#00B14F]/90">
                Tải vé
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
