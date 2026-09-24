import React, { useState } from 'react';
import {
  Landmark,
  MapPin,
  FileText,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  DollarSign,
  TrendingUp,
  Layers,
  Compass,
  Users,
  Building2,
  Calendar,
  Sparkles,
  Phone,
  ArrowUpRight,
  Handshake,
  Share2,
  BarChart3,
  Clock,
  Eye,
  Download,
  Printer,
  Zap,
  ChevronRight,
  ExternalLink,
  Calculator,
  Truck,
  CreditCard
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import { QuickActionModal } from '../QuickActionModal';
import {
  DEMO_LAND_OWNERS,
  DEMO_LAND_PARCELS,
  DEMO_LAND_AGREEMENTS,
  AgreementType
} from '../../data/quarryLandData';
import { LandUnitConverter } from '../land/LandUnitConverter';
import { LandOwnerProfileModal } from '../land/LandOwnerProfileModal';
import {
  NewLandOwnerModal,
  NewLandParcelModal,
  NewAgreementModal,
  NewAdvancePaymentModal,
  CadastralMapModal
} from '../land/LandNewModals';

// Import dedicated view components
import { LandDashboardView } from '../land/views/LandDashboardView';
import { LandOwnersView } from '../land/views/LandOwnersView';
import { LandParcelsView } from '../land/views/LandParcelsView';
import { LandSurveysView } from '../land/views/LandSurveysView';
import { LandAgreementsView } from '../land/views/LandAgreementsView';
import { LandWorkingAreasView } from '../land/views/LandWorkingAreasView';
import { LandConnectionsView } from '../land/views/LandConnectionsView';
import { LandListingsView } from '../land/views/LandListingsView';
import { LandEnquiriesView } from '../land/views/LandEnquiriesView';
import { LandFinanceView } from '../land/views/LandFinanceView';
import { LandDocumentsView } from '../land/views/LandDocumentsView';
import { LandReportsView } from '../land/views/LandReportsView';

interface QuarryLandManagementPlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
}

export type LandSubpageId =
  | 'dashboard'
  | 'owners'
  | 'parcels'
  | 'surveys'
  | 'agreements'
  | 'purchase-agreements'
  | 'mining-return-agreements'
  | 'per-load-agreements'
  | 'hybrid-agreements'
  | 'working-areas'
  | 'connections'
  | 'listings'
  | 'buyer-enquiries'
  | 'investor-matching'
  | 'accounts'
  | 'advances'
  | 'payments'
  | 'settlements'
  | 'statements'
  | 'documents'
  | 'reports'
  | 'automation';

export const QuarryLandManagementPlatform: React.FC<QuarryLandManagementPlatformProps> = ({
  onNavigateSection
}) => {
  const [activePage, setActivePage] = useState<LandSubpageId>('dashboard');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal States
  const [unitConverterOpen, setUnitConverterOpen] = useState(false);
  const [selectedOwnerIdForProfile, setSelectedOwnerIdForProfile] = useState<string | null>(null);
  const [newOwnerOpen, setNewOwnerOpen] = useState(false);
  const [newParcelOpen, setNewParcelOpen] = useState(false);
  const [newAgreementOpen, setNewAgreementOpen] = useState(false);
  const [newAgreementDefaultType, setNewAgreementDefaultType] = useState<AgreementType>('Mining & Return');
  const [newAgreementPreselectedOwner, setNewAgreementPreselectedOwner] = useState<string | undefined>();
  const [advancePaymentOpen, setAdvancePaymentOpen] = useState(false);
  const [advancePaymentMode, setAdvancePaymentMode] = useState<'Advance' | 'Payment'>('Advance');
  const [advancePaymentPreselectedOwner, setAdvancePaymentPreselectedOwner] = useState<string | undefined>();
  const [cadastralMapOpen, setCadastralMapOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 22 Specified Subpages Navigation List
  const SUBPAGES: {
    id: LandSubpageId;
    number: number;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    category?: string;
  }[] = [
    { id: 'dashboard', number: 1, label: 'Land Dashboard', icon: BarChart3 },
    { id: 'owners', number: 2, label: 'Land Owner Directory', icon: Users },
    { id: 'parcels', number: 3, label: 'Quarry Land Database', icon: Landmark },
    { id: 'surveys', number: 4, label: 'Survey & Boundaries', icon: Compass },
    { id: 'agreements', number: 5, label: 'Agreement Engine', icon: FileText },
    { id: 'purchase-agreements', number: 6, label: '1. Land Purchase', icon: DollarSign },
    { id: 'mining-return-agreements', number: 7, label: '2. Mining & Return', icon: Layers },
    { id: 'per-load-agreements', number: 8, label: '3. Per-Load Concessions', icon: Truck },
    { id: 'hybrid-agreements', number: 9, label: '4. Hybrid Commercial', icon: Sparkles },
    { id: 'working-areas', number: 10, label: 'Working Areas / Benches', icon: Layers },
    { id: 'connections', number: 11, label: 'Traceability & Quarries', icon: Building2 },
    { id: 'listings', number: 12, label: 'Land Marketplace', icon: Landmark },
    { id: 'buyer-enquiries', number: 13, label: 'Buyer & Investor Enquiries', icon: Phone },
    { id: 'investor-matching', number: 14, label: 'Commercial Negotiation', icon: Handshake },
    { id: 'accounts', number: 15, label: 'Owner Accounts Ledger', icon: Coins },
    { id: 'advances', number: 16, label: 'Owner Advances', icon: DollarSign },
    { id: 'payments', number: 17, label: 'Disbursed Payments', icon: CreditCard },
    { id: 'settlements', number: 18, label: 'Settlement Runs', icon: TrendingUp },
    { id: 'statements', number: 19, label: 'Ledger Statements', icon: FileText },
    { id: 'documents', number: 20, label: 'Documents & Deeds', icon: FileText },
    { id: 'reports', number: 21, label: 'Reports & Audits', icon: BarChart3 },
    { id: 'automation', number: 22, label: 'Automation & OTT Tasks', icon: Zap }
  ];

  // Helper callbacks
  const handleOpenOwnerProfile = (ownerId: string) => {
    setSelectedOwnerIdForProfile(ownerId);
  };

  const handleOpenNewAgreement = (ownerId?: string, defaultType?: AgreementType) => {
    setNewAgreementPreselectedOwner(ownerId);
    if (defaultType) setNewAgreementDefaultType(defaultType);
    setNewAgreementOpen(true);
  };

  const handleOpenAdvance = (ownerId?: string) => {
    setAdvancePaymentMode('Advance');
    setAdvancePaymentPreselectedOwner(ownerId);
    setAdvancePaymentOpen(true);
  };

  const handleOpenPayment = (ownerId?: string) => {
    setAdvancePaymentMode('Payment');
    setAdvancePaymentPreselectedOwner(ownerId);
    setAdvancePaymentOpen(true);
  };

  const handleOpenSettlement = (ownerId?: string) => {
    setActivePage('settlements');
    showToast('Opening Settlement Reconciliation Engine');
  };

  const handleScheduleVisit = (listingTitle?: string) => {
    showToast(`Site visit scheduled for "${listingTitle || 'Selected Land'}" & dispatched to RZ OTT`);
  };

  const handleOpenChat = (name: string, ref: string) => {
    showToast(`Connecting direct secure channel with ${name} (${ref})`);
  };

  const handleOpenOtt = (ref: string) => {
    showToast(`Opening RZ OTT Operational Task Dispatch for ${ref}`);
  };

  const selectedOwner = DEMO_LAND_OWNERS.find((o) => o.id === selectedOwnerIdForProfile) || null;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-purple-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* PLATFORM HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xl">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                RZ® MINETRIX BOS &bull; PLATFORM 7
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                1,114.5 Cents (11.14 Acres)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                4 Agreement Models
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h1 className="text-xl font-black text-white">Quarry Land Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Land Owner Directory &bull; Agreement Engine &bull; Bench Traceability &bull; Financial Payouts &bull; Marketplace
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setUnitConverterOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-purple-400" />
            <span>Unit Converter</span>
          </button>

          <button
            onClick={() => setNewAgreementOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>+ Agreement</span>
          </button>

          <button
            onClick={() => setNewOwnerOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Register Owner</span>
          </button>
        </div>
      </div>

      {/* 22-PAGE SUBNAVIGATOR (Scrollable tabs with clear active styling) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {SUBPAGES.map((page) => {
            const isAct = activePage === page.id;
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isAct
                    ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold shadow-md'
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

      {/* PAGE ROUTER RENDERING */}
      {activePage === 'dashboard' && (
        <LandDashboardView
          onNavigateSubpage={(p) => setActivePage(p as LandSubpageId)}
          onOpenNewOwner={() => setNewOwnerOpen(true)}
          onOpenNewParcel={() => setNewParcelOpen(true)}
          onOpenNewAgreement={() => handleOpenNewAgreement()}
          onOpenAdvance={() => handleOpenAdvance()}
          onOpenPayment={() => handleOpenPayment()}
          onOpenSettlement={() => handleOpenSettlement()}
          onOpenUnitConverter={() => setUnitConverterOpen(true)}
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onNavigateSection={onNavigateSection}
        />
      )}

      {activePage === 'owners' && (
        <LandOwnersView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenNewOwner={() => setNewOwnerOpen(true)}
          onOpenNewParcel={(ownerId) => {
            setNewAgreementPreselectedOwner(ownerId);
            setNewParcelOpen(true);
          }}
          onOpenChat={handleOpenChat}
          onOpenOtt={handleOpenOtt}
          onNavigateSubpage={(p) => setActivePage(p as LandSubpageId)}
        />
      )}

      {activePage === 'parcels' && (
        <LandParcelsView
          onOpenNewParcel={() => setNewParcelOpen(true)}
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenNewAgreement={handleOpenNewAgreement}
          onNavigateSubpage={(p) => setActivePage(p as LandSubpageId)}
        />
      )}

      {activePage === 'surveys' && (
        <LandSurveysView />
      )}

      {activePage === 'agreements' && (
        <LandAgreementsView
          onOpenNewAgreement={handleOpenNewAgreement}
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTypeFilter="ALL"
        />
      )}

      {activePage === 'purchase-agreements' && (
        <LandAgreementsView
          onOpenNewAgreement={handleOpenNewAgreement}
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTypeFilter="Purchase"
        />
      )}

      {activePage === 'mining-return-agreements' && (
        <LandAgreementsView
          onOpenNewAgreement={handleOpenNewAgreement}
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTypeFilter="Mining & Return"
        />
      )}

      {activePage === 'per-load-agreements' && (
        <LandAgreementsView
          onOpenNewAgreement={handleOpenNewAgreement}
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTypeFilter="Per-Load"
        />
      )}

      {activePage === 'hybrid-agreements' && (
        <LandAgreementsView
          onOpenNewAgreement={handleOpenNewAgreement}
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTypeFilter="Hybrid"
        />
      )}

      {activePage === 'working-areas' && (
        <LandWorkingAreasView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onNavigateSection={onNavigateSection}
          onOpenNewAgreement={handleOpenNewAgreement}
        />
      )}

      {activePage === 'connections' && (
        <LandConnectionsView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onNavigateSection={onNavigateSection}
        />
      )}

      {activePage === 'listings' && (
        <LandListingsView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenNewAgreement={handleOpenNewAgreement}
          onScheduleVisit={handleScheduleVisit}
          onOpenEnquiryModal={(listingId) => {
            setActivePage('buyer-enquiries');
            showToast(`Created interest enquiry for listing ${listingId}`);
          }}
        />
      )}

      {activePage === 'buyer-enquiries' && (
        <LandEnquiriesView
          onScheduleVisit={handleScheduleVisit}
          onOpenOtt={handleOpenOtt}
          onOpenChat={handleOpenChat}
        />
      )}

      {activePage === 'investor-matching' && (
        <LandEnquiriesView
          onScheduleVisit={handleScheduleVisit}
          onOpenOtt={handleOpenOtt}
          onOpenChat={handleOpenChat}
        />
      )}

      {activePage === 'accounts' && (
        <LandFinanceView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTab="accounts"
        />
      )}

      {activePage === 'advances' && (
        <LandFinanceView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTab="advances"
        />
      )}

      {activePage === 'payments' && (
        <LandFinanceView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTab="payments"
        />
      )}

      {activePage === 'settlements' && (
        <LandFinanceView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTab="settlements"
        />
      )}

      {activePage === 'statements' && (
        <LandFinanceView
          onOpenOwnerProfile={handleOpenOwnerProfile}
          onOpenAdvance={handleOpenAdvance}
          onOpenPayment={handleOpenPayment}
          onOpenSettlement={handleOpenSettlement}
          initialTab="statements"
        />
      )}

      {activePage === 'documents' && (
        <LandDocumentsView />
      )}

      {activePage === 'reports' && (
        <LandReportsView />
      )}

      {activePage === 'automation' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
                Platform 7 &bull; Automated Operations
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                RZ® OTT Integration Active
              </span>
            </div>
            <h2 className="text-xl font-black text-white">Automation & Field Operations Dispatch</h2>
            <p className="text-xs text-slate-400">
              Dispatches automated tasks to surveyors, site supervisors, and legal liaisons via RZ OTT task queues.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>Automatic Weighment Load Royalty Deduction</span>
                  <span className="text-emerald-400 text-[10px]">LIVE TRIGGER</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  When Platform 1 logs a truck pass across the quarry weighbridge, automatically check working bench agreement and credit the owner ledger in Platform 7.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>Concession Restoration Milestone Alerts</span>
                  <span className="text-purple-400 text-[10px]">60-DAY CRON</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Triggers 60-day early notification before a Mining & Return agreement tenure ends to initiate topsoil grading and benchmark survey hand-back.
                </p>
              </div>
            </div>
          </div>

          <LandConnectionsView
            onOpenOwnerProfile={handleOpenOwnerProfile}
            onNavigateSection={onNavigateSection}
          />
        </div>
      )}

      {/* INTERACTIVE MODALS */}
      {/* 1. Cadastral Unit Converter Modal */}
      <LandUnitConverter
        isOpen={unitConverterOpen}
        onClose={() => setUnitConverterOpen(false)}
      />

      {/* 2. Comprehensive 15-Tab Land Owner Profile Dossier */}
      <LandOwnerProfileModal
        owner={selectedOwner}
        isOpen={!!selectedOwner}
        onClose={() => setSelectedOwnerIdForProfile(null)}
        onNavigateSection={onNavigateSection}
        onOpenNewParcel={(ownerId) => {
          setSelectedOwnerIdForProfile(null);
          setNewAgreementPreselectedOwner(ownerId);
          setNewParcelOpen(true);
        }}
        onOpenNewAgreement={(ownerId) => {
          setSelectedOwnerIdForProfile(null);
          handleOpenNewAgreement(ownerId);
        }}
        onOpenNewAdvance={(ownerId) => {
          setSelectedOwnerIdForProfile(null);
          handleOpenAdvance(ownerId);
        }}
        onOpenNewPayment={(ownerId) => {
          setSelectedOwnerIdForProfile(null);
          handleOpenPayment(ownerId);
        }}
        onOpenNewSettlement={(ownerId) => {
          setSelectedOwnerIdForProfile(null);
          handleOpenSettlement(ownerId);
        }}
        onOpenChat={handleOpenChat}
        onOpenOtt={handleOpenOtt}
      />

      {/* 3. New Land Owner Modal */}
      <NewLandOwnerModal
        isOpen={newOwnerOpen}
        onClose={() => setNewOwnerOpen(false)}
        onSuccess={(ownerName) => {
          showToast(`Successfully registered new Land Owner: "${ownerName}"`);
        }}
      />

      {/* 4. New Land Parcel Modal */}
      <NewLandParcelModal
        isOpen={newParcelOpen}
        onClose={() => setNewParcelOpen(false)}
        preselectedOwnerId={newAgreementPreselectedOwner}
        onSuccess={(surveyNo) => {
          showToast(`Successfully added Land Parcel Survey ${surveyNo}`);
        }}
      />

      {/* 5. New Agreement Builder Modal (4 Types) */}
      <NewAgreementModal
        isOpen={newAgreementOpen}
        onClose={() => setNewAgreementOpen(false)}
        defaultType={newAgreementDefaultType}
        preselectedOwnerId={newAgreementPreselectedOwner}
        onSuccess={(agrCode) => {
          showToast(`Executed new agreement: ${agrCode}`);
        }}
      />

      {/* 6. New Advance / Payment Modal */}
      <NewAdvancePaymentModal
        isOpen={advancePaymentOpen}
        onClose={() => setAdvancePaymentOpen(false)}
        mode={advancePaymentMode}
        preselectedOwnerId={advancePaymentPreselectedOwner}
        onSuccess={(ref) => {
          showToast(`Processed ${advancePaymentMode}: Ref #${ref}`);
        }}
      />
    </div>
  );
};
