import React, { useState } from 'react';
import {
  Users,
  Search,
  DollarSign,
  FileText,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CustomerAccount, COMMERCE_CUSTOMER_ACCOUNTS } from '../../data/ecommerceStudioData';

export const CustomerAccountsView: React.FC = () => {
  const [accounts, setAccounts] = useState<CustomerAccount[]>(COMMERCE_CUSTOMER_ACCOUNTS);
  const [selectedAcc, setSelectedAcc] = useState<CustomerAccount | null>(COMMERCE_CUSTOMER_ACCOUNTS[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              CLIENT AR & COMMERCIAL LEDGERS
            </span>
            <span className="text-xs text-slate-400 font-medium">Credit Limits & Outstanding</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Customer Accounts ({accounts.length})</h1>
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
                    ? 'bg-slate-900 border-amber-500/50 shadow-xl'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">{acc.id}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{acc.customerName}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {acc.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <div>Company: <span className="text-white font-medium">{acc.companyName || 'Individual Builder'}</span></div>
                  <div>Phone: <span className="text-white font-mono">{acc.phone}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Total Purchases: <strong className="text-white">₹{acc.totalPurchasesRs.toLocaleString()}</strong></span>
                  <span className="text-amber-400 font-bold">Outstanding: ₹{acc.outstandingBalanceRs.toLocaleString()}</span>
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
                <h3 className="text-base font-black text-white mt-0.5">{selectedAcc.customerName}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{selectedAcc.paymentTerms}</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div><span className="text-slate-500">GSTIN:</span> <span className="text-white font-mono">{selectedAcc.gstNumber || 'Unregistered'}</span></div>
              <div><span className="text-slate-500">Credit Limit:</span> <span className="text-white font-mono font-bold">₹{selectedAcc.creditLimitRs.toLocaleString()}</span></div>
              <div><span className="text-slate-500">Total Completed Orders:</span> <span className="text-white font-mono">{selectedAcc.totalOrdersCount} orders</span></div>
              <div><span className="text-slate-500">Last Active Order:</span> <span className="text-amber-400 font-mono">{selectedAcc.lastOrderDate}</span></div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert(`Generating statement for ${selectedAcc.customerName}`)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
              >
                Generate Account Statement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
