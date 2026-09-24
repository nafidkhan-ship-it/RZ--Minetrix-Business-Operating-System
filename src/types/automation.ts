/**
 * RZ® MINETRIX BOS - Automation & Reminder Engine Architecture
 * Standardized according to Sections 12 & 13 of Master Specification
 */

export type BosEventType =
  | 'TASK_CREATED'
  | 'TASK_ASSIGNED'
  | 'TASK_ACCEPTED'
  | 'TASK_STARTED'
  | 'TASK_NEAR_DUE'
  | 'TASK_DUE'
  | 'TASK_OVERDUE'
  | 'TASK_COMPLETED'
  | 'ORDER_CREATED'
  | 'ORDER_CONFIRMED'
  | 'ORDER_DISPATCHED'
  | 'ORDER_DELIVERED'
  | 'JOB_POSTED'
  | 'APPLICATION_RECEIVED'
  | 'APPLICATION_STATUS_CHANGED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_DUE'
  | 'DOCUMENT_EXPIRING'
  | 'VEHICLE_SERVICE_DUE'
  | 'INSURANCE_EXPIRING'
  | 'STOCK_LOW'
  | 'APPROVAL_REQUIRED';

export type BosActionType =
  | 'NOTIFICATION'
  | 'REMINDER'
  | 'WORKFLOW'
  | 'TASK'
  | 'FOLLOW_UP'
  | 'REPORT'
  | 'WEBHOOK';

export type ReminderChannel =
  | 'IN_APP'
  | 'PUSH'
  | 'RING_ALARM'
  | 'WHATSAPP'
  | 'VOICE_CALL'
  | 'EMAIL'
  | 'SMS';

export type ReminderTiming =
  | 'BEFORE_START'
  | 'BEFORE_DUE'
  | 'AT_START'
  | 'AT_DUE'
  | 'AFTER_OVERDUE'
  | 'CUSTOM'
  | 'RECURRING';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  eventType: BosEventType;
  sourceModule: 'QUARRY' | 'CRUSHER' | 'VEHICLE' | 'CONTRACT_JOB' | 'COMMERCE' | 'MARKETPLACE' | 'LAND' | 'CHAT' | 'OTT' | 'ERP_CORE';
  condition: {
    field: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
    value: any;
  };
  actions: {
    actionType: BosActionType;
    channel?: ReminderChannel;
    targetRecipient: 'OWNER' | 'MANAGER' | 'DRIVER' | 'BUYER' | 'SELLER' | 'ASSIGNED_STAFF' | 'WEBHOOK_URL';
    templateMessage: string;
    targetWebhookUrl?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }[];
  enabled: boolean;
  executionCount: number;
  lastExecutedAt?: string;
}

export interface AutomationExecutionLog {
  id: string;
  ruleId: string;
  ruleName: string;
  eventType: BosEventType;
  triggeredAt: string;
  payloadSummary: string;
  actionsDispatched: {
    actionType: BosActionType;
    channel?: ReminderChannel;
    recipient: string;
    status: 'SUCCESS' | 'QUEUED' | 'FAILED';
  }[];
  durationMs: number;
}

export interface ReminderConfig {
  id: string;
  entityType: 'TASK' | 'INVOICE' | 'VEHICLE_PERMIT' | 'LAND_LEASE' | 'WORK_ORDER' | 'ORDER';
  entityId: string;
  title: string;
  dueDateTime: string;
  timing: ReminderTiming;
  offsetMinutes: number; // e.g. 30 mins before
  channels: ReminderChannel[];
  recipientPhone?: string;
  recipientEmail?: string;
  antiSpamFrequencyLimit: string;
  respectQuietHours: boolean;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string; // e.g. "06:00"
  timezone: string;
  status: 'SCHEDULED' | 'DISPATCHED' | 'SNOOZED' | 'DISMISSED';
}
