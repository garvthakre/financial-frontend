"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "@/app/lib/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        console.log("Restored user from storage:", userData)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials)
      
      if (response.success && response.data) {
        const branches = response.data.branches || []
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          phone: response.data.phone,
          role: response.data.role,
          walletBalance: response.data.walletBalance,
          branches: branches,
          clientId: response.data.clientId || null,
          // Set first branch as current branch by default
          currentBranch: branches.length > 0 ? branches[0] : null
        }
        
        console.log("Login successful, user data:", userData)
        setUser(userData)
        return { success: true }
      }
      
      return { success: false, message: response.message || 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const updateBranch = (branchId) => {
    if (user && user.branches && user.branches.includes(branchId)) {
      const updated = { ...user, currentBranch: branchId }
      setUser(updated)
      localStorage.setItem("user", JSON.stringify(updated))
    }
  }

  // Mock login for demo purposes - remove this in production
  const mockLogin = (mockUser) => {
    // This is only for demo purposes when backend is not available
    const userData = {
      _id: mockUser.id,
      name: mockUser.name,
      phone: mockUser.phone,
      role: mockUser.role,
      walletBalance: 50000,
      branches: mockUser.branches || [],
      clientId: mockUser.clientId || null,
      currentBranch: mockUser.currentBranch || null
    }
    
    console.log("Mock login with data:", userData)
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", "mock-token")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateBranch, mockLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}