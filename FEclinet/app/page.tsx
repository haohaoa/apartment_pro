"use client"
import Image from "next/image"
import { useState } from "react"
import { ApartmentCard } from "@/components/apartment-card"
import { apartments } from "@/lib/data"
import { Sparkles, Building2, Shield, Clock, Award, Users, Zap } from "lucide-react"
import { AISearchInput } from "@/components/ai-search-input"
import { useRouter } from "next/navigation"
export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false)

  const featuredApartments = apartments.slice(0, 3)
  const recommendedApartments = apartments.slice(3, 6)
  const router = useRouter()
  const handleAISearch = async (query: string) => {
    setIsSearching(true)
    sessionStorage.setItem("allowSearch", 'true')
    router.push(`/search?query=${encodeURIComponent(query)}`)
    setIsSearching(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section with AI Search */}
      <section className="relative w-full min-h-[90vh] overflow-hidden flex items-center justify-center">
        {/* 🎞 Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="/video/Generated.mp4" type="video/mp4" />
        </video>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.45_0.20_280_/_0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,oklch(0.40_0.18_250_/_0.2),transparent_50%)]" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.3_0.01_264_/_0.05)_1px,transparent_1px),
  linear-gradient(to_bottom,oklch(0.3_0.01_264_/_0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Nội dung chính */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20">
          <div className="max-w-5xl mx-auto space-y-12 text-center">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Powered by AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Tìm căn hộ với <span className="gradient-text">AI thông minh</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-pretty">
              Chỉ cần mô tả những gì bạn muốn, AI của chúng tôi sẽ tìm kiếm và đề xuất căn hộ hoàn hảo nhất cho bạn tại Đà Nẵng
            </p>

            {/* AI Search Input */}
            <div className="max-w-4xl mx-auto">
              <AISearchInput onSearch={handleAISearch} isSearching={isSearching} />
            </div>

            {/* Example queries */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="text-slate-400">Thử ngay:</span>
              <button className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all duration-200">
                "Căn hộ 2 phòng ngủ gần biển, giá dưới 10 triệu"
              </button>
              <button className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all duration-200">
                "Studio hiện đại cho sinh viên"
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-slate-400">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Tìm kiếm tức thì</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>100% an toàn</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Đề xuất chính xác</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* About Section - Modernized */}
      <section className="bg-slate-900/50 backdrop-blur-sm py-24 border-y border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Về <span className="gradient-text">StayTalk</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-pretty">
              Nền tảng công nghệ AI hàng đầu Việt Nam trong lĩnh vực bất động sản cho thuê
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
              <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/5aadf482aa49a1d810879b88/1625383026677-AQCVWXS1UBO949W48UHZ/20210423%2B-%2BADP%2B-%2BTopen%2BLand%2B8.jpg"
                  alt="StayTalk Office"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="font-bold text-white">Top 1</p>
                    <p className="text-sm text-slate-400">Nền tảng tin cậy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-white">Công nghệ AI tiên tiến</h3>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  StayTalk sử dụng trí tuệ nhân tạo để hiểu nhu cầu của bạn và tìm kiếm căn hộ phù hợp nhất. Không cần
                  lọc phức tạp, chỉ cần nói với AI những gì bạn muốn.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Với công nghệ machine learning, chúng tôi học hỏi từ sở thích của bạn để đưa ra đề xuất ngày càng
                  chính xác hơn.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-6 h-6 text-blue-400" />
                    <p className="text-3xl font-bold text-white">1M+</p>
                  </div>
                  <p className="text-slate-400 font-medium">Căn hộ khắp cả nước</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-green-400" />
                    <p className="text-3xl font-bold text-white">500K+</p>
                  </div>
                  <p className="text-slate-400 font-medium">Người dùng tin tưởng</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-purple-400" />
                    <p className="text-3xl font-bold text-white">200K+</p>
                  </div>
                  <p className="text-slate-400 font-medium">Giao dịch thành công</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <p className="text-3xl font-bold text-white">98%</p>
                  </div>
                  <p className="text-slate-400 font-medium">Đánh giá hài lòng</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-2xl backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">An toàn & Bảo mật</h4>
              <p className="text-slate-400 leading-relaxed">
                Hệ thống xác thực nghiêm ngặt, bảo vệ thông tin cá nhân và giao dịch an toàn 100%
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-2xl backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">Hỗ trợ 24/7</h4>
              <p className="text-slate-400 leading-relaxed">
                Đội ngũ chăm sóc khách hàng chuyên nghiệp, sẵn sàng hỗ trợ bạn mọi lúc mọi nơi
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-2xl backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">AI thông minh</h4>
              <p className="text-slate-400 leading-relaxed">
                Công nghệ AI hiểu ngôn ngữ tự nhiên, tìm kiếm chính xác những gì bạn cần
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-2xl backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">Chất lượng đảm bảo</h4>
              <p className="text-slate-400 leading-relaxed">
                Tất cả căn hộ được kiểm duyệt kỹ lưỡng, đảm bảo chất lượng và pháp lý rõ ràng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      <section className="container mx-auto py-24 px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Căn hộ <span className="gradient-text">nổi bật</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Những căn hộ được AI đề xuất dựa trên xu hướng tìm kiếm phổ biến
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredApartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
      </section>

      {/* Recommended Apartments */}
      <section className="bg-slate-900/50 backdrop-blur-sm py-24 border-y border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Đề xuất <span className="gradient-text">dành cho bạn</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              AI phân tích sở thích và đề xuất những căn hộ phù hợp nhất
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedApartments.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
