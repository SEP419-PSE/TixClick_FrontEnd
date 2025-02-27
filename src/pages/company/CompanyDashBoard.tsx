import { Outlet } from "react-router";
import NavbarCompany from "./components/NavbarCompany";

const CompanyDashBoard = () => {
  return (
    <div className="flex bg-white text-black h-screen font-inter text-[16px]">
      <div className="w-[15%]">
        <NavbarCompany />
      </div>
      <div className="w-[85%]">
        <Outlet />
      </div>
    </div>
  );
};

export default CompanyDashBoard;
