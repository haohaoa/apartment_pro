"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { ViewingSchedule } from "@/lib/types"

type ClickContextType = {
  isBookingPanelOpen: boolean
  BookingPanel: () => void
  allbooking: ViewingSchedule | null
  setallbooking: (booking: ViewingSchedule | null) => void
}

const BookingContext = createContext<ClickContextType | undefined>(undefined)

export function ClickProvider({ children }: { children: ReactNode }) {
  const [isBookingPanelOpen, setIsBookingPanelOpen] = useState(false)
  const [allbooking, setallbooking] = useState<ViewingSchedule | null>(null)

  const BookingPanel = () => {
    setIsBookingPanelOpen((prev) => !prev)
  }

  return (
    <BookingContext.Provider value={{ isBookingPanelOpen, BookingPanel, allbooking, setallbooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useClickContext() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useClickContext must be used within ClickProvider")
  }
  return context
}
