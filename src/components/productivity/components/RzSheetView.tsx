import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Save,
  Download,
  Upload,
  Plus,
  Share2,
  Printer,
  Table,
  BarChart3,
  Search,
  Filter,
  ArrowUpDown,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  FolderSync,
  HelpCircle,
  Clock,
  SplitSquareVertical
} from 'lucide-react';
import { ProductivityFile } from '../types';

interface RzSheetViewProps {
  onOpenShareModal?: (file: ProductivityFile) => void;
  onOpenVersionModal?: (file: ProductivityFile) => void;
  onOpenPrintCenter?: () => void;
  onToast?: (msg: string) => void;
}

export const RzSheetView: React.FC<RzSheetViewProps> = ({
  onOpenShareModal,
  onOpenVersionModal,
  onOpenPrintCenter,
  onToast
}) => {
  const [sheetName, setSheetName] = useState('Laterite_Extraction_Log_Kasaragod_Pit01.rzs');
  const [selectedCell, setSelectedCell] = useState('D7');
  const [formulaBar, setFormulaBar] = useState('=SUM(D2:D6)');
  const [activeSheetTab, setActiveSheetTab] = useState<'pit1' | 'pit2' | 'summary'>('pit1');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [numberFormat, setNumberFormat] = useState<'currency' | 'percent' | 'normal'>('currency');
  const [isFreezeActive, setIsFreezeActive] = useState(true);
  const [isChartOpen, setIsChartOpen] = useState(false);

  // 12 Business Templates Definition
  const BUSINESS_TEMPLATES = [
    { id: 'quarry-load', name: 'Quarry Load Register', desc: 'Extraction pit logs, vehicle passes & stone blocks' },
    { id: 'attendance', name: 'Attendance Sheet', desc: 'Biometric daily punches, shifts & OT hours' },
    { id: 'salary', name: 'Salary Sheet', desc: 'Working days, batta, advances & net pay' },
    { id: 'sales-reg', name: 'Sales Register', desc: 'Commercial dispatches, buyer GSTIN & tax' },
    { id: 'purchase-reg', name: 'Purchase Register', desc: 'Diesel bills, explosives & spare parts' },
    { id: 'cust-ledger', name: 'Customer Ledger', desc: 'Debtor aging, credit terms & payments' },
    { id: 'supp-ledger', name: 'Supplier Ledger', desc: 'Vendor payables, contra bills & dues' },
    { id: 'trip-sheet', name: 'Vehicle Trip Sheet', desc: 'Freight, diesel, toll, batta & contribution' },
    { id: 'crusher-prod', name: 'Crusher Production Sheet', desc: 'Raw intake, M-sand, aggregate yields' },
    { id: 'stock-reg', name: 'Stock Register', desc: 'Silos, dressed laterite yards & buffers' },
    { id: 'expense-sheet', name: 'Expense Sheet', desc: 'Site petty cash, maintenance & fuel' },
    { id: 'pnl-sheet', name: 'P&L Sheet', desc: 'EBITDA, gross margin & net partner yield' }
  ];

  // Grid Data Matrix
  const [gridRows, setGridRows] = useState<string[][]>([
    ['Date', 'Pit Location', 'Block Type', 'Quantity', 'Rate / Block', 'Total Amount (₹)', 'Dispatch Vehicle', 'Status'],
    ['2026-03-20', 'Pit #01 - Kasaragod', 'Grade A (12x8x6)', '1,200', '₹42.00', '50,400.00', 'KL-14-W-4491', 'Dispatched'],
    ['2026-03-21', 'Pit #01 - Kasaragod', 'Grade B (10x7x5)', '850', '₹36.00', '30,600.00', 'KL-11-BH-9921', 'Dispatched'],
    ['2026-03-21', 'Pit #02 - Hosdurg', 'Jumbo Block (14x9x7)', '640', '₹55.00', '35,200.00', 'KL-60-A-1020', 'Dispatched'],
    ['2026-03-22', 'Pit #01 - Kasaragod', 'Standard Block', '1,500', '₹40.00', '60,000.00', 'KL-14-W-4491', 'Dispatched'],
    ['2026-03-23', 'Pit #01 - Kasaragod', 'Corner Dressed Block', '400', '₹65.00', '26,000.00', 'KL-11-BH-9921', 'Weighbridge Pass'],
    ['TOTAL', '5 ACTIVE LOGS', 'AGGREGATED SUM', '4,590', 'AVG ₹47.60', '2,02,200.00', '3 TIPPERS', 'RECONCILED']
  ]);

  const handleCellClick = (colLetter: string, rowIdx: number, val: string) => {
    const cellRef = `${colLetter}${rowIdx}`;
    setSelectedCell(cellRef);
    if (cellRef === 'F7' || cellRef === 'D7') {
      setFormulaBar(`=SUM(${colLetter}2:${colLetter}6)`);
    } else {
      setFormulaBar(val);
    }
  };

  const handleApplyTemplate = (tplName: string) => {
    setSheetName(`${tplName.replace(/\s+/g, '_')}_2026.rzs`);
    onToast?.(`Loaded business template: ${tplName}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl font-mono text-xs">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="bg-transparent font-bold text-white text-base focus:outline-none border-b border-transparent focus:border-amber-400"
              />
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Live Bi-Directional ERP Sync
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5 flex items-center gap-2">
              <span>Connected to Kasaragod Pit #01 Live Weigher</span>
              <span>&bull;</span>
              <span className="text-amber-400">Formula Evaluation Engine: Active</span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2 font-sans">
          <button
            onClick={() => onToast?.('Sheet data re-synchronized with ERP Weighbridge stream')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync ERP</span>
          </button>
          <button
            onClick={() => setIsChartOpen(!isChartOpen)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
              isChartOpen ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span>{isChartOpen ? 'Hide Chart' : 'Show Chart'}</span>
          </button>
          <button
            onClick={() => onToast?.('Exported as Excel & CSV to Downloads')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export XLSX</span>
          </button>
          <button
            onClick={() => onToast?.('Spreadsheet changes committed to RZ Drive')}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Formatting Toolbar */}
      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Bold, Italic */}
          <button
            onClick={() => setIsBold(!isBold)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isBold ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsItalic(!isItalic)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isItalic ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => setAlignment('left')}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              alignment === 'left' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAlignment('center')}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              alignment === 'center' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAlignment('right')}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              alignment === 'right' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Number Formats */}
          <button
            onClick={() => setNumberFormat('currency')}
            className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
              numberFormat === 'currency' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span>₹ INR</span>
          </button>
          <button
            onClick={() => setNumberFormat('percent')}
            className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
              numberFormat === 'percent' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Percent className="w-3 h-3" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Freeze Panes & Filter */}
          <button
            onClick={() => {
              setIsFreezeActive(!isFreezeActive);
              onToast?.(isFreezeActive ? 'Header row unfrozen' : 'Header row frozen at top');
            }}
            className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
              isFreezeActive ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <SplitSquareVertical className="w-3 h-3" />
            <span>Freeze Header</span>
          </button>
          <button
            onClick={() => onToast?.('Filter dropdowns applied to columns')}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <Filter className="w-3 h-3 text-amber-400" />
            <span>Sort &amp; Filter</span>
          </button>
        </div>

        {/* Business Templates Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold">12 Templates:</span>
          <select
            onChange={(e) => handleApplyTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded-xl px-2.5 py-1 text-xs focus:outline-none font-sans"
            defaultValue="Quarry Load Register"
          >
            {BUSINESS_TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.name}>
                {tpl.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs">
        <div className="flex items-center gap-1 font-bold text-amber-400 w-16">
          <span className="text-[10px] text-slate-500">CELL</span>
          <span>{selectedCell}</span>
        </div>
        <span className="text-slate-500 font-serif italic text-sm font-bold">fx</span>
        <input
          type="text"
          value={formulaBar}
          onChange={(e) => setFormulaBar(e.target.value)}
          placeholder="Enter formula like =SUM(D2:D6) or text..."
          className="w-full bg-transparent text-slate-200 outline-none font-mono"
        />
        <span className="text-[10px] text-slate-500 shrink-0">Auto-evaluating</span>
      </div>

      {/* Optional Interactive Yield Chart Panel */}
      {isChartOpen && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 animate-in fade-in duration-150">
          <div className="flex justify-between items-center text-xs font-sans">
            <span className="font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Extraction Yield vs Revenue Chart (Pit #01 Kasaragod)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Total Yield: 4,590 Blocks</span>
          </div>
          <div className="h-28 flex items-end justify-between gap-3 pt-4 px-4 border-b border-slate-800">
            {[
              { day: '20 Mar', val: 1200, amount: '₹50.4k', height: '65%' },
              { day: '21 Mar (A)', val: 850, amount: '₹30.6k', height: '48%' },
              { day: '21 Mar (B)', val: 640, amount: '₹35.2k', height: '38%' },
              { day: '22 Mar', val: 1500, amount: '₹60.0k', height: '85%' },
              { day: '23 Mar', val: 400, amount: '₹26.0k', height: '28%' }
            ].map((bar, bIdx) => (
              <div key={bIdx} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] text-amber-400 opacity-80 group-hover:opacity-100">{bar.amount}</span>
                <div
                  style={{ height: bar.height }}
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all group-hover:from-amber-500 group-hover:to-amber-400"
                />
                <span className="text-[10px] text-slate-400 mt-1">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Spreadsheet Grid Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 max-h-96">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] ${isFreezeActive ? 'sticky top-0 z-10' : ''}`}>
              <th className="p-2 w-10 text-center border-r border-slate-800 text-slate-600 bg-slate-900">#</th>
              {gridRows[0].map((colTitle, cIdx) => (
                <th key={cIdx} className="p-2 border-r border-slate-800 font-bold text-slate-300 bg-slate-900 whitespace-nowrap">
                  <span className="text-amber-400 mr-1">{String.fromCharCode(65 + cIdx)}</span>
                  <span>{colTitle}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridRows.slice(1).map((row, rIdx) => {
              const isSummaryRow = rIdx === gridRows.length - 2;
              return (
                <tr
                  key={rIdx}
                  className={`border-b border-slate-800/60 hover:bg-slate-850/60 transition ${
                    isSummaryRow ? 'bg-amber-500/10 font-bold text-amber-300 border-t-2 border-amber-500/40' : 'text-slate-300'
                  }`}
                >
                  <td className="p-2 text-center border-r border-slate-800 text-slate-600 text-[10px] bg-slate-900/60 select-none">
                    {rIdx + 1}
                  </td>
                  {row.map((cellVal, cIdx) => {
                    const colLetter = String.fromCharCode(65 + cIdx);
                    const cellAddress = `${colLetter}${rIdx + 2}`;
                    const isSelected = selectedCell === cellAddress;
                    return (
                      <td
                        key={cIdx}
                        onClick={() => handleCellClick(colLetter, rIdx + 2, cellVal)}
                        className={`p-2 border-r border-slate-800/80 cursor-pointer whitespace-nowrap text-${alignment} ${
                          isBold ? 'font-bold' : ''
                        } ${isItalic ? 'italic' : ''} ${
                          isSelected
                            ? 'bg-amber-500/20 text-white outline outline-2 outline-amber-400 z-10'
                            : ''
                        }`}
                      >
                        {cellVal}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sheet Tabs & Bottom Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-800">
        <div className="flex items-center gap-1 font-sans">
          {[
            { id: 'pit1', label: 'Sheet1 — Kasaragod Pit #01' },
            { id: 'pit2', label: 'Sheet2 — Hosdurg Extraction' },
            { id: 'summary', label: 'Summary — Yield Aggregate' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveSheetTab(st.id as any)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                activeSheetTab === st.id
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
          <button
            onClick={() => onToast?.('Added new sheet tab: Sheet 4')}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Add Sheet"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Calculation Metric Readout */}
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span>SELECTED: <strong className="text-amber-400">{selectedCell}</strong></span>
          <span>COUNT: <strong className="text-slate-300">5 entries</strong></span>
          <span>AVERAGE: <strong className="text-slate-300">₹40,440</strong></span>
          <span>SUM: <strong className="text-emerald-400">₹2,02,200.00</strong></span>
          <span className="text-emerald-400">&bull; READY</span>
        </div>
      </div>
    </div>
  );
};
