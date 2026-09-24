import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  FileText,
  Search,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { SupplierAccount, COMMERCE_SUPPLIER_ACCOUNTS } from '../../data/ecommerceStudioData';

export const SupplierAccountsView: React.FC = () => {
  const [accounts, setAccounts] = useState<SupplierAccount[]>(COMMERCE_SUPPLIER_ACCOUNTS);
  const [selectedAcc, setSelectedAcc] = useState<SupplierAccount | null>(COMMERCE_SUPPLIER_ACCOUNTS[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              PRODUCER ACCOUNTS PAYABLE & ESCROW
            </span>
            <span className="text-xs text-slate-400 font-medium">Quarry Concession Settlements</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Supplier Accounts ({accounts.length})</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          {accounts.map((acc) => {
            const isSelected = selectedAcc?.id === acc.id;
            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAcc(acc)}
                className={`p-5 rounded-3xl border transition cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/50 shadow-xl'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">{acc.id}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{acc.supplierName}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {acc.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <div>Bank: <span className="text-white font-mono">{acc.bankDetails}</span></div>
                  <div>Terms: <span className="text-slate-300">{acc.settlementTerms}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Total Billed: <strong className="text-white">₹{acc.totalBilledRs.toLocaleString()}</strong></span>
                  <span className="text-emerald-400 font-bold">Escrow Payable: ₹{acc.pendingPayableRs.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedAcc && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 self-start sticky top-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">{selectedAcc.id}</span>
                <h3 className="text-base font-black text-white mt-0.5">{selectedAcc.supplierName}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{selectedAcc.gstNumber}</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Total Cleared Payouts:</span>
                <span className="text-white font-bold">₹{selectedAcc.totalPaidRs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pending Payouts:</span>
                <span className="text-emerald-400 font-bold">₹{selectedAcc.pendingPayableRs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Payout Date:</span>
                <span className="text-white">{selectedAcc.lastPayoutDate}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert(`Initiating batch escrow release for ${selectedAcc.supplierName}`)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
              >
                Release Verified Payout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
