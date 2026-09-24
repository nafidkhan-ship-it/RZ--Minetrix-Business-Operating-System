import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  Building2,
  FileText,
  Play,
  Pause,
  Download,
  Share2,
  Star,
  Trash2,
  Reply,
  Copy,
  ShieldCheck,
  Users,
  BellOff,
  Bell,
  Sparkles
} from 'lucide-react';
import {
  ChatConversation,
  ChatMessage,
  BusinessContextReference,
  ChatContact,
  DEMO_CONTACTS
} from '../../data/rzChatData';
import { RzMessageComposer } from './RzMessageComposer';

interface RzConversationViewProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
  onSendMessage: (payload: any) => void;
  onBackToList: () => void;
  onOpenCall: (type: 'audio' | 'video') => void;
  onOpenProfile: (contact: ChatContact) => void;
  onOpenGroupAdmin: () => void;
  onOpenOttModal: (message: ChatMessage) => void;
  onOpenForwardModal: (message: ChatMessage) => void;
  onOpenAttachBusiness: () => void;
  onToggleStarMessage: (msgId: string) => void;
  onDeleteMessage: (msgId: string) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const RzConversationView: React.FC<RzConversationViewProps> = ({
  conversation,
  messages,
  onSendMessage,
  onBackToList,
  onOpenCall,
  onOpenProfile,
  onOpenGroupAdmin,
  onOpenOttModal,
  onOpenForwardModal,
  onOpenAttachBusiness,
  onToggleStarMessage,
  onDeleteMessage,
  onNavigateSection
}) => {
  const [replyingMessage, setReplyingMessage] = useState<ChatMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleVoicePlay = (msgId: string) => {
    setPlayingVoiceId(playingVoiceId === msgId ? null : msgId);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleOpenBusinessRoute = (module: string) => {
    if (!onNavigateSection) return;
    switch (module) {
      case 'LAND':
        onNavigateSection('quarry-land-management');
        break;
      case 'QUARRY':
        onNavigateSection('quarry-management');
        break;
      case 'ORDER':
        onNavigateSection('building-materials-ecommerce');
        break;
      case 'VEHICLE':
        onNavigateSection('vehicle-management');
        break;
      case 'JOB':
        onNavigateSection('contract-job-management');
        break;
      case 'MARKETPLACE':
        onNavigateSection('used-machinery-marketplace');
        break;
      default:
        onNavigateSection('universal-dashboard');
    }
  };

  const filteredMessages = searchQuery
    ? messages.filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const currentContact = DEMO_CONTACTS.find((c) => c.name === conversation.name) || {
    id: conversation.id,
    name: conversation.name,
    avatar: conversation.avatar,
    phone: '+91 94471 20045',
    category: 'Customer' as const,
    role: 'Partner / Client',
    company: 'RZ Minetrix Partner',
    onlineStatus: conversation.onlineStatus || 'online',
    lastSeen: 'Active now',
    about: 'Verified communication partner in RZ Network.',
    email: 'contact@partner.com',
    location: 'Kerala, India',
    isVerified: true
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-xs overflow-hidden">
      {/* 1. Header */}
      <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {/* Back button (Mobile view) */}
          <button
            onClick={onBackToList}
            className="md:hidden p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* User / Group Avatar */}
          <div
            onClick={() => (conversation.isGroup ? onOpenGroupAdmin() : onOpenProfile(currentContact))}
            className="relative cursor-pointer group"
          >
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-2xl object-cover border border-slate-700 group-hover:border-emerald-500 transition shadow"
            />
            {!conversation.isGroup && conversation.onlineStatus === 'online' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            )}
          </div>

          {/* Title & Status */}
          <div
            onClick={() => (conversation.isGroup ? onOpenGroupAdmin() : onOpenProfile(currentContact))}
            className="cursor-pointer"
          >
            <div className="font-black text-white text-xs sm:text-sm flex items-center gap-1.5 hover:text-emerald-400 transition">
              <span>{conversation.name}</span>
              {conversation.isGroup ? (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-purple-300 font-mono">
                  {conversation.groupCategory}
                </span>
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              {conversation.isGroup ? (
                <span>{conversation.groupMembersCount || 18} members &bull; Tap for group info</span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active now &bull; End-to-End Encrypted
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Call, Video, Search, More */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Audio Call */}
          <button
            onClick={() => onOpenCall('audio')}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-emerald-400 transition cursor-pointer"
            title="Audio Call (Studio Preview)"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Video Call */}
          <button
            onClick={() => onOpenCall('video')}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-purple-400 transition cursor-pointer"
            title="Video Call (Studio Preview)"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Search in chat */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isSearchOpen
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            }`}
            title="Search in this conversation"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* More Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-11 z-30 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl w-48 animate-fadeIn text-xs">
                {conversation.isGroup ? (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenGroupAdmin();
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Group Admin & Info</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenProfile(currentContact);
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Contact Profile</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenOttModal(messages[messages.length - 1] || ({} as any));
                  }}
                  className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 text-amber-300 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Create OTT Task</span>
                </button>

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    alert('Notifications muted for this conversation');
                  }}
                  className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mute Notifications</span>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    alert('Exporting encrypted chat log...');
                  }}
                  className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-800 text-slate-400 flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Export Chat History</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Embedded In-Chat Search Bar */}
      {isSearchOpen && (
        <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 animate-fadeIn">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search keywords, quantities, prices in this chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-xs focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* 3. Business Context Banner (If linked to Quarry, Order, Vehicle, Land, Job, Marketplace) */}
      {conversation.businessContext && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs truncate">
                <span>{conversation.businessContext.title}</span>
                {conversation.businessContext.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    {conversation.businessContext.badge}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {conversation.businessContext.subtitle}
                {conversation.businessContext.amountRs && (
                  <strong className="text-emerald-400 ml-2 font-mono">
                    ₹{conversation.businessContext.amountRs.toLocaleString('en-IN')}
                  </strong>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenBusinessRoute(conversation.businessContext!.module)}
            className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-[11px] border border-cyan-500/30 flex items-center gap-1 shrink-0 transition cursor-pointer"
          >
            <span>{conversation.businessContext.actionLabel || 'Open Record'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 4. Message Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Date Divider */}
        <div className="flex items-center justify-center my-3">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono font-medium shadow-sm">
            Today &bull; 23 September 2026
          </span>
        </div>

        {filteredMessages.map((msg) => {
          const isSelf = msg.isSelf;
          return (
            <div
              key={msg.id}
              className={`flex flex-col group ${isSelf ? 'items-end' : 'items-start'}`}
            >
              {/* Sender Name in Group Chat */}
              {conversation.isGroup && !isSelf && (
                <span className="text-[10px] font-bold text-emerald-400 mb-1 ml-2">
                  {msg.senderName}
                </span>
              )}

              {/* Message Bubble Container */}
              <div className="relative max-w-[85%] sm:max-w-[70%]">
                <div
                  className={`p-3.5 rounded-3xl transition shadow-md ${
                    isSelf
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-xs'
                  }`}
                >
                  {/* Quoted Reply Snippet */}
                  {msg.replyTo && (
                    <div
                      className={`mb-2 p-2 rounded-2xl text-[11px] border-l-4 ${
                        isSelf
                          ? 'bg-emerald-700/60 border-emerald-300 text-emerald-100'
                          : 'bg-slate-950 border-emerald-500 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-[10px] opacity-80">
                        {msg.replyTo.senderName}
                      </div>
                      <div className="line-clamp-1 italic">{msg.replyTo.text}</div>
                    </div>
                  )}

                  {/* Image Attachment */}
                  {msg.messageType === 'image' && (
                    <div className="mb-2 rounded-2xl overflow-hidden cursor-pointer">
                      <img
                        src={
                          msg.mediaUrl ||
                          'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80'
                        }
                        alt="Shared image"
                        onClick={() =>
                          setPreviewImageUrl(
                            msg.mediaUrl ||
                              'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80'
                          )
                        }
                        className="max-h-60 w-full object-cover rounded-2xl hover:scale-102 transition"
                      />
                    </div>
                  )}

                  {/* Document Attachment */}
                  {msg.messageType === 'document' && (
                    <div
                      className={`mb-2 p-2.5 rounded-2xl flex items-center justify-between gap-3 ${
                        isSelf ? 'bg-emerald-700/60' : 'bg-slate-950 border border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-6 h-6 text-rose-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">
                            {msg.fileName || 'Document.pdf'}
                          </div>
                          <div className="text-[10px] opacity-75 font-mono">
                            {msg.fileSize || '1.8 MB'} &bull; Verified Document
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Downloading ${msg.fileName || 'file'}`)}
                        className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-white cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Voice Note Attachment */}
                  {msg.messageType === 'voice' && (
                    <div
                      className={`mb-2 p-2.5 rounded-2xl flex items-center gap-3 ${
                        isSelf ? 'bg-emerald-700/60' : 'bg-slate-950 border border-slate-800'
                      }`}
                    >
                      <button
                        onClick={() => toggleVoicePlay(msg.id)}
                        className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold shrink-0 cursor-pointer shadow"
                      >
                        {playingVoiceId === msg.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5 fill-current" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-1 h-5">
                          {(
                            msg.voiceWaveform || [
                              25, 40, 70, 90, 60, 30, 80, 100, 50, 40, 75, 85, 30
                            ]
                          ).map((val, idx) => (
                            <div
                              key={idx}
                              style={{ height: `${val}%` }}
                              className={`w-1 rounded-full transition-all ${
                                playingVoiceId === msg.id ? 'bg-cyan-400 animate-pulse' : 'bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono mt-1 opacity-80">
                          <span>0:00</span>
                          <span>{msg.voiceDurationSec || 28}s</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text Content */}
                  <p className="leading-relaxed whitespace-pre-wrap select-text text-xs">
                    {msg.text}
                  </p>

                  {/* Business Attachment reference */}
                  {msg.businessContext && (
                    <div
                      onClick={() => handleOpenBusinessRoute(msg.businessContext!.module)}
                      className="mt-2.5 p-2 rounded-2xl bg-slate-950/80 border border-cyan-500/40 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-900 transition"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-[9px] text-cyan-400 font-bold block">
                          LINKED: {msg.businessContext.recordId}
                        </span>
                        <div className="font-bold text-white text-[11px] truncate">
                          {msg.businessContext.title}
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    </div>
                  )}

                  {/* Timestamp & Status Checkmarks */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono ${
                      isSelf ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timeFormatted}</span>
                    {isSelf && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white/80" />
                        ) : msg.status === 'sent' ? (
                          <Check className="w-3.5 h-3.5 text-white/70" />
                        ) : (
                          <Clock className="w-3 h-3 text-white/50" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Action Bar */}
                <div
                  className={`absolute top-0 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-xl z-20 ${
                    isSelf ? 'right-full mr-2' : 'left-full ml-2'
                  }`}
                >
                  {/* Reply */}
                  <button
                    onClick={() => setReplyingMessage(msg)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                    title="Reply"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>

                  {/* Forward */}
                  <button
                    onClick={() => onOpenForwardModal(msg)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                    title="Forward"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Create OTT Task */}
                  <button
                    onClick={() => onOpenOttModal(msg)}
                    className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400"
                    title="Create RZ OTT Task"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>

                  {/* Star */}
                  <button
                    onClick={() => onToggleStarMessage(msg.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-amber-400"
                    title="Star Message"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>

                  {/* Copy */}
                  <button
                    onClick={() => handleCopy(msg.text)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                    title="Copy Text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteMessage(msg.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Message Composer Bar */}
      <RzMessageComposer
        onSendMessage={onSendMessage}
        replyToMessage={replyingMessage}
        onCancelReply={() => setReplyingMessage(null)}
        onOpenAttachBusiness={onOpenAttachBusiness}
      />

      {/* Full Image Preview Modal */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn cursor-pointer"
        >
          <img
            src={previewImageUrl}
            alt="Preview"
            className="max-h-[85vh] max-w-[90vw] rounded-3xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
