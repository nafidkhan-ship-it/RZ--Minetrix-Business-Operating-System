import React, { useState } from 'react';
import {
  ArrowLeft,
  Pickaxe,
  MapPin,
  FileText,
  Truck,
  Users,
  Layers,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Printer,
  Download,
  Plus,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  QuarryItem,
  LandParcel,
  LandOwnerProfile,
  QuarryPartner,
  QuarryAgreement,
  WorkingArea,
  ProductionEntry,
  QuarryLoad,
  QuarrySale,
  QuarryExpense,
  SettlementRecord,
  QuarryDocument
} from '../../data/quarryStudioData';

interface QuarryProfileViewProps {
  quarry: QuarryItem;
  parcels: LandParcel[];
  owners: LandOwnerProfile[];
  partners: QuarryPartner[];
  agreements: QuarryAgreement[];
  workingAreas: WorkingArea[];
  productions: ProductionEntry[];
  loads: QuarryLoad[];
  sales: QuarrySale[];
  expenses: QuarryExpense[];
  settlements: SettlementRecord[];
  documents: QuarryDocument[];
  onBackToList: () => void;
  onOpenQuickAction: (action: string) => void;
}

export type ProfileTab =
  | 'Overview'
  | 'Land'
  | 'Owners'
  | 'Partners'
  | 'Agreements'
  | 'Working Areas'
  | 'Production'
  | 'Loads'
  | 'Sales'
  | 'Expenses'
  | 'Settlements'
  | 'Documents'
  | 'Reports';

export const QuarryProfileView: React.FC<QuarryProfileViewProps> = ({
  quarry,
  parcels,
  owners,
  partners,
  agreements,
  workingAreas,
  productions,
  loads,
  sales,
  expenses,
  settlements,
  documents,
  onBackToList,
  onOpenQuickAction
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Overview');

  // Filter contextual to this quarry
  const quarryParcels = parcels.filter((p) => p.quarryId === quarry.id);
  const quarryAgreements = agreements.filter((a) => a.quarryId === quarry.id);
  const quarryWorkingAreas = workingAreas.filter((w) => w.quarryId === quarry.id);
  const quarryProductions = productions.filter((p) => p.quarryId === quarry.id);
  const quarryLoads = loads.filter((l) => l.quarryId === quarry.id);
  const quarryExpenses = expenses.filter((e) => e.quarryId === quarry.id);
  const quarryDocuments = documents.filter((d) => d.quarryName.includes(quarry.name.split(' ')[0]));

  const TABS: ProfileTab[] = [
    'Overview',
    'Land',
    'Owners',
    'Partners',
    'Agreements',
    'Working Areas',
    'Production',
    'Loads',
    'Sales',
    'Expenses',
    'Settlements',
    'Documents',
    'Reports'
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToList}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Quarries</span>
        </button>

        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
          CONCESSION DOSSIER &bull; {quarry.code}
        </span>
      </div>

      {/* Quarry Profile Header (Section 5) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Pickaxe className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {quarry.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    quarry.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}
                >
                  {quarry.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Material: {quarry.material}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white">{quarry.name}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {quarry.location}, {quarry.district}, {quarry.state} &bull; {quarry.businessName}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions for Profile (Section 5) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenQuickAction('new-load')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 flex items-center gap-1 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Load</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('production-entry')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 flex items-center gap-1"
            >
              <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Production</span>
            </button>
            <button
              onClick={() => alert(`Printing Dossier for ${quarry.name} (Simulation)`)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert(`Exporting JSON/CSV for ${quarry.name} (Simulation)`)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              title="Export Data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Spec Ribbon */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Concession</span>
            <span className="font-mono text-white font-bold">{quarry.totalLandAreaAcres} Acres</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Benches</span>
            <span className="font-mono text-white font-bold">{quarry.workingAreasCount} Faces</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Daily Target</span>
            <span className="font-mono text-amber-400 font-bold">{quarry.dailyCapacity}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Pit Stock</span>
            <span className="font-mono text-emerald-400 font-bold">{quarry.pitStock}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">DMG Permit</span>
            <span className="font-mono text-slate-300 truncate block">{quarry.permitNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Permit Expiry</span>
            <span className="font-mono text-slate-300 font-bold">{quarry.permitExpiryDate}</span>
          </div>
        </div>
      </div>

      {/* 13 NAVIGATION TABS (Section 5) */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-1 text-xs">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Permit & Compliance</span>
                <div className="text-sm font-bold text-white">{quarry.permitType}</div>
                <div className="text-xs text-slate-400 font-mono">Permit #: {quarry.permitNumber}</div>
                <div className="text-xs text-emerald-400 font-semibold">Valid until {quarry.permitExpiryDate}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Site Supervision</span>
                <div className="text-sm font-bold text-white">{quarry.contactPerson}</div>
                <div className="text-xs text-slate-400 font-mono">{quarry.contactPhone}</div>
                <div className="text-xs text-amber-400 font-semibold">Authorized Weighbridge Staff on duty</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Production Velocity</span>
                <div className="text-sm font-bold text-white">{quarry.todayProduction} extracted today</div>
                <div className="text-xs text-slate-400 font-mono">Month To Date: {quarry.monthProduction}</div>
                <div className="text-xs text-cyan-400 font-semibold">Available Stock: {quarry.pitStock}</div>
              </div>
            </div>

            {/* Quick summary of working areas */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Assigned Working Areas & Excavation Benches
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quarryWorkingAreas.map((wa) => (
                  <div key={wa.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{wa.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {wa.status}
                      </span>
                    </div>
                    <div className="text-slate-400">
                      Parcels: <span className="text-amber-300 font-mono">{wa.parcelSurveys}</span>
                    </div>
                    <div className="text-slate-400">
                      Land Owner: <span className="text-white font-medium">{wa.ownerNames}</span>
                    </div>
                    <div className="text-slate-400">
                      Yield Reserve: <span className="text-emerald-400 font-mono font-bold">{wa.estimatedYield}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LAND */}
        {activeTab === 'Land' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Land Parcels Demarcated for {quarry.name}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Parcel ID</th>
                    <th className="py-2.5 px-3">Survey Number</th>
                    <th className="py-2.5 px-3">Subdivision</th>
                    <th className="py-2.5 px-3">Registered Owner</th>
                    <th className="py-2.5 px-3">Extent</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {quarryParcels.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{p.id}</td>
                      <td className="py-2.5 px-3 font-mono text-white font-bold">{p.surveyNumber}</td>
                      <td className="py-2.5 px-3 text-slate-400">{p.subdivision}</td>
                      <td className="py-2.5 px-3 text-white">{p.ownerName}</td>
                      <td className="py-2.5 px-3 font-mono">
                        {p.extent} {p.unit}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: OWNERS */}
        {activeTab === 'Owners' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Associated Land Owners & Royalty Profiles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {owners.slice(0, 2).map((o) => (
                <div key={o.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{o.name}</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {o.totalParcels} Parcels
                    </span>
                  </div>
                  <div className="text-slate-400">Phone: {o.phone}</div>
                  <div className="text-slate-400 font-mono">Outstanding Due: ₹{o.outstandingBalance.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PARTNERS */}
        {activeTab === 'Partners' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Quarry Equity & Profit Partners (Independently Configured)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Partner</th>
                    <th className="py-2.5 px-3">Investment (₹)</th>
                    <th className="py-2.5 px-3">Ownership %</th>
                    <th className="py-2.5 px-3">Profit %</th>
                    <th className="py-2.5 px-3">Loss %</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {partners.map((pt) => (
                    <tr key={pt.id}>
                      <td className="py-2.5 px-3 text-white font-bold">{pt.name}</td>
                      <td className="py-2.5 px-3 font-mono">₹{pt.investmentAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{pt.ownershipPercent}%</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{pt.profitPercent}%</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-400">{pt.lossPercent}%</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                          {pt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AGREEMENTS */}
        {activeTab === 'Agreements' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Executed Land & Mining Agreements
            </h3>
            <div className="space-y-3">
              {quarryAgreements.map((agr) => (
                <div key={agr.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400 text-sm">{agr.agreementNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {agr.type}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    Owner: <span className="text-white font-bold">{agr.ownerName}</span> &bull; Parcels:{' '}
                    <span className="text-amber-300 font-mono">{agr.parcelSurveys}</span>
                  </div>
                  <div className="text-slate-400">
                    {agr.type === 'Per Load' && `Royalty: ₹${agr.ratePerLoad} / load &bull; Advance: ₹${agr.advanceAmount.toLocaleString()}`}
                    {agr.type === 'Mining & Return' && `Agreed Amount: ₹${agr.agreedMiningAmount?.toLocaleString()} &bull; Period: ${agr.miningPeriodMonths} Months`}
                    {agr.type === 'Land Purchase' && `Purchase Consideration: ₹${agr.totalAmount?.toLocaleString()}`}
                    {agr.type === 'Hybrid / Custom' && `Custom Formula: ${agr.customRules}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: WORKING AREAS */}
        {activeTab === 'Working Areas' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Working Areas (Connects Quarry &rarr; Parcel &rarr; Owner &rarr; Agreement)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {quarryWorkingAreas.map((w) => (
                <div key={w.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{w.name}</span>
                    <span className="font-mono text-xs text-amber-400">{w.code}</span>
                  </div>
                  <p className="text-slate-400">Parcels: {w.parcelSurveys}</p>
                  <p className="text-slate-400">Agreement: {w.agreementNumbers}</p>
                  <div className="text-emerald-400 font-mono font-bold">Estimated Yield: {w.estimatedYield}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PRODUCTION */}
        {activeTab === 'Production' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Production Extraction Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Bench</th>
                    <th className="py-2.5 px-3">Material</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Shift</th>
                    <th className="py-2.5 px-3">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {quarryProductions.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-mono">{p.date}</td>
                      <td className="py-2.5 px-3 text-white">{p.workingAreaName}</td>
                      <td className="py-2.5 px-3 text-amber-300">{p.material}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{p.shift}</td>
                      <td className="py-2.5 px-3 text-slate-300">{p.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: LOADS */}
        {activeTab === 'Loads' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Dispatched Pit Loads
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Load No</th>
                    <th className="py-2.5 px-3">Vehicle</th>
                    <th className="py-2.5 px-3">Material</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {quarryLoads.map((l) => (
                    <tr key={l.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{l.loadNumber}</td>
                      <td className="py-2.5 px-3 font-mono">{l.vehicleNumber}</td>
                      <td className="py-2.5 px-3 text-amber-300">
                        {l.quantity} {l.unit}
                      </td>
                      <td className="py-2.5 px-3 text-white">{l.customerName}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                        ₹{l.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: SALES */}
        {activeTab === 'Sales' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Commercial Sales & Invoices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {sales.slice(0, 4).map((s) => (
                <div key={s.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{s.invoiceNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                      {s.status}
                    </span>
                  </div>
                  <div className="text-white font-bold">{s.customerName}</div>
                  <div className="text-slate-400 font-mono">
                    Total: ₹{s.totalAmount.toLocaleString()} &bull; Balance: ₹{s.balanceAmount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: EXPENSES */}
        {activeTab === 'Expenses' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Operational Cost Vouchers
            </h3>
            <div className="space-y-2">
              {quarryExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{exp.description}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {exp.category} &bull; {exp.voucherNumber} &bull; {exp.date}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-rose-400 text-sm">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: SETTLEMENTS */}
        {activeTab === 'Settlements' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Settlements & Payouts for {quarry.name}
            </h3>
            <div className="space-y-3">
              {settlements.map((set) => (
                <div key={set.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{set.settlementNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                      {set.status}
                    </span>
                  </div>
                  <div className="text-white font-bold">{set.beneficiaryName}</div>
                  <div className="text-slate-400 font-mono">
                    Payable: ₹{set.payableAmount.toLocaleString()} &bull; Paid: ₹{set.paidAmount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 12: DOCUMENTS */}
        {activeTab === 'Documents' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Legal, Permits & Environmental Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {quarryDocuments.map((doc) => (
                <div key={doc.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate">{doc.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
                      {doc.fileFormat}
                    </span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">{doc.documentNumber}</div>
                  <div className="text-amber-400 text-[11px] font-mono font-bold">{doc.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 13: REPORTS */}
        {activeTab === 'Reports' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Concession Audit Reports
            </h3>
            <p className="text-xs text-slate-400">
              Generate production reconciliation, partner net profit calculations, and royalty disbursement statements.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => alert('Generating Daily Production Summary')}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-amber-400 text-slate-300"
              >
                <div className="font-bold text-white">Daily Production</div>
                <div className="text-[10px] text-slate-500">Cut stones & MT tally</div>
              </button>
              <button
                onClick={() => alert('Generating Land Owner Statement')}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-amber-400 text-slate-300"
              >
                <div className="font-bold text-white">Owner Royalty</div>
                <div className="text-[10px] text-slate-500">Extracted loads vs rate</div>
              </button>
              <button
                onClick={() => alert('Generating Net Profit / Loss Statement')}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-amber-400 text-slate-300"
              >
                <div className="font-bold text-white">Profit & Loss</div>
                <div className="text-[10px] text-slate-500">Revenue minus pit costs</div>
              </button>
              <button
                onClick={() => alert('Generating Partner Dividend Distribution')}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-amber-400 text-slate-300"
              >
                <div className="font-bold text-white">Partner Payouts</div>
                <div className="text-[10px] text-slate-500">Per partner equity %</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
