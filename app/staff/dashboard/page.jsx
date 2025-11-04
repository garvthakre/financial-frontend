"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import StaffDashboard from "@/components/staff/StaffDashboard"
import TransactionModal from "@/components/modals/TransactionModal"

export default function StaffDashboardPage() {
  const { fetchDashboardData, dashboardData, loading } = useData()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (user) {
      fetchDashboardData("staff", user.currentBranch)
    }
  }, [user, fetchDashboardData])

  return (
    <>
      <StaffDashboard data={dashboardData} loading={loading} onAddTransaction={() => setShowModal(true)} />
      {showModal && <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)} role="staff" />}
    </>
  )
}
