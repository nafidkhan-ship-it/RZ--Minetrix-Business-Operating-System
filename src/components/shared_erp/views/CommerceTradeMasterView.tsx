import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Search,
  Plus,
  Printer,
  CheckCircle2
} from 'lucide-react';
import { CommerceSubTab, CommerceProduct } from '../commerce/types';
import { CommerceKpiCards } from '../commerce/CommerceKpiCards';
import { CommerceNavPills } from '../commerce/CommerceNavPills';

// Views
import { CommerceDashboardView } from '../commerce/views/CommerceDashboardView';
import { ProductMasterView } from '../commerce/views/ProductMasterView';
import { ProductCategoriesView } from '../commerce/views/ProductCategoriesView';
import { UnitsView } from '../commerce/views/UnitsView';
import { HsnGstView } from '../commerce/views/HsnGstView';
import { RateSetupView } from '../commerce/views/RateSetupView';
import { CustomerCrmView } from '../commerce/views/CustomerCrmView';
import { SupplierSrmView } from '../commerce/views/SupplierSrmView';
import { PurchaseViews } from '../commerce/views/PurchaseViews';
import { SalesViews } from '../commerce/views/SalesViews';
import { PaymentsCenterView } from '../commerce/views/PaymentsCenterView';
import { CreditDebitNotesView } from '../commerce/views/CreditDebitNotesView';
import { UnifiedOrderCenterView } from '../commerce/views/UnifiedOrderCenterView';
import { GatePassView } from '../commerce/views/GatePassView';
import { CustomerSupplierLedgersView } from '../commerce/views/CustomerSupplierLedgersView';
import { CommerceReportsView } from '../commerce/views/CommerceReportsView';
import { CommerceSettingsView } from '../commerce/views/CommerceSettingsView';

// Modals
import { CommerceInteractiveFlowModal } from '../commerce/modals/CommerceInteractiveFlowModal';
import { CommerceNewProductModal } from '../commerce/modals/CommerceNewProductModal';
import { CommerceQuickActionsModal } from '../commerce/modals/CommerceQuickActionsModal';
import { CommerceUniversalSearchModal } from '../commerce/modals/CommerceUniversalSearchModal';
import { CommercePrintPreviewModal } from '../commerce/modals/CommercePrintPreviewModal';

import { MOCK_COMMERCE_PRODUCTS } from '../commerce/commerceMockData';

interface CommerceTradeMasterViewProps {
  initialSubTab?: string;
  onOpenPrintModal?: (title: string, data: any) => void;
  onOpenChatWithPerson?: (name: string) => void;
  onCreateTaskForPerson?: (name: string) => void;
}

export const CommerceTradeMasterView: React.FC<CommerceTradeMasterViewProps> = ({
  initialSubTab = 'commerce-dashboard',
  onOpenPrintModal: externalPrintModal,
  onOpenChatWithPerson,
  onCreateTaskForPerson
}) => {
  // Normalize tab input safely to one of the 26 subtabs
  const normalizeTab = (raw?: string): CommerceSubTab => {
    if (!raw) return 'commerce-dashboard';
    const clean = raw.toLowerCase();
    if (clean === 'dashboard' || clean === 'commerce' || clean === 'trade' || clean === 'commerce-dashboard') return 'commerce-dashboard';
    if (clean === 'products' || clean === 'product' || clean === 'items') return 'products';
    if (clean === 'categories' || clean === 'category') return 'categories';
    if (clean === 'units' || clean === 'unit') return 'units';
    if (clean === 'hsn' || clean === 'gst' || clean === 'hsn-gst') return 'hsn-gst';
    if (clean === 'rates' || clean === 'rate-setup' || clean === 'products-rates') return 'rates';
    if (clean === 'customers' || clean === 'customer' || clean === 'crm') return 'customers';
    if (clean === 'suppliers' || clean === 'supplier' || clean === 'srm' || clean === 'vendors') return 'suppliers';
    if (clean === 'purchase-requests' || clean === 'pr') return 'purchase-requests';
    if (clean === 'rfq') return 'rfq';
    if (clean === 'purchase' || clean === 'purchase-orders' || clean === 'po' || clean === 'procurement') return 'purchase-orders';
    if (clean === 'grn' || clean === 'receipts' || clean === 'inward') return 'grn';
    if (clean === 'purchase-bills' || clean === 'bills') return 'purchase-bills';
    if (clean === 'purchase-returns') return 'purchase-returns';
    if (clean === 'quotations' || clean === 'quotes') return 'quotations';
    if (clean === 'sales' || clean === 'sales-orders' || clean === 'so' || clean === 'sales-crm') return 'sales-orders';
    if (clean === 'delivery' || clean === 'dispatch') return 'delivery';
    if (clean === 'invoices' || clean === 'invoice' || clean === 'tax-invoice') return 'invoices';
    if (clean === 'payments' || clean === 'collections') return 'payments';
    if (clean === 'sales-returns') return 'sales-returns';
    if (clean === 'credit-debit-notes' || clean === 'notes') return 'credit-debit-notes';
    if (clean === 'orders' || clean === 'order-management') return 'orders';
    if (clean === 'gate-pass' || clean === 'gatepass') return 'gate-pass';
    if (clean === 'customer-ledger') return 'customer-ledger';
    if (clean === 'supplier-ledger') return 'supplier-ledger';
    if (clean === 'reports') return 'reports';
    if (clean === 'settings') return 'settings';
    return 'commerce-dashboard';
  };

  const [activeTab, setActiveTab] = useState<CommerceSubTab>(() => normalizeTab(initialSubTab));
  const [productsList, setProductsList] = useState<CommerceProduct[]>(MOCK_COMMERCE_PRODUCTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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
      setActiveTab(normalizeTab(initialSubTab));
    }
  }, [initialSubTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenPrintModal = (title: string, data: any) => {
    if (externalPrintModal) {
      externalPrintModal(title, data);
    } else {
      setPrintModalData({
        isOpen: true,
        title,
        data
      });
    }
  };

  const handleSaveProduct = (newProd: CommerceProduct, addAnother = false) => {
    setProductsList((prev) => [newProd, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400/50">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Global Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setIsFlowModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>6 Interactive Flows</span>
          </button>

          <button
            onClick={() => setIsQuickActionsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Actions (15)</span>
          </button>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search &bull; ⌘K</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => handleOpenPrintModal('Commerce & Trade Executive Briefing', productsList)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer"
            title="Print Executive Overview"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNewProductModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Material SKU</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards (14 KPIs with Status Indicators & STUDIO PREVIEW tag) */}
      <CommerceKpiCards
        onOpenFlowModal={() => setIsFlowModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* 3. Horizontal Clickable Commerce Navigation Pills (All 26 Tabs) */}
      <CommerceNavPills
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* 4. Active Tab Sub-View Rendering */}
      <div>
        {activeTab === 'commerce-dashboard' && (
          <CommerceDashboardView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
            onOpenFlowModal={() => setIsFlowModalOpen(true)}
          />
        )}

        {activeTab === 'products' && (
          <ProductMasterView
            products={productsList}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'categories' && (
          <ProductCategoriesView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'units' && (
          <UnitsView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'hsn-gst' && (
          <HsnGstView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'rates' && (
          <RateSetupView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerCrmView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'suppliers' && (
          <SupplierSrmView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {/* Procurement Life-cycle Subsections */}
        {(activeTab === 'purchase-requests' ||
          activeTab === 'rfq' ||
          activeTab === 'purchase-orders' ||
          activeTab === 'grn' ||
          activeTab === 'purchase-bills' ||
          activeTab === 'purchase-returns') && (
          <PurchaseViews
            activeSubSection={activeTab}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
            onOpenFlowModal={() => setIsFlowModalOpen(true)}
          />
        )}

        {/* Sales & Fulfillment Subsections */}
        {(activeTab === 'quotations' ||
          activeTab === 'sales-orders' ||
          activeTab === 'delivery' ||
          activeTab === 'invoices' ||
          activeTab === 'sales-returns') && (
          <SalesViews
            activeSubSection={activeTab}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
            onOpenFlowModal={() => setIsFlowModalOpen(true)}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsCenterView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'credit-debit-notes' && (
          <CreditDebitNotesView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'orders' && (
          <UnifiedOrderCenterView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'gate-pass' && (
          <GatePassView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'customer-ledger' && (
          <CustomerSupplierLedgersView
            initialType="customer"
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'supplier-ledger' && (
          <CustomerSupplierLedgersView
            initialType="supplier"
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'reports' && (
          <CommerceReportsView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
            onOpenPrintModal={handleOpenPrintModal}
          />
        )}

        {activeTab === 'settings' && (
          <CommerceSettingsView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToast={showToast}
          />
        )}
      </div>

      {/* 5. Modals */}
      <CommerceInteractiveFlowModal
        isOpen={isFlowModalOpen}
        onClose={() => setIsFlowModalOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onToast={showToast}
      />

      <CommerceNewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onSaveProduct={handleSaveProduct}
        onToast={showToast}
      />

      <CommerceQuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenNewProduct={() => setIsNewProductModalOpen(true)}
        onToast={showToast}
      />

      <CommerceUniversalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <CommercePrintPreviewModal
        isOpen={printModalData.isOpen}
        onClose={() => setPrintModalData({ isOpen: false, title: '', data: null })}
        documentTitle={printModalData.title}
        documentData={printModalData.data}
        onToast={showToast}
      />
    </div>
  );
};
