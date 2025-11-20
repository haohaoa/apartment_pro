"use client"

import { Building2, Home, Wrench, FileText, LayoutDashboard, Settings, Bell, PenTool ,CalendarClock } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  {
    title: "Tổng quan",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tòa nhà",
    url: "/buildings",
    icon: Building2,
  },
  // {
  //   title: "Căn hộ",
  //   url: "/units",
  //   icon: Home,
  // },
  {
    title: "Bảo trì",
    url: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Hợp đồng",
    url: "/contracts",
    icon: FileText,
  },
  {
    title: "Thông báo",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "lịch xem phòng",
    url: "/schedule",
    icon: CalendarClock ,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Building2 className="h-6 w-6" />
          <span className="font-semibold">StayTalkPro</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/signature" className="flex items-center gap-2 font-bold text-blue-600">
                <PenTool className="h-5 w-5 text-blue-600" />
                <span>Cài đặt chữ ký</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
