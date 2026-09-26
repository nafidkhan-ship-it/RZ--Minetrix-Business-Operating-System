import pg from 'pg';
import { Company, Branch, User, AuditLog } from './schema.js';
import { withPlatformTransaction, withTenantTransaction } from './tenantContext.js';
import { isPostgresEnabled } from './postgresPool.js';

export async function syncRelationalTenantData(data: {
  companies: Company[];
  branches: Branch[];
  users: User[];
  auditLogs: AuditLog[];
}): Promise<void> {
  if (!isPostgresEnabled()) {
    return;
  }

  const tenantIds = new Set<string>([
    ...data.companies.map((c) => c.tenantId),
    ...data.branches.map((b) => b.tenantId),
    ...data.users.map((u) => u.tenantId),
    ...data.auditLogs.map((l) => l.tenantId)
  ]);

  for (const tenantId of tenantIds) {
    await withTenantTransaction(tenantId, async (client) => {
      await client.query('DELETE FROM core_audit_logs WHERE tenant_id = $1', [tenantId]);
      await client.query('DELETE FROM core_users WHERE tenant_id = $1', [tenantId]);
      await client.query('DELETE FROM core_branches WHERE tenant_id = $1', [tenantId]);
      await client.query('DELETE FROM core_companies WHERE tenant_id = $1', [tenantId]);
    });
  }

  for (const company of data.companies) {
    await withTenantTransaction(company.tenantId, async (client) => {
      await upsertCompany(client, company);
    });
  }

  for (const branch of data.branches) {
    await withTenantTransaction(branch.tenantId, async (client) => {
      await upsertBranch(client, branch);
    });
  }

  for (const user of data.users) {
    await withTenantTransaction(user.tenantId, async (client) => {
      await upsertUser(client, user);
    });
  }

  for (const log of data.auditLogs) {
    await withTenantTransaction(log.tenantId, async (client) => {
      await upsertAuditLog(client, log);
    });
  }
}

async function upsertCompany(client: pg.PoolClient, company: Company): Promise<void> {
  await client.query(
    `INSERT INTO core_companies (
      id, tenant_id, code, name, tax_id, currency, country, status,
      created_at, updated_at, created_by, updated_by, deleted_at, version
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    ON CONFLICT (id) DO UPDATE SET
      tenant_id = EXCLUDED.tenant_id,
      code = EXCLUDED.code,
      name = EXCLUDED.name,
      tax_id = EXCLUDED.tax_id,
      currency = EXCLUDED.currency,
      country = EXCLUDED.country,
      status = EXCLUDED.status,
      updated_at = EXCLUDED.updated_at,
      deleted_at = EXCLUDED.deleted_at,
      version = EXCLUDED.version`,
    [
      company.id,
      company.tenantId,
      company.code,
      company.name,
      company.taxId,
      company.currency,
      company.country,
      company.status,
      company.createdAt,
      company.updatedAt,
      company.createdBy || null,
      company.updatedBy || null,
      company.deletedAt || null,
      company.version
    ]
  );
}

async function upsertBranch(client: pg.PoolClient, branch: Branch): Promise<void> {
  await client.query(
    `INSERT INTO core_branches (
      id, tenant_id, company_id, code, name, location_type, address, status,
      created_at, updated_at, version
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (id) DO UPDATE SET
      tenant_id = EXCLUDED.tenant_id,
      company_id = EXCLUDED.company_id,
      code = EXCLUDED.code,
      name = EXCLUDED.name,
      location_type = EXCLUDED.location_type,
      address = EXCLUDED.address,
      status = EXCLUDED.status,
      updated_at = EXCLUDED.updated_at,
      version = EXCLUDED.version`,
    [
      branch.id,
      branch.tenantId,
      branch.companyId,
      branch.code,
      branch.name,
      branch.locationType,
      branch.address,
      branch.status,
      branch.createdAt,
      branch.updatedAt,
      branch.version
    ]
  );
}

async function upsertUser(client: pg.PoolClient, user: User): Promise<void> {
  await client.query(
    `INSERT INTO core_users (
      id, tenant_id, company_id, branch_id, email, password_hash, salt,
      full_name, phone, department, designation, status, is_mfa_enabled,
      created_at, updated_at, deleted_at, version
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
    ON CONFLICT (id) DO UPDATE SET
      tenant_id = EXCLUDED.tenant_id,
      company_id = EXCLUDED.company_id,
      branch_id = EXCLUDED.branch_id,
      email = EXCLUDED.email,
      password_hash = EXCLUDED.password_hash,
      salt = EXCLUDED.salt,
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      department = EXCLUDED.department,
      designation = EXCLUDED.designation,
      status = EXCLUDED.status,
      is_mfa_enabled = EXCLUDED.is_mfa_enabled,
      updated_at = EXCLUDED.updated_at,
      deleted_at = EXCLUDED.deleted_at,
      version = EXCLUDED.version`,
    [
      user.id,
      user.tenantId,
      user.companyId,
      user.branchId || null,
      user.email,
      user.passwordHash,
      user.salt,
      user.fullName,
      user.phone || null,
      user.department,
      user.designation,
      user.status,
      user.isMfaEnabled,
      user.createdAt,
      user.updatedAt,
      user.deletedAt || null,
      user.version
    ]
  );
}

async function upsertAuditLog(client: pg.PoolClient, log: AuditLog): Promise<void> {
  await client.query(
    `INSERT INTO core_audit_logs (
      id, tenant_id, actor_user_id, actor_email, action, module, resource,
      resource_id, ip_address, correlation_id, status, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (id) DO NOTHING`,
    [
      log.id,
      log.tenantId,
      log.actorUserId,
      log.actorEmail,
      log.action,
      log.module,
      log.resource,
      log.resourceId || null,
      log.ipAddress,
      log.correlationId,
      log.status,
      log.createdAt
    ]
  );
}

/** Tenant-scoped reads used by RLS integration and runtime verification. */
export async function selectCompaniesForTenant(tenantId: string): Promise<Array<{ id: string; tenant_id: string; name: string }>> {
  return withTenantTransaction(tenantId, async (client) => {
    const result = await client.query(
      `SELECT id, tenant_id, name FROM core_companies WHERE deleted_at IS NULL ORDER BY code`
    );
    return result.rows;
  });
}

export async function insertCompanyForTenant(
  tenantId: string,
  company: { id: string; code: string; name: string; taxId: string }
): Promise<void> {
  const now = new Date().toISOString();
  await withTenantTransaction(tenantId, async (client) => {
    await client.query(
      `INSERT INTO core_companies (
        id, tenant_id, code, name, tax_id, currency, country, status, created_at, updated_at, version
      ) VALUES ($1,$2,$3,$4,$5,'USD','USA','ACTIVE',$6,$6,1)`,
      [company.id, tenantId, company.code, company.name, company.taxId, now]
    );
  });
}

export async function insertCompanyCrossTenantAttempt(
  activeTenantId: string,
  otherTenantId: string,
  company: { id: string; code: string; name: string; taxId: string }
): Promise<void> {
  const now = new Date().toISOString();
  await withTenantTransaction(activeTenantId, async (client) => {
    await client.query(
      `INSERT INTO core_companies (
        id, tenant_id, code, name, tax_id, currency, country, status, created_at, updated_at, version
      ) VALUES ($1,$2,$3,$4,$5,'USD','USA','ACTIVE',$6,$6,1)`,
      [company.id, otherTenantId, company.code, company.name, company.taxId, now]
    );
  });
}

export async function updateCompanyCrossTenantAttempt(
  activeTenantId: string,
  companyId: string,
  newName: string
): Promise<number> {
  return withTenantTransaction(activeTenantId, async (client) => {
    const result = await client.query(
      `UPDATE core_companies SET name = $1, updated_at = NOW() WHERE id = $2`,
      [newName, companyId]
    );
    return result.rowCount || 0;
  });
}

export async function deleteCompanyCrossTenantAttempt(
  activeTenantId: string,
  companyId: string
): Promise<number> {
  return withTenantTransaction(activeTenantId, async (client) => {
    const result = await client.query(`DELETE FROM core_companies WHERE id = $1`, [companyId]);
    return result.rowCount || 0;
  });
}

export async function readTenantContextFromSession(client: pg.PoolClient): Promise<string | null> {
  const result = await client.query(
    `SELECT NULLIF(current_setting('app.current_tenant_id', true), '') AS tenant_id`
  );
  return result.rows[0]?.tenant_id || null;
}
