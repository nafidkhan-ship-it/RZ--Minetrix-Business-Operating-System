import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Users,
  Truck,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface ErpInteractiveFlowsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ErpInteractiveFlowsModal: React.FC<ErpInteractiveFlowsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeFlowIndex, setActiveFlowIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!isOpen) return null;

  const FLOWS = [
    {
      id: 'sales',
      title: '1. Commercial Sales Flow',
      icon: TrendingUp,
      color: 'text-amber-400',
      description: 'End-to-end sales cycle with dynamic price resolution and debtor balance update',
      steps: [
        { label: 'Customer Selected', detail: 'Thomas Mathew (Sobha Developers Ltd) chosen from Master Person Directory.' },
        { label: 'Quotation Generated', detail: 'Quotation #QT-901 generated for 2,500 pcs Dressed Laterite Stone.' },
        { label: 'Dynamic Rate Applied', detail: 'Rate Engine selects Enterprise Rate: ₹42 / pc (saving ₹4/pc vs default catalog rate).' },
        { label: 'Sales Order Confirmed', detail: 'Order #ORD-2026-0901 created for ₹1,10,250 (including 5% GST).' },
        { label: 'Weighbridge Pass & Dispatch', detail: 'Gate pass GP-OUT-1092 issued to Tipper KL-11-BH-9921 driven by Arun Varma.' },
        { label: 'Tax Invoice & Debtor Ledger', detail: 'Invoice INV-2026-081 created; Sobha Debtor ledger debited ₹1,10,250.' },
        { label: 'Payment Recorded & Settled', detail: 'Received RTGS payment of ₹50,000; customer outstanding updated to ₹60,250.' }
      ]
    },
    {
      id: 'purchase',
      title: '2. Procurement & Vendor Flow',
      icon: ShoppingBag,
      color: 'text-emerald-400',
      description: 'Requisition to payment lifecycle with GRN physical check and creditor ledger update',
      steps: [
        { label: 'Purchase Requisition', detail: 'Quarry supervisor submits indent for 12,000 Litres Bulk High-Speed Diesel.' },
        { label: 'PO to Supplier', detail: 'PO-2026-9042 dispatched to Bharat Petroleum Depot at ₹86.4 / Litre.' },
        { label: 'Material Received (GRN)', detail: 'Diesel bowser arrives; density & dip-stick checked. GRN-2026-8801 verified.' },
        { label: 'Purchase Bill & Tax', detail: 'Bill #BILL-BP-9921 entered for ₹12,23,424 (including 18% GST).' },
        { label: 'Supplier Payment Execution', detail: 'Treasury disburses ₹7,73,424 via HDFC Corporate bank; balance payable: ₹4,50,000.' }
      ]
    },
    {
      id: 'staff',
      title: '3. Workforce Payroll & Advance Flow',
      icon: Users,
      color: 'text-purple-400',
      description: 'Biometric punch to net salary disbursement with automated advance deduction',
      steps: [
        { label: 'Staff Roster & Rate', detail: 'Arun Varma (Tipper Driver) loaded with ₹22,000 monthly base rate.' },
        { label: 'Biometric Attendance', detail: 'Recorded 26 present days + 2 overtime shifts (Total OT: ₹1,800).' },
        { label: 'Allowances & Batta', detail: 'Driver trip batta of ₹600 + food allowance ₹150 merged into payroll.' },
        { label: 'Advance Recovery Deduction', detail: 'Auto-deducted monthly installment of ₹2,500 from active ₹10,000 medical advance.' },
        { label: 'Net Salary Slip & Bank Pay', detail: 'Net ₹21,900 generated; official printable salary slip issued and credited to KGB bank account.' }
      ]
    },
    {
      id: 'vehicle',
      title: '4. Vehicle & Trip Profitability Flow',
      icon: Truck,
      color: 'text-cyan-400',
      description: 'Trip income minus operational burn down to net vehicle owner settlement',
      steps: [
        { label: 'Trip Logging', detail: 'Tipper KL-11-BH-9921 dispatched with 18.5 MT laterite stone from Quarry #1 to Calicut NH Bypass.' },
        { label: 'Freight Revenue Inflow', detail: 'Collected freight rate of ₹450 / MT = ₹8,325 trip revenue.' },
        { label: 'Operating Expenses Deduction', detail: 'Deducted Diesel (₹2,400) + Toll (₹180) + Driver Batta (₹750) + Loading (₹600) + Maintenance (₹400).' },
        { label: 'Net Trip Profit Pool', detail: 'Calculated Net Profit = ₹3,995.' },
        { label: 'Owner Equity Distribution', detail: 'Vehicle owner M. K. Balaraman (60% share) credited ₹2,397 into owner settlement account.' }
      ]
    },
    {
      id: 'land',
      title: '5. Land Owner Concession Royalty Flow',
      icon: Layers,
      color: 'text-rose-400',
      description: 'Pit quarrying volume calculation into per-load leaseholder royalty',
      steps: [
        { label: 'Lessor Concession Agreement', detail: 'K. P. Moideenkutty agreement loaded for Wayanad Laterite Block A & B.' },
        { label: 'Extraction Metric', detail: 'Per-load royalty rate loaded: ₹250 / load extracted.' },
        { label: 'Monthly Extraction Volume', detail: 'Weighbridge pass log totals 180 commercial loads dispatched in January.' },
        { label: 'Gross Royalty Assessment', detail: '180 loads × ₹250 = ₹45,000 gross royalty payable.' },
        { label: 'Settlement Voucher Approved', detail: 'Settlement SET-2026-041 approved; NEFT voucher executed to SBI Kalpetta branch.' }
      ]
    }
  ];

  const currentFlow = FLOWS[activeFlowIndex];

  const handleNextStep = () => {
    if (currentStepIndex < currentFlow.steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
  };

  const handleResetFlow = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">STUDIO PREVIEW TEST SUITE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Interactive End-to-End Simulation
                </span>
              </div>
              <h3 className="text-base font-bold text-white">5 Core Enterprise Business Process Chains</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flow Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {FLOWS.map((f, idx) => {
            const Icon = f.icon;
            const isSelected = activeFlowIndex === idx;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFlowIndex(idx);
                  setCurrentStepIndex(0);
                  setCompletedSteps([]);
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 mb-2 ${f.color}`} />
                <span className="text-[11px] line-clamp-1">{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Flow Box */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-sm">{currentFlow.title}</h4>
              <p className="text-xs text-slate-400">{currentFlow.description}</p>
            </div>
            <button
              onClick={handleResetFlow}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-mono cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Flow</span>
            </button>
          </div>

          {/* Stepper Display */}
          <div className="space-y-3 pt-2">
            {currentFlow.steps.map((st, sIdx) => {
              const isDone = completedSteps.includes(sIdx);
              const isCurrent = currentStepIndex === sIdx;
              return (
                <div
                  key={sIdx}
                  className={`p-3.5 rounded-2xl border transition text-xs font-mono ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/80 shadow-md'
                      : isDone
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                      : 'bg-slate-900/40 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isDone ? '✓' : sIdx + 1}
                      </span>
                      <span className={`font-bold font-sans ${isCurrent ? 'text-white' : isDone ? 'text-emerald-300' : 'text-slate-500'}`}>
                        {st.label}
                      </span>
                    </div>

                    {isDone && <span className="text-[10px] text-emerald-400 font-bold">COMPLETED</span>}
                    {isCurrent && <span className="text-[10px] text-amber-400 font-bold">CURRENT EXECUTION STEP</span>}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 pl-8 font-sans leading-relaxed">
                    {st.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">
            Step {currentStepIndex + 1} of {currentFlow.steps.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Close
            </button>
            <button
              onClick={handleNextStep}
              disabled={completedSteps.includes(currentFlow.steps.length - 1)}
              className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                completedSteps.includes(currentFlow.steps.length - 1)
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <span>{completedSteps.includes(currentFlow.steps.length - 1) ? 'Flow Finished' : 'Trigger Next Event Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
