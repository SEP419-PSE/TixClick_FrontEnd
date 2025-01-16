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
    language: 'Ngôn ngữ'
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
    language: 'Language'
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

