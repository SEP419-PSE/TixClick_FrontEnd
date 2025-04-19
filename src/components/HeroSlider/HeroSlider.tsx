import { AxiosError } from "axios";
import { Menu, Search, X } from "lucide-react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AiFillTikTok } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaFacebookSquare, FaYoutube } from "react-icons/fa";
import { LuLogOut, LuTicketCheck } from "react-icons/lu";
import { RiCalendarEventLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthContext } from "../../contexts/AuthProvider";
import companyApi from "../../services/companyApi";

const HeroSlider = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isBackDrop, setIsBackDrop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsBackDrop(true);
      } else {
        setIsBackDrop(false);
      }

      if (window.scrollY > window.innerHeight - 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
    document.body.style.overflow = openMobileMenu ? "auto" : "hidden";
  };

  const hanldeClickCreateEvent = async () => {
    try {
      const response = await companyApi.isAccountHaveCompany();
      console.log(response);
      if (response.data.code == 200) {
        navigate("/create-event");
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        navigate("/create-company", {
          state: toast.error("Bạn cần phải tạo công ty trước"),
        });
      } else {
        console.log("Lỗi không xác định:", axiosError);
        toast.error("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  };

  const submitSearchValue = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("searchValue") as string;
    navigate(`/search?event-name=${searchValue}&maxPrice=${100000}`);

    console.log(searchValue);
  };

  return (
    <div className="">
      <div className="relative">
        {/* <img src="https://images.tkbcdn.com/2/614/350/ts/ds/2b/cf/04/28f7e94ace8d993b981003b88b26b0b5.jpg" />
        <img src="https://images.tkbcdn.com/2/614/350/ts/ds/2a/83/ac/cb6963360dae30f95f517cefc982780e.jpg" />
        <img src="https://images.tkbcdn.com/2/614/350/ts/ds/8a/02/c3/c9d60e7974b86bb46ff88e96ae91b3cc.jpg" /> */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-[100%] h-screen object-cover brightness-90 contrast-125"
        >
          <source
            src="https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Header  */}
        <header
          className={`fixed flex items-center top-0 left-0 w-full p-4 lg:px-14 text-white transition-all duration-500 z-10 ${
            isVisible ? "translate-y-0 " : "-translate-y-full"
          } ${isBackDrop && "backdrop-blur-[20px] bg-black bg-opacity-30"}`}
        >
          <p className="font-semibold text-2xl">TixClick</p>
          <div className="hidden md:block ml-auto">
            {authContext?.isLogin ? (
              <ul className="flex gap-4 font-medium">
                <NavLink to="/ticketManagement">
                  <li className="px-4 py-2 hover:opacity-60">Vé của tôi</li>
                </NavLink>
                <NavLink to="/company">
                  <li className="px-4 py-2 hover:opacity-60">
                    Sự kiện của tôi
                  </li>
                </NavLink>
                <NavLink to="/profileForm">
                  <li className="px-4 py-2 hover:opacity-60">Trang cá nhân</li>
                </NavLink>
                <button onClick={hanldeClickCreateEvent}>
                  <li className="px-4 py-2 border rounded-md hover:opacity-60">
                    Tạo sự kiện
                  </li>
                </button>
                <li
                  onClick={() => authContext?.logout()}
                  className="px-4 py-2 border rounded-md bg-white text-black hover:opacity-60"
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

        <form
          onSubmit={submitSearchValue}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4"
        >
          <div className="relative w-full">
            <input
              type="text"
              name="searchValue"
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
            <li>
              <a
                href="/ticketManagement"
                className="flex items-center gap-2 py-3 px-6 hover:bg-pse-black/20"
              >
                <LuTicketCheck size={24} />
                Vé đã mua
              </a>
            </li>
            <li>
              <a
                href="/consumerCenter"
                className="flex items-center p-3 px-6 gap-2 hover:bg-pse-black/20"
              >
                <RiCalendarEventLine size={24} />
                Sự kiện của tôi
              </a>
            </li>
            <li>
              <a
                href="/profileForm"
                className="flex items-center p-3 px-6 gap-2 hover:bg-pse-black/20"
              >
                <CgProfile size={24} />
                Trang cá nhân
              </a>
            </li>
            <li>
              <a
                href="/logout"
                className="flex items-center p-3 px-6 gap-2 hover:bg-pse-black/20"
              >
                <LuLogOut size={24} />
                Đăng xuất
              </a>
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
