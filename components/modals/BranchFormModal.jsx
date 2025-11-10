"use client"

import { useState, useEffect } from "react"
import { useData } from "@/context/DataContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BranchFormModal({ isOpen, onClose, onSubmit }) {
  const { clients, fetchClients } = useData()
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    clientId: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen && clients.length === 0) {
      fetchClients()
    }
  }, [isOpen, clients.length, fetchClients])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      await onSubmit?.(formData)
      setFormData({ name: "", code: "", address: "", clientId: "" })
    } catch (err) {
      setError(err.message || "Failed to create branch")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Add New Branch</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Branch Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Main Office"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Branch Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="MAIN01"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                required
              />
              {/* <p className="text-xs text-slate-400 mt-1">Unique code (will be converted to uppercase)</p> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
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
                {loading ? "Creating..." : "Add Branch"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}