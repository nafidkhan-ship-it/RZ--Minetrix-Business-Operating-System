import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageSquare,
  Clock,
  CreditCard,
  Building2,
  FileText,
  DollarSign,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { LandOwner, DEMO_LAND_OWNERS } from '../../../data/quarryLandData';

interface LandOwnersViewProps {
  onOpenOwnerProfile: (ownerId: string) => void;
  onOpenNewOwner: () => void;
  onOpenNewParcel: (ownerId: string) => void;
  onOpenChat: (ownerName: string, refCode: string) => void;
  onOpenOtt: (refCode: string) => void;
  onNavigateSubpage: (pageId: string) => void;
}

export const LandOwnersView: React.FC<LandOwnersViewProps> = ({
  onOpenOwnerProfile,
  onOpenNewOwner,
  onOpenNewParcel,
  onOpenChat,
  onOpenOtt,
  onNavigateSubpage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredOwners = DEMO_LAND_OWNERS.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);

    const matchesRole =
      roleFilter === 'ALL' || o.roles.includes(roleFilter as any);

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
              Platform 7 &bull; Shared Person Directory
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {DEMO_LAND_OWNERS.length} Registered
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Quarry Land Owners</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Core rule: <strong>Land Ownership ≠ Quarry Partnership</strong> &bull; Same person can be Land Owner, Partner, or Investor.
          </p>
        </div>

        <button
          onClick={onOpenNewOwner}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register Land Owner</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, phone, district..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Land Owner', 'Quarry Partner', 'Investor'].map((rf) => (
            <button
              key={rf}
              onClick={() => setRoleFilter(rf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                roleFilter === rf
                  ? 'bg-purple-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {rf}
            </button>
          ))}
        </div>
      </div>

      {/* Owners Table / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOwners.map((owner) => (
          <div
            key={owner.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-3xl transition space-y-4 shadow-lg"
          >
            {/* Top row: Avatar, Name, Roles, ID, Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-base">
                  {owner.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-purple-400">{owner.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {owner.status}
                    </span>
                    {owner.roles.map((r, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5">{owner.name}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {owner.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {owner.address}, {owner.district}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial balances */}
              <div className="flex items-center gap-4 text-right self-end sm:self-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Land</span>
                  <div className="text-sm font-black text-white font-mono">
                    {owner.totalExtentCents} Cents ({owner.totalExtentAcres} Ac)
                  </div>
                  <div className="text-[10px] text-purple-400">{owner.totalParcels} Parcels Mapped</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Outstanding</span>
                  <div className="text-sm font-black text-amber-400 font-mono">
                    ₹{owner.outstandingBalanceRs.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    ₹{owner.totalPaidReceivedRs.toLocaleString('en-IN')} Paid
                  </div>
                </div>
              </div>
            </div>

            {/* Middle row: Bank info, Connected Quarries, ID doc */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Bank Routing (Direct Payout):</span>
                <span className="text-white font-semibold">{owner.bankDetails.bankName}</span>
                <span className="text-slate-400 text-[11px] block font-mono">
                  A/C: {owner.bankDetails.accountNumber} ({owner.bankDetails.ifscCode})
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">Connected Quarries:</span>
                {owner.quarryConnections.length > 0 ? (
                  owner.quarryConnections.map((qc, i) => (
                    <div key={i} className="text-purple-300 font-medium text-[11px]">
                      &bull; {qc.quarryName} ({qc.role})
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500 text-[11px]">No active quarry link</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">Revenue / Legal Reference:</span>
                <span className="text-slate-300 text-[11px] font-mono">{owner.idDocRef}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => onOpenOwnerProfile(owner.id)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Full Profile Dossier (15 Tabs)</span>
                </button>

                <button
                  onClick={() => onOpenNewParcel(owner.id)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add Parcel</span>
                </button>

                <button
                  onClick={() => onNavigateSubpage('agreements')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Agreements ({owner.activeAgreementsCount})</span>
                </button>

                <button
                  onClick={() => onNavigateSubpage('accounts')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ledger</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenChat(owner.name, owner.id)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>

                <button
                  onClick={() => onOpenOtt(owner.id)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>OTT Task</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
