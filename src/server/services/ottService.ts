/**
 * OTT - Organise Today & Tomorrow
 * Backend Domain Service & Data Storage
 * Manages Task Lifecycle, Assignment Requests, Time Planning, Follow-Ups & BOS Sync
 */

import {
  TaskItem,
  TaskRequest,
  TaskStatus,
  MyDayMetrics,
  ScheduleRecommendation,
  OTTReportData,
  WorkspaceContext,
  UserRef,
  RelationshipType,
  OTTUserProfile
} from '../../types/ottTypes.js';

// Pre-seeded Demo Contacts for Request-Based Relationships
export const OTT_DEMO_USERS: UserRef[] = [
  {
    id: 'USR-1001',
    name: 'Nafid Khan',
    role: 'RZ Minetrix Executive / Quarry Owner',
    email: 'nafidkhan@racezoneventures.com',
    phone: '+91 98290 11001',
    relationshipWithMe: 'SELF'
  },
  {
    id: 'USR-1002',
    name: 'Vikramaditya Singh',
    role: 'Quarry General Manager',
    email: 'vikram@minetrix.in',
    phone: '+91 94141 22002',
    relationshipWithMe: 'OWNER_TO_MANAGER'
  },
  {
    id: 'USR-1003',
    name: 'Rajesh Sharma',
    role: 'Heavy Tipper Fleet Lead',
    email: 'rajesh.fleet@minetrix.in',
    phone: '+91 98288 33003',
    relationshipWithMe: 'MANAGER_TO_DRIVER'
  },
  {
    id: 'USR-1004',
    name: 'Priya Verma',
    role: 'M-Sand Quality Control Engineer',
    email: 'priya.qc@minetrix.in',
    phone: '+91 97833 44004',
    relationshipWithMe: 'MANAGER_TO_STAFF'
  },
  {
    id: 'USR-1005',
    name: 'Fatima Khan',
    role: 'Family Member',
    email: 'fatima.k@personal.com',
    phone: '+91 98290 11099',
    relationshipWithMe: 'FAMILY'
  },
  {
    id: 'USR-1006',
    name: 'Arjun Mehta',
    role: 'Civil Contractor / Business Partner',
    email: 'arjun@apexinfra.org',
    phone: '+91 99281 55005',
    relationshipWithMe: 'BUSINESS_PARTNER'
  }
];

class OTTService {
  private tasks: Map<string, TaskItem> = new Map();
  private requests: Map<string, TaskRequest> = new Map();
  private activeUserId: string = 'USR-1001';

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const initialTasks: TaskItem[] = [
      // 1. Minetrix Quarry Management Task
      {
        id: 'TASK-OTT-001',
        title: 'Perform Morning Blasting Safety Perimeter Inspection - Pit #04',
        description: 'Ensure 500m siren protocol, check DGMS bench safety clearance, and log bench height reading in Minetrix BOS before morning detonation.',
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[1],
        workspace: 'RZ_MINETRIX',
        priority: 'URGENT',
        startDate: today,
        startTime: '08:00',
        dueDate: today,
        dueTime: '09:30',
        estimatedMinutes: 90,
        actualMinutes: 75,
        reminderSettings: [{ id: 'rem-1', type: 'START_TIME', triggerMinutesBefore: 30 }],
        recurrence: 'NONE',
        attachments: [{ id: 'att-1', name: 'DGMS_Blast_Checklist.pdf', size: '1.2 MB', type: 'application/pdf' }],
        notes: [
          { id: 'n-1', authorId: 'USR-1001', authorName: 'Nafid Khan', text: 'Ensure non-electric detonator lead wire check is complete.', createdAt: new Date(Date.now() - 7200000).toISOString() }
        ],
        checklist: [
          { id: 'c-1', title: 'Verify perimeter flags and warning red beacons', completed: true, completedAt: today + 'T08:15:00Z' },
          { id: 'c-2', title: 'Sound three standard 1-minute sirens', completed: true, completedAt: today + 'T08:35:00Z' },
          { id: 'c-3', title: 'Upload bench inspection photo to Minetrix Pit Log', completed: false }
        ],
        status: 'IN_PROGRESS',
        createdAt: yesterdayDate + 'T16:00:00Z',
        updatedAt: today + 'T08:35:00Z',
        history: [
          { id: 'h-1', action: 'Created from RZ Minetrix Quarry Module', actorId: 'USR-1001', actorName: 'Nafid Khan', timestamp: yesterdayDate + 'T16:00:00Z' },
          { id: 'h-2', action: 'Accepted by Assignee', actorId: 'USR-1002', actorName: 'Vikramaditya Singh', timestamp: yesterdayDate + 'T18:00:00Z' },
          { id: 'h-3', action: 'Started Inspection', actorId: 'USR-1002', actorName: 'Vikramaditya Singh', timestamp: today + 'T08:00:00Z' }
        ],
        followUpCount: 0,
        minetrixRef: {
          module: 'QUARRY',
          entityId: 'PIT-04',
          entityType: 'Pit Master',
          entityTitle: 'Chittorgarh Black Granite Pit #04',
          syncedAt: today + 'T08:00:00Z',
          lastSyncedStatus: 'IN_PROGRESS'
        },
        isPrivate: false
      },

      // 2. Heavy Fleet Dispatch Task
      {
        id: 'TASK-OTT-002',
        title: 'Dispatch 12 Volvo 10-Wheeler Tippers to NH-79 Bypass Project',
        description: 'Deliver 360 MT of 20mm blue metal aggregate to Apex Heavy Infra site. Secure weighbridge digital slips.',
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[2],
        workspace: 'RZ_MINETRIX',
        priority: 'HIGH',
        startDate: today,
        startTime: '10:00',
        dueDate: today,
        dueTime: '12:30',
        estimatedMinutes: 150,
        actualMinutes: 0,
        reminderSettings: [{ id: 'rem-2', type: 'START_TIME', triggerMinutesBefore: 15 }],
        recurrence: 'NONE',
        attachments: [],
        notes: [],
        checklist: [
          { id: 'c-201', title: 'Verify electronic gate pass generation in Minetrix BOS', completed: true },
          { id: 'c-202', title: 'Inspect tipper tarpaulin covering against spillage', completed: false },
          { id: 'c-203', title: 'Confirm arrival at Apex site via GPS', completed: false }
        ],
        status: 'ACCEPTED',
        createdAt: today + 'T06:30:00Z',
        updatedAt: today + 'T07:15:00Z',
        history: [
          { id: 'h-201', action: 'Created & Assigned', actorId: 'USR-1001', actorName: 'Nafid Khan', timestamp: today + 'T06:30:00Z' },
          { id: 'h-202', action: 'Request Accepted by Rajesh Sharma', actorId: 'USR-1003', actorName: 'Rajesh Sharma', timestamp: today + 'T07:15:00Z' }
        ],
        followUpCount: 0,
        minetrixRef: {
          module: 'FLEET',
          entityId: 'DISP-7701',
          entityType: 'Fleet Dispatch',
          entityTitle: 'Batch Dispatch 12x Volvo Tippers',
          syncedAt: today + 'T07:15:00Z'
        },
        isPrivate: false
      },

      // 3. Personal / Family Task
      {
        id: 'TASK-OTT-003',
        title: 'Refill Father Blood Pressure & Diabetes Prescription',
        description: 'Pick up 30-day medicine package from City Apollo Pharmacy before evening.',
        assignedBy: OTT_DEMO_USERS[4],
        assignedTo: OTT_DEMO_USERS[0],
        workspace: 'FAMILY',
        priority: 'HIGH',
        startDate: today,
        startTime: '13:00',
        dueDate: today,
        dueTime: '14:00',
        estimatedMinutes: 45,
        actualMinutes: 0,
        reminderSettings: [
          { id: 'rem-301', type: 'DUE_DATE', triggerMinutesBefore: 30 },
          { id: 'rem-302', type: 'CUSTOM', customDateTime: today + 'T12:30:00' }
        ],
        recurrence: 'MONTHLY',
        attachments: [],
        notes: [
          { id: 'n-301', authorId: 'USR-1005', authorName: 'Fatima Khan', text: 'Dr. Alok updated the dosage on card. Please ask chemist for 50mg.', createdAt: yesterdayDate + 'T19:00:00Z' }
        ],
        checklist: [
          { id: 'c-301', title: 'Collect prescription card from drawer', completed: false },
          { id: 'c-302', title: 'Collect medicine & invoice', completed: false }
        ],
        status: 'ACCEPTED',
        createdAt: yesterdayDate + 'T18:00:00Z',
        updatedAt: yesterdayDate + 'T19:00:00Z',
        history: [
          { id: 'h-301', action: 'Family Request Received', actorId: 'USR-1005', actorName: 'Fatima Khan', timestamp: yesterdayDate + 'T18:00:00Z' },
          { id: 'h-302', action: 'Accepted by Nafid', actorId: 'USR-1001', actorName: 'Nafid Khan', timestamp: yesterdayDate + 'T19:00:00Z' }
        ],
        followUpCount: 0,
        isPrivate: true
      },

      // 4. Overdue Office Follow-up Task
      {
        id: 'TASK-OTT-004',
        title: 'Review Q3 Crusher Machinery Depreciation & GST Filing Ledger',
        description: 'Verify input tax credit for 3 cone crusher replacement manganese mantles and sign CA audit annexure.',
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[0],
        workspace: 'OFFICE',
        priority: 'URGENT',
        startDate: yesterdayDate,
        startTime: '15:00',
        dueDate: yesterdayDate,
        dueTime: '18:00',
        estimatedMinutes: 120,
        actualMinutes: 40,
        reminderSettings: [{ id: 'rem-401', type: 'OVERDUE_FOLLOW_UP', triggerMinutesBefore: 0 }],
        recurrence: 'NONE',
        attachments: [{ id: 'att-401', name: 'Q3_Crusher_Depreciation_Schedule.xlsx', size: '2.4 MB', type: 'application/vnd.ms-excel' }],
        notes: [
          { id: 'n-401', authorId: 'USR-1001', authorName: 'Nafid Khan', text: 'CA requested final signed copy before midnight.', createdAt: yesterdayDate + 'T18:30:00Z' }
        ],
        checklist: [
          { id: 'c-401', title: 'Check asset capitalization voucher in Minetrix General Ledger', completed: true },
          { id: 'c-402', title: 'Sign Form GSTR-3B variance sheet', completed: false }
        ],
        status: 'OVERDUE',
        createdAt: yesterdayDate + 'T09:00:00Z',
        updatedAt: today + 'T07:00:00Z',
        history: [
          { id: 'h-401', action: 'Created', actorId: 'USR-1001', actorName: 'Nafid Khan', timestamp: yesterdayDate + 'T09:00:00Z' },
          { id: 'h-402', action: 'Marked Overdue by OTT Reminder Engine', actorId: 'SYSTEM', actorName: 'OTT Automation', timestamp: yesterdayDate + 'T18:01:00Z' }
        ],
        followUpCount: 2,
        lastFollowUpAt: today + 'T07:00:00Z',
        isPrivate: false
      },

      // 5. Tomorrow Task
      {
        id: 'TASK-OTT-005',
        title: 'Meet Rajasthan State Pollution Control Board Inspection Team',
        description: 'Conduct site walkabout at Crusher Station B. Present water sprinkler logbook and ambient air particulate meter certificates.',
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[1],
        workspace: 'RZ_MINETRIX',
        priority: 'HIGH',
        startDate: tomorrowDate,
        startTime: '10:30',
        dueDate: tomorrowDate,
        dueTime: '13:00',
        estimatedMinutes: 150,
        actualMinutes: 0,
        reminderSettings: [{ id: 'rem-501', type: 'START_TIME', triggerMinutesBefore: 60 }],
        recurrence: 'NONE',
        attachments: [],
        notes: [],
        checklist: [
          { id: 'c-501', title: 'Test 4 High-Pressure mist cannons at primary jaw crusher', completed: false },
          { id: 'c-502', title: 'Print last 90-day acoustic barrier readings', completed: false }
        ],
        status: 'SCHEDULED',
        createdAt: today + 'T08:00:00Z',
        updatedAt: today + 'T08:00:00Z',
        history: [
          { id: 'h-501', action: 'Created and Scheduled', actorId: 'USR-1001', actorName: 'Nafid Khan', timestamp: today + 'T08:00:00Z' }
        ],
        followUpCount: 0,
        minetrixRef: {
          module: 'CRUSHER',
          entityId: 'CRUSH-ST-B',
          entityType: 'Crusher Plant Master',
          entityTitle: 'Station B 200 TPH VSI Plant',
          syncedAt: today + 'T08:00:00Z'
        },
        isPrivate: false
      },

      // 6. Personal Study / Growth
      {
        id: 'TASK-OTT-006',
        title: 'Review DGMS Mines Act 1952 Open-Cast Slope Stability Code',
        description: '30-minute revision for regulatory compliance and safe quarry bench height calculation rules.',
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[0],
        workspace: 'STUDY',
        priority: 'MEDIUM',
        startDate: today,
        startTime: '20:30',
        dueDate: today,
        dueTime: '21:15',
        estimatedMinutes: 45,
        actualMinutes: 0,
        reminderSettings: [{ id: 'rem-601', type: 'START_TIME', triggerMinutesBefore: 15 }],
        recurrence: 'WEEKDAYS',
        attachments: [],
        notes: [],
        checklist: [
          { id: 'c-601', title: 'Read section on hard rock angle of repose (maximum 60 degrees)', completed: false }
        ],
        status: 'ACCEPTED',
        createdAt: today + 'T07:00:00Z',
        updatedAt: today + 'T07:00:00Z',
        history: [],
        followUpCount: 0,
        isPrivate: true
      }
    ];

    initialTasks.forEach(task => this.tasks.set(task.id, task));

    // Seed Incoming / Outgoing Task Requests
    const initialRequests: TaskRequest[] = [
      {
        id: 'REQ-OTT-101',
        taskId: 'TASK-OTT-REQ-1',
        taskTitle: 'Perform Quarterly Calibration of Weighbridge Sensor Cell #02',
        taskDescription: 'Legal metrology calibration stamp required. Certificate must be attached to Minetrix Weighbridge Master.',
        workspace: 'RZ_MINETRIX',
        priority: 'HIGH',
        dueDate: tomorrowDate,
        dueTime: '16:00',
        estimatedMinutes: 120,
        sender: OTT_DEMO_USERS[1],
        recipient: OTT_DEMO_USERS[0],
        relationshipType: 'OWNER_TO_MANAGER',
        status: 'PENDING',
        requestNote: 'Sir, Legal Metrology inspector has confirmed visit tomorrow 2 PM. Need your approval on the vendor fee voucher.',
        createdAt: today + 'T07:30:00Z'
      },
      {
        id: 'REQ-OTT-102',
        taskId: 'TASK-OTT-REQ-2',
        taskTitle: 'Verify Delivery of 500 Bags of Ultratech 53-Grade Cement',
        taskDescription: 'Arrived at yard 3. Match physical lorry seal against Minetrix purchase order PO-8812.',
        workspace: 'BUSINESS',
        priority: 'MEDIUM',
        dueDate: today,
        dueTime: '17:00',
        estimatedMinutes: 60,
        sender: OTT_DEMO_USERS[5],
        recipient: OTT_DEMO_USERS[0],
        relationshipType: 'BUSINESS_PARTNER',
        status: 'PENDING',
        requestNote: 'Driver is waiting at yard entrance. Please approve unloading.',
        createdAt: today + 'T08:15:00Z'
      }
    ];

    initialRequests.forEach(req => this.requests.set(req.id, req));
  }

  // --- MY DAY ENGINE ---
  public getMyDayMetrics(userId: string = this.activeUserId, workspace: WorkspaceContext = 'ALL'): MyDayMetrics {
    const today = new Date().toISOString().split('T')[0];
    const userTasks = Array.from(this.tasks.values()).filter(t => {
      const matchesUser = t.assignedTo.id === userId || t.assignedBy.id === userId;
      const matchesWorkspace = workspace === 'ALL' || t.workspace === workspace;
      return matchesUser && matchesWorkspace;
    });

    const todayTasks = userTasks.filter(t => t.startDate === today || t.dueDate === today || t.status === 'OVERDUE');

    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;
    let highPriority = 0;
    let estimatedWorkMinutes = 0;
    let completedMinutes = 0;
    let followUpsRequiredCount = 0;

    todayTasks.forEach(t => {
      if (t.status === 'COMPLETED') {
        completed++;
        completedMinutes += t.actualMinutes || t.estimatedMinutes;
      } else if (t.status === 'IN_PROGRESS' || t.status === 'STARTED') {
        inProgress++;
        estimatedWorkMinutes += t.estimatedMinutes;
      } else if (t.status === 'OVERDUE') {
        overdue++;
        estimatedWorkMinutes += t.estimatedMinutes;
        followUpsRequiredCount++;
      } else {
        pending++;
        estimatedWorkMinutes += t.estimatedMinutes;
      }

      if (t.priority === 'HIGH' || t.priority === 'URGENT') {
        highPriority++;
      }

      if (t.followUpCount > 0 && t.status !== 'COMPLETED') {
        followUpsRequiredCount++;
      }
    });

    // Detect time conflicts (tasks overlapping in startTime)
    let timeConflictsCount = 0;
    const sortedScheduled = todayTasks
      .filter(t => t.startTime && t.status !== 'COMPLETED')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let i = 0; i < sortedScheduled.length - 1; i++) {
      const current = sortedScheduled[i];
      const next = sortedScheduled[i + 1];
      const currentEnd = this.addMinutesToTime(current.startTime, current.estimatedMinutes);
      if (currentEnd > next.startTime) {
        timeConflictsCount++;
      }
    }

    const availableMinutes = Math.max(0, 480 - completedMinutes - estimatedWorkMinutes); // 8-hour daily working budget

    return {
      totalTasksToday: todayTasks.length,
      pending,
      inProgress,
      completed,
      overdue,
      highPriority,
      estimatedWorkMinutes,
      completedMinutes,
      remainingMinutes: estimatedWorkMinutes,
      availableMinutes,
      timeConflictsCount,
      followUpsRequiredCount
    };
  }

  // --- TIME PLANNER & INTELLIGENT DAILY RECOMMENDATION ---
  public getScheduleRecommendation(userId: string = this.activeUserId): ScheduleRecommendation {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = Array.from(this.tasks.values())
      .filter(t => (t.assignedTo.id === userId || t.assignedBy.id === userId) && (t.startDate === today || t.dueDate === today || t.status === 'OVERDUE'))
      .filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');

    // Priority scoring algorithm:
    // URGENT = 100, HIGH = 50, MEDIUM = 25, LOW = 10; Overdue adds +150; Minetrix adds +30
    const scoredTasks = todayTasks.map(task => {
      let score = 0;
      if (task.status === 'OVERDUE') score += 150;
      if (task.priority === 'URGENT') score += 100;
      if (task.priority === 'HIGH') score += 50;
      if (task.priority === 'MEDIUM') score += 25;
      if (task.priority === 'LOW') score += 10;
      if (task.minetrixRef) score += 30;
      return { task, score };
    });

    scoredTasks.sort((a, b) => b.score - a.score);

    // Slotting into time windows
    let currentHour = 9; // 09:00 AM start
    let currentMinute = 0;
    const suggestedOrder: { slot: string; task: TaskItem; reason: string }[] = [];
    const conflictWarnings: string[] = [];

    scoredTasks.forEach(({ task, score }) => {
      const startStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      const endTotalMins = currentHour * 60 + currentMinute + task.estimatedMinutes;
      const endHour = Math.floor(endTotalMins / 60);
      const endMinute = endTotalMins % 60;
      const endStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      let reason = '';
      if (task.status === 'OVERDUE') {
        reason = 'High risk: Overdue item requiring immediate closure before daytime operations.';
      } else if (task.priority === 'URGENT') {
        reason = 'Critical priority task scheduled in peak morning energy window.';
      } else if (task.minetrixRef) {
        reason = `BOS Synchronized: Directly impacts ${task.minetrixRef.module} production & dispatch velocity.`;
      } else {
        reason = 'Optimal slot based on estimated duration and deadline.';
      }

      suggestedOrder.push({
        slot: `${startStr} - ${endStr}`,
        task,
        reason
      });

      // Advance with a 15-min mental buffer
      const nextTotal = endTotalMins + 15;
      currentHour = Math.floor(nextTotal / 60);
      currentMinute = nextTotal % 60;

      if (currentHour >= 18) {
        conflictWarnings.push(`Planned work for '${task.title}' extends past 06:00 PM standard business hours.`);
      }
    });

    return {
      date: today,
      suggestedOrder,
      conflictWarnings,
      productivityTip: scoredTasks.some(s => s.task.status === 'OVERDUE')
        ? 'Resolve your overdue financial/regulatory items before 11:00 AM to unblock team members.'
        : 'Your schedule has balanced focus blocks with 15-minute transition buffers. You are on track!'
    };
  }

  // --- TASK CRUD & QUERIES ---
  public getTasks(params: {
    userId?: string;
    workspace?: WorkspaceContext;
    filter?: 'ALL' | 'TODAY' | 'TOMORROW' | 'UPCOMING' | 'OVERDUE' | 'COMPLETED' | 'REQUESTS';
    search?: string;
  }): TaskItem[] {
    const user = params.userId || this.activeUserId;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    let list = Array.from(this.tasks.values()).filter(t => {
      // Privacy check: User must be assigner or assignee, or have team permissions
      const isMine = t.assignedTo.id === user || t.assignedBy.id === user;
      if (!isMine && t.isPrivate) return false;
      return true;
    });

    if (params.workspace && params.workspace !== 'ALL') {
      list = list.filter(t => t.workspace === params.workspace);
    }

    if (params.filter) {
      switch (params.filter) {
        case 'TODAY':
          list = list.filter(t => t.startDate === today || t.dueDate === today || t.status === 'OVERDUE');
          break;
        case 'TOMORROW':
          list = list.filter(t => t.startDate === tomorrow || t.dueDate === tomorrow);
          break;
        case 'UPCOMING':
          list = list.filter(t => t.dueDate > tomorrow && t.status !== 'COMPLETED');
          break;
        case 'OVERDUE':
          list = list.filter(t => t.status === 'OVERDUE' || (t.dueDate < today && t.status !== 'COMPLETED'));
          break;
        case 'COMPLETED':
          list = list.filter(t => t.status === 'COMPLETED');
          break;
      }
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.assignedTo.name.toLowerCase().includes(q) ||
        t.assignedBy.name.toLowerCase().includes(q)
      );
    }

    // Sort by due date, then priority
    return list.sort((a, b) => {
      if (a.dueDate === b.dueDate) {
        const pOrder: Record<string, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      return a.dueDate.localeCompare(b.dueDate);
    });
  }

  public getTaskById(taskId: string): TaskItem | undefined {
    return this.tasks.get(taskId);
  }

  public createTask(input: Partial<TaskItem>, creatorId: string = this.activeUserId): { task: TaskItem; request?: TaskRequest } {
    const id = `TASK-OTT-${Date.now().toString().slice(-6)}`;
    const creator = OTT_DEMO_USERS.find(u => u.id === creatorId) || OTT_DEMO_USERS[0];
    const assignedTo = input.assignedTo || creator;
    const isAssignedToOther = assignedTo.id !== creator.id;

    const newTask: TaskItem = {
      id,
      title: input.title || 'Untitled Task',
      description: input.description || '',
      assignedBy: creator,
      assignedTo,
      workspace: input.workspace || 'PERSONAL',
      priority: input.priority || 'MEDIUM',
      startDate: input.startDate || new Date().toISOString().split('T')[0],
      startTime: input.startTime || '09:00',
      dueDate: input.dueDate || new Date().toISOString().split('T')[0],
      dueTime: input.dueTime || '18:00',
      estimatedMinutes: input.estimatedMinutes || 60,
      actualMinutes: 0,
      reminderSettings: input.reminderSettings || [{ id: `rem-${Date.now()}`, type: 'START_TIME', triggerMinutesBefore: 15 }],
      recurrence: input.recurrence || 'NONE',
      attachments: input.attachments || [],
      notes: input.notes || [],
      checklist: input.checklist || [],
      status: isAssignedToOther ? 'REQUESTED' : 'ACCEPTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: `h-${Date.now()}`,
          action: isAssignedToOther ? `Task Requested to ${assignedTo.name}` : 'Created by Self',
          actorId: creator.id,
          actorName: creator.name,
          timestamp: new Date().toISOString()
        }
      ],
      followUpCount: 0,
      minetrixRef: input.minetrixRef,
      isPrivate: input.isPrivate !== undefined ? input.isPrivate : (input.workspace === 'PERSONAL' || input.workspace === 'FAMILY')
    };

    this.tasks.set(id, newTask);

    // If assigning to another person, generate a formal TaskRequest
    let taskRequest: TaskRequest | undefined;
    if (isAssignedToOther) {
      taskRequest = {
        id: `REQ-${Date.now()}`,
        taskId: id,
        taskTitle: newTask.title,
        taskDescription: newTask.description,
        workspace: newTask.workspace,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        dueTime: newTask.dueTime,
        estimatedMinutes: newTask.estimatedMinutes,
        sender: creator,
        recipient: assignedTo,
        relationshipType: assignedTo.relationshipWithMe || 'OTHER',
        status: 'PENDING',
        requestNote: `Please accept this task assignment: ${newTask.title}`,
        createdAt: new Date().toISOString()
      };
      this.requests.set(taskRequest.id, taskRequest);
    }

    return { task: newTask, request: taskRequest };
  }

  public updateTaskStatus(taskId: string, newStatus: TaskStatus, actorId: string = this.activeUserId): TaskItem {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const actor = OTT_DEMO_USERS.find(u => u.id === actorId) || OTT_DEMO_USERS[0];
    const oldStatus = task.status;
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();

    if (newStatus === 'COMPLETED') {
      task.completedAt = new Date().toISOString();
      if (!task.actualMinutes) {
        task.actualMinutes = task.estimatedMinutes;
      }
      task.checklist.forEach(c => {
        if (!c.completed) {
          c.completed = true;
          c.completedAt = new Date().toISOString();
        }
      });
    }

    task.history.unshift({
      id: `h-${Date.now()}`,
      action: `Status transitioned: ${oldStatus} -> ${newStatus}`,
      actorId: actor.id,
      actorName: actor.name,
      timestamp: new Date().toISOString()
    });

    // If Minetrix linked, trigger bidirectional sync event
    if (task.minetrixRef) {
      task.minetrixRef.lastSyncedStatus = newStatus;
      task.minetrixRef.syncedAt = new Date().toISOString();
    }

    return task;
  }

  public toggleChecklistItem(taskId: string, itemId: string): TaskItem {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const item = task.checklist.find(c => c.id === itemId);
    if (item) {
      item.completed = !item.completed;
      item.completedAt = item.completed ? new Date().toISOString() : undefined;
      task.updatedAt = new Date().toISOString();
    }

    // Auto complete task if all checklist items are done
    const allDone = task.checklist.length > 0 && task.checklist.every(c => c.completed);
    if (allDone && task.status !== 'COMPLETED') {
      return this.updateTaskStatus(taskId, 'COMPLETED');
    }

    return task;
  }

  public addNote(taskId: string, text: string, authorId: string = this.activeUserId): TaskItem {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const author = OTT_DEMO_USERS.find(u => u.id === authorId) || OTT_DEMO_USERS[0];
    task.notes.unshift({
      id: `n-${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      text,
      createdAt: new Date().toISOString()
    });
    task.updatedAt = new Date().toISOString();
    return task;
  }

  // --- FOLLOW-UP ENGINE ---
  public sendFollowUp(taskId: string, senderId: string = this.activeUserId, message?: string): { success: boolean; task: TaskItem } {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const sender = OTT_DEMO_USERS.find(u => u.id === senderId) || OTT_DEMO_USERS[0];
    task.followUpCount = (task.followUpCount || 0) + 1;
    task.lastFollowUpAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();

    const noteText = message || `Follow-up #${task.followUpCount}: Status check requested for "${task.title}".`;
    task.notes.unshift({
      id: `n-follow-${Date.now()}`,
      authorId: sender.id,
      authorName: sender.name,
      text: `[Gentle Follow-up] ${noteText}`,
      createdAt: new Date().toISOString()
    });

    task.history.unshift({
      id: `h-follow-${Date.now()}`,
      action: `Follow-up #${task.followUpCount} Sent to ${task.assignedTo.name}`,
      actorId: sender.id,
      actorName: sender.name,
      timestamp: new Date().toISOString(),
      details: noteText
    });

    return { success: true, task };
  }

  // --- REQUEST-BASED RELATIONSHIPS ---
  public getRequests(userId: string = this.activeUserId): { incoming: TaskRequest[]; outgoing: TaskRequest[] } {
    const incoming: TaskRequest[] = [];
    const outgoing: TaskRequest[] = [];

    this.requests.forEach(req => {
      if (req.recipient.id === userId) incoming.push(req);
      if (req.sender.id === userId) outgoing.push(req);
    });

    return { incoming, outgoing };
  }

  public respondToRequest(requestId: string, action: 'ACCEPT' | 'DECLINE', note?: string, responderId: string = this.activeUserId): TaskRequest {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request ${requestId} not found`);

    request.status = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
    request.respondedAt = new Date().toISOString();
    request.responseNote = note;

    const task = this.tasks.get(request.taskId);
    if (task) {
      if (action === 'ACCEPT') {
        task.status = 'ACCEPTED';
        task.history.unshift({
          id: `h-${Date.now()}`,
          action: `Assignment Accepted by ${request.recipient.name}`,
          actorId: responderId,
          actorName: request.recipient.name,
          timestamp: new Date().toISOString()
        });
      } else {
        task.status = 'CANCELLED';
        task.history.unshift({
          id: `h-${Date.now()}`,
          action: `Assignment Declined: ${note || 'No reason provided'}`,
          actorId: responderId,
          actorName: request.recipient.name,
          timestamp: new Date().toISOString()
        });
      }
    }

    return request;
  }

  // --- REPORTS & ANALYTICS ---
  public getReports(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY', workspace: WorkspaceContext = 'ALL'): OTTReportData {
    const tasks = this.getTasks({ workspace });
    const completed = tasks.filter(t => t.status === 'COMPLETED');
    const pending = tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS' || t.status === 'ACCEPTED');
    const overdue = tasks.filter(t => t.status === 'OVERDUE');

    const totalPlannedMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
    const totalActualMinutes = tasks.reduce((sum, t) => sum + (t.actualMinutes || t.estimatedMinutes || 0), 0);
    const completionRate = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 100;

    const wsCounts: Record<string, { count: number; minutes: number; completedCount: number }> = {};
    tasks.forEach(t => {
      if (!wsCounts[t.workspace]) {
        wsCounts[t.workspace] = { count: 0, minutes: 0, completedCount: 0 };
      }
      wsCounts[t.workspace].count++;
      wsCounts[t.workspace].minutes += t.estimatedMinutes;
      if (t.status === 'COMPLETED') wsCounts[t.workspace].completedCount++;
    });

    const workspaceDistribution = Object.entries(wsCounts).map(([ws, data]) => ({
      workspace: ws as WorkspaceContext,
      count: data.count,
      minutes: data.minutes,
      completionRate: data.count > 0 ? Math.round((data.completedCount / data.count) * 100) : 0
    }));

    const personWiseStats = OTT_DEMO_USERS.map(u => {
      const userTasks = tasks.filter(t => t.assignedTo.id === u.id);
      const userCompleted = userTasks.filter(t => t.status === 'COMPLETED');
      return {
        personName: u.name,
        relationship: u.relationshipWithMe || 'OTHER',
        assignedCount: userTasks.length,
        completedCount: userCompleted.length,
        avgCompletionRate: userTasks.length > 0 ? Math.round((userCompleted.length / userTasks.length) * 100) : 0
      };
    }).filter(p => p.assignedCount > 0);

    return {
      period,
      completionRate,
      totalPlannedMinutes,
      totalActualMinutes,
      completedTasksCount: completed.length,
      pendingTasksCount: pending.length,
      overdueTasksCount: overdue.length,
      workspaceDistribution,
      personWiseStats,
      followUpEfficiency: {
        followUpsSent: 4,
        resolvedPostFollowUp: 3,
        avgResolutionTimeHours: 2.5
      }
    };
  }

  // --- MINETRIX BOS SYNC DISPATCHER ---
  public syncFromMinetrixBOS(payload: {
    module: 'QUARRY' | 'FLEET' | 'CRUSHER' | 'FINANCE' | 'HR';
    title: string;
    description: string;
    assignedToId: string;
    assignedByName: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate: string;
    dueTime: string;
    estimatedMinutes: number;
    entityId: string;
    entityTitle: string;
  }): TaskItem {
    const assignedTo = OTT_DEMO_USERS.find(u => u.id === payload.assignedToId) || OTT_DEMO_USERS[1];
    const { task } = this.createTask({
      title: `[Minetrix ${payload.module}] ${payload.title}`,
      description: payload.description,
      workspace: 'RZ_MINETRIX',
      priority: payload.priority,
      dueDate: payload.dueDate,
      dueTime: payload.dueTime,
      estimatedMinutes: payload.estimatedMinutes,
      assignedTo,
      minetrixRef: {
        module: payload.module,
        entityId: payload.entityId,
        entityType: `${payload.module} Operation`,
        entityTitle: payload.entityTitle,
        syncedAt: new Date().toISOString()
      },
      isPrivate: false
    });

    return task;
  }

  // Helper
  private addMinutesToTime(timeStr: string, minutes: number): string {
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }
}

export const ottService = new OTTService();
