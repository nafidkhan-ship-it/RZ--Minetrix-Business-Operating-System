/**
 * RZ® MINETRIX BOS - Cross-Platform OTT Connection Engine
 * Universal Bridge connecting all 10 primary platforms to RZ® OTT & Notification Center
 * Implements Event Model: source_system, source_module, source_record_id, source_event, idempotency_key
 */

export type OTTItemType = 'TASK' | 'REMINDER' | 'FOLLOW_UP';
export type OTTItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type OTTSourceSystem =
  | 'QUARRY'
  | 'CRUSHER'
  | 'VEHICLE'
  | 'JOB'
  | 'ORDER'
  | 'LAND'
  | 'CHAT'
  | 'WORKFLOW'
  | 'FINANCE'
  | 'HR'
  | 'PERSONAL';

export interface OTTConnectedItem {
  id: string;
  title: string;
  description: string;
  type: OTTItemType;
  status: OTTItemStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timeSlot: string; // e.g. '09:00 AM', '10:00 AM', etc.
  dueDate: string;
  assigneeName: string;
  assigneeRole: string;
  // Source Metadata (Event Model)
  source_system: OTTSourceSystem;
  source_module: string;
  source_record_id: string;
  source_event: string;
  source_task_id: string;
  external_reference?: string;
  idempotency_key: string;
  // Two-way sync status
  sourceStatusBefore: string;
  sourceStatusAfter: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface OTTNotification {
  id: string;
  title: string;
  message: string;
  category: 'Tasks' | 'Orders' | 'Jobs' | 'Vehicles' | 'Documents' | 'Finance' | 'Chat' | 'Approvals' | 'Marketplace' | 'Land' | 'System';
  sourceSystem: OTTSourceSystem;
  sourceRecordId: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

const STORAGE_KEY_OTT = 'rz_minetrix_connected_ott_items';
const STORAGE_KEY_NOTIFS = 'rz_minetrix_notifications';

// Initial pre-seeded connected ecosystem tasks across the 10 primary platforms
const INITIAL_CONNECTED_ITEMS: OTTConnectedItem[] = [
  {
    id: 'OTT-001',
    title: 'Vehicle Insurance Renewal — Tipper KL-14-Y-9201',
    description: 'National Insurance commercial policy expiring in 7 days. Verify fitness certificate and deposit renewal premium.',
    type: 'REMINDER',
    status: 'PENDING',
    priority: 'HIGH',
    timeSlot: '09:00 AM',
    dueDate: 'Today',
    assigneeName: 'Jaleel Ahmed / Fleet Manager',
    assigneeRole: 'DRIVER',
    source_system: 'VEHICLE',
    source_module: 'INSURANCE',
    source_record_id: 'VEH-001',
    source_event: 'INSURANCE_EXPIRING',
    source_task_id: 'VEH-DOC-9201',
    external_reference: 'POL-NIC-2025-9921',
    idempotency_key: 'VEH_INS_VEH-001_2026_09',
    sourceStatusBefore: 'EXPIRING_SOON',
    sourceStatusAfter: 'RENEWED_VALID',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'OTT-002',
    title: 'Quarry Pit #01 Bench Cutting & Production Review',
    description: 'Verify Laterite stone hydraulic wire-saw alignment on Bench #3 and log 1,250 blocks daily output pass.',
    type: 'TASK',
    status: 'PENDING',
    priority: 'HIGH',
    timeSlot: '10:00 AM',
    dueDate: 'Today',
    assigneeName: 'Rajesh Nambiar / Ramesh Gowda',
    assigneeRole: 'SUPERVISOR',
    source_system: 'QUARRY',
    source_module: 'PRODUCTION',
    source_record_id: 'QUARRY-PIT-01',
    source_event: 'DAILY_PRODUCTION_REVIEW',
    source_task_id: 'Q-PROD-2026-09-01',
    external_reference: 'BENCH-03-CUTTING',
    idempotency_key: 'QUARRY_PROD_PIT01_DAILY',
    sourceStatusBefore: 'IN_EXTRACTION',
    sourceStatusAfter: 'LOGGED_VERIFIED',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'OTT-003',
    title: 'Customer Quotation — 2,500 Laterite Stones (Kannur Villa)',
    description: 'Client Arjun Varma requested all-inclusive rate for 30x20x15cm laterite stones with 10-wheeler tipper transport.',
    type: 'FOLLOW_UP',
    status: 'PENDING',
    priority: 'MEDIUM',
    timeSlot: '11:30 AM',
    dueDate: 'Today',
    assigneeName: 'Anand Varma',
    assigneeRole: 'SALES',
    source_system: 'CHAT',
    source_module: 'COMMERCIAL_QUOTATION',
    source_record_id: 'CHAT-MSG-7821',
    source_event: 'CUSTOMER_WANTS_QUOTATION',
    source_task_id: 'QUOTE-LAT-9921',
    external_reference: 'CUST-ARJUN-KANNUR',
    idempotency_key: 'CHAT_QUOTE_7821',
    sourceStatusBefore: 'ENQUIRY_OPEN',
    sourceStatusAfter: 'QUOTATION_SENT',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'OTT-004',
    title: 'Laterite Stone Order Dispatch & Vehicle Assignment',
    description: 'Order #ORD-LAT-8812 confirmed for 500 laterite blocks. Assign 6-wheeler tipper and generate Royalty M-Pass.',
    type: 'TASK',
    status: 'PENDING',
    priority: 'CRITICAL',
    timeSlot: '01:00 PM',
    dueDate: 'Today',
    assigneeName: 'Muhammed Shafi',
    assigneeRole: 'DISPATCH',
    source_system: 'ORDER',
    source_module: 'LATERITE_DISPATCH',
    source_record_id: 'ORD-LAT-8812',
    source_event: 'ORDER_CONFIRMED',
    source_task_id: 'DISP-LAT-8812',
    external_reference: 'WEIGH-GATE-PASS-01',
    idempotency_key: 'ORDER_DISP_8812',
    sourceStatusBefore: 'CONFIRMED_AWAITING_DISPATCH',
    sourceStatusAfter: 'DISPATCHED_ON_TRIP',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'OTT-005',
    title: 'Crusher VSI #02 Preventive Maintenance & Bearing Grease',
    description: 'Plant telematics crossed 250 operating hours. Inspect rotor tip wear plates and grease high-speed bearings.',
    type: 'REMINDER',
    status: 'PENDING',
    priority: 'MEDIUM',
    timeSlot: '03:00 PM',
    dueDate: 'Today',
    assigneeName: 'Sunil Kurian',
    assigneeRole: 'OPERATOR',
    source_system: 'CRUSHER',
    source_module: 'MAINTENANCE',
    source_record_id: 'CRUSH-VSI-02',
    source_event: 'MAINTENANCE_DUE',
    source_task_id: 'CRUSH-MAINT-250H',
    external_reference: 'VSI-ROTOR-CHECK',
    idempotency_key: 'CRUSHER_MAINT_VSI02_250H',
    sourceStatusBefore: 'MAINTENANCE_PENDING',
    sourceStatusAfter: 'MAINTENANCE_COMPLETED',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'OTT-006',
    title: 'Quarry Land Investor Enquiry — 42 Acre Concession',
    description: 'Enquiry from Highland Minerals for long-term lease. Schedule site visit discussion with Land Owner Moideen Haji.',
    type: 'FOLLOW_UP',
    status: 'PENDING',
    priority: 'HIGH',
    timeSlot: '05:00 PM',
    dueDate: 'Today',
    assigneeName: 'Moideen Haji / Land Manager',
    assigneeRole: 'LAND_OWNER',
    source_system: 'LAND',
    source_module: 'BUYER_ENQUIRY',
    source_record_id: 'LAND-42AC-KAS',
    source_event: 'INVESTOR_ENQUIRY_RECEIVED',
    source_task_id: 'LAND-ENQ-901',
    external_reference: 'HIGH-MIN-LEASE',
    idempotency_key: 'LAND_ENQ_42AC_HIGH',
    sourceStatusBefore: 'NEW_ENQUIRY',
    sourceStatusAfter: 'DISCUSSION_SCHEDULED',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'OTT-007',
    title: 'Contract Job Milestone Inspection — Kasaragod Highway Bypass',
    description: 'Job #JOB-HWY-402 sub-base compaction test and aggregate layer certification due.',
    type: 'TASK',
    status: 'PENDING',
    priority: 'HIGH',
    timeSlot: '02:00 PM',
    dueDate: 'Today',
    assigneeName: 'Praveen Kumar / Site Engineer',
    assigneeRole: 'CONTRACTOR',
    source_system: 'JOB',
    source_module: 'SITE_PROGRESS',
    source_record_id: 'JOB-HWY-402',
    source_event: 'MILESTONE_INSPECTION_DUE',
    source_task_id: 'JOB-MILESTONE-03',
    external_reference: 'PWD-BYPASS-SEC4',
    idempotency_key: 'JOB_INSPECT_HWY402_M3',
    sourceStatusBefore: 'PROGRESS_IN_REVIEW',
    sourceStatusAfter: 'MILESTONE_APPROVED',
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString()
  },
  {
    id: 'OTT-008',
    title: 'Workflow Approval Required — Explosives Magazine Purchase Requisition',
    description: 'PO #PO-EXP-2026-09 for ANFO slurry booster caps (₹4,25,000) awaiting Director / Owner clearance.',
    type: 'TASK',
    status: 'PENDING',
    priority: 'CRITICAL',
    timeSlot: '04:30 PM',
    dueDate: 'Today',
    assigneeName: 'Nafid Khan / Executive Authority',
    assigneeRole: 'OWNER',
    source_system: 'WORKFLOW',
    source_module: 'PURCHASE_APPROVAL',
    source_record_id: 'WF-EXP-9912',
    source_event: 'APPROVAL_PENDING',
    source_task_id: 'APPR-PO-EXP-01',
    external_reference: 'PESO-MAGAZINE-AUTH',
    idempotency_key: 'WF_APPR_EXP_9912',
    sourceStatusBefore: 'PENDING_APPROVAL',
    sourceStatusAfter: 'APPROVED_AND_ISSUED',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  }
];

const INITIAL_NOTIFICATIONS: OTTNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'Laterite Stone Order Confirmed',
    message: 'Order #ORD-LAT-8812 for 500 laterite blocks received. Assigned to Gate #1 Weighbridge.',
    category: 'Orders',
    sourceSystem: 'ORDER',
    sourceRecordId: 'ORD-LAT-8812',
    isRead: false,
    createdAt: '10 mins ago'
  },
  {
    id: 'NOTIF-02',
    title: 'Vehicle Insurance Expiring Soon',
    message: 'Tipper KL-14-Y-9201 policy expires in 7 days. Actionable OTT task created.',
    category: 'Vehicles',
    sourceSystem: 'VEHICLE',
    sourceRecordId: 'VEH-001',
    isRead: false,
    createdAt: '25 mins ago'
  },
  {
    id: 'NOTIF-03',
    title: 'Crusher VSI #02 Maintenance Due',
    message: 'Telematics logged 252 run-hours. Lubrication & bearing check scheduled.',
    category: 'Tasks',
    sourceSystem: 'CRUSHER',
    sourceRecordId: 'CRUSH-VSI-02',
    isRead: false,
    createdAt: '1 hour ago'
  },
  {
    id: 'NOTIF-04',
    title: 'Land Discovery Enquiry Received',
    message: 'New investor interest in 42-Acre Kasaragod Laterite Concession.',
    category: 'Land',
    sourceSystem: 'LAND',
    sourceRecordId: 'LAND-42AC-KAS',
    isRead: true,
    createdAt: '2 hours ago'
  }
];

class OTTEcosystemBridge {
  private items: OTTConnectedItem[] = [...INITIAL_CONNECTED_ITEMS];
  private notifications: OTTNotification[] = [...INITIAL_NOTIFICATIONS];
  private listeners: (() => void)[] = [];
  // Tracks source record statuses in memory
  private sourceRecordStatuses: Record<string, string> = {
    'VEH-001': 'EXPIRING_SOON',
    'QUARRY-PIT-01': 'IN_EXTRACTION',
    'CHAT-MSG-7821': 'ENQUIRY_OPEN',
    'ORD-LAT-8812': 'CONFIRMED_AWAITING_DISPATCH',
    'CRUSH-VSI-02': 'MAINTENANCE_PENDING',
    'LAND-42AC-KAS': 'NEW_ENQUIRY'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_OTT);
        if (stored) this.items = JSON.parse(stored);
        const notifStored = localStorage.getItem(STORAGE_KEY_NOTIFS);
        if (notifStored) this.notifications = JSON.parse(notifStored);
      } catch {}
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_OTT, JSON.stringify(this.items));
        localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(this.notifications));
      } catch {}
    }
    this.listeners.forEach((cb) => cb());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== listener);
    };
  }

  public getAllItems(): OTTConnectedItem[] {
    return this.items;
  }

  public getNotifications(): OTTNotification[] {
    return this.notifications;
  }

  public markNotificationRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.persist();
  }

  public getSourceRecordStatus(recordId: string, fallback: string = 'ACTIVE'): string {
    return this.sourceRecordStatuses[recordId] || fallback;
  }

  /**
   * Universal Create Task/Reminder/Follow-up with Idempotency check
   */
  public createItem(params: {
    title: string;
    description: string;
    type: OTTItemType;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timeSlot?: string;
    assigneeName?: string;
    assigneeRole?: string;
    source_system: OTTSourceSystem;
    source_module: string;
    source_record_id: string;
    source_event: string;
    source_task_id?: string;
    external_reference?: string;
    idempotency_key: string;
    sourceStatusBefore: string;
    sourceStatusAfter: string;
  }): { success: boolean; item: OTTConnectedItem; alreadyExisted: boolean } {
    // 1. Idempotency Check
    const existing = this.items.find((i) => i.idempotency_key === params.idempotency_key);
    if (existing) {
      return { success: true, item: existing, alreadyExisted: true };
    }

    const newItem: OTTConnectedItem = {
      id: `OTT-${Date.now().toString().slice(-4)}`,
      title: params.title,
      description: params.description,
      type: params.type,
      status: 'PENDING',
      priority: params.priority || 'MEDIUM',
      timeSlot: params.timeSlot || '10:00 AM',
      dueDate: 'Today',
      assigneeName: params.assigneeName || 'Assigned Staff',
      assigneeRole: params.assigneeRole || 'STAFF',
      source_system: params.source_system,
      source_module: params.source_module,
      source_record_id: params.source_record_id,
      source_event: params.source_event,
      source_task_id: params.source_task_id || `ST-${Date.now().toString().slice(-4)}`,
      external_reference: params.external_reference,
      idempotency_key: params.idempotency_key,
      sourceStatusBefore: params.sourceStatusBefore,
      sourceStatusAfter: params.sourceStatusAfter,
      createdAt: new Date().toISOString()
    };

    this.items.unshift(newItem);
    this.sourceRecordStatuses[params.source_record_id] = params.sourceStatusBefore;

    // Create a companion notification
    this.notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: `New ${params.type}: ${params.title}`,
      message: params.description,
      category: params.source_system === 'ORDER' ? 'Orders' : params.source_system === 'VEHICLE' ? 'Vehicles' : 'Tasks',
      sourceSystem: params.source_system,
      sourceRecordId: params.source_record_id,
      isRead: false,
      createdAt: 'Just now'
    });

    this.persist();
    return { success: true, item: newItem, alreadyExisted: false };
  }

  /**
   * Complete OTT Task & Synchronize Source Record
   * SOURCE PLATFORM <- STATUS UPDATE
   */
  public completeItem(id: string): { success: boolean; item?: OTTConnectedItem; updatedStatus?: string } {
    const target = this.items.find((i) => i.id === id);
    if (!target) return { success: false };

    target.status = 'COMPLETED';
    target.resolvedAt = new Date().toISOString();

    // Two-way synchronization back to the source platform record!
    this.sourceRecordStatuses[target.source_record_id] = target.sourceStatusAfter;

    // Add completion notification
    this.notifications.unshift({
      id: `NOTIF-COMP-${Date.now().toString().slice(-4)}`,
      title: `Task Completed: ${target.title}`,
      message: `Source status for ${target.source_record_id} successfully updated to "${target.sourceStatusAfter}".`,
      category: 'Tasks',
      sourceSystem: target.source_system,
      sourceRecordId: target.source_record_id,
      isRead: false,
      createdAt: 'Just now'
    });

    this.persist();
    return {
      success: true,
      item: target,
      updatedStatus: target.sourceStatusAfter
    };
  }

  public getMyDayItems(filter: string = 'ALL'): OTTConnectedItem[] {
    if (filter === 'ALL') return this.items;
    if (filter === 'WORK') return this.items.filter((i) => i.source_system !== 'PERSONAL');
    return this.items.filter((i) => i.source_system === filter);
  }
}

export const ottEcosystemBridge = new OTTEcosystemBridge();
