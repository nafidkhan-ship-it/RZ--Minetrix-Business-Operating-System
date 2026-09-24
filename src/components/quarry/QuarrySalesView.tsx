import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  Printer,
  DollarSign,
  Eye,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2
} from 'lucide-react';
import { QuarrySale } from '../../data/quarryStudioData';

interface QuarrySalesViewProps {
  sales: QuarrySale[];
}

export const QuarrySalesView: React.FC<QuarrySalesViewProps> = ({ sales }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filtered = sales.filter((s) => {
    const matchSearch =
      s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.loadNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.quarryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const totalBilled = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalReceived = sales.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalBalance = sales.reduce((acc, s) => acc + s.balanceAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              COMMERCIAL BILLING
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filtered.length} commercial tax invoices)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Quarry Sales & Tax Invoices</h2>
          <p className="text-xs text-slate-400">
            Automated invoice generation from dispatched loads, customer ledger tracking, and GST billing.
          </p>
        </div>

        <button
          onClick={() => alert('Create New Sales Invoice Modal (Simulated)')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Sales Invoice</span>
        </button>
      </div>

      {/* Sales KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Billed Volume</span>
          <span className="text-2xl font-black text-white font-mono">
            ₹{totalBilled.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 block">Gross Invoiced Value</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Payments Collected</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            ₹{totalReceived.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-500/80 block">Direct Bank & Cash Remittance</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Outstanding Receivables</span>
          <span className="text-2xl font-black text-rose-400 font-mono">
            ₹{totalBalance.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-rose-400/80 block">Customer Credit Balances</span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice number, customer name, load number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Paid">Paid (Closed)</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Sales Table (Section 14) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Invoice No</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Quarry & Load</th>
                <th className="py-3.5 px-4">Material & Qty</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Paid / Balance</th>
                <th className="py-3.5 px-4">Payment Mode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-sm">
                    {sale.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white">{sale.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{sale.customerName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white">{sale.quarryName.split(' ')[0]} Pit</div>
                    <div className="text-[10px] font-mono text-slate-500">{sale.loadNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-amber-300 font-bold">{sale.material}</div>
                    <div className="text-slate-400 font-mono">
                      {sale.quantity} {sale.unit} @ ₹{sale.rate}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-white text-sm">
                    ₹{sale.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-emerald-400 font-bold">
                      Paid: ₹{sale.paidAmount.toLocaleString('en-IN')}
                    </div>
                    {sale.balanceAmount > 0 ? (
                      <div className="text-rose-400 text-[11px]">
                        Due: ₹{sale.balanceAmount.toLocaleString('en-IN')}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-[11px]">Cleared</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{sale.paymentMode}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        sale.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : sale.status === 'Partial'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => alert(`Receiving Payment for Invoice ${sale.invoiceNumber}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition"
                        title="Receive Payment"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Printing Invoice ${sale.invoiceNumber}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
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
