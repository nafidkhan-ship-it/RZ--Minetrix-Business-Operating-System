import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Shield,
  CreditCard,
  Check
} from 'lucide-react';
import { DEMO_SUBSCRIPTION_PLANS } from '../data/orgDemoData';
import { SubscriptionPlan } from '../types';

interface UpgradeDowngradeModalProps {
  isOpen: boolean;
  mode: 'upgrade' | 'downgrade';
  onClose: () => void;
  onSuccess: (planName: string) => void;
}

export const UpgradeDowngradeModal: React.FC<UpgradeDowngradeModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    mode === 'upgrade' ? 'enterprise' : 'business'
  );

  if (!isOpen) return null;

  const currentPlan = DEMO_SUBSCRIPTION_PLANS.find(p => p.id === 'enterprise') || DEMO_SUBSCRIPTION_PLANS[3];
  const targetPlan = DEMO_SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || DEMO_SUBSCRIPTION_PLANS[1];

  const handleConfirm = () => {
    onSuccess(targetPlan.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                {mode === 'upgrade' ? 'Plan Upgrade Wizard' : 'Plan Downgrade Warning Wizard'}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                Studio Preview
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {mode === 'upgrade' ? 'Scale Organization Capacity' : 'Reduce Subscription Tier'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SELECT PLAN */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Current Plan</span>
                <div className="font-bold text-white">{currentPlan.name} ({currentPlan.priceDisplay})</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                Active
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-slate-400 block font-bold">Select Target Tier</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_SUBSCRIPTION_PLANS.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1 ${
                      selectedPlanId === plan.id
                        ? 'bg-amber-500/10 border-amber-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{plan.name}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">{plan.priceDisplay}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-snug">{plan.tagline}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Downgrade feature loss warning */}
            {mode === 'downgrade' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-xs">Features Affected by Downgrade:</div>
                  <div className="text-[11px] text-slate-300">
                    Downgrading to {targetPlan.name} reduces staff seat capacity to {targetPlan.limits.staffSeats} and operating branch quota to {targetPlan.limits.branches}.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: REVIEW & CONFIRM */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">Plan Transition Summary</div>
              <div className="flex items-center justify-between text-sm font-bold text-white border-b border-slate-800 pb-2">
                <span>{currentPlan.name}</span>
                <span className="text-slate-500">&rarr;</span>
                <span className="text-amber-400">{targetPlan.name}</span>
              </div>

              <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Staff Seat Limit:</span>
                  <strong>{currentPlan.limits.staffSeats} &rarr; {targetPlan.limits.staffSeats}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Driver Seat Limit:</span>
                  <strong>{currentPlan.limits.driverSeats} &rarr; {targetPlan.limits.driverSeats}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Operating Branches:</span>
                  <strong>{currentPlan.limits.branches} &rarr; {targetPlan.limits.branches}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Cloud Storage:</span>
                  <strong>{currentPlan.limits.storageGb} GB &rarr; {targetPlan.limits.storageGb} GB</strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>
                Studio Preview: Changes will simulate immediate quota provisioning without processing payment charges.
              </span>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md"
            >
              <span>Review Transition</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm &amp; Apply Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
