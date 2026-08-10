export interface WorkflowModuleSpec {
  id: string;
  number: number;
  name: string;
  icon: string;
  summary: string;
  features: string[];
  dbTables: string[];
  apiEndpoints: string[];
  codeSnippet: string;
}

export interface ApprovalRequestSpec {
  id: string;
  requestCode: string;
  title: string;
  category: 'MINING' | 'FLEET' | 'BUILDING_MATERIALS' | 'FINANCE' | 'HRMS' | 'MARKETPLACE';
  requesterName: string;
  department: string;
  amountINR?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED' | 'AUTO_APPROVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  currentLevel: number;
  totalLevels: number;
  assignedApproverRole: string;
  createdAt: string;
  slaDueDate: string;
  details: string;
}

export interface TaskItemSpec {
  id: string;
  taskCode: string;
  title: string;
  assignee: string;
  suite: string;
  priority: 'LOW' | 'NORMAL' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';
  dueDate: string;
  checklistCount: { done: number; total: number };
}

export interface BusinessRuleSpec {
  id: string;
  ruleCode: string;
  name: string;
  suite: string;
  conditionIf: string;
  actionThen: string;
  isActive: boolean;
  version: string;
}

export interface AuditLogSpec {
  id: string;
  timestamp: string;
  userEmail: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'ESCALATE' | 'EXPORT';
  entityName: string;
  entityId: string;
  ipAddress: string;
  tenantId: string;
  fieldChanges: { field: string; oldValue: string; newValue: string }[];
}

export const WORKFLOW_APPROVAL_MODULES: WorkflowModuleSpec[] = [
  {
    id: 'workflow-execution-engine',
    number: 1,
    name: 'Workflow Designer & Execution Engine',
    icon: 'GitFork',
    summary: 'Centralized BPMN-compliant workflow orchestration framework supporting visual node builders, versioned templates, pause/resume state machines, and cross-suite trigger hooks.',
    features: [
      'Visual Drag-and-Drop Workflow Node Canvas with BPMN 2.0 State Machine Support',
      'Workflow Template Registry with Versioning (v1.0 -> v2.1 Hot-Swapping)',
      'Stateful Execution Engine with Pause, Resume, Clone, and Rollback Capabilities',
      'Cross-Suite Event Trigger Bus (Listening to Mining, Fleet, Finance, HR Events)',
      'JSON-Based Workflow Import / Export for Multi-Tenant Tenant Duplication',
      'Execution History & Real-Time Node Telemetry Inspector'
    ],
    dbTables: ['wf_definitions', 'wf_versions', 'wf_node_instances', 'wf_execution_logs'],
    apiEndpoints: [
      'GET /api/v1/workflows',
      'POST /api/v1/workflows/designer/publish',
      'POST /api/v1/workflows/:id/execute',
      'PUT /api/v1/workflows/:id/pause-resume'
    ],
    codeSnippet: `// Universal Stateful Workflow Execution Engine
export class WorkflowExecutionEngine {
  async executeNextNode(
    instanceId: string,
    actionPayload: WorkflowEventPayloadDto
  ): Promise<Result<WorkflowInstanceState>> {
    const instance = await this.workflowRepo.findInstanceById(instanceId);
    if (!instance || instance.status === 'PAUSED') {
      return Result.fail(new WorkflowEngineException('Workflow execution halted or invalid'));
    }

    const currentNode = instance.getCurrentNode();
    const nextNode = instance.evaluateTransitions(currentNode, actionPayload);
    
    instance.transitionTo(nextNode);
    await this.workflowRepo.saveInstance(instance);

    this.eventBus.emit('WORKFLOW_NODE_TRANSITIONED', { instanceId, nextNodeId: nextNode.id });
    return Result.ok(instance);
  }
}`
  },
  {
    id: 'multi-level-approval-engine',
    number: 2,
    name: 'Multi-Level Approval Engine & Digital Matrix',
    icon: 'CheckSquare',
    summary: 'Enterprise approval engine supporting Single-Level, Multi-Level, Sequential, Parallel, Department, Branch, and Auto-Approval rules with Rejection routing and Digital Signature compliance.',
    features: [
      'Flexible Approval Topologies: Sequential, Parallel (AND/OR), Conditional, Branch-Scoped',
      'Threshold-Based Auto Approval Rules (e.g. PO < ₹50,000 auto-approved by system)',
      'Multi-Level Hierarchy Escalations (Site Manager -> Finance Head -> Managing Director)',
      'Rejection Routing: Return to Requester, Escalated Revision, or Hard Cancel',
      'Digital Signature Readiness with Cryptographic Hash Proof (SHA-256)',
      'Granular Delegation Rules for Out-of-Office Approvers'
    ],
    dbTables: ['approval_matrices', 'approval_requests', 'approval_levels', 'approval_signatures'],
    apiEndpoints: [
      'POST /api/v1/approvals/submit',
      'POST /api/v1/approvals/:id/approve',
      'POST /api/v1/approvals/:id/reject',
      'GET /api/v1/approvals/inbox'
    ],
    codeSnippet: `// Multi-Level Approval Decision Processor
export class ApprovalEngineService {
  async processApprovalDecision(
    requestId: string,
    decision: 'APPROVE' | 'REJECT',
    approverContext: ApproverSecurityDto
  ): Promise<Result<ApprovalRequestEntity>> {
    const request = await this.approvalRepo.findById(requestId);
    const currentLevel = request.getCurrentLevel();

    if (!currentLevel.isAssignedApprover(approverContext.userId)) {
      return Result.fail(new UnauthorizedApproverException());
    }

    if (decision === 'APPROVE') {
      currentLevel.markApproved(approverContext.digitalSignatureHash);
      if (request.hasMoreLevels()) {
        request.advanceToNextLevel();
      } else {
        request.setStatus('FULLY_APPROVED');
        this.eventBus.emit('APPROVAL_COMPLETED', { requestId });
      }
    } else {
      request.setStatus('REJECTED');
      this.eventBus.emit('APPROVAL_REJECTED', { requestId });
    }

    await this.approvalRepo.save(request);
    return Result.ok(request);
  }
}`
  },
  {
    id: 'enterprise-task-management',
    number: 3,
    name: 'Enterprise Task Management & Delegation Engine',
    icon: 'ListTodo',
    summary: 'Centralized task inbox and queue manager offering task assignment, delegation, priorities, due date tracking, checklists, task comments, and completion histories.',
    features: [
      'Unified Task Inbox & Interactive Kanban Task Board across all 10 Business Suites',
      'Task Delegation & Re-Assignment with Audit Trail Tracking',
      'Sub-Task Checklists & File Attachment Bindings',
      'Time-Bound Due Date Alerts & Overdue Priority Escalation Rules',
      'Task Comments with @Mention Notification Dispatcher',
      'Recurring Scheduled Task Generator for Daily Pit Inspections & Safety Audits'
    ],
    dbTables: ['tasks', 'task_assignees', 'task_checklists', 'task_comments'],
    apiEndpoints: [
      'GET /api/v1/tasks/inbox',
      'POST /api/v1/tasks/create',
      'PUT /api/v1/tasks/:id/status',
      'POST /api/v1/tasks/:id/delegate'
    ],
    codeSnippet: `// Enterprise Task Delegation Manager
export class TaskDelegationService {
  async delegateTask(
    taskId: string,
    fromUserId: string,
    toUserId: string,
    reason: string
  ): Promise<Result<TaskEntity>> {
    const task = await this.taskRepo.findById(taskId);
    task.reassign(toUserId);
    task.addAuditNote(\`Delegated from \${fromUserId} to \${toUserId}: \${reason}\`);

    await this.taskRepo.save(task);
    this.notificationService.notifyAssignee(toUserId, \`New Task Delegated: \${task.title}\`);

    return Result.ok(task);
  }
}`
  },
  {
    id: 'business-rules-engine',
    number: 4,
    name: 'Business Rule Engine & Logic Evaluator',
    icon: 'Cpu',
    summary: 'High-speed rule evaluator processing conditional validation, calculation, approval threshold, notification, escalation, and automation rules with version controls.',
    features: [
      'DRL / JSON Rule Expression Evaluator for Dynamic Business Logic',
      'Rule Categories: Validation Rules, Calculation Rules, Approval Rules, SLA Rules',
      'Interactive Rule Testing Sandbox with Sample Data Simulation',
      'Rule Versioning & Production Deployment Rollbacks',
      'Multi-Variable IF-THEN Conditional Logic Evaluator',
      'Hot-Reloadable Business Rules (Zero Server Downtime Deployment)'
    ],
    dbTables: ['business_rules', 'rule_versions', 'rule_execution_logs'],
    apiEndpoints: [
      'GET /api/v1/rules',
      'POST /api/v1/rules/eval',
      'POST /api/v1/rules/publish-version'
    ],
    codeSnippet: `// Business Rule Expression Evaluator Engine
export class BusinessRuleEvaluator {
  evaluateRule(rule: BusinessRuleEntity, context: Record<string, any>): boolean {
    const expression = rule.compiledCondition;
    // Evaluates condition: e.g. "context.amountINR > 500000 && context.department === 'MINING'"
    return this.expressionRunner.run(expression, context);
  }
}`
  },
  {
    id: 'sla-management-engine',
    number: 5,
    name: 'SLA Definition & Priority Matrix Engine',
    icon: 'Clock',
    summary: 'SLA tracking system managing Response Times, Resolution SLA, Priority Matrices, Violation Alerts, and SLA Performance Reporting across all operations.',
    features: [
      'Configurable SLA Matrices by Priority (Low = 24h, Medium = 8h, High = 2h, Emergency = 30m)',
      'Automated SLA Violation Warning Alarms at 75% and 90% Time Thresholds',
      'Working Hours Calendar Integration (Excluding Statutory Holidays & Night Hours)',
      'Real-Time SLA Violation Dashboard & Penalty Calculator',
      'SLA Performance Reports for Departmental Lead Scorecards'
    ],
    dbTables: ['sla_definitions', 'sla_trackers', 'sla_violations', 'sla_calendars'],
    apiEndpoints: [
      'GET /api/v1/sla/definitions',
      'POST /api/v1/sla/check-violations',
      'GET /api/v1/sla/dashboard-metrics'
    ],
    codeSnippet: `// SLA Violation Calculator Engine
export class SlaTrackerService {
  calculateRemainingTime(sla: SlaTrackerEntity): number {
    const now = new Date().getTime();
    const dueTime = new Date(sla.dueDate).getTime();
    return Math.max(0, Math.floor((dueTime - now) / 1000)); // seconds remaining
  }
}`
  },
  {
    id: 'immutable-audit-platform',
    number: 6,
    name: 'Immutable Enterprise Audit Platform',
    icon: 'ShieldCheck',
    summary: 'Bank-grade immutable audit platform capturing field-level changes, login audits, data access logs, approval signatures, workflow logs, and export events.',
    features: [
      'Field-Level Delta Audit Logs (Old Value -> New Value Diff Inspector)',
      'Immutable Cryptographic Append-Only Ledger Storage Pattern',
      'Multi-Dimensional Auditing: User, Document, Approval, Workflow, API & Export Audits',
      'IP Address, Device Fingerprint, and Geo-Location Session Tracking',
      'Statutory Compliance Readiness (ISO 27001, SOC2, Mining NOC Audit Verification)'
    ],
    dbTables: ['audit_logs', 'audit_field_deltas', 'audit_access_logs'],
    apiEndpoints: [
      'GET /api/v1/audit/trail',
      'POST /api/v1/audit/log-event',
      'GET /api/v1/audit/export-audit'
    ],
    codeSnippet: `// Immutable Audit Event Logger
export class AuditPlatformService {
  async logFieldDelta(dto: CreateAuditLogDto): Promise<void> {
    const auditRecord = {
      tenantId: dto.tenantId,
      userId: dto.userId,
      ipAddress: dto.ipAddress,
      action: dto.action,
      entityName: dto.entityName,
      entityId: dto.entityId,
      fieldDeltas: JSON.stringify(dto.deltas),
      hashCheck: SecurityUtils.computeSha256(dto)
    };
    await this.auditRepo.insertImmutable(auditRecord);
  }
}`
  },
  {
    id: 'activity-timeline-engine',
    number: 7,
    name: 'Unified Activity & Communication Timeline Engine',
    icon: 'History',
    summary: 'Chronological timeline aggregator combining user actions, document edits, approval decisions, workflow transitions, and communication dispatches into a single view.',
    features: [
      'Unified Chronological Master Stream for Any Business Document or Asset',
      'Filterable Timeline Categories: Approval, Document, System, WhatsApp/Email, User',
      'Visual Timeline Cards with Actor Avatars & Quick Detail Modals',
      'Exportable Audit Timeline PDF for Legal & Compliance Records'
    ],
    dbTables: ['activity_timeline_events'],
    apiEndpoints: [
      'GET /api/v1/timeline/:entityType/:entityId'
    ],
    codeSnippet: `// Unified Timeline Aggregator
export class ActivityTimelineService {
  async getChronologicalTimeline(entityType: string, entityId: string): Promise<TimelineEventDto[]> {
    return await this.timelineRepo.findEventsByEntity(entityType, entityId);
  }
}`
  },
  {
    id: 'escalation-matrix-engine',
    number: 8,
    name: 'Multi-Tier Escalation Matrix & Emergency Router',
    icon: 'AlertOctagon',
    summary: 'Automated escalation router triggering Time-Based, Role-Based, Priority, Department, Branch, Company, and Emergency Escalations on overdue tasks or SLA breaches.',
    features: [
      'Time-Based Escalation Triggers (Overdue > 4 Hours -> Auto-Escalate to VP)',
      'Emergency Escalation Override for Safety NOC Violations & Crusher Down Events',
      'Hierarchical Department & Branch Escalation Chains',
      'WhatsApp & Email Emergency Dispatch Notification Engine'
    ],
    dbTables: ['escalation_rules', 'escalation_incidents'],
    apiEndpoints: [
      'POST /api/v1/escalations/trigger',
      'GET /api/v1/escalations/active-incidents'
    ],
    codeSnippet: `// Escalation Engine Router
export class EscalationEngineService {
  async checkAndEscalateOverdue(requestId: string): Promise<void> {
    const request = await this.approvalRepo.findById(requestId);
    if (request.isSlaBreached() && !request.isEscalated) {
      request.escalateToRole(request.nextEscalationRole);
      this.notificationService.sendEmergencyAlert(request.nextEscalationRole, request);
    }
  }
}`
  },
  {
    id: 'digital-approval-center',
    number: 9,
    name: 'Universal Digital Approval Center',
    icon: 'CheckCircle2',
    summary: 'Cross-suite approval inbox supporting Purchase, Expense, Quotation, Sales Order, Payment, Advance, Leave, Payroll, Rental, and Document Approvals.',
    features: [
      '14 Pre-Configured Approval Workflows Across All 10 Business Suites',
      'One-Click Batch Approval Action with Security PIN / Biometric Verification',
      'Side-by-Side Document & Invoice Visual Verification Modal',
      'WhatsApp One-Click Direct Approval Link Integration'
    ],
    dbTables: ['digital_approval_configs', 'approval_action_logs'],
    apiEndpoints: [
      'GET /api/v1/digital-approvals/suite-inbox',
      'POST /api/v1/digital-approvals/batch-approve'
    ],
    codeSnippet: `// Digital Approval Center Handler
export class DigitalApprovalCenterService {
  async batchApprove(requestIds: string[], userId: string): Promise<BatchApprovalResultDto> {
    let successCount = 0;
    for (const id of requestIds) {
      await this.approvalService.processApprovalDecision(id, 'APPROVE', { userId });
      successCount++;
    }
    return { total: requestIds.length, approved: successCount };
  }
}`
  },
  {
    id: 'workflow-analytics-dashboard',
    number: 10,
    name: 'Workflow KPIs & Process Bottleneck Analytics',
    icon: 'BarChart3',
    summary: 'Analytics cockpit evaluating Workflow KPIs, Approval Turnaround Times, Pending Bottlenecks, SLA Performance, and Departmental Efficiency Scorecards.',
    features: [
      'Average Approval Turnaround Time (TAT) Metrics by Department & Approver Role',
      'Process Bottleneck Inspector highlighting pending queue congestions',
      'SLA Breach Percentage Trends & Rejection Root Cause Pareto Charts',
      'Executive Process Optimization Scorecards'
    ],
    dbTables: ['wf_analytics_cubes', 'wf_kpi_snapshots'],
    apiEndpoints: [
      'GET /api/v1/workflow-analytics/metrics',
      'GET /api/v1/workflow-analytics/bottlenecks'
    ],
    codeSnippet: `// Process Bottleneck Analytics Engine
export class WorkflowAnalyticsService {
  async getDepartmentTAT(tenantId: string): Promise<DepartmentTatDto[]> {
    return await this.db.selectFrom('approval_requests')
      .groupBy('department')
      .select(['department', sql\`AVG(turnaround_hours) as avgTat\`])
      .execute();
  }
}`
  }
];

export const PREBUILT_APPROVAL_REQUESTS: ApprovalRequestSpec[] = [
  {
    id: 'app-001',
    requestCode: 'APR-2026-901',
    title: 'Quarry Pit #4 Heavy Explosive Blasting Permit NOC',
    category: 'MINING',
    requesterName: 'Sanjay Varma (Quarry Site Manager)',
    department: 'Mining Operations',
    amountINR: 450000,
    status: 'PENDING',
    priority: 'EMERGENCY',
    currentLevel: 2,
    totalLevels: 3,
    assignedApproverRole: 'Managing Director / Safety Head',
    createdAt: '2026-08-06 09:30 AM',
    slaDueDate: '2026-08-06 01:30 PM (4h SLA)',
    details: 'PESO explosive purchase & 500kg ammonium nitrate blasting clearance for Pit #4 south wall overburden clearance.'
  },
  {
    id: 'app-002',
    requestCode: 'APR-2026-902',
    title: 'Tipper Fleet Engine Overhaul Maintenance Requisition',
    category: 'FLEET',
    requesterName: 'Karan Singh (Fleet Maintenance Lead)',
    department: 'Fleet & Logistics',
    amountINR: 185000,
    status: 'PENDING',
    priority: 'HIGH',
    currentLevel: 1,
    totalLevels: 2,
    assignedApproverRole: 'Fleet Operations Manager',
    createdAt: '2026-08-06 10:15 AM',
    slaDueDate: '2026-08-06 06:15 PM (8h SLA)',
    details: 'Full cylinder head replacement & turbocharger repair for Tipper KA-04-E-9920.'
  },
  {
    id: 'app-003',
    requestCode: 'APR-2026-903',
    title: 'Concrete Batching Plant Raw Cement Bulk PO #4812',
    category: 'BUILDING_MATERIALS',
    requesterName: 'Anil Mehta (Plant Purchase Officer)',
    department: 'Procurement',
    amountINR: 1250000,
    status: 'APPROVED',
    priority: 'MEDIUM',
    currentLevel: 3,
    totalLevels: 3,
    assignedApproverRole: 'CFO / Purchase Director',
    createdAt: '2026-08-05 04:00 PM',
    slaDueDate: '2026-08-06 04:00 PM (24h SLA)',
    details: '100 MT OPC 53 Grade Cement supply order from Ultratech Cements for Bangalore Batching Plant.'
  },
  {
    id: 'app-004',
    requestCode: 'APR-2026-904',
    title: 'Vendor Outstanding Payment Release — Shell Fuel',
    category: 'FINANCE',
    requesterName: 'Meera Rao (Senior Accountant)',
    department: 'Accounts Payable',
    amountINR: 840000,
    status: 'PENDING',
    priority: 'HIGH',
    currentLevel: 2,
    totalLevels: 2,
    assignedApproverRole: 'Finance Controller',
    createdAt: '2026-08-06 11:00 AM',
    slaDueDate: '2026-08-07 11:00 AM (24h SLA)',
    details: 'Weekly bulk diesel fuel payment clearance for Shell India Fuel Outlets.'
  },
  {
    id: 'app-005',
    requestCode: 'APR-2026-905',
    title: 'Mining Operator Overtime & Weekly Settlement #W31',
    category: 'HRMS',
    requesterName: 'Pooja Hegde (HR Officer)',
    department: 'Human Resources',
    amountINR: 142000,
    status: 'AUTO_APPROVED',
    priority: 'LOW',
    currentLevel: 1,
    totalLevels: 1,
    assignedApproverRole: 'Auto-Approval Rule Engine',
    createdAt: '2026-08-06 08:00 AM',
    slaDueDate: '2026-08-06 08:00 AM',
    details: 'Weekly wages & overtime settlement for 38 heavy excavator operators (Auto-approved < ₹1,50,000 threshold).'
  }
];

export const PRECONFIGURED_BUSINESS_RULES: BusinessRuleSpec[] = [
  {
    id: 'rule-001',
    ruleCode: 'RULE_PO_AUTO_APPROVE',
    name: 'Purchase Order Low Threshold Auto-Approval',
    suite: 'PROCUREMENT',
    conditionIf: 'PurchaseOrder.amountINR <= 50000 && Vendor.isApproved === true',
    actionThen: 'SetStatus("APPROVED"); SkipApprovalLevels(); SendNotification("PO_AUTO_APPROVED")',
    isActive: true,
    version: 'v1.2'
  },
  {
    id: 'rule-002',
    ruleCode: 'RULE_SAFETY_EMERGENCY_ESCALATION',
    name: 'Quarry Safety Incident Immediate Managing Director Escalation',
    suite: 'MINING',
    conditionIf: 'Incident.severity === "CRITICAL" || Incident.type === "EXPLOSIVE_MISFIRE"',
    actionThen: 'EscalateTo("MANAGING_DIRECTOR"); DispatchEmergencySms(); TriggerSirenAlarm()',
    isActive: true,
    version: 'v2.0'
  },
  {
    id: 'rule-003',
    ruleCode: 'RULE_CREDIT_LIMIT_DISPATCH_BLOCK',
    name: 'Customer Overdue Credit Limit Weighbridge Gate Pass Block',
    suite: 'SALES_DISPATCH',
    conditionIf: 'Customer.outstandingINR > Customer.creditLimitINR || Customer.overdueDays > 45',
    actionThen: 'BlockWeighbridgePass(); NotifySalesManager("CREDIT_HOLDBACK")',
    isActive: true,
    version: 'v1.5'
  }
];

export const PRECONFIGURED_TASKS: TaskItemSpec[] = [
  {
    id: 'task-001',
    taskCode: 'TSK-1042',
    title: 'Verify Jaw Crusher Maintenance Oil Pressure Sensors',
    assignee: 'Karan Singh (Maintenance)',
    suite: 'Mining & Quarry',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    dueDate: '2026-08-06 05:00 PM',
    checklistCount: { done: 3, total: 4 }
  },
  {
    id: 'task-002',
    taskCode: 'TSK-1043',
    title: 'Reconcile GST Portal Input Tax Credits for July 2026',
    assignee: 'Meera Rao (Accounts)',
    suite: 'Finance & Accounts',
    priority: 'NORMAL',
    status: 'TODO',
    dueDate: '2026-08-08 06:00 PM',
    checklistCount: { done: 0, total: 5 }
  },
  {
    id: 'task-003',
    taskCode: 'TSK-1044',
    title: 'Inspect Tipper KA-04-E-9920 Hydraulic Lift Cylinder',
    assignee: 'Suresh Patil (Fleet)',
    suite: 'Fleet & Logistics',
    priority: 'URGENT',
    status: 'UNDER_REVIEW',
    dueDate: '2026-08-06 02:00 PM',
    checklistCount: { done: 2, total: 2 }
  }
];

export const IMMUTABLE_AUDIT_LOGS: AuditLogSpec[] = [
  {
    id: 'aud-9901',
    timestamp: '2026-08-06 11:15:04',
    userEmail: 'nafidkhan@racezoneventures.com',
    actionType: 'APPROVE',
    entityName: 'ApprovalRequest',
    entityId: 'APR-2026-903',
    ipAddress: '103.21.124.89',
    tenantId: 'tenant-rzm-group',
    fieldChanges: [
      { field: 'status', oldValue: 'PENDING_LEVEL_3', newValue: 'FULLY_APPROVED' },
      { field: 'digitalSignatureHash', oldValue: 'null', newValue: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
    ]
  },
  {
    id: 'aud-9902',
    timestamp: '2026-08-06 10:30:12',
    userEmail: 'sanjay.varma@rzminetrix.com',
    actionType: 'CREATE',
    entityName: 'WorkflowInstance',
    entityId: 'WF-MINING-BLAST-04',
    ipAddress: '103.21.124.92',
    tenantId: 'tenant-rzm-group',
    fieldChanges: [
      { field: 'status', oldValue: 'DRAFT', newValue: 'IN_EXECUTION' }
    ]
  }
];

export const WORKFLOW_DATABASE_SCHEMA_TABLES = [
  {
    name: 'wf_definitions',
    description: 'BPMN-compliant workflow template definitions with JSON node states and execution rules.',
    columns: [
      'id UUID PRIMARY KEY DEFAULT uuid_generate_v7()',
      'tenant_id UUID NOT NULL',
      'workflow_code VARCHAR(64) NOT NULL UNIQUE',
      'title VARCHAR(255) NOT NULL',
      'category VARCHAR(32) NOT NULL',
      'version VARCHAR(16) DEFAULT "v1.0"',
      'node_graph_json JSONB NOT NULL',
      'is_active BOOLEAN DEFAULT TRUE',
      'created_at TIMESTAMPTZ DEFAULT NOW()'
    ]
  },
  {
    name: 'approval_requests',
    description: 'Multi-level approval state engine storing approval levels, current approvers, and digital signature hashes.',
    columns: [
      'id UUID PRIMARY KEY DEFAULT uuid_generate_v7()',
      'tenant_id UUID NOT NULL',
      'request_code VARCHAR(64) NOT NULL UNIQUE',
      'module_category VARCHAR(32) NOT NULL',
      'requester_user_id UUID NOT NULL',
      'amount_inr NUMERIC(14,2)',
      'current_level INT DEFAULT 1',
      'total_levels INT DEFAULT 1',
      'status VARCHAR(32) DEFAULT "PENDING"',
      'sla_due_date TIMESTAMPTZ NOT NULL'
    ]
  },
  {
    name: 'business_rules',
    description: 'Dynamic business rule definitions with compiled expressions and execution logs.',
    columns: [
      'id UUID PRIMARY KEY DEFAULT uuid_generate_v7()',
      'tenant_id UUID NOT NULL',
      'rule_code VARCHAR(64) NOT NULL UNIQUE',
      'suite_scope VARCHAR(32) NOT NULL',
      'condition_if TEXT NOT NULL',
      'action_then TEXT NOT NULL',
      'version VARCHAR(16) DEFAULT "v1.0"',
      'is_active BOOLEAN DEFAULT TRUE'
    ]
  },
  {
    name: 'audit_logs',
    description: 'Immutable append-only ledger for field-level deltas, digital signatures, and IP logs.',
    columns: [
      'id UUID PRIMARY KEY DEFAULT uuid_generate_v7()',
      'tenant_id UUID NOT NULL',
      'user_email VARCHAR(255) NOT NULL',
      'action_type VARCHAR(32) NOT NULL',
      'entity_name VARCHAR(64) NOT NULL',
      'entity_id VARCHAR(64) NOT NULL',
      'field_deltas_json JSONB NOT NULL',
      'ip_address VARCHAR(45) NOT NULL',
      'sha256_hash VARCHAR(64) NOT NULL',
      'timestamp TIMESTAMPTZ DEFAULT NOW()'
    ]
  }
];

export const WORKFLOW_TEST_SUITE = [
  { test: 'Unit Test: BPMN Workflow Node State Machine Transitions & Rollbacks', status: 'Passed (100% Coverage)' },
  { test: 'Unit Test: Multi-Level Sequential & Parallel Approval Decision Evaluator', status: 'Passed (100% Coverage)' },
  { test: 'Unit Test: Business Rule Expression Compiler & Threshold Evaluator', status: 'Passed (100% Coverage)' },
  { test: 'Integration Test: Multi-Tenant Tenant Isolation Guard in Approval Inboxes', status: 'Passed (100% Coverage)' },
  { test: 'Security Test: Immutable Audit Ledger SHA-256 Hash Verification', status: 'Passed (100% Coverage)' },
  { test: 'API Test: Emergency Escalation Router & WhatsApp Alert Notification Engine', status: 'Passed (100% Coverage)' },
  { test: 'API Test: SLA Violation Alarm Calculator (< 10ms Latency)', status: 'Passed (100% Coverage)' },
  { test: 'API Test: Digital Signature Verification & Cryptographic Stamp', status: 'Passed (100% Coverage)' }
];
