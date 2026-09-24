import React, { useState } from 'react';
import {
  HardHat,
  Search,
  Plus,
  Filter,
  Eye,
  Phone,
  Mail,
  FileText,
  Star,
  Receipt,
  MessageSquare,
  CheckCircle2,
  X,
  CalendarCheck,
  Building
} from 'lucide-react';
import {
  Contractor,
  SAMPLE_CONTRACTORS
} from '../../data/contractJobStudioData';

interface ContractorsViewProps {
  onOpenChat: (contractorName: string) => void;
  onOpenOttModal: (taskTitle: string) => void;
}

export const ContractorsView: React.FC<ContractorsViewProps> = ({
  onOpenChat,
  onOpenOttModal
}) => {
  const [contractors, setContractors] = useState<Contractor[]>(SAMPLE_CONTRACTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Contractor form state
  const [newC, setNewC] = useState<Partial<Contractor>>({
    name: '',
    serviceType: 'Blasting & Explosive Handling',
    contactPerson: '',
    phone: '',
    email: '',
    gstNumber: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    address: 'Udupi Industrial Area',
    paymentTerms: '15 Days RA Bill',
    rating: 4.8,
    activeJobsCount: 1,
    contractValue: 1500000,
    status: 'Active'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateContractor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newC.name || !newC.phone) {
      showToast('Please provide Contractor Name and Phone');
      return;
    }

    const created: Contractor = {
      id: `CONT-${300 + contractors.length + 1}`,
      name: newC.name,
      serviceType: newC.serviceType || 'Specialist Contractor',
      contactPerson: newC.contactPerson || newC.name,
      phone: newC.phone,
      email: newC.email || 'vendor@example.com',
      gstNumber: newC.gstNumber || '29ABCDE1234F1Z5',
      panNumber: newC.panNumber || 'ABCDE1234F',
      address: newC.address || 'Local Site',
      paymentTerms: newC.paymentTerms || '30 Days Net',
      rating: Number(newC.rating) || 4.5,
      activeJobsCount: 1,
      contractValue: Number(newC.contractValue) || 1000000,
      totalPaid: 0,
      outstandingAmount: 0,
      documentsCount: 2,
      status: 'Active'
    };

    setContractors([created, ...contractors]);
    setIsAddModalOpen(false);
    showToast(`Added Contractor ${created.name}`);
  };

  const filtered = contractors.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Vendor & Contractor Master
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filtered.length} Registered
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Contractor Management</h2>
          <p className="text-xs text-slate-400">
            Excavation specialists, drillers, blasting operators, tipper fleet contractors, and equipment hirers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Contractor</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search contractors by name, service type, contact person, ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Contractor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-purple-400">{c.id}</span>
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {c.serviceType}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{c.rating}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-1.5 leading-snug">{c.name}</h3>

              <div className="mt-3 space-y-1 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-slate-300 font-mono">{c.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{c.contactPerson} &bull; {c.address}</span>
                </div>
              </div>

              <div className="mt-3 p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px]">Contracted Value</span>
                  <div className="text-white font-mono font-bold">
                    ₹{(c.contractValue / 100000).toFixed(2)} L
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Active Work Orders</span>
                  <div className="text-emerald-400 font-mono font-bold">
                    {c.activeJobsCount} Active Orders
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: View, Payment, Statement, Chat, OTT Task */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedContractor(c)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-cyan-400" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => onOpenChat(c.name)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold transition cursor-pointer"
                  title="Direct Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenOttModal(`Task for ${c.name}`)}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold transition border border-purple-500/20 cursor-pointer"
                  title="Create OTT Task"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => showToast(`Opening Ledger for ${c.name}`)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold transition border border-emerald-500/20 cursor-pointer"
              >
                Ledger &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CONTRACTOR PROFILE MODAL */}
      {selectedContractor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-purple-400">
                  {selectedContractor.id}
                </span>
                <h3 className="text-base font-black text-white">{selectedContractor.name}</h3>
                <div className="text-xs text-slate-400">{selectedContractor.serviceType}</div>
              </div>

              <button
                onClick={() => setSelectedContractor(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">Contact Person:</span>{' '}
                  <span className="text-white font-semibold">{selectedContractor.contactPerson}</span>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>{' '}
                  <span className="text-emerald-400 font-mono">{selectedContractor.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500">GST Registration:</span>{' '}
                  <span className="text-slate-200 font-mono">{selectedContractor.gstNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">PAN Number:</span>{' '}
                  <span className="text-slate-200 font-mono">{selectedContractor.panNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">Payment Terms:</span>{' '}
                  <span className="text-slate-200">{selectedContractor.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-slate-500">Rating:</span>{' '}
                  <span className="text-amber-400 font-bold">{selectedContractor.rating} / 5.0</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const name = selectedContractor.name;
                  setSelectedContractor(null);
                  onOpenChat(name);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                Open RZ Chat
              </button>
              <button
                onClick={() => {
                  const name = selectedContractor.name;
                  setSelectedContractor(null);
                  onOpenOttModal(`Contractor assignment for ${name}`);
                }}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Assign OTT Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CONTRACTOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-emerald-400" />
                <span>Register Specialist Contractor</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContractor} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contractor / Trade Name *</label>
                  <input
                    type="text"
                    required
                    value={newC.name}
                    onChange={(e) => setNewC({ ...newC, name: e.target.value })}
                    placeholder="e.g. Canara Heavy Haulers"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Service Type</label>
                  <input
                    type="text"
                    value={newC.serviceType}
                    onChange={(e) => setNewC({ ...newC, serviceType: e.target.value })}
                    placeholder="e.g. Drilling, Hauling, Masonry"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newC.contactPerson}
                    onChange={(e) => setNewC({ ...newC, contactPerson: e.target.value })}
                    placeholder="e.g. Dayanand Shetty"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newC.phone}
                    onChange={(e) => setNewC({ ...newC, phone: e.target.value })}
                    placeholder="+91 99000 XXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">GST Number</label>
                  <input
                    type="text"
                    value={newC.gstNumber}
                    onChange={(e) => setNewC({ ...newC, gstNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contract Value (₹)</label>
                  <input
                    type="number"
                    value={newC.contractValue}
                    onChange={(e) => setNewC({ ...newC, contractValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Office / Base Address</label>
                <textarea
                  rows={2}
                  value={newC.address}
                  onChange={(e) => setNewC({ ...newC, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Save Contractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
