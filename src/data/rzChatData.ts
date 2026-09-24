// ============================================================================
// RZ® MINETRIX — PLATFORM 8: RZ® CHAT DATA & DOMAIN MODELS
// Comprehensive Studio Preview / Demo Data for Unified Communication Platform
// ============================================================================

export type ChatNavTab =
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
  | 'requests'
  | 'business'
  | 'notifications'
  | 'settings';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type GroupCategory =
  | 'General'
  | 'Business'
  | 'Quarry'
  | 'Vehicle'
  | 'Job'
  | 'Order'
  | 'Land'
  | 'Announcement';

export type BusinessModuleType =
  | 'QUARRY'
  | 'CRUSHER'
  | 'VEHICLE'
  | 'JOB'
  | 'ORDER'
  | 'MARKETPLACE'
  | 'LAND'
  | 'SUPPLIER'
  | 'CUSTOMER';

export interface BusinessContextReference {
  module: BusinessModuleType;
  recordId: string;
  title: string;
  subtitle?: string;
  badge?: string;
  actionLabel?: string;
  amountRs?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  timeFormatted: string;
  status: MessageStatus;
  isSelf: boolean;
  messageType: 'text' | 'image' | 'video' | 'document' | 'voice' | 'location' | 'contact' | 'business_record';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  voiceDurationSec?: number;
  voiceWaveform?: number[];
  locationDetails?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  contactCard?: {
    name: string;
    phone: string;
    role: string;
    avatar: string;
  };
  businessContext?: BusinessContextReference;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  isStarred?: boolean;
  isForwarded?: boolean;
  forwardedFrom?: string;
  reactions?: { [emoji: string]: number };
}

export interface ChatContact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role: string;
  category: 'Customer' | 'Supplier' | 'Driver' | 'Staff' | 'Land Owner' | 'Contractor' | 'Business';
  company: string;
  onlineStatus: 'online' | 'offline' | 'away';
  lastSeen: string;
  about: string;
  email: string;
  location: string;
  isVerified?: boolean;
}

export interface ChatConversation {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  lastMessageTimeFormatted: string;
  lastMessageSender: string;
  lastMessageStatus?: MessageStatus;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  muteDuration?: '1 hour' | '8 hours' | '1 week' | 'Always';
  isArchived: boolean;
  isFavorite: boolean;
  onlineStatus?: 'online' | 'offline' | 'away';
  groupCategory?: GroupCategory;
  groupDescription?: string;
  groupMembersCount?: number;
  groupAdmins?: string[];
  groupMembers?: string[];
  businessContext?: BusinessContextReference;
  permissions?: {
    sendMessages: boolean;
    sendMedia: boolean;
    sendFiles: boolean;
    addMembers: boolean;
    editGroupInfo: boolean;
    createTasks: boolean;
  };
}

export interface UserStatusItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaType: 'text' | 'image' | 'video';
  mediaUrl?: string;
  caption?: string;
  textContent?: string;
  backgroundColor?: string;
  createdAt: string;
  timeAgo: string;
  isViewed: boolean;
  expiresInHours: number;
  viewersCount: number;
  viewers?: { name: string; time: string; avatar: string }[];
}

export interface BroadcastList {
  id: string;
  name: string;
  description: string;
  recipientsCount: number;
  recipientIds: string[];
  createdAt: string;
  lastSentMessage?: string;
  lastSentDate?: string;
  deliveredCount: number;
  readCount: number;
}

export interface RzReelItem {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  creatorBio: string;
  followersCount: number;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audioTrack: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  tags: string[];
  comments: {
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    timeAgo: string;
    likes: number;
  }[];
}

export interface ChatNotificationItem {
  id: string;
  type:
    | 'message'
    | 'mention'
    | 'group_invite'
    | 'call'
    | 'order'
    | 'job'
    | 'marketplace'
    | 'land'
    | 'ott_task';
  title: string;
  body: string;
  timeAgo: string;
  avatar: string;
  isRead: boolean;
  conversationId?: string;
  actionUrl?: string;
}

// ============================================================================
// DEMO DATASETS
// ============================================================================

export const DEMO_CONTACTS: ChatContact[] = [
  {
    id: 'USR-001',
    name: 'Shri V. Prabhakar Pai',
    phone: '+91 94471 20045',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Jenmam Land Owner',
    category: 'Land Owner',
    company: 'Pai Plantations & Estates',
    onlineStatus: 'online',
    lastSeen: 'Active now',
    about: 'Owner of Hosdurg Survey 412/1A laterite quarry parcels. Always open for structured lease agreements.',
    email: 'prabhakar.pai@example.com',
    location: 'Kasaragod, Kerala',
    isVerified: true
  },
  {
    id: 'USR-002',
    name: 'K. Mohan Kumar',
    phone: '+91 98450 11992',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Mining Quarry Head',
    category: 'Staff',
    company: 'RZ® Minetrix Pit Ops',
    onlineStatus: 'online',
    lastSeen: 'Active now',
    about: 'Site In-charge for Hilltop Pit 01 & Crusher Plant #2. Blast license certified.',
    email: 'mohan.kumar@rzminetrix.com',
    location: 'Mangalore, Karnataka',
    isVerified: true
  },
  {
    id: 'USR-003',
    name: 'Er. Rajesh Nair',
    phone: '+91 94470 33812',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'Licensed Cadastral Surveyor',
    category: 'Staff',
    company: 'Coastal Geo-Tech Consultants',
    onlineStatus: 'away',
    lastSeen: '15 mins ago',
    about: 'DGPS boundary mapping, quarry contour profiling, volumetric excavation calculations.',
    email: 'rajesh.surveyor@geotech.in',
    location: 'Kannur, Kerala',
    isVerified: true
  },
  {
    id: 'USR-004',
    name: 'Suresh Shetty',
    phone: '+91 98860 44211',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'Fleet Logistics Operator',
    category: 'Driver',
    company: 'Shetty Heavy Transport Fleet',
    onlineStatus: 'online',
    lastSeen: 'Active now',
    about: 'Operator of 12 multi-axle tippers. Specializing in laterite cut-stone and aggregate hauling.',
    email: 'suresh.transport@gmail.com',
    location: 'Udupi, Karnataka',
    isVerified: true
  },
  {
    id: 'USR-005',
    name: 'Farooq Mohammed',
    phone: '+91 97422 66014',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Highway & Bridge Contractor',
    category: 'Contractor',
    company: 'Deccan Infrastructure Projects Ltd',
    onlineStatus: 'offline',
    lastSeen: 'Yesterday at 8:40 PM',
    about: 'Procuring 20mm & 40mm aggregates and GSB for NH-66 expansion project.',
    email: 'farooq@deccaninfra.com',
    location: 'Mangalore, Karnataka',
    isVerified: true
  },
  {
    id: 'USR-006',
    name: 'Harishchandra Rao',
    phone: '+91 98452 77019',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Quarry Partner & Land Investor',
    category: 'Land Owner',
    company: 'Rao Stone Quarries LLP',
    onlineStatus: 'online',
    lastSeen: 'Active now',
    about: 'Co-owner of Guruvayanakere Granite Dome. Exploring wire-saw commercial extraction.',
    email: 'harish.rao@raostone.com',
    location: 'Belthangady, Karnataka',
    isVerified: true
  },
  {
    id: 'USR-007',
    name: 'Ashok Varma',
    phone: '+91 94462 88102',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'Ready-Mix Concrete Supplier',
    category: 'Customer',
    company: 'Malabar Concrete & Mortar Works',
    onlineStatus: 'offline',
    lastSeen: '2 hours ago',
    about: 'High-volume buyer of M-Sand, P-Sand and 10mm crushed chips with monthly contract credit.',
    email: 'ashok@malabarconcrete.com',
    location: 'Kasargod, Kerala',
    isVerified: true
  },
  {
    id: 'USR-008',
    name: 'Anand K. Hegde',
    phone: '+91 98440 99218',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Heavy Machinery Dealer',
    category: 'Supplier',
    company: 'Western Ghats Machinery Corp',
    onlineStatus: 'online',
    lastSeen: 'Active now',
    about: 'Authorized dealer for CAT, Komatsu & Hyundai excavators and mobile jaw crushers.',
    email: 'anand.hegde@wgmc.in',
    location: 'Shimoga, Karnataka',
    isVerified: true
  }
];

export const DEMO_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'CONV-001',
    isGroup: false,
    name: 'Shri V. Prabhakar Pai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Tomorrow’s dispatch from Survey 412/1A is confirmed. Please send the per-load settlement voucher.',
    lastMessageTimestamp: '2026-09-23T09:40:00Z',
    lastMessageTimeFormatted: '09:40 AM',
    lastMessageSender: 'Shri V. Prabhakar Pai',
    lastMessageStatus: 'read',
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    isFavorite: true,
    onlineStatus: 'online',
    businessContext: {
      module: 'LAND',
      recordId: 'PARCEL-KSD-01',
      title: 'Survey 412/1A (Pai Plantations)',
      subtitle: 'Agreement AGR-2026-001 • Per-Load ₹650',
      badge: 'Active Mining',
      actionLabel: 'Open Land Parcel',
      amountRs: 487500
    }
  },
  {
    id: 'CONV-002',
    isGroup: true,
    name: 'Hilltop Pit 01 & Crusher Operations',
    avatar: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Mohan Kumar: 14 tippers loaded before 09:00 AM. Bench depth reached 18m. Shift handover done.',
    lastMessageTimestamp: '2026-09-23T09:15:00Z',
    lastMessageTimeFormatted: '09:15 AM',
    lastMessageSender: 'K. Mohan Kumar',
    lastMessageStatus: 'read',
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    isFavorite: true,
    groupCategory: 'Quarry',
    groupDescription: 'Daily quarry bench operations, daily load counts, blast permits and staff shifts.',
    groupMembersCount: 18,
    groupAdmins: ['USR-002', 'SELF'],
    groupMembers: ['USR-002', 'USR-003', 'USR-004', 'USR-005', 'SELF'],
    businessContext: {
      module: 'QUARRY',
      recordId: 'QUARRY-01',
      title: 'Hilltop Laterite Pit #01',
      subtitle: 'Working Area WA-01 • Target 120 Loads/day',
      badge: 'Operational',
      actionLabel: 'Open Quarry Pit'
    },
    permissions: {
      sendMessages: true,
      sendMedia: true,
      sendFiles: true,
      addMembers: false,
      editGroupInfo: false,
      createTasks: true
    }
  },
  {
    id: 'CONV-003',
    isGroup: false,
    name: 'Farooq Mohammed (Deccan Infra)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Received invoice for Order ORD-2026-8812. Advance RTGS ₹1,20,000 initiated right now.',
    lastMessageTimestamp: '2026-09-23T08:50:00Z',
    lastMessageTimeFormatted: '08:50 AM',
    lastMessageSender: 'Farooq Mohammed',
    lastMessageStatus: 'delivered',
    unreadCount: 1,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    isFavorite: false,
    onlineStatus: 'offline',
    businessContext: {
      module: 'ORDER',
      recordId: 'ORD-2026-8812',
      title: 'Order ORD-2026-8812',
      subtitle: '600 MT 20mm Aggregate • NH-66 Site',
      badge: 'Dispatching',
      actionLabel: 'Open Order',
      amountRs: 345000
    }
  },
  {
    id: 'CONV-004',
    isGroup: true,
    name: 'Fleet Dispatch & Drivers (KL/KA)',
    avatar: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Suresh Shetty: Vehicle KL-14-AC-9901 cleared Hosangadi toll. Estimated pit arrival 10:15 AM.',
    lastMessageTimestamp: '2026-09-23T08:25:00Z',
    lastMessageTimeFormatted: '08:25 AM',
    lastMessageSender: 'Suresh Shetty',
    lastMessageStatus: 'read',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isFavorite: false,
    groupCategory: 'Vehicle',
    groupDescription: 'Vehicle telematics, driver status updates, breakdown assistance, toll clearances.',
    groupMembersCount: 34,
    groupAdmins: ['USR-004', 'SELF'],
    businessContext: {
      module: 'VEHICLE',
      recordId: 'VEH-KL14-9901',
      title: 'Vehicle KL-14-AC-9901',
      subtitle: 'Trip TRP-9021 • Driver: Suresh Shetty',
      badge: 'In Transit',
      actionLabel: 'Open Vehicle Telematics'
    }
  },
  {
    id: 'CONV-005',
    isGroup: false,
    name: 'Anand K. Hegde (Machinery Dealer)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Regarding listing LST-CAT-320D: Buyer offered ₹32.5 Lakhs with immediate full clearance.',
    lastMessageTimestamp: '2026-09-22T18:10:00Z',
    lastMessageTimeFormatted: 'Yesterday',
    lastMessageSender: 'Anand K. Hegde',
    lastMessageStatus: 'read',
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    muteDuration: '8 hours',
    isArchived: false,
    isFavorite: false,
    onlineStatus: 'online',
    businessContext: {
      module: 'MARKETPLACE',
      recordId: 'LST-CAT-320D',
      title: 'CAT 320D2 GC Excavator',
      subtitle: 'Listed at ₹34,50,000 • 2021 Model',
      badge: 'Offer Received',
      actionLabel: 'Open Listing',
      amountRs: 3250000
    }
  },
  {
    id: 'CONV-006',
    isGroup: true,
    name: 'NH-66 Highway Subcontract Team',
    avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Er. Rajesh: Weekly progress measurement recorded for Subcontract JOB-2026-441. Bill submitted.',
    lastMessageTimestamp: '2026-09-22T16:45:00Z',
    lastMessageTimeFormatted: 'Yesterday',
    lastMessageSender: 'Er. Rajesh Nair',
    lastMessageStatus: 'read',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isFavorite: false,
    groupCategory: 'Job',
    groupDescription: 'Subcontract execution, work orders, RA bills and equipment rental reconciliation.',
    groupMembersCount: 12,
    businessContext: {
      module: 'JOB',
      recordId: 'JOB-2026-441',
      title: 'NH-66 Subcontract 441',
      subtitle: 'Chainage 142 to 148 • Earthwork & GSB',
      badge: '72% Complete',
      actionLabel: 'Open Contract Job',
      amountRs: 1850000
    }
  },
  {
    id: 'CONV-007',
    isGroup: false,
    name: 'Er. Rajesh Nair (Surveyor)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Uploaded the DGPS boundary CAD sketch and drone ortho-mosaic for the new 14-acre hillock parcel.',
    lastMessageTimestamp: '2026-09-22T14:15:00Z',
    lastMessageTimeFormatted: 'Yesterday',
    lastMessageSender: 'Er. Rajesh Nair',
    lastMessageStatus: 'read',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isFavorite: false,
    onlineStatus: 'away'
  },
  {
    id: 'CONV-008',
    isGroup: true,
    name: 'RZ® Minetrix Executive Announcements',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'System Admin: Mining permit renewal approved for Kasaragod Zone. Safety briefing scheduled for Friday.',
    lastMessageTimestamp: '2026-09-21T11:00:00Z',
    lastMessageTimeFormatted: '21 Sep',
    lastMessageSender: 'System Admin',
    lastMessageStatus: 'read',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isFavorite: false,
    groupCategory: 'Announcement',
    groupDescription: 'Official company bulletins, safety regulations, director directives and policy updates.',
    groupMembersCount: 65,
    permissions: {
      sendMessages: false,
      sendMedia: false,
      sendFiles: false,
      addMembers: false,
      editGroupInfo: false,
      createTasks: false
    }
  },
  {
    id: 'CONV-009',
    isGroup: false,
    name: 'Ashok Varma (Malabar Concrete)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Can you ensure 150 MT washed M-Sand delivery tomorrow before 7 AM? Casting slab at site.',
    lastMessageTimestamp: '2026-09-20T17:30:00Z',
    lastMessageTimeFormatted: '20 Sep',
    lastMessageSender: 'Ashok Varma',
    lastMessageStatus: 'read',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    isFavorite: false,
    onlineStatus: 'offline'
  },
  {
    id: 'CONV-010',
    isGroup: false,
    name: 'Archived: Coastal Quarry Machinery Lease',
    avatar: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Lease term completed. Equipment returned in certified condition. Final refund processed.',
    lastMessageTimestamp: '2026-08-15T12:00:00Z',
    lastMessageTimeFormatted: '15 Aug',
    lastMessageSender: 'Western Ghats Corp',
    lastMessageStatus: 'read',
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    isArchived: true,
    isFavorite: false,
    onlineStatus: 'offline'
  }
];

export const DEMO_MESSAGES_BY_CONV: { [convId: string]: ChatMessage[] } = {
  'CONV-001': [
    {
      id: 'MSG-001-01',
      conversationId: 'CONV-001',
      senderId: 'USR-001',
      senderName: 'Shri V. Prabhakar Pai',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Namaskara! Regarding Survey 412/1A laterite pit, the excavator has reached the southern boundary line as per our DGPS benchmark.',
      timestamp: '2026-09-23T09:10:00Z',
      timeFormatted: '09:10 AM',
      status: 'read',
      isSelf: false,
      messageType: 'text'
    },
    {
      id: 'MSG-001-02',
      conversationId: 'CONV-001',
      senderId: 'USR-001',
      senderName: 'Shri V. Prabhakar Pai',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Here is the current boundary photo taken this morning with village marker stone in view.',
      timestamp: '2026-09-23T09:12:00Z',
      timeFormatted: '09:12 AM',
      status: 'read',
      isSelf: false,
      messageType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'MSG-001-03',
      conversationId: 'CONV-001',
      senderId: 'SELF',
      senderName: 'You (RZ Operations)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Thank you Sir. We verified the demarcated coordinates with Er. Rajesh Nair. Our operator has calibrated the depth stop to 18 meters.',
      timestamp: '2026-09-23T09:20:00Z',
      timeFormatted: '09:20 AM',
      status: 'read',
      isSelf: true,
      messageType: 'text'
    },
    {
      id: 'MSG-001-04',
      conversationId: 'CONV-001',
      senderId: 'SELF',
      senderName: 'You (RZ Operations)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Sharing the per-load extraction statement for this week: 142 loads cut and dispatched under Agreement AGR-2026-001.',
      timestamp: '2026-09-23T09:25:00Z',
      timeFormatted: '09:25 AM',
      status: 'read',
      isSelf: true,
      messageType: 'document',
      fileName: 'Extraction_Statement_AGR-2026-001_Week38.pdf',
      fileSize: '1.8 MB',
      businessContext: {
        module: 'LAND',
        recordId: 'PARCEL-KSD-01',
        title: 'Agreement AGR-2026-001',
        subtitle: '142 Loads @ ₹650/Load = ₹92,300 Net Royalty',
        amountRs: 92300,
        actionLabel: 'View Settlement'
      }
    },
    {
      id: 'MSG-001-05',
      conversationId: 'CONV-001',
      senderId: 'USR-001',
      senderName: 'Shri V. Prabhakar Pai',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Voice note detailing gate access road maintenance for tomorrow afternoon.',
      timestamp: '2026-09-23T09:32:00Z',
      timeFormatted: '09:32 AM',
      status: 'read',
      isSelf: false,
      messageType: 'voice',
      voiceDurationSec: 28,
      voiceWaveform: [20, 45, 60, 80, 55, 30, 70, 95, 85, 40, 65, 75, 50, 30, 20, 40, 70, 60]
    },
    {
      id: 'MSG-001-06',
      conversationId: 'CONV-001',
      senderId: 'USR-001',
      senderName: 'Shri V. Prabhakar Pai',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Tomorrow’s dispatch from Survey 412/1A is confirmed. Please send the per-load settlement voucher.',
      timestamp: '2026-09-23T09:40:00Z',
      timeFormatted: '09:40 AM',
      status: 'read',
      isSelf: false,
      messageType: 'text',
      replyTo: {
        id: 'MSG-001-04',
        senderName: 'You (RZ Operations)',
        text: 'Sharing the per-load extraction statement for this week: 142 loads cut...'
      }
    }
  ],
  'CONV-002': [
    {
      id: 'MSG-002-01',
      conversationId: 'CONV-002',
      senderId: 'USR-002',
      senderName: 'K. Mohan Kumar',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      text: 'Good morning team. Morning safety circle completed at 06:30 AM. Primary jaw crusher #1 greased and calibrated.',
      timestamp: '2026-09-23T06:45:00Z',
      timeFormatted: '06:45 AM',
      status: 'read',
      isSelf: false,
      messageType: 'text'
    },
    {
      id: 'MSG-002-02',
      conversationId: 'CONV-002',
      senderId: 'USR-004',
      senderName: 'Suresh Shetty',
      senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      text: 'First convoy of 6 tippers entered Weighbridge 01. Tare weight registered on digital RFID.',
      timestamp: '2026-09-23T07:15:00Z',
      timeFormatted: '07:15 AM',
      status: 'read',
      isSelf: false,
      messageType: 'text'
    },
    {
      id: 'MSG-002-03',
      conversationId: 'CONV-002',
      senderId: 'SELF',
      senderName: 'You (RZ Operations)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Ensure all vehicles hauling aggregate toward NH-66 have tarpaulin covers lashed as per transport safety directive.',
      timestamp: '2026-09-23T08:00:00Z',
      timeFormatted: '08:00 AM',
      status: 'read',
      isSelf: true,
      messageType: 'text'
    },
    {
      id: 'MSG-002-04',
      conversationId: 'CONV-002',
      senderId: 'USR-002',
      senderName: 'K. Mohan Kumar',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      text: 'Mohan Kumar: 14 tippers loaded before 09:00 AM. Bench depth reached 18m. Shift handover done.',
      timestamp: '2026-09-23T09:15:00Z',
      timeFormatted: '09:15 AM',
      status: 'read',
      isSelf: false,
      messageType: 'text'
    }
  ]
};

export const DEMO_STATUSES: UserStatusItem[] = [
  {
    id: 'ST-001',
    userId: 'SELF',
    userName: 'My Status',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    mediaType: 'text',
    textContent: 'Hilltop Pit #01 running at full 1,800 MT capacity today! 🚜⛏️',
    backgroundColor: 'from-amber-600 to-yellow-600',
    createdAt: '2026-09-23T08:00:00Z',
    timeAgo: '1h ago',
    isViewed: false,
    expiresInHours: 23,
    viewersCount: 28,
    viewers: [
      { name: 'K. Mohan Kumar', time: '08:15 AM', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { name: 'Suresh Shetty', time: '08:32 AM', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
      { name: 'Farooq Mohammed', time: '08:50 AM', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'ST-002',
    userId: 'USR-001',
    userName: 'Shri V. Prabhakar Pai',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
    caption: 'Survey 412/1A boundary pillar inspection completed with RZ surveyor. Pristine laterite cut blocks.',
    createdAt: '2026-09-23T07:30:00Z',
    timeAgo: '2h ago',
    isViewed: false,
    expiresInHours: 22,
    viewersCount: 45
  },
  {
    id: 'ST-003',
    userId: 'USR-002',
    userName: 'K. Mohan Kumar',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    caption: 'New 200 TPH cone crusher stage commissioning at Crusher Plant #2. Zero vibration test passed.',
    createdAt: '2026-09-23T06:15:00Z',
    timeAgo: '3h ago',
    isViewed: false,
    expiresInHours: 21,
    viewersCount: 62
  },
  {
    id: 'ST-004',
    userId: 'USR-004',
    userName: 'Suresh Shetty',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    mediaType: 'text',
    textContent: 'Fleet convoy reaching NH-66 bypass by 11:30 AM. Safe driving in monsoon conditions 🚚🌧️',
    backgroundColor: 'from-emerald-700 to-teal-800',
    createdAt: '2026-09-22T20:00:00Z',
    timeAgo: 'Yesterday',
    isViewed: true,
    expiresInHours: 10,
    viewersCount: 38
  },
  {
    id: 'ST-005',
    userId: 'USR-008',
    userName: 'Anand K. Hegde',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
    caption: 'Ready for delivery: 2 units Komatsu PC210-10M0 with hydraulic rock breaker attachment. Contact for demo.',
    createdAt: '2026-09-22T17:00:00Z',
    timeAgo: 'Yesterday',
    isViewed: true,
    expiresInHours: 7,
    viewersCount: 94
  }
];

export const DEMO_BROADCAST_LISTS: BroadcastList[] = [
  {
    id: 'BC-001',
    name: 'Laterite Stone Quarry Customers',
    description: 'Bulk builders, civil contractors and retail depot buyers receiving daily cut-stone rates.',
    recipientsCount: 48,
    recipientIds: ['USR-001', 'USR-005', 'USR-007'],
    createdAt: '2026-08-10',
    lastSentMessage: 'Today’s first-grade machine cut laterite stone rate: ₹38/piece ex-quarry pit.',
    lastSentDate: '2026-09-23 07:00 AM',
    deliveredCount: 48,
    readCount: 42
  },
  {
    id: 'BC-002',
    name: 'Heavy Transport & Tipper Operators',
    description: 'Drivers and fleet owners receiving loading gate priority notifications and fuel subsidies.',
    recipientsCount: 32,
    recipientIds: ['USR-004'],
    createdAt: '2026-08-15',
    lastSentMessage: 'Weighbridge #2 open for express aggregate loading till 8 PM tonight.',
    lastSentDate: '2026-09-22 03:30 PM',
    deliveredCount: 32,
    readCount: 30
  },
  {
    id: 'BC-003',
    name: 'Quarry Land Owners Syndicate',
    description: 'Verified land title holders receiving quarterly royalty statements and lease index updates.',
    recipientsCount: 16,
    recipientIds: ['USR-001', 'USR-006'],
    createdAt: '2026-08-20',
    lastSentMessage: 'Q3 Per-Load Royalty reconciliations have been credited via RTGS. View statements in Land Portal.',
    lastSentDate: '2026-09-20 10:00 AM',
    deliveredCount: 16,
    readCount: 16
  }
];

export const DEMO_REELS: RzReelItem[] = [
  {
    id: 'REEL-001',
    creatorId: 'USR-002',
    creatorName: 'K. Mohan Kumar',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    creatorHandle: '@mohankumar_quarry',
    creatorBio: 'Quarrying Engineer | 18 Years Heavy Aggregate Pit Operations | RZ Minetrix Expert',
    followersCount: 14200,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-excavator-moving-earth-at-a-construction-site-34301-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80',
    caption: 'Precision hydraulic bench excavation at Hilltop Pit #01. Notice the perfect 85-degree face angle for maximum safety and block yield! 🚜🔥 #MiningTech #QuarryLife #HeavyMachinery',
    audioTrack: 'Original Sound — Minetrix Field Audio (BOS Engine)',
    likesCount: 1240,
    commentsCount: 88,
    sharesCount: 194,
    savesCount: 310,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    tags: ['#MiningTech', '#QuarryLife', '#Excavation', '#SafetyFirst'],
    comments: [
      {
        id: 'C-01',
        userName: 'Shri V. Prabhakar Pai',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Outstanding bench grooming Mohan ji! The laterite extraction boundary is maintained cleanly.',
        timeAgo: '2h ago',
        likes: 14
      },
      {
        id: 'C-02',
        userName: 'Suresh Shetty',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        text: 'Tippers loaded in under 4 minutes with this face orientation.',
        timeAgo: '1h ago',
        likes: 8
      }
    ]
  },
  {
    id: 'REEL-002',
    creatorId: 'USR-008',
    creatorName: 'Western Ghats Machinery Corp',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    creatorHandle: '@wgmc_machinery',
    creatorBio: 'Certified Mining & Earthmoving Equipment Marketplace | Sales & Rentals',
    followersCount: 28900,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-heavy-equipment-working-in-a-gravel-pit-41221-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    caption: '2021 CAT 320D2 GC with Rock Breaker walkaround test before customer handover. Smooth hydraulics and zero pump cavitation! Available on Platform 6 Marketplace. ⚙️💪 #UsedMachinery #Excavators',
    audioTrack: 'Industrial Power — RZ Audio Beats',
    likesCount: 2890,
    commentsCount: 142,
    sharesCount: 380,
    savesCount: 520,
    isLiked: true,
    isSaved: true,
    isFollowing: true,
    tags: ['#UsedMachinery', '#CATExcavator', '#HeavyEquipment', '#Marketplace'],
    comments: [
      {
        id: 'C-03',
        userName: 'Farooq Mohammed',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'What is the working hours recorded on meter? Is inspection report attached?',
        timeAgo: '4h ago',
        likes: 19
      }
    ]
  },
  {
    id: 'REEL-003',
    creatorId: 'USR-003',
    creatorName: 'Er. Rajesh Nair',
    creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    creatorHandle: '@rajesh_cadastral',
    creatorBio: 'DGPS & Drone LiDAR Surveyor for Mines & Infrastructure',
    followersCount: 8400,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-flying-over-a-quarry-in-the-mountains-43012-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
    caption: 'Drone 3D photogrammetry flyover generating sub-centimeter contour meshes for quarry royalty calculations. No more manual survey disputes! 🛰️📐 #Geospatial #QuarrySurvey #DGPS',
    audioTrack: 'Cinematic Drone Flow — Studio Sound',
    likesCount: 3410,
    commentsCount: 96,
    sharesCount: 420,
    savesCount: 680,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    tags: ['#Geospatial', '#DroneSurvey', '#LiDAR', '#MiningTechnology'],
    comments: []
  }
];

export const DEMO_NOTIFICATIONS: ChatNotificationItem[] = [
  {
    id: 'NOTIF-01',
    type: 'message',
    title: 'New Message from Shri V. Prabhakar Pai',
    body: 'Tomorrow’s dispatch from Survey 412/1A is confirmed. Please send the per-load settlement voucher.',
    timeAgo: '5 mins ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isRead: false,
    conversationId: 'CONV-001'
  },
  {
    id: 'NOTIF-02',
    type: 'order',
    title: 'Order Dispatch Update: ORD-2026-8812',
    body: 'Farooq Mohammed initiated advance payment of ₹1,20,000 for 600 MT 20mm aggregate.',
    timeAgo: '45 mins ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isRead: false,
    conversationId: 'CONV-003'
  },
  {
    id: 'NOTIF-03',
    type: 'ott_task',
    title: 'RZ® OTT Task Generated from Chat',
    body: 'Task #OTT-4491: "Arrange 14 Tippers for Survey 412/1A Dispatch" assigned to Suresh Shetty.',
    timeAgo: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    isRead: true,
    actionUrl: 'rz-ott'
  },
  {
    id: 'NOTIF-04',
    type: 'marketplace',
    title: 'Offer Received on CAT 320D2 GC',
    body: 'Buyer bid ₹32,50,000 on Listing LST-CAT-320D via Anand K. Hegde.',
    timeAgo: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isRead: true,
    conversationId: 'CONV-005'
  }
];

export const DEMO_MEDIA_ITEMS = [
  {
    id: 'MED-01',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
    title: 'Survey 412/1A Boundary Marker.jpg',
    sender: 'Shri V. Prabhakar Pai',
    date: '2026-09-23',
    size: '2.4 MB',
    conversation: 'Shri V. Prabhakar Pai'
  },
  {
    id: 'MED-02',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    title: 'Crusher Secondary Cone Stage.jpg',
    sender: 'K. Mohan Kumar',
    date: '2026-09-23',
    size: '3.1 MB',
    conversation: 'Hilltop Pit 01 & Crusher Operations'
  },
  {
    id: 'MED-03',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
    title: 'CAT 320D Hydraulic Pressure Test.jpg',
    sender: 'Anand K. Hegde',
    date: '2026-09-22',
    size: '1.9 MB',
    conversation: 'Anand K. Hegde (Machinery Dealer)'
  },
  {
    id: 'MED-04',
    type: 'video' as const,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-heavy-equipment-working-in-a-gravel-pit-41221-large.mp4',
    title: 'Excavation Cycle Bench 18m.mp4',
    sender: 'K. Mohan Kumar',
    date: '2026-09-22',
    size: '14.8 MB',
    conversation: 'Hilltop Pit 01 & Crusher Operations'
  },
  {
    id: 'MED-05',
    type: 'document' as const,
    url: '/docs/Extraction_Statement.pdf',
    title: 'Extraction_Statement_AGR-2026-001_Week38.pdf',
    sender: 'You (RZ Operations)',
    date: '2026-09-23',
    size: '1.8 MB',
    conversation: 'Shri V. Prabhakar Pai'
  },
  {
    id: 'MED-06',
    type: 'document' as const,
    url: '/docs/NH66_Aggregate_Quality_Lab_Report.pdf',
    title: 'NH66_Aggregate_Quality_Lab_Report.pdf',
    sender: 'Farooq Mohammed',
    date: '2026-09-21',
    size: '4.2 MB',
    conversation: 'Farooq Mohammed (Deccan Infra)'
  }
];

export const DEMO_FILES_ITEMS = [
  {
    id: 'FILE-01',
    name: 'Extraction_Statement_AGR-2026-001_Week38.pdf',
    fileType: 'PDF',
    size: '1.8 MB',
    sender: 'You (RZ Operations)',
    date: '2026-09-23 09:25 AM',
    conversation: 'Shri V. Prabhakar Pai',
    businessTag: 'Land Agreement AGR-2026-001'
  },
  {
    id: 'FILE-02',
    name: 'Tax_Invoice_ORD-2026-8812.pdf',
    fileType: 'PDF',
    size: '850 KB',
    sender: 'Accounts Desk',
    date: '2026-09-23 08:45 AM',
    conversation: 'Farooq Mohammed (Deccan Infra)',
    businessTag: 'Order ORD-2026-8812'
  },
  {
    id: 'FILE-03',
    name: 'DGPS_Contour_Survey_412_1A.dwg',
    fileType: 'CAD / DWG',
    size: '12.4 MB',
    sender: 'Er. Rajesh Nair',
    date: '2026-09-22 02:15 PM',
    conversation: 'Er. Rajesh Nair (Surveyor)',
    businessTag: 'Cadastral Survey'
  },
  {
    id: 'FILE-04',
    name: 'Daily_Dispatch_Weighbridge_Logs.xlsx',
    fileType: 'Excel',
    size: '2.1 MB',
    sender: 'K. Mohan Kumar',
    date: '2026-09-22 07:00 PM',
    conversation: 'Hilltop Pit 01 & Crusher Operations',
    businessTag: 'Quarry Pit Dispatch'
  },
  {
    id: 'FILE-05',
    name: 'CAT_320D_5000Hr_Service_History.pdf',
    fileType: 'PDF',
    size: '3.6 MB',
    sender: 'Anand K. Hegde',
    date: '2026-09-21 11:30 AM',
    conversation: 'Anand K. Hegde (Machinery Dealer)',
    businessTag: 'Listing LST-CAT-320D'
  }
];

export const DEMO_CHAT_METRICS = {
  totalChats: 24,
  unreadChats: 3,
  activeGroups: 8,
  messagesToday: 142,
  filesShared: 38,
  businessChats: 15,
  ottTasksCreated: 19
};
