"use client"

import { useState } from "react"

export default function SearchFilter({ onSearch, onFilter, filterOptions }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")

  const handleSearch = (value) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleFilter = (value) => {
    setSelectedFilter(value)
    onFilter?.(value)
  }

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <input
        type="text"
        placeholder="Search by UTR ID, amount, or remark..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-1 min-w-64 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filterOptions && (
        <select
          value={selectedFilter}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Filters</option>
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
