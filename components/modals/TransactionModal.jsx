"use client"

import { useState } from "react"
import { useData } from "@/context/DataContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TransactionModal({ isOpen, onClose, role }) {
  const [amount, setAmount] = useState("")
  const [utrId, setUtrId] = useState("")
  const [remark, setRemark] = useState("")
  const [type, setType] = useState("credit")
  const [loading, setLoading] = useState(false)
  const { addTransaction } = useData()

  const commission = Math.round(amount * 0.03) || 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const transaction = {
      amount: Number.parseFloat(amount),
      utrId,
      remark,
      type,
      commission,
    }

    await addTransaction(transaction)
    setLoading(false)
    onClose()

    // Reset form
    setAmount("")
    setUtrId("")
    setRemark("")
    setType("credit")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">New Transaction</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">UTR ID</label>
              <input
                type="text"
                value={utrId}
                onChange={(e) => setUtrId(e.target.value)}
                placeholder="UTR1234567890"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Remark</label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Transaction details"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Commission Preview */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Amount</span>
                <span className="text-white font-semibold">${Number.parseFloat(amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-700 pt-2">
                <span className="text-slate-300">Commission (3%)</span>
                <span className="text-orange-400 font-semibold">-${(commission / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-700 pt-2 mt-2">
                <span className="text-slate-300">Net Amount</span>
                <span className="text-green-400 font-semibold">
                  ${(Number.parseFloat(amount || 0) - commission / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!amount || !utrId || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
