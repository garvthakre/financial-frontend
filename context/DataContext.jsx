// context/DataContext.jsx - UPDATED WITH STAFF ASSIGNMENT
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
      
      console.log('Dashboard API Response:', response)
      
      if (response?.success) {
        const data = response.data || {
          totalCredits: 0,
          totalDebits: 0,
          commission: 0,
          walletBalance: 0,
          transactionCount: 0
        }
        console.log('Setting dashboard data:', data)
        setDashboardData(data)
      } else {
        console.error('Dashboard fetch failed:', response)
        setDashboardData({
          totalCredits: 0,
          totalDebits: 0,
          commission: 0,
          walletBalance: 0,
          transactionCount: 0
        })
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

      console.log('Fetching transactions:', { role, branchId, params })

      if (role === 'admin') {
        response = await api.getAdminTransactions(params)
      } else if (role === 'client') {
        response = await api.getClientTransactions(params)
      } else if (role === 'staff') {
        response = await api.getStaffTransactions(params)
      }

      console.log('Transactions API Response:', response)

      if (response?.success) {
        const txnData = response.data?.docs || response.data || []
        console.log('Raw transaction data:', txnData)
        
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
        
        console.log('Transformed transactions:', transformedData)
        setTransactions(transformedData)
      } else {
        console.error('Transaction fetch failed:', response)
        setTransactions([])
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
      console.log('Branches fetched:', response)
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
      console.log('Fetching staff...')
      const response = await api.getStaff()
      console.log('Staff fetched:', response)
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
      console.log('Creating staff with data:', staffData)
      const response = await api.createStaff({
        name: staffData.name,
        phone: staffData.phone,
        password: staffData.password
      })
      console.log('Staff creation response:', response)
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

  const assignStaffToBranches = useCallback(async (staffId, branchIds) => {
    try {
      console.log('Assigning staff to branches:', { staffId, branchIds })
      const response = await api.assignStaffToBranches(staffId, branchIds)
      console.log('Assignment response:', response)
      
      if (response?.success) {
        await fetchStaff() // Refresh staff list to show updated assignments
        return { success: true }
      }
      return { success: false, message: response?.message || 'Failed to assign branches' }
    } catch (error) {
      console.error('Failed to assign branches:', error)
      return { success: false, message: error.message || 'Failed to assign branches' }
    }
  }, [fetchStaff])

  const removeStaffFromBranch = useCallback(async (staffId, branchId) => {
    try {
      const response = await api.removeStaffFromBranch(staffId, branchId)
      if (response?.success) {
        await fetchStaff()
        return { success: true }
      }
      return { success: false, message: response?.message || 'Failed to remove staff from branch' }
    } catch (error) {
      console.error('Failed to remove staff from branch:', error)
      return { success: false, message: error.message || 'Failed to remove staff from branch' }
    }
  }, [fetchStaff])
  // Add these methods to context/DataContext.jsx

  const deleteClient = useCallback(async (clientId) => {
    try {
      const response = await api.deleteClient(clientId)
      if (response?.success) {
        await fetchClients()
        return { success: true }
      }
      return { success: false, message: response?.message || 'Failed to delete client' }
    } catch (error) {
      console.error('Failed to delete client:', error)
      return { success: false, message: error.message || 'Failed to delete client' }
    }
  }, [fetchClients])

  const deleteBranch = useCallback(async (branchId) => {
    try {
      const response = await api.deleteBranch(branchId)
      if (response?.success) {
        await fetchBranches()
        return { success: true }
      }
      return { success: false, message: response?.message || 'Failed to delete branch' }
    } catch (error) {
      console.error('Failed to delete branch:', error)
      return { success: false, message: error.message || 'Failed to delete branch' }
    }
  }, [fetchBranches])

  const deleteStaff = useCallback(async (staffId) => {
    try {
      const response = await api.deleteStaff(staffId)
      if (response?.success) {
        await fetchStaff()
        return { success: true }
      }
      return { success: false, message: response?.message || 'Failed to delete staff' }
    } catch (error) {
      console.error('Failed to delete staff:', error)
      return { success: false, message: error.message || 'Failed to delete staff' }
    }
  }, [fetchStaff])

  const deleteTransaction = useCallback(async (transactionId, role = 'admin') => {
    try {
      const response = role === 'staff' 
        ? await api.deleteStaffTransaction(transactionId)
        : await api.deleteTransaction(transactionId)
        
      if (response?.success) {
        return { success: true, data: response.data }
      }
      return { success: false, message: response?.message || 'Failed to delete transaction' }
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      return { success: false, message: error.message || 'Failed to delete transaction' }
    }
  }, [])

// Add these to the DataContext.Provider value:
// deleteClient, deleteBranch, deleteStaff, deleteTransaction
  const addTransaction = useCallback(async (txnData) => {
    try {
      console.log('Creating transaction with data:', txnData)
      const response = await api.createTransaction(txnData)
      console.log('Transaction creation response:', response)
      
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
        deleteClient, deleteBranch, deleteStaff, deleteTransaction,
        assignStaffToBranches,
        removeStaffFromBranch,
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