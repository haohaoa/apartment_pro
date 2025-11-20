"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ApartmentAPI, ContractAPI } from "@/services/api";
import type { ApartmentSearchResponse ,Apartment ,RentalOrder } from "@/lib/types";


interface Image {
  id: number;
  apartment_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ApartmentItem {
  id: number;
  owner_id: string;
  title: string;
  description: string;
  address: string;
  price: string;
  status: string;
  created_at: string;
  updated_at: string;
  images: Image[];
}

interface ApiResponse {
  apartment: ApartmentItem;
}

interface ApartmentContextType {
  contracts: RentalOrder[];
  apartment: ApartmentItem | null;
  searchResults: ApartmentSearchResponse | null;
  getAllApartment(): Promise<boolean>;
  GetApartmentID: (id: number) => Promise<boolean>;
  searchApartment: (query: any) => Promise<boolean>;
}

const ApartmentContext = createContext<ApartmentContextType | undefined>(undefined);

export function ApartmentProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<RentalOrder[]>([]);
  const [apartment, setApartment] = useState<ApartmentItem | null>(null);
  const [searchResults, setSearchResults] = useState<ApartmentSearchResponse| null>(null);

  // Hàm lấy căn hộ theo id
  async function GetApartmentID(id: number): Promise<boolean> {
    try {
      const res = await ApartmentAPI.getById(id);
      const data: ApiResponse = res.data;
      setApartment(data.apartment);
      return true;
    } catch (error) {
      console.error("Apartment error:", error);
      return false;
    }
  }

  // Hàm tìm kiếm căn hộ
  async function searchApartment(query: string): Promise<boolean> {
    try {
      const res = await ApartmentAPI.search(query);
      if (res.data) {
        setSearchResults(res.data);
        console.log("Search results:", res.data);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Search error:", error);
      return false;
    }
  }
  // lấy tất cả căn hộ đã ký hợp đồng 
  async function getAllApartment(): Promise<boolean> {
    try {
      const res = await ContractAPI.viewAllById();
      if (res.data) {
        setContracts(res.data.data);
        console.log("Search results:", res.data.data);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Search error:", error);
      return false;
    }
  }

  return (
    <ApartmentContext.Provider
      value={{ contracts, getAllApartment, apartment, searchResults, GetApartmentID, searchApartment }}
    >
      {children}
    </ApartmentContext.Provider>
  );
}

// Hook dùng context
export function useApartment() {
  const context = useContext(ApartmentContext);
  if (!context) {
    throw new Error("useApartment must be used within ApartmentProvider");
  }
  return context;
}
