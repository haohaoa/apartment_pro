// types.ts
export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null; // timestamp nullable
  password?: string | null;
  phone?: string | null;
  role: "tenant" | "owner" | "admin";
  refresh_token?: string | null;
  signature?: string | null; // base64 image hoặc null
  idCard?: string | null;
  birthDate?: string | null; // date string YYYY-MM-DD
  remember_token?: string | null;
  created_at: string; // timestamp
  updated_at: string; // timestamp
  bank_account_number?: string | null;
  bank_name: string;
};

export interface ApartmentImage {
  id: number;
  apartment_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  address: string;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  images: ApartmentImage[];
  deposit: number;
  owner?: User; 
  building: Building;
  rating: number;
}
export interface Building {
  id: number
  owner_id: number
  name: string
  address: string
  lat?: number | null
  lng?: number | null
  floors?: number | null
  description?: string | null
  status: "active" | "inactive"
  apartments: Apartment[]
  // Bổ sung thêm các trường đang dùng trong UI
  totalUnits?: number | null       // Tổng căn hộ
  occupiedUnits?: number | null    // Đã thuê
  vacantUnits?: number | null      // Trống
  monthlyRevenue?: number | null 
  owner?: User  // Doanh thu tháng
}
// export interface ApartmentOwner {
//   id: number
//   name: string
//   email: string
//   phone: string
//   role: string
// }
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ApartmentSearchResponse {
  current_page: number;
  data: Apartment[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
export interface Booking {
  apartment_id: number;
  date: string;
  note: string;
}
export interface ViewingSchedule {
  id: number;
  apartment_id: number;
  user_id: number;
  scheduled_at: string | number; // tuỳ backend: có thể là timestamp hoặc datetime
  status: "pending" | "approved" | "rejected";
  note: string | null;
  created_at: string;
  updated_at: string;
  apartment: Apartment;
}
export type ViewingScheduleList = ViewingSchedule[];

// Response API lấy danh sách lịch xem
export interface ViewingScheduleResponse {
  success: boolean
  message: string
  data: ViewingScheduleList
}
export interface ViewingScheduleResponseDetail {
  success: boolean
  message: string
  data: ViewingSchedule
}

export interface HistoryItem {
    role: "user" | "assistant";
    content: string;
    product: Apartment[];
}
export interface rental_order {
  id: number;
  user_id: number;
  apartment_id: number;
  owner_id: number;
  start_date: string;
  end_date: string;
  status: "pending" | "completed" | "rejected" | string;
  created_at: string;
  updated_at: string;
  apartment: Apartment;
  contract:Contract;
  owner: User;
  payment: Payment[];
}
export interface Contract {
  id: number;
  pdf_path: string;
  contract_number: string;
  start_date: string;
  end_date: string;
  landlord_data: LandlordData;
  monthly_rent: number;
  apartment_address: string;
}
export interface Payment {
  id: number;
  rental_order_id: number;
  month: string;
  amount: number;
  status: string;
  payment_date?: string;
  created_at?: string;
  updated_at?: string;
  rental_order: rental_order
  period_start: string;
  period_end: string;
  
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'system' | 'user' | string; // Có thể mở rộng nếu có thêm loại thông báo
  status: 'read' | 'unread'; // Giả sử chỉ có 2 trạng thái này
  created_at: string; // Sử dụng string cho ISO 8601 timestamp
  updated_at: string; // Sử dụng string cho ISO 8601 timestamp
  url: string;
}
export interface LandlordData {
  name: string
  birthDate: string
  idCard: string
  issueDate: string
  issuePlace: string
  address: string
  phone: string
}
// Kiểu cho một thông báo
export interface maintenance {
  id: number;
  apartment_id: number;
  user_id: number;
  description: string;
  attachment: string | null; // vì có thể null
  status: 'pending' | 'completed' | 'read'; // nếu biết trước các giá trị status
  note: string | null;
  created_at: string; // ISO string
  updated_at: string;
}


