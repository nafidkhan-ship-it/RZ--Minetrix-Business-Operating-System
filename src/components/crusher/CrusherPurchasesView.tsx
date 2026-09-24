import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  Wrench,
  Fuel,
  CheckCircle2,
  FileText,
  Calendar,
  Building2
} from 'lucide-react';
import { CrusherPurchase } from '../../data/crusherStudioData';

interface CrusherPurchasesViewProps {
  purchases: CrusherPurchase[];
  onNavigatePage: (page: string) => void;
}

export const CrusherPurchasesView: React.FC<CrusherPurchasesViewProps> = ({
  purchases,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  const filtered = purchases.filter(p => {
    const matchSearch =
      p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.itemDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = catFilter === 'ALL' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalSpend = purchases.reduce((acc, p) => acc + p.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                PROCUREMENT & WEAR PARTS
              </span>
              <h2 className="text-xl font-black text-white">Crusher Purchases & Equipment Spares</h2>
            </div>
          </div>
          <button
            onClick={() => alert('New Purchase Order generated.')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Purchase Order</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Procurement Month Spend</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">₹{(totalSpend / 100000).toFixed(1)} L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Manganese Wear Parts</span>
            <span className="text-xl font-black text-white font-mono mt-0.5">₹3.8 L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Bulk Diesel Inflow</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5">₹2.8 L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">PO Fulfillment</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">94% On Schedule</span>
          </div>
        </div>

        {/* Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by PO number, supplier, or wear item..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Purchase Categories</option>
              <option value="Machinery Spare Parts">Machinery Spare Parts</option>
              <option value="Fuel / Diesel">Fuel / Diesel</option>
              <option value="Screening Mesh">Screening Mesh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto space-y-3">
        <h3 className="text-sm font-bold text-white">Purchase Orders & Invoices</h3>
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">PO Number</th>
              <th className="p-3">Vendor / Supplier</th>
              <th className="p-3">Category</th>
              <th className="p-3">Item Description</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total Value</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(po => (
              <tr key={po.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-cyan-400">{po.poNumber}</td>
                <td className="p-3">
                  <div className="font-bold text-white">{po.supplierName}</div>
                  <div className="text-[10px] text-slate-500">{po.date}</div>
                </td>
                <td className="p-3 text-slate-300">{po.category}</td>
                <td className="p-3 text-white font-medium max-w-xs truncate">{po.itemDescription}</td>
                <td className="p-3 font-mono text-slate-300">{po.quantity} {po.unit}</td>
                <td className="p-3 font-mono font-bold text-emerald-400">₹{po.totalAmount.toLocaleString()}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      po.paymentStatus === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {po.paymentStatus}
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-[10px] font-mono">
                    {po.deliveryStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
