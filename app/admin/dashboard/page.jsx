"use client"

import { useEffect } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import AdminDashboard from "@/components/admin/AdminDashboard"

export default function AdminDashboardPage() {
  const { fetchDashboardData, dashboardData, loading } = useData()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchDashboardData("admin")
    }
  }, [user, fetchDashboardData])

  return <AdminDashboard data={dashboardData} loading={loading} />
}
