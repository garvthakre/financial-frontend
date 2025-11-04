"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BranchPerformanceChart({ data = [] }) {
  const chartData = data.length
    ? data
    : [
        { branch: "Main Branch", revenue: 450000, commission: 13500, target: 50000 },
        { branch: "Downtown", revenue: 380000, commission: 11400, target: 50000 },
        { branch: "Uptown", revenue: 320000, commission: 9600, target: 50000 },
        { branch: "Westside", revenue: 290000, commission: 8700, target: 50000 },
      ]

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Branch Performance</CardTitle>
        <CardDescription>Revenue and commission by branch</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="branch" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" />
            <Bar dataKey="commission" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
