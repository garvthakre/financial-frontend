"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function StatCard({ title, value, change, icon }) {
  const isPositive = !change.includes("-")

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white mb-2">{value}</p>
            <p className={`text-xs font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {change} from yesterday
            </p>
          </div>
          <div className="text-3xl ml-4">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
