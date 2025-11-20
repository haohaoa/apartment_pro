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
  rental_orders: RentalOrder[];
  maintenance_requests: MaintenanceRequest[];
  building: Building;
  is_rented: boolean,
  status_text: string,
  tenant_name: string,
  occupiedUnits: number;
  vacantUnits: number;
}
export interface MaintenanceRequest {
  id: number;
  apartment_id: number;
  user_id: number;
  description: string;
  attachment: string | null;
  status: "pending" | "in_progress" | "completed" | "rejected";
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface RentalOrder {
  id: number;
  user_id: number;
  apartment_id: number;
  owner_id: number;
  start_date: string;   // ISO date string (YYYY-MM-DD)
  end_date: string;     // ISO date string (YYYY-MM-DD)
  status: "pending" | "rejected" | "completed" | "canceled" | "check_out"; // tùy trạng thái bạn quy định
  created_at: string;   // ISO datetime
  updated_at: string;   // ISO datetime
  user: User;
  apartment: Apartment;
  contract: RentalContract;
  payment: Payment[];
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
  scheduled_at: string ; // tuỳ backend: có thể là timestamp hoặc datetime
  status: "pending" | "approved" | "rejected";
  note: string | null;
  created_at: string;
  updated_at: string;
  apartment: Apartment;
  user: User;
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
  monthlyRevenue?: number | null   // Doanh thu tháng
  totalRents: number | null        // Tổng tiền tháng
}


export interface BuildingSearchResponse {
  current_page: number;
  data: Building[];
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
export interface RentalContract {
  id: number;
  rental_order_id: number;
  contract_number: string;
  contract_date: string; // ISO date string (YYYY-MM-DD)
  location: string;
  apartment_address: string;
  structure: string;
  monthly_rent: number;
  deposit: number;
  deposit_months: number;
  payment_date: string; // có thể là "10 hàng tháng" hoặc "YYYY-MM-DD"
  duration: string;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
  landlord_data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  tenant_data: {
    name: string;
    phone?: string;
    email?: string;
    idCard?: string;
    address?: string;
  };
  landlord_signature?: string | null;
  tenant_signature?: string | null;
  pdf_path?: string | null;
  created_at?: string;
  updated_at?: string;
  order: RentalOrder;

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
  url: string
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
  rental_order: RentalOrder
  period_start: string;
  period_end: string;
  
}