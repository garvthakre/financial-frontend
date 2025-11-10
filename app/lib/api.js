// app/lib/api.js - UPDATED with staff assignment endpoints

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiClient {
  constructor() {
    this.baseURL = API_URL
  }

  getHeaders() {
    if (typeof window === 'undefined') {
      return {
        'Content-Type': 'application/json'
      }
    }

    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    }

    try {
      console.log('API Request:', { method: config.method || 'GET', url, body: config.body })
      const response = await fetch(url, config)
      const data = await response.json()

      console.log('API Response:', { status: response.status, data })

      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
        }
        throw new Error(data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token)
        const userData = { ...response.data }
        delete userData.token
        localStorage.setItem('user', JSON.stringify(userData))
      }
    }
    
    return response
  }

  // Staff endpoints
  async getStaff() {
    return this.request('/admin/staff')
  }

  async createStaff(staffData) {
    return this.request('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    })
  }

  async assignStaffToBranches(staffId, branchIds) {
    return this.request(`/admin/staff/${staffId}/assign-branches`, {
      method: 'POST',
      body: JSON.stringify({ branchIds })
    })
  }

  async removeStaffFromBranch(staffId, branchId) {
    return this.request(`/admin/staff/${staffId}/remove-branch/${branchId}`, {
      method: 'DELETE'
    })
  }

  async getUnassignedStaff() {
    return this.request('/admin/staff/unassigned')
  }

  async getBranchStaff(branchId) {
    return this.request(`/admin/branches/${branchId}/staff`)
  }

  // Branch endpoints
  async getBranches() {
    return this.request('/admin/branches')
  }

  async createBranch(branchData) {
    return this.request('/admin/branches', {
      method: 'POST',
      body: JSON.stringify(branchData)
    })
  }

  // Client endpoints
  async getClients() {
    return this.request('/admin/clients')
  }

  async createClient(clientData) {
    return this.request('/admin/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    })
  }

  // Transaction endpoints
  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    })
  }

  async getTransaction(id) {
    return this.request(`/transactions/${id}`)
  }

  // Dashboard endpoints
  async getAdminDashboard(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/admin/dashboard${query ? `?${query}` : ''}`)
  }

  async getClientDashboard() {
    return this.request('/client/dashboard')
  }

  async getStaffDashboard(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/staff/dashboard${query ? `?${query}` : ''}`)
  }

  // Transaction lists
  async getAdminTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/admin/transactions${query ? `?${query}` : ''}`)
  }

  async getClientTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/client/transactions${query ? `?${query}` : ''}`)
  }

  async getStaffTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/staff/transactions${query ? `?${query}` : ''}`)
  }

  // Settings
  async getSettings() {
    return this.request('/admin/settings')
  }
  // Add these methods to app/lib/api.js

  // Delete methods
  async deleteClient(clientId) {
    return this.request(`/admin/clients/${clientId}`, {
      method: 'DELETE'
    })
  }

  async deleteBranch(branchId) {
    return this.request(`/admin/branches/${branchId}`, {
      method: 'DELETE'
    })
  }

  async deleteStaff(staffId) {
    return this.request(`/admin/staff/${staffId}`, {
      method: 'DELETE'
    })
  }

  async deleteTransaction(transactionId) {
    return this.request(`/transactions/${transactionId}`, {
      method: 'DELETE'
    })
  }

  async deleteStaffTransaction(transactionId) {
    return this.request(`/staff/transactions/${transactionId}`, {
      method: 'DELETE'
    })
  }

  async updateSettings(settingsData) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
  }
}
 

// Staff Routes - Add this route to server/src/routes/staffRoutes.js

 
const api = new ApiClient()
export default api