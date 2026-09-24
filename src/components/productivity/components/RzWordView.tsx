import React, { useState } from 'react';
import {
  FileText,
  Save,
  Download,
  Share2,
  Printer,
  Table as TableIcon,
  Image,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  CheckCircle2,
  Sparkles,
  FileCheck,
  UserCheck,
  ChevronRight,
  MessageSquare,
  Scissors,
  Copy,
  PenTool,
  Bookmark
} from 'lucide-react';
import { ProductivityFile } from '../types';

interface RzWordViewProps {
  onOpenShareModal?: (file: ProductivityFile) => void;
  onOpenPrintCenter?: () => void;
  onToast?: (msg: string) => void;
}

export const RzWordView: React.FC<RzWordViewProps> = ({
  onOpenShareModal,
  onOpenPrintCenter,
  onToast
}) => {
  const [docTitle, setDocTitle] = useState('Landowner_Lease_Agreement_Moideenkutty.rzw');
  const [selectedTemplate, setSelectedTemplate] = useState('Land Agreement');
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | 'insert' | 'format' | 'table' | 'layout' | 'review'>('file');
  const [signerPartyA, setSignerPartyA] = useState('Nafid Khan (Authorized Managing Director)');
  const [signerPartyB, setSignerPartyB] = useState('K. P. Moideenkutty (Land Concession Holder)');
  const [royaltyRate, setRoyaltyRate] = useState('4.50');
  const [activeTabMode, setActiveTabMode] = useState<'editor' | 'preview'>('editor');

  // 14 Business Templates
  const WORD_TEMPLATES = [
    { id: 'quotation', name: 'Quotation', desc: 'Commercial bulk pricing for aggregate and stone' },
    { id: 'invoice-letter', name: 'Invoice Letter', desc: 'Accompanying covering letter for GST tax bill' },
    { id: 'agreement', name: 'Agreement', desc: 'Mutual extraction and site operation agreement' },
    { id: 'contract', name: 'Contract', desc: 'Legally binding long-term civil supply contract' },
    { id: 'offer-letter', name: 'Offer Letter', desc: 'Personnel recruitment offer with batta terms' },
    { id: 'appointment-letter', name: 'Appointment Letter', desc: 'Official joining appointment for site staff' },
    { id: 'salary-letter', name: 'Salary Letter', desc: 'Bank declaration of employee remuneration' },
    { id: 'purchase-order', name: 'Purchase Order', desc: 'Vendor PO for diesel bowser and consumables' },
    { id: 'work-order', name: 'Work Order', desc: 'Plant maintenance and crusher overhaul task' },
    { id: 'delivery-note', name: 'Delivery Note', desc: 'Site receipt slip confirming unloaded minerals' },
    { id: 'gate-pass', name: 'Gate Pass', desc: 'Boom-barrier vehicle transit clearance letter' },
    { id: 'land-agreement', name: 'Land Agreement', desc: 'Landowner mining lease & pithead royalty deed' },
    { id: 'partner-agreement', name: 'Partner Agreement', desc: 'Equity investor capital & profit split deed' },
    { id: 'business-proposal', name: 'Business Proposal', desc: 'Infrastructure tender supply proposal' }
  ];

  const handleSelectTemplate = (tplName: string) => {
    setSelectedTemplate(tplName);
    setDocTitle(`${tplName.replace(/\s+/g, '_')}_Document.rzw`);
    onToast?.(`Switched template to: ${tplName}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="bg-transparent font-bold text-white text-base focus:outline-none border-b border-transparent focus:border-amber-400"
              />
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold border border-blue-500/30">
                RZ® WORD ENTERPRISE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Preset: <strong>{selectedTemplate}</strong></span>
              <span>&bull;</span>
              <span className="text-cyan-400">Linked to Platform 07: Quarry Land Engine</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => onToast?.('Document saved to RZ Drive / Contracts')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-blue-400" />
            <span>Save</span>
          </button>
          <button
            onClick={() => onOpenPrintCenter?.()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-yellow-400" />
            <span>Print</span>
          </button>
          <button
            onClick={() => onToast?.('Exported sealed legal PDF')}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Word Menu Bar (File, Edit, Insert, Format, Table, Layout, Review) */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2 text-xs font-mono text-slate-400 overflow-x-auto scrollbar-none">
        {[
          { id: 'file', label: 'File' },
          { id: 'edit', label: 'Edit' },
          { id: 'insert', label: 'Insert' },
          { id: 'format', label: 'Format' },
          { id: 'table', label: 'Table' },
          { id: 'layout', label: 'Layout' },
          { id: 'review', label: 'Review' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setActiveMenu(m.id as any);
              onToast?.(`Opened ${m.label} tools`);
            }}
            className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
              activeMenu === m.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Editor Formatting Ribbon */}
      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <select defaultValue="Body Paragraph (11pt)" className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none">
            <option>Heading 1 (24pt)</option>
            <option>Heading 2 (18pt)</option>
            <option>Body Paragraph (11pt)</option>
            <option>Legal Clause (10pt)</option>
          </select>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          <button
            onClick={() => onToast?.('Bold applied')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToast?.('Italic applied')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToast?.('Underline applied')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          <button
            onClick={() => onToast?.('Inserted standard 4-column royalty schedule table')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <TableIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Insert Table</span>
          </button>
          <button
            onClick={() => onToast?.('Inserted company emblem & surveyor seal')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Image className="w-3.5 h-3.5 text-emerald-400" />
            <span>Insert Seal</span>
          </button>
        </div>

        {/* 14 Business Templates Quick Switcher */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500 text-[10px] uppercase font-bold">14 Templates:</span>
          <select
            value={selectedTemplate}
            onChange={(e) => handleSelectTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-amber-400 rounded-xl px-2.5 py-1 text-xs focus:outline-none font-bold"
          >
            {WORD_TEMPLATES.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Document Workspace (A4 Canvas Representation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Document Parameters Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">
              Document Parameters &amp; Dynamic Tags
            </span>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Party A (Operator Exec)</label>
              <input
                type="text"
                value={signerPartyA}
                onChange={(e) => setSignerPartyA(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none text-[11px]"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Party B (Landowner / Client)</label>
              <input
                type="text"
                value={signerPartyB}
                onChange={(e) => setSignerPartyB(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none text-[11px]"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Agreed Extraction Royalty (₹/Block)</label>
              <input
                type="text"
                value={royaltyRate}
                onChange={(e) => setRoyaltyRate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-emerald-400 font-bold focus:outline-none text-[11px]"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 block mb-1">Document Status:</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold">Draft Ready for Biometric Execution</span>
              </div>
            </div>
          </div>

          {/* Connected ERP Notice */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Concession Sync</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Saving this agreement automatically updates Platform 07 (Quarry Land) agreements ledger and triggers monthly automated royalty vouchers.
            </p>
          </div>
        </div>

        {/* Right Side: Virtual A4 Document Page */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 text-slate-200 font-serif relative min-h-[580px]">
          {/* Header Watermark */}
          <div className="text-center pb-6 border-b border-slate-800 font-sans">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-black tracking-widest text-xs uppercase mb-1">
              <FileCheck className="w-4 h-4" />
              <span>RZ® MINETRIX LEGAL CONCESSION INSTRUMENT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              MINING LEASE &amp; LAND CONCESSION DEED
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Instrument No: RZ-KL14-CON-2026-8801 &bull; Kasaragod District &bull; Survey No. 142/3A
            </p>
          </div>

          {/* Legal Body Paragraphs */}
          <div className="text-xs sm:text-sm leading-relaxed space-y-4 font-sans text-slate-300">
            <p>
              <strong>THIS CONCESSION AGREEMENT</strong> is made on this <strong>23rd day of September, 2026</strong>, by and between:
            </p>
            <p className="pl-4 border-l-2 border-amber-500/50 italic text-slate-300">
              1. <strong>{signerPartyA}</strong>, representing RZ MINETRIX CONCESSIONS LTD (hereinafter called the "OPERATOR").<br />
              2. <strong>{signerPartyB}</strong>, registered title deed holder of 4.80 Acres laterite quarry land (hereinafter called the "LANDOWNER").
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Article 1: Scope of Quarry Extraction
              </h4>
              <p className="text-xs leading-relaxed">
                The Landowner hereby grants to the Operator an exclusive and unencumbered right to quarry, slice, dress, stockpile and dispatch laterite blocks and associated minor minerals conforming to Kerala Minor Mineral Concession Rules (KMMCR 2015).
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Article 2: Consideration &amp; Dynamic Royalty Formula
              </h4>
              <p className="text-xs leading-relaxed">
                The Operator covenants to credit the Landowner a direct pithead royalty of <strong className="text-amber-400">₹{royaltyRate} per finished dressed laterite block</strong> extracted. Royalty quantities shall be verified automatically through the automated Weighbridge sensor and gate pass stream.
              </p>
            </div>

            {/* Embedded Royalty Schedule Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left font-mono text-xs border border-slate-800">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="p-2 border-r border-slate-800">Block Dimension</th>
                    <th className="p-2 border-r border-slate-800">Grade</th>
                    <th className="p-2 border-r border-slate-800">Base Rate</th>
                    <th className="p-2">Owner Royalty (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-2 border-r border-slate-800">12 x 8 x 6 Inches</td>
                    <td className="p-2 border-r border-slate-800 text-cyan-400">Grade A Heavy</td>
                    <td className="p-2 border-r border-slate-800">₹42.00</td>
                    <td className="p-2 font-bold text-emerald-400">₹{royaltyRate}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-800">10 x 7 x 5 Inches</td>
                    <td className="p-2 border-r border-slate-800 text-cyan-400">Standard Block</td>
                    <td className="p-2 border-r border-slate-800">₹36.00</td>
                    <td className="p-2 font-bold text-emerald-400">₹3.80</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature Block */}
          <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-6 font-sans text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">For The Operator</span>
              <div className="font-bold text-white text-sm">{signerPartyA}</div>
              <div className="text-[10px] text-slate-500">Managing Director &bull; RZ Minetrix BOS</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Digitally Sealed &bull; SHA-256 Verified</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">For The Landowner</span>
              <div className="font-bold text-amber-400 text-sm">{signerPartyB}</div>
              <div className="text-[10px] text-slate-500">Concession Lessor &bull; Title Deed #419/2018</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-2 flex items-center justify-end gap-1">
                <UserCheck className="w-3 h-3" />
                <span>Biometric e-KYC Matched</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
