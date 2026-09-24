import React, { useState } from 'react';
import { TrendingUp, Copy, Check, RotateCcw, Plus, Trash2, ArrowRight } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  initialSubTab?: 'revenue' | 'breakeven' | 'margin' | 'target' | 'unitcost' | 'expense';
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

export const BusinessCalculators: React.FC<Props> = ({
  initialSubTab = 'breakeven',
  onRecordHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'revenue' | 'breakeven' | 'margin' | 'target' | 'unitcost' | 'expense'>(initialSubTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Break-Even Analysis State
  const [fixedCosts, setFixedCosts] = useState<string>('250000');
  const [pricePerUnit, setPricePerUnit] = useState<string>('850');
  const [varCostPerUnit, setVarCostPerUnit] = useState<string>('450');

  const fc = parseFloat(fixedCosts) || 0;
  const ppu = parseFloat(pricePerUnit) || 0;
  const vcpu = parseFloat(varCostPerUnit) || 0;

  const contributionMargin = Math.max(0, ppu - vcpu);
  const contributionRatio = ppu > 0 ? (contributionMargin / ppu) * 100 : 0;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fc / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * ppu;

  // 2. Multi-Product Revenue State
  const [revenueItems, setRevenueItems] = useState<{ id: string; name: string; qty: string; rate: string }[]>([
    { id: '1', name: 'Laterite Stone Blocks', qty: '1200', rate: '42' },
    { id: '2', name: '20mm Crushed Aggregates (MT)', qty: '350', rate: '480' },
    { id: '3', name: 'Manufactured Sand (M-Sand MT)', qty: '500', rate: '520' }
  ]);

  const totalAggregatedRevenue = revenueItems.reduce((sum, item) => {
    const q = parseFloat(item.qty) || 0;
    const r = parseFloat(item.rate) || 0;
    return sum + (q * r);
  }, 0);

  // 3. Gross Margin & COGS State
  const [revAmount, setRevAmount] = useState<string>('1500000');
  const [cogsAmount, setCogsAmount] = useState<string>('950000');

  const rev = parseFloat(revAmount) || 0;
  const cogs = parseFloat(cogsAmount) || 0;
  const grossProfit = rev - cogs;
  const grossMarginPct = rev > 0 ? (grossProfit / rev) * 100 : 0;

  // 4. Sales Target & Run-Rate
  const [targetRevenue, setTargetRevenue] = useState<string>('2000000');
  const [achievedRevenue, setAchievedRevenue] = useState<string>('1350000');
  const [avgSellingPrice, setAvgSellingPrice] = useState<string>('500');
  const [daysRemaining, setDaysRemaining] = useState<string>('12');

  const targetRev = parseFloat(targetRevenue) || 0;
  const currentSales = parseFloat(achievedRevenue) || 0;
  const asp = parseFloat(avgSellingPrice) || 0;
  const days = parseFloat(daysRemaining) || 1;

  const gapRevenue = Math.max(0, targetRev - currentSales);
  const remainingUnitsNeeded = asp > 0 ? Math.ceil(gapRevenue / asp) : 0;
  const dailyRunRateUnits = days > 0 ? Math.ceil(remainingUnitsNeeded / days) : remainingUnitsNeeded;
  const targetProgressPct = targetRev > 0 ? (currentSales / targetRev) * 100 : 0;

  // 5. Cost Per Unit
  const [totalCostPool, setTotalCostPool] = useState<string>('140000');
  const [unitsProduced, setUnitsProduced] = useState<string>('500');

  const tcPool = parseFloat(totalCostPool) || 0;
  const prodUnits = parseFloat(unitsProduced) || 0;
  const costPerUnitCalculated = prodUnits > 0 ? tcPool / prodUnits : 0;

  // 6. Expense Ratio (OER)
  const [operatingExpenses, setOperatingExpenses] = useState<string>('975000');
  const [grossTurnover, setGrossTurnover] = useState<string>('1500000');

  const opex = parseFloat(operatingExpenses) || 0;
  const turnover = parseFloat(grossTurnover) || 0;
  const oerPct = turnover > 0 ? (opex / turnover) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit overflow-x-auto scrollbar-none">
        {[
          { id: 'breakeven', label: 'Break-Even Analysis' },
          { id: 'revenue', label: 'Multi-Product Revenue' },
          { id: 'margin', label: 'Gross Margin & COGS' },
          { id: 'target', label: 'Sales Target & Gap' },
          { id: 'unitcost', label: 'Cost Per Unit' },
          { id: 'expense', label: 'Expense Ratio (OER)' }
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

      {/* 1. BREAK-EVEN */}
      {activeSubTab === 'breakeven' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Break-Even Point (BEP)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Determine the volume needed to cover overheads with zero loss</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Fixed Operating Costs (₹ / mo)</label>
                <input
                  type="number"
                  value={fixedCosts}
                  onChange={e => setFixedCosts(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                  placeholder="250000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Selling Price Per Unit (₹)</label>
                  <input
                    type="number"
                    value={pricePerUnit}
                    onChange={e => setPricePerUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                    placeholder="850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Variable Cost Per Unit (₹)</label>
                  <input
                    type="number"
                    value={varCostPerUnit}
                    onChange={e => setVarCostPerUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                    placeholder="450"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Break-Even Threshold
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Required Sales Volume</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  {breakEvenUnits.toLocaleString()} units
                </div>
                <div className="text-xs text-slate-400">
                  Turnover to Break Even: <strong className="text-emerald-400 font-mono">₹{breakEvenRevenue.toLocaleString()}</strong>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Unit Contribution Margin:</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{contributionMargin.toFixed(2)} / unit</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Contribution Margin Ratio:</span>
                  <span className="font-mono text-white font-bold">{contributionRatio.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Break-even: ${breakEvenUnits} units (₹${breakEvenRevenue} revenue) | Margin ₹${contributionMargin}/unit`, 'bep')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'bep' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'bep' ? 'Copied' : 'Copy Break-Even Model'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MULTI-PRODUCT REVENUE */}
      {activeSubTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Multi-Item Revenue Aggregator</h3>
                <p className="text-xs text-slate-400 mt-0.5">Aggregate dispatch volume across diverse product categories</p>
              </div>
              <button
                onClick={() => setRevenueItems([
                  ...revenueItems,
                  { id: String(Date.now()), name: 'New Material Item', qty: '100', rate: '500' }
                ])}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-none">
              {revenueItems.map(item => {
                const sub = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
                return (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => {
                          const val = e.target.value;
                          setRevenueItems(prev => prev.map(i => i.id === item.id ? { ...i, name: val } : i));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={e => {
                          const val = e.target.value;
                          setRevenueItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: val } : i));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-white font-mono text-xs text-right"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        placeholder="₹ Rate"
                        value={item.rate}
                        onChange={e => {
                          const val = e.target.value;
                          setRevenueItems(prev => prev.map(i => i.id === item.id ? { ...i, rate: val } : i));
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-white font-mono text-xs text-right"
                      />
                    </div>
                    <div className="sm:col-span-2 text-right font-mono font-bold text-amber-400 text-xs">
                      ₹{sub.toLocaleString()}
                    </div>
                    <div className="sm:col-span-1 text-center">
                      <button
                        onClick={() => setRevenueItems(prev => prev.filter(i => i.id !== item.id))}
                        className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Consolidated Turnover
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Total Billed Revenue</div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  ₹{totalAggregatedRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  Across {revenueItems.length} product lines
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Consolidated Revenue: ₹${totalAggregatedRevenue} across ${revenueItems.length} items`, 'revAgg')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'revAgg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'revAgg' ? 'Copied' : 'Copy Revenue Total'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. GROSS MARGIN */}
      {activeSubTab === 'margin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Gross Margin &amp; COGS</h3>
              <p className="text-xs text-slate-400 mt-0.5">Evaluate direct product margin before general admin expenses</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Gross Revenue (₹)</label>
                <input
                  type="number"
                  value={revAmount}
                  onChange={e => setRevAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cost of Goods Sold (COGS ₹)</label>
                <input
                  type="number"
                  value={cogsAmount}
                  onChange={e => setCogsAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Gross Margin Yield
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Gross Margin</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  {grossMarginPct.toFixed(2)}%
                </div>
                <div className="text-xs text-white">
                  Gross Profit: <strong className="text-amber-400 font-mono">₹{grossProfit.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Gross Profit: ₹${grossProfit} (${grossMarginPct.toFixed(1)}% margin)`, 'gm')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'gm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'gm' ? 'Copied' : 'Copy Margin'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. SALES TARGET & RUN-RATE */}
      {activeSubTab === 'target' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Sales Target &amp; Run-Rate Gap</h3>
              <p className="text-xs text-slate-400 mt-0.5">Determine required dispatch pace to hit monthly revenue targets</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Revenue (₹)</label>
                <input
                  type="number"
                  value={targetRevenue}
                  onChange={e => setTargetRevenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Current Sales Achieved (₹)</label>
                <input
                  type="number"
                  value={achievedRevenue}
                  onChange={e => setAchievedRevenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Average Unit Price (₹)</label>
                <input
                  type="number"
                  value={avgSellingPrice}
                  onChange={e => setAvgSellingPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Days Remaining in Month</label>
                <input
                  type="number"
                  value={daysRemaining}
                  onChange={e => setDaysRemaining(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Pacing Requirements
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Daily Run-Rate Target</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  {dailyRunRateUnits.toLocaleString()} units / day
                </div>
                <div className="text-xs text-slate-400">
                  Gap: ₹{gapRevenue.toLocaleString()} ({remainingUnitsNeeded.toLocaleString()} total units remaining)
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Goal Achieved:</span>
                  <span className="font-mono text-emerald-400 font-bold">{targetProgressPct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div style={{ width: `${Math.min(100, targetProgressPct)}%` }} className="bg-emerald-400 h-full" />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Target Gap: ₹${gapRevenue} | Required Pace: ${dailyRunRateUnits} units/day for ${days} days`, 'tgt')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'tgt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'tgt' ? 'Copied' : 'Copy Target Plan'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. COST PER UNIT */}
      {activeSubTab === 'unitcost' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Cost Per Unit Allocation</h3>
              <p className="text-xs text-slate-400 mt-0.5">Allocate total manufacturing expenses across output pieces or tons</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Total Cost Pool (₹)</label>
                <input
                  type="number"
                  value={totalCostPool}
                  onChange={e => setTotalCostPool(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Total Units Produced</label>
                <input
                  type="number"
                  value={unitsProduced}
                  onChange={e => setUnitsProduced(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Unit Allocation
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Real Cost Per Unit</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  ₹{costPerUnitCalculated.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">
                  Total Run: ₹{tcPool.toLocaleString()} for {prodUnits.toLocaleString()} units
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Cost Per Unit: ₹${costPerUnitCalculated.toFixed(2)} for ${prodUnits} units`, 'cpu')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'cpu' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'cpu' ? 'Copied' : 'Copy Unit Cost'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. EXPENSE RATIO (OER) */}
      {activeSubTab === 'expense' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Operating Expense Ratio (OER)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Benchmark overall operational efficiency against gross receipts</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Total Operating Expenses (₹)</label>
                <input
                  type="number"
                  value={operatingExpenses}
                  onChange={e => setOperatingExpenses(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Gross Revenue (₹)</label>
                <input
                  type="number"
                  value={grossTurnover}
                  onChange={e => setGrossTurnover(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Operating Efficiency
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Expense Ratio (OER)</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  {oerPct.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">
                  {oerPct < 60 ? 'Optimal Efficiency' : oerPct < 80 ? 'Moderate Overhead' : 'High Cost Pressure'}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Operating Expense Ratio: ${oerPct.toFixed(1)}% (₹${opex} on ₹${turnover} revenue)`, 'oer')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'oer' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'oer' ? 'Copied' : 'Copy OER'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
