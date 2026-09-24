import React, { useState } from 'react';
import {
  User,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  ShieldCheck,
  BellOff,
  Bell,
  Ban,
  Flag,
  Share2,
  FileText,
  Image,
  Folder,
  CheckCircle2
} from 'lucide-react';
import { ChatContact, DEMO_MEDIA_ITEMS, DEMO_FILES_ITEMS } from '../../../data/rzChatData';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ChatContact;
  onStartCall?: (type: 'audio' | 'video') => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  contact,
  onStartCall
}) => {
  if (!isOpen) return null;

  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'media' | 'files'>('info');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Contact Profile</h3>
              <p className="text-[10px] text-slate-400">RZ® Ecosystem Member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2 text-emerald-300 font-bold text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Avatar Banner */}
          <div className="text-center p-5 bg-slate-950/60 border border-slate-800 rounded-3xl space-y-3">
            <div className="relative inline-block">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-20 h-20 rounded-2xl mx-auto object-cover border-2 border-emerald-500/30 shadow-lg"
              />
              {contact.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div>
              <h4 className="text-base font-black text-white">{contact.name}</h4>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                  {contact.category}
                </span>
                <span className="text-slate-400 text-[11px]">&bull; {contact.role}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{contact.company}</p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => onStartCall && onStartCall('audio')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Call</span>
              </button>
              <button
                onClick={() => onStartCall && onStartCall('video')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>Video Call</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-2xl">
            {(['info', 'media', 'files'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-xl font-bold capitalize transition cursor-pointer ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'info' ? 'About & Info' : tab === 'media' ? 'Media (4)' : 'Docs & Files (3)'}
              </button>
            ))}
          </div>

          {activeTab === 'info' && (
            <div className="space-y-3">
              {/* About Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">About / Bio</span>
                <p className="text-slate-300 leading-relaxed">{contact.about}</p>
              </div>

              {/* Contact Info */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500">Phone Number</div>
                    <div className="font-mono font-bold text-white">{contact.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500">Email Address</div>
                    <div className="font-mono text-white">{contact.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500">Location</div>
                    <div className="text-white font-medium">{contact.location}</div>
                  </div>
                </div>
              </div>

              {/* Ecosystem Affiliation */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">
                  Ecosystem Cross-Link
                </span>
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{contact.company}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Linked across Platforms: Platform 1 (Quarry), Platform 3 (Logistics Fleet) and Platform 7 (Land Syndicate).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-2 gap-2">
              {DEMO_MEDIA_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden border border-slate-800 aspect-square bg-slate-950 cursor-pointer"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-white line-clamp-1">{item.title}</span>
                    <span className="text-[9px] text-slate-400">{item.size}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-2">
              {DEMO_FILES_ITEMS.map((file) => (
                <div
                  key={file.id}
                  className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold font-mono text-[10px]">
                      {file.fileType}
                    </div>
                    <div>
                      <div className="font-bold text-white line-clamp-1">{file.name}</div>
                      <div className="text-[10px] text-slate-400">{file.size} &bull; {file.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2 space-y-1">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                showToast(isMuted ? 'Unmuted contact notifications' : 'Contact notifications muted');
              }}
              className="w-full p-2 rounded-xl hover:bg-slate-800 text-left text-slate-300 flex items-center justify-between cursor-pointer transition"
            >
              <div className="flex items-center gap-2">
                {isMuted ? <BellOff className="w-4 h-4 text-amber-400" /> : <Bell className="w-4 h-4 text-slate-400" />}
                <span>{isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {isMuted ? 'Muted' : 'Normal'}
              </span>
            </button>

            <button
              onClick={() => {
                setIsBlocked(!isBlocked);
                showToast(isBlocked ? 'Contact unblocked' : 'Contact blocked from messaging');
              }}
              className="w-full p-2 rounded-xl hover:bg-red-500/10 text-left text-red-400 flex items-center gap-2 cursor-pointer transition"
            >
              <Ban className="w-4 h-4" />
              <span>{isBlocked ? 'Unblock Contact' : 'Block Contact'}</span>
            </button>

            <button
              onClick={() => showToast('Report submitted to RZ Safety & Compliance Desk')}
              className="w-full p-2 rounded-xl hover:bg-slate-800 text-left text-slate-400 flex items-center gap-2 cursor-pointer transition"
            >
              <Flag className="w-4 h-4" />
              <span>Report Contact</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
