import { Heart, Github, MapPinIcon, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
     <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-6">Công ty TNHH StayTalk Việt Nam</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Được thành lập năm 2020, StayTalk đã nhanh chóng trở thành nền tảng bất động sản cho thuê hàng đầu tại
                  Việt Nam. Chúng tôi tự hào là cầu nối tin cậy giữa người tìm nhà và chủ nhà, mang đến giải pháp toàn
                  diện cho thị trường cho thuê.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-blue-300">Thông tin pháp lý</h4>
                    <div className="space-y-3 text-gray-300">
                      <p>
                        <strong>Giấy phép kinh doanh:</strong> 0123456789
                      </p>
                      <p>
                        <strong>Mã số thuế:</strong> 0123456789-001
                      </p>
                      <p>
                        <strong>Ngày cấp:</strong> 15/03/2020
                      </p>
                      <p>
                        <strong>Nơi cấp:</strong> Sở KH&ĐT TP.HCM
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-blue-300">Lĩnh vực hoạt động</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Môi giới bất động sản</li>
                      <li>• Tư vấn đầu tư BĐS</li>
                      <li>• Quản lý tài sản</li>
                      <li>• Dịch vụ công nghệ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4 text-blue-300">Tầm nhìn & Giá trị cốt lõi</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                    <h5 className="font-semibold mb-2 text-blue-300">Tầm nhìn</h5>
                    <p className="text-sm text-gray-300">Trở thành nền tảng BĐS số 1 Đông Nam Á</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                    <h5 className="font-semibold mb-2 text-blue-300">Sứ mệnh</h5>
                    <p className="text-sm text-gray-300">Kết nối mọi người với ngôi nhà mơ ước</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                    <h5 className="font-semibold mb-2 text-blue-300">Giá trị</h5>
                    <p className="text-sm text-gray-300">Minh bạch, tin cậy, sáng tạo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-300">Liên hệ với chúng tôi</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPinIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Trụ sở chính</p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Tầng 15, Tòa nhà Bitexco Financial Tower
                        <br />2 Hải Triều, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Hotline</p>
                      <p className="text-gray-300">1900 1234 (24/7)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <p className="text-gray-300">support@staytalk.vn</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="text-lg font-semibold mb-4 text-blue-300">Giờ làm việc</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <strong>Thứ 2 - Thứ 6:</strong> 8:00 - 18:00
                  </p>
                  <p>
                    <strong>Thứ 7:</strong> 8:00 - 12:00
                  </p>
                  <p>
                    <strong>Chủ nhật:</strong> Nghỉ
                  </p>
                  <p className="text-blue-300 mt-3">
                    <strong>Hotline 24/7</strong> cho khẩn cấp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
