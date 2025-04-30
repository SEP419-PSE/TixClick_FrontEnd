import { useState } from "react";
import {
  EventDetailResponse,
  EventStatus,
} from "../../interface/EventInterface";
import EventList from "./components/Search/EventList";
import { FilterEvent } from "./components/Search/FilterEvent";
import { useLocation, useNavigate } from "react-router";

const mockEvents: EventDetailResponse[] = [
  {
    eventId: 1,
    eventName: "Sự kiện Âm nhạc 2025",
    address: "12 Nguyễn Huệ",
    city: "TP.HCM",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    locationName: "Nhà hát Thành phố",
    status: EventStatus.APPROVED,
    typeEvent: "music",
    countView: 3200,
    logoURL:
      "https://plus.unsplash.com/premium_photo-1683121126477-17ef068309bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerURL:
      "https://plus.unsplash.com/premium_photo-1683121126477-17ef068309bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Một buổi hòa nhạc lớn với các nghệ sĩ hàng đầu.",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    urlOnline: null,
    eventCategory: "Âm nhạc",
    eventCategoryId: 1,
    countTicketSold: null,
    totalRevenue: null,
    haveSeatMap: true,
    price: 120000,
    eventActivityDTOList: [
      {
        eventActivityId: 101,
        activityName: "Buổi diễn chính",
        dateEvent: new Date(),
        startTimeEvent: "19:00",
        endTimeEvent: "22:00",
        startTicketSale: new Date(),
        endTicketSale: new Date(),
        eventId: 1,
        tickets: [],
      },
    ],
  },
  {
    eventId: 2,
    eventName: "Hội thảo Công nghệ 2025",
    address: "Số 5 Duy Tân",
    city: "Hà Nội",
    district: "Cầu Giấy",
    ward: "Dịch Vọng Hậu",
    locationName: "Trung tâm Hội nghị Quốc gia",
    status: EventStatus.SCHEDULED,
    typeEvent: "conference",
    countView: 1800,
    logoURL:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerURL:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Hội thảo công nghệ với nhiều diễn giả nổi tiếng.",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    urlOnline: null,
    eventCategory: "Công nghệ",
    eventCategoryId: 2,
    countTicketSold: null,
    totalRevenue: null,
    haveSeatMap: false,
    price: 180000,
    eventActivityDTOList: [
      {
        eventActivityId: 102,
        activityName: "Diễn thuyết chính",
        dateEvent: new Date(),
        startTimeEvent: "09:00",
        endTimeEvent: "17:00",
        startTicketSale: new Date(),
        endTicketSale: new Date(),
        eventId: 2,
        tickets: [],
      },
    ],
  },
  {
    eventId: 3,
    eventName: "Lễ hội Ẩm thực Việt 2025",
    address: "Công viên Lê Văn Tám",
    city: "TP.HCM",
    district: "Quận 3",
    ward: "Phường 6",
    locationName: "Công viên Lê Văn Tám",
    status: EventStatus.APPROVED,
    typeEvent: "festival",
    countView: 2450,
    logoURL:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerURL:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Lễ hội ẩm thực truyền thống với hơn 100 gian hàng.",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    urlOnline: null,
    eventCategory: "Ẩm thực",
    eventCategoryId: 3,
    countTicketSold: null,
    totalRevenue: null,
    haveSeatMap: false,
    price: 50000,
    eventActivityDTOList: [
      {
        eventActivityId: 103,
        activityName: "Khai mạc lễ hội",
        dateEvent: new Date(),
        startTimeEvent: "08:00",
        endTimeEvent: "10:00",
        startTicketSale: new Date(),
        endTicketSale: new Date(),
        eventId: 3,
        tickets: [],
      },
    ],
  },
  {
    eventId: 4,
    eventName: "Show Thời Trang Xuân Hè 2025",
    address: "Vinpearl Landmark 81",
    city: "TP.HCM",
    district: "Bình Thạnh",
    ward: "Phường 22",
    locationName: "Vinpearl Ballroom",
    status: EventStatus.SCHEDULED,
    typeEvent: "fashion",
    countView: 1200,
    logoURL: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    bannerURL: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    description: "Sự kiện giới thiệu bộ sưu tập thời trang mới nhất.",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    urlOnline: null,
    eventCategory: "Thời trang",
    eventCategoryId: 4,
    countTicketSold: null,
    totalRevenue: null,
    haveSeatMap: true,
    price: 250000,
    eventActivityDTOList: [
      {
        eventActivityId: 104,
        activityName: "Trình diễn chính",
        dateEvent: new Date(),
        startTimeEvent: "18:00",
        endTimeEvent: "21:00",
        startTicketSale: new Date(),
        endTicketSale: new Date(),
        eventId: 4,
        tickets: [],
      },
    ],
  },
  {
    eventId: 5,
    eventName: "Workshop Khởi Nghiệp 2025",
    address: "Toong Phạm Ngọc Thạch",
    city: "TP.HCM",
    district: "Quận 3",
    ward: "Phường 6",
    locationName: "Toong Coworking Space",
    status: EventStatus.APPROVED,
    typeEvent: "workshop",
    countView: 980,
    logoURL: "https://images.unsplash.com/photo-1603570413160-b742f909c9a2",
    bannerURL:
      "https://plus.unsplash.com/premium_photo-1661315452408-ab1839e8d468?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Buổi chia sẻ và networking dành cho startup.",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    urlOnline: null,
    eventCategory: "Kinh doanh",
    eventCategoryId: 5,
    countTicketSold: null,
    totalRevenue: null,
    haveSeatMap: false,
    price: 100000,
    eventActivityDTOList: [
      {
        eventActivityId: 105,
        activityName: "Chia sẻ kinh nghiệm",
        dateEvent: new Date(),
        startTimeEvent: "13:00",
        endTimeEvent: "17:00",
        startTicketSale: new Date(),
        endTicketSale: new Date(),
        eventId: 5,
        tickets: [],
      },
    ],
  },
];

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [typeEvent, setTypeEvent] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([50000]);

  const onChangeSearchParams = (key: string, value: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const onChangeArea = (e: string) => {
    setSelectedArea(e);
    onChangeSearchParams("area", e);
  };

  const onChanngeTypeEvent = (e: string) => {
    setTypeEvent(e);
    onChangeSearchParams("type", e);
  };

  const onChangePriceRange = (e: number[]) => {
    setPriceRange(e);
    onChangeSearchParams("price", e.toString());
  };
  return (
    <div className="grid grid-cols-12 gap-6 min-h-screen mt-[70px] p-4 lg:px-14 bg-[#1e1e1e] text-white">
      <section className="col-span-12 lg:col-span-3 mb-8 lg:mb-0">
        <FilterEvent
          typeEvent={typeEvent}
          onChangeTypeEvent={onChanngeTypeEvent}
          selectedArea={selectedArea}
          onChangeArea={onChangeArea}
          priceRange={priceRange}
          onChangePriceRange={onChangePriceRange}
        />
      </section>

      <section className="col-span-12 lg:col-span-9">
        <EventList eventList={mockEvents} />
      </section>
    </div>
  );
};

export default SearchPage;
