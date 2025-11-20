"use client";

import { useEffect, useState } from "react";
import { Bell, X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/notification-context";
import { useAuth } from "@/context/auth-context"; // ✅ dùng để kiểm tra đăng nhập
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const typeColors = {
  info: "bg-blue-500/10 border-blue-500/20",
  success: "bg-green-500/10 border-green-500/20",
  warning: "bg-yellow-500/10 border-yellow-500/20",
  error: "bg-red-500/10 border-red-500/20",
};

const typeBadgeColors = {
  info: "bg-blue-500/20 text-blue-300",
  success: "bg-green-500/20 text-green-300",
  warning: "bg-yellow-500/20 text-yellow-300",
  error: "bg-red-500/20 text-red-300",
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { listNotifications, getNotifications, markAllAsRead } = useNotification();
  const { user } = useAuth(); // ✅ Lấy thông tin đăng nhập từ context
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, []);

  const unreadCount =
    listNotifications?.filter((n) => n.status === "unread").length || 0;
  const recentNotifications = listNotifications?.slice(0, 5) || [];

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // ✅ Khi click vào 1 thông báo
  const handleNotificationClick = async (item: any) => {
    if (loadingId) return; // tránh click liên tục
    setLoadingId(item.id);

    try {
      if (!user) {
        // Nếu chưa đăng nhập thì chuyển sang login
        router.push("/login");
        return;
      }

      // Có thể mark as read nếu cần
      // await markAsRead(item.id);

      // Chuyển hướng đến trang đích
      if (item.url) {
        router.push(item.url);
      }

      // Đóng dropdown
      setIsOpen(false);
    } catch (error) {
      console.error("Lỗi khi xử lý thông báo:", error);
    } finally {
      setTimeout(() => setLoadingId(null), 1000);
    }
  };

  return (
    <div className="relative">
      {/* Nút chuông */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-100 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-lg transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md group"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -translate-y-1 translate-x-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed top-14 right-4 w-96 bg-slate-900/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden z-[9999]">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">Thông báo</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Đánh dấu đọc hết
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="space-y-2 p-3">
                {recentNotifications.map((item) => {
                  const type = "info";
                  const createdTime = formatDistanceToNow(
                    new Date(item.created_at),
                    { addSuffix: true, locale: vi }
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`relative p-3 rounded-lg border transition-all cursor-pointer hover:bg-white/5 ${
                        typeColors[type]
                      } ${
                        item.status === "unread"
                          ? "bg-white/5 border-blue-500/20"
                          : "bg-transparent border-white/10"
                      }`}
                    >
                      {loadingId === item.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 px-2 py-1 rounded text-xs font-medium ${typeBadgeColors[type]}`}
                        >
                          Hệ thống
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">
                            {item.title}
                          </p>
                          <p className="text-gray-300 text-xs mt-1">
                            {item.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            {createdTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400">Không có thông báo mới</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 bg-white/5">
            <Link href="/notifications">
              <Button
                variant="ghost"
                className="w-full text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 font-medium"
              >
                Xem tất cả thông báo
              </Button>
            </Link>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
