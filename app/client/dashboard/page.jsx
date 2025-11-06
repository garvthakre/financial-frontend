"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Activity } from "lucide-react"

// Mock hook - replace with your actual hook
const useData = () => ({
  fetchDashboardData: () => {},
  dashboardData: {
    walletBalance: 45000,
    totalCredits: 32000,
    totalDebits: 18000,
    commission: 2400
  },
  loading: false,
  startAutoRefresh: () => {},
  stopAutoRefresh: () => {}
})

const useAuth = () => ({
  user: { name: "John Doe" }
})

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
  }, [user])

  const stats = [
    {
      title: "Wallet Balance",
      value: dashboardData?.walletBalance ? `$${(dashboardData.walletBalance / 1000).toFixed(1)}K` : "$0",
      rawValue: dashboardData?.walletBalance || 0,
      trend: "+5.2%",
      trendUp: true,
      icon: Wallet,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/10",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400"
    },
    {
      title: "Today's Credits",
      value: dashboardData?.totalCredits ? `$${(dashboardData.totalCredits / 1000).toFixed(1)}K` : "$0",
      rawValue: dashboardData?.totalCredits || 0,
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
      value: dashboardData?.totalDebits ? `$${(dashboardData.totalDebits / 1000).toFixed(1)}K` : "$0",
      rawValue: dashboardData?.totalDebits || 0,
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
      value: dashboardData?.commission ? `$${(dashboardData.commission / 1000).toFixed(1)}K` : "$0",
      rawValue: dashboardData?.commission || 0,
      trend: "+2.1%",
      trendUp: true,
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-600/10",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400"
    },
  ]

  const netFlow = (dashboardData?.totalCredits || 0) - (dashboardData?.totalDebits || 0)
  const netFlowPercentage = dashboardData?.totalCredits 
    ? ((netFlow / dashboardData.totalCredits) * 100).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            My Wallet
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm text-slate-400">Live</span>
          </div>
        </div>
        <p className="text-slate-400 text-lg">Monitor your daily transactions and balance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/50 hover:-translate-y-1"
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative p-6">
                {/* Icon */}
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

                {/* Content */}
                <div className="space-y-1">
                  <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.min((stat.rawValue / 50000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          )
        })}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Net Flow Card */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-6 hover:border-slate-600/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Net Cash Flow</h3>
              <p className="text-sm text-slate-400">Today's financial summary</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Net Position</p>
                <p className={`text-4xl font-bold ${netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netFlow >= 0 ? '+' : ''}{(netFlow / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Flow Rate</p>
                <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netFlow >= 0 ? '+' : ''}{netFlowPercentage}%
                </p>
              </div>
            </div>

            {/* Flow Visualization */}
            <div className="relative h-16 bg-slate-700/30 rounded-xl overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${(dashboardData?.totalCredits / (dashboardData?.totalCredits + dashboardData?.totalDebits)) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
              <div 
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-rose-500 to-pink-500"
                style={{ width: `${(dashboardData?.totalDebits / (dashboardData?.totalCredits + dashboardData?.totalDebits)) * 100}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white font-bold text-sm drop-shadow-lg">
                  Credits vs Debits
                </p>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-400">Credits: {(dashboardData?.totalCredits / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-slate-400">Debits: {(dashboardData?.totalDebits / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-6 hover:border-slate-600/50 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Avg. Transaction</span>
                <span className="text-lg font-bold text-white">$2.4K</span>
              </div>
              <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Total Transactions</span>
                <span className="text-lg font-bold text-white">156</span>
              </div>
              <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Success Rate</span>
                <span className="text-lg font-bold text-emerald-400">98.5%</span>
              </div>
              <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full w-[98.5%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 backdrop-blur-xl p-4">
        <p className="text-sm text-slate-400 text-center">
          Last updated: {new Date().toLocaleTimeString()} • Auto-refresh enabled
        </p>
      </div>
    </div>
  )
}