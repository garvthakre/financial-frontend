"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import StaffDashboard from "@/components/staff/StaffDashboard"
import TransactionModal from "@/components/modals/TransactionModal"
import StatisticsOverview from "@/components/charts/StatisticsOverview"

export default function StaffDashboardPage() {
  const { fetchDashboardData, dashboardData, loading, startAutoRefresh, stopAutoRefresh } = useData()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const data = dashboardData

useEffect(() => {
    if (user) {
      // Fetch combined data from all branches (no branchId filter)
      fetchDashboardData("staff", null)
      const intervalId = startAutoRefresh(5000)

      return () => {
        stopAutoRefresh()
      }
    }
  }, [user, fetchDashboardData, startAutoRefresh, stopAutoRefresh])

  // CHANGED: Balance is now credits - debits
  const balance = data?.walletBalance || 0
  const isNegative = balance < 0

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

        {/* Statistics Overview - CHANGED: Added balance card */}
        <StatisticsOverview
          stats={[
            {
              title: "My Balance",
              value: `₹${(Math.abs(balance) / 1000).toFixed(1)}K`,
              trend: isNegative ? "Negative Balance" : "Positive Balance",
              icon: "💰",
              color: isNegative ? "red" : "green",
            },
            {
              title: "Today's Credits",
              value: data?.totalCredits ? `₹${(data.totalCredits / 1000).toFixed(1)}K` : "₹0",
              trend: "+",
              icon: "📈",
              color: "green",
            },
            {
              title: "Today's Debits",
              value: data?.totalDebits ? `₹${(data.totalDebits / 1000).toFixed(1)}K` : "₹0",
              trend: "-",
              icon: "📉",
              color: "red",
            },
            {
              title: "Commission (3%)",
              value: data?.commission ? `₹${(data.commission / 1000).toFixed(1)}K` : "₹0",
              trend: "",
              icon: "💸",
              color: "orange",
            },
            {
              title: "Transactions",
              value: data?.transactionCount || "0",
              trend: "",
              icon: "💳",
              color: "blue",
            },
          ]}
        />

        {/* Balance Explanation */}
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-2">💡 Balance Explanation</h3>
          <p className="text-slate-300 text-sm">
            Your balance = Total Credits Received - Total Debits Paid
          </p>
          <p className="text-slate-400 text-xs mt-2">
            • <strong>Credit:</strong> Client deposits money → You receive (amount - 3%)
          </p>
          <p className="text-slate-400 text-xs">
            • <strong>Debit:</strong> Client withdraws money → You pay (amount + 3%)
          </p>
          <div className={`mt-3 p-3 rounded ${isNegative ? 'bg-red-900/20 border border-red-700' : 'bg-green-900/20 border border-green-700'}`}>
            <p className={`font-semibold ${isNegative ? 'text-red-300' : 'text-green-300'}`}>
              Current Status: {isNegative ? 'You owe money (negative balance)' : 'You have money (positive balance)'}
            </p>
          </div>
        </div>

        <StaffDashboard data={dashboardData} loading={loading} onAddTransaction={() => setShowModal(true)} />
      </div>

      {showModal && <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)} role="staff" />}
    </>
  )
}