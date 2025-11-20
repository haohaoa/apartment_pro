// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";
// import { BookingAPI } from "@/services/api";
// import type { Booking, ViewingScheduleResponse, ViewingScheduleResponseDetail } from "@/lib/types";
// import { ca } from "date-fns/locale";
// import Swal from "sweetalert2";
// import 'react-toastify/dist/ReactToastify.css';
// import { toast } from 'react-toastify';







// interface bookingContextType {
    
// }

// const bookingContext = createContext<bookingContextType | undefined>(undefined);

// export function DashboardProvider({ children }: { children: ReactNode }) {
   

//     return (
//         <bookingContext.Provider
//             value={{ booking, listbooking, log, bookingDetail, createBooking, fetchAllBooking, deleteBooking, getBookingById, store }}
//         >
//             {children}
//         </bookingContext.Provider>
//     );
// }

// // Hook dùng context
// export function useDashboard() {
//     const context = useContext(bookingContext);
//     if (!context) {
//         throw new Error("useApartment must be used within ApartmentProvider");
//     }
//     return context;
// }
