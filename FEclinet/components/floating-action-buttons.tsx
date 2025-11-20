"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, CalendarDays } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useClickContext } from "@/context/handleClick-context"

export function FloatingActionButtons() {
  const { user } = useAuth()
  const { toggleChatPanel, toggleBookingPanel } = useAppContext()
  const {  BookingPanel } = useClickContext()

  if (!user) {
    return null // Only show buttons if user is logged in
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <Button
        size="icon"
        className="rounded-full shadow-lg w-14 h-14 bg-blue-600 hover:bg-blue-700"
        onClick={toggleChatPanel}
        aria-label="Chat với AI"
      >
        <MessageSquare className="w-7 h-7 text-white" />
      </Button>
      <Button
        size="icon"
        className="rounded-full shadow-lg w-14 h-14 bg-green-600 hover:bg-green-700"
        onClick={BookingPanel}
        aria-label="Lịch đặt phòng"
      >
        <CalendarDays className="w-7 h-7 text-white" />
      </Button>
    </div>
  )
}
