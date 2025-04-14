import { useEffect, useState, type ReactNode } from "react";
import { Outlet } from "react-router";
import Header from "../../components/Header/Header";
import { LanguageProvider } from "../organizer/components/LanguageContext";
import { LanguageSwitcher } from "../organizer/components/LanguageSwitcher";
import { ConsumerSidebar } from "./components/ConsumerSidebar";
import { Toaster } from "sonner";
import companyApi from "../../services/companyApi";
import { CompanyStatus } from "../../interface/company/Company";
import LockPage from "../../components/Lock/LockPage";

export default function RootLayouts({ children }: { children?: ReactNode }) {
  const [statusCompany, setStatusCompany] = useState<CompanyStatus>();

  const checkStatusCompany = async () => {
    const response = await companyApi.isAccountHaveCompany();
    console.log(response);
    if (response.data.result) {
      setStatusCompany(response.data.result.status);
    }
  };
  // console.log(statusCompany);

  useEffect(() => {
    checkStatusCompany();
  }, []);
  return (
    <>
      {(statusCompany == "PENDING" || statusCompany == "REJECTED") && (
        <LockPage message="Công ty của bạn chưa được quyền thao tác do chưa được chấp nhận" />
      )}
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
