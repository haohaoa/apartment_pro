"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon, LayoutDashboard, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { NotificationDropdown } from "./notification-dropdown"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 overflow-hidden">
      {/* Enhanced glassmorphism background with premium gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/75 to-slate-950/80 backdrop-blur-3xl"></div>

      {/* Subtle border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Top highlight for depth */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none"></div>

      {/* Logo - Enhanced with glow and prominence */}
      <Link
        href="/"
        className="flex items-center gap-3 text-xl font-bold text-white hover:text-white transition-all duration-300 relative z-10 group"
        prefetch={false}
      >
        {/* Logo container with enhanced glassmorphism and glow */}
        <div className="relative p-2.5 bg-gradient-to-br from-white/15 to-white/5 rounded-xl backdrop-blur-md shadow-lg border border-white/20 group-hover:border-white/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-white/20">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <HomeIcon className="w-6 h-6 relative z-10 drop-shadow-lg" />
        </div>

        {/* Logo text with enhanced gradient and glow */}
        <span className="relative">
          <span className="absolute inset-0 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent blur-sm opacity-50"></span>
          <span className="relative bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] font-extrabold tracking-tight">
            StayTalk
          </span>
        </span>
      </Link>

      {/* Menu phải */}
      <div className="flex items-center gap-4 relative z-10">
        {user ? (
          <>
            {/* Dashboard */}
            <Link href="/dashboard" passHref>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-100 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all duration-300 font-medium backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
           <NotificationDropdown />
            {/* User + Logout */}
            <div className="flex items-center gap-4 pl-4 border-l border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-white/15 to-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md">
                  <User className="w-4 h-4 text-gray-100" />
                </div>
                <span className="font-medium text-gray-100 hidden md:inline">
                  Xin chào, <span className="text-white font-semibold">{user?.name}</span>
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-red-200 hover:text-white hover:bg-red-500/15 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 font-medium backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-red-500/10"
              >
                Đăng xuất
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" passHref>
              <Button
                variant="ghost"
                className="text-gray-100 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all duration-300 font-medium backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button className="bg-gradient-to-r from-white via-blue-50 to-white text-gray-900 font-semibold shadow-lg hover:shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all duration-300 border border-white/30 backdrop-blur-sm">
                Đăng ký
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
