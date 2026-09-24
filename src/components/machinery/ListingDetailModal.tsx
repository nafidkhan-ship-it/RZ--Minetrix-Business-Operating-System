import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  DollarSign,
  Truck,
  MessageSquare,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  ChevronRight,
  Phone,
  Bookmark,
  Share2
} from 'lucide-react';
import { MachineryListing } from '../../data/usedMachineryMarketplaceData';

interface ListingDetailModalProps {
  listing: MachineryListing | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire: (listing: MachineryListing) => void;
  onMakeOffer: (listing: MachineryListing) => void;
  onRequestInspection: (listing: MachineryListing) => void;
  onChatWithSeller: (seller: string, listingCode: string) => void;
  onToggleWatchlist: (listingId: string) => void;
  isSavedInWatchlist: boolean;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  onEnquire,
  onMakeOffer,
  onRequestInspection,
  onChatWithSeller,
  onToggleWatchlist,
  isSavedInWatchlist
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'docs' | 'inspection' | 'seller'>('specs');

  if (!isOpen || !listing) return null;

  const images = listing.galleryImages && listing.galleryImages.length > 0
    ? listing.galleryImages
    : [listing.featuredImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                {listing.listingCode}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{listing.category}</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-semibold">{listing.condition} Condition</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white line-clamp-1">
              {listing.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(listing.id)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isSavedInWatchlist
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Save to Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Gallery & Price Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Gallery (7 cols) */}
            <div className="lg:col-span-7 space-y-2">
              <div className="relative h-64 sm:h-72 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={images[activeImageIndex] || listing.featuredImage}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono font-bold text-amber-400 border border-slate-800">
                  {listing.year} Model
                </div>
                {listing.hasVideo && (
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold text-slate-200 border border-slate-800 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Walkaround Video Available</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                        activeImageIndex === idx ? 'border-amber-400' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Commercial Brief (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Seller Asking Price
                  </div>
                  <div className="text-2xl font-black text-white font-mono mt-0.5">
                    {listing.priceType === 'Price on Request'
                      ? 'Price on Request'
                      : `₹${(listing.askingPriceRs / 100000).toFixed(2)} Lakh`}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="text-amber-400 font-semibold">{listing.priceType}</span>
                    <span>·</span>
                    <span>{listing.financeAvailable ? 'Commercial Finance Ready' : 'Direct Outright'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-white">{listing.locationCity}, {listing.locationDistrict}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Working Hours / KM:</span>
                    <span className="font-mono text-white">
                      {listing.hoursWorked ? `${listing.hoursWorked.toLocaleString()} Hours` : `${listing.odometerKm?.toLocaleString()} KM`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Registration Number:</span>
                    <span className="font-mono text-white">{listing.registrationNumber || 'Off-Highway / Plant'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Inspection:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {listing.inspectionStatus}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">Payment Terms:</div>
                  <p>{listing.paymentTerms}</p>
                </div>
              </div>

              {/* Top Quick Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <button
                  onClick={() => onMakeOffer(listing)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>MAKE OFFER & NEGOTIATE</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onEnquire(listing)}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                  >
                    Enquire
                  </button>

                  <button
                    onClick={() => onChatWithSeller(listing.sellerName, listing.listingCode)}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>RZ Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TABBED SPECIFICATION & DOSSIER */}
          <div className="space-y-4">
            <div className="flex items-center gap-1 border-b border-slate-800">
              {[
                { id: 'specs', label: 'Technical Specifications' },
                { id: 'docs', label: 'Verified Documents & RTO' },
                { id: 'inspection', label: 'Inspection Findings' },
                { id: 'seller', label: 'Seller & Concession Info' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: TECHNICAL SPECS */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Brand / Manufacturer</div>
                  <div className="font-bold text-white text-sm mt-0.5">{listing.brand}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Model Name</div>
                  <div className="font-bold text-white text-sm mt-0.5">{listing.model}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Manufacturing Year</div>
                  <div className="font-bold text-white text-sm mt-0.5">{listing.year}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Engine Make & Model</div>
                  <div className="font-bold text-white text-sm mt-0.5">{listing.engineMakeModel}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Engine Output</div>
                  <div className="font-bold text-white text-sm mt-0.5">{listing.enginePowerHp}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Operating Weight</div>
                  <div className="font-bold text-white text-sm mt-0.5">{listing.operatingWeightTons} Metric Tons</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Bucket / Payload Capacity</div>
                  <div className="font-bold text-white text-sm mt-0.5">{listing.bucketOrPayloadCapacity}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Fuel System</div>
                  <div className="font-bold text-white text-sm mt-0.5">{listing.fuelType}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="text-slate-500">Chassis / Serial Number</div>
                  <div className="font-mono text-white text-xs mt-0.5">{listing.chassisSerialNumber}</div>
                </div>
              </div>
            )}

            {/* TAB 2: DOCUMENTS */}
            {activeTab === 'docs' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400">RC Registration</div>
                      <div className="font-bold text-white mt-0.5">
                        {listing.hasRcRegistration ? 'Available (Smart Card)' : 'Not Applicable'}
                      </div>
                    </div>
                    {listing.hasRcRegistration ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span className="text-slate-600 font-mono text-[11px]">N/A</span>
                    )}
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400">Commercial Insurance</div>
                      <div className="font-bold text-white mt-0.5">
                        {listing.hasInsurance ? `Valid till ${listing.insuranceValidTill}` : 'Expired / Not Insured'}
                      </div>
                    </div>
                    {listing.hasInsurance ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400">Fitness Certificate</div>
                      <div className="font-bold text-white mt-0.5">
                        {listing.hasFitness ? `Valid till ${listing.fitnessValidTill}` : 'Exempt / Expired'}
                      </div>
                    </div>
                    {listing.hasFitness ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span className="text-slate-600 font-mono text-[11px]">N/A</span>
                    )}
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400">RTO NOC Clearance</div>
                      <div className="font-bold text-white mt-0.5">
                        {listing.hasNocClearance ? 'Ready for Inter-State Transfer' : 'Under Bank Processing'}
                      </div>
                    </div>
                    {listing.hasNocClearance ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400">Service Logs & History</div>
                      <div className="font-bold text-white mt-0.5">
                        {listing.hasServiceRecords ? 'Authorized OEM Logs Available' : 'Self-Maintained'}
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400">Ownership Serial</div>
                      <div className="font-bold text-white mt-0.5">
                        {listing.ownershipCount === 1 ? '1st Owner (Direct)' : `${listing.ownershipCount}nd Owner`}
                      </div>
                    </div>
                    <span className="text-amber-400 font-bold">1st Hand</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: INSPECTION FINDINGS */}
            {activeTab === 'inspection' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-sm">Certified Technical Survey</span>
                  </div>
                  <button
                    onClick={() => onRequestInspection(listing)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition cursor-pointer"
                  >
                    Request New Inspection
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <div className="font-semibold text-amber-400 mb-1">Survey Summary:</div>
                  <p>{listing.inspectionScore || 'Inspection report pending or scheduled by certified engineer.'}</p>
                </div>

                <div className="text-slate-400 leading-relaxed text-[11px]">
                  RZ® Technical Audits check 48 critical checkpoints including engine blow-by, main hydraulic relief pressure, slew play, undercarriage link wear, and structural weld test under live load.
                </div>
              </div>
            )}

            {/* TAB 4: SELLER INFO */}
            {activeTab === 'seller' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-white">{listing.sellerBusiness}</div>
                    <div className="text-slate-400">Contact Person: {listing.sellerName}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 font-mono font-bold text-xs">
                    ★ {listing.sellerRating} / 5.0
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 bg-slate-900 rounded-xl">
                    <div className="text-slate-500">Seller Category</div>
                    <div className="font-bold text-white">{listing.sellerType}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl">
                    <div className="text-slate-500">City / Mining Hub</div>
                    <div className="font-bold text-white">{listing.sellerCity}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl">
                    <div className="text-slate-500">Total Live Listings</div>
                    <div className="font-bold text-white">{listing.sellerTotalListings} Equipment Units</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onChatWithSeller(listing.sellerName, listing.listingCode)}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct RZ Chat with Seller</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Escrow Protected &bull; Inspection Guarantee &bull; RTO Transfer Support
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onRequestInspection(listing)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              Request Inspection
            </button>
            <button
              onClick={() => onMakeOffer(listing)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              MAKE OFFER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
