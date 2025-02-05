import { LuSearch } from "react-icons/lu";
import { LuTicketCheck } from "react-icons/lu";
import SearchBar from "../SearchBar/SearchBar";
import { NavLink } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import Avatar from "../../assets/boy.png";
import { RiCalendarEventLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
const Header = () => {
  const authContext = useContext(AuthContext);
  const [openMennu, setOpenMenu] = useState<boolean>(false);
  return (
    <header className="p-4 lg:px-14 bg-pse-green flex items-center text-white">
      <p className="font-bold text-[18px]">Event booking</p>
      <div className="ml-auto flex items-center gap-4">
        <SearchBar />
        <span className="lg:hidden p-[6px] border rounded-full">
          <LuSearch size={24} />
        </span>
        <div className="hidden md:block px-4 py-2 border rounded-lg hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
          Tạo sự kiện
        </div>
        {/* <div className="hidden px-4 py-2 md:flex items-center cursor-pointer">
          <span className="mr-2">
            <LuTicketCheck size={24} />
          </span>
          Vé đã mua
        </div> */}
        <div className="font-semibold flex items-center cursor-pointer">
          {authContext?.isLogin ? (
            <div
              onMouseOver={() => {
                setOpenMenu(true);
              }}
              onClick={() => {
                setOpenMenu(true);
              }}
              onMouseLeave={() => {
                setOpenMenu(false);
              }}
              className="relative p-[6px] rounded-full border"
            >
              <img src={Avatar} width={24} />
              <div
                className={`absolute ${
                  openMennu ? "block" : "hidden"
                } top-10 right-0 bg-white rounded-lg text-pse-black w-[200px] transition-all duration-500`}
              >
                <ul className="rounded-lg">
                  <li className="flex items-center gap-2 p-3 hover:bg-pse-black/20 rounded-tl-lg rounded-tr-lg">
                    <LuTicketCheck size={24} />
                    Vé đã mua
                  </li>
                  <li className="flex items-center p-3 gap-2 hover:bg-pse-black/20">
                    <RiCalendarEventLine size={24} />
                    Sự kiện của tôi
                  </li>
                  <li className="flex items-center p-3 gap-2 hover:bg-pse-black/20">
                    <CgProfile size={24} />
                    Trang cá nhân
                  </li>
                  <li
                    onClick={() => {
                      authContext.logout();
                    }}
                    className="flex items-center p-3 gap-2 hover:bg-pse-black/20 rounded-bl-lg rounded-br-lg"
                  >
                    <LuLogOut size={24} />
                    Đăng xuất
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <NavLink to="/signin">
                <span className="hover:border-b-2">Đăng nhập</span>
              </NavLink>
              <span className="md:block hidden mx-1">|</span>
              <span className="md:block hidden hover:border-b-2">Đăng ký</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
