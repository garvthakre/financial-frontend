"use client"

import { createContext, useContext, useState, useCallback, useRef } from "react"
import api from "@/app/lib/api"

const DataContext = createContext()

export function DataProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [clients, setClients] = useState([])
  const [branches, setBranches] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(false)

  const autoRefreshIntervalRef = useRef(null)

  const fetchDashboardData = useCallback(async (role, branchId = null) => {
    setLoading(true)
    try {
      let response
      if (role === 'admin') {
        response = await api.getAdminDashboard(branchId ? { branchId } : {})
      } else if (role === 'client') {
        response = await api.getClientDashboard()
      } else if (role === 'staff') {
        response = await api.getStaffDashboard(branchId ? { branchId } : {})
      }
      
      if (response?.success) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setDashboardData({
        totalCredits: 0,
        totalDebits: 0,
        commission: 0,
        walletBalance: 0,
        transactionCount: 0
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTransactions = useCallback(async (role, branchId = null, limit = 20, filters = {}) => {
    setLoading(true)
    try {
      let response
      const params = { limit, ...filters }
      if (branchId) params.branchId = branchId

      if (role === 'admin') {
        response = await api.getAdminTransactions(params)
      } else if (role === 'client') {
        response = await api.getClientTransactions(params)
      } else if (role === 'staff') {
        response = await api.getStaffTransactions(params)
      }

      if (response?.success) {
        // Transform backend data to match frontend expectations
        const txnData = response.data.docs || response.data || []
        const transformedData = txnData.map(txn => ({
          id: txn._id,
          utrId: txn.utrId,
          type: txn.type,
          amount: txn.amount,
          commission: txn.commission,
          finalAmount: txn.finalAmount,
          remark: txn.remark || '',
          date: txn.createdAt,
          balanceBefore: txn.balanceBefore,
          balanceAfter: txn.balanceAfter,
          status: txn.status,
          client: txn.client,
          staff: txn.staff,
          branch: txn.branch
        }))
        setTransactions(transformedData)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true)
    try {
      const response = await api.getClients()
      if (response?.success) {
        setClients(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchBranches = useCallback(async (filters = {}) => {
    setLoading(true)
    try {
      const response = await api.getBranches()
      if (response?.success) {
        setBranches(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error)
      setBranches([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.getStaff()
      if (response?.success) {
        setStaff(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error)
      setStaff([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addClient = useCallback(async (clientData) => {
    try {
      const response = await api.createClient(clientData)
      if (response?.success) {
        await fetchClients()
        return { success: true }
      }
      return { success: false, message: response?.message || 'Failed to create client' }
    } catch (error) {
      console.error('Failed to add client:', error)
      return { success: false, message: error.message || 'Failed to create client' }
    }
  }, [fetchClients])

  const addBranch = useCallback(async (branchData) => {
    try {
      const response = await api.createBranch(branchData)
      if (response?.success) {
        await fetchBranches()
        return { success: true }
      }
      return { success: false, message: response?.message || 'Failed to create branch' }
    } catch (error) {
      console.error('Failed to add branch:', error)
      return { success: false, message: error.message || 'Failed to create branch' }
    }
  }, [fetchBranches])

  const addStaff = useCallback(async (staffData) => {
    try {
      const response = await api.createStaff(staffData)
      if (response?.success) {
        await fetchStaff()
        return { success: true }
      }
      return { success: false, message: response?.message || 'Failed to create staff' }
    } catch (error) {
      console.error('Failed to add staff:', error)
      return { success: false, message: error.message || 'Failed to create staff' }
    }
  }, [fetchStaff])

  const addTransaction = useCallback(async (txnData) => {
    try {
      const response = await api.createTransaction(txnData)
      if (response?.success) {
        return { success: true, data: response.data }
      }
      return { success: false, message: response?.message || 'Failed to create transaction' }
    } catch (error) {
      console.error('Failed to add transaction:', error)
      return { success: false, message: error.message || 'Failed to create transaction' }
    }
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
        fetchStaff,
        addClient,
        addBranch,
        addStaff,
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