"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"

const DataContext = createContext()

export function DataProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [clients, setClients] = useState([])
  const [branches, setBranches] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(false)

  const autoRefreshIntervalRef = useRef(null)

  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null)

  // Mock data generation
  const generateMockData = useCallback((role, branchId = null) => {
    const today = new Date().toDateString()
    const dayKey = `${role}-${branchId}-${today}`

    const storedData = localStorage.getItem(`dashboard-${dayKey}`)
    if (!storedData) {
      const baseData = {
        totalCredits: Math.floor(Math.random() * 50000),
        totalDebits: Math.floor(Math.random() * 30000),
        commission: Math.floor(Math.random() * 2400),
        walletBalance: Math.floor(Math.random() * 100000),
        transactionCount: Math.floor(Math.random() * 150),
      }
      localStorage.setItem(`dashboard-${dayKey}`, JSON.stringify(baseData))
      return baseData
    }
    return JSON.parse(storedData)
  }, [])

  useEffect(() => {
    const checkDailyReset = () => {
      const lastResetDate = localStorage.getItem("lastResetDate")
      const today = new Date().toDateString()

      if (lastResetDate !== today) {
        // Clear only today's data, keep historical records
        const keys = Object.keys(localStorage)
        keys.forEach((key) => {
          if (key.includes("dashboard-")) {
            localStorage.removeItem(key)
          }
        })
        localStorage.setItem("lastResetDate", today)
      }
    }

    checkDailyReset()
    const interval = setInterval(checkDailyReset, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = useCallback(
    async (role, branchId = null) => {
      setLoading(true)
      // Simulate API call
      await new Promise((r) => setTimeout(r, 300))

      const data = generateMockData(role, branchId)
      setDashboardData(data)
      setLoading(false)
    },
    [generateMockData],
  )

  const fetchTransactions = useCallback(async (role, branchId = null, limit = 20, filters = {}) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 300))

    let mockTransactions = Array.from({ length: limit }).map((_, i) => ({
      id: `txn-${i + 1}`,
      amount: Math.floor(Math.random() * 100000),
      type: Math.random() > 0.5 ? "credit" : "debit",
      utrId: `UTR${Math.random().toString(36).substring(7).toUpperCase()}`,
      remark: `Transaction ${i + 1}`,
      commission: Math.floor(Math.random() * 1000),
      date: new Date(Date.now() - i * 86400000).toISOString(),
      branch: branchId || "N/A",
    }))

    // Apply filters
    if (filters.searchQuery) {
      mockTransactions = mockTransactions.filter(
        (t) =>
          t.utrId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          t.remark.toLowerCase().includes(filters.searchQuery.toLowerCase()),
      )
    }

    if (filters.type && filters.type !== "all") {
      mockTransactions = mockTransactions.filter((t) => t.type === filters.type)
    }

    setTransactions(mockTransactions)
    setLoading(false)
  }, [])

  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 300))

    let mockClients = Array.from({ length: 10 }).map((_, i) => ({
      id: `client-${i + 1}`,
      name: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      phone: `+1-555-${String(i).padStart(4, "0")}`,
      assignedBranch: `branch-${(i % 3) + 1}`,
      status: "active",
      totalTransactions: Math.floor(Math.random() * 500),
    }))

    // Apply filters
    if (filters.searchQuery) {
      mockClients = mockClients.filter(
        (c) =>
          c.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(filters.searchQuery.toLowerCase()),
      )
    }

    setClients(mockClients)
    setLoading(false)
  }, [])

  const fetchBranches = useCallback(async (filters = {}) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 300))

    let mockBranches = [
      {
        id: "branch-1",
        name: "Main Branch",
        location: "New York",
        assignedClient: "client-1",
        totalCredits: Math.random() * 500000,
        totalDebits: Math.random() * 300000,
      },
      {
        id: "branch-2",
        name: "Downtown Branch",
        location: "Los Angeles",
        assignedClient: "client-2",
        totalCredits: Math.random() * 400000,
        totalDebits: Math.random() * 250000,
      },
      {
        id: "branch-3",
        name: "Uptown Branch",
        location: "Chicago",
        assignedClient: "client-3",
        totalCredits: Math.random() * 350000,
        totalDebits: Math.random() * 200000,
      },
    ]

    // Apply filters
    if (filters.searchQuery) {
      mockBranches = mockBranches.filter(
        (b) =>
          b.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          b.location.toLowerCase().includes(filters.searchQuery.toLowerCase()),
      )
    }

    setBranches(mockBranches)
    setLoading(false)
  }, [])

  const addTransaction = useCallback(async (txn) => {
    const newTransaction = {
      id: `txn-${Date.now()}`,
      ...txn,
      date: new Date().toISOString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }, [])

  const startAutoRefresh = useCallback((interval = 5000) => {
    const intervalId = setInterval(() => {
      setDashboardData((prev) => (prev ? { ...prev, updatedAt: new Date().toISOString() } : null))
    }, interval)
    autoRefreshIntervalRef.current = intervalId
    return intervalId
  }, [])

  const stopAutoRefresh = useCallback(() => {
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current)
      autoRefreshIntervalRef.current = null
    }
  }, [])

  return (
    <DataContext.Provider
      value={{
        dashboardData,
        transactions,
        clients,
        branches,
        staff,
        loading,
        fetchDashboardData,
        fetchTransactions,
        fetchClients,
        fetchBranches,
        addTransaction,
        startAutoRefresh,
        stopAutoRefresh,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
