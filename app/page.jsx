"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const dashboardRoutes = {
        admin: "/admin/dashboard",
        staff: "/staff/dashboard",
        client: "/client/dashboard",
      }
      router.push(dashboardRoutes[user.role] || "/login")
    } else {
      router.push("/login")
    }
  }, [user, router])

  return <div className="flex items-center justify-center min-h-screen">Loading...</div>
}
