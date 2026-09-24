import React from 'react';
import {
  Users,
  Clock,
  DollarSign,
  FolderLock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowRight,
  Sparkles,
  Building2,
  Truck,
  Layers,
  FileCheck,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { WorkforceSectionTab } from '../types';

interface WorkforceDashboardViewProps {
  onNavigateTab: (tab: WorkforceSectionTab) => void;
  onToast: (msg: string) => void;
}

export const WorkforceDashboardView: React.FC<WorkforceDashboardViewProps> = ({
  onNavigateTab,
  onToast
}) => {
  return (
    <div className="space-y-6">
      {/* Studio Demo Data Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-amber-300 font-medium">
            <strong className="font-bold text-amber-200">STUDIO PREVIEW / DEMO DATA:</strong> Workforce numbers, attendance records, biometric queues, and salary disbursements are simulated for Studio verification.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase border border-amber-500/30">
            14 DEPARTMENTS
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase border border-emerald-500/30">
            148 ON ROLL
          </span>
        </div>
      </div>

      {/* 5 Executive Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. PEOPLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">People &amp; Headcount</h3>
                <p className="text-[11px] text-slate-400">Total staff distribution</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('employees')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Total Staff</span>
              <div className="text-xl font-black text-white font-mono mt-0.5">148</div>
              <span className="text-[10px] text-blue-400">14 Active units</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Active</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">142</div>
              <span className="text-[10px] text-emerald-400">95.9% available</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">New Joiners</span>
              <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">6</div>
              <span className="text-[10px] text-slate-400">Joined this month</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Inactive / Leave</span>
              <div className="text-xl font-black text-slate-400 font-mono mt-0.5">6</div>
              <span className="text-[10px] text-amber-400">Suspended / exit</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Quarry &amp; Plant Workers:</span>
              <span className="font-bold text-white font-mono">58 (39.2%)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Fleet Logistics Drivers:</span>
              <span className="font-bold text-white font-mono">28 (18.9%)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Office &amp; Commercial Staff:</span>
              <span className="font-bold text-white font-mono">62 (41.9%)</span>
            </div>
          </div>
        </div>

        {/* 2. ATTENDANCE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Daily Attendance</h3>
                <p className="text-[11px] text-slate-400">Today: 24 March 2026</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Live Roll</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Present</span>
              <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">134</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Absent</span>
              <div className="text-lg font-black text-rose-400 font-mono mt-0.5">5</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Late</span>
              <div className="text-lg font-black text-orange-400 font-mono mt-0.5">7</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-bold">On Leave</span>
              <div className="text-lg font-black text-amber-400 font-mono mt-0.5">3</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 col-span-2 sm:col-span-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Overtime Logged</span>
              <div className="text-lg font-black text-purple-400 font-mono mt-0.5">4 Staff (18 hrs)</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Biometric Gateway Status</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
              STANDBY
            </span>
          </div>
        </div>

        {/* 3. PAYROLL */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Payroll &amp; Advances</h3>
                <p className="text-[11px] text-slate-400">March 2026 Batch</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('payroll')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Batch</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Gross Payroll Estimated:</span>
              <span className="text-base font-black text-white font-mono">₹48,20,000</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '84%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Verified: 84%</span>
              <span>Pending Signoff: 16%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Advances</span>
              <div className="text-sm font-black text-yellow-400 font-mono mt-0.5">₹3,45,000</div>
              <span className="text-[9px] text-slate-500">18 active EMIs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Deductions</span>
              <div className="text-sm font-black text-rose-400 font-mono mt-0.5">₹2,10,000</div>
              <span className="text-[9px] text-slate-500">PF, ESI &amp; advance</span>
            </div>
          </div>
        </div>

        {/* 4. DOCUMENTS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FolderLock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Staff Documents &amp; Compliance</h3>
                <p className="text-[11px] text-slate-400">Statutory certifications &amp; IDs</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('documents')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Vault</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Valid</span>
              <span className="text-base font-black text-emerald-400 font-mono">132</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Expiring</span>
              <span className="text-base font-black text-amber-400 font-mono">6</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Expired</span>
              <span className="text-base font-black text-rose-400 font-mono">3</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Missing</span>
              <span className="text-base font-black text-slate-300 font-mono">7</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Critical Expiry Alert</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Muhammed Shafi’s <strong>PESO Shot Firer Blaster License</strong> expires on 31 March 2026. Renewal processing mandatory.
            </p>
          </div>
        </div>

        {/* 5. WORKFORCE COST */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Total Workforce Cost Breakdown</h3>
                <p className="text-[11px] text-slate-400">Month to Date: ₹49,15,000 total commitment</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Cost Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Base Salaries</span>
              <div className="text-lg font-black text-white font-mono mt-0.5">₹44,50,000</div>
              <span className="text-[10px] text-slate-400">90.5% of total</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Trip &amp; Daily Batta</span>
              <div className="text-lg font-black text-amber-400 font-mono mt-0.5">₹2,10,000</div>
              <span className="text-[10px] text-slate-400">Fleet &amp; pithead</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Overtime Pay</span>
              <div className="text-lg font-black text-purple-400 font-mono mt-0.5">₹1,60,000</div>
              <span className="text-[10px] text-slate-400">Peak extraction OT</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Other HR Cost</span>
              <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">₹95,000</div>
              <span className="text-[10px] text-slate-400">PPE kits &amp; welfare</span>
            </div>
          </div>

          {/* Visual multi-segment bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Cost Proportion Bar</span>
              <span className="text-emerald-400 font-bold">Budget Health: Optimal (88% of Cap)</span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full flex overflow-hidden border border-slate-800">
              <div className="bg-blue-500 h-full" style={{ width: '90.5%' }} title="Salaries: 90.5%" />
              <div className="bg-amber-500 h-full" style={{ width: '4.3%' }} title="Batta: 4.3%" />
              <div className="bg-purple-500 h-full" style={{ width: '3.3%' }} title="Overtime: 3.3%" />
              <div className="bg-cyan-500 h-full" style={{ width: '1.9%' }} title="Other: 1.9%" />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Salary (90.5%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Batta (4.3%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Overtime (3.3%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Other (1.9%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Attention Action Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Workforce Immediate Attention Queue</h3>
              <p className="text-xs text-slate-400">Items requiring HR / Accounts / Manager review and authorization</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('approvals')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Open Approvals Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">Suresh Babu &bull; Sick Leave</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">2 DAYS</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Viral fever medical leave request submitted. Awaiting pithead supervisor endorsement.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => { onToast('Approved Suresh Babu Leave'); }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => onNavigateTab('leave')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold cursor-pointer"
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">Mustafa K. &bull; OT Claim</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">1.7 HRS</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Crusher rotor screen bearing greasing beyond normal evening shift. Claim: ₹340.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => { onToast('Approved Mustafa K. Overtime (₹340)'); }}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-[10px] font-bold cursor-pointer"
                >
                  Authorize
                </button>
                <button
                  onClick={() => onNavigateTab('overtime')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-yellow-500/40 transition flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">Kiran Dev &bull; Staff Advance</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold">₹2,000</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Emergency bike repair loan requested. Deduction planned at ₹1,000 / month.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => { onToast('Approved Kiran Dev Advance (₹2,000)'); }}
                  className="px-2.5 py-1 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-[10px] font-bold cursor-pointer"
                >
                  Sanction
                </button>
                <button
                  onClick={() => onNavigateTab('advances')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold cursor-pointer"
                >
                  View Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
