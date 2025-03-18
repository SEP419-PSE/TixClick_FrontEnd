import { Calendar, Clock, DollarSign, MapPin, Search, Ticket, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import NoEvent from '../../../assets/NoEvent.png'
import { Event } from '../../../interface/organizer/Organizer'
import { EventFilter } from '../../organizer/components/EventFilter'
import { useLanguage } from '../../organizer/components/LanguageContext'
const mockEvents = [
  {
    id: 1,
    title: "Lễ hội âm nhạc mùa hè 2023",
    image: "https://helio.vn/media/uploads/2023/07/20/dem-nhac-hoi-tan-huong-mua-he-da-nang-20231.jpg",
    date: "15/07/2023",
    time: "18:00 - 23:00",
    location: "Công viên Lê Văn Tám, TP.HCM",
    description:
      "Lễ hội âm nhạc mùa hè với sự tham gia của nhiều ca sĩ nổi tiếng. Đây là sự kiện thường niên được tổ chức nhằm mang đến những trải nghiệm âm nhạc tuyệt vời cho người tham dự.",
    attendees: 1200,
    status: "upcoming",
    ticketsSold: 850,
    revenue: "425,000,000đ",
    ticketTypes: [
      { name: "Standard", price: "350,000đ", sold: 600 },
      { name: "VIP", price: "750,000đ", sold: 250 },
    ],
  },
  {
    id: 2,
    title: "Workshop Thiết kế UX/UI",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDo0FSv40pRQ7WHMDPKKdqZY8PPGtTlCX4xg&s",
    date: "22/08/2023",
    time: "09:00 - 17:00",
    location: "Dreamplex Coworking Space, TP.HCM",
    description:
      "Workshop chuyên sâu về thiết kế UX/UI dành cho người mới bắt đầu và những người đã có kinh nghiệm. Chương trình sẽ bao gồm các phần lý thuyết và thực hành.",
    attendees: 80,
    status: "upcoming",
    ticketsSold: 65,
    revenue: "32,500,000đ",
    ticketTypes: [
      { name: "Early Bird", price: "450,000đ", sold: 40 },
      { name: "Regular", price: "550,000đ", sold: 25 },
    ],
  },
  {
    id: 3,
    title: "Triển lãm Công nghệ 2023",
    image: "https://toquoc.mediacdn.vn/280518851207290880/2023/10/12/photo1697004165886-1697004166027392762544-1697110920928-1697110921909247407384.png",
    date: "10/09/2023",
    time: "08:00 - 18:00",
    location: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC)",
    description:
      "Triển lãm công nghệ lớn nhất năm với sự tham gia của nhiều thương hiệu công nghệ hàng đầu. Khách tham quan sẽ được trải nghiệm những sản phẩm công nghệ mới nhất.",
    attendees: 3000,
    status: "upcoming",
    ticketsSold: 2100,
    revenue: "1,050,000,000đ",
    ticketTypes: [
      { name: "1 Day Pass", price: "200,000đ", sold: 1500 },
      { name: "Full Event Pass", price: "500,000đ", sold: 600 },
    ],
  },
  {
    id: 4,
    title: "Hội thảo Khởi nghiệp",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj_WqaE8Fr6Y2_c1cA-9y60BKm0w82ko15IQ&s",
    date: "05/06/2023",
    time: "13:30 - 17:30",
    location: "Đại học Bách Khoa TP.HCM",
    description:
      "Hội thảo chia sẻ kinh nghiệm khởi nghiệp từ các doanh nhân thành công. Đây là cơ hội để các bạn trẻ học hỏi và kết nối với cộng đồng khởi nghiệp.",
    attendees: 500,
    status: "past",
    ticketsSold: 480,
    revenue: "240,000,000đ",
    ticketTypes: [
      { name: "Student", price: "100,000đ", sold: 300 },
      { name: "Professional", price: "300,000đ", sold: 180 },
    ],
  },
  {
    id: 5,
    title: "Hội chợ Ẩm thực Quốc tế",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf6ByMXnrEnSQdPnmP4pltg8T4gaDqF17K7w&s",
    date: "15/05/2023",
    time: "10:00 - 22:00",
    location: "Nhà Văn hóa Thanh niên, TP.HCM",
    description:
      "Hội chợ ẩm thực với sự tham gia của các đầu bếp và nhà hàng từ nhiều quốc gia. Khách tham quan sẽ được thưởng thức các món ăn đặc sản từ khắp nơi trên thế giới.",
    attendees: 1500,
    status: "past",
    ticketsSold: 1450,
    revenue: "217,500,000đ",
    ticketTypes: [{ name: "Standard", price: "150,000đ", sold: 1450 }],
  },
  {
    id: 6,
    title: "Triển lãm Nghệ thuật Đương đại",
    image: "https://vccavietnam.com/uploads/96519-banner.jpeg",
    date: "30/10/2023",
    time: "09:00 - 21:00",
    location: "Bảo tàng Mỹ thuật TP.HCM",
    description:
      "Triển lãm nghệ thuật đương đại với các tác phẩm từ các nghệ sĩ trong nước và quốc tế. Đây là cơ hội để công chúng tiếp cận với nghệ thuật hiện đại.",
    attendees: 0,
    status: "pending",
    ticketsSold: 0,
    revenue: "0đ",
    ticketTypes: [
      { name: "Regular", price: "100,000đ", sold: 0 },
      { name: "VIP", price: "250,000đ", sold: 0 },
    ],
  },
]

export default function Consumer() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>()

  useEffect(() => {
    let result = mockEvents

    if (activeFilter !== "all") {
      result = result.filter((event) => event.status === activeFilter)
    }

    if (searchTerm.trim() !== "") {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredEvents(result)
  }, [searchTerm, activeFilter])

  const handleSearch = (e:any) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (filter:any) => {
    setActiveFilter(filter)
  }

  const handleEventClick = (event:any) => {
    setSelectedEvent(event)
  }

  const closeEventDetails = () => {
    setSelectedEvent(null)
  }

  return (
    <div className="bg-[#1e1e1e] min-h-screen">
      <main className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">{t.title}</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder={t.search}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <EventFilter onFilterChange={handleFilterChange} />
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-800 hover:border-[#00B14F] transition-colors cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="relative">
                  <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === "upcoming"
                          ? "bg-[#00B14F] text-white"
                          : event.status === "past"
                            ? "bg-gray-600 text-white"
                            : "bg-yellow-500 text-white"
                      }`}
                    >
                      {event.status === "upcoming"
                        ? "Sắp diễn ra"
                        : event.status === "past"
                          ? "Đã kết thúc"
                          : "Chờ duyệt"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">{event.title}</h3>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Vé đã bán</p>
                      <p className="text-white font-medium">{event.ticketsSold}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Doanh thu</p>
                      <p className="text-[#00B14F] font-medium">{event.revenue}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)]">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <img src={NoEvent || "/placeholder.svg"} alt="No events" className="w-16 h-16 opacity-50" />
            </div>
            <p className="text-white/60">No events found</p>
          </div>
        )}
      </main>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedEvent.image || "/placeholder.svg"}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={closeEventDetails}
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedEvent.status === "upcoming"
                      ? "bg-[#00B14F] text-white"
                      : selectedEvent.status === "past"
                        ? "bg-gray-600 text-white"
                        : "bg-yellow-500 text-white"
                  }`}
                >
                  {selectedEvent.status === "upcoming"
                    ? "Sắp diễn ra"
                    : selectedEvent.status === "past"
                      ? "Đã kết thúc"
                      : "Chờ duyệt"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">{selectedEvent.title}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-[#00B14F] mr-3 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Ngày</p>
                      <p className="text-gray-400">{selectedEvent.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-[#00B14F] mr-3 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Thời gian</p>
                      <p className="text-gray-400">{selectedEvent.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-[#00B14F] mr-3 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Địa điểm</p>
                      <p className="text-gray-400">{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-[#00B14F] mr-3 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Số người tham dự</p>
                      <p className="text-gray-400">{selectedEvent.attendees} người</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Ticket className="w-5 h-5 text-[#00B14F] mr-3 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Vé đã bán</p>
                      <p className="text-gray-400">{selectedEvent.ticketsSold} vé</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-[#00B14F] mr-3 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Doanh thu</p>
                      <p className="text-gray-400">{selectedEvent.revenue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Mô tả</h3>
                <p className="text-gray-400">{selectedEvent.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Loại vé</h3>
                <div className="bg-[#1e1e1e] rounded-lg p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-gray-400">Loại vé</th>
                        <th className="text-left py-2 text-gray-400">Giá</th>
                        <th className="text-left py-2 text-gray-400">Đã bán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvent.ticketTypes.map((ticket:any, index:any) => (
                        <tr key={index} className="border-b border-gray-700 last:border-0">
                          <td className="py-3 text-white">{ticket.name}</td>
                          <td className="py-3 text-white">{ticket.price}</td>
                          <td className="py-3 text-white">{ticket.sold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <div className="flex justify-end gap-4">
                <Button variant="outline" className="text-black hover:bg-gray-400" onClick={closeEventDetails}>
                  Đóng
                </Button>
                <Button className="bg-[#00B14F] hover:bg-[#00B14F]/90">Chỉnh sửa sự kiện</Button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
