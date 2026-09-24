import React, { useState } from 'react';
import {
  Building2,
  Activity,
  Layers,
  Zap,
  Fuel,
  Wrench,
  TrendingUp,
  Truck,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Plus,
  DollarSign,
  Users,
  FileText,
  ShieldCheck,
  Download,
  Printer,
  Sparkles,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Sliders,
  Scale,
  ShoppingBag,
  CreditCard,
  Check,
  ArrowRight,
  X
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import { CrusherManagementSection } from '../CrusherManagementSection';
import { OperationalAttendanceModule } from '../operations/OperationalAttendanceModule';
import { OperationalPayInOutModule } from '../operations/OperationalPayInOutModule';
import { OperationalSalesPurchaseModule } from '../operations/OperationalSalesPurchaseModule';
import { OperationalReportsExplorer } from '../operations/OperationalReportsExplorer';
import { QuickActionModal } from '../QuickActionModal';

// Crusher Studio Data & Types
import {
  CrusherPlant,
  CrusherPartner,
  CrusherInvestment,
  MaterialReceipt,
  CrusherProduction,
  CrusherProduct,
  CrusherStockItem,
  CrusherWastageLog,
  CrusherPurchase,
  CrusherSale,
  CrusherGateEntry,
  CrusherGatePass,
  CrusherExpense,
  CrusherPartnerSettlement,
  CrusherDocument,
  SAMPLE_CRUSHER_PLANTS,
  SAMPLE_CRUSHER_PARTNERS,
  SAMPLE_CRUSHER_INVESTMENTS,
  SAMPLE_MATERIAL_RECEIPTS,
  SAMPLE_CRUSHER_PRODUCTIONS,
  SAMPLE_CRUSHER_PRODUCTS,
  SAMPLE_CRUSHER_STOCKS,
  SAMPLE_CRUSHER_WASTAGE_LOGS,
  SAMPLE_CRUSHER_PURCHASES,
  SAMPLE_CRUSHER_SALES,
  SAMPLE_CRUSHER_GATE_ENTRIES,
  SAMPLE_CRUSHER_GATE_PASSES,
  SAMPLE_CRUSHER_EXPENSES,
  SAMPLE_CRUSHER_SETTLEMENTS,
  SAMPLE_CRUSHER_DOCUMENTS
} from '../../data/crusherStudioData';

// Modals
import {
  NewCrusherPlantModal,
  AddCrusherPartnerModal,
  NewMaterialReceiptModal,
  NewProductionModal,
  EndToEndWorkflowModal
} from '../crusher/CrusherModals';

// Sub-Views
import { CrusherDashboardView } from '../crusher/CrusherDashboardView';
import { CrusherPlantListView } from '../crusher/CrusherPlantListView';
import { CrusherProfileView } from '../crusher/CrusherProfileView';
import { CrusherPartnersView } from '../crusher/CrusherPartnersView';
import { CrusherInvestmentsView } from '../crusher/CrusherInvestmentsView';
import { CrusherReceiptsView } from '../crusher/CrusherReceiptsView';
import { QuarryCrusherFlowView } from '../crusher/QuarryCrusherFlowView';
import { CrusherProductionView } from '../crusher/CrusherProductionView';
import { CrusherProductsView } from '../crusher/CrusherProductsView';
import { CrusherStockView } from '../crusher/CrusherStockView';
import { CrusherWastageView } from '../crusher/CrusherWastageView';
import { CrusherPurchasesView } from '../crusher/CrusherPurchasesView';
import { CrusherSalesView } from '../crusher/CrusherSalesView';
import { CrusherGateEntryView } from '../crusher/CrusherGateEntryView';
import { CrusherGatePassView } from '../crusher/CrusherGatePassView';
import { CrusherExpensesView } from '../crusher/CrusherExpensesView';
import { CrusherSettlementsView } from '../crusher/CrusherSettlementsView';
import { CrusherFinanceSummaryView } from '../crusher/CrusherFinanceSummaryView';
import { CrusherDocumentsView } from '../crusher/CrusherDocumentsView';
import { CrusherReportsView } from '../crusher/CrusherReportsView';

interface CrusherManagementPlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
  initialTab?: CrusherSubpageId;
}

export type CrusherSubpageId =
  | 'dashboard'
  | 'crusher-plants'
  | 'crusher-master'
  | 'partners'
  | 'investments'
  | 'raw-material'
  | 'quarry-flow'
  | 'material-receipt'
  | 'production'
  | 'products'
  | 'stock'
  | 'wastage'
  | 'purchases'
  | 'orders'
  | 'sales'
  | 'dispatch'
  | 'gate-entry'
  | 'gate-pass'
  | 'expenses'
  | 'partner-settlement'
  | 'accounts'
  | 'documents'
  | 'reports'
  | 'attendance'
  | 'equipment'
  | 'maintenance'
  | 'automation';

export const CrusherManagementPlatform: React.FC<CrusherManagementPlatformProps> = ({
  onNavigateSection,
  initialTab
}) => {
  const [activePage, setActivePage] = useState<CrusherSubpageId>(initialTab || 'dashboard');

  React.useEffect(() => {
    if (initialTab) {
      setActivePage(initialTab);
    }
  }, [initialTab]);

  const [selectedPlant, setSelectedPlant] = useState<CrusherPlant | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // Modal open states
  const [newPlantModalOpen, setNewPlantModalOpen] = useState(false);
  const [addPartnerModalOpen, setAddPartnerModalOpen] = useState(false);
  const [newReceiptModalOpen, setNewReceiptModalOpen] = useState(false);
  const [newProductionModalOpen, setNewProductionModalOpen] = useState(false);
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);

  // Reactive state seeded from comprehensive demo data
  const [plants, setPlants] = useState<CrusherPlant[]>(SAMPLE_CRUSHER_PLANTS);
  const [partners, setPartners] = useState<CrusherPartner[]>(SAMPLE_CRUSHER_PARTNERS);
  const [investments, setInvestments] = useState<CrusherInvestment[]>(SAMPLE_CRUSHER_INVESTMENTS);
  const [receipts, setReceipts] = useState<MaterialReceipt[]>(SAMPLE_MATERIAL_RECEIPTS);
  const [productions, setProductions] = useState<CrusherProduction[]>(SAMPLE_CRUSHER_PRODUCTIONS);
  const [products] = useState<CrusherProduct[]>(SAMPLE_CRUSHER_PRODUCTS);
  const [stocks] = useState<CrusherStockItem[]>(SAMPLE_CRUSHER_STOCKS);
  const [wastageLogs] = useState<CrusherWastageLog[]>(SAMPLE_CRUSHER_WASTAGE_LOGS);
  const [purchases] = useState<CrusherPurchase[]>(SAMPLE_CRUSHER_PURCHASES);
  const [sales] = useState<CrusherSale[]>(SAMPLE_CRUSHER_SALES);
  const [gateEntries] = useState<CrusherGateEntry[]>(SAMPLE_CRUSHER_GATE_ENTRIES);
  const [gatePasses] = useState<CrusherGatePass[]>(SAMPLE_CRUSHER_GATE_PASSES);
  const [expenses] = useState<CrusherExpense[]>(SAMPLE_CRUSHER_EXPENSES);
  const [settlements] = useState<CrusherPartnerSettlement[]>(SAMPLE_CRUSHER_SETTLEMENTS);
  const [documents] = useState<CrusherDocument[]>(SAMPLE_CRUSHER_DOCUMENTS);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleNavigatePage = (pageId: CrusherSubpageId | string) => {
    setSelectedPlant(null);
    if (pageId === 'crusher-master') setActivePage('crusher-plants');
    else if (pageId === 'crusher-partners') setActivePage('partners');
    else if (pageId === 'materials') setActivePage('products');
    else setActivePage(pageId as CrusherSubpageId);
  };

  // 26 Navigation Items structured logically
  const SUBPAGES: { id: CrusherSubpageId; number: number; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', number: 1, label: 'Crusher Dashboard', icon: BarChart3 },
    { id: 'crusher-plants', number: 2, label: 'Crusher Plants & Complexes', icon: Building2 },
    { id: 'partners', number: 3, label: 'Crusher Partners', icon: Users },
    { id: 'investments', number: 4, label: 'Investments & Capital', icon: DollarSign },
    { id: 'quarry-flow', number: 5, label: 'Quarry → Crusher Traceability', icon: Sparkles },
    { id: 'raw-material', number: 6, label: 'Raw Boulder Intake', icon: Layers },
    { id: 'material-receipt', number: 7, label: 'Weighbridge Receipts', icon: Scale },
    { id: 'production', number: 8, label: 'Production Batches', icon: Activity },
    { id: 'products', number: 9, label: 'Products & Sand Grades', icon: Layers },
    { id: 'stock', number: 10, label: 'Stock & Silos', icon: Building2 },
    { id: 'wastage', number: 11, label: 'Wastage & Recovery', icon: AlertTriangle },
    { id: 'purchases', number: 12, label: 'Purchases & Spares', icon: Wrench },
    { id: 'orders', number: 13, label: 'Customer Orders', icon: ShoppingBag },
    { id: 'sales', number: 14, label: 'Sales & Invoices', icon: TrendingUp },
    { id: 'dispatch', number: 15, label: 'Dispatch & Silo Radar', icon: Truck },
    { id: 'gate-entry', number: 16, label: 'Gate Entry (In/Out)', icon: Truck },
    { id: 'gate-pass', number: 17, label: 'Digital Gate Pass', icon: FileText },
    { id: 'expenses', number: 18, label: 'Operational Expenses', icon: DollarSign },
    { id: 'partner-settlement', number: 19, label: 'Partner Profit Settlements', icon: Users },
    { id: 'accounts', number: 20, label: 'Finance & P&L Statement', icon: BarChart3 },
    { id: 'documents', number: 21, label: 'Documents & PCB CTO', icon: FileText },
    { id: 'reports', number: 22, label: 'Crusher Reports', icon: FileText },
    { id: 'attendance', number: 23, label: 'Attendance & Operators', icon: Users },
    { id: 'equipment', number: 24, label: 'Equipment & Machinery', icon: Truck },
    { id: 'maintenance', number: 25, label: 'Plant Maintenance', icon: Wrench },
    { id: 'automation', number: 26, label: 'Automation & OTT Tasks', icon: Clock }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-cyan-400 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Modals */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        defaultAction="CRUSHER"
        onNavigate={onNavigateSection}
      />

      <NewCrusherPlantModal
        isOpen={newPlantModalOpen}
        onClose={() => setNewPlantModalOpen(false)}
        onSave={plant => {
          setPlants(prev => [plant, ...prev]);
          showToast(`Registered new crusher plant: ${plant.name} (${plant.code})`);
        }}
      />

      <AddCrusherPartnerModal
        isOpen={addPartnerModalOpen}
        onClose={() => setAddPartnerModalOpen(false)}
        plants={plants}
        onSave={partner => {
          setPartners(prev => [partner, ...prev]);
          showToast(`Crusher Partner registered: ${partner.name} (${partner.ownershipPercent}% Equity)`);
        }}
      />

      <NewMaterialReceiptModal
        isOpen={newReceiptModalOpen}
        onClose={() => setNewReceiptModalOpen(false)}
        plants={plants}
        onSave={receipt => {
          setReceipts(prev => [receipt, ...prev]);
          showToast(`Weighbridge receipt ${receipt.receiptNumber} recorded: ${receipt.quantityTons} MT`);
        }}
      />

      <NewProductionModal
        isOpen={newProductionModalOpen}
        onClose={() => setNewProductionModalOpen(false)}
        plants={plants}
        onSave={prod => {
          setProductions(prev => [prod, ...prev]);
          showToast(`Logged production batch ${prod.productionNumber}: ${prod.totalOutputTons} MT output`);
        }}
      />

      <EndToEndWorkflowModal
        isOpen={workflowModalOpen}
        onClose={() => setWorkflowModalOpen(false)}
      />

      {/* Platform Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                PLATFORM 2 &bull; 26 WORKFLOW MODULES
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                250 TPH VSI &bull; Online
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                STUDIO PREVIEW / DEMO DATA
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                KSPCB CTO Valid
              </span>
            </div>
            <h1 className="text-xl font-black text-white">Crusher Management Platform</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setWorkflowModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Traceability Model</span>
          </button>
          <button
            onClick={() => setNewPlantModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Crusher Plant</span>
          </button>
        </div>
      </div>

      {/* 26-PAGE SUBNAVIGATOR (Scrollable tabs with numbers) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {SUBPAGES.map(page => {
            const isAct = !selectedPlant && activePage === page.id;
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => {
                  setSelectedPlant(null);
                  setActivePage(page.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isAct
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] font-mono opacity-80">{page.number}.</span>
                <Icon className="w-3.5 h-3.5" />
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PLANT PROFILE VIEW (Triggered when user clicks "View Profile" on any plant) */}
      {selectedPlant ? (
        <CrusherProfileView
          plant={selectedPlant}
          partners={partners.filter(p => p.assignedPlantNames.includes(selectedPlant.name))}
          investments={investments.filter(i => i.plantName.includes(selectedPlant.name) || i.plantName.includes('CP-01'))}
          receipts={receipts}
          productions={productions}
          products={products}
          stocks={stocks}
          sales={sales}
          gateEntries={gateEntries}
          gatePasses={gatePasses}
          expenses={expenses}
          settlements={settlements}
          documents={documents}
          onBack={() => setSelectedPlant(null)}
          onNavigatePage={handleNavigatePage}
        />
      ) : (
        <>
          {/* PAGE 1: CRUSHER DASHBOARD */}
          {activePage === 'dashboard' && (
            <CrusherDashboardView
              plants={plants}
              stocks={stocks}
              receipts={receipts}
              productions={productions}
              onNavigatePage={handleNavigatePage}
              onOpenNewPlant={() => setNewPlantModalOpen(true)}
              onOpenNewReceipt={() => setNewReceiptModalOpen(true)}
              onOpenNewProduction={() => setNewProductionModalOpen(true)}
              onOpenWorkflow={() => setWorkflowModalOpen(true)}
              onSelectPlant={plant => setSelectedPlant(plant)}
            />
          )}

          {/* PAGE 2: CRUSHER PLANTS & MASTER LIST */}
          {(activePage === 'crusher-plants' || activePage === 'crusher-master') && (
            <CrusherPlantListView
              plants={plants}
              onSelectPlant={plant => setSelectedPlant(plant)}
              onOpenNewPlant={() => setNewPlantModalOpen(true)}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 3: CRUSHER PARTNERS */}
          {activePage === 'partners' && (
            <CrusherPartnersView
              partners={partners}
              onOpenAddPartner={() => setAddPartnerModalOpen(true)}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 4: INVESTMENTS & CAPITAL ACCOUNTS */}
          {activePage === 'investments' && (
            <CrusherInvestmentsView
              investments={investments}
              partners={partners}
              onOpenAddInvestment={() => showToast('Opening Capital Contribution Voucher...')}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 5: QUARRY → CRUSHER FLOW */}
          {activePage === 'quarry-flow' && (
            <QuarryCrusherFlowView
              plants={plants}
              receipts={receipts}
              onOpenNewReceipt={() => setNewReceiptModalOpen(true)}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 6 & 7: RAW MATERIAL INTAKE & WEIGHBRIDGE RECEIPTS */}
          {(activePage === 'raw-material' || activePage === 'material-receipt') && (
            <CrusherReceiptsView
              receipts={receipts}
              onOpenNewReceipt={() => setNewReceiptModalOpen(true)}
              onOpenWorkflow={() => setWorkflowModalOpen(true)}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 8: PRODUCTION BATCHES */}
          {activePage === 'production' && (
            <CrusherProductionView
              productions={productions}
              onOpenNewProduction={() => setNewProductionModalOpen(true)}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 9: PRODUCTS & SAND GRADES */}
          {activePage === 'products' && (
            <CrusherProductsView
              products={products}
              onOpenNewProduct={() => showToast('New Product Form opened')}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 10 & 15: STOCK & SILOS / DISPATCH */}
          {(activePage === 'stock' || activePage === 'dispatch') && (
            <div className="space-y-6">
              <CrusherStockView
                stocks={stocks}
                onOpenNewProduction={() => setNewProductionModalOpen(true)}
                onNavigatePage={handleNavigatePage}
              />
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
                <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                  <span>Crusher Operational Controls & Live Silo Stock Radar</span>
                  <span className="text-xs text-cyan-400 font-mono">SCADA Synced</span>
                </h3>
                <CrusherManagementSection />
              </div>
            </div>
          )}

          {/* PAGE 11: WASTAGE & BY-PRODUCT RECOVERY */}
          {activePage === 'wastage' && (
            <CrusherWastageView
              wastageLogs={wastageLogs}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 12: PURCHASES & EQUIPMENT SPARES */}
          {activePage === 'purchases' && (
            <CrusherPurchasesView
              purchases={purchases}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 13: CUSTOMER ORDERS */}
          {activePage === 'orders' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      CRUSHER COMMERCIAL ORDERS
                    </span>
                    <h3 className="text-lg font-bold text-white">Aggregates & M-Sand Customer Orders</h3>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Created new crusher aggregate booking')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  + Create Aggregate Order
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Order Ref</th>
                      <th className="p-3">Client & Project</th>
                      <th className="p-3">Material Grade</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Total Value</th>
                      <th className="p-3">Silo Allocation</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {[
                      { ref: 'CR-ORD-881', client: 'Kochi Metro Rail JV', mat: 'M-Sand (Concrete Grade)', qty: '650 MT', val: '₹4,87,500', silo: 'Silo 1 (Active)', status: 'LOADING' },
                      { ref: 'CR-ORD-882', client: 'Sobha City Horizon', mat: '20mm Graded Blue Metal', qty: '420 MT', val: '₹2,85,600', silo: 'Yard Hopper 2', status: 'CONFIRMED' },
                      { ref: 'CR-ORD-883', client: 'Malabar Precast Slab Plant', mat: 'P-Sand (Plastering Grade)', qty: '280 MT', val: '₹2,18,400', silo: 'VSI Silo 3', status: 'SCHEDULED' }
                    ].map(row => (
                      <tr key={row.ref} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-cyan-400">{row.ref}</td>
                        <td className="p-3 font-bold text-white">{row.client}</td>
                        <td className="p-3 text-slate-200">{row.mat}</td>
                        <td className="p-3 font-mono font-bold text-white">{row.qty}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">{row.val}</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{row.silo}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold font-mono">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAGE 14: SALES & INVOICES */}
          {activePage === 'sales' && (
            <CrusherSalesView
              sales={sales}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 16: GATE ENTRY */}
          {activePage === 'gate-entry' && (
            <CrusherGateEntryView
              gateEntries={gateEntries}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 17: DIGITAL GATE PASS */}
          {activePage === 'gate-pass' && (
            <CrusherGatePassView
              gatePasses={gatePasses}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 18: OPERATIONAL EXPENSES */}
          {activePage === 'expenses' && (
            <CrusherExpensesView
              expenses={expenses}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 19: PARTNER SETTLEMENTS */}
          {activePage === 'partner-settlement' && (
            <CrusherSettlementsView
              settlements={settlements}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 20: FINANCE & P&L STATEMENT */}
          {activePage === 'accounts' && (
            <CrusherFinanceSummaryView
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 21: DOCUMENTS & STATUTORY PCB */}
          {activePage === 'documents' && (
            <CrusherDocumentsView
              documents={documents}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 22: REPORTS & ANALYTICS */}
          {activePage === 'reports' && (
            <CrusherReportsView
              plants={plants}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {/* PAGE 23: ATTENDANCE & OPERATORS */}
          {activePage === 'attendance' && (
            <OperationalAttendanceModule
              platform="CRUSHER"
              siteTitle="Central Crusher Complex #01 Plant Workforce"
              onCreateOttTask={t => showToast(t)}
            />
          )}

          {/* PAGE 24: EQUIPMENT & MACHINERY */}
          {activePage === 'equipment' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">HEAVY FLEET & LOADERS</span>
                    <h3 className="text-lg font-bold text-white">Crusher Yard Loaders & Excavator Fleet</h3>
                  </div>
                </div>
                <button
                  onClick={() => showToast('New Loader Asset Registered')}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  + Add Machine
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'WL-01', name: 'CAT 950GC Wheel Loader', cap: '3.2 m³ Bucket', duty: 'Stockpile Silo Feeder', status: 'ACTIVE', fuel: '16.5 L/hr' },
                  { id: 'WL-02', name: 'Volvo L120H Loader', cap: '3.5 m³ Bucket', duty: 'Customer Tipper Dispatch', status: 'ACTIVE', fuel: '18.2 L/hr' },
                  { id: 'EX-03', name: 'Komatsu PC210 Hydraulic Excavator', cap: '1.2 m³ Heavy Bucket', duty: 'Primary Jaw Hopper Feeder', status: 'STANDBY', fuel: '21.0 L/hr' }
                ].map(eq => (
                  <div key={eq.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400">{eq.id}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                        {eq.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">{eq.name}</div>
                    <div className="text-xs text-slate-400">{eq.duty}</div>
                    <div className="flex justify-between text-[11px] font-mono pt-2 border-t border-slate-900 text-slate-400">
                      <span>Cap: {eq.cap}</span>
                      <span className="text-amber-400">{eq.fuel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 25: PLANT MAINTENANCE & SPARES */}
          {activePage === 'maintenance' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">PREVENTIVE MAINTENANCE</span>
                    <h3 className="text-lg font-bold text-white">Crusher Overhauls & Wear Parts Replacement</h3>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Logged Preventive Maintenance Job Card')}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  + Schedule Overhaul
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { code: 'JOB-901', mach: 'Primary Jaw Crusher CJ412', task: 'Manganese Fixed & Swing Jaw Plate Inversion', due: 'In 36 Operating Hours', lead: 'Wear Index 82%' },
                  { code: 'JOB-902', mach: 'Tertiary VSI 7150 Rotopactor', task: 'Rotor Tip & Cavity Wear Ring Inspection', due: 'Every Sunday (Shift 3)', lead: 'Inspected OK' },
                  { code: 'JOB-903', mach: 'Triple-Deck Inclined Screen #02', task: 'Tensioning 20mm & 10mm Wire Mesh Decks', due: 'Scheduled Tomorrow', lead: 'Mesh Kit Ready' }
                ].map(job => (
                  <div key={job.code} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{job.code}</span>
                        <span className="font-bold text-white">{job.mach}</span>
                      </div>
                      <div className="text-slate-400 mt-0.5">{job.task}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-amber-400 font-bold">{job.due}</div>
                      <div className="text-slate-500 text-[10px]">{job.lead}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 26: AUTOMATION & OTT TASKS */}
          {activePage === 'automation' && (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Crusher Automation & OTT Telemetry Tasks</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Automated continuous belt scale weighers, automated silo radar level telemetry, scheduled partner dividend calculation triggers, and statutory permit expiry notifications.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => showToast('Refreshed SCADA & OTT task pipelines')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition cursor-pointer"
                >
                  Run Telemetry Sync Now
                </button>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
