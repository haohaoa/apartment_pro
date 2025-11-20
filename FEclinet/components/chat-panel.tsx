"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X, Loader2, ChevronDown, Bot, User } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useAIChat } from "@/context/chat-context"
import { motion, AnimatePresence } from "framer-motion"

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center">
      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  )
}

export function ChatPanel() {
  const { isChatPanelOpen, toggleChatPanel } = useAppContext()
  const [inputMessage, setInputMessage] = useState("")
  const { chatHistory, sendMessage, getChatHistory } = useAIChat()
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [localMessages, setLocalMessages] = useState<any[]>([])
  const [aiTyping, setAiTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const [visibleProducts, setVisibleProducts] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    if (user) getChatHistory()
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [localMessages, aiTyping, chatHistory])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || sending) return
    const currentMessage = inputMessage
    setInputMessage("")
    setSending(true)
    setLocalMessages((prev) => [...prev, { role: "user", content: currentMessage }])
    setAiTyping(true)

    const message = await sendMessage(currentMessage)
    setAiTyping(false)
    setSending(false)
    if (message) {
      await getChatHistory()
      setLocalMessages([])
    }
  }

  const handleBookViewing = async (apartment: any) => {
    const price = apartment.price ? `${Number(apartment.price).toLocaleString("vi-VN")}₫/tháng` : "";
    const location = apartment.address || "";

    const message = `Tôi muốn đặt lịch xem${location ? ` tại ${location}` : ""}\\nGiá: ${price}\\nMã căn hộ: ${apartment.id}`;

    setLocalMessages((prev) => [...prev, { role: "user", content: message }])
    setAiTyping(true)
    setSending(true)
    await sendMessage(message)
    setAiTyping(false)
    setSending(false)
    await getChatHistory()
    setLocalMessages([])
  }

  const handleShowMore = (msgIndex: number, total: number) => {
    setVisibleProducts((prev) => ({
      ...prev,
      [msgIndex]: Math.min((prev[msgIndex] || 5) + 5, total),
    }))
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white/85 backdrop-blur-2xl border-l border-indigo-100/50 shadow-[0_6px_30px_rgba(99,102,241,0.2)] z-50 transform transition-transform duration-300 ease-in-out rounded-l-3xl overflow-hidden
        ${isChatPanelOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex flex-col h-full">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md rounded-tl-3xl rounded-tr-3xl border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide">StayTalk AI</h2>
              <p className="text-[11px] text-white/80">Trợ lý tìm & đặt lịch căn hộ</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChatPanel}
            className="text-white hover:bg-white/20"
            aria-label="Đóng chat panel"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* BODY */}
        {!user ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500 p-6">
            <p>Vui lòng đăng nhập để chat với <span className="text-indigo-600 font-medium">AI StayTalk</span>.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth">
              <AnimatePresence>
                {chatHistory.map((message, index) => {
                  const total = message.product?.length || 0
                  const visibleCount = visibleProducts[index] || 5
                  const isUser = message.role === "user"

                  return (
                    <motion.div
                      key={`msg-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.18 }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser ? (
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-white p-1.5 shadow flex items-center justify-center">
                            <Bot className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="relative max-w-[80%] p-2.5 rounded-2xl shadow bg-white text-gray-800 border border-indigo-100">
                            <p className="whitespace-pre-line text-sm text-gray-700">
                              {message.content.replace(/\\n/g, "\n")}
                            </p>
                            {/* Căn hộ gợi ý */}
                            {message.product?.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.product.slice(0, visibleCount).map((apartment: any) => (
                                  <Card
                                    key={apartment.id}
                                    className="bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-all rounded-lg overflow-hidden"
                                  >
                                    <CardContent className="relative p-2 flex gap-2 items-center">
                                      {/* ID căn hộ mờ ở góc phải trên */}
                                      <span className="absolute top-[-10px] left-2 text-[10px] text-gray-400/80 select-none">
                                        #{apartment.id}
                                      </span>
                                      <Image
                                        src={`${process.env.NEXT_PUBLIC_URL_IMG}${apartment.images?.[0]?.image_url || "/placeholder.svg"}`}
                                        alt={apartment.title}
                                        width={60}
                                        height={50}
                                        className="rounded-md object-cover w-[60px] h-[50px]"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-indigo-700 truncate">{apartment.title}</h4>
                                        <p className="text-xs text-gray-500 truncate">
                                          {Number(apartment.price).toLocaleString("vi-VN")} ₫/tháng
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                          <Link href={`/apartment/${apartment.id}`} passHref>
                                            <Button
                                              onClick={toggleChatPanel}
                                              variant="outline"
                                              size="sm"
                                              className="h-6 px-2 text-xs border-indigo-300 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                                            >
                                              Xem
                                            </Button>
                                          </Link>
                                          <Button
                                            size="sm"
                                            className="h-6 px-2 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
                                            onClick={() => handleBookViewing(apartment)}
                                            disabled={sending}
                                          >
                                            Đặt lịch
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>

                                  </Card>
                                ))}

                                {total > visibleCount && (
                                  <div className="text-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleShowMore(index, total)}
                                      className="text-indigo-600 hover:text-white hover:bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-3 py-1 text-xs font-medium"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5 mr-1" />
                                      Xem thêm
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5 justify-end">
                          <div className="relative max-w-[80%] p-2.5 rounded-2xl shadow bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <p className="whitespace-pre-line text-sm leading-relaxed">
                              {message.content.replace(/\\n/g, "\n")}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-indigo-600 p-1.5 shadow flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}

                {localMessages.map((msg, i) => (
                  <motion.div
                    key={`local-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "user" ? (
                      <div className="flex items-start gap-2.5 justify-end">
                        <div className="max-w-[80%] p-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-600 p-1.5 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white p-1.5 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="max-w-[80%] p-2.5 rounded-2xl bg-white text-gray-800 border border-indigo-100 shadow">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {aiTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white p-1.5 shadow flex items-center justify-center">
                        <Bot className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="bg-white border border-indigo-100 p-2.5 rounded-2xl">
                        <TypingIndicator />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* FORM NHẬP */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t flex gap-2 bg-white/80 backdrop-blur-md"
            >
              <Input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-300 rounded-full px-4 py-2 text-sm"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={!user || sending}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow"
                disabled={!user || sending}
                aria-label="Gửi tin nhắn"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
