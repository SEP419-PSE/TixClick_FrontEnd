import { LuEye } from "react-icons/lu";
import CustomDivider from "../../components/Divider/CustomDivider";
import { LuEyeClosed } from "react-icons/lu";
import authApi from "../../services/authApi";
import { LoginRequest } from "../../interface/AuthInterface";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthProvider";
import { motion } from "framer-motion";

import GoogleImg from "../../assets/google.png";
import { ChangeEvent, FormEvent, useContext, useState } from "react";

const SignInForm = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    userName: "",
    password: "",
  });

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(formData);
    authApi
      .signIn(formData)
      .then((response) => {
        localStorage.clear();
        console.log(response.data);
        localStorage.setItem("accessToken", response.data.result.accessToken);
        localStorage.setItem("refreshToken", response.data.result.refreshToken);
        authContext?.login();
        if (response.data.result.status == true) {
          navigate("/");
          toast.success("Đăng nhập thành công");
        } else {
          navigate("/auth/verify");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <motion.div
      initial={{ x: 500 }} // Vị trí ban đầu bên trái ngoài màn hình
      animate={{ x: 0 }} // Vị trí cuối cùng
      transition={{ duration: 1.5 }}
      className="px-3 py-6 lg:px-8 lg:py-12 w-[550px] h-screen"
    >
      <div className="hidden lg:flex items-center mb-12 gap-2 font-bold text-[20px]">
        <img src={GoogleImg} width={64} />
        <p>Event booking</p>
      </div>
      <p className="font-bold text-[22px] my-4">Chào mừng bạn trở lại</p>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <input
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Tên đăng nhập"
            className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full"
          />
          <div className="flex items-center my-2 bg-[#e5e5e5] rounded-md px-4 py-2 text-[#808080] w-full">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={isShowPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="w-full bg-[#e5e5e5] outline-none"
            />
            <span>
              {isShowPassword ? (
                <LuEyeClosed
                  onClick={onChangeShowPassword}
                  size={20}
                  className="text-[#4d4d4d]"
                />
              ) : (
                <LuEye
                  onClick={onChangeShowPassword}
                  size={20}
                  className="text-[#4d4d4d]"
                />
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-[14px] font-semibold">
            <div className="flex items-center gap-2">
              <label className="relative inline-block h-7 w-[48px] cursor-pointer rounded-full bg-[#e5e5e5] transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-pse-green">
                <input
                  type="checkbox"
                  id="AcceptConditions"
                  className="peer sr-only"
                />
                <span className="absolute inset-y-0 start-0 m-1 size-5 rounded-full ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 bg-gray-900 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
              </label>
              <p>Nhớ mật khẩu</p>
            </div>
            <div className="text-pse-green cursor-pointer hover:underline">
              Quên mật khẩu?
            </div>
          </div>
        </div>
        <button
          disabled={isLoading && true}
          type="submit"
          className="bg-pse-green text-white w-full font-bold rounded-md py-2 hover:opacity-80"
        >
          {isLoading ? "..." : "Đăng nhập"}
        </button>
      </form>
      <div className="my-8">
        <CustomDivider />
      </div>
      <a href="https://tixclick.site:8443/">
        <button className="bg-[#333333] flex justify-center items-center font-light gap-2 text-white w-full rounded-md py-2 hover:opacity-80">
          <img src={GoogleImg} width={24} />
          Hoặc đăng nhập bằng Goolge
        </button>
      </a>
      <div className="my-4 text-center font-light">
        Chưa có tài khoản?{" "}
        <NavLink to="/auth/signup">
          <span className="text-pse-green font-semibold cursor-pointer hover:underline">
            Đăng ký ngay
          </span>
        </NavLink>
      </div>
      <div className="lg:hidden flex items-center justify-center mt-16 gap-2 font-bold text-[20px]">
        <img src={GoogleImg} width={64} />
        <p>Event booking</p>
      </div>
    </motion.div>
  );
};

export default SignInForm;
