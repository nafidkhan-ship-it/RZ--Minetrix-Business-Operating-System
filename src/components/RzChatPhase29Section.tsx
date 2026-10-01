import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  User,
  Settings,
  UserPlus,
  ShieldAlert,
  Bell,
  CheckCheck,
  Check,
  Clock,
  MoreVertical,
  Paperclip,
  Mic,
  Image,
  Video,
  FileText,
  MapPin,
  X,
  PhoneCall,
  VideoIcon,
  Lock,
  Flag,
  UserX,
  Sparkles,
  Database,
  Layers,
  ArrowLeft,
  Eye,
  EyeOff,
  Activity,
  Users,
  Radio,
  Download,
  AlertCircle,
  RefreshCw,
  Plus,
  Pin,
  VolumeX,
  Volume2,
  Smile,
  Share2,
  Trash2,
  Copy,
  CheckSquare,
  Square,
  UserCheck,
  UserMinus,
  ClipboardList,
  ChevronDown,
  Reply,
  Info,
  CornerDownRight,
  Play,
  Pause,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Music,
  MicOff,
  Camera,
  RotateCcw,
  Folder,
  FileCode,
  Building2,
  Store,
  BadgeCheck
} from 'lucide-react';

import {
  ChatUser,
  Conversation,
  Message,
  PrivacySettings,
  ReportReason,
  ReportedEntityType,
  NotificationRecord,
  ConversationMember,
  MediaAttachment,
  MEDIA_LIMITS,
  BusinessProfile
} from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

import { PublicUserProfileModal } from './PublicUserProfileModal';
import { BusinessProfileModal } from './BusinessProfileModal';
import { RegisterBusinessModal } from './RegisterBusinessModal';
import { EditProfileAndPrivacyModal } from './EditProfileAndPrivacyModal';
import { PeopleDirectoryView } from './PeopleDirectoryView';
import { BusinessDiscoveryView } from './BusinessDiscoveryView';
import { CreateEnquiryModal } from './CreateEnquiryModal';
import { EnquiryDetailPanel } from './EnquiryDetailPanel';
import { BusinessErpLinkingModal } from './BusinessErpLinkingModal';
import { ErpCustomerMatchModal } from './ErpCustomerMatchModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { PrivacySecurityCenterModal } from './PrivacySecurityCenterModal';
import { ReportModal } from './ReportModal';
import { AdminModerationModal } from './AdminModerationModal';

export const RzChatPhase29Section: React.FC = () => {
  // Current logged in user & active tab
  const [currentUser, setCurrentUser] = useState<ChatUser>(rzChatService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'chat' | 'people' | 'businesses' | 'architecture' | 'notifications'>('chat');

  // Phase 34 Modals State
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isPrivacySecurityCenterOpen, setIsPrivacySecurityCenterOpen] = useState<boolean>(false);
  const [isAdminModerationOpen, setIsAdminModerationOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportTarget, setReportTarget] = useState<{
    entityType: ReportedEntityType;
    entityId: string;
    userId: string;
    conversationId?: string;
    messageId?: string;
  } | null>(null);

  // Phase 32 Public Profile & Business Modals State
  const [viewingPublicUser, setViewingPublicUser] = useState<ChatUser | null>(null);
  const [isPublicUserModalOpen, setIsPublicUserModalOpen] = useState<boolean>(false);
  const [viewingBusiness, setViewingBusiness] = useState<BusinessProfile | null>(null);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState<boolean>(false);
  const [isRegisterBusinessModalOpen, setIsRegisterBusinessModalOpen] = useState<boolean>(false);
  const [isEditProfilePrivacyModalOpen, setIsEditProfilePrivacyModalOpen] = useState<boolean>(false);

  // Phase 33 Customer Enquiry & Business ERP Linking State
  const [isCreateEnquiryModalOpen, setIsCreateEnquiryModalOpen] = useState<boolean>(false);
  const [isEnquiryDetailPanelOpen, setIsEnquiryDetailPanelOpen] = useState<boolean>(false);
  const [isBusinessErpModalOpen, setIsBusinessErpModalOpen] = useState<boolean>(false);
  const [isCustomerMatchModalOpen, setIsCustomerMatchModalOpen] = useState<boolean>(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>('ENQ-1001');
  const [targetBusinessIdForErp, setTargetBusinessIdForErp] = useState<string>('BUS-101');

  // Chat Filter Tab: All, Direct, Groups
  const [chatFilterTab, setChatFilterTab] = useState<'all' | 'direct' | 'groups'>('all');

  // Conversations & Active Conversation
  const [conversations, setConversations] = useState<
    (Conversation & { otherUser?: ChatUser; unreadCount: number; isPinned?: boolean; isMuted?: boolean })[]
  >([]);
  const [activeConvId, setActiveConvId] = useState<string | null>('CONV-101');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [replyToMsg, setReplyToMsg] = useState<Message | null>(null);

  // Search & Filter
  const [chatSearch, setChatSearch] = useState<string>('');

  // Typing state
  const [typingUsers, setTypingUsers] = useState<ChatUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Modals & Panels State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState<boolean>(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState<boolean>(false);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState<boolean>(false);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState<boolean>(false);
  const [msgToForward, setMsgToForward] = useState<Message | null>(null);
  const [isBlockReportModalOpen, setIsBlockReportModalOpen] = useState<boolean>(false);
  const [targetUserForBlockReport, setTargetUserForBlockReport] = useState<ChatUser | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>('spam');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [viewingProfileUser, setViewingProfileUser] = useState<ChatUser | null>(null);

  // Group Creation Form State
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupDesc, setNewGroupDesc] = useState<string>('');
  const [newGroupAvatar, setNewGroupAvatar] = useState<string>('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80');
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<string[]>([]);

  // Add Member to Existing Group State
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);

  // New Chat Search State
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);

  // Multi-Message Selection Mode
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);

  // Edit Profile Form State
  const [editDisplayName, setEditDisplayName] = useState<string>('');
  const [editUsername, setEditUsername] = useState<string>('');
  const [editAbout, setEditAbout] = useState<string>('');
  const [editPhoto, setEditPhoto] = useState<string>('');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    lastSeen: 'everyone',
    profilePhoto: 'everyone',
    about: 'everyone'
  });
  const [profileError, setProfileError] = useState<string | null>(null);

  // Attachment & Emoji Popover State
  const [isAttachOpen, setIsAttachOpen] = useState<boolean>(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);

  // --- PHASE 31 MEDIA SHARING & VOICE MESSAGES STATE ---
  // File Upload & Preview Modal State
  const [isMediaPreviewModalOpen, setIsMediaPreviewModalOpen] = useState<boolean>(false);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState<File | null>(null);
  const [pendingMediaType, setPendingMediaType] = useState<'image' | 'video' | 'document' | 'audio' | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileUploadCaption, setFileUploadCaption] = useState<string>('');
  const [uploadProgressPct, setUploadProgressPct] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Voice Note Recorder State
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceRecordingTimerSec, setVoiceRecordingTimerSec] = useState<number>(0);
  const [recordedVoiceBlob, setRecordedVoiceBlob] = useState<Blob | null>(null);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [recordedVoiceDuration, setRecordedVoiceDuration] = useState<number>(0);
  const [isVoicePreviewing, setIsVoicePreviewing] = useState<boolean>(false);

  // Lightbox Media Viewer State
  const [lightboxMedia, setLightboxMedia] = useState<MediaAttachment | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);

  // Drag & Drop State
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Shared Media Gallery Filter State
  const [activeMediaGalleryTab, setActiveMediaGalleryTab] = useState<'photos' | 'videos' | 'docs' | 'audio' | 'voice'>('photos');

  // Input File Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Voice Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const voiceAudioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Connection & Toast State
  const [connectionState, setConnectionState] = useState<'connected' | 'reconnecting' | 'failed'>('connected');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Responsive Mobile Back State
  const [isMobileChatOpen, setIsMobileChatOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Initial Load & Real-Time Listeners
  useEffect(() => {
    loadConversations();

    const unsubscribeConvs = rzChatService.subscribeToConversations(currentUser.id, () => {
      loadConversations();
    });

    return () => {
      unsubscribeConvs();
    };
  }, [currentUser.id]);

  useEffect(() => {
    if (!activeConvId) return;

    loadMessagesForActiveConv();
    rzChatService.markConversationAsRead(activeConvId, currentUser.id);

    const unsubscribeMsgs = rzChatService.subscribeToMessages(activeConvId, () => {
      loadMessagesForActiveConv();
      rzChatService.markConversationAsRead(activeConvId, currentUser.id);
    });

    const unsubscribeTyping = rzChatService.subscribeToTyping(activeConvId, () => {
      const typers = rzChatService.getTypingUsersForConversation(activeConvId, currentUser.id);
      setTypingUsers(typers);
    });

    return () => {
      unsubscribeMsgs();
      unsubscribeTyping();
    };
  }, [activeConvId, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = () => {
    const list = rzChatService.getConversationsForUser(currentUser?.id || 'USR-1001');
    setConversations(list);
    if (list.length > 0 && !activeConvId) {
      setActiveConvId(list[0]?.id || null);
    }
  };

  const loadMessagesForActiveConv = () => {
    if (!activeConvId) return;
    const msgs = rzChatService.getMessagesForConversation(activeConvId);
    setMessages(msgs);
  };

  // Handle Switch User Persona (for testing direct & group chat between users)
  const handleSwitchUser = (userId: string) => {
    rzChatService.setCurrentUserId(userId);
    const newCurr = rzChatService.getCurrentUser();
    if (newCurr) {
      setCurrentUser(newCurr);
      setActiveConvId(null);
      setSelectedMessageIds([]);
      setIsMultiSelectMode(false);
      showToast(`Switched active session persona to [${newCurr.displayName}]`);
    }
  };

  // Input Change with Typing Indicator Emission
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (activeConvId) {
      rzChatService.setTypingState(currentUser.id, activeConvId, true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        if (activeConvId) {
          rzChatService.setTypingState(currentUser.id, activeConvId, false);
        }
      }, 2500);
    }
  };

  // Send Message Handler
  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConvId) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    rzChatService.setTypingState(currentUser.id, activeConvId, false);

    const res = rzChatService.sendMessage(
      currentUser.id,
      activeConvId,
      inputText,
      replyToMsg ? replyToMsg.id : undefined
    );

    if (res.success) {
      setInputText('');
      setReplyToMsg(null);
      setIsEmojiOpen(false);
      setIsAttachOpen(false);
      loadMessagesForActiveConv();
      loadConversations();
    } else {
      showToast(`Send Failed: ${res.error}`);
    }
  };

  // Pin & Mute Conversation
  const handleTogglePin = (convId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const pinned = rzChatService.togglePinConversation(currentUser.id, convId);
    loadConversations();
    showToast(pinned ? 'Conversation pinned to top.' : 'Conversation unpinned.');
  };

  const handleToggleMute = (convId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const muted = rzChatService.toggleMuteConversation(currentUser.id, convId);
    loadConversations();
    showToast(muted ? 'Muted conversation notifications.' : 'Unmuted conversation.');
  };

  const handleClearChat = (convId: string) => {
    rzChatService.clearChatForUser(currentUser.id, convId);
    loadMessagesForActiveConv();
    showToast('Chat history cleared for your view.');
  };

  // Delete Message (For Me / For Everyone)
  const handleDeleteMessage = (msgId: string, deleteForEveryone: boolean) => {
    const res = rzChatService.deleteMessage(currentUser.id, msgId, deleteForEveryone);
    if (res.success) {
      loadMessagesForActiveConv();
      loadConversations();
      showToast(deleteForEveryone ? 'Message deleted for everyone.' : 'Message deleted for you.');
    } else {
      showToast(`Delete failed: ${res.error}`);
    }
  };

  // Forward Message
  const handleOpenForwardModal = (msg: Message) => {
    setMsgToForward(msg);
    setIsForwardModalOpen(true);
  };

  const handleConfirmForward = (targetConvId: string) => {
    if (!msgToForward) return;
    const res = rzChatService.forwardMessage(currentUser.id, targetConvId, msgToForward.id);
    if (res.success) {
      setIsForwardModalOpen(false);
      setMsgToForward(null);
      showToast('Message forwarded successfully.');
      loadConversations();
      if (targetConvId === activeConvId) loadMessagesForActiveConv();
    } else {
      showToast(`Forward failed: ${res.error}`);
    }
  };

  // Multi-select Message Controls
  const handleToggleSelectMessage = (msgId: string) => {
    if (selectedMessageIds.includes(msgId)) {
      const updated = selectedMessageIds.filter(id => id !== msgId);
      setSelectedMessageIds(updated);
      if (updated.length === 0) setIsMultiSelectMode(false);
    } else {
      setSelectedMessageIds([...selectedMessageIds, msgId]);
      setIsMultiSelectMode(true);
    }
  };

  const handleBulkCopy = () => {
    const selectedMsgs = messages.filter(m => selectedMessageIds.includes(m.id));
    const combinedText = selectedMsgs.map(m => m.text).join('\n');
    navigator.clipboard.writeText(combinedText);
    showToast(`Copied ${selectedMsgs.length} messages to clipboard.`);
    setSelectedMessageIds([]);
    setIsMultiSelectMode(false);
  };

  const handleBulkDelete = () => {
    selectedMessageIds.forEach(id => {
      rzChatService.deleteMessage(currentUser.id, id, false);
    });
    loadMessagesForActiveConv();
    showToast(`Deleted ${selectedMessageIds.length} messages.`);
    setSelectedMessageIds([]);
    setIsMultiSelectMode(false);
  };

  // Create Group Handler
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      showToast('Please enter a group name.');
      return;
    }
    const res = rzChatService.createGroup(
      currentUser.id,
      newGroupName,
      newGroupDesc,
      selectedGroupMemberIds,
      newGroupAvatar
    );

    if (res.success && res.conversation) {
      setIsCreateGroupModalOpen(false);
      setNewGroupName('');
      setNewGroupDesc('');
      setSelectedGroupMemberIds([]);
      setActiveConvId(res.conversation.id);
      setIsMobileChatOpen(true);
      showToast(`Group "${res.conversation.name}" created successfully.`);
    } else {
      showToast(`Failed to create group: ${res.error}`);
    }
  };

  // Group Admin Handlers
  const handleAddGroupMember = (targetUserId: string) => {
    if (!activeConvId) return;
    const res = rzChatService.addGroupMember(currentUser.id, activeConvId, targetUserId);
    if (res.success) {
      setIsAddMemberModalOpen(false);
      loadConversations();
      loadMessagesForActiveConv();
      showToast('Member added to group.');
    } else {
      showToast(`Add member failed: ${res.error}`);
    }
  };

  const handleRemoveGroupMember = (targetUserId: string) => {
    if (!activeConvId) return;
    const res = rzChatService.removeGroupMember(currentUser.id, activeConvId, targetUserId);
    if (res.success) {
      loadConversations();
      loadMessagesForActiveConv();
      showToast('Member removed from group.');
    } else {
      showToast(`Remove member failed: ${res.error}`);
    }
  };

  const handleUpdateMemberRole = (targetUserId: string, newRole: 'admin' | 'member') => {
    if (!activeConvId) return;
    const res = rzChatService.updateMemberRole(currentUser.id, activeConvId, targetUserId, newRole);
    if (res.success) {
      loadConversations();
      showToast(`Member role updated to ${newRole}.`);
    } else {
      showToast(`Role update failed: ${res.error}`);
    }
  };

  const handleLeaveGroup = () => {
    if (!activeConvId) return;
    const res = rzChatService.removeGroupMember(currentUser.id, activeConvId, currentUser.id);
    if (res.success) {
      setIsGroupInfoOpen(false);
      setActiveConvId(null);
      loadConversations();
      showToast('You left the group.');
    } else {
      showToast(`Leave group failed: ${res.error}`);
    }
  };

  // User Search Handler for New Chat Modal
  const handleSearchUsers = (q: string) => {
    setUserSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const results = rzChatService.searchUsers(q);
    setSearchResults(results);
  };

  // Start Direct Chat with Searched User
  const handleStartChatWithUser = (targetUser: ChatUser) => {
    const res = rzChatService.startDirectConversation(currentUser.id, targetUser.id);
    if (res.success && res.conversation) {
      setIsNewChatModalOpen(false);
      setUserSearchQuery('');
      setSearchResults([]);
      setActiveConvId(res.conversation.id);
      setIsMobileChatOpen(true);
      showToast(`Direct Chat initiated with @${targetUser.username}`);
    } else {
      showToast(`Cannot start chat: ${res.error}`);
    }
  };

  // Profile Edit Modal Open
  const handleOpenProfileModal = () => {
    setEditDisplayName(currentUser.displayName);
    setEditUsername(currentUser.username);
    setEditAbout(currentUser.about);
    setEditPhoto(currentUser.profilePhoto);
    setPrivacySettings({ ...currentUser.privacySettings });
    setProfileError(null);
    setIsProfileModalOpen(true);
  };

  // Save Profile Edit
  const handleSaveProfile = () => {
    setProfileError(null);
    const updateRes = rzChatService.updateUserProfile(currentUser.id, {
      displayName: editDisplayName,
      username: editUsername,
      about: editAbout,
      profilePhoto: editPhoto
    });

    if (!updateRes.success) {
      setProfileError(updateRes.error || 'Failed to update profile.');
      return;
    }

    rzChatService.updatePrivacySettings(currentUser.id, privacySettings);
    setCurrentUser(rzChatService.getCurrentUser());
    setIsProfileModalOpen(false);
    showToast('Profile and Privacy settings updated successfully!');
  };

  // Block & Report Handlers
  const handleOpenBlockReportModal = (user: ChatUser) => {
    setReportTarget({
      entityType: 'user',
      entityId: user.id,
      userId: user.id,
      conversationId: activeConvId || undefined
    });
    setIsReportModalOpen(true);
  };

  const handleConfirmBlock = () => {
    if (!targetUserForBlockReport) return;
    rzChatService.blockUser(currentUser.id, targetUserForBlockReport.id);
    setIsBlockReportModalOpen(false);
    showToast(`Blocked user @${targetUserForBlockReport.username}.`);
    loadConversations();
  };

  const handleConfirmReport = () => {
    if (!targetUserForBlockReport) return;
    rzChatService.reportUserOrMessage(
      currentUser.id,
      targetUserForBlockReport.id,
      reportReason,
      reportDescription,
      activeConvId || undefined
    );
    setIsBlockReportModalOpen(false);
    showToast(`Report filed for @${targetUserForBlockReport.username}. Incident ref logged.`);
  };

  // --- PHASE 31 MEDIA & FILE HANDLERS ---
  const handleTriggerFileInput = (type: 'photo' | 'video' | 'doc' | 'audio' | 'camera') => {
    setIsAttachOpen(false);
    if (type === 'photo') photoInputRef.current?.click();
    else if (type === 'video') videoInputRef.current?.click();
    else if (type === 'doc') docInputRef.current?.click();
    else if (type === 'audio') audioInputRef.current?.click();
    else if (type === 'camera') cameraInputRef.current?.click();
  };

  const handleFileSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetMediaType: 'image' | 'video' | 'document' | 'audio'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size & MIME type
    const val = rzChatService.validateMediaFile(file, targetMediaType);
    if (!val.valid) {
      showToast(`Upload Error: ${val.error}`);
      e.target.value = '';
      return;
    }

    setSelectedFileForUpload(file);
    setPendingMediaType(targetMediaType);
    setFilePreviewUrl(URL.createObjectURL(file));
    setFileUploadCaption('');
    setUploadProgressPct(0);
    setUploadError(null);
    setIsMediaPreviewModalOpen(true);
    e.target.value = '';
  };

  const handleConfirmSendMedia = async () => {
    if (!selectedFileForUpload || !pendingMediaType || !activeConvId) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadRes = await rzChatService.uploadMediaAttachment(
        currentUser.id,
        activeConvId,
        selectedFileForUpload,
        pendingMediaType,
        selectedFileForUpload.name,
        undefined,
        pct => setUploadProgressPct(pct)
      );

      if (!uploadRes.success || !uploadRes.attachment) {
        setUploadError(uploadRes.error || 'Failed to complete media upload.');
        setIsUploading(false);
        return;
      }

      const sendRes = rzChatService.sendMessageWithAttachment(
        currentUser.id,
        activeConvId,
        fileUploadCaption,
        uploadRes.attachment,
        replyToMsg ? replyToMsg.id : undefined
      );

      if (sendRes.success) {
        setIsMediaPreviewModalOpen(false);
        setSelectedFileForUpload(null);
        setPendingMediaType(null);
        setFilePreviewUrl(null);
        setFileUploadCaption('');
        setReplyToMsg(null);
        loadMessagesForActiveConv();
        loadConversations();
        showToast(`Sent ${uploadRes.attachment.mediaType} attachment.`);
      } else {
        setUploadError(sendRes.error || 'Failed to post attachment message.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Error occurred during media transfer.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelMediaUpload = () => {
    setIsMediaPreviewModalOpen(false);
    setSelectedFileForUpload(null);
    setPendingMediaType(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setFileUploadCaption('');
    setUploadError(null);
  };

  // --- VOICE NOTE RECORDING HANDLERS ---
  const handleStartVoiceRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordedVoiceBlob(null);
      setRecordedVoiceUrl(null);
      setRecordedVoiceDuration(0);
      setVoiceRecordingTimerSec(0);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = e => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          const url = URL.createObjectURL(blob);
          setRecordedVoiceBlob(blob);
          setRecordedVoiceUrl(url);
          stream.getTracks().forEach(t => t.stop());
        };

        recorder.start();
        setIsRecordingVoice(true);

        voiceTimerIntervalRef.current = setInterval(() => {
          setVoiceRecordingTimerSec(prev => {
            setRecordedVoiceDuration(prev + 1);
            return prev + 1;
          });
        }, 1000);

        showToast('Voice recording started. Speak now...');
      } else {
        setIsRecordingVoice(true);
        voiceTimerIntervalRef.current = setInterval(() => {
          setVoiceRecordingTimerSec(prev => {
            setRecordedVoiceDuration(prev + 1);
            return prev + 1;
          });
        }, 1000);
        showToast('Simulated voice recorder active.');
      }
    } catch (err: any) {
      showToast('Microphone permission required for voice notes.');
      setIsRecordingVoice(false);
    }
  };

  const handleStopVoiceRecording = () => {
    if (voiceTimerIntervalRef.current) {
      clearInterval(voiceTimerIntervalRef.current);
      voiceTimerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else if (!recordedVoiceBlob) {
      const fallbackBlob = new Blob(['Simulated voice recording buffer'], { type: 'audio/mp3' });
      setRecordedVoiceBlob(fallbackBlob);
      setRecordedVoiceUrl('https://actions.google.com/sounds/v1/ambiences/outdoor_environment.ogg');
    }

    setIsRecordingVoice(false);
  };

  const handleCancelVoiceRecording = () => {
    if (voiceTimerIntervalRef.current) {
      clearInterval(voiceTimerIntervalRef.current);
      voiceTimerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingVoice(false);
    setRecordedVoiceBlob(null);
    if (recordedVoiceUrl) URL.revokeObjectURL(recordedVoiceUrl);
    setRecordedVoiceUrl(null);
    setVoiceRecordingTimerSec(0);
    showToast('Voice note discarded.');
  };

  const handleSendVoiceNote = async () => {
    if (!activeConvId) return;

    let blobToSend = recordedVoiceBlob;
    let dur = recordedVoiceDuration || voiceRecordingTimerSec || 5;

    if (!blobToSend) {
      blobToSend = new Blob(['Simulated voice recording buffer'], { type: 'audio/mp3' });
    }

    const uploadRes = await rzChatService.uploadMediaAttachment(
      currentUser.id,
      activeConvId,
      blobToSend,
      'voice',
      `Voice_Note_${Date.now()}.mp3`,
      dur
    );

    if (uploadRes.success && uploadRes.attachment) {
      if (recordedVoiceUrl) {
        uploadRes.attachment.downloadUrl = recordedVoiceUrl;
      }
      rzChatService.sendMessageWithAttachment(
        currentUser.id,
        activeConvId,
        `Voice note (${dur}s)`,
        uploadRes.attachment,
        replyToMsg ? replyToMsg.id : undefined
      );

      setRecordedVoiceBlob(null);
      setRecordedVoiceUrl(null);
      setRecordedVoiceDuration(0);
      setVoiceRecordingTimerSec(0);
      setReplyToMsg(null);
      loadMessagesForActiveConv();
      loadConversations();
      showToast('Voice note sent!');
    }
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    let type: 'image' | 'video' | 'document' | 'audio' = 'document';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';

    const val = rzChatService.validateMediaFile(file, type);
    if (!val.valid) {
      showToast(`Dropped File Error: ${val.error}`);
      return;
    }

    setSelectedFileForUpload(file);
    setPendingMediaType(type);
    setFilePreviewUrl(URL.createObjectURL(file));
    setFileUploadCaption('');
    setUploadProgressPct(0);
    setUploadError(null);
    setIsMediaPreviewModalOpen(true);
  };

  // --- LIGHTBOX HANDLERS ---
  const handleOpenLightbox = (media: MediaAttachment) => {
    setLightboxMedia(media);
    setLightboxZoom(1);
  };

  const handleCloseLightbox = () => {
    setLightboxMedia(null);
    setLightboxZoom(1);
  };

  // Phase 32 Handlers for starting chat with public user or business
  const handleStartChatWithPublicUser = (targetUserId: string) => {
    const res = rzChatService.startChatWithUser(currentUser.id, targetUserId);
    if (res.success && res.conversationId) {
      setActiveConvId(res.conversationId);
      setActiveTab('chat');
      loadConversations();
      showToast('Opened conversation window.');
    } else {
      showToast(res.error || 'Could not start chat with user.');
    }
  };

  const handleStartChatWithBusinessProfile = (businessId: string) => {
    try {
      const res = rzChatService.startChatWithBusiness(currentUser.id, businessId);
      if (res.conversationId) {
        setActiveConvId(res.conversationId);
        setActiveTab('chat');
        loadConversations();
        showToast('Connected with business inbox.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error connecting with business.');
    }
  };

  // Active Conversation Info
  const activeConvObj = conversations.find(c => c.id === activeConvId);
  const activeOtherUser = activeConvObj?.otherUser;
  const isGroupChat = activeConvObj?.type === 'group';
  const groupMembers = activeConvId ? rzChatService.getGroupMembers(activeConvId) : [];

  // Filter Conversations for Sidebar Search & Tabs
  const filteredConversations = conversations.filter(c => {
    if (chatFilterTab === 'direct' && c.type !== 'direct') return false;
    if (chatFilterTab === 'groups' && c.type !== 'group') return false;

    if (!chatSearch.trim()) return true;
    const name = c.otherUser?.displayName || c.name || '';
    const un = c.otherUser?.username || '';
    const lastM = c.lastMessage || '';
    const q = chatSearch.toLowerCase();
    return name.toLowerCase().includes(q) || un.toLowerCase().includes(q) || lastM.toLowerCase().includes(q);
  });

  // Group Messages By Date
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { [dateStr: string]: Message[] } = {};
    msgs.forEach(m => {
      const d = new Date(m.createdAt);
      const dateStr = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(m);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 border border-amber-400 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Pillar 8 &bull; Digital Platforms
              </span>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" /> Enterprise Real-Time Communication &bull; OTT Task Creator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono mt-1">
              8. RZ® Chat
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl font-mono">
              Personal &amp; Business chat, Buyer &harr; Seller, Owner &harr; Contractor, Quarry &amp; Crusher groups, file sharing, voice messages, voice/video calls, and 1-click <strong>CREATE OTT TASK</strong> integration.
            </p>
          </div>

          {/* ACTIVE PERSONA SWITCHER */}
          <div className="flex flex-col items-end gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Simulate Active Chat Session As:</span>
            <select
              value={currentUser.id}
              onChange={e => handleSwitchUser(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {rzChatService.getAllUsers().map(u => (
                <option key={u.id} value={u.id}>
                  {u.displayName} (@{u.username})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CONNECTION & SYSTEM HEALTH STRIP */}
        <div className="flex flex-wrap justify-between items-center gap-3 mt-6 pt-4 border-t border-slate-800/80 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${connectionState === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-300 font-bold">
              Real-Time Engine: {connectionState === 'connected' ? 'WebSocket / Pub-Sub Active' : 'Reconnecting...'}
            </span>
            <button
              onClick={() => {
                setConnectionState('reconnecting');
                setTimeout(() => {
                  setConnectionState('connected');
                  showToast('Real-time messaging sockets re-synchronized.');
                }, 800);
              }}
              className="px-2 py-0.5 bg-slate-900 text-amber-400 border border-slate-800 rounded hover:bg-slate-800 cursor-pointer text-[10px]"
            >
              <RefreshCw className="w-3 h-3 inline mr-1" /> Reconnect
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Conversations: <strong className="text-emerald-400 font-bold">{conversations.length} Active</strong></span>
            <span>Unread Alerts: <strong className="text-amber-400 font-bold">{rzChatService.getNotificationsForUser(currentUser.id).filter(n => !n.isRead).length}</strong></span>
          </div>
        </div>
      </div>

      {/* MODULE NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 font-mono">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Chats
        </button>

        <button
          onClick={() => setActiveTab('people')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer ${
            activeTab === 'people'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> People &amp; Directory
        </button>

        <button
          onClick={() => setActiveTab('businesses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer ${
            activeTab === 'businesses'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Businesses Discovery
        </button>

        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer bg-slate-900 text-slate-300 hover:text-white border border-slate-800 relative"
          title="Open Notification Center"
        >
          <Bell className="w-4 h-4 text-amber-400" /> Notifications
          {rzChatService.getNotificationsForUser(currentUser.id).filter(n => !n.isRead).length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {rzChatService.getNotificationsForUser(currentUser.id).filter(n => !n.isRead).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsPrivacySecurityCenterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          title="Open Privacy & Security Center"
        >
          <Lock className="w-4 h-4 text-emerald-400" /> Privacy &amp; Security
        </button>

        {currentUser.accountCategory === 'admin' && (
          <button
            onClick={() => setIsAdminModerationOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
            title="Open Admin Moderation Portal"
          >
            <ShieldAlert className="w-4 h-4" /> Admin Moderation
          </button>
        )}

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4" /> Architecture
        </button>
      </div>

      {/* TAB 1: LIVE CHAT MESSENGER */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden h-[720px] flex flex-col md:flex-row">
          {/* SIDEBAR: CONVERSATION LIST */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-slate-800 bg-slate-950 flex flex-col justify-between ${
              isMobileChatOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* SIDEBAR HEADER */}
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                {/* LOGGED IN USER AVATAR & INFO */}
                <div
                  onClick={handleOpenProfileModal}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                  title="Click to View/Edit Profile"
                >
                  <div className="relative">
                    <img
                      src={currentUser.profilePhoto}
                      alt={currentUser.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                    />
                    <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 absolute bottom-0 right-0" />
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-white font-bold text-xs block truncate max-w-[130px]">
                      {currentUser.displayName}
                    </strong>
                    <span className="text-amber-400 text-[10px] block font-mono">@{currentUser.username}</span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsNewChatModalOpen(true);
                      setUserSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="p-2 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 cursor-pointer font-bold transition"
                    title="Start Direct Chat"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsCreateGroupModalOpen(true);
                      setNewGroupName('');
                      setNewGroupDesc('');
                      setSelectedGroupMemberIds([]);
                    }}
                    className="p-2 bg-slate-900 text-amber-400 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer transition"
                    title="Create Group Chat"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleOpenProfileModal}
                    className="p-2 bg-slate-900 text-slate-300 border border-slate-800 rounded-xl hover:text-white cursor-pointer transition"
                    title="Profile Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SEARCH CONVERSATIONS */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search chats, groups, messages..."
                  value={chatSearch}
                  onChange={e => setChatSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* CHAT CATEGORY FILTER PILLS */}
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  onClick={() => setChatFilterTab('all')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition ${
                    chatFilterTab === 'all'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  All ({conversations.length})
                </button>
                <button
                  onClick={() => setChatFilterTab('direct')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition ${
                    chatFilterTab === 'direct'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  Direct ({conversations.filter(c => c.type === 'direct').length})
                </button>
                <button
                  onClick={() => setChatFilterTab('groups')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition ${
                    chatFilterTab === 'groups'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  Groups ({conversations.filter(c => c.type === 'group').length})
                </button>
              </div>
            </div>

            {/* CONVERSATION ITEMS SCROLL */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-700" />
                  <p className="font-mono text-xs">No conversations match criteria.</p>
                  <button
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Start Chat
                  </button>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isActive = conv.id === activeConvId;
                  const displayUser = conv.otherUser;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConvId(conv.id);
                        setIsMobileChatOpen(true);
                      }}
                      className={`p-3 rounded-2xl cursor-pointer transition flex items-center gap-3 relative group ${
                        isActive
                          ? 'bg-amber-500/10 border border-amber-500/40'
                          : 'hover:bg-slate-900/80 border border-transparent'
                      }`}
                    >
                      {/* AVATAR */}
                      <div className="relative shrink-0">
                        <img
                          src={
                            conv.type === 'group'
                              ? conv.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
                              : displayUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={conv.type === 'group' ? conv.name : displayUser?.displayName || 'User'}
                          className="w-11 h-11 rounded-full object-cover border border-slate-800"
                        />
                        {conv.type === 'direct' && displayUser?.onlineStatus === 'online' && (
                          <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 absolute bottom-0 right-0" />
                        )}
                        {conv.type === 'group' && (
                          <span className="w-4 h-4 bg-amber-500 text-slate-950 rounded-full border border-slate-950 absolute bottom-0 right-0 flex items-center justify-center font-bold text-[8px]">
                            GRP
                          </span>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-white font-bold text-xs truncate flex items-center gap-1.5">
                            {conv.type === 'group' ? conv.name : displayUser?.displayName}
                            {conv.isPinned && <Pin className="w-3 h-3 text-amber-400 rotate-45 inline" />}
                            {conv.isMuted && <VolumeX className="w-3 h-3 text-slate-500 inline" />}
                          </strong>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {conv.lastMessageTimestamp
                              ? new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : ''}
                          </span>
                        </div>

                        <p className="text-slate-400 text-[11px] truncate">{conv.lastMessage || 'No messages yet'}</p>
                      </div>

                      {/* UNREAD BADGE & PIN/MUTE ACTIONS */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {conv.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full shadow">
                            {conv.unreadCount}
                          </span>
                        )}

                        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                          <button
                            onClick={e => handleTogglePin(conv.id, e)}
                            className="p-1 text-slate-400 hover:text-amber-400"
                            title={conv.isPinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={e => handleToggleMute(conv.id, e)}
                            className="p-1 text-slate-400 hover:text-amber-400"
                            title={conv.isMuted ? 'Unmute' : 'Mute'}
                          >
                            {conv.isMuted ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* SIDEBAR FOOTER */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 text-slate-500 text-[10px] font-mono flex justify-between items-center">
              <span>RZ Chat Engine Phase 30</span>
              <span className="text-emerald-400 font-bold">● Multi-Tenant Connected</span>
            </div>
          </div>

          {/* MAIN CHAT AREA */}
          <div
            className={`flex-1 bg-slate-900 flex flex-col justify-between ${
              !isMobileChatOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConvObj ? (
              <>
                {/* CHAT HEADER */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsMobileChatOpen(false)}
                      className="md:hidden p-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div
                      onClick={() => {
                        if (isGroupChat) {
                          setIsGroupInfoOpen(true);
                        } else if (activeOtherUser) {
                          setViewingProfileUser(activeOtherUser);
                        }
                      }}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                    >
                      <img
                        src={
                          isGroupChat
                            ? activeConvObj.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
                            : activeOtherUser?.privacySettings.profilePhoto === 'nobody'
                            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                            : activeOtherUser?.profilePhoto
                        }
                        alt={isGroupChat ? activeConvObj.name : activeOtherUser?.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                      />
                      <div>
                        <strong className="text-white font-bold text-xs block truncate max-w-xs">
                          {isGroupChat ? activeConvObj.name : activeOtherUser?.displayName}
                        </strong>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {typingUsers.length > 0 ? (
                            <span className="text-amber-400 font-bold animate-pulse">
                              {typingUsers.map(u => u.displayName).join(', ')} is typing...
                            </span>
                          ) : isGroupChat ? (
                            `${groupMembers.length} Members • Group Chat`
                          ) : activeOtherUser?.privacySettings.lastSeen === 'nobody' ? (
                            'Last seen hidden'
                          ) : activeOtherUser?.onlineStatus === 'online' ? (
                            'Online'
                          ) : (
                            `Last seen ${new Date(activeOtherUser?.lastSeen || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* OPTIONS MENU */}
                  <div className="flex items-center gap-2 font-mono">
                    {/* PHASE 33: ENQUIRY & ERP INTEGRATION ACTION BUTTONS */}
                    {activeConvObj && (
                      <>
                        <button
                          onClick={() => setIsCreateEnquiryModalOpen(true)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border border-amber-500 rounded-xl cursor-pointer text-[10px] flex items-center gap-1 transition"
                          title="Create Customer Enquiry for this Chat"
                        >
                          <FileText className="w-3.5 h-3.5" /> Create Enquiry
                        </button>

                        {(() => {
                          const convEnq = rzChatService.getEnquiryForConversation(activeConvObj.id);
                          if (convEnq) {
                            return (
                              <button
                                onClick={() => {
                                  setSelectedEnquiryId(convEnq.id);
                                  setIsEnquiryDetailPanelOpen(!isEnquiryDetailPanelOpen);
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold font-mono border flex items-center gap-1 cursor-pointer transition ${
                                  isEnquiryDetailPanelOpen
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : 'bg-slate-900 text-amber-400 border-slate-800 hover:border-amber-500/30'
                                }`}
                              >
                                <ClipboardList className="w-3.5 h-3.5" /> #{convEnq.enquiryCode}
                              </button>
                            );
                          }
                          return null;
                        })()}

                        {(activeOtherUser?.businessId || currentUser.businessId) && (
                          <button
                            onClick={() => {
                              const bizId = activeOtherUser?.businessId || currentUser.businessId || 'BUS-101';
                              setTargetBusinessIdForErp(bizId);
                              setIsBusinessErpModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 bg-slate-900 text-slate-300 border border-slate-800 rounded-xl hover:text-white cursor-pointer text-[10px] flex items-center gap-1"
                            title="Manage ERP Organization Integration"
                          >
                            <Building2 className="w-3.5 h-3.5 text-amber-400" /> ERP Link
                          </button>
                        )}
                      </>
                    )}

                    {isGroupChat ? (
                      <button
                        onClick={() => setIsGroupInfoOpen(true)}
                        className="px-2.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 cursor-pointer text-[10px] font-bold flex items-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" /> Group Info ({groupMembers.length})
                      </button>
                    ) : (
                      activeOtherUser && (
                        <>
                          <button
                            onClick={() => setViewingProfileUser(activeOtherUser)}
                            className="px-2.5 py-1.5 bg-slate-900 text-slate-300 border border-slate-800 rounded-xl hover:text-white cursor-pointer text-[10px] flex items-center gap-1"
                          >
                            <User className="w-3.5 h-3.5" /> View Profile
                          </button>
                          <button
                            onClick={() => handleOpenBlockReportModal(activeOtherUser)}
                            className="px-2.5 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 cursor-pointer text-[10px] flex items-center gap-1"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" /> Block / Report
                          </button>
                        </>
                      )
                    )}

                    <button
                      onClick={() => handleClearChat(activeConvObj.id)}
                      className="px-2 py-1.5 bg-slate-900 text-slate-400 border border-slate-800 rounded-xl hover:text-rose-400 cursor-pointer text-[10px]"
                      title="Clear Chat History"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* MULTI-SELECT MESSAGES TOOLBAR */}
                {isMultiSelectMode && (
                  <div className="px-4 py-2 bg-amber-500 text-slate-950 font-mono font-bold flex justify-between items-center text-xs">
                    <span>{selectedMessageIds.length} Messages Selected</span>
                    <div className="flex items-center gap-2">
                      <button onClick={handleBulkCopy} className="px-2 py-1 bg-slate-950 text-white rounded-lg flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      <button onClick={handleBulkDelete} className="px-2 py-1 bg-rose-950 text-rose-200 rounded-lg flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMessageIds([]);
                          setIsMultiSelectMode(false);
                        }}
                        className="px-2 py-1 bg-slate-900 text-slate-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* MESSAGES SCROLL AREA WITH DATE SEPARATORS & DRAG-AND-DROP ZONE */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] relative"
                >
                  {/* DRAG AND DROP OVERLAY */}
                  {isDraggingOver && (
                    <div className="absolute inset-0 z-40 bg-amber-500/20 backdrop-blur-sm border-2 border-dashed border-amber-400 rounded-2xl flex flex-col items-center justify-center text-amber-400 font-mono p-6 animate-pulse">
                      <Paperclip className="w-12 h-12 mb-2 animate-bounce" />
                      <strong className="text-base font-bold uppercase">Drop Media Files Here</strong>
                      <p className="text-xs text-amber-300">Supported: Photos, Videos, Documents, Audio up to 500 MB</p>
                    </div>
                  )}
                  {messages.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 space-y-2 font-mono">
                      <Lock className="w-8 h-8 mx-auto text-amber-500/50" />
                      <p className="text-xs">
                        No messages yet. Send a message to start conversation in {isGroupChat ? activeConvObj.name : `@${activeOtherUser?.username}`}.
                      </p>
                    </div>
                  ) : (
                    Object.keys(groupedMessages).map(dateStr => (
                      <div key={dateStr} className="space-y-3">
                        {/* DATE CHIP */}
                        <div className="flex justify-center my-2">
                          <span className="px-3 py-1 bg-slate-950/80 border border-slate-800 text-slate-400 font-mono text-[9px] rounded-full uppercase tracking-wider">
                            {dateStr}
                          </span>
                        </div>

                        {groupedMessages[dateStr].map(msg => {
                          const isOutgoing = msg.senderId === currentUser.id;
                          const msgStatus = rzChatService.getMessageStatus(msg.id, activeOtherUser?.id);
                          const senderUser = rzChatService.getUserById(msg.senderId);
                          const isSelected = selectedMessageIds.includes(msg.id);

                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} space-y-1 group relative`}
                            >
                              <div className="flex items-center gap-2 max-w-md">
                                {isMultiSelectMode && (
                                  <button
                                    onClick={() => handleToggleSelectMessage(msg.id)}
                                    className="text-amber-400 hover:scale-110 transition cursor-pointer"
                                  >
                                    {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                                  </button>
                                )}

                                <div
                                  className={`p-3.5 rounded-2xl space-y-1 shadow-lg relative ${
                                    isSelected
                                      ? 'ring-2 ring-amber-400'
                                      : isOutgoing
                                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                                      : 'bg-slate-950 text-slate-100 border border-slate-800 rounded-tl-none'
                                  }`}
                                >
                                  {/* SENDER NAME IN GROUP */}
                                  {isGroupChat && !isOutgoing && (
                                    <span className="text-[10px] font-bold text-amber-400 block font-mono">
                                      {senderUser?.displayName || 'Group Member'}
                                    </span>
                                  )}

                                  {/* FORWARDED INDICATOR */}
                                  {msg.isForwarded && (
                                    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono italic">
                                      <CornerDownRight className="w-3 h-3 text-amber-400" /> Forwarded message
                                    </div>
                                  )}

                                  {/* REPLY PREVIEW IF PRESENT */}
                                  {msg.replyToMessageId && (
                                    <div
                                      className={`p-2 rounded-lg text-[10px] border-l-2 mb-1 ${
                                        isOutgoing
                                          ? 'bg-amber-600/30 border-slate-950 text-slate-900'
                                          : 'bg-slate-900 border-amber-500 text-amber-400'
                                      }`}
                                    >
                                      Replying to previous message...
                                    </div>
                                  )}

                                  {/* MEDIA ATTACHMENTS (PHASE 31) */}
                                  {msg.attachment ? (
                                    <div className="space-y-1.5 my-1">
                                      {/* IMAGE ATTACHMENT */}
                                      {msg.attachment.mediaType === 'image' && (
                                        <div className="relative group/media overflow-hidden rounded-xl border border-slate-800 bg-slate-900 max-w-xs">
                                          <img
                                            src={msg.attachment.downloadUrl || msg.mediaUrl}
                                            alt={msg.attachment.fileName}
                                            className="w-full h-auto max-h-60 object-cover cursor-pointer hover:scale-105 transition duration-300"
                                            onClick={() => handleOpenLightbox(msg.attachment!)}
                                          />
                                          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur text-[9px] font-mono text-slate-300 rounded flex items-center gap-1">
                                            <Maximize2 className="w-3 h-3" /> {msg.attachment.fileSizeFormatted}
                                          </div>
                                        </div>
                                      )}

                                      {/* VIDEO ATTACHMENT */}
                                      {msg.attachment.mediaType === 'video' && (
                                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-1.5 max-w-xs space-y-1">
                                          <video
                                            src={msg.attachment.downloadUrl || msg.mediaUrl}
                                            controls
                                            className="w-full rounded-lg max-h-52 bg-black"
                                          />
                                          <div className="flex justify-between items-center px-1 text-[9px] font-mono text-slate-400">
                                            <span className="truncate max-w-[150px]">{msg.attachment.fileName}</span>
                                            <span>{msg.attachment.fileSizeFormatted}</span>
                                          </div>
                                        </div>
                                      )}

                                      {/* DOCUMENT ATTACHMENT */}
                                      {msg.attachment.mediaType === 'document' && (
                                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl max-w-xs space-y-2">
                                          <div className="flex items-center gap-2.5">
                                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                                              <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="overflow-hidden font-mono">
                                              <span className="text-xs font-bold text-white block truncate">
                                                {msg.attachment.fileName}
                                              </span>
                                              <span className="text-[10px] text-slate-400 block">
                                                {msg.attachment.fileSizeFormatted} • {msg.attachment.mimeType.split('/')[1]?.toUpperCase() || 'DOC'}
                                              </span>
                                            </div>
                                          </div>
                                          <a
                                            href={msg.attachment.downloadUrl}
                                            download={msg.attachment.fileName}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-[10px] font-bold font-mono flex items-center justify-center gap-1 transition"
                                          >
                                            <Download className="w-3.5 h-3.5" /> Download / Open Document
                                          </a>
                                        </div>
                                      )}

                                      {/* VOICE OR AUDIO ATTACHMENT */}
                                      {(msg.attachment.mediaType === 'voice' || msg.attachment.mediaType === 'audio') && (
                                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl max-w-xs space-y-2">
                                          <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-full shrink-0">
                                              <Mic className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 space-y-1 font-mono">
                                              <div className="flex justify-between items-center text-[10px]">
                                                <span className="font-bold text-amber-400">
                                                  {msg.attachment.mediaType === 'voice' ? '🎙️ Voice Note' : '🎵 Audio Recording'}
                                                </span>
                                                <span className="text-slate-400">
                                                  {msg.attachment.duration ? `${msg.attachment.duration}s` : msg.attachment.fileSizeFormatted}
                                                </span>
                                              </div>
                                              {/* ANIMATED WAVEFORM VISUALIZER */}
                                              <div className="flex items-end gap-1 h-4 pt-1">
                                                {[30, 75, 45, 90, 60, 100, 40, 85, 50, 70, 35, 95, 60, 40].map((h, i) => (
                                                  <div
                                                    key={i}
                                                    className="flex-1 bg-amber-400/60 rounded-full"
                                                    style={{ height: `${h}%` }}
                                                  />
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                          <audio
                                            src={msg.attachment.downloadUrl}
                                            controls
                                            className="w-full h-8 rounded max-w-full"
                                          />
                                        </div>
                                      )}

                                      {/* OPTIONAL CAPTION TEXT */}
                                      {msg.text && (
                                        <p
                                          className={`text-xs leading-relaxed whitespace-pre-wrap ${
                                            msg.deletedAt ? 'italic text-slate-400' : ''
                                          }`}
                                        >
                                          {msg.text}
                                        </p>
                                      )}
                                    </div>
                                  ) : msg.mediaUrl && msg.messageType !== 'text' ? (
                                    /* LEGACY OR SEED MEDIA MSG FALLBACK */
                                    <div className="space-y-1.5 my-1">
                                      {msg.messageType === 'image' && (
                                        <img
                                          src={msg.mediaUrl}
                                          alt={msg.fileName || 'Image'}
                                          className="w-full h-auto max-h-60 object-cover rounded-xl border border-slate-800 cursor-pointer max-w-xs"
                                          onClick={() =>
                                            handleOpenLightbox({
                                              id: `ATT-${msg.id}`,
                                              conversationId: msg.conversationId,
                                              uploadedBy: msg.senderId,
                                              mediaType: 'image',
                                              fileName: msg.fileName || 'Image',
                                              mimeType: 'image/jpeg',
                                              fileSize: 1024000,
                                              fileSizeFormatted: msg.fileSize || '1.0 MB',
                                              storagePath: `chat-media/conversations/${msg.conversationId}/messages/${msg.id}/image/${msg.fileName || 'img'}`,
                                              downloadUrl: msg.mediaUrl!,
                                              createdAt: msg.createdAt
                                            })
                                          }
                                        />
                                      )}
                                      {msg.messageType === 'video' && (
                                        <video src={msg.mediaUrl} controls className="max-w-xs rounded-xl border border-slate-800 bg-black" />
                                      )}
                                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                  ) : (
                                    /* STANDARD TEXT MSG */
                                    <p
                                      className={`text-xs leading-relaxed whitespace-pre-wrap ${
                                        msg.deletedAt ? 'italic text-slate-400' : ''
                                      }`}
                                    >
                                      {msg.text}
                                    </p>
                                  )}

                                  <div
                                    className={`flex justify-end items-center gap-1.5 text-[9px] font-mono pt-1 ${
                                      isOutgoing ? 'text-slate-900/80' : 'text-slate-500'
                                    }`}
                                  >
                                    <span>
                                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    {/* DELIVERY / READ TICKS */}
                                    {isOutgoing && !msg.deletedAt && (
                                      <span>
                                        {msgStatus === 'read' ? (
                                          <CheckCheck className="w-3.5 h-3.5 text-blue-900 font-black inline" title="Read" />
                                        ) : msgStatus === 'delivered' ? (
                                          <CheckCheck className="w-3.5 h-3.5 text-slate-800 inline" title="Delivered" />
                                        ) : (
                                          <Check className="w-3.5 h-3.5 text-slate-800 inline" title="Sent" />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* QUICK MESSAGE ACTION MENU ON HOVER */}
                                {!msg.deletedAt && (
                                  <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono">
                                    <button
                                      onClick={() => setReplyToMsg(msg)}
                                      className="p-1 text-slate-400 hover:text-amber-400"
                                      title="Reply"
                                    >
                                      <Reply className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(msg.text);
                                        showToast('Message copied to clipboard.');
                                      }}
                                      className="p-1 text-slate-400 hover:text-amber-400"
                                      title="Copy"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleOpenForwardModal(msg)}
                                      className="p-1 text-slate-400 hover:text-amber-400"
                                      title="Forward"
                                    >
                                      <Share2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMessage(msg.id, isOutgoing)}
                                      className="p-1 text-slate-400 hover:text-rose-400"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* REPLY BANNER IF SET */}
                {replyToMsg && (
                  <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Reply className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-amber-400 font-bold">Replying to:</span>
                      <span className="text-slate-300 truncate max-w-md">{replyToMsg.text}</span>
                    </div>
                    <button onClick={() => setReplyToMsg(null)} className="text-slate-500 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* EMOJI PICKER POPOVER */}
                {isEmojiOpen && (
                  <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2 font-mono">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                      <span>Quick Emojis &amp; Dispatch Icons</span>
                      <button onClick={() => setIsEmojiOpen(false)} className="hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 text-lg">
                      {['😀', '😊', '😂', '👍', '❤️', '🔥', '🎉', '🙏', '💡', '🚛', '🏗️', '⛏️', '📦', '📊', '🏭', '⚡', '🚚', '✅', '⚠️'].map(
                        e => (
                          <button
                            key={e}
                            onClick={() => {
                              setInputText(prev => prev + e);
                              setIsEmojiOpen(false);
                            }}
                            className="p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition"
                          >
                            {e}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* ATTACHMENT POPOVER (PHASE 31) */}
                {isAttachOpen && (
                  <div className="p-3 bg-slate-950 border-t border-slate-800 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] font-mono animate-fade-in">
                    <button
                      onClick={() => handleTriggerFileInput('photo')}
                      className="p-2.5 bg-slate-900 hover:bg-amber-500/10 hover:border-amber-500/50 text-amber-400 rounded-xl border border-slate-800 cursor-pointer transition flex flex-col items-center"
                    >
                      <Image className="w-5 h-5 mb-1" /> Photos
                    </button>
                    <button
                      onClick={() => handleTriggerFileInput('video')}
                      className="p-2.5 bg-slate-900 hover:bg-indigo-500/10 hover:border-indigo-500/50 text-indigo-400 rounded-xl border border-slate-800 cursor-pointer transition flex flex-col items-center"
                    >
                      <Video className="w-5 h-5 mb-1" /> Video
                    </button>
                    <button
                      onClick={() => handleTriggerFileInput('doc')}
                      className="p-2.5 bg-slate-900 hover:bg-emerald-500/10 hover:border-emerald-500/50 text-emerald-400 rounded-xl border border-slate-800 cursor-pointer transition flex flex-col items-center"
                    >
                      <FileText className="w-5 h-5 mb-1" /> Document
                    </button>
                    <button
                      onClick={() => handleTriggerFileInput('audio')}
                      className="p-2.5 bg-slate-900 hover:bg-purple-500/10 hover:border-purple-500/50 text-purple-400 rounded-xl border border-slate-800 cursor-pointer transition flex flex-col items-center"
                    >
                      <Music className="w-5 h-5 mb-1" /> Audio
                    </button>
                    <button
                      onClick={() => handleTriggerFileInput('camera')}
                      className="p-2.5 bg-slate-900 hover:bg-sky-500/10 hover:border-sky-500/50 text-sky-400 rounded-xl border border-slate-800 cursor-pointer transition flex flex-col items-center"
                    >
                      <Camera className="w-5 h-5 mb-1" /> Camera
                    </button>
                    <button
                      onClick={() => {
                        setIsAttachOpen(false);
                        handleStartVoiceRecording();
                      }}
                      className="p-2.5 bg-slate-900 hover:bg-rose-500/10 hover:border-rose-500/50 text-rose-400 rounded-xl border border-slate-800 cursor-pointer transition flex flex-col items-center"
                    >
                      <Mic className="w-5 h-5 mb-1" /> Voice Note
                    </button>
                  </div>
                )}

                {/* HIDDEN REAL FILE INPUTS */}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFileSelected(e, 'image')}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={e => handleFileSelected(e, 'video')}
                />
                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  className="hidden"
                  onChange={e => handleFileSelected(e, 'document')}
                />
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={e => handleFileSelected(e, 'audio')}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => handleFileSelected(e, 'image')}
                />

                {/* CHAT INPUT / VOICE RECORDING COMPOSER BAR */}
                <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                  {isRecordingVoice ? (
                    /* VOICE RECORDING BAR IN PROGRESS */
                    <div className="flex-1 flex items-center justify-between bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2 text-xs font-mono animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                        <span className="text-rose-400 font-bold">
                          Recording Voice Note... ({String(Math.floor(voiceRecordingTimerSec / 60)).padStart(2, '0')}:
                          {String(voiceRecordingTimerSec % 60).padStart(2, '0')})
                        </span>
                        {/* WAVEFORM ANIMATION */}
                        <div className="hidden sm:flex items-end gap-1 h-3">
                          {[40, 80, 50, 90, 30, 70, 100, 60, 40].map((h, i) => (
                            <div key={i} className="w-1 bg-rose-400 rounded-full animate-bounce" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCancelVoiceRecording}
                          className="px-3 py-1 bg-slate-900 text-slate-300 hover:text-white rounded-lg border border-slate-800 cursor-pointer text-[10px]"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleStopVoiceRecording}
                          className="px-3 py-1 bg-rose-500 text-white font-bold rounded-lg cursor-pointer hover:bg-rose-600 text-[10px]"
                        >
                          Stop &amp; Review
                        </button>
                      </div>
                    </div>
                  ) : recordedVoiceUrl ? (
                    /* RECORDED VOICE NOTE PREVIEW BAR BEFORE SENDING */
                    <div className="flex-1 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <Mic className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 font-bold">
                          Voice Note Ready ({recordedVoiceDuration || 5}s)
                        </span>
                        <audio src={recordedVoiceUrl} controls className="h-7 w-48" />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setRecordedVoiceUrl(null);
                            setRecordedVoiceBlob(null);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                          title="Delete Voice Note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleSendVoiceNote}
                          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg cursor-pointer hover:bg-amber-400 flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" /> Send Voice
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* STANDARD INPUT COMPOSER */
                    <>
                      <button
                        onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                        className="p-2.5 text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer transition"
                        title="Emoji Picker"
                      >
                        <Smile className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsAttachOpen(!isAttachOpen)}
                        className="p-2.5 text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer transition"
                        title="Attachments & Media"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        placeholder="Type a message or drag & drop files here..."
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                        className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />

                      <button
                        onClick={handleStartVoiceRecording}
                        className="p-2.5 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer transition"
                        title="Hold/Click to record Voice Note"
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold cursor-pointer hover:bg-amber-400 transition flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="m-auto text-center py-20 text-slate-500 space-y-3 font-mono">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-800" />
                <h3 className="text-white font-bold text-sm">Select or Start a Conversation</h3>
                <p className="text-xs max-w-sm mx-auto">
                  Choose a direct user or group from the left panel, or click the + button to initiate a new chat.
                </p>
              </div>
            )}

            {/* PHASE 33 ENQUIRY & ERP PANEL DRAWER */}
            {isEnquiryDetailPanelOpen && selectedEnquiryId && (
              <EnquiryDetailPanel
                enquiryId={selectedEnquiryId}
                viewerUserId={currentUser.id}
                onClose={() => setIsEnquiryDetailPanelOpen(false)}
                onEnquiryUpdated={() => {
                  loadConversations();
                  loadMessagesForActiveConv();
                }}
                onOpenCustomerMatchModal={() => setIsCustomerMatchModalOpen(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PHASE 30 CORE ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Phase 30 Data Architecture &amp; Group Governance</h2>
              <p className="text-slate-400 text-xs mt-1">
                WhatsApp-style self-service platform designed for 5,000–20,000 active concurrent enterprise users.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full">
              Decoupled from ERP Core
            </span>
          </div>

          {/* SCHEMA ENTITIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'USERS',
                fields: ['id (PK)', 'phoneNumber', 'username', 'displayName', 'profilePhoto', 'about', 'onlineStatus', 'lastSeen'],
                desc: 'Public chat identity decoupled from ERP employee IDs.'
              },
              {
                title: 'CONVERSATIONS',
                fields: ['id (PK)', 'type (direct/group)', 'name', 'avatar', 'description', 'createdBy', 'pinned', 'updatedAt'],
                desc: 'Container entity supporting 1:1 direct messaging and multi-member groups.'
              },
              {
                title: 'CONVERSATION_MEMBERS',
                fields: ['id (PK)', 'conversationId (FK)', 'userId (FK)', 'role (owner/admin/member)', 'muted', 'lastReadMessageId'],
                desc: 'Membership ledger tracking user admin roles and unread message markers.'
              },
              {
                title: 'MESSAGES',
                fields: ['id (PK)', 'conversationId', 'senderId', 'text', 'replyToMessageId', 'isForwarded', 'deletedAt'],
                desc: 'Message store with reply previews, forwarded metadata, and soft delete tracking.'
              },
              {
                title: 'MESSAGE_STATUS',
                fields: ['id (PK)', 'messageId (FK)', 'userId (FK)', 'status (sent/delivered/read)', 'updatedAt'],
                desc: 'Real-time delivery confirmation matrix driving single/double blue ticks.'
              },
              {
                title: 'TYPING & EVENT BUS',
                fields: ['conversationId', 'userId', 'isTyping', 'timestamp'],
                desc: 'Debounced real-time pub-sub event emitter for typing and status synchronization.'
              }
            ].map((ent, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <strong className="text-amber-400 font-bold block">{ent.title}</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">{ent.desc}</p>
                <div className="pt-2 border-t border-slate-900 space-y-1">
                  {ent.fields.map((f, fIdx) => (
                    <span key={fIdx} className="inline-block px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded text-[10px] mr-1 mb-1 border border-slate-800">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS LOG */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white">Notifications Queue for {currentUser.displayName}</h2>
            <span className="text-amber-400 font-bold">
              {rzChatService.getNotificationsForUser(currentUser.id).filter(n => !n.isRead).length} Unread
            </span>
          </div>

          <div className="space-y-2">
            {rzChatService.getNotificationsForUser(currentUser.id).map(notif => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border flex justify-between items-center ${
                  notif.isRead ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-amber-500/10 border-amber-500/40 text-white font-bold'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[9px] rounded uppercase font-bold border border-slate-800">
                      {notif.type}
                    </span>
                    <strong className="text-xs">{notif.title}</strong>
                  </div>
                  <p className="text-[11px] font-normal text-slate-300">{notif.body}</p>
                  <span className="text-[9px] text-slate-500 block">{new Date(notif.createdAt).toLocaleString()}</span>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={() => {
                      rzChatService.markNotificationAsRead(currentUser.id, notif.id);
                      showToast('Notification marked as read.');
                    }}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-xl text-[10px] cursor-pointer hover:bg-amber-400"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PEOPLE & CONTACTS DIRECTORY */}
      {activeTab === 'people' && (
        <PeopleDirectoryView
          viewerUserId={currentUser.id}
          onViewProfile={usr => {
            setViewingPublicUser(usr);
            setIsPublicUserModalOpen(true);
          }}
          onStartChat={handleStartChatWithPublicUser}
          onBlockReport={usr => {
            setTargetUserForBlockReport(usr);
            setIsBlockReportModalOpen(true);
          }}
          onToast={showToast}
        />
      )}

      {/* TAB 5: BUSINESS DISCOVERY */}
      {activeTab === 'businesses' && (
        <BusinessDiscoveryView
          viewerUserId={currentUser.id}
          onViewBusiness={biz => {
            setViewingBusiness(biz);
            setIsBusinessModalOpen(true);
          }}
          onStartChatWithBusiness={handleStartChatWithBusinessProfile}
          onRegisterBusiness={() => setIsRegisterBusinessModalOpen(true)}
          onToast={showToast}
        />
      )}

      {/* MODAL 1: EDIT PROFILE & PRIVACY SETTINGS */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-white font-bold text-sm">Edit Profile &amp; Privacy Controls</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Display Name:</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={e => setEditDisplayName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Username (Unique handle):</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">About / Status:</label>
                <input
                  type="text"
                  value={editAbout}
                  onChange={e => setEditAbout(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Profile Photo URL:</label>
                <input
                  type="text"
                  value={editPhoto}
                  onChange={e => setEditPhoto(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* PRIVACY CONTROLS */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <strong className="text-amber-400 font-bold block text-[11px]">Privacy Settings</strong>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-300">Who can see my Last Seen:</span>
                  <select
                    value={privacySettings.lastSeen}
                    onChange={e => setPrivacySettings({ ...privacySettings, lastSeen: e.target.value as any })}
                    className="p-1 bg-slate-900 border border-slate-800 rounded text-amber-400 cursor-pointer"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-300">Who can see my Profile Photo:</span>
                  <select
                    value={privacySettings.profilePhoto}
                    onChange={e => setPrivacySettings({ ...privacySettings, profilePhoto: e.target.value as any })}
                    className="p-1 bg-slate-900 border border-slate-800 rounded text-amber-400 cursor-pointer"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW DIRECT CHAT */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-white font-bold text-sm">Start New Direct Chat</h3>
              <button onClick={() => setIsNewChatModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search by username or display name..."
                value={userSearchQuery}
                onChange={e => handleSearchUsers(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {searchResults.length === 0 ? (
                <p className="text-slate-500 text-center py-6">
                  {userSearchQuery.trim() ? 'No users found matching query.' : 'Type username above to search public contacts.'}
                </p>
              ) : (
                searchResults.map(user => (
                  <div
                    key={user.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center hover:border-amber-500/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilePhoto}
                        alt={user.displayName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-800"
                      />
                      <div>
                        <strong className="text-white font-bold block">{user.displayName}</strong>
                        <span className="text-amber-400 text-[10px]">@{user.username}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartChatWithUser(user)}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer hover:bg-amber-400"
                    >
                      Start Chat
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW GROUP */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-white font-bold text-sm">Create New RZ Chat Group</h3>
              <button onClick={() => setIsCreateGroupModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Group Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Bhilwara Crusher Dispatch Group"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Group Description</label>
                <input
                  type="text"
                  placeholder="e.g. Field dispatch & logistics coordination"
                  value={newGroupDesc}
                  onChange={e => setNewGroupDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Select Group Members</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                  {rzChatService.getAllUsers().filter(u => u.id !== currentUser.id).map(u => {
                    const isSelected = selectedGroupMemberIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedGroupMemberIds(selectedGroupMemberIds.filter(id => id !== u.id));
                          } else {
                            setSelectedGroupMemberIds([...selectedGroupMemberIds, u.id]);
                          }
                        }}
                        className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition ${
                          isSelected ? 'bg-amber-500/20 border border-amber-500/40 text-white' : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.profilePhoto} alt={u.displayName} className="w-6 h-6 rounded-full object-cover" />
                          <span>{u.displayName} (@{u.username})</span>
                        </div>
                        {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsCreateGroupModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: GROUP INFO & MEMBER GOVERNANCE */}
      {isGroupInfoOpen && activeConvObj && isGroupChat && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-white font-bold text-sm">Group Info &amp; Member Governance</h3>
              <button onClick={() => setIsGroupInfoOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <img src={activeConvObj.avatar} alt={activeConvObj.name} className="w-14 h-14 rounded-full object-cover border border-amber-500" />
              <div>
                <h4 className="text-white font-bold text-sm">{activeConvObj.name}</h4>
                <p className="text-slate-400 text-[11px]">{activeConvObj.description}</p>
                <span className="text-amber-400 text-[10px] block mt-1">{groupMembers.length} Active Members</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-amber-400 font-bold block text-[11px]">Group Members List</strong>
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer hover:bg-amber-400 flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" /> Add Member
                </button>
              </div>

              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {groupMembers.map(m => {
                  const u = m.user;
                  if (!u) return null;
                  const isCurrent = u.id === currentUser?.id;
                  const currentUserMemberRole = groupMembers.find(mem => mem.userId === (currentUser?.id || ''))?.role;
                  const isOwnerOrAdmin = currentUserMemberRole === 'owner' || currentUserMemberRole === 'admin';

                  return (
                    <div key={m.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={u.profilePhoto} alt={u.displayName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <strong className="text-white font-bold block">{u.displayName} {isCurrent && '(You)'}</strong>
                          <span className="text-amber-400 text-[10px]">@{u.username} • Role: <u className="uppercase font-mono">{m.role}</u></span>
                        </div>
                      </div>

                      {/* GOVERNANCE CONTROLS */}
                      {!isCurrent && isOwnerOrAdmin && (
                        <div className="flex items-center gap-1">
                          {currentUserMemberRole === 'owner' && (
                            <button
                              onClick={() => handleUpdateMemberRole(u.id, m.role === 'admin' ? 'member' : 'admin')}
                              className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-amber-400 rounded text-[9px] hover:bg-slate-800 cursor-pointer"
                            >
                              {m.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveGroupMember(u.id)}
                            className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[9px] hover:bg-rose-500/30 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={handleLeaveGroup}
                className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold rounded-xl cursor-pointer hover:bg-rose-500/20"
              >
                Leave Group
              </button>
              <button
                onClick={() => setIsGroupInfoOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD MEMBER TO GROUP */}
      {isAddMemberModalOpen && activeConvId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-white font-bold text-sm">Add Member to Group</h3>
              <button onClick={() => setIsAddMemberModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {rzChatService.getAllUsers()
                .filter(u => !groupMembers.some(m => m.userId === u.id))
                .map(u => (
                  <div key={u.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={u.profilePhoto} alt={u.displayName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <strong className="text-white font-bold block">{u.displayName}</strong>
                        <span className="text-amber-400 text-[10px]">@{u.username}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddGroupMember(u.id)}
                      className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer hover:bg-amber-400"
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: FORWARD MESSAGE */}
      {isForwardModalOpen && msgToForward && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-white font-bold text-sm">Forward Message</h3>
              <button onClick={() => setIsForwardModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 italic text-slate-300">
              "{msgToForward.text}"
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <span className="text-slate-400 text-[10px] block font-bold">Select Target Conversation:</span>
              {conversations.map(c => (
                <div key={c.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.type === 'group' ? c.avatar : c.otherUser?.profilePhoto}
                      alt={c.name || c.otherUser?.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <strong className="text-white font-bold block">{c.type === 'group' ? c.name : c.otherUser?.displayName}</strong>
                      <span className="text-amber-400 text-[10px] capitalize">{c.type} chat</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConfirmForward(c.id)}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer hover:bg-amber-400"
                  >
                    Forward
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: VIEW PROFILE DETAILS */}
      {viewingProfileUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="flex justify-end">
              <button onClick={() => setViewingProfileUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={viewingProfileUser.profilePhoto}
              alt={viewingProfileUser.displayName}
              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-amber-500"
            />

            <div>
              <h3 className="text-white font-bold text-base">{viewingProfileUser.displayName}</h3>
              <span className="text-amber-400 text-xs">@{viewingProfileUser.username}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-[11px] text-left space-y-2">
              <div>
                <span className="text-slate-500 text-[10px] block">ABOUT:</span>
                <p>{viewingProfileUser.about}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">PHONE:</span>
                <p>{viewingProfileUser.phoneNumber}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setViewingProfileUser(null);
                handleOpenBlockReportModal(viewingProfileUser);
              }}
              className="w-full py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold rounded-xl cursor-pointer hover:bg-rose-500/20"
            >
              Block or Report User
            </button>
          </div>
        </div>
      )}

      {/* MODAL 8: BLOCK / REPORT USER */}
      {isBlockReportModalOpen && targetUserForBlockReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-rose-400 font-bold text-sm">Block or Report @{targetUserForBlockReport.username}</h3>
              <button onClick={() => setIsBlockReportModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BLOCK OPTION */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <strong className="text-white font-bold block">1. Block User</strong>
              <p className="text-slate-400 text-[11px]">
                Blocked users cannot send you messages or view your online status.
              </p>
              <button
                onClick={handleConfirmBlock}
                className="px-4 py-2 bg-rose-500 text-white font-bold rounded-xl cursor-pointer hover:bg-rose-600"
              >
                Block @{targetUserForBlockReport.username}
              </button>
            </div>

            {/* REPORT OPTION */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <strong className="text-amber-400 font-bold block">2. Report User / Message</strong>
              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Reason for Report:</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value as ReportReason)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs cursor-pointer"
                >
                  <option value="spam">Spam or Unsolicited Commercial Message</option>
                  <option value="harassment">Harassment or Abusive Conduct</option>
                  <option value="impersonation">Impersonation</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="other">Other Violation</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={reportDescription}
                  onChange={e => setReportDescription(e.target.value)}
                  placeholder="Provide incident details..."
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleConfirmReport}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl cursor-pointer hover:bg-amber-400"
              >
                Submit Moderation Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: MEDIA FILE UPLOAD PREVIEW & CONFIRMATION (PHASE 31) */}
      {isMediaPreviewModalOpen && selectedFileForUpload && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-bold text-sm uppercase">Upload &amp; Share Media Attachment</h3>
              </div>
              <button
                onClick={handleCancelMediaUpload}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FILE PREVIEW CONTAINER */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-48 text-center">
              {pendingMediaType === 'image' && filePreviewUrl && (
                <img
                  src={filePreviewUrl}
                  alt={selectedFileForUpload.name}
                  className="max-h-64 rounded-xl object-contain border border-slate-800 shadow"
                />
              )}
              {pendingMediaType === 'video' && filePreviewUrl && (
                <video
                  src={filePreviewUrl}
                  controls
                  className="max-h-64 rounded-xl bg-black border border-slate-800"
                />
              )}
              {pendingMediaType === 'document' && (
                <div className="space-y-3 py-6">
                  <FileText className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                  <div>
                    <strong className="text-white font-bold text-sm block">{selectedFileForUpload.name}</strong>
                    <span className="text-slate-400 text-xs">
                      {(selectedFileForUpload.size / (1024 * 1024)).toFixed(2)} MB • {selectedFileForUpload.type || 'Document'}
                    </span>
                  </div>
                </div>
              )}
              {pendingMediaType === 'audio' && (
                <div className="space-y-3 py-6 w-full px-4">
                  <Music className="w-12 h-12 text-purple-400 mx-auto" />
                  <strong className="text-white font-bold text-xs block">{selectedFileForUpload.name}</strong>
                  {filePreviewUrl && <audio src={filePreviewUrl} controls className="w-full h-8" />}
                </div>
              )}
            </div>

            {/* STORAGE PATH PREVIEW */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[10px] space-y-1">
              <span className="text-slate-500 font-bold block">TARGET SECURE STORAGE PATH:</span>
              <code className="text-amber-400 break-all block">
                chat-media/conversations/{activeConvId}/messages/pending/{pendingMediaType}/{selectedFileForUpload.name}
              </code>
            </div>

            {/* CAPTION INPUT */}
            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Optional Message / Caption:</label>
              <input
                type="text"
                placeholder="Add a caption..."
                value={fileUploadCaption}
                onChange={e => setFileUploadCaption(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* UPLOAD ERROR IF ANY */}
            {uploadError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-[11px]">
                {uploadError}
              </div>
            )}

            {/* UPLOAD PROGRESS BAR */}
            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-amber-400">
                  <span>Uploading Chunked Media Stream...</span>
                  <span>{uploadProgressPct}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-amber-500 h-full transition-all duration-200"
                    style={{ width: `${uploadProgressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleCancelMediaUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-slate-950 text-slate-300 hover:text-white rounded-xl border border-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSendMedia}
                disabled={isUploading}
                className="px-5 py-2 bg-amber-500 text-slate-950 font-black rounded-xl cursor-pointer hover:bg-amber-400 transition flex items-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Upload &amp; Send Attachment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: LIGHTBOX MEDIA VIEWER (PHASE 31) */}
      {lightboxMedia && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 font-mono text-xs animate-fade-in">
          {/* HEADER */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-slate-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white font-bold text-sm block">{lightboxMedia.fileName}</strong>
                <span className="text-slate-400 text-[10px]">
                  {lightboxMedia.fileSizeFormatted} • {new Date(lightboxMedia.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLightboxZoom(prev => (prev >= 2 ? 1 : prev + 0.5))}
                className="p-2 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 hover:text-white cursor-pointer"
                title="Toggle Zoom"
              >
                Zoom: {lightboxZoom}x
              </button>

              <a
                href={lightboxMedia.downloadUrl}
                download={lightboxMedia.fileName}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold hover:bg-amber-400 cursor-pointer flex items-center gap-1"
                title="Download Media File"
              >
                <Download className="w-4 h-4" /> Download
              </a>

              <button
                onClick={() => setLightboxMedia(null)}
                className="p-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl border border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MEDIA DISPLAY */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            {lightboxMedia.mediaType === 'image' && (
              <img
                src={lightboxMedia.downloadUrl}
                alt={lightboxMedia.fileName}
                style={{ transform: `scale(${lightboxZoom})` }}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition duration-300"
              />
            )}
            {lightboxMedia.mediaType === 'video' && (
              <video
                src={lightboxMedia.downloadUrl}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-2xl bg-black border border-slate-800 shadow-2xl"
              />
            )}
          </div>

          {/* FOOTER METADATA */}
          <div className="text-center text-[10px] text-slate-500 border-t border-slate-900 pt-2">
            Storage path: <code className="text-slate-400">{lightboxMedia.storagePath}</code>
          </div>
        </div>
      )}

      {/* PHASE 32 MODALS */}
      <PublicUserProfileModal
        viewerUserId={currentUser.id}
        targetUser={viewingPublicUser}
        isOpen={isPublicUserModalOpen}
        onClose={() => {
          setIsPublicUserModalOpen(false);
          setViewingPublicUser(null);
        }}
        onStartChat={handleStartChatWithPublicUser}
        onBlockReport={usr => {
          setIsPublicUserModalOpen(false);
          setTargetUserForBlockReport(usr);
          setIsBlockReportModalOpen(true);
        }}
        onToast={showToast}
      />

      <BusinessProfileModal
        viewerUserId={currentUser.id}
        business={viewingBusiness}
        isOpen={isBusinessModalOpen}
        onClose={() => {
          setIsBusinessModalOpen(false);
          setViewingBusiness(null);
        }}
        onStartChat={handleStartChatWithBusinessProfile}
        onRequestVerification={biz => {
          rzChatService.submitBusinessVerification(currentUser.id, biz.id, 'Commercial Registry', `REG-${Date.now()}`);
          showToast('Verification request submitted to platform administration.');
        }}
        onToast={showToast}
      />

      <RegisterBusinessModal
        currentUserId={currentUser.id}
        isOpen={isRegisterBusinessModalOpen}
        onClose={() => setIsRegisterBusinessModalOpen(false)}
        onSuccess={() => {
          loadConversations();
          showToast('Business profile registered successfully!');
        }}
        onToast={showToast}
      />

      <EditProfileAndPrivacyModal
        currentUser={currentUser}
        isOpen={isEditProfilePrivacyModalOpen}
        onClose={() => setIsEditProfilePrivacyModalOpen(false)}
        onSuccess={updated => {
          setCurrentUser(updated);
          loadConversations();
        }}
        onToast={showToast}
      />

      {/* PHASE 33 MODALS */}
      {activeConvObj && (
        <CreateEnquiryModal
          isOpen={isCreateEnquiryModalOpen}
          onClose={() => setIsCreateEnquiryModalOpen(false)}
          businessId={activeOtherUser?.businessId || currentUser.businessId || 'BUS-101'}
          businessName={activeOtherUser?.displayName || 'Business Partner'}
          conversationId={activeConvObj.id}
          customerUserId={currentUser.id}
          onEnquiryCreated={(enquiryId) => {
            setSelectedEnquiryId(enquiryId);
            setIsEnquiryDetailPanelOpen(true);
            loadConversations();
            loadMessagesForActiveConv();
            showToast('Customer enquiry created successfully and routed to Business Inbox!');
          }}
        />
      )}

      <BusinessErpLinkingModal
        isOpen={isBusinessErpModalOpen}
        onClose={() => setIsBusinessErpModalOpen(false)}
        businessId={targetBusinessIdForErp}
        businessName="Mining Operations Division"
        currentUserId={currentUser.id}
        onLinkStatusChanged={() => {
          loadConversations();
          showToast('Business ERP organization link updated.');
        }}
      />

      {selectedEnquiryId && (
        <ErpCustomerMatchModal
          isOpen={isCustomerMatchModalOpen}
          onClose={() => setIsCustomerMatchModalOpen(false)}
          enquiryId={selectedEnquiryId}
          currentUserId={currentUser.id}
          onMatched={() => {
            loadConversations();
            showToast('Customer matched and linked to ERP Master successfully!');
          }}
        />
      )}

      {/* PHASE 34 MODALS */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />

      <PrivacySecurityCenterModal
        isOpen={isPrivacySecurityCenterOpen}
        onClose={() => setIsPrivacySecurityCenterOpen(false)}
      />

      <AdminModerationModal
        isOpen={isAdminModerationOpen}
        onClose={() => setIsAdminModerationOpen(false)}
      />

      {reportTarget && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setReportTarget(null);
          }}
          reportedEntityType={reportTarget.entityType}
          reportedEntityId={reportTarget.entityId}
          reportedUserId={reportTarget.userId}
          conversationId={reportTarget.conversationId}
          messageId={reportTarget.messageId}
        />
      )}
    </div>
  );
};
