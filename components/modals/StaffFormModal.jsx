"use client"

import { useState, useEffect } from "react"
import { useData } from "@/context/DataContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function StaffFormModal({ isOpen, onClose, onSubmit }) {
  const { clients, branches, fetchClients, fetchBranches } = useData()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    branches: [],
    clientId: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      if (clients.length === 0) fetchClients()
      if (branches.length === 0) fetchBranches()
    }
  }, [isOpen, clients.length, branches.length, fetchClients, fetchBranches])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Handle phone number - only digits, max 10
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10)
      setFormData((prev) => ({ ...prev, [name]: phoneValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    setError("")
  }

  const handleBranchSelect = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value)
    setFormData((prev) => ({ ...prev, branches: options }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate phone number
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    // Validate password
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // Validate branches
    if (formData.branches.length === 0) {
      setError("Please select at least one branch")
      return
    }

    // Validate client
    if (!formData.clientId) {
      setError("Please select a client")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      await onSubmit?.(formData)
      // Reset form
      setFormData({
        name: "",
        phone: "",
        password: "",
        branches: [],
        clientId: "",
      })
    } catch (err) {
      setError(err.message || "Failed to create staff member")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Add New Staff Member</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength="10"
                pattern="[0-9]{10}"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Enter 10-digit phone number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength={6}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Assign Client *</label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} ({client.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Assign Branches *</label>
              <select
                name="branches"
                multiple
                value={formData.branches}
                onChange={handleBranchSelect}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                required
              >
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Hold Ctrl (Cmd on Mac) to select multiple branches
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                onClick={onClose} 
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Creating..." : "Add Staff"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}