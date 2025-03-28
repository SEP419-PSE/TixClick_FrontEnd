import { Menu, Search, X } from "lucide-react";
import { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { LuLogOut, LuTicketCheck } from "react-icons/lu";
import { RiCalendarEventLine } from "react-icons/ri";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthProvider";
import { NavLink } from "react-router";

const HeroSlider = () => {
  const authContext = useContext(AuthContext);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const handleOpenMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
    document.body.style.overflow = openMobileMenu ? "auto" : "hidden";
  };
  return (
    <div className="lg:mb-8">
      <div className="relative">
        {/* <img src="https://images.tkbcdn.com/2/614/350/ts/ds/2b/cf/04/28f7e94ace8d993b981003b88b26b0b5.jpg" />
        <img src="https://images.tkbcdn.com/2/614/350/ts/ds/2a/83/ac/cb6963360dae30f95f517cefc982780e.jpg" />
        <img src="https://images.tkbcdn.com/2/614/350/ts/ds/8a/02/c3/c9d60e7974b86bb46ff88e96ae91b3cc.jpg" /> */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-[100%] h-screen object-cover brightness-50"
        >
          <source
            src="https://videos.pexels.com/video-files/4043988/4043988-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Header  */}
        <header className="fixed flex items-center top-0 left-0 w-full p-4 lg:px-14 lg:py-6 text-white">
          <p className="font-semibold text-2xl">TixClick</p>
          <div className="hidden md:block ml-auto">
            {authContext?.isLogin ? (
              <ul className="flex gap-4 font-medium">
                <li className="px-4 py-2 hover:text-pse-green">Vé của tôi</li>
                <li className="px-4 py-2 hover:text-pse-green">
                  Sự kiện của tôi
                </li>
                <li className="px-4 py-2 hover:text-pse-green">
                  Trang cá nhân
                </li>
                <li
                  onClick={() => authContext?.logout()}
                  className="px-4 py-2 hover:text-pse-green"
                >
                  Đăng xuất
                </li>
              </ul>
            ) : (
              <NavLink to="/auth/signin">
                <button className="px-4 py-1 border rounded-md">
                  Đăng nhập
                </button>
              </NavLink>
            )}
          </div>
          <button onClick={handleOpenMobileMenu} className="md:hidden ml-auto">
            <Menu />
          </button>
        </header>

        <form className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              className="w-full bg-transparent border-2 border-white text-white placeholder-white rounded-full py-3 px-5 pr-12 outline-none focus:ring-2 focus:ring-white transition-all duration-300 sm:text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full hover:bg-gray-300 transition-all duration-300"
            >
              <Search />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu  */}
      <div
        className={` ${
          openMobileMenu ? "translate-x-0" : "-translate-x-[100%]"
        } fixed flex flex-col w-full h-screen top-0 left-0 bg-white z-20 transition-all duration-500`}
      >
        <div className="relative bg-black p-6 flex gap-4 rounded-br-[60px] items-center">
          <div className="bg-white h-16 w-16 flex items-center justify-center text-black rounded-full">
            TixClick
          </div>
          <div className="text-base font-semibold">Đăng nhập</div>
          <div className="absolute top-6 right-6">
            <X onClick={handleOpenMobileMenu} />
          </div>
        </div>
        <div className="text-black my-8">
          <ul className="space-y-4">
            <li className="flex items-center gap-2 py-3 px-6 hover:bg-pse-black/20">
              <LuTicketCheck size={24} />
              Vé đã mua
            </li>
            <li className="flex items-center p-3 px-6 gap-2 hover:bg-pse-black/20">
              <RiCalendarEventLine size={24} />
              Sự kiện của tôi
            </li>
            <li className="flex items-center p-3 px-6 gap-2 hover:bg-pse-black/20">
              <CgProfile size={24} />
              Trang cá nhân
            </li>
            <li className="flex items-center p-3 px-6 gap-2 hover:bg-pse-black/20 ">
              <LuLogOut size={24} />
              Đăng xuất
            </li>
          </ul>
        </div>
        <div className="text-white rounded-tl-[60px] flex justify-end items-center gap-4 mt-auto text-right p-6 bg-pse-black">
          <span className="border p-2 rounded-full">
            <FaFacebookSquare size={24} />
          </span>
          <span className="border p-2 rounded-full">
            <AiFillTikTok size={24} />
          </span>
          <span className="border p-2 rounded-full">
            <FaYoutube size={24} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
