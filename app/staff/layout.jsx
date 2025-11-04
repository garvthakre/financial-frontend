"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import StaffSidebar from "@/components/staff/StaffSidebar"

export default function StaffLayout({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "staff") {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex h-screen bg-slate-950">
      <StaffSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
