import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, X, Sparkles, Check } from 'lucide-react';
import { LandUnit, convertLandUnit } from '../../data/quarryLandData';

interface LandUnitConverterProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
}

export const LandUnitConverter: React.FC<LandUnitConverterProps> = ({
  isOpen = false,
  onClose,
  isInline = false
}) => {
  const [val, setVal] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<LandUnit>('Cent');
  const [toUnit, setToUnit] = useState<LandUnit>('Acre');

  const result = convertLandUnit(val || 0, fromUnit, toUnit);

  const UNITS: LandUnit[] = ['Cent', 'Acre', 'Hectare', 'Sq.Ft', 'Sq.M'];

  const quickConversions = [
    { label: '1 Acre', toCent: '100 Cents', toSqFt: '43,560 Sq.Ft' },
    { label: '1 Cent', toSqFt: '435.6 Sq.Ft', toSqM: '40.47 Sq.M' },
    { label: '1 Hectare', toAcre: '2.471 Acres', toCent: '247.1 Cents' },
    { label: '10 Cents', toSqFt: '4,356 Sq.Ft', toSqM: '404.7 Sq.M' }
  ];

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Quarry Land Unit Converter</h3>
            <p className="text-[11px] text-slate-400">Instant cadastral conversion across South Indian land standards</p>
          </div>
        </div>
        {onClose && !isInline && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input & Unit selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300">From Value</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-400"
              placeholder="e.g. 100"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as LandUnit)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white font-medium text-xs focus:outline-none focus:border-purple-400"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300">Target Unit</label>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                const temp = fromUnit;
                setFromUnit(toUnit);
                setToUnit(temp);
              }}
              title="Swap Units"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 transition"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as LandUnit)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-purple-400"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
            Converted Extent
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            {result.toLocaleString('en-IN')} <span className="text-purple-300 text-sm font-sans">{toUnit}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">Equivalent In Cents</div>
          <div className="text-xs font-mono font-bold text-emerald-400">
            {convertLandUnit(val, fromUnit, 'Cent').toLocaleString('en-IN')} Cents
          </div>
        </div>
      </div>

      {/* Quick Cadastral Reference Matrix */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Cadastral Standard Ratios (Kerala & Karnataka Mining Pits)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickConversions.map((qc, idx) => (
            <div key={idx} className="p-2 bg-slate-950/80 border border-slate-800 rounded-xl text-[10px]">
              <div className="font-bold text-white">{qc.label}</div>
              <div className="text-slate-400 mt-0.5">{qc.toCent || qc.toAcre}</div>
              <div className="text-purple-400 font-mono">{qc.toSqFt || qc.toSqM}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        {content}
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-5 shadow-2xl">
        {content}
      </div>
    </div>
  );
};
