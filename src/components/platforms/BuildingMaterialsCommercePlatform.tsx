import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Users,
  FileText,
  Clock,
  DollarSign,
  Truck,
  RotateCcw,
  Star,
  Folder,
  CheckCircle2,
  Plus,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import {
  COMMERCE_PRODUCTS,
  COMMERCE_ORDERS,
  COMMERCE_SUPPLIER_QUOTES,
  CommerceProduct,
  CommerceOrder,
  SupplierQuote
} from '../../data/ecommerceStudioData';

// Modular E-Commerce Components
import { EcommerceDashboardView } from '../ecommerce/EcommerceDashboardView';
import { EcommerceShopView } from '../ecommerce/EcommerceShopView';
import { ProductsManagementView } from '../ecommerce/ProductsManagementView';
import { LateriteCatalogueView } from '../ecommerce/LateriteCatalogueView';
import { CategoriesManagementView } from '../ecommerce/CategoriesManagementView';
import { SuppliersManagementView } from '../ecommerce/SuppliersManagementView';
import { SupplierQuotesView } from '../ecommerce/SupplierQuotesView';
import { CustomerOrdersView } from '../ecommerce/CustomerOrdersView';
import { OrderDetailView } from '../ecommerce/OrderDetailView';
import { DeliveryTrackingView } from '../ecommerce/DeliveryTrackingView';
import { PaymentsView } from '../ecommerce/PaymentsView';
import { DispatchView } from '../ecommerce/DispatchView';
import { VehiclesView } from '../ecommerce/VehiclesView';
import { InvoicesView } from '../ecommerce/InvoicesView';
import { CustomerAccountsView } from '../ecommerce/CustomerAccountsView';
import { SupplierAccountsView } from '../ecommerce/SupplierAccountsView';
import { ReturnsDisputesView } from '../ecommerce/ReturnsDisputesView';
import { ReviewsRatingsView } from '../ecommerce/ReviewsRatingsView';
import { DocumentsView } from '../ecommerce/DocumentsView';
import { ReportsAnalyticsView } from '../ecommerce/ReportsAnalyticsView';

// Interactive Modals & Drawers
import { OrderLateriteWizard } from '../ecommerce/OrderLateriteWizard';
import { ProductDetailModal } from '../ecommerce/ProductDetailModal';
import { QuoteComparisonModal } from '../ecommerce/QuoteComparisonModal';
import { CustomerConfirmationModal } from '../ecommerce/CustomerConfirmationModal';
import { EcommerceChatDrawer } from '../ecommerce/EcommerceChatDrawer';
import { EcommerceOttTaskModal } from '../ecommerce/EcommerceOttTaskModal';

export type CommercePlatformSubpage =
  | 'dashboard'
  | 'shop'
  | 'products'
  | 'laterite-stone'
  | 'categories'
  | 'suppliers'
  | 'quotes'
  | 'orders'
  | 'order-tracking'
  | 'payments'
  | 'dispatch'
  | 'vehicles'
  | 'delivery'
  | 'invoices'
  | 'customer-accounts'
  | 'supplier-accounts'
  | 'returns-disputes'
  | 'reviews'
  | 'documents'
  | 'reports';

interface BuildingMaterialsCommercePlatformProps {
  onNavigateSection?: (sectionId: SectionId, options?: { commerceSubpage?: string; openWizard?: boolean }) => void;
  initialSubpage?: string;
  initialOpenWizard?: boolean;
}

export const BuildingMaterialsCommercePlatform: React.FC<BuildingMaterialsCommercePlatformProps> = ({
  onNavigateSection,
  initialSubpage,
  initialOpenWizard
}) => {
  const [activeSubpage, setActiveSubpage] = useState<CommercePlatformSubpage>(
    (initialSubpage as CommercePlatformSubpage) || 'dashboard'
  );

  // Sync if initialSubpage changes
  useEffect(() => {
    if (initialSubpage) {
      setActiveSubpage(initialSubpage as CommercePlatformSubpage);
    }
  }, [initialSubpage]);

  // Order List & Details State
  const [ordersList, setOrdersList] = useState<CommerceOrder[]>(COMMERCE_ORDERS);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<CommerceOrder | null>(null);

  // Modals & Drawers
  const [orderWizardOpen, setOrderWizardOpen] = useState<boolean>(Boolean(initialOpenWizard));
  const [preselectedProductId, setPreselectedProductId] = useState<string | undefined>(undefined);

  const [detailProduct, setDetailProduct] = useState<CommerceProduct | null>(null);
  const [compareQuotesOpen, setCompareQuotesOpen] = useState(false);
  const [confirmDeliveryOrder, setConfirmDeliveryOrder] = useState<CommerceOrder | null>(null);

  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatSupplierName, setChatSupplierName] = useState('Kasaragod Laterite Concession Pit #01');
  const [chatContextRef, setChatContextRef] = useState('ORD-RZ-2026-8821');

  const [ottTaskModalOpen, setOttTaskModalOpen] = useState(false);
  const [ottTaskOrder, setOttTaskOrder] = useState<CommerceOrder | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Handlers
  const handleOpenOrderWizard = (productId?: string) => {
    setPreselectedProductId(productId);
    setOrderWizardOpen(true);
  };

  const handleOpenChat = (supplierName: string, ref: string) => {
    setChatSupplierName(supplierName);
    setChatContextRef(ref);
    setChatDrawerOpen(true);
  };

  const handleOpenOttTask = (order: CommerceOrder) => {
    setOttTaskOrder(order);
    setOttTaskModalOpen(true);
  };

  const handleOrderSuccess = (newOrder: CommerceOrder) => {
    setOrdersList([newOrder, ...ordersList]);
    showToast(`Order ${newOrder.orderNumber} placed & synced to RZ® OTT!`);
  };

  const handleConfirmDeliverySuccess = (orderId: string, rating: number, feedback: string) => {
    setOrdersList(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'Customer Confirmed',
              deliveryStatusTimeline: 'Customer Confirmed — Completed',
              timeline: [
                ...o.timeline,
                {
                  id: `tm-${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  time: 'Just now',
                  actor: 'Customer',
                  status: 'Customer Confirmed',
                  notes: `Customer signed off on site receipt. Rating: ${rating}/5. ${feedback}`
                }
              ]
            }
          : o
      )
    );
    showToast(`Delivery confirmed for order. Escrow payout released.`);
  };

  // 20 Specified Navigation Sections matching Requirement #1
  const SECTIONS: { id: CommercePlatformSubpage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'laterite-stone', label: 'Laterite Stone', icon: Layers },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'quotes', label: 'Supplier Quotes', icon: FileText },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
    { id: 'order-tracking', label: 'Order Tracking', icon: Truck },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'dispatch', label: 'Dispatch', icon: Truck },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'delivery', label: 'Delivery', icon: Clock },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'customer-accounts', label: 'Customer Accounts', icon: Users },
    { id: 'supplier-accounts', label: 'Supplier Accounts', icon: Users },
    { id: 'returns-disputes', label: 'Returns / Disputes', icon: RotateCcw },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'documents', label: 'Documents', icon: Folder },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 border border-amber-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 6-Step Order Laterite Stone Wizard (Flow 7) */}
      <OrderLateriteWizard
        isOpen={orderWizardOpen}
        onClose={() => setOrderWizardOpen(false)}
        preselectedProductId={preselectedProductId}
        onOrderSuccess={handleOrderSuccess}
        onOpenChatWithSupplier={handleOpenChat}
      />

      {/* Product Detail Modal (Flow 6) */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
        onOrderNow={(prod) => {
          setDetailProduct(null);
          handleOpenOrderWizard(prod.id);
        }}
        onRequestQuote={(prod) => {
          setDetailProduct(null);
          setActiveSubpage('quotes');
          showToast(`RFQ requested for ${prod.name}`);
        }}
        onChatWithSupplier={(supplier, ctx) => {
          setDetailProduct(null);
          handleOpenChat(supplier, ctx);
        }}
        onAddToRequirement={(prod) => {
          setDetailProduct(null);
          showToast(`Added ${prod.name} to Contract & Job requirement.`);
        }}
      />

      {/* Quote Comparison Modal (Flow 11) */}
      <QuoteComparisonModal
        quotes={COMMERCE_SUPPLIER_QUOTES}
        isOpen={compareQuotesOpen}
        onClose={() => setCompareQuotesOpen(false)}
        onSelectQuote={(q) => {
          setCompareQuotesOpen(false);
          showToast(`Selected quote ${q.quoteNumber} from ${q.supplierName}`);
        }}
      />

      {/* Customer Delivery Confirmation Modal (Flow 19) */}
      <CustomerConfirmationModal
        order={confirmDeliveryOrder}
        isOpen={Boolean(confirmDeliveryOrder)}
        onClose={() => setConfirmDeliveryOrder(null)}
        onConfirmSuccess={handleConfirmDeliverySuccess}
        onSwitchToDispute={(ord) => {
          setActiveSubpage('returns-disputes');
          showToast(`Switched to dispute logger for order ${ord.orderNumber}`);
        }}
      />

      {/* Live RZ Chat Drawer (Flow 24) */}
      <EcommerceChatDrawer
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
        supplierName={chatSupplierName}
        contextRef={chatContextRef}
      />

      {/* RZ OTT Task Sync Modal (Flow 25) */}
      <EcommerceOttTaskModal
        order={ottTaskOrder}
        isOpen={ottTaskModalOpen}
        onClose={() => setOttTaskModalOpen(false)}
        onTaskCreated={() => showToast('Operational task synchronized to RZ® OTT.')}
      />

      {/* PLATFORM HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                PLATFORM 05 &bull; BUILDING MATERIALS E-COMMERCE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Direct Quarry Concessions
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                Studio Preview / Demo Data
              </span>
            </div>
            <h1 className="text-xl font-black text-white">
              Building Materials Commerce Operations
            </h1>
          </div>
        </div>

        {/* Top Direct Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => handleOpenOrderWizard()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>ORDER LATERITE STONE</span>
          </button>

          <button
            onClick={() => handleOpenChat('Direct Concession Desk', 'RFQ Assistance')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>RZ Chat</span>
          </button>

          <button
            onClick={() => handleOpenOttTask(ordersList[0])}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>RZ OTT</span>
          </button>
        </div>
      </div>

      {/* 20-MODULE SECONDARY NAVIGATION (All accessible) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {SECTIONS.map((sec) => {
            const isAct = activeSubpage === sec.id && !selectedOrderForDetail;
            const Icon = sec.icon;
            const isLaterite = sec.id === 'laterite-stone';
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedOrderForDetail(null);
                  setActiveSubpage(sec.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isAct
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                    : isLaterite
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
                {isLaterite && (
                  <span className="text-[9px] font-mono px-1 rounded bg-amber-500/30 text-amber-200 uppercase font-bold">
                    Concession
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN VIEW CONTENT SWITCHER */}
      {selectedOrderForDetail ? (
        /* Order Detail Dossier (Flow 13 & 14) */
        <OrderDetailView
          order={selectedOrderForDetail}
          onBack={() => setSelectedOrderForDetail(null)}
          onOpenChat={handleOpenChat}
          onCreateOttTask={handleOpenOttTask}
          onOpenInvoice={(ord) => {
            setSelectedOrderForDetail(null);
            setActiveSubpage('invoices');
          }}
          onConfirmDelivery={(ord) => setConfirmDeliveryOrder(ord)}
          onRaiseDispute={(ord) => {
            setSelectedOrderForDetail(null);
            setActiveSubpage('returns-disputes');
          }}
        />
      ) : activeSubpage === 'dashboard' ? (
        /* 1. Dashboard (Flow 2) */
        <EcommerceDashboardView
          onOrderLaterite={() => handleOpenOrderWizard()}
          onNavigateSubpage={(sub) => setActiveSubpage(sub as any)}
          onSelectOrder={(ord) => setSelectedOrderForDetail(ord)}
        />
      ) : activeSubpage === 'shop' ? (
        /* 2. Customer-Facing Shop (Flow 3) */
        <EcommerceShopView
          onSelectProduct={(prod) => setDetailProduct(prod)}
          onOrderLaterite={() => handleOpenOrderWizard()}
          onNavigateSubpage={(sub) => setActiveSubpage(sub as any)}
          onRequestQuoteForProduct={(prod) => {
            setActiveSubpage('quotes');
            showToast(`RFQ started for ${prod.name}`);
          }}
        />
      ) : activeSubpage === 'products' ? (
        /* 3. Products Management (Flow 4 & 9) */
        <ProductsManagementView
          onSelectProduct={(prod) => setDetailProduct(prod)}
          onOrderProduct={(prod) => handleOpenOrderWizard(prod.id)}
          onNewProduct={() => showToast('New product cataloguing modal opened.')}
        />
      ) : activeSubpage === 'laterite-stone' ? (
        /* 4. Laterite Stone Catalogue (Flow 5) */
        <LateriteCatalogueView
          onSelectProduct={(prod) => setDetailProduct(prod)}
          onOrderProduct={(prod) => handleOpenOrderWizard(prod.id)}
          onRequestQuote={(prod) => {
            setActiveSubpage('quotes');
            showToast(`Quote request initiated for ${prod.name}`);
          }}
          onOpenOrderWizard={() => handleOpenOrderWizard()}
        />
      ) : activeSubpage === 'categories' ? (
        /* 5. Product Categories (Flow 4) */
        <CategoriesManagementView
          onSelectCategory={(catName) => {
            setActiveSubpage('shop');
            showToast(`Filtering shop by ${catName}`);
          }}
        />
      ) : activeSubpage === 'suppliers' ? (
        /* 6. Supplier Management (Flow 8 & 9) */
        <SuppliersManagementView
          onChatWithSupplier={handleOpenChat}
          onViewSupplierProducts={(supId) => {
            setActiveSubpage('products');
            showToast(`Showing products for supplier ${supId}`);
          }}
        />
      ) : activeSubpage === 'quotes' ? (
        /* 7. Supplier Quotes (Flow 10) */
        <SupplierQuotesView
          quotes={COMMERCE_SUPPLIER_QUOTES}
          onCompareQuotes={() => setCompareQuotesOpen(true)}
          onAcceptQuote={(q) => {
            handleOpenOrderWizard(q.productId);
          }}
          onChatWithSupplier={handleOpenChat}
        />
      ) : activeSubpage === 'orders' ? (
        /* 8. Customer Orders (Flow 12) */
        <CustomerOrdersView
          orders={ordersList}
          onSelectOrder={(ord) => setSelectedOrderForDetail(ord)}
          onNewOrderWizard={() => handleOpenOrderWizard()}
        />
      ) : activeSubpage === 'order-tracking' || activeSubpage === 'delivery' ? (
        /* 9 & 13. Order Tracking & Delivery (Flow 18 & 19) */
        <DeliveryTrackingView
          orders={ordersList}
          onOpenConfirmationModal={(ord) => setConfirmDeliveryOrder(ord)}
          onOpenDisputeModal={(ord) => {
            setActiveSubpage('returns-disputes');
          }}
        />
      ) : activeSubpage === 'payments' ? (
        /* 10. Payments Ledger (Flow 15) */
        <PaymentsView />
      ) : activeSubpage === 'dispatch' ? (
        /* 11. Quarry Gate Dispatch (Flow 16) */
        <DispatchView />
      ) : activeSubpage === 'vehicles' ? (
        /* 12. Delivery Vehicles Fleet (Flow 17) */
        <VehiclesView />
      ) : activeSubpage === 'invoices' ? (
        /* 14. Invoices & GST Tax Documents (Flow 23) */
        <InvoicesView order={ordersList[0]} />
      ) : activeSubpage === 'customer-accounts' ? (
        /* 15. Customer Accounts (Flow 21) */
        <CustomerAccountsView />
      ) : activeSubpage === 'supplier-accounts' ? (
        /* 16. Supplier Accounts (Flow 22) */
        <SupplierAccountsView />
      ) : activeSubpage === 'returns-disputes' ? (
        /* 17. Returns & Disputes (Flow 20) */
        <ReturnsDisputesView />
      ) : activeSubpage === 'reviews' ? (
        /* 18. Customer Reviews & Ratings (Flow 27) */
        <ReviewsRatingsView />
      ) : activeSubpage === 'documents' ? (
        /* 19. Documents Vault (Flow 28) */
        <DocumentsView />
      ) : activeSubpage === 'reports' ? (
        /* 20. Reports & Analytics (Flow 26) */
        <ReportsAnalyticsView />
      ) : null}
    </div>
  );
};
