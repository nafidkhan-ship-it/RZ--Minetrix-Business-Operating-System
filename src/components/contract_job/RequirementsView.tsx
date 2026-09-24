import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Plus,
  Filter,
  Eye,
  ArrowRight,
  FileSpreadsheet,
  Briefcase,
  Calendar,
  MapPin,
  Boxes,
  Truck,
  Users,
  X,
  CheckCircle2,
  Paperclip
} from 'lucide-react';
import {
  JobRequirement,
  RequirementType,
  RequirementStatus,
  SAMPLE_REQUIREMENTS,
  SAMPLE_CUSTOMERS
} from '../../data/contractJobStudioData';

interface RequirementsViewProps {
  onConvertToQuotation: (req: JobRequirement) => void;
  onConvertToJob: (req: JobRequirement) => void;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({
  onConvertToQuotation,
  onConvertToJob
}) => {
  const [requirements, setRequirements] = useState<JobRequirement[]>(SAMPLE_REQUIREMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedReq, setSelectedReq] = useState<JobRequirement | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New requirement form state
  const [newReq, setNewReq] = useState<Partial<JobRequirement>>({
    customerId: SAMPLE_CUSTOMERS[0]?.id || '',
    customerName: SAMPLE_CUSTOMERS[0]?.name || '',
    requirementType: 'Crushed Aggregate Supply',
    title: '',
    description: '',
    location: '',
    district: 'Dakshina Kannada',
    startDate: '2026-10-01',
    expectedCompletion: '2026-11-30',
    budget: 3500000,
    materialRequirement: '',
    vehicleRequirement: '',
    labourRequirement: '',
    notes: '',
    status: 'New'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReq.title || !newReq.description) {
      showToast('Please provide Title and Description');
      return;
    }

    const matchedCust = SAMPLE_CUSTOMERS.find((c) => c.id === newReq.customerId);

    const created: JobRequirement = {
      id: `REQ-2026-00${requirements.length + 1}`,
      customerId: newReq.customerId || 'CUST-1001',
      customerName: matchedCust ? matchedCust.name : newReq.customerName || 'Direct Customer',
      requirementType: (newReq.requirementType as RequirementType) || 'Crushed Aggregate Supply',
      title: newReq.title,
      description: newReq.description,
      location: newReq.location || 'Local Site Yard',
      district: newReq.district || 'Dakshina Kannada',
      startDate: newReq.startDate || '2026-10-01',
      expectedCompletion: newReq.expectedCompletion || '2026-11-30',
      budget: Number(newReq.budget) || 1000000,
      materialRequirement: newReq.materialRequirement || 'Standard graded stone',
      vehicleRequirement: newReq.vehicleRequirement || '3 x Heavy Tippers',
      labourRequirement: newReq.labourRequirement || '1 Supervisor, 4 Crew',
      notes: newReq.notes || 'Created via studio workbench',
      attachmentsCount: 1,
      status: 'New',
      createdAt: '2026-09-23'
    };

    setRequirements([created, ...requirements]);
    setIsAddModalOpen(false);
    showToast(`Requirement ${created.id} submitted successfully`);
  };

  const filteredRequirements = requirements.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              RFQ & Inbound Scopes
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filteredRequirements.length} Active Demands
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Project Requirement Management</h2>
          <p className="text-xs text-slate-400">
            Define material grades, vehicle logistics, machine specifications, and target timelines before quoting.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Requirement</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search requirements, client, location, material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Quotation Prepared">Quotation Prepared</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Converted to Job">Converted to Job</option>
          </select>
        </div>
      </div>

      {/* Requirements List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequirements.map((req) => (
          <div
            key={req.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{req.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {req.requirementType}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{req.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">{req.customerName}</div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                    req.status === 'Approved' || req.status === 'Converted to Job'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : req.status === 'Quotation Prepared'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : req.status === 'Negotiation'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : req.status === 'Rejected'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {req.description}
              </p>

              <div className="mt-3 p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{req.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>
                    {req.startDate} &rarr; {req.expectedCompletion}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Boxes className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{req.materialRequirement}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="text-slate-500">Est. Budget:</span>{' '}
                  <span className="text-white font-mono font-black">
                    ₹{(req.budget / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Paperclip className="w-3 h-3" />
                  <span>{req.attachmentsCount} specs attached</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => setSelectedReq(req)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3 text-slate-400" />
                <span>Full Details</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onConvertToQuotation(req)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold transition border border-amber-500/20 flex items-center gap-1 cursor-pointer"
                  title="Prepare formal Quotation from this Requirement"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>+ Quotation</span>
                </button>

                <button
                  onClick={() => onConvertToJob(req)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold transition border border-purple-500/20 flex items-center gap-1 cursor-pointer"
                  title="Convert directly to Active Job"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Convert to Job</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL REQUIREMENT DETAIL MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">{selectedReq.id}</span>
                <h3 className="text-base font-black text-white">{selectedReq.title}</h3>
                <div className="text-xs text-slate-400">Client: {selectedReq.customerName}</div>
              </div>

              <button
                onClick={() => setSelectedReq(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">
                  Detailed Scope & Description
                </span>
                <p className="text-slate-200 mt-1 leading-relaxed">{selectedReq.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500">Location:</span>{' '}
                  <span className="text-slate-200 font-semibold">{selectedReq.location}</span>
                </div>
                <div>
                  <span className="text-slate-500">District:</span>{' '}
                  <span className="text-slate-200">{selectedReq.district}</span>
                </div>
                <div>
                  <span className="text-slate-500">Estimated Budget:</span>{' '}
                  <span className="text-white font-mono font-bold">
                    ₹{selectedReq.budget.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Timeline:</span>{' '}
                  <span className="text-slate-200">
                    {selectedReq.startDate} to {selectedReq.expectedCompletion}
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Demands */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Materials</span>
                </div>
                <p className="text-slate-300">{selectedReq.materialRequirement}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Fleet & Machinery</span>
                </div>
                <p className="text-slate-300">{selectedReq.vehicleRequirement}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <Users className="w-3.5 h-3.5" />
                  <span>Crew & Supervision</span>
                </div>
                <p className="text-slate-300">{selectedReq.labourRequirement}</p>
              </div>
            </div>

            {selectedReq.notes && (
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400">
                <strong className="text-slate-300">Operational Notes:</strong> {selectedReq.notes}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  const req = selectedReq;
                  setSelectedReq(null);
                  onConvertToQuotation(req);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Prepare Quotation
              </button>
              <button
                onClick={() => {
                  const req = selectedReq;
                  setSelectedReq(null);
                  onConvertToJob(req);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Direct Convert to Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW REQUIREMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Log New Project Requirement / RFQ</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Customer / Client *</label>
                <select
                  value={newReq.customerId}
                  onChange={(e) => setNewReq({ ...newReq, customerId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {SAMPLE_CUSTOMERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.companyName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Requirement Type</label>
                  <select
                    value={newReq.requirementType}
                    onChange={(e) =>
                      setNewReq({ ...newReq, requirementType: e.target.value as RequirementType })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Quarry Excavation">Quarry Excavation</option>
                    <option value="Crushed Aggregate Supply">Crushed Aggregate Supply</option>
                    <option value="Road Sub-base Construction">Road Sub-base Construction</option>
                    <option value="Earthmoving & Grading">Earthmoving & Grading</option>
                    <option value="Laterite Masonry Work">Laterite Masonry Work</option>
                    <option value="Machinery Hire & Operation">Machinery Hire & Operation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Budget (₹)</label>
                  <input
                    type="number"
                    value={newReq.budget}
                    onChange={(e) => setNewReq({ ...newReq, budget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Requirement Title *</label>
                <input
                  type="text"
                  required
                  value={newReq.title}
                  onChange={(e) => setNewReq({ ...newReq, title: e.target.value })}
                  placeholder="e.g. 40mm Aggregate & M-Sand for Commercial Basement"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Detailed Scope Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newReq.description}
                  onChange={(e) => setNewReq({ ...newReq, description: e.target.value })}
                  placeholder="Describe technical specs, sieve standards, delivery timing..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Site Location</label>
                  <input
                    type="text"
                    value={newReq.location}
                    onChange={(e) => setNewReq({ ...newReq, location: e.target.value })}
                    placeholder="e.g. Suratkal NH-66 Bridge Site"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">District</label>
                  <input
                    type="text"
                    value={newReq.district}
                    onChange={(e) => setNewReq({ ...newReq, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Expected Start Date</label>
                  <input
                    type="date"
                    value={newReq.startDate}
                    onChange={(e) => setNewReq({ ...newReq, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Expected Completion</label>
                  <input
                    type="date"
                    value={newReq.expectedCompletion}
                    onChange={(e) => setNewReq({ ...newReq, expectedCompletion: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Material Requirement</label>
                <input
                  type="text"
                  value={newReq.materialRequirement}
                  onChange={(e) => setNewReq({ ...newReq, materialRequirement: e.target.value })}
                  placeholder="e.g. 15,000 MT 40mm GSB Stone & 8,000 MT Concrete Sand"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
