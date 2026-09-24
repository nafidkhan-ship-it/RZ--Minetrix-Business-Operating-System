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
  Download,
  Upload,
  Share2,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Eye,
  Lock,
  Layers,
  Table,
  BarChart3,
  Check,
  ChevronRight,
  FolderPlus,
  Play,
  RotateCcw,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileQuestion,
  AlertCircle,
  Home,
  Folder,
  Compass
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import { ProductivityFile, ProductivityToolId, VersionHistoryItem } from './types';
import { MOCK_PRODUCTIVITY_FILES } from './mockData';
import { ProductivityHubOverview } from './components/ProductivityHubOverview';
import { RzSheetView } from './components/RzSheetView';
import { RzWordView } from './components/RzWordView';
import { RzFormView } from './components/RzFormView';
import { RzSlideView } from './components/RzSlideView';
import { RzDriveView } from './components/RzDriveView';
import { RzPdfView } from './components/RzPdfView';
import { RzPrintView } from './components/RzPrintView';
import { SharingPermissionsModal } from './modals/SharingPermissionsModal';
import { VersionHistoryModal } from './modals/VersionHistoryModal';
import { CrossPlatformDocModal } from './modals/CrossPlatformDocModal';
import { ProductivityFlowsModal } from './modals/ProductivityFlowsModal';

interface RzProductivitySuiteProps {
  onNavigateSection?: (sectionId: SectionId) => void;
  initialTool?: ProductivityToolId;
}

export const RzProductivitySuite: React.FC<RzProductivitySuiteProps> = ({
  onNavigateSection,
  initialTool = 'hub'
}) => {
  const [activeTool, setActiveTool] = useState<ProductivityToolId>(initialTool || 'hub');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTool) {
      setActiveTool(initialTool);
    }
  }, [initialTool]);

  // Files State
  const [files, setFiles] = useState<ProductivityFile[]>(MOCK_PRODUCTIVITY_FILES);
  const [activeFile, setActiveFile] = useState<ProductivityFile | null>(MOCK_PRODUCTIVITY_FILES[0]);

  // Modals State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isCrossPlatformOpen, setIsCrossPlatformOpen] = useState(false);
  const [isFlowsModalOpen, setIsFlowsModalOpen] = useState(false);
  const [isMobileCreateOpen, setIsMobileCreateOpen] = useState(false);

  // Empty / Loading Simulation States (Requirement 15)
  const [simulatedEmptyState, setSimulatedEmptyState] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenFile = (file: ProductivityFile) => {
    setActiveFile(file);
    setActiveTool(file.tool);
    showToast(`Opened ${file.name}`);
  };

  const handleOpenShare = (file: ProductivityFile) => {
    setActiveFile(file);
    setIsShareModalOpen(true);
  };

  const handleOpenVersions = (file: ProductivityFile) => {
    setActiveFile(file);
    setIsVersionModalOpen(true);
  };

  const handleQuickAction = (action: string) => {
    setIsProcessingAction(action);
    setTimeout(() => {
      setIsProcessingAction(null);
      showToast(`${action} completed and saved to RZ Drive`);
    }, 800);
  };

  const handleCrossPlatformLaunch = (tool: ProductivityToolId, templateName: string, category: string) => {
    setActiveTool(tool);
    showToast(`Contextual workspace launched: ${templateName} (${category})`);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 relative font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Action Processing / Loading Overlay */}
      {isProcessingAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-3 font-mono text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
            <div className="font-bold text-white text-sm">{isProcessingAction}...</div>
            <p className="text-slate-400 text-[11px]">Synchronizing with RZ Enterprise Drive Vault</p>
          </div>
        </div>
      )}

      {/* Primary Productivity Suite Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold font-mono tracking-wider uppercase">
                Productivity Suite &bull; Shared Business Ecosystem
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                7 Integrated Tools
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                No Platform 11 &bull; Universal Core
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Layers className="w-8 h-8 text-cyan-400" />
              <span>RZ® MINETRIX Productivity Suite</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Create, edit, organize, share and print business documents from one workspace.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setIsCrossPlatformOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-bold flex items-center gap-1.5 transition cursor-pointer border border-cyan-500/20"
            >
              <Compass className="w-4 h-4" />
              <span>Cross-Platform Launch</span>
            </button>
            <button
              onClick={() => setIsFlowsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>3 Interactive Flows</span>
            </button>
          </div>
        </div>

        {/* 7 Tools Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-slate-800 scrollbar-none font-mono text-xs">
          {[
            { id: 'hub', label: 'Suite Hub', icon: Home, desc: 'Overview & Recent' },
            { id: 'sheet', label: 'RZ® Sheet', icon: FileSpreadsheet, desc: 'Live Database Grid' },
            { id: 'word', label: 'RZ® Word', icon: FileText, desc: 'Agreements & Docs' },
            { id: 'form', label: 'RZ® Form', icon: FormInput, desc: 'Customer Enquiries' },
            { id: 'slide', label: 'RZ® Slide', icon: Presentation, desc: 'Investor Decks' },
            { id: 'drive', label: 'RZ® Drive', icon: FolderSync, desc: 'Cloud DMS Vault' },
            { id: 'pdf', label: 'RZ® PDF', icon: FileType, desc: 'Sign, Split & Merge' },
            { id: 'print', label: 'RZ® Print', icon: Printer, desc: 'Thermal & A4 Center' }
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTool(t.id as ProductivityToolId);
                  showToast(`Switched to ${t.label}`);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulated Empty State Banner Toggle (Requirement 15) */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive State Inspector:</span>
          <span className="text-slate-500">Toggle between populated and pristine empty state</span>
        </div>
        <button
          onClick={() => {
            setSimulatedEmptyState(!simulatedEmptyState);
            showToast(simulatedEmptyState ? 'Restored demo files and templates' : 'Demonstrating pristine empty state');
          }}
          className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer text-[11px] ${
            simulatedEmptyState
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {simulatedEmptyState ? 'Show Populated Data' : 'Preview Empty State'}
        </button>
      </div>

      {/* RENDER THE ACTIVE TOOL VIEW */}
      {simulatedEmptyState ? (
        /* Polish Empty State Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
            <FileQuestion className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-white">No documents found in this directory</h3>
            <p className="text-xs text-slate-400">
              Your RZ® MINETRIX Workspace is initialized and awaiting its first record. Create or upload a file to begin.
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setSimulatedEmptyState(false);
                setActiveTool('sheet');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              + Create First Sheet
            </button>
            <button
              onClick={() => setSimulatedEmptyState(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
            >
              Restore Templates
            </button>
          </div>
        </div>
      ) : (
        <>
          {activeTool === 'hub' && (
            <ProductivityHubOverview
              files={files}
              onSelectTool={(tool) => setActiveTool(tool)}
              onOpenFile={handleOpenFile}
              onOpenShareModal={handleOpenShare}
              onOpenVersionModal={handleOpenVersions}
              onTriggerQuickAction={handleQuickAction}
              onOpenFlowsModal={() => setIsFlowsModalOpen(true)}
              onOpenCrossPlatformModal={() => setIsCrossPlatformOpen(true)}
            />
          )}

          {activeTool === 'sheet' && (
            <RzSheetView
              onOpenShareModal={handleOpenShare}
              onOpenVersionModal={handleOpenVersions}
              onOpenPrintCenter={() => setActiveTool('print')}
              onToast={showToast}
            />
          )}

          {activeTool === 'word' && (
            <RzWordView
              onOpenShareModal={handleOpenShare}
              onOpenPrintCenter={() => setActiveTool('print')}
              onToast={showToast}
            />
          )}

          {activeTool === 'form' && (
            <RzFormView
              onToast={showToast}
              onNavigateToSheet={() => setActiveTool('sheet')}
            />
          )}

          {activeTool === 'slide' && (
            <RzSlideView onToast={showToast} />
          )}

          {activeTool === 'drive' && (
            <RzDriveView
              files={files}
              onOpenFile={handleOpenFile}
              onOpenShareModal={handleOpenShare}
              onOpenVersionModal={handleOpenVersions}
              onToast={showToast}
            />
          )}

          {activeTool === 'pdf' && (
            <RzPdfView
              onOpenPrintCenter={() => setActiveTool('print')}
              onOpenShareModal={handleOpenShare}
              onToast={showToast}
            />
          )}

          {activeTool === 'print' && (
            <RzPrintView onToast={showToast} />
          )}
        </>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (Requirement 14) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 md:hidden flex items-center justify-around font-mono text-[10px]">
        <button
          onClick={() => setActiveTool('hub')}
          className={`flex flex-col items-center gap-1 ${activeTool === 'hub' ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTool('drive')}
          className={`flex flex-col items-center gap-1 ${activeTool === 'drive' ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <Folder className="w-4 h-4" />
          <span>Files</span>
        </button>

        {/* Floating Create Action Button */}
        <button
          onClick={() => setIsMobileCreateOpen(!isMobileCreateOpen)}
          className="w-10 h-10 -mt-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 cursor-pointer font-bold"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setActiveTool('hub');
            showToast('Showing recent documents');
          }}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <Clock className="w-4 h-4" />
          <span>Recent</span>
        </button>
        <button
          onClick={() => setIsFlowsModalOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <Sparkles className="w-4 h-4" />
          <span>Flows</span>
        </button>
      </div>

      {/* Mobile Create Action Sheet Modal */}
      {isMobileCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end md:hidden p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white">Create New Business Asset</span>
              <button onClick={() => setIsMobileCreateOpen(false)} className="text-slate-400">Cancel</button>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { tool: 'sheet', label: 'Sheet', icon: FileSpreadsheet, color: 'text-emerald-400' },
                { tool: 'word', label: 'Document', icon: FileText, color: 'text-blue-400' },
                { tool: 'form', label: 'Form', icon: FormInput, color: 'text-amber-400' },
                { tool: 'slide', label: 'Slide', icon: Presentation, color: 'text-purple-400' },
                { tool: 'pdf', label: 'PDF', icon: FileType, color: 'text-rose-400' },
                { tool: 'drive', label: 'Folder', icon: FolderPlus, color: 'text-cyan-400' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTool(item.tool as ProductivityToolId);
                      setIsMobileCreateOpen(false);
                      showToast(`Created new ${item.label}`);
                    }}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1 text-center"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-[10px] text-slate-200 font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <SharingPermissionsModal
        isOpen={isShareModalOpen}
        file={activeFile}
        onClose={() => setIsShareModalOpen(false)}
        onShareSuccess={showToast}
      />

      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        file={activeFile}
        onClose={() => setIsVersionModalOpen(false)}
        onRestoreVersion={(v) => showToast(`Restored version: ${v.version}`)}
      />

      <CrossPlatformDocModal
        isOpen={isCrossPlatformOpen}
        onClose={() => setIsCrossPlatformOpen(false)}
        onSelectAction={handleCrossPlatformLaunch}
      />

      <ProductivityFlowsModal
        isOpen={isFlowsModalOpen}
        onClose={() => setIsFlowsModalOpen(false)}
        onNavigateToTool={(t) => {
          setActiveTool(t);
          showToast(`Navigated to ${t.toUpperCase()}`);
        }}
      />
    </div>
  );
};
