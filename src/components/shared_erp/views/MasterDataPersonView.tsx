import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Landmark,
  CreditCard,
  Building2,
  Truck,
  Layers,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Clock,
  X,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { MasterPerson, PersonRoleType } from '../types';
import { MOCK_MASTER_PEOPLE } from '../data/erpMasterData';

interface MasterDataPersonViewProps {
  onOpenChatWithPerson?: (personName: string) => void;
  onCreateTaskForPerson?: (personName: string) => void;
}

export const MasterDataPersonView: React.FC<MasterDataPersonViewProps> = ({
  onOpenChatWithPerson,
  onCreateTaskForPerson
}) => {
  const [people, setPeople] = useState<MasterPerson[]>(MOCK_MASTER_PEOPLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedPerson, setSelectedPerson] = useState<MasterPerson | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPerson, setNewPerson] = useState<Partial<MasterPerson>>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    relationships: ['CUSTOMER'],
    primaryRole: 'CUSTOMER',
    status: 'ACTIVE'
  });

  const ALL_ROLES: { id: PersonRoleType; label: string }[] = [
    { id: 'CUSTOMER', label: 'Customer' },
    { id: 'SUPPLIER', label: 'Supplier' },
    { id: 'STAFF', label: 'Staff' },
    { id: 'PARTNER', label: 'Quarry / Crusher Partner' },
    { id: 'INVESTOR', label: 'Equity Investor' },
    { id: 'LAND_OWNER', label: 'Land Owner (Lessor)' },
    { id: 'VEHICLE_OWNER', label: 'Attached Vehicle Owner' },
    { id: 'DRIVER', label: 'Commercial Driver' },
    { id: 'CONTRACTOR', label: 'Subcontractor' },
    { id: 'SERVICE_PROVIDER', label: 'Service Provider' }
  ];

  const filteredPeople = useMemo(() => {
    return people.filter(p => {
      if (selectedRoleFilter !== 'ALL' && !p.relationships.includes(selectedRoleFilter as PersonRoleType)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.fullName.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.relationships.some(r => r.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [people, selectedRoleFilter, searchQuery]);

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.fullName || !newPerson.phone) return;

    const created: MasterPerson = {
      id: `PER-${String(people.length + 1).padStart(3, '0')}`,
      fullName: newPerson.fullName,
      phone: newPerson.phone,
      email: newPerson.email || 'user@example.com',
      address: newPerson.address || 'Kerala State, India',
      relationships: newPerson.relationships && newPerson.relationships.length > 0 ? newPerson.relationships : ['CUSTOMER'],
      primaryRole: (newPerson.relationships?.[0] as PersonRoleType) || 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: 'Today',
      totalReceivable: 0,
      totalPayable: 0
    };

    setPeople([created, ...people]);
    setIsAddModalOpen(false);
    setSelectedPerson(created);
  };

  const toggleNewRole = (role: PersonRoleType) => {
    const current = newPerson.relationships || [];
    if (current.includes(role)) {
      if (current.length > 1) {
        setNewPerson({ ...newPerson, relationships: current.filter(r => r !== role) });
      }
    } else {
      setNewPerson({ ...newPerson, relationships: [...current, role] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              MASTER DATA CORE
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              STRICT SINGLE PROFILE ARCHITECTURE
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Unified Master Person Registry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            A single conceptual person profile holds multiple enterprise relationships (Customer, Supplier, Quarry Partner, Vehicle Owner, Land Owner, Staff, Investor). <strong>Zero entity duplication</strong> across platforms.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Master Person</span>
        </button>
      </div>

      {/* Search & Role Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, relationship..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="text-xs font-mono text-slate-400">
            Showing <strong className="text-white">{filteredPeople.length}</strong> master profiles
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedRoleFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            All Relationships
          </button>
          {ALL_ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRoleFilter(r.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer border ${
                selectedRoleFilter === r.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeople.map(person => (
          <div
            key={person.id}
            onClick={() => setSelectedPerson(person)}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-lg transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black flex items-center justify-center font-mono text-sm shrink-0">
                    {person.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition">
                      {person.fullName}
                    </h3>
                    <div className="text-[10px] text-slate-500 font-mono">{person.id}</div>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                  {person.status}
                </span>
              </div>

              {/* Relationship Badges (Zero Duplicate Person, Multi-Role) */}
              <div className="flex flex-wrap gap-1">
                {person.relationships.map(rel => (
                  <span
                    key={rel}
                    className="text-[9px] px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 border border-slate-800 font-mono uppercase font-bold"
                  >
                    {rel.replace('_', ' ')}
                  </span>
                ))}
              </div>

              {/* Contact info */}
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{person.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{person.email}</span>
                </div>
                <div className="flex items-center gap-2 truncate text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">{person.address}</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger Balance Snippet */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Receivable:</span>
                <span className="text-cyan-400 font-bold">₹{person.totalReceivable?.toLocaleString() || '0'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Payable:</span>
                <span className="text-rose-400 font-bold">₹{person.totalPayable?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Person Detail Drawer */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black flex items-center justify-center text-lg font-mono">
                  {selectedPerson.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedPerson.fullName}</h3>
                  <div className="text-xs text-slate-500 font-mono">ID: {selectedPerson.id} &bull; Member since {selectedPerson.createdAt}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPerson(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cross-Platform Communication Triggers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenChatWithPerson?.(selectedPerson.fullName)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open in RZ® Chat</span>
              </button>
              <button
                onClick={() => onCreateTaskForPerson?.(selectedPerson.fullName)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Assign OTT Task</span>
              </button>
            </div>

            {/* Active Relationships in the Ecosystem */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Active Roles in Ecosystem
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPerson.relationships.map(rel => (
                  <span
                    key={rel}
                    className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold"
                  >
                    {rel.replace('_', ' ')}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                This person holds multiple active roles. Invoices will automatically route to Customer Ledger, equipment trips to Vehicle Owner Settlement, and pit royalty to Land Concession Settlement.
              </p>
            </div>

            {/* Identification & Tax Details */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Official Credentials
              </span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="text-white font-bold">{selectedPerson.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-white">{selectedPerson.email}</span>
                </div>
                {selectedPerson.gstin && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">GSTIN:</span>
                    <span className="text-amber-400 font-bold">{selectedPerson.gstin}</span>
                  </div>
                )}
                {selectedPerson.panNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">PAN:</span>
                    <span className="text-white">{selectedPerson.panNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-slate-900">
                  <span className="text-slate-500">Address:</span>
                  <span className="text-slate-300 text-right max-w-xs">{selectedPerson.address}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            {selectedPerson.bankDetails && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                  Disbursement Bank Account
                </span>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank:</span>
                    <span className="text-white font-bold">{selectedPerson.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account:</span>
                    <span className="text-amber-300">{selectedPerson.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">IFSC:</span>
                    <span className="text-slate-400">{selectedPerson.bankDetails.ifsc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Branch:</span>
                    <span className="text-slate-400">{selectedPerson.bankDetails.branch}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedPerson.notes && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
                  Operational Notes:
                </span>
                {selectedPerson.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Master Person Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Add Master Person (Single Profile)</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePerson} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newPerson.fullName || ''}
                  onChange={e => setNewPerson({ ...newPerson, fullName: e.target.value })}
                  placeholder="e.g. K. V. Sankaranarayanan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={newPerson.phone || ''}
                    onChange={e => setNewPerson({ ...newPerson, phone: e.target.value })}
                    placeholder="+91 98470 12345"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newPerson.email || ''}
                    onChange={e => setNewPerson({ ...newPerson, email: e.target.value })}
                    placeholder="person@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assign Relationships (Select all that apply) *</label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {ALL_ROLES.map(r => {
                    const isChecked = newPerson.relationships?.includes(r.id);
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => toggleNewRole(r.id)}
                        className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                          isChecked
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Address / Site Location</label>
                <input
                  type="text"
                  value={newPerson.address || ''}
                  onChange={e => setNewPerson({ ...newPerson, address: e.target.value })}
                  placeholder="Town, District, Kerala"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  Save Master Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
