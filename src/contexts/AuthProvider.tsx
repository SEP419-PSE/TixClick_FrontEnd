import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axiosClient from "../services/axiosClient";

type Props = {
  children: React.ReactNode;
};

interface AuthInterface {
  isLogin: boolean;
  isSuperLogin: boolean;
  login: (token: string, role: string) => void;
  superLogin: (token: string) => void;
  logout: () => void;
  accessToken: string | null;
  accessToken2: string | null;
  role: string;
  setTokenForAxios: (tokenType: "user" | "super", token: string) => void;
}

const AuthContext = createContext<AuthInterface | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState<string>();
  const [isSuperLogin, setIsSuperLogin] = useState<boolean>(false);
  const [accessToken2, setAccessToken2] = useState<string | null>(
    localStorage.getItem("accessToken2")
  );

  // Kiểm tra token khi load trang
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("roleName");
    if (role) {
      setRole(role);
    }
    if (token) {
      setIsLogin(true);
      setAccessToken(token);
    }

    const superToken = localStorage.getItem("accessToken2");
    if (superToken) {
      setIsSuperLogin(true);
      setAccessToken2(superToken);
    }
  });

  // Đặt token theo loại login
  const setTokenForAxios = (tokenType: "user" | "super", token: string) => {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const login = (token: string, role: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("roleName", role);
    setIsLogin(true);
    setAccessToken(token);
  };

  const superLogin = (token: string) => {
    localStorage.setItem("accessToken2", token);
    setIsSuperLogin(true);
    setAccessToken2(token);
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken2");
    delete axiosClient.defaults.headers.common["Authorization"];
    setAccessToken(null);
    setAccessToken2(null);
    setIsLogin(false);
    setIsSuperLogin(false);
    toast.success("Đăng xuất thành công");
  };

  const value = {
    accessToken,
    accessToken2,
    isLogin,
    isSuperLogin,
    role,
    login,
    superLogin,
    logout,
    setTokenForAxios,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
