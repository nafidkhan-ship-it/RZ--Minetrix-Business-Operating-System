import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Video,
  Plus,
  Share2,
  ShieldCheck,
  Building2,
  Pickaxe,
  Truck,
  Briefcase,
  Megaphone,
  Radio,
  FileText,
  Image,
  Star,
  Archive,
  Bell,
  Settings,
  Flame,
  Filter,
  Pin,
  VolumeX,
  Volume2,
  Check,
  CheckCheck,
  MoreVertical,
  ArrowLeft,
  X
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import {
  ChatConversation,
  ChatMessage,
  ChatContact,
  BusinessContextReference,
  DEMO_CONVERSATIONS,
  DEMO_MESSAGES_BY_CONV,
  DEMO_CONTACTS
} from '../../data/rzChatData';

// Modals
import { CreateOttTaskFromChatModal } from '../chat/modals/CreateOttTaskFromChatModal';
import { ForwardMessageModal } from '../chat/modals/ForwardMessageModal';
import { CreateGroupModal } from '../chat/modals/CreateGroupModal';
import { GroupAdminDrawer } from '../chat/modals/GroupAdminDrawer';
import { UserProfileDrawer } from '../chat/modals/UserProfileDrawer';
import { RzCallModal } from '../chat/modals/RzCallModal';
import { BusinessContextAttachModal } from '../chat/modals/BusinessContextAttachModal';
import { RzChatSearchModal } from '../chat/RzChatSearchModal';

// Views
import { RzConversationView } from '../chat/RzConversationView';
import { RzStatusView } from '../chat/views/RzStatusView';
import { RzBroadcastView } from '../chat/views/RzBroadcastView';
import { RzReelsView } from '../chat/views/RzReelsView';
import { RzContactsView } from '../chat/views/RzContactsView';
import { RzMediaGalleryView } from '../chat/views/RzMediaGalleryView';
import { RzFilesView } from '../chat/views/RzFilesView';
import { RzStarredMessagesView } from '../chat/views/RzStarredMessagesView';
import { RzArchivedChatsView } from '../chat/views/RzArchivedChatsView';
import { RzBusinessChatsView } from '../chat/views/RzBusinessChatsView';
import { RzNotificationsView } from '../chat/views/RzNotificationsView';
import { RzSettingsView } from '../chat/views/RzSettingsView';

interface RzChatingPlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
}

export type ChatNavSection =
  | 'chats'
  | 'groups'
  | 'contacts'
  | 'status'
  | 'broadcast'
  | 'reels'
  | 'media'
  | 'files'
  | 'starred'
  | 'archived'
  | 'business'
  | 'notifications'
  | 'settings';

export const RzChatingPlatform: React.FC<RzChatingPlatformProps> = ({
  onNavigateSection
}) => {
  // Navigation & View State
  const [activeNav, setActiveNav] = useState<ChatNavSection>('chats');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups' | 'business'>('all');
  const [conversations, setConversations] = useState<ChatConversation[]>(DEMO_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('CONV-001');
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(DEMO_MESSAGES_BY_CONV);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Modals state
  const [isOttModalOpen, setIsOttModalOpen] = useState(false);
  const [selectedMessageForOtt, setSelectedMessageForOtt] = useState<ChatMessage | null>(null);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [selectedMessageForForward, setSelectedMessageForForward] = useState<ChatMessage | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isGroupAdminOpen, setIsGroupAdminOpen] = useState(false);
  const [selectedProfileContact, setSelectedProfileContact] = useState<ChatContact | null>(null);
  const [callModalConfig, setCallModalConfig] = useState<{
    isOpen: boolean;
    type: 'audio' | 'video';
  }>({ isOpen: false, type: 'audio' });
  const [isAttachBusinessOpen, setIsAttachBusinessOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = messagesMap[activeConvId] || [];

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (c.isArchived) return false;
    if (activeNav === 'groups' && !c.isGroup) return false;
    if (chatFilter === 'unread' && c.unreadCount === 0) return false;
    if (chatFilter === 'groups' && !c.isGroup) return false;
    if (chatFilter === 'business' && !c.businessContext) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q) ||
      (c.businessContext && c.businessContext.title.toLowerCase().includes(q))
    );
  });

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const recentConversations = filteredConversations.filter((c) => !c.isPinned);

  // Send message
  const handleSendMessage = (payload: {
    text: string;
    messageType?: 'text' | 'image' | 'document' | 'voice' | 'business_record';
    businessContext?: BusinessContextReference;
    replyTo?: { id: string; senderName: string; text: string };
    voiceDurationSec?: number;
    fileName?: string;
    fileSize?: string;
  }) => {
    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      conversationId: activeConvId,
      senderId: 'SELF',
      senderName: 'You',
      text: payload.text,
      timestamp: new Date().toISOString(),
      timeFormatted: 'Just now',
      isSelf: true,
      status: 'sending',
      messageType: payload.messageType || 'text',
      businessContext: payload.businessContext,
      replyTo: payload.replyTo,
      voiceDurationSec: payload.voiceDurationSec,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      mediaUrl:
        payload.messageType === 'image'
          ? 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80'
          : undefined
    };

    // Append to messages
    const currentMsgs = messagesMap[activeConvId] || [];
    setMessagesMap({
      ...messagesMap,
      [activeConvId]: [...currentMsgs, newMsg]
    });

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              lastMessage: payload.text,
              lastMessageTimeFormatted: 'Just now',
              lastMessageSender: 'You',
              lastMessageStatus: 'sending'
            }
          : c
      )
    );

    // Simulate sent -> delivered -> read in preview
    setTimeout(() => {
      setMessagesMap((prev) => ({
        ...prev,
        [activeConvId]: (prev[activeConvId] || []).map((m) =>
          m.id === newMsg.id ? { ...m, status: 'delivered' } : m
        )
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, lastMessageStatus: 'delivered' } : c
        )
      );
    }, 1200);

    setTimeout(() => {
      setMessagesMap((prev) => ({
        ...prev,
        [activeConvId]: (prev[activeConvId] || []).map((m) =>
          m.id === newMsg.id ? { ...m, status: 'read' } : m
        )
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, lastMessageStatus: 'read' } : c
        )
      );
    }, 2800);
  };

  // Attach business record to message
  const handleSelectBusinessRecord = (record: BusinessContextReference) => {
    handleSendMessage({
      text: `Attached Ecosystem Record: ${record.title} [${record.recordId}]`,
      messageType: 'business_record',
      businessContext: record
    });
    showToast(`Attached ${record.recordId} to conversation!`);
  };

  // Group created
  const handleGroupCreated = (newGroup: Partial<ChatConversation>) => {
    const fullGroup = newGroup as ChatConversation;
    setConversations([fullGroup, ...conversations]);
    setActiveConvId(fullGroup.id);
    setActiveNav('chats');
    setMessagesMap({
      ...messagesMap,
      [fullGroup.id]: [
        {
          id: `MSG-${Date.now()}`,
          conversationId: fullGroup.id,
          senderId: 'SYSTEM',
          senderName: 'System',
          text: `Group "${fullGroup.name}" created by You. Welcome to the workspace.`,
          timestamp: new Date().toISOString(),
          timeFormatted: 'Just now',
          isSelf: false,
          status: 'read',
          messageType: 'text'
        }
      ]
    });
    showToast(`Created group "${fullGroup.name}"!`);
  };

  // Update conversation
  const handleUpdateConversation = (updated: Partial<ChatConversation>) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, ...updated } : c))
    );
  };

  // Star / unstar message
  const handleToggleStar = (msgId: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: (prev[activeConvId] || []).map((m) =>
        m.id === msgId ? { ...m, isStarred: !m.isStarred } : m
      )
    }));
    showToast('Starred message updated');
  };

  // Delete message
  const handleDeleteMessage = (msgId: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: (prev[activeConvId] || []).filter((m) => m.id !== msgId)
    }));
    showToast('Message deleted');
  };

  // Start chat with contact from Contacts view
  const handleStartChatWithContact = (contact: ChatContact) => {
    const existing = conversations.find((c) => c.name === contact.name);
    if (existing) {
      setActiveConvId(existing.id);
    } else {
      const newConv: ChatConversation = {
        id: `CONV-DIR-${Date.now()}`,
        isGroup: false,
        name: contact.name,
        avatar: contact.avatar,
        lastMessage: 'Started new conversation',
        lastMessageTimestamp: new Date().toISOString(),
        lastMessageTimeFormatted: 'Just now',
        lastMessageSender: 'You',
        lastMessageStatus: 'delivered',
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        isFavorite: false,
        onlineStatus: contact.onlineStatus
      };
      setConversations([newConv, ...conversations]);
      setActiveConvId(newConv.id);
    }
    setActiveNav('chats');
    setIsMobileChatOpen(true);
  };

  const NAV_ITEMS: { id: ChatNavSection; label: string; icon: any; badge?: number }[] = [
    { id: 'chats', label: 'Chats', icon: MessageSquare, badge: 3 },
    { id: 'groups', label: 'Groups', icon: Users, badge: 1 },
    { id: 'contacts', label: 'Contacts', icon: ShieldCheck },
    { id: 'status', label: 'Status', icon: Sparkles },
    { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
    { id: 'reels', label: 'RZ Reels', icon: Flame },
    { id: 'business', label: 'Business Chats', icon: Building2 },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'archived', label: 'Archived', icon: Archive },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 2 },
    { id: 'settings', label: 'Chat Settings', icon: Settings }
  ];

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                PLATFORM 8 &bull; STANDALONE MESSAGING
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                End-to-End Encrypted
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h1 className="text-xl font-black text-white">RZ® Chat</h1>
          </div>
        </div>

        {/* Global Action Header Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Global Search */}
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search RZ Chat</span>
            <span className="font-mono text-[10px] text-slate-500 bg-slate-900 px-1 rounded">
              /
            </span>
          </button>

          {/* New Group */}
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>New Group</span>
          </button>

          {/* Create OTT Task direct */}
          <button
            onClick={() => {
              setSelectedMessageForOtt(activeMessages[activeMessages.length - 1] || null);
              setIsOttModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chat &rarr; OTT Task</span>
          </button>
        </div>
      </div>

      {/* Main Full-Height Workspace (Desktop 2/3 Panes + Mobile Back) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[740px] flex">
        {/* Micro-Nav Rail (Far Left) */}
        <div className="hidden lg:flex flex-col justify-between w-18 border-r border-slate-800 bg-slate-950/80 p-2 py-4 shrink-0">
          <div className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isSel = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setIsMobileChatOpen(false);
                  }}
                  className={`relative w-full p-2.5 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer group ${
                    isSel
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-semibold mt-1 truncate max-w-full">
                    {item.label}
                  </span>
                  {item.badge && !isSel && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User profile avatar thumbnail */}
          <div
            onClick={() => {
              setSelectedProfileContact(DEMO_CONTACTS[0]);
            }}
            className="p-1 cursor-pointer rounded-2xl hover:bg-slate-800 transition text-center"
            title="My Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Profile"
              className="w-9 h-9 rounded-xl mx-auto object-cover border border-emerald-500"
            />
          </div>
        </div>

        {/* Center / Chat List Pane (Visible when activeNav is 'chats' or 'groups') */}
        {(activeNav === 'chats' || activeNav === 'groups') && (
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-slate-800 bg-slate-950/50 flex flex-col shrink-0 ${
              isMobileChatOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search & Filter Header */}
            <div className="p-3 border-b border-slate-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search chats, groups, records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Chat filter chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {(['all', 'unread', 'groups', 'business'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setChatFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                      chatFilter === f
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              {/* Pinned Section */}
              {pinnedConversations.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-slate-950/80 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    <span>PINNED CONVERSATIONS</span>
                  </div>
                  {pinnedConversations.map((conv) => {
                    const isSel = conv.id === activeConvId;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          setActiveConvId(conv.id);
                          setIsMobileChatOpen(true);
                        }}
                        className={`p-3 transition cursor-pointer flex items-center gap-3 ${
                          isSel
                            ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500'
                            : 'hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={conv.avatar}
                            alt={conv.name}
                            className="w-11 h-11 rounded-2xl object-cover border border-slate-700"
                          />
                          {!conv.isGroup && conv.onlineStatus === 'online' && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs truncate">
                              {conv.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                              {conv.lastMessageTimeFormatted}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-1">
                            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                              {conv.lastMessageStatus === 'read' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-cyan-400 inline shrink-0" />
                              ) : conv.lastMessageStatus === 'delivered' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-slate-400 inline shrink-0" />
                              ) : null}
                              <span className="truncate">{conv.lastMessage}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              {conv.isMuted && <VolumeX className="w-3 h-3 text-slate-500" />}
                              <Pin className="w-3 h-3 text-emerald-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Recent Section */}
              <div>
                <div className="px-3 py-1.5 bg-slate-950/80 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                  ALL CHATS ({recentConversations.length})
                </div>

                {recentConversations.map((conv) => {
                  const isSel = conv.id === activeConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConvId(conv.id);
                        setIsMobileChatOpen(true);
                      }}
                      className={`p-3 transition cursor-pointer flex items-center gap-3 ${
                        isSel
                          ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-700"
                        />
                        {!conv.isGroup && conv.onlineStatus === 'online' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs truncate">
                            {conv.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                            {conv.lastMessageTimeFormatted}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                            {conv.lastMessageStatus === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-400 inline shrink-0" />
                            ) : conv.lastMessageStatus === 'delivered' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-slate-400 inline shrink-0" />
                            ) : null}
                            <span className="truncate">{conv.lastMessage}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            {conv.isMuted && <VolumeX className="w-3 h-3 text-slate-500" />}
                            {conv.unreadCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] font-mono">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right Pane (Dynamic based on activeNav) */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden ${
            isMobileChatOpen || activeNav !== 'chats' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeNav === 'chats' || activeNav === 'groups' ? (
            <RzConversationView
              conversation={activeConversation}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
              onBackToList={() => setIsMobileChatOpen(false)}
              onOpenCall={(type) => setCallModalConfig({ isOpen: true, type })}
              onOpenProfile={(contact) => setSelectedProfileContact(contact)}
              onOpenGroupAdmin={() => setIsGroupAdminOpen(true)}
              onOpenOttModal={(msg) => {
                setSelectedMessageForOtt(msg);
                setIsOttModalOpen(true);
              }}
              onOpenForwardModal={(msg) => {
                setSelectedMessageForForward(msg);
                setIsForwardModalOpen(true);
              }}
              onOpenAttachBusiness={() => setIsAttachBusinessOpen(true)}
              onToggleStarMessage={handleToggleStar}
              onDeleteMessage={handleDeleteMessage}
              onNavigateSection={onNavigateSection}
            />
          ) : activeNav === 'contacts' ? (
            <RzContactsView
              onStartChat={handleStartChatWithContact}
              onViewProfile={(c) => setSelectedProfileContact(c)}
            />
          ) : activeNav === 'status' ? (
            <RzStatusView />
          ) : activeNav === 'broadcast' ? (
            <RzBroadcastView />
          ) : activeNav === 'reels' ? (
            <RzReelsView />
          ) : activeNav === 'business' ? (
            <RzBusinessChatsView
              onOpenConversation={(convId) => {
                setActiveConvId(convId);
                setActiveNav('chats');
                setIsMobileChatOpen(true);
              }}
              onOpenOttModal={(conv) => {
                setSelectedMessageForOtt({
                  id: `MSG-CTX-${Date.now()}`,
                  conversationId: conv.id,
                  senderId: 'SYSTEM',
                  senderName: conv.name,
                  text: conv.lastMessage,
                  timestamp: new Date().toISOString(),
                  timeFormatted: 'Just now',
                  isSelf: false,
                  status: 'delivered',
                  messageType: 'text',
                  businessContext: conv.businessContext
                });
                setIsOttModalOpen(true);
              }}
              onNavigateSection={onNavigateSection}
            />
          ) : activeNav === 'media' ? (
            <RzMediaGalleryView />
          ) : activeNav === 'files' ? (
            <RzFilesView />
          ) : activeNav === 'starred' ? (
            <RzStarredMessagesView
              onOpenConversation={(convId) => {
                setActiveConvId(convId);
                setActiveNav('chats');
                setIsMobileChatOpen(true);
              }}
            />
          ) : activeNav === 'archived' ? (
            <RzArchivedChatsView
              archivedConversations={conversations.filter((c) => c.isArchived)}
              onUnarchive={(convId) => {
                setConversations((prev) =>
                  prev.map((c) => (c.id === convId ? { ...c, isArchived: false } : c))
                );
                showToast('Conversation unarchived');
              }}
              onOpenConversation={(convId) => {
                setActiveConvId(convId);
                setActiveNav('chats');
                setIsMobileChatOpen(true);
              }}
            />
          ) : activeNav === 'notifications' ? (
            <RzNotificationsView
              onOpenConversation={(convId) => {
                setActiveConvId(convId);
                setActiveNav('chats');
                setIsMobileChatOpen(true);
              }}
              onNavigateSection={onNavigateSection}
            />
          ) : (
            <RzSettingsView />
          )}
        </div>
      </div>

      {/* ALL MODALS */}
      {/* 1. Create OTT Task From Chat */}
      <CreateOttTaskFromChatModal
        isOpen={isOttModalOpen}
        onClose={() => setIsOttModalOpen(false)}
        message={selectedMessageForOtt}
        conversation={activeConversation}
        onNavigateSection={onNavigateSection}
      />

      {/* 2. Forward Message */}
      <ForwardMessageModal
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        message={selectedMessageForForward}
        conversations={conversations}
        onForwardConfirm={(targetConvId) => {
          if (!selectedMessageForForward) return;
          const fwdMsg: ChatMessage = {
            id: `MSG-FWD-${Date.now()}`,
            conversationId: targetConvId,
            senderId: 'SELF',
            senderName: 'You',
            text: `Forwarded: ${selectedMessageForForward.text}`,
            timestamp: new Date().toISOString(),
            timeFormatted: 'Just now',
            isSelf: true,
            status: 'sent',
            messageType: selectedMessageForForward.messageType
          };
          setMessagesMap((prev) => ({
            ...prev,
            [targetConvId]: [...(prev[targetConvId] || []), fwdMsg]
          }));
          showToast('Message forwarded successfully!');
        }}
      />

      {/* 3. Create Group */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      {/* 4. Group Admin Drawer */}
      <GroupAdminDrawer
        isOpen={isGroupAdminOpen}
        onClose={() => setIsGroupAdminOpen(false)}
        conversation={activeConversation}
        onUpdateConversation={handleUpdateConversation}
      />

      {/* 5. User Profile Drawer */}
      {selectedProfileContact && (
        <UserProfileDrawer
          isOpen={Boolean(selectedProfileContact)}
          onClose={() => setSelectedProfileContact(null)}
          contact={selectedProfileContact}
          onStartCall={(type) => setCallModalConfig({ isOpen: true, type })}
        />
      )}

      {/* 6. Realistic Call Screen */}
      <RzCallModal
        isOpen={callModalConfig.isOpen}
        onClose={() => setCallModalConfig({ isOpen: false, type: 'audio' })}
        conversation={activeConversation}
        callType={callModalConfig.type}
      />

      {/* 7. Attach Business Context Record */}
      <BusinessContextAttachModal
        isOpen={isAttachBusinessOpen}
        onClose={() => setIsAttachBusinessOpen(false)}
        onSelectRecord={handleSelectBusinessRecord}
      />

      {/* 8. Global Chat Search */}
      <RzChatSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectConversation={(convId) => {
          setActiveConvId(convId);
          setActiveNav('chats');
          setIsMobileChatOpen(true);
        }}
      />
    </div>
  );
};
