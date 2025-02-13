import { motion } from "framer-motion";
import EnterCodeImg from "../../assets/Rating.png";
import { FormEvent, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import authApi from "../../services/authApi";
import { toast } from "sonner";
const EnterCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  //   console.log(state);
  const length: number = 6;
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const convertOTP = otp.join("");
    authApi
      .verifyOTP(state, convertOTP)
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          toast.success(response.data.message);
          navigate("/");
        }
      })
      .catch((error) => {
        // console.log(error);
        toast.error(error.response.data.message);
      });
  };

  return (
    <motion.div
      initial={{ x: 500 }} // Vị trí ban đầu bên trái ngoài màn hình
      animate={{ x: 0 }} // Vị trí cuối cùng
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center px-3 py-6 lg:px-8 lg:py-12 w-[550px] h-screen text-pse-black"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <img src={EnterCodeImg} />
        </div>
        <div className="my-4 text-center space-y-2">
          <p className="font-semibold text-[22px]">Xác thực OTP</p>
          <p className="font-normal">
            Chúng tôi sẽ gửi mã cho bạn vào
            <span className="font-semibold ml-1">Email</span>
          </p>
          <p className="font-semibold">{state}</p>
        </div>
        <div className="flex gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value.slice(-1))}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center border-2 border-gray-300 rounded focus:border-pse-green focus:outline-none text-lg"
            />
          ))}
        </div>
        <button
          type="submit"
          className="bg-pse-green my-5 text-white w-full font-bold rounded-md py-2 hover:opacity-80"
        >
          Xác thực
        </button>
      </form>
    </motion.div>
  );
};

export default EnterCode;
