"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SearchFilter from "@/components/shared/SearchFilter"
import BranchFormModal from "@/components/modals/BranchFormModal"

export default function BranchesPage() {
  const { fetchBranches, branches, loading } = useData()
  const [showForm, setShowForm] = useState(false)
  const [filteredBranches, setFilteredBranches] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  useEffect(() => {
    if (searchQuery) {
      setFilteredBranches(
        branches.filter(
          (b) =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.location.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredBranches(branches)
    }
  }, [searchQuery, branches])

  const handleAddBranch = (formData) => {
    console.log("[v0] New branch:", formData)
    setShowForm(false)
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Branch Management</h1>
          <p className="text-slate-400">Manage all business branches</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          + Add Branch
        </Button>
      </div>

      <div className="mb-6">
        <SearchFilter onSearch={setSearchQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className="bg-slate-900 border-slate-800 hover:border-slate-600 transition">
            <CardHeader>
              <CardTitle className="text-white">{branch.name}</CardTitle>
              <CardDescription>{branch.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Credits</p>
                <p className="text-xl font-bold text-green-400">${(branch.totalCredits / 1000).toFixed(1)}K</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Debits</p>
                <p className="text-xl font-bold text-red-400">${(branch.totalDebits / 1000).toFixed(1)}K</p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">Edit</Button>
                <Button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BranchFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleAddBranch} />
    </div>
  )
}
