import { LuSearch } from "react-icons/lu";
import { LuTicketCheck } from "react-icons/lu";
import SearchBar from "../SearchBar/SearchBar";
const Header = () => {
  return (
    <header className="p-4 lg:px-14 bg-pse-green flex items-center text-white">
      <p className="font-bold text-[18px]">Event booking</p>
      <div className="ml-auto flex items-center gap-4">
        <SearchBar />
        <span className="lg:hidden p-[6px] border rounded-full">
          <LuSearch size={18} />
        </span>
        <div className="hidden md:block px-4 py-2 border rounded-lg hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
          Tạo sự kiện
        </div>
        <div className="hidden px-4 py-2 md:flex items-center cursor-pointer">
          <span className="mr-2">
            <LuTicketCheck size={24} />
          </span>
          Vé đã mua
        </div>
        <div className="font-semibold flex items-center cursor-pointer">
          Đăng nhập <span className="md:block hidden ml-1"> | Đăng ký</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
