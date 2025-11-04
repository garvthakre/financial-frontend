"use client"

import { useEffect } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import AdminDashboard from "@/components/admin/AdminDashboard"
import CommissionTrendChart from "@/components/charts/CommissionTrendChart"
import BranchPerformanceChart from "@/components/charts/BranchPerformanceChart"
import CreditsDebitsComparison from "@/components/charts/CreditsDebitsComparison"
import StatisticsOverview from "@/components/charts/StatisticsOverview"

export default function AdminDashboardPage() {
  const { fetchDashboardData, dashboardData, loading, startAutoRefresh, stopAutoRefresh } = useData()
  const { user } = useAuth()
  const data = dashboardData // Declare the data variable

  useEffect(() => {
    if (user) {
      fetchDashboardData("admin")
      const intervalId = startAutoRefresh(5000) // Refresh every 5 seconds

      return () => {
        stopAutoRefresh()
      }
    }
  }, [user, fetchDashboardData, startAutoRefresh, stopAutoRefresh])

  return (
    <div className="p-8 bg-slate-950 min-h-screen space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">System-wide financial overview and analytics</p>
      </div>

      {/* Statistics Overview */}
      <StatisticsOverview
        stats={[
          {
            title: "Total Credits",
            value: data?.totalCredits ? `$${(data.totalCredits / 1000).toFixed(1)}K` : "$0",
            trend: "+12.5%",
            icon: "📈",
            color: "green",
          },
          {
            title: "Total Debits",
            value: data?.totalDebits ? `$${(data.totalDebits / 1000).toFixed(1)}K` : "$0",
            trend: "-5.2%",
            icon: "📉",
            color: "red",
          },
          {
            title: "Commission Earned",
            value: data?.commission ? `$${(data.commission / 1000).toFixed(1)}K` : "$0",
            trend: "+8.1%",
            icon: "💰",
            color: "orange",
          },
          {
            title: "Transactions",
            value: data?.transactionCount || "0",
            trend: "+3.2%",
            icon: "💳",
            color: "blue",
          },
        ]}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommissionTrendChart />
        <BranchPerformanceChart />
        <CreditsDebitsComparison />
        <div className="lg:col-span-2">
          <AdminDashboard data={dashboardData} loading={loading} />
        </div>
      </div>
    </div>
  )
}
