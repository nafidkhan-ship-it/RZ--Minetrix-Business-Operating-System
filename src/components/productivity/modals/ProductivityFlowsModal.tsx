import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  FormInput,
  FolderSync,
  FileType,
  Printer,
  Share2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ProductivityToolId } from '../types';

interface ProductivityFlowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTool?: (tool: ProductivityToolId) => void;
}

export const ProductivityFlowsModal: React.FC<ProductivityFlowsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTool
}) => {
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!isOpen) return null;

  const FLOWS = [
    {
      id: 'flow-1',
      title: '1. Drive to Printable Sheet Lifecycle',
      badge: 'Core Productivity Chain',
      color: 'text-amber-400',
      description: 'PRODUCTIVITY → RZ DRIVE → NEW → RZ SHEET → ENTER DATA → SAVE → SHARE → RZ PDF → PRINT',
      steps: [
        {
          stage: 'PRODUCTIVITY',
          tool: 'hub',
          label: 'Open Productivity Suite Hub',
          detail: 'User accesses /productivity dashboard featuring 7 integrated application cards and quick actions.',
          preview: 'Productivity Suite Command Center initialized with 7 apps ready.'
        },
        {
          stage: 'RZ DRIVE',
          tool: 'drive',
          label: 'Navigate to RZ Drive Vault',
          detail: 'Enter cloud repository and browse to "Quarry" folder holding 18 active concession dossiers.',
          preview: 'Folder: My Drive / Quarry selected.'
        },
        {
          stage: 'NEW',
          tool: 'sheet',
          label: 'Create New File',
          detail: 'Click "+ New Sheet" and select "Quarry Load Register" business template.',
          preview: 'Template Loaded: Quarry Load Register (Columns: Date, Pit, Block Type, Qty, Rate, Total).'
        },
        {
          stage: 'RZ SHEET',
          tool: 'sheet',
          label: 'Enter Grid Data & Formulas',
          detail: 'Bi-directional grid recalculates SUM and AVG formulas; cell E6 evaluated as ₹202,200.',
          preview: 'Formula: =SUM(D2:D8) evaluated. Connected to Kasaragod Pit #01 sensor.'
        },
        {
          stage: 'SAVE',
          tool: 'sheet',
          label: 'Commit Changes to Cloud',
          detail: 'File saved as "Laterite_Extraction_Log_Kasaragod_Pit01.rzs" with version 4.2 generated.',
          preview: 'Version 4.2 snapshot saved. Author: Nafid Khan (MD).'
        },
        {
          stage: 'SHARE',
          tool: 'drive',
          label: 'Grant Collaborative Permissions',
          detail: 'Sharing dialogue assigns "Editor" rights to Accounts Department with 30-day link expiry.',
          preview: 'Access Granted: Anjali Menon (Accounts) assigned Editor permission.'
        },
        {
          stage: 'RZ PDF',
          tool: 'pdf',
          label: 'Compile to Verifiable PDF',
          detail: 'RZ PDF engine renders vector PDF with QR verification stamp and tamper-proof hash.',
          preview: 'Compiled: Laterite_Extraction_Log.pdf (480 KB) with digital audit watermark.'
        },
        {
          stage: 'PRINT',
          tool: 'print',
          label: 'Dispatch to Print Center',
          detail: 'RZ Print center outputs A4 Triplicate document ready for physical vehicle cabin dispatch.',
          preview: 'Print Job Queued: A4 Triplicate (Original, Transporter, Supplier).'
        }
      ]
    },
    {
      id: 'flow-2',
      title: '2. Form Intake to ERP Pipeline',
      badge: 'Inward Commercial Workflow',
      color: 'text-cyan-400',
      description: 'RZ FORM → CUSTOMER ENQUIRY → RESPONSE → RZ SHEET → CRM / ERP',
      steps: [
        {
          stage: 'RZ FORM',
          tool: 'form',
          label: 'Publish Dynamic Intake Form',
          detail: 'Form Builder configures "Customer Bulk Stone Enquiry" with stone grade, location & quantity fields.',
          preview: 'Intake URL active: /productivity/form (Public link generated).'
        },
        {
          stage: 'CUSTOMER ENQUIRY',
          tool: 'form',
          label: 'Client Submits Requirement',
          detail: 'Thomas Mathew (Sobha Developers Ltd) requests 2,500 blocks of Dressed Grade A Laterite.',
          preview: 'Intake Received: Response #RES-901 from Sobha Developers (+91 94471 28901).'
        },
        {
          stage: 'RESPONSE',
          tool: 'form',
          label: 'Intake Dashboard Notification',
          detail: 'System triggers real-time sound alert and records response in Form Response Dashboard.',
          preview: 'Logged to Responses Table: Status set to "Under Review".'
        },
        {
          stage: 'RZ SHEET',
          tool: 'sheet',
          label: 'Auto-Sync to Sales Register Sheet',
          detail: 'Response automatically creates a new row in "Commercial Sales Pipeline" spreadsheet.',
          preview: 'Row Appended in Sheet: Sobha Developers | 2,500 pcs | Kozhikode Bypass.'
        },
        {
          stage: 'CRM / ERP',
          tool: 'hub',
          label: 'Convert to Live Sales Order in ERP',
          detail: 'One-click action converts enquiry row into formal Quotation #QT-901 in Shared ERP Core.',
          preview: 'Quotation Created: Sent to Sobha via RZ® Chat with Rate Engine price ₹42/pc.'
        }
      ]
    },
    {
      id: 'flow-3',
      title: '3. Quarry Concession to Archive Flow',
      badge: 'Legal & Compliance Lifecycle',
      color: 'text-purple-400',
      description: 'QUARRY → LAND AGREEMENT → RZ WORD → RZ PDF → RZ DRIVE → RZ PRINT',
      steps: [
        {
          stage: 'QUARRY',
          tool: 'hub',
          label: 'Quarry Land Concession Trigger',
          detail: 'Platform 07 initiates new agreement for Survey No. 142/3A, Kasaragod District.',
          preview: 'Landowner K. P. Moideenkutty identified from Master Person registry.'
        },
        {
          stage: 'LAND AGREEMENT',
          tool: 'word',
          label: 'Load Legal Draft Template',
          detail: 'System opens "Mining Lease Concession Agreement" preset in RZ Word editor.',
          preview: 'Document Draft Loaded with 10 legal articles and royalty calculation clauses.'
        },
        {
          stage: 'RZ WORD',
          tool: 'word',
          label: 'Customize Terms & Digital Signatures',
          detail: 'Set royalty rate to ₹4.50/block and assign signatory Mohammed K. Al-Rayyan.',
          preview: 'Word Canvas Rendered with dual-signatory verification block.'
        },
        {
          stage: 'RZ PDF',
          tool: 'pdf',
          label: 'Export to Cryptographic PDF',
          detail: 'Export document with SHA-256 digital signature stamp and biometric confirmation.',
          preview: 'PDF Sealed: Kasaragod_Pit_Mining_Lease_2026_2036.pdf.'
        },
        {
          stage: 'RZ DRIVE',
          tool: 'drive',
          label: 'Archive to Secure Cloud Vault',
          detail: 'File organized into "My Drive / Contracts" with automated daily backup snapshot.',
          preview: 'Encrypted & Stored in Contracts Folder (Tags: Legal, Concession, Active).'
        },
        {
          stage: 'RZ PRINT',
          tool: 'print',
          label: 'Print Stamp Paper Legal Copy',
          detail: 'Print Center generates legal folio format ready for registrar execution.',
          preview: 'Print Output: Legal Folio with 1-inch margins and stamp duty header.'
        }
      ]
    }
  ];

  const currentFlow = FLOWS[activeFlowIndex];

  const handleNextStep = () => {
    if (currentStepIndex < currentFlow.steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
  };

  const handleResetFlow = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  };

  const handleSelectFlow = (idx: number) => {
    setActiveFlowIndex(idx);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Interactive Productivity Walkthroughs</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  3 Flagship Flows
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Demonstrates how documents, forms, sheets, PDFs and print centers interact seamlessly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flow Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
          {FLOWS.map((fl, idx) => (
            <button
              key={fl.id}
              onClick={() => handleSelectFlow(idx)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                activeFlowIndex === idx
                  ? 'bg-amber-500/10 border-amber-500/50 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{fl.title}</span>
                <span className={`text-[10px] ${fl.color} font-mono font-bold`}>Active</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 truncate">{fl.badge}</div>
            </button>
          ))}
        </div>

        {/* Flow Chain Breadcrumb / Overview */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-400/90 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
          {currentFlow.description}
        </div>

        {/* Step-by-Step Interactive Progression */}
        <div className="overflow-y-auto space-y-3 pr-1 scrollbar-none flex-1 font-mono text-xs">
          {currentFlow.steps.map((st, sIdx) => {
            const isCompleted = completedSteps.includes(sIdx);
            const isCurrent = currentStepIndex === sIdx;
            return (
              <div
                key={sIdx}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-950 border-amber-500/60 shadow-lg shadow-amber-500/5'
                    : isCompleted
                    ? 'bg-slate-950/80 border-emerald-500/30 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : sIdx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-sans">{st.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                          {st.stage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-0.5 leading-relaxed">
                        {st.detail}
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <button
                      onClick={() => {
                        onNavigateToTool?.(st.tool as ProductivityToolId);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold shrink-0 flex items-center gap-1 transition cursor-pointer font-sans"
                    >
                      <span>Jump to Tool</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Live Preview Box */}
                {(isCurrent || isCompleted) && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-emerald-400/90 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="truncate">{st.preview}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0 font-sans">
          <button
            onClick={handleResetFlow}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Steps</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleNextStep}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>{currentStepIndex === currentFlow.steps.length - 1 ? 'Flow Completed' : 'Next Stage'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
