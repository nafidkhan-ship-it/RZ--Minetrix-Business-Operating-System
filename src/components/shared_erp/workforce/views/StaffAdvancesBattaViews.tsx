import React, { useState } from 'react';
import {
  CreditCard,
  Truck,
  Plus,
  ArrowRight,
  Printer,
  Download,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { StaffAdvance, BattaEntry, WorkforceSectionTab } from '../types';
import { MOCK_STAFF_ADVANCES, MOCK_BATTA_ENTRIES } from '../workforceMockData';

interface ViewProps {
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onNavigateTab?: (tab: WorkforceSectionTab) => void;
}

/* ========================================================================
   1. STAFF ADVANCES VIEW
   ======================================================================== */
export const StaffAdvancesView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [advances, setAdvances] = useState<StaffAdvance[]>(MOCK_STAFF_ADVANCES);

  const totalAdvanceDisbursed = advances.reduce((acc, curr) => acc + curr.advanceAmount, 0);
  const totalRecovered = advances.reduce((acc, curr) => acc + curr.recoveredAmount, 0);
  const totalOutstanding = advances.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              WORKFORCE LOANS &amp; ADVANCES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span>Staff Advance &amp; EMI Recovery Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tracking loan approvals, disbursements, monthly salary recovery plans, and remaining balances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPrintModal?.('Staff Advances Ledger', advances)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ledger</span>
          </button>
          <button
            onClick={() => onToast('Opened New Staff Advance Request Dialog')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Staff Advance</span>
          </button>
        </div>
      </div>

      {/* Advance Visual Lifecycle Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Staff Advance Lifecycle:
          </span>
          <span className="text-[10px] text-slate-500">Structured workflow for workforce advance requests</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['Advance Request', 'Director Approval', 'Cash/Bank Payment', 'Monthly Recovery', 'Balance Clearance', 'Loan Closed'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0">
                <span className="text-amber-400 text-[10px]">{idx + 1}.</span>
                <span>{step}</span>
              </div>
              {idx < 5 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Total Sanctioned</span>
          <div className="text-xl font-black text-white mt-0.5">₹{totalAdvanceDisbursed.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400">{advances.length} Active Loans</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Recovered</span>
          <div className="text-xl font-black text-emerald-400 mt-0.5">₹{totalRecovered.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-emerald-400">Via monthly payroll</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Outstanding Balance</span>
          <div className="text-xl font-black text-yellow-400 mt-0.5">₹{totalOutstanding.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400">Active EMIs</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Recovery Health</span>
          <div className="text-xl font-black text-cyan-400 mt-0.5">100% On-Time</div>
          <span className="text-[10px] text-cyan-400">0 Defaults</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Advance ID</th>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Disbursed Date</th>
                <th className="py-3.5 px-4 font-bold">Purpose</th>
                <th className="py-3.5 px-4 font-bold">Sanctioned Amount</th>
                <th className="py-3.5 px-4 font-bold">Recovered</th>
                <th className="py-3.5 px-4 font-bold">Outstanding Balance</th>
                <th className="py-3.5 px-4 font-bold">Recovery Plan</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {advances.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-amber-400 font-bold">{a.id}</td>
                  <td className="py-3 px-4">
                    <span className="text-white font-bold font-sans block">{a.employeeName}</span>
                    <span className="text-[10px] text-slate-500">{a.employeeId} &bull; {a.department}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{a.advanceDate}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-[11px] max-w-[170px] truncate">{a.purpose}</td>
                  <td className="py-3 px-4 text-white font-bold">₹{a.advanceAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">₹{a.recoveredAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">₹{a.balance.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-slate-300 text-[11px]">{a.recoveryPlan}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onToast(`Printed advance receipt for ${a.employeeName}`)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                      >
                        Receipt
                      </button>
                      <button
                        onClick={() => onToast(`Manual recovery recorded for ${a.employeeName}`)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-bold cursor-pointer"
                      >
                        Recovery
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

/* ========================================================================
   2. BATTA & ALLOWANCES VIEW
   ======================================================================== */
export const BattaView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [battaEntries, setBattaEntries] = useState<BattaEntry[]>(MOCK_BATTA_ENTRIES);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              TRIP, HAULAGE &amp; FIELD ALLOWANCES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Driver Batta &amp; Field Allowances</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Trip batta linked to tipper dispatches, night halt allowances, food vouchers, and outstation trips.
          </p>
        </div>

        <button
          onClick={() => onToast('Opened Add Batta Entry Dialog')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Batta Voucher</span>
        </button>
      </div>

      {/* Vehicle / Trip Accounts Connection Notice */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-cyan-300">
            <strong>Cross-Module Integration:</strong> Driver Trip Batta auto-syncs with <em>Fleet Dispatch Logs</em> and <em>Vehicle Cost Accounts</em> for direct trip margin calculation.
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 uppercase shrink-0">
          FLEET LOGISTICS SYNCED
        </span>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Voucher ID</th>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Allowance Type</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Vehicle / Trip Reference</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Approved By</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {battaEntries.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-amber-400 font-bold">{b.id}</td>
                  <td className="py-3 px-4">
                    <span className="text-white font-bold font-sans block">{b.employeeName}</span>
                    <span className="text-[10px] text-slate-500">{b.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">{b.type}</td>
                  <td className="py-3 px-4 text-slate-300">{b.date}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-[11px] max-w-[200px] truncate">
                    {b.reference} {b.vehicleNo && <span className="text-amber-400 font-mono font-bold">({b.vehicleNo})</span>}
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-400 text-sm">₹{b.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{b.approvedBy || 'Pending'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        b.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : b.status === 'Approved'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <button
                      onClick={() => onToast(`Voucher ${b.id} approved for cash disbursement`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-bold cursor-pointer"
                    >
                      Approve &amp; Pay
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
