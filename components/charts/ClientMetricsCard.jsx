"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function ClientMetricsCard({ title, value, trend, icon, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-400 bg-blue-900/20",
    green: "text-green-400 bg-green-900/20",
    orange: "text-orange-400 bg-orange-900/20",
    red: "text-red-400 bg-red-900/20",
    purple: "text-purple-400 bg-purple-900/20",
  }

  const trendColor = trend?.startsWith("+") ? "text-green-400" : "text-red-400"

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-2">{title}</p>
            <p className="text-3xl font-bold text-white mb-2">{value}</p>
            {trend && <p className={`text-xs font-semibold ${trendColor}`}>{trend} from last period</p>}
          </div>
          <div className={`text-3xl p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
