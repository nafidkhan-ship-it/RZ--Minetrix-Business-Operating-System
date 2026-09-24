import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Play,
  Sparkles,
  Mountain,
  Users,
  ShoppingCart,
  MessageSquare,
  CalendarCheck,
  Calculator,
  ChevronRight,
  ShieldCheck,
  Truck,
  Building2,
  Receipt,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { SectionId } from '../../types/architecture';

interface EndToEndFlowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: SectionId) => void;
  initialFlowId?: 'flow-a' | 'flow-b' | 'flow-c' | 'flow-d' | 'flow-e' | 'flow-f';
}

interface FlowStep {
  title: string;
  desc: string;
  actionText: string;
  targetSection: SectionId;
  details: string;
}

interface FlowDef {
  id: string;
  name: string;
  code: string;
  badge: string;
  icon: any;
  color: string;
  description: string;
  steps: FlowStep[];
}

export const EndToEndFlowsModal: React.FC<EndToEndFlowsModalProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
  initialFlowId = 'flow-a'
}) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(initialFlowId);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});

  const flows: FlowDef[] = [
    {
      id: 'flow-a',
      code: 'FLOW A',
      name: 'Quarry Concession to Cash Settlement',
      badge: 'Mining Lifecycle',
      icon: Mountain,
      color: 'amber',
      description: 'Full quarry lifecycle: Quarry Creation -> Land Parcels -> Land Owners -> Mining Agreement -> Working Areas -> Pit Loads -> Vehicle Weighing -> Gate Pass -> Customer Sale -> Settlement.',
      steps: [
        {
          title: '1. Quarry Setup & Profile',
          desc: 'Inspect existing pit concessions or register Kasaragod Pit #01 with reserve capacities.',
          actionText: 'Open Quarry Platform',
          targetSection: 'quarry-management',
          details: 'Quarry profile specifies geo-coordinates, mining lease validity (10 years) and partner investment stakes.'
        },
        {
          title: '2. Land Parcel & Landowner Agreement',
          desc: 'Link Survey No. 142/3A (8.5 Acres) with landowner and select "Per Load (₹4.50/block)" agreement.',
          actionText: 'View Land Agreements',
          targetSection: 'quarry-land-management',
          details: 'Land agreements support 4 models: 1. Land Purchase, 2. Mining & Return, 3. Per Load, 4. Hybrid.'
        },
        {
          title: '3. Pit Working Area & Production Cut',
          desc: 'Assign wire-saw excavator operators to Bench #02 for Laterite Stone Grade-A block cutting.',
          actionText: 'View Production Bench',
          targetSection: 'quarry-management',
          details: 'Cutting yield logged: 1,200 blocks cut per day at ₹18.50 extraction cost.'
        },
        {
          title: '4. Vehicle Assignment & Weighbridge Gate Pass',
          desc: 'Load 10-wheel tipper KL-14-W-4491, measure gross tare at 32,450 KG, generate thermal Gate Pass GP-9921.',
          actionText: 'View Gate Pass & Loads',
          targetSection: 'vehicle-management',
          details: 'Gate pass locks load count, driver batta, destination customer and vehicle owner commission.'
        },
        {
          title: '5. Customer Sale, Payment & Landowner Settlement',
          desc: 'Issue GST Tax Invoice to Malabar Infra, collect ₹50,400 via Pay-In, credit landowner royalty of ₹5,400.',
          actionText: 'Inspect Finance & Ledgers',
          targetSection: 'shared-erp-finance',
          details: 'Ledger reconciles cash collected, vehicle owner share, and landowner payout automatically.'
        }
      ]
    },
    {
      id: 'flow-b',
      code: 'FLOW B',
      name: 'Staff Onboarding, Attendance & Payroll',
      badge: 'HR & Operations',
      icon: Users,
      color: 'blue',
      description: 'End-to-end workforce cycle: Staff Profile -> Role Assignment -> Daily Biometric Attendance -> Salary Calculation -> Trip Batta & Advance Adjustment -> Payslip Generation -> Bank Payment.',
      steps: [
        {
          title: '1. Staff Profile & RBAC Role Assignment',
          desc: 'Review 24 enterprise roles and verify driver Shamsuddeen K. with Tipper permissions.',
          actionText: 'Open Staff & HR Platform',
          targetSection: 'shared-erp-hr',
          details: 'Staff member inherits company workspace subscription seats without personal license fee.'
        },
        {
          title: '2. Daily Attendance & Trip Batta Capture',
          desc: 'Mark biometric check-in at 06:30 AM and record ₹750 outstation trip batta.',
          actionText: 'View Attendance Sheet',
          targetSection: 'shared-erp-hr',
          details: 'Supports 6 Batta types: Trip Batta, Food Allowance, Night Halt, Outstation, Daily, and Other.'
        },
        {
          title: '3. Mid-Month Staff Advance Adjustment',
          desc: 'Deduct ₹3,000 previously disbursed emergency cash advance from monthly gross accrual.',
          actionText: 'Review Staff Advances',
          targetSection: 'shared-erp-hr',
          details: 'Staff advance ledgers track outstanding balance and repayment instalments.'
        },
        {
          title: '4. Net Salary Slip & Bank Pay-Out',
          desc: 'Generate official digital salary slip and execute single-click bank disbursement from Federal Bank account.',
          actionText: 'View Payslip & Bank Ledger',
          targetSection: 'shared-erp-finance',
          details: 'Net salary calculated: Gross ₹28,000 + Batta ₹4,500 - Advance ₹3,000 = Net ₹29,500.'
        }
      ]
    },
    {
      id: 'flow-c',
      code: 'FLOW C',
      name: 'Laterite Stone E-Commerce Order Fulfillment',
      badge: 'Marketplace E-Com',
      icon: ShoppingCart,
      color: 'amber',
      description: 'Customer ordering workflow: ORDER LATERITE STONE -> Dimension Selection -> GPS Site Location -> Supplier Quotation -> Order Confirmation -> Dispatch -> Fleet Delivery -> Digital Gate Receipt.',
      steps: [
        {
          title: '1. ORDER LATERITE STONE (Instant Intake)',
          desc: 'Trigger the prominent laterite order portal and specify 2,500 Grade-A (12x8x6) dressed blocks.',
          actionText: 'Open Materials Commerce',
          targetSection: 'building-materials-ecommerce',
          details: 'Pricing is quotation-based tailored to exact quarry distance and vehicle access road grade.'
        },
        {
          title: '2. Delivery Site & Supplier Quotation Match',
          desc: 'System matches 3 nearby quarries (Kasaragod, Kanhangad, Nileshwar) and generates comparative quotes.',
          actionText: 'View Supplier Quotes',
          targetSection: 'building-materials-ecommerce',
          details: 'Rates quote stone cost + freight surcharge + unloading charges transparently.'
        },
        {
          title: '3. Order Confirmation & 30% Advance Payment',
          desc: 'Customer selects Kasaragod Pit #01 quote (₹42/block delivered) and pays ₹31,500 booking advance.',
          actionText: 'Check Order Status Timeline',
          targetSection: 'building-materials-ecommerce',
          details: 'Order advances through the 18 standardized statuses: Enquiry -> Quote -> Confirmed -> Processing.'
        },
        {
          title: '4. Tipper Dispatch & GPS Real-Time Delivery',
          desc: 'Fleet Tipper V002 dispatched with thermal gate pass; driver uploads site delivery photo upon unloading.',
          actionText: 'View Delivery Fleet',
          targetSection: 'vehicle-management',
          details: 'Final balance ₹73,500 collected on-site via UPI QR code or driver receipt.'
        }
      ]
    },
    {
      id: 'flow-d',
      code: 'FLOW D',
      name: 'RZ® Chat to Actionable OTT Task Pipeline',
      badge: 'Communication',
      icon: MessageSquare,
      color: 'emerald',
      description: 'Communication with operational accountability: Real-time 1-to-1 / Group Chat -> Send Equipment Inspection Photo -> Convert Message into an RZ® OTT Task with Due Date & Assignee.',
      steps: [
        {
          title: '1. RZ® Chat Group Collaboration',
          desc: 'Open "Pit #01 Operational Crew" group chat with supervisor, quarry engineer and dispatcher.',
          actionText: 'Launch RZ® Chat',
          targetSection: 'rz-chating',
          details: 'Modern standalone chat supporting media, voice notes, documents, video calls and RZ Reels.'
        },
        {
          title: '2. Machinery Warning Photo & Discussion',
          desc: 'Operator sends photo of worn hydraulic hose on Hitachi ZX210 Excavator.',
          actionText: 'Inspect Chat Media Feed',
          targetSection: 'rz-chating',
          details: 'End-to-end encrypted messaging with quarry asset tagging.'
        },
        {
          title: '3. "Create OTT Task" from Message',
          desc: 'Click "Create OTT Task" directly on the chat message bubble to assign urgent replacement to Maintenance Head.',
          actionText: 'Open RZ® OTT Platform',
          targetSection: 'rz-ott',
          details: 'Contextual bridge: Task automatically inherits source chat message, media photo, and quarry asset ID.'
        }
      ]
    },
    {
      id: 'flow-e',
      code: 'FLOW E',
      name: 'RZ® OTT — Organise Today & Tomorrow Task Cycle',
      badge: 'Productivity & Execution',
      icon: CalendarCheck,
      color: 'purple',
      description: 'Personal & company task governance: Create Task -> Context Tagging (Mining/Office/Personal) -> Assignee Accept -> In Progress -> Daily My Day Focus -> Mark Complete -> Audit Trail.',
      steps: [
        {
          title: '1. Create Cross-Context Task',
          desc: 'Draft "Renew KSPCB Environmental Clearance for Kasaragod Pit #01" due within 14 days.',
          actionText: 'Open RZ® OTT Dashboard',
          targetSection: 'rz-ott',
          details: 'Context tags available: Office, RZ MINETRIX, Family, Personal, Side Business, Study, Other.'
        },
        {
          title: '2. "My Day" Morning Focus Assembly',
          desc: 'Filter tasks into My Day focus list to prioritize the 4 most critical mining operations today.',
          actionText: 'Inspect My Day Queue',
          targetSection: 'rz-ott',
          details: 'My Day resets daily, preventing backlog fatigue while preserving master project roadmaps.'
        },
        {
          title: '3. Task Lifecycle: Start -> Complete -> Archive',
          desc: 'Assigned compliance officer uploads permit draft, marks task Complete, triggering notification to Director.',
          actionText: 'View Task Audit History',
          targetSection: 'rz-ott',
          details: 'Completed items logged in immutable audit history for ISO & mining safety audits.'
        }
      ]
    },
    {
      id: 'flow-f',
      code: 'FLOW F',
      name: 'RZ® Calculator — Financial & Mining Simulation',
      badge: '100% FREE Suite',
      icon: Calculator,
      color: 'cyan',
      description: 'Zero-friction financial modeling: Standard Keypad -> 18% GST Add/Remove -> Tipper Loan EMI Amortization -> Quarry Pit Extraction Costing -> Print Calculation Sheet.',
      steps: [
        {
          title: '1. Launch RZ® Calculator (Platform #10 - FREE)',
          desc: 'Instant access without login or subscription: multi-industry tabs for Commercial, Tax and Mining.',
          actionText: 'Open RZ® Calculator',
          targetSection: 'rz-calculator',
          details: 'Equipped with IEEE-754 64-bit precision engine and zero-latency local execution.'
        },
        {
          title: '2. GST 5% Laterite Tax Computation',
          desc: 'Input ₹50,000 stone consignment, split 2.5% CGST (₹1,250) + 2.5% SGST (₹1,250) = ₹52,500 total.',
          actionText: 'Switch to GST Engine',
          targetSection: 'rz-calculator',
          details: 'Instant toggle between Exclusive (Add GST) and Inclusive (Extract Base Amount) modes.'
        },
        {
          title: '3. Heavy Tipper Loan EMI & Amortization Schedule',
          desc: 'Simulate ₹25,00,000 tipper vehicle finance at 10.5% for 60 months = Monthly EMI ₹53,732.',
          actionText: 'View EMI Breakdown',
          targetSection: 'rz-calculator',
          details: 'View full 60-month principal vs interest repayment schedule and print formal calculation sheet.'
        }
      ]
    }
  ];

  if (!isOpen) return null;

  const currentFlow = flows.find((f) => f.id === selectedFlowId) || flows[0];
  const activeStep = currentFlow.steps[currentStepIndex] || currentFlow.steps[0];

  const handleNextStep = () => {
    // Mark step completed
    const currentCompleted = completedSteps[currentFlow.id] || [];
    if (!currentCompleted.includes(currentStepIndex)) {
      setCompletedSteps({
        ...completedSteps,
        [currentFlow.id]: [...currentCompleted, currentStepIndex]
      });
    }

    if (currentStepIndex < currentFlow.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleExecuteAction = () => {
    onNavigateSection(activeStep.targetSection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono tracking-wider uppercase">
                Interactive Verification Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                Clickable End-to-End Journeys
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>RZ® MINETRIX End-to-End User Journeys (Flows A–F)</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flow Selector Pills */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {flows.map((flow) => {
            const Icon = flow.icon;
            const active = selectedFlowId === flow.id;
            const isFinished = (completedSteps[flow.id]?.length || 0) === flow.steps.length;
            return (
              <button
                key={flow.id}
                onClick={() => {
                  setSelectedFlowId(flow.id);
                  setCurrentStepIndex(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{flow.code}</span>
                {isFinished && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Flow Overview & Steps Progress */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {currentFlow.code} &bull; {currentFlow.badge}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Step {currentStepIndex + 1} of {currentFlow.steps.length}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">{currentFlow.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{currentFlow.description}</p>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Execution Pipeline
              </div>
              <div className="space-y-1.5">
                {currentFlow.steps.map((st, sIdx) => {
                  const isCompleted = (completedSteps[currentFlow.id] || []).includes(sIdx);
                  const isCurrent = currentStepIndex === sIdx;
                  return (
                    <div
                      key={sIdx}
                      onClick={() => setCurrentStepIndex(sIdx)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500/50 text-white font-bold'
                          : isCompleted
                          ? 'bg-slate-950/80 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : isCurrent
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isCompleted ? '✓' : sIdx + 1}
                        </div>
                        <span>{st.title}</span>
                      </div>
                      {isCurrent && <ChevronRight className="w-4 h-4 text-amber-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Active Step Workspace Card */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-inner">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-amber-400">
                  ACTIVE PHASE: STEP {currentStepIndex + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                  Target: {activeStep.targetSection}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-black text-white">{activeStep.title}</h4>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">{activeStep.desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Technical &amp; Commercial Validation Rule</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {activeStep.details}
                </p>
              </div>
            </div>

            {/* Step Controls */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={handlePrevStep}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  <span>{currentStepIndex === currentFlow.steps.length - 1 ? 'Mark Completed' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleExecuteAction}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>{activeStep.actionText}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
