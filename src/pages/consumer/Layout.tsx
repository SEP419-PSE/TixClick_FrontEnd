import type { ReactNode } from "react";
import { Outlet } from "react-router";
import { LanguageProvider } from "../organizer/components/LanguageContext";
import { LanguageSwitcher } from "../organizer/components/LanguageSwitcher";
import { ConsumerSidebar } from "./components/ConsumerSidebar";

export default function RootLayouts({ children }: { children?: ReactNode }) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-[#1a1a1a]">
        <ConsumerSidebar />
        <main className="flex-1">{children || <Outlet />}</main>
        <LanguageSwitcher />
      </div>
    </LanguageProvider>
  );
}
