"use client"

import { useState, useEffect } from "react"
import { useData } from "@/context/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SearchFilter from "@/components/shared/SearchFilter"
import ExportButton from "@/components/shared/ExportButton"
import StaffFormModal from "@/components/modals/StaffFormModal"

export default function StaffPage() {
  const { staff, fetchStaff, addStaff, loading } = useData()
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  const filteredStaff = searchQuery
    ? staff.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.branches?.some(b => 
            b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.code?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : staff

  const handleAddStaff = async (formData) => {
    setError("")
    setSuccess("")
    
    const result = await addStaff(formData)
    
    if (result.success) {
      setSuccess("Staff member created successfully!")
      setShowForm(false)
      setTimeout(() => setSuccess(""), 3000)
    } else {
      setError(result.message || "Failed to create staff member")
    }
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Staff Management</h1>
          <p className="text-slate-400">Manage team members and permissions</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          + Add Staff
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

      <div className="mb-6 flex gap-3">
        <SearchFilter onSearch={setSearchQuery} />
        <ExportButton data={filteredStaff} filename="staff" />
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Staff Members ({filteredStaff.length})</CardTitle>
          <CardDescription>List of all staff members</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && staff.length === 0 ? (
            <div className="text-center py-12 text-slate-400">Loading staff...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              {searchQuery ? "No staff found matching your search." : "No staff members yet. Create one!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">Name</th>
                    <th className="text-left py-3 px-4 text-slate-400">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400">Client</th>
                    <th className="text-left py-3 px-4 text-slate-400">Branches</th>
                    <th className="text-left py-3 px-4 text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((member) => (
                    <tr key={member._id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                      <td className="py-4 px-4 text-slate-300 font-semibold">{member.name}</td>
                      <td className="py-4 px-4 text-slate-400">{member.email}</td>
                      <td className="py-4 px-4 text-slate-400">
                        {member.clientId?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {member.branches?.length || 0} branch(es)
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          member.isActive 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <StaffFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleAddStaff} />
    </div>
  )
}