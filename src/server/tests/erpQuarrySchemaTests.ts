import { runDatabaseMigrations } from '../db/migrationRunner.js';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { QuarryRepository } from '../repositories/quarryRepository.js';

export interface ErpQuarrySchemaTestResult {
  testName: string;
  passed: boolean;
  message: string;
}

export async function runErpQuarrySchemaTests(): Promise<{
  skipped: boolean;
  skipReason?: string;
  executedAt: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  results: ErpQuarrySchemaTestResult[];
}> {
  const executedAt = new Date().toISOString();
  const results: ErpQuarrySchemaTestResult[] = [];

  if (!isPostgresEnabled()) {
    return {
      skipped: true,
      skipReason: 'DATABASE_URL is not configured',
      executedAt,
      totalTests: 0,
      passedCount: 0,
      failedCount: 0,
      results: []
    };
  }

  await runDatabaseMigrations(process.env.DATABASE_URL || process.env.POSTGRES_URL || '');

  const tenantA = `tenant-erp-a-${Date.now()}`;
  const tenantB = `tenant-erp-b-${Date.now()}`;
  const quarryRepo = new QuarryRepository();

  const tableCheck = await withTenantTransaction(tenantA, async (client) => {
    const result = await client.query(
      `SELECT tablename, rowsecurity
       FROM pg_tables
       WHERE schemaname = 'public' AND tablename LIKE 'erp_%'
       ORDER BY tablename`
    );
    return result.rows;
  });

  results.push({
    testName: 'ERP quarry foundation tables exist with RLS enabled',
    passed: tableCheck.length >= 8 && tableCheck.every((row) => row.rowsecurity === true),
    message: `tables=${tableCheck.length}`
  });

  const quarryA = await quarryRepo.create(tenantA, {
    companyId: 'comp-test-a',
    code: 'QRY-A',
    name: 'Tenant A Quarry'
  });

  results.push({
    testName: 'Create quarry within tenant transaction',
    passed: quarryA.tenantId === tenantA && quarryA.code === 'QRY-A',
    message: quarryA.id
  });

  const visibleToA = await quarryRepo.findById(tenantA, quarryA.id);
  results.push({
    testName: 'Tenant A can read own quarry',
    passed: visibleToA?.id === quarryA.id,
    message: visibleToA?.name || 'not found'
  });

  const visibleToB = await quarryRepo.findById(tenantB, quarryA.id);
  results.push({
    testName: 'Tenant B cannot read Tenant A quarry',
    passed: visibleToB === null,
    message: visibleToB ? 'unexpected cross-tenant read' : 'isolated'
  });

  let crossTenantInsertBlocked = false;
  try {
    await withTenantTransaction(tenantB, async (client) => {
      await client.query(
        `INSERT INTO erp_quarries (
          id, tenant_id, company_id, code, name, mineral_type, operational_status
        ) VALUES ($1, $2, $3, $4, $5, 'HARD_ROCK', 'ACTIVE')`,
        [`quarry-cross-${Date.now()}`, tenantA, 'comp-test-b', 'CROSS', 'Cross Tenant Quarry']
      );
    });
  } catch {
    crossTenantInsertBlocked = true;
  }

  results.push({
    testName: 'Cross-tenant quarry INSERT blocked by RLS',
    passed: crossTenantInsertBlocked,
    message: crossTenantInsertBlocked ? 'blocked' : 'insert succeeded unexpectedly'
  });

  const passedCount = results.filter((result) => result.passed).length;
  return {
    skipped: false,
    executedAt,
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
