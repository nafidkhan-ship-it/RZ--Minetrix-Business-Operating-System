/**
 * OTT - Organise Today & Tomorrow
 * Universal Task Management, Reminder, Follow-Up & Time-Planning Platform
 * Type Definitions & Data Contracts
 */

export type TaskStatus = 
  | 'ASSIGNED'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PENDING'
  | 'ON_HOLD'
  | 'OVERDUE'
  | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type WorkspaceContext = 
  | 'ALL'
  | 'OFFICE'
  | 'RZ_MINETRIX'
  | 'PERSONAL'
  | 'FAMILY'
  | 'BUSINESS'
  | 'STUDY'
  | 'OTHER';

export type RelationshipType = 
  | 'OWNER_TO_MANAGER'
  | 'MANAGER_TO_STAFF'
  | 'QUARRY_OWNER_TO_MANAGER'
  | 'MANAGER_TO_DRIVER'
  | 'TEACHER_TO_STUDENT'
  | 'STUDENT_TO_STUDENT'
  | 'FAMILY'
  | 'FRIEND'
  | 'BUSINESS_PARTNER'
  | 'CUSTOMER_TO_SERVICE_PROVIDER'
  | 'SELF'
  | 'OTHER';

export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKDAYS' | 'WEEKLY' | 'MONTHLY';

export interface UserRef {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
  relationshipWithMe?: RelationshipType;
}

export interface TaskChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface TaskNote {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface TaskHistoryItem {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  details?: string;
}

export interface ReminderSetting {
  id: string;
  type: 'START_TIME' | 'DUE_DATE' | 'CUSTOM' | 'RECURRING' | 'OVERDUE_FOLLOW_UP';
  triggerMinutesBefore?: number; // e.g. 15 mins before
  customDateTime?: string;
  isTriggered?: boolean;
}

export interface MinetrixSyncRef {
  module: 'QUARRY' | 'FLEET' | 'CRUSHER' | 'FINANCE' | 'HR' | 'MARKETPLACE';
  entityId: string;
  entityType: string;
  entityTitle: string;
  syncedAt: string;
  lastSyncedStatus?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedBy: UserRef;
  assignedTo: UserRef;
  workspace: WorkspaceContext;
  priority: TaskPriority;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  estimatedMinutes: number;
  actualMinutes: number;
  reminderSettings: ReminderSetting[];
  recurrence: RecurrenceType;
  attachments: { id: string; name: string; size: string; type: string; url?: string }[];
  notes: TaskNote[];
  checklist: TaskChecklistItem[];
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  history: TaskHistoryItem[];
  followUpCount: number;
  lastFollowUpAt?: string;
  minetrixRef?: MinetrixSyncRef;
  isPrivate: boolean;
}

export interface TaskRequest {
  id: string;
  taskId: string;
  taskTitle: string;
  taskDescription?: string;
  workspace: WorkspaceContext;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
  estimatedMinutes: number;
  sender: UserRef;
  recipient: UserRef;
  relationshipType: RelationshipType;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  requestNote?: string;
  createdAt: string;
  respondedAt?: string;
  responseNote?: string;
}

export interface MyDayMetrics {
  totalTasksToday: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  highPriority: number;
  estimatedWorkMinutes: number;
  completedMinutes: number;
  remainingMinutes: number;
  availableMinutes: number; // usually 480 mins (8h) base
  timeConflictsCount: number;
  followUpsRequiredCount: number;
}

export interface TimeSlotBlock {
  timeSlot: string; // e.g. "09:00 - 10:00"
  task?: TaskItem;
  hasConflict: boolean;
  conflictWithTitle?: string;
  isBreakOrBuffer?: boolean;
}

export interface ScheduleRecommendation {
  date: string;
  suggestedOrder: {
    slot: string;
    task: TaskItem;
    reason: string;
  }[];
  conflictWarnings: string[];
  productivityTip: string;
}

export interface OTTReportData {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  completionRate: number;
  totalPlannedMinutes: number;
  totalActualMinutes: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  overdueTasksCount: number;
  workspaceDistribution: {
    workspace: WorkspaceContext;
    count: number;
    minutes: number;
    completionRate: number;
  }[];
  personWiseStats?: {
    personName: string;
    relationship: string;
    assignedCount: number;
    completedCount: number;
    avgCompletionRate: number;
  }[];
  followUpEfficiency: {
    followUpsSent: number;
    resolvedPostFollowUp: number;
    avgResolutionTimeHours: number;
  };
}

export interface OTTUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  currentWorkspace: WorkspaceContext;
  availableWorkspaces: WorkspaceContext[];
  isMinetrixLinked: boolean;
  organizationName?: string;
  notificationPreferences: {
    pushEnabled: boolean;
    emailDigest: boolean;
    smsUrgent: boolean;
    whatsappAlerts: boolean;
    dailyMorningPlanAt: string; // e.g. "08:00"
  };
}
