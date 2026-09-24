import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Lock,
  Download,
  Check,
  X,
  RefreshCw,
  HardDrive,
  Users,
  Truck,
  Building2,
  Calendar
} from 'lucide-react';
import { DEMO_SUBSCRIPTION_PLANS } from '../data/orgDemoData';
import { SubscriptionPlan } from '../types';

interface SubscriptionPlansViewProps {
  onOpenUpgradeModal: () => void;
  onOpenDowngradeModal: () => void;
}

export const SubscriptionPlansView: React.FC<SubscriptionPlansViewProps> = ({
  onOpenUpgradeModal,
  onOpenDowngradeModal
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('enterprise');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentPlan = DEMO_SUBSCRIPTION_PLANS.find(p => p.id === 'enterprise') || DEMO_SUBSCRIPTION_PLANS[3];

  const PLATFORM_MATRIX_ROWS = [
    { name: 'Quarry Management (Platform 1)', starter: 'Configurable', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'Crusher Management (Platform 2)', starter: 'Configurable', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'Vehicle Fleet Logistics (Platform 3)', starter: 'Configurable', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'Contract & Job Management (Platform 4)', starter: 'Configurable', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'Building Materials E-Commerce (Platform 5)', starter: 'Configurable', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'Used Machinery Marketplace (Platform 6)', starter: 'Configurable', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'Quarry Land Management (Platform 7)', starter: 'Configurable', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'RZ® Chat (Platform 8)', starter: 'Included', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'RZ® OTT Tasks & Alerts (Platform 9)', starter: 'Included', business: 'Included', professional: 'Included', enterprise: 'Included' },
    { name: 'RZ® Calculator (Platform 10)', starter: 'FREE', business: 'FREE', professional: 'FREE', enterprise: 'FREE' },
    { name: 'Shared ERP Core Backbone', starter: 'Basic', business: 'Standard', professional: 'Advanced', enterprise: 'Full 10 Ledgers' },
    { name: 'Multi-Branch & Site Jurisdiction', starter: 'Single Hub', business: '2 Branches', professional: '5 Branches', enterprise: 'Unlimited (15+)' }
  ];

  const USAGE_METERS = [
    { label: 'Staff Accounts', used: 7, limit: 10, unit: 'Seats', pct: 70, color: 'bg-amber-400' },
    { label: 'Driver Accounts', used: 12, limit: 20, unit: 'Seats', pct: 60, color: 'bg-cyan-400' },
    { label: 'Owner & Admin Seats', used: 2, limit: 2, unit: 'Seats', pct: 100, color: 'bg-purple-400' },
    { label: 'Active Heavy Vehicles', used: 10, limit: 15, unit: 'Trucks', pct: 67, color: 'bg-emerald-400' },
    { label: 'Registered Quarry Sites', used: 3, limit: 5, unit: 'Pits', pct: 60, color: 'bg-yellow-400' },
    { label: 'Crusher Plants Active', used: 1, limit: 2, unit: 'Plants', pct: 50, color: 'bg-blue-400' },
    { label: 'Cloud Storage Vault', used: 14.2, limit: 50, unit: 'GB', pct: 28, color: 'bg-rose-400' },
    { label: 'Monthly Automation Events', used: 184, limit: 1000, unit: 'k Events', pct: 18, color: 'bg-emerald-400' }
  ];

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              SUBSCRIPTION GOVERNANCE &bull; QUOTA CONTROLS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            <span>Subscription Center &amp; Capacity Plans</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            <strong>Architecture Principle:</strong> Subscription determines what the organization can use. RBAC determines what each person can access and do.
          </p>
        </div>

        {/* Upgrade / Downgrade Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDowngradeModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
          >
            Downgrade Wizard
          </button>
          <button
            onClick={onOpenUpgradeModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade / Compare Plans</span>
          </button>
        </div>
      </div>

      {/* Current Active Plan Card + Renewal Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-purple-500/10 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] font-mono uppercase">
                Active Organization Plan
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Auto-Renewal Active</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">{currentPlan.name} ({currentPlan.badge})</h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">{currentPlan.tagline}</p>
          </div>

          <div className="text-left md:text-right font-mono">
            <div className="text-2xl font-black text-amber-400">{currentPlan.priceDisplay}</div>
            <div className="text-[11px] text-slate-400">Renewal Due: <strong>15 Jan 2027</strong> (328 Days Left)</div>
          </div>
        </div>

        {/* Renewal & Billing Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-1">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Billing Cycle</span>
            <strong className="text-white">Annual Enterprise SLA</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Payment Method</span>
            <strong className="text-cyan-400">HDFC Corporate NetBanking</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Invoice Receipt</span>
            <button
              onClick={() => showToast('Exported latest subscription tax invoice')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Download PDF</span>
            </button>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Plan Status</span>
            <span className="text-emerald-400 font-bold">Verified Compliant</span>
          </div>
        </div>
      </div>

      {/* Subscription Principle Architecture Visualizer */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="font-bold text-white text-xs uppercase font-mono tracking-wider text-amber-400">
            Subscription Principle Pipeline
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Organization Level Enforcement</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          {[
            { step: '1. PLAN', desc: 'Enterprise BOS', sub: 'Contracted Tier' },
            { step: '2. MODULE ACCESS', desc: 'All 10 Platforms', sub: '+ Shared ERP' },
            { step: '3. SEAT LIMIT', desc: '100 Staff / 250 Drivers', sub: 'User Slots' },
            { step: '4. USAGE LIMIT', desc: '1M Events / 500GB', sub: 'Capacity Meter' },
            { step: '5. FEATURE ACCESS', desc: 'All 9 Permissions', sub: 'Advanced Workflows' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400">{item.step}</span>
              <div className="font-bold text-white text-xs">{item.desc}</div>
              <div className="text-[9px] text-slate-500 font-mono">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seats & Capacity Usage Progress Meters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Seat Allocation &amp; Operational Capacity Meters</span>
            </h3>
            <p className="text-xs text-slate-400">Tracking utilized quotas against authorized limits</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">All Limits Healthy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USAGE_METERS.map((meter, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{meter.label}</span>
                <span className="font-mono font-bold text-amber-400">{meter.used} / {meter.limit} {meter.unit}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${meter.color} rounded-full`} style={{ width: `${meter.pct}%` }} />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>{meter.pct}% Consumed</span>
                <span className="text-slate-400">{meter.limit - meter.used} {meter.unit} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Comparison Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Plan Comparison (4 Tiers)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Demo Pricing Matrix</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_SUBSCRIPTION_PLANS.map(plan => {
            const isCurrent = plan.id === 'enterprise';
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-5 border flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'bg-gradient-to-b from-amber-500/10 to-slate-900 border-amber-500/60 shadow-xl'
                    : 'bg-slate-900 border-slate-800 shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {plan.badge}
                    </span>
                    {isCurrent && <span className="text-[10px] text-amber-400 font-mono font-bold">CURRENT</span>}
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-base">{plan.name}</h4>
                    <div className="text-lg font-black font-mono text-amber-400 mt-1">{plan.priceDisplay}</div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.tagline}</p>
                  </div>

                  {/* Core Capacity Bulletins */}
                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-2 font-mono text-[11px]">
                    <div>&bull; Staff Seats: <strong>{plan.limits.staffSeats}</strong></div>
                    <div>&bull; Driver Seats: <strong>{plan.limits.driverSeats}</strong></div>
                    <div>&bull; Fleet Vehicles: <strong>{plan.limits.vehicles}</strong></div>
                    <div>&bull; Operating Branches: <strong>{plan.limits.branches}</strong></div>
                    <div>&bull; Cloud Storage: <strong>{plan.limits.storageGb} GB</strong></div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-1 pt-2 border-t border-slate-800 text-xs">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  {isCurrent ? (
                    <div className="w-full py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs text-center">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={onOpenUpgradeModal}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Select Tier Preview</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan Feature Matrix (Section 11) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Platform &amp; Feature Availability Matrix</h3>
          <span className="text-xs font-mono text-amber-400 font-bold">10 Primary Platforms + Shared ERP</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Feature / Platform</th>
                <th className="py-3 px-4">Starter</th>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Professional</th>
                <th className="py-3 px-4">Enterprise BOS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {PLATFORM_MATRIX_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white">{row.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{row.starter}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{row.business}</td>
                  <td className="py-3 px-4 font-mono text-blue-400">{row.professional}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
