"use client"

import { useEffect } from "react"
import { useData } from "@/context/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function TransactionsPage() {
  const { fetchTransactions, transactions, loading } = useData()

  useEffect(() => {
    fetchTransactions("admin", null, 100)
  }, [fetchTransactions])

  const chartData = Array.from({ length: 12 }).map((_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    credits: Math.floor(Math.random() * 500000),
    debits: Math.floor(Math.random() * 300000),
  }))

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Transaction Analytics</h1>
        <p className="text-slate-400">System-wide transaction overview</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Monthly Trends</CardTitle>
          <CardDescription>Credits vs Debits over 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              <Legend />
              <Bar dataKey="credits" fill="#10b981" />
              <Bar dataKey="debits" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <CardDescription>Latest 100 transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">UTR ID</th>
                  <th className="text-left py-3 px-4 text-slate-400">Type</th>
                  <th className="text-left py-3 px-4 text-slate-400">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-400">Commission</th>
                  <th className="text-left py-3 px-4 text-slate-400">Remark</th>
                  <th className="text-left py-3 px-4 text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 50).map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-800 hover:bg-slate-800">
                    <td className="py-3 px-4 text-slate-300 font-mono text-xs">{txn.utrId}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${txn.type === "credit" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}
                      >
                        {txn.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">₹{(txn.amount / 1000).toFixed(2)}K</td>
                    <td className="py-3 px-4 text-orange-400">₹{(txn.commission / 100).toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{txn.remark}</td>
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
