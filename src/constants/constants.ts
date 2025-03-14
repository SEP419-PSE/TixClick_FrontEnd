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
