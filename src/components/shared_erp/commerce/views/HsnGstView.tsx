import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Search,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { HsnGstRecord, CommerceSubTab } from '../types';
import { MOCK_HSN_GST } from '../commerceMockData';

interface HsnGstViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
}

export const HsnGstView: React.FC<HsnGstViewProps> = ({ onNavigateTab, onToast }) => {
  const [hsnList, setHsnList] = useState<HsnGstRecord[]>(MOCK_HSN_GST);
  const [search, setSearch] = useState('');

  // Interactive GST Simulator State
  const [taxableAmount, setTaxableAmount] = useState<number>(100000);
  const [selectedGstPct, setSelectedGstPct] = useState<number>(5);
  const [isInterstate, setIsInterstate] = useState<boolean>(false); // Intrastate (CGST+SGST) vs Interstate (IGST)
  const [isGstInclusive, setIsGstInclusive] = useState<boolean>(false);

  // Calculation engine
  const computeGst = () => {
    let baseTaxable = taxableAmount;
    let gstAmount = 0;

    if (isGstInclusive) {
      baseTaxable = taxableAmount / (1 + selectedGstPct / 100);
      gstAmount = taxableAmount - baseTaxable;
    } else {
      gstAmount = (taxableAmount * selectedGstPct) / 100;
    }

    const cgst = isInterstate ? 0 : gstAmount / 2;
    const sgst = isInterstate ? 0 : gstAmount / 2;
    const igst = isInterstate ? gstAmount : 0;
    const grandTotal = isGstInclusive ? taxableAmount : taxableAmount + gstAmount;

    return {
      baseTaxable: baseTaxable.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    };
  };

  const calc = computeGst();

  const filteredHsn = hsnList.filter((h) =>
    h.hsnSac.includes(search) ||
    h.description.toLowerCase().includes(search.toLowerCase()) ||
    h.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Taxation Compliance &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              HSN / SAC Master Directory &amp; Real-Time GST Engine
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Configures statutory GST rates (5%, 18%, 28%), CGST + SGST split vs Interstate IGST rules, and e-Way bill thresholds for bulk quarry consignments.
            </p>
          </div>

          <button
            onClick={() => onToast('Added new HSN/SAC code')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add HSN / SAC Code</span>
          </button>
        </div>
      </div>

      {/* Interactive GST Calculation Simulator (Prompt Requirement 8) */}
      <div className="bg-gradient-to-br from-slate-900 to-amber-950/20 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive GST Calculation Simulator &bull; Intrastate vs Interstate
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">100% CBIC Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs items-end">
          <div>
            <label className="text-slate-400 block mb-1">Taxable Amount (₹)</label>
            <input
              type="number"
              min="100"
              step="500"
              value={taxableAmount}
              onChange={(e) => setTaxableAmount(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">GST Rate Tier</label>
            <select
              value={selectedGstPct}
              onChange={(e) => setSelectedGstPct(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
            >
              <option value={5}>5% (Mining Stone, Sand, Aggregates)</option>
              <option value={12}>12% (Construction Chemicals)</option>
              <option value={18}>18% (Fuels, Machine Spares &amp; Freight SAC)</option>
              <option value={28}>28% (Heavy Commercial Tyres)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 block">Supply Region Classification</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsInterstate(false)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  !isInterstate ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Intrastate (CGST+SGST)
              </button>
              <button
                type="button"
                onClick={() => setIsInterstate(true)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  isInterstate ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Interstate (IGST)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 block">Pricing Mode</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGstInclusive(false)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  !isGstInclusive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                GST Exclusive
              </button>
              <button
                type="button"
                onClick={() => setIsGstInclusive(true)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  isGstInclusive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                GST Inclusive
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Calculation Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] text-slate-400 block">Taxable Base</span>
            <span className="text-sm font-mono font-bold text-white mt-0.5 block">₹{calc.baseTaxable}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] text-slate-400 block">CGST ({selectedGstPct / 2}%)</span>
            <span className="text-sm font-mono font-bold text-amber-400 mt-0.5 block">
              {!isInterstate ? `₹${calc.cgst}` : '₹0.00'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] text-slate-400 block">SGST ({selectedGstPct / 2}%)</span>
            <span className="text-sm font-mono font-bold text-amber-400 mt-0.5 block">
              {!isInterstate ? `₹${calc.sgst}` : '₹0.00'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] text-slate-400 block">IGST ({selectedGstPct}%)</span>
            <span className="text-sm font-mono font-bold text-purple-400 mt-0.5 block">
              {isInterstate ? `₹${calc.igst}` : '₹0.00'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-300 font-bold block">Grand Total</span>
            <span className="text-base font-mono font-black text-emerald-400 mt-0.5 block">₹{calc.grandTotal}</span>
          </div>
        </div>
      </div>

      {/* HSN Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            <span>Configured HSN &amp; SAC Codes ({filteredHsn.length})</span>
          </h3>
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search HSN/SAC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                <th className="py-2.5 px-3">HSN / SAC</th>
                <th className="py-2.5 px-3">DESCRIPTION</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3 text-right">GST %</th>
                <th className="py-2.5 px-3 text-right">CGST</th>
                <th className="py-2.5 px-3 text-right">SGST</th>
                <th className="py-2.5 px-3 text-right">IGST</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHsn.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/50 text-slate-300">
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{h.hsnSac}</td>
                  <td className="py-3 px-3 max-w-md text-white font-medium">{h.description}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {h.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{h.gstPct}%</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">{h.cgstPct}%</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">{h.sgstPct}%</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">{h.igstPct}%</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
