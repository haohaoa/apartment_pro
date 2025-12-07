import axios from "axios";

// =======================
// 🚀 1. Tạo instance chính
// =======================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    // "Content-Type": "application/json",
  },
});

// =======================
// 🧩 2. Refresh Token Logic
// =======================
let isRefreshing = false;
let refreshPromise = null;

async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) {
    console.warn("Không tìm thấy refresh_token → logout");
    handleLogout();
    throw new Error("No refresh token");
  }

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/refresh-token`,
      { refresh_token }
    );

    const newToken = res.data.access_token;
    const expiresAt = Date.now() + (res.data.expires_in || 3600) * 1000;

    localStorage.setItem("token", newToken);
    localStorage.setItem("expires_at", expiresAt.toString());

    return newToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    handleLogout();
    throw error;
  }
}

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("user");
  // window.location.href = "/login";
}

// =======================
// 📦 3. Request Interceptor
// =======================
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  const expiresAt = parseInt(localStorage.getItem("expires_at") || "0");

  if (token) {
    // Nếu token sắp hết hạn (trước 5 giây)
    if (Date.now() >= expiresAt - 5000) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken()
          .then((newToken) => {
            isRefreshing = false;
            refreshPromise = null;
            return newToken;
          })
          .catch((err) => {
            isRefreshing = false;
            refreshPromise = null;
            throw err;
          });
      }

      const newToken = await refreshPromise;
      config.headers.Authorization = `Bearer ${newToken}`;
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// =======================
// 💥 4. Response Interceptor (401 handler)
// =======================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        handleLogout();
      }
    }

    return Promise.reject(error);
  }
);
// ====================
// 🔑 Lấy token dùng cho API khác
// ====================
export async function getToken() {
  const token = localStorage.getItem("token");
  const expiresAt = parseInt(localStorage.getItem("expires_at") || "0");

  // Nếu chưa có token → logout
  if (!token) {
    handleLogout();
    throw new Error("No token found");
  }

  // Nếu token sắp hết hạn (< 5 giây) → refresh
  if (Date.now() >= expiresAt - 5000) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken()
        .then((newToken) => {
          isRefreshing = false;
          refreshPromise = null;
          return newToken;
        })
        .catch((err) => {
          isRefreshing = false;
          refreshPromise = null;
          throw err;
        });
    }

    const newToken = await refreshPromise;
    return newToken;
  }

  return token;
}

// =======================
// 🧱 5. Các nhóm API
// =======================

// Auth API
export const AuthAPI = {
  getAll: () => api.get("/user"),
  getUser: (id) => api.get(`/user/${id}`),
  deleteUser: (id) => api.delete(`/delete-user/${id}`),
  updateUser: (id, data) => api.post(`/update-user/${id}`, data),
  login: (email, password) => api.post("/login", { email, password }),
  loginGoogle: (googleToken) => api.post("/google/callback", { token: googleToken }),
  register: (data) => api.post("/register", data),
  refreshToken: (refreshToken) => api.post("/refresh-token", { refresh_token: refreshToken }),
  verifyOTP: (OTP, email) => api.post("/verify-email", { email, otp: OTP }),
  resendOTP: (email) => api.post("/resend-otp", { email }),
  registerOwner: (data) => api.post("/register-owner", data),
};

// Chat API
export const ChatAPI = {
  sendMessage: (data) => api.post("/chat", data),
  getAll: () => api.get("/getchatbox"),
};

// Apartment API
export const ApartmentAPI = {
  getById: (id) => api.get(`/view-apartment/${id}`),
  search: (params) => api.get("/search", { params }),
  create: (buildingId, data) => api.post(`/create-apartment/${buildingId}`, data),
  update: (id, data) => api.post(`/update-apartment/${id}`, data),
  delete: (id) => api.delete(`/delete-apartment/${id}`),
};

// Booking API
export const BookingAPI = {
  create: (data) => api.post("/booking", data),
  getAll: () => api.get("/viewing-schedules"),
  delete: (id) => api.get(`/cancel/${id}`),
  getById: (id) => api.get(`/viewing-schedules/${id}`),
  store: (data) => api.post("/bookings-store", data),
};

// Signature API
export const SignatureAPI = {
  create: (data) => api.post("/update-signature", { signature: data }),
  get: () => api.post("/signature"),
};

// User API
export const UserAPI = {
  getMe: () => api.post("/me"),
};

// Building API
export const BuildingAPI = {
  get: () => api.get("/all-building-admin"),
  create: (data) => api.post("/create-building", data),
  update: (id, data) => api.put(`/update-building/${id}`, data),
  delete: (id) => api.delete(`/delete-building/${id}`),
  getById: (id) => api.get(`/get-building/${id}`),
  getDashboard:() => api.get("/dashboard/admin"),
};

// Contract API
export const ContractAPI = {
  get: () => api.get("/contract-admin"),
  getDetail: (id) => api.get(`/contract/${id}`),
  create: (id) => api.get(`/contract-byowner/${id}`),
  cancel: (id) => api.get(`/enforceContract/${id}`),
  confirmPayment: (id) => api.get(`/confirm-payment/${id}`),
};

export const NotificationAPI = {
  getall: () => api.get("/notifications"),
  markAllAsRead: () => api.post("/notifications/mark-all-read")
};
export const ViewscheduleAPI= {
  getall: () => api.get("/viewing-schedules-admin"),
  getbyid: (id) => api.get(`/viewing-schedules-owner/${id}`),
  delete: (id) => api.delete(`/cancel-schedule/${id}`),
}

// =======================
// 🧾 6. Xuất instance chính
// =======================
export default api;
