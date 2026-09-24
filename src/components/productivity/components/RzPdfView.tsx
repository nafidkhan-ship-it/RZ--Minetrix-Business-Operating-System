import React, { useState } from 'react';
import {
  FileType,
  Download,
  Printer,
  Share2,
  Combine,
  Split,
  Minimize2,
  Eye,
  Plus,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { ProductivityFile } from '../types';

interface RzPdfViewProps {
  onOpenPrintCenter?: () => void;
  onOpenShareModal?: (file: ProductivityFile) => void;
  onToast?: (msg: string) => void;
}

export const RzPdfView: React.FC<RzPdfViewProps> = ({
  onOpenPrintCenter,
  onOpenShareModal,
  onToast
}) => {
  const [selectedTool, setSelectedTool] = useState<'view' | 'create' | 'merge' | 'split' | 'compress'>('view');
  const [selectedTemplate, setSelectedTemplate] = useState('Invoice');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  // 11 Business PDF Templates
  const PDF_TEMPLATES = [
    { id: 'invoice', name: 'Invoice', desc: 'GST compliant commercial tax invoice with HSN breakdown' },
    { id: 'quotation', name: 'Quotation', desc: 'Formal bulk stone and crushed sand quotation' },
    { id: 'po', name: 'Purchase Order', desc: 'Heavy equipment parts and bulk diesel PO' },
    { id: 'salary-slip', name: 'Salary Slip', desc: 'Monthly compensation slip with batta and advance recovery' },
    { id: 'gate-pass', name: 'Gate Pass', desc: 'Triplicate dispatch pass with weighbridge gross/tare' },
    { id: 'delivery-note', name: 'Delivery Note', desc: 'Consignee delivery acknowledgment and site receipt' },
    { id: 'agreement', name: 'Agreement', desc: 'Laterite quarry lease and land concession deed' },
    { id: 'contract', name: 'Contract', desc: 'Subcontractor crushing and screening service contract' },
    { id: 'statement', name: 'Statement', desc: 'Customer account statement and monthly balance aging' },
    { id: 'ledger', name: 'Ledger', desc: 'Universal general ledger transaction audit report' },
    { id: 'fin-report', name: 'Financial Report', desc: 'Quarterly EBITDA, COGS and profit statement' }
  ];

  const handleSelectTemplate = (tplName: string) => {
    setSelectedTemplate(tplName);
    onToast?.(`Loaded PDF Template: ${tplName}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <FileType className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">RZ® PDF — Enterprise PDF Center</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30">
                PDF/A-1b Archival Standard
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate, preview, merge, split and cryptographically seal business PDF documents.
            </p>
          </div>
        </div>

        {/* Global PDF Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => onOpenPrintCenter?.()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-yellow-400" />
            <span>Print PDF</span>
          </button>
          <button
            onClick={() => onToast?.('Downloaded signed PDF document to local storage')}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Tool Mode Buttons (Create, View, Merge, Split, Compress) */}
      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'view', label: 'View PDF', icon: Eye },
            { id: 'create', label: 'Create PDF', icon: Plus },
            { id: 'merge', label: 'Merge PDF', icon: Combine },
            { id: 'split', label: 'Split PDF', icon: Split },
            { id: 'compress', label: 'Compress PDF', icon: Minimize2 }
          ].map((tool) => {
            const Icon = tool.icon;
            const isActive = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id as any);
                  onToast?.(`Switched to: ${tool.label}`);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* 11 Business PDF Templates Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold">11 Templates:</span>
          <select
            value={selectedTemplate}
            onChange={(e) => handleSelectTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-rose-300 font-bold rounded-xl px-3 py-1 focus:outline-none"
          >
            {PDF_TEMPLATES.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main PDF Viewer / Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Options / Inspector */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          {/* Metadata Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">
              Document Verification &amp; Security
            </span>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-bold text-white font-sans">{selectedTemplate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Signature:</span>
                <span className="text-cyan-400">SHA-256 Validated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Pages:</span>
                <span className="text-white">1 of 1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Compliance:</span>
                <span className="text-emerald-400">GST Rule 46 / KMMCR</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-emerald-400 text-[10px]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Certified Digital Signature Applied by RZ Security Engine</span>
            </div>
          </div>

          {/* Merge / Split Tool Helper Panel */}
          {selectedTool === 'merge' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3">
              <span className="font-bold text-white text-xs block">Merge PDF Packet</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Combine the Tax Invoice, Weighbridge Slip and Transporter LR into a single dispatch dossier.
              </p>
              <button
                onClick={() => onToast?.('Combined 3 documents into single 1.8 MB PDF')}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                Execute Merge
              </button>
            </div>
          )}

          {selectedTool === 'split' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3">
              <span className="font-bold text-white text-xs block">Split Multi-Page Concession</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Extract individual survey boundary coordinates or revenue receipts from large dossiers.
              </p>
              <button
                onClick={() => onToast?.('Extracted pages 1-4 as individual documents')}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                Execute Split
              </button>
            </div>
          )}

          {selectedTool === 'compress' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3">
              <span className="font-bold text-white text-xs block">Optimize &amp; Compress</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Reduce file size for WhatsApp dispatch and government portal upload (target &lt; 500 KB).
              </p>
              <button
                onClick={() => onToast?.('Compressed from 4.2 MB to 380 KB (91% reduction)')}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                Compress Document
              </button>
            </div>
          )}

          {/* Connected ERP Bridge Badge */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ERP Finance Bridge</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Invoice PDF is mathematically bound to Debtors Ledger in Shared ERP Core. Payment status reflects in real-time.
            </p>
          </div>
        </div>

        {/* Right Side: Virtual PDF Document Rendering Preview */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-slate-200 font-sans relative min-h-[580px]">
          {/* Top Viewer Controls */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span>{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span>Page {currentPage} of 1</span>
            </div>
          </div>

          {/* Actual PDF Page Canvas Mockup */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner text-xs font-mono">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="font-black text-white text-base tracking-tight font-sans">
                  RZ® MINETRIX CONCESSIONS &amp; AGGREGATE LTD
                </span>
                <p className="text-slate-400 text-[10px] mt-0.5 font-mono">
                  NH-66 Kasaragod Pithead &bull; GSTIN: 32AABCR9921D1Z4 &bull; PAN: AABCR9921D
                </p>
                <div className="text-[10px] text-emerald-400 mt-1">Verified Kerala Minor Mineral Supplier</div>
              </div>

              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  TAX INVOICE
                </span>
                <div className="font-bold text-white text-xs mt-2">INV-2026-081</div>
                <div className="text-[10px] text-slate-400">Date: 23 Mar 2026</div>
              </div>
            </div>

            {/* Bill To & Dispatch Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Billed To (Customer):</span>
                <div className="font-bold text-white font-sans text-xs">Sobha Developers Ltd</div>
                <div className="text-[10px] text-slate-400">Site: Sobha City, Calicut Bypass, NH 66</div>
                <div className="text-[10px] text-slate-400">GSTIN: 32AAACS1234F1Z8</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Dispatch &amp; Haulage:</span>
                <div className="font-bold text-amber-400 text-xs">Vehicle: KL-14-W-4491 (10-Wheel)</div>
                <div className="text-[10px] text-slate-400">Weighbridge Token: GP-2026-9921</div>
                <div className="text-[10px] text-slate-400">Driver: Shamsuddeen K.</div>
              </div>
            </div>

            {/* Itemized Goods Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-slate-800">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2 border-r border-slate-800">Item Description</th>
                    <th className="p-2 border-r border-slate-800">HSN</th>
                    <th className="p-2 border-r border-slate-800 text-right">Qty</th>
                    <th className="p-2 border-r border-slate-800 text-right">Rate</th>
                    <th className="p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-2 border-r border-slate-800 font-sans">
                      Laterite Cut Stone Blocks (12x8x6) Grade A
                    </td>
                    <td className="p-2 border-r border-slate-800 text-slate-500">6802</td>
                    <td className="p-2 border-r border-slate-800 text-right">1,200 Pcs</td>
                    <td className="p-2 border-r border-slate-800 text-right">₹42.00</td>
                    <td className="p-2 text-right font-bold text-white">50,400.00</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-800 font-sans">
                      Tipper Freight Haulage (Pit #01 to Site)
                    </td>
                    <td className="p-2 border-r border-slate-800 text-slate-500">9965</td>
                    <td className="p-2 border-r border-slate-800 text-right">1 Trip</td>
                    <td className="p-2 border-r border-slate-800 text-right">₹8,500.00</td>
                    <td className="p-2 text-right font-bold text-white">8,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations & QR Seal */}
            <div className="pt-2 flex justify-between items-end">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
                  <QrCode className="w-14 h-14 text-slate-950" />
                </div>
                <div className="text-[10px] text-slate-400">
                  <div className="font-bold text-emerald-400">E-Way Bill &amp; Tax IRN Verified</div>
                  <div>IRN: 8a4c9b2...4f0e</div>
                  <div>Scan for Ministry Portal Validation</div>
                </div>
              </div>

              <div className="w-48 space-y-1 text-right text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>₹58,900.00</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (5%):</span>
                  <span>₹2,945.00</span>
                </div>
                <div className="flex justify-between font-bold text-amber-400 border-t border-slate-800 pt-1 text-xs">
                  <span>Total Due:</span>
                  <span>₹61,845.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
