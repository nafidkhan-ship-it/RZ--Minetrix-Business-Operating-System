import React, { useState } from 'react';
import {
  DollarSign,
  Landmark,
  Wallet,
  CreditCard,
  TrendingUp,
  Receipt,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Building2,
  Users
} from 'lucide-react';
import { BankAccount } from '../types';
import { MOCK_BANK_ACCOUNTS, MOCK_SALES_INVOICES, MOCK_PURCHASE_BILLS } from '../data/erpMasterData';

interface FinanceLedgersViewProps {
  initialSubTab?: 'debtors' | 'creditors' | 'cash' | 'banks' | 'pay-in' | 'pay-out';
  onOpenPrintModal?: (title: string, data: any) => void;
}

export const FinanceLedgersView: React.FC<FinanceLedgersViewProps> = ({
  initialSubTab = 'debtors',
  onOpenPrintModal
}) => {
  const [activeSub, setActiveSub] = useState<'debtors' | 'creditors' | 'cash' | 'banks' | 'pay-in' | 'pay-out'>(initialSubTab);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [cashBalance, setCashBalance] = useState({ opening: 650000, in: 385000, out: 189800, closing: 845200 });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              TREASURY &bull; GENERAL LEDGERS &amp; CASH-FLOW
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-400" />
            <span>Commercial Finance, Debtors, Creditors &amp; Banking</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Live balance engines: <strong>Invoice Amount &minus; Advance &minus; Payment = Balance</strong>, pit cash reconciliation, and strict multi-bank ledger separation.
          </p>
        </div>

        <button
          onClick={() => showToast('Payment Voucher initiated')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Bank / Cash Voucher</span>
        </button>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-mono">
        {[
          { id: 'debtors', label: 'Debtors (Receivables)', icon: TrendingUp },
          { id: 'creditors', label: 'Creditors (Payables)', icon: CreditCard },
          { id: 'cash', label: 'Cash Book (Pit & Drawer)', icon: Wallet },
          { id: 'banks', label: `Bank Accounts (${bankAccounts.length})`, icon: Landmark },
          { id: 'pay-in', label: 'Pay-In Vouchers', icon: ArrowDownLeft },
          { id: 'pay-out', label: 'Pay-Out Vouchers', icon: ArrowUpRight }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSub === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSub(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DEBTORS (RECEIVABLES) */}
      {activeSub === 'debtors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Customer Receivables &amp; Aging Schedule</h3>
            <span className="font-mono text-cyan-400 text-xs font-bold">Total Receivables: ₹34,60,000</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {MOCK_SALES_INVOICES.map(inv => (
              <div
                key={inv.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-sans">{inv.customerName}</span>
                    <span className="text-[10px] text-amber-400 font-bold">{inv.invoiceNumber}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Invoice: ₹{inv.totalAmount.toLocaleString()} &minus; Advance Paid: ₹{inv.paidAmount.toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Balance Receivable:</span>
                  <span className="text-base font-black text-cyan-400">₹{inv.balanceAmount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block">Due: {inv.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CREDITORS (PAYABLES) */}
      {activeSub === 'creditors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Vendor &amp; Supplier Payables Ledger</h3>
            <span className="font-mono text-rose-400 text-xs font-bold">Total Payables: ₹18,20,000</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {MOCK_PURCHASE_BILLS.map(bill => (
              <div
                key={bill.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-sans">{bill.supplierName}</span>
                    <span className="text-[10px] text-amber-400 font-bold">{bill.billNumber}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Bill Amount: ₹{bill.totalAmount.toLocaleString()} &minus; Paid: ₹{bill.paidAmount.toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Balance Payable:</span>
                  <span className="text-base font-black text-rose-400">₹{bill.balance.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block">Due: {bill.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CASH BOOK */}
      {activeSub === 'cash' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">Opening Cash Box</span>
              <span className="text-xl font-black text-slate-300">₹{cashBalance.opening.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">+ Today's Cash In</span>
              <span className="text-xl font-black text-emerald-400">+₹{cashBalance.in.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">&minus; Today's Cash Out</span>
              <span className="text-xl font-black text-rose-400">&minus;₹{cashBalance.out.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">Closing Vault Balance</span>
              <span className="text-xl font-black text-amber-400">₹{cashBalance.closing.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 font-mono text-xs">
            <h4 className="font-bold text-white text-xs font-sans">Recent Physical Cash Drawer Transactions</h4>
            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">Weighbridge Spot Cash Sale &bull; 40 MT M-Sand</span>
                  <div className="text-[10px] text-slate-500">Ticket #WB-1092 &bull; 10:45 AM</div>
                </div>
                <span className="text-emerald-400 font-bold">+₹34,000</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">Driver Batta &amp; Toll Cash Advance &bull; Arun Varma</span>
                  <div className="text-[10px] text-slate-500">Trip #TRIP-441 &bull; 08:30 AM</div>
                </div>
                <span className="text-rose-400 font-bold">&minus;₹930</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BANK ACCOUNTS */}
      {activeSub === 'banks' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map(bnk => (
              <div
                key={bnk.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs"
              >
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm font-sans">{bnk.bankName}</h4>
                    <span className="text-[11px] text-slate-500">A/C: {bnk.accountNumber} &bull; IFSC: {bnk.ifsc}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                    {bnk.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Cleared Balance:</span>
                  <span className="text-xl font-black text-amber-400">₹{bnk.currentBalance.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-950">
                  <button
                    onClick={() => showToast(`Initiated Bank Transfer from ${bnk.bankName}`)}
                    className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold cursor-pointer font-sans"
                  >
                    Transfer Funds
                  </button>
                  <button
                    onClick={() => showToast(`Reconciling statement for ${bnk.bankName}`)}
                    className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 font-bold cursor-pointer font-sans"
                  >
                    Reconcile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PAY-IN & PAY-OUT */}
      {(activeSub === 'pay-in' || activeSub === 'pay-out') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm font-sans">
              {activeSub === 'pay-in' ? 'Pay-In Vouchers (Customer Deposits / Capital)' : 'Pay-Out Vouchers (Vendor Bills / Driver Batta)'}
            </h3>
            <span className="text-slate-400 text-xs">Direct double-entry ledger impact</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-slate-300">
              <span>{activeSub === 'pay-in' ? 'Voucher #PI-2026-092 (RTGS from Sobha Developers)' : 'Voucher #PO-2026-044 (Fuel Payment to IOCL)'}</span>
              <span className={`font-bold ${activeSub === 'pay-in' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeSub === 'pay-in' ? '+₹50,000' : '&minus;₹7,73,424'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Authorized by General Manager &bull; Bank Ref: HDFC992102910
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
