import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  FileText,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  ArrowRight,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import {
  LandOwnerProfile,
  LandParcel,
  QuarryAgreement,
  QuarryLoad,
  SettlementRecord
} from '../../data/quarryStudioData';

interface QuarryOwnersViewProps {
  owners: LandOwnerProfile[];
  parcels: LandParcel[];
  agreements: QuarryAgreement[];
  loads: QuarryLoad[];
  settlements: SettlementRecord[];
  onOpenAddOwnerModal: () => void;
  onOpenSettlementModal: (owner: LandOwnerProfile) => void;
}

export const QuarryOwnersView: React.FC<QuarryOwnersViewProps> = ({
  owners,
  parcels,
  agreements,
  loads,
  settlements,
  onOpenAddOwnerModal,
  onOpenSettlementModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwnerForAccount, setSelectedOwnerForAccount] = useState<LandOwnerProfile | null>(null);

  const filteredOwners = owners.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If viewing an account dossier (Section 16)
  if (selectedOwnerForAccount) {
    const ownerParcels = parcels.filter((p) => p.ownerId === selectedOwnerForAccount.id);
    const ownerAgreements = agreements.filter((a) => a.ownerId === selectedOwnerForAccount.id);
    const ownerLoads = loads.filter((l) => l.ownerId === selectedOwnerForAccount.id);
    const ownerSettlements = settlements.filter((s) => s.beneficiaryName.includes(selectedOwnerForAccount.name.split(' ')[0]));

    const grossPayable = selectedOwnerForAccount.advancePaid + selectedOwnerForAccount.outstandingBalance;

    return (
      <div className="space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedOwnerForAccount(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <span>&larr; Back to Land Owners Directory</span>
          </button>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            LAND OWNER ACCOUNT LEDGER &bull; {selectedOwnerForAccount.id}
          </span>
        </div>

        {/* Section 16: LAND OWNER ACCOUNT Dossier */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{selectedOwnerForAccount.id}</span>
                  {selectedOwnerForAccount.isAlsoPartner && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      ALSO A QUARRY PARTNER (25%)
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white">{selectedOwnerForAccount.name}</h2>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Phone: {selectedOwnerForAccount.phone}</span>
                  <span>&bull;</span>
                  <span>PAN: {selectedOwnerForAccount.panNumber}</span>
                </div>
                <div className="text-[11px] text-slate-500">{selectedOwnerForAccount.bankDetails}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSettlementModal(selectedOwnerForAccount)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>+ Disburse Settlement</span>
              </button>
              <button
                onClick={() => alert(`Generating Official Landowner Statement for ${selectedOwnerForAccount.name}`)}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                title="Print Statement"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Account Metric Cards (Section 16 exact specification) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Load Count</span>
              <span className="text-2xl font-black text-white font-mono">{selectedOwnerForAccount.loadCount}</span>
              <span className="text-[10px] text-slate-500 block">Extracted Loads</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Royalty Payable</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                ₹{grossPayable.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-amber-500/80 block">Accrued Volume Value</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Advance Adjusted</span>
              <span className="text-xl font-black text-cyan-400 font-mono">
                ₹{selectedOwnerForAccount.advancePaid.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-cyan-500/80 block">Opening Consideration</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Paid to Date</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                ₹{selectedOwnerForAccount.totalPaid.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-500/80 block">Bank RTGS Transfers</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Outstanding Due</span>
              <span className="text-xl font-black text-rose-400 font-mono">
                ₹{selectedOwnerForAccount.outstandingBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-rose-400/80 block">Current Balance Payable</span>
            </div>
          </div>

          {/* Connected Land Parcels & Agreements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Owned Land Parcels ({ownerParcels.length})
              </span>
              <div className="space-y-2 text-xs">
                {ownerParcels.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white font-mono">{p.surveyNumber}</div>
                      <div className="text-[11px] text-slate-400">{p.location} &bull; {p.subdivision}</div>
                    </div>
                    <span className="font-mono text-amber-300 font-bold">{p.extent} {p.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Active Royalty Agreements ({ownerAgreements.length})
              </span>
              <div className="space-y-2 text-xs">
                {ownerAgreements.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold">{a.agreementNumber}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {a.type}
                      </span>
                    </div>
                    <div className="text-slate-300">
                      Rate: {a.type === 'Per Load' ? `₹${a.ratePerLoad} / load` : `Agreed: ₹${a.agreedMiningAmount?.toLocaleString()}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Land Owners List
  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              PERSON MASTER
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredOwners.length} registered landowners)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Land Owners Directory</h2>
          <p className="text-xs text-slate-400">
            Reusable entity profiles. Note: Land Owner ≠ Quarry Partner. One person can hold multiple parcel deeds.
          </p>
        </div>

        <button
          onClick={onOpenAddOwnerModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Land Owner</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by owner name, phone number, address, or PAN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Land Owners Table (Section 7) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Land Owner Name</th>
                <th className="py-3.5 px-4">Contact & PAN</th>
                <th className="py-3.5 px-4">Total Parcels</th>
                <th className="py-3.5 px-4">Quarry Area</th>
                <th className="py-3.5 px-4">Agreements</th>
                <th className="py-3.5 px-4">Loads</th>
                <th className="py-3.5 px-4">Advance Paid</th>
                <th className="py-3.5 px-4">Total Paid</th>
                <th className="py-3.5 px-4">Outstanding Due</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOwners.map((owner) => (
                <tr key={owner.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{owner.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                      <span>{owner.id}</span>
                      {owner.isAlsoPartner && (
                        <span className="text-purple-400 font-bold bg-purple-500/10 px-1 rounded">
                          &bull; Both Owner & Partner
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{owner.phone}</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{owner.panNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{owner.totalParcels} Parcels</td>
                  <td className="py-3.5 px-4 font-mono text-white">{owner.totalQuarryAreaAcres} Acres</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{owner.agreementCount} Active</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{owner.loadCount}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">₹{owner.advancePaid.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    ₹{owner.totalPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400 text-sm">
                    ₹{owner.outstandingBalance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOwnerForAccount(owner)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs hover:bg-amber-500/30 transition whitespace-nowrap"
                    >
                      View Account &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
