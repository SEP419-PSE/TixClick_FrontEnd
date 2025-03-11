import { createContext, ReactNode, useContext, useState } from 'react'

type Language = 'en' | 'vi'

const translations = {
  vi: {
    title: 'Sự kiện đã tạo',
    search: 'Tìm kiếm sự kiện',
    filters: {
      all: 'Tất cả',
      upcoming: 'SẮP DIỄN RA',
      past: 'ĐÃ QUA',
      pending: 'CHỜ DUYỆT'
    },
    menu: {
      tickets: 'Vé đã mua',
      myEvents: 'Sự kiện của tôi',
      profile: 'Trang cá nhân',
      signOut: 'Đăng xuất'
    },
    nav: {
      events: 'Sự kiện đã tạo',
      fileManagement: 'Quản lý xuất file',
      createEvent: 'Tạo sự kiện',
      terms: 'Điều khoản cho Ban tổ chức'
    },
    account: 'Tài khoản',
    language: 'Ngôn ngữ',
    sidebar: {
      title: "Consumer Center",
      myEvents: "Sự kiện của tôi",
      reports: "Quản lý báo cáo",
      terms: "Điều khoản cho Ban tổ chức",
    },
    myEvents: {
      search: "Tìm kiếm sự kiện",
      searchButton: "Tìm kiếm",
      tabs: {
        upcoming: "Sắp tới",
        past: "Đã qua",
        pending: "Chờ duyệt",
        draft: "Nháp",
      },
      empty: {
        title: "Chưa có sự kiện nào",
        description: "Bạn chưa có sự kiện nào. Hãy tạo sự kiện đầu tiên!",
      },
    },
    reports: {
      columns: {
        file: "File",
        createdAt: "Ngày Tạo",
        creator: "Người tạo",
        status: "Trạng thái xử lý",
        actions: "Thao tác",
      },
      empty: {
        title: "Không có dữ liệu",
        description: "Chưa có báo cáo nào được tạo",
      },
    },
    terms: {
      items: [
        {
          id: "1",
          title: "Danh mục hàng hoá, dịch vụ cấm kinh doanh",
          content: "...",
        },
        {
          id: "2",
          title: "Danh mục hàng hoá, dịch vụ cấm quảng cáo",
          content: "...",
        },
        {
          id: "3",
          title: "Quy định kiểm duyệt nội dung & hình ảnh",
          content: "...",
        },
      ],
    },
    appPromo: {
      title: "Ticketbox Event Manager",
      subtitle: "Dễ dàng quản lý\ntất cả sự kiện",
      downloadText: "Tải ứng dụng Ticketbox Event Manager",
    },
    header: {
      account: "Tài khoản",
    },
    eventFilter: {
      search: "Tìm kiếm",
      searchPlaceholder: "Nhập tên sự kiện",
      eventType: "Loại sự kiện",
      all: "Tất cả",
      online: "Trực tuyến",
      offline: "Trực tiếp",
      category: "Danh mục",
      selectCategory: "Chọn danh mục",
      categories: {
        music: "Âm nhạc",
        sports: "Thể thao",
        arts: "Nghệ thuật",
      },
      applyFilter: "Áp dụng bộ lọc",
    },
  },
  en: {
    title: 'Created Events',
    search: 'Search events',
    filters: {
      all: 'All',
      upcoming: 'UPCOMING',
      past: 'PAST',
      pending: 'PENDING'
    },
    menu: {
      tickets: 'My Tickets',
      myEvents: 'My Events',
      profile: 'Profile',
      signOut: 'Sign out'
    },
    nav: {
      events: 'Created Events',
      fileManagement: 'File Management',
      createEvent: 'Create Event',
      terms: 'Organizer Terms'
    },
    account: 'Account',
    language: 'Language',
    sidebar: {
      title: "Consumer Center",
      myEvents: "My Events",
      reports: "Reports Management",
      terms: "Organizer Terms",
    },
    myEvents: {
      search: "Search events",
      searchButton: "Search",
      tabs: {
        upcoming: "Upcoming",
        past: "Past",
        pending: "Pending",
        draft: "Draft",
      },
      empty: {
        title: "No events yet",
        description: "You have no events yet. Create your first event!",
      },
    },
    reports: {
      columns: {
        file: "File",
        createdAt: "Created Date",
        creator: "Creator",
        status: "Status",
        actions: "Actions",
      },
      empty: {
        title: "No data",
        description: "No reports have been created yet",
      },
    },
    terms: {
      items: [
        {
          id: "1",
          title: "Prohibited Goods and Services",
          content: "...",
        },
        {
          id: "2",
          title: "Prohibited Advertising Items",
          content: "...",
        },
        {
          id: "3",
          title: "Content & Image Review Policy",
          content: "...",
        },
      ],
    },
    appPromo: {
      title: "Ticketbox Event Manager",
      subtitle: "Easily manage\nall your events",
      downloadText: "Download Ticketbox Event Manager",
    },
    header: {
      account: "Account",
    },
    eventFilter: {
      search: "Search",
      searchPlaceholder: "Enter event name",
      eventType: "Event Type",
      all: "All",
      online: "Online",
      offline: "Offline",
      category: "Category",
      selectCategory: "Select category",
      categories: {
        music: "Music",
        sports: "Sports",
        arts: "Arts",
      },
      applyFilter: "Apply Filter",
    },
  }
}

interface LanguageContextType {
  language: Language
  t: typeof translations.en
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi')

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        t: translations[language], 
        setLanguage 
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

