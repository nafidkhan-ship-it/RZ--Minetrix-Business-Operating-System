import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  MapPin,
  Image
} from 'lucide-react';
import { ChatUser, PrivacySettings } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface EditProfileAndPrivacyModalProps {
  currentUser: ChatUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: ChatUser) => void;
  onToast: (msg: string) => void;
}

export const EditProfileAndPrivacyModal: React.FC<EditProfileAndPrivacyModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSuccess,
  onToast
}) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [about, setAbout] = useState(currentUser.about);
  const [location, setLocation] = useState(currentUser.location || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser.profilePhoto);

  const [privacy, setPrivacy] = useState<PrivacySettings>(
    currentUser.privacySettings || {
      profilePhoto: 'everyone',
      about: 'everyone',
      lastSeen: 'everyone',
      whoCanMessageMe: 'everyone'
    }
  );

  const [activeTab, setActiveTab] = useState<'profile' | 'privacy'>('profile');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const usernameCheck = username.trim().toLowerCase() === currentUser.username.toLowerCase()
    ? { valid: true, error: undefined }
    : rzChatService.validateUsername(username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!displayName.trim()) {
      setFormError('Display name cannot be blank.');
      return;
    }

    if (!usernameCheck.valid) {
      setFormError(usernameCheck.error || 'Invalid or taken username.');
      return;
    }

    const res = rzChatService.updateUserProfile(currentUser.id, {
      displayName,
      username,
      about,
      location,
      profilePhoto,
      privacySettings: privacy
    });

    if (res.success && res.user) {
      onToast('Profile & privacy configuration updated successfully!');
      onSuccess(res.user);
      onClose();
    } else {
      setFormError(res.error || 'Failed to update profile settings.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative font-sans max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-mono">My Account Settings</h2>
              <p className="text-xs text-slate-400 font-mono">Profile Identity &amp; Public Privacy Controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB TABS */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Public Identity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Privacy Rules
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono overflow-y-auto">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {activeTab === 'profile' ? (
            <div className="space-y-4">
              {/* DISPLAY NAME & USERNAME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Public Username (@)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-amber-400 font-bold text-xs">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full pl-8 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                    />
                    {username.trim() && (
                      <span className="absolute right-3 top-3">
                        {usernameCheck.valid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* LOCATION & PHOTO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Location / Region
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Lusaka, Zambia"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Profile Photo URL
                  </label>
                  <input
                    type="text"
                    value={profilePhoto}
                    onChange={e => setProfilePhoto(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 focus:outline-none focus:border-amber-500 truncate"
                  />
                </div>
              </div>

              {/* ABOUT / BIO */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  About / Bio
                </label>
                <textarea
                  rows={3}
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Share a brief introduction or commercial role..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Configure who can view your photo, status, and initiate direct chats.</span>
              </div>

              {/* PROFILE PHOTO PRIVACY */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Who can see my Profile Photo?
                </label>
                <select
                  value={privacy.profilePhoto}
                  onChange={e => setPrivacy({ ...privacy, profilePhoto: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="everyone">Everyone (Public)</option>
                  <option value="contacts">My Contacts Only</option>
                  <option value="nobody">Nobody (Private)</option>
                </select>
              </div>

              {/* ABOUT PRIVACY */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Who can see my About Bio?
                </label>
                <select
                  value={privacy.about}
                  onChange={e => setPrivacy({ ...privacy, about: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="everyone">Everyone (Public)</option>
                  <option value="contacts">My Contacts Only</option>
                  <option value="nobody">Nobody (Private)</option>
                </select>
              </div>

              {/* LAST SEEN PRIVACY */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Who can see my Last Seen / Online Status?
                </label>
                <select
                  value={privacy.lastSeen}
                  onChange={e => setPrivacy({ ...privacy, lastSeen: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="everyone">Everyone (Public)</option>
                  <option value="contacts">My Contacts Only</option>
                  <option value="nobody">Nobody (Private)</option>
                </select>
              </div>

              {/* WHO CAN MESSAGE ME */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Who can initiate direct messages with me?
                </label>
                <select
                  value={privacy.whoCanMessageMe}
                  onChange={e => setPrivacy({ ...privacy, whoCanMessageMe: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="everyone">Everyone (Public Messaging)</option>
                  <option value="contacts">My Contacts Only</option>
                  <option value="nobody">Nobody (Block New Inbound Chats)</option>
                </select>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Sparkles className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
