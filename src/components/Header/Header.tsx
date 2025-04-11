import { useContext, useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { LuLogOut, LuSearch, LuTicketCheck } from "react-icons/lu";
import { RiCalendarEventLine } from "react-icons/ri";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import Avatar from "../../assets/boy.png";
import { AuthContext } from "../../contexts/AuthProvider";
import SearchBar from "../SearchBar/SearchBar";
import companyApi from "../../services/companyApi";
import { AxiosError } from "axios";
import { toast } from "sonner";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setOpenMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const hanldeClickCreateEvent = async () => {
    try {
      const response = await companyApi.isAccountHaveCompany();
      console.log(response.data.code);
      if (response.data.code == 200) {
        navigate("/create-event");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        navigate("/create-company", {
          state: toast.error("Bạn cần phải tạo công ty trước"),
        });
      } else {
        console.log("Lỗi không xác định:", axiosError.message);
        toast.error("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full p-4 lg:px-14 bg-pse-header flex items-center text-pse-text transition-transform duration-500 z-20 ${
        location.pathname !== "/" && "translate-y-0"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <p className="text-[24px] font-semibold text-pse-green">TixClick</p>
      <div className="ml-auto flex items-center gap-4">
        <SearchBar />
        <span className="lg:hidden p-[6px] border rounded-full">
          <LuSearch size={24} />
        </span>

        <button
          onClick={hanldeClickCreateEvent}
          className="hidden md:block px-4 py-2 rounded-lg bg-pse-green text-white font-semibold hover:scale-110 transition-all duration-500"
        >
          Tạo sự kiện
        </button>
        <div className="font-semibold flex items-center cursor-pointer">
          {authContext?.isLogin ? (
            <div
              onMouseEnter={() => setOpenMenu(true)}
              onClick={() => setOpenMenu(true)}
              className="relative p-[6px] rounded-full border border-pse-text"
            >
              <img src={Avatar} width={24} />
              <div
                onMouseLeave={() => setOpenMenu(false)}
                className={`absolute ${
                  openMenu ? "block" : "hidden"
                } top-10 right-0 bg-white rounded-lg text-black w-[200px] transition-all duration-500 z-10`}
              >
                <ul className="rounded-lg">
                  <Link to="/ticketManagement">
                    <li className="flex items-center gap-2 p-3 hover:bg-pse-gray/50 rounded-tl-lg rounded-tr-lg">
                      <LuTicketCheck size={24} />
                      Vé đã mua
                    </li>
                  </Link>
                  <Link to="/company">
                    <li className="flex items-center p-3 gap-2 hover:bg-pse-gray/50">
                      <RiCalendarEventLine size={24} />
                      Sự kiện của tôi
                    </li>
                  </Link>
                  <Link to="/profileForm">
                    <li className="flex items-center p-3 gap-2 hover:bg-pse-gray/50">
                      <CgProfile size={24} />
                      Trang cá nhân
                    </li>
                  </Link>
                  <li
                    onClick={() => authContext.logout()}
                    className="flex items-center p-3 gap-2 hover:bg-pse-gray rounded-bl-lg rounded-br-lg"
                  >
                    <LuLogOut size={24} />
                    Đăng xuất
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <NavLink to="/auth/signin">
                <span className="hover:border-b-2">Đăng nhập</span>
              </NavLink>
              <span className="md:block hidden mx-1">|</span>
              <NavLink to="/auth/signup">
                <span className="md:block hidden hover:border-b-2">
                  Đăng ký
                </span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
