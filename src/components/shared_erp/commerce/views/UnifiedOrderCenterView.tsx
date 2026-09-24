import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Package,
  Truck,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Printer
} from 'lucide-react';
import { UnifiedCommerceOrder, CommerceSubTab } from '../types';
import { MOCK_UNIFIED_ORDERS } from '../commerceMockData';

interface UnifiedOrderCenterViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const UnifiedOrderCenterView: React.FC<UnifiedOrderCenterViewProps> = ({
  onNavigateTab,
  onToast,
  onOpenPrintModal
}) => {
  const [orders, setOrders] = useState<UnifiedCommerceOrder[]>(MOCK_UNIFIED_ORDERS);
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const PLATFORMS = [
    { id: 'ALL', label: 'All 10 Platforms' },
    { id: 'DIRECT_ERP', label: 'Direct ERP Core' },
    { id: 'PLATFORM_5_ECOMMERCE', label: 'Platform 5: E-Commerce Store' },
    { id: 'PLATFORM_1_QUARRY', label: 'Platform 1: Quarry Pithead' },
    { id: 'PLATFORM_2_CRUSHER', label: 'Platform 2: Crusher Plant' },
    { id: 'PLATFORM_4_CONTRACT', label: 'Platform 4: Contract & Jobs' },
    { id: 'PLATFORM_6_MARKETPLACE', label: 'Platform 6: Machinery Marketplace' }
  ];

  const filtered = orders.filter((o) => {
    const matchesPlat = platformFilter === 'ALL' || o.platformOrigin === platformFilter;
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase());
    return matchesPlat && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Multi-Platform Order Matrix &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Unified Order Management Hub Across All 10 RZ® MINETRIX Platforms
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Consolidates orders placed across the E-Commerce Storefront, Direct Quarry Pithead loading, Crusher Aggregates, Infra Subcontracts, and the Heavy Machinery Marketplace into a single synchronized fulfillment stream.
            </p>
          </div>

          <button
            onClick={() => onOpenPrintModal('Unified Multi-Platform Orders Ledger', filtered)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Orders Ledger</span>
          </button>
        </div>

        {/* Origin Platform Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-800/80 mt-4 scrollbar-thin scrollbar-thumb-slate-700">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Filter Origin:</span>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatformFilter(p.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                platformFilter === p.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Platform Orders ({filtered.length})</span>
          </h3>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order #, client, material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <th className="py-2.5 px-3">ORDER &amp; DATE</th>
                <th className="py-2.5 px-3">PLATFORM ORIGIN</th>
                <th className="py-2.5 px-3">CUSTOMER</th>
                <th className="py-2.5 px-3">MATERIAL &amp; QTY</th>
                <th className="py-2.5 px-3 text-right">TOTAL AMOUNT</th>
                <th className="py-2.5 px-3 text-center">FULFILLMENT</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/50 text-slate-300">
                  <td className="py-3 px-3">
                    <strong className="text-amber-400 block">{o.orderNumber}</strong>
                    <span className="text-[10px] text-slate-400 font-sans">{o.date}</span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-amber-500/20 font-bold">
                      {o.platformLabel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans font-bold text-white">
                    {o.customerName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-white block font-sans font-medium">{o.productName}</span>
                    <span className="text-[10px] text-slate-400">{o.quantity} {o.unit}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-white">
                    ₹{o.grandTotal.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center font-sans">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      o.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300' :
                      o.status === 'IN_TRANSIT' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      onClick={() => onNavigateTab('delivery')}
                      className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Track Dispatch
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
