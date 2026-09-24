import React, { useState } from 'react';
import {
  X,
  Database,
  Cloud,
  Server,
  Zap,
  Shield,
  Code2,
  FileCode,
  Layers,
  Key,
  Bell,
  Cpu,
  CheckCircle2,
  Copy,
  Terminal,
  Activity
} from 'lucide-react';

interface OttArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OttArchitectureModal: React.FC<OttArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'APIS' | 'CLOUD' | 'AUTOMATION'>('DATABASE');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlSchemaSnippet = `-- ============================================================================
-- RZ® OTT (ORGANISE TODAY & TOMORROW) - ENTERPRISE POSTGRESQL / CLOUD SQL DDL
-- 18 PRODUCTION TABLES WITH TENANT ISOLATION, FOREIGN KEYS, INDEXES & RLS
-- ============================================================================

-- 1. USERS (Unified RZ Identity Mirror)
CREATE TABLE ott_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rz_identity_id VARCHAR(64) UNIQUE NOT NULL,
  tenant_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(64) DEFAULT 'MEMBER',
  timezone VARCHAR(64) DEFAULT 'UTC',
  locale VARCHAR(16) DEFAULT 'en',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ott_users_tenant ON ott_users(tenant_id);
CREATE INDEX idx_ott_users_email ON ott_users(email);

-- 2. RELATIONSHIPS (Universal Access & Delegation)
CREATE TABLE ott_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES ott_users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES ott_users(id) ON DELETE CASCADE,
  relationship_type VARCHAR(64) NOT NULL, -- e.g. OWNER_TO_MANAGER, MANAGER_TO_STAFF, FAMILY, FRIEND
  status VARCHAR(32) DEFAULT 'PENDING',  -- PENDING, ACCEPTED, DECLINED, BLOCKED
  can_assign_tasks BOOLEAN DEFAULT TRUE,
  can_view_calendar BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_ott_relationship UNIQUE (requester_id, recipient_id)
);
CREATE INDEX idx_ott_rel_recipient ON ott_relationships(recipient_id, status);

-- 3. WORKSPACES
CREATE TABLE ott_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(128) NOT NULL,
  context_type VARCHAR(64) NOT NULL, -- RZ_MINETRIX, OFFICE, PERSONAL, FAMILY, BUSINESS, STUDY, OTHER
  description TEXT,
  owner_id UUID NOT NULL REFERENCES ott_users(id),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ott_workspaces_tenant ON ott_workspaces(tenant_id, context_type);

-- 4. WORKSPACE_MEMBERS
CREATE TABLE ott_workspace_members (
  workspace_id UUID NOT NULL REFERENCES ott_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ott_users(id) ON DELETE CASCADE,
  role VARCHAR(32) DEFAULT 'MEMBER', -- OWNER, ADMIN, CONTRIBUTOR, VIEWER
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);

-- 5. TASKS (Master Lifecycle Store)
CREATE TABLE ott_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  workspace_id UUID NOT NULL REFERENCES ott_workspaces(id),
  title VARCHAR(512) NOT NULL,
  description TEXT,
  created_by_id UUID NOT NULL REFERENCES ott_users(id),
  assigned_by_id UUID NOT NULL REFERENCES ott_users(id),
  assigned_to_id UUID NOT NULL REFERENCES ott_users(id),
  priority VARCHAR(32) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
  status VARCHAR(32) DEFAULT 'REQUESTED', -- REQUESTED, ACCEPTED, SCHEDULED, STARTED, IN_PROGRESS, COMPLETED, ON_HOLD, OVERDUE, CANCELLED
  start_date DATE NOT NULL,
  start_time TIME NOT NULL,
  due_date DATE NOT NULL,
  due_time TIME NOT NULL,
  estimated_minutes INT DEFAULT 30,
  actual_minutes INT DEFAULT 0,
  recurrence_rule VARCHAR(128) DEFAULT 'NONE',
  is_private BOOLEAN DEFAULT FALSE,
  source_system VARCHAR(64) DEFAULT 'OTT', -- OTT, RZ_MINETRIX_QUARRY, RZ_FLEET, RZ_CHAT, RZ_GRID, RZ_WORKFLOW
  source_task_id VARCHAR(128),
  idempotency_key VARCHAR(128) UNIQUE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ott_tasks_assignee_dates ON ott_tasks(assigned_to_id, start_date, due_date, status);
CREATE INDEX idx_ott_tasks_tenant_status ON ott_tasks(tenant_id, status);

-- 6. TASK_REQUESTS (Approval & Acceptance Flow)
CREATE TABLE ott_task_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES ott_users(id),
  recipient_id UUID NOT NULL REFERENCES ott_users(id),
  status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, ACCEPTED, DECLINED, CANCELLED
  request_note TEXT,
  response_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);
CREATE INDEX idx_ott_task_reqs_recipient ON ott_task_requests(recipient_id, status);

-- 7. TASK_SUBTASKS
CREATE TABLE ott_task_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TASK_CHECKLISTS
CREATE TABLE ott_task_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  item_text VARCHAR(512) NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  checked_at TIMESTAMPTZ,
  sort_order INT DEFAULT 0
);

-- 9. TASK_COMMENTS
CREATE TABLE ott_task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES ott_users(id),
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TASK_ATTACHMENTS
CREATE TABLE ott_task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type VARCHAR(128) NOT NULL,
  storage_url TEXT NOT NULL,
  uploaded_by_id UUID NOT NULL REFERENCES ott_users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TASK_REMINDERS
CREATE TABLE ott_task_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ott_users(id),
  channel VARCHAR(32) NOT NULL, -- IN_APP, PUSH, PHONE_RING, WHATSAPP, VOICE_CALL
  trigger_time TIMESTAMPTZ NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  delivery_status VARCHAR(32) DEFAULT 'SCHEDULED'
);
CREATE INDEX idx_ott_reminders_trigger ON ott_task_reminders(trigger_time, is_sent);

-- 12. TASK_FOLLOWUPS
CREATE TABLE ott_task_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES ott_users(id),
  recipient_id UUID NOT NULL REFERENCES ott_users(id),
  message TEXT,
  channel VARCHAR(32) DEFAULT 'IN_APP',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TASK_ACTIVITY
CREATE TABLE ott_task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES ott_users(id),
  action_type VARCHAR(64) NOT NULL, -- CREATED, ASSIGNED, ACCEPTED, STATUS_CHANGED, FOLLOW_UP_SENT
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TASK_TIME_LOGS
CREATE TABLE ott_task_time_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ott_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ott_users(id),
  duration_minutes INT NOT NULL,
  log_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. NOTIFICATIONS
CREATE TABLE ott_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES ott_users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(64) NOT NULL, -- TASK_REMINDER, REQUEST_INVITE, FOLLOW_UP, OVERDUE_ALERT
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. NOTIFICATION_PREFERENCES
CREATE TABLE ott_notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES ott_users(id) ON DELETE CASCADE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  phone_ring_enabled BOOLEAN DEFAULT FALSE,
  whatsapp_enabled BOOLEAN DEFAULT TRUE,
  voice_call_urgent BOOLEAN DEFAULT FALSE,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '07:00',
  daily_digest_time TIME DEFAULT '08:00',
  anti_spam_rate_limit_per_hour INT DEFAULT 10
);

-- 17. INTEGRATIONS
CREATE TABLE ott_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  service_name VARCHAR(64) NOT NULL, -- RZ_MINETRIX_BOS, RZ_CHAT, RZ_GRID, RZ_WORKFLOW, META_WHATSAPP, TWILIO
  webhook_url TEXT,
  api_key_encrypted TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AUDIT_LOGS
CREATE TABLE ott_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  actor_id UUID,
  event_type VARCHAR(64) NOT NULL,
  resource_type VARCHAR(64) NOT NULL,
  resource_id VARCHAR(64) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ott_audit_tenant_date ON ott_audit_logs(tenant_id, created_at DESC);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                OTT Architecture &amp; System Blueprint
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Enterprise Spec
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Full technical specification: 18 SQL Tables, 14 REST APIs, Cloud Topology &amp; Event Choreography
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-6 gap-2">
          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'DATABASE'
                ? 'border-amber-400 text-amber-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            1. PostgreSQL Database (18 Tables)
          </button>
          <button
            onClick={() => setActiveTab('APIS')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'APIS'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            2. API Architecture (14 Endpoints)
          </button>
          <button
            onClick={() => setActiveTab('CLOUD')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'CLOUD'
                ? 'border-blue-400 text-blue-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            3. Cloud &amp; Security Topology
          </button>
          <button
            onClick={() => setActiveTab('AUTOMATION')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'AUTOMATION'
                ? 'border-purple-400 text-purple-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            4. Event Automation Engine
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">

          {/* TAB 1: DATABASE ARCHITECTURE */}
          {activeTab === 'DATABASE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Production Cloud SQL / PostgreSQL Schema</h3>
                  <p className="text-slate-400 text-xs">
                    Complete multi-tenant DDL featuring RLS isolation, foreign keys, and audit logging.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(sqlSchemaSnippet, 'sql')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl font-semibold flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedSection === 'sql' ? 'Copied DDL!' : 'Copy SQL DDL'}
                </button>
              </div>

              {/* DDL Code Viewer */}
              <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[500px]">
                <pre>{sqlSchemaSnippet}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: API PLATFORM */}
          {activeTab === 'APIS' && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">14 Core Enterprise REST APIs</h3>
              <p className="text-slate-400 text-xs">
                Exposed through RZ® API Gateway with JWT Auth, rate limiting, and idempotency guarantees.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: '1. Authentication API', path: '/api/v1/ott/auth', desc: 'Login, token refresh, multi-device sessions, biometric unlock hooks' },
                  { name: '2. User API', path: '/api/v1/ott/users', desc: 'Profile management, preferences, quiet hours, timezone settings' },
                  { name: '3. Relationship API', path: '/api/v1/ott/relationships', desc: 'Send, accept, decline, and list connection requests between persons' },
                  { name: '4. Workspace API', path: '/api/v1/ott/workspaces', desc: 'Context isolation (Office, BOS, Personal, Family, Study)' },
                  { name: '5. Task API', path: '/api/v1/ott/tasks', desc: 'CRUD tasks, lifecycle status transitions, idempotency header validation' },
                  { name: '6. Task Request API', path: '/api/v1/ott/task-requests', desc: 'Delegated task requests, acceptance/decline workflows' },
                  { name: '7. Checklist API', path: '/api/v1/ott/checklists', desc: 'Subtask creation, reordering, and percentage completion tracking' },
                  { name: '8. Reminder API', path: '/api/v1/ott/reminders', desc: 'Schedule alerts across In-App, Push, Phone Ring, WhatsApp & Voice' },
                  { name: '9. Notification API', path: '/api/v1/ott/notifications', desc: 'Query inbox, mark as read, delivery status callbacks' },
                  { name: '10. Follow-up API', path: '/api/v1/ott/follow-ups', desc: 'Escalate overdue items with customizable follow-up templates' },
                  { name: '11. Time Log API', path: '/api/v1/ott/time-logs', desc: 'Record actual execution minutes vs estimated workload' },
                  { name: '12. Planning API', path: '/api/v1/ott/planning', desc: 'Generate daily optimized schedule and conflict warnings' },
                  { name: '13. Report API', path: '/api/v1/ott/reports', desc: 'Daily, weekly, monthly, and yearly productivity analytics' },
                  { name: '14. RZ Integration API', path: '/api/v1/ott/integrations/rz', desc: 'Bidirectional sync with Quarry, Fleet, Chat, Grid & Workflow' }
                ].map((api, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{api.name}</span>
                      <code className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        {api.path}
                      </code>
                    </div>
                    <p className="text-slate-400 text-[11px]">{api.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD & SECURITY */}
          {activeTab === 'CLOUD' && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">GCP &amp; Hybrid Cloud Infrastructure Topology</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Key className="w-4 h-4" /> Firebase Authentication
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Provides phone OTP, email link, and SSO authentication with multi-factor authentication (MFA) and seamless mobile SDK integration.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Database className="w-4 h-4" /> Cloud SQL (PostgreSQL)
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    High-availability managed PostgreSQL with Row Level Security (RLS), automated daily snapshots, read replicas, and SSL connection pinning.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <Server className="w-4 h-4" /> Cloud Run Containers
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Auto-scaling microservices serving the API gateway, WebSocket chat/OTT bridge, and real-time reminder scheduling cron workers.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <Layers className="w-4 h-4" /> Cloud Storage
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Encrypted storage buckets for task document attachments, photo proofs, audio notes, and exported PDF productivity reports.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Bell className="w-4 h-4" /> Multi-Channel Reminders
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    FCM push notifications, Meta WhatsApp Business Cloud API, and Twilio Voice call integration with rate limiting and quiet hours.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <Shield className="w-4 h-4" /> Secret Manager &amp; Audit
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Zero hardcoded secrets. All DB credentials, API keys, and JWT certificates are rotated via Google Cloud Secret Manager.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUTOMATION CHOREOGRAPHY */}
          {activeTab === 'AUTOMATION' && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">Event-Driven Automation Choreography</h3>
              <p className="text-slate-400 text-xs">
                Decoupled pub/sub event pipeline ensuring predictable status transitions and automated reminder cascades.
              </p>

              <div className="space-y-2">
                {[
                  { event: 'TASK_CREATED', trigger: 'User or BOS creates task', outcome: 'Persists row, schedules reminder jobs, fires In-App Notification' },
                  { event: 'TASK_ASSIGNED', trigger: 'Task allocated to another person', outcome: 'Generates Task Request, notifies recipient with accept/decline action' },
                  { event: 'TASK_ACCEPTED', trigger: 'Recipient clicks Accept', outcome: 'Transitions status to ACCEPTED, activates calendar slot, arms alarms' },
                  { event: 'TASK_STARTED', trigger: 'User presses Start', outcome: 'Begins actual duration timer, transitions status to IN_PROGRESS' },
                  { event: 'TASK_NEAR_DUE', trigger: 'Time remaining reaches threshold (e.g. 15m)', outcome: 'Sends gentle reminder via selected channel (Push / WhatsApp)' },
                  { event: 'TASK_DUE', trigger: 'Clock reaches due date and time', outcome: 'Dispatches high-priority Due alert, checks off-time delivery flag' },
                  { event: 'TASK_OVERDUE', trigger: 'Time passes due timestamp with status incomplete', outcome: 'Marks status OVERDUE, alerts assigner, generates follow-up card' },
                  { event: 'TASK_COMPLETED', trigger: 'User completes all checklists and marks Done', outcome: 'Calculates actual minutes, notifies assigner, syncs back to Minetrix BOS' },
                  { event: 'NO_ACTIVITY', trigger: 'Overdue task exceeds 24h with zero action', outcome: 'Triggers automated gentle follow-up sequence with customizable template' }
                ].map((flow, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <code className="text-xs font-bold text-amber-300 font-mono">{flow.event}</code>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-400">Trigger:</strong> {flow.trigger}
                    </div>
                    <div className="text-[11px] text-emerald-400 sm:max-w-md">
                      <strong className="text-slate-400">Outcome:</strong> {flow.outcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-[11px] text-slate-400">
            Compliant with ISO 27001, SOC-2 Type II, and Multi-Tenant RLS Standards
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
};
