import { SidebarProfile } from "./components/SidebarProfile"
import TicketManagement from "./components/TicketManagement"


export default function TicketPage() {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <div className="flex">
          <SidebarProfile />
          <main className="flex-1">
            <TicketManagement />
          </main>
        </div>
      </div>
    )
  }
  