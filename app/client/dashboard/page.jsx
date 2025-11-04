"use client"

import { useEffect } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import ClientDashboard from "@/components/client/ClientDashboard"

export default function ClientDashboardPage() {
  const { fetchDashboardData, dashboardData, loading } = useData()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchDashboardData("client")
    }
  }, [user, fetchDashboardData])

  return <ClientDashboard data={dashboardData} loading={loading} />
}
