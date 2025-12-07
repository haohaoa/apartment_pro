"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MaintenanceAPI } from "@/services/api";
import type { maintenance } from "@/lib/types";
import { toast } from "sonner";

interface MaintenanceContextType {
    createmaintenance: (payload: { apartment_id: number; description: string }) => Promise<boolean>;
}

const maintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {

    const createmaintenance = async (payload: { apartment_id: number; description: string }): Promise<boolean> => {
        try {
            const response = await MaintenanceAPI.craete(payload);
            toast.success(response?.data?.message);
            return true;
        } catch (error: any) {
            console.error("API Error:", error.response?.data);
            toast.error(error.response?.data?.message || "Lỗi server");
            return false;
        }
    };

    return (
        <maintenanceContext.Provider value={{ createmaintenance }}>
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
