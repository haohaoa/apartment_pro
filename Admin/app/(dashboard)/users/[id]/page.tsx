"use client";

import React, { useEffect, useState } from "react";
import {
  Save,
  Lock,
  User,
  Mail,
  Phone,
  Calendar,
  Home,
  Shield,
  CreditCard,
  Landmark,
  FileSignature,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { UserDeatail, getByIdUser, updateUser } = useAuth();
  const [user, setUser] = useState<any>(null);

  // Load user khi component mount
  useEffect(() => {
    loadUser();
  }, []);

  // Khi UserDeatail update từ context, set vào state user
  useEffect(() => {
    if (UserDeatail) {
      setUser({ ...UserDeatail });
    }
  }, [UserDeatail]);

  const loadUser = async () => {
    await getByIdUser(params.id);
  };

  // Cập nhật state user khi input thay đổi
  const handleChange = (field: string, value: any) => {
    setUser((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirmSave = async () => {
    const ok = window.confirm("Bạn có chắc chắn muốn lưu các thay đổi không?");
    if (!ok) return;

    await handleSave();
  };

  const handleSave = async () => {
    if (!user) return;
    await updateUser(user.id, user);
  };

  if (!user)
    return (
      <div className="p-10 text-center text-gray-500">
        Đang tải dữ liệu người dùng...
      </div>
    );

  return (
    <main className="bg-gray-100 dark:bg-gray-950 min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <a href="/users" className="hover:text-blue-600 font-medium">
            Quản lý người dùng
          </a>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            Chi tiết người dùng
          </span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Thông tin Người dùng
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Xem và chỉnh sửa toàn bộ thông tin hồ sơ.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-400 
              text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition shadow-sm font-medium">
              <Lock size={18} /> Khóa tài khoản
            </button>

            <button
              onClick={handleConfirmSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 
              text-white transition shadow-md font-medium"
            >
              <Save size={18} /> Lưu thay đổi
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT - Avatar */}
          <div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border 
              border-gray-200 dark:border-gray-800 shadow-lg text-center">

              {/* Avatar */}
              <div className="relative w-36 h-36 mx-auto mb-4 hover:scale-105 transition">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  className="w-full h-full rounded-full border-4 border-white 
                    dark:border-gray-800 object-cover shadow-md"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 
                  border-white dark:border-gray-900 bg-green-500"></span>
              </div>

              {/* Name */}
              <input
                type="text"
                value={user.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full text-center text-2xl font-semibold bg-gray-100 dark:bg-gray-800 
                  p-3 rounded-xl mb-3 shadow-inner"
              />

              {/* Email */}
              <input
                type="email"
                value={user.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full text-center bg-gray-100 dark:bg-gray-800 p-3 rounded-xl 
                  shadow-inner mb-3"
              />

              {/* Status */}
              <select
                value={user.status ?? "active"}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full bg-green-100 dark:bg-green-500/20 text-green-700 
                  dark:text-green-400 rounded-xl p-3 font-medium shadow-inner"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-2xl border 
            border-gray-200 dark:border-gray-800 shadow-lg">

            <form className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <Field label="ID Người dùng" icon={<Shield size={16} />} value={user.id} disabled />
              <Field label="Họ và tên" icon={<User size={16} />} value={user.name} onChange={(v: any) => handleChange("name", v)} />

              <Field label="Email" icon={<Mail size={16} />} value={user.email} onChange={(v: any) => handleChange("email", v)} />
              <Field label="Số điện thoại" icon={<Phone size={16} />} value={user.phone} onChange={(v: any) => handleChange("phone", v)} />

              <Field label="Ngày sinh" type="date" icon={<Calendar size={16} />} value={user.birthDate} onChange={(v: any) => handleChange("birthDate", v)} />

              <Field label="CMND / CCCD" icon={<CreditCard size={16} />} value={user.idCard} onChange={(v: any) => handleChange("idCard", v)} />
              <Field label="Ngân hàng" icon={<Landmark size={16} />} value={user.bank_name} onChange={(v: any) => handleChange("bank_name", v)} />
              <Field label="Số tài khoản" icon={<CreditCard size={16} />} value={user.bank_account_number} onChange={(v: any) => handleChange("bank_account_number", v)} />

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-300">
                  <FileSignature size={16} /> Chữ ký
                </label>

                {user.signature ? (
                  <img
                    src={`${user.signature}`}
                    alt="Chữ ký người dùng"
                    className="w-64 h-auto border rounded-xl shadow p-2 bg-white dark:bg-gray-800"
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">Chưa có chữ ký</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// Component field input
// ─────────────────────────────────────────────────────────────
const Field = ({ label, icon, value, onChange, type = "text", full, disabled }: any) => {
  return (
    <div className={`${full ? "md:col-span-2" : ""}`}>
      <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-300">
        {icon} {label}
      </label>

      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 
          bg-gray-50 dark:bg-gray-900/40 p-3 shadow-sm
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition text-gray-900 dark:text-gray-100"
      />
    </div>
  );
};
