"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AuthAPI, UserAPI } from "@/services/api";
import { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { promises } from "dns";

// Kiểu dữ liệu người dùng
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    refresh_token: string;
    email_verified_at: Date;
    idCard: number;
    signature: string;
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
    phone: string;
    email: string;
    idCard: string;
    password: string;
    password_confirmation: string;
    bank_name: string,
    bank_account: string,
};

type AuthContextType = {
    user: User | null;
    setUsers: (_: User | null) => void;
    resendOTP: (email: string) => Promise<boolean>
    verifyOTP: (OTP: number, email: string) => Promise<boolean>
    login: (email: string, password: string) => Promise<User | null>;
    register: (data: RegisterData) => Promise<boolean>;
    authGoogle: (token: string) => Promise<boolean>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // làm mới lại data user
    const setUsers = async () => {
        try {
            const res = await UserAPI.getMe();
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                // localStorage.setItem("token", res.data.access_token);
                // localStorage.setItem(
                //     "expires_at",
                //     (Date.now() + res.data.expires_in * 1000).toString()
                // );
                // localStorage.setItem("refresh_token", res.data.refresh_token);
            }
        } catch (error: any) {
            console.error("Get me error:", error);
        }
    }
    //xác thực OTP
    const verifyOTP = async (OTP: number, email: string): Promise<boolean> => {
        try {
            const res = await AuthAPI.verifyOTP(OTP, email)
            if (res.data.success) {
                return true
            }
            return false // nếu API trả về nhưng không success
        } catch (error: any) {
            console.error("Verify OTP error:", error)
            return false
        }
    }
    // gửi lại mã OTP
    const resendOTP = async (email: string): Promise<boolean> => {
        try {
            const res = await AuthAPI.resendOTP(email)

            if (res.data.success) {
                return true
            }

            return false
        } catch (error: any) {
            console.error("Resend OTP error:", error)
            return false
        }
    }


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
    const login = async (email: string, password: string): Promise<User | null> => {
        try {
            const response = (await AuthAPI.login(
                email,
                password
            )) as AxiosResponse<LoginResponse>

            if (response.data.success) {
                const loggedInUser = response.data.user
                if (response.data?.user?.role != "owner") {
                    await Swal.fire({
                        title: 'bạn không có quyền đăng nhập',
                        text: "Bạn không phải chủ căn hộ",
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                    return null
                }
                setUser(loggedInUser)

                // Lưu thông tin vào localStorage
                localStorage.setItem("user", JSON.stringify(loggedInUser))
                localStorage.setItem("token", response.data.access_token)
                localStorage.setItem(
                    "expires_at",
                    (Date.now() + response.data.expires_in * 1000).toString()
                )
                localStorage.setItem("refresh_token", response.data.refresh_token)

                // Đặt lịch refresh token
                scheduleRefresh(response.data.expires_in)

                return loggedInUser // ✅ trả luôn user thay vì true/false
            }

            return null
        } catch (error: any) {
            console.log("Login error:", error);

            toast.error(error.response.data.message)
            return null
        }
    }


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
            // console.log(data);
            const res = await AuthAPI.registerOwner(data);
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
        } catch (error: any) {
            console.error("Register error:", error);
            await Swal.fire({
                title: 'Lỗi khi lấy lịch đặt!',
                text: error.response?.data?.message || error.message || "Lỗi server",
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return false;
        }
    };

    // 🟢 Khởi tạo khi load lại trang (F5)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("refresh_token");
        const expiresAt = localStorage.getItem("expires_at");


        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log(parsedUser.signature);
            if (parsedUser.role != "owner") logout();
            if (parsedUser.email_verified_at == null) logout();
            if (parsedUser.signature == null) {
                toast.error("Bạn chưa tạo chữ ký điện tử!", {
                    action: {
                        label: "Tạo ngay",
                        onClick: () => router.push("/signature"),
                    },
                })
            }
        }

        // if (token && expiresAt) {
        //     const timeout = parseInt(expiresAt) - Date.now();
        //     if (timeout > 5000) {
        //         scheduleRefresh(timeout / 1000);
        //     } else {
        //         scheduleRefresh(timeout / 1000);
        //         window.location.href = "/";
        //     }
        // }

        if (!token || !expiresAt || !storedUser) {
            logout();
            return
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUsers, verifyOTP, resendOTP, login, register, authGoogle, logout }}>
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
