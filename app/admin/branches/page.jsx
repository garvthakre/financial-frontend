"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SearchFilter from "@/components/shared/SearchFilter"
import BranchFormModal from "@/components/modals/BranchFormModal"

export default function BranchesPage() {
  const { fetchBranches, branches, loading, addBranch } = useData()
  const [showForm, setShowForm] = useState(false)
  const [filteredBranches, setFilteredBranches] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  useEffect(() => {
    if (searchQuery) {
      setFilteredBranches(
        branches.filter(
          (b) =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
            b.code.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredBranches(branches)
    }
  }, [searchQuery, branches])

  const handleAddBranch = async (formData) => {
    setError("")
    setSuccess("")
    const result = await addBranch(formData)
    
    if (result.success) {
      setSuccess("Branch created successfully!")
      setShowForm(false)
      fetchBranches() // Refresh the list
      setTimeout(() => setSuccess(""), 3000)
    } else {
      setError(result.message || "Failed to create branch")
    }
  }

  const calculateTotals = (branch) => {
    // These would come from aggregated transaction data in production
    return {
      totalCredits: 0,
      totalDebits: 0
    }
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

      <div className="mb-6">
        <SearchFilter onSearch={setSearchQuery} />
      </div>

      {loading && branches.length === 0 ? (
        <div className="text-center py-12 text-slate-400">Loading branches...</div>
      ) : filteredBranches.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No branches found. {searchQuery ? "Try adjusting your search." : "Create your first branch!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => {
            const totals = calculateTotals(branch)
            return (
              <Card key={branch._id} className="bg-slate-900 border-slate-800 hover:border-slate-600 transition">
                <CardHeader>
                  <CardTitle className="text-white">{branch.name}</CardTitle>
                  <CardDescription>
                    <span className="font-mono text-blue-400">{branch.code}</span>
                    {branch.address && (
                      <span className="block mt-1 text-slate-500">{branch.address}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Client</p>
                    <p className="text-sm font-semibold text-slate-300">
                      {branch.clientId?.name || 'N/A'}
                    </p>
                    {branch.clientId?.email && (
                      <p className="text-xs text-slate-500">{branch.clientId.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Staff Members</p>
                    <p className="text-xl font-bold text-blue-400">
                      {branch.staffMembers?.length || 0}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-400 mb-1">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      branch.isActive 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                      Edit
                    </Button>
                    <Button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <BranchFormModal 
        isOpen={showForm} 
        onClose={() => {
          setShowForm(false)
          setError("")
        }} 
        onSubmit={handleAddBranch}
      />
    </div>
  )
}