"use client"
import ScheduleList from "@/components/schedule-list"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Chỉ hiển thị danh sách, bỏ phần cột phải */}
      <div className="h-screen overflow-y-auto">
        <ScheduleList />
      </div>
    </div>
  )
}
