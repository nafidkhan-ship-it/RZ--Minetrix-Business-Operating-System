import React from 'react';
import {
  Landmark,
  Users,
  MapPin,
  FileText,
  DollarSign,
  TrendingUp,
  Coins,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Calculator,
  Compass,
  Building2,
  Calendar,
  AlertCircle,
  Truck,
  Sparkles,
  Phone,
  Layers
} from 'lucide-react';
import { getLandDashboardMetrics, LandUnit, DEMO_LAND_OWNERS } from '../../../data/quarryLandData';
import { LandUnitConverter } from '../LandUnitConverter';
import { SectionId } from '../../../types/architecture';

interface LandDashboardViewProps {
  onNavigateSubpage: (pageId: string) => void;
  onOpenNewOwner: () => void;
  onOpenNewParcel: () => void;
  onOpenNewAgreement: () => void;
  onOpenAdvance: () => void;
  onOpenPayment: () => void;
  onOpenSettlement: () => void;
  onOpenUnitConverter: () => void;
  onOpenOwnerProfile: (ownerId: string) => void;
  onNavigateSection?: (sectionId: SectionId) => void;
}

export const LandDashboardView: React.FC<LandDashboardViewProps> = ({
  onNavigateSubpage,
  onOpenNewOwner,
  onOpenNewParcel,
  onOpenNewAgreement,
  onOpenAdvance,
  onOpenPayment,
  onOpenSettlement,
  onOpenUnitConverter,
  onOpenOwnerProfile,
  onNavigateSection
}) => {
  const metrics = getLandDashboardMetrics();

  return (
    <div className="space-y-6">
      {/* Studio Preview / Demo Data Banner */}
      <div className="p-4 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                QUARRY LAND LIFECYCLE PLATFORM
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Studio Preview / Demo Data
              </span>
            </div>
            <h2 className="text-base font-black text-white">
              Integrated Land Governance & Agreement Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict Principle: <strong>Land Ownership ≠ Quarry Partnership</strong> &bull; Multi-role person identity architecture.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUnitConverter}
          className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer shrink-0"
        >
          <Calculator className="w-4 h-4" />
          <span>Cadastral Unit Converter</span>
        </button>
      </div>

      {/* QUICK ACTIONS DOCK */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Quick Land Operations Action Bar</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <button
            onClick={onOpenNewOwner}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
          >
            <div className="text-purple-400 group-hover:text-purple-300 font-bold text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>New Owner</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Register Person</div>
          </button>

          <button
            onClick={onOpenNewParcel}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
          >
            <div className="text-cyan-400 group-hover:text-cyan-300 font-bold text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Parcel</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Survey & Extent</div>
          </button>

          <button
            onClick={onOpenNewAgreement}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
          >
            <div className="text-emerald-400 group-hover:text-emerald-300 font-bold text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>New Agreement</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">4 Types Engine</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('working-areas')}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
          >
            <div className="text-amber-400 group-hover:text-amber-300 font-bold text-xs flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Working Area</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Bench to Pit Link</div>
          </button>

          <button
            onClick={onOpenAdvance}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
          >
            <div className="text-yellow-400 group-hover:text-yellow-300 font-bold text-xs flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Issue Advance</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Commitment Outlay</div>
          </button>

          <button
            onClick={onOpenPayment}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
          >
            <div className="text-emerald-400 group-hover:text-emerald-300 font-bold text-xs flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">RTGS / NEFT Payout</div>
          </button>

          <button
            onClick={onOpenSettlement}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
          >
            <div className="text-purple-400 group-hover:text-purple-300 font-bold text-xs flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Run Settlement</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Load Deductions</div>
          </button>
        </div>
      </div>

      {/* 11 CORE KPI CARDS (Exact Specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigateSubpage('owners')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Total Land Owners</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {metrics.totalOwners} Registered
          </div>
          <div className="text-[11px] text-purple-400 mt-1 font-semibold flex items-center gap-1">
            <span>All KYC & Bank Verified</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('parcels')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Total Land Parcels</span>
            <Landmark className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {metrics.totalParcels} Parcels
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 font-semibold">
            {metrics.connectedParcels} Connected to Active Quarries
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('surveys')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Total Land Extent</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {metrics.totalExtentCents.toLocaleString('en-IN')} Cents
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {metrics.totalExtentAcres} Acres Total Cadastral Area
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('connections')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Active Quarry-Connected Land</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            {metrics.connectedParcels} Parcels Linked
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pit #01, Pit #02, Moodbidri, Wayanad
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('listings')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Available Land</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {metrics.availableParcels} Parcels
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Open for Purchase or Concession Lease
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('working-areas')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Active Working Areas</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {metrics.activeWorkingAreas} Active Benches
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Laterite wire-saw & granite extraction
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('agreements')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Active Agreements</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
            {metrics.activeAgreements} Executed
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Registered & Notarized Concessions
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('buyer-enquiries')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-yellow-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Pending Enquiries</span>
            <Phone className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-yellow-400 font-mono mt-1">
            {metrics.totalEnquiries} Leads
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {metrics.buyerEnquiries} Buyers &bull; {metrics.investorEnquiries} Investors
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('advances')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Owner Advances</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            ₹{metrics.totalAdvances.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            ₹{metrics.remainingAdvances.toLocaleString('en-IN')} Unadjusted
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('accounts')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-rose-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Owner Payables</span>
            <Coins className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            ₹{metrics.totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Earned: ₹{metrics.totalPayablesEarned.toLocaleString('en-IN')}
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('settlements')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Pending Settlements</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            ₹{metrics.pendingSettlement.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Reconciliation ready for approval
          </div>
        </div>

        <div
          onClick={() => onNavigateSubpage('reports')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Disbursed Payouts</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{metrics.totalPaid.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            100% Direct Bank RTGS / NEFT
          </div>
        </div>
      </div>

      {/* 4 AGREEMENT TYPES BREAKDOWN CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider font-bold">
              PORTFOLIO EXPOSURE BY COMMERCIAL MODEL
            </span>
            <h3 className="text-base font-black text-white">
              Land Agreement Engine & Value Commitments
            </h3>
          </div>
          <div className="text-xs text-slate-400">
            Total Active Agreements Commitment:{' '}
            <strong className="text-white font-mono">
              ₹{(
                metrics.agreementBreakdown.purchaseValue +
                metrics.agreementBreakdown.miningReturnValue +
                metrics.agreementBreakdown.perLoadValue +
                metrics.agreementBreakdown.hybridValue
              ).toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            onClick={() => onNavigateSubpage('purchase-agreements')}
            className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-2xl space-y-2 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">1. Land Purchase</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                {metrics.agreementBreakdown.purchaseCount} Active
              </span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              ₹{metrics.agreementBreakdown.purchaseValue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400">
              Demo sample: 1 Cent = ₹2.5 Lakh. Outright acquisition of strategic hillocks.
            </p>
          </div>

          <div
            onClick={() => onNavigateSubpage('mining-return-agreements')}
            className="p-4 bg-slate-950 border border-slate-800 hover:border-purple-500/40 rounded-2xl space-y-2 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400">2. Mining & Return</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold">
                {metrics.agreementBreakdown.miningReturnCount} Active
              </span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              ₹{metrics.agreementBreakdown.miningReturnValue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400">
              Demo sample: 1 Cent = ₹1.6 Lakh. Extract stones then level and restore ground.
            </p>
          </div>

          <div
            onClick={() => onNavigateSubpage('per-load-agreements')}
            className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-2xl space-y-2 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">3. Per-Load Concession</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold">
                {metrics.agreementBreakdown.perLoadCount} Active
              </span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              ₹{metrics.agreementBreakdown.perLoadValue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400">
              Demo sample: ₹5,000 per load dispatch. Direct weighment slip royalty.
            </p>
          </div>

          <div
            onClick={() => onNavigateSubpage('hybrid-agreements')}
            className="p-4 bg-slate-950 border border-slate-800 hover:border-yellow-500/40 rounded-2xl space-y-2 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-yellow-400">4. Hybrid / Custom</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-bold">
                {metrics.agreementBreakdown.hybridCount} Active
              </span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              ₹{metrics.agreementBreakdown.hybridValue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400">
              Base rental + ₹45/MT royalty + 10-Yr Concession with security deposit.
            </p>
          </div>
        </div>
      </div>

      {/* RECENT LAND OWNERS & INLINE UNIT CONVERTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Land Owners Highlights */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider font-bold">
                KEY CONCESSIONAIRES & TITLE HOLDERS
              </span>
              <h3 className="text-base font-black text-white">Registered Land Owners</h3>
            </div>
            <button
              onClick={() => onNavigateSubpage('owners')}
              className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All Owners</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {DEMO_LAND_OWNERS.slice(0, 4).map((owner) => (
              <div
                key={owner.id}
                onClick={() => onOpenOwnerProfile(owner.id)}
                className="p-3.5 bg-slate-950 hover:bg-slate-800/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">
                    {owner.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-xs">{owner.name}</h4>
                      <span className="font-mono text-[10px] text-purple-400 font-bold">{owner.id}</span>
                      {owner.roles.map((r, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                          {r}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {owner.totalParcels} Parcels &bull; {owner.totalExtentCents} Cents ({owner.totalExtentAcres} Ac) &bull; {owner.district}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Outstanding</div>
                  <div className="text-sm font-black text-amber-400 font-mono">
                    ₹{owner.outstandingBalanceRs.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Inline Unit Converter Card */}
        <div className="lg:col-span-1">
          <LandUnitConverter isInline={true} />
        </div>
      </div>
    </div>
  );
};
