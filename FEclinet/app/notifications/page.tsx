"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/notification-context";
import { format } from "date-fns";

const typeColors: Record<string, string> = {
  info: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
  success: "bg-green-500/10 border-green-500/20 hover:bg-green-500/20",
  warning: "bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20",
  error: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20",
  system: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20",
};

const typeIcons: Record<string, any> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
  system: Bell,
};

export default function NotificationsPage() {
  const router = useRouter();
  const {
    listNotifications,
    getNotifications,
    markAllAsRead,
  } = useNotification();

  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getNotifications();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Số lượng chưa đọc
  const unreadCount = useMemo(
    () => listNotifications?.filter((n) => n.status === "unread").length || 0,
    [listNotifications]
  );

  const handleMarkAll = async () => {
    setMarkingAll(true);
    await markAllAsRead();
    setMarkingAll(false);
  };

  const handleOpenNotification = async (item: any) => {
    if (item.url) {
      router.push(item.url);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/40">
              <Bell className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Thông báo</h1>
              <p className="text-gray-400 text-sm">
                {unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : "Bạn đã đọc tất cả thông báo"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAll}
              variant="ghost"
              disabled={markingAll}
              className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 border border-blue-500/20"
            >
              {markingAll ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4 mr-2" />
              )}
              Đánh dấu tất cả
            </Button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-400" />
            Đang tải thông báo...
          </div>
        ) : (
          <div className="space-y-3">
            {listNotifications && listNotifications.length > 0 ? (
              listNotifications.map((notification) => {
                const IconComponent = typeIcons[notification.type] || Bell;
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleOpenNotification(notification)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer group ${typeColors[notification.type] ||
                      "bg-slate-700/20 border-slate-600/40"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white font-semibold">
                              {notification.title}
                              {notification.status === "unread" && (
                                <span className="ml-2 w-2 h-2 bg-blue-400 rounded-full inline-block"></span>
                              )}
                            </p>
                            <p className="text-gray-300 text-sm mt-1">
                              {notification.message}
                            </p>
                          </div>

                        </div>
                        <p className="text-gray-500 text-xs mt-3">
                          {format(
                            new Date(notification.created_at),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 text-lg">Không có thông báo</p>
                <Link href="/" className="mt-4 inline-block">
                  <Button variant="outline">Quay lại trang chủ</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
