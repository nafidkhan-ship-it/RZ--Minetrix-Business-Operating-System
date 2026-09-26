-- RZ® Minetrix BOS - Migration 0017
-- PostgreSQL-backed in-app notifications with tenant isolation

CREATE TABLE IF NOT EXISTS core_notifications (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  recipient_user_id VARCHAR(128) NOT NULL,
  notification_type VARCHAR(32) NOT NULL DEFAULT 'INFO',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  related_module VARCHAR(64),
  related_record_type VARCHAR(64),
  related_record_id VARCHAR(128),
  link_url VARCHAR(512),
  channel VARCHAR(32) NOT NULL DEFAULT 'IN_APP',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_core_notifications_type CHECK (notification_type IN ('INFO', 'WARNING', 'CRITICAL', 'SUCCESS')),
  CONSTRAINT chk_core_notifications_channel CHECK (channel IN ('IN_APP', 'EMAIL', 'WHATSAPP', 'PUSH', 'SMS'))
);

CREATE INDEX IF NOT EXISTS idx_core_notifications_tenant ON core_notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_core_notifications_recipient ON core_notifications(tenant_id, recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_core_notifications_unread ON core_notifications(tenant_id, recipient_user_id, is_read);

ALTER TABLE core_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_notifications FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_core_notifications ON core_notifications;
CREATE POLICY tenant_isolation_core_notifications ON core_notifications
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));
