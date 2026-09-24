import React, { useState } from 'react';
import { Scale, ArrowRightLeft, Copy, Check, Info } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  initialCategory?: 'land' | 'weight' | 'volume' | 'length' | 'area' | 'distance' | 'time';
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

type UnitCategory = 'land' | 'weight' | 'volume' | 'length' | 'area' | 'distance' | 'time';

interface UnitDef {
  id: string;
  name: string;
  toBase: number; // multiply by toBase to get value in base unit
  symbol: string;
}

const UNIT_SYSTEMS: Record<UnitCategory, { name: string; baseUnit: string; units: UnitDef[] }> = {
  land: {
    name: 'Land & Survey Area',
    baseUnit: 'sqm',
    units: [
      { id: 'cent', name: 'Cent (Kerala / South India)', toBase: 40.468564, symbol: 'ct' },
      { id: 'acre', name: 'Acre (100 Cents)', toBase: 4046.8564, symbol: 'ac' },
      { id: 'hectare', name: 'Hectare (10,000 sq.m)', toBase: 10000, symbol: 'ha' },
      { id: 'sqft', name: 'Square Feet', toBase: 0.092903, symbol: 'sq.ft' },
      { id: 'sqm', name: 'Square Meter', toBase: 1, symbol: 'm²' },
      { id: 'guntha', name: 'Guntha (2.5 Cents)', toBase: 101.17, symbol: 'guntha' }
    ]
  },
  weight: {
    name: 'Weight & Minerals',
    baseUnit: 'kg',
    units: [
      { id: 'mt', name: 'Metric Ton (Tonne)', toBase: 1000, symbol: 'MT' },
      { id: 'kg', name: 'Kilogram', toBase: 1, symbol: 'kg' },
      { id: 'gram', name: 'Gram', toBase: 0.001, symbol: 'g' },
      { id: 'quintal', name: 'Quintal (100 kg)', toBase: 100, symbol: 'qtl' },
      { id: 'pound', name: 'Pound (lb)', toBase: 0.453592, symbol: 'lb' }
    ]
  },
  volume: {
    name: 'Volume & Bulk Aggregates',
    baseUnit: 'liter',
    units: [
      { id: 'cft', name: 'Cubic Feet (CFT - Mining Standard)', toBase: 28.3168, symbol: 'CFT' },
      { id: 'cum', name: 'Cubic Meter (Cu.M)', toBase: 1000, symbol: 'm³' },
      { id: 'liter', name: 'Litre', toBase: 1, symbol: 'L' },
      { id: 'ml', name: 'Millilitre', toBase: 0.001, symbol: 'mL' },
      { id: 'brass', name: 'Brass (100 CFT)', toBase: 2831.68, symbol: 'brass' }
    ]
  },
  length: {
    name: 'Length & Dimensions',
    baseUnit: 'meter',
    units: [
      { id: 'mm', name: 'Millimeter', toBase: 0.001, symbol: 'mm' },
      { id: 'cm', name: 'Centimeter', toBase: 0.01, symbol: 'cm' },
      { id: 'meter', name: 'Meter', toBase: 1, symbol: 'm' },
      { id: 'km', name: 'Kilometer', toBase: 1000, symbol: 'km' },
      { id: 'inch', name: 'Inch', toBase: 0.0254, symbol: 'in' },
      { id: 'feet', name: 'Feet', toBase: 0.3048, symbol: 'ft' },
      { id: 'yard', name: 'Yard', toBase: 0.9144, symbol: 'yd' }
    ]
  },
  area: {
    name: 'General Surface Area',
    baseUnit: 'sqm',
    units: [
      { id: 'sqft', name: 'Square Feet', toBase: 0.092903, symbol: 'sq.ft' },
      { id: 'sqm', name: 'Square Meter', toBase: 1, symbol: 'm²' },
      { id: 'sqyard', name: 'Square Yard (Gaj)', toBase: 0.836127, symbol: 'sq.yd' },
      { id: 'sqkm', name: 'Square Kilometer', toBase: 1000000, symbol: 'km²' },
      { id: 'sqinch', name: 'Square Inch', toBase: 0.00064516, symbol: 'sq.in' }
    ]
  },
  distance: {
    name: 'Distance & Route Travel',
    baseUnit: 'km',
    units: [
      { id: 'km', name: 'Kilometre (Road Route)', toBase: 1, symbol: 'km' },
      { id: 'meter', name: 'Metre', toBase: 0.001, symbol: 'm' },
      { id: 'mile', name: 'Mile', toBase: 1.60934, symbol: 'mi' },
      { id: 'nautical', name: 'Nautical Mile', toBase: 1.852, symbol: 'nmi' }
    ]
  },
  time: {
    name: 'Time & Quarry Shifts',
    baseUnit: 'minute',
    units: [
      { id: 'sec', name: 'Second', toBase: 1 / 60, symbol: 's' },
      { id: 'minute', name: 'Minute', toBase: 1, symbol: 'min' },
      { id: 'hour', name: 'Hour', toBase: 60, symbol: 'hr' },
      { id: 'day', name: 'Day (24 Hours)', toBase: 1440, symbol: 'day' },
      { id: 'shift', name: 'Quarry Shift (8 Hours)', toBase: 480, symbol: 'shift' }
    ]
  }
};

export const UnitLandConverter: React.FC<Props> = ({
  initialCategory = 'land',
  onRecordHistory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(initialCategory);
  const [inputValue, setInputValue] = useState<string>('50');
  const [fromUnitId, setFromUnitId] = useState<string>('cent');
  const [toUnitId, setToUnitId] = useState<string>('acre');
  const [copied, setCopied] = useState(false);

  // Switch category defaults
  const handleSelectCategory = (cat: UnitCategory) => {
    setSelectedCategory(cat);
    const units = UNIT_SYSTEMS[cat].units;
    setFromUnitId(units[0].id);
    setToUnitId(units[1] ? units[1].id : units[0].id);
  };

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const categoryDef = UNIT_SYSTEMS[selectedCategory];
  const fromUnit = categoryDef.units.find(u => u.id === fromUnitId) || categoryDef.units[0];
  const toUnit = categoryDef.units.find(u => u.id === toUnitId) || categoryDef.units[1] || categoryDef.units[0];

  const inVal = parseFloat(inputValue) || 0;
  // Convert: inputValue * fromUnit.toBase / toUnit.toBase
  const baseVal = inVal * fromUnit.toBase;
  const outVal = toUnit.toBase !== 0 ? baseVal / toUnit.toBase : 0;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${inVal} ${fromUnit.symbol} = ${outVal.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit.symbol}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(UNIT_SYSTEMS) as UnitCategory[]).map(catKey => {
          const cat = UNIT_SYSTEMS[catKey];
          const active = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => handleSelectCategory(catKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                active
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Converter Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="font-bold text-white text-base">{categoryDef.name} Conversion</h3>
            <p className="text-xs text-slate-400 mt-0.5">High-accuracy industrial and land-registry multiplier factors</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            {/* Input From */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">From Unit</label>
              <select
                value={fromUnitId}
                onChange={e => setFromUnitId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
              >
                {categoryDef.units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500"
                placeholder="Enter value"
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center sm:pt-6">
              <button
                onClick={handleSwap}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 transition cursor-pointer"
                title="Swap Units"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Target Unit */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">To Unit</label>
              <select
                value={toUnitId}
                onChange={e => setToUnitId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
              >
                {categoryDef.units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-amber-400 font-mono text-base font-bold truncate">
                {outVal.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
            </div>
          </div>

          {/* Quick presets for land / mining */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] text-slate-400 font-bold block">Quick Value Presets</span>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 5, 10, 25, 50, 100, 250, 500, 1000].map(val => (
                <button
                  key={val}
                  onClick={() => setInputValue(String(val))}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                    inputValue === String(val)
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All Units Equivalence Grid */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Full Equivalence Table
              </span>
              <span className="text-xs text-amber-400 font-bold font-mono">
                {inVal} {fromUnit.symbol} equals:
              </span>
            </div>

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto scrollbar-none pr-1">
              {categoryDef.units.map(targetUnit => {
                const equivVal = targetUnit.toBase !== 0 ? baseVal / targetUnit.toBase : 0;
                return (
                  <div
                    key={targetUnit.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                      targetUnit.id === toUnitId
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{targetUnit.name}</span>
                    <span className="font-mono text-white font-bold">
                      {equivVal.toLocaleString(undefined, { maximumFractionDigits: 4 })} {targetUnit.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              1 {fromUnit.symbol} = {(fromUnit.toBase / toUnit.toBase).toFixed(4)} {toUnit.symbol}
            </div>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
