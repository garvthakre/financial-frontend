"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreditsDebitsComparison({ data = [] }) {
  const chartData = data.length
    ? data
    : Array.from({ length: 7 }).map((_, i) => ({
        day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i],
        credits: Math.floor(Math.random() * 100000),
        debits: Math.floor(Math.random() * 80000),
        net: Math.floor(Math.random() * 50000),
      }))

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Credits vs Debits</CardTitle>
        <CardDescription>Weekly transaction comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
            <Legend />
            <Bar dataKey="credits" fill="#10b981" />
            <Bar dataKey="debits" fill="#ef4444" />
            <Line type="monotone" dataKey="net" stroke="#f59e0b" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
