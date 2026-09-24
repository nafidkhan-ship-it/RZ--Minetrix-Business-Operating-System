import React, { useState } from 'react';
import {
  Target,
  Search,
  Plus,
  Filter,
  ArrowRight,
  UserCheck,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  X,
  FileCheck2,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  JobLead,
  LeadStatus,
  LeadSource,
  SAMPLE_LEADS,
  SAMPLE_CUSTOMERS
} from '../../data/contractJobStudioData';

interface LeadsViewProps {
  onConvertToCustomer: (lead: JobLead) => void;
  onConvertToRequirement: (lead: JobLead) => void;
  onConvertToJob: (lead: JobLead) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  onConvertToCustomer,
  onConvertToRequirement,
  onConvertToJob
}) => {
  const [leads, setLeads] = useState<JobLead[]>(SAMPLE_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState<JobLead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New lead form
  const [newLead, setNewLead] = useState<Partial<JobLead>>({
    customerName: '',
    requirementTitle: '',
    source: 'Direct Inbound',
    estimatedValue: 2500000,
    salesPerson: 'Anand Kumar (Commercial Head)',
    followUpDate: '2026-09-28',
    status: 'New',
    notes: '',
    probabilityPercent: 50
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.customerName || !newLead.requirementTitle) {
      showToast('Please provide Customer Name and Requirement Title');
      return;
    }

    const created: JobLead = {
      id: `LEAD-${800 + leads.length + 1}`,
      customerId: 'CUST-NEW',
      customerName: newLead.customerName,
      requirementTitle: newLead.requirementTitle,
      requirementType: 'Crushed Aggregate Supply',
      source: (newLead.source as LeadSource) || 'Direct Inbound',
      estimatedValue: Number(newLead.estimatedValue) || 1000000,
      salesPerson: newLead.salesPerson || 'Site Accounts',
      followUpDate: newLead.followUpDate || '2026-10-01',
      status: (newLead.status as LeadStatus) || 'New',
      notes: newLead.notes || 'Inbound commercial inquiry',
      probabilityPercent: Number(newLead.probabilityPercent) || 50,
      createdDate: '2026-09-23'
    };

    setLeads([created, ...leads]);
    setIsAddModalOpen(false);
    showToast(`Lead ${created.id} created successfully`);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.requirementTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.salesPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const PIPELINE_COLUMNS: LeadStatus[] = [
    'New',
    'Contacted',
    'Qualified',
    'Quotation',
    'Negotiation',
    'Won',
    'Lost'
  ];

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
              Sales Pipeline CRM
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filteredLeads.length} Opportunities
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Leads & Deal Conversion</h2>
          <p className="text-xs text-slate-400">
            Track inquiries from inbound calls, tenders, quarry visits, and marketplace inquiries with 1-click conversion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'pipeline'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by customer, title, sales person..."
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
            <option value="ALL">All Stages</option>
            {PIPELINE_COLUMNS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PIPELINE / KANBAN VIEW */}
      {viewMode === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage);
            const stageValue = stageLeads.reduce((acc, curr) => acc + curr.estimatedValue, 0);

            return (
              <div
                key={stage}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between min-w-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                      {stage}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="text-[10px] text-emerald-400 font-mono font-bold mt-1.5">
                    ₹{(stageValue / 100000).toFixed(1)} L
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {stageLeads.length === 0 ? (
                      <div className="py-6 text-center text-[11px] text-slate-600">No deals in {stage}</div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition space-y-2"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono text-emerald-400 font-bold">{lead.id}</span>
                            <span className="text-slate-400">{lead.source}</span>
                          </div>

                          <div className="text-xs font-bold text-white leading-snug line-clamp-2">
                            {lead.requirementTitle}
                          </div>

                          <div className="text-[11px] text-slate-400 truncate">{lead.customerName}</div>

                          <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="text-white font-mono font-bold">
                              ₹{(lead.estimatedValue / 100000).toFixed(1)} L
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">
                              {lead.probabilityPercent}%
                            </span>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {lead.followUpDate}
                            </span>
                            <button
                              onClick={() => setSelectedLeadForConvert(lead)}
                              className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-bold cursor-pointer transition flex items-center gap-0.5"
                            >
                              <span>Convert</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                <tr>
                  <th className="py-3 px-4">Lead ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Requirement Title</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Estimated Value</th>
                  <th className="py-3 px-4">Sales Person</th>
                  <th className="py-3 px-4">Follow-up</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-850 transition">
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{lead.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{lead.customerName}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{lead.requirementTitle}</td>
                    <td className="py-3 px-4 text-slate-400">{lead.source}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ₹{(lead.estimatedValue / 100000).toFixed(2)} Lakhs
                    </td>
                    <td className="py-3 px-4 text-slate-400">{lead.salesPerson}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{lead.followUpDate}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLeadForConvert(lead)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition cursor-pointer"
                      >
                        Convert &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONVERT LEAD MODAL (Convert Lead -> Customer / Requirement / Job) */}
      {selectedLeadForConvert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {selectedLeadForConvert.id}
                </span>
                <h3 className="text-base font-black text-white">Convert Inbound Lead</h3>
                <div className="text-xs text-slate-400">{selectedLeadForConvert.customerName}</div>
              </div>
              <button
                onClick={() => setSelectedLeadForConvert(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Requirement:</span>{' '}
                <span className="text-white font-semibold">
                  {selectedLeadForConvert.requirementTitle}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Estimated Value:</span>{' '}
                <span className="text-emerald-400 font-mono font-bold">
                  ₹{selectedLeadForConvert.estimatedValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Select Conversion Target:</div>

              {/* Option 1: Convert to Customer */}
              <button
                onClick={() => {
                  const lead = selectedLeadForConvert;
                  setSelectedLeadForConvert(null);
                  onConvertToCustomer(lead);
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-emerald-300">
                      Convert to Customer Master
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Add to verified CRM directory with credit limits and GST registration
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </button>

              {/* Option 2: Convert to Requirement */}
              <button
                onClick={() => {
                  const lead = selectedLeadForConvert;
                  setSelectedLeadForConvert(null);
                  onConvertToRequirement(lead);
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-amber-300">
                      Convert to Project Requirement (RFQ)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Specify material grades, vehicle logistics and generate quotation
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </button>

              {/* Option 3: Convert to Direct Job */}
              <button
                onClick={() => {
                  const lead = selectedLeadForConvert;
                  setSelectedLeadForConvert(null);
                  onConvertToJob(lead);
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-purple-300">
                      Convert Directly to Active Job Order
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Bypass formal quotation and initialize job with immediate resource allocation
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Log New Sales Opportunity / Lead</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Prospect / Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newLead.customerName}
                  onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })}
                  placeholder="e.g. Navayuga Engineering Co."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Requirement / Deal Title *</label>
                <input
                  type="text"
                  required
                  value={newLead.requirementTitle}
                  onChange={(e) => setNewLead({ ...newLead, requirementTitle: e.target.value })}
                  placeholder="e.g. 50,000 MT Aggregates for Port Expansion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Lead Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value as LeadSource })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Direct Inbound">Direct Inbound</option>
                    <option value="Referral">Referral</option>
                    <option value="Tender / e-Procurement">Tender / e-Procurement</option>
                    <option value="Quarry Site Visit">Quarry Site Visit</option>
                    <option value="RZ® Chat">RZ® Chat</option>
                    <option value="Marketplace Lead">Marketplace Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={newLead.estimatedValue}
                    onChange={(e) => setNewLead({ ...newLead, estimatedValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sales Person</label>
                  <input
                    type="text"
                    value={newLead.salesPerson}
                    onChange={(e) => setNewLead({ ...newLead, salesPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={newLead.followUpDate}
                    onChange={(e) => setNewLead({ ...newLead, followUpDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Deal Notes</label>
                <textarea
                  rows={2}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="Key project contacts, site visit dates, price benchmarks..."
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
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
