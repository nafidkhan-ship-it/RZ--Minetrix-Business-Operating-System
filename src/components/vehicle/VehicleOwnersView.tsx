import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Truck,
  CreditCard,
  DollarSign,
  FileText,
  Scale,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import {
  VehicleOwner,
  Vehicle,
  OwnerSettlementRecord
} from '../../data/vehicleStudioData';

interface VehicleOwnersViewProps {
  owners: VehicleOwner[];
  vehicles: Vehicle[];
  settlements: OwnerSettlementRecord[];
  onSelectOwner: (owner: VehicleOwner) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenAddOwnerModal: () => void;
  onOpenSettlementModal: (owner: VehicleOwner) => void;
}

export const VehicleOwnersView: React.FC<VehicleOwnersViewProps> = ({
  owners,
  vehicles,
  settlements,
  onSelectOwner,
  onSelectVehicle,
  onOpenAddOwnerModal,
  onOpenSettlementModal
}) => {
  const [selectedOwner, setSelectedOwner] = useState<VehicleOwner | null>(owners[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOwners = owners.filter(
    (o) =>
      o.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ownerSettlements = selectedOwner
    ? settlements.filter((s) => s.ownerId === selectedOwner.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              FLEET OWNERSHIP DIRECTORY &bull; {owners.length} REGISTERED OWNERS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Vehicle Owners & Multi-Vehicle Syndicates</h2>
          <p className="text-xs text-slate-400">
            Person Relationship Model &bull; Multi-role partner capital, revenue shares and settlement ledgers
          </p>
        </div>

        <button
          onClick={onOpenAddOwnerModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Vehicle Owner</span>
        </button>
      </div>

      {/* Main Split View: Owners List on Left, Comprehensive Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Owner Cards / List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search owners by name, phone, company..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            {filteredOwners.map((owner) => {
              const isSelected = selectedOwner?.id === owner.id;
              return (
                <div
                  key={owner.id}
                  onClick={() => setSelectedOwner(owner)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{owner.personName}</h4>
                      <p className="text-[11px] text-slate-400">{owner.companyName}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {owner.vehiclesOwned.length} {owner.vehiclesOwned.length === 1 ? 'Vehicle' : 'Vehicles'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {owner.roles.map((role) => (
                      <span
                        key={role}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-500">Unsettled Balance:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{owner.currentBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Owner Profile Details */}
        {selectedOwner ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Owner Profile Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-mono text-base">
                    {selectedOwner.personCode}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">{selectedOwner.personName}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                        {selectedOwner.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedOwner.companyName}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenSettlementModal(selectedOwner)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Generate Settlement</span>
                </button>
              </div>

              {/* Person Relationship Model Callout (Item 8) */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Unified Person Relationship Model:</strong> {selectedOwner.personName} holds multiple roles across RZ MINETRIX: <strong className="text-blue-200">{selectedOwner.roles.join(', ')}</strong>. Statements automatically aggregate vehicle earnings while preventing cross-entity accounting conflicts.
                </div>
              </div>

              {/* Financial KPI Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Current Balance</div>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                    ₹{selectedOwner.currentBalance.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Total Capital Inv.</div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">
                    ₹{selectedOwner.totalInvestment.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Total Receivables</div>
                  <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                    ₹{selectedOwner.totalReceivables.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Total Payables</div>
                  <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
                    ₹{selectedOwner.totalPayables.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Contact, Banking & KYC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                    Contact & Address
                  </h4>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedOwner.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedOwner.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedOwner.address}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                    Banking & Statutory KYC
                  </h4>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Bank: <strong>{selectedOwner.bankDetails.bankName}</strong></div>
                    <div>A/C: <span className="font-mono">{selectedOwner.bankDetails.accountNumber}</span> &bull; IFSC: <span className="font-mono">{selectedOwner.bankDetails.ifscCode}</span></div>
                    <div className="pt-1 text-slate-400">PAN: <span className="font-mono text-white">{selectedOwner.panNumber}</span> &bull; Aadhar: <span className="font-mono">{selectedOwner.aadharNumber}</span></div>
                    <div className="text-amber-400 font-medium">Terms: {selectedOwner.paymentTerms}</div>
                  </div>
                </div>
              </div>

              {/* Owned Vehicles Grid (Multi-vehicle Ownership) */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
                  Vehicles Owned by {selectedOwner.personName} ({selectedOwner.vehiclesOwned.length})
                </h4>

                <div className="space-y-3">
                  {selectedOwner.vehiclesOwned.map((vo) => {
                    const matchedVehicle = vehicles.find((v) => v.id === vo.vehicleId);
                    return (
                      <div
                        key={vo.vehicleId}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-white">
                              {vo.vehicleNumber}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono">
                              {vo.vehicleCode}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-amber-400 text-xs px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
                              {vo.ownershipPercent}% Equity
                            </span>
                            {matchedVehicle && (
                              <button
                                onClick={() => onSelectVehicle(matchedVehicle)}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                title="Open Vehicle Profile"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Configured Ratios */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1 font-mono text-[11px]">
                          <div className="p-2 bg-slate-900/60 rounded-xl">
                            <span className="text-slate-500 text-[10px]">Capital Inv.</span>
                            <div className="text-white font-bold">₹{vo.investmentAmount.toLocaleString()}</div>
                          </div>
                          <div className="p-2 bg-slate-900/60 rounded-xl">
                            <span className="text-slate-500 text-[10px]">Revenue %</span>
                            <div className="text-cyan-400 font-bold">{vo.revenuePercent}%</div>
                          </div>
                          <div className="p-2 bg-slate-900/60 rounded-xl">
                            <span className="text-slate-500 text-[10px]">Expense %</span>
                            <div className="text-rose-400 font-bold">{vo.expensePercent}%</div>
                          </div>
                          <div className="p-2 bg-slate-900/60 rounded-xl">
                            <span className="text-slate-500 text-[10px]">Profit Share %</span>
                            <div className="text-emerald-400 font-bold">{vo.profitPercent}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Settlement History for Owner */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
                    Recent Settlement Records
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">{ownerSettlements.length} Settlements</span>
                </div>

                <div className="space-y-2">
                  {ownerSettlements.length === 0 ? (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                      No historical settlements generated yet. Click &quot;Generate Settlement&quot; to calculate profit shares.
                    </div>
                  ) : (
                    ownerSettlements.map((set) => (
                      <div
                        key={set.id}
                        className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">
                            {set.settlementNumber} &bull; {set.period}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Vehicle: {set.vehicleNumber} &bull; Date: {set.settlementDate}
                          </div>
                        </div>
                        <div className="sm:text-right font-mono">
                          <div className="text-amber-400 font-bold text-sm">
                            ₹{set.ownerShare.toLocaleString()}
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                            {set.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
