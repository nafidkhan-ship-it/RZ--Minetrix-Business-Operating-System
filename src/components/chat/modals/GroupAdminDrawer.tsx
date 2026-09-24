import React, { useState } from 'react';
import {
  Users,
  X,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  UserMinus,
  Crown,
  Lock,
  BellOff,
  Bell,
  Trash2,
  Settings2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { ChatConversation, DEMO_CONTACTS } from '../../../data/rzChatData';

interface GroupAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: ChatConversation;
  onUpdateConversation: (updated: Partial<ChatConversation>) => void;
}

export const GroupAdminDrawer: React.FC<GroupAdminDrawerProps> = ({
  isOpen,
  onClose,
  conversation,
  onUpdateConversation
}) => {
  if (!isOpen) return null;

  const [permissions, setPermissions] = useState(
    conversation.permissions || {
      sendMessages: true,
      sendMedia: true,
      sendFiles: true,
      addMembers: true,
      editGroupInfo: false,
      createTasks: true
    }
  );

  const [admins, setAdmins] = useState<string[]>(conversation.groupAdmins || ['SELF']);
  const [members, setMembers] = useState<string[]>(
    conversation.groupMembers || ['SELF', 'USR-001', 'USR-002', 'USR-004']
  );
  const [savedToast, setSavedToast] = useState(false);

  const togglePermission = (key: keyof typeof permissions) => {
    const updated = { ...permissions, [key]: !permissions[key] };
    setPermissions(updated);
    onUpdateConversation({ permissions: updated });
    triggerSaveToast();
  };

  const toggleAdmin = (userId: string) => {
    const updated = admins.includes(userId)
      ? admins.filter((id) => id !== userId)
      : [...admins, userId];
    setAdmins(updated);
    onUpdateConversation({ groupAdmins: updated });
    triggerSaveToast();
  };

  const removeMember = (userId: string) => {
    const updated = members.filter((id) => id !== userId);
    setMembers(updated);
    onUpdateConversation({
      groupMembers: updated,
      groupMembersCount: updated.length
    });
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Group Administration</h3>
              <p className="text-[10px] text-slate-400">
                {conversation.name} &bull; {conversation.groupCategory}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2 text-emerald-300 font-bold text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Permissions updated in Studio Preview</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Group Profile Overview */}
          <div className="text-center p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-16 h-16 rounded-2xl mx-auto object-cover border border-slate-700 shadow-md"
            />
            <h4 className="text-sm font-black text-white">{conversation.name}</h4>
            <div className="flex items-center justify-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]">
                {conversation.groupCategory}
              </span>
              <span className="text-slate-400 text-[11px]">
                &bull; {members.length} Members
              </span>
            </div>
            {conversation.groupDescription && (
              <p className="text-[11px] text-slate-400 italic pt-1">
                "{conversation.groupDescription}"
              </p>
            )}
          </div>

          {/* Member Permissions Toggles */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Participant Permissions</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-2.5">
              {[
                { key: 'sendMessages' as const, label: 'Send Text Messages' },
                { key: 'sendMedia' as const, label: 'Send Photos & Videos' },
                { key: 'sendFiles' as const, label: 'Send Documents & PDFs' },
                { key: 'createTasks' as const, label: 'Create RZ OTT Tasks from Chat' },
                { key: 'addMembers' as const, label: 'Add Other Participants' },
                { key: 'editGroupInfo' as const, label: 'Edit Group Subject & Icon' }
              ].map((perm) => (
                <div
                  key={perm.key}
                  className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0"
                >
                  <span className="text-slate-300 font-medium">{perm.label}</span>
                  <button
                    onClick={() => togglePermission(perm.key)}
                    className={`w-9 h-5 rounded-full transition relative cursor-pointer ${
                      permissions[perm.key] ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition absolute top-0.75 ${
                        permissions[perm.key] ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Members & Admin Roles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Group Members ({members.length})</span>
              </div>
              <button
                onClick={() => alert('Add Member dialog: Select from contacts')}
                className="text-emerald-400 hover:text-emerald-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3 h-3" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl divide-y divide-slate-800/50 overflow-hidden">
              {/* You (Self) */}
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-[10px]">
                    YOU
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>You (Account Owner)</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                        Creator / Admin
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">Owner Privileges</div>
                  </div>
                </div>
              </div>

              {/* Other members */}
              {members
                .filter((id) => id !== 'SELF')
                .map((memberId) => {
                  const contact = DEMO_CONTACTS.find((c) => c.id === memberId) || {
                    id: memberId,
                    name: 'Team Member',
                    role: 'Operator',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    company: 'RZ Field Ops'
                  };
                  const isAdmin = admins.includes(memberId);

                  return (
                    <div
                      key={memberId}
                      className="p-2.5 flex items-center justify-between hover:bg-slate-900/50 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-7 h-7 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{contact.name}</span>
                            {isAdmin && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5" />
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {contact.role} &bull; {contact.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleAdmin(memberId)}
                          title={isAdmin ? 'Demote from Admin' : 'Promote to Admin'}
                          className={`p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition ${
                            isAdmin
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isAdmin ? 'Dismiss Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => removeMember(memberId)}
                          title="Remove from group"
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 cursor-pointer transition"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onUpdateConversation({ isMuted: !conversation.isMuted });
              onClose();
            }}
            className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {conversation.isMuted ? <Bell className="w-3.5 h-3.5 text-emerald-400" /> : <BellOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{conversation.isMuted ? 'Unmute Group' : 'Mute Notifications'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
