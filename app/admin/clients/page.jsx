"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SearchFilter from "@/components/shared/SearchFilter"
import ExportButton from "@/components/shared/ExportButton"
import ClientFormModal from "@/components/modals/ClientFormModal"

export default function ClientsPage() {
  const { fetchClients, clients, loading, addClient } = useData()
  const [showForm, setShowForm] = useState(false)
  const [filteredClients, setFilteredClients] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  useEffect(() => {
    if (searchQuery) {
      setFilteredClients(
        clients.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      )
    } else {
      setFilteredClients(clients)
    }
  }, [searchQuery, clients])

  const handleAddClient = async (formData) => {
    setError("")
    setSuccess("")
    
    const result = await addClient(formData)
    
    if (result.success) {
      setSuccess("Client created successfully!")
      setShowForm(false)
      setTimeout(() => setSuccess(""), 3000)
    } else {
      setError(result.message || "Failed to create client")
    }
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients Management</h1>
          <p className="text-slate-400">Manage all registered clients</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          + Add Client
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
        <ExportButton data={filteredClients} filename="clients" />
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">All Clients ({filteredClients.length})</CardTitle>
          <CardDescription>List of registered clients in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && clients.length === 0 ? (
            <div className="text-center py-12 text-slate-400">Loading clients...</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              {searchQuery ? "No clients found matching your search." : "No clients yet. Create one!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">Name</th>
                    <th className="text-left py-3 px-4 text-slate-400">Phone</th>
                    <th className="text-left py-3 px-4 text-slate-400">Wallet Balance</th>
                    <th className="text-left py-3 px-4 text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client._id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                      <td className="py-4 px-4 text-slate-300 font-semibold">{client.name}</td>
                      <td className="py-4 px-4 text-slate-400">{client.phone}</td>
                      <td className="py-4 px-4 text-green-400 font-semibold">
                        ₹{client.walletBalance?.toLocaleString() || '0'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          client.isActive 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {client.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ClientFormModal 
        isOpen={showForm} 
        onClose={() => {
          setShowForm(false)
          setError("")
        }} 
        onSubmit={handleAddClient}
      />
    </div>
  )
}