-- RZ® Minetrix BOS - Shared Core Migration 0003
-- Full platform state snapshot for entities not yet split into dedicated tables.
-- Relational core tables from 0001 remain authoritative for tenants, companies,
-- branches, users, and audit logs as those migrations expand.

CREATE TABLE IF NOT EXISTS core_platform_snapshot (
  snapshot_key TEXT PRIMARY KEY DEFAULT 'primary',
  state_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
