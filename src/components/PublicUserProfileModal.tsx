import React from 'react';
import {
  X,
  MessageSquare,
  UserPlus,
  UserCheck,
  ShieldAlert,
  Share2,
  MapPin,
  Calendar,
  Lock,
  Building2,
  BadgeCheck,
  User,
  ShieldCheck,
  EyeOff
} from 'lucide-react';
import { ChatUser } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface PublicUserProfileModalProps {
  viewerUserId: string;
  targetUser: ChatUser | null;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  onBlockReport: (user: ChatUser) => void;
  onToast: (msg: string) => void;
}

export const PublicUserProfileModal: React.FC<PublicUserProfileModalProps> = ({
  viewerUserId,
  targetUser,
  isOpen,
  onClose,
  onStartChat,
  onBlockReport,
  onToast
}) => {
  if (!isOpen || !targetUser) return null;

  const profileData = rzChatService.getPublicUserProfile(viewerUserId, targetUser.id);
  const isContact = rzChatService.isContact(viewerUserId, targetUser.id);

  const handleToggleContact = () => {
    if (isContact) {
      rzChatService.removeContact(viewerUserId, targetUser.id);
      onToast(`Removed @${targetUser.username} from contacts.`);
    } else {
      rzChatService.addContact(viewerUserId, targetUser.id);
      onToast(`Added @${targetUser.username} to contacts.`);
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/@${targetUser.username}`;
    navigator.clipboard.writeText(profileUrl);
    onToast(`Copied profile URL: @${targetUser.username}`);
  };

  const getCategoryBadge = () => {
    switch (targetUser.accountCategory) {
      case 'business_user':
        return (
          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Business Account
          </span>
        );
      case 'erp_org_user':
        return (
          <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" /> ERP Org User
          </span>
        );
      case 'admin':
        return (
          <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Platform Admin
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <User className="w-3 h-3" /> Public User
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative font-sans animate-in fade-in zoom-in duration-150">
        {/* TOP COVER HEADER */}
        <div className="h-32 bg-gradient-to-r from-amber-500/20 via-slate-800 to-amber-500/10 relative p-4 flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getCategoryBadge()}
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-950/60 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROFILE AVATAR OVERLAY */}
        <div className="px-6 relative -mt-12 mb-4 flex justify-between items-end">
          <div className="relative">
            {profileData.canSeePhoto && profileData.user?.profilePhoto ? (
              <img
                src={profileData.user.profilePhoto}
                alt={targetUser.displayName}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-900 shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-slate-800 border-4 border-slate-900 shadow-2xl flex items-center justify-center text-slate-500">
                <EyeOff className="w-8 h-8" />
              </div>
            )}
            <span
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                targetUser.accountStatus === 'active' ? 'bg-emerald-400' : 'bg-slate-500'
              }`}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleShareProfile}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition cursor-pointer"
              title="Share Profile URL"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleContact}
              className={`px-3.5 py-2.5 rounded-2xl font-bold font-mono text-xs transition flex items-center gap-1.5 cursor-pointer ${
                isContact
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              }`}
            >
              {isContact ? (
                <>
                  <UserCheck className="w-4 h-4" /> Contact Saved
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Add Contact
                </>
              )}
            </button>
          </div>
        </div>

        {/* USER DETAILS */}
        <div className="px-6 pb-6 space-y-4 font-mono">
          <div>
            <h2 className="text-xl font-black text-white">{targetUser.displayName}</h2>
            <p className="text-amber-400 font-bold text-xs">@{targetUser.username}</p>
          </div>

          {/* PRIVACY WARNING NOTICE IF APPLICABLE */}
          {profileData.privacyRestricted && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-2 text-[11px] text-slate-400">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Some profile attributes are hidden based on @{targetUser.username}&apos;s privacy settings.</span>
            </div>
          )}

          {/* ABOUT SECTION */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">About</span>
            <p className="text-slate-200 text-xs leading-relaxed">
              {profileData.canSeeAbout ? targetUser.about || 'No bio provided.' : '🔒 Privacy Restricted'}
            </p>
          </div>

          {/* METADATA GRID */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Location</span>
                <span className="truncate block">{targetUser.location || 'Global'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Member Since</span>
                <span>{new Date(targetUser.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 flex gap-3">
            <button
              disabled={!profileData.canMessage}
              onClick={() => {
                onClose();
                onStartChat(targetUser.id);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition ${
                profileData.canMessage
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              {profileData.canMessage ? 'Start Conversation' : 'Messaging Restricted'}
            </button>

            <button
              onClick={() => {
                onClose();
                onBlockReport(targetUser);
              }}
              className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-2xl transition cursor-pointer"
              title="Block or Report User"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
