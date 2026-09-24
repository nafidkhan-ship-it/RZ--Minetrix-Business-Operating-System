import React, { useState } from 'react';
import {
  BarChart4,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  TrendingUp,
  PieChart,
  HardHat,
  Boxes,
  Truck
} from 'lucide-react';
import {
  SAMPLE_JOBS,
  SAMPLE_CUSTOMERS,
  SAMPLE_CONTRACTORS
} from '../../data/contractJobStudioData';

export const JobReportsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'OPERATIONAL' | 'FINANCIAL'>('OPERATIONAL');
  const [selectedJob, setSelectedJob] = useState('ALL');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const OPERATIONAL_REPORTS = [
    {
      title: 'Job Status & Progress Roster',
      desc: 'Cumulative execution % per project, scheduled vs actual completion dates.',
      icon: TrendingUp,
      records: '4 Active Jobs'
    },
    {
      title: 'Daily Site Progress Log Diary',
      desc: 'Field diary, daily completed tonnage, bench elevations, site weather conditions.',
      icon: Calendar,
      records: '18 Daily Entries'
    },
    {
      title: 'Material Consumption & Stock Audit',
      desc: 'Quarry pit and crusher supply dispatched, site consumed, and stock on site.',
      icon: Boxes,
      records: '47,000 MT Tracked'
    },
    {
      title: 'Vehicle Fleet Utilization & Trips',
      desc: 'Trips logged, kilometers run, diesel litres consumed, machine operational hours.',
      icon: Truck,
      records: '14 Active Tippers'
    },
    {
      title: 'Worker Attendance & Wage Roster',
      desc: 'Muster roll days present, overtime hours, batta dispatches, and daily wage cost.',
      icon: HardHat,
      records: '82 Crew Members'
    },
    {
      title: 'Contractor Performance & SLA Audit',
      desc: 'Output productivity, safety compliance rating, and work order fulfillment.',
      icon: BarChart4,
      records: '6 Specialist Vendors'
    }
  ];

  const FINANCIAL_REPORTS = [
    {
      title: 'Consolidated Job P&L Statement',
      desc: 'Net gross margin, direct operational cost, quarry overheads, net earnings.',
      icon: PieChart,
      records: '₹28.4L Net Margin'
    },
    {
      title: 'Billing & Collection Schedule',
      desc: 'Progress RA bills issued, TDS certificates, and bank remittance realization.',
      icon: FileSpreadsheet,
      records: '₹75L Billed'
    },
    {
      title: 'Outstanding Dues & Aging Analysis',
      desc: '0-30 days, 31-60 days, 60+ days client receivables and follow-up notices.',
      icon: FileText,
      records: '₹22.5L Receivable'
    },
    {
      title: 'Retention Guarantee Ledger',
      desc: '5% retention amounts deducted, defect liability period release deadlines.',
      icon: FileSpreadsheet,
      records: '₹3.75L Held'
    },
    {
      title: 'Contractor Payment & Sub-contract Ledger',
      desc: 'Vendor bills certified, advances deducted, and balance payable ledger.',
      icon: HardHat,
      records: '₹21.2L Disbursed'
    },
    {
      title: 'Budget vs Actual Cost Variance',
      desc: 'Rate variance analysis, quarry cost deviations, and over-budget risk indicators.',
      icon: BarChart4,
      records: '3.2% Below Budget'
    }
  ];

  const activeReports = selectedCategory === 'OPERATIONAL' ? OPERATIONAL_REPORTS : FINANCIAL_REPORTS;

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Executive Analytics & Exports
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              12 Pre-configured Reports
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Management Reports & Analytics</h2>
          <p className="text-xs text-slate-400">
            Generate printable PDF statements, export Excel workbooks, and analyze cross-platform operational KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Generated Master Operational Dossier (PDF)')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print All</span>
          </button>

          <button
            onClick={() => showToast('Exported Full Data Workbook (Excel .xlsx)')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel Export</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Switcher */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('OPERATIONAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'OPERATIONAL'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Operational Reports
          </button>
          <button
            onClick={() => setSelectedCategory('FINANCIAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'FINANCIAL'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Financial Reports
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Jobs Filter</option>
            {SAMPLE_JOBS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.id} - {j.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-[11px]"
            />
            <span>&rarr;</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeReports.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.title}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {rep.records}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3">{rep.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => showToast(`Previewing ${rep.title}...`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Preview
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => showToast(`Downloaded Excel: ${rep.title}`)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 cursor-pointer"
                    title="Excel Export"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast(`Downloaded PDF: ${rep.title}`)}
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-md"
                    title="PDF Export"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
