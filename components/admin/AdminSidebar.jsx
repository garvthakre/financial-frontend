"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function AdminSidebar() {
  const router = useRouter()
  const { logout } = useAuth()

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Clients", href: "/admin/clients", icon: "👥" },
    { label: "Branches", href: "/admin/branches", icon: "🏢" },
    { label: "Staff", href: "/admin/staff", icon: "👔" },
    { label: "Transactions", href: "/admin/transactions", icon: "💳" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
