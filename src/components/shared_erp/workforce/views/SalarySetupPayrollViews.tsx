import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  ArrowRight,
  Sparkles,
  Layers,
  FileCheck,
  CreditCard,
  Building2,
  Calendar
} from 'lucide-react';
import { SalarySetupItem, PayrollRecord, WorkforceSectionTab } from '../types';
import { MOCK_SALARY_SETUP, MOCK_PAYROLL_RECORDS } from '../workforceMockData';

interface ViewProps {
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onNavigateTab?: (tab: WorkforceSectionTab) => void;
}

/* ========================================================================
   1. SALARY SETUP VIEW
   ======================================================================== */
export const SalarySetupView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [setupList, setSetupList] = useState<SalarySetupItem[]>(MOCK_SALARY_SETUP);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              COMPENSATION &amp; WAGE CONFIGURATION
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>Salary Master Setup &amp; Rules</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Static compensation structure (Daily Wage, Weekly Wage, Monthly Salary) separate from disbursement runs.
          </p>
        </div>

        <button
          onClick={() => onToast('Opened Configure Salary Bracket Dialog')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Salary Structure</span>
        </button>
      </div>

      {/* Salary Structure Categories Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-amber-400 font-bold uppercase text-[11px] block">1. Daily Wage Structure</span>
          <p className="text-slate-400 font-sans text-[11px]">
            Pithead drillers, quarry labor, crusher conveyor screen mechanics. Computed as <em>Daily Rate &times; Present Days</em>.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-cyan-400 font-bold uppercase text-[11px] block">2. Weekly Wage Structure</span>
          <p className="text-slate-400 font-sans text-[11px]">
            Contract site loading crews, external maintenance sub-teams. Disbursed every Saturday evening.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-emerald-400 font-bold uppercase text-[11px] block">3. Monthly Salary Structure</span>
          <p className="text-slate-400 font-sans text-[11px]">
            Supervisors, accounts, dispatch officers, executive leads, and fleet drivers with fixed monthly minimum.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Department</th>
                <th className="py-3.5 px-4 font-bold">Salary Model</th>
                <th className="py-3.5 px-4 font-bold">Base Rate</th>
                <th className="py-3.5 px-4 font-bold">OT Rate</th>
                <th className="py-3.5 px-4 font-bold">Batta Rate</th>
                <th className="py-3.5 px-4 font-bold">Fixed Allowances</th>
                <th className="py-3.5 px-4 font-bold">Statutory Deductions</th>
                <th className="py-3.5 px-4 font-bold">Advance Recovery</th>
                <th className="py-3.5 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {setupList.map((s) => (
                <tr key={s.employeeId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="text-white font-bold font-sans block">{s.employeeName}</span>
                    <span className="text-[10px] text-amber-400">{s.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{s.department}</td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">{s.salaryType}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    ₹{s.basicSalary.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">
                      {s.dailyRate ? '/day' : '/mo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-purple-400 font-bold">₹{s.overtimeRate}/hr</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">₹{s.battaRate}/day</td>
                  <td className="py-3 px-4 text-slate-200">₹{s.fixedAllowance.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-rose-400">₹{s.statutoryDeductions.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">₹{s.advanceDeductionPlan}/mo</td>
                  <td className="py-3 px-4 text-center font-sans">
                    <button
                      onClick={() => onToast(`Configuring compensation parameters for ${s.employeeName}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                    >
                      Edit Rules
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

/* ========================================================================
   2. PAYROLL BATCH VIEW
   ======================================================================== */
export const PayrollView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(MOCK_PAYROLL_RECORDS);

  const handleApproveBatch = () => {
    setPayrollRecords((prev) =>
      prev.map((p) => (p.status !== 'Paid' ? { ...p, status: 'Approved' } : p))
    );
    onToast('Approved all verified payroll records for March 2026');
  };

  const handleDisburseBatch = () => {
    setPayrollRecords((prev) =>
      prev.map((p) => ({ ...p, status: 'Paid', paymentDate: '2026-03-24' }))
    );
    onToast('Disbursed March 2026 payroll batch via Bank NEFT Direct Bridge');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              MONTHLY PAYROLL ENGINE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span>Payroll Batch Processing &bull; March 2026</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated roll-up of working days, overtime hours, batta vouchers, and advance deductions into Net Salary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onToast('Recomputed attendance & OT for current cycle')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Recalculate Batch</span>
          </button>
          <button
            onClick={handleApproveBatch}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-emerald-500/30"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve All</span>
          </button>
          <button
            onClick={handleDisburseBatch}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <DollarSign className="w-4 h-4" />
            <span>Disburse Batch Pay</span>
          </button>
        </div>
      </div>

      {/* 11-Step Payroll Visual Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            11-Step Payroll Pipeline:
          </span>
          <span className="text-[10px] text-slate-500">Automated end-of-month calculation cycle</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {[
            'Attendance',
            'Working Days',
            'Salary Calc',
            'Overtime',
            'Batta',
            'Advance Ded.',
            'Other Ded.',
            'Net Salary',
            'Approval',
            'Payment',
            'Salary Slip'
          ].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold whitespace-nowrap flex items-center gap-1 shrink-0">
                <span className="text-amber-400 text-[9px]">{idx + 1}.</span>
                <span>{step}</span>
              </div>
              {idx < 10 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Payroll This Month</span>
          <div className="text-lg font-black text-white mt-0.5">₹48,20,000</div>
          <span className="text-[10px] text-blue-400">Total batch cost</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Review</span>
          <div className="text-lg font-black text-amber-400 mt-0.5">₹14,50,000</div>
          <span className="text-[10px] text-slate-400">Draft records</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Approved Batch</span>
          <div className="text-lg font-black text-indigo-400 mt-0.5">₹29,65,000</div>
          <span className="text-[10px] text-indigo-400">Ready for payment</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Paid Out</span>
          <div className="text-lg font-black text-emerald-400 mt-0.5">₹4,05,000</div>
          <span className="text-[10px] text-emerald-400">Accounts verified</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Advances Deducted</span>
          <div className="text-lg font-black text-yellow-400 mt-0.5">₹5,500</div>
          <span className="text-[10px] text-slate-400">Recovered this run</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Deductions</span>
          <div className="text-lg font-black text-rose-400 mt-0.5">₹10,500</div>
          <span className="text-[10px] text-slate-400">PF + ESI + TDS</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Days</th>
                <th className="py-3.5 px-4 font-bold">Basic Salary</th>
                <th className="py-3.5 px-4 font-bold">Overtime</th>
                <th className="py-3.5 px-4 font-bold">Batta</th>
                <th className="py-3.5 px-4 font-bold">Allowances</th>
                <th className="py-3.5 px-4 font-bold">Adv. Ded.</th>
                <th className="py-3.5 px-4 font-bold">Other Ded.</th>
                <th className="py-3.5 px-4 font-bold">Net Salary</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payrollRecords.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="text-white font-bold font-sans block">{p.employeeName}</span>
                    <span className="text-[10px] text-slate-500">{p.employeeId} &bull; {p.department}</span>
                  </td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">{p.workingDays}d</td>
                  <td className="py-3 px-4 text-white">₹{p.basic.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-purple-400">₹{p.overtime.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-amber-400">₹{p.batta.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-slate-300">₹{p.allowances.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">-₹{p.advanceDeduction.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-rose-400">-₹{p.otherDeductions.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-black text-emerald-400 text-sm">
                    ₹{p.netSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        p.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : p.status === 'Approved'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : p.status === 'Calculated'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          onToast(`Generated salary slip for ${p.employeeName}`);
                          onNavigateTab?.('salary-slips');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-bold cursor-pointer"
                      >
                        Salary Slip
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
