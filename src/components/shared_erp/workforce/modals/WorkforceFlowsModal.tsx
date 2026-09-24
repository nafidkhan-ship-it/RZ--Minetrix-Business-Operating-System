import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Users,
  Clock,
  CreditCard,
  Truck,
  DollarSign,
  FolderLock,
  Layers
} from 'lucide-react';
import { WorkforceSectionTab } from '../types';

interface WorkforceFlowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: WorkforceSectionTab) => void;
  onToast: (msg: string) => void;
}

export const WorkforceFlowsModal: React.FC<WorkforceFlowsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onToast
}) => {
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);

  if (!isOpen) return null;

  const FLOWS: {
    id: string;
    title: string;
    description: string;
    targetTab: WorkforceSectionTab;
    steps: {
      title: string;
      desc: string;
      badge: string;
    }[];
  }[] = [
    {
      id: 'flow-1',
      title: 'Flow 1: Employee Onboarding to Active Roll',
      description: 'New hire registration, master department placement, designation grading, and compensation configuration.',
      targetTab: 'employees',
      steps: [
        { title: 'New Employee Form', desc: 'HR enters personal KYC, phone, emergency contact, and photo.', badge: 'HR REGISTRATION' },
        { title: 'Department Placement', desc: 'Assigned to 1 of 14 operational departments (e.g. Quarry Ops).', badge: 'ORGANIZATION' },
        { title: 'Designation & Grade', desc: 'Mapped to formal title (e.g. Quarry Pithead Supervisor, Grade B).', badge: 'GRADING' },
        { title: 'Salary Setup', desc: 'Configured base monthly salary, OT multiplier (1.5x), and batta eligibility.', badge: 'WAGES' },
        { title: 'Active On-Roll', desc: 'Employee status transitions to Active; card added to live directory.', badge: 'COMPLETE' }
      ]
    },
    {
      id: 'flow-2',
      title: 'Flow 2: Attendance & Overtime to Payroll',
      description: 'Daily muster roll capturing present days, grace period tracking, overtime approval, and wage batch aggregation.',
      targetTab: 'attendance',
      steps: [
        { title: 'Shift Check-In', desc: 'Worker punches in via biometric turnstile at pithead or weighbridge.', badge: 'TIME RECORD' },
        { title: 'Attendance Log', desc: 'Status confirmed: Present / Late (>15m) / Half Day / Approved Leave.', badge: 'MUSTER ROLL' },
        { title: 'Working Days Aggregation', desc: 'System tallies total billable days (e.g. 26 days worked).', badge: 'PAYROLL READY' },
        { title: 'Overtime Verification', desc: 'Supervisor authorizes extra emergency hours (e.g. +1.7 hrs @ ₹200/hr).', badge: 'OT APPROVAL' },
        { title: 'Payroll Calculation', desc: 'Wages auto-calculated including basic pay and verified OT differential.', badge: 'NET SALARY' }
      ]
    },
    {
      id: 'flow-3',
      title: 'Flow 3: Staff Advance Request & Recovery',
      description: 'Worker emergency loan sanction, disbursement voucher, and recurring monthly payroll deduction schedule.',
      targetTab: 'advances',
      steps: [
        { title: 'Advance Request', desc: 'Worker submits loan request with specific purpose (e.g. Medical or School Fees).', badge: 'LOAN REQUEST' },
        { title: 'Management Approval', desc: 'Managing Director / HR reviews previous balance and sanctions amount.', badge: 'SANCTION' },
        { title: 'Accounts Disbursement', desc: 'Cash desk / bank payout voucher issued; advance balance opened.', badge: 'PAY-OUT' },
        { title: 'Payroll EMI Deduction', desc: '₹1,000 / month automatically deducted from monthly net salary batch.', badge: 'RECOVERY' },
        { title: 'Ledger Clearance', desc: 'Outstanding balance decreases until fully settled and loan closed.', badge: 'SETTLED' }
      ]
    },
    {
      id: 'flow-4',
      title: 'Flow 4: Tipper Trip to Driver Batta Payout',
      description: 'Integration between Fleet haulage dispatches, driver logbooks, outstation night halts, and batta vouchers.',
      targetTab: 'batta',
      steps: [
        { title: 'Haulage Trip Dispatch', desc: 'Tipper KL-11-BH-9821 leaves quarry with 40 tons of aggregate for Kochi.', badge: 'TRIP DISPATCH' },
        { title: 'Driver Batta Logged', desc: 'Standard trip batta (₹600) + outstation food allowance (₹200) registered.', badge: 'FIELD VOUCHER' },
        { title: 'Fleet Supervisor Signoff', desc: 'Trip odometer and delivery note confirmed at destination.', badge: 'VERIFIED' },
        { title: 'Petty Cash / Fast Payout', desc: 'Driver receives instant batta cash or credited to weekly wage slip.', badge: 'DISBURSED' }
      ]
    },
    {
      id: 'flow-5',
      title: 'Flow 5: End-of-Month Payroll & Salary Slip Issuance',
      description: '11-step batch roll-up, accounts signoff, bank transfer bridge, and official salary slip PDF distribution.',
      targetTab: 'payroll',
      steps: [
        { title: 'Batch Rollup', desc: 'Wages computed across 148 staff based on attendance and authorized batta.', badge: 'CALCULATION' },
        { title: 'Deductions Check', desc: 'Advance EMI, PF, ESI, and statutory taxes subtracted from gross earnings.', badge: 'AUDIT' },
        { title: 'Director Batch Approval', desc: 'Comptroller and MD sign off on ₹48,20,000 disbursement batch.', badge: 'AUTHORIZED' },
        { title: 'Bank Direct NEFT Payout', desc: 'Direct corporate bridge transfers salaries to Federal & SBI bank accounts.', badge: 'TRANSFERRED' },
        { title: 'Official Salary Slip Generated', desc: 'Branded RZ® Minetrix PDF slip generated and shared via SMS/Portal.', badge: 'PAYSLIP' }
      ]
    },
    {
      id: 'flow-6',
      title: 'Flow 6: Statutory License Expiry & Renewal',
      description: 'Proactive audit warnings for DGMS mining certificates, PESO blaster permits, and driver HMV badges.',
      targetTab: 'documents',
      steps: [
        { title: 'Vault Repository', desc: 'All statutory mining fitness certificates and licenses stored digitally.', badge: 'SECURE VAULT' },
        { title: 'Expiry Warning Trigger', desc: '30-day proactive alert flag raised for PESO Shot Firer License.', badge: 'CRITICAL ALERT' },
        { title: 'Medical / RTO Re-test', desc: 'Worker undergoes mandatory fitness examination and compliance inspection.', badge: 'COMPLIANCE' },
        { title: 'Renewed Certificate Upload', desc: 'HR uploads fresh DGMS certification; expiry date advanced by 5 years.', badge: 'RENEWED' }
      ]
    },
    {
      id: 'flow-7',
      title: 'Flow 7: Staff Tasking in RZ® OTT Productivity Suite',
      description: 'Cross-platform bridge between Workforce staff profiles, RZ® OTT task boards, and daily work completion.',
      targetTab: 'dashboard',
      steps: [
        { title: 'Workforce Profile Linked', desc: 'Worker profile mapped to RZ® OTT productivity workspace identity.', badge: 'SHARED CORE' },
        { title: 'Task Allocation', desc: 'Pithead supervisor assigns "Crusher Conveyor Roller Maintenance" task.', badge: 'RZ OTT' },
        { title: 'My Day Execution', desc: 'Staff marks task into "My Day" queue and updates mechanical progress.', badge: 'IN PROGRESS' },
        { title: 'Task Completion Audit', desc: 'Task resolved; supervisor verifies maintenance and links to equipment uptime.', badge: 'RESOLVED' }
      ]
    }
  ];

  const currentFlow = FLOWS[activeFlowIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">RZ&reg; MINETRIX 7 Interactive Studio Flows</h3>
              <p className="text-xs text-slate-400">Step-by-step walkthroughs verifying workforce lifecycle workflows</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Flow Selector Pills */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-slate-800 bg-slate-900 overflow-x-auto scrollbar-none font-mono text-xs">
          {FLOWS.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setActiveFlowIndex(idx)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer shrink-0 border ${
                activeFlowIndex === idx
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              Flow {idx + 1}
            </button>
          ))}
        </div>

        {/* Flow Detail Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 font-mono">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                STUDIO INTERACTIVE WALKTHROUGH
              </span>
              <span className="text-[10px] text-slate-500">
                Flow {activeFlowIndex + 1} of 7
              </span>
            </div>
            <h2 className="text-lg font-black text-white font-sans mt-1">
              {currentFlow.title}
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-1">
              {currentFlow.description}
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-3">
            {currentFlow.steps.map((st, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-4 hover:border-amber-500/40 transition"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
                  {sIdx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white font-sans">{st.title}</h4>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                      {st.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => {
              if (activeFlowIndex > 0) setActiveFlowIndex(activeFlowIndex - 1);
            }}
            disabled={activeFlowIndex === 0}
            className="px-3 py-1.5 rounded-xl bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-bold cursor-pointer"
          >
            &larr; Previous Flow
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateTab(currentFlow.targetTab);
              onToast(`Navigated to ${currentFlow.targetTab.toUpperCase()} workspace`);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <span>Launch This Module in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (activeFlowIndex < FLOWS.length - 1) setActiveFlowIndex(activeFlowIndex + 1);
            }}
            disabled={activeFlowIndex === FLOWS.length - 1}
            className="px-3 py-1.5 rounded-xl bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-bold cursor-pointer"
          >
            Next Flow &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
