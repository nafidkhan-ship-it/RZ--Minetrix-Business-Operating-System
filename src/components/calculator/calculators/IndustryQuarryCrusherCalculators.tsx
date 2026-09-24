import React, { useState } from 'react';
import { Pickaxe, Layers, Copy, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  initialSubTab?: 'quarry-load' | 'landowner' | 'quarry-profit' | 'crusher-cost' | 'crusher-margin';
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

export const IndustryQuarryCrusherCalculators: React.FC<Props> = ({
  initialSubTab = 'quarry-load',
  onRecordHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quarry-load' | 'landowner' | 'quarry-profit' | 'crusher-cost' | 'crusher-margin'>(initialSubTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Quarry Load Calculator
  const [loadCount, setLoadCount] = useState<string>('50');
  const [pricePerLoad, setPricePerLoad] = useState<string>('8500');
  const [haulagePerLoad, setHaulagePerLoad] = useState<string>('2400');
  const [loadingCostPerLoad, setLoadingCostPerLoad] = useState<string>('600');
  const [landownerRoyaltyPerLoad, setLandownerRoyaltyPerLoad] = useState<string>('1200');

  const loads = parseFloat(loadCount) || 0;
  const loadPrice = parseFloat(pricePerLoad) || 0;
  const haulage = parseFloat(haulagePerLoad) || 0;
  const loading = parseFloat(loadingCostPerLoad) || 0;
  const royalty = parseFloat(landownerRoyaltyPerLoad) || 0;

  const totalLoadRevenue = loads * loadPrice;
  const directCostPerLoad = haulage + loading + royalty;
  const totalDirectCosts = loads * directCostPerLoad;
  const netQuarryContribution = totalLoadRevenue - totalDirectCosts;
  const quarryContributionMarginPct = totalLoadRevenue > 0 ? (netQuarryContribution / totalLoadRevenue) * 100 : 0;

  // 2. Landowner Royalty State
  const [loLoads, setLoLoads] = useState<string>('120');
  const [loRate, setLoRate] = useState<string>('1200');
  const [loAdvancePaid, setLoAdvancePaid] = useState<string>('50000');

  const loLoadCount = parseFloat(loLoads) || 0;
  const loRoyaltyRate = parseFloat(loRate) || 0;
  const advance = parseFloat(loAdvancePaid) || 0;
  const totalLandownerRoyalty = loLoadCount * loRoyaltyRate;
  const netPayableAfterAdvance = Math.max(0, totalLandownerRoyalty - advance);

  // 3. Quarry Block Extraction State
  const [qBlocks, setQBlocks] = useState<string>('500');
  const [qExplosivesWire, setQExplosivesWire] = useState<string>('35000');
  const [qFuelLabour, setQFuelLabour] = useState<string>('85000');
  const [qGovtRoyalty, setQGovtRoyalty] = useState<string>('20000');
  const [qSellingPriceBlock, setQSellingPriceBlock] = useState<string>('340');

  const numBlocks = parseFloat(qBlocks) || 0;
  const expWire = parseFloat(qExplosivesWire) || 0;
  const fuelLab = parseFloat(qFuelLabour) || 0;
  const govtRoy = parseFloat(qGovtRoyalty) || 0;
  const blockSellRate = parseFloat(qSellingPriceBlock) || 0;

  const totalPitCost = expWire + fuelLab + govtRoy;
  const costPerBlock = numBlocks > 0 ? totalPitCost / numBlocks : 0;
  const profitPerBlock = blockSellRate - costPerBlock;
  const totalRunRevenue = numBlocks * blockSellRate;
  const totalRunProfit = totalRunRevenue - totalPitCost;
  const runMarginPct = totalRunRevenue > 0 ? (totalRunProfit / totalRunRevenue) * 100 : 0;

  // 4. Crusher Cost Per Ton
  const [rawStoneCostTon, setRawStoneCostTon] = useState<string>('160');
  const [crusherPowerCostTon, setCrusherPowerCostTon] = useState<string>('45');
  const [crusherWearPartsTon, setCrusherWearPartsTon] = useState<string>('35');
  const [crusherLaborTon, setCrusherLaborTon] = useState<string>('30');
  const [crusherDepreciationTon, setCrusherDepreciationTon] = useState<string>('20');
  const [outputTons, setOutputTons] = useState<string>('400');

  const rawCost = parseFloat(rawStoneCostTon) || 0;
  const powerCost = parseFloat(crusherPowerCostTon) || 0;
  const wearCost = parseFloat(crusherWearPartsTon) || 0;
  const laborCost = parseFloat(crusherLaborTon) || 0;
  const depCost = parseFloat(crusherDepreciationTon) || 0;
  const totalOutputTons = parseFloat(outputTons) || 0;

  const compositeCostPerTon = rawCost + powerCost + wearCost + laborCost + depCost;
  const totalCrusherBatchCost = compositeCostPerTon * totalOutputTons;

  // 5. Crusher Operating Margin
  const [crusherSellPriceTon, setCrusherSellPriceTon] = useState<string>('480');
  const [crusherCostInputTon, setCrusherCostInputTon] = useState<string>('310');
  const [crusherMonthlyTons, setCrusherMonthlyTons] = useState<string>('5000');

  const cSell = parseFloat(crusherSellPriceTon) || 0;
  const cCost = parseFloat(crusherCostInputTon) || 0;
  const cTons = parseFloat(crusherMonthlyTons) || 0;

  const crusherMarginPerTon = cSell - cCost;
  const crusherMonthlyProfit = crusherMarginPerTon * cTons;
  const crusherMonthlyRevenue = cSell * cTons;
  const crusherMarginPct = crusherMonthlyRevenue > 0 ? (crusherMonthlyProfit / crusherMonthlyRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit overflow-x-auto scrollbar-none">
        {[
          { id: 'quarry-load', label: 'Quarry Load Revenue' },
          { id: 'landowner', label: 'Land Owner Royalty' },
          { id: 'quarry-profit', label: 'Block Extraction Profit' },
          { id: 'crusher-cost', label: 'Crusher Cost / Ton' },
          { id: 'crusher-margin', label: 'Crusher Margin' }
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

      {/* 1. QUARRY LOAD REVENUE */}
      {activeSubTab === 'quarry-load' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Quarry Dispatch &amp; Load Economics</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tipper load gross revenue, direct handling &amp; net contribution</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Number of Loads Dispatched</label>
                <input
                  type="number"
                  value={loadCount}
                  onChange={e => setLoadCount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Price Billed Per Load (₹)</label>
                <input
                  type="number"
                  value={pricePerLoad}
                  onChange={e => setPricePerLoad(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Haulage / Freight Per Load (₹)</label>
                <input
                  type="number"
                  value={haulagePerLoad}
                  onChange={e => setHaulagePerLoad(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Excavator Loading Per Load (₹)</label>
                <input
                  type="number"
                  value={loadingCostPerLoad}
                  onChange={e => setLoadingCostPerLoad(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Landowner Royalty Per Load (₹)</label>
                <input
                  type="number"
                  value={landownerRoyaltyPerLoad}
                  onChange={e => setLandownerRoyaltyPerLoad(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Net Quarry Contribution
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Net Pit Profit</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  ₹{netQuarryContribution.toLocaleString()}
                </div>
                <div className="text-xs text-amber-400 font-semibold">
                  {quarryContributionMarginPct.toFixed(1)}% Contribution Margin
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Gate Turnover:</span>
                  <span className="font-mono text-white font-bold">₹{totalLoadRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Direct Costs:</span>
                  <span className="font-mono text-rose-400 font-bold">− ₹{totalDirectCosts.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-white">
                  <span>Net Profit Per Load:</span>
                  <span className="font-mono text-emerald-400">
                    ₹{loads > 0 ? (netQuarryContribution / loads).toFixed(0) : 0} / load
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Quarry: ${loads} loads @ ₹${loadPrice} | Net Contribution: ₹${netQuarryContribution} (${quarryContributionMarginPct.toFixed(1)}%)`, 'qload')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'qload' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'qload' ? 'Copied' : 'Copy Load Summary'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. LAND OWNER ROYALTY */}
      {activeSubTab === 'landowner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Land Owner Royalty Settlement</h3>
              <p className="text-xs text-slate-400 mt-0.5">Calculate contractual royalty on mined tipper dispatches</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mined Loads Count</label>
                <input
                  type="number"
                  value={loLoads}
                  onChange={e => setLoLoads(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Royalty Rate / Load (₹)</label>
                <input
                  type="number"
                  value={loRate}
                  onChange={e => setLoRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Advance Already Paid (₹)</label>
                <input
                  type="number"
                  value={loAdvancePaid}
                  onChange={e => setLoAdvancePaid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Settlement Statement
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Total Royalty Accrued</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  ₹{totalLandownerRoyalty.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">
                  {loLoadCount} Loads × ₹{loRoyaltyRate}/load
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Advance Deducted:</span>
                  <span className="font-mono text-slate-300 font-bold">− ₹{advance.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-white">
                  <span>Balance Payable to Landowner:</span>
                  <span className="font-mono text-emerald-400">₹{netPayableAfterAdvance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Landowner Royalty: ${loLoadCount} loads × ₹${loRate} = ₹${totalLandownerRoyalty} (Balance: ₹${netPayableAfterAdvance})`, 'lor')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'lor' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'lor' ? 'Copied' : 'Copy Royalty Settlement'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. QUARRY BLOCK EXTRACTION PROFIT */}
      {activeSubTab === 'quarry-profit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Block Extraction Cost &amp; Margin</h3>
              <p className="text-xs text-slate-400 mt-0.5">Laterite block sawing, excavator fuel, wire consumables &amp; cess</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Blocks Cut / Produced</label>
                <input
                  type="number"
                  value={qBlocks}
                  onChange={e => setQBlocks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Sawing Wire / Blades / Explosives (₹)</label>
                <input
                  type="number"
                  value={qExplosivesWire}
                  onChange={e => setQExplosivesWire(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Excavator Diesel &amp; Operator Labor (₹)</label>
                <input
                  type="number"
                  value={qFuelLabour}
                  onChange={e => setQFuelLabour(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Government Cess &amp; Royalty (₹)</label>
                <input
                  type="number"
                  value={qGovtRoyalty}
                  onChange={e => setQGovtRoyalty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Wholesale Selling Price Per Block (₹)</label>
                <input
                  type="number"
                  value={qSellingPriceBlock}
                  onChange={e => setQSellingPriceBlock(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs font-bold text-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Extraction Profitability
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Total Run Profit</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  ₹{totalRunProfit.toLocaleString()}
                </div>
                <div className="text-xs text-slate-300">
                  Margin: {runMarginPct.toFixed(1)}% &bull; Net Profit: ₹{profitPerBlock.toFixed(1)} / block
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Unit Production Cost:</span>
                  <span className="font-mono text-amber-400 font-bold">₹{costPerBlock.toFixed(2)} / block</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Extraction Run Cost:</span>
                  <span className="font-mono text-slate-300 font-bold">₹{totalPitCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Block Cost: ₹${costPerBlock.toFixed(1)} | Profit: ₹${profitPerBlock.toFixed(1)}/block | Run: ₹${totalRunProfit}`, 'qprof')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'qprof' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'qprof' ? 'Copied' : 'Copy Block Extraction Report'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. CRUSHER PRODUCTION COST PER TON */}
      {activeSubTab === 'crusher-cost' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Crusher Composite Cost Per Ton</h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregates, M-sand, gravel and road metal crushing expenses</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Raw Boulders Delivered (₹/MT)</label>
                <input
                  type="number"
                  value={rawStoneCostTon}
                  onChange={e => setRawStoneCostTon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Electricity / Diesel Power (₹/MT)</label>
                <input
                  type="number"
                  value={crusherPowerCostTon}
                  onChange={e => setCrusherPowerCostTon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Jaw / Cone Liner Wear (₹/MT)</label>
                <input
                  type="number"
                  value={crusherWearPartsTon}
                  onChange={e => setCrusherWearPartsTon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Plant Labor &amp; Supervision (₹/MT)</label>
                <input
                  type="number"
                  value={crusherLaborTon}
                  onChange={e => setCrusherLaborTon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Depreciation &amp; Maintenance (₹/MT)</label>
                <input
                  type="number"
                  value={crusherDepreciationTon}
                  onChange={e => setCrusherDepreciationTon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Production Batch (Metric Tons)</label>
                <input
                  type="number"
                  value={outputTons}
                  onChange={e => setOutputTons(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Production Unit Cost
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Total Crushing Cost</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  ₹{compositeCostPerTon} / MT
                </div>
                <div className="text-xs text-slate-500">
                  Batch Outflow: ₹{totalCrusherBatchCost.toLocaleString()} for {totalOutputTons} MT
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Crusher Cost: ₹${compositeCostPerTon}/MT | Batch (${totalOutputTons} MT): ₹${totalCrusherBatchCost}`, 'ccost')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'ccost' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ccost' ? 'Copied' : 'Copy Crusher Cost'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. CRUSHER OPERATING MARGIN */}
      {activeSubTab === 'crusher-margin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Crushing Plant Gross Margin</h3>
              <p className="text-xs text-slate-400 mt-0.5">Wholesale gate rates vs production cost per metric ton</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Selling Rate (₹/MT)</label>
                <input
                  type="number"
                  value={crusherSellPriceTon}
                  onChange={e => setCrusherSellPriceTon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Total Cost (₹/MT)</label>
                <input
                  type="number"
                  value={crusherCostInputTon}
                  onChange={e => setCrusherCostInputTon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Monthly Tons Sold</label>
                <input
                  type="number"
                  value={crusherMonthlyTons}
                  onChange={e => setCrusherMonthlyTons(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Plant Margin Output
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Monthly Crushing Profit</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  ₹{crusherMonthlyProfit.toLocaleString()}
                </div>
                <div className="text-xs text-amber-400 font-semibold">
                  {crusherMarginPct.toFixed(1)}% Gross Margin &bull; +₹{crusherMarginPerTon}/MT
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Crusher Margin: ₹${crusherMarginPerTon}/MT (${crusherMarginPct.toFixed(1)}%) | Monthly Profit: ₹${crusherMonthlyProfit}`, 'cmarg')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'cmarg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'cmarg' ? 'Copied' : 'Copy Crusher Margin'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
