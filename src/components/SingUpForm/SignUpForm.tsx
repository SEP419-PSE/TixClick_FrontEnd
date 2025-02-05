import { LuEye } from "react-icons/lu";
import CustomDivider from "../../components/Divider/CustomDivider";
import { LuEyeClosed } from "react-icons/lu";
import authApi from "../../services/authApi";
import { RegisterRequest } from "../../interface/AuthInterface";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { motion } from "framer-motion";

import GoogleImg from "../../assets/google.png";
import { ChangeEvent, FormEvent, useState } from "react";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    userName: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
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
    authApi
      .signUp(formData)
      .then((response) => {
        console.log(response.data);
        const isSuccess = response.data.code === 200 && "Đăng kí thành công";
        toast.success(isSuccess);
        navigate("/auth/signin");
      })
      .catch((error) => {
        console.log(error);
        toast.warning(error.response.data.message);
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
      <p className="font-bold text-[22px] my-4">Tham gia với chúng tôi</p>
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
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full"
          />
          <div className="my-2 flex gap-2">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Tên"
              className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-[50%]"
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Họ"
              className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-[50%]"
            />
          </div>
        </div>
        <button
          disabled={isLoading && true}
          type="submit"
          className="bg-pse-green text-white w-full font-bold rounded-md py-2 hover:opacity-80"
        >
          {isLoading ? "..." : "Đăng kí"}
        </button>
      </form>
      <div className="my-8">
        <CustomDivider />
      </div>
      <button className="bg-[#333333] flex justify-center items-center font-light gap-2 text-white w-full rounded-md py-2 hover:opacity-80">
        <img src={GoogleImg} width={24} />
        Hoặc đăng kí bằng Goolge
      </button>
      <div className="my-4 text-center font-light">
        Bạn đã có tài khoản?{" "}
        <NavLink to="/auth/signin">
          <span className="text-pse-green font-semibold cursor-pointer hover:underline">
            Đăng nhập
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

export default SignUpForm;
