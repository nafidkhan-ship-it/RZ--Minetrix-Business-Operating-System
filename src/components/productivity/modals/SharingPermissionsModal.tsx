import React, { useState } from 'react';
import {
  X,
  Share2,
  Users,
  Lock,
  Globe,
  Building2,
  CheckCircle2,
  Copy,
  Clock,
  Shield,
  Send,
  AlertCircle
} from 'lucide-react';
import { ProductivityFile, SharePermission } from '../types';

interface SharingPermissionsModalProps {
  isOpen: boolean;
  file: ProductivityFile | null;
  onClose: () => void;
  onShareSuccess?: (message: string) => void;
}

export const SharingPermissionsModal: React.FC<SharingPermissionsModalProps> = ({
  isOpen,
  file,
  onClose,
  onShareSuccess
}) => {
  const [recipient, setRecipient] = useState('');
  const [permission, setPermission] = useState<SharePermission>('editor');
  const [expiryDays, setExpiryDays] = useState('30');
  const [message, setMessage] = useState('');
  const [accessLevel, setAccessLevel] = useState<'private' | 'shared' | 'organization' | 'public'>('organization');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !file) return null;

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    onShareSuccess?.(`Shareable link copied for ${file.name}`);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) return;
    onShareSuccess?.(`Shared "${file.name}" with ${recipient} as ${permission.toUpperCase()}`);
    setRecipient('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Share &amp; Access Permissions</h3>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{file.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Access Level Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">General Access Scope</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'private', label: 'Restricted (Private)', icon: Lock, desc: 'Only invited collaborators' },
              { id: 'shared', label: 'Invited Teams', icon: Users, desc: 'Specific departments & roles' },
              { id: 'organization', label: 'RZ® Organization', icon: Building2, desc: 'Anyone in RZ MINETRIX' },
              { id: 'public', label: 'Public Link', icon: Globe, desc: 'External clients with URL' }
            ].map((scope) => {
              const Icon = scope.icon;
              const isSelected = accessLevel === scope.id;
              return (
                <button
                  type="button"
                  key={scope.id}
                  onClick={() => setAccessLevel(scope.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{scope.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{scope.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleSendInvite} className="space-y-3 font-mono text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Add Person, Email or Operational Role</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. accounts@racezoneventures.com or Quarry Manager"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as SharePermission)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold focus:outline-none"
              >
                <option value="viewer">Viewer</option>
                <option value="commenter">Commenter</option>
                <option value="editor">Editor</option>
                <option value="owner">Transfer Owner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Link Expiry</label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-300 focus:outline-none"
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="never">Never Expires</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Optional Note</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Attached for month-end reconciliation..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Current Collaborators */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Current Access Roster</span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                    MD
                  </div>
                  <div>
                    <span className="text-white font-bold">{file.owner}</span>
                    <span className="text-slate-500 text-[10px] block">Owner &bull; Primary Author</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  Owner
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                    AC
                  </div>
                  <div>
                    <span className="text-white font-bold">Anjali Menon (Accounts)</span>
                    <span className="text-slate-500 text-[10px] block">Finance &amp; Ledger Verification</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  Editor
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-sans">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!recipient.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Access</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
