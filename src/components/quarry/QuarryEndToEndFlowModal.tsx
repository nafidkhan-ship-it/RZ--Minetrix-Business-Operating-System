import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  MapPin,
  Users,
  FileText,
  Pickaxe,
  Truck,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface QuarryEndToEndFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPage: (page: string) => void;
}

interface StepItem {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  icon: any;
  targetPage: string;
  summary: string;
  sampleEntity: string;
  connection: string;
}

const FLOW_STEPS: StepItem[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Quarry Concession Registration',
    category: 'QUARRY FOUNDATION',
    icon: Pickaxe,
    targetPage: 'quarries',
    summary: 'Establish a new quarry concession with DMG permits, location survey, and operating partners.',
    sampleEntity: 'Q-01: Kasaragod North Laterite Pit #01 (14.2 Acres)',
    connection: 'Defines the legal lease boundaries and multi-partner investment terms.'
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Land Parcel Demarcation',
    category: 'LAND & SURVEY',
    icon: MapPin,
    targetPage: 'parcels',
    summary: 'Register survey numbers, boundaries, sub-divisions, and acreage under this quarry.',
    sampleEntity: 'LP-101: Survey 412/1A (3.8 Acres) + LP-102: Survey 412/2B',
    connection: 'Multiple adjacent parcels can be mapped to one or multiple land owners.'
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Land Owner Profile Linking',
    category: 'PEOPLE & ENTITIES',
    icon: Users,
    targetPage: 'owners',
    summary: 'Associate real land owners. Note: Land Owner ≠ Quarry Partner, though a person can be both.',
    sampleEntity: 'Shri V. Prabhakar Pai (LO-01) — owns 3 parcels, also a 25% Partner',
    connection: 'Creates a single consolidated dossier for all parcels owned by the person.'
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Lease & Royalty Agreement',
    category: 'LEGAL & ROYALTIES',
    icon: FileText,
    targetPage: 'agreements',
    summary: 'Execute agreement: Land Purchase, Mining & Return, Per Load Royalty, or Hybrid.',
    sampleEntity: 'RZ-AGR-KSD-001 (Per Load @ ₹600/Load, ₹5,00,000 Advance)',
    connection: 'Determines the financial rate calculated automatically on every extracted load.'
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Working Area Bench Setup',
    category: 'MINING OPERATIONS',
    icon: Layers,
    targetPage: 'working-areas',
    summary: 'Group adjacent parcels and owners into an active mining bench face.',
    sampleEntity: 'Bench A — North Laterite Face (Connects Parcels 412/1A & 412/2B)',
    connection: 'Connects Quarry -> Land Parcels -> Land Owners -> Agreement -> Production.'
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'Pit Production Extraction',
    category: 'MINING OPERATIONS',
    icon: Pickaxe,
    targetPage: 'production',
    summary: 'Log daily extraction shifts: cut stones, wire-saw extraction, or boulder blasting.',
    sampleEntity: '1,600 Stones cut today on Bench A by Raju Cutting Gang',
    connection: 'Increases pit stock available for immediate load dispatch.'
  },
  {
    id: 'step-7',
    stepNumber: 7,
    title: 'Load Assignment & Weighment',
    category: 'LOGISTICS & DISPATCH',
    icon: Truck,
    targetPage: 'loads',
    summary: 'Create load tied to working area, parcel, land owner royalty rate, vehicle, and driver.',
    sampleEntity: 'LOAD-2026-09-001: 120 Stones on KL-14-AC-8912 for Sobha Builders',
    connection: 'Traces directly back to Shri V. Prabhakar Pai for automated royalty credit.'
  },
  {
    id: 'step-8',
    stepNumber: 8,
    title: 'Secure Gate Pass Generation',
    category: 'SECURITY & WEIGHBRIDGE',
    icon: ShieldCheck,
    targetPage: 'gate-pass',
    summary: 'Authorize departure with tamper-proof Gate Pass, QR code, and driver sign-off.',
    sampleEntity: 'GP-KSD-8812 (Dispatched 09:10 AM by Weighbridge Officer)',
    connection: 'Enforces exit security and legal transit compliance.'
  },
  {
    id: 'step-9',
    stepNumber: 9,
    title: 'Commercial Sale & Invoice',
    category: 'COMMERCE & BILLING',
    icon: TrendingUp,
    targetPage: 'sales',
    summary: 'Convert dispatched load into commercial tax invoice with customer credit terms.',
    sampleEntity: 'INV-2026-4401: ₹6,480 billed to Sobha Builders Kasaragod',
    connection: 'Tracks receivables, cashflow, and customer outstanding balance.'
  },
  {
    id: 'step-10',
    stepNumber: 10,
    title: 'Operational Expenses Ledger',
    category: 'FINANCE & COSTING',
    icon: DollarSign,
    targetPage: 'expenses',
    summary: 'Record fuel, diesel, cutter labour, wire-saw maintenance, and permit costs.',
    sampleEntity: 'VOUCH-2026-09-102: ₹24,200 BPCL Diesel for CAT 320D Excavator',
    connection: 'Aggregates pit operating expenditure for net profitability.'
  },
  {
    id: 'step-11',
    stepNumber: 11,
    title: 'Land Owner Royalty Accounting',
    category: 'FINANCE & AUDIT',
    icon: Users,
    targetPage: 'owners',
    summary: 'Review total loads extracted, gross royalties accrued, advance offset, and balance payable.',
    sampleEntity: 'Shri V. Prabhakar Pai: 142 Loads, Gross: ₹16.6L, Paid: ₹14.2L, Due: ₹2.4L',
    connection: 'Maintains transparent audit trail per land owner without duplicate profiles.'
  },
  {
    id: 'step-12',
    stepNumber: 12,
    title: 'Settlement & Partner Disbursement',
    category: 'DISBURSEMENT',
    icon: DollarSign,
    targetPage: 'settlements',
    summary: 'Disburse owner royalties via RTGS and distribute monthly profit shares to quarry partners.',
    sampleEntity: 'SET-LO-2026-09: ₹50,000 paid to Shri V. Prabhakar Pai (Canara Bank)',
    connection: 'Reconciles bank balances and closes open payment obligations.'
  },
  {
    id: 'step-13',
    stepNumber: 13,
    title: 'Management Reports & Audits',
    category: 'INTELLIGENCE & REPORTS',
    icon: BarChart3,
    targetPage: 'reports',
    summary: '13 specialized reports: Production, Sales, Expenses, Owner Statements, and Profit/Loss.',
    sampleEntity: 'Comprehensive Month-to-Date Concession Report exported to PDF/Excel',
    connection: 'Provides multi-dimensional visibility for directors and investors.'
  }
];

export const QuarryEndToEndFlowModal: React.FC<QuarryEndToEndFlowModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPage
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = FLOW_STEPS[activeStepIndex];

  const handleGoToModule = () => {
    onNavigateToPage(currentStep.targetPage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                STUDIO INTERACTIVE ARCHITECTURE &bull; 13 OPERATIONAL STAGES
              </span>
              <h2 className="text-lg font-black text-white">Quarry Management End-to-End Workflow</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Timeline Navigation */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-[760px]">
            {FLOW_STEPS.map((step, idx) => {
              const isCurrent = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : isPast
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono bg-black/20">
                    {step.stepNumber}
                  </span>
                  <span>{step.title.split(' ')[0]}</span>
                  {idx < FLOW_STEPS.length - 1 && <ChevronRight className="w-3 h-3 opacity-40" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Details Body */}
        <div className="p-6 space-y-6">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                STAGE {currentStep.stepNumber} OF {FLOW_STEPS.length} &bull; {currentStep.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">Module: {currentStep.targetPage}</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <currentStep.icon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">{currentStep.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{currentStep.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                  Sample In-App Entity
                </span>
                <p className="text-xs font-bold text-amber-300 font-mono">{currentStep.sampleEntity}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                  Relational Connection
                </span>
                <p className="text-xs text-slate-300">{currentStep.connection}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold disabled:opacity-30 hover:bg-slate-700"
              >
                &larr; Previous Stage
              </button>
              <button
                disabled={activeStepIndex === FLOW_STEPS.length - 1}
                onClick={() => setActiveStepIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold disabled:opacity-30 hover:bg-slate-700"
              >
                Next Stage &rarr;
              </button>
            </div>

            <button
              onClick={handleGoToModule}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Jump to {currentStep.title} Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
