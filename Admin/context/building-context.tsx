"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { ApartmentAPI, BuildingAPI } from "@/services/api"; // axios instance
import type { Building, Apartment } from "@/lib/types";
import { toast } from "sonner";
interface DashboardData {
    total_buildings: number;
    rentedApartments: Apartment[];
    available_apartments: number;
    recentContracts: any[];
    monthly_revenue: Record<number, number>;
    userWithBuildings:number;
    current_month_growth :number;
    growth: number;
}
type BuildingContextType = {
    dashboard: DashboardData | null;
    building: Building[];
    data: Building | null;
    apartments: Apartment | null;
    getDashboard: () => Promise<boolean>;
    updateApartment: (id: number, data: Apartment) => Promise<boolean>;
    viewApartment: (id: number) => Promise<boolean>;
    deleteApartment: (id: number) => Promise<boolean>;
    createApartment: (buildingId: number, data: Apartment) => Promise<boolean>;
    getBuildingById: (id: number) => Promise<boolean>;
    deleteBuiding: (id: number) => Promise<boolean>;
    getBuilding: () => Promise<boolean>;
    createBuilding: (data: Building) => Promise<boolean>;
    getCoordinates: (address: string) => Promise<{ lat: number; lng: number } | null>;
    updateBuilding: (data: Building, id: number) => Promise<boolean>;
};

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export function BuildingProvider({ children }: { children: ReactNode }) {
    const [building, setBuilding] = useState<Building[]>([]);
    const [apartments, setApartments] = useState<Apartment | null>(null);
    const [data, setData] = useState<Building | null>(null);
    const [dashboard, setdashboard] = useState<DashboardData | null>(null);

    // 🟢 Lấy danh sách building
    const getBuilding = async (): Promise<boolean> => {
        try {
            const res = await BuildingAPI.get();
            const dataBuilding: Building[] = res.data.data;
            setBuilding(dataBuilding);
            return true;
        } catch (error: any) {
            console.error("Lỗi khi load building:", error);
            toast.error(error.response?.data?.message || "Không lấy được dữ liệu tòa nhà");
            return false;
        }
    };

    const createBuilding = async (data: Building): Promise<boolean> => {
        try {
            const res = await BuildingAPI.create(data);
            getBuilding();
            toast.success(res?.data?.message);
            return true;
        } catch (error: any) {
            console.error("Lỗi khi tạo building:", error);
            toast.error(error.response?.data?.message || "Không lấy được dữ liệu tòa nhà");
            return false;
        }
    }

    // 🟢 Hàm lấy tọa độ theo địa chỉ (dùng API LocationIQ)
    const getCoordinates = async (
        address: string
    ): Promise<{ lat: number; lng: number } | null> => {
        if (!address || address.trim() === "") {
            toast.error("Vui lòng nhập địa chỉ");
            return null;
        }

        try {
            const token = "pk.7cdf30d240bbd179da6a5133e1cc2346"; // 🚨 Token LocationIQ

            const url = `https://us1.locationiq.com/v1/search.php?key=${token}&q=${encodeURIComponent(
                address
            )}&format=json`;

            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok) {
                toast.error(data?.error || "Không tìm thấy tọa độ");
                return null;
            }

            if (!Array.isArray(data) || data.length === 0) {
                toast.error("API không trả về tọa độ hợp lệ");
                return null;
            }

            return {
                lat: Number(data[0].lat),
                lng: Number(data[0].lon),
            };
        } catch (err) {
            console.error("Lỗi khi gọi geocode:", err);
            toast.error("Không thể lấy tọa độ từ server");
            return null;
        }
    };

    const updateBuilding = async (data: Building, id: number): Promise<boolean> => {
        try {
            const res = await BuildingAPI.update(id, data);
            getBuilding();
            toast.success(res?.data?.message);
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không lý đổi dữ liệu tòa nhà");
            return false;
        }
    };
    const deleteBuiding = async (id: number): Promise<boolean> => {
        try {
            const res = await BuildingAPI.delete(id);
            getBuilding();
            toast.success(res?.data?.message);
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không xóa dữ liệu tòa nhà");
            return false;
        }
    }

    const getBuildingById = async (id: number): Promise<boolean> => {
        try {
            const res = await BuildingAPI.getById(id);
            const dataBuilding: Building = res.data.data;
            setData(dataBuilding);
            return true;
        } catch (error: any) {
            console.error("Lỗi khi load building:", error);
            toast.error(error.response?.data?.message || "Không lý dữ liệu tòa nhà");
            return false;
        }
    }
    // thêm 
    const createApartment = async (buildingId: number, data: Apartment): Promise<boolean> => {
        try {
            const res = await ApartmentAPI.create(buildingId, data);
            toast.success(res?.data?.message);
            if (res.data.success == false) {
                toast.error(res?.data?.message);
                return false
            }
            getBuildingById(buildingId);
            return true
        } catch (error: any) {
            console.error("Lỗi :", error);
            toast.error(error.response?.data?.message);
            return false;
        }
    } // create apartment

    //delete apartment 
    const deleteApartment = async (id: number): Promise<boolean> => {
        try {
            const res = await ApartmentAPI.delete(id);
            toast.success(res?.data?.message);
            return true
        } catch (error: any) {
            console.error("Lỗi :", error);
            toast.error(error.response?.data?.message);
            return false;
        }
    }
    // hiển thị căn họ , hợp đòng, bảo trì
    const viewApartment = async (id: number): Promise<boolean> => {
        try {
            const res = await ApartmentAPI.getById(id);
            setApartments(res.data?.data);
            console.log(res);
            return true
        } catch (error: any) {
            console.error("Lỗi :", error);
            toast.error(error.response?.data?.message);
            return false;
        }
    }
    const updateApartment = async (id: number, data: Apartment): Promise<boolean> => {
        try {
            const res = await ApartmentAPI.update(id, data);
            viewApartment(id);
            toast.success(res?.data?.message);
            return true
        } catch (error: any) {
            console.error("Lỗi :", error);
            toast.error(error.response?.data?.message);
            return false;
        }
    }
    const getDashboard = async (): Promise<boolean> => {
        try {
            const res = await BuildingAPI.getDashboard();
            const data:DashboardData = res.data
            setdashboard(data);
            return true; // thành công
        } catch (error: any) {
            console.error("Lỗi khi lấy dashboard:", error);
            return false; // lỗi
        }
    };
    return (
        <BuildingContext.Provider value={{ dashboard ,getDashboard,building, data, apartments, updateApartment, viewApartment, deleteApartment, createApartment, getBuildingById, deleteBuiding, getBuilding, getCoordinates, createBuilding, updateBuilding }}>
            {children}
        </BuildingContext.Provider>
    );
}

// 🟢 Hook để dùng trong component
export function useBuilding() {
    const context = useContext(BuildingContext);
    if (context === undefined) {
        throw new Error("useBuilding must be used trong BuildingProvider");
    }
    return context;
}
