export type AccountStatus = 'active' | 'restricted' | 'suspended' | 'banned' | 'deleted';
export type OnlineStatus = 'online' | 'offline' | 'away';
export type PrivacySettingOption = 'everyone' | 'contacts' | 'nobody';
export type UserCategory = 'public_user' | 'business_user' | 'erp_user' | 'admin';

export interface PrivacySettings {
  lastSeen: PrivacySettingOption;
  profilePhoto: PrivacySettingOption;
  about: PrivacySettingOption;
  whoCanMessageMe: PrivacySettingOption;
  readReceipts?: boolean;
}

export interface ChatUser {
  id: string;
  phoneNumber: string; // Must be unique
  username: string; // Must be unique, e.g. @nafid
  displayName: string;
  profilePhoto: string;
  about: string;
  accountStatus: AccountStatus;
  accountCategory?: UserCategory; // public_user | business_user | erp_user | admin
  location?: string;
  businessId?: string; // Linked business ID if business user
  erpUserId?: string; // Linked ERP employee ID (strictly kept separate)
  lastSeen: string; // ISO timestamp
  onlineStatus: OnlineStatus;
  privacySettings: PrivacySettings;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ContactRecord {
  id: string;
  userId: string;
  contactUserId: string;
  alias?: string;
  addedAt: string;
}

export type BusinessCategory =
  | 'Quarry'
  | 'Construction'
  | 'Transport'
  | 'Equipment Rental'
  | 'Machinery'
  | 'Manufacturing'
  | 'Retail'
  | 'Wholesale'
  | 'Service'
  | 'Professional Services'
  | 'Food'
  | 'Automotive'
  | 'Other';

export type BusinessVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'suspended';
export type BusinessOperationalStatus = 'open' | 'closed' | 'temporarily_unavailable';

export interface BusinessDayHours {
  day: string; // e.g., "Monday"
  openTime: string; // e.g., "08:00"
  closeTime: string; // e.g., "18:00"
  isClosed: boolean;
}

export interface BusinessProfile {
  id: string;
  ownerUserId: string;
  businessName: string;
  username: string; // Unique, e.g. @rzmining
  logoUrl: string;
  coverImageUrl?: string;
  description: string;
  category: BusinessCategory;
  phone?: string;
  email?: string;
  website?: string;
  location: string;
  businessHours?: BusinessDayHours[];
  services: string[];
  verificationStatus: BusinessVerificationStatus;
  operationalStatus?: BusinessOperationalStatus;
  erpOrganizationId?: string; // Linked ERP Org ID for Phase 33
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface BusinessVerificationRequest {
  id: string;
  businessId: string;
  submittedBy: string; // userId
  documentType: string; // e.g., "GST Registration", "Quarry Mining License", "Trade License"
  documentRef: string;
  status: BusinessVerificationStatus;
  submittedAt: string; // ISO timestamp
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface BusinessStaff {
  id: string;
  businessId: string;
  userId: string;
  role: 'owner' | 'admin' | 'support' | 'sales';
  assignedAt: string;
}

export type ConversationType = 'direct' | 'group' | 'channel';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // Optional for groups and channels
  avatar?: string;
  description?: string; // Group / Channel description
  createdBy: string; // userId
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  lastMessage?: string;
  lastMessageTimestamp?: string;
  pinned?: boolean;
}

export type ConversationMemberRole = 'owner' | 'admin' | 'member';

export interface ConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  role: ConversationMemberRole;
  joinedAt: string; // ISO timestamp
  lastReadMessageId?: string;
  muted: boolean;
  createdAt: string; // ISO timestamp
}

export type MessageType = 'text' | 'image' | 'video' | 'document' | 'audio' | 'voice' | 'system';

export interface MediaAttachment {
  id: string;
  messageId?: string;
  conversationId: string;
  uploadedBy: string;
  mediaType: 'image' | 'video' | 'document' | 'audio' | 'voice';
  fileName: string;
  mimeType: string;
  fileSize: number; // in bytes
  fileSizeFormatted: string; // e.g., "2.4 MB"
  storagePath: string; // Scalable path e.g. chat-media/conversations/{convId}/messages/{msgId}/{type}/{file}
  downloadUrl: string; // Object URL or data URL
  thumbnailPath?: string;
  thumbnailUrl?: string;
  duration?: number; // duration in seconds for audio/video/voice
  width?: number;
  height?: number;
  createdAt: string; // ISO timestamp
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // userId or 'system'
  messageType: MessageType;
  text: string;
  replyToMessageId?: string;
  isForwarded?: boolean;
  forwardedFromSenderId?: string;
  forwardedFromMessageId?: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  attachment?: MediaAttachment;
  // Phase 33 Integration Extensions
  entityType?: 'enquiry' | 'customer' | 'quote' | 'order' | 'business_link';
  entityId?: string;
  eventType?: NotificationEventType;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt?: string; // ISO timestamp if deleted
}

// --- PHASE 33: ERP INTEGRATION & CUSTOMER ENQUIRY TYPES ---

export type BusinessLinkStatus = 'not_linked' | 'link_requested' | 'linked' | 'unlinked' | 'suspended';

export interface BusinessErpLink {
  id: string;
  businessId: string;
  organizationId: string;
  organizationName?: string;
  linkedBy: string; // userId
  linkedAt: string; // ISO timestamp
  status: BusinessLinkStatus;
  notes?: string;
}

export type EnquiryStatus = 'new' | 'open' | 'in_progress' | 'awaiting_customer' | 'resolved' | 'closed' | 'cancelled';
export type EnquiryPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface CustomerEnquiry {
  id: string; // e.g., "ENQ-1001"
  enquiryCode: string; // e.g., "ENQ-000123"
  businessId: string;
  organizationId?: string;
  conversationId: string;
  customerUserId: string;
  customerDisplayName?: string;
  customerUsername?: string;
  customerPhone?: string;
  customerEmail?: string;
  subject: string;
  message: string;
  category: string; // e.g., 'Quarry / Laterite Stone', 'Aggregates', 'Equipment Rental', 'Transport', 'General Enquiry'
  status: EnquiryStatus;
  priority: EnquiryPriority;
  assignedToUserId?: string;
  assignedToName?: string;
  quantity?: string; // e.g., "2 Loads"
  deliveryLocation?: string;
  erpCustomerId?: string; // Linked ERP customer ID if matched/created
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  closedAt?: string;
}

export interface InternalStaffNote {
  id: string;
  enquiryId: string;
  businessId: string;
  authorUserId: string;
  authorName: string;
  noteText: string;
  createdAt: string; // ISO timestamp
}

export type AuditActionType =
  | 'business_linked'
  | 'business_unlinked'
  | 'customer_matched'
  | 'customer_created'
  | 'enquiry_created'
  | 'enquiry_assigned'
  | 'enquiry_status_changed'
  | 'internal_note_added'
  | 'permission_changed'
  | 'user_login'
  | 'user_logout'
  | 'device_signout'
  | 'privacy_updated'
  | 'user_blocked'
  | 'user_unblocked'
  | 'report_submitted'
  | 'report_resolved'
  | 'report_dismissed'
  | 'user_restricted'
  | 'user_suspended'
  | 'user_banned'
  | 'security_alert_generated';

export interface AuditLogRecord {
  id: string;
  actorUserId: string;
  actorName: string;
  businessId?: string;
  organizationId?: string;
  action: AuditActionType;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string; // ISO timestamp
  ipAddress?: string;
  deviceInfo?: string;
}

export type NotificationEventType =
  | 'enquiry_created'
  | 'enquiry_assigned'
  | 'enquiry_updated'
  | 'customer_created'
  | 'quote_created'
  | 'order_created'
  | 'order_confirmed'
  | 'dispatch_created'
  | 'invoice_created'
  | 'payment_received';

export interface ErpCustomerMaster {
  id: string; // e.g., "CUST-ERP-501"
  organizationId: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  chatUserId?: string; // Linked chat user ID
  createdAt: string; // ISO timestamp
}

export interface ErpOrganizationRef {
  id: string; // e.g., "ORG-101"
  name: string; // e.g., "RZ Mining & Quarries Pvt Ltd"
  code: string; // e.g., "RZMQ"
  sector: string;
  location: string;
}


export const MEDIA_LIMITS = {
  maxImageSizeMB: 10,
  maxVideoSizeMB: 50,
  maxDocumentSizeMB: 25,
  maxAudioSizeMB: 20,
  allowedImageMIMEs: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedVideoMIMEs: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  allowedDocumentMIMEs: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain'
  ],
  allowedAudioMIMEs: ['audio/mpeg', 'audio/mp3', 'audio/m4a', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac']
};

export type DeliveryStatus = 'sent' | 'delivered' | 'read';

export interface MessageStatusRecord {
  id: string;
  messageId: string;
  userId: string;
  status: DeliveryStatus;
  updatedAt: string; // ISO timestamp
}

export interface BlockRecord {
  id: string;
  blockerUserId: string;
  blockedUserId: string;
  createdAt: string; // ISO timestamp
}

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'fraud'
  | 'impersonation'
  | 'inappropriate_content'
  | 'illegal_content'
  | 'abuse'
  | 'other';

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export type ReportedEntityType = 'user' | 'message' | 'business' | 'group' | 'channel';

export interface ReportRecord {
  id: string;
  reporterUserId: string;
  reportedEntityType: ReportedEntityType;
  reportedEntityId: string;
  reportedUserId: string;
  reportedUserDisplayName?: string;
  conversationId?: string;
  messageId?: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  resolutionNotes?: string;
  resolvedByUserId?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export type NotificationType =
  | 'new_message'
  | 'message_reply'
  | 'group_message'
  | 'mention'
  | 'contact_request'
  | 'group_invite'
  | 'business_message'
  | 'enquiry_created'
  | 'enquiry_assigned'
  | 'enquiry_updated'
  | 'order_update'
  | 'dispatch_update'
  | 'invoice_update'
  | 'payment_update'
  | 'security_alert'
  | 'account_alert'
  | 'system'
  | 'channel_broadcast';

export type NotificationCategory = 'chat' | 'social' | 'business' | 'erp' | 'system';

export interface NotificationRecord {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  relatedConversationId?: string;
  relatedMessageId?: string;
  relatedBusinessId?: string;
  relatedEnquiryId?: string;
  actionUrl?: string;
  deepLink?: string;
  isRead: boolean;
  createdAt: string; // ISO timestamp
  groupCount?: number;
}

export type DevicePlatform = 'ios' | 'android' | 'web';

export interface UserDevice {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  platform: DevicePlatform;
  pushToken: string;
  appVersion: string;
  lastActiveAt: string; // ISO timestamp
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  ipAddress?: string;
  isCurrent?: boolean;
}

export interface NotificationPreferences {
  directMessages: boolean;
  groupMessages: boolean;
  mentions: boolean;
  businessMessages: boolean;
  enquiries: boolean;
  orderUpdates: boolean;
  dispatchUpdates: boolean;
  invoiceUpdates: boolean;
  paymentUpdates: boolean;
  securityAlerts: boolean; // Always true
  accountAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export type ModerationAction =
  | 'warn'
  | 'restrict'
  | 'suspend'
  | 'unsuspend'
  | 'ban'
  | 'unban'
  | 'resolve_report'
  | 'dismiss_report';

export interface UserSearchQuery {
  query: string;
  limit?: number;
}

// --- PHASE 35: 5K-20K USER OPTIMIZATION & PRODUCTION READINESS TYPES ---

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export interface CursorPaginatedMessages {
  messages: Message[];
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
  oldestMessageId?: string;
  newestMessageId?: string;
  totalCount: number;
}

export interface ConversationSummary {
  conversationId: string;
  type: ConversationType;
  name?: string;
  avatar?: string;
  lastMessageId?: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount: number;
  pinned?: boolean;
}

export interface PerformanceAuditReport {
  timestamp: string;
  activeDatabaseIndexesCount: number;
  unboundedQueriesDetected: number;
  realtimeActiveListenersCount: number;
  estimatedClientBundleSizeMB: number;
  memoryUsageMB: number;
  databaseQueryP50Ms: number;
  databaseQueryP95Ms: number;
  databaseQueryP99Ms: number;
  optimizationsApplied: string[];
  bottlenecksDiscovered: string[];
}

export interface LoadTestScenarioResult {
  targetUsers: 5000 | 10000 | 20000;
  concurrentUsers: number;
  reqPerSecond: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  errorRatePercent: number;
  messageDeliveryMs: number;
  dbLoadPercent: number;
  memoryMB: number;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  evaluatedAt: string;
}

export interface ProductionHealthMetrics {
  uptimeSeconds: number;
  activeRealtimeConnections: number;
  registeredUsersCount: number;
  active24hUsersCount: number;
  cacheHitRatePercent: number;
  queueDepth: number;
  errorCount24h: number;
  dbQueryTimeAvgMs: number;
  storageUsedGB: number;
  healthStatus: 'healthy' | 'degraded' | 'critical';
}

export interface BackgroundJobRecord {
  id: string;
  jobType: 'notification_delivery' | 'media_thumbnail' | 'audit_cleanup' | 'erp_sync' | 'index_rebuild';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payload: any;
  attempts: number;
  createdAt: string;
  processedAt?: string;
}

export interface SystemHealthCheck {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  components: {
    backend: 'healthy' | 'degraded' | 'offline';
    database: 'healthy' | 'degraded' | 'offline';
    storage: 'healthy' | 'degraded' | 'offline';
    realtime: 'healthy' | 'degraded' | 'offline';
    notification: 'healthy' | 'degraded' | 'offline';
    erpIntegration: 'healthy' | 'degraded' | 'offline';
  };
  metrics: {
    dbPingMs: number;
    redisCacheHitRate: number;
    activeSessions: number;
  };
}

export interface BackupStatusInfo {
  lastAutomatedBackup: string;
  backupSizeMB: number;
  retentionDays: number;
  storageLocation: string;
  recoveryPointObjectiveMinutes: number; // RPO
  recoveryTimeObjectiveMinutes: number; // RTO
  restoreTestVerified: boolean;
}

