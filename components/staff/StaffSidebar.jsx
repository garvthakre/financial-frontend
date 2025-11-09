"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function StaffSidebar() {
  const router = useRouter()
  const { logout, user, updateBranch } = useAuth()
  const [expandBranches, setExpandBranches] = useState(true)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleBranchClick = (branchId) => {
    console.log("Switching to branch:", branchId)
    updateBranch(branchId)
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">Staff Panel</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        <Link
          href="/staff/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition"
        >
          <span className="text-lg">📊</span>
          <span>Dashboard</span>
        </Link>

        {/* Branch Switcher */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => setExpandBranches(!expandBranches)}
            className="flex items-center justify-between w-full px-4 py-2 text-slate-400 hover:text-slate-200 transition"
          >
            <span className="text-sm font-semibold">🏢 Branches</span>
            <span>{expandBranches ? "▼" : "▶"}</span>
          </button>

          {expandBranches && user?.branches && user.branches.length > 0 && (
            <div className="mt-2 space-y-1">
              {user.branches.map((branchId) => (
                <button
                  key={branchId}
                  onClick={() => handleBranchClick(branchId)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                    user.currentBranch === branchId 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {branchId}
                </button>
              ))}
            </div>
          )}
          
          {(!user?.branches || user.branches.length === 0) && expandBranches && (
            <div className="mt-2 px-4 py-2 text-xs text-slate-500">
              No branches assigned
            </div>
          )}
        </div>
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