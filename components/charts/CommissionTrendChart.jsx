"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommissionTrendChart({ data = [] }) {
  // Generate mock data if none provided
  const chartData = data.length
    ? data
    : Array.from({ length: 12 }).map((_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        commission: Math.floor(Math.random() * 50000),
        target: 40000,
      }))

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Commission Trend</CardTitle>
        <CardDescription>Monthly commission vs target</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
            <Legend />
            <Line type="monotone" dataKey="commission" stroke="#f59e0b" strokeWidth={2} name="Actual" />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
