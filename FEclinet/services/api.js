import axios from "axios";

// ====================
// 🧩 Tạo axios instance
// ====================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ====================
// 🔐 Biến kiểm soát refresh token
// ====================
let isRefreshing = false;
let refreshPromise = null;

// ====================
// 🧠 Hàm logout nếu refresh fail
// ====================
function handleLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("refresh_token");
  // window.location.href = "/login";
}

// ====================
// ⏱️ Hàm refresh token
// ====================
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


// ====================
// 📦 Request Interceptor
// ====================
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  const expiresAt = parseInt(localStorage.getItem("expires_at") || "0");

  if (token) {
    // Nếu token sắp hết hạn (< 5 giây)
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

// ====================
// 💥 Response Interceptor (xử lý lỗi 401)
// ====================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
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
// 🔗 Export các nhóm API
// ====================
export const AuthAPI = {
  login: (email, password) => api.post("/login", { email, password }),
  loginGoogle: (googleToken) => api.post("/google/callback", { token: googleToken }),
  register: (data) => api.post("/register", data),
  refreshToken: (refreshToken) => api.post("/refresh-token", { refresh_token: refreshToken }),
};

export const ChatAPI = {
  sendMessage: (data) => api.post("/chat-pro", data),
  getAll: () => api.get("/getchatbox"),
};

export const ApartmentAPI = {
  getById: (id) => api.get(`/getApartment/${id}`),
  search: (params) => api.get("/search", { params }),
};

export const BookingAPI = {
  create: (data) => api.post("/booking", data),
  getall: () => api.get("/viewing-schedules"),
  delete: (id) => api.get(`/cancel/${id}`),
  getById: (id) => api.get(`/viewing-schedules/${id}`),
  store: (data) => api.post("/bookings-store", data),
  infopayment: (id) => api.post("/owner_payment", {id}),
  confirmPayment: (id) => api.get(`/mark-as-paid/${id}`),
};
export const ContractAPI = {
  viewAllById: () => api.get("/rented-apartment"),
  // getByIdContract: (id) => api.get(`/contract/${id}`),
  // EnforceContract: (id) => api.get(`/enforceContract/${id}`),
};
export const NotificationAPI = {
  getall: () => api.get("/notifications"),
  markAllAsRead: () => api.post("/notifications/mark-all-read")
};

export default api;
