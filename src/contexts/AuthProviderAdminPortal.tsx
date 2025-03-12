import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axiosClient from "../services/axiosClient";

type Props = {
  children: React.ReactNode;
};

interface AuthInterface {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
  accessTokenAdminPortal: string | null;
}

const AuthContextAdminPortal = createContext<AuthInterface | undefined>(undefined);

const AuthProviderAdminPortal = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [accessTokenAdminPortal, setAccessTokenAdminPortal] = useState<string | null>(
    localStorage.getItem("accessTokenAdminPortal")
  );
  useEffect(() => {
    //Kiểm tra token ở localStorage
    const token = localStorage.getItem("accessTokenAdminPortal");
    if (token) {
      setIsLogin(true);
      setAccessTokenAdminPortal(token);
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [isLogin, accessTokenAdminPortal]);

  const login = () => {
    setIsLogin(true);
  };

  const logout = async () => {
    await localStorage.clear();
    await delete axiosClient.defaults.headers.common["Authorization"];
    await setAccessTokenAdminPortal(null);
    await toast.success("Đăng xuất thành công");
    setIsLogin(false);
  };
  const value = {
    accessTokenAdminPortal,
    isLogin,
    login,
    logout,
  };
  return <AuthContextAdminPortal.Provider value={value}>{children}</AuthContextAdminPortal.Provider>;
};

export { AuthContextAdminPortal, AuthProviderAdminPortal };

