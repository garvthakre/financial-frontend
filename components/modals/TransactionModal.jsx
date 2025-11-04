"use client"

import { useState, useEffect } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"

export default function TransactionModal({ isOpen, onClose, role }) {
  const { clients, branches, fetchClients, fetchBranches, addTransaction } = useData()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState({
    clientId: "",
    branchId: "",
    type: "credit",
    amount: "",
    utrId: "",
    remark: "",
  })

  useEffect(() => {
    if (isOpen) {
      if (clients.length === 0) fetchClients()
      if (branches.length === 0) fetchBranches()
    }
  }, [isOpen, clients.length, branches.length, fetchClients, fetchBranches])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      })

      if (result.success) {
        setSuccess("Transaction created successfully!")
        setTimeout(() => {
          onClose()
          // Reset form
          setFormData({
            clientId: "",
            branchId: "",
            type: "credit",
            amount: "",
            utrId: "",
            remark: "",
          })
          setSuccess("")
        }, 1500)
      } else {
        setError(result.message || "Failed to create transaction")
      }
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Filter branches based on staff's assigned branches
  const availableBranches = user && user.branches
    ? branches.filter((b) => user.branches.includes(b._id))
    : branches

  // Calculate commission preview
  const calculatePreview = () => {
    const amount = parseFloat(formData.amount) || 0
    const commission = (amount * 3) / 100

    if (formData.type === "credit") {
      return {
        commission,
        finalAmount: amount - commission,
        display: `Client receives: ₹${(amount - commission).toFixed(2)} (₹${amount} - ₹${commission.toFixed(2)} fee)`
      }
    } else {
      return {
        commission,
        finalAmount: amount + commission,
        display: `Client pays: ₹${(amount + commission).toFixed(2)} (₹${amount} + ₹${commission.toFixed(2)} commission)`
      }
    }
  }

  const preview = calculatePreview()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700 my-8">
        <h2 className="text-2xl font-bold text-white mb-4">New Transaction</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Client *
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose client...</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name} - Balance: ₹{client.walletBalance?.toLocaleString() || 0}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Branch *
            </label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose branch...</option>
              {availableBranches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Transaction Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: "credit" }))}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  formData.type === "credit"
                    ? "bg-green-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Credit (Deposit)
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: "debit" }))}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  formData.type === "debit"
                    ? "bg-red-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Debit (Withdrawal)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount (₹) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
            {formData.amount && (
              <div className="mt-2 p-2 bg-slate-700 rounded text-xs text-slate-300">
                {preview.display}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              UTR ID *
            </label>
            <input
              type="text"
              name="utrId"
              value={formData.utrId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unique Transaction Reference"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Remark (Optional)
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Create Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}