"use client"

import { useState } from "react"

export default function DateRangeFilter({ onDateChange }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleApply = () => {
    onDateChange?.({ startDate, endDate })
  }

  return (
    <div className="flex gap-3 mb-6 flex-wrap items-center">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-slate-400">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleApply}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
      >
        Apply
      </button>
    </div>
  )
}
