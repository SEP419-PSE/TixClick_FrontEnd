const Footer = () => {
  return (
    <div className="px-4 py-2 flex flex-col gap-3 bg-pse-footer">
      <div className="leading-8">
        <p className="uppercase font-semibold">Giới thiệu</p>
        <ul>
          <li>Về Chúng Tôi</li>
          <li>Thỏa Thuận Sử Dụng</li>
          <li>Quy Chế Hoạt Động</li>
          <li>Chính sách bảo mật</li>
        </ul>
      </div>
      <div className="leading-8">
        <p className="uppercase font-semibold">Dành cho Khách hàng</p>
        <ul>
          <li>Về Chúng Tôi</li>
        </ul>
      </div>
      <div className="leading-8">
        <p className="uppercase font-semibold">Dành cho Ban Tổ chức</p>
        <ul>
          <li>Điều khoản sử dụng cho ban tổ chức</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
