"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  FileText,
  Wrench,
  Home,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNotification } from "@/context/notification-context";
import { useRouter } from "next/navigation";

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null); // ✅ theo dõi thông báo đang loading
  const { listNotifications, getNotifications, markAllAsRead } = useNotification();
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, []);

  const unreadCount =
    listNotifications?.filter((n) => n.status === "unread").length || 0;

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-4 w-4 text-blue-400";
    switch (type) {
      case "contract":
        return <FileText className={iconClass} />;
      case "maintenance":
        return <Wrench className={iconClass} />;
      case "unit":
        return <Home className={iconClass} />;
      case "payment":
        return <AlertTriangle className={iconClass} />;
      case "system":
      default:
        return <CheckCircle className={iconClass} />;
    }
  };

  const getPriorityColor = (status: string) => {
    return status === "unread" ? "border-l-blue-500 bg-blue-500/5" : "border-l-gray-600";
  };

  // ✅ Khi click vào 1 thông báo
  const handleNotificationClick = async (notification: any) => {
    try {
      setLoadingId(notification.id); // bật hiệu ứng loading

      // (Tuỳ chọn) Nếu bạn có API markAsRead
      // await markAsRead(notification.id);

      // Chuyển hướng
      if (notification.url) {
        router.push(notification.url);
      }

      // Đóng dropdown sau khi click
      setIsOpen(false);
    } catch (error) {
      console.error("Lỗi khi xử lý thông báo:", error);
    } finally {
      setTimeout(() => setLoadingId(null), 1000); // tắt hiệu ứng sau 1s
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="flex items-center justify-between px-4 py-2">
          <h4 className="font-semibold">Thông báo</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        <ScrollArea className="h-96">
          {listNotifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Không có thông báo mới</p>
            </div>
          ) : (
            <div className="space-y-1">
              {listNotifications.map((notification: any) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer border-l-2 transition-colors relative",
                    getPriorityColor(notification.status),
                    loadingId === notification.id && "opacity-70 cursor-wait"
                  )}
                >
                  {/* ✅ Hiệu ứng loading */}
                  {loadingId === notification.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10 rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    </div>
                  )}

                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(notification.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {listNotifications?.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-4 py-2">
              <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                <Link href="/notifications">Xem tất cả thông báo</Link>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
