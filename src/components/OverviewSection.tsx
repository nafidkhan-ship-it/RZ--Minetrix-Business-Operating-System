import React from 'react';
import { SYSTEM_OVERVIEW } from '../data/blueprintData';
import { ShieldCheck, CheckCircle2, Layers, Cpu, Globe, ArrowRight } from 'lucide-react';

export const OverviewSection: React.FC = () => {
  const targetIndustries = [
    { title: 'Mining & Quarries', subtitle: 'Laterite, Granite, Hard Rock & Aggregate Quarries', icon: '⛏️' },
    { title: 'Crusher Plants', subtitle: 'M-Sand, P-Sand, 20mm/12mm/6mm Aggregates', icon: '🏭' },
    { title: 'Fleet & Logistics', subtitle: 'Tipper Fleet, GPS Telematics, Drivers & Trip Batta', icon: '🚛' },
    { title: 'Building Materials', subtitle: 'Retail & Wholesale Cement, TMT, Hardware & UPVC', icon: '🏢' },
    { title: 'Equipment Rental', subtitle: 'Excavator, Breaker, Wheel Loader & Drill Hiring', icon: '🚜' },
    { title: 'E-Commerce Marketplace', subtitle: 'Online Stone Ordering, Machinery Trade & Jobs', icon: '🛒' }
  ];

  const enterpriseComparisons = [
    { system: 'Microsoft Dynamics 365', benchmark: 'Modular Business Suite architecture & Common Data Model (CDM)' },
    { system: 'SAP S/4HANA', benchmark: 'Strict Double-entry General Ledger & Audit trail integrity' },
    { system: 'Oracle NetSuite', benchmark: 'Multi-tenant cloud scalability & Subsidiary multi-currency consolidation' },
    { system: 'Salesforce Core', benchmark: 'Flexible RBAC permissions & Event-driven pub/sub architecture' },
    { system: 'Odoo Enterprise', benchmark: 'Extensible app ecosystem with unified user experience' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Vision Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Enterprise Operating Platform Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            RZ® Minetrix Business Operating System
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            {SYSTEM_OVERVIEW.tagline}. Designed as a unified multi-tenant SaaS cloud platform built to power thousands of enterprise accounts with zero duplicate business logic or redundant master data.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> One Platform, One Login
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10 Bounded DDD Contexts
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5 Business Suites + Shared Core
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> RLS Multi-Tenant Data Isolation
            </span>
          </div>
        </div>
      </div>

      {/* Target Industry Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-400" /> Target Industry Ecosystem
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetIndustries.map((ind, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition shadow-lg group"
            >
              <div className="text-3xl mb-2">{ind.icon}</div>
              <h4 className="font-bold text-white group-hover:text-amber-400 transition text-sm">{ind.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{ind.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" /> Enterprise Architectural Guarantees
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYSTEM_OVERVIEW.principles.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                {p.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark Benchmarking Matrix */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" /> World-Class Enterprise SaaS Benchmarks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enterpriseComparisons.map((c, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span>{c.system}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="text-slate-400 mt-1.5">{c.benchmark}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
