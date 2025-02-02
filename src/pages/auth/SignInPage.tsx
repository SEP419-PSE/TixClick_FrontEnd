import { LuEye } from "react-icons/lu";
import CustomDivider from "../../components/Divider/CustomDivider";
import { LuEyeClosed } from "react-icons/lu";
import GoogleImg from "../../assets/google.png";
import { useState } from "react";
import SignInImg from "../../assets/pexels-wendywei-1190297.jpg";
import { motion } from "framer-motion";

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const onChangeShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex justify-center bg-white text-pse-black text-[16px] h-screen">
      <motion.div
        initial={{ x: -1000 }} // Vị trí ban đầu bên trái ngoài màn hình
        animate={{ x: 0 }} // Vị trí cuối cùng
        transition={{ duration: 2 }}
        className="hidden lg:block"
      >
        <img src={SignInImg} className="h-screen" />
      </motion.div>
      <motion.div
        initial={{ x: 1000 }} // Vị trí ban đầu bên trái ngoài màn hình
        animate={{ x: 0 }} // Vị trí cuối cùng
        transition={{ duration: 2 }}
        className="px-3 py-6 lg:px-8 lg:py-12 w-[456px] h-screen"
      >
        <div className="hidden lg:flex items-center mb-12 gap-2 font-bold text-[20px]">
          <img src={GoogleImg} width={64} />
          <p>Event booking</p>
        </div>
        <p className="font-bold text-[22px]">Chào mừng bạn trở lại</p>
        <div className="my-4">
          <input
            placeholder="Nhập Email"
            className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full"
          />
          <div className="flex items-center my-2 bg-[#e5e5e5] rounded-md px-4 py-2 text-[#808080] w-full">
            <input
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
        <button className="bg-pse-green text-white w-full font-bold rounded-md py-2 hover:opacity-80">
          Đăng nhập
        </button>
        <div className="my-8">
          <CustomDivider />
        </div>
        <button className="bg-[#333333] flex justify-center items-center font-light gap-2 text-white w-full rounded-md py-2 hover:opacity-80">
          <img src={GoogleImg} width={24} />
          Hoặc đăng nhập bằng Goolge
        </button>
        <div className="my-4 text-center font-light">
          Chưa có tài khoản?{" "}
          <span className="text-pse-green font-semibold cursor-pointer hover:underline">
            Đăng ký ngay
          </span>
        </div>
        <div className="lg:hidden flex items-center justify-center mt-16 gap-2 font-bold text-[20px]">
          <img src={GoogleImg} width={64} />
          <p>Event booking</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;
