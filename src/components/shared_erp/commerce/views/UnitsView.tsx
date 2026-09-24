import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Calculator,
  Sliders
} from 'lucide-react';
import { MeasurementUnit, CommerceSubTab } from '../types';
import { MOCK_MEASUREMENT_UNITS } from '../commerceMockData';

interface UnitsViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
}

export const UnitsView: React.FC<UnitsViewProps> = ({ onNavigateTab, onToast }) => {
  const [units, setUnits] = useState<MeasurementUnit[]>(MOCK_MEASUREMENT_UNITS);
  const [search, setSearch] = useState('');

  // Interactive Unit Converter state
  const [convertFrom, setConvertFrom] = useState('UNIT-04'); // Tipper Load
  const [convertTo, setConvertTo] = useState('UNIT-02'); // Metric Ton
  const [convertQty, setConvertQty] = useState(1);

  const fromUnit = units.find((u) => u.id === convertFrom) || units[0];
  const toUnit = units.find((u) => u.id === convertTo) || units[1];

  // Simple conversion demo
  const calculateConversion = () => {
    // If from Load to Ton: 1 load = 24 Ton
    const baseVal = convertQty * fromUnit.conversionFactor;
    const result = baseVal / toUnit.conversionFactor;
    return result.toFixed(toUnit.decimalPrecision || 2);
  };

  const filteredUnits = units.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.symbol.toLowerCase().includes(search.toLowerCase()) ||
    u.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Measurement Standards &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Configurable Measurement Units &amp; Conversion Matrix
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Handles mining and transport units: Piece, 10-Wheel Load, Metric Ton, Kilogram, Litre, Haulage Trip, Machine Hour, Cent, Square Metre and Cubic Metre.
            </p>
          </div>

          <button
            onClick={() => onToast('Unit configuration saved')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Unit Definition</span>
          </button>
        </div>
      </div>

      {/* Interactive Unit Converter Preview Tool */}
      <div className="bg-gradient-to-br from-slate-900 to-amber-950/20 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive Mining Unit Converter &bull; Weighbridge Simulator
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-300">Live Mathematical Precision</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
          <div>
            <label className="text-slate-400 block mb-1">Input Quantity</label>
            <input
              type="number"
              min="0.1"
              step="any"
              value={convertQty}
              onChange={(e) => setConvertQty(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">From Unit</label>
            <select
              value={convertFrom}
              onChange={(e) => setConvertFrom(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">To Unit</label>
            <select
              value={convertTo}
              onChange={(e) => setConvertTo(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
              ))}
            </select>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Equivalent:</span>
            <span className="text-base font-mono font-black text-amber-400">
              {calculateConversion()} {toUnit.symbol}
            </span>
          </div>
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Standard Measurement Units Registry ({filteredUnits.length})</span>
          </h3>
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter units..."
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
                <th className="py-2.5 px-3">UNIT NAME</th>
                <th className="py-2.5 px-3">SYMBOL</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">BASE UNIT</th>
                <th className="py-2.5 px-3">CONVERSION FACTOR</th>
                <th className="py-2.5 px-3">DECIMALS</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUnits.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/50 text-slate-300">
                  <td className="py-3 px-3 font-bold text-white">{u.name}</td>
                  <td className="py-3 px-3 font-mono text-amber-400">{u.symbol}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {u.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{u.baseUnit}</td>
                  <td className="py-3 px-3 font-mono text-white">{u.conversionFactor}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{u.decimalPrecision} places</td>
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
