"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MaintenanceAPI } from "@/services/api";
import type { maintenance } from "@/lib/types";
import { toast } from "sonner";

interface MaintenanceContextType {
    maintenance: maintenance[];
    getmaintenance: () => Promise<boolean>;
    markAsReadMaintenance: (id: number) => Promise<boolean>;
}

const maintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
    const [maintenance, setmaintenance] = useState<maintenance[]>([]);
    const getmaintenance = async (): Promise<boolean> => {
        try {
            const response = await MaintenanceAPI.getBy();
            setmaintenance(response?.data?.data);
            return true;
        } catch (error: any) {
            console.error("API Error:", error.response?.data);
            toast.error(error.response?.data?.message || "Lỗi server");
            return false;
        }
    };

    const markAsReadMaintenance = async (id: number): Promise<boolean> => {
        try {
            const response = await MaintenanceAPI.markAsRead(id);
            toast.success(response?.data?.message);
            return true;
        } catch (error: any) {
            console.error("API Error:", error.response?.data);
            toast.error(error.response?.data?.message || "Lỗi server");
            return false;
        }
    };

    return (
        <maintenanceContext.Provider value={{ maintenance, getmaintenance,markAsReadMaintenance }}>
            {children}
        </maintenanceContext.Provider>
    );
}

// Hook dùng context
export function useMaintenance() {
    const context = useContext(maintenanceContext);
    if (!context) {
        throw new Error("useMaintenance must be used within MaintenanceProvider");
    }
    return context;
}
