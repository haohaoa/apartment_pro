"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AISearchInputProps {
  onSearch: (query: string) => void
  isSearching?: boolean
}

export function AISearchInput({ onSearch, isSearching = false }: AISearchInputProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isSearching) {
      onSearch(query)
    }
  }

  const exampleQueries = [
    "Căn hộ 2 phòng ngủ gần biển, giá dưới 10 triệu",
    "Studio hiện đại cho sinh viên, có ban công",
    "Penthouse cao cấp view sông Hàn",
  ]

  const handleExampleClick = (example: string) => {
    setQuery(example)
  }

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn("relative rounded-2xl transition-all duration-300", isFocused ? "glow-purple" : "")}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative flex items-center gap-3 bg-slate-800/90 backdrop-blur-xl border-2 border-slate-700 rounded-2xl p-2 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Mô tả căn hộ bạn muốn tìm... (VD: 'Căn hộ 2 phòng ngủ gần biển, giá dưới 10 triệu')"
              className="flex-1 bg-transparent text-white placeholder:text-slate-400 text-lg outline-none px-2"
              disabled={isSearching}
            />

            <Button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang tìm...
                </>
              ) : (
                <>
                  Tìm kiếm
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Example queries as pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {exampleQueries.map((example, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(example)}
            className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-white text-sm transition-all duration-200"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}
