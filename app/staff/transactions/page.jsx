"use client"

"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TransactionModal from "@/components/modals/TransactionModal"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function StaffTransactionsPage() {
  const { fetchTransactions, transactions, loading } = useData()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  
  // Get branchId from URL query params
  const branchId = searchParams.get('branchId')

  useEffect(() => {
    if (user) {
      // Fetch transactions for specific branch or all branches
      fetchTransactions("staff", branchId, 50)
    }
  }, [user, branchId, fetchTransactions])

  const chartData = Array.from({ length: 7 }).map((_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    credits: Math.floor(Math.random() * 100000),
    debits: Math.floor(Math.random() * 50000),
  }))

  const totalCredits = transactions.reduce((sum, t) => (t.type === "credit" ? sum + t.amount : sum), 0)
  const totalDebits = transactions.reduce((sum, t) => (t.type === "debit" ? sum + t.amount : sum), 0)
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0)

  return (
    <>
      <div className="p-8 bg-slate-950 min-h-screen">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Transaction Management</h1>
            <p className="text-slate-400">Branch: {user?.currentBranch}</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
            + New Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400 mb-1">Total Credits</p>
              <p className="text-2xl font-bold text-green-400">${(totalCredits / 1000).toFixed(1)}K</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400 mb-1">Total Debits</p>
              <p className="text-2xl font-bold text-red-400">${(totalDebits / 1000).toFixed(1)}K</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400 mb-1">Commission Earned</p>
              <p className="text-2xl font-bold text-orange-400">${(totalCommission / 100).toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {/* <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Weekly Activity</CardTitle>
            <CardDescription>Credits and debits by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Legend />
                <Bar dataKey="credits" fill="#10b981" />
                <Bar dataKey="debits" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Transactions Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">All Transactions</CardTitle>
            <CardDescription>Complete transaction history for this branch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">Date</th>
                    <th className="text-left py-3 px-4 text-slate-400">UTR ID</th>
                    <th className="text-left py-3 px-4 text-slate-400">Type</th>
                    <th className="text-left py-3 px-4 text-slate-400">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-400">Commission</th>
                    <th className="text-left py-3 px-4 text-slate-400">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-slate-800 hover:bg-slate-800">
                      <td className="py-3 px-4 text-slate-300 text-xs">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs">{txn.utrId}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${txn.type === "credit" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}
                        >
                          {txn.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">${(txn.amount / 1000).toFixed(2)}K</td>
                      <td className="py-3 px-4 text-orange-400">${(txn.commission / 100).toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{txn.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {showModal && <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)} role="staff" />}
    </>
  )
}
