import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Truck,
  QrCode,
  Sliders,
  DollarSign,
  Receipt,
  FileText,
  ShieldCheck,
  Package
} from 'lucide-react';
import { CommerceSubTab } from '../types';

interface CommerceInteractiveFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
}

export const CommerceInteractiveFlowModal: React.FC<CommerceInteractiveFlowModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onToast
}) => {
  const [selectedFlowIndex, setSelectedFlowIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!isOpen) return null;

  const FLOWS = [
    {
      id: 'flow-1-purchase',
      title: 'Flow 1: Complete Procurement Cycle',
      subtitle: 'PR → RFQ → Vendor Bid Evaluation → PO → Inward GRN → Bill → Payment',
      targetTab: 'purchase-orders' as CommerceSubTab,
      steps: [
        {
          step: 1,
          name: 'Material Requisition (PR)',
          badge: 'Dept Request',
          summary: 'Pithead Supervisor files PR-2026-081 for 12,000 Litres of High-Speed Diesel.',
          action: 'SANCTION PR',
          jumpTab: 'purchase-requests' as CommerceSubTab
        },
        {
          step: 2,
          name: 'RFQ & Vendor Quotation Comparison',
          badge: 'Sourcing Matrix',
          summary: 'Dispatched RFQ to BPCL, IOCL & HPCL. BPCL emerges as L1 bidder at ₹88.40/Litre.',
          action: 'EVALUATE L1 VENDOR',
          jumpTab: 'rfq' as CommerceSubTab
        },
        {
          step: 3,
          name: 'Approved Purchase Order (PO)',
          badge: 'Contract PO',
          summary: 'PO-2026-104 released to BPCL Kochi Depot for ₹10,60,800 + GST.',
          action: 'VIEW PO DETAILS',
          jumpTab: 'purchase-orders' as CommerceSubTab
        },
        {
          step: 4,
          name: 'Weighbridge & Dip Inward GRN',
          badge: 'Physical Gate Inward',
          summary: 'Tanker KL-07-CD-9901 arrives. Dip rod QC checks density: Accepted 12,000 L without loss.',
          action: 'INSPECT GRN',
          jumpTab: 'grn' as CommerceSubTab
        },
        {
          step: 5,
          name: '3-Way Match Purchase Bill',
          badge: 'Accounts Payable',
          summary: 'Vendor invoice matched against PO-104 & GRN-041. ITC tax credit ₹1,90,944 posted.',
          action: 'REVIEW BILL',
          jumpTab: 'purchase-bills' as CommerceSubTab
        },
        {
          step: 6,
          name: 'Bank RTGS Disbursement',
          badge: 'Treasury Settled',
          summary: 'Commercial Bank RTGS voucher VCH-PAY-772 released. Supplier ledger balanced.',
          action: 'VERIFY DISBURSEMENT',
          jumpTab: 'payments' as CommerceSubTab
        }
      ]
    },
    {
      id: 'flow-2-sales',
      title: 'Flow 2: Quarry Order-to-Cash Cycle',
      subtitle: 'Customer Inquiry → Quotation → Sales Order → Weighbridge Loading → Gate Pass → Invoice → Settlement',
      targetTab: 'sales-orders' as CommerceSubTab,
      steps: [
        {
          step: 1,
          name: 'Customer Inquiry & Quotation',
          badge: 'Pre-Sales',
          summary: 'Sobha Developers requests quote for 1,200 MT 20mm Blue Metal Granite aggregate.',
          action: 'VIEW QUOTATION',
          jumpTab: 'quotations' as CommerceSubTab
        },
        {
          step: 2,
          name: '1-Click Convert to Sales Order',
          badge: 'Order Confirmed',
          summary: 'Commercial executive converts QUOT-2026-081 into Sales Order SO-2026-904 at ₹580/MT.',
          action: 'VIEW SALES ORDER',
          jumpTab: 'sales-orders' as CommerceSubTab
        },
        {
          step: 3,
          name: 'Weighbridge Loading & Dispatch Slip',
          badge: 'Fulfillment',
          summary: 'Tipper KL-40-H-3321 loaded at crusher bin. Gross 42.4 MT - Tare 14.4 MT = Net 28.0 MT.',
          action: 'CHECK WEIGHBRIDGE',
          jumpTab: 'delivery' as CommerceSubTab
        },
        {
          step: 4,
          name: 'QR Barcode Gate Pass',
          badge: 'Security Clearance',
          summary: 'Digitally signed Gate Pass GP-2026-8801 issued with security QR code verification.',
          action: 'INSPECT GATE PASS',
          jumpTab: 'gate-pass' as CommerceSubTab
        },
        {
          step: 5,
          name: 'GST Tax Invoice & e-Way Bill',
          badge: 'Statutory Invoicing',
          summary: 'Tax Invoice INV-2026-001 generated with IRN and e-Way Bill portal confirmation.',
          action: 'VIEW INVOICE',
          jumpTab: 'invoices' as CommerceSubTab
        },
        {
          step: 6,
          name: 'Customer Bank Collection',
          badge: 'Revenue Realized',
          summary: 'Sobha Developers settles payment via NEFT. Customer ledger credited ₹16,240.',
          action: 'OPEN LEDGER',
          jumpTab: 'customer-ledger' as CommerceSubTab
        }
      ]
    },
    {
      id: 'flow-3-laterite',
      title: 'Flow 3: Laterite Stone Order from E-Commerce Storefront to Site Delivery',
      subtitle: 'Customer places online order → Lands in ERP Core → Quarry cutting allocated → Loaded on tipper → QR Gate Pass → Site delivery → Settlement',
      targetTab: 'orders' as CommerceSubTab,
      steps: [
        {
          step: 1,
          name: 'Storefront Cart Checkout',
          badge: 'Platform 5: E-Commerce',
          summary: 'Calicut Villa Contractor orders 2,400 Pieces of Premium Kerala Laterite Stone on web app.',
          action: 'VIEW UNIFIED ORDER',
          jumpTab: 'orders' as CommerceSubTab
        },
        {
          step: 2,
          name: 'Unified Order Hub Routing',
          badge: 'ERP Dispatch Allocation',
          summary: 'Automated allocation router assigns cutting extraction to Malappuram Laterite Quarry Block B.',
          action: 'VIEW ALLOCATION',
          jumpTab: 'orders' as CommerceSubTab
        },
        {
          step: 3,
          name: 'Pithead Loading & Tipper Taring',
          badge: 'Fleet Assigned',
          summary: 'Tipper KL-10-AZ-4412 loaded with 2,400 dressed building stones by quarry machine crane.',
          action: 'DISPATCH MONITOR',
          jumpTab: 'delivery' as CommerceSubTab
        },
        {
          step: 4,
          name: 'Weighbridge QR Gate Pass',
          badge: 'Outward Clearance',
          summary: 'Gate Pass issued with GPS geo-fencing route straight to Calicut NH Bypass construction site.',
          action: 'VERIFY QR PASS',
          jumpTab: 'gate-pass' as CommerceSubTab
        },
        {
          step: 5,
          name: 'Construction Site Receipt & e-POD',
          badge: 'Delivered',
          summary: 'Site supervisor accepts delivery on mobile terminal. Electronic proof of delivery (e-POD) signed.',
          action: 'INVOICE STREAM',
          jumpTab: 'invoices' as CommerceSubTab
        },
        {
          step: 6,
          name: 'Payment Receipt Realization',
          badge: 'Gateway Cleared',
          summary: 'UPI payment cleared into commercial account. Commission split recorded automatically.',
          action: 'PAYMENT AUDIT',
          jumpTab: 'payments' as CommerceSubTab
        }
      ]
    },
    {
      id: 'flow-4-rate-architecture',
      title: 'Flow 4: Multi-Pillar Rate Architecture Setup',
      subtitle: 'Catalog Rate ≠ Customer Special Rate ≠ Supplier Buy Rate ≠ Agreement Rate',
      targetTab: 'rates' as CommerceSubTab,
      steps: [
        {
          step: 1,
          name: 'Base Catalog Rate Definition',
          badge: 'Retail Standard',
          summary: 'Set base gate retail rate for Manufactured Sand (M-Sand) at ₹420 / MT.',
          action: 'RATE ENGINE',
          jumpTab: 'rates' as CommerceSubTab
        },
        {
          step: 2,
          name: 'Customer Tier Override',
          badge: 'CRM Tier',
          summary: 'Sobha Developers given negotiated volume rate of ₹395 / MT (Min 500 MT).',
          action: 'CUSTOMER RATES',
          jumpTab: 'rates' as CommerceSubTab
        },
        {
          step: 3,
          name: 'Supplier Extraction Cost Rate',
          badge: 'SRM Sourcing',
          summary: 'Pithead raw granite feed cost pegged at ₹185 / MT from quarry leaseholder.',
          action: 'SUPPLIER RATES',
          jumpTab: 'rates' as CommerceSubTab
        },
        {
          step: 4,
          name: 'National Highway Joint Venture MOU',
          badge: 'MOU Agreement',
          summary: 'Contractual 2-year framework rate of ₹380 / MT locked with NHAI EPC contractor.',
          action: 'AGREEMENT RATES',
          jumpTab: 'rates' as CommerceSubTab
        }
      ]
    },
    {
      id: 'flow-5-return',
      title: 'Flow 5: Rejected Material & Debit Note Adjustment',
      subtitle: 'Material Rejection → Return Memo → Debit Note → Ledger Reconciliation',
      targetTab: 'credit-debit-notes' as CommerceSubTab,
      steps: [
        {
          step: 1,
          name: 'QC Lab Non-Conformance',
          badge: 'Inward QC Fail',
          summary: 'Crusher liner plates delivered with tensile strength below DIN standard.',
          action: 'QC LOG',
          jumpTab: 'grn' as CommerceSubTab
        },
        {
          step: 2,
          name: 'Inward Return Memo Generated',
          badge: 'Gate Return',
          summary: 'Store keeper flags batch for return to Sandvik Peenya plant.',
          action: 'PURCHASE RETURNS',
          jumpTab: 'purchase-returns' as CommerceSubTab
        },
        {
          step: 3,
          name: 'Debit Note DN-2026-004 Issued',
          badge: 'GST Section 34',
          summary: 'Statutory debit note for ₹34,000 + GST reversals transmitted to vendor.',
          action: 'DEBIT NOTE',
          jumpTab: 'credit-debit-notes' as CommerceSubTab
        },
        {
          step: 4,
          name: 'Vendor Sub-Ledger Adjusted',
          badge: 'Ledger Balancing',
          summary: 'Payable balance reduced by ₹40,120 without modifying original purchase bill.',
          action: 'SUPPLIER LEDGER',
          jumpTab: 'supplier-ledger' as CommerceSubTab
        }
      ]
    },
    {
      id: 'flow-6-gate-pass',
      title: 'Flow 6: Security Weighbridge QR Clearance',
      subtitle: 'Weighbridge Gross Weighing → QR Barcode Verification → Gate Exit Clearance',
      targetTab: 'gate-pass' as CommerceSubTab,
      steps: [
        {
          step: 1,
          name: 'Loaded Tipper on Weighbridge',
          badge: 'Pithead Weighbridge',
          summary: 'Gross weight recorded: 38,400 kg. System validates tolerance within ±0.5%.',
          action: 'WEIGHBRIDGE SLIP',
          jumpTab: 'delivery' as CommerceSubTab
        },
        {
          step: 2,
          name: 'Dynamic QR Code Generation',
          badge: 'Encrypted Token',
          summary: 'Gate Pass GP-2026-8801 encoded with vehicle #, driver license and invoice ref.',
          action: 'INSPECT QR',
          jumpTab: 'gate-pass' as CommerceSubTab
        },
        {
          step: 3,
          name: 'Perimeter Security Camera Scan',
          badge: 'Optical OCR Scan',
          summary: 'Automatic Number Plate Recognition (ANPR) and security terminal verify pass.',
          action: 'CLEAR PASS',
          jumpTab: 'gate-pass' as CommerceSubTab
        },
        {
          step: 4,
          name: 'Gate Cleared & Status Transmitted',
          badge: 'Live Status CLEARED',
          summary: 'Trip status updated to IN_TRANSIT on customer tracking portal and ERP.',
          action: 'TRACK ORDER',
          jumpTab: 'orders' as CommerceSubTab
        }
      ]
    }
  ];

  const currentFlow = FLOWS[selectedFlowIndex];
  const currentStep = currentFlow.steps[activeStepIndex];

  const handleNext = () => {
    if (activeStepIndex < currentFlow.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      onToast(`Completed ${currentFlow.title}!`);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleJumpToModule = () => {
    onNavigateTab(currentStep.jumpTab);
    onClose();
    onToast(`Navigated to ${currentStep.jumpTab} (Step ${currentStep.step})`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Interactive Studio Simulation &bull; 6 Enterprise Flows
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">{currentFlow.title}</h2>
            <p className="text-xs text-slate-400">{currentFlow.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flow Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
          {FLOWS.map((f, i) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFlowIndex(i);
                setActiveStepIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFlowIndex === i
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Flow {i + 1}
            </button>
          ))}
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {currentFlow.steps.map((st, i) => {
            const isCompleted = i < activeStepIndex;
            const isCurrent = i === activeStepIndex;
            return (
              <div
                key={st.step}
                onClick={() => setActiveStepIndex(i)}
                className={`p-2.5 rounded-xl border transition cursor-pointer text-xs ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span>STEP {st.step}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : isCurrent ? (
                    <Clock className="w-3 h-3 text-amber-400" />
                  ) : null}
                </div>
                <p className="font-bold text-white truncate text-[11px]">{st.name}</p>
              </div>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400">
                Step {currentStep.step} of {currentFlow.steps.length}
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">{currentStep.name}</h3>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 self-start sm:self-auto">
              {currentStep.badge}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {currentStep.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleJumpToModule}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-2 transition border border-amber-500/30 cursor-pointer"
            >
              <span>{currentStep.action} &rarr;</span>
              <span className="text-[10px] text-slate-400 font-mono">({currentStep.jumpTab})</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={activeStepIndex === 0}
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>{activeStepIndex === currentFlow.steps.length - 1 ? 'Finish Simulation' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
