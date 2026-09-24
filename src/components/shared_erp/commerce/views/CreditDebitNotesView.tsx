import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  RotateCcw,
  FileText
} from 'lucide-react';
import { CommerceSubTab } from '../types';

interface CreditDebitNotesViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const CreditDebitNotesView: React.FC<CreditDebitNotesViewProps> = ({
  onNavigateTab,
  onToast,
  onOpenPrintModal
}) => {
  const [activeTab, setActiveTab] = useState<'CREDIT' | 'DEBIT'>('CREDIT');

  const NOTES = [
    {
      id: 'CN-001',
      type: 'CREDIT',
      noteNumber: 'CN-2026-002',
      date: '2026-02-18',
      party: 'Malabar Infrastructure Ltd',
      originalDoc: 'INV-2026-001',
      reason: 'Weighbridge tare tare moisture adjustment (4.2 MT reduction)',
      amount: 14500,
      gstAdjusted: 725,
      status: 'ADJUSTED_IN_LEDGER'
    },
    {
      id: 'DN-001',
      type: 'DEBIT',
      noteNumber: 'DN-2026-004',
      date: '2026-02-17',
      party: 'Metso Outotec India Pvt Ltd',
      originalDoc: 'BILL-2026-088',
      reason: 'Rejected hydraulic seal cylinder kit (dimensional tolerance defect)',
      amount: 34000,
      gstAdjusted: 6120,
      status: 'ISSUED_TO_VENDOR'
    }
  ];

  const filtered = NOTES.filter((n) => n.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Post-Billing Adjustments &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Credit Notes (Sales Adjustments) &amp; Debit Notes (Purchase Returns)
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Handles statutory adjustments for weighbridge discrepancies, rejected material shipments, commercial rebates, and GST credit reversals under Section 34 of the CGST Act.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToast('Open Credit Note Form')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Issue Credit Note</span>
            </button>
            <button
              onClick={() => onToast('Open Debit Note Form')}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Issue Debit Note</span>
            </button>
          </div>
        </div>

        {/* Switcher */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80 mt-4">
          <button
            onClick={() => setActiveTab('CREDIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'CREDIT'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Customer Credit Notes ({NOTES.filter((n) => n.type === 'CREDIT').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('DEBIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'DEBIT'
                ? 'bg-rose-500 text-slate-950 font-black shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Supplier Debit Notes ({NOTES.filter((n) => n.type === 'DEBIT').length})</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <th className="py-2.5 px-3">NOTE NUMBER</th>
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">PARTY</th>
                <th className="py-2.5 px-3">ORIGINAL INVOICE / BILL</th>
                <th className="py-2.5 px-3">REASON</th>
                <th className="py-2.5 px-3 text-right">ADJUSTED AMOUNT</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((n) => (
                <tr key={n.id} className="hover:bg-slate-800/50 text-slate-300">
                  <td className={`py-3 px-3 font-bold ${activeTab === 'CREDIT' ? 'text-amber-400' : 'text-rose-400'}`}>
                    {n.noteNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{n.date}</td>
                  <td className="py-3 px-3 font-sans font-bold text-white">{n.party}</td>
                  <td className="py-3 px-3 text-slate-300">{n.originalDoc}</td>
                  <td className="py-3 px-3 font-sans text-slate-400 max-w-sm">{n.reason}</td>
                  <td className="py-3 px-3 text-right font-black text-white">
                    ₹{n.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {n.status}
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
