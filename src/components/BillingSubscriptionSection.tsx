import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Shield,
  Sparkles,
  Building2,
  Truck,
  Pickaxe,
  TrendingUp,
  Clock,
  ArrowRight,
  Download,
  AlertCircle,
  BarChart3,
  Users
} from 'lucide-react';
import { authService } from '../services/authService';

interface PlanTier {
  id: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  name: string;
  tagline: string;
  monthlyPriceRs: number;
  annualDiscountPercent: number;
  highlight?: boolean;
  features: string[];
  limits: {
    concessions: string;
    fleetVehicles: string;
    weighbridgeTickets: string;
    ottUsers: string;
    storage: string;
  };
}

const TIERS: PlanTier[] = [
  {
    id: 'FREE',
    name: 'Free Community',
    tagline: 'Permanent free access to marketplace, public jobs & basic tools.',
    monthlyPriceRs: 0,
    annualDiscountPercent: 0,
    features: [
      '100% Free Building Materials E-Commerce catalog browsing & order placement',
      'Free Used Machinery & Heavy Vehicle marketplace listings & inquiries',
      'Free Quarry Land discovery & buyer/tenant lead submission',
      'Free Job Seeker profile & unlimited candidate job applications',
      'RZ® Chat: 1-on-1 team messaging & customer inquiries',
      'RZ® OTT: Personal daily task planner & reminders',
      'Standard SSL encryption & mobile web app'
    ],
    limits: {
      concessions: 'Public Directory',
      fleetVehicles: 'Not included',
      weighbridgeTickets: 'Manual View Only',
      ottUsers: '1 User',
      storage: '500 MB'
    }
  },
  {
    id: 'PRO',
    name: 'Operator Pro',
    tagline: 'Ideal for independent quarry owners, single crusher plant or transporter.',
    monthlyPriceRs: 3999,
    annualDiscountPercent: 15,
    features: [
      'Single Quarry or Crusher concession master management',
      'Daily Production logs & stock level indicators (M-Sand, 20mm, 12mm)',
      'Digital Weighbridge gross/tare/net pass generation (500 tickets/mo)',
      'Fleet & Tipper tracking (up to 5 vehicles with trip diesel logs)',
      'Contract & Job billing ledger for small subcontractor works',
      'Automated WhatsApp notification alerts (200 dispatches/mo)',
      'Team RZ® OTT collaborative task boards (up to 5 staff)',
      'Email & priority chat support'
    ],
    limits: {
      concessions: '1 Quarry or Plant',
      fleetVehicles: '5 Tippers / Machinery',
      weighbridgeTickets: '500 / Month',
      ottUsers: '5 Team Members',
      storage: '10 GB'
    }
  },
  {
    id: 'BUSINESS',
    name: 'Commercial Business',
    tagline: 'Full BOS suite for multi-site mining, crusher clusters & transport fleets.',
    monthlyPriceRs: 11999,
    annualDiscountPercent: 20,
    highlight: true,
    features: [
      'Up to 5 Quarry Concessions + 3 High-Tech Crusher Plants',
      'Unlimited digital weighbridge passes with instant GST tax calculation',
      'Fleet GPS telematics integration & trip profitability (up to 25 tippers)',
      'Contract & Job Management: Work orders, machine rentals & subcontractor settlements',
      'Quarry Land lease management & statutory royalty automated accounting',
      'Multi-level workflow approvals & immutable audit trail',
      'Centralized Automation Engine (all 22 BOS event triggers enabled)',
      'Dedicated WhatsApp & SMS gateway quota (2,000 alerts/mo)',
      'Role-based Access Control (Super Admin, Manager, Accountant, Operator, Driver)'
    ],
    limits: {
      concessions: 'Up to 5 Concessions',
      fleetVehicles: '25 Heavy Tippers',
      weighbridgeTickets: 'Unlimited',
      ottUsers: '25 Team Members',
      storage: '100 GB'
    }
  },
  {
    id: 'ENTERPRISE',
    name: 'Industrial Enterprise',
    tagline: 'Bespoke infrastructure for conglomerates, state infrastructure & multi-region mining.',
    monthlyPriceRs: 29999,
    annualDiscountPercent: 25,
    features: [
      'Unlimited Quarries, Crusher Plants, Land Leases & Transport Fleet',
      'Dedicated PostgreSQL / Cloud SQL database instance with tenant isolation & RLS',
      'Custom ERP API bridges (SAP S/4HANA, Tally Prime, Oracle, Webhooks)',
      'Automated drone survey & volumetric stockpile measurement data import',
      'White-labeled web portals & custom subdomain mapping',
      'Multi-entity cross-company consolidated balance sheets & GST returns',
      'Dedicated 24/7 Enterprise Account Manager & 99.95% uptime SLA',
      'On-site operator training & customized weighbridge hardware telemetry integration'
    ],
    limits: {
      concessions: 'Unlimited',
      fleetVehicles: 'Unlimited',
      weighbridgeTickets: 'Unlimited',
      ottUsers: 'Unlimited Users',
      storage: '1 TB Dedicated'
    }
  }
];

export const BillingSubscriptionSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [activeTab, setActiveTab] = useState<'plans' | 'usage'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'>('BUSINESS');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                  SHARED BACKBONE &bull; SUBSCRIPTION & LICENSING
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  FREE PUBLIC ACCESS INCLUDED
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-0.5">
                Billing, Plans & Usage Engine
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Transparent multi-tier pricing. Public marketplace buyers, transporters and job candidates enjoy 100% free access, while commercial concessions can scale across Pro, Business, and Enterprise tiers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'plans' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Subscription Tiers
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'usage' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Usage & Quota
              </button>
            </div>
          </div>
        </div>

        {/* Billing Period Selector */}
        {activeTab === 'plans' && (
          <div className="flex items-center justify-center gap-3 mt-6 pt-5 border-t border-slate-800/80">
            <span className={`text-xs font-semibold ${billingCycle === 'MONTHLY' ? 'text-white' : 'text-slate-400'}`}>
              Billed Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 transition relative cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded-full bg-amber-400 transition-transform ${
                  billingCycle === 'ANNUAL' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'ANNUAL' ? 'text-amber-400' : 'text-slate-400'}`}>
              <span>Billed Annually</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Save Up To 25%
              </span>
            </span>
          </div>
        )}
      </div>

      {/* 1. PLANS TAB */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {TIERS.map((tier) => {
            const price =
              billingCycle === 'ANNUAL'
                ? Math.round(tier.monthlyPriceRs * (1 - tier.annualDiscountPercent / 100))
                : tier.monthlyPriceRs;
            const isSelected = selectedPlan === tier.id;

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-5 border flex flex-col justify-between transition relative ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/50 shadow-2xl shadow-amber-500/10'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                    Most Popular for Mining & Crusher
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white">{tier.name}</h3>
                    {tier.id === 'FREE' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{tier.tagline}</p>

                  {/* Price */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-2xl font-black text-white">₹{price.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 font-sans">/ month</span>
                    </div>
                    {billingCycle === 'ANNUAL' && tier.monthlyPriceRs > 0 && (
                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        Billed annually (₹{(price * 12).toLocaleString()}/year)
                      </div>
                    )}
                  </div>

                  {/* Limits Spec */}
                  <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Concessions:</span>
                      <strong className="text-slate-200">{tier.limits.concessions}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Fleet Vehicles:</span>
                      <strong className="text-slate-200">{tier.limits.fleetVehicles}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Weighbridge:</span>
                      <strong className="text-slate-200">{tier.limits.weighbridgeTickets}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Team OTT:</span>
                      <strong className="text-slate-200">{tier.limits.ottUsers}</strong>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mt-4 space-y-2">
                    <div className="text-[11px] uppercase font-mono text-slate-500 tracking-wider">Features Included</div>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedPlan(tier.id);
                      showToast(`Switched active subscription tier to ${tier.name}!`);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{isSelected ? 'Active Plan' : tier.id === 'FREE' ? 'Get Started Free' : 'Upgrade to ' + tier.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. USAGE & QUOTA TAB */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Current Tenant Quota & Real-Time Usage</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Track your monthly consumption across weighbridge passes, fleet GPS telematics, SMS/WhatsApp alerts and DMS documents.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>Weighbridge Dispatch Passes</span>
                  <span className="font-mono text-amber-400">1,420 / Unlimited</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[45%]" />
                </div>
                <div className="text-[10px] text-slate-500">Business Plan &bull; Cashed out ₹48.2L in sales passes this month</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>Active Fleet GPS Telematics Trackers</span>
                  <span className="font-mono text-cyan-400">18 / 25 Tippers</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-[72%]" />
                </div>
                <div className="text-[10px] text-slate-500">7 vehicle slots available on current subscription</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>WhatsApp & SMS Automation Dispatches</span>
                  <span className="font-mono text-emerald-400">624 / 2,000 Alerts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[31%]" />
                </div>
                <div className="text-[10px] text-slate-500">Includes Stock Low alerts, OTT alarms & customer dispatch passes</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>Cloud Document Storage (DMS & Weighbridge Photos)</span>
                  <span className="font-mono text-purple-400">24.6 GB / 100 GB</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full w-[25%]" />
                </div>
                <div className="text-[10px] text-slate-500">Encrypted on Google Cloud Storage with 99.999999999% durability</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
