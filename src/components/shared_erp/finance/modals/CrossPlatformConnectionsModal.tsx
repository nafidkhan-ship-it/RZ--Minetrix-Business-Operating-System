import React, { useState } from 'react';
import {
  X,
  Layers,
  ArrowRight,
  TrendingUp,
  Truck,
  Building2,
  Users,
  DollarSign,
  CheckCircle2,
  Sparkles,
  FileText
} from 'lucide-react';
import { FinanceSectionTab } from '../types';

interface CrossPlatformConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: FinanceSectionTab) => void;
}

export const CrossPlatformConnectionsModal: React.FC<CrossPlatformConnectionsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeFlowId, setActiveFlowId] = useState('quarry');

  if (!isOpen) return null;

  const FLOWS = [
    {
      id: 'quarry',
      title: 'QUARRY OPERATION FLOW',
      subtitle: 'Pit Extraction, Weighbridge Gate-Pass & Multi-Stakeholder Settlement',
      steps: [
        { label: 'Loads Extracted', detail: '84,000 Laterite Stones', targetTab: 'trips' as FinanceSectionTab },
        { label: 'Sales Dispatch', detail: 'Weighbridge Delivery DC-01', targetTab: 'pay-in' as FinanceSectionTab },
        { label: 'Customer Receivable', detail: 'Sobha Developers ₹1,09,200', targetTab: 'debtors' as FinanceSectionTab },
        { label: 'Land Owner Royalty', detail: 'K. Balakrishnan Nambiar ₹2,28,000', targetTab: 'land-owners' as FinanceSectionTab },
        { label: 'Partner Settlement', detail: 'Monthly Net Concession Pool', targetTab: 'settlements' as FinanceSectionTab }
      ]
    },
    {
      id: 'crusher',
      title: 'CRUSHER PLANT FLOW',
      subtitle: 'Raw Feed Processing, Production, Spares & Operational Split',
      steps: [
        { label: 'Crusher Production', detail: '20mm & M-Sand 18,200 MT', targetTab: 'reports' as FinanceSectionTab },
        { label: 'Sales Order Invoicing', detail: 'Billed to Road Contractors', targetTab: 'debtors' as FinanceSectionTab },
        { label: 'Spares & Consumables', detail: 'Sandvik Jaw Liners & Greasing', targetTab: 'creditors' as FinanceSectionTab },
        { label: 'Plant Expenses', detail: 'Generator Diesel & KSEB Power', targetTab: 'expenses' as FinanceSectionTab },
        { label: 'Partner Settlement', detail: 'Quarterly Crusher Dividend', targetTab: 'settlements' as FinanceSectionTab }
      ]
    },
    {
      id: 'vehicle',
      title: 'VEHICLE LOGISTICS FLOW',
      subtitle: 'Haulage Trips, Freight Billing, Operating Sinks & Owner Split',
      steps: [
        { label: 'Dispatch Trips', detail: 'Trip TRP-9921 Pit → Calicut', targetTab: 'trips' as FinanceSectionTab },
        { label: 'Gross Freight Income', detail: '₹8,500 charged on bill', targetTab: 'trips' as FinanceSectionTab },
        { label: 'Fuel & Toll Sinks', detail: 'Diesel ₹3,200 + Toll ₹450', targetTab: 'expenses' as FinanceSectionTab },
        { label: 'Driver Batta Paid', detail: 'Daily Trip Batta ₹600', targetTab: 'pay-out' as FinanceSectionTab },
        { label: 'Owner Settlement', detail: 'Multi-Owner V002 (60% / 40%)', targetTab: 'vehicle-owners' as FinanceSectionTab }
      ]
    },
    {
      id: 'contract',
      title: 'CONTRACT / JOB WORK FLOW',
      subtitle: 'Subcontract Execution, Progress Milestones & Job P&L',
      steps: [
        { label: 'Work Order Issued', detail: 'Bypass Cut & Fill Section 4', targetTab: 'reports' as FinanceSectionTab },
        { label: 'Milestone Billing', detail: 'Running Account RA Bill #03', targetTab: 'debtors' as FinanceSectionTab },
        { label: 'Retention & Payments', detail: 'Cheque Clearance & TDS', targetTab: 'pay-in' as FinanceSectionTab },
        { label: 'Job P&L Audited', detail: 'Net Margin Statement', targetTab: 'reports' as FinanceSectionTab }
      ]
    },
    {
      id: 'materials',
      title: 'BUILDING MATERIALS RETAIL FLOW',
      subtitle: 'Customer Orders, Warehouse Dispatch, Invoices & Receivables',
      steps: [
        { label: 'Purchase Order', detail: 'Retail Aggregate & Blocks', targetTab: 'creditors' as FinanceSectionTab },
        { label: 'Tax Invoice', detail: 'GST Invoicing INV-2026-081', targetTab: 'debtors' as FinanceSectionTab },
        { label: 'Customer Payment', detail: 'UPI / Bank Receipt', targetTab: 'pay-in' as FinanceSectionTab },
        { label: 'Receivables Settled', detail: 'Instant Ledger Clearance', targetTab: 'ledgers' as FinanceSectionTab }
      ]
    },
    {
      id: 'land',
      title: 'LAND CONCESSION LEASE FLOW',
      subtitle: 'Quarry Deed Agreement, Security Deposit & Load-Based Royalties',
      steps: [
        { label: 'Concession Agreement', detail: '14.5 Acres Mining Concession', targetTab: 'land-owners' as FinanceSectionTab },
        { label: 'Advance Deposit Paid', detail: '₹1,50,000 Upfront Float', targetTab: 'pay-out' as FinanceSectionTab },
        { label: 'Load Count Extraction', detail: '₹4.50 per Stone extracted', targetTab: 'land-owners' as FinanceSectionTab },
        { label: 'Net Owner Settlement', detail: 'Royalty Balance Disbursed', targetTab: 'settlements' as FinanceSectionTab }
      ]
    },
    {
      id: 'staff',
      title: 'WORKFORCE & SALARY FLOW',
      subtitle: 'Daily Biometric Logs, Advances Deduction, Net Salary & Pay Slips',
      steps: [
        { label: 'Biometric Attendance', detail: '26 Working Days Logged', targetTab: 'payroll' as FinanceSectionTab },
        { label: 'Gross Salary Computed', detail: 'Base Pay + Overtime + Batta', targetTab: 'payroll' as FinanceSectionTab },
        { label: 'Advance Deduction', detail: 'Staff Advance EMI Deducted', targetTab: 'staff-advances' as FinanceSectionTab },
        { label: 'Salary Slip Disbursed', detail: 'Direct Bank NEFT Transfer', targetTab: 'pay-out' as FinanceSectionTab }
      ]
    }
  ];

  const currentFlow = FLOWS.find((f) => f.id === activeFlowId) || FLOWS[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cross-Platform Financial Relationships &amp; Flows</h3>
              <p className="text-xs text-slate-400">
                Visual end-to-end ledger propagation from physical quarry/plant operations into balance sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 py-2.5 border-b border-slate-800/80 bg-slate-950 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
          {FLOWS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFlowId(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                activeFlowId === f.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Active Flow Detail Visualizer */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              {currentFlow.title}
            </span>
            <h4 className="text-base font-black text-white mt-0.5">{currentFlow.subtitle}</h4>
          </div>

          {/* Connected Flow Chain */}
          <div className="space-y-3">
            {currentFlow.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </div>
                  {idx < currentFlow.steps.length - 1 && (
                    <div className="w-0.5 h-10 bg-slate-800 my-1"></div>
                  )}
                </div>

                <div className="flex-1 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition">
                  <div>
                    <span className="text-xs font-bold text-white block">{step.label}</span>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">{step.detail}</span>
                  </div>

                  <button
                    onClick={() => {
                      onNavigateTab(step.targetTab);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>View in {step.targetTab.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
