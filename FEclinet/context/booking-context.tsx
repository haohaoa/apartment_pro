"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { BookingAPI } from "@/services/api";
import type { Booking, ViewingScheduleResponse, ViewingScheduleResponseDetail, Payment } from "@/lib/types";
import { ca } from "date-fns/locale";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';







interface bookingContextType {
    log: any | null;
    booking: Booking | null;
    listbooking: ViewingScheduleResponse | null;
    bookingDetail: ViewingScheduleResponseDetail | null;
    infoPayment: Payment | null;
    markAsPaid: (id: string) => Promise<boolean>;
    getInfoPayment: (id: string) => Promise<boolean>; // Thêm phương thức infopayment
    createBooking: (data: Booking) => Promise<boolean>;
    fetchAllBooking: () => Promise<boolean>;
    deleteBooking: (id: number) => Promise<boolean>;
    getBookingById?: (id: number) => Promise<boolean>;
    store?: (data: any) => Promise<boolean>;
}

const bookingContext = createContext<bookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [listbooking, setAllBooking] = useState<ViewingScheduleResponse | null>(null);
    const [bookingDetail, setBookingDetail] = useState<ViewingScheduleResponseDetail | null>(null);
    const [log, setLog] = useState<string | null>(null);
    const [infoPayment, setInfoPayment] = useState<Payment | null>(null);
    async function createBooking(data: Booking): Promise<boolean> {
        try {
            const res = await BookingAPI.create(data);
            const dataBooking: Booking = res.data;
            setBooking(dataBooking);
            toast.success(res?.data?.message);
            return true;
        } catch (err: any) {
            const mess = err.response?.data?.message || 'Đã xảy ra lỗi không xác định.';

            await Swal.fire({
                title: 'Lỗi khi Ký Hợp Đồng!',
                text: mess,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return false;
        }
    }

    async function fetchAllBooking() {
        try {
            const res = await BookingAPI.getall();
            const dataBooking: ViewingScheduleResponse = res.data;
            setAllBooking(dataBooking);
            console.log(dataBooking);

            return true;
        } catch (error) {
            console.error("Fetch all booking error:", error);
            return false;
        }
    }

    async function deleteBooking(id: number): Promise<boolean> {
        try {
            const re = await BookingAPI.delete(id);
            setLog("Đã xóa thành công!");
            fetchAllBooking();
            return true;
        } catch (error: any) {
            setLog(error.response?.data ? JSON.stringify(error.response.data) : "Xảy ra lỗi không xác định");
            console.error("Delete booking error:", error);
            return false;
        }
    }
    async function getBookingById(id: number): Promise<boolean> {
        try {
            const res = await BookingAPI.getById(id);
            if (!res.data.success) {
                return false;
            }
            const dataBooking: ViewingScheduleResponseDetail = res.data;
            setBookingDetail(dataBooking);
            return true;
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || 'Đã xảy ra lỗi không xác định.';

            await Swal.fire({
                title: 'Lỗi khi Ký Hợp Đồng!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            window.location.href = '/';
            return false;
        }
    }
    async function store(data: any): Promise<boolean> {
        try {
            const res = await BookingAPI.store(data);
            const mess = res.data.message;
            if (res.data.success == true) {
                toast.success(mess);
                return true;
            } else {
                toast.error(mess || "Có lỗi xảy ra!");
                return false;
            }
        } catch (error: any) {
            // Nếu dùng axios
            const mess = error.response?.data?.message || error.message || "Lỗi server";
            await Swal.fire({
                title: 'Lỗi khi lấy lịch đặt!',
                text: mess,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return false;
        }
    }
    async function getInfoPayment(id: string): Promise<boolean> {
        try {
            const res = await BookingAPI.infopayment(id)
            const data: Payment = res.data.data
            setInfoPayment(data)

            console.log("✅ Dữ liệu thanh toán nhận được:", data)
            return true
        } catch (error: any) {
            console.error("Delete booking error:", error);

            return false
        }
    }
    async function markAsPaid(id: string): Promise<boolean> {
        try {
            const res = await BookingAPI.confirmPayment(id)
            toast.success(res.data.message)
            return true
        } catch (error: any) {
            console.error("Delete booking error:", error);
            return false
        }
    }
    return (
        <bookingContext.Provider
            value={{ infoPayment, booking, listbooking, log, bookingDetail, markAsPaid,getInfoPayment, createBooking, fetchAllBooking, deleteBooking, getBookingById, store }}
        >
            {children}
        </bookingContext.Provider>
    );
}

// Hook dùng context
export function usebooking() {
    const context = useContext(bookingContext);
    if (!context) {
        throw new Error("useApartment must be used within ApartmentProvider");
    }
    return context;
}
