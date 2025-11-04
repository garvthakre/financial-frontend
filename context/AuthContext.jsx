"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateBranch = (branchId) => {
    if (user && user.branches.includes(branchId)) {
      const updated = { ...user, currentBranch: branchId }
      setUser(updated)
      localStorage.setItem("user", JSON.stringify(updated))
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, loading, updateBranch }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
