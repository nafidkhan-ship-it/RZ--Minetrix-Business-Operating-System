-- RZ® Minetrix BOS - Migration 0004
-- Align RLS-protected tables with application string tenant IDs and enforce WITH CHECK

DROP POLICY IF EXISTS tenant_isolation_core_companies ON core_companies;
DROP POLICY IF EXISTS tenant_isolation_core_branches ON core_branches;
DROP POLICY IF EXISTS tenant_isolation_core_users ON core_users;
DROP POLICY IF EXISTS tenant_isolation_core_audit_logs ON core_audit_logs;

ALTER TABLE core_companies DROP CONSTRAINT IF EXISTS core_companies_tenant_id_fkey;
ALTER TABLE core_branches DROP CONSTRAINT IF EXISTS core_branches_tenant_id_fkey;
ALTER TABLE core_branches DROP CONSTRAINT IF EXISTS core_branches_company_id_fkey;
ALTER TABLE core_users DROP CONSTRAINT IF EXISTS core_users_tenant_id_fkey;
ALTER TABLE core_users DROP CONSTRAINT IF EXISTS core_users_company_id_fkey;
ALTER TABLE core_users DROP CONSTRAINT IF EXISTS core_users_branch_id_fkey;
ALTER TABLE core_audit_logs DROP CONSTRAINT IF EXISTS core_audit_logs_tenant_id_fkey;

ALTER TABLE core_tenants ALTER COLUMN id TYPE VARCHAR(128);
ALTER TABLE core_companies ALTER COLUMN id TYPE VARCHAR(128);
ALTER TABLE core_companies ALTER COLUMN tenant_id TYPE VARCHAR(128);
ALTER TABLE core_branches ALTER COLUMN id TYPE VARCHAR(128);
ALTER TABLE core_branches ALTER COLUMN tenant_id TYPE VARCHAR(128);
ALTER TABLE core_branches ALTER COLUMN company_id TYPE VARCHAR(128);
ALTER TABLE core_users ALTER COLUMN id TYPE VARCHAR(128);
ALTER TABLE core_users ALTER COLUMN tenant_id TYPE VARCHAR(128);
ALTER TABLE core_users ALTER COLUMN company_id TYPE VARCHAR(128);
ALTER TABLE core_users ALTER COLUMN branch_id TYPE VARCHAR(128);
ALTER TABLE core_audit_logs ALTER COLUMN id TYPE VARCHAR(128);
ALTER TABLE core_audit_logs ALTER COLUMN tenant_id TYPE VARCHAR(128);
ALTER TABLE core_audit_logs ALTER COLUMN actor_user_id TYPE VARCHAR(128);
ALTER TABLE core_audit_logs ALTER COLUMN correlation_id TYPE VARCHAR(128);

CREATE POLICY tenant_isolation_core_companies ON core_companies
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_core_branches ON core_branches
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_core_users ON core_users
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_core_audit_logs ON core_audit_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

ALTER TABLE core_companies FORCE ROW LEVEL SECURITY;
ALTER TABLE core_branches FORCE ROW LEVEL SECURITY;
ALTER TABLE core_users FORCE ROW LEVEL SECURITY;
ALTER TABLE core_audit_logs FORCE ROW LEVEL SECURITY;
