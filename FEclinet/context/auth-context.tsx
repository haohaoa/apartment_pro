"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AuthAPI } from "@/services/api";
import { AxiosResponse } from "axios";

// Kiểu dữ liệu người dùng
interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  expires_in: number; // giây
  refresh_token: string;
  user: User;
}

type RegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  authGoogle: (token: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);

  // 🟢 Hàm logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  // 🟢 Hàm refresh token
  const refreshToken = async (token: string) => {
    try {
      const res = await AuthAPI.refreshToken(token);
      console.log(res);

      if (res.data.success) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem(
          "expires_at",
          (Date.now() + res.data.expires_in * 1000).toString()
        );

        // đặt lại lịch refresh
        scheduleRefresh(res.data.expires_in);
      } else {
        // logout();
      }
    } catch (error) {
      console.error("Refresh token failed:", error);
      // logout();
    }
  };

  // 🟢 Hàm đặt lịch refresh token
  const scheduleRefresh = (expiresIn: number) => {
    const timeout = expiresIn * 1000 - 5000; // refresh sớm 5s
    console.log(timeout);
    setTimeout(() => {
      const token = localStorage.getItem("refresh_token");
      if (token) refreshToken(token);
    }, timeout);
  };

  // 🟢 Hàm login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = (await AuthAPI.login(
        email,
        password
      )) as AxiosResponse<LoginResponse>;

      if (response.data.success) {
        const loggedInUser = response.data.user;
        setUser(loggedInUser);

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem(
          "expires_at",
          (Date.now() + response.data.expires_in * 1000).toString()
        );
        localStorage.setItem("refresh_token", response.data.refresh_token);

        // Đặt lịch refresh
        scheduleRefresh(response.data.expires_in);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // login gg 
  const authGoogle = async (token: string): Promise<boolean> => {
    try {
      const res = await AuthAPI.loginGoogle(token);
      if (res.data.success) {
        const newUser = res.data.user;
        setUser(newUser);

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem(
          "expires_at",
          (Date.now() + res.data.expires_in * 1000).toString()
        );
        localStorage.setItem("refresh_token", res.data.refresh_token);

        // Đặt lịch refresh
        scheduleRefresh(res.data.expires_in);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login Google error:", error);
      return false;
    }
  };

  // 🟢 Hàm register
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const res = await AuthAPI.register(data);
      if (res.data.success) {
        const newUser = res.data.user;
        setUser(newUser);

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem(
          "expires_at",
          (Date.now() + res.data.expires_in * 1000).toString()
        );
        localStorage.setItem("refresh_token", res.data.refresh_token);

        // Đặt lịch refresh
        scheduleRefresh(res.data.expires_in);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      alert("Đăng ký thất bại: email đã tồn tại hoặc thông tin không hợp lệ!");
      return false;
    }
  };

  // 🟢 Khởi tạo khi load lại trang (F5)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("refresh_token");
    const expiresAt = localStorage.getItem("expires_at");

    if (storedUser) setUser(JSON.parse(storedUser));

    // if (token && expiresAt) {
    //   const timeout = parseInt(expiresAt) - Date.now();
    //   if (timeout > 5000) {
    //     scheduleRefresh(timeout / 1000);
    //     // gettoken();
    //   } else {
    //     scheduleRefresh(timeout / 1000);
    //     window.location.href = "/";
    //     // gettoken();
    //   }
    // }
  }, []);
  // const gettoken = ()=>{
  //   const token = localStorage.getItem("token");
  //   return token
  // }

  return (
    <AuthContext.Provider value={{ user, token, login, register, authGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🟢 Hook sử dụng context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
