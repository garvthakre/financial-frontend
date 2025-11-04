"use client"

import ClientMetricsCard from "./ClientMetricsCard"

export default function StatisticsOverview({ stats }) {
  const defaultStats = [
    { title: "Total Revenue", value: "$125.4K", trend: "+12.5%", icon: "💰", color: "green" },
    { title: "Active Clients", value: "342", trend: "+8.2%", icon: "👥", color: "blue" },
    { title: "Transactions", value: "1,234", trend: "+23.1%", icon: "💳", color: "orange" },
    { title: "Commission Rate", value: "3%", trend: "Stable", icon: "📊", color: "purple" },
  ]

  const displayStats = stats && stats.length ? stats : defaultStats

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, idx) => (
        <ClientMetricsCard
          key={idx}
          title={stat.title}
          value={stat.value}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}
