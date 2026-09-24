import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  FormInput,
  Presentation,
  FolderSync,
  FileType,
  Printer,
  Plus,
  Upload,
  Search,
  Filter,
  Download,
  Share2,
  Trash2,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  CheckCircle2,
  Building2,
  Lock,
  Globe,
  Users
} from 'lucide-react';
import { ProductivityFile, ProductivityToolId } from '../types';

interface ProductivityHubOverviewProps {
  files: ProductivityFile[];
  onSelectTool: (tool: ProductivityToolId) => void;
  onOpenFile: (file: ProductivityFile) => void;
  onOpenShareModal: (file: ProductivityFile) => void;
  onOpenVersionModal: (file: ProductivityFile) => void;
  onTriggerQuickAction: (action: string) => void;
  onOpenFlowsModal: () => void;
  onOpenCrossPlatformModal: () => void;
}

export const ProductivityHubOverview: React.FC<ProductivityHubOverviewProps> = ({
  files,
  onSelectTool,
  onOpenFile,
  onOpenShareModal,
  onOpenVersionModal,
  onTriggerQuickAction,
  onOpenFlowsModal,
  onOpenCrossPlatformModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFiles = files.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const getToolIcon = (tool: ProductivityToolId) => {
    switch (tool) {
      case 'sheet': return FileSpreadsheet;
      case 'word': return FileText;
      case 'form': return FormInput;
      case 'slide': return Presentation;
      case 'drive': return FolderSync;
      case 'pdf': return FileType;
      case 'print': return Printer;
      default: return FileText;
    }
  };

  const getToolColor = (tool: ProductivityToolId) => {
    switch (tool) {
      case 'sheet': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'word': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'form': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'slide': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'drive': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'pdf': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'print': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* 7 Application Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span>7 Integrated Business Applications</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 lowercase">
              native ecosystem tools
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCrossPlatformModal}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-cyan-500/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cross-Platform Launcher</span>
            </button>
            <button
              onClick={onOpenFlowsModal}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3 Interactive Flows</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            { id: 'sheet', title: 'RZ® Sheet', subtitle: 'Live Database Grid', count: '14 Active', icon: FileSpreadsheet, color: 'text-emerald-400 hover:border-emerald-500/50' },
            { id: 'word', title: 'RZ® Word', subtitle: 'Agreements & Docs', count: '9 Drafts', icon: FileText, color: 'text-blue-400 hover:border-blue-500/50' },
            { id: 'form', title: 'RZ® Form', subtitle: 'Intake Enquiries', count: '3 Live', icon: FormInput, color: 'text-amber-400 hover:border-amber-500/50' },
            { id: 'slide', title: 'RZ® Slide', subtitle: 'Investor Pitch', count: '4 Decks', icon: Presentation, color: 'text-purple-400 hover:border-purple-500/50' },
            { id: 'drive', title: 'RZ® Drive', subtitle: 'Cloud Vault & DMS', count: '388 Files', icon: FolderSync, color: 'text-cyan-400 hover:border-cyan-500/50' },
            { id: 'pdf', title: 'RZ® PDF', subtitle: 'Sign & Merge', count: '11 Bundles', icon: FileType, color: 'text-rose-400 hover:border-rose-500/50' },
            { id: 'print', title: 'RZ® Print', subtitle: 'Thermal & A4 Center', count: '8 Presets', icon: Printer, color: 'text-yellow-400 hover:border-yellow-500/50' }
          ].map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                onClick={() => onSelectTool(app.id as ProductivityToolId)}
                className={`p-4 rounded-3xl bg-slate-900 border border-slate-800 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-xl ${app.color}`}
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition truncate">
                  {app.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{app.subtitle}</p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{app.count}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Hub Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="font-bold text-amber-400">Quick Creation:</span>
          <span>Initiate a fresh business asset</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: '+ New Sheet', tool: 'sheet', action: 'Create New Sheet' },
            { label: '+ New Document', tool: 'word', action: 'Create New Document' },
            { label: '+ New Form', tool: 'form', action: 'Create New Form' },
            { label: '+ New Presentation', tool: 'slide', action: 'Create New Presentation' },
            { label: '+ Upload File', tool: 'drive', action: 'Upload File to Drive' },
            { label: '+ Create PDF', tool: 'pdf', action: 'Create PDF Dossier' },
            { label: '+ Print Ticket', tool: 'print', action: 'Print Weighbridge Slip' }
          ].map((btn, bIdx) => (
            <button
              key={bIdx}
              onClick={() => {
                onTriggerQuickAction(btn.action);
                onSelectTool(btn.tool as ProductivityToolId);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
            >
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Connected ERP Data Flow Visual Matrix */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">
            Future Enterprise Integration &bull; 5 Native Pipelines
          </span>
          <span className="text-[10px] text-slate-500">Zero duplicate data entry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {[
            { from: 'RZ Sheet', to: 'Customer Ledger', target: 'ERP Finance', color: 'border-emerald-500/30 text-emerald-400' },
            { from: 'RZ Word', to: 'Land Agreement', target: 'Quarry Land', color: 'border-blue-500/30 text-blue-400' },
            { from: 'RZ Form', to: 'Customer Enquiry', target: 'CRM Pipeline', color: 'border-amber-500/30 text-amber-400' },
            { from: 'RZ PDF', to: 'Commercial Invoice', target: 'Treasury & Tax', color: 'border-rose-500/30 text-rose-400' },
            { from: 'RZ Print', to: 'Gate Pass QR', target: 'Pit Weighbridge', color: 'border-yellow-500/30 text-yellow-400' }
          ].map((pipe, pIdx) => (
            <div key={pIdx} className={`p-3 rounded-2xl bg-slate-950 border ${pipe.color} space-y-1`}>
              <div className="font-bold text-white text-[11px] flex items-center justify-between">
                <span>{pipe.from}</span>
                <span className="text-slate-500">&rarr;</span>
                <span className="text-slate-300">{pipe.target}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">Preset: {pipe.to}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Files Table & Global Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 font-sans">
          <div>
            <h3 className="font-bold text-white text-base">Recent Business Documents</h3>
            <p className="text-xs text-slate-400">
              Files modified across extraction pits, plant scales, dispatch offices and finance desks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files, sheets, templates..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-400 w-48 sm:w-64 font-mono"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono focus:outline-none"
            >
              <option value="all">All Domains</option>
              <option value="quarry">Quarry</option>
              <option value="crusher">Crusher</option>
              <option value="vehicle">Vehicle</option>
              <option value="contracts">Contracts</option>
              <option value="invoices">Invoices</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>
          </div>
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                <th className="pb-2.5 font-bold">NAME &bull; TYPE</th>
                <th className="pb-2.5 font-bold">OWNER</th>
                <th className="pb-2.5 font-bold">LOCATION</th>
                <th className="pb-2.5 font-bold">MODIFIED</th>
                <th className="pb-2.5 font-bold">SHARING</th>
                <th className="pb-2.5 text-right font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFiles.map((file) => {
                const Icon = getToolIcon(file.tool);
                const colorClasses = getToolColor(file.tool);
                return (
                  <tr key={file.id} className="hover:bg-slate-850/60 transition group">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${colorClasses}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate max-w-xs sm:max-w-sm">
                          <button
                            onClick={() => onOpenFile(file)}
                            className="font-bold text-white hover:text-amber-400 transition truncate block text-left cursor-pointer"
                          >
                            {file.name}
                          </button>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{file.size}</span>
                            <span>&bull;</span>
                            <span className="text-cyan-400">{file.erpSource}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-slate-300">
                      <span className="truncate block max-w-xs">{file.owner}</span>
                    </td>

                    <td className="py-3 px-2 text-slate-400">
                      <span className="text-[11px] truncate block">{file.location}</span>
                    </td>

                    <td className="py-3 px-2 text-slate-500">
                      <span>{file.lastModified}</span>
                    </td>

                    <td className="py-3 px-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1 ${
                        file.sharedStatus === 'public'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : file.sharedStatus === 'organization'
                          ? 'bg-amber-500/20 text-amber-300'
                          : file.sharedStatus === 'shared'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {file.sharedStatus === 'public' && <Globe className="w-2.5 h-2.5" />}
                        {file.sharedStatus === 'organization' && <Building2 className="w-2.5 h-2.5" />}
                        {file.sharedStatus === 'shared' && <Users className="w-2.5 h-2.5" />}
                        {file.sharedStatus === 'private' && <Lock className="w-2.5 h-2.5" />}
                        <span>{file.sharedStatus}</span>
                      </span>
                    </td>

                    <td className="py-3 pl-2 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => onOpenShareModal(file)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                          title="Share & Permissions"
                        >
                          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                        <button
                          onClick={() => onOpenVersionModal(file)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                          title="Version History"
                        >
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                        <button
                          onClick={() => onOpenFile(file)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition font-bold text-[10px] cursor-pointer"
                        >
                          Open
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
