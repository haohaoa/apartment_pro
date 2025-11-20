export const daNangDistricts = {
  // Cấu trúc hành chính Đà Nẵng hiện tại (có hiệu lực từ 1/1/2025)
  current: {
    "Quận Hải Châu": [
      "Phường Hải Châu",
      "Phường Hòa Cường",
      "Phường Hòa Thuận",
      "Phường Bình Hiên",
      "Phường Bình Thuận",
      "Phường Phước Ninh",
      "Phường Nam Dương",
      "Phường Thanh Bình",
      "Phường Thạch Thang"
    ],
    "Quận Sơn Trà": [
      "Phường Thọ Quang",
      "Phường Nại Hiên Đông",
      "Phường Mân Thái",
      "Phường An Hải Bắc",
      "Phường An Hải Đông",
      "Phường An Hải Tây",
    ],
    "Quận Thanh Khê": [
      "Phường An Khê",
      "Phường Xuân Hà",
      "Phường Vĩnh Trung",
      "Phường Tam Thuận",
      "Phường Thạc Gián",
      "Phường Thanh Khê Đông"
    ],
    "Quận Cẩm Lệ": [
      "Phường Khuê Trung",
      "Phường Hòa Phát",
      "Phường Hòa An",
      "Phường Hòa Thọ Tây",
      "Phường Hòa Thọ Đông",
      "Phường Hòa Xuân",
    ],
    "Quận Liên Chiểu": [
      "Phường Hòa Hiệp Bắc",
      "Phường Hòa Hiệp Nam",
      "Phường Hòa Khánh Bắc",
      "Phường Hòa Khánh Nam",
      "Phường Hòa Minh",
    ],
    "Quận Ngũ Hành Sơn": [
      "Phường Mỹ An",
      "Phường Khuê Mỹ",
      "Phường Hòa Quý",
      "Phường Hòa Hải"
    ],
    "Huyện Hòa Vang": [
      "Xã Hòa Bắc",
      "Xã Hòa Liên",
      "Xã Hòa Ninh",
      "Xã Hòa Sơn",
      "Xã Hòa Nhơn",
      "Xã Hòa Phú",
      "Xã Hòa Phong",
      "Xã Hòa Châu",
      "Xã Hòa Tiến",
      "Xã Hòa Phước",
      "Xã Hòa Khương",
    ],
    "Huyện đảo Hoàng Sa": [
      "Đặc khu Hoàng Sa"
    ],
  },
  
  // Future merged structure (Da Nang + Quang Nam)
  future: {
    totalWards: 23,
    totalCommunes: 70,
    specialZones: ["Đặc khu Hoàng Sa"],
    note: "Cấu trúc này sẽ được áp dụng khi hoàn thành sáp nhập tỉnh Quảng Nam và thành phố Đà Nẵng"
  },
}

export const getDistrictOptions = () => {
  return Object.keys(daNangDistricts.current).map((district) => ({
    id: district.toLowerCase().replace(/\s+/g, "-"),
    name: district,
    count: daNangDistricts.current[district as keyof typeof daNangDistricts.current].length,
  }))
}

export const getWardsByDistrict = (district: string) => {
  const districtKey = Object.keys(daNangDistricts.current).find(
    (key) => key.toLowerCase().replace(/\s+/g, "-") === district,
  )

  if (districtKey) {
    return daNangDistricts.current[districtKey as keyof typeof daNangDistricts.current].map((ward) => ({
      id: ward.toLowerCase().replace(/\s+/g, "-"),
      name: ward,
      count: Math.floor(Math.random() * 50) + 1, // Mock count for demo
    }))
  }

  return []
}