import React, { useState } from 'react';
import {
  Users,
  X,
  Camera,
  CheckCircle2,
  Building2,
  Pickaxe,
  Truck,
  Briefcase,
  ShoppingBag,
  Landmark,
  Megaphone,
  Plus,
  Search,
  ShieldCheck
} from 'lucide-react';
import { DEMO_CONTACTS, GroupCategory, ChatConversation } from '../../../data/rzChatData';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (newGroup: Partial<ChatConversation>) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onGroupCreated
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2>(1);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GroupCategory>('General');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([
    'USR-001',
    'USR-002'
  ]);
  const [searchMember, setSearchMember] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=150&auto=format&fit=crop&q=80'
  );

  const GROUP_CATEGORIES: { id: GroupCategory; label: string; icon: any; desc: string }[] = [
    { id: 'General', label: 'General Team', icon: Users, desc: 'Casual communication & team chat' },
    { id: 'Quarry', label: 'Quarry Pit', icon: Pickaxe, desc: 'Pit operations, blasting, bench load targets' },
    { id: 'Vehicle', label: 'Fleet & Logistics', icon: Truck, desc: 'Drivers, GPS telematics, haul dispatches' },
    { id: 'Job', label: 'Contract & Jobs', icon: Briefcase, desc: 'Work orders, subcontracts, RA billing' },
    { id: 'Order', label: 'Materials Order', icon: ShoppingBag, desc: 'Customer supply, delivery scheduling' },
    { id: 'Land', label: 'Quarry Land', icon: Landmark, desc: 'Land owners, leases, per-load royalties' },
    { id: 'Business', label: 'Company / B2B', icon: Building2, desc: 'Partner syndicates, corporate vendors' },
    { id: 'Announcement', label: 'Announcement Only', icon: Megaphone, desc: 'Admin broadcast only (members read only)' }
  ];

  const toggleMember = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup: Partial<ChatConversation> = {
      id: `CONV-GRP-${Date.now()}`,
      isGroup: true,
      name: groupName,
      avatar: avatarUrl,
      lastMessage: `Group created by You with ${selectedContactIds.length} members.`,
      lastMessageTimestamp: new Date().toISOString(),
      lastMessageTimeFormatted: 'Just now',
      lastMessageSender: 'You',
      lastMessageStatus: 'delivered',
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      isFavorite: false,
      groupCategory: category,
      groupDescription: description,
      groupMembersCount: selectedContactIds.length + 1,
      groupAdmins: ['SELF'],
      groupMembers: ['SELF', ...selectedContactIds],
      permissions: {
        sendMessages: category !== 'Announcement',
        sendMedia: category !== 'Announcement',
        sendFiles: category !== 'Announcement',
        addMembers: true,
        editGroupInfo: false,
        createTasks: true
      }
    };

    onGroupCreated(newGroup);
    onClose();
  };

  const filteredContacts = DEMO_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      c.role.toLowerCase().includes(searchMember.toLowerCase()) ||
      c.company.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  STEP {step} OF 2
                </span>
                <span className="text-[10px] text-slate-400">&bull; Group Creation Wizard</span>
              </div>
              <h3 className="text-sm font-black text-white">Create New Group Chat</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          /* Step 1: Info & Type */
          <div className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <img
                  src={avatarUrl}
                  alt="Group"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                />
                <div className="absolute inset-0 bg-slate-950/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Group Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hilltop Pit 01 Operations"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Description & Purpose</label>
              <textarea
                rows={2}
                placeholder="Brief purpose of this group for team members..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 resize-none text-xs"
              />
            </div>

            {/* Group Category */}
            <div>
              <label className="text-slate-300 font-semibold block mb-2">
                Select RZ Ecosystem Group Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GROUP_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSel = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                        isSel
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isSel
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">{cat.label}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {cat.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Step 1 */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                Configured with RZ Encrypted Messaging Engine
              </span>
              <button
                type="button"
                disabled={!groupName.trim()}
                onClick={() => setStep(2)}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  groupName.trim()
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Next: Select Members</span>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Select Members */
          <div className="flex-1 flex flex-col overflow-hidden text-xs">
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search contacts, contractors, drivers..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-2">
                {selectedContactIds.length} members selected for "{groupName}"
              </div>
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-800/40">
              {filteredContacts.map((contact) => {
                const isSelected = selectedContactIds.includes(contact.id);
                return (
                  <div
                    key={contact.id}
                    onClick={() => toggleMember(contact.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{contact.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            {contact.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {contact.role} &bull; {contact.company}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-700 bg-slate-950'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Step 2 */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Create Group Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
