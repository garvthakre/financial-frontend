"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex h-screen bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
