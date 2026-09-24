import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Wallet,
  Landmark,
  Users,
  Clock,
  Package,
  AlertTriangle,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building2,
  Truck,
  Layers,
  FileText,
  Activity,
  BarChart3,
  PieChart,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

interface ErpDashboardViewProps {
  onNavigateTab: (tab: any) => void;
  onOpenFlowModal: () => void;
  onQuickAction?: (actionType: string) => void;
}

export const ErpDashboardView: React.FC<ErpDashboardViewProps> = ({
  onNavigateTab,
  onOpenFlowModal,
  onQuickAction
}) => {
  // Chart selection state
  const [activeChartTab, setActiveChartTab] = useState<
    'sales-vs-purchase' | 'receivables-vs-payables' | 'cash-flow' | 'expense-breakdown' | 'monthly-revenue' | 'monthly-profit'
  >('sales-vs-purchase');

  // Activity feed selection state
  const [activeActivityTab, setActiveActivityTab] = useState<
    'sales' | 'purchases' | 'payments' | 'expenses' | 'staff'
  >('sales');

  // 10 Mandatory KPI Cards according to Brief
  const MANDATORY_KPIS = [
    {
      id: 'total-sales',
      title: 'Total Sales',
      value: '₹42,85,000',
      change: '+18.4% vs last mo',
      trend: 'up',
      subtitle: 'Laterite, aggregates & M-sand',
      icon: TrendingUp,
      color: 'text-amber-400',
      targetTab: 'sales'
    },
    {
      id: 'total-purchase',
      title: 'Total Purchase',
      value: '₹18,40,000',
      change: '14 POs cleared',
      trend: 'up',
      subtitle: 'Diesel, spares, dynamite',
      icon: ShoppingBag,
      color: 'text-emerald-400',
      targetTab: 'purchase'
    },
    {
      id: 'receivables',
      title: 'Receivables',
      value: '₹34,60,000',
      change: '18 active debtors',
      trend: 'warning',
      subtitle: 'Avg DSO: 34 days',
      icon: CreditCard,
      color: 'text-cyan-400',
      targetTab: 'debtors'
    },
    {
      id: 'payables',
      title: 'Payables',
      value: '₹18,20,000',
      change: '12 active vendors',
      trend: 'warning',
      subtitle: 'DPO: 28 days',
      icon: DollarSign,
      color: 'text-rose-400',
      targetTab: 'creditors'
    },
    {
      id: 'cash-balance',
      title: 'Cash Balance',
      value: '₹8,45,200',
      change: 'Pit head + Weighbridge',
      trend: 'up',
      subtitle: 'Daily closing reconciled',
      icon: Wallet,
      color: 'text-yellow-400',
      targetTab: 'cash'
    },
    {
      id: 'bank-balance',
      title: 'Bank Balance',
      value: '₹42,80,450',
      change: 'HDFC & SBI accounts',
      trend: 'up',
      subtitle: 'Cleared treasury liquidity',
      icon: Landmark,
      color: 'text-blue-400',
      targetTab: 'banks'
    },
    {
      id: 'staff-cost',
      title: 'Staff Cost',
      value: '₹5,60,000',
      change: '48 personnel',
      trend: 'neutral',
      subtitle: 'Basic + Batta + Allowances',
      icon: Users,
      color: 'text-purple-400',
      targetTab: 'payroll'
    },
    {
      id: 'operating-expenses',
      title: 'Operating Expenses',
      value: '₹7,25,000',
      change: 'Crusher power & haulage',
      trend: 'neutral',
      subtitle: 'DG fuel, lube, road tolls',
      icon: Activity,
      color: 'text-orange-400',
      targetTab: 'pnl'
    },
    {
      id: 'net-profit',
      title: 'Net Profit',
      value: '₹11,60,000',
      change: '27.1% net EBITDA margin',
      trend: 'up',
      subtitle: 'Reconciled profit run-rate',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      targetTab: 'pnl'
    },
    {
      id: 'pending-payments',
      title: 'Pending Payments',
      value: '₹4,10,000',
      change: '4 approval vouchers',
      trend: 'warning',
      subtitle: 'Vendor dues maturing in 48h',
      icon: Clock,
      color: 'text-amber-300',
      targetTab: 'pay-out'
    }
  ];

  // 7 Mandatory Alerts according to Brief
  const MANDATORY_ALERTS = [
    {
      id: 'alt-1',
      title: 'Outstanding Receivables Alert',
      desc: 'Sobha Developers invoice #INV-2026-081 (₹12,40,000) is past 45-day credit threshold.',
      severity: 'high',
      badge: 'Debtors',
      tab: 'debtors'
    },
    {
      id: 'alt-2',
      title: 'Overdue Payables Alert',
      desc: 'IOCL Commercial Bulk Diesel Bill #IOCL-8821 (₹7,73,424) due in 48 hours for discount.',
      severity: 'high',
      badge: 'Creditors',
      tab: 'creditors'
    },
    {
      id: 'alt-3',
      title: 'Pending Approvals Alert',
      desc: '3 Purchase Requests & 1 Quarry Royalty settlement awaiting General Manager signoff.',
      severity: 'medium',
      badge: 'Approvals',
      tab: 'purchase'
    },
    {
      id: 'alt-4',
      title: 'Low Stock Safety Buffer Alert',
      desc: 'M-Sand Silo 2 at Crusher Plant Wayanad has dropped below 40 MT safety buffer.',
      severity: 'medium',
      badge: 'Inventory',
      tab: 'inventory'
    },
    {
      id: 'alt-5',
      title: 'Salary Due Alert',
      desc: 'Monthly payroll cycle for 48 quarry, plant & fleet staff closes in 5 days (₹5,60,000).',
      severity: 'medium',
      badge: 'HRMS',
      tab: 'payroll'
    },
    {
      id: 'alt-6',
      title: 'Invoice Due Alert',
      desc: 'Apex Infra GST invoice #INV-2026-083 (₹4,80,000) matures for payment tomorrow.',
      severity: 'low',
      badge: 'Invoices',
      tab: 'invoices'
    },
    {
      id: 'alt-7',
      title: 'Subscription & Workspace Alert',
      desc: 'BOS Enterprise Plan monthly quota at 74% capacity; 42,800/50,000 weighbridge transactions utilized.',
      severity: 'low',
      badge: 'Workspace',
      tab: 'organization'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Studio Preview Demo Notice Banner */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
              RZ
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  RZ® MINETRIX BOS &bull; SHARED ERP CORE DASHBOARD
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  STUDIO PREVIEW / DEMO DATA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  10 Platforms Unified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                The centralized operational and financial backbone connecting <strong>Quarry, Crusher, Fleet, Building Materials, Equipment, Land, Chat, and OTT</strong> with live multi-ledger reconciliation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenFlowModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>5 Interactive Process Flows</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 MANDATORY KPI CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Executive Key Performance Indicators (10 Core Metrics)
            </h3>
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono">
            [ STUDIO PREVIEW / DEMO DATA ]
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MANDATORY_KPIS.map(kpi => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                onClick={() => onNavigateTab(kpi.targetTab)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition cursor-pointer group shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight truncate">
                    {kpi.title}
                  </span>
                  <Icon className={`w-4 h-4 ${kpi.color} shrink-0`} />
                </div>

                <div className="my-2">
                  <div className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    {kpi.change}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-amber-400 transition">
                  <span className="truncate">{kpi.subtitle}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 MANDATORY CHARTS SECTION (Interactive Tabbed Viewer) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Enterprise Financial &amp; Trade Charts (6 Core Models)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live multi-dimensional analysis with real-time gross/net margin tracking across all production nodes.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
            {[
              { id: 'sales-vs-purchase', label: '1. Sales vs Purchase' },
              { id: 'receivables-vs-payables', label: '2. Receivables vs Payables' },
              { id: 'cash-flow', label: '3. Cash Flow In/Out' },
              { id: 'expense-breakdown', label: '4. Expense Breakdown' },
              { id: 'monthly-revenue', label: '5. Monthly Revenue' },
              { id: 'monthly-profit', label: '6. Monthly Profit' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveChartTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeChartTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. SALES VS PURCHASE CHART */}
        {activeChartTab === 'sales-vs-purchase' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">
                Weekly Reconciled Trade Volume &bull; Pithead dispatch vs Raw Material procurement
              </span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                  Sales (₹42.85L)
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                  Purchase (₹18.40L)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  Gross Margin (₹24.45L / 57%)
                </span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                { day: 'Mon', sales: 680000, purchase: 240000, margin: 440000 },
                { day: 'Tue', sales: 740000, purchase: 310000, margin: 430000 },
                { day: 'Wed', sales: 590000, purchase: 210000, margin: 380000 },
                { day: 'Thu', sales: 820000, purchase: 390000, margin: 430000 },
                { day: 'Fri', sales: 910000, purchase: 420000, margin: 490000 },
                { day: 'Sat', sales: 545000, purchase: 270000, margin: 275000 }
              ].map(d => (
                <div key={d.day} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-300 font-bold w-12">{d.day}</span>
                    <span className="text-slate-400">Sales: ₹{(d.sales / 1000).toFixed(0)}k</span>
                    <span className="text-slate-500">Purchase: ₹{(d.purchase / 1000).toFixed(0)}k</span>
                    <span className="text-emerald-400 font-bold">Spread: +₹{(d.margin / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${(d.sales / 1000000) * 60}%` }}
                    />
                    <div
                      className="h-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${(d.purchase / 1000000) * 40}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. RECEIVABLES VS PAYABLES CHART */}
        {activeChartTab === 'receivables-vs-payables' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">
                Aging Bucket Comparison &bull; Money to receive vs Money to pay
              </span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-cyan-400 font-bold">Total Receivables: ₹34,60,000</span>
                <span className="text-rose-400 font-bold">Total Payables: ₹18,20,000</span>
                <span className="text-emerald-400 font-bold">Net Current Asset: +₹16,40,000</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
              {[
                { bucket: 'Current (0-15 Days)', recv: 1650000, pay: 920000, health: 'Optimal' },
                { bucket: '16-30 Days', recv: 980000, pay: 540000, health: 'Normal' },
                { bucket: '31-60 Days', recv: 590000, pay: 260000, health: 'Follow-up' },
                { bucket: '> 60 Days (Aging)', recv: 240000, pay: 100000, health: 'Overdue' }
              ].map((b, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-bold">{b.bucket}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      b.health === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400' :
                      b.health === 'Normal' ? 'bg-blue-500/10 text-blue-400' :
                      b.health === 'Follow-up' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {b.health}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Receivables (Debtors)</span>
                    <span className="text-base font-bold text-cyan-400">₹{b.recv.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Payables (Creditors)</span>
                    <span className="text-base font-bold text-rose-400">₹{b.pay.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CASH FLOW CHART */}
        {activeChartTab === 'cash-flow' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">
                Liquidity Inflow vs Outflow &bull; Cash desk &amp; Bank clearing velocity
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                Operating Cash Balance: ₹51,25,650 (Bank + Drawer)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Gross Cash Inflow (Weekly)</span>
                </div>
                <div className="text-2xl font-black text-white">₹38,20,000</div>
                <div className="text-slate-400 text-[11px]">
                  Customer spot cash (₹14.2L) + RTGS Bank receipts (₹24.0L)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Gross Cash Outflow (Weekly)</span>
                </div>
                <div className="text-2xl font-black text-white">₹22,45,000</div>
                <div className="text-slate-400 text-[11px]">
                  Fuel IOCL (₹9.8L) + Driver Batta (₹1.8L) + Spares (₹4.2L) + Staff Adv (₹6.65L)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>Net Cash Generation</span>
                </div>
                <div className="text-2xl font-black text-amber-400">+₹15,75,000</div>
                <div className="text-slate-400 text-[11px]">
                  Free cash flow after all operations, driver batta &amp; statutory dues
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. EXPENSE BREAKDOWN CHART */}
        {activeChartTab === 'expense-breakdown' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">
                Operating Cost Distribution &bull; Categorized OPEX across mining &amp; fleet
              </span>
              <span className="text-slate-300 font-bold">Total Operating Cost: ₹7,25,000</span>
            </div>

            <div className="space-y-3">
              {[
                { category: 'Heavy Tipper & Machinery Diesel (IOCL)', pct: 45, amount: '₹3,26,250', color: 'bg-amber-500' },
                { category: 'Crusher Spares, Manganese Liners & Bearings', pct: 22, amount: '₹1,59,500', color: 'bg-rose-500' },
                { category: 'Mining Blasting & Explosives Syndicate', pct: 14, amount: '₹1,01,500', color: 'bg-purple-500' },
                { category: 'Land Owner Concession Royalties', pct: 11, amount: '₹79,750', color: 'bg-cyan-500' },
                { category: 'Site Electricity, Road Tolls & Misc', pct: 8, amount: '₹58,000', color: 'bg-emerald-500' }
              ].map(exp => (
                <div key={exp.category} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-300">{exp.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{exp.pct}%</span>
                      <span className="text-white font-bold">{exp.amount}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                    <div className={`h-full ${exp.color}`} style={{ width: `${exp.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MONTHLY REVENUE TRAJECTORY */}
        {activeChartTab === 'monthly-revenue' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">
                12-Month Consolidated Revenue Trend &bull; All Quarry Pits &amp; Plants
              </span>
              <span className="text-amber-400 font-bold">Annualized Run-Rate: ₹4.82 Cr</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { mo: 'Sep', rev: '₹31.2L', index: 65 },
                { mo: 'Oct', rev: '₹34.8L', index: 72 },
                { mo: 'Nov', rev: '₹38.5L', index: 80 },
                { mo: 'Dec', rev: '₹41.0L', index: 86 },
                { mo: 'Jan', rev: '₹39.4L', index: 82 },
                { mo: 'Feb', rev: '₹42.8L', index: 95 }
              ].map(item => (
                <div key={item.mo} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-slate-500 text-[10px] block">{item.mo} 2025/26</span>
                  <div className="text-sm font-bold text-white">{item.rev}</div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 mt-2 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${item.index}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. MONTHLY PROFIT MARGIN */}
        {activeChartTab === 'monthly-profit' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">
                12-Month Net Profit &amp; Stakeholder Distributable Margin
              </span>
              <span className="text-emerald-400 font-bold">Avg Net Margin: 26.8%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { mo: 'Sep', profit: '₹8.4L', margin: '26.9%' },
                { mo: 'Oct', profit: '₹9.2L', margin: '26.4%' },
                { mo: 'Nov', profit: '₹10.5L', margin: '27.2%' },
                { mo: 'Dec', profit: '₹11.1L', margin: '27.0%' },
                { mo: 'Jan', profit: '₹10.8L', margin: '27.4%' },
                { mo: 'Feb', profit: '₹11.6L', margin: '27.1%' }
              ].map(item => (
                <div key={item.mo} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-slate-500 text-[10px] block">{item.mo} 2025/26</span>
                  <div className="text-sm font-bold text-emerald-400">{item.profit}</div>
                  <div className="text-[10px] text-slate-400">{item.margin} Net</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2-COLUMN LOWER SECTION: 5 RECENT ACTIVITIES & 7 MANDATORY ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): 5 Mandatory Activity Feeds */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Recent ERP Operations Stream (5 Activity Feeds)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trail updated with every dispatch, weighbridge tare scale, payment, and voucher.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              {[
                { id: 'sales', label: 'Sales' },
                { id: 'purchases', label: 'Purchases' },
                { id: 'payments', label: 'Payments' },
                { id: 'expenses', label: 'Expenses' },
                { id: 'staff', label: 'Staff' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveActivityTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-[11px] ${
                    activeActivityTab === tab.id
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Tab Content */}
          <div className="space-y-2.5 font-mono text-xs">
            {activeActivityTab === 'sales' && (
              <>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Invoice #INV-2026-081 &bull; Sobha Developers</div>
                    <div className="text-[11px] text-slate-500">2,400 Pcs Dressed Laterite Stone &bull; Rate ₹42/pc</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">+₹1,00,800</span>
                    <span className="text-[10px] text-slate-500">10:45 AM &bull; Dispatched</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Invoice #INV-2026-082 &bull; Malabar Highway Constr.</div>
                    <div className="text-[11px] text-slate-500">80 MT 20mm Blue Metal Aggregate &bull; Rate ₹480/MT</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">+₹38,400</span>
                    <span className="text-[10px] text-slate-500">09:15 AM &bull; Dispatched</span>
                  </div>
                </div>
              </>
            )}

            {activeActivityTab === 'purchases' && (
              <>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">PO-2026-9041 &bull; Sandvik Heavy Mining Spares</div>
                    <div className="text-[11px] text-slate-500">Crusher Manganese Jaw Liners &bull; GRN Verified #GRN-104</div>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold block">₹1,90,570</span>
                    <span className="text-[10px] text-slate-500">Yesterday &bull; Material In</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">PO-2026-9042 &bull; Indian Oil Corp Ltd (Bulk Depot)</div>
                    <div className="text-[11px] text-slate-500">8,000 Litres High-Speed Diesel &bull; Tanker Dispense</div>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold block">₹7,73,424</span>
                    <span className="text-[10px] text-slate-500">2 Days Ago &bull; Fuel Bowser</span>
                  </div>
                </div>
              </>
            )}

            {activeActivityTab === 'payments' && (
              <>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">RTGS Bank Receipt &bull; Calicut Central Infra</div>
                    <div className="text-[11px] text-slate-500">Ref: HDFC000182910 &bull; Credited to HDFC Current A/C</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">+₹3,50,000</span>
                    <span className="text-[10px] text-slate-500">Cleared &bull; Today</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Vendor Payment &bull; Kerala Explosives Syndicate</div>
                    <div className="text-[11px] text-slate-500">NEFT Ref: SBI991204 &bull; Mining Blasting License pack</div>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold block">&minus;₹1,01,500</span>
                    <span className="text-[10px] text-slate-500">Cleared &bull; Today</span>
                  </div>
                </div>
              </>
            )}

            {activeActivityTab === 'expenses' && (
              <>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Weighbridge Daily Calibration Fee &bull; Legal Metrology</div>
                    <div className="text-[11px] text-slate-500">Voucher #EX-2026-039 &bull; Weighbridge Pit 1</div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-300 font-bold block">₹4,500</span>
                    <span className="text-[10px] text-slate-500">Certified by Inspector</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Tipper Toll FastTag Auto-Recharge &bull; National Highway</div>
                    <div className="text-[11px] text-slate-500">Fleet 12 Tippers &bull; NH-66 Kozhikode-Kannur Corridor</div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-300 font-bold block">₹12,000</span>
                    <span className="text-[10px] text-slate-500">Automated Wallet Debit</span>
                  </div>
                </div>
              </>
            )}

            {activeActivityTab === 'staff' && (
              <>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Driver Batta Disbursed &bull; Arun Varma (KL-11-BH-9921)</div>
                    <div className="text-[11px] text-slate-500">Trip #TRIP-441 &bull; Wayanad - Kozhikode 2-Way Haulage</div>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold block">₹930</span>
                    <span className="text-[10px] text-slate-500">Trip Batta + Toll</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Staff Advance Approved &bull; Ramesh Kumar (Plant Operator)</div>
                    <div className="text-[11px] text-slate-500">Voucher #ADV-2026-012 &bull; Repayment ₹2,500/mo</div>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold block">₹10,000</span>
                    <span className="text-[10px] text-slate-500">Salary Deduction Linked</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right (1 Col): 7 Mandatory Alerts Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Enterprise Alerts (7 System Checks)</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold">
                Action Required
              </span>
            </div>

            <div className="mt-3 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {MANDATORY_ALERTS.map(alt => (
                <div
                  key={alt.id}
                  onClick={() => onNavigateTab(alt.tab)}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 truncate">{alt.title}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-mono shrink-0">
                      {alt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {alt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => onQuickAction?.('NEW_TRANSACTION')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-amber-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Commercial Entry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
