import Avt from "../../../assets/AvatarHuy.jpg";

const CompanyAccount = () => {
  return (
    <div className="flex gap-2 items-center">
      <p className="flex flex-col items-end text-pse-black text-[16px]">
        Công ty ABC
        <span className="text-[14px] text-pse-gray">29 Lê Thánh Tôn</span>
      </p>
      <img src={Avt} alt="Avatar" className="rounded-full w-[38px] h-[38px]" />
    </div>
  );
};

export default CompanyAccount;
