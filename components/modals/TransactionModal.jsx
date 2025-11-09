"use client"

import { useState, useEffect } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"

export default function TransactionModal({ isOpen, onClose, role }) {
  const { clients, branches, fetchClients, fetchBranches, addTransaction, fetchDashboardData, fetchTransactions } = useData()
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

  // Initialize form data with user's client and current branch
  useEffect(() => {
    if (isOpen && user) {
      const clientId = user.clientId?._id || user.clientId || ""
      const branchId = user.currentBranch || user.branches?.[0] || ""
      
      setFormData(prev => ({
        ...prev,
        clientId,
        branchId
      }))
    }
  }, [isOpen, user, user?.currentBranch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.clientId) {
      setError("Client information is missing. Please contact administrator.")
      return
    }
    
    if (!formData.branchId) {
      setError("Branch information is missing. Please select a branch or contact administrator.")
      return
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount greater than 0")
      return
    }
    
    if (!formData.utrId || formData.utrId.trim() === "") {
      setError("UTR ID is required")
      return
    }
    
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
        
        // **FIX: Refresh dashboard and transactions**
        if (role === 'staff') {
       // Now uses Promise.all for parallel data fetching
await Promise.all([
  fetchDashboardData("staff", user.currentBranch),
  fetchTransactions("staff", user.currentBranch, 50)
])
        } else if (role === 'admin') {
          await fetchDashboardData("admin")
          await fetchTransactions("admin", null, 100)
        }
        
        setTimeout(() => {
          onClose()
          // Reset form
          setFormData({
            clientId: user?.clientId?._id || user?.clientId || "",
            branchId: user?.branches?.[0]?._id || user?.branches?.[0] || "",
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
      console.error("Transaction error:", err)
      setError(err.message || "An error occurred while processing the transaction")
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
        display: `Client receives: ₹${(amount - commission).toFixed(2)} (₹${amount.toFixed(2)} - ₹${commission.toFixed(2)} fee)`
      }
    } else {
      return {
        commission,
        finalAmount: amount + commission,
        display: `Client pays: ₹${(amount + commission).toFixed(2)} (₹${amount.toFixed(2)} + ₹${commission.toFixed(2)} commission)`
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
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-blue-900/30 border border-blue-700 rounded text-xs text-blue-200">
            <div>Client ID: {formData.clientId || 'Not set ⚠️'}</div>
            <div>Branch ID: {formData.branchId || 'Not set ⚠️'}</div>
            <div>Staff ID: {user?._id || 'Not set ⚠️'}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Show client and branch selection if not auto-populated */}
          {(!formData.clientId || !formData.branchId) && (
            <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-200 text-sm">
              ⚠️ Please select client and branch
            </div>
          )}
          
          {/* Optional: Show client/branch selector for staff with multiple assignments */}
          {availableBranches.length > 1 && (
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
          )}

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
              disabled={loading || !formData.clientId || !formData.branchId}
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