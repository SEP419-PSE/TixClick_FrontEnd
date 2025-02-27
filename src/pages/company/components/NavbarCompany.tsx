import {
  ChevronsLeft,
  LayoutGrid,
  PartyPopper,
  ReceiptText,
  TicketCheck,
  Users,
} from "lucide-react";
import Logo from "../../../assets/Logo.png";
import ButtonNeon from "../../../components/Button/ButtonNeon";
import { NavLink, useLocation } from "react-router";

const NavbarCompany = () => {
  const location = useLocation();

  return (
    <div
      className={`relative w-full h-screen px-6 py-8 border-r border-[#dbdbdb] z-10`}
    >
      <div className="flex items-center gap-2 text-[18px] font-bold ">
        <span>
          <img src={Logo} alt="" width={24} height={24} />
        </span>
        TixClick
        <span className="ml-auto">
          <ChevronsLeft strokeWidth={1} />
        </span>
      </div>
      {/* Divider */}
      <div className="w-full h-[1px] my-8 bg-[#dbdbdb]"></div>
      <div>
        <ul className="flex flex-col gap-10 text-[#787486]">
          <NavLink to="/company">
            <li
              className={`flex items-center gap-2c ${
                location.pathname == "/company" &&
                "transition-all duration-500 px-4 py-2 rounded-[6px] bg-pse-green bg-opacity-15 text-black"
              }`}
            >
              <span>
                <LayoutGrid strokeWidth={1} />
              </span>
              Home
            </li>
          </NavLink>
          <NavLink to="/company/events">
            <li
              className={`flex items-center gap-2 ${
                location.pathname == "/company/events" &&
                "transition-all duration-500 px-4 py-2 rounded-[6px] bg-pse-green bg-opacity-15 text-black"
              }`}
            >
              <span>
                <PartyPopper strokeWidth={1} />
              </span>
              Event
            </li>
          </NavLink>
          <NavLink to="/company/tickets">
            <li
              className={`flex items-center gap-2 ${
                location.pathname == "/company/tickets" &&
                "transition-all duration-500 px-4 py-2 rounded-[6px] bg-pse-green bg-opacity-15 text-black"
              }`}
            >
              <span>
                <TicketCheck strokeWidth={1} />
              </span>
              Ticket
            </li>
          </NavLink>
          <NavLink to="/company/members">
            <li
              className={`flex items-center gap-2 ${
                location.pathname == "/company/members" &&
                "transition-all duration-500 px-4 py-2 rounded-[6px] bg-pse-green bg-opacity-15 text-black"
              }`}
            >
              <span>
                <Users strokeWidth={1} />
              </span>
              Member
            </li>
          </NavLink>
          <NavLink to="/company/contracts">
            <li
              className={`flex items-center gap-2 ${
                location.pathname == "/company/contracts" &&
                "transition-all duration-500 px-4 py-2 rounded-[6px] bg-pse-green bg-opacity-15 text-black"
              }`}
            >
              <span>
                <ReceiptText strokeWidth={1} />
              </span>
              Contract
            </li>
          </NavLink>
        </ul>
      </div>
      <div className="mt-[100%] flex justify-center">
        <ButtonNeon>Đăng xuất</ButtonNeon>
      </div>
    </div>
  );
};

export default NavbarCompany;
