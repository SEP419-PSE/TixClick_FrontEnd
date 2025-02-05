import React, { createContext, useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import { toast } from "sonner";

type Props = {
  children: React.ReactNode;
};

interface AuthInterface {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthInterface | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  useEffect(() => {
    //Kiểm tra token ở localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLogin(true);
      setAccessToken(token);
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [isLogin, accessToken]);

  const login = () => {
    setIsLogin(true);
  };

  const logout = async () => {
    await localStorage.clear();
    await delete axiosClient.defaults.headers.common["Authorization"];
    await setAccessToken(null);
    await toast.success("Đăng xuất thành công");
    setIsLogin(false);
  };
  const value = {
    accessToken,
    isLogin,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
