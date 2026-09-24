import React, { useState } from 'react';
import {
  Pickaxe,
  Building2,
  Layers,
  Activity,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  BarChart3,
  Fuel,
  Wrench,
  Users,
  FileText,
  DollarSign,
  ShieldCheck,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Printer,
  Download,
  Paperclip,
  Share2,
  Sparkles,
  Zap,
  ShoppingBag,
  CreditCard,
  MapPin,
  Compass,
  ArrowRight
} from 'lucide-react';
import { SectionId } from '../../types/architecture';

// Imported Studio Sample Data
import {
  SAMPLE_QUARRIES,
  SAMPLE_PARCELS,
  SAMPLE_OWNERS,
  SAMPLE_PARTNERS,
  SAMPLE_AGREEMENTS,
  SAMPLE_WORKING_AREAS,
  SAMPLE_PRODUCTIONS,
  SAMPLE_LOADS,
  SAMPLE_SALES,
  SAMPLE_EXPENSES,
  SAMPLE_SETTLEMENTS,
  SAMPLE_DOCUMENTS,
  SAMPLE_GATE_PASSES,
  QuarryItem,
  LandParcel,
  LandOwnerProfile,
  QuarryPartner,
  QuarryAgreement,
  WorkingArea,
  ProductionEntry,
  QuarryLoad,
  QuarrySale,
  QuarryExpense,
  SettlementRecord,
  QuarryDocument,
  GatePassRecord
} from '../../data/quarryStudioData';

// Imported Quarry Views
import { QuarryDashboardView } from '../quarry/QuarryDashboardView';
import { QuarryListView } from '../quarry/QuarryListView';
import { QuarryProfileView } from '../quarry/QuarryProfileView';
import { QuarryParcelsView } from '../quarry/QuarryParcelsView';
import { QuarryOwnersView } from '../quarry/QuarryOwnersView';
import { QuarryPartnersView } from '../quarry/QuarryPartnersView';
import { QuarryAgreementsView } from '../quarry/QuarryAgreementsView';
import { QuarryWorkingAreasView } from '../quarry/QuarryWorkingAreasView';
import { QuarryProductionView } from '../quarry/QuarryProductionView';
import { QuarryLoadsView } from '../quarry/QuarryLoadsView';
import { QuarryGatePassView } from '../quarry/QuarryGatePassView';
import { QuarrySalesView } from '../quarry/QuarrySalesView';
import { QuarryExpensesView } from '../quarry/QuarryExpensesView';
import { QuarrySettlementsView } from '../quarry/QuarrySettlementsView';
import { QuarryReportsView } from '../quarry/QuarryReportsView';
import { QuarryDocumentsView } from '../quarry/QuarryDocumentsView';

// Modals
import {
  NewQuarryModal,
  AddParcelModal,
  AddLandOwnerModal,
  NewAgreementModal,
  ProductionEntryModal,
  NewLoadModal,
  ExpenseModal
} from '../quarry/QuarryModals';
import { QuarryEndToEndFlowModal } from '../quarry/QuarryEndToEndFlowModal';

// Existing Sub-modules preserved
import { QuarryProductsView } from '../quarry/QuarryProductsView';
import { QuarryProductionStockView } from '../quarry/QuarryProductionStockView';
import { QuarryGatePassDispatchView } from '../quarry/QuarryGatePassDispatchView';
import { QuarryLandLeasesView } from '../quarry/QuarryLandLeasesView';
import { QuarryOrderManagementView } from '../quarry/QuarryOrderManagementView';
import { OperationalAttendanceModule } from '../operations/OperationalAttendanceModule';
import { OperationalPayInOutModule } from '../operations/OperationalPayInOutModule';
import { OperationalSalesPurchaseModule } from '../operations/OperationalSalesPurchaseModule';
import { OperationalReportsExplorer } from '../operations/OperationalReportsExplorer';

interface QuarryManagementPlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
  initialTab?: QuarryNavId;
}

export type QuarryNavId =
  | 'dashboard'
  | 'quarries'
  | 'parcels'
  | 'owners'
  | 'partners'
  | 'agreements'
  | 'working-areas'
  | 'production'
  | 'loads'
  | 'gate-pass'
  | 'sales'
  | 'expenses'
  | 'settlements'
  | 'reports'
  | 'documents'
  | 'orders'
  | 'workforce'
  | 'ott-tasks';

export const QuarryManagementPlatform: React.FC<QuarryManagementPlatformProps> = ({
  onNavigateSection,
  initialTab
}) => {
  const [activePage, setActivePage] = useState<QuarryNavId>(initialTab || 'dashboard');

  React.useEffect(() => {
    if (initialTab) {
      setActivePage(initialTab);
    }
  }, [initialTab]);

  const [selectedQuarryForProfile, setSelectedQuarryForProfile] = useState<QuarryItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Platform Entities State (Pre-populated with rich studio data)
  const [quarries, setQuarries] = useState<QuarryItem[]>(SAMPLE_QUARRIES);
  const [parcels, setParcels] = useState<LandParcel[]>(SAMPLE_PARCELS);
  const [owners, setOwners] = useState<LandOwnerProfile[]>(SAMPLE_OWNERS);
  const [partners, setPartners] = useState<QuarryPartner[]>(SAMPLE_PARTNERS);
  const [agreements, setAgreements] = useState<QuarryAgreement[]>(SAMPLE_AGREEMENTS);
  const [workingAreas, setWorkingAreas] = useState<WorkingArea[]>(SAMPLE_WORKING_AREAS);
  const [productions, setProductions] = useState<ProductionEntry[]>(SAMPLE_PRODUCTIONS);
  const [loads, setLoads] = useState<QuarryLoad[]>(SAMPLE_LOADS);
  const [sales, setSales] = useState<QuarrySale[]>(SAMPLE_SALES);
  const [expenses, setExpenses] = useState<QuarryExpense[]>(SAMPLE_EXPENSES);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(SAMPLE_SETTLEMENTS);
  const [documents, setDocuments] = useState<QuarryDocument[]>(SAMPLE_DOCUMENTS);
  const [gatePasses, setGatePasses] = useState<GatePassRecord[]>(SAMPLE_GATE_PASSES);

  // Modal Visibility States
  const [newQuarryModalOpen, setNewQuarryModalOpen] = useState(false);
  const [addParcelModalOpen, setAddParcelModalOpen] = useState(false);
  const [addOwnerModalOpen, setAddOwnerModalOpen] = useState(false);
  const [newAgreementModalOpen, setNewAgreementModalOpen] = useState(false);
  const [productionEntryModalOpen, setProductionEntryModalOpen] = useState(false);
  const [newLoadModalOpen, setNewLoadModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [flowModalOpen, setFlowModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 15 Approved Primary Secondary Navigation items + Auxiliary modules
  const NAV_ITEMS: {
    id: QuarryNavId;
    number: number;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'dashboard', number: 1, label: 'Dashboard', icon: BarChart3 },
    { id: 'quarries', number: 2, label: 'Quarries', icon: Pickaxe, badge: `${quarries.length}` },
    { id: 'parcels', number: 3, label: 'Land Parcels', icon: MapPin, badge: `${parcels.length}` },
    { id: 'owners', number: 4, label: 'Land Owners', icon: Users, badge: `${owners.length}` },
    { id: 'partners', number: 5, label: 'Quarry Partners', icon: Users, badge: `${partners.length}` },
    { id: 'agreements', number: 6, label: 'Agreements', icon: FileText, badge: `${agreements.length}` },
    { id: 'working-areas', number: 7, label: 'Working Areas', icon: Layers, badge: `${workingAreas.length}` },
    { id: 'production', number: 8, label: 'Production', icon: Activity },
    { id: 'loads', number: 9, label: 'Loads', icon: Truck, badge: `${loads.length}` },
    { id: 'gate-pass', number: 10, label: 'Gate Pass', icon: ShieldCheck, badge: `${gatePasses.length}` },
    { id: 'sales', number: 11, label: 'Sales', icon: TrendingUp },
    { id: 'expenses', number: 12, label: 'Expenses', icon: DollarSign },
    { id: 'settlements', number: 13, label: 'Settlements', icon: DollarSign, badge: '2 Pending' },
    { id: 'reports', number: 14, label: 'Reports', icon: BarChart3 },
    { id: 'documents', number: 15, label: 'Documents', icon: FileText, badge: `${documents.length}` },
    { id: 'orders', number: 16, label: 'Orders (Aux)', icon: ShoppingBag },
    { id: 'workforce', number: 17, label: 'Workforce (Aux)', icon: Users },
    { id: 'ott-tasks', number: 18, label: 'OTT Tasks', icon: Clock }
  ];

  // Quick Action Handler from Dashboard / Profile
  const handleQuickAction = (action: string) => {
    if (action === 'new-quarry') setNewQuarryModalOpen(true);
    else if (action === 'add-parcel') setAddParcelModalOpen(true);
    else if (action === 'add-owner') setAddOwnerModalOpen(true);
    else if (action === 'new-agreement') setNewAgreementModalOpen(true);
    else if (action === 'production-entry') setProductionEntryModalOpen(true);
    else if (action === 'new-load') setNewLoadModalOpen(true);
    else if (action === 'expense') setExpenseModalOpen(true);
    else if (action === 'flow') setFlowModalOpen(true);
  };

  // On Save Handlers for Modals
  const handleSaveQuarry = (newQ: Partial<QuarryItem>) => {
    const item: QuarryItem = {
      id: `q-${Date.now()}`,
      code: `QP-KL-${String(quarries.length + 1).padStart(3, '0')}`,
      name: newQ.name || 'New Laterite Pit',
      businessName: newQ.businessName || 'RZ Minetrix Ventures LLP',
      type: newQ.type || 'Laterite Stone Quarry',
      location: newQ.location || 'Kasaragod',
      district: newQ.district || 'Kasaragod',
      state: newQ.state || 'Kerala',
      status: (newQ.status as any) || 'ACTIVE',
      material: (newQ.material as any) || 'Laterite',
      totalLandAreaAcres: newQ.totalLandAreaAcres || 10,
      workingAreasCount: 1,
      partnersCount: 2,
      todayProduction: '0',
      monthProduction: '0',
      pitStock: '0',
      salesMonth: '₹0',
      permitNumber: newQ.permitNumber || 'DMG/KL/2026/09',
      permitType: newQ.permitType || 'Quarrying Lease (Form M)',
      permitExpiryDate: newQ.permitExpiryDate || '2031-12-31',
      dailyCapacity: newQ.dailyCapacity || '2,000 Stones/Day',
      contactPerson: newQ.contactPerson || 'Site Engineer',
      contactPhone: newQ.contactPhone || '+91 94471 00000',
      gpsCoordinates: newQ.gpsCoordinates || '12.5100° N, 74.9850° E'
    };
    setQuarries([item, ...quarries]);
    showToast(`Quarry ${item.name} created successfully!`);
  };

  const handleSaveParcel = (newP: Partial<LandParcel>) => {
    const item: LandParcel = {
      id: `lp-${Date.now()}`,
      surveyNumber: newP.surveyNumber || 'Survey 500/1',
      subdivision: newP.subdivision || 'Subdivision 1',
      quarryId: newP.quarryId || quarries[0].id,
      ownerId: newP.ownerId || owners[0].id,
      ownerName: owners.find((o) => o.id === newP.ownerId)?.name || owners[0].name,
      extent: newP.extent || 3.5,
      unit: newP.unit || 'Acres',
      boundaries: newP.boundaries || { north: 'Survey 499', south: 'Access Road', east: 'Stream', west: 'Forest Bed' },
      location: newP.location || 'Kasaragod',
      status: (newP.status as any) || 'ACTIVE',
      documentsCount: 0
    };
    setParcels([item, ...parcels]);
    showToast(`Land Parcel Survey #${item.surveyNumber} demarcated!`);
  };

  const handleSaveOwner = (newO: Partial<LandOwnerProfile>) => {
    const item: LandOwnerProfile = {
      id: `lo-${Date.now()}`,
      name: newO.name || 'New Land Owner',
      phone: newO.phone || '+91 98450 00000',
      email: newO.email || 'landowner@example.com',
      address: newO.address || 'Kasaragod, Kerala',
      panNumber: newO.panNumber || 'ABCDE1234F',
      bankDetails: newO.bankDetails || 'Canara Bank - A/C 990100200',
      isAlsoPartner: !!newO.isAlsoPartner,
      totalParcels: 1,
      totalQuarryAreaAcres: 3.5,
      agreementCount: 1,
      loadCount: 0,
      advancePaid: 0,
      totalPaid: 0,
      outstandingBalance: 0
    };
    setOwners([item, ...owners]);
    showToast(`Land Owner profile for ${item.name} registered!`);
  };

  const handleSaveAgreement = (newA: Partial<QuarryAgreement>) => {
    const item: QuarryAgreement = {
      id: `agr-${Date.now()}`,
      agreementNumber: `RZ-AGR-KSD-${String(agreements.length + 1).padStart(3, '0')}`,
      type: newA.type || 'Per Load',
      quarryId: newA.quarryId || quarries[0].id,
      quarryName: quarries.find((q) => q.id === newA.quarryId)?.name || quarries[0].name,
      ownerId: newA.ownerId || owners[0].id,
      ownerName: owners.find((o) => o.id === newA.ownerId)?.name || owners[0].name,
      parcelIds: newA.parcelIds || ['LP-101'],
      parcelSurveys: newA.parcelSurveys || 'Survey 412/1A',
      extentAcres: newA.extentAcres || 4.2,
      material: (newA.material as any) || 'Laterite',
      status: 'ACTIVE',
      startDate: newA.startDate || '2026-09-01',
      expiryDate: newA.expiryDate || '2031-08-31',
      advanceAmount: newA.advanceAmount || 0,
      paidAmount: 0,
      balanceAmount: newA.advanceAmount || 0,
      ratePerLoad: newA.ratePerLoad,
      loadUnit: newA.loadUnit,
      agreedMiningAmount: newA.agreedMiningAmount,
      miningPeriodMonths: newA.miningPeriodMonths,
      totalAmount: newA.totalAmount,
      customRules: newA.customRules,
      paymentCycle: newA.paymentCycle || 'Monthly',
      documents: []
    };
    setAgreements([item, ...agreements]);
    showToast(`Agreement #${item.agreementNumber} (${item.type}) registered!`);
  };

  const handleSaveProduction = (newPr: Partial<ProductionEntry>) => {
    const item: ProductionEntry = {
      id: `pr-${Date.now()}`,
      date: newPr.date || '2026-09-22',
      quarryId: newPr.quarryId || quarries[0].id,
      quarryName: quarries.find((q) => q.id === newPr.quarryId)?.name || quarries[0].name,
      workingAreaId: newPr.workingAreaId || workingAreas[0].id,
      workingAreaName: workingAreas.find((w) => w.id === newPr.workingAreaId)?.name || workingAreas[0].name,
      shift: (newPr.shift as any) || 'Shift A (06:00 - 14:00)',
      material: (newPr.material as any) || 'Laterite',
      quantity: newPr.quantity || 1500,
      unit: newPr.unit || 'Stones',
      machineryUsed: newPr.machineryUsed || 'Diamond Wire Saw WS-01',
      operator: newPr.operator || 'Operator',
      stockAdded: newPr.quantity || 1500,
      notes: newPr.notes || 'Recorded via Production Entry'
    };
    setProductions([item, ...productions]);
    showToast(`Production shift logged: ${item.quantity} ${item.unit} added to stock!`);
  };

  const handleSaveLoad = (newL: Partial<QuarryLoad>) => {
    const item: QuarryLoad = {
      id: `ld-${Date.now()}`,
      loadNumber: `LOAD-2026-09-${String(loads.length + 1).padStart(3, '0')}`,
      date: newL.date || '2026-09-22',
      time: newL.time || '10:30 AM',
      quarryId: newL.quarryId || quarries[0].id,
      quarryName: quarries.find((q) => q.id === newL.quarryId)?.name || quarries[0].name,
      workingAreaId: newL.workingAreaId || workingAreas[0].id,
      workingAreaName: workingAreas.find((w) => w.id === newL.workingAreaId)?.name || workingAreas[0].name,
      ownerId: owners[0].id,
      ownerName: owners[0].name,
      parcelSurvey: 'Survey 412/1A',
      royaltyRatePerLoad: 600,
      material: (newL.material as any) || 'Laterite',
      quantity: newL.quantity || 120,
      unit: newL.unit || 'Stones',
      vehicleNumber: newL.vehicleNumber || 'KL-14-AC-9900',
      driverName: newL.driverName || 'Driver Name',
      driverPhone: newL.driverPhone || '+91 94471 11223',
      customerName: newL.customerName || 'Direct Builder',
      ratePerUnit: newL.ratePerUnit || (newL as any).rate || 54,
      totalAmount: (newL.quantity || 120) * (newL.ratePerUnit || (newL as any).rate || 54),
      status: 'Gate Pass Issued'
    };
    setLoads([item, ...loads]);

    // Also auto-generate a gate pass for this load
    const newGp: GatePassRecord = {
      id: `gp-${Date.now()}`,
      gatePassNumber: `GP-KSD-${String(gatePasses.length + 8810)}`,
      loadNumber: item.loadNumber,
      quarryName: item.quarryName,
      vehicleNumber: item.vehicleNumber,
      driverName: item.driverName,
      material: item.material,
      quantity: item.quantity,
      unit: item.unit,
      timeOut: item.time,
      destination: 'Sobha Site, Kasaragod',
      securityOfficer: 'Suresh Kumar (Weighbridge)',
      status: 'CLEARED'
    };
    setGatePasses([newGp, ...gatePasses]);

    showToast(`Dispatched Load #${item.loadNumber} & Issued Gate Pass #${newGp.gatePassNumber}!`);
  };

  const handleSaveExpense = (newEx: Partial<QuarryExpense>) => {
    const item: QuarryExpense = {
      id: `ex-${Date.now()}`,
      voucherNumber: `VOUCH-2026-09-${String(expenses.length + 105)}`,
      date: newEx.date || '2026-09-22',
      quarryId: newEx.quarryId || quarries[0].id,
      quarryName: quarries.find((q) => q.id === newEx.quarryId)?.name || quarries[0].name,
      workingAreaName: 'Bench A - North Face',
      category: newEx.category || 'Fuel / Diesel',
      amount: newEx.amount || 5000,
      paidTo: newEx.paidTo || 'Supplier',
      paymentMode: newEx.paymentMode || 'Bank Transfer',
      referenceNumber: newEx.referenceNumber || 'TXN-00992',
      description: newEx.description || 'Quarry operational expense',
      status: 'PAID'
    };
    setExpenses([item, ...expenses]);
    showToast(`Expense voucher #${item.voucherNumber} (₹${item.amount}) recorded!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-400 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* RZ MINETRIX PLATFORM 1 TOP BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Pickaxe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                PLATFORM 1 &bull; QUARRY MANAGEMENT
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                15 Core Modules
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h1 className="text-xl font-black text-white">RZ® Minetrix Quarry Concessions</h1>
          </div>
        </div>

        {/* Global Action Launchpad */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFlowModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Interactive Flow</span>
          </button>

          <button
            onClick={() => setNewQuarryModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Quarry</span>
          </button>
        </div>
      </div>

      {/* SECONDARY NAVIGATION (Section 1: 15 Core Nav Items) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {NAV_ITEMS.map((item) => {
            const isAct = activePage === item.id && !selectedQuarryForProfile;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedQuarryForProfile(null);
                  setActivePage(item.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isAct
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] font-mono opacity-80">{item.number}.</span>
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                      isAct
                        ? 'bg-slate-950/30 text-slate-950'
                        : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER CONDITIONAL VIEWS */}

      {/* 1. QUARRY PROFILE DOSSIER (When a quarry is clicked) */}
      {selectedQuarryForProfile ? (
        <QuarryProfileView
          quarry={selectedQuarryForProfile}
          parcels={parcels}
          owners={owners}
          partners={partners}
          agreements={agreements}
          workingAreas={workingAreas}
          productions={productions}
          loads={loads}
          sales={sales}
          expenses={expenses}
          settlements={settlements}
          documents={documents}
          onBackToList={() => setSelectedQuarryForProfile(null)}
          onOpenQuickAction={handleQuickAction}
        />
      ) : (
        <>
          {/* 2. DASHBOARD VIEW (Section 2) */}
          {activePage === 'dashboard' && (
            <QuarryDashboardView
              quarries={quarries}
              loads={loads}
              productions={productions}
              settlements={settlements}
              onNavigate={(page) => setActivePage(page as QuarryNavId)}
              onOpenQuickAction={handleQuickAction}
            />
          )}

          {/* 3. QUARRIES LIST VIEW (Section 3) */}
          {activePage === 'quarries' && (
            <QuarryListView
              quarries={quarries}
              onSelectQuarry={(q) => setSelectedQuarryForProfile(q)}
              onOpenNewQuarryModal={() => setNewQuarryModalOpen(true)}
            />
          )}

          {/* 6. LAND PARCELS (Section 6) */}
          {activePage === 'parcels' && (
            <QuarryParcelsView
              parcels={parcels}
              quarries={quarries}
              onOpenAddParcelModal={() => setAddParcelModalOpen(true)}
              onNavigateToOwners={() => setActivePage('owners')}
              onNavigateToAgreements={() => setActivePage('agreements')}
            />
          )}

          {/* 7 & 16. LAND OWNERS & LAND OWNER ACCOUNT (Section 7 & 16) */}
          {activePage === 'owners' && (
            <QuarryOwnersView
              owners={owners}
              parcels={parcels}
              agreements={agreements}
              loads={loads}
              settlements={settlements}
              onOpenAddOwnerModal={() => setAddOwnerModalOpen(true)}
              onOpenSettlementModal={(owner) => {
                showToast(`Opening Settlement for ${owner.name}`);
                setActivePage('settlements');
              }}
            />
          )}

          {/* 8. QUARRY PARTNERS (Section 8) */}
          {activePage === 'partners' && <QuarryPartnersView partners={partners} />}

          {/* 9. AGREEMENTS (Section 9) */}
          {activePage === 'agreements' && (
            <QuarryAgreementsView
              agreements={agreements}
              onOpenNewAgreementModal={() => setNewAgreementModalOpen(true)}
            />
          )}

          {/* 10. WORKING AREAS (Section 10) */}
          {activePage === 'working-areas' && (
            <QuarryWorkingAreasView workingAreas={workingAreas} quarries={quarries} />
          )}

          {/* 11. PRODUCTION (Section 11) */}
          {activePage === 'production' && (
            <QuarryProductionView
              productions={productions}
              quarries={quarries}
              onOpenProductionEntryModal={() => setProductionEntryModalOpen(true)}
            />
          )}

          {/* 12. LOADS (Section 12) */}
          {activePage === 'loads' && (
            <QuarryLoadsView
              loads={loads}
              onOpenNewLoadModal={() => setNewLoadModalOpen(true)}
              onNavigateToGatePass={(loadId) => setActivePage('gate-pass')}
              onNavigateToSales={() => setActivePage('sales')}
            />
          )}

          {/* 13. GATE PASS (Section 13) */}
          {activePage === 'gate-pass' && (
            <QuarryGatePassView gatePasses={gatePasses} loads={loads} />
          )}

          {/* 14. SALES (Section 14) */}
          {activePage === 'sales' && <QuarrySalesView sales={sales} />}

          {/* 15. EXPENSES (Section 15) */}
          {activePage === 'expenses' && (
            <QuarryExpensesView
              expenses={expenses}
              quarries={quarries}
              onOpenExpenseModal={() => setExpenseModalOpen(true)}
            />
          )}

          {/* 17. SETTLEMENTS (Section 17) */}
          {activePage === 'settlements' && (
            <QuarrySettlementsView settlements={settlements} quarries={quarries} />
          )}

          {/* 18. REPORTS (Section 18) */}
          {activePage === 'reports' && <QuarryReportsView quarries={quarries} />}

          {/* 19. DOCUMENTS (Section 19) */}
          {activePage === 'documents' && (
            <QuarryDocumentsView documents={documents} quarries={quarries} />
          )}

          {/* AUXILIARY PRESERVED MODULES */}
          {activePage === 'orders' && (
            <QuarryOrderManagementView onCreateOttTask={(t) => showToast(t)} />
          )}
          {activePage === 'workforce' && (
            <OperationalAttendanceModule
              platform="QUARRY"
              siteTitle="Kasaragod Pit Workforce & Attendance"
              onCreateOttTask={(t) => showToast(t)}
            />
          )}
          {activePage === 'ott-tasks' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                      OPERATIONAL TASK TRACKING
                    </span>
                    <h3 className="text-lg font-bold text-white">Quarry OTT Tasks & Follow-ups</h3>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Dispatched new quarry task to site crew')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  + Create OTT Task
                </button>
              </div>
              <div className="space-y-2">
                {[
                  {
                    id: 'QT-01',
                    title: 'Inspect diamond wire saw beads on Bench A before afternoon shift',
                    priority: 'HIGH',
                    due: 'Today 3:30 PM',
                    assignedTo: 'Machinery Mechanic Team',
                    status: 'IN_PROGRESS'
                  },
                  {
                    id: 'QT-02',
                    title: 'Disburse per-load royalty RTGS transfer to Shri V. Prabhakar Pai',
                    priority: 'MEDIUM',
                    due: 'Tomorrow',
                    assignedTo: 'Accounts Clerk',
                    status: 'PENDING'
                  },
                  {
                    id: 'QT-03',
                    title: 'File environmental clearance renewal telemetry with DMG Kerala',
                    priority: 'CRITICAL',
                    due: '25 Sep 2026',
                    assignedTo: 'Compliance Officer',
                    status: 'IN_REVIEW'
                  }
                ].map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-400">{task.id}</span>
                        <span className="text-xs font-bold text-white">{task.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Assigned: {task.assignedTo} &bull; Due: {task.due}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          task.priority === 'CRITICAL'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <button
                        onClick={() => showToast(`Marked ${task.id} resolved`)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ALL MODAL DIALOGS WIRED */}
      <NewQuarryModal
        isOpen={newQuarryModalOpen}
        onClose={() => setNewQuarryModalOpen(false)}
        onSave={handleSaveQuarry}
      />

      <AddParcelModal
        isOpen={addParcelModalOpen}
        quarries={quarries}
        owners={owners}
        onClose={() => setAddParcelModalOpen(false)}
        onSave={handleSaveParcel}
      />

      <AddLandOwnerModal
        isOpen={addOwnerModalOpen}
        onClose={() => setAddOwnerModalOpen(false)}
        onSave={handleSaveOwner}
      />

      <NewAgreementModal
        isOpen={newAgreementModalOpen}
        quarries={quarries}
        owners={owners}
        parcels={parcels}
        onClose={() => setNewAgreementModalOpen(false)}
        onSave={handleSaveAgreement}
      />

      <ProductionEntryModal
        isOpen={productionEntryModalOpen}
        quarries={quarries}
        workingAreas={workingAreas}
        onClose={() => setProductionEntryModalOpen(false)}
        onSave={handleSaveProduction}
      />

      <NewLoadModal
        isOpen={newLoadModalOpen}
        quarries={quarries}
        workingAreas={workingAreas}
        onClose={() => setNewLoadModalOpen(false)}
        onSave={handleSaveLoad}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        quarries={quarries}
        onClose={() => setExpenseModalOpen(false)}
        onSave={handleSaveExpense}
      />

      <QuarryEndToEndFlowModal
        isOpen={flowModalOpen}
        onClose={() => setFlowModalOpen(false)}
        onNavigateToPage={(targetPage) => {
          setSelectedQuarryForProfile(null);
          setActivePage(targetPage as QuarryNavId);
        }}
      />
    </div>
  );
};
