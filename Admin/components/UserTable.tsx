"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Edit, Lock, LockOpen, Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

// Hàm đổi màu theo trạng thái
const getStatusColor = (status: string) => {
    switch (status) {
        case "Hoạt động":
            return "text-green-600 bg-green-100";
        case "Đã khóa":
            return "text-red-600 bg-red-100";
        default:
            return "text-gray-600 bg-gray-100";
    }
};

// Hàm đổi màu theo role
const getRoleColor = (role: string) => {
    switch (role) {
        case "admin":
            return "text-blue-700 bg-blue-100";
        case "owner":
            return "text-yellow-700 bg-yellow-100";
        case "tenant":
            return "text-green-700 bg-green-100";
        default:
            return "text-gray-600 bg-gray-100";
    }
};

// Hàm chuyển role code sang tiếng Việt
const roleToVietnamese = (role: string) => {
    switch (role) {
        case "admin":
            return "Quản trị";
        case "owner":
            return "Chủ nhà";
        case "tenant":
            return "Khách thuê";
        default:
            return "Khách thuê";
    }
};

export default function UserTable() {
    const { listUsers, getalluser, getDelete } = useAuth();

    useEffect(() => {
        getalluser();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa tài khoản này không?");
        if (!confirmDelete) return;

        const ok = await getDelete(id);
        if (ok) {
            alert("Xóa thành công!");
        } else {
            alert("Xóa thất bại! Vui lòng thử lại.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Tên</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Vai trò</th> {/* Role đổi thành Vai trò */}
                        <th className="p-3 text-left">Trạng thái</th>
                        <th className="p-3 text-center">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {listUsers?.map((user: any) => (
                        <tr key={user.id} className="border-b">
                            <td className="p-3">{user.id}</td>
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>

                            <td className="p-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                                        user.role ?? "tenant"
                                    )}`}
                                >
                                    {roleToVietnamese(user.role ?? "tenant")}
                                </span>
                            </td>

                            <td className="p-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                        user.status ?? "Hoạt động"
                                    )}`}
                                >
                                    {user.status ?? "Hoạt động"}
                                </span>
                            </td>

                            <td className="p-3 flex gap-3 justify-center">

                                <Link
                                    href={`/users/${user.id}`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Edit size={20} />
                                </Link>

                                {user.status === "Đã khóa" ? (
                                    <button className="text-green-600 hover:text-green-800">
                                        <LockOpen size={22} />
                                    </button>
                                ) : (
                                    <button className="text-red-600 hover:text-red-800">
                                        <Lock size={22} />
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <Trash2 size={20} />
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
    