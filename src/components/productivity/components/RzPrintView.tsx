import React, { useState } from 'react';
import {
  Printer,
  FileText,
  Download,
  Share2,
  Save,
  CheckCircle2,
  Sliders,
  Maximize2,
  RotateCw,
  QrCode,
  Truck,
  Sparkles,
  Receipt,
  FileCheck
} from 'lucide-react';
import { PrintSettingsState } from '../types';

interface RzPrintViewProps {
  onToast?: (msg: string) => void;
}

export const RzPrintView: React.FC<RzPrintViewProps> = ({ onToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<PrintSettingsState['category']>('Gate Pass');
  const [paperSize, setPaperSize] = useState<PrintSettingsState['paperSize']>('3-inch Thermal');
  const [orientation, setOrientation] = useState<PrintSettingsState['orientation']>('portrait');
  const [copies, setCopies] = useState<number>(1);
  const [margins, setMargins] = useState<PrintSettingsState['margins']>('narrow');
  const [includeHeader, setIncludeHeader] = useState<boolean>(true);
  const [includeFooter, setIncludeFooter] = useState<boolean>(true);
  const [colorMode, setColorMode] = useState<PrintSettingsState['colorMode']>('monochrome');

  // 10 Print Categories
  const PRINT_CATEGORIES = [
    { id: 'Gate Pass', name: 'Gate Pass', desc: '3-inch thermal weighbridge exit ticket with tare/gross' },
    { id: 'Invoices', name: 'Invoices', desc: 'A4 triplicate GST commercial invoice with QR e-way bill' },
    { id: 'Quotations', name: 'Quotations', desc: 'Commercial quotation with tiered volume rates' },
    { id: 'Purchase Orders', name: 'Purchase Orders', desc: 'Consumables, drill bits & diesel supply orders' },
    { id: 'Salary Slips', name: 'Salary Slips', desc: 'Official salary slip with batta & advance deductions' },
    { id: 'Delivery Notes', name: 'Delivery Notes', desc: 'Site unloading delivery receipt voucher' },
    { id: 'Reports', name: 'Reports', desc: 'SEIAA statutory return and extraction report' },
    { id: 'Statements', name: 'Statements', desc: 'Monthly customer ledger statement & aging' },
    { id: 'Ledgers', name: 'Ledgers', desc: 'General ledger double-entry trial balance' },
    { id: 'Agreements', name: 'Agreements', desc: 'Legal deed folio paper concession agreement' }
  ];

  const handleTriggerPrint = () => {
    onToast?.(`Queued print job: ${selectedCategory} (${copies} copies, ${paperSize})`);
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">RZ® Print — Central Print &amp; Ticket Center</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-mono font-bold border border-yellow-500/30">
                Thermal &amp; Laser Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High-speed direct thermal pit printing (3-inch POS) and triplicate A4 legal laser printing.
            </p>
          </div>
        </div>

        {/* Global Print Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => onToast?.('Saved print layout as PDF')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save as PDF</span>
          </button>
          <button
            onClick={handleTriggerPrint}
            className="px-4 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Now</span>
          </button>
        </div>
      </div>

      {/* Main Print Workstation: Settings (Left) vs Live Print Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Print Presets & Hardware Config */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          {/* 10 Category Selector */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold block">
              10 Official Print Document Presets
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRINT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    if (cat.id === 'Gate Pass') {
                      setPaperSize('3-inch Thermal');
                      setColorMode('monochrome');
                    } else {
                      setPaperSize('A4');
                    }
                    onToast?.(`Loaded ${cat.name} print preset`);
                  }}
                  className={`p-2 rounded-xl text-left transition cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-yellow-500/10 border-yellow-500/50 text-white font-bold'
                      : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="truncate">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Physical Print Hardware Settings */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">
              Print Settings &amp; Format Specifications
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Paper Size</label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                >
                  <option value="3-inch Thermal">3-inch Thermal POS (80mm)</option>
                  <option value="A4">A4 Sheet (210 x 297 mm)</option>
                  <option value="A5">A5 Sheet (Half A4)</option>
                  <option value="Letter">Letter (8.5 x 11 in)</option>
                  <option value="Continuous Roll">Continuous Dot-Matrix Roll</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Number of Copies</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                >
                </input>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Margins</label>
                <select
                  value={margins}
                  onChange={(e) => setMargins(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                >
                  <option value="normal">Normal (0.75 in)</option>
                  <option value="narrow">Narrow (0.25 in)</option>
                  <option value="wide">Wide (1.0 in)</option>
                  <option value="zero">Zero (Edge-to-Edge)</option>
                </select>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHeader}
                  onChange={(e) => setIncludeHeader(e.target.checked)}
                  className="accent-yellow-500"
                />
                <span>Include Official Entity Header &amp; Mineral Clearance No.</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFooter}
                  onChange={(e) => setIncludeFooter(e.target.checked)}
                  className="accent-yellow-500"
                />
                <span>Include Security Watermark &amp; Digital QR Barcode</span>
              </label>
            </div>
          </div>

          {/* Connected ERP Bridge Badge */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Weighbridge &amp; Quarry Hook</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Printing this Gate Pass automatically updates Platform 01 (Quarry) dispatches and marks the vehicle exit timestamp on security cameras.
            </p>
          </div>
        </div>

        {/* Right Column: High-Fidelity Print Preview Canvas */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 flex flex-col justify-center items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-500">
            <span>PREVIEW MODE: {paperSize.toUpperCase()}</span>
            <span>COPIES: {copies} &bull; {colorMode.toUpperCase()}</span>
          </div>

          {paperSize === '3-inch Thermal' ? (
            /* 3-Inch Thermal POS Slip Representation */
            <div className="w-72 bg-white text-slate-950 font-mono p-5 rounded-lg shadow-2xl text-[11px] space-y-3 border border-slate-300">
              <div className="text-center border-b border-dashed border-slate-800 pb-2">
                <div className="font-black text-xs tracking-wider">RZ® MINETRIX PIT WEIGHBRIDGE</div>
                <div className="text-[9px] text-slate-600">KASARAGOD PIT #01 &bull; KL14</div>
                <div className="text-[9px] text-slate-600">SEIAA PERMIT: KL/MIN/2026/0912</div>
                <div className="text-[9px] text-slate-600">TEL: +91 98470 12345</div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Pass No:</span>
                  <span className="font-bold">GP-2026-9921</span>
                </div>
                <div className="flex justify-between">
                  <span>Date/Time:</span>
                  <span>2026-03-23 11:25 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="font-bold">KL-14-W-4491 (10-W)</span>
                </div>
                <div className="flex justify-between">
                  <span>Driver:</span>
                  <span>Shamsuddeen K.</span>
                </div>
                <div className="flex justify-between">
                  <span>Consignee:</span>
                  <span className="font-bold">Sobha Developers Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span>Laterite Cut Stone 12x8x6</span>
                </div>
                <div className="border-t border-dashed border-slate-800 my-1" />
                <div className="flex justify-between">
                  <span>Gross Wt:</span>
                  <span>32,450 KG</span>
                </div>
                <div className="flex justify-between">
                  <span>Tare Wt:</span>
                  <span>10,200 KG</span>
                </div>
                <div className="flex justify-between font-black text-xs border-t border-dashed border-slate-800 pt-1">
                  <span>Net Load:</span>
                  <span>22,250 KG (1,200 Pcs)</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-slate-800 space-y-1">
                <div className="flex justify-center">
                  <QrCode className="w-16 h-16 text-slate-950" />
                </div>
                <div className="text-[8px] text-slate-600">
                  Automated Sensor Token &bull; Scan at Checkpost
                </div>
              </div>
            </div>
          ) : (
            /* A4 Laser Triplicate Document Representation */
            <div className="w-full max-w-lg bg-white text-slate-950 font-sans p-6 rounded-lg shadow-2xl text-xs space-y-4 border border-slate-300">
              <div className="flex justify-between items-start border-b border-slate-300 pb-3">
                <div>
                  <h3 className="font-black text-sm tracking-tight">RZ® MINETRIX CONCESSIONS LTD</h3>
                  <div className="text-[10px] text-slate-600">Official Document Dispatch Slip</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded border">
                    ORIGINAL FOR RECIPIENT
                  </span>
                  <div className="text-[10px] font-mono mt-1 text-slate-600">Doc: RZ-PRN-2026-081</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold">Subject: Official {selectedCategory} Summary</div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-serif">
                  This printed instrument certifies authorized material dispatch, financial debits and operational transit clearance under the RZ MINETRIX unified enterprise architecture.
                </p>
              </div>

              <div className="border border-slate-200 rounded p-3 text-[11px] font-mono space-y-1 bg-slate-50">
                <div className="flex justify-between">
                  <span>Authorized Unit:</span>
                  <span className="font-bold">Kasaragod Pithead #01</span>
                </div>
                <div className="flex justify-between">
                  <span>Authorized Signer:</span>
                  <span className="font-bold">Nafid Khan (Managing Director)</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span>2026-03-23 11:25:18</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-[10px]">
                <div className="text-slate-500">Security Hash: sha256:7f4a...90bc</div>
                <div className="font-bold">Authorized Stamp &amp; Signatory</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
