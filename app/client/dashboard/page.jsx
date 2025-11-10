// app/client/dashboard/page.jsx - UPDATED: Removed wallet balance
"use client"

import { useEffect, useRef } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"

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
  }, [user, fetchDashboardData, startAutoRefresh, stopAutoRefresh])

  const data = dashboardData || {
    totalCredits: 0,
    totalDebits: 0,
    commission: 0
  }

  // CHANGED: Removed wallet balance card
  const stats = [
    {
      title: "Today's Credits",
      value: data.totalCredits ? `₹${(data.totalCredits / 1000).toFixed(1)}K` : "₹0",
      rawValue: data.totalCredits || 0,
      trend: "+8.1%",
      trendUp: true,
      icon: ArrowUpRight,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-600/10",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Today's Debits",
      value: data.totalDebits ? `₹${(data.totalDebits / 1000).toFixed(1)}K` : "₹0",
      rawValue: data.totalDebits || 0,
      trend: "-3.2%",
      trendUp: false,
      icon: ArrowDownRight,
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-500/10 to-pink-600/10",
      iconBg: "bg-rose-500/20",
      iconColor: "text-rose-400"
    },
    {
      title: "Total Commission",
      value: data.commission ? `₹${(data.commission / 1000).toFixed(1)}K` : "₹0",
      rawValue: data.commission || 0,
      trend: "+2.1%",
      trendUp: true,
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-600/10",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400"
    },
  ]

  const netFlow = (data.totalCredits || 0) - (data.totalDebits || 0)
  const netFlowPercentage = data.totalCredits 
    ? ((netFlow / data.totalCredits) * 100).toFixed(1)
    : 0

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm text-slate-400">Live</span>
          </div>
        </div>
        <p className="text-slate-400 text-lg">Monitor your daily transactions</p>
      </div>

      {/* Stats Grid - CHANGED: Now 3 cards instead of 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/50 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg} backdrop-blur-sm`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>

                <div className="mt-4 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.min((stat.rawValue / 50000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          )
        })}
      </div>

      {/* Rest of the dashboard remains the same... */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 backdrop-blur-xl p-4">
        <p className="text-sm text-slate-400 text-center">
          Last updated: {new Date().toLocaleTimeString()} • Auto-refresh enabled
        </p>
      </div>
    </div>
  )
}