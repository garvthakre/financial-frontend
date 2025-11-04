"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ClientSidebar from "@/components/client/ClientSidebar"

export default function ClientLayout({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "client") {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex h-screen bg-slate-950">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
