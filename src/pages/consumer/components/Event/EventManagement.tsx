import { ReactNode, useContext } from "react";
import Header from "../../../../components/Header/Header";
import { EventSidebar } from "./EventSidebar";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { SidebarContext } from "../../../../contexts/SideBarContext";
import { cn } from "../../../../lib/utils";

const EventManagement = ({ children }: { children?: ReactNode }) => {
  const context = useContext(SidebarContext);

  return (
    <>
      <Header />
      <div className="flex h-screen pt-16 bg-[#1a1a1a]">
        <aside className="fixed top-16 bottom-0">
          <EventSidebar />
        </aside>

        <main
          className={cn(
            "flex-1 transition-all duration-300",
            context?.isCollapsed == true ? "ml-20" : "ml-60"
          )}
        >
          {children || <Outlet />}
        </main>
      </div>

      <Toaster position="top-center" />
    </>
  );
};

export default EventManagement;
