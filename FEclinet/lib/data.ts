export type Apartment = {
  id: string
  name: string
  price: number
  originalPrice?: number // For discounted items
  image: string
  images: string[] // For multiple images in search result card
  description: string
  location: string
  reviews: {
    id: string
    author: string
    rating: number
    comment: string
  }[]
  amenities: {
    icon: string // Placeholder for icon name
    name: string
  }[]
  amenitiesShort: string[] // For quick tags like "Nhà bếp mini"
  instantPayment: boolean // "Không thanh toán ngay"
  discount?: number // e.g., 500000 for 500K discount
  rating: number // Overall rating for search card
  reviewCount: number // Number of reviews for search card
  type: "Căn hộ" | "Khách sạn" | "Biệt thự" // For filtering
  tags: string[] // For popular filters like "Gần biển", "Phù hợp cho gia đình"
}

export type Booking = {
  id: string
  date: string
  roomName: string
  customerName: string
  apartmentId: string
}

export const apartments: Apartment[] = [
  {
    id: "apt1",
    name: "Duke Casa Apartment",
    price: 662338,
    originalPrice: 883117,
    image: "https://noithatviet24h.vn/wp-content/uploads/2020/08/hinh-anh-can-ho-chung-cu-dep-3.jpg",
    images: [
      "https://noithatviet24h.vn/wp-content/uploads/2020/08/hinh-anh-can-ho-chung-cu-dep-3.jpg",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    description:
      "Phòng hướng nắng rất nóng, máy lạnh làm trần nhưng không đủ lạnh. Phòng chờ lễ tân cũng nóng, chủ home nên cho thêm quạt hoặc bật máy lạnh phòng tắm thêm. Khách sạn mới, sạch sẽ, có bể bơi trên tầng thượng. View đẹp, gần biển, nhân viên thân thiện, có hỗ trợ đặt đồ ăn hoặc thuê xe máy.",
    location: "Phước Mỹ, Đà Nẵng",
    reviews: [
      {
        id: "rev1",
        author: "Le Nhat T. L.",
        rating: 9.0,
        comment:
          "Phòng hướng nắng rất nóng, máy lạnh làm trần nhưng không đủ lạnh. Phòng chờ lễ tân cũng nóng, chủ home nên cho thêm quạt hoặc bật máy lạnh phòng tắm thêm.",
      },
      {
        id: "rev2",
        author: "Nguyen H. A.",
        rating: 8.5,
        comment:
          "Khách sạn mới, sạch sẽ, có bể bơi trên tầng thượng. View đẹp, gần biển, nhân viên thân thiện, có hỗ trợ đặt đồ ăn hoặc thuê xe máy.",
      },
      {
        id: "rev3",
        author: "My Uyen V.",
        rating: 9.4,
        comment: "Vị trí thuận tiện, phòng ốc sạch sẽ, nhân viên nhiệt tình. Rất đáng tiền!",
      },
    ],
    amenities: [
      { icon: "AirVent", name: "Máy lạnh" },
      { icon: "Utensils", name: "Nhà hàng" },
      { icon: "Wifi", name: "WiFi" },
      { icon: "SwimmingPool", name: "Hồ bơi" },
      { icon: "Clock", name: "Lễ tân 24h" },
    ],
    amenitiesShort: ["Nhà bếp mini", "Sân thượng/Sân hiên"],
    instantPayment: false,
    discount: 500000,
    rating: 8.7,
    reviewCount: 31,
    type: "Căn hộ",
    tags: ["Gần biển", "Phù hợp cho gia đình"],
  },
  {
    id: "apt2",
    name: "Cali Hotel Books Da Nang",
    price: 458182,
    originalPrice: 610999,
    image: "https://noithatviet24h.vn/wp-content/uploads/2020/08/hinh-anh-can-ho-chung-cu-dep-3.jpg",
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    description: "Khách sạn hiện đại với đầy đủ tiện nghi, gần biển và trung tâm thành phố.",
    location: "An Hải Đông, Đà Nẵng",
    reviews: [],
    amenities: [
      { icon: "AirVent", name: "Máy lạnh" },
      { icon: "Wifi", name: "WiFi" },
      { icon: "Utensils", name: "Nhà hàng" },
    ],
    amenitiesShort: ["Nhà bếp mini", "Sân thượng/Sân hiên"],
    instantPayment: true,
    discount: 500000,
    rating: 8.1,
    reviewCount: 22,
    type: "Khách sạn",
    tags: ["Có bữa sáng", "Gần biển"],
  },
  {
    id: "apt3",
    name: "Sharon Hotel and Apartment",
    price: 1316017,
    originalPrice: 1754690,
    image: "https://noithatviet24h.vn/wp-content/uploads/2020/08/hinh-anh-can-ho-chung-cu-dep-3.jpg",
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    description: "Căn hộ dịch vụ cao cấp với không gian rộng rãi, phù hợp cho gia đình.",
    location: "Mỹ An, Đà Nẵng",
    reviews: [],
    amenities: [
      { icon: "AirVent", name: "Máy lạnh" },
      { icon: "Utensils", name: "Nhà hàng" },
      { icon: "Wifi", name: "WiFi" },
      { icon: "SwimmingPool", name: "Hồ bơi" },
    ],
    amenitiesShort: ["Nhà bếp mini", "Đưa đón sân bay", "Phù hợp cho xe lăn", "Dịch vụ trả phòng cấp tốc"],
    instantPayment: false,
    discount: 500000,
    rating: 9.1,
    reviewCount: 83,
    type: "Căn hộ",
    tags: ["Phù hợp cho gia đình", "Vị trí thuận tiện"],
  },
  {
    id: "apt4",
    name: "Thang Bom Apartment Da Nang",
    price: 7000000,
    image: "https://noithatviet24h.vn/wp-content/uploads/2020/08/hinh-anh-can-ho-chung-cu-dep-3.jpg",
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    description: "Căn hộ dịch vụ đầy đủ nội thất, có dọn phòng hàng ngày, gần khu thương mại.",
    location: "Quận Sơn Trà, Đà Nẵng",
    reviews: [],
    amenities: [
      { icon: "AirVent", name: "Máy lạnh" },
      { icon: "Utensils", name: "Nhà hàng" },
      { icon: "Wifi", name: "WiFi" },
      { icon: "Clock", name: "Lễ tân 24h" },
    ],
    amenitiesShort: ["Nhà bếp mini", "Gần trung tâm"],
    instantPayment: true,
    discount: 200000,
    rating: 8.8,
    reviewCount: 45,
    type: "Căn hộ",
    tags: ["Giá tốt", "Có bữa sáng"],
  },
  {
    id: "apt5",
    name: "Penthouse sang trọng view thành phố",
    price: 25000000,
    image: "https://noithatviet24h.vn/wp-content/uploads/2020/08/hinh-anh-can-ho-chung-cu-dep-3.jpg",
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    description: "Penthouse 3 tầng, thiết kế độc đáo, view toàn cảnh thành phố, đẳng cấp 5 sao.",
    location: "Quận Bình Thạnh, TP.HCM",
    reviews: [],
    amenities: [
      { icon: "AirVent", name: "Máy lạnh" },
      { icon: "Utensils", name: "Nhà hàng" },
      { icon: "Wifi", name: "WiFi" },
      { icon: "SwimmingPool", name: "Hồ bơi" },
      { icon: "Clock", name: "Lễ tân 24h" },
    ],
    amenitiesShort: ["Hồ bơi riêng", "View thành phố"],
    instantPayment: false,
    discount: 1000000,
    rating: 9.5,
    reviewCount: 12,
    type: "Căn hộ",
    tags: ["5 sao giá tốt"],
  },
  {
    id: "apt6",
    name: "Biệt thự biển Đà Nẵng",
    price: 18000000,
    image: "https://noithatviet24h.vn/wp-content/uploads/2020/08/hinh-anh-can-ho-chung-cu-dep-3.jpg",
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    description: "Biệt thự sang trọng ngay sát biển, có hồ bơi vô cực và dịch vụ đẳng cấp.",
    location: "Ngũ Hành Sơn, Đà Nẵng",
    reviews: [],
    amenities: [
      { icon: "AirVent", name: "Máy lạnh" },
      { icon: "Utensils", name: "Nhà hàng" },
      { icon: "Wifi", name: "WiFi" },
      { icon: "SwimmingPool", name: "Hồ bơi" },
    ],
    amenitiesShort: ["Gần biển", "Hồ bơi vô cực"],
    instantPayment: false,
    discount: 750000,
    rating: 9.2,
    reviewCount: 28,
    type: "Biệt thự",
    tags: ["Gần biển", "5 sao giá tốt"],
  },
]

export const bookings: Booking[] = [
  {
    id: "bkg1",
    date: "2025-08-15",
    roomName: "Duke Casa Apartment",
    customerName: "Nguyễn Văn A",
    apartmentId: "apt1",
  },
  {
    id: "bkg2",
    date: "2025-08-20",
    roomName: "Cali Hotel Books Da Nang",
    customerName: "Trần Thị B",
    apartmentId: "apt2",
  },
  {
    id: "bkg3",
    date: "2025-08-22",
    roomName: "Sharon Hotel and Apartment",
    customerName: "Lê Văn C",
    apartmentId: "apt3",
  },
]

export const popularFilters = [
  { id: "breakfast", name: "Có bữa sáng", count: 1 },
  { id: "5star", name: "4-5 sao giá tốt", count: 1 },
  { id: "convenient", name: "Vị trí thuận tiện", count: 8 },
  { id: "family", name: "Phù hợp cho gia đình", count: 11 },
  { id: "beach", name: "Gần biển", count: 8 },
]

export const promoFilters = [
  { id: "clean", name: "Phòng sạch sẽ", count: 14 },
  { id: "family_promo", name: "Phù hợp cho gia đình", count: 11 },
  { id: "good_price", name: "Giá tốt", count: 9 },
  { id: "convenient_promo", name: "Vị trí thuận tiện", count: 8 },
  { id: "beach_promo", name: "Gần biển", count: 8 },
]

export const starRatings = [
  { id: "5star_rating", name: "5 sao", count: 46 },
  { id: "4star_rating", name: "4 sao", count: 34 },
  { id: "3star_rating", name: "3 sao", count: 12 },
  { id: "2star_rating", name: "2 sao", count: 5 },
  { id: "1star_rating", name: "1 sao", count: 2 },
]

export type Issue = {
  id: string
  apartmentId: string // Added apartmentId to link issues to specific rooms
  title: string
  description: string
  category: "plumbing" | "electrical" | "cleaning" | "maintenance" | "other"
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "resolved"
  createdAt: string
  resolvedAt?: string
}

export type Contract = {
  id: string
  apartmentName: string
  apartmentId: string
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  status: "active" | "expired"
  contractUrl?: string
}

export type PaymentNotification = {
  id: string
  apartmentId: string // Added apartmentId to link payments to specific rooms
  title: string
  description: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue"
  type: "rent" | "utilities" | "maintenance"
}

export const customerIssues: Issue[] = [
  {
    id: "issue1",
    apartmentId: "apt1", // Linked to Duke Casa Apartment
    title: "Vòi nước bị rò rỉ",
    description: "Vòi nước trong phòng tắm bị rò rỉ từ sáng nay, cần sửa chữa gấp",
    category: "plumbing",
    priority: "high",
    status: "in-progress",
    createdAt: "2025-01-10",
  },
  {
    id: "issue2",
    apartmentId: "apt1", // Linked to Duke Casa Apartment
    title: "Điều hòa không hoạt động",
    description: "Điều hòa trong phòng ngủ không thể bật được, có thể do hỏng remote hoặc máy",
    category: "electrical",
    priority: "medium",
    status: "pending",
    createdAt: "2025-01-12",
  },
  {
    id: "issue3",
    apartmentId: "apt3", // Linked to Sharon Hotel and Apartment
    title: "Cần vệ sinh thêm",
    description: "Phòng cần được vệ sinh kỹ hơn, đặc biệt là khu vực bếp",
    category: "cleaning",
    priority: "low",
    status: "resolved",
    createdAt: "2025-01-08",
    resolvedAt: "2025-01-09",
  },
]

export const customerContracts: Contract[] = [
  {
    id: "contract1",
    apartmentName: "Duke Casa Apartment",
    apartmentId: "apt1",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    monthlyRent: 15000000,
    deposit: 30000000,
    status: "active",
  },
  {
    id: "contract2",
    apartmentName: "Sharon Hotel and Apartment",
    apartmentId: "apt3",
    startDate: "2024-06-01",
    endDate: "2024-12-31",
    monthlyRent: 12000000,
    deposit: 24000000,
    status: "expired",
  },
]

export const paymentNotifications: PaymentNotification[] = [
  {
    id: "payment1",
    apartmentId: "apt1", // Linked to Duke Casa Apartment
    title: "Tiền thuê tháng 1/2025",
    description: "Tiền thuê căn hộ Duke Casa Apartment tháng 1/2025",
    amount: 15000000,
    dueDate: "2025-01-31",
    status: "pending",
    type: "rent",
  },
  {
    id: "payment2",
    apartmentId: "apt1", // Linked to Duke Casa Apartment
    title: "Tiền điện nước tháng 12/2024",
    description: "Hóa đơn điện nước tháng 12/2024",
    amount: 850000,
    dueDate: "2025-01-15",
    status: "overdue",
    type: "utilities",
  },
  {
    id: "payment3",
    apartmentId: "apt3", // Linked to Sharon Hotel and Apartment
    title: "Phí bảo trì chung cư",
    description: "Phí bảo trì và vệ sinh chung cư quý 4/2024",
    amount: 500000,
    dueDate: "2025-01-10",
    status: "paid",
    type: "maintenance",
  },
  {
    id: "payment4",
    apartmentId: "apt3", // Added new payment for Sharon Hotel
    title: "Tiền thuê tháng 12/2024",
    description: "Tiền thuê căn hộ Sharon Hotel and Apartment tháng 12/2024",
    amount: 12000000,
    dueDate: "2024-12-31",
    status: "paid",
    type: "rent",
  },
]

export const locationData = {
  cities: [
    {
      id: "hn",
      name: "Hà Nội",
      districts: [
        {
          id: "hk",
          name: "Hoàn Kiếm",
          wards: ["Phường Hàng Bạc", "Phường Hàng Bồ", "Phường Hàng Gai", "Phường Hàng Trống"],
        },
        {
          id: "bd",
          name: "Ba Đình",
          wards: ["Phường Điện Biên", "Phường Đội Cấn", "Phường Liễu Giai", "Phường Ngọc Hà"],
        },
        {
          id: "cg",
          name: "Cầu Giấy",
          wards: ["Phường Dịch Vọng", "Phường Mai Dịch", "Phường Nghĩa Đô", "Phường Quan Hoa"],
        },
      ],
    },
    {
      id: "hcm",
      name: "TP. Hồ Chí Minh",
      districts: [
        {
          id: "q1",
          name: "Quận 1",
          wards: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cô Giang"],
        },
        {
          id: "q3",
          name: "Quận 3",
          wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 4"],
        },
        {
          id: "bt",
          name: "Bình Thạnh",
          wards: ["Phường 1", "Phường 2", "Phường 11", "Phường 12"],
        },
      ],
    },
    {
      id: "dn",
      name: "Đà Nẵng",
      districts: [
        {
          id: "hc",
          name: "Hải Châu",
          wards: ["Phường Hải Châu I", "Phường Hải Châu II", "Phường Thanh Bình", "Phường Thạch Thang"],
        },
        {
          id: "st",
          name: "Sơn Trà",
          wards: ["Phường An Hải Bắc", "Phường An Hải Đông", "Phường Mân Thái", "Phường Nại Hiên Đông"],
        },
        {
          id: "nhs",
          name: "Ngũ Hành Sơn",
          wards: ["Phường Hòa Hải", "Phường Hòa Quý", "Phường Khuê Mỹ", "Phường Mỹ An"],
        },
      ],
    },
  ],
}

export const priceRanges = [
  { id: "under-1m", label: "Dưới 1 triệu", min: 0, max: 1000000 },
  { id: "1m-3m", label: "1 - 3 triệu", min: 1000000, max: 3000000 },
  { id: "3m-5m", label: "3 - 5 triệu", min: 3000000, max: 5000000 },
  { id: "5m-10m", label: "5 - 10 triệu", min: 5000000, max: 10000000 },
  { id: "10m-20m", label: "10 - 20 triệu", min: 10000000, max: 20000000 },
  { id: "above-20m", label: "Trên 20 triệu", min: 20000000, max: Number.POSITIVE_INFINITY },
]
