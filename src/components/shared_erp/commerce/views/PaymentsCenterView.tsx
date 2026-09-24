import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Printer,
  CreditCard,
  Building2,
  Users
} from 'lucide-react';
import { CommercePayment, CommerceSubTab } from '../types';
import { MOCK_PAYMENTS } from '../commerceMockData';

interface PaymentsCenterViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const PaymentsCenterView: React.FC<PaymentsCenterViewProps> = ({
  onNavigateTab,
  onToast,
  onOpenPrintModal
}) => {
  const [payments, setPayments] = useState<CommercePayment[]>(MOCK_PAYMENTS);
  const [filterType, setFilterType] = useState<'ALL' | 'INCOMING' | 'OUTGOING'>('ALL');

  const filtered = payments.filter((p) =>
    filterType === 'ALL' ? true : p.paymentType === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Financial Settlements &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Payments, Collections &amp; Treasury Settlements
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Captures customer sales collections (UPI, RTGS, Cash), vendor disbursements (Fuel, Spares), advance adjustments, and bank account reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToast('Open Record Customer Collection Dialog')}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>+ Receive Customer Payment</span>
            </button>
            <button
              onClick={() => onToast('Open Vendor Disbursement Dialog')}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>+ Disburse Supplier Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'ALL', label: 'All Transactions' },
          { id: 'INCOMING', label: 'Customer Collections (Inward)' },
          { id: 'OUTGOING', label: 'Vendor Disbursements (Outward)' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === f.id
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <th className="py-2.5 px-3">VOUCHER</th>
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">PARTY</th>
                <th className="py-2.5 px-3">TYPE</th>
                <th className="py-2.5 px-3">MODE &amp; REF</th>
                <th className="py-2.5 px-3 text-right">AMOUNT (₹)</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 text-slate-300">
                  <td className="py-3 px-3 font-bold text-amber-400">{p.voucherNumber}</td>
                  <td className="py-3 px-3 text-slate-400">{p.date}</td>
                  <td className="py-3 px-3 font-sans font-bold text-white">{p.partyName}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      p.paymentType === 'INCOMING' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {p.paymentType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {p.mode} &bull; {p.referenceNumber}
                  </td>
                  <td className={`py-3 px-3 text-right font-black text-sm ${
                    p.paymentType === 'INCOMING' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {p.paymentType === 'INCOMING' ? '+' : '-'}₹{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {p.status}
                    </span>
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
