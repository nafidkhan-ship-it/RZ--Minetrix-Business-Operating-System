import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { CommercePayment, COMMERCE_PAYMENTS } from '../../data/ecommerceStudioData';

export const PaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<CommercePayment[]>(COMMERCE_PAYMENTS);
  const [filterType, setFilterType] = useState<string>('ALL');

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const advanceTotal = payments.filter(p => p.paymentType === 'Advance').reduce((acc, p) => acc + p.amount, 0);
  const balanceTotal = payments.filter(p => p.paymentType === 'Balance' || p.paymentType === 'Full Payment').reduce((acc, p) => acc + p.amount, 0);

  const filtered = payments.filter((p) => {
    if (filterType === 'ALL') return true;
    return p.paymentType.toUpperCase() === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              SETTLEMENTS & ESCROW LEDGER
            </span>
            <span className="text-xs text-slate-400 font-medium">Studio Preview Accounting</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Payments & Transactions ({payments.length})</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-mono">TOTAL RECORDED CASHFLOW</div>
            <div className="text-xl font-black text-emerald-400 font-mono">₹{totalCollected.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Advance Bookings</span>
          <div className="text-lg font-black text-white font-mono">₹{advanceTotal.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500 font-mono">Escrow held pending pit loading</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Balance Cleared</span>
          <div className="text-lg font-black text-emerald-400 font-mono">₹{balanceTotal.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500 font-mono">Post-weighbridge & site drop</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Refunds / Chargebacks</span>
          <div className="text-lg font-black text-amber-400 font-mono">₹0.00</div>
          <span className="text-[10px] text-slate-500 font-mono">Zero disputed settlements</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto text-xs">
        {['ALL', 'ADVANCE', 'BALANCE', 'FULL PAYMENT'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterType === t
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/80">
                <th className="p-4">Receipt # / Ref</th>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Party & Type</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono">
                    <div className="font-bold text-amber-400">{pay.receiptNumber}</div>
                    <div className="text-[11px] text-slate-500">{pay.transactionReference}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">{pay.orderNumber}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{pay.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{pay.paymentType}</div>
                  </td>
                  <td className="p-4 text-slate-300 font-mono">{pay.paymentMethod}</td>
                  <td className="p-4 font-mono font-black text-emerald-400 text-sm">
                    ₹{pay.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Print payment receipt ${pay.receiptNumber}`)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                    >
                      Print
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
