import RootLayout from '../../components/Language/RootLayout'
import { LanguageProvider } from '../organizer/components/LanguageContext'
import Consumer from './components/Consumer'


export default function ConsumerCenter() {
  return (
    <LanguageProvider>
    <RootLayout>
      <Consumer />
    </RootLayout>
  </LanguageProvider>
  )
  }

