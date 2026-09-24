import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Printer,
  Calendar,
  Truck,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Vehicle } from '../../data/vehicleStudioData';

interface VehicleReportsViewProps {
  vehicles: Vehicle[];
}

export const VehicleReportsView: React.FC<VehicleReportsViewProps> = ({ vehicles }) => {
  const [selectedCategory, setSelectedCategory] = useState<'Operational' | 'Financial' | 'Compliance' | 'Management'>('Operational');
  const [selectedReport, setSelectedReport] = useState<string>('trip-summary');

  const REPORT_DEFINITIONS = [
    // Operational
    { id: 'trip-summary', category: 'Operational', name: 'Trip Summary & Freight Tonnage Report', desc: 'Consolidated breakdown of 48 haulage trips, gross weights & routes.' },
    { id: 'load-delivery', category: 'Operational', name: 'Quarry/Crusher Load & Gate Pass Audit', desc: 'Origin to destination traceability logs with weighbridge net tonnage.' },
    { id: 'vehicle-utilization', category: 'Operational', name: 'Fleet Asset Utilization & Idle Time', desc: 'Operating hours, trips per day, turnaround times and active vs depot days.' },
    { id: 'driver-perf', category: 'Operational', name: 'Driver Safety & Mileage Scorecard', desc: 'Driver safety ratings, batta payouts, fuel economy and trip execution records.' },
    { id: 'fuel-mileage', category: 'Operational', name: 'Fuel Consumption & Kilometric Telemetry', desc: 'Km/L efficiency, fuel station invoices and cost-per-km trends.' },

    // Financial
    { id: 'vehicle-pnl', category: 'Financial', name: 'Vehicle-wise Profit & Loss Statements', desc: 'Freight revenue minus direct operating costs and statutory depreciation.' },
    { id: 'vadaka-contrib', category: 'Financial', name: 'Trip Vadaka / Contribution Ledger', desc: 'Trip earnings minus diesel, toll, batta and loading charges.' },
    { id: 'toll-expense', category: 'Financial', name: 'Fastag & Cash Toll Route Analysis', desc: 'Automated NHAI deductions grouped by corridor and plaza.' },
    { id: 'owner-settlement', category: 'Financial', name: 'Owner Syndicate Profit Distribution', desc: 'Settlement statements applying independent equity, revenue and profit ratios.' },
    { id: 'maintenance-cost', category: 'Financial', name: 'Workshop Maintenance & Spares Ledger', desc: 'Periodic servicing, lubricants, suspension and mechanical repair costs.' },

    // Compliance
    { id: 'expiry-calendar', category: 'Compliance', name: 'Statutory 30-Day Expiry Master Calendar', desc: 'Countdowns for Insurance, Road Tax, National Permits, Fitness & PUCC.' },
    { id: 'insurance-audit', category: 'Compliance', name: 'Commercial Vehicle Insurance Schedule', desc: 'Policy numbers, coverage types, renewal dates and premium expenditures.' },
    { id: 'rto-fc', category: 'Compliance', name: 'RTO Fitness & Inspection Records', desc: 'Authorized testing center inspection reports and valid certificate validity.' },

    // Management
    { id: 'fleet-overview', category: 'Management', name: 'Executive Fleet Performance & ROI', desc: 'Capital recovery, asset payback horizons and debt-to-equity leverage.' },
    { id: 'cost-per-km', category: 'Management', name: 'Comprehensive Cost per Kilometre Audit', desc: 'All-inclusive operational cost per km across haulage corridors.' },
    { id: 'syndicate-summary', category: 'Management', name: 'Multi-Owner Syndicate Capital Distribution', desc: 'Unified view across Person B, Person E and syndicate partners.' }
  ];

  const currentReports = REPORT_DEFINITIONS.filter((r) => r.category === selectedCategory);
  const activeReportObj = REPORT_DEFINITIONS.find((r) => r.id === selectedReport) || REPORT_DEFINITIONS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              REPORTING & AUDIT ENGINE &bull; 16 STANDARD AUDIT PACKS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Commercial Fleet Intelligence & Statutory Audit Reports</h2>
          <p className="text-xs text-slate-400">
            Export ready PDF, CSV and print statements for tax audits, syndicate partners and RTO compliance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Simulated Print Preview for: ${activeReportObj.name}`)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => alert(`Simulated PDF Export for: ${activeReportObj.name}`)}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {(['Operational', 'Financial', 'Compliance', 'Management'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              const firstInCat = REPORT_DEFINITIONS.find((r) => r.category === cat);
              if (firstInCat) setSelectedReport(firstInCat.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat} Reports
          </button>
        ))}
      </div>

      {/* Split View: Report Selector on Left, Interactive Simulation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Reports list in active category */}
        <div className="lg:col-span-5 space-y-2">
          {currentReports.map((report) => {
            const isSelected = selectedReport === report.id;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 text-xs ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-sm">{report.name}</div>
                <p className="text-[11px] text-slate-400">{report.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Live Simulated Statement Preview */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-blue-400 uppercase font-mono font-bold">
                {activeReportObj.category} Audit Module
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeReportObj.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Live Data Connected
              </span>
            </div>
          </div>

          {/* Statement Paper Simulation */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px]">
              <div>
                <div className="text-white font-bold">RZ MINETRIX &bull; FLEET AUDIT STATEMENT</div>
                <div className="text-slate-500">Period: Current Month &bull; Generated for Studio Preview</div>
              </div>
              <div className="text-right text-slate-400">
                Date: {new Date().toISOString().split('T')[0]}
              </div>
            </div>

            {/* Dynamic preview rows based on active report */}
            <div className="space-y-2 text-[11px]">
              <div className="text-slate-300 font-sans font-medium">
                {activeReportObj.desc}
              </div>

              <div className="p-3 bg-slate-900 rounded-xl space-y-1.5 border border-slate-800/80">
                <div className="flex justify-between text-slate-400">
                  <span>Total Monitored Commercial Vehicles:</span>
                  <span className="text-white font-bold">{vehicles.length} Units</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Aggregated Freight Revenue:</span>
                  <span className="text-emerald-400 font-bold">₹28,64,000</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Direct Operating Expenses:</span>
                  <span className="text-rose-400 font-bold">₹15,22,000</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 text-white font-bold">
                  <span>Consolidated Net Fleet Contribution:</span>
                  <span className="text-emerald-400 text-sm">₹13,42,000</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span>Audited by: RZ Automated Operations System</span>
              <span className="text-emerald-400 font-bold">Status: Ready for Tax & Partner Export</span>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => alert(`Simulated CSV export generated for ${activeReportObj.name}`)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 cursor-pointer"
            >
              Download CSV Spreadsheet
            </button>
            <button
              onClick={() => alert(`Simulated Official Sealed PDF downloaded for ${activeReportObj.name}`)}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition shadow-md cursor-pointer"
            >
              Download Sealed PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
