import { LockKeyhole, PhoneCall } from "lucide-react";
import { useEffect } from "react";

type Props = {
  message?: string;
};

const LockPage = ({ message }: Props) => {
  useEffect(() => {
    // Vô hiệu hóa scroll và tương tác
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";
    return () => {
      // Khôi phục lại khi thoát khỏi trang
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, []);

  return (
    <div className="fixed flex-col gap-4 w-full h-full top-0 right-0 z-[9999] bg-black bg-opacity-60 flex items-center justify-center text-2xl font-bold">
      <LockKeyhole size={40} />

      <p className="text-center">{message}</p>
      <p className="flex items-center gap-2">
        <PhoneCall /> <span>Hotline CSKH: 0931337204</span>
      </p>
    </div>
  );
};

export default LockPage;
