import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Building2,
  FileText,
  Layers,
  Activity,
  DollarSign,
  Truck,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CrusherPlant } from '../../data/crusherStudioData';

interface CrusherReportsViewProps {
  plants: CrusherPlant[];
  onNavigatePage: (page: string) => void;
}

export const CrusherReportsView: React.FC<CrusherReportsViewProps> = ({
  plants,
  onNavigatePage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPlant, setSelectedPlant] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState('CURRENT_MONTH');

  const REPORTS = [
    {
      id: 'REP-01',
      title: 'Daily Production Report',
      category: 'OPERATIONS',
      description: 'Hourly crusher throughput, multi-deck sizing percentages and machine operational hours.',
      format: 'PDF & Excel',
      lastRun: 'Today, 06:00 AM'
    },
    {
      id: 'REP-02',
      title: 'Monthly Production Summary',
      category: 'OPERATIONS',
      description: 'Aggregated monthly production totals per plant, graded sizes, and downtime breakdown.',
      format: 'PDF & Excel',
      lastRun: 'Yesterday'
    },
    {
      id: 'REP-03',
      title: 'Product-wise Yield Recovery Report',
      category: 'OPERATIONS',
      description: 'Input boulder mass balance vs output fractions (M-Sand, 10mm, 20mm, 40mm) and waste ratio.',
      format: 'PDF',
      lastRun: 'Today, 08:30 AM'
    },
    {
      id: 'REP-04',
      title: 'Raw Material Inward Register',
      category: 'SUPPLY',
      description: 'All inbound boulder haulage with pit source, bench reference, vehicle number and weighbridge net.',
      format: 'PDF & Excel',
      lastRun: 'Today, 10:15 AM'
    },
    {
      id: 'REP-05',
      title: 'Quarry vs Crusher Reconciliation',
      category: 'SUPPLY',
      description: 'Cross-audits Quarry pit dispatch tonnes vs Crusher inward weighbridge gross/tare records.',
      format: 'Excel Audit Sheet',
      lastRun: '2 days ago'
    },
    {
      id: 'REP-06',
      title: 'Silo Stock Movement Report',
      category: 'INVENTORY',
      description: 'Opening balance, daily crushing additions, customer tipper dispatches and closing silo levels.',
      format: 'PDF & Excel',
      lastRun: 'Today, 07:00 AM'
    },
    {
      id: 'REP-07',
      title: 'Dispatch Register (Outward Tippers)',
      category: 'COMMERCIAL',
      description: 'Chronological outward tipper dispatch ledger with customer, tare/gross and gate pass links.',
      format: 'PDF & Excel',
      lastRun: 'Today, 11:00 AM'
    },
    {
      id: 'REP-08',
      title: 'Customer Sales & Credit Ledger',
      category: 'COMMERCIAL',
      description: 'Customer-wise sales invoices, billing rates, GST components, and outstanding credit aging.',
      format: 'PDF & Excel',
      lastRun: 'Yesterday'
    },
    {
      id: 'REP-09',
      title: 'Vehicle-wise Trip & Tonnage Report',
      category: 'LOGISTICS',
      description: 'Individual tipper vehicle turnaround time, total payload carried and driver trip sheets.',
      format: 'Excel',
      lastRun: '3 days ago'
    },
    {
      id: 'REP-10',
      title: 'Gate Pass Register',
      category: 'LOGISTICS',
      description: 'Digital security gate passes issued with mining clearance verification stamps.',
      format: 'PDF',
      lastRun: 'Today, 11:30 AM'
    },
    {
      id: 'REP-11',
      title: 'Crusher Operating Expense Statement',
      category: 'FINANCE',
      description: 'Comprehensive opex vouchers, electricity, diesel, operator wages and wear parts.',
      format: 'PDF & Excel',
      lastRun: 'Yesterday'
    },
    {
      id: 'REP-12',
      title: 'Electricity & Diesel Efficiency Report',
      category: 'OPERATIONS',
      description: 'Specific energy consumption (kWh per ton) and fuel consumption (liters per ton) indices.',
      format: 'PDF',
      lastRun: 'Today, 09:00 AM'
    },
    {
      id: 'REP-13',
      title: 'Partner Investment & Capital Report',
      category: 'FINANCE',
      description: 'Independent partner capital ledger, equity additions, and cumulative dividend accounts.',
      format: 'PDF',
      lastRun: 'Monthly Close'
    },
    {
      id: 'REP-14',
      title: 'Profit Settlement Statement',
      category: 'FINANCE',
      description: 'Waterfall net profit calculations, reserve retention, and dividend vouchers.',
      format: 'PDF Printable',
      lastRun: 'Monthly Close'
    },
    {
      id: 'REP-15',
      title: 'Wastage & By-product Recovery Audit',
      category: 'OPERATIONS',
      description: 'Conveyor spillage, washed sand slurry, GSB road base recycling and cost implications.',
      format: 'PDF',
      lastRun: 'Weekly'
    }
  ];

  const filtered = REPORTS.filter(r => {
    const matchCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                EXECUTIVE ANALYTICS & STATUTORY AUDIT EXPORTS
              </span>
              <h2 className="text-xl font-black text-white">Crusher Reports Center</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Simulating Batch Export of All Crusher Reports in ZIP bundle...')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export All (ZIP)</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Functional Domain</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Report Categories (15 Reports)</option>
              <option value="OPERATIONS">Operations & Production</option>
              <option value="SUPPLY">Quarry Inward Supply</option>
              <option value="INVENTORY">Silo Inventory</option>
              <option value="COMMERCIAL">Commercial & Sales</option>
              <option value="LOGISTICS">Logistics & Gate Passes</option>
              <option value="FINANCE">Finance & Partner Settlements</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Facility Filter</label>
            <select
              value={selectedPlant}
              onChange={e => setSelectedPlant(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Consolidated All Plants</option>
              {plants.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Audit Horizon</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="TODAY">Today (Real-time Shift)</option>
              <option value="CURRENT_WEEK">Current Week</option>
              <option value="CURRENT_MONTH">Current Month (MTD)</option>
              <option value="LAST_MONTH">Previous Month</option>
              <option value="FY_2025_26">Financial Year 2025-26</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(rep => (
          <div
            key={rep.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition group space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] font-bold text-cyan-400">{rep.id}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-mono font-bold">
                  {rep.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>FORMAT: {rep.format}</span>
                <span>SYNC: {rep.lastRun}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Generating and previewing ${rep.title}...`)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => alert(`Downloading Excel / PDF data sheet for ${rep.title}...`)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
