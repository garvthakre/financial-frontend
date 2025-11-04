"use client"

import { useEffect, useRef } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import ClientDashboard from "@/components/client/ClientDashboard"
import TransactionVolumeChart from "@/components/charts/TransactionVolumeChart"
import PieChartWrapper from "@/components/charts/PieChartWrapper"
import StatisticsOverview from "@/components/charts/StatisticsOverview"

export default function ClientDashboardPage() {
  const { fetchDashboardData, dashboardData, loading, startAutoRefresh, stopAutoRefresh } = useData()
  const { user } = useAuth()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (user && !initializedRef.current) {
      initializedRef.current = true
      fetchDashboardData("client")
      const intervalId = startAutoRefresh(5000)

      return () => {
        stopAutoRefresh()
      }
    }
  }, [user]) // Remove function dependencies, only depend on user

  return (
    <div className="p-8 bg-slate-950 min-h-screen space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
        <p className="text-slate-400">Monitor your daily transactions and balance</p>
      </div>

      {/* Statistics Overview */}
      <StatisticsOverview
        stats={[
          {
            title: "Wallet Balance",
            value: dashboardData?.walletBalance ? `$${(dashboardData.walletBalance / 1000).toFixed(1)}K` : "$0",
            trend: "+5.2%",
            icon: "💰",
            color: "green",
          },
          {
            title: "Today's Credits",
            value: dashboardData?.totalCredits ? `$${(dashboardData.totalCredits / 1000).toFixed(1)}K` : "$0",
            trend: "+8.1%",
            icon: "📈",
            color: "blue",
          },
          {
            title: "Today's Debits",
            value: dashboardData?.totalDebits ? `$${(dashboardData.totalDebits / 1000).toFixed(1)}K` : "$0",
            trend: "-3.2%",
            icon: "📉",
            color: "red",
          },
          {
            title: "Total Commission",
            value: dashboardData?.commission ? `$${(dashboardData.commission / 1000).toFixed(1)}K` : "$0",
            trend: "+2.1%",
            icon: "💸",
            color: "orange",
          },
        ]}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionVolumeChart />
        <PieChartWrapper
          title="Transaction Breakdown"
          description="Distribution of credits, debits, and commission"
          data={[
            { name: "Credits", value: 45 },
            { name: "Debits", value: 35 },
            { name: "Commission Paid", value: 20 },
          ]}
          colors={["#10b981", "#ef4444", "#f59e0b"]}
        />
      </div>

      <ClientDashboard data={dashboardData} loading={loading} />
    </div>
  )
}
