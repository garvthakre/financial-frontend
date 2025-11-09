"use client"

import { useData } from "@/context/DataContext"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StatCard from "@/components/shared/StatCard"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AdminDashboard({ data, loading }) {
  const { fetchTransactions, transactions } = useData()

  useEffect(() => {
    fetchTransactions("admin")
  }, [fetchTransactions])

  const chartData = Array.from({ length: 7 }).map((_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    credits: Math.floor(Math.random() * 100000),
    debits: Math.floor(Math.random() * 50000),
    commission: Math.floor(Math.random() * 3000),
  }))

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">System-wide financial overview and analytics</p>
      </div> */}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Credits"
          value={data?.totalCredits ? `$${(data.totalCredits / 1000).toFixed(1)}K` : "$0"}
          change="+12.5%"
          icon="📈"
        />
        <StatCard
          title="Total Debits"
          value={data?.totalDebits ? `$${(data.totalDebits / 1000).toFixed(1)}K` : "$0"}
          change="-5.2%"
          icon="📉"
        />
        <StatCard
          title="Commission Earned"
          value={data?.commission ? `$${(data.commission / 1000).toFixed(1)}K` : "$0"}
          change="+8.1%"
          icon="💰"
        />
        <StatCard title="Transactions" value={data?.transactionCount || "0"} change="+3.2%" icon="💳" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">7-Day Trend</CardTitle>
            <CardDescription>Daily credits, debits, and commission</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Legend />
                <Line type="monotone" dataKey="credits" stroke="#3b82f6" />
                <Line type="monotone" dataKey="debits" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Top Branches</CardTitle>
            <CardDescription>Performance ranking by commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-300">Branch {i}</span>
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${100 - i * 15}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <CardDescription>Latest system transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-4 text-slate-400">UTR ID</th>
                  <th className="text-left py-2 px-4 text-slate-400">Type</th>
                  <th className="text-left py-2 px-4 text-slate-400">Amount</th>
                  <th className="text-left py-2 px-4 text-slate-400">Commission</th>
                  <th className="text-left py-2 px-4 text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-800 hover:bg-slate-800">
                    <td className="py-3 px-4 text-slate-300">{txn.utrId}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${txn.type === "credit" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}
                      >
                        {txn.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">${(txn.amount / 1000).toFixed(2)}K</td>
                    <td className="py-3 px-4 text-slate-300">${(txn.commission / 100).toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{new Date(txn.date).toLocaleDateString()}</td>
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
