import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Landmark,
  BookOpen,
  Receipt,
  Users,
  Building2,
  TrendingUp,
  CreditCard,
  Truck,
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { FinanceSectionTab } from '../finance/types';
import { FinanceHubKpiCards } from '../finance/FinanceHubKpiCards';
import { FinanceNavPills } from '../finance/FinanceNavPills';
import { FinanceDashboardView } from '../finance/views/FinanceDashboardView';
import {
  DebtorsView,
  CreditorsView,
  CashView
} from '../finance/views/DebtorsCreditorsCashViews';
import {
  BanksView,
  PayInView,
  PayOutView
} from '../finance/views/BanksPayInPayOutViews';
import {
  ExpensesView,
  InvestmentsPartnersView,
  PartnerSettlementView
} from '../finance/views/ExpensesInvestmentsSettlementsViews';
import {
  StaffSalaryView,
  StaffAdvancesView,
  TripAccountsView,
  VehicleOwnerAccountsView,
  LandOwnerAccountsView
} from '../finance/views/OperationsFinanceViews';
import {
  LedgersView,
  BankReconciliationView,
  FinancialReportsView
} from '../finance/views/LedgersReconciliationReportsViews';
import { FinanceSearchModal } from '../finance/modals/FinanceSearchModal';
import { CrossPlatformConnectionsModal } from '../finance/modals/CrossPlatformConnectionsModal';
import { QuickActionCenterModal } from '../finance/modals/QuickActionCenterModal';
import { FinancePrintModal } from '../finance/modals/FinancePrintModal';

interface FinanceAccountsMasterViewProps {
  initialSubTab?: string;
  onOpenPrintModal?: (title: string, data: any) => void;
  onOpenChatWithPerson?: (name: string) => void;
}

export const FinanceAccountsMasterView: React.FC<FinanceAccountsMasterViewProps> = ({
  initialSubTab = 'finance-dashboard',
  onOpenPrintModal: externalOpenPrintModal,
  onOpenChatWithPerson
}) => {
  const mapToTab = (tabStr: string): FinanceSectionTab => {
    const raw = (tabStr || '').toLowerCase();
    if (raw === 'debtors' || raw === 'receivables') return 'debtors';
    if (raw === 'creditors' || raw === 'payables') return 'creditors';
    if (raw === 'cash') return 'cash';
    if (raw === 'banks') return 'banks';
    if (raw === 'pay-in') return 'pay-in';
    if (raw === 'pay-out') return 'pay-out';
    if (raw === 'expenses') return 'expenses';
    if (raw === 'investments' || raw === 'investors') return 'investments';
    if (raw === 'settlements' || raw === 'partners') return 'settlements';
    if (raw === 'payroll' || raw === 'staff-salary' || raw === 'salary-slips') return 'payroll';
    if (raw === 'staff-advances' || raw === 'advances' || raw === 'staff-accounts') return 'staff-advances';
    if (raw === 'trips' || raw === 'trip-accounts') return 'trips';
    if (raw === 'vehicle-owners' || raw === 'ownership') return 'vehicle-owners';
    if (raw === 'land-owners' || raw === 'land') return 'land-owners';
    if (raw === 'ledgers' || raw === 'ledger') return 'ledgers';
    if (raw === 'reconciliation') return 'reconciliation';
    if (raw === 'reports' || raw === 'pnl') return 'reports';
    return 'finance-dashboard';
  };

  const [activeTab, setActiveTab] = useState<FinanceSectionTab>(() => mapToTab(initialSubTab));
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFlowsOpen, setIsFlowsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [printModalData, setPrintModalData] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
  }>({
    isOpen: false,
    title: '',
    data: null
  });

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(mapToTab(initialSubTab));
    }
  }, [initialSubTab]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenPrintModal = (title: string, data: any) => {
    if (externalOpenPrintModal) {
      externalOpenPrintModal(title, data);
    } else {
      setPrintModalData({
        isOpen: true,
        title,
        data
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Finance Hub Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              RZ® MINETRIX BOS &bull; SHARED ERP CORE
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2.5">
            <Landmark className="w-7 h-7 text-amber-400" />
            <span>RZ® MINETRIX Finance &amp; Accounts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Central financial control for receivables, payables, cash, banks, investments, payroll, settlements and business ledgers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Universal Search</span>
          </button>
          <button
            onClick={() => setIsFlowsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cross-Platform Flows</span>
          </button>
          <button
            onClick={() => setIsQuickActionsOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Zap className="w-4 h-4" />
            <span>Quick Action Center</span>
          </button>
        </div>
      </div>

      {/* Top 11 KPI Summary Cards */}
      <FinanceHubKpiCards onCardClick={(tab) => setActiveTab(tab as FinanceSectionTab)} />

      {/* 18-Workspace Horizontal Navigation */}
      <FinanceNavPills
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFlows={() => setIsFlowsOpen(true)}
      />

      {/* Dynamic View Rendering based on activeTab */}
      <div className="transition-all duration-200">
        {/* 1. Dashboard */}
        {activeTab === 'finance-dashboard' && (
          <FinanceDashboardView
            onToast={showToast}
            onNavigateTab={setActiveTab}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 2. Debtors */}
        {activeTab === 'debtors' && (
          <DebtorsView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 3. Creditors */}
        {activeTab === 'creditors' && (
          <CreditorsView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 4. Cash */}
        {activeTab === 'cash' && (
          <CashView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 5. Banks */}
        {activeTab === 'banks' && (
          <BanksView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
            onNavigateTab={(tab) => setActiveTab(tab as FinanceSectionTab)}
          />
        )}

        {/* 6. Pay-In */}
        {activeTab === 'pay-in' && (
          <PayInView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 7. Pay-Out */}
        {activeTab === 'pay-out' && (
          <PayOutView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 8. Expenses */}
        {activeTab === 'expenses' && (
          <ExpensesView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 9. Investments */}
        {activeTab === 'investments' && (
          <InvestmentsPartnersView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 10. Partner Settlements */}
        {activeTab === 'settlements' && (
          <PartnerSettlementView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 11. Staff Salary / Payroll */}
        {activeTab === 'payroll' && (
          <StaffSalaryView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 12. Staff Advances */}
        {activeTab === 'staff-advances' && (
          <StaffAdvancesView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 13. Trip Accounts */}
        {activeTab === 'trips' && (
          <TripAccountsView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 14. Vehicle Owner Accounts */}
        {activeTab === 'vehicle-owners' && (
          <VehicleOwnerAccountsView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 15. Land Owner Accounts */}
        {activeTab === 'land-owners' && (
          <LandOwnerAccountsView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 16. General & Party Ledgers */}
        {activeTab === 'ledgers' && (
          <LedgersView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 17. Bank Reconciliation */}
        {activeTab === 'reconciliation' && (
          <BankReconciliationView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* 18. Financial BI Reports */}
        {activeTab === 'reports' && (
          <FinancialReportsView
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}
      </div>

      {/* Universal Search Modal */}
      <FinanceSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
      />

      {/* Cross-Platform Connections Modal */}
      <CrossPlatformConnectionsModal
        isOpen={isFlowsOpen}
        onClose={() => setIsFlowsOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsFlowsOpen(false);
        }}
      />

      {/* Quick Action Center Modal */}
      <QuickActionCenterModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsQuickActionsOpen(false);
        }}
        onToast={showToast}
      />

      {/* Internal Document Print Modal */}
      <FinancePrintModal
        isOpen={printModalData.isOpen}
        title={printModalData.title}
        data={printModalData.data}
        onClose={() => setPrintModalData({ isOpen: false, title: '', data: null })}
        onToast={showToast}
      />
    </div>
  );
};
