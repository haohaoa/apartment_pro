// ===== CÁCH 1: SỬA FILE @/components/Pagination.tsx =====
"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  links: { url?: string; label: string; active: boolean }[]
  onPageChange: (page: number) => void
}

// ✅ EXPORT DEFAULT (khuyến nghị)
export default function Pagination({ links, onPageChange }: PaginationProps) {
  const getPageNumber = (url: string | undefined): number | null => {
    if (!url) return null
    try {
      const urlObj = new URL(url)
      return Number.parseInt(urlObj.searchParams.get("page") || "1")
    } catch {
      return null
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {links.map((link, index) => {
        const isPrevious = link.label.includes("Previous") || link.label.includes("&laquo;")
        const isNext = link.label.includes("Next") || link.label.includes("&raquo;")
        const pageNumber = getPageNumber(link.url)

        if (!link.url && !link.active) {
          return (
            <Button key={index} variant="outline" disabled className="opacity-50 bg-transparent">
              {isPrevious && <ChevronLeft className="w-4 h-4" />}
              {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
              {isNext && <ChevronRight className="w-4 h-4" />}
            </Button>
          )
        }

        return (
          <Button
            key={index}
            variant={link.active ? "default" : "outline"}
            disabled={!pageNumber}
            onClick={() => pageNumber && onPageChange(pageNumber)}
            className={link.active ? "bg-blue-600 text-white" : ""}
          >
            {isPrevious && <ChevronLeft className="w-4 h-4 mr-1" />}
            {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
            {isNext && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        )
      })}
    </div>
  )
}
