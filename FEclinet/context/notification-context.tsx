"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'sonner';
import { getToken } from "@/services/api";
import { NotificationAPI } from "@/services/api";
import type { Notification } from "@/lib/types";
import axios, { AxiosError } from 'axios';
interface NotificationContextType {
    notifications: { message: string; time: string }[];
    listNotifications: Notification[];
    getNotifications: () => Promise<boolean>;
    markAllAsRead: () => Promise<void>;
}
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

const bookingContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<{ message: string; time: string }[]>([]);
    const [listNotifications, setListNotifications] = useState<Notification[]>([]);
    const formatNotification = (data: any): Notification => ({
        id: data.id ?? Date.now(),
        title: data.title ?? "Thông báo mới",
        message: data.message ?? "",
        status: "unread",
        created_at: data.created_at ?? new Date().toISOString(),
        updated_at: data.updated_at ?? new Date().toISOString(),
        type: data.type ?? "info",
        user_id: data.userId ?? null,
        url: data.url ?? null,
    });

    useEffect(() => {
        const connectSSE = async () => {
            const token = await getToken();
            if (!token) return;
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
            const eventSource = new EventSource(`http://127.0.0.1:8002/api/notifications/stream?token=${token}`);

            // Khi có thông báo mới
            eventSource.addEventListener("notification", (event) => {
                const data = JSON.parse((event as MessageEvent).data);
                console.log("📩 Nhận SSE:", data);

                // ✅ Thêm vào danh sách hiển thị dropdown
                setListNotifications((prev) => [formatNotification(data), ...prev]);


                // ✅ Hiển thị realtime toast
                const type: ToastType = data.type ?? "info";
                if (toast[type]) {
                    toast[type](data.message, {
                        duration: 20000,
                        dismissible: true,
                    });
                } else {
                    toast.info(data.message, {
                         duration: 20000,
                        dismissible: true,
                    });
                }
            });

            // Heartbeat
            eventSource.addEventListener("heartbeat", () => {
                console.log("💓 SSE vẫn hoạt động");
            });

            eventSource.onerror = (err) => {
                console.error("[SSE] Lỗi kết nối:", err);
                eventSource?.close();
                setTimeout(connectSSE, 3000);
            };
        };

        connectSSE();
    }, []);


    // Giả sử bạn đã import Notification và NotificationAPI

    const getNotifications = async (): Promise<boolean> => {
        try {
            const res = await NotificationAPI.getall();
            const notifications: Notification[] = res.data.data;            // 3. Cập nhật trạng thái
            setListNotifications(notifications);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.error("Lỗi phản hồi API:", axiosError.response.status, axiosError.response.data);
                } else if (axiosError.request) {
                    console.error("Lỗi mạng/Kết nối:", axiosError.message);
                } else {
                    console.error("Lỗi cấu hình request:", axiosError.message);
                }
            } else {
                console.error("Lỗi không xác định:", error);
            }
            return false;
        }
    }
    const markAllAsRead = async () => {
        try {
            await NotificationAPI.markAllAsRead();
            setListNotifications((prev) =>
                prev.map((n) => ({ ...n, status: "read" }))
            );
        } catch (err) {
            console.error("Lỗi khi đánh dấu tất cả đã đọc:", err);
        }
    };

    return (
        <bookingContext.Provider value={{ notifications, listNotifications, getNotifications, markAllAsRead }}>
            {children}
        </bookingContext.Provider>
    );
}

// Hook dùng context
export function useNotification() {
    const context = useContext(bookingContext);
    if (!context) {
        throw new Error("useNotification phải được dùng trong BookingProvider");
    }
    return context;
}
