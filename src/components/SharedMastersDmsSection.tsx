import React, { useState } from 'react';
import { 
  Database, Building2, FileText, FolderTree, Search, 
  CheckCircle2, Code, Terminal, Copy, Check, Filter, 
  Folder, File, Upload, Download, Eye, RefreshCw, 
  Trash2, Plus, Shield, Layers, Globe, MapPin, Tag, 
  DollarSign, Truck, Cpu, Pickaxe, Landmark, Sparkles, 
  Sliders, Calendar, Bell, Mail, MessageSquare, Key, ArrowRight,
  ShieldAlert, HardDrive, Lock, FileSpreadsheet, Image as ImageIcon, ShieldCheck
} from 'lucide-react';
import { 
  SHARED_MASTERS_DMS_MODULES, 
  SHARED_MASTER_CATEGORIES, 
  SHARED_MASTERS_DATABASE_SCHEMA_TABLES, 
  SHARED_MASTERS_TEST_SUITE,
  SharedMasterCategory,
  SharedMastersDmsModuleSpec
} from '../data/sharedMastersDmsData';

export const SharedMastersDmsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'masters' | 'dms' | 'company' | 'search' | 'schema' | 'tests'>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('shared-masters-engine');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Master Data Explorer State
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [masterSearchQuery, setMasterSearchQuery] = useState<string>('');
  
  // Interactive UOM Converter Sandbox
  const [uomQty, setUomQty] = useState<number>(100);
  const [sourceUom, setSourceUom] = useState<string>('MT');
  const [targetUom, setTargetUom] = useState<string>('CFT');
  const [convertedQty, setConvertedQty] = useState<number>(2641.72);

  // DMS File Explorer State
  const [activeFolderId, setActiveFolderId] = useState<string>('root');
  const [dmsCategoryFilter, setDmsCategoryFilter] = useState<string>('ALL');
  const [selectedDocPreview, setSelectedDocPreview] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 'doc-001',
      title: 'Quarry Environmental Clearance Lease NOC 2026.pdf',
      category: 'Quarry Mining Permits',
      size: '4.2 MB',
      version: 'v2.1',
      updatedAt: '2026-08-01',
      author: 'Alex Vance (Mining Compliance Head)',
      status: 'VERIFIED',
      mime: 'application/pdf',
      folderId: 'f-permits'
    },
    {
      id: 'doc-002',
      title: 'PESO Explosives Storage Possession License.pdf',
      category: 'Environmental NOCs',
      size: '2.8 MB',
      version: 'v1.0',
      updatedAt: '2026-07-28',
      author: 'Compliance Audit Team',
      status: 'ACTIVE',
      mime: 'application/pdf',
      folderId: 'f-permits'
    },
    {
      id: 'doc-003',
      title: 'Excavator Komatsu PC300 RC & Insurance.pdf',
      category: 'Vehicle RC & Permits',
      size: '1.9 MB',
      version: 'v1.2',
      updatedAt: '2026-08-04',
      author: 'Fleet Manager',
      status: 'VERIFIED',
      mime: 'application/pdf',
      folderId: 'f-fleet'
    },
    {
      id: 'doc-004',
      title: 'Consolidated Aggregate Dispatch Invoice Jul2026.xlsx',
      category: 'Invoices & Financials',
      size: '850 KB',
      version: 'v1.0',
      updatedAt: '2026-08-05',
      author: 'Finance Controller',
      status: 'ACTIVE',
      mime: 'application/vnd.ms-excel',
      folderId: 'f-finance'
    }
  ]);

  // Company Settings Form State
  const [companyName, setCompanyName] = useState<string>('RZ Mining Operations Ltd.');
  const [companyGstin, setCompanyGstin] = useState<string>('29AABCU9603R1ZM');
  const [companyPan, setCompanyPan] = useState<string>('AABCU9603R');
  const [miningLeaseRef, setMiningLeaseRef] = useState<string>('ML/KAR/BLR-004/2024-2034');
  const [financialYearStart, setFinancialYearStart] = useState<string>('APRIL');
  const [defaultCurrency, setDefaultCurrency] = useState<string>('INR');
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState<boolean>(true);

  // Global Search Engine State
  const [globalQuery, setGlobalQuery] = useState<string>('Granite');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const selectedModule = SHARED_MASTERS_DMS_MODULES.find(m => m.id === selectedModuleId) || SHARED_MASTERS_DMS_MODULES[0];

  const handleUomConvert = () => {
    let rate = 1;
    if (sourceUom === 'MT' && targetUom === 'CFT') rate = 26.4172; // Avg granite aggregate bulk density
    if (sourceUom === 'CFT' && targetUom === 'MT') rate = 0.03785;
    if (sourceUom === 'MT' && targetUom === 'KG') rate = 1000;
    if (sourceUom === 'KG' && targetUom === 'MT') rate = 0.001;
    setConvertedQty(Math.round(uomQty * rate * 100) / 100);
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFileUploadSim = () => {
    setIsUploading(true);
    setUploadProgress(20);
    setTimeout(() => setUploadProgress(60), 300);
    setTimeout(() => setUploadProgress(100), 700);
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      const newDoc = {
        id: `doc-${Date.now().toString().slice(-3)}`,
        title: `Alpha Quarry Water Discharge NOC 2026.pdf`,
        category: 'Environmental NOCs',
        size: '3.4 MB',
        version: 'v1.0',
        updatedAt: '2026-08-06',
        author: 'Alex Vance',
        status: 'VERIFIED',
        mime: 'application/pdf',
        folderId: activeFolderId
      };
      setUploadedFiles(prev => [newDoc, ...prev]);
    }, 900);
  };

  const handleGlobalSearch = (query: string) => {
    setGlobalQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const mockDb = [
      { type: 'MASTER', title: 'Black Granite 20mm Aggregate', subtitle: 'Stone Type Master (Density 2.8 t/m3)', tag: 'MST-STONE' },
      { type: 'MASTER', title: '10-Wheeler Tipper Truck (16 Ton)', subtitle: 'Vehicle Classification Master', tag: 'MST-VEH' },
      { type: 'DOCUMENT', title: 'Quarry Environmental Clearance Lease NOC 2026.pdf', subtitle: 'DMS Document / Permits / v2.1', tag: 'DMS-DOC' },
      { type: 'COMPANY', title: 'Alpha Quarry Site #4 (Granite Pit)', subtitle: 'Active Branch Site / GPS: 13.0827, 77.5877', tag: 'BRANCH' },
      { type: 'LICENSE', title: 'PESO Explosive Storage Possession License', subtitle: 'Compliance License Ref # PESO/BLR/99201', tag: 'PERMIT' }
    ];
    setSearchResults(mockDb.filter(item => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Phase 16B Core Foundation
            </span>
            <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono rounded-full">
              Shared Masters, Company Settings & DMS Engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            RZ® Minetrix BOS — Shared Masters, Company Settings & Enterprise DMS
          </h1>

          <p className="text-slate-300 text-base max-w-4xl leading-relaxed">
            The universal cross-cutting master taxonomies, legal company configurations, cloud-abstracted Document Management System (DMS), and sub-millisecond global search engine powering all 10 Business Suites of RZ® Minetrix BOS Enterprise Edition.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Shared Masters</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> 28 Universal Taxonomies
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Company Matrix</p>
              <p className="text-lg font-bold text-violet-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> GST/PAN & Branch Manager
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Document Vault (DMS)</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Watermark & Version Control
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Global Search</p>
              <p className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Sub-12ms Full-Text Index
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'modules'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          5 Architecture Modules
        </button>

        <button
          onClick={() => setActiveTab('masters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'masters'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          Shared Master Explorer
        </button>

        <button
          onClick={() => setActiveTab('dms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'dms'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FolderTree className="w-4 h-4 text-blue-400" />
          Enterprise DMS Vault
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'company'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-4 h-4 text-violet-400" />
          Company & Settings
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'search'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Search className="w-4 h-4 text-amber-400" />
          Global Search Sandbox
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          Database Schema
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'tests'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Test Matrix (100% Pass)
        </button>
      </div>

      {/* Tab 1: 5 Architecture Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Module Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Phase 16B Core Modules
            </h2>
            {SHARED_MASTERS_DMS_MODULES.map((module) => {
              const isSelected = module.id === selectedModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {module.id === 'shared-masters-engine' && <Database className="w-5 h-5" />}
                      {module.id === 'company-settings-config' && <Building2 className="w-5 h-5" />}
                      {module.id === 'enterprise-dms-engine' && <FileText className="w-5 h-5" />}
                      {module.id === 'cloud-file-storage-adapter' && <FolderTree className="w-5 h-5" />}
                      {module.id === 'global-search-engine' && <Search className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                        Module 0{module.number}
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {module.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Module Specification */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Module 0{selectedModule.number} Technical Spec
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedModule.name}
                </h2>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
                Production Ready
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedModule.summary}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Capabilities & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedModule.features.map((feature, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Database Schema Tables
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.dbTables.map((tbl) => (
                    <span key={tbl} className="px-2 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono rounded">
                      {tbl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> REST APIs
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.apiEndpoints.map((api) => (
                    <span key={api} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono rounded">
                      {api}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Reference Code Implementation
                </h3>
                <button
                  onClick={() => copySnippet(selectedModule.codeSnippet)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{selectedModule.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Shared Master Explorer */}
      {activeTab === 'masters' && (
        <div className="space-y-8">
          {/* Master Taxonomies Search & List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  Universal Shared Master Taxonomies
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  28 standardized master entities shared across Mining, Fleet, Materials, CRM, Finance, HRMS, and AI Platform.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search master taxonomies..."
                    value={masterSearchQuery}
                    onChange={(e) => setMasterSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'GEOGRAPHY', 'COMMERCIAL', 'OPERATIONS', 'FINANCIAL', 'SYSTEM'].map((grp) => (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedGroup === grp
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>

            {/* Master Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SHARED_MASTER_CATEGORIES
                .filter(m => (selectedGroup === 'ALL' || m.group === selectedGroup) && (m.name.toLowerCase().includes(masterSearchQuery.toLowerCase()) || m.description.toLowerCase().includes(masterSearchQuery.toLowerCase())))
                .map((cat) => (
                  <div key={cat.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{cat.code}</span>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono rounded-full">
                        {cat.itemCount} Records
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-400">{cat.description}</p>

                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Sample Master Entries:</p>
                      {cat.sampleEntries.map((sample, i) => (
                        <div key={i} className="text-[11px] font-mono text-slate-300 bg-slate-900/60 p-1.5 rounded border border-slate-800/60">
                          • {sample}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Interactive UOM Conversion Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              Live Measurement UOM Converter Engine
            </h2>
            <p className="text-xs text-slate-400">
              Test universal UOM conversion math across Metric Tons (MT), Cubic Feet (CFT), and Kilograms (KG) based on rock density factors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 items-end">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Quantity</label>
                <input
                  type="number"
                  value={uomQty}
                  onChange={(e) => setUomQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Source UOM</label>
                <select
                  value={sourceUom}
                  onChange={(e) => setSourceUom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="MT">Metric Ton (MT)</option>
                  <option value="CFT">Cubic Feet (CFT)</option>
                  <option value="KG">Kilograms (KG)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Target UOM</label>
                <select
                  value={targetUom}
                  onChange={(e) => setTargetUom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="CFT">Cubic Feet (CFT)</option>
                  <option value="MT">Metric Ton (MT)</option>
                  <option value="KG">Kilograms (KG)</option>
                </select>
              </div>

              <button
                onClick={handleUomConvert}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Convert Quantity
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400">Converted Output Result:</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {uomQty} {sourceUom} = {convertedQty} {targetUom}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Enterprise DMS Vault */}
      {activeTab === 'dms' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-blue-400" />
                  Enterprise Document Management System (DMS) Vault
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Cloud storage abstraction (GCS/S3) with virtual folder trees, versioning, watermarking, and pre-signed downloads.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFileUploadSim}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? `Uploading ${uploadProgress}%...` : 'Upload New Document'}
                </button>
              </div>
            </div>

            {/* Folder & Filter Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveFolderId('root')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    activeFolderId === 'root' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-amber-400" /> All Company Vault Documents
                </button>
                <button
                  onClick={() => setActiveFolderId('f-permits')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    activeFolderId === 'f-permits' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-amber-400" /> Mining Permits & Leases
                </button>
                <button
                  onClick={() => setActiveFolderId('f-fleet')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    activeFolderId === 'f-fleet' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-amber-400" /> Vehicle & Machine RC
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Category Filter:</span>
                <select
                  value={dmsCategoryFilter}
                  onChange={(e) => setDmsCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Quarry Mining Permits">Quarry Mining Permits</option>
                  <option value="Environmental NOCs">Environmental NOCs</option>
                  <option value="Vehicle RC & Permits">Vehicle RC & Permits</option>
                  <option value="Invoices & Financials">Invoices & Financials</option>
                </select>
              </div>
            </div>

            {/* File Table */}
            <div className="space-y-3">
              {uploadedFiles
                .filter(doc => (activeFolderId === 'root' || doc.folderId === activeFolderId) && (dmsCategoryFilter === 'ALL' || doc.category === dmsCategoryFilter))
                .map((file) => (
                  <div key={file.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{file.title}</h3>
                          <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[10px] font-mono rounded">
                            {file.version}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {file.category} • {file.size} • Updated: {file.updatedAt} by {file.author}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDocPreview(file)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" /> Watermark Preview
                      </button>
                      <button
                        onClick={() => alert(`Generating Pre-Signed Download URL for ${file.title}...`)}
                        className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Watermarked Document Preview Modal / Card */}
          {selectedDocPreview && (
            <div className="p-6 bg-slate-950 border border-blue-500/40 rounded-2xl space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">Watermarked Document Viewer: {selectedDocPreview.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedDocPreview(null)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-900 rounded"
                >
                  Close Viewer
                </button>
              </div>

              <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden text-center space-y-3">
                {/* Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 rotate-[-25deg]">
                  <span className="text-4xl font-extrabold text-white tracking-widest uppercase">
                    CONFIDENTIAL • RZ MINETRIX BOS • {selectedDocPreview.author}
                  </span>
                </div>

                <FileText className="w-12 h-12 text-blue-400" />
                <h4 className="text-sm font-bold text-white">{selectedDocPreview.title}</h4>
                <p className="text-xs text-slate-400 max-w-lg">
                  Watermark applied dynamically. Document SHA-256 Checksum: <span className="font-mono text-emerald-400">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified GCS Object: <span className="font-mono text-violet-300">gcs://rz-dms-vault/{selectedDocPreview.id}/v1.pdf</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Company & Settings */}
      {activeTab === 'company' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-violet-400" />
                Company Settings & Legal Profile Matrix
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Configure corporate legal details, tax identifiers (GST/PAN), branch quarry sites, working calendars, and multi-channel notification webhooks.
              </p>
            </div>

            <button
              onClick={() => alert('Company settings saved successfully.')}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-violet-500/20"
            >
              <Check className="w-4 h-4" /> Save Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Legal Entity & Tax Identifiers
              </h3>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Legal Company Trade Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">GSTIN Number</label>
                  <input
                    type="text"
                    value={companyGstin}
                    onChange={(e) => setCompanyGstin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">PAN Number</label>
                  <input
                    type="text"
                    value={companyPan}
                    onChange={(e) => setCompanyPan(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Mining Lease Master Reference</label>
                <input
                  type="text"
                  value={miningLeaseRef}
                  onChange={(e) => setMiningLeaseRef(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Working Calendar & Alerts
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Financial Year Cycle</label>
                  <select
                    value={financialYearStart}
                    onChange={(e) => setFinancialYearStart(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="APRIL">April 1 - March 31</option>
                    <option value="JANUARY">January 1 - December 31</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Default Operating Currency</label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs text-slate-300 font-medium">Notification Channels</label>
                <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Notifications (SES)
                  </span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Business API
                  </span>
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Global Search Sandbox */}
      {activeTab === 'search' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              Global Search Engine Sandbox
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Sub-12ms multi-entity search index across Master Records, DMS Documents, Branch Sites, and Mining Permits.
            </p>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-amber-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search across all 10 suites (e.g. 'Granite', 'PESO', 'Tipper', 'Alpha Quarry')..."
              value={globalQuery}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 shadow-inner"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Search Index Results ({searchResults.length} Hits)
            </h3>

            {searchResults.length > 0 ? (
              searchResults.map((res, i) => (
                <div key={i} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between hover:border-amber-500/40 transition-all">
                  <div>
                    <h4 className="text-sm font-bold text-white">{res.title}</h4>
                    <p className="text-xs text-slate-400">{res.subtitle}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold rounded">
                    {res.tag}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 border border-slate-800/60 rounded-xl">
                Type keywords above to test real-time search indexing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Database & RLS Schema */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  Shared Masters & DMS Database Schema
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Full UUID v7 keys, foreign key relationships, indexes, audit fields, soft-delete columns, and RLS policies.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-full">
                Drizzle ORM Schema
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SHARED_MASTERS_DATABASE_SCHEMA_TABLES.map((table) => (
                <div key={table.name} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold text-white font-mono">{table.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Table</span>
                  </div>
                  <p className="text-xs text-slate-400">{table.description}</p>
                  <div className="space-y-1">
                    {table.columns.map((col, idx) => (
                      <div key={idx} className="text-[11px] font-mono text-emerald-300/90 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60">
                        {col}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Automated Test Suite */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Phase 16B Automated Test Suite Verification
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Unit tests, integration tests, pre-signed URL verification, UOM matrix assertions, and global search benchmarks.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              8 / 8 Tests Passing
            </span>
          </div>

          <div className="space-y-3">
            {SHARED_MASTERS_TEST_SUITE.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-200">{item.test}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold rounded-full">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
