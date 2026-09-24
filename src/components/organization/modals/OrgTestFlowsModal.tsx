import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  Building2,
  CreditCard,
  Users,
  MapPin,
  Play,
  RotateCcw
} from 'lucide-react';

interface OrgTestFlowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTab?: (tab: string) => void;
}

export const OrgTestFlowsModal: React.FC<OrgTestFlowsModalProps> = ({
  isOpen,
  onClose,
  onJumpToTab
}) => {
  const [activeFlowId, setActiveFlowId] = useState<number>(1);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const FLOWS = [
    {
      id: 1,
      title: 'Flow 1: Organization Creation & Onboarding Flow',
      subtitle: 'Complete lifecycle from customer purchase to staff dashboard access',
      steps: [
        { label: 'Customer Signs Up', desc: 'Enterprise client selects RZ® MINETRIX BOS ecosystem' },
        { label: 'Select Subscription', desc: 'Choose Enterprise BOS Plan with full 10-platform entitlement' },
        { label: 'Tenant Org Created', desc: 'Database tenant isolated under unique corporate CID' },
        { label: 'Company Profile Setup', desc: 'Legal entity name, GSTIN, PAN, and corporate address recorded' },
        { label: 'Owner Account Configured', desc: 'Al-Haj R. Zain assigned as Managing Director (#2 OWNER role)' },
        { label: 'Add Physical Branch', desc: 'Kozhikode Global HQ (BR-01) registered with manager' },
        { label: 'Add Mining Site', desc: 'Palazhi Laterite Stone Pit #1 linked to Platform 1' },
        { label: 'Invite Personnel', desc: 'Staff invitation link dispatched for Accounts and Pit Supervisor' },
        { label: 'Seat & Role Selection', desc: 'Assign Staff Seat & Role #7 (ACCOUNTANT)' },
        { label: 'Module Access Assigned', desc: 'Enable Finance & Ledgers, Commercial Invoicing' },
        { label: 'Permissions Authorized', desc: 'Grant View, Create, Edit, Approve, Export, Print' },
        { label: 'Staff Accepts Invite', desc: 'Secure token verified, biometric profile activated' },
        { label: 'Staff Dashboard Live', desc: 'Custom role dashboard rendered with authorized widgets' }
      ]
    },
    {
      id: 2,
      title: 'Flow 2: RBAC & Permission Enforcement Flow',
      subtitle: 'Validating the pipeline: Staff -> Role -> Module Access -> Permission -> Dashboard -> Action',
      steps: [
        { label: 'Staff Login Identified', desc: 'User Anjali Menon authenticated under Employee ID EMP-003' },
        { label: 'Role Resolved', desc: 'System maps membership to Role #7 (ACCOUNTANT)' },
        { label: 'Module Access Evaluated', desc: 'Finance & Ledgers, Commercial Invoicing granted; Pit Blasting denied' },
        { label: 'Permission Verbs Filtered', desc: 'Authorized: View, Create, Edit, Approve, Export, Print, Calculate' },
        { label: 'Custom Dashboard Rendered', desc: 'Displays Debtor Aging, Daybook, GST Ledger, and Unpaid Bills' },
        { label: 'Action Executed', desc: 'Successfully approves and prints GST Tax Invoice RZ-INV-2026-9921' }
      ]
    },
    {
      id: 3,
      title: 'Flow 3: Subscription & Quota Limit Flow',
      subtitle: 'Monitoring usage against caps, evaluating upgrade wizard, and scaling seats',
      steps: [
        { label: 'Inspect Current Plan', desc: 'Enterprise BOS plan active with 10 staff seats' },
        { label: 'Monitor Quota Usage', desc: 'Staff seat capacity reaches 70% threshold (7 of 10 used)' },
        { label: 'Limit Alert Triggered', desc: 'System daemon raises capacity alert for HR & Admin' },
        { label: 'Compare Plan Tiers', desc: 'Examine Starter vs Business vs Professional vs Enterprise' },
        { label: 'Preview Plan Transition', desc: 'Calculate additional capacity requirements (e.g. +15 seats)' },
        { label: 'Review Feature Entitlement', desc: 'Verify all 10 Platforms remain Included with high storage' },
        { label: 'Simulate Confirmation', desc: 'Immediate quota provisioning updated in Studio Preview' }
      ]
    },
    {
      id: 4,
      title: 'Flow 4: Multi-Branch & Site Jurisdiction Flow',
      subtitle: 'Navigating multi-branch hierarchy without duplicated applications',
      steps: [
        { label: 'Organization Root', desc: 'RZ® MINETRIX Global HQ (Kozhikode)' },
        { label: 'Select Branch Context', desc: 'Switch operating scope to Wayanad High-Range Quarrying Zone' },
        { label: 'Select Operating Site', desc: 'Zoom into Wayanad VSI Sand Crushing Complex (SITE-02)' },
        { label: 'Filter Staff Personnel', desc: 'Display only staff stationed at Wayanad plant' },
        { label: 'Evaluate Role Authority', desc: 'Mustafa K. resolved as Operator (#10 OPERATOR)' },
        { label: 'Launch Connected Platform', desc: 'Seamlessly jumps into Platform 2 — Crusher Management' }
      ]
    }
  ];

  const activeFlow = FLOWS.find(f => f.id === activeFlowId) || FLOWS[0];

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const handleNextStep = () => {
    if (currentStepIdx < activeFlow.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                END-TO-END INTERACTIVE TEST SUITE
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                Sections 40-44
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">Clickable Architecture Verification Flows</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Flow Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FLOWS.map(f => (
            <button
              key={f.id}
              onClick={() => {
                setActiveFlowId(f.id);
                setCurrentStepIdx(0);
              }}
              className={`p-2.5 rounded-2xl border text-left transition cursor-pointer text-xs space-y-0.5 ${
                activeFlowId === f.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-mono text-[10px] uppercase font-bold">Flow #{f.id}</div>
              <div className="truncate font-sans font-bold">{f.title.split(':')[1]}</div>
            </button>
          ))}
        </div>

        {/* Active Flow Steps Walkthrough */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 overflow-y-auto max-h-[50vh] pr-2">
          <div>
            <h4 className="font-bold text-white text-sm">{activeFlow.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{activeFlow.subtitle}</p>
          </div>

          <div className="space-y-2">
            {activeFlow.steps.map((st, idx) => {
              const stepKey = `${activeFlow.id}-${idx}`;
              const isCurrent = idx === currentStepIdx;
              const isDone = completedSteps[stepKey] || idx < currentStepIdx;

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 text-xs ${
                    isCurrent
                      ? 'bg-purple-950/40 border-purple-500 shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(stepKey);
                      }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950 text-slate-500 border-slate-700'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </button>

                    <div>
                      <div className={`font-bold ${isCurrent ? 'text-amber-400' : 'text-white'}`}>
                        {idx + 1}. {st.label}
                      </div>
                      <div className="text-[11px] text-slate-400">{st.desc}</div>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold shrink-0">
                      ACTIVE STEP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompletedSteps({})}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Flow</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentStepIdx === 0}
              onClick={handlePrevStep}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer ${
                currentStepIdx === 0
                  ? 'bg-slate-850 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentStepIdx < activeFlow.steps.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1 cursor-pointer shadow-md"
              >
                <span>Proceed to Step {currentStepIdx + 2}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Test Flow Completed</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
