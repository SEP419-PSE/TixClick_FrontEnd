'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import NoEvent from '../../../assets/NoEvent.png'
import { EventFilter } from '../../organizer/components/EventFilter'
import { useLanguage } from '../../organizer/components/LanguageContext'

const mockEvents = [
  {
    id: 1,
    title: "Lễ hội âm nhạc mùa hè 2023",
    image: "/placeholder.svg?height=200&width=400",
    date: "15/07/2023",
    location: "Công viên Lê Văn Tám, TP.HCM",
    attendees: 1200,
    status: "upcoming",
    ticketsSold: 850,
    revenue: "425,000,000đ"
  },
  {
    id: 2,
    title: "Workshop Thiết kế UX/UI",
    image: "/placeholder.svg?height=200&width=400",
    date: "22/08/2023",
    location: "Dreamplex Coworking Space, TP.HCM",
    attendees: 80,
    status: "upcoming",
    ticketsSold: 65,
    revenue: "32,500,000đ"
  },
  {
    id: 3,
    title: "Triển lãm Công nghệ 2023",
    image: "/placeholder.svg?height=200&width=400",
    date: "10/09/2023",
    location: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC)",
    attendees: 3000,
    status: "upcoming",
    ticketsSold: 2100,
    revenue: "1,050,000,000đ"
  },
  {
    id: 4,
    title: "Hội thảo Khởi nghiệp",
    image: "/placeholder.svg?height=200&width=400",
    date: "05/06/2023",
    location: "Đại học Bách Khoa TP.HCM",
    attendees: 500,
    status: "past",
    ticketsSold: 480,
    revenue: "240,000,000đ"
  }
]
export default function Consumer() {
  const { t } = useLanguage()

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)
  
  const handleSearch = (e:any) => {
    const term = e.target.value
    setSearchTerm(term)
    
    if (term.trim() === '') {
      setFilteredEvents(mockEvents)
    } else {
      const filtered = mockEvents.filter(event => 
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.location.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredEvents(filtered)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
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

          <EventFilter />
        </div>
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event:any) => (
              <div key={event.id} className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-800 hover:border-[#00B14F] transition-colors">
                <div className="relative">
                  <img 
                    src={event.image || "/placeholder.svg"} 
                    alt={event.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'upcoming' ? 'bg-[#00B14F] text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">{event.title}</h3>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-400">
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
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
            <img 
              src={NoEvent} 
              alt="No events" 
              className="w-16 h-16 opacity-50"
            />
          </div>
          <p className="text-white/60">No events found</p>
        </div>)}

      </main>
        
    </div>
  )
}

