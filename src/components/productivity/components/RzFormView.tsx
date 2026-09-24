import React, { useState } from 'react';
import {
  FormInput,
  Plus,
  Trash2,
  Eye,
  Settings,
  Send,
  CheckCircle2,
  Table,
  Layers,
  ArrowRight,
  Share2,
  Copy,
  Clock,
  Sparkles,
  MapPin,
  PenTool,
  UploadCloud,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { FormFieldItem, FormResponseItem } from '../types';
import { MOCK_FORM_RESPONSES } from '../mockData';

interface RzFormViewProps {
  onToast?: (msg: string) => void;
  onNavigateToSheet?: () => void;
}

export const RzFormView: React.FC<RzFormViewProps> = ({ onToast, onNavigateToSheet }) => {
  const [formTitle, setFormTitle] = useState('Customer Bulk Stone Enquiry Intake');
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'responses'>('builder');
  const [selectedTemplate, setSelectedTemplate] = useState('Customer Enquiry');

  // 10 Business Form Templates
  const FORM_TEMPLATES = [
    { id: 'cust-enquiry', name: 'Customer Enquiry', desc: 'Commercial lead capture for laterite stone and aggregate' },
    { id: 'supp-reg', name: 'Supplier Registration', desc: 'Vendor onboarding, GSTIN, bank details and KYC' },
    { id: 'emp-reg', name: 'Employee Registration', desc: 'Driver, blaster, operator KYC and emergency contacts' },
    { id: 'veh-reg', name: 'Vehicle Registration', desc: 'Tipper RC, insurance, pollution & permit details' },
    { id: 'land-reg', name: 'Land Owner Registration', desc: 'Survey number, village, taluk & concession title' },
    { id: 'quarry-enq', name: 'Quarry Enquiry', desc: 'Investor enquiry for pit lease concession' },
    { id: 'job-req', name: 'Job Requirement', desc: 'Manpower requisition for pit operations' },
    { id: 'market-enq', name: 'Marketplace Enquiry', desc: 'B2B building materials procurement request' },
    { id: 'order-req', name: 'Order Request', desc: 'Dispatch booking with preferred loading slot' },
    { id: 'feedback', name: 'Feedback', desc: 'Client satisfaction regarding sizing, moisture & delivery' }
  ];

  // 12 Field Types in Active Form
  const [fields, setFields] = useState<FormFieldItem[]>([
    { id: 'f-1', type: 'text', label: 'Company / Contractor Name', placeholder: 'e.g. Sobha Developers Ltd', required: true },
    { id: 'f-2', type: 'phone', label: 'Contact Phone Number', placeholder: '+91 98460 XXXXX', required: true },
    { id: 'f-3', type: 'email', label: 'Official Business Email', placeholder: 'procurement@company.com', required: false },
    { id: 'f-4', type: 'dropdown', label: 'Required Mineral Product', options: ['Laterite Cut Stone 12x8x6', '20mm Aggregate', 'M-Sand (Plastering)', 'Wet Mix Macadam (WMM)'], required: true },
    { id: 'f-5', type: 'number', label: 'Approximate Quantity (MT or Blocks)', placeholder: '2,500', required: true },
    { id: 'f-6', type: 'location', label: 'Site Unloading Location (GPS / Pin)', placeholder: 'Kozhikode Bypass, NH 66', required: true },
    { id: 'f-7', type: 'date', label: 'Required Delivery Schedule Date', required: true },
    { id: 'f-8', type: 'radio', label: 'Vehicle Haulage Mode', options: ['Self Tipper Pickup (Pithead)', 'RZ Managed Fleet Delivery'], required: true },
    { id: 'f-9', type: 'file', label: 'GST Certificate / PO Attachment', helpText: 'Upload PDF or JPG up to 10MB', required: false },
    { id: 'f-10', type: 'signature', label: 'Authorized Digital Signature Stamp', helpText: 'Sign with touchscreen or mouse', required: true }
  ]);

  const [responses, setResponses] = useState<FormResponseItem[]>(MOCK_FORM_RESPONSES);

  const handleAddField = (type: FormFieldItem['type'], label: string) => {
    const newField: FormFieldItem = {
      id: `f-${Date.now()}`,
      type,
      label,
      required: false,
      placeholder: `Enter ${label}...`
    };
    setFields([...fields, newField]);
    onToast?.(`Added field: ${label}`);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    onToast?.('Field removed');
  };

  const handleApplyTemplate = (tplName: string) => {
    setSelectedTemplate(tplName);
    setFormTitle(`${tplName} Intake Form`);
    onToast?.(`Loaded template: ${tplName}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <FormInput className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="bg-transparent font-bold text-white text-base focus:outline-none border-b border-transparent focus:border-amber-400"
              />
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                12 Field Types
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Preset: <strong>{selectedTemplate}</strong></span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-mono">Real-Time Sync: RZ Form &rarr; Responses &rarr; RZ Sheet &rarr; ERP</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Share */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'builder' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Builder
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'preview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Preview
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'responses' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Responses</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300">
                {responses.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => onToast?.('Public intake URL copied to clipboard: /forms/bulk-enquiry')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5 transition cursor-pointer font-sans"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Templates Selector Banner */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold">10 Industry Presets:</span>
          <select
            value={selectedTemplate}
            onChange={(e) => handleApplyTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-amber-400 font-bold rounded-xl px-3 py-1 focus:outline-none"
          >
            {FORM_TEMPLATES.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 font-sans text-xs">
          <span className="text-slate-400 text-[11px]">Next: Feed data automatically into</span>
          <button
            onClick={onNavigateToSheet}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition font-bold flex items-center gap-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Open RZ Sheet Pipeline</span>
          </button>
        </div>
      </div>

      {/* 1. BUILDER TAB */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Toolbox: 12 Field Types */}
          <div className="lg:col-span-4 space-y-3 font-mono text-xs">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">
              Form Builder Field Types (12 Components)
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'text', label: 'Text Field' },
                { type: 'number', label: 'Number' },
                { type: 'email', label: 'Email' },
                { type: 'phone', label: 'Phone' },
                { type: 'date', label: 'Date' },
                { type: 'dropdown', label: 'Dropdown' },
                { type: 'multiselect', label: 'Multi Select' },
                { type: 'checkbox', label: 'Checkbox' },
                { type: 'radio', label: 'Radio' },
                { type: 'file', label: 'File Upload' },
                { type: 'signature', label: 'Signature' },
                { type: 'location', label: 'Location GPS' }
              ].map((comp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddField(comp.type as any, comp.label)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition cursor-pointer flex items-center justify-between group"
                >
                  <span className="font-bold text-slate-300 group-hover:text-amber-400">{comp.label}</span>
                  <Plus className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-sans space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Automated CRM Bridging</span>
              </div>
              <p>
                Responses automatically initialize debtor records in Shared ERP Finance and trigger an instant quotation flow in RZ Word.
              </p>
            </div>
          </div>

          {/* Right Area: Form Canvas */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm">Form Canvas &bull; {fields.length} Active Fields</h4>
              <span className="text-[10px] text-slate-500 font-mono">Drag &amp; reorder ready</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-bold text-[10px] w-5">#{idx + 1}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-sans">{field.label}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 uppercase">
                          {field.type}
                        </span>
                        {field.required && (
                          <span className="text-[9px] text-rose-400 font-bold">*Required</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-sm">
                        {field.placeholder || field.helpText || 'Configured field'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                      title="Remove Field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div className="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center pb-4 border-b border-slate-800">
            <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 font-bold block mb-1">
              RZ® MINETRIX CLIENT INTAKE
            </span>
            <h2 className="text-xl font-black text-white">{formTitle}</h2>
            <p className="text-xs text-slate-400 mt-1">Please fill in your commercial mineral requirement below.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onToast?.('Demo enquiry submission received!'); setActiveTab('responses'); }} className="space-y-4 text-xs font-sans">
            {fields.map((f) => (
              <div key={f.id} className="space-y-1">
                <label className="font-bold text-slate-300 block">
                  {f.label} {f.required && <span className="text-rose-400">*</span>}
                </label>
                {f.type === 'dropdown' ? (
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400">
                    {f.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                  </select>
                ) : f.type === 'radio' ? (
                  <div className="space-y-1.5 pt-1">
                    {f.options?.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input type="radio" name={f.id} defaultChecked={i === 0} className="accent-amber-500" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : f.type === 'signature' ? (
                  <div className="h-20 rounded-xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                    <PenTool className="w-4 h-4 mb-1 text-cyan-400" />
                    <span className="text-[10px]">Draw customer e-signature inside this box</span>
                  </div>
                ) : f.type === 'location' ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 pr-8 text-white focus:outline-none focus:border-amber-400"
                    />
                    <MapPin className="w-4 h-4 text-rose-400 absolute right-3 top-3" />
                  </div>
                ) : (
                  <input
                    type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                    placeholder={f.placeholder}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Submit Commercial Requirement</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. RESPONSES DASHBOARD */}
      {activeTab === 'responses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div>
              <h4 className="font-bold text-white text-sm font-sans">
                Form Response Inbox &bull; Auto-synced to RZ Sheet
              </h4>
              <p className="text-slate-400 text-[11px]">
                {responses.length} customer requirements received and routed to Sales Desk.
              </p>
            </div>

            <div className="flex items-center gap-2 font-sans">
              <button
                onClick={() => {
                  const newRes: FormResponseItem = {
                    id: `RES-${Date.now().toString().slice(-4)}`,
                    formId: 'DOC-003',
                    submittedAt: 'Just now',
                    respondentName: 'Calicut Greenfield Developers',
                    respondentContact: '+91 98471 99000',
                    answers: { stoneGrade: 'Dressed Grade A Laterite', quantityRequired: '1,800 Blocks' },
                    status: 'New',
                    crmLinked: true
                  };
                  setResponses([newRes, ...responses]);
                  onToast?.('Simulated new customer submission synced to RZ Sheet!');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 transition cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simulate Submission</span>
              </button>
            </div>
          </div>

          {/* Response Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="p-3">ID &bull; TIME</th>
                  <th className="p-3">CUSTOMER / COMPANY</th>
                  <th className="p-3">PRODUCT REQUIREMENT</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {responses.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-3">
                      <span className="font-bold text-amber-400 block">{res.id}</span>
                      <span className="text-[10px] text-slate-500">{res.submittedAt}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-white block">{res.respondentName}</span>
                      <span className="text-[10px] text-slate-400">{res.respondentContact}</span>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{res.answers.stoneGrade}</div>
                      <div className="text-[10px] text-cyan-400">{res.answers.quantityRequired}</div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        res.status === 'Converted to Quote'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onToast?.(`Converted ${res.id} to Quotation draft in RZ Word`)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition cursor-pointer"
                      >
                        Convert to Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
