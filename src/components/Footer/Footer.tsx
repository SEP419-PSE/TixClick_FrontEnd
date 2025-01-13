import { FaRegCopyright } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-pse-footer">
      <div className="px-4 py-2 lg:px-14 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-3 bg-pse-footer">
        <div className="leading-8">
          <p className="uppercase font-semibold">Giới thiệu</p>
          <ul className="font-extralight">
            <li>Về Chúng Tôi</li>
            <li>Thỏa Thuận Sử Dụng</li>
            <li>Quy Chế Hoạt Động</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div className="leading-8">
          <p className="uppercase font-semibold">Dành cho Khách hàng</p>
          <ul className="font-extralight">
            <li>Điều khoản sử dụng cho khách hàng</li>
          </ul>
        </div>
        <div className="leading-8">
          <p className="uppercase font-semibold">Dành cho Ban Tổ chức</p>
          <ul className="font-extralight">
            <li>Điều khoản sử dụng cho ban tổ chức</li>
          </ul>
        </div>
        <div className="leading-8">
          <p className="uppercase font-semibold">Hỏi đáp</p>
          <ul className="font-extralight">
            <li>Hỗ trợ tài khoản</li>
            <li>Quy định về mua & bán vé</li>
          </ul>
        </div>
        <div className="leading-8">
          <p className="uppercase font-semibold">Theo dõi chúng tôi</p>
          <ul className="font-extralight">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>Twitter</li>
            <li>Youtube</li>
          </ul>
        </div>
        <div className="w-full h-[2px] bg-white rounded-full"></div>
      </div>
      <div className="font-extralight pb-2 text-center flex items-center justify-center">
        <span className="mr-1">
          <FaRegCopyright />
        </span>
        2023 Eventify. All rights reserved
      </div>
    </div>
  );
};

export default Footer;
