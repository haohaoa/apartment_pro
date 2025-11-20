"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface RevenueChartProps {
  monthlyRevenue: Record<string, number | string>
}

export function RevenueChart({ monthlyRevenue }: RevenueChartProps) {
  // Chuyển dữ liệu từ dashboard.monthly_revenue thành mảng cho Recharts
  const data = Object.keys(monthlyRevenue).map((month) => ({
    name: `T${month}`,
    total: Number(monthlyRevenue[month] ?? 0),
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => new Intl.NumberFormat("vi-VN").format(value)}
        />
        <Tooltip
          formatter={(value: number) => [
            new Intl.NumberFormat("vi-VN").format(value) + " VND",
            "Doanh thu",
          ]}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
