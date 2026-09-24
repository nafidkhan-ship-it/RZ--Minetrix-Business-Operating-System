import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Printer,
  Download,
  Search,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';
import {
  DEMO_LAND_OWNERS,
  DEMO_OWNER_ACCOUNTS,
  DEMO_OWNER_ADVANCES,
  DEMO_OWNER_PAYMENTS,
  DEMO_OWNER_SETTLEMENTS,
  DEMO_OWNER_STATEMENTS,
  getLandDashboardMetrics
} from '../../../data/quarryLandData';

interface LandFinanceViewProps {
  onOpenOwnerProfile: (ownerId: string) => void;
  onOpenAdvance: (ownerId?: string) => void;
  onOpenPayment: (ownerId?: string) => void;
  onOpenSettlement: (ownerId?: string) => void;
  initialTab?: 'accounts' | 'advances' | 'payments' | 'settlements' | 'statements';
}

export const LandFinanceView: React.FC<LandFinanceViewProps> = ({
  onOpenOwnerProfile,
  onOpenAdvance,
  onOpenPayment,
  onOpenSettlement,
  initialTab = 'accounts'
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'advances' | 'payments' | 'settlements' | 'statements'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const metrics = getLandDashboardMetrics();

  const handleExportCSV = (type: string) => {
    alert(`Exporting ${type} CSV statement... File generated.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
              Platform 7 &bull; Commercial Payouts & Audit
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Double-Entry Land Ledger
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Land Owner Financial Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Owner Accounts, Advances, Payments, Settlement Runs, and Chronological Statements.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenAdvance()}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Issue Advance</span>
          </button>
          <button
            onClick={() => onOpenPayment()}
            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Record Payment</span>
          </button>
          <button
            onClick={() => onOpenSettlement()}
            className="px-3 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+ Settlement Run</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-[11px]">Total Owner Payables Earned</div>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            ₹{metrics.totalPayablesEarned.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500">Based on verified weighment loads</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-[11px]">Total Advances Disbursed</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
            ₹{metrics.totalAdvances.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-amber-400">
            ₹{metrics.remainingAdvances.toLocaleString('en-IN')} Active Unadjusted
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-[11px]">Direct Payments Made</div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
            ₹{metrics.totalPaid.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400">100% Direct Bank RTGS/NEFT</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-[11px]">Net Outstanding Payable</div>
          <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
            ₹{metrics.totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-rose-400">Payable across 5 Land Owners</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'accounts', label: '1. Owner Accounts' },
            { id: 'advances', label: '2. Owner Advances' },
            { id: 'payments', label: '3. Payments Disbursed' },
            { id: 'settlements', label: '4. Settlement Runs' },
            { id: 'statements', label: '5. Statements & Audit' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => handleExportCSV(activeTab)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OWNER ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h3 className="text-base font-black text-white">Land Owner Balance Ledgers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3">Bank Routing</th>
                  <th className="py-2.5 px-3 text-right">Agreed Value</th>
                  <th className="py-2.5 px-3 text-right">Load Payables</th>
                  <th className="py-2.5 px-3 text-right">Advances</th>
                  <th className="py-2.5 px-3 text-right">Paid Amount</th>
                  <th className="py-2.5 px-3 text-right">Net Outstanding</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {DEMO_LAND_OWNERS.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white font-sans">{o.name}</div>
                      <div className="text-[10px] text-purple-400">{o.id}</div>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300 text-[10px]">
                      {o.bankDetails.bankName}
                      <span className="block font-mono text-slate-500">A/C: {o.bankDetails.accountNumber}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      ₹{(DEMO_OWNER_ACCOUNTS.find(a => a.ownerId === o.id)?.totalAgreementsValueRs || (o.totalPayableEarnedRs + o.outstandingBalanceRs)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-cyan-400 font-bold">
                      ₹{o.totalPayableEarnedRs.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-400">
                      ₹{o.totalAdvancesReceivedRs.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400">
                      ₹{o.totalPaidReceivedRs.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-rose-400 text-xs">
                      ₹{o.outstandingBalanceRs.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={() => onOpenOwnerProfile(o.id)}
                        className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-[10px] transition cursor-pointer"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADVANCES */}
      {activeTab === 'advances' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white">Owner Advances & Commitments</h3>
            <button
              onClick={() => onOpenAdvance()}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              + Issue Advance
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                  <th className="py-2.5 px-3">Advance No</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Land Owner</th>
                  <th className="py-2.5 px-3">Agreement</th>
                  <th className="py-2.5 px-3">Method & Ref</th>
                  <th className="py-2.5 px-3 text-right">Advance Amount</th>
                  <th className="py-2.5 px-3 text-right">Adjusted</th>
                  <th className="py-2.5 px-3 text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {DEMO_OWNER_ADVANCES.map((adv) => (
                  <tr key={adv.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-amber-400">{adv.advanceNumber}</td>
                    <td className="py-3 px-3 text-slate-300">{adv.date}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onOpenOwnerProfile(adv.ownerId)}
                        className="font-bold text-white font-sans hover:text-purple-300 cursor-pointer"
                      >
                        {adv.ownerName}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-purple-300">{adv.agreementNumber}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-200 font-sans">{adv.paymentMethod}</span>
                      <span className="block text-[10px] text-slate-500">{adv.referenceNumber}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-amber-400">
                      ₹{adv.amountRs.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400">
                      ₹{adv.adjustedAgainstLoadsRs.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      ₹{adv.remainingAdvanceRs.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white">Disbursed Payment Logs</h3>
            <button
              onClick={() => onOpenPayment()}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              + Record Payment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                  <th className="py-2.5 px-3">Payment No</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Land Owner</th>
                  <th className="py-2.5 px-3">Agreement</th>
                  <th className="py-2.5 px-3">Mode & Bank Ref</th>
                  <th className="py-2.5 px-3 font-sans">Remarks / Notes</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {DEMO_OWNER_PAYMENTS.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-emerald-400">{p.paymentNumber}</td>
                    <td className="py-3 px-3 text-slate-300">{p.date}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onOpenOwnerProfile(p.ownerId)}
                        className="font-bold text-white font-sans hover:text-purple-300 cursor-pointer"
                      >
                        {p.ownerName}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-purple-300">{p.agreementNumber}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-200 font-sans">{p.paymentMethod}</span>
                      <span className="block text-[10px] text-slate-500">{p.referenceNumber}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans text-xs">{p.notes}</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-400 text-xs">
                      ₹{p.amountRs.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SETTLEMENTS */}
      {activeTab === 'settlements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white">Periodic Settlement Runs</h3>
            <button
              onClick={() => onOpenSettlement()}
              className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              + Create Settlement
            </button>
          </div>

          <div className="space-y-3">
            {DEMO_OWNER_SETTLEMENTS.map((set) => (
              <div
                key={set.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-400">{set.settlementNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {set.settlementStatus}
                    </span>
                    <span className="text-slate-400 font-mono">{set.date}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">
                    {set.ownerName} &bull; Period: {set.period}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    Agreement: {set.agreementNumber} | Bench: {set.workingAreaName} | {set.totalLoadsCount} Loads
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Payout</div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    ₹{set.netPayableRs.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Gross: ₹{set.totalPayableRs.toLocaleString('en-IN')} - Advance Ded: ₹{set.advanceDeductionRs.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STATEMENTS */}
      {activeTab === 'statements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Chronological Running Balance Ledger</h3>
              <p className="text-xs text-slate-400">Audit trail for V. Prabhakar Pai (RZ-LND-OWN-001)</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ledger</span>
              </button>
              <button
                onClick={() => handleExportCSV('Owner_Ledger')}
                className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Reference</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Debit (Payout)</th>
                  <th className="py-2 px-3 text-right">Credit (Earned)</th>
                  <th className="py-2 px-3 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {DEMO_OWNER_STATEMENTS.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-slate-300">{st.date}</td>
                    <td className="py-2.5 px-3 text-purple-400 font-bold">{st.referenceNo}</td>
                    <td className="py-2.5 px-3 text-white font-sans">{st.remarks}</td>
                    <td className="py-2.5 px-3 text-right text-rose-400">
                      {st.debitRs ? `₹${st.debitRs.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">
                      {st.creditRs ? `₹${st.creditRs.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-white">
                      ₹{st.balanceRs.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
