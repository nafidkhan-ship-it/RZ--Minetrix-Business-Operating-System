import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Calendar,
  Printer,
  Download,
  Users,
  Building2,
  FileText
} from 'lucide-react';
import { CommerceLedgerEntry, CommerceSubTab } from '../types';
import { MOCK_CUSTOMER_LEDGER, MOCK_SUPPLIER_LEDGER, MOCK_CUSTOMERS, MOCK_SUPPLIERS } from '../commerceMockData';

interface CustomerSupplierLedgersViewProps {
  initialType?: 'customer' | 'supplier';
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const CustomerSupplierLedgersView: React.FC<CustomerSupplierLedgersViewProps> = ({
  initialType = 'customer',
  onNavigateTab,
  onToast,
  onOpenPrintModal
}) => {
  const [ledgerType, setLedgerType] = useState<'customer' | 'supplier'>(initialType);
  const [selectedParty, setSelectedParty] = useState(
    initialType === 'customer' ? MOCK_CUSTOMERS[0].businessName : MOCK_SUPPLIERS[0].businessName
  );

  const activeLedgerData = ledgerType === 'customer' ? MOCK_CUSTOMER_LEDGER : MOCK_SUPPLIER_LEDGER;

  const totalDebit = activeLedgerData.reduce((acc, curr) => acc + curr.debit, 0);
  const totalCredit = activeLedgerData.reduce((acc, curr) => acc + curr.credit, 0);
  const closingBalance = activeLedgerData[activeLedgerData.length - 1]?.balance || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Financial Audit &amp; Reconciliation &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Customer Debtors &amp; Supplier Creditors Sub-Ledgers
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Chronological financial audit trail tracking opening balance, sales invoices, procurement bills, cash receipts, bank disbursements, credit notes, and closing balance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintModal(`Statement of Account - ${selectedParty}`, activeLedgerData)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Statement</span>
            </button>
            <button
              onClick={() => onToast(`Exported ${selectedParty} ledger to Excel/CSV`)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ledger Type Switcher */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80 mt-4">
          <button
            onClick={() => {
              setLedgerType('customer');
              setSelectedParty(MOCK_CUSTOMERS[0].businessName);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              ledgerType === 'customer'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Debtors Ledger</span>
          </button>
          <button
            onClick={() => {
              setLedgerType('supplier');
              setSelectedParty(MOCK_SUPPLIERS[0].businessName);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              ledgerType === 'supplier'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Supplier Creditors Ledger</span>
          </button>
        </div>
      </div>

      {/* Party Selector & Balance Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <label className="text-[10px] font-mono text-slate-400 block uppercase">Select Entity Account</label>
          <select
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {ledgerType === 'customer'
              ? MOCK_CUSTOMERS.map((c) => <option key={c.id} value={c.businessName}>{c.businessName}</option>)
              : MOCK_SUPPLIERS.map((s) => <option key={s.id} value={s.businessName}>{s.businessName}</option>)
            }
          </select>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Period Debits</span>
          <span className="text-lg font-mono font-bold text-white mt-1 block">₹{totalDebit.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Period Credits</span>
          <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">₹{totalCredit.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-amber-400 block uppercase font-bold">Closing Balance</span>
          <span className="text-lg font-mono font-black text-amber-300 mt-1 block">
            ₹{closingBalance.toLocaleString()} {ledgerType === 'customer' ? 'Dr (Receivable)' : 'Cr (Payable)'}
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">DOC NUMBER</th>
                <th className="py-2.5 px-3">PARTICULARS / DESCRIPTION</th>
                <th className="py-2.5 px-3 text-right">DEBIT (₹)</th>
                <th className="py-2.5 px-3 text-right">CREDIT (₹)</th>
                <th className="py-2.5 px-3 text-right">CLOSING RUNNING BALANCE (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {activeLedgerData.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/50 text-slate-300">
                  <td className="py-3 px-3 text-slate-400">{l.date}</td>
                  <td className="py-3 px-3 font-bold text-amber-400">{l.docNumber}</td>
                  <td className="py-3 px-3 font-sans text-white font-medium max-w-sm">{l.description}</td>
                  <td className="py-3 px-3 text-right text-slate-200">
                    {l.debit > 0 ? `₹${l.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {l.credit > 0 ? `₹${l.credit.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-white">
                    ₹{l.balance.toLocaleString()}
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
