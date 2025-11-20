// app/dashboard/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ApartmentDetail from "@/components/dashboard/ApartmentDetail";

export default function ApartmentDetailPage() {
  const params = useParams();
  const apartmentId = params?.id as string;

  return <ApartmentDetail apartmentId={apartmentId} />;
}
