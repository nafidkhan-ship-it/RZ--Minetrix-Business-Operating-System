/**
 * PostgreSQL tenant context for Row-Level Security (RLS).
 *
 * Each tenant-scoped transaction calls:
 *   SELECT set_config('app.current_tenant_id', <tenantId>, true)
 * where the third argument (is_local=true) makes the setting transaction-local
 * (equivalent to SET LOCAL). The setting is cleared on COMMIT or ROLLBACK.
 *
 * Tenant IDs are always derived from authenticated server-side context
 * (JWT + user record). Client-supplied x-tenant-id is validated in
 * enforceTenantContext middleware before this module is used.
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import pg from 'pg';
import { getPostgresPool, isPostgresEnabled } from './postgresPool.js';

const requestTenantStorage = new AsyncLocalStorage<string>();

/** Bind authenticated tenant ID to the current async request scope (not global). */
export function runWithRequestTenant<T>(tenantId: string, fn: () => T): T {
  return requestTenantStorage.run(tenantId, fn);
}

/** Tenant ID bound for the current request, if any. */
export function getRequestTenantId(): string | undefined {
  return requestTenantStorage.getStore();
}

/**
 * Run a callback inside a PostgreSQL transaction with transaction-local tenant context.
 * Uses parameterized set_config — never string-interpolate tenant IDs into SQL.
 */
export async function withTenantTransaction<T>(
  tenantId: string,
  fn: (client: pg.PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPostgresPool();
  if (!pool) {
    throw new Error('PostgreSQL is not configured (DATABASE_URL missing).');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [tenantId]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/** Run without tenant context (bootstrap / migrations only). */
export async function withPlatformTransaction<T>(
  fn: (client: pg.PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPostgresPool();
  if (!pool) {
    throw new Error('PostgreSQL is not configured (DATABASE_URL missing).');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export function isPostgresPersistenceActive(): boolean {
  return isPostgresEnabled();
}
