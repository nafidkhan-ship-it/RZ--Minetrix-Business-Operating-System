import React from 'react';
import {
  ShoppingBag,
  Layers,
  Truck,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Users,
  ShieldCheck,
  Package,
  FileText,
  Plus
} from 'lucide-react';
import {
  COMMERCE_DASHBOARD_METRICS,
  COMMERCE_ORDERS,
  CommerceOrder
} from '../../data/ecommerceStudioData';

interface EcommerceDashboardViewProps {
  onOrderLaterite: () => void;
  onNavigateSubpage: (subpageId: string) => void;
  onSelectOrder: (order: CommerceOrder) => void;
}

export const EcommerceDashboardView: React.FC<EcommerceDashboardViewProps> = ({
  onOrderLaterite,
  onNavigateSubpage,
  onSelectOrder
}) => {
  const metrics = COMMERCE_DASHBOARD_METRICS;
  const recentOrders = COMMERCE_ORDERS.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner & Direct Action */}
      <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              PLATFORM 05 &bull; COMMAND DASHBOARD
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Studio Preview Data Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Building Materials Commerce Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Direct quarry pit extraction concessions, computerized weighbridge passes, fleet logistics routing, and customer escrow settlement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOrderLaterite}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer transition transform hover:scale-[1.02]"
          >
            <Layers className="w-4 h-4" />
            <span>ORDER LATERITE STONE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateSubpage('shop')}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition cursor-pointer"
          >
            Storefront Shop
          </button>
        </div>
      </div>

      {/* 1. TOP OPERATIONAL KPI CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Order Fulfillment Pipeline
          </h2>
          <span className="text-xs text-slate-400 font-mono">14 Operational Stages</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Total Orders', val: metrics.totalOrders, color: 'text-white' },
            { label: 'Active Orders', val: metrics.activeOrders, color: 'text-amber-400' },
            { label: 'Processing', val: metrics.ordersProcessing, color: 'text-cyan-400' },
            { label: 'Ready Dispatch', val: metrics.ordersReadyForDispatch, color: 'text-purple-400' },
            { label: 'In Transit', val: metrics.ordersInTransit, color: 'text-blue-400' },
            { label: 'Delivered Today', val: metrics.deliveredToday, color: 'text-emerald-400' },
            { label: 'Completed', val: metrics.completedOrders, color: 'text-emerald-300' },
            { label: 'Disputes / Claims', val: metrics.openDisputes, color: 'text-rose-400' }
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1"
            >
              <div className="text-[10px] text-slate-400 font-mono uppercase truncate">{kpi.label}</div>
              <div className={`text-xl font-black font-mono ${kpi.color}`}>{kpi.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. FINANCIAL & COMMERCIAL KPIS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Financial & Escrow Cashflow
          </h2>
          <span className="text-xs text-slate-400 font-mono">Real-world Studio Metrics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase">Gross Merchandise Value</span>
            <div className="text-xl font-black text-white font-mono">₹{metrics.totalSalesRs.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-400 font-mono">Total commerce volume</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase">Advance Escrow Collected</span>
            <div className="text-xl font-black text-emerald-400 font-mono">₹{metrics.receivedAmountRs.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400 font-mono">75.6% booking deposits</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase">Outstanding Site Balance</span>
            <div className="text-xl font-black text-amber-400 font-mono">₹{metrics.outstandingAmountRs.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400 font-mono">Due on weighbridge slip</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase">Quarry Producer Payouts</span>
            <div className="text-xl font-black text-white font-mono">₹{metrics.supplierPayoutsRs.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400 font-mono">Ex-pit extraction settlements</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase">Platform Gross Margin</span>
            <div className="text-xl font-black text-emerald-400 font-mono">₹{metrics.estimatedMarginRs.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-400 font-mono">11.8% Net Take-Rate</span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
          Quick Workflow Shortcuts:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOrderLaterite}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Order Laterite Stone</span>
          </button>
          <button
            onClick={() => onNavigateSubpage('quotes')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compare Quotes</span>
          </button>
          <button
            onClick={() => onNavigateSubpage('dispatch')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5 text-purple-400" />
            <span>Gate Dispatch</span>
          </button>
          <button
            onClick={() => onNavigateSubpage('payments')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Payments Ledger</span>
          </button>
        </div>
      </div>

      {/* 4. RECENT ORDERS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-3">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Active Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any order to open full 14-tab dossier</p>
          </div>
          <button
            onClick={() => onNavigateSubpage('orders')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders ({COMMERCE_ORDERS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/70">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer & Project</th>
                <th className="p-4">Product</th>
                <th className="p-4">Supplier Quarry</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => onSelectOrder(ord)}
                  className="hover:bg-slate-800/40 transition cursor-pointer group"
                >
                  <td className="p-4 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                  <td className="p-4">
                    <div className="font-bold text-white group-hover:text-amber-400 transition">{ord.customerName}</div>
                    <div className="text-[11px] text-slate-400">{ord.siteProjectName} ({ord.district})</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{ord.productName}</div>
                    <div className="text-[11px] font-mono text-amber-300">{ord.quantity.toLocaleString()} {ord.unit}s</div>
                  </td>
                  <td className="p-4 text-slate-300 truncate max-w-[150px]">{ord.supplierName}</td>
                  <td className="p-4 font-mono font-bold text-white">₹{ord.totalAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(ord);
                      }}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      Dossier
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
