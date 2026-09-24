import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Package,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Receipt,
  QrCode,
  FileText
} from 'lucide-react';
import { CommerceSubTab } from '../types';
import {
  MOCK_COMMERCE_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_SUPPLIERS,
  MOCK_SALES_ORDERS,
  MOCK_PURCHASE_ORDERS,
  MOCK_INVOICES,
  MOCK_GATE_PASSES
} from '../commerceMockData';

interface CommerceDashboardViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onOpenNewProductModal: () => void;
  onOpenFlowModal: () => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const CommerceDashboardView: React.FC<CommerceDashboardViewProps> = ({
  onNavigateTab,
  onOpenNewProductModal,
  onOpenFlowModal,
  onToast,
  onOpenPrintModal
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Executive Operations Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                RZ&reg; MINETRIX ERP Core &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Commerce, Procurement, Trade &amp; Multi-Platform Fulfillment Hub
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Centrally drives material catalogs, tier-based dynamic pricing, customer CRM, vendor SRM, automated 8-stage procurement, dispatch logistics, tax invoicing, and ledger settlements across all 10 RZ® MINETRIX platforms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenFlowModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 6 Studio Flows</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>16 Commerce Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Analytical Trends: Sales vs Purchase & Receivables vs Payables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card A: Revenue & Procurement Pulse */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Commercial Trade Velocity</h3>
                <p className="text-[11px] text-slate-400">Monthly Sales (₹84.6L) vs Procurement (₹46.2L)</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              FEB 2026
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Sales Dispatches (Aggregates &amp; Stone)</span>
                <span className="font-mono font-bold text-emerald-400">₹84,60,000 (64.7%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Purchase Inflows (Diesel, Liners, Tyres)</span>
                <span className="font-mono font-bold text-amber-400">₹46,20,000 (35.3%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Gross Trade Margin</span>
                <span className="text-xs font-mono font-bold text-emerald-400">45.4%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Avg Order Value</span>
                <span className="text-xs font-mono font-bold text-white">₹1,42,000</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Fulfillment SLA</span>
                <span className="text-xs font-mono font-bold text-cyan-400">4.2 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card B: Receivables vs Payables */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Working Capital Exposure</h3>
                <p className="text-[11px] text-slate-400">Debtors Receivables vs Creditors Payables</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('customer-ledger')}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ledgers</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[11px] text-amber-300 font-bold block">Trade Receivables</span>
              <span className="text-lg font-mono font-black text-white mt-1 block">₹34,22,000</span>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                <span>Current: ₹29.8L</span>
                <span className="text-rose-400 font-bold">Overdue: ₹4.4L</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[11px] text-purple-300 font-bold block">Trade Payables</span>
              <span className="text-lg font-mono font-black text-white mt-1 block">₹18,65,000</span>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                <span>Due 15D: ₹12.5L</span>
                <span className="text-emerald-400 font-bold">Safe Buffer</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400">Net Trade Liquidity Position:</span>
            <span className="font-mono font-black text-emerald-400">+₹15,57,000 Positive</span>
          </div>
        </div>
      </div>

      {/* 3. Operational Matrices: Top Products, Top Customers & Low Stock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Col 1: Top Moving Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Top Material Movement</span>
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              Catalog
            </button>
          </div>

          <div className="space-y-2.5">
            {MOCK_COMMERCE_PRODUCTS.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigateTab('products')}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{prod.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Stock: {prod.currentStock.toLocaleString()} {prod.unit}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                  ₹{prod.salesRate}/{prod.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Top Customer Accounts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Key Accounts (CRM)</span>
            </h3>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-[11px] text-blue-400 hover:underline cursor-pointer"
            >
              All Clients
            </button>
          </div>

          <div className="space-y-2.5">
            {MOCK_CUSTOMERS.map((cust) => (
              <div
                key={cust.id}
                onClick={() => onNavigateTab('customers')}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{cust.businessName}</p>
                  <p className="text-[10px] text-slate-400">{cust.customerType} &bull; {cust.state}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    {cust.outstandingReceivable > 0 ? `₹${(cust.outstandingReceivable / 100000).toFixed(1)}L` : 'Settled'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">Outstanding</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Low Stock & Reorder Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Reorder &amp; Risk Alerts</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              3 ACTION ITEMS
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-rose-300">Crusher Mantle Spares</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-200">STOCK: 4</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Reorder threshold is 2 units. Lead time from Sandvik Peenya is 14 days.</p>
              <button
                onClick={() => onNavigateTab('purchase-requests')}
                className="mt-2 text-[10px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                + Create Emergency Purchase Request
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-amber-300">Plastering Sand (P-Sand)</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">1,840 MT</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">High weekend demand anticipated for Kochi KINFRA precast project.</p>
              <button
                onClick={() => onNavigateTab('orders')}
                className="mt-2 text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Schedule Crusher Shift Overtime
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Operational Dispatch & Gate Pass Monitor */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Live Weighbridge Dispatch &amp; Gate Pass Queue</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Direct telemetry from Quarry Pithead, Crusher Weighbridges &amp; Central Bulk Fuel Dispenser
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('gate-pass')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <span>View All Gate Passes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOCK_GATE_PASSES.map((gp) => (
            <div
              key={gp.id}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/70 hover:border-amber-500/40 transition space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-amber-400">{gp.gatePassNumber}</span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  gp.status === 'CLEARED_GATE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {gp.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">{gp.partyName}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{gp.productName} ({gp.quantity} {gp.unit})</p>
              </div>
              <div className="pt-1 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Vehicle: <strong className="text-white">{gp.vehicleNumber}</strong></span>
                <span>{gp.dateTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
