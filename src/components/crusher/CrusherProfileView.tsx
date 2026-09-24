import React, { useState } from 'react';
import {
  Building2,
  Users,
  Layers,
  Activity,
  DollarSign,
  Scale,
  ShoppingBag,
  Truck,
  FileText,
  ShieldCheck,
  Zap,
  Fuel,
  Wrench,
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Plus,
  BarChart3,
  Sliders,
  ExternalLink
} from 'lucide-react';
import {
  CrusherPlant,
  CrusherPartner,
  CrusherInvestment,
  MaterialReceipt,
  CrusherProduction,
  CrusherProduct,
  CrusherStockItem,
  CrusherSale,
  CrusherGateEntry,
  CrusherGatePass,
  CrusherExpense,
  CrusherPartnerSettlement,
  CrusherDocument
} from '../../data/crusherStudioData';

interface CrusherProfileViewProps {
  plant: CrusherPlant;
  partners: CrusherPartner[];
  investments: CrusherInvestment[];
  receipts: MaterialReceipt[];
  productions: CrusherProduction[];
  products: CrusherProduct[];
  stocks: CrusherStockItem[];
  sales: CrusherSale[];
  gateEntries: CrusherGateEntry[];
  gatePasses: CrusherGatePass[];
  expenses: CrusherExpense[];
  settlements: CrusherPartnerSettlement[];
  documents: CrusherDocument[];
  onBack: () => void;
  onNavigatePage: (page: string) => void;
}

export type ProfileTabId =
  | 'overview'
  | 'partners'
  | 'investment'
  | 'raw-material'
  | 'receipts'
  | 'production'
  | 'products'
  | 'stock'
  | 'wastage'
  | 'purchases'
  | 'sales'
  | 'gate-entry'
  | 'gate-pass'
  | 'expenses'
  | 'settlements'
  | 'documents'
  | 'reports';

export const CrusherProfileView: React.FC<CrusherProfileViewProps> = ({
  plant,
  partners,
  investments,
  receipts,
  productions,
  products,
  stocks,
  sales,
  gateEntries,
  gatePasses,
  expenses,
  settlements,
  documents,
  onBack,
  onNavigatePage
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview');

  const TABS: { id: ProfileTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'investment', label: 'Investments', icon: DollarSign },
    { id: 'raw-material', label: 'Raw Material', icon: Layers },
    { id: 'receipts', label: 'Receipts', icon: Scale },
    { id: 'production', label: 'Production', icon: Activity },
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'stock', label: 'Stock & Silos', icon: Building2 },
    { id: 'wastage', label: 'Wastage', icon: AlertTriangle },
    { id: 'purchases', label: 'Purchases', icon: DollarSign },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'gate-entry', label: 'Gate Entry', icon: Truck },
    { id: 'gate-pass', label: 'Gate Pass', icon: FileText },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'settlements', label: 'Settlements', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Plant Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase">
                  {plant.code} &bull; {plant.plantType}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    plant.status === 'OPERATIONAL'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {plant.status}
                </span>
              </div>
              <h1 className="text-xl font-black text-white">{plant.name}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{plant.location}, {plant.district}</span>
                <span className="text-slate-600">&bull;</span>
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{plant.contactPerson} ({plant.contactPhone})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Design Capacity</span>
              <span className="text-base font-black text-cyan-400 font-mono block">{plant.capacityTPH} TPH</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Connected Power</span>
              <span className="text-base font-black text-yellow-400 font-mono block">{plant.connectedPowerKW} KW</span>
            </div>
          </div>
        </div>

        {/* 17 Scrollable Profile Tabs */}
        <div className="border-t border-slate-800 pt-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {TABS.map(tab => {
              const isAct = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                    isAct
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Machinery Breakdown */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span>Configured Plant Machines ({plant.machineCount} Units)</span>
                </h3>
                <span className="text-xs text-cyan-400 font-mono">3-Stage Setup</span>
              </div>

              <div className="space-y-2">
                {plant.machineDetails.map((mach, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-cyan-400 text-[10px]">
                        0{idx + 1}
                      </span>
                      <span className="font-bold text-white">{mach}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                      OPERATIONAL
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance & Permit Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Statutory Clearances & CTO</span>
              </h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">CTO Permit Number</span>
                  <span className="font-mono font-bold text-cyan-400 block mt-0.5">{plant.permitNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Permit Type</span>
                  <span className="text-white block mt-0.5">{plant.permitType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Validity Horizon</span>
                  <span className="font-mono text-emerald-400 font-bold block mt-0.5">
                    {plant.permitIssueDate} to {plant.permitExpiryDate}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Consent Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                    VALID & CURRENT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. PARTNERS */}
      {activeTab === 'partners' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">EQUITY & PARTNERSHIP</span>
              <h3 className="text-base font-bold text-white">Plant Partners ({partners.length})</h3>
            </div>
            <button
              onClick={() => onNavigatePage('crusher-partners')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Manage All Partners &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map(p => (
              <div key={p.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[11px] text-slate-400">{p.phone}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-cyan-400">{p.ownershipPercent}%</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Investment</span>
                    <span className="font-mono font-bold text-white">₹{(p.totalInvestment / 100000).toFixed(1)} L</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Profit Share Ratio</span>
                    <span className="font-mono font-bold text-emerald-400">{p.profitSharePercent}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {p.roleTags.map(tag => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. INVESTMENTS */}
      {activeTab === 'investment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">CAPITAL ACCOUNT</span>
              <h3 className="text-base font-bold text-white">Investments & Capital Contributions</h3>
            </div>
            <button
              onClick={() => onNavigatePage('investments')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Capital Ledger &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Ref No</th>
                  <th className="p-3">Partner</th>
                  <th className="p-3">Investment Type</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {investments.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{inv.investmentNumber}</td>
                    <td className="p-3 font-bold text-white">{inv.partnerName}</td>
                    <td className="p-3 text-slate-300">{inv.type}</td>
                    <td className="p-3 font-mono text-slate-400">{inv.date}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{inv.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. RAW MATERIAL & RECEIPTS */}
      {(activeTab === 'raw-material' || activeTab === 'receipts') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">BOULDER INWARD WEIGHBRIDGE</span>
              <h3 className="text-base font-bold text-white">Quarry Raw Material Intake Receipts</h3>
            </div>
            <button
              onClick={() => onNavigatePage('material-receipt')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Material Receipts &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Receipt Ref</th>
                  <th className="p-3">Source Quarry / Supplier</th>
                  <th className="p-3">Material</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Net Weight</th>
                  <th className="p-3">Total Value</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {receipts.map(rcpt => (
                  <tr key={rcpt.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{rcpt.receiptNumber}</td>
                    <td className="p-3 font-bold text-white">{rcpt.sourceQuarryName}</td>
                    <td className="p-3 text-slate-200">{rcpt.material}</td>
                    <td className="p-3 font-mono text-slate-300">{rcpt.vehicleNumber}</td>
                    <td className="p-3 font-mono font-bold text-white">{rcpt.quantityTons} MT</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{rcpt.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold font-mono">
                        {rcpt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. PRODUCTION & PRODUCTS */}
      {(activeTab === 'production' || activeTab === 'products') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">CRUSHING BATCHES</span>
              <h3 className="text-base font-bold text-white">Production Batches & Multi-Deck Screen Outputs</h3>
            </div>
            <button
              onClick={() => onNavigatePage('production')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Production Module &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {productions.map(prod => (
              <div key={prod.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-xs">{prod.productionNumber}</span>
                    <span className="text-xs text-slate-400">&bull; {prod.date} &bull; {prod.shift}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    Input: {prod.inputQuantityTons} MT &rarr; Total Output: {prod.totalOutputTons} MT ({prod.crushingEfficiencyTPH} TPH)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {prod.outputs.map(out => (
                    <div key={out.productCode} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">{out.productName}</span>
                      <span className="font-mono font-bold text-white block mt-0.5">{out.quantityTons} MT</span>
                      <span className="text-[10px] text-cyan-400 font-mono block">{out.percentageOfOutput}% ({out.siloAllocation})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. STOCK */}
      {activeTab === 'stock' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">LIVE INVENTORY</span>
              <h3 className="text-base font-bold text-white">Silos & Yard Stockpiles</h3>
            </div>
            <button
              onClick={() => onNavigatePage('stock')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Stock Center &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stocks.map(stk => (
              <div key={stk.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{stk.productName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                    {stk.healthStatus}
                  </span>
                </div>
                <div className="text-xl font-black font-mono text-cyan-400">
                  {stk.closingStockTons.toLocaleString()} MT
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Location: {stk.siloOrBayLocation} &bull; Val: ₹{(stk.stockValueINR / 100000).toFixed(1)} L
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. SALES & DISPATCH */}
      {(activeTab === 'sales' || activeTab === 'gate-pass') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">COMMERCIAL ORDERS</span>
              <h3 className="text-base font-bold text-white">Aggregates Sales & Dispatched Gate Passes</h3>
            </div>
            <button
              onClick={() => onNavigatePage('sales')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Sales Registry &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Invoice No</th>
                  <th className="p-3">Customer & Project</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Rate/T</th>
                  <th className="p-3">Total Value</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{sale.invoiceNumber}</td>
                    <td className="p-3 font-bold text-white">{sale.customerName}</td>
                    <td className="p-3 text-slate-200">{sale.productName}</td>
                    <td className="p-3 font-mono text-white font-bold">{sale.quantityTons} MT</td>
                    <td className="p-3 font-mono text-slate-300">₹{sale.ratePerTon}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{sale.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                        {sale.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8. DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">PLANT COMPLIANCE</span>
              <h3 className="text-base font-bold text-white">Statutory Permits, CTO & Deeds</h3>
            </div>
            <button
              onClick={() => onNavigatePage('documents')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Document Vault &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map(doc => (
              <div key={doc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">{doc.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{doc.documentNumber} &bull; {doc.fileSize}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback for remaining tabs */}
      {activeTab !== 'overview' &&
        activeTab !== 'partners' &&
        activeTab !== 'investment' &&
        activeTab !== 'raw-material' &&
        activeTab !== 'receipts' &&
        activeTab !== 'production' &&
        activeTab !== 'products' &&
        activeTab !== 'stock' &&
        activeTab !== 'sales' &&
        activeTab !== 'gate-pass' &&
        activeTab !== 'documents' && (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
            <Building2 className="w-8 h-8 text-cyan-400 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {plant.name} &bull; {TABS.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Telemetry records and analytical parameters for this plant are synchronized with the central crusher ledger.
            </p>
            <button
              onClick={() => onNavigatePage(activeTab)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
            >
              Open Full {TABS.find(t => t.id === activeTab)?.label} Workspace
            </button>
          </div>
        )}
    </div>
  );
};
