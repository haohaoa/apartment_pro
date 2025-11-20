"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { SearchResultCard } from "@/components/search-result-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, MapPin, SlidersHorizontal, Loader2, MessageSquare } from "lucide-react"
import { useApartment } from "@/context/apartment-context"
import Pagination from "@/components/Pagination"
import type { Apartment } from "@/lib/types"
import { useAIChat } from "@/context/chat-context"
import { useAuth } from "@/context/auth-context"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const [isAiLoading, setIsAiLoading] = useState(true)
  const { searchResults } = useApartment()
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { user } = useAuth()
  const { chatHistory, sendMessage, getChatHistory } = useAIChat()

  // Gọi AI khi người dùng thật sự tìm kiếm
  useEffect(() => {
    const fetchAiResponse = async () => {

      const res = await sendMessage(query)
      if (res) {
        await getHistory()
      }
    }
    const getHistory = async () => {
      await getChatHistory()
      
    }
    if (!query) {
      window.location.href = "/"
      return
    }

    const canSearch = sessionStorage.getItem("allowSearch")
    setIsAiLoading(true)
    if (canSearch && user) {
      sessionStorage.removeItem("allowSearch")
      fetchAiResponse()
      
    } else {
      getHistory()
    }
    setIsAiLoading(false)
  }, [])


  // Lấy phản hồi mới nhất của AI
  const latestAssistant: any = chatHistory?.length
    ? [...chatHistory].reverse().find((item) => item.role === "assistant")
    : null

  const apartmentCount = searchResults?.total || 0
  const currentApartments: Apartment[] = searchResults?.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        {/* AI Assistant Section */}
        {/* AI Assistant Section */}
        <Card className="mb-8 bg-gradient-to-br from-[#3b0764]/80 via-[#1e1b4b]/80 to-[#312e81]/80 border border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.6)]">
                  <Sparkles className="w-5 h-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  AI Assistant
                  {isAiLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                  )}
                </h2>

                {isAiLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-4/6"></div>
                  </div>
                ) : latestAssistant ? (
                  <p className="text-slate-200 leading-relaxed text-pretty">
                    {latestAssistant.content}
                  </p>
                ) : (
                  <p className="text-slate-400">
                    Không có phản hồi từ AI cho truy vấn này.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>


        {/* Results Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Kết quả tìm kiếm</h1>
              <p className="text-sm text-slate-400">{apartmentCount} căn hộ được tìm thấy</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
          </Button>
        </div>

        {/* 🟣 Thông báo hướng dẫn người dùng */}
        {latestAssistant?.product?.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-indigo-900/40 to-purple-900/30 border border-purple-700/30 rounded-xl p-5 text-slate-200 flex items-start gap-3">
            <MessageSquare className="w-6 h-6 text-purple-400 mt-0.5" />
            <div>
              <p className="font-medium text-white mb-1">
                💬 Lịch sử các căn hộ bạn đã xem đều có trong tin nhắn!
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nếu bạn muốn xem lại những căn hộ đã được gợi ý hoặc trò chuyện trước đó, hãy mở mục{" "}
                <span className="text-purple-400 font-semibold">Tin nhắn AI</span> để xem lại toàn bộ lịch sử trò chuyện cùng trợ lý.
              </p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
            <p className="text-slate-400">Đang tìm kiếm căn hộ phù hợp...</p>
          </div>
        ) : currentApartments === null ? (
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy kết quả</h3>
              <p className="text-slate-400">
                Không tìm thấy căn hộ nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử tìm kiếm với từ khóa khác.
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* DỮ LIỆU AI — nằm DƯỚI kết quả tìm kiếm */}
            {latestAssistant?.product?.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-white mb-4">Gợi ý từ AI</h2>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {latestAssistant.product.map((apartment: any) => (
                    <SearchResultCard
                      key={apartment.id}
                      apartment={{
                        id: apartment.id,
                        title: apartment.title,
                        address: apartment.address,
                        price: parseFloat(apartment.price),
                        images: apartment.images,
                        rating: 4.8,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
