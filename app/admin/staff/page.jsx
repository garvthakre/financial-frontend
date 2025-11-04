"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function StaffPage() {
  const staffList = Array.from({ length: 8 }).map((_, i) => ({
    id: `staff-${i + 1}`,
    name: `Staff Member ${i + 1}`,
    email: `staff${i + 1}@example.com`,
    branch: `Branch ${(i % 3) + 1}`,
    role: i % 2 === 0 ? "Manager" : "Associate",
    joinDate: new Date(2024, 0, i + 1).toLocaleDateString(),
  }))

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Staff Management</h1>
          <p className="text-slate-400">Manage team members and permissions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">+ Add Staff</Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Staff Members</CardTitle>
          <CardDescription>List of all staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Name</th>
                  <th className="text-left py-3 px-4 text-slate-400">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400">Branch</th>
                  <th className="text-left py-3 px-4 text-slate-400">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400">Join Date</th>
                  <th className="text-left py-3 px-4 text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                    <td className="py-4 px-4 text-slate-300 font-semibold">{staff.name}</td>
                    <td className="py-4 px-4 text-slate-400">{staff.email}</td>
                    <td className="py-4 px-4 text-slate-400">{staff.branch}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-900 text-blue-200">
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-xs">{staff.joinDate}</td>
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
    </div>
  )
}
