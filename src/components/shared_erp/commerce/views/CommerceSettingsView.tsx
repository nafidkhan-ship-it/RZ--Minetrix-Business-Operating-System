import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Hash,
  Percent,
  CreditCard,
  Scale,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { CommerceSubTab } from '../types';

interface CommerceSettingsViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
}

export const CommerceSettingsView: React.FC<CommerceSettingsViewProps> = ({
  onNavigateTab,
  onToast
}) => {
  // Settings Form State
  const [invPrefix, setInvPrefix] = useState('INV-2026-');
  const [poPrefix, setPoPrefix] = useState('PO-2026-');
  const [quotPrefix, setQuotPrefix] = useState('QUOT-2026-');
  const [grnPrefix, setGrnPrefix] = useState('GRN-2026-');
  const [gpPrefix, setGpPrefix] = useState('GP-2026-');
  const [weighbridgeTolerance, setWeighbridgeTolerance] = useState(0.5); // 0.5%
  const [defaultCreditDays, setDefaultCreditDays] = useState(30);
  const [maxCreditLimitOwnerOnly, setMaxCreditLimitOwnerOnly] = useState(500000);
  const [roundOffMode, setRoundOffMode] = useState('NEAREST_RUPEE');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onToast('Commerce & Trade system configurations saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                System Governance &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Commerce &amp; Trade System Settings &bull; Numbering, Tax &amp; Credit Limits
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Configures document auto-numbering prefixes, statutory GST calculation defaults, weighbridge gross/tare variance tolerances, and managerial credit limit sanction ceilings.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configurations</span>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Document Numbering Sequences */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Hash className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Auto-Numbering Sequences &amp; Prefixes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={invPrefix}
                onChange={(e) => setInvPrefix(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Purchase Order</label>
              <input
                type="text"
                value={poPrefix}
                onChange={(e) => setPoPrefix(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Quotation Prefix</label>
              <input
                type="text"
                value={quotPrefix}
                onChange={(e) => setQuotPrefix(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Inward GRN Prefix</label>
              <input
                type="text"
                value={grnPrefix}
                onChange={(e) => setGrnPrefix(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Gate Pass Prefix</label>
              <input
                type="text"
                value={gpPrefix}
                onChange={(e) => setGpPrefix(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Credit Governance & Operational Limits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Credit Governance &amp; Sanction Policies</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Standard Default Credit Period (Days)</label>
                <input
                  type="number"
                  value={defaultCreditDays}
                  onChange={(e) => setDefaultCreditDays(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Manager Sanction Ceiling (Over this requires MD/Owner)</label>
                <input
                  type="number"
                  step="50000"
                  value={maxCreditLimitOwnerOnly}
                  onChange={(e) => setMaxCreditLimitOwnerOnly(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Weighbridge Variance &amp; Billing Rounding</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Max Tolerable Weighbridge Variance (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weighbridgeTolerance}
                  onChange={(e) => setWeighbridgeTolerance(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Dispatches exceeding &plusmn;{weighbridgeTolerance}% variance require physical site re-taring.
                </span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Invoice Amount Round-Off Mode</label>
                <select
                  value={roundOffMode}
                  onChange={(e) => setRoundOffMode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer"
                >
                  <option value="NEAREST_RUPEE">Round to Nearest Rupee (Recommended)</option>
                  <option value="NEAREST_10_RUPEES">Round to Nearest ₹10</option>
                  <option value="EXACT_PAISE">Exact Paise (2 Decimals)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
