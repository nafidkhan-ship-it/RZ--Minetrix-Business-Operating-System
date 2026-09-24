import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  User,
  FileText,
  FileSignature,
  ClipboardList,
  Briefcase,
  Boxes,
  TrendingUp,
  Receipt,
  CreditCard,
  PieChart,
  X
} from 'lucide-react';

interface JobWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (view: string) => void;
}

interface WorkflowStep {
  step: number;
  title: string;
  category: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  sampleData: string;
  targetView: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: 'Customer Submits Requirement',
    category: 'CRM & RFQ',
    desc: 'Prestige Estates submits RFQ for 25,000 MT Crushed Stone & VSI Sand for Commercial Tech Park.',
    icon: User,
    sampleData: 'RFQ-2026-001 • Prestige Estates Ltd • ₹45,00,000',
    targetView: 'requirements'
  },
  {
    step: 2,
    title: 'Quotation Generated & Approved',
    category: 'Sales Estimation',
    desc: 'Detailed cost estimation with material rates, transport margins, and 18% GST schedule.',
    icon: FileText,
    sampleData: 'QT-2026-041 • ₹42,50,000 • Margin: 28%',
    targetView: 'quotations'
  },
  {
    step: 3,
    title: 'Agreement Drafted & Digitally Signed',
    category: 'Commercial Legal',
    desc: 'Contract terms established: 15% advance, 5% retention guarantee, and staged milestone schedule.',
    icon: FileSignature,
    sampleData: 'AGR-2026-019 • Signed by Er. Sandeep Hegde (E-Sign Validated)',
    targetView: 'agreements'
  },
  {
    step: 4,
    title: 'Work Order Dispatched to Contractor',
    category: 'Field Directive',
    desc: 'Operational directive issued to Coastal Blasting & Excavations with pit bench coordinates & safety caps.',
    icon: ClipboardList,
    sampleData: 'WO-2026-089 • Coastal Blasting & Excavations • High Priority',
    targetView: 'work-orders'
  },
  {
    step: 5,
    title: 'Contract Job Initialized',
    category: 'Project Control',
    desc: 'Full job workspace created with tracking of budgets, manager in-charge, and site location.',
    icon: Briefcase,
    sampleData: 'JOB-4001 • Moodbidri Quarry Pit No. 2 • Progress: 48%',
    targetView: 'jobs'
  },
  {
    step: 6,
    title: 'Cross-Platform Resources Mobilized',
    category: 'Supply Chain Allocation',
    desc: 'Aggregates drawn from Platform 1 & 2, fleet tennants from Platform 3, 14 workers deployed.',
    icon: Boxes,
    sampleData: '12,500 MT Rock • 6 Tippers (Platform 3) • 14 Workers',
    targetView: 'materials'
  },
  {
    step: 7,
    title: 'Daily Site Progress Logged',
    category: 'Site Execution',
    desc: 'Daily blasting yield verified, weighbridge receipts audited, cumulative completion updated.',
    icon: TrendingUp,
    sampleData: 'Daily Diary Logged • 1,200 MT Crushed • 48% Target Met',
    targetView: 'jobs'
  },
  {
    step: 8,
    title: 'Milestone Progress Bill (RA) Issued',
    category: 'Billing & Invoicing',
    desc: 'Stage 1 milestone reached: Running Account invoice generated with 5% retention deduction.',
    icon: Receipt,
    sampleData: 'INV-2026-089 • Taxable ₹12,00,000 • Net ₹13,56,000',
    targetView: 'billing'
  },
  {
    step: 9,
    title: 'Client Payment Received via RTGS',
    category: 'Cash Collection',
    desc: 'Customer settles invoice with 2% TDS deduction; bank reconciliation completed.',
    icon: CreditCard,
    sampleData: 'PAY-2026-081 • ₹11,76,000 Net • Ref: HDFC-RTGS-998822',
    targetView: 'payments'
  },
  {
    step: 10,
    title: 'Job Profit & Loss Statement Audited',
    category: 'Final Financials',
    desc: 'Revenue minus direct quarry, contractor and fleet costs yielded 27.2% net profit margin.',
    icon: PieChart,
    sampleData: 'Net Profit: ₹11,40,000 • Contribution Margin: 27.2%',
    targetView: 'pnl'
  }
];

export const JobWorkflowModal: React.FC<JobWorkflowModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < WORKFLOW_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleRunDemo = () => {
    setIsPlaying(true);
    setCurrentStepIndex(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < WORKFLOW_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 1800);
  };

  const currentStep = WORKFLOW_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-4xl max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Interactive Simulator
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Step {currentStepIndex + 1} of 10
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                Contract & Job Management End-to-End Lifecycle
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunDemo}
              disabled={isPlaying}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg ${
                isPlaying
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPlaying ? 'Running Auto Demo...' : 'Run Auto Demo'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10-Step Horizontal Stepper Ribbon */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {WORKFLOW_STEPS.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={s.step}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex-1 min-w-[70px] p-2 rounded-xl text-center cursor-pointer transition border ${
                  isCurrent
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : isCompleted
                    ? 'bg-slate-950/80 border-slate-800 text-emerald-400'
                    : 'bg-slate-950/40 border-slate-850 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono">STEP {s.step}</div>
                <div className="text-[11px] truncate font-medium mt-0.5">{s.title.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>

        {/* Highlighted Step Feature Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <StepIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                  {currentStep.category}
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">{currentStep.title}</h3>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigateToView(currentStep.targetView);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs transition border border-emerald-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Inspect Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{currentStep.desc}</p>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Active Operational Record
              </span>
              <div className="text-xs font-mono text-emerald-300 font-bold mt-0.5">
                {currentStep.sampleData}
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Validated in Studio Preview Engine
            </span>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Step 1</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentStepIndex === 0
                  ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              &larr; Previous Step
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === WORKFLOW_STEPS.length - 1}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentStepIndex === WORKFLOW_STEPS.length - 1
                  ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
