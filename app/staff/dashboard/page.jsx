"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import StaffDashboard from "@/components/staff/StaffDashboard"
import TransactionModal from "@/components/modals/TransactionModal"
import CreditsDebitsComparison from "@/components/charts/CreditsDebitsComparison"
import TransactionVolumeChart from "@/components/charts/TransactionVolumeChart"
import StatisticsOverview from "@/components/charts/StatisticsOverview"

export default function StaffDashboardPage() {
  const { fetchDashboardData, dashboardData, loading, startAutoRefresh, stopAutoRefresh } = useData()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const data = dashboardData // Declare the data variable

  useEffect(() => {
    if (user) {
      fetchDashboardData("staff", user.currentBranch)
      const intervalId = startAutoRefresh(5000)

      return () => {
        stopAutoRefresh()
      }
    }
  }, [user, fetchDashboardData, startAutoRefresh, stopAutoRefresh])

  return (
    <>
      <div className="p-8 bg-slate-950 min-h-screen space-y-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">
              Managing: <span className="text-blue-400">{user?.currentBranch}</span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            + Add Transaction
          </button>
        </div>

        {/* Statistics Overview */}
        <StatisticsOverview
          stats={[
            {
              title: "Today's Credits",
              value: data?.totalCredits ? `$${(data.totalCredits / 1000).toFixed(1)}K` : "$0",
              trend: "+15.3%",
              icon: "📈",
              color: "green",
            },
            {
              title: "Today's Debits",
              value: data?.totalDebits ? `$${(data.totalDebits / 1000).toFixed(1)}K` : "$0",
              trend: "-8.2%",
              icon: "📉",
              color: "red",
            },
            {
              title: "Commission (3%)",
              value: data?.commission ? `$${(data.commission / 1000).toFixed(1)}K` : "$0",
              trend: "+12.1%",
              icon: "💰",
              color: "orange",
            },
            {
              title: "Transactions",
              value: data?.transactionCount || "0",
              trend: "+5.2%",
              icon: "💳",
              color: "blue",
            },
          ]}
        />

        {/* Charts */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreditsDebitsComparison />
          <TransactionVolumeChart />
        </div> */}

        <StaffDashboard data={dashboardData} loading={loading} onAddTransaction={() => setShowModal(true)} />
      </div>

      {showModal && <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)} role="staff" />}
    </>
  )
}
