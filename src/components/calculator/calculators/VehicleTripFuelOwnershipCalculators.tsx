import React, { useState } from 'react';
import { Truck, Fuel, Users, TrendingUp, Copy, Check, RotateCcw, Plus, Trash2, ArrowRight } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  initialSubTab?: 'trip' | 'fuel' | 'ownership' | 'roi';
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

export const VehicleTripFuelOwnershipCalculators: React.FC<Props> = ({
  initialSubTab = 'trip',
  onRecordHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'trip' | 'fuel' | 'ownership' | 'roi'>(initialSubTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Vehicle Trip Calculator State
  const [tripDistanceKm, setTripDistanceKm] = useState<string>('140');
  const [fuelMileageKmpl, setFuelMileageKmpl] = useState<string>('3.5');
  const [dieselPrice, setDieselPrice] = useState<string>('92');
  const [tripToll, setTripToll] = useState<string>('450');
  const [tripDriverBatta, setTripDriverBatta] = useState<string>('750');
  const [tripLoadingUnloading, setTripLoadingUnloading] = useState<string>('500');
  const [tripFreightCharge, setTripFreightCharge] = useState<string>('8500');

  const distKm = parseFloat(tripDistanceKm) || 0;
  const kmpl = parseFloat(fuelMileageKmpl) || 0;
  const dieselRate = parseFloat(dieselPrice) || 0;
  const toll = parseFloat(tripToll) || 0;
  const batta = parseFloat(tripDriverBatta) || 0;
  const loading = parseFloat(tripLoadingUnloading) || 0;
  const freight = parseFloat(tripFreightCharge) || 0;

  const fuelLiters = kmpl > 0 ? distKm / kmpl : 0;
  const fuelCost = Math.round(fuelLiters * dieselRate);
  const totalTripExpense = fuelCost + toll + batta + loading;
  const netTripProfit = freight - totalTripExpense;
  const tripMarginPct = freight > 0 ? (netTripProfit / freight) * 100 : 0;
  const costPerKm = distKm > 0 ? totalTripExpense / distKm : 0;

  // 2. Fuel Consumption & Reverse Mileage State
  const [fuelMode, setFuelMode] = useState<'calc_fuel' | 'reverse_mileage'>('calc_fuel');
  const [fuelDistance, setFuelDistance] = useState<string>('450');
  const [fuelVehicleMileage, setFuelVehicleMileage] = useState<string>('3.2');
  const [fuelRatePerLiter, setFuelRatePerLiter] = useState<string>('92');
  const [litersFilled, setLitersFilled] = useState<string>('140');

  const fDist = parseFloat(fuelDistance) || 0;
  const fKmpl = parseFloat(fuelVehicleMileage) || 0;
  const fRate = parseFloat(fuelRatePerLiter) || 0;
  const fLitFilled = parseFloat(litersFilled) || 0;

  const calculatedFuelNeeded = fKmpl > 0 ? fDist / fKmpl : 0;
  const calculatedFuelCost = calculatedFuelNeeded * fRate;
  const calculatedActualMileage = fLitFilled > 0 ? fDist / fLitFilled : 0;

  // 3. Partner & Ownership Split State
  const [splitLumpSum, setSplitLumpSum] = useState<string>('1000000');
  const [partners, setPartners] = useState<{ id: string; name: string; equityPct: string }[]>([
    { id: '1', name: 'Managing Partner (Operator)', equityPct: '50' },
    { id: '2', name: 'Capital Partner A', equityPct: '30' },
    { id: '3', name: 'Land Partner B', equityPct: '20' }
  ]);

  const totalPool = parseFloat(splitLumpSum) || 0;
  const totalEquityAllocated = partners.reduce((sum, p) => sum + (parseFloat(p.equityPct) || 0), 0);

  // 4. Investment Return & ROI
  const [investedCapital, setInvestedCapital] = useState<string>('2000000');
  const [grossReturn, setGrossReturn] = useState<string>('2750000');
  const [investmentMonths, setInvestmentMonths] = useState<string>('18');

  const invCap = parseFloat(investedCapital) || 0;
  const gRet = parseFloat(grossReturn) || 0;
  const invMos = parseFloat(investmentMonths) || 1;

  const netInvestmentProfit = gRet - invCap;
  const totalRoiPct = invCap > 0 ? (netInvestmentProfit / invCap) * 100 : 0;
  const annualizedRoiPct = invMos > 0 ? totalRoiPct * (12 / invMos) : 0;

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit overflow-x-auto scrollbar-none">
        {[
          { id: 'trip', label: 'Vehicle Trip Cost & Profit' },
          { id: 'fuel', label: 'Fuel & Mileage' },
          { id: 'ownership', label: 'Partner Ownership Split' },
          { id: 'roi', label: 'Investment ROI' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. VEHICLE TRIP CALCULATOR */}
      {activeSubTab === 'trip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Commercial Fleet Trip Economics</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tipper &amp; trailer diesel burn, tolls, batta and net freight margin</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Round-Trip Distance (km)</label>
                <input
                  type="number"
                  value={tripDistanceKm}
                  onChange={e => setTripDistanceKm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Mileage (km / Liter)</label>
                <input
                  type="number"
                  value={fuelMileageKmpl}
                  onChange={e => setFuelMileageKmpl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Diesel Price (₹ / Liter)</label>
                <input
                  type="number"
                  value={dieselPrice}
                  onChange={e => setDieselPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Toll &amp; Border Cess (₹)</label>
                <input
                  type="number"
                  value={tripToll}
                  onChange={e => setTripToll(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Driver Batta &amp; Food (₹)</label>
                <input
                  type="number"
                  value={tripDriverBatta}
                  onChange={e => setTripDriverBatta(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Loading / Weighment (₹)</label>
                <input
                  type="number"
                  value={tripLoadingUnloading}
                  onChange={e => setTripLoadingUnloading(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="text-slate-300 font-bold block mb-1">Billed Freight Charge to Customer (₹)</label>
                <input
                  type="number"
                  value={tripFreightCharge}
                  onChange={e => setTripFreightCharge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold text-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Net Trip Margin
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Net Freight Contribution</div>
                <div className={`text-4xl font-black font-mono ${netTripProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₹{netTripProfit.toLocaleString()}
                </div>
                <div className="text-xs text-slate-300">
                  {tripMarginPct.toFixed(1)}% Operating Margin &bull; Cost: ₹{costPerKm.toFixed(1)} / km
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Diesel Consumption:</span>
                  <span className="font-mono text-white font-bold">{fuelLiters.toFixed(1)} L (₹{fuelCost.toLocaleString()})</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Direct Trip Expense:</span>
                  <span className="font-mono text-rose-400 font-bold">₹{totalTripExpense.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Trip (${distKm} km): Freight ₹${freight} | Cost ₹${totalTripExpense} | Net Profit ₹${netTripProfit} (${tripMarginPct.toFixed(1)}%)`, 'trip')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'trip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'trip' ? 'Copied' : 'Copy Trip Profit'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. FUEL CONSUMPTION & MILEAGE */}
      {activeSubTab === 'fuel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Fuel Consumption &amp; Reverse Mileage</h3>
                <p className="text-xs text-slate-400 mt-0.5">Estimate fuel quantity needed or test actual fleet efficiency</p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setFuelMode('calc_fuel')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    fuelMode === 'calc_fuel' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fuel Needed
                </button>
                <button
                  onClick={() => setFuelMode('reverse_mileage')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    fuelMode === 'reverse_mileage' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Actual Mileage
                </button>
              </div>
            </div>

            {fuelMode === 'calc_fuel' ? (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Route Distance (km)</label>
                  <input
                    type="number"
                    value={fuelDistance}
                    onChange={e => setFuelDistance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mileage (km/L)</label>
                  <input
                    type="number"
                    value={fuelVehicleMileage}
                    onChange={e => setFuelVehicleMileage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Diesel Price (₹/L)</label>
                  <input
                    type="number"
                    value={fuelRatePerLiter}
                    onChange={e => setFuelRatePerLiter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Odometer Distance Traveled (km)</label>
                  <input
                    type="number"
                    value={fuelDistance}
                    onChange={e => setFuelDistance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Fuel Filled / Burned (Liters)</label>
                  <input
                    type="number"
                    value={litersFilled}
                    onChange={e => setLitersFilled(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                {fuelMode === 'calc_fuel' ? 'Required Fuel & Outlay' : 'Calculated Efficiency'}
              </span>

              {fuelMode === 'calc_fuel' ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                  <div className="text-xs text-slate-400">Total Fuel Needed</div>
                  <div className="text-4xl font-black text-amber-400 font-mono">
                    {calculatedFuelNeeded.toFixed(1)} Liters
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    Cost: ₹{Math.round(calculatedFuelCost).toLocaleString()} @ ₹{fRate}/L
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                  <div className="text-xs text-slate-400">Real Fleet Mileage</div>
                  <div className="text-4xl font-black text-emerald-400 font-mono">
                    {calculatedActualMileage.toFixed(2)} km / L
                  </div>
                  <div className="text-xs text-slate-400">
                    {fDist} km completed using {fLitFilled} liters
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleCopy(
                fuelMode === 'calc_fuel'
                  ? `Fuel: ${calculatedFuelNeeded.toFixed(1)} L (₹${Math.round(calculatedFuelCost)})`
                  : `Mileage: ${calculatedActualMileage.toFixed(2)} km/L`,
                'fuel'
              )}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'fuel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'fuel' ? 'Copied' : 'Copy Fuel Metric'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. PARTNER & CAPITAL OWNERSHIP SPLIT */}
      {activeSubTab === 'ownership' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Partner Equity &amp; Dividend Split</h3>
                <p className="text-xs text-slate-400 mt-0.5">Distribute net earnings or capital calls across ownership stakes</p>
              </div>
              <button
                onClick={() => setPartners([
                  ...partners,
                  { id: String(Date.now()), name: `Partner ${String.fromCharCode(65 + partners.length)}`, equityPct: '10' }
                ])}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Partner</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Total Pool to Distribute (₹)</label>
              <input
                type="number"
                value={splitLumpSum}
                onChange={e => setSplitLumpSum(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold focus:border-amber-500"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Stakeholder Ownership Stakes</span>
              {partners.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={p.name}
                    onChange={e => {
                      const val = e.target.value;
                      setPartners(prev => prev.map(item => item.id === p.id ? { ...item, name: val } : item));
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs flex-1"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <input
                      type="number"
                      value={p.equityPct}
                      onChange={e => {
                        const val = e.target.value;
                        setPartners(prev => prev.map(item => item.id === p.id ? { ...item, equityPct: val } : item));
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs w-full text-right"
                    />
                    <span className="text-xs text-slate-400 font-mono">%</span>
                  </div>
                  {partners.length > 2 && (
                    <button
                      onClick={() => setPartners(prev => prev.filter(item => item.id !== p.id))}
                      className="text-slate-500 hover:text-rose-400 transition cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-400 flex justify-between items-center pt-1">
              <span>Total Equity Allocated:</span>
              <span className={`font-mono font-bold ${totalEquityAllocated === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalEquityAllocated}% {totalEquityAllocated !== 100 && '(Warning: Not 100%)'}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Payout Breakdown
              </span>

              <div className="space-y-2">
                {partners.map(p => {
                  const pct = parseFloat(p.equityPct) || 0;
                  const payout = totalEquityAllocated > 0 ? (pct / 100) * totalPool : 0;
                  return (
                    <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{p.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{pct}% stake</div>
                      </div>
                      <div className="text-base font-black text-amber-400 font-mono">
                        ₹{Math.round(payout).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleCopy(
                partners.map(p => `${p.name} (${p.equityPct}%): ₹${Math.round((parseFloat(p.equityPct) / 100) * totalPool)}`).join(' | '),
                'own'
              )}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'own' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'own' ? 'Copied' : 'Copy Equity Statement'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. INVESTMENT RETURN & ROI */}
      {activeSubTab === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Investment Return (ROI)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Evaluate capital yield on quarry machinery, leases and plant assets</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Capital Invested (₹)</label>
                <input
                  type="number"
                  value={investedCapital}
                  onChange={e => setInvestedCapital(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Gross Return / Sale (₹)</label>
                <input
                  type="number"
                  value={grossReturn}
                  onChange={e => setGrossReturn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Holding Period (Months)</label>
                <input
                  type="number"
                  value={investmentMonths}
                  onChange={e => setInvestmentMonths(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Return on Investment
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Total Absolute ROI</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  +{totalRoiPct.toFixed(1)}%
                </div>
                <div className="text-xs text-amber-400 font-semibold">
                  Annualized ROI: {annualizedRoiPct.toFixed(1)}% p.a.
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Net Capital Gain:</span>
                  <span className="font-mono text-emerald-400 font-bold">+₹{netInvestmentProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payback Multiple:</span>
                  <span className="font-mono text-white font-bold">
                    {invCap > 0 ? (gRet / invCap).toFixed(2) : 0}x
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`ROI: ${totalRoiPct.toFixed(1)}% (Annualized: ${annualizedRoiPct.toFixed(1)}%) | Net Gain: ₹${netInvestmentProfit}`, 'roi')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'roi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'roi' ? 'Copied' : 'Copy ROI Yield'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
