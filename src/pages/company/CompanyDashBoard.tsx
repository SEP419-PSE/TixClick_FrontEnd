import { Outlet, useLocation } from "react-router";
import NavbarCompany from "./components/NavbarCompany";
import CompanyAccount from "./components/CompanyAccount";
import { Bell } from "lucide-react";

const CompanyDashBoard = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/company/profile" && <NavbarCompany />}

      <div
        className={`bg-pse-black-light ${
          location.pathname !== "/company/profile" && "lg:pl-[300px]"
        }  text-white min-h-screen font-inter text-[16px]`}
      >
        <div className="flex items-center px-6 pt-6 justify-end font-semibold">
          <Bell className="mr-auto" />
          <CompanyAccount />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default CompanyDashBoard;
