"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StatCard from "@/components/shared/StatCard"
import { useData } from "@/context/DataContext"
import { useEffect } from "react"

export default function ClientDashboard({ data, loading }) {
  const { fetchTransactions, transactions } = useData()

  useEffect(() => {
    fetchTransactions("client")
  }, [fetchTransactions])

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
        <p className="text-slate-400">Monitor your daily transactions and balance</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Wallet Balance"
          value={data?.walletBalance ? `$${(data.walletBalance / 1000).toFixed(1)}K` : "$0"}
          change="+5.2%"
          icon="💰"
        />
        <StatCard
          title="Today's Credits"
          value={data?.totalCredits ? `$${(data.totalCredits / 1000).toFixed(1)}K` : "$0"}
          change="+8.1%"
          icon="📈"
        />
        <StatCard
          title="Today's Debits"
          value={data?.totalDebits ? `$${(data.totalDebits / 1000).toFixed(1)}K` : "$0"}
          change="-3.2%"
          icon="📉"
        />
        <StatCard
          title="Total Commission Paid"
          value={data?.commission ? `$${(data.commission / 1000).toFixed(1)}K` : "$0"}
          change="+2.1%"
          icon="📋"
        />
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-4 text-slate-400">Date</th>
                  <th className="text-left py-2 px-4 text-slate-400">Type</th>
                  <th className="text-left py-2 px-4 text-slate-400">Amount</th>
                  <th className="text-left py-2 px-4 text-slate-400">Commission</th>
                  <th className="text-left py-2 px-4 text-slate-400">UTR ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-800 hover:bg-slate-800">
                    <td className="py-3 px-4 text-slate-300">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${txn.type === "credit" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}
                      >
                        {txn.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">${(txn.amount / 1000).toFixed(2)}K</td>
                    <td className="py-3 px-4 text-orange-400">-${(txn.commission / 100).toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs font-mono">{txn.utrId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
