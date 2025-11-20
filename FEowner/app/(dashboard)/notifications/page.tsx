"use client";

import { useEffect, useState } from "react";
import { useNotification } from "@/context/notification-context";
import { Button } from "@/components/ui/button";
import { CheckCircle, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
export default function NotificationsPage() {
  const { listNotifications, markAllAsRead } = useNotification();
  const [notifications, setNotifications] = useState(listNotifications || []);
  const Router = useRouter();
  // Cập nhật khi context thay đổi
  useEffect(() => {
    setNotifications(listNotifications);
  }, [listNotifications]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const handleNotificationClick = async (item: any) => {
    try {

      if (item.link || item.url) {
        Router.push(item.link || item.url);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thông báo:", error);
    }
  };
  return (
    <div className="min-h-screen bg-white py-10 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Thông báo</h2>
          <p className="text-gray-600 text-sm">
            {unreadCount > 0
              ? `Bạn có ${unreadCount} thông báo chưa đọc`
              : "Tất cả thông báo đã đọc"}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="flex items-center gap-2 border-gray-300 text-gray-800 hover:bg-gray-100"
          >
            <CheckCircle className="w-4 h-4" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Danh sách thông báo */}
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-200 shadow-sm">
        {notifications.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <Bell className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            Chưa có thông báo nào
          </div>
        ) : (
         notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-5 cursor-pointer transition ${
                item.status === "unread"
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <p
                className={`text-base font-semibold ${
                  item.status === "unread" ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {item.title}
              </p>
              {item.message && (
                <p className="text-sm text-gray-500 mt-1">{item.message}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
