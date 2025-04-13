import { ReactNode } from "react";
import Header from "../../../../components/Header/Header";
import { EventSidebar } from "./EventSidebar";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const EventManagement = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-[#1a1a1a] pt-16">
        <EventSidebar />
        <main className="flex-1">{children || <Outlet />}</main>
        <Toaster position="top-center" />
      </div>
    </>
  );
};

export default EventManagement;
