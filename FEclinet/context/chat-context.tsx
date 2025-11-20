"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ChatAPI } from "@/services/api";

interface Image {
    id: number;
    apartment_id: number;
    image_url: string;
    created_at: string;
    updated_at: string;
}

interface Product {
    id: number;
    owner_id: number;
    title: string;
    description: string;
    address: string;
    price: string;
    status: string;
    created_at: string;
    updated_at: string;
    images: Image[];
}

interface HistoryItem {
    role: "user" | "assistant";
    content: string;
    product: Product[];
}

interface ApiResponse {
    history: HistoryItem[];
}

interface AIChatContextType {
    chatHistory: HistoryItem[];
    sendMessage: (message: string) => Promise<boolean>;
    getChatHistory: () => Promise<boolean>;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export function AIChatProvider({ children }: { children: ReactNode }) {
    const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);

    async function sendMessage(message: string): Promise<boolean> {
        try {
            const res = await ChatAPI.sendMessage({ message });
            if (res.status === 200) {
                return true;
            } else {
                console.error("Failed to send message:", res.statusText);
                return false;
            }
        } catch (error) {
            console.error("AI Chat error:", error);
            return false;
        }
    }
    async function getChatHistory() {
        try {
            const res = await ChatAPI.getAll();
            const data: ApiResponse = res.data;
            setChatHistory(data.history);
            return true;
        } catch (error) {
            console.error("AI Chat error:", error);
            return false;
        }
    }


    return (
        <AIChatContext.Provider value={{ chatHistory, sendMessage, getChatHistory }}>
            {children}
        </AIChatContext.Provider>
    );
}

export function useAIChat() {
    const context = useContext(AIChatContext);
    if (!context) {
        throw new Error("useAIChat must be used within AIChatProvider");
    }
    return context;
}
