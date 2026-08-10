import React, { useState } from 'react';
import { BUSINESS_SUITES } from '../data/blueprintData';
import { LayoutGrid, Pickaxe, Truck, Package, Users, ShoppingBag, ShieldCheck, Check } from 'lucide-react';

export const SuitesMatrixSection: React.FC = () => {
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>(BUSINESS_SUITES[0].id);

  const iconsMap: Record<string, React.ReactNode> = {
    Pickaxe: <Pickaxe className="w-5 h-5 text-amber-400" />,
    Truck: <Truck className="w-5 h-5 text-blue-400" />,
    Package: <Package className="w-5 h-5 text-purple-400" />,
    Users: <Users className="w-5 h-5 text-indigo-400" />,
    ShoppingBag: <ShoppingBag className="w-5 h-5 text-rose-400" />
  };

  const sharedCoreModules = [
    { title: 'Authentication & SSO', desc: 'Argon2id password hashing, Multi-Factor Auth (MFA), JWT, JWKS, and OAuth2.' },
    { title: 'Multi-Tenant Company MDM', desc: 'Legal entity hierarchy, branches, business units, currency formats, and tax rules.' },
    { title: 'Role-Based Access (RBAC/ABAC)', desc: 'Fine-grained permissions matrix mapped to user roles with branch-level data scoping.' },
    { title: 'Centralized Finance Engine', desc: 'Double-entry general ledger, Chart of Accounts, GST Tax Engine, AR/AP, and Financial Reports.' },
    { title: 'HRMS & Payroll Engine', desc: 'Biometric attendance, shift rostering, weekly quarry wage settlements, and salary slips.' },
    { title: 'Gemini AI & OCR Engine', desc: 'Scanned weighbridge ticket OCR, vehicle document parsing, and local language voice assistant.' },
    { title: 'WhatsApp & Notification Engine', desc: 'Transactional WhatsApp message dispatch for Gate Passes, invoices, and low stock alerts.' },
    { title: 'Audit & Compliance Engine', desc: 'Immutable shadow audit trails, user activity logs, and statutory mining royalty tracking.' }
  ];

  const selectedSuite = BUSINESS_SUITES.find(s => s.id === selectedSuiteId) || BUSINESS_SUITES[0];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <LayoutGrid className="w-4 h-4" />
          <span>Business Suites & Shared Core</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">5 Independent Business Suites & Shared Core</h2>
        <p className="text-slate-400 text-sm mt-1">
          Every suite operates as an autonomous business application, relying on the Shared Core Engine for master data, security, and financial consolidation.
        </p>
      </div>

      {/* Shared Core Engine Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Universal Shared Core Platform Services</span>
        </div>
        <h3 className="text-lg font-bold text-white">Central Foundation Services Bound To All Suites</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {sharedCoreModules.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <h4 className="font-bold text-amber-400 mb-1">{m.title}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suite Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {BUSINESS_SUITES.map((suite) => {
          const isSelected = selectedSuiteId === suite.id;
          return (
            <button
              key={suite.id}
              onClick={() => setSelectedSuiteId(suite.id)}
              className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {iconsMap[suite.icon]}
                <span className="text-[10px] font-mono text-slate-500">{suite.code}</span>
              </div>
              <h4 className="font-bold text-xs text-white line-clamp-1">{suite.name}</h4>
            </button>
          );
        })}
      </div>

      {/* Selected Suite Detailed Breakdown */}
      {selectedSuite && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-amber-400">{selectedSuite.code}</span>
            <h3 className="text-xl font-bold text-white mt-1">{selectedSuite.name}</h3>
            <p className="text-xs text-slate-300 mt-1">{selectedSuite.tagline}</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedSuite.description}</p>
          </div>

          {/* Module Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Functional Suite Modules</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {selectedSuite.modules.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h5 className="font-bold text-white text-sm text-amber-400">{mod.name}</h5>
                  <p className="text-xs text-slate-300">{mod.description}</p>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Key Functional Capabilities:</span>
                    {mod.keyFeatures.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-slate-300">
                        <Check className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-1">
                    <span>Shared Core Binding:</span>
                    <strong className="text-slate-300">{mod.sharedCoreDependencies.join(', ')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
