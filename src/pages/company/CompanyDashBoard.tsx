import { Outlet, useLocation } from "react-router";
import NavbarCompany from "./components/NavbarCompany";

const CompanyDashBoard = () => {
  const location = useLocation();
  return (
    <div className="flex bg-white text-black min-h-screen font-inter text-[16px]">
      {location.pathname !== "/company/profile" && (
        <div className="w-[15%]">
          <NavbarCompany />
        </div>
      )}

      <div
        className={`${
          location.pathname !== "/company/profile" ? "w-[85%]" : "w-[100%]"
        } `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default CompanyDashBoard;
