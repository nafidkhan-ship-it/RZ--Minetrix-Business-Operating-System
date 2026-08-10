-- RZ® Minetrix BOS - Shared Core Idempotent Migration 0001
-- PostgreSQL Drizzle Schema Initializer with Constraints & Foreign Keys

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to validate/generate UUID v7 if custom extension missing
CREATE OR REPLACE FUNCTION generate_uuid_v7()
RETURNS uuid AS $$
DECLARE
  v_time timestamp with time zone:= clock_timestamp();
  v_secs bigint := extract(epoch from v_time);
  v_msec bigint := extract(millisecond from v_time);
  v_timestamp bigint := (v_secs * 1000) + v_msec;
  v_hex text;
BEGIN
  v_hex := lpad(to_hex(v_timestamp), 12, '0') || '7' || lpad(to_hex(floor(random() * 4095)::bigint), 3, '0') || '8' || lpad(to_hex(floor(random() * 4095)::bigint), 3, '0') || lpad(to_hex(floor(random() * 281474976710655)::bigint), 12, '0');
  RETURN v_hex::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 1. Tenants Table
CREATE TABLE IF NOT EXISTS core_tenants (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  code VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  tier VARCHAR(32) NOT NULL DEFAULT 'ENTERPRISE',
  settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_core_tenants_code ON core_tenants(code);
CREATE INDEX IF NOT EXISTS idx_core_tenants_domain ON core_tenants(domain);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS core_companies (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(64) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  country VARCHAR(100) NOT NULL DEFAULT 'USA',
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT uq_company_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_core_companies_tenant ON core_companies(tenant_id);

-- 3. Branches Table
CREATE TABLE IF NOT EXISTS core_branches (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES core_companies(id) ON DELETE RESTRICT,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  location_type VARCHAR(32) NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT uq_branch_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_core_branches_tenant ON core_branches(tenant_id);

-- 4. Users Table
CREATE TABLE IF NOT EXISTS core_users (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES core_companies(id) ON DELETE RESTRICT,
  branch_id UUID REFERENCES core_branches(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  salt VARCHAR(128) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  department VARCHAR(128) NOT NULL,
  designation VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT uq_user_tenant_email UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_core_users_tenant ON core_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_core_users_email ON core_users(email);

-- 5. Audit Logs Table (Immutable)
CREATE TABLE IF NOT EXISTS core_audit_logs (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL,
  actor_email VARCHAR(255) NOT NULL,
  action VARCHAR(128) NOT NULL,
  module VARCHAR(128) NOT NULL,
  resource TEXT NOT NULL,
  resource_id VARCHAR(128),
  ip_address VARCHAR(64) NOT NULL,
  correlation_id UUID NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_core_audit_tenant ON core_audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_core_audit_created ON core_audit_logs(created_at);
