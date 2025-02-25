import { FaRegCopyright } from "react-icons/fa6";
import CustomDivider from "../Divider/CustomDivider";

const Footer = () => {
  return (
    <div className="bg-pse-footer text-white">
      <div className="px-4 py-4 lg:px-14 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-3 bg-pse-footer">
        <div className="leading-8">
          <p className="uppercase font-bold text-pse-green">Giới thiệu</p>
          <ul className="font-normal">
            <li>Về Chúng Tôi</li>
            <li>Thỏa Thuận Sử Dụng</li>
            <li>Quy Chế Hoạt Động</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div className="leading-8">
          <p className="uppercase font-bold text-pse-green">
            Dành cho Khách hàng
          </p>
          <ul className="font-normal">
            <li>Điều khoản sử dụng cho khách hàng</li>
          </ul>
        </div>
        <div className="leading-8">
          <p className="uppercase font-bold text-pse-green">
            Dành cho Ban Tổ chức
          </p>
          <ul className="font-normal">
            <li>Điều khoản sử dụng cho ban tổ chức</li>
          </ul>
        </div>
        <div className="leading-8">
          <p className="uppercase font-bold text-pse-green">Hỏi đáp</p>
          <ul className="font-normal">
            <li>Hỗ trợ tài khoản</li>
            <li>Quy định về mua & bán vé</li>
          </ul>
        </div>
        <div className="leading-8">
          <p className="uppercase font-bold text-pse-green">
            Theo dõi chúng tôi
          </p>
          <ul className="font-normal">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>Twitter</li>
            <li>Youtube</li>
          </ul>
        </div>
        <CustomDivider />
      </div>
      <div className="font-semibold pb-8 text-center flex items-center justify-center">
        <span className="mr-1">
          <FaRegCopyright />
        </span>
        2023 Tixclick. All rights reserved
      </div>
    </div>
  );
};

export default Footer;
