import React, { useState } from 'react';
import {
  Truck,
  Building2,
  Wrench,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Plus,
  BarChart3,
  Eye,
  Download,
  Printer,
  Sparkles,
  Zap,
  Phone,
  MessageSquare,
  Share2,
  Bookmark,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';
import { SectionId } from '../../types/architecture';

// Data & types
import {
  MARKETPLACE_LISTINGS,
  MachineryListing,
  ListingCategory,
  EquipmentType,
  MarketplaceOffer,
  MarketplaceEnquiry
} from '../../data/usedMachineryMarketplaceData';

// Subcomponents
import { MachineryDashboardView } from '../machinery/MachineryDashboardView';
import { MachineryBrowseView } from '../machinery/MachineryBrowseView';
import { ListingDetailModal } from '../machinery/ListingDetailModal';
import { ListMachineWizard } from '../machinery/ListMachineWizard';
import { MyListingsView } from '../machinery/MyListingsView';
import { EnquiriesView } from '../machinery/EnquiriesView';
import { OffersNegotiationView } from '../machinery/OffersNegotiationView';
import { InspectionManagementView } from '../machinery/InspectionManagementView';
import { DealsManagementView } from '../machinery/DealsManagementView';
import { MarketplacePaymentsView } from '../machinery/MarketplacePaymentsView';
import { TransferDeliveryView } from '../machinery/TransferDeliveryView';
import { DealDocumentsView } from '../machinery/DealDocumentsView';
import { BuyerSellerProfilesView } from '../machinery/BuyerSellerProfilesView';
import { WatchlistCompareView } from '../machinery/WatchlistCompareView';
import { MachineryReportsView } from '../machinery/MachineryReportsView';
import { MarketplaceChatDrawer } from '../machinery/MarketplaceChatDrawer';
import { MarketplaceOttModal } from '../machinery/MarketplaceOttModal';
import { MakeOfferModal } from '../machinery/MakeOfferModal';
import { EnquiryModal } from '../machinery/EnquiryModal';

interface UsedMachineryMarketplacePlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
}

export type MachinerySubpageId =
  | 'dashboard'
  | 'machines'
  | 'crusher-machines'
  | 'excavators'
  | 'loaders'
  | 'breakers'
  | 'drilling-equipment'
  | 'heavy-equipment'
  | 'commercial-vehicles'
  | 'quarry-equipment'
  | 'buy'
  | 'sell'
  | 'exchange'
  | 'rental'
  | 'inspection'
  | 'valuation'
  | 'listings'
  | 'buyers'
  | 'sellers'
  | 'enquiries'
  | 'leads'
  | 'deals'
  | 'documents'
  | 'reports'
  | 'analytics'
  | 'automation'
  | 'payments'
  | 'transfer-delivery';

export const UsedMachineryMarketplacePlatform: React.FC<UsedMachineryMarketplacePlatformProps> = ({
  onNavigateSection
}) => {
  // Navigation
  const [activePage, setActivePage] = useState<MachinerySubpageId>('dashboard');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Core State
  const [listings, setListings] = useState<MachineryListing[]>(MARKETPLACE_LISTINGS);
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['LST-MAC-001', 'LST-VEH-002']);

  // Modals & Drawers
  const [selectedListingDetail, setSelectedListingDetail] = useState<MachineryListing | null>(null);
  const [makeOfferListing, setMakeOfferListing] = useState<MachineryListing | null>(null);
  const [enquireListing, setEnquireListing] = useState<MachineryListing | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // RZ Chat Drawer
  const [chatDrawer, setChatDrawer] = useState<{ isOpen: boolean; recipientName: string; contextCode: string }>({
    isOpen: false,
    recipientName: '',
    contextCode: ''
  });

  // RZ OTT Task Modal
  const [ottModal, setOttModal] = useState<{ isOpen: boolean; contextRef: string }>({
    isOpen: false,
    contextRef: ''
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleWatchlist = (listingId: string) => {
    setWatchlistIds((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
    showToast(
      watchlistIds.includes(listingId)
        ? 'Removed from Watchlist'
        : 'Added to Watchlist & Comparison'
    );
  };

  const handlePublishNewListing = (newListing: MachineryListing) => {
    setListings([newListing, ...listings]);
    showToast(`Listing ${newListing.listingCode} published to marketplace`);
    setActivePage('listings');
  };

  const handleSubmitOffer = (newOffer: MarketplaceOffer) => {
    showToast(`Offer ${newOffer.offerCode} submitted for ₹${(newOffer.offeredAmountRs / 100000).toFixed(2)}L`);
    setActivePage('exchange');
  };

  const handleSubmitEnquiry = (newEnquiry: MarketplaceEnquiry) => {
    showToast(`Inquiry ${newEnquiry.enquiryCode} sent to seller`);
    setActivePage('enquiries');
  };

  // 26 Pages in exact specified order
  const SUBPAGES: { id: MachinerySubpageId; number: number; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', number: 1, label: 'Marketplace Dashboard', icon: BarChart3 },
    { id: 'machines', number: 2, label: 'Machines Directory', icon: Truck },
    { id: 'crusher-machines', number: 3, label: 'Crusher Plants & Screens', icon: Building2 },
    { id: 'excavators', number: 4, label: 'Excavators (20T-35T)', icon: Truck },
    { id: 'loaders', number: 5, label: 'Wheel Loaders', icon: Truck },
    { id: 'breakers', number: 6, label: 'Hydraulic Breakers', icon: Wrench },
    { id: 'drilling-equipment', number: 7, label: 'Drilling Equipment & Compressors', icon: Wrench },
    { id: 'heavy-equipment', number: 8, label: 'Heavy Equipment', icon: Truck },
    { id: 'commercial-vehicles', number: 9, label: 'Commercial Tippers', icon: Truck },
    { id: 'quarry-equipment', number: 10, label: 'Quarry Stone Cutters', icon: Wrench },
    { id: 'buy', number: 11, label: 'Buy Equipment', icon: DollarSign },
    { id: 'sell', number: 12, label: 'Sell Equipment', icon: Plus },
    { id: 'exchange', number: 13, label: 'Exchange & Offers', icon: TrendingUp },
    { id: 'rental', number: 14, label: 'Rental Fleet', icon: Truck },
    { id: 'inspection', number: 15, label: 'Certified Inspection', icon: ShieldCheck },
    { id: 'valuation', number: 16, label: 'Specs Comparison & Saved', icon: Sparkles },
    { id: 'listings', number: 17, label: 'My Listings Portfolio', icon: Eye },
    { id: 'buyers', number: 18, label: 'Verified Buyers', icon: Users },
    { id: 'sellers', number: 19, label: 'Verified Sellers', icon: Users },
    { id: 'enquiries', number: 20, label: 'Buyer Enquiries', icon: MessageSquare },
    { id: 'leads', number: 21, label: 'Deal Leads', icon: TrendingUp },
    { id: 'deals', number: 22, label: 'Deals & Escrow', icon: Award },
    { id: 'documents', number: 23, label: 'RC & NOC Documents', icon: ShieldCheck },
    { id: 'reports', number: 24, label: 'Reports', icon: BarChart3 },
    { id: 'analytics', number: 25, label: 'Price Trends & Analytics', icon: BarChart3 },
    { id: 'automation', number: 26, label: 'Automation & Matchmaker', icon: Zap }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* RZ Chat Drawer */}
      <MarketplaceChatDrawer
        isOpen={chatDrawer.isOpen}
        onClose={() => setChatDrawer({ ...chatDrawer, isOpen: false })}
        recipientName={chatDrawer.recipientName}
        contextCode={chatDrawer.contextCode}
      />

      {/* RZ OTT Task Modal */}
      <MarketplaceOttModal
        isOpen={ottModal.isOpen}
        onClose={() => setOttModal({ ...ottModal, isOpen: false })}
        contextRef={ottModal.contextRef}
      />

      {/* 8-Step Listing Wizard Modal */}
      <ListMachineWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onPublishListing={handlePublishNewListing}
      />

      {/* Listing Detail Dossier Modal */}
      <ListingDetailModal
        listing={selectedListingDetail}
        isOpen={Boolean(selectedListingDetail)}
        onClose={() => setSelectedListingDetail(null)}
        onEnquire={(item) => {
          setSelectedListingDetail(null);
          setEnquireListing(item);
        }}
        onMakeOffer={(item) => {
          setSelectedListingDetail(null);
          setMakeOfferListing(item);
        }}
        onRequestInspection={(item) => {
          setSelectedListingDetail(null);
          setActivePage('inspection');
          showToast(`Inspection request initiated for ${item.listingCode}`);
        }}
        onChatWithSeller={(seller, code) => {
          setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code });
        }}
        onToggleWatchlist={handleToggleWatchlist}
        isSavedInWatchlist={selectedListingDetail ? watchlistIds.includes(selectedListingDetail.id) : false}
      />

      {/* Make Offer Modal */}
      <MakeOfferModal
        listing={makeOfferListing}
        isOpen={Boolean(makeOfferListing)}
        onClose={() => setMakeOfferListing(null)}
        onSubmitOffer={handleSubmitOffer}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        listing={enquireListing}
        isOpen={Boolean(enquireListing)}
        onClose={() => setEnquireListing(null)}
        onSubmitEnquiry={handleSubmitEnquiry}
      />

      {/* PLATFORM HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                PLATFORM 06 &bull; COMPLETE WORKFLOW
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Studio Preview / Demo Data
              </span>
            </div>
            <h1 className="text-xl font-black text-white">Used Machinery & Vehicle Marketplace</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActivePage('inspection')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inspection Desk</span>
          </button>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ List Machine for Sale</span>
          </button>
        </div>
      </div>

      {/* 26-PAGE SUBNAVIGATOR (Scrollable tabs with numbers) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {SUBPAGES.map((page) => {
            const isAct = activePage === page.id;
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => {
                  if (page.id === 'sell') {
                    setIsWizardOpen(true);
                  } else {
                    setActivePage(page.id);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isAct
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
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

      {/* PAGE 1: MARKETPLACE DASHBOARD */}
      {activePage === 'dashboard' && (
        <MachineryDashboardView
          onNavigateSubpage={(subpage) => setActivePage(subpage)}
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'DASHBOARD' })}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 2: MACHINES DIRECTORY (All) */}
      {activePage === 'machines' && (
        <MachineryBrowseView
          initialCategory="ALL"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 3: CRUSHER PLANTS & SCREENS */}
      {activePage === 'crusher-machines' && (
        <MachineryBrowseView
          initialCategory="Quarry / Crusher Equipment"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 4: EXCAVATORS */}
      {activePage === 'excavators' && (
        <MachineryBrowseView
          initialCategory="Machinery"
          initialTypeFilter="Excavators"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 5: WHEEL LOADERS */}
      {activePage === 'loaders' && (
        <MachineryBrowseView
          initialCategory="Machinery"
          initialTypeFilter="Wheel Loaders"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 6: HYDRAULIC BREAKERS */}
      {activePage === 'breakers' && (
        <MachineryBrowseView
          initialCategory="Machinery"
          initialTypeFilter="Hydraulic Breakers"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 7: DRILLING EQUIPMENT & COMPRESSORS */}
      {activePage === 'drilling-equipment' && (
        <MachineryBrowseView
          initialCategory="Machinery"
          initialTypeFilter="Drilling Machines"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 8: HEAVY EQUIPMENT */}
      {activePage === 'heavy-equipment' && (
        <MachineryBrowseView
          initialCategory="Machinery"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 9: COMMERCIAL TIPPERS */}
      {activePage === 'commercial-vehicles' && (
        <MachineryBrowseView
          initialCategory="Commercial Vehicles"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 10: QUARRY STONE CUTTERS / ANCILLARIES */}
      {activePage === 'quarry-equipment' && (
        <MachineryBrowseView
          initialCategory="Quarry / Crusher Equipment"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 11: BUY EQUIPMENT */}
      {activePage === 'buy' && (
        <MachineryBrowseView
          initialCategory="ALL"
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOfferList={(listing) => setMakeOfferListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      )}

      {/* PAGE 13: EXCHANGE & OFFERS */}
      {activePage === 'exchange' && (
        <OffersNegotiationView
          onOpenChat={(party, code) => setChatDrawer({ isOpen: true, recipientName: party, contextCode: code })}
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'NEGOTIATION' })}
          onAcceptOfferToDeal={(offer) => {
            showToast(`Offer ${offer.offerCode} accepted and converted to Escrow Deal`);
            setActivePage('deals');
          }}
        />
      )}

      {/* PAGE 14: RENTAL FLEET */}
      {activePage === 'rental' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-300">
            <span>
              Long-term and short-term equipment rental available with certified operators & fuel monitoring.
            </span>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold cursor-pointer"
            >
              List Rental Machine
            </button>
          </div>
          <MachineryBrowseView
            initialCategory="ALL"
            onSelectList={(listing) => setSelectedListingDetail(listing)}
            onEnquireList={(listing) => setEnquireListing(listing)}
            onOfferList={(listing) => setMakeOfferListing(listing)}
            onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
            onOpenListWizard={() => setIsWizardOpen(true)}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistIds={watchlistIds}
          />
        </div>
      )}

      {/* PAGE 15: CERTIFIED INSPECTION */}
      {activePage === 'inspection' && (
        <InspectionManagementView
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'INSPECTION' })}
        />
      )}

      {/* PAGE 16: VALUATION & WATCHLIST COMPARISON */}
      {activePage === 'valuation' && (
        <WatchlistCompareView
          watchlistIds={watchlistIds}
          onToggleWatchlist={handleToggleWatchlist}
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onEnquireList={(listing) => setEnquireListing(listing)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
        />
      )}

      {/* PAGE 17: MY LISTINGS PORTFOLIO */}
      {activePage === 'listings' && (
        <MyListingsView
          listings={listings}
          onSelectList={(listing) => setSelectedListingDetail(listing)}
          onOpenListWizard={() => setIsWizardOpen(true)}
          onUpdateStatus={(id, st) => showToast(`Listing status updated to ${st}`)}
          onOpenChat={(seller, code) => setChatDrawer({ isOpen: true, recipientName: seller, contextCode: code })}
        />
      )}

      {/* PAGE 18: VERIFIED BUYERS */}
      {activePage === 'buyers' && (
        <BuyerSellerProfilesView
          initialType="buyer"
          onOpenChat={(party, code) => setChatDrawer({ isOpen: true, recipientName: party, contextCode: code })}
        />
      )}

      {/* PAGE 19: VERIFIED SELLERS */}
      {activePage === 'sellers' && (
        <BuyerSellerProfilesView
          initialType="seller"
          onOpenChat={(party, code) => setChatDrawer({ isOpen: true, recipientName: party, contextCode: code })}
        />
      )}

      {/* PAGE 20: BUYER ENQUIRIES */}
      {activePage === 'enquiries' && (
        <EnquiriesView
          type="buyer"
          onOpenChat={(party, code) => setChatDrawer({ isOpen: true, recipientName: party, contextCode: code })}
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'ENQUIRY' })}
          onConvertToDeal={(enquiry) => {
            showToast(`Converted enquiry ${enquiry.enquiryCode} to deal`);
            setActivePage('deals');
          }}
        />
      )}

      {/* PAGE 21: DEAL LEADS */}
      {activePage === 'leads' && (
        <EnquiriesView
          type="seller"
          onOpenChat={(party, code) => setChatDrawer({ isOpen: true, recipientName: party, contextCode: code })}
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'LEAD' })}
          onConvertToDeal={(enquiry) => {
            showToast(`Converted lead ${enquiry.enquiryCode} to deal`);
            setActivePage('deals');
          }}
        />
      )}

      {/* PAGE 22: DEALS & ESCROW */}
      {activePage === 'deals' && (
        <DealsManagementView
          onOpenChat={(party, code) => setChatDrawer({ isOpen: true, recipientName: party, contextCode: code })}
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'DEAL' })}
          onNavigateToPayments={() => setActivePage('payments')}
          onNavigateToDocuments={() => setActivePage('documents')}
          onNavigateToDelivery={() => setActivePage('transfer-delivery')}
        />
      )}

      {/* PAGE 23: RC & NOC DOCUMENTS */}
      {activePage === 'documents' && (
        <DealDocumentsView
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'DOCS' })}
        />
      )}

      {/* PAGE 24: REPORTS */}
      {activePage === 'reports' && <MachineryReportsView />}

      {/* PAGE 25: PRICE TRENDS & ANALYTICS */}
      {activePage === 'analytics' && <MachineryReportsView />}

      {/* PAGE 26: AUTOMATION & MATCHMAKER */}
      {activePage === 'automation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold">SMART ASSET MATCHMAKER</div>
              <h2 className="text-lg font-black text-white">Automated Buyer-Seller Match Engine</h2>
              <p className="text-xs text-slate-400">
                Rule-based automated matching connecting regional aggregate contractors with verified equipment owners
              </p>
            </div>
            <button
              onClick={() => setOttModal({ isOpen: true, contextRef: 'MATCHMAKER-CRON' })}
              className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Create OTT Match Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Geographic Match Filter</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Matches quarry operators within a 150 km radius to minimize low-bed trailer transport overheads.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Payload & Ton Match</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Analyzes quarry daily crushing output targets and suggests optimal excavator bucket volumes (1.0m³ - 2.5m³).
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Inspection Gate</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Automatically prioritizes listings with completed 48-point surveyor audits and verified RTO NOC clearance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AUXILIARY VIEW: PAYMENTS */}
      {activePage === 'payments' && (
        <MarketplacePaymentsView
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'PAYMENTS' })}
        />
      )}

      {/* AUXILIARY VIEW: TRANSFER & DELIVERY */}
      {activePage === 'transfer-delivery' && (
        <TransferDeliveryView
          onNavigateToPlatform3={() => onNavigateSection && onNavigateSection('fleet')}
          onOpenOttModal={(contextRef) => setOttModal({ isOpen: true, contextRef: contextRef || 'LOGISTICS' })}
        />
      )}
    </div>
  );
};
