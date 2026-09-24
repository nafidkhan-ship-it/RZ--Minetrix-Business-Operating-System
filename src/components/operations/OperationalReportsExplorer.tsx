import React, { useState } from 'react';
import {
  FileText,
  BarChart3,
  Calendar,
  Download,
  Printer,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Truck,
  Users,
  Building2,
  Pickaxe,
  Check,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight
} from 'lucide-react';
import { OperationalPlatform } from './OperationalAttendanceModule';

interface OperationalReportsExplorerProps {
  platform: OperationalPlatform;
  onCreateOttTask?: (taskTitle: string) => void;
}

export const OperationalReportsExplorer: React.FC<OperationalReportsExplorerProps> = ({
  platform,
  onCreateOttTask
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('r1');
  const [dateRange, setDateRange] = useState<string>('THIS_MONTH');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getReportList = () => {
    if (platform === 'QUARRY') {
      return [
        { id: 'r1', code: 'REP-Q-01', title: 'Daily Production Report', metric: '3,200 Cut Stones Today', category: 'Operational' },
        { id: 'r2', code: 'REP-Q-02', title: 'Production by Quarry Pit', metric: '4 Pits Audited', category: 'Operational' },
        { id: 'r3', code: 'REP-Q-03', title: 'Quarry Pit Stock Report', metric: '27,600 Blocks Available', category: 'Inventory' },
        { id: 'r4', code: 'REP-Q-04', title: 'Quarry Customer Orders Report', metric: '8,700 Blocks Committed', category: 'Commercial' },
        { id: 'r5', code: 'REP-Q-05', title: 'Dispatch & Gate Pass Log', metric: '34 Loads Today', category: 'Logistics' },
        { id: 'r6', code: 'REP-Q-06', title: 'Sales & Invoicing Report', metric: '₹42.8 L Billed', category: 'Financial' },
        { id: 'r7', code: 'REP-Q-07', title: 'Purchase & Fuel Log', metric: '₹8.4 L Purchases', category: 'Financial' },
        { id: 'r8', code: 'REP-Q-08', title: 'Workforce Attendance Report', metric: '94% Presence', category: 'HRMS' },
        { id: 'r9', code: 'REP-Q-09', title: 'Quarry Pay-In Collections', metric: '₹28.5 L Collected', category: 'Financial' },
        { id: 'r10', code: 'REP-Q-10', title: 'Quarry Pay-Out Disbursements', metric: '₹14.2 L Disbursed', category: 'Financial' },
        { id: 'r11', code: 'REP-Q-11', title: 'Operating Expenses Breakdown', metric: '₹6.8 L Overheads', category: 'Financial' },
        { id: 'r12', code: 'REP-Q-12', title: 'Customer Ledger Statement', metric: '18 Active Accounts', category: 'Commercial' },
        { id: 'r13', code: 'REP-Q-13', title: 'Supplier & Vendor Ledger', metric: '9 Active Vendors', category: 'Commercial' },
        { id: 'r14', code: 'REP-Q-14', title: 'Cash in Hand Register', metric: '₹1,24,000 Petty Bal', category: 'Financial' },
        { id: 'r15', code: 'REP-Q-15', title: 'Bank Reconciliation Report', metric: 'HDFC Escrow Synced', category: 'Financial' },
        { id: 'r16', code: 'REP-Q-16', title: 'Net Quarry Profitability', metric: '37.1% Operating Margin', category: 'Management' },
        { id: 'r17', code: 'REP-Q-17', title: 'Vehicle & Tipper Usage Report', metric: '12 Trips Recorded', category: 'Logistics' },
        { id: 'r18', code: 'REP-Q-18', title: 'Bench Workforce Efficiency', metric: '42 Blocks/Man-day', category: 'HRMS' },
        { id: 'r19', code: 'REP-Q-19', title: 'Equipment & Cutter Uptime', metric: '98.2% Availability', category: 'Machinery' },
        { id: 'r20', code: 'REP-Q-20', title: 'Monthly Executive Summary', metric: 'Comprehensive Audit', category: 'Executive' }
      ];
    } else if (platform === 'CRUSHER') {
      return [
        { id: 'r1', code: 'REP-C-01', title: 'Crusher Production Summary', metric: '1,450 MT Today', category: 'Operational' },
        { id: 'r2', code: 'REP-C-02', title: 'Raw Feed to Aggregate Conversion', metric: '88.4% Recovery Ratio', category: 'Operational' },
        { id: 'r3', code: 'REP-C-03', title: 'Graded Stock Report (M-Sand/P-Sand/20mm)', metric: '14,200 MT Yard Stock', category: 'Inventory' },
        { id: 'r4', code: 'REP-C-04', title: 'Crusher Customer Orders', metric: '18 Active Requisitions', category: 'Commercial' },
        { id: 'r5', code: 'REP-C-05', title: 'Weighbridge Dispatch Log', metric: '62 Trucks Cleared', category: 'Logistics' },
        { id: 'r6', code: 'REP-C-06', title: 'Crusher Sales & GST Invoicing', metric: '₹68.4 L Billed', category: 'Financial' },
        { id: 'r7', code: 'REP-C-07', title: 'Boulder Purchase & Quarry Feed', metric: '₹22.1 L Purchased', category: 'Financial' },
        { id: 'r8', code: 'REP-C-08', title: 'Plant Staff Attendance', metric: '96% Presence', category: 'HRMS' },
        { id: 'r9', code: 'REP-C-09', title: 'Fuel & Diesel Consumption', metric: '380 L/day Average', category: 'Energy' },
        { id: 'r10', code: 'REP-C-10', title: 'HT Power & Electricity Audit', metric: '250 kVA Max Demand', category: 'Energy' },
        { id: 'r11', code: 'REP-C-11', title: 'Preventive Maintenance & Spares', metric: 'Jaw/VSI Rotor Life', category: 'Machinery' },
        { id: 'r12', code: 'REP-C-12', title: 'Crusher Expenses & Consumables', metric: '₹8.9 L Overhead', category: 'Financial' },
        { id: 'r13', code: 'REP-C-13', title: 'Crusher Pay-In Receipts', metric: '₹54.2 L Collected', category: 'Financial' },
        { id: 'r14', code: 'REP-C-14', title: 'Crusher Pay-Out Disbursements', metric: '₹31.5 L Paid', category: 'Financial' },
        { id: 'r15', code: 'REP-C-15', title: 'Customer Ledger Statement', metric: '24 Client Accounts', category: 'Commercial' },
        { id: 'r16', code: 'REP-C-16', title: 'Supplier & Quarry Ledger', metric: '11 Quarry Feed Sources', category: 'Commercial' },
        { id: 'r17', code: 'REP-C-17', title: 'Plant Profitability & Unit Cost', metric: '₹210 / MT Net Margin', category: 'Management' },
        { id: 'r18', code: 'REP-C-18', title: 'Monthly Executive Review', metric: 'Full Compliance Audit', category: 'Executive' }
      ];
    } else {
      // VEHICLE
      return [
        { id: 'r1', code: 'REP-V-01', title: 'Transport Order Performance', metric: '98% On-Time Delivery', category: 'Operations' },
        { id: 'r2', code: 'REP-V-02', title: 'Fleet Utilization & Deadhead km', metric: '82% Loaded Ratio', category: 'Operations' },
        { id: 'r3', code: 'REP-V-03', title: 'Trip Master & Toll Logs', metric: '142 Trips Logged', category: 'Trips' },
        { id: 'r4', code: 'REP-V-04', title: 'Fuel Mileage & Sensor Telematics', metric: '3.8 km/L Average', category: 'Fuel' },
        { id: 'r5', code: 'REP-V-05', title: 'Vehicle Maintenance & Wear', metric: '4 Trucks Serviced', category: 'Maintenance' },
        { id: 'r6', code: 'REP-V-06', title: 'Driver Attendance & Performance', metric: '16 Active Drivers', category: 'HRMS' },
        { id: 'r7', code: 'REP-V-07', title: 'Fleet Revenue & Freight Billed', metric: '₹18.4 L Billed', category: 'Financial' },
        { id: 'r8', code: 'REP-V-08', title: 'Spares & Tyre Purchases', metric: '₹3.4 L Expensed', category: 'Financial' },
        { id: 'r9', code: 'REP-V-09', title: 'Vehicle Pay-In Receipts', metric: '₹14.8 L Collected', category: 'Financial' },
        { id: 'r10', code: 'REP-V-10', title: 'Vehicle Pay-Out Disbursements', metric: '₹9.6 L Paid Out', category: 'Financial' },
        { id: 'r11', code: 'REP-V-11', title: 'Trip Expenses & Driver Bata', metric: '₹2.1 L Disbursed', category: 'Financial' },
        { id: 'r12', code: 'REP-V-12', title: 'Customer Receivables Ledger', metric: '₹4.2 L Outstanding', category: 'Commercial' },
        { id: 'r13', code: 'REP-V-13', title: 'Supplier & Fuel Card Payables', metric: '₹1.8 L Current Due', category: 'Commercial' },
        { id: 'r14', code: 'REP-V-14', title: 'Per-Vehicle Profitability Analysis', metric: '₹42,000 / Truck Avg', category: 'Management' },
        { id: 'r15', code: 'REP-V-15', title: 'Document Expiry Alert Register', metric: '1 Permit Renewal Due', category: 'Compliance' },
        { id: 'r16', code: 'REP-V-16', title: 'Monthly Fleet Operations Review', metric: 'Executive Telematics', category: 'Executive' }
      ];
    }
  };

  const reports = getReportList();
  const currentReport = reports.find((r) => r.id === selectedReport) || reports[0];

  const PlatformIcon = platform === 'QUARRY' ? Pickaxe : platform === 'CRUSHER' ? Building2 : Truck;

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <PlatformIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {platform} ANALYTICS & AUDIT SUITE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">20 Official Enterprise Reports</span>
              </div>
              <h2 className="text-lg font-black text-white">{platform} Operations & Financial Reports</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="TODAY">Today (21 Sep 2026)</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month (Sep 2026)</option>
              <option value="LAST_MONTH">Last Month</option>
              <option value="FINANCIAL_YEAR">FY 2026-2027</option>
            </select>

            <button
              onClick={() => {
                if (onCreateOttTask) {
                  onCreateOttTask(`Prepare monthly board review report for ${platform}`);
                }
                showToast(`Created OTT Task: Monthly ${platform} Board Audit`);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Report OTT Task</span>
            </button>
            <button
              onClick={() => showToast(`Exported ${currentReport.title} (Excel & PDF)`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Export Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast(`Sent ${currentReport.title} to Print Queue`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Report Selector on Left, Dynamic Report View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Report List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            {platform} Report Catalogue ({reports.length})
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {reports.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedReport(rep.id)}
                className={`w-full text-left p-2.5 rounded-2xl transition flex items-center justify-between cursor-pointer border ${
                  selectedReport === rep.id
                    ? 'bg-amber-500/10 border-amber-500/30 text-white'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-amber-400">{rep.code}</span>
                    <span className="text-xs font-bold text-slate-200">{rep.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{rep.metric}</div>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {rep.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Report Dossier Preview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                {currentReport.code} &bull; {currentReport.category}
              </span>
              <h3 className="text-lg font-black text-white">{currentReport.title}</h3>
              <p className="text-xs text-slate-400">
                Period: <strong className="text-white">{dateRange.replace(/_/g, ' ')}</strong> &bull; Generated from live database
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast(`Report ${currentReport.code} downloaded`)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Dynamic Metrics Summary Box */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="text-[11px] text-slate-400">Audited Volume</div>
              <div className="text-lg font-mono font-black text-white mt-0.5">{currentReport.metric}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Verified against gate records</div>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="text-[11px] text-slate-400">Reconciliation Status</div>
              <div className="text-lg font-mono font-black text-emerald-400 mt-0.5">100% Balanced</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Zero variance detected</div>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="text-[11px] text-slate-400">Audit Compliance</div>
              <div className="text-lg font-mono font-black text-amber-400 mt-0.5">DGMS & GST Ready</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Statutory standards met</div>
            </div>
          </div>

          {/* Sample Ledger Table Preview */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Transaction / Batch</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Particulars</th>
                  <th className="p-3 text-right">Value / Metric</th>
                  <th className="p-3 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                <tr>
                  <td className="p-3 font-mono font-bold text-white">Batch #01 - Shift A</td>
                  <td className="p-3 font-mono text-slate-400">{currentReport.code}-S1</td>
                  <td className="p-3 text-slate-300">Operational yield extraction & sizing</td>
                  <td className="p-3 text-right font-mono font-bold text-white">1,620 Units</td>
                  <td className="p-3 text-right font-mono text-emerald-400">+2.4%</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-white">Batch #02 - Shift B</td>
                  <td className="p-3 font-mono text-slate-400">{currentReport.code}-S2</td>
                  <td className="p-3 text-slate-300">Secondary processing and dispatch weighing</td>
                  <td className="p-3 text-right font-mono font-bold text-white">1,580 Units</td>
                  <td className="p-3 text-right font-mono text-emerald-400">+1.1%</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-white">Direct Dispatch Haul</td>
                  <td className="p-3 font-mono text-slate-400">{currentReport.code}-DSP</td>
                  <td className="p-3 text-slate-300">Client project site deliveries & weigh slips</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">₹3,42,000</td>
                  <td className="p-3 text-right font-mono text-slate-400">0.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Official digital hash: SHA256:{currentReport.id}a98f7102e</span>
            <span>RZ® Minetrix Universal Auditor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
