"use client"

import { useEffect, useState } from "react"
import { useData } from "@/context/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SearchFilter from "@/components/shared/SearchFilter"
import ExportButton from "@/components/shared/ExportButton"
import ClientFormModal from "@/components/modals/ClientFormModal"

export default function ClientsPage() {
  const { fetchClients, clients, loading } = useData()
  const [showForm, setShowForm] = useState(false)
  const [filteredClients, setFilteredClients] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  useEffect(() => {
    if (searchQuery) {
      setFilteredClients(
        clients.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery),
        ),
      )
    } else {
      setFilteredClients(clients)
    }
  }, [searchQuery, clients])

  const handleAddClient = (formData) => {
    console.log("[v0] New client:", formData)
    setShowForm(false)
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Name</th>
                  <th className="text-left py-3 px-4 text-slate-400">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400">Phone</th>
                  <th className="text-left py-3 px-4 text-slate-400">Branch</th>
                  <th className="text-left py-3 px-4 text-slate-400">Transactions</th>
                  <th className="text-left py-3 px-4 text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                    <td className="py-4 px-4 text-slate-300 font-semibold">{client.name}</td>
                    <td className="py-4 px-4 text-slate-400">{client.email}</td>
                    <td className="py-4 px-4 text-slate-400">{client.phone}</td>
                    <td className="py-4 px-4 text-slate-400">{client.assignedBranch}</td>
                    <td className="py-4 px-4 text-blue-400">{client.totalTransactions}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900 text-green-200">
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ClientFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleAddClient} />
    </div>
  )
}
