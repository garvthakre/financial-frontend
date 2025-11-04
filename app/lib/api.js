// API base URL - update this to your backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiClient {
  constructor() {
    this.baseURL = API_URL
  }

  getHeaders() {
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
        throw new Error(data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  // Admin endpoints
  getAdminDashboard(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/admin/dashboard${query ? `?${query}` : ''}`)
  }

  getClients() {
    return this.request('/admin/clients')
  }

  createClient(clientData) {
    return this.request('/admin/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    })
  }

  getBranches() {
    return this.request('/admin/branches')
  }

  createBranch(branchData) {
    return this.request('/admin/branches', {
      method: 'POST',
      body: JSON.stringify(branchData)
    })
  }

  getStaff() {
    return this.request('/admin/staff')
  }

  createStaff(staffData) {
    return this.request('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    })
  }

  getAdminTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/admin/transactions${query ? `?${query}` : ''}`)
  }

  // Client endpoints
  getClientDashboard() {
    return this.request('/client/dashboard')
  }

  getClientTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/client/transactions${query ? `?${query}` : ''}`)
  }

  getClientBranches() {
    return this.request('/client/branches')
  }

  // Staff endpoints
  getStaffDashboard(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/staff/dashboard${query ? `?${query}` : ''}`)
  }

  getStaffTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/staff/transactions${query ? `?${query}` : ''}`)
  }

  getStaffBranches() {
    return this.request('/staff/branches')
  }

  // Transaction endpoints
  createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    })
  }

  getTransaction(id) {
    return this.request(`/transactions/${id}`)
  }

  // Settings endpoints
  getSettings() {
    return this.request('/admin/settings')
  }

  updateSettings(settingsData) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
  }
}

const api = new ApiClient()
export default api