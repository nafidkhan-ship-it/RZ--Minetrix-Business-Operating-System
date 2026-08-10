import React from 'react';
import {
  X,
  Building2,
  BadgeCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Share2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText
} from 'lucide-react';
import { BusinessProfile } from '../types/rzChatTypes';

interface BusinessProfileModalProps {
  viewerUserId: string;
  business: BusinessProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (businessId: string) => void;
  onRequestVerification?: (business: BusinessProfile) => void;
  onToast: (msg: string) => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  viewerUserId,
  business,
  isOpen,
  onClose,
  onStartChat,
  onRequestVerification,
  onToast
}) => {
  if (!isOpen || !business) return null;

  const isOwner = business.ownerUserId === viewerUserId;

  const handleShare = () => {
    const url = `${window.location.origin}/business/@${business.username}`;
    navigator.clipboard.writeText(url);
    onToast(`Copied business link: @${business.username}`);
  };

  const getStatusBadge = () => {
    switch (business.operationalStatus) {
      case 'open':
        return <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono font-bold">Open Now</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-mono font-bold">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-mono font-bold">Temporarily Unavailable</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative font-sans max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
        {/* COVER IMAGE & HEADER */}
        <div className="h-40 relative bg-slate-800">
          <img
            src={business.coverImageUrl}
            alt={business.businessName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-950/70 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOGO & TITLE OVERLAY */}
        <div className="px-6 relative -mt-10 mb-2 flex justify-between items-end">
          <img
            src={business.logoUrl}
            alt={business.businessName}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl bg-slate-900"
          />

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition cursor-pointer"
              title="Share Business Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onStartChat(business.id);
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition"
            >
              <MessageSquare className="w-4 h-4" /> Message Business
            </button>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="px-6 pb-6 space-y-4 font-mono overflow-y-auto">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{business.businessName}</h2>
              {business.verificationStatus === 'verified' && (
                <span className="p-1 bg-amber-500/10 text-amber-400 rounded-full" title="Verified Business">
                  <BadgeCheck className="w-5 h-5 fill-amber-500/20" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-amber-400 font-bold text-xs">@{business.username}</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-md text-[10px]">
                {business.category}
              </span>
              {getStatusBadge()}
            </div>
          </div>

          {/* VERIFICATION STATUS NOTICE */}
          {business.verificationStatus !== 'verified' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {business.verificationStatus === 'pending'
                    ? 'Verification Request Pending Approval'
                    : 'Unverified Commercial Account'}
                </span>
              </div>
              {isOwner && business.verificationStatus === 'unverified' && onRequestVerification && (
                <button
                  onClick={() => onRequestVerification(business)}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-xl hover:bg-amber-400 transition cursor-pointer"
                >
                  Verify Now
                </button>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Business Overview
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">{business.description}</p>
          </div>

          {/* SERVICES OFFERED */}
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Commercial Products &amp; Services
            </span>
            <div className="flex flex-wrap gap-1.5">
              {business.services.map((srv, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 text-[11px] rounded-xl"
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>

          {/* CONTACT INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Address</span>
                <span className="truncate block">{business.location}</span>
              </div>
            </div>

            {business.phone && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Phone</span>
                  <span className="truncate block">{business.phone}</span>
                </div>
              </div>
            )}

            {business.email && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Email</span>
                  <span className="truncate block">{business.email}</span>
                </div>
              </div>
            )}

            {business.website && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-2.5 text-slate-300">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Website</span>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline truncate block"
                  >
                    {business.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
