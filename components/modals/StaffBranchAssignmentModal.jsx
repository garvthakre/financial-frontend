// components/modals/StaffBranchAssignmentModal.jsx - FIXED VERSION
import { useState, useEffect } from 'react';

export default function StaffBranchAssignmentModal({ isOpen, onClose, staff, branches, onAssign }) {
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && staff) {
      console.log('Modal opened for staff:', staff);
      console.log('Current branches:', staff.branches);
      // Pre-select currently assigned branches
      const currentBranchIds = staff.branches?.map(b => b._id || b) || [];
      console.log('Setting selected branches:', currentBranchIds);
      setSelectedBranches(currentBranchIds);
    }
  }, [isOpen, staff]);

  const handleToggleBranch = (branchId) => {
    setSelectedBranches(prev => {
      const isCurrentlySelected = prev.includes(branchId);
      const newSelection = isCurrentlySelected
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId];
      
      console.log('Branch toggled:', branchId, 'New selection:', newSelection);
      return newSelection;
    });
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Submitting assignment:', { staffId: staff._id, branchIds: selectedBranches });
      await onAssign(staff._id, selectedBranches);
    } catch (err) {
      console.error('Assignment failed:', err);
      setError(err.message || 'Failed to assign branches');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Group branches by client
  const branchesByClient = branches.reduce((acc, branch) => {
    const clientId = branch.clientId?._id || 'unknown';
    const clientName = branch.clientId?.name || 'Unknown Client';
    
    if (!acc[clientId]) {
      acc[clientId] = {
        clientName,
        clientPhone: branch.clientId?.phone,
        branches: []
      };
    }
    acc[clientId].branches.push(branch);
    return acc;
  }, {});

  const filteredBranches = searchQuery
    ? branches.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.clientId?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : branches;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Assign Branches</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-slate-400">
            Staff: <span className="text-blue-400 font-semibold">{staff?.name}</span> ({staff?.phone})
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="p-6 border-b border-slate-800">
          <input
            type="text"
            placeholder="Search branches or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-slate-400 mt-2">
            {selectedBranches.length} branch(es) selected
          </p>
        </div>

        {/* Branch List */}
        <div className="overflow-y-auto max-h-[50vh] p-6">
          {Object.entries(branchesByClient).map(([clientId, { clientName, clientPhone, branches: clientBranches }]) => (
            <div key={clientId} className="mb-6">
              {/* Client Header */}
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-800">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{clientName}</h3>
                  <p className="text-xs text-slate-400">{clientPhone}</p>
                </div>
              </div>

              {/* Client's Branches */}
              <div className="space-y-2 ml-4">
                {clientBranches
                  .filter(branch => 
                    !searchQuery || 
                    filteredBranches.some(fb => fb._id === branch._id)
                  )
                  .map((branch) => {
                    const isSelected = selectedBranches.includes(branch._id);
                    return (
                      <button
                        key={branch._id}
                        onClick={() => handleToggleBranch(branch._id)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'bg-blue-500/20 border-blue-500 shadow-lg'
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Checkbox */}
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-slate-600'
                          }`}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>

                          {/* Branch Info */}
                          <div className="text-left">
                            <p className="font-semibold text-white">{branch.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300 font-mono">
                                {branch.code}
                              </span>
                              {branch.address && (
                                <span className="text-xs text-slate-400">{branch.address}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Staff Count */}
                        <div className="text-right">
                          <p className="text-sm text-slate-400">
                            {branch.staffMembers?.length || 0} staff
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}

          {filteredBranches.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p>No branches found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-800/50 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold transition disabled:opacity-50 shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              `Assign ${selectedBranches.length} Branch(es)`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}