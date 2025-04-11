import type { ReactNode } from "react";
import { Outlet } from "react-router";
import Header from "../../components/Header/Header";
import { LanguageProvider } from "../organizer/components/LanguageContext";
import { LanguageSwitcher } from "../organizer/components/LanguageSwitcher";
import { ConsumerSidebar } from "./components/ConsumerSidebar";
import { Toaster } from "sonner";

export default function RootLayouts({ children }: { children?: ReactNode }) {
  return (
    <>
      <Header />
      <LanguageProvider>
        <div className="flex min-h-screen bg-[#1a1a1a] pt-16">
          <ConsumerSidebar />
          <main className="flex-1">{children || <Outlet />}</main>
          <LanguageSwitcher />
          <Toaster position="top-center" />
        </div>
      </LanguageProvider>
    </>
  );
}
