"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { ApartmentAPI, BuildingAPI, ContractAPI } from "@/services/api"; // axios instance
import type { RentalOrder, RentalContract } from "@/lib/types";
import { toast } from "sonner";

type ContractContextType = {
    Contractlist: RentalOrder[];
    ContractDetail: RentalContract | null;
    confirmPaymentByLandlord: (id: string) => Promise<boolean>;
    CancelContract: (id: number) => Promise<boolean>;
    handleContract: (id: number) => Promise<boolean>;
    getByIdContract: () => Promise<boolean>;
    getByIdContractDetail: (id: number) => Promise<boolean>;

};

const ContractContext = createContext<ContractContextType | undefined>(undefined);


export function ContractProvider({ children }: { children: ReactNode }) {
    const [Contractlist, setContractlist] = useState<RentalOrder[]>([]);
    const [ContractDetail, setContractDetail] = useState<RentalContract | null>(null);
    
    // 🟢 Lấy danh sách contract
    const getByIdContract = async (): Promise<boolean> => {
        try {
            const res = await ContractAPI.get();
            if (!res.data.success) return false;

            const dataContract: RentalOrder[] = res.data.data;
            setContractlist(dataContract);

            return true;

        } catch (error: any) {
            console.error("Lỗi", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
            return false;
        }
    };
    // 🟢 Lấy chi tiết contract
    const getByIdContractDetail = async (id: number): Promise<boolean> => {
        try {
            const res = await ContractAPI.getDetail(id);
            if (!res.data.success) return false;
            const dataContractDetail: RentalContract = res.data.data;
            console.log(dataContractDetail);
            setContractDetail(dataContractDetail);
            return true;
        } catch (error: any) {
            console.error("Lỗi", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
            return false;
        }
    }

    //ký hợp đồng
    const handleContract = async (id: number): Promise<boolean> => {
        try {
            const res = await ContractAPI.create(id);
            if (!res.data.success) return false;
            getByIdContractDetail(id);
            toast.success(res.data.message);
            return true;
        } catch (error: any) {
            console.error("Lỗi", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
            return false;
        }
    }
    // hủy hợp đồng
    const CancelContract = async (id: number): Promise<boolean> => {
        try {
            const res = await ContractAPI.cancel(id);
            if (!res.data.success) return false;
            getByIdContractDetail(id);
            toast.success(res.data.message);
            return true;
        } catch (error: any) {
            console.error("Lỗi", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
            return false;
        }
    };

    async function confirmPaymentByLandlord(id: string): Promise<boolean> {
        try {
            // Gọi API backend để chủ nhà xác nhận thanh toán
            const res = await ContractAPI.confirmPayment(id);
            // Clone dữ liệu để tránh mutate trực tiếp state
            const updatedContract = { ...ContractDetail };
            // updatedContract.order.payment = updatedContract.order.payment.map((p: any) =>
            //     p.id === paymentId
            //         ? {
            //             ...p,
            //             status: "paid", // chuyển trạng thái thành "Đã xác nhận"
            //             payment_date: p.payment_date || new Date().toISOString(), // nếu muốn set ngày hiện tại
            //         }
            //         : p
            // );
            toast.success(res.data.message);
            return true;
        } catch (error: any) {
            console.error("Xác nhận thanh toán lỗi:", error);
            toast.error(
                error?.response?.data?.message || "❌ Có lỗi xảy ra khi xác nhận thanh toán."
            );
            return false;
        }
    }


    return (
        <ContractContext.Provider value={{ Contractlist, confirmPaymentByLandlord, handleContract, getByIdContract, ContractDetail, getByIdContractDetail, CancelContract }}>
            {children}
        </ContractContext.Provider>
    );
}

// 🟢 Hook để dùng trong component
export function useContract() {
    const context = useContext(ContractContext);
    if (context === undefined) {
        throw new Error("ContractContext must be used trong BuildingProvider");
    }
    return context;
}
