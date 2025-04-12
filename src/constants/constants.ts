export const PATHNAME_EXCEPT = [
  "/auth/signin",
  "/auth/signup",
  "/auth/verify",
  "/auth/code",
  "/organizer",
  "/create-event",
];
export const BASEURL_API = "http://localhost:8080";

export const TOAST_WARNING = "Vui lòng điền đầy đủ thông tin";

export const ball = {
  width: 100,
  height: 100,
  backgroundColor: "#dd00ee",
  borderRadius: "50%",
};

export const ERROR_RESPONSE = {
  invalidAccount: () => {
    return "Tài khoản chưa được kích hoạt";
  },
};

export const subRoles = [
  { id: 1, name: "Admin", value: "ADMIN" },
  {
    id: 2,
    name: "Nhân viên",
    value: "EMPLOYEE",
  },
];

export const TOAST_MESSAGE = {
  successCreateMember: "Tạo member thành công",
  successUpdateMember: "Cập nhật thành công",
  signInSucces: "Đăng nhập tài khoản thành công",
  signInFail: "Đăng nhập tài khoản thất bại",
  signUpSucces: "Đăng ký tài khoản thành công",
  signUpFail: "Đăng ký tài khoản thất bại",
  sentOTPsuccess: "Mã OTP đã được gửi lại",
  emmptyEventActivity:
    "Vui lòng điền đầy đủ thông tin cho hoạt động trước khi thêm loại vé",
  error: "Đã có lỗi xảy ra",
};
