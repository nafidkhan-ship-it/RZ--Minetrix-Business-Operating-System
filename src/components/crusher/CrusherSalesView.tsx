import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  FileText,
  Printer,
  Calendar,
  CheckCircle2,
  Building2,
  Truck,
  Sparkles
} from 'lucide-react';
import { CrusherSale } from '../../data/crusherStudioData';

interface CrusherSalesViewProps {
  sales: CrusherSale[];
  onNavigatePage: (page: string) => void;
}

export const CrusherSalesView: React.FC<CrusherSalesViewProps> = ({
  sales,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSale, setSelectedSale] = useState<CrusherSale | null>(sales[0] || null);

  const filtered = sales.filter(s => {
    const matchSearch =
      s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSalesVal = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalVolume = sales.reduce((acc, s) => acc + s.quantityTons, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                COMMERCIAL BILLING & TAX INVOICES
              </span>
              <h2 className="text-xl font-black text-white">Aggregates Sales & Invoices</h2>
            </div>
          </div>
          <button
            onClick={() => alert('New Sales Invoice modal opened.')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Sales Invoice</span>
          </button>
        </div>

        {/* Sales Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Month Invoiced Revenue</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">₹{(totalSalesVal / 100000).toFixed(1)} L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Dispatched Tonnage</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">{totalVolume.toFixed(1)} MT</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Average Realization</span>
            <span className="text-xl font-black text-white font-mono mt-0.5">₹605 / MT</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Collection Ratio</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5">78% Cash / 22% Credit</span>
          </div>
        </div>

        {/* Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice number, customer name, vehicle, or grade..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PAID">Paid / Settled</option>
              <option value="PARTIAL">Partial</option>
              <option value="CREDIT">Credit (Awaiting Clearance)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Table + Invoice Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Sales & Dispatch Invoices</h3>
            <span className="text-[10px] font-mono text-cyan-400">{filtered.length} Invoices</span>
          </div>

          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-2.5">Invoice No</th>
                <th className="p-2.5">Customer & Project</th>
                <th className="p-2.5">Product</th>
                <th className="p-2.5">Qty (MT)</th>
                <th className="p-2.5">Rate</th>
                <th className="p-2.5">Total Value</th>
                <th className="p-2.5">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(sale => (
                <tr
                  key={sale.id}
                  onClick={() => setSelectedSale(sale)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition ${
                    selectedSale?.id === sale.id ? 'bg-cyan-500/10' : ''
                  }`}
                >
                  <td className="p-2.5 font-mono font-bold text-cyan-400">{sale.invoiceNumber}</td>
                  <td className="p-2.5">
                    <div className="font-bold text-white truncate max-w-xs">{sale.customerName}</div>
                    <div className="text-[10px] text-slate-500">{sale.date} &bull; {sale.vehicleNumber}</div>
                  </td>
                  <td className="p-2.5 text-slate-200">{sale.productName}</td>
                  <td className="p-2.5 font-mono font-black text-white">{sale.quantityTons}</td>
                  <td className="p-2.5 font-mono text-slate-300">₹{sale.ratePerTon}</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-400">₹{sale.totalAmount.toLocaleString()}</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        sale.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Invoice Details Card */}
        {selectedSale && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">TAX INVOICE SLIP</span>
                <h3 className="text-sm font-bold text-white">{selectedSale.invoiceNumber}</h3>
              </div>
              <button
                onClick={() => alert(`Printing Tax Invoice ${selectedSale.invoiceNumber}...`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Print Tax Invoice"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs font-mono">
              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span className="text-white font-bold truncate max-w-[160px]">{selectedSale.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>VEHICLE NO:</span>
                  <span className="text-cyan-400 font-bold">{selectedSale.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span className="text-white">{selectedSale.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>PRODUCT:</span>
                  <span className="text-amber-400 font-bold">{selectedSale.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span>QUANTITY:</span>
                  <span className="text-white font-bold">{selectedSale.quantityTons} MT</span>
                </div>
                <div className="flex justify-between">
                  <span>RATE / TON:</span>
                  <span className="text-white">₹{selectedSale.ratePerTon}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 space-y-1 text-slate-300">
                <div className="flex justify-between text-[11px]">
                  <span>SUBTOTAL:</span>
                  <span>₹{selectedSale.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>GST (5%):</span>
                  <span>₹{selectedSale.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-400 pt-1 border-t border-slate-900">
                  <span>TOTAL BILLABLE:</span>
                  <span>₹{selectedSale.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-900 flex justify-between">
                <span>GATE PASS: {selectedSale.gatePassId}</span>
                <span className="text-emerald-400 font-bold">DIGITALLY SIGNED</span>
              </div>
            </div>

            <button
              onClick={() => onNavigatePage('gate-pass')}
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition cursor-pointer"
            >
              Verify Digital Gate Pass ({selectedSale.gatePassId}) &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
