"use client" // Cho Next.js biết file này chạy trên client

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Apartment, Booking } from "@/lib/data"

// Định nghĩa kiểu tin nhắn trong chat
type Message = {
  id: string
  sender: "user" | "ai" // Người gửi là user hay AI
  text: string
  apartment?: Apartment // Thông tin căn hộ gợi ý (có thể có hoặc không)
}

// Định nghĩa kiểu dữ liệu mà Context sẽ cung cấp cho toàn app
type AppContextType = {
  isChatPanelOpen: boolean // Trạng thái panel chat (đang mở/đóng)
  isBookingPanelOpen: boolean // Trạng thái panel booking
  toggleChatPanel: () => void // Hàm bật/tắt chat panel
  toggleBookingPanel: () => void // Hàm bật/tắt booking panel
  chatMessages: Message[] // Danh sách tin nhắn chat
  addChatMessage: (message: Message) => void // Hàm thêm tin nhắn mới
  searchResults: Apartment[] // Kết quả tìm kiếm căn hộ
  setSearchResults: (results: Apartment[]) => void // Hàm set kết quả tìm kiếm
  selectedBooking: Booking | null // Booking đang chọn (có thể null)
  setSelectedBooking: (booking: Booking | null) => void // Hàm set booking
}

// Tạo context (chứa dữ liệu chung) - mặc định là undefined
const AppContext = createContext<AppContextType | undefined>(undefined)

// Component Provider (bao bọc app, cung cấp dữ liệu chung cho mọi component con)
export function AppProvider({ children }: { children: ReactNode }) {
  // Các state toàn cục
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)
  const [isBookingPanelOpen, setIsBookingPanelOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [searchResults, setSearchResults] = useState<Apartment[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Hàm bật/tắt chat panel
  const toggleChatPanel = () => {
    setIsChatPanelOpen(!isChatPanelOpen)
    setIsBookingPanelOpen(false) // Khi mở chat thì đóng booking
  }

  // Hàm bật/tắt booking panel
  const toggleBookingPanel = () => {
    setIsBookingPanelOpen(!isBookingPanelOpen)
    setIsChatPanelOpen(false) // Khi mở booking thì đóng chat
  }

  // Hàm thêm tin nhắn mới vào danh sách chat
  const addChatMessage = (message: Message) => {
    setChatMessages((prevMessages) => [...prevMessages, message])
  }

  // Trả về Provider, cung cấp dữ liệu + hàm cho mọi component con
  return (
    <AppContext.Provider
      value={{
        isChatPanelOpen,
        isBookingPanelOpen,
        toggleChatPanel,
        toggleBookingPanel,
        chatMessages,
        addChatMessage,
        searchResults,
        setSearchResults,
        selectedBooking,
        setSelectedBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Custom hook để dùng context dễ hơn
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
