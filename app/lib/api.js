// app/lib/api.js - Fixed version with proper token handling

// API base URL - update this to your backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiClient {
  constructor() {
    this.baseURL = API_URL
  }

  getHeaders() {
    // Check if window is defined (client-side only)
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
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Handle unauthorized errors
        if (response.status === 401) {
          // Clear invalid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // Redirect to login
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
    
    // Store token and user data on successful login
    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token)
        const userData = { ...response.data }
        delete userData.token // Don't store token twice
        localStorage.setItem('user', JSON.stringify(userData))
      }
    }
    
    return response
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  // Admin endpoints
  async getAdminDashboard(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/admin/dashboard${query ? `?${query}` : ''}`)
  }

  async getClients() {
    return this.request('/admin/clients')
  }

  async createClient(clientData) {
    return this.request('/admin/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    })
  }

  async getBranches() {
    return this.request('/admin/branches')
  }

  async createBranch(branchData) {
    return this.request('/admin/branches', {
      method: 'POST',
      body: JSON.stringify(branchData)
    })
  }

  async getStaff() {
    return this.request('/admin/staff')
  }

  async createStaff(staffData) {
    return this.request('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    })
  }

  async getAdminTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/admin/transactions${query ? `?${query}` : ''}`)
  }

  // Client endpoints
  async getClientDashboard() {
    return this.request('/client/dashboard')
  }

  async getClientTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/client/transactions${query ? `?${query}` : ''}`)
  }

  async getClientBranches() {
    return this.request('/client/branches')
  }

  // Staff endpoints
  async getStaffDashboard(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/staff/dashboard${query ? `?${query}` : ''}`)
  }

  async getStaffTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/staff/transactions${query ? `?${query}` : ''}`)
  }

  async getStaffBranches() {
    return this.request('/staff/branches')
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

  // Settings endpoints
  async getSettings() {
    return this.request('/admin/settings')
  }

  async updateSettings(settingsData) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
  }
}

const api = new ApiClient()
export default api