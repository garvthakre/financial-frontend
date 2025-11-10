// app/admin/staff/page.jsx - FULLY INTEGRATED WITH BACKEND
"use client"

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchFilter from "@/components/shared/SearchFilter";
import ExportButton from "@/components/shared/ExportButton";
import StaffFormModal from "@/components/modals/StaffFormModal";
import StaffBranchAssignmentModal from "@/components/modals/StaffBranchAssignmentModal";

export default function StaffPage() {
  const { staff, branches, fetchStaff, fetchBranches, addStaff, assignStaffToBranches, loading } = useData();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      console.log('Loading staff and branches data...');
      await Promise.all([fetchStaff(), fetchBranches()]);
    };
    loadData();
  }, []);

  // Log staff data to debug
  useEffect(() => {
    console.log('Staff data:', staff);
    console.log('Branches data:', branches);
  }, [staff, branches]);

  const filteredStaff = staff.filter((s) => {
    const matchesSearch = !searchQuery || 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branches?.some(b => 
        b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter = 
      filterType === "all" ||
      (filterType === "assigned" && s.branches?.length > 0) ||
      (filterType === "unassigned" && (!s.branches || s.branches.length === 0));

    return matchesSearch && matchesFilter;
  });

  const handleAddStaff = async (formData) => {
    setError("");
    setSuccess("");
    
    try {
      console.log('Creating staff with data:', formData);
      const result = await addStaff(formData);
      
      if (result.success) {
        setSuccess("Staff member created successfully!");
        setShowCreateForm(false);
        await fetchStaff();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to create staff member");
      }
    } catch (err) {
      console.error('Staff creation error:', err);
      setError(err.message || "Failed to create staff member");
    }
  };

  const handleOpenAssignment = (staffMember) => {
    console.log("Opening assignment modal for:", staffMember);
    setSelectedStaff(staffMember);
    setShowAssignModal(true);
  };

  const handleAssignBranches = async (staffId, branchIds) => {
    setError("");
    setSuccess("");

    try {
      console.log("Assigning branches:", { staffId, branchIds });
      const result = await assignStaffToBranches(staffId, branchIds);

      if (result.success) {
        setSuccess(`Successfully assigned ${branchIds.length} branch(es) to staff member!`);
        setShowAssignModal(false);
        setSelectedStaff(null);
        await fetchStaff(); // Refresh staff list with updated branch assignments
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to assign branches");
      }
    } catch (err) {
      console.error("Assignment error:", err);
      setError(err.message || "Failed to assign branches");
    }
  };

  const getStaffClients = (staffMember) => {
    if (!staffMember.branches || staffMember.branches.length === 0) return [];
    
    const clientMap = new Map();
    staffMember.branches.forEach(branch => {
      if (branch.clientId) {
        const clientId = branch.clientId._id || branch.clientId;
        const clientData = typeof branch.clientId === 'object' ? branch.clientId : null;
        
        if (clientData && !clientMap.has(clientId)) {
          clientMap.set(clientId, {
            name: clientData.name,
            phone: clientData.phone
          });
        }
      }
    });
    return Array.from(clientMap.values());
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Staff Management</h1>
          <p className="text-slate-400">Manage team members and their branch assignments</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
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

      {/* Filters */}
      <div className="mb-6 flex gap-3 flex-wrap items-center">
        <SearchFilter onSearch={setSearchQuery} />
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterType === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All ({staff.length})
          </button>
          <button
            onClick={() => setFilterType("assigned")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterType === "assigned"
                ? "bg-green-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Assigned ({staff.filter(s => s.branches?.length > 0).length})
          </button>
          <button
            onClick={() => setFilterType("unassigned")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterType === "unassigned"
                ? "bg-orange-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Unassigned ({staff.filter(s => !s.branches || s.branches.length === 0).length})
          </button>
        </div>

        <ExportButton data={filteredStaff} filename="staff" />
      </div>

      {/* Staff Cards Grid */}
      {loading && staff.length === 0 ? (
        <div className="text-center py-12 text-slate-400">Loading staff...</div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          {searchQuery ? "No staff found matching your search." : "No staff members yet. Create one!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map((member) => {
            const clients = getStaffClients(member);
            const isAssigned = member.branches && member.branches.length > 0;

            return (
              <Card key={member._id} className="bg-slate-900 border-slate-800 hover:border-slate-600 transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-slate-400">{member.phone}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      member.isActive 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Assignment Status */}
                  <div className={`p-3 rounded-lg ${
                    isAssigned 
                      ? 'bg-green-900/20 border border-green-700/30' 
                      : 'bg-orange-900/20 border border-orange-700/30'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${isAssigned ? 'text-green-400' : 'text-orange-400'}`}>
                      {isAssigned ? '✓ Assigned' : '⚠ Unassigned'}
                    </p>
                    <p className="text-sm text-slate-300">
                      {member.branches?.length || 0} branch(es)
                    </p>
                  </div>

                  {/* Clients Working For */}
                  {clients.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Working for clients:</p>
                      <div className="space-y-1">
                        {clients.map((client, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-slate-300">{client.name}</span>
                            <span className="text-slate-500 text-xs">({client.phone})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Branches List */}
                  {member.branches && member.branches.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Assigned branches:</p>
                      <div className="flex flex-wrap gap-2">
                        {member.branches.slice(0, 3).map((branch) => (
                          <span
                            key={branch._id}
                            className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 font-mono"
                          >
                            {branch.code}
                          </span>
                        ))}
                        {member.branches.length > 3 && (
                          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                            +{member.branches.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-800">
                    <Button
                      onClick={() => handleOpenAssignment(member)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isAssigned ? 'Manage Branches' : 'Assign Branches'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <StaffFormModal 
        isOpen={showCreateForm} 
        onClose={() => {
          setShowCreateForm(false);
          setError("");
        }} 
        onSubmit={handleAddStaff}
        skipBranchSelection={true}
      />
      
      {showAssignModal && selectedStaff && (
        <StaffBranchAssignmentModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedStaff(null);
            setError("");
          }}
          staff={selectedStaff}
          branches={branches}
          onAssign={handleAssignBranches}
        />
      )}
    </div>
  );
}