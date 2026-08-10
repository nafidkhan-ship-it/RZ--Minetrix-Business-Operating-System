-- RZ® Minetrix BOS - Shared Core Migration 0002
-- PostgreSQL Row-Level Security (RLS) Tenant Isolation Policies

-- Enable RLS on core multi-tenant tables
ALTER TABLE core_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Tenant Isolation Policy for core_companies
DROP POLICY IF EXISTS tenant_isolation_core_companies ON core_companies;
CREATE POLICY tenant_isolation_core_companies ON core_companies
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 2. Tenant Isolation Policy for core_branches
DROP POLICY IF EXISTS tenant_isolation_core_branches ON core_branches;
CREATE POLICY tenant_isolation_core_branches ON core_branches
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 3. Tenant Isolation Policy for core_users
DROP POLICY IF EXISTS tenant_isolation_core_users ON core_users;
CREATE POLICY tenant_isolation_core_users ON core_users
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 4. Tenant Isolation Policy for core_audit_logs
DROP POLICY IF EXISTS tenant_isolation_core_audit_logs ON core_audit_logs;
CREATE POLICY tenant_isolation_core_audit_logs ON core_audit_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
