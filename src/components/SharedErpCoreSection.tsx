import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  FileText,
  GitFork,
  Zap,
  Bell,
  ShieldCheck,
  Plug,
  BarChart3,
  Sliders,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Send,
  Eye,
  Lock,
  Layers,
  Sparkles,
  Truck,
  Receipt,
  Wallet,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Printer,
  FileSpreadsheet,
  FileCheck,
  RotateCcw,
  QrCode,
  RefreshCw
} from 'lucide-react';
import { SectionId } from '../types/architecture';
import { AutomationEngineSection } from './AutomationEngineSection';
import { BillingSubscriptionSection } from './BillingSubscriptionSection';
import { SharedErpOrganizationSection } from './shared_erp/SharedErpOrganizationSection';
import { RzProductivitySuite } from './productivity/RzProductivitySuite';

// New Comprehensive Views for Shared ERP Core
import { ErpDashboardView } from './shared_erp/views/ErpDashboardView';
import { StaffWorkforcePayrollView } from './shared_erp/views/StaffWorkforcePayrollView';
import { CommerceTradeMasterView } from './shared_erp/views/CommerceTradeMasterView';
import { FinanceAccountsMasterView } from './shared_erp/views/FinanceAccountsMasterView';
import { DocumentsReportsView } from './shared_erp/views/DocumentsReportsView';

// Modals
import { ErpInteractiveFlowsModal } from './shared_erp/views/ErpInteractiveFlowsModal';
import { ErpGlobalSearchModal } from './shared_erp/modals/ErpGlobalSearchModal';
import { ErpPrintDocumentModal } from './shared_erp/modals/ErpPrintDocumentModal';

export type ErpCoreTab =
  | 'dashboard'
  // 1. People & Workforce
  | 'workforce'
  | 'staff'
  | 'employees'
  | 'departments'
  | 'designations'
  | 'attendance'
  | 'shifts'
  | 'leave'
  | 'overtime'
  | 'salary-setup'
  | 'payroll'
  | 'advances'
  | 'advance-receipts'
  | 'batta'
  | 'salary-slips'
  | 'documents'
  | 'directory'
  | 'approvals'
  | 'settings'
  | 'staff-accounts'
  // 2. Commerce & Trade
  | 'commerce-dashboard'
  | 'products'
  | 'categories'
  | 'units'
  | 'hsn-gst'
  | 'rates'
  | 'products-rates'
  | 'customers'
  | 'suppliers'
  | 'purchase'
  | 'procurement'
  | 'purchase-requests'
  | 'rfq'
  | 'purchase-orders'
  | 'grn'
  | 'purchase-bills'
  | 'purchase-returns'
  | 'quotations'
  | 'sales'
  | 'sales-orders'
  | 'sales-crm'
  | 'delivery'
  | 'invoices'
  | 'payments'
  | 'sales-returns'
  | 'credit-debit-notes'
  | 'gate-pass'
  | 'orders'
  | 'customer-ledger'
  | 'supplier-ledger'
  | 'inventory'
  // 3. Finance & Accounts
  | 'finance'
  | 'finance-dashboard'
  | 'debtors'
  | 'creditors'
  | 'banks'
  | 'cash'
  | 'pay-in'
  | 'pay-out'
  | 'investors'
  | 'partners'
  | 'trip-accounts'
  | 'trips'
  | 'ownership'
  | 'vehicle-owners'
  | 'settlements'
  | 'ledger'
  | 'reconciliation'
  | 'pnl'
  | 'reports'
  | 'audit'
  // 4. Organization & Workspace
  | 'organization'
  | 'workspace'
  | 'branches'
  | 'sites'
  | 'subscription'
  | 'roles'
  | 'permissions'
  | 'billing'
  | 'automation'
  // 5. Productivity Suite
  | 'productivity'
  | 'sheet'
  | 'word'
  | 'form'
  | 'slide'
  | 'drive'
  | 'pdf'
  | 'print'
  // Legacy aliases
  | 'people'
  | 'hr'
  | 'commerce'
  | 'workflow'
  | 'notifications'
  | 'security'
  | 'api'
  | 'analytics'
  | 'admin'
  | 'master-data';

interface SharedErpCoreProps {
  initialService?: string;
  initialTab?: string;
  onNavigate?: (section: SectionId) => void;
}

export const SharedErpCoreSection: React.FC<SharedErpCoreProps> = ({
  initialService,
  initialTab,
  onNavigate
}) => {
  // Resolve initial tab cleanly
  const resolveInitialTab = (): ErpCoreTab => {
    const raw = (initialTab || initialService || 'dashboard').toLowerCase();
    if (raw === 'people' || raw === 'hr' || raw === 'employees') return 'employees';
    if (raw === 'commerce' || raw === 'trade' || raw === 'commerce-dashboard') return 'commerce-dashboard';
    if (raw === 'procurement' || raw === 'purchase-orders') return 'purchase-orders';
    if (raw === 'sales-crm' || raw === 'sales-orders') return 'sales-orders';
    if (raw === 'finance') return 'finance-dashboard';
    if (raw === 'trip-accounts' || raw === 'trips') return 'trips';
    if (raw === 'vehicle-owners') return 'vehicle-owners';
    if (raw === 'salary-slip' || raw === 'salary-slips') return 'salary-slips';
    if (raw === 'staff-account' || raw === 'staff-accounts') return 'staff-accounts';
    return (raw as ErpCoreTab) || 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<ErpCoreTab>(resolveInitialTab());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isTestFlowModalOpen, setIsTestFlowModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
  }>({
    isOpen: false,
    title: '',
    data: null
  });

  useEffect(() => {
    if (initialTab || initialService) {
      setActiveTab(resolveInitialTab());
    }
  }, [initialTab, initialService]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cross-platform bridges to RZ® Chat & RZ® OTT
  const handleOpenChat = (name: string) => {
    showToast(`Bridging to RZ® Chat for ${name}...`);
    onNavigate?.('rz-chating');
  };

  const handleCreateTask = (title: string) => {
    showToast(`Created OTT Task: "${title}"`);
  };

  const handleOpenPrintModal = (title: string, data: any) => {
    setPrintModalState({
      isOpen: true,
      title,
      data
    });
  };

  // Primary Navigation Clusters according to User Brief
  const NAV_CATEGORIES: {
    category: string;
    tabs: { id: ErpCoreTab; label: string; icon: React.ComponentType<{ className?: string }> }[];
  }[] = [
    {
      category: 'Overview',
      tabs: [
        { id: 'dashboard', label: 'ERP Dashboard', icon: BarChart3 }
      ]
    },
    {
      category: '1. People & Workforce',
      tabs: [
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leave', label: 'Leave', icon: Calendar },
        { id: 'payroll', label: 'Payroll', icon: DollarSign },
        { id: 'advances', label: 'Staff Advances', icon: CreditCard },
        { id: 'advance-receipts', label: 'Advance Receipts', icon: FileCheck },
        { id: 'batta', label: 'Batta & Allowances', icon: Truck },
        { id: 'salary-slips', label: 'Salary Slips', icon: FileText },
        { id: 'staff-accounts', label: 'Staff Accounts', icon: TrendingUp }
      ]
    },
    {
      category: '2. Commerce & Trade',
      tabs: [
        { id: 'products', label: 'Products Master', icon: Package },
        { id: 'categories', label: 'Categories', icon: Layers },
        { id: 'rates', label: 'Rate Setup', icon: Sliders },
        { id: 'customers', label: 'Customers CRM', icon: Users },
        { id: 'suppliers', label: 'Suppliers SRM', icon: Building2 },
        { id: 'purchase', label: 'Purchase', icon: ShoppingBag },
        { id: 'purchase-orders', label: 'Purchase Orders', icon: FileText },
        { id: 'grn', label: 'GRN / Inward', icon: Truck },
        { id: 'sales', label: 'Sales', icon: TrendingUp },
        { id: 'sales-orders', label: 'Sales Orders', icon: Package },
        { id: 'invoices', label: 'Tax Invoices', icon: Receipt },
        { id: 'sales-returns', label: 'Sales Returns', icon: RotateCcw },
        { id: 'purchase-returns', label: 'Purchase Returns', icon: RotateCcw },
        { id: 'gate-pass', label: 'Gate Pass (QR)', icon: QrCode }
      ]
    },
    {
      category: '3. Finance & Accounts',
      tabs: [
        { id: 'finance-dashboard', label: 'Finance Dashboard', icon: BarChart3 },
        { id: 'debtors', label: 'Debtors Ledger', icon: TrendingUp },
        { id: 'creditors', label: 'Creditors Ledger', icon: DollarSign },
        { id: 'banks', label: 'Bank Accounts', icon: Landmark },
        { id: 'cash', label: 'Cash Desk', icon: Wallet },
        { id: 'pay-in', label: 'Pay-In Vouchers', icon: ArrowDownLeft },
        { id: 'pay-out', label: 'Pay-Out Vouchers', icon: ArrowUpRight },
        { id: 'investors', label: 'Investors Equity', icon: Sparkles },
        { id: 'partners', label: 'Partners Accounts', icon: Users },
        { id: 'trips', label: 'Trip Accounts', icon: Truck },
        { id: 'vehicle-owners', label: 'Vehicle Owners', icon: Truck },
        { id: 'ledger', label: 'General Ledger', icon: FileText },
        { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw },
        { id: 'pnl', label: 'Profit & Loss', icon: TrendingUp },
        { id: 'reports', label: 'Financial Reports', icon: BarChart3 }
      ]
    },
    {
      category: '4. Organization & Workspace',
      tabs: [
        { id: 'organization', label: 'Company Profile', icon: Building2 },
        { id: 'branches', label: 'Branches & Sites', icon: Building2 },
        { id: 'subscription', label: 'Subscription Plans', icon: CreditCard },
        { id: 'roles', label: 'Roles & RBAC', icon: ShieldCheck }
      ]
    },
    {
      category: '5. Productivity Suite',
      tabs: [
        { id: 'sheet', label: 'RZ Sheet', icon: FileSpreadsheet },
        { id: 'word', label: 'RZ Word', icon: FileText },
        { id: 'form', label: 'RZ Form', icon: FileCheck },
        { id: 'slide', label: 'RZ Slide', icon: Layers },
        { id: 'drive', label: 'RZ Drive', icon: Package },
        { id: 'pdf', label: 'RZ PDF', icon: FileText },
        { id: 'print', label: 'RZ Print', icon: Printer }
      ]
    }
  ];

  // Helper flags for rendering view groups
  const isPeopleTab = [
    'workforce', 'staff', 'employees', 'departments', 'designations',
    'attendance', 'shifts', 'leave', 'overtime', 'salary-setup',
    'payroll', 'advances', 'advance-receipts', 'batta', 'salary-slips',
    'documents', 'directory', 'approvals', 'settings', 'staff-accounts',
    'people', 'hr'
  ].includes(activeTab);

  const isCommerceTab = [
    'commerce-dashboard', 'products', 'categories', 'units', 'hsn-gst', 'rates',
    'products-rates', 'customers', 'suppliers', 'purchase', 'procurement',
    'purchase-requests', 'rfq', 'purchase-orders', 'grn', 'purchase-bills',
    'purchase-returns', 'quotations', 'sales', 'sales-orders', 'sales-crm',
    'delivery', 'invoices', 'payments', 'sales-returns', 'credit-debit-notes',
    'gate-pass', 'orders', 'customer-ledger', 'supplier-ledger', 'inventory', 'commerce'
  ].includes(activeTab);

  const isFinanceTab = [
    'finance', 'finance-dashboard', 'debtors', 'creditors', 'banks',
    'cash', 'pay-in', 'pay-out', 'investors', 'partners',
    'trip-accounts', 'trips', 'ownership', 'vehicle-owners',
    'settlements', 'ledger', 'reconciliation', 'pnl'
  ].includes(activeTab);

  const isProductivityTab = [
    'productivity', 'sheet', 'word', 'form', 'slide', 'drive', 'pdf', 'print'
  ].includes(activeTab);

  const isOrganizationTab = [
    'organization', 'workspace', 'branches', 'sites', 'subscription', 'roles', 'permissions'
  ].includes(activeTab);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Interactive Flows Modal */}
      <ErpInteractiveFlowsModal
        isOpen={isTestFlowModalOpen}
        onClose={() => setIsTestFlowModalOpen(false)}
      />

      {/* Global Universal Search Modal */}
      <ErpGlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab as ErpCoreTab);
          setIsSearchModalOpen(false);
        }}
      />

      {/* Global Print Document Modal */}
      <ErpPrintDocumentModal
        isOpen={printModalState.isOpen}
        title={printModalState.title}
        data={printModalState.data}
        onClose={() => setPrintModalState({ isOpen: false, title: '', data: null })}
      />

      {/* Studio Header & Quick Action Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
              RZ
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  RZ® MINETRIX BOS &bull; SHARED ERP CORE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  STUDIO PREVIEW / DEMO DATA
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Central Business Engine &amp; Multi-Ledger Backbone
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                The central nervous system linking all 10 Platforms: <strong>People &amp; Workforce, Commerce &amp; Trade, Finance &amp; Accounts, Organization &amp; Workspace, and Productivity Suite</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Universal Search</span>
            </button>
            <button
              onClick={() => setIsTestFlowModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>5 Interactive Flows</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLUSTERED ERP NAVIGATION PILLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 font-mono">
        <div className="flex items-center justify-between px-2 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
          <span>Enterprise Modules &bull; 5 Core Pillars</span>
          <span className="text-amber-400">Real-Time Multi-Ledger Routing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {NAV_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block px-1 truncate">
                {cat.category}
              </span>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                {cat.tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* ACTIVE VIEW RENDERING HUB */}
      {/* ============================================================== */}

      {/* 1. ERP DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <ErpDashboardView
          onNavigateTab={(tab) => setActiveTab(tab as ErpCoreTab)}
          onOpenFlowModal={() => setIsTestFlowModalOpen(true)}
          onQuickAction={(action) => showToast(`Triggered: ${action}`)}
        />
      )}

      {/* 2. PEOPLE & WORKFORCE GROUP */}
      {isPeopleTab && (
        <StaffWorkforcePayrollView
          initialSubTab={activeTab}
          onOpenPrintModal={handleOpenPrintModal}
        />
      )}

      {/* 3. COMMERCE & TRADE GROUP */}
      {isCommerceTab && (
        <CommerceTradeMasterView
          initialSubTab={activeTab}
          onOpenPrintModal={handleOpenPrintModal}
          onOpenChatWithPerson={handleOpenChat}
          onCreateTaskForPerson={handleCreateTask}
        />
      )}

      {/* 4. FINANCE & ACCOUNTS GROUP */}
      {isFinanceTab && (
        <FinanceAccountsMasterView
          initialSubTab={activeTab}
          onOpenPrintModal={handleOpenPrintModal}
          onOpenChatWithPerson={handleOpenChat}
        />
      )}

      {/* 5. ORGANIZATION & WORKSPACE GROUP */}
      {isOrganizationTab && (
        <SharedErpOrganizationSection
          onNavigate={(sec) => onNavigate?.(sec as any)}
          initialSubTab={
            activeTab === 'branches' || activeTab === 'sites' ? 'branches' :
            activeTab === 'subscription' ? 'subscription' :
            activeTab === 'roles' || activeTab === 'permissions' ? 'rbac' : 'overview'
          }
        />
      )}

      {/* 6. PRODUCTIVITY SUITE GROUP */}
      {isProductivityTab && (
        <RzProductivitySuite
          onNavigateSection={(sec) => onNavigate?.(sec)}
          initialTool={activeTab === 'productivity' ? 'sheet' : (activeTab as any)}
        />
      )}

      {/* 7. BI REPORTS */}
      {(activeTab === 'reports' || activeTab === 'analytics') && (
        <DocumentsReportsView
          initialSubTab="reports"
          onOpenPrintModal={handleOpenPrintModal}
        />
      )}

      {/* 8. AUDIT / ACTIVITY TRAIL */}
      {(activeTab === 'audit' || activeTab === 'security') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Enterprise Audit &amp; Activity Trail</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Immutable event stream tracking security verifications, rate overrides, weighbridge tare scale calibrations, and payment vouchers.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-800 text-[11px]">
              <span>TIMESTAMP</span>
              <span>USER</span>
              <span>EVENT / ACTION</span>
              <span>ENTITY / DETAILS</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">2026-03-24 10:45:12</span>
              <span className="text-amber-400 font-bold">Nafid Khan (MD)</span>
              <span className="text-white">APPROVED_SETTLEMENT #SET-2026-041</span>
              <span>₹45,000 to K. P. Moideenkutty</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">2026-03-24 10:30:00</span>
              <span className="text-cyan-400 font-bold">Rate Engine Daemon</span>
              <span className="text-white">DYNAMIC_RATE_RESOLVED</span>
              <span>Applied Enterprise Rate: ₹42/pc (Sobha)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">2026-03-24 09:15:44</span>
              <span className="text-emerald-400 font-bold">Weighbridge Operator</span>
              <span className="text-white">GATE_PASS_GENERATED #GP-OUT-1092</span>
              <span>Vehicle KL-11-BH-9921 (Arun Varma)</span>
            </div>
          </div>
        </div>
      )}

      {/* 9. AUTOMATION ENGINE (22 BOS TRIGGERS) */}
      {(activeTab === 'automation' || activeTab === 'workflow') && (
        <AutomationEngineSection />
      )}

      {/* 10. BILLING & SUBSCRIPTIONS */}
      {activeTab === 'billing' && (
        <BillingSubscriptionSection />
      )}
    </div>
  );
};
