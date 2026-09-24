/**
 * RZ® OTT — Organise Today & Tomorrow
 * Universal Task Management, Reminder, Follow-Up & Work-Organisation Engine
 * Comprehensive Data Contracts & Studio Demo Data
 */

import { SectionId } from '../types/architecture';

export type OttTaskStatus =
  | 'DRAFT'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PENDING'
  | 'SNOOZED'
  | 'BLOCKED'
  | 'CANCELLED'
  | 'OVERDUE';

export type OttTaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type OttCategory =
  | 'WORK'
  | 'PERSONAL'
  | 'FAMILY'
  | 'BUSINESS'
  | 'STUDY'
  | 'OTHER';

export type OttSourceSystem =
  | 'QUARRY'
  | 'CRUSHER'
  | 'VEHICLE'
  | 'CONTRACT_JOB'
  | 'BUILDING_MATERIALS'
  | 'MARKETPLACE'
  | 'QUARRY_LAND'
  | 'RZ_CHAT'
  | 'RZ_OTT';

export interface OttUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
  team: string;
}

export interface OttSubtask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
}

export interface OttAttachment {
  id: string;
  name: string;
  size: string;
  type: 'PDF' | 'IMAGE' | 'DOC' | 'SHEET' | 'OTHER';
  url?: string;
  uploadedAt: string;
}

export interface OttComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  attachmentName?: string;
}

export interface OttSourceMetadata {
  sourceSystem: OttSourceSystem;
  sourceModule: string;
  sourceRecordId: string;
  sourceEvent: string;
  sourceTaskId?: string;
  externalReference?: string;
  idempotencyKey?: string;
  targetSectionId: SectionId;
  sourceStatusBefore?: string;
  sourceStatusAfter?: string;
  chatMessageId?: string;
}

export interface OttTask {
  id: string;
  title: string;
  description: string;
  category: OttCategory;
  priority: OttTaskPriority;
  status: OttTaskStatus;
  assignee: OttUser;
  createdBy: OttUser;
  followers?: OttUser[];
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  startDate?: string;
  location?: string;
  source?: OttSourceMetadata;
  subtasks: OttSubtask[];
  attachments: OttAttachment[];
  comments: OttComment[];
  notes?: string;
  reminderRule: string; // e.g. "30 mins before", "At due time"
  reminderStatus: 'SCHEDULED' | 'SENT' | 'SNOOZED' | 'COMPLETED';
  repeatRule: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  snoozedUntil?: string;
  tags: string[];
  projectId?: string;
  projectName?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  activityLog: {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
  }[];
}

export interface OttFollowUp {
  id: string;
  title: string;
  contactName: string;
  contactPhone: string;
  contactRole: string;
  sourceSystem: OttSourceSystem;
  sourceRecordId: string;
  dueDate: string;
  assignedUser: OttUser;
  status: 'PENDING' | 'CONTACTED' | 'IN_DISCUSSION' | 'RESOLVED';
  priority: OttTaskPriority;
  notes: string;
  lastFollowUpTime?: string;
  createdAt: string;
}

export interface OttApproval {
  id: string;
  title: string;
  approvalType: 'EXPENSE' | 'PURCHASE' | 'SETTLEMENT' | 'AGREEMENT' | 'JOB' | 'LEAVE' | 'OTHER';
  requestedBy: OttUser;
  approver: OttUser;
  amountRs?: number;
  sourceSystem: OttSourceSystem;
  sourceRecordId: string;
  submissionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  priority: OttTaskPriority;
  details: string;
  history: {
    action: string;
    actor: string;
    timestamp: string;
    comment?: string;
  }[];
}

export interface OttProject {
  id: string;
  name: string;
  description: string;
  owner: OttUser;
  members: OttUser[];
  startDate: string;
  endDate: string;
  progressPercent: number;
  status: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  tasksCount: number;
  completedTasksCount: number;
  tags: string[];
}

export interface OttTeam {
  id: string;
  name: string;
  lead: OttUser;
  membersCount: number;
  activeTasksCount: number;
  completedTasksCount: number;
  overdueTasksCount: number;
  completionRatePercent: number;
  members: OttUser[];
}

export interface OttTemplate {
  id: string;
  title: string;
  description: string;
  category: OttCategory;
  priority: OttTaskPriority;
  sourceSystem: OttSourceSystem;
  estimatedMinutes: number;
  repeatRule: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  subtasks: string[];
  tags: string[];
}

// -------------------------------------------------------------
// DEMO USERS
// -------------------------------------------------------------
export const DEMO_OTT_USERS: OttUser[] = [
  {
    id: 'USR-001',
    name: 'Nafid Khan',
    role: 'Managing Director & Operations Head',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'nafidkhan@racezoneventures.com',
    phone: '+91 94470 00001',
    team: 'Executive Leadership'
  },
  {
    id: 'USR-002',
    name: 'Vikramaditya Singh',
    role: 'Quarry General Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'vikram.quarry@minetrix.in',
    phone: '+91 94141 22002',
    team: 'Quarry Operations'
  },
  {
    id: 'USR-003',
    name: 'Jaleel Ahmed',
    role: 'Fleet & Logistics Commander',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'jaleel.fleet@minetrix.in',
    phone: '+91 98472 33003',
    team: 'Logistics & Fleet'
  },
  {
    id: 'USR-004',
    name: 'Praveen Kumar',
    role: 'Senior Project Site Engineer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'praveen.eng@minetrix.in',
    phone: '+91 94461 44004',
    team: 'Contract & Civil Jobs'
  },
  {
    id: 'USR-005',
    name: 'Sunil Kurian',
    role: 'Crusher Maintenance Supervisor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    email: 'sunil.crusher@minetrix.in',
    phone: '+91 94950 55005',
    team: 'Crusher Operations'
  },
  {
    id: 'USR-006',
    name: 'Anand Varma',
    role: 'Commerce & Orders Lead',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    email: 'anand.sales@minetrix.in',
    phone: '+91 98460 66006',
    team: 'Commercial & Sales'
  },
  {
    id: 'USR-007',
    name: 'Moideen Haji',
    role: 'Land Acquisition & Liaison Partner',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    email: 'moideen.land@minetrix.in',
    phone: '+91 94471 77007',
    team: 'Land & Legal Affairs'
  }
];

// Current logged in user in Studio preview
export const CURRENT_USER: OttUser = DEMO_OTT_USERS[0];

// -------------------------------------------------------------
// INITIAL DEMO TASKS
// -------------------------------------------------------------
export const INITIAL_OTT_TASKS: OttTask[] = [
  {
    id: 'TASK-OTT-101',
    title: 'Schedule Periodic Service & Brake Overhaul — Tipper KL-14-Y-9201',
    description: 'Vehicle telematics flagged 12,000 km threshold. Perform brake shoe replacement, engine oil renewal, and steering knuckle greasing.',
    category: 'WORK',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    assignee: DEMO_OTT_USERS[2], // Jaleel Ahmed
    createdBy: DEMO_OTT_USERS[0], // Nafid Khan
    dueDate: '2026-09-23',
    dueTime: '11:30 AM',
    startDate: '2026-09-23',
    location: 'RZ Central Fleet Workshop, Kasaragod',
    source: {
      sourceSystem: 'VEHICLE',
      sourceModule: 'Fleet Maintenance Hub',
      sourceRecordId: 'VEH-001 (10-Wheeler Tipper)',
      sourceEvent: 'Maintenance Service Due (>12,000 km)',
      sourceTaskId: 'VEH-MAINT-9201',
      externalReference: 'JOB-CARD-FLT-881',
      targetSectionId: 'vehicle-management',
      sourceStatusBefore: 'SERVICE_OVERDUE',
      sourceStatusAfter: 'SERVICED_ROADWORTHY'
    },
    subtasks: [
      { id: 'sub-1', title: 'Check hydraulic tipper jack cylinder pressure', completed: true },
      { id: 'sub-2', title: 'Replace dual air brake booster valves', completed: true },
      { id: 'sub-3', title: 'Inspect tyre tread depth on rear tandem axles', completed: false },
      { id: 'sub-4', title: 'Road test 10km under 14 MT tare load', completed: false }
    ],
    attachments: [
      { id: 'att-1', name: 'Inspection_Checklist_VEH001.pdf', size: '1.2 MB', type: 'PDF', uploadedAt: '1 hr ago' },
      { id: 'att-2', name: 'Brake_Shoe_Invoice.pdf', size: '480 KB', type: 'PDF', uploadedAt: '30 mins ago' }
    ],
    comments: [
      {
        id: 'c-1',
        userId: 'USR-003',
        userName: 'Jaleel Ahmed',
        userAvatar: DEMO_OTT_USERS[2].avatar,
        text: 'Mechanics have dismantled the rear drums. Lining replaced. Waiting for grease kit.',
        timestamp: '10:15 AM'
      },
      {
        id: 'c-2',
        userId: 'USR-001',
        userName: 'Nafid Khan',
        userAvatar: DEMO_OTT_USERS[0].avatar,
        text: 'Priority clearance. We need this tipper on the 2 PM laterite dispatch.',
        timestamp: '10:30 AM'
      }
    ],
    reminderRule: '30 minutes before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'NONE',
    tags: ['Vehicle', 'Maintenance', 'Urgent', 'Inspection'],
    projectId: 'PRJ-002',
    projectName: 'Fleet Uptime Optimization 2026',
    estimatedMinutes: 180,
    actualMinutes: 90,
    createdAt: '2026-09-23T06:00:00Z',
    updatedAt: '2026-09-23T08:30:00Z',
    activityLog: [
      { id: 'act-1', action: 'Task created via Vehicle Telematics webhook', actor: 'System', timestamp: '06:00 AM' },
      { id: 'act-2', action: 'Assigned to Jaleel Ahmed', actor: 'Nafid Khan', timestamp: '06:15 AM' },
      { id: 'act-3', action: 'Accepted by Jaleel Ahmed', actor: 'Jaleel Ahmed', timestamp: '06:30 AM' },
      { id: 'act-4', action: 'Status changed to Started', actor: 'Jaleel Ahmed', timestamp: '08:00 AM' },
      { id: 'act-5', action: 'Subtasks 1 and 2 completed', actor: 'Jaleel Ahmed', timestamp: '08:30 AM' }
    ]
  },
  {
    id: 'TASK-OTT-102',
    title: 'Quarry Pit #02 Face Clearance & Hydraulic Wire Saw Alignment',
    description: 'Verify Bench #3 cutting orientation to maximize solid laterite block yields without edge fractures. Confirm bench safety barrier.',
    category: 'WORK',
    priority: 'HIGH',
    status: 'ACCEPTED',
    assignee: DEMO_OTT_USERS[1], // Vikramaditya Singh
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-23',
    dueTime: '01:00 PM',
    startDate: '2026-09-23',
    location: 'Quarry Pit #02, Badiadka South Face',
    source: {
      sourceSystem: 'QUARRY',
      sourceModule: 'Pit Operations & Blast Planning',
      sourceRecordId: 'PIT-002 (Badiadka Quarry)',
      sourceEvent: 'Daily Production Bench Walkthrough',
      sourceTaskId: 'Q-PROD-2026-09-02',
      externalReference: 'SURVEY-BENCH-03',
      targetSectionId: 'quarry-management',
      sourceStatusBefore: 'EXTRACTION_ONGOING',
      sourceStatusAfter: 'BENCH_VERIFIED'
    },
    subtasks: [
      { id: 'sub-201', title: 'Laser survey wire-saw cutting track azimuth', completed: true },
      { id: 'sub-202', title: 'Verify coolant water supply from holding sump', completed: true },
      { id: 'sub-203', title: 'Record block dimension test (30x20x15cm target)', completed: false }
    ],
    attachments: [
      { id: 'att-201', name: 'Pit_Face_Survey_Map.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: '2 hrs ago' }
    ],
    comments: [
      {
        id: 'c-201',
        userId: 'USR-002',
        userName: 'Vikramaditya Singh',
        userAvatar: DEMO_OTT_USERS[1].avatar,
        text: 'Wire saw track #4 is anchored. Wire tension test passed at 180 bar.',
        timestamp: '09:45 AM'
      }
    ],
    reminderRule: '1 hour before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'DAILY',
    tags: ['Quarry', 'Production', 'Safety', 'Inspection'],
    projectId: 'PRJ-001',
    projectName: 'Kasaragod Pit 2 Expansion',
    estimatedMinutes: 120,
    actualMinutes: 45,
    createdAt: '2026-09-23T07:00:00Z',
    updatedAt: '2026-09-23T09:45:00Z',
    activityLog: [
      { id: 'act-201', action: 'Task auto-dispatched by Daily Quarry Scheduler', actor: 'System', timestamp: '07:00 AM' },
      { id: 'act-202', action: 'Accepted by Vikramaditya Singh', actor: 'Vikramaditya Singh', timestamp: '07:30 AM' }
    ]
  },
  {
    id: 'TASK-OTT-103',
    title: 'Dispatch Order #ORD-LAT-8812 — 500 Laterite Blocks to Kannur Villa',
    description: 'Order confirmed with online payment clearance (₹42,500). Issue weighbridge tare slip, generate Department M-Pass, and dispatch tipper.',
    category: 'BUSINESS',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignee: DEMO_OTT_USERS[5], // Anand Varma
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-23',
    dueTime: '02:30 PM',
    startDate: '2026-09-23',
    location: 'Quarry Loading Bay #01',
    source: {
      sourceSystem: 'BUILDING_MATERIALS',
      sourceModule: 'Commerce Fulfillment & Dispatch',
      sourceRecordId: 'ORD-LAT-8812',
      sourceEvent: 'Order Payment Verified (₹42,500)',
      sourceTaskId: 'DISP-8812-KAN',
      externalReference: 'RAZORPAY-TXN-99812',
      targetSectionId: 'building-materials-ecommerce',
      sourceStatusBefore: 'AWAITING_DISPATCH',
      sourceStatusAfter: 'DISPATCHED_IN_TRANSIT'
    },
    subtasks: [
      { id: 'sub-301', title: 'Weighbridge empty tare reading', completed: true },
      { id: 'sub-302', title: 'Stack 500 first-quality laterite stones', completed: true },
      { id: 'sub-303', title: 'Generate Kerala Mining M-Pass with QR code', completed: true },
      { id: 'sub-304', title: 'Dispatch driver OTP handover', completed: false }
    ],
    attachments: [
      { id: 'att-301', name: 'Invoice_ORD_8812.pdf', size: '420 KB', type: 'PDF', uploadedAt: '3 hrs ago' },
      { id: 'att-302', name: 'M_Pass_Kerala_Dept.pdf', size: '310 KB', type: 'PDF', uploadedAt: '1 hr ago' }
    ],
    comments: [
      {
        id: 'c-301',
        userId: 'USR-006',
        userName: 'Anand Varma',
        userAvatar: DEMO_OTT_USERS[5].avatar,
        text: 'Tipper KL-14-W-3310 loaded. Tare gross weight 14.8 MT verified.',
        timestamp: '11:00 AM'
      }
    ],
    reminderRule: 'At due time',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'NONE',
    tags: ['Order', 'Dispatch', 'Customer', 'Payment'],
    estimatedMinutes: 60,
    actualMinutes: 40,
    createdAt: '2026-09-23T07:15:00Z',
    updatedAt: '2026-09-23T11:00:00Z',
    activityLog: [
      { id: 'act-301', action: 'Created from Materials E-Commerce Portal', actor: 'System', timestamp: '07:15 AM' },
      { id: 'act-302', action: 'Started by Anand Varma', actor: 'Anand Varma', timestamp: '08:30 AM' }
    ]
  },
  {
    id: 'TASK-OTT-104',
    title: 'Customer Site Visit & Soil Compaction Report — Highway NH-66 Sub-base',
    description: 'Execute site inspection at Ch. 14+200 for sub-base Granular Sub-Base (GSB) laying. Meet PWD Executive Engineer for test roll certification.',
    category: 'WORK',
    priority: 'MEDIUM',
    status: 'STARTED',
    assignee: DEMO_OTT_USERS[3], // Praveen Kumar
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-23',
    dueTime: '04:00 PM',
    startDate: '2026-09-23',
    location: 'NH-66 Project Section 4, Kasaragod Bypass',
    source: {
      sourceSystem: 'CONTRACT_JOB',
      sourceModule: 'Civil Subcontract Milestone Tracking',
      sourceRecordId: 'JOB-HWY-402',
      sourceEvent: 'Milestone 3 Compaction Test Required',
      sourceTaskId: 'JOB-INSPECT-402',
      externalReference: 'PWD-REF-M3-OCT',
      targetSectionId: 'contract-job-management',
      sourceStatusBefore: 'PROGRESS_UNDER_REVIEW',
      sourceStatusAfter: 'MILESTONE_CERTIFIED'
    },
    subtasks: [
      { id: 'sub-401', title: 'Nuclear density gauge test at 3 chainage points', completed: true },
      { id: 'sub-402', title: 'Collect 5 gravel core samples for lab gradation', completed: false },
      { id: 'sub-403', title: 'Get PWD Site Engineer signature on inspection register', completed: false }
    ],
    attachments: [
      { id: 'att-401', name: 'Contract_Milestone_Agreement.pdf', size: '3.1 MB', type: 'PDF', uploadedAt: '4 hrs ago' }
    ],
    comments: [
      {
        id: 'c-401',
        userId: 'USR-004',
        userName: 'Praveen Kumar',
        userAvatar: DEMO_OTT_USERS[3].avatar,
        text: 'At chainage 14+200 now. Compaction is 98.4%, exceeding 97% requirement.',
        timestamp: '11:15 AM'
      }
    ],
    reminderRule: '1 hour before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'NONE',
    tags: ['Job', 'Inspection', 'Customer', 'Document'],
    projectId: 'PRJ-003',
    projectName: 'Kasaragod Bypass Subcontract Phase 1',
    estimatedMinutes: 150,
    actualMinutes: 60,
    createdAt: '2026-09-23T08:00:00Z',
    updatedAt: '2026-09-23T11:15:00Z',
    activityLog: [
      { id: 'act-401', action: 'Created from Contract Job Platform', actor: 'System', timestamp: '08:00 AM' },
      { id: 'act-402', action: 'Started by Praveen Kumar', actor: 'Praveen Kumar', timestamp: '09:00 AM' }
    ]
  },
  {
    id: 'TASK-OTT-105',
    title: 'Crusher VSI #02 Bearing Greasing & Rotor Tip Wear Assessment',
    description: 'VSI Plant logged 250 operating hours. Inspect wear tips on rotor distributor plate and pump lithium-complex EP2 grease.',
    category: 'WORK',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignee: DEMO_OTT_USERS[4], // Sunil Kurian
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-23',
    dueTime: '05:30 PM',
    startDate: '2026-09-23',
    location: 'Crusher Unit #02, Badiadka',
    source: {
      sourceSystem: 'CRUSHER',
      sourceModule: 'Plant Telematics & Preventative Maintenance',
      sourceRecordId: 'CRUSH-VSI-02',
      sourceEvent: 'Operating Hours Threshold Exceeded (250h)',
      sourceTaskId: 'CRUSH-MAINT-250H',
      externalReference: 'PLC-VSI2-HOURMETER',
      targetSectionId: 'crusher-management',
      sourceStatusBefore: 'PREVENTATIVE_MAINT_PENDING',
      sourceStatusAfter: 'MAINTENANCE_LOGGED'
    },
    subtasks: [
      { id: 'sub-501', title: 'Lockout-Tagout (LOTO) main 200HP motor supply', completed: false },
      { id: 'sub-502', title: 'Measure rotor tungsten carbide wear tip thickness', completed: false },
      { id: 'sub-503', title: 'Inject 150g grease into upper & lower bearing cartridge', completed: false }
    ],
    attachments: [
      { id: 'att-501', name: 'VSI_Service_Manual_Bearing.pdf', size: '1.8 MB', type: 'PDF', uploadedAt: '5 hrs ago' }
    ],
    comments: [],
    reminderRule: '30 minutes before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'WEEKLY',
    tags: ['Crusher', 'Maintenance', 'Inspection'],
    estimatedMinutes: 90,
    createdAt: '2026-09-23T08:30:00Z',
    updatedAt: '2026-09-23T08:30:00Z',
    activityLog: [
      { id: 'act-501', action: 'Created via Crusher Sensor Telematics', actor: 'System', timestamp: '08:30 AM' }
    ]
  },
  {
    id: 'TASK-OTT-106',
    title: 'Quarry Land 42-Acre Agreement Renewal & Title Deed Verification',
    description: 'Coordinate with Revenue Department and Land Owner Moideen Haji for lease addendum renewal on survey sub-division 142/3.',
    category: 'BUSINESS',
    priority: 'MEDIUM',
    status: 'PENDING',
    assignee: DEMO_OTT_USERS[6], // Moideen Haji
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-24',
    dueTime: '10:00 AM',
    startDate: '2026-09-24',
    location: 'District Sub-Registrar Office, Kasaragod',
    source: {
      sourceSystem: 'QUARRY_LAND',
      sourceModule: 'Land Title & Lease Management',
      sourceRecordId: 'PARCEL-KAS-042',
      sourceEvent: 'Lease Renewal Window Open (30 Days Prior)',
      sourceTaskId: 'LAND-RENEW-42AC',
      externalReference: 'DEED-REG-2023-8812',
      targetSectionId: 'quarry-land-management',
      sourceStatusBefore: 'RENEWAL_PENDING',
      sourceStatusAfter: 'LEASE_EXTENDED_ACTIVE'
    },
    subtasks: [
      { id: 'sub-601', title: 'Obtain encumbrance certificate (EC) for 15 years', completed: true },
      { id: 'sub-602', title: 'Draft e-stamp lease agreement (₹500)', completed: false },
      { id: 'sub-603', title: 'Witness signature verification by local ward member', completed: false }
    ],
    attachments: [
      { id: 'att-601', name: 'Survey_Sketch_Parcel_042.pdf', size: '4.1 MB', type: 'PDF', uploadedAt: '1 day ago' }
    ],
    comments: [],
    reminderRule: '1 hour before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'NONE',
    tags: ['Land', 'Document', 'Agreement', 'Payment'],
    estimatedMinutes: 120,
    createdAt: '2026-09-22T14:00:00Z',
    updatedAt: '2026-09-22T14:00:00Z',
    activityLog: [
      { id: 'act-601', action: 'Created from Quarry Land Module', actor: 'System', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'TASK-OTT-107',
    title: 'Respond to CAT 320D Excavator Buyer Offer on Marketplace',
    description: 'Buyer Rajesh Nair made counter-offer ₹31,50,000 for CAT 320D Excavator (Listing #MKT-CAT-320D). Review valuation and reply.',
    category: 'BUSINESS',
    priority: 'URGENT',
    status: 'ACCEPTED',
    assignee: DEMO_OTT_USERS[0], // Nafid Khan
    createdBy: DEMO_OTT_USERS[5], // Anand Varma
    dueDate: '2026-09-23',
    dueTime: '06:00 PM',
    startDate: '2026-09-23',
    location: 'Online Marketplace Portal',
    source: {
      sourceSystem: 'MARKETPLACE',
      sourceModule: 'Used Machinery Marketplace',
      sourceRecordId: 'MKT-CAT-320D',
      sourceEvent: 'Counter-Offer Received (₹31.5L vs ₹33.0L Ask)',
      sourceTaskId: 'MKT-DEAL-320D',
      externalReference: 'OFFER-RN-9921',
      targetSectionId: 'used-machinery-marketplace',
      sourceStatusBefore: 'OFFER_UNDER_REVIEW',
      sourceStatusAfter: 'OFFER_ACCEPTED_INSPECTION_SET'
    },
    subtasks: [
      { id: 'sub-701', title: 'Check hydraulic pump pressure test log', completed: true },
      { id: 'sub-702', title: 'Consult asset depreciation schedule', completed: true },
      { id: 'sub-703', title: 'Schedule on-site machine trial in Kasaragod', completed: false }
    ],
    attachments: [
      { id: 'att-701', name: 'CAT_320D_Valuation_Report.pdf', size: '2.8 MB', type: 'PDF', uploadedAt: '6 hrs ago' }
    ],
    comments: [
      {
        id: 'c-701',
        userId: 'USR-006',
        userName: 'Anand Varma',
        userAvatar: DEMO_OTT_USERS[5].avatar,
        text: 'Buyer is ready with ₹5L advance token if counter ₹32L is acceptable.',
        timestamp: '09:10 AM'
      }
    ],
    reminderRule: '30 minutes before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'NONE',
    tags: ['Marketplace', 'Customer', 'Follow-up', 'Payment'],
    estimatedMinutes: 45,
    createdAt: '2026-09-23T06:30:00Z',
    updatedAt: '2026-09-23T09:10:00Z',
    activityLog: [
      { id: 'act-701', action: 'Created from Machinery Marketplace Buyer Enquiry', actor: 'System', timestamp: '06:30 AM' }
    ]
  },
  {
    id: 'TASK-OTT-108',
    title: 'Review Engineering Soil Core Lab Test — RZ Chat Dispatch',
    description: 'Dispatch message received in RZ Chat from geotechnical consultant Dr. S. K. Nambiar regarding pit bench slope stability analysis.',
    category: 'WORK',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignee: DEMO_OTT_USERS[0], // Nafid Khan
    createdBy: DEMO_OTT_USERS[1],
    dueDate: '2026-09-23',
    dueTime: '03:15 PM',
    startDate: '2026-09-23',
    location: 'RZ Chat Executive Channel',
    source: {
      sourceSystem: 'RZ_CHAT',
      sourceModule: 'Executive Channel Communications',
      sourceRecordId: 'CONV-001 (Vikramaditya GM)',
      sourceEvent: 'Chat Message Converted to OTT Action Item',
      sourceTaskId: 'CHAT-OTT-8819',
      externalReference: 'MSG-88219-GEOTECH',
      chatMessageId: 'MSG-88219',
      targetSectionId: 'rz-chating',
      sourceStatusBefore: 'MESSAGE_ACTIONABLE',
      sourceStatusAfter: 'TASK_COMPLETED_RESOLVED'
    },
    subtasks: [
      { id: 'sub-801', title: 'Examine Shear Strength Cohesion (c) and Angle (φ)', completed: true },
      { id: 'sub-802', title: 'Verify Factor of Safety (FoS > 1.35) against monsoon slips', completed: false }
    ],
    attachments: [
      { id: 'att-801', name: 'Geotech_Stability_Report_2026.pdf', size: '5.2 MB', type: 'PDF', uploadedAt: '2 hrs ago' }
    ],
    comments: [
      {
        id: 'c-801',
        userId: 'USR-002',
        userName: 'Vikramaditya Singh',
        userAvatar: DEMO_OTT_USERS[1].avatar,
        text: 'Consultant confirms 52-degree bench face angle is safe with 2m wide berms.',
        timestamp: '10:00 AM'
      }
    ],
    reminderRule: '15 minutes before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'NONE',
    tags: ['Chat', 'Document', 'Inspection', 'Urgent'],
    estimatedMinutes: 60,
    createdAt: '2026-09-23T08:15:00Z',
    updatedAt: '2026-09-23T10:00:00Z',
    activityLog: [
      { id: 'act-801', action: 'Created directly from RZ Chat Message #MSG-88219', actor: 'Vikramaditya Singh', timestamp: '08:15 AM' }
    ]
  },
  {
    id: 'TASK-OTT-109',
    title: 'Pay Kerala State Electricity Board (KSEB) High Tension Bill — Quarry Crusher Substation',
    description: 'HT Power Consumer #115549021 monthly invoice ₹1,48,290 due. Verify peak hour power factor penalty rebate.',
    category: 'BUSINESS',
    priority: 'URGENT',
    status: 'OVERDUE',
    assignee: DEMO_OTT_USERS[0],
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-22',
    dueTime: '05:00 PM',
    startDate: '2026-09-22',
    location: 'KSEB Online Payment Portal',
    source: {
      sourceSystem: 'RZ_OTT',
      sourceModule: 'Utility & Compliance Calendars',
      sourceRecordId: 'UTIL-KSEB-HT-01',
      sourceEvent: 'Monthly Utility Bill Due Date',
      targetSectionId: 'rz-ott',
      sourceStatusBefore: 'DUE',
      sourceStatusAfter: 'PAID'
    },
    subtasks: [
      { id: 'sub-901', title: 'Download HT bill meter consumption log', completed: true },
      { id: 'sub-902', title: 'Authorize RTGS payment transfer via Bank of Baroda', completed: false }
    ],
    attachments: [
      { id: 'att-901', name: 'KSEB_HT_Bill_September.pdf', size: '780 KB', type: 'PDF', uploadedAt: '2 days ago' }
    ],
    comments: [
      {
        id: 'c-901',
        userId: 'USR-001',
        userName: 'Nafid Khan',
        userAvatar: DEMO_OTT_USERS[0].avatar,
        text: 'Accounts team confirmed fund transfer ready. Submitting RTGS now.',
        timestamp: '11:45 AM'
      }
    ],
    reminderRule: 'At due time',
    reminderStatus: 'SNOOZED',
    snoozedUntil: 'Today, 02:00 PM',
    repeatRule: 'MONTHLY',
    tags: ['Payment', 'Urgent', 'Approval'],
    estimatedMinutes: 30,
    createdAt: '2026-09-21T09:00:00Z',
    updatedAt: '2026-09-23T11:45:00Z',
    activityLog: [
      { id: 'act-901', action: 'Created via Monthly Compliance Recurrence', actor: 'System', timestamp: '2 days ago' },
      { id: 'act-902', action: 'Overdue detected: +1 day overdue', actor: 'System', timestamp: 'Yesterday' },
      { id: 'act-903', action: 'Snoozed until 2:00 PM today', actor: 'Nafid Khan', timestamp: '09:00 AM' }
    ]
  },
  {
    id: 'TASK-OTT-110',
    title: 'Family: Pick up School Books & Science Project Kit for Rayan',
    description: 'Collect 8th grade science robotics kit and lab notebook from National Stationery, Kasaragod Town.',
    category: 'FAMILY',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    assignee: DEMO_OTT_USERS[0],
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-23',
    dueTime: '06:30 PM',
    startDate: '2026-09-23',
    location: 'National Book Stall, Kasaragod',
    source: {
      sourceSystem: 'RZ_OTT',
      sourceModule: 'Personal & Family Life Organizer',
      sourceRecordId: 'PERS-FAM-08',
      sourceEvent: 'Manual Personal Entry',
      targetSectionId: 'rz-ott'
    },
    subtasks: [
      { id: 'sub-1001', title: 'Verify Arduino sensor shield included', completed: false },
      { id: 'sub-1002', title: 'Pick up 200-page ruled project files', completed: false }
    ],
    attachments: [],
    comments: [],
    reminderRule: '1 hour before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'NONE',
    tags: ['Family', 'Personal'],
    estimatedMinutes: 40,
    createdAt: '2026-09-23T07:45:00Z',
    updatedAt: '2026-09-23T07:45:00Z',
    activityLog: [
      { id: 'act-1001', action: 'Created by Nafid Khan', actor: 'Nafid Khan', timestamp: '07:45 AM' }
    ]
  },
  {
    id: 'TASK-OTT-111',
    title: 'Study: Review DGMS Mine Foreman Certification Exam Module #4',
    description: 'Complete revision of Coal & Metal Mines Regulations 2026: Pit Slope Stability, Explosives Magazine Storage, and Blasting Safety Distances.',
    category: 'STUDY',
    priority: 'LOW',
    status: 'ASSIGNED',
    assignee: DEMO_OTT_USERS[0],
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-23',
    dueTime: '08:30 PM',
    startDate: '2026-09-23',
    location: 'Home Study Desk',
    source: {
      sourceSystem: 'RZ_OTT',
      sourceModule: 'Professional Education & Certification',
      sourceRecordId: 'STUDY-DGMS-04',
      sourceEvent: 'Weekly Learning Milestone',
      targetSectionId: 'rz-ott'
    },
    subtasks: [
      { id: 'sub-1101', title: 'Solve 20 mock questions on DGMS Circular 2025', completed: false },
      { id: 'sub-1102', title: 'Review explosives safety perimeter calculations', completed: false }
    ],
    attachments: [
      { id: 'att-1101', name: 'DGMS_Foreman_Module4.pdf', size: '6.4 MB', type: 'PDF', uploadedAt: 'Yesterday' }
    ],
    comments: [],
    reminderRule: '30 minutes before',
    reminderStatus: 'SCHEDULED',
    repeatRule: 'DAILY',
    tags: ['Study', 'Personal'],
    estimatedMinutes: 60,
    createdAt: '2026-09-23T08:00:00Z',
    updatedAt: '2026-09-23T08:00:00Z',
    activityLog: [
      { id: 'act-1101', action: 'Created by Nafid Khan', actor: 'Nafid Khan', timestamp: '08:00 AM' }
    ]
  },
  {
    id: 'TASK-OTT-112',
    title: 'Personal: Renew Passport Emigration Clearance Registration (ECR)',
    description: 'Upload updated GCC visit visa copy and residential proof to Passport Seva Portal for upcoming Dubai Heavy Equipment Expo.',
    category: 'PERSONAL',
    priority: 'LOW',
    status: 'COMPLETED',
    assignee: DEMO_OTT_USERS[0],
    createdBy: DEMO_OTT_USERS[0],
    dueDate: '2026-09-23',
    dueTime: '09:00 AM',
    startDate: '2026-09-23',
    location: 'Passport Seva Kendra Online',
    source: {
      sourceSystem: 'RZ_OTT',
      sourceModule: 'Personal Documents Vault',
      sourceRecordId: 'PERS-DOC-PASSPORT',
      sourceEvent: 'Document Renewal Deadline',
      targetSectionId: 'rz-ott'
    },
    subtasks: [
      { id: 'sub-1201', title: 'Scan front and back passport pages', completed: true },
      { id: 'sub-1202', title: 'Pay portal verification fee ₹1,500', completed: true }
    ],
    attachments: [
      { id: 'att-1201', name: 'Passport_Acknowledgement_Slip.pdf', size: '320 KB', type: 'PDF', uploadedAt: '1 hr ago' }
    ],
    comments: [],
    reminderRule: 'At due time',
    reminderStatus: 'COMPLETED',
    repeatRule: 'NONE',
    completedAt: '2026-09-23T09:15:00Z',
    tags: ['Personal', 'Document'],
    estimatedMinutes: 30,
    actualMinutes: 25,
    createdAt: '2026-09-23T07:00:00Z',
    updatedAt: '2026-09-23T09:15:00Z',
    activityLog: [
      { id: 'act-1201', action: 'Created by Nafid Khan', actor: 'Nafid Khan', timestamp: '07:00 AM' },
      { id: 'act-1202', action: 'Completed and acknowledgement uploaded', actor: 'Nafid Khan', timestamp: '09:15 AM' }
    ]
  }
];

// -------------------------------------------------------------
// DEMO FOLLOW-UPS
// -------------------------------------------------------------
export const DEMO_OTT_FOLLOW_UPS: OttFollowUp[] = [
  {
    id: 'FLW-001',
    title: 'Customer Call: Arjun Varma Kannur Villa Rate Negotiation',
    contactName: 'Arjun Varma',
    contactPhone: '+91 98471 22991',
    contactRole: 'Private Villa Client',
    sourceSystem: 'RZ_CHAT',
    sourceRecordId: 'CHAT-MSG-7821',
    dueDate: 'Today, 02:00 PM',
    assignedUser: DEMO_OTT_USERS[5], // Anand Varma
    status: 'PENDING',
    priority: 'HIGH',
    notes: 'Client requested all-inclusive rate for 2,500 blocks laterite stones. Quote ₹42/block delivered.',
    createdAt: '2026-09-23T08:00:00Z'
  },
  {
    id: 'FLW-002',
    title: 'Supplier Response: UltraTech Cement Bulk Tanker Dispatch Date',
    contactName: 'Suresh Menon / UltraTech Depot',
    contactPhone: '+91 94472 88123',
    contactRole: 'Cement Supplier Lead',
    sourceSystem: 'BUILDING_MATERIALS',
    sourceRecordId: 'PO-CEM-8821',
    dueDate: 'Today, 04:00 PM',
    assignedUser: DEMO_OTT_USERS[5],
    status: 'IN_DISCUSSION',
    priority: 'MEDIUM',
    notes: 'Confirm 25 MT bulk fly-ash OPC 53 delivery scheduled for Thursday morning.',
    lastFollowUpTime: '10:30 AM',
    createdAt: '2026-09-23T08:30:00Z'
  },
  {
    id: 'FLW-003',
    title: 'Buyer Enquiry: Highland Minerals 42-Acre Quarry Concession Lease',
    contactName: 'Tariq Al-Mansoor / Highland Minerals',
    contactPhone: '+971 50 123 4567',
    contactRole: 'Institutional Mining Investor',
    sourceSystem: 'QUARRY_LAND',
    sourceRecordId: 'LAND-42AC-KAS',
    dueDate: 'Today, 05:00 PM',
    assignedUser: DEMO_OTT_USERS[6], // Moideen Haji
    status: 'PENDING',
    priority: 'HIGH',
    notes: 'Schedule in-person site walk and deed review at Badiadka North concession.',
    createdAt: '2026-09-23T07:00:00Z'
  },
  {
    id: 'FLW-004',
    title: 'Land Owner Discussion: Surface Royalty Settlement for Q3',
    contactName: 'P. K. Abdul Rahiman',
    contactPhone: '+91 94460 33112',
    contactRole: 'Quarry Land Owner (Survey 142/2)',
    sourceSystem: 'QUARRY',
    sourceRecordId: 'PIT-001-ROYALTY',
    dueDate: 'Tomorrow, 11:00 AM',
    assignedUser: DEMO_OTT_USERS[1], // Vikramaditya Singh
    status: 'PENDING',
    priority: 'MEDIUM',
    notes: 'Present Q3 quarry block extraction log (18,400 blocks). Hand over royalty draft check ₹1,84,000.',
    createdAt: '2026-09-22T15:00:00Z'
  },
  {
    id: 'FLW-005',
    title: 'Payment Collection: PWD Highway Milestone 2 Retention Release (₹14,50,000)',
    contactName: 'Executive Engineer K. Sukumaran',
    contactPhone: '+91 94470 55888',
    contactRole: 'PWD Roads Division',
    sourceSystem: 'CONTRACT_JOB',
    sourceRecordId: 'JOB-HWY-402',
    dueDate: 'Tomorrow, 03:00 PM',
    assignedUser: DEMO_OTT_USERS[3], // Praveen Kumar
    status: 'CONTACTED',
    priority: 'URGENT',
    notes: 'Bill audited by Treasury. Follow up on electronic voucher clearance.',
    lastFollowUpTime: 'Yesterday, 04:00 PM',
    createdAt: '2026-09-21T11:00:00Z'
  }
];

// -------------------------------------------------------------
// DEMO APPROVALS
// -------------------------------------------------------------
export const DEMO_OTT_APPROVALS: OttApproval[] = [
  {
    id: 'APPR-001',
    title: 'Explosives Slurry Booster Purchase Requisition (500 kg ANFO)',
    approvalType: 'PURCHASE',
    requestedBy: DEMO_OTT_USERS[1], // Vikramaditya GM
    approver: DEMO_OTT_USERS[0], // Nafid Khan
    amountRs: 425000,
    sourceSystem: 'QUARRY',
    sourceRecordId: 'PO-EXP-2026-09',
    submissionDate: '2026-09-23T08:00:00Z',
    status: 'PENDING',
    priority: 'URGENT',
    details: 'Immediate purchase of 500 kg ANFO and 250 electric detonators for Pit #01 south face controlled blasting. PESO magazine license valid.',
    history: [
      { action: 'Submitted by Vikramaditya Singh', actor: 'Vikramaditya Singh', timestamp: '08:00 AM' },
      { action: 'Safety Officer pre-checked PESO quota', actor: 'Safety Lead', timestamp: '08:30 AM' }
    ]
  },
  {
    id: 'APPR-002',
    title: 'Crusher VSI Rotor Tip Ceramic Plate Replacement PO',
    approvalType: 'PURCHASE',
    requestedBy: DEMO_OTT_USERS[4], // Sunil Kurian
    approver: DEMO_OTT_USERS[0],
    amountRs: 185000,
    sourceSystem: 'CRUSHER',
    sourceRecordId: 'PO-CRUSH-VSI-88',
    submissionDate: '2026-09-23T07:30:00Z',
    status: 'PENDING',
    priority: 'HIGH',
    details: 'Tungsten carbide composite rotor tip wear plate set for Badiadka VSI #02. Required to prevent rotor housing pitting.',
    history: [
      { action: 'Requisition logged by Sunil Kurian', actor: 'Sunil Kurian', timestamp: '07:30 AM' }
    ]
  },
  {
    id: 'APPR-003',
    title: 'Land Owner Quarterly Royalty Settlement — Survey 142/2 (₹1,84,000)',
    approvalType: 'SETTLEMENT',
    requestedBy: DEMO_OTT_USERS[6], // Moideen Haji
    approver: DEMO_OTT_USERS[0],
    amountRs: 184000,
    sourceSystem: 'QUARRY_LAND',
    sourceRecordId: 'SETTL-ROY-Q3-01',
    submissionDate: '2026-09-22T16:00:00Z',
    status: 'APPROVED',
    priority: 'MEDIUM',
    details: 'Calculated at ₹10 per block extracted (18,400 blocks verified by weighbridge M-Pass log). Approved for RTGS disbursement.',
    history: [
      { action: 'Calculated & verified with weighbridge log', actor: 'Moideen Haji', timestamp: 'Yesterday, 04:00 PM' },
      { action: 'Approved by Nafid Khan', actor: 'Nafid Khan', timestamp: 'Today, 08:15 AM', comment: 'Verified against weighbridge tare data.' }
    ]
  },
  {
    id: 'APPR-004',
    title: 'Fleet Driver Medical & Overtime Allowance Batch #38',
    approvalType: 'EXPENSE',
    requestedBy: DEMO_OTT_USERS[2], // Jaleel Ahmed
    approver: DEMO_OTT_USERS[0],
    amountRs: 76500,
    sourceSystem: 'VEHICLE',
    sourceRecordId: 'EXP-FLT-BATCH-38',
    submissionDate: '2026-09-23T09:00:00Z',
    status: 'PENDING',
    priority: 'LOW',
    details: 'Overtime allowance for 8 tipper drivers handling night bypass haulage plus annual eye inspection camp costs.',
    history: [
      { action: 'Submitted by Jaleel Ahmed', actor: 'Jaleel Ahmed', timestamp: '09:00 AM' }
    ]
  },
  {
    id: 'APPR-005',
    title: 'Civil Subcontract Variation Order VO-04 — NH-66 Culvert Extension',
    approvalType: 'JOB',
    requestedBy: DEMO_OTT_USERS[3], // Praveen Kumar
    approver: DEMO_OTT_USERS[0],
    amountRs: 340000,
    sourceSystem: 'CONTRACT_JOB',
    sourceRecordId: 'VO-HWY-04',
    submissionDate: '2026-09-22T11:00:00Z',
    status: 'PENDING',
    priority: 'HIGH',
    details: 'Client PWD requested 3.5m culvert length addition to accommodate storm drainage widening.',
    history: [
      { action: 'Submitted with structural drawing', actor: 'Praveen Kumar', timestamp: 'Yesterday, 11:00 AM' }
    ]
  }
];

// -------------------------------------------------------------
// DEMO PROJECTS
// -------------------------------------------------------------
export const DEMO_OTT_PROJECTS: OttProject[] = [
  {
    id: 'PRJ-001',
    name: 'Kasaragod Pit #02 Capacity Expansion',
    description: 'Developing Bench #3 and #4 wire-saw extraction tracks, road widening, and drainage culvert installation for 4,000 blocks/day target.',
    owner: DEMO_OTT_USERS[0],
    members: [DEMO_OTT_USERS[0], DEMO_OTT_USERS[1], DEMO_OTT_USERS[2]],
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    progressPercent: 42,
    status: 'ACTIVE',
    tasksCount: 18,
    completedTasksCount: 8,
    tags: ['Quarry', 'Expansion', 'Civil']
  },
  {
    id: 'PRJ-002',
    name: 'Fleet Uptime & Telematics Optimization 2026',
    description: 'Equipping all 14 commercial tippers with real-time CAN-bus OBD telematics, tire pressure monitoring, and scheduled preventive maintenance.',
    owner: DEMO_OTT_USERS[2],
    members: [DEMO_OTT_USERS[0], DEMO_OTT_USERS[2]],
    startDate: '2026-08-15',
    endDate: '2026-10-15',
    progressPercent: 68,
    status: 'ACTIVE',
    tasksCount: 12,
    completedTasksCount: 8,
    tags: ['Fleet', 'Telematics', 'Maintenance']
  },
  {
    id: 'PRJ-003',
    name: 'Kasaragod Bypass Subcontract Phase 1',
    description: 'Supplying 45,000 MT of 40mm & 20mm aggregates and executing sub-base laying for NH-66 4-lane bypass package.',
    owner: DEMO_OTT_USERS[3],
    members: [DEMO_OTT_USERS[0], DEMO_OTT_USERS[3], DEMO_OTT_USERS[4]],
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    progressPercent: 55,
    status: 'ACTIVE',
    tasksCount: 24,
    completedTasksCount: 14,
    tags: ['Contract', 'PWD', 'Aggregates']
  },
  {
    id: 'PRJ-004',
    name: 'Badiadka VSI #02 Sand Quality Automation',
    description: 'Upgrading tertiary impact crusher with variable frequency drive (VFD) and automated moisture sensor for manufactured sand (M-Sand).',
    owner: DEMO_OTT_USERS[4],
    members: [DEMO_OTT_USERS[0], DEMO_OTT_USERS[4]],
    startDate: '2026-09-10',
    endDate: '2026-10-30',
    progressPercent: 28,
    status: 'PLANNING',
    tasksCount: 10,
    completedTasksCount: 3,
    tags: ['Crusher', 'M-Sand', 'Automation']
  }
];

// -------------------------------------------------------------
// DEMO TEAMS
// -------------------------------------------------------------
export const DEMO_OTT_TEAMS: OttTeam[] = [
  {
    id: 'TEAM-QUARRY',
    name: 'Quarry Operations Team',
    lead: DEMO_OTT_USERS[1],
    membersCount: 18,
    activeTasksCount: 14,
    completedTasksCount: 88,
    overdueTasksCount: 1,
    completionRatePercent: 94,
    members: [DEMO_OTT_USERS[1], DEMO_OTT_USERS[0]]
  },
  {
    id: 'TEAM-CRUSHER',
    name: 'Crusher Maintenance & Production',
    lead: DEMO_OTT_USERS[4],
    membersCount: 12,
    activeTasksCount: 9,
    completedTasksCount: 64,
    overdueTasksCount: 0,
    completionRatePercent: 96,
    members: [DEMO_OTT_USERS[4], DEMO_OTT_USERS[0]]
  },
  {
    id: 'TEAM-FLEET',
    name: 'Fleet Logistics & Transport',
    lead: DEMO_OTT_USERS[2],
    membersCount: 22,
    activeTasksCount: 19,
    completedTasksCount: 142,
    overdueTasksCount: 2,
    completionRatePercent: 91,
    members: [DEMO_OTT_USERS[2], DEMO_OTT_USERS[0]]
  },
  {
    id: 'TEAM-SALES',
    name: 'Sales, E-Commerce & Commerce',
    lead: DEMO_OTT_USERS[5],
    membersCount: 8,
    activeTasksCount: 11,
    completedTasksCount: 112,
    overdueTasksCount: 1,
    completionRatePercent: 93,
    members: [DEMO_OTT_USERS[5], DEMO_OTT_USERS[0]]
  },
  {
    id: 'TEAM-CIVIL',
    name: 'Contract & Civil Projects',
    lead: DEMO_OTT_USERS[3],
    membersCount: 15,
    activeTasksCount: 16,
    completedTasksCount: 79,
    overdueTasksCount: 1,
    completionRatePercent: 89,
    members: [DEMO_OTT_USERS[3], DEMO_OTT_USERS[0]]
  },
  {
    id: 'TEAM-LAND',
    name: 'Land & Legal Affairs',
    lead: DEMO_OTT_USERS[6],
    membersCount: 5,
    activeTasksCount: 6,
    completedTasksCount: 38,
    overdueTasksCount: 0,
    completionRatePercent: 98,
    members: [DEMO_OTT_USERS[6], DEMO_OTT_USERS[0]]
  }
];

// -------------------------------------------------------------
// SMART TASK TEMPLATES
// -------------------------------------------------------------
export const SMART_TASK_TEMPLATES: OttTemplate[] = [
  // Vehicle templates
  {
    id: 'TPL-VEH-01',
    title: 'Daily Pre-Trip Commercial Vehicle Safety Walkaround',
    description: 'Mandatory pre-ignition check for 6-wheeler / 10-wheeler tippers before leaving pit loading bay.',
    category: 'WORK',
    priority: 'HIGH',
    sourceSystem: 'VEHICLE',
    estimatedMinutes: 20,
    repeatRule: 'DAILY',
    subtasks: [
      'Check engine oil dipstick level and coolant reservoir',
      'Inspect tire air pressure and look for sidewall bulges',
      'Verify air brake line pressure build-up (> 8 bar)',
      'Test horn, reverse beeper alarm and all turn indicator lights',
      'Ensure vehicle valid PUC & Insurance copy inside glovebox'
    ],
    tags: ['Vehicle', 'Safety', 'Inspection', 'Daily']
  },
  {
    id: 'TPL-VEH-02',
    title: 'Tipper Commercial Vehicle Insurance & Fitness Renewal',
    description: 'End-to-end statutory document verification and renewal at Regional Transport Office (RTO).',
    category: 'WORK',
    priority: 'URGENT',
    sourceSystem: 'VEHICLE',
    estimatedMinutes: 60,
    repeatRule: 'NONE',
    subtasks: [
      'Download national insurance premium quote',
      'Clear pending RTO e-challans online',
      'Schedule brake test and chassis inspection at RTO Kasaragod',
      'Upload updated digital fitness certificate to RZ Fleet Vault'
    ],
    tags: ['Vehicle', 'Document', 'Renewal']
  },
  // Quarry templates
  {
    id: 'TPL-QUARRY-01',
    title: 'Daily Quarry Shift Bench Walkthrough & Production Pass',
    description: 'Morning safety and extraction yield assessment across active pit benches.',
    category: 'WORK',
    priority: 'HIGH',
    sourceSystem: 'QUARRY',
    estimatedMinutes: 45,
    repeatRule: 'DAILY',
    subtasks: [
      'Check bench edge berms and wire saw rock anchors',
      'Inspect wire-saw diamond bead wear and coolant flow',
      'Verify excavator operator attendance and shift quota',
      'Log daily block extraction count in RZ Quarry Platform'
    ],
    tags: ['Quarry', 'Inspection', 'Production', 'Safety']
  },
  {
    id: 'TPL-QUARRY-02',
    title: 'Quarry Land Owner Surface Royalty Reconciliation',
    description: 'Monthly block count audit and landowner draft voucher generation.',
    category: 'BUSINESS',
    priority: 'MEDIUM',
    sourceSystem: 'QUARRY',
    estimatedMinutes: 40,
    repeatRule: 'MONTHLY',
    subtasks: [
      'Cross-check weighbridge tare slips with pit supervisor log',
      'Apply lease agreement royalty rate per block (₹10/block)',
      'Prepare summary statement and get owner sign-off'
    ],
    tags: ['Quarry', 'Land', 'Payment', 'Settlement']
  },
  // Crusher templates
  {
    id: 'TPL-CRUSHER-01',
    title: 'Crusher Plant Weekly Preventive Maintenance',
    description: 'Comprehensive inspection of primary jaw crusher, vibrating screens, and conveyor belts.',
    category: 'WORK',
    priority: 'HIGH',
    sourceSystem: 'CRUSHER',
    estimatedMinutes: 120,
    repeatRule: 'WEEKLY',
    subtasks: [
      'Lockout/Tagout (LOTO) all primary breaker switches',
      'Check jaw crusher toggle plate wear and tension rod spring',
      'Inspect conveyor belts for tears, tracking alignment and roller bearings',
      'Grease high-speed eccentric shaft bearings'
    ],
    tags: ['Crusher', 'Maintenance', 'Safety']
  },
  // Jobs templates
  {
    id: 'TPL-JOB-01',
    title: 'Subcontract Milestone Site Visit & Compaction Test',
    description: 'Civil engineering progress audit and PWD engineer certification.',
    category: 'WORK',
    priority: 'HIGH',
    sourceSystem: 'CONTRACT_JOB',
    estimatedMinutes: 90,
    repeatRule: 'NONE',
    subtasks: [
      'Measure layer thickness using surveyor optical level',
      'Perform field dry density test using sand replacement method',
      'Record chainage test points on measurement book (MB)',
      'Get site engineer sign-off on milestone bill'
    ],
    tags: ['Job', 'Inspection', 'Customer']
  },
  // Commerce templates
  {
    id: 'TPL-COMM-01',
    title: 'Building Materials Customer Order Delivery Follow-Up',
    description: 'Post-delivery dispatch confirmation, tare slip verification, and customer review.',
    category: 'BUSINESS',
    priority: 'MEDIUM',
    sourceSystem: 'BUILDING_MATERIALS',
    estimatedMinutes: 30,
    repeatRule: 'NONE',
    subtasks: [
      'Verify GPS delivery drop-off coordinates at construction site',
      'Collect digital signature on electronic Proof of Delivery (e-POD)',
      'Send WhatsApp delivery invoice to customer'
    ],
    tags: ['Order', 'Customer', 'Delivery']
  },
  // Land templates
  {
    id: 'TPL-LAND-01',
    title: 'Quarry Land Parcel Legal Due Diligence & Survey Verification',
    description: 'Title deeds, encumbrance check, and mining lease boundary demarcation.',
    category: 'BUSINESS',
    priority: 'HIGH',
    sourceSystem: 'QUARRY_LAND',
    estimatedMinutes: 120,
    repeatRule: 'NONE',
    subtasks: [
      'Verify 30-year Encumbrance Certificate (EC) from Sub-Registrar',
      'Conduct DGPS boundary survey with village revenue officer',
      'Verify forest buffer clearance distance (> 100m)',
      'Draft lease addendum agreement'
    ],
    tags: ['Land', 'Document', 'Legal', 'Inspection']
  }
];

// -------------------------------------------------------------
// NOTIFICATIONS DEMO DATA
// -------------------------------------------------------------
export interface OttNotificationItem {
  id: string;
  type:
    | 'TASK_ASSIGNED'
    | 'TASK_ACCEPTED'
    | 'TASK_STARTED'
    | 'TASK_COMPLETED'
    | 'TASK_OVERDUE'
    | 'REMINDER'
    | 'MENTION'
    | 'APPROVAL_REQUEST'
    | 'APPROVAL_RESULT'
    | 'FOLLOW_UP_DUE';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  taskId?: string;
  sourceSystem?: OttSourceSystem;
}

export const INITIAL_OTT_NOTIFICATIONS: OttNotificationItem[] = [
  {
    id: 'notif-1',
    type: 'TASK_OVERDUE',
    title: 'Overdue Task Alert',
    message: 'Task "Pay Kerala State Electricity Board HT Bill" is 1 day overdue. Please authorize payment.',
    timestamp: '15 mins ago',
    read: false,
    taskId: 'TASK-OTT-109',
    sourceSystem: 'RZ_OTT'
  },
  {
    id: 'notif-2',
    type: 'APPROVAL_REQUEST',
    title: 'Approval Required: Explosives Purchase',
    message: 'Vikramaditya Singh requested clearance for PO-EXP-2026-09 (₹4,25,000).',
    timestamp: '45 mins ago',
    read: false,
    taskId: 'TASK-OTT-102',
    sourceSystem: 'QUARRY'
  },
  {
    id: 'notif-3',
    type: 'TASK_STARTED',
    title: 'Task Started',
    message: 'Jaleel Ahmed started task: Schedule Periodic Service — Tipper KL-14-Y-9201.',
    timestamp: '1 hour ago',
    read: true,
    taskId: 'TASK-OTT-101',
    sourceSystem: 'VEHICLE'
  },
  {
    id: 'notif-4',
    type: 'REMINDER',
    title: 'Gentle Reminder: Quarry Wire Saw Inspection',
    message: 'Quarry Pit #02 Face Clearance & Hydraulic Wire Saw Alignment is due in 1 hour.',
    timestamp: '2 hours ago',
    read: true,
    taskId: 'TASK-OTT-102',
    sourceSystem: 'QUARRY'
  },
  {
    id: 'notif-5',
    type: 'FOLLOW_UP_DUE',
    title: 'Follow-up Due: Customer Call',
    message: 'Call Arjun Varma for Kannur Villa rate negotiation at 02:00 PM.',
    timestamp: '3 hours ago',
    read: true,
    sourceSystem: 'RZ_CHAT'
  }
];
