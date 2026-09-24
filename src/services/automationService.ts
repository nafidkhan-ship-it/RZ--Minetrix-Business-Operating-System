/**
 * RZ® MINETRIX BOS - Centralized Automation & Reminder Engine Service
 * Standardized per Sections 12 & 13 of the Master Specification.
 */

import {
  BosEventType,
  BosActionType,
  ReminderChannel,
  AutomationRule,
  AutomationExecutionLog,
  ReminderConfig
} from '../types/automation';

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'AUTO-RULE-01',
    name: 'Critical Stock Low -> Auto Procurement RFQ & Owner WhatsApp',
    description: 'When stockpile of Laterite Stone or 20mm aggregate drops below 15% safety buffer, dispatch WhatsApp notification to Owner and trigger Procurement RFQ.',
    eventType: 'STOCK_LOW',
    sourceModule: 'QUARRY',
    condition: {
      field: 'stockBufferPercentage',
      operator: 'LESS_THAN',
      value: 15
    },
    actions: [
      {
        actionType: 'NOTIFICATION',
        channel: 'WHATSAPP',
        targetRecipient: 'OWNER',
        templateMessage: '⚠️ Alert: Stock in [QuarryName] is below 15% buffer. Current balance: [StockQuantity]. Immediate production order recommended.',
        priority: 'CRITICAL'
      },
      {
        actionType: 'TASK',
        targetRecipient: 'MANAGER',
        templateMessage: 'Auto-Task: Initiate Quarry Blast & Cutting schedule to replenish Laterite Grade A stockpile.',
        priority: 'HIGH'
      }
    ],
    enabled: true,
    executionCount: 14,
    lastExecutedAt: '2026-09-20T14:32:00Z'
  },
  {
    id: 'AUTO-RULE-02',
    name: 'Vehicle Service Due -> Fleet Maintenance Ticket & Driver Alert',
    description: 'When odometer exceeds 5,000 km since last grease & hydraulic overhaul, generate Fleet Service Ticket and notify Driver.',
    eventType: 'VEHICLE_SERVICE_DUE',
    sourceModule: 'VEHICLE',
    condition: {
      field: 'kmsRemainingToService',
      operator: 'LESS_THAN',
      value: 200
    },
    actions: [
      {
        actionType: 'WORKFLOW',
        targetRecipient: 'MANAGER',
        templateMessage: 'Fleet Workflow: Scheduled Preventive Maintenance required for Tipper [RegNumber].',
        priority: 'HIGH'
      },
      {
        actionType: 'REMINDER',
        channel: 'PUSH',
        targetRecipient: 'DRIVER',
        templateMessage: 'Notice: Your assigned vehicle [RegNumber] is due for scheduled inspection upon return to yard.',
        priority: 'MEDIUM'
      }
    ],
    enabled: true,
    executionCount: 29,
    lastExecutedAt: '2026-09-21T01:15:00Z'
  },
  {
    id: 'AUTO-RULE-03',
    name: 'Public Marketplace Order Placed -> Invoice Generation & Dispatch Notification',
    description: 'When buyer places building materials order, automatically create GST Sales Invoice, notify Dispatch Manager and send SMS confirmation to customer.',
    eventType: 'ORDER_CREATED',
    sourceModule: 'COMMERCE',
    condition: {
      field: 'orderTotalRs',
      operator: 'GREATER_THAN',
      value: 0
    },
    actions: [
      {
        actionType: 'WORKFLOW',
        targetRecipient: 'MANAGER',
        templateMessage: 'New Order #[OrderId] confirmed. Reserve weighbridge slot and allocate loading excavator.',
        priority: 'HIGH'
      },
      {
        actionType: 'NOTIFICATION',
        channel: 'SMS',
        targetRecipient: 'BUYER',
        templateMessage: 'Thank you for ordering with RZ Minetrix. Your order #[OrderId] is accepted. Track live at rzminetrix.com/orders.',
        priority: 'MEDIUM'
      }
    ],
    enabled: true,
    executionCount: 42,
    lastExecutedAt: '2026-09-21T02:10:00Z'
  },
  {
    id: 'AUTO-RULE-04',
    name: 'OTT Task Near Due -> Alarm & WhatsApp Escalation',
    description: 'When a critical operational or statutory compliance task is 2 hours before deadline, ring alarm on assigned device and notify supervisor.',
    eventType: 'TASK_NEAR_DUE',
    sourceModule: 'OTT',
    condition: {
      field: 'hoursUntilDue',
      operator: 'LESS_THAN',
      value: 2
    },
    actions: [
      {
        actionType: 'REMINDER',
        channel: 'RING_ALARM',
        targetRecipient: 'ASSIGNED_STAFF',
        templateMessage: 'Immediate Attention: Task "[TaskTitle]" is due in under 2 hours.',
        priority: 'CRITICAL'
      },
      {
        actionType: 'FOLLOW_UP',
        channel: 'IN_APP',
        targetRecipient: 'MANAGER',
        templateMessage: 'Automated Follow-up: Subordinate has uncompleted compliance task due shortly.',
        priority: 'HIGH'
      }
    ],
    enabled: true,
    executionCount: 19,
    lastExecutedAt: '2026-09-21T02:00:00Z'
  },
  {
    id: 'AUTO-RULE-05',
    name: 'Mining Environmental Permit / Lease Expiry Warning',
    description: 'When PCB Consent or Quarry Lease has 30 days remaining, trigger statutory renewal workflow and legal document compilation.',
    eventType: 'DOCUMENT_EXPIRING',
    sourceModule: 'LAND',
    condition: {
      field: 'daysToExpiry',
      operator: 'LESS_THAN',
      value: 30
    },
    actions: [
      {
        actionType: 'WORKFLOW',
        targetRecipient: 'OWNER',
        templateMessage: 'Statutory Alert: Quarry Lease #[LeaseNo] expires in [DaysRemaining] days. Renewal filing submitted to Mining Geology Dept.',
        priority: 'CRITICAL'
      }
    ],
    enabled: true,
    executionCount: 5,
    lastExecutedAt: '2026-09-18T09:00:00Z'
  }
];

export const INITIAL_REMINDERS: ReminderConfig[] = [
  {
    id: 'REM-101',
    entityType: 'TASK',
    entityId: 'TSK-9901',
    title: 'Statutory Mining Royalty Return (Form G) Submission',
    dueDateTime: '2026-09-25T17:00:00Z',
    timing: 'BEFORE_DUE',
    offsetMinutes: 120,
    channels: ['IN_APP', 'WHATSAPP', 'EMAIL'],
    antiSpamFrequencyLimit: 'MAX_2_PER_DAY',
    respectQuietHours: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00',
    timezone: 'Asia/Kolkata (IST)',
    status: 'SCHEDULED'
  },
  {
    id: 'REM-102',
    entityType: 'INVOICE',
    entityId: 'INV-KL-4092',
    title: 'Outstanding Collection: Prestige City Infrastructure (₹8,45,000)',
    dueDateTime: '2026-09-22T12:00:00Z',
    timing: 'AT_DUE',
    offsetMinutes: 0,
    channels: ['WHATSAPP', 'VOICE_CALL'],
    antiSpamFrequencyLimit: 'MAX_1_PER_DAY',
    respectQuietHours: true,
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00',
    timezone: 'Asia/Kolkata (IST)',
    status: 'SCHEDULED'
  },
  {
    id: 'REM-103',
    entityType: 'VEHICLE_PERMIT',
    entityId: 'VH-KL-11-BD-8901',
    title: 'National Goods Permit Renewal for 10-Wheeler Tipper #04',
    dueDateTime: '2026-09-30T23:59:59Z',
    timing: 'BEFORE_DUE',
    offsetMinutes: 4320, // 3 days before
    channels: ['IN_APP', 'PUSH', 'SMS'],
    antiSpamFrequencyLimit: 'MAX_1_PER_DAY',
    respectQuietHours: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00',
    timezone: 'Asia/Kolkata (IST)',
    status: 'SCHEDULED'
  }
];

class AutomationEngineManager {
  private rules: AutomationRule[] = [...INITIAL_AUTOMATION_RULES];
  private executionLogs: AutomationExecutionLog[] = [
    {
      id: 'LOG-EX-001',
      ruleId: 'AUTO-RULE-03',
      ruleName: 'Public Marketplace Order Placed',
      eventType: 'ORDER_CREATED',
      triggeredAt: '2026-09-21T02:10:15Z',
      payloadSummary: 'Order #ORD-88219 (₹48,500 - 650 Laterite Stones)',
      actionsDispatched: [
        { actionType: 'WORKFLOW', recipient: 'Dispatch Manager (Kasaragod)', status: 'SUCCESS' },
        { actionType: 'NOTIFICATION', channel: 'SMS', recipient: '+91 98460 77112', status: 'SUCCESS' }
      ],
      durationMs: 48
    },
    {
      id: 'LOG-EX-002',
      ruleId: 'AUTO-RULE-04',
      ruleName: 'OTT Task Near Due -> Alarm & WhatsApp',
      eventType: 'TASK_NEAR_DUE',
      triggeredAt: '2026-09-21T02:00:02Z',
      payloadSummary: 'OTT Task "Monthly Weighbridge Calibrator Check"',
      actionsDispatched: [
        { actionType: 'REMINDER', channel: 'RING_ALARM', recipient: 'Weighbridge Operator Unit 1', status: 'SUCCESS' },
        { actionType: 'FOLLOW_UP', channel: 'IN_APP', recipient: 'Operations Lead', status: 'SUCCESS' }
      ],
      durationMs: 32
    }
  ];
  private reminders: ReminderConfig[] = [...INITIAL_REMINDERS];
  private listeners: (() => void)[] = [];

  public getRules(): AutomationRule[] {
    return this.rules;
  }

  public getExecutionLogs(): AutomationExecutionLog[] {
    return this.executionLogs;
  }

  public getReminders(): ReminderConfig[] {
    return this.reminders;
  }

  public toggleRule(ruleId: string) {
    this.rules = this.rules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
    this.notify();
  }

  public addRule(newRule: Omit<AutomationRule, 'id' | 'executionCount'>): AutomationRule {
    const created: AutomationRule = {
      ...newRule,
      id: `AUTO-RULE-${Date.now().toString().slice(-4)}`,
      executionCount: 0
    };
    this.rules.unshift(created);
    this.notify();
    return created;
  }

  public simulateTriggerEvent(eventType: BosEventType, payload: any): AutomationExecutionLog | null {
    const matchedRule = this.rules.find((r) => r.enabled && r.eventType === eventType);
    if (!matchedRule) return null;

    const log: AutomationExecutionLog = {
      id: `LOG-EX-${Date.now().toString().slice(-4)}`,
      ruleId: matchedRule.id,
      ruleName: matchedRule.name,
      eventType,
      triggeredAt: new Date().toISOString(),
      payloadSummary: typeof payload === 'string' ? payload : JSON.stringify(payload).slice(0, 80),
      actionsDispatched: matchedRule.actions.map((act) => ({
        actionType: act.actionType,
        channel: act.channel,
        recipient: act.targetRecipient,
        status: 'SUCCESS'
      })),
      durationMs: Math.floor(Math.random() * 40) + 15
    };

    matchedRule.executionCount += 1;
    matchedRule.lastExecutedAt = new Date().toISOString();
    this.executionLogs.unshift(log);
    this.notify();
    return log;
  }

  public addReminder(reminder: Omit<ReminderConfig, 'id' | 'status'>): ReminderConfig {
    const created: ReminderConfig = {
      ...reminder,
      id: `REM-${Date.now().toString().slice(-4)}`,
      status: 'SCHEDULED'
    };
    this.reminders.unshift(created);
    this.notify();
    return created;
  }

  public dismissReminder(reminderId: string) {
    this.reminders = this.reminders.map((r) => (r.id === reminderId ? { ...r, status: 'DISMISSED' } : r));
    this.notify();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }
}

export const automationService = new AutomationEngineManager();
