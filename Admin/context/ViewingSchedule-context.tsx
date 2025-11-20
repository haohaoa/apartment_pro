"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { ViewscheduleAPI } from "@/services/api"; // axios instance
import type { ViewingSchedule} from "@/lib/types";
import { toast } from "sonner";

type BuildingContextType = {
    viewSchedule: ViewingSchedule | null;
    listViewingSchedule: ViewingSchedule[];
    getScheduleById: (id: string) => Promise<boolean>;
    getSchedule: () => Promise<boolean>;
    deleleScheduleById: (id: string) => Promise<boolean>;
};

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export function ViewingScheduleProvider({ children }: { children: ReactNode }) {
    const [listViewingSchedule, setListViewingSchedule] = useState<ViewingSchedule[]>([]);
    const [viewSchedule, setViewSchedule] = useState<ViewingSchedule | null>(null);
    const getSchedule = async (): Promise<boolean> => {
        try {
            const res = await ViewscheduleAPI.getall();
            const data: ViewingSchedule[] = res.data.data;
            setListViewingSchedule(data);
            return true
        } catch (error: any) {
            console.error("Lỗi :", error);
            toast.error(error.response?.data?.message);
            return false;
        }
    }

    const getScheduleById = async (id: string): Promise<boolean > => {
        try {
            const res = await ViewscheduleAPI.getbyid(id);
            const data: ViewingSchedule = res.data.data;
            setViewSchedule(data);
            return true;
        } catch (error: any) {
            console.error("Lỗi :", error);
            toast.error(error.response?.data?.message);
            return false;
        }
    }

    const deleleScheduleById = async (id: string): Promise<boolean> => {
        try {
            const res = await ViewscheduleAPI.delete(id);
            toast.success(res.data?.message)
            return true;
        } catch (error: any) {
            console.error("Lỗi :", error);
            toast.error(error.response?.data?.message);
            return false;
        }
    }
    return (
        <BuildingContext.Provider value={{ deleleScheduleById, viewSchedule, getScheduleById, listViewingSchedule, getSchedule }}>
            {children}
        </BuildingContext.Provider>
    );
}

// 🟢 Hook để dùng trong component
export function useViewschedule() {
    const context = useContext(BuildingContext);
    if (context === undefined) {
        throw new Error("useBuilding must be used trong BuildingProvider");
    }
    return context;
}
