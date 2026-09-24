import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
  Truck,
  Users,
  CheckCircle2,
  FileText
} from 'lucide-react';
import {
  MARKETPLACE_KPIS,
  MARKETPLACE_LISTINGS,
  MARKETPLACE_DEALS
} from '../../data/usedMachineryMarketplaceData';

export const MachineryReportsView: React.FC = () => {
  const [reportType, setReportType] = useState<'listings' | 'deals' | 'inspections' | 'logistics'>('listings');
  const [dateFilter, setDateFilter] = useState('SEPTEMBER_2026');

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ListingCode,Title,Category,Brand,Year,AskingPrice,Location,InspectionStatus\n' +
      MARKETPLACE_LISTINGS.map(
        (l) =>
          `"${l.listingCode}","${l.title}","${l.category}","${l.brand}",${l.year},${l.askingPriceRs},"${l.locationCity}","${l.inspectionStatus}"`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RZ_Marketplace_Report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Marketplace Intelligence & Audit Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational summaries of asset turnaround times, surveyor inspections, escrow deals, and fleet transport
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'listings', label: 'Equipment Inventory Reports' },
          { id: 'deals', label: 'Escrow Deals & Settlements' },
          { id: 'inspections', label: 'Surveyor Technical Audits' },
          { id: 'logistics', label: 'Heavy Fleet Transport Logs' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer border ${
              reportType === tab.id
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 font-medium">Report Period Inventory</div>
          <div className="text-2xl font-black text-white font-mono mt-1">68 Units</div>
          <div className="text-[11px] text-amber-400 mt-1">₹18.74 Cr Portfolio Value</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 font-medium">Average Days on Market</div>
          <div className="text-2xl font-black text-white font-mono mt-1">18 Days</div>
          <div className="text-[11px] text-slate-400 mt-1">From listing to offer</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 font-medium">Deals Settled (Month)</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">9 Deals</div>
          <div className="text-[11px] text-emerald-400 mt-1">₹2.65 Cr Gross Escrow</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 font-medium">Inspection Pass Rate</div>
          <div className="text-2xl font-black text-white font-mono mt-1">94%</div>
          <div className="text-[11px] text-slate-400 mt-1">48-point diagnostic audits</div>
        </div>
      </div>

      {/* Main Table Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h2 className="text-base font-black text-white">
          {reportType === 'listings'
            ? 'Active Equipment Inventory Ledger'
            : reportType === 'deals'
            ? 'Escrow Deal Settlement Ledger'
            : reportType === 'inspections'
            ? 'Certified Surveyor Audit Logs'
            : 'Heavy Transport Logistics Manifest'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                <th className="p-3 font-semibold">Ref Code</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Valuation / Asking</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Audit State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MARKETPLACE_LISTINGS.map((l) => (
                <tr key={l.id} className="hover:bg-slate-950/40 transition">
                  <td className="p-3 font-mono font-bold text-amber-400">{l.listingCode}</td>
                  <td className="p-3 font-bold text-white">{l.title}</td>
                  <td className="p-3 text-slate-300">{l.category}</td>
                  <td className="p-3 font-mono text-white">₹{(l.askingPriceRs / 100000).toFixed(2)} Lakh</td>
                  <td className="p-3 text-slate-300">{l.locationCity}, {l.locationDistrict}</td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-semibold">{l.inspectionStatus}</span>
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
