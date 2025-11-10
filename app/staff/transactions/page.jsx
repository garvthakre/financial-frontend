// app/admin/transactions/page.jsx - WITH DELETE FUNCTIONALITY
"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TransactionModal from "@/components/modals/TransactionModal"

export default function StaffTransactionsPage() {
  const { fetchTransactions, transactions, loading, deleteTransaction } = useData()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const branchId = searchParams.get('branchId')

  useEffect(() => {
    if (user) {
      fetchTransactions("staff", branchId, 50)
    }
  }, [user, branchId, fetchTransactions])

  const handleDelete = async (transactionId) => {
    if (!confirm('Are you sure you want to delete this transaction? This will reverse the balance change.')) {
      return
    }

    setDeletingId(transactionId)
    setError("")
    setSuccess("")

    const result = await deleteTransaction(transactionId, 'staff')

    if (result.success) {
      setSuccess("Transaction deleted successfully! Balance has been reversed.")
      await fetchTransactions("staff", branchId, 50)
      setTimeout(() => setSuccess(""), 3000)
    } else {
      setError(result.message || "Failed to delete transaction")
    }

    setDeletingId(null)
  }

  const totalCredits = transactions.reduce((sum, t) => (t.type === "credit" ? sum + t.amount : sum), 0)
  const totalDebits = transactions.reduce((sum, t) => (t.type === "debit" ? sum + t.amount : sum), 0)
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0)

  const canDelete = (transaction) => {
    const transactionAge = Date.now() - new Date(transaction.createdAt).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    return transactionAge <= maxAge
  }

  return (
    <>
      <div className="p-8 bg-slate-950 min-h-screen">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Transaction Management</h1>
            <p className="text-slate-400">Branch: {user?.currentBranch}</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
            + New Transaction
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
            {success}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400 mb-1">Total Credits</p>
              <p className="text-2xl font-bold text-green-400">₹{(totalCredits / 1000).toFixed(1)}K</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400 mb-1">Total Debits</p>
              <p className="text-2xl font-bold text-red-400">₹{(totalDebits / 1000).toFixed(1)}K</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400 mb-1">Commission Earned</p>
              <p className="text-2xl font-bold text-orange-400">₹{(totalCommission / 100).toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">All Transactions ({transactions.length})</CardTitle>
            <CardDescription>Complete transaction history for this branch</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && transactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No transactions yet. Create your first transaction!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400">Date</th>
                      <th className="text-left py-3 px-4 text-slate-400">UTR ID</th>
                      <th className="text-left py-3 px-4 text-slate-400">Type</th>
                      <th className="text-left py-3 px-4 text-slate-400">Amount</th>
                      <th className="text-left py-3 px-4 text-slate-400">Commission</th>
                      <th className="text-left py-3 px-4 text-slate-400">Final Amount</th>
                      <th className="text-left py-3 px-4 text-slate-400">Remark</th>
                      <th className="text-left py-3 px-4 text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-slate-800 hover:bg-slate-800">
                        <td className="py-3 px-4 text-slate-300 text-xs">
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-xs">{txn.utrId}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              txn.type === "credit" 
                                ? "bg-green-900 text-green-200" 
                                : "bg-red-900 text-red-200"
                            }`}
                          >
                            {txn.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">₹{(txn.amount / 1000).toFixed(2)}K</td>
                        <td className="py-3 px-4 text-orange-400">₹{(txn.commission / 100).toFixed(2)}</td>
                        <td className="py-3 px-4 text-blue-400 font-semibold">
                          ₹{(txn.finalAmount / 1000).toFixed(2)}K
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xs">{txn.remark || '-'}</td>
                        <td className="py-3 px-4">
                          {canDelete(txn) ? (
                            <Button
                              onClick={() => handleDelete(txn.id)}
                              disabled={deletingId === txn.id}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                            >
                              {deletingId === txn.id ? 'Deleting...' : 'Delete'}
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-500">Cannot delete</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showModal && <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)} role="staff" />}
    </>
  )
}