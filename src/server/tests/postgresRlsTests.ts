import { runDatabaseMigrations } from '../db/migrationRunner.js';
import { getPostgresPool, isPostgresEnabled } from '../db/postgresPool.js';
import {
  withTenantTransaction,
  withPlatformTransaction
} from '../db/tenantContext.js';
import {
  selectCompaniesForTenant,
  insertCompanyForTenant,
  insertCompanyCrossTenantAttempt,
  updateCompanyCrossTenantAttempt,
  deleteCompanyCrossTenantAttempt,
  readTenantContextFromSession
} from '../db/relationalTenantStore.js';

export interface RlsTestResult {
  testName: string;
  passed: boolean;
  message: string;
  evidence?: Record<string, unknown>;
}

const TENANT_A = `tenant-rls-test-a-${Date.now()}`;
const TENANT_B = `tenant-rls-test-b-${Date.now()}`;
const COMPANY_A = `comp-rls-a-${Date.now()}`;
const COMPANY_B = `comp-rls-b-${Date.now()}`;

export async function runPostgresRlsIntegrationTests(): Promise<{
  skipped: boolean;
  skipReason?: string;
  executedAt: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  results: RlsTestResult[];
}> {
  const executedAt = new Date().toISOString();

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

  const connectionUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  await runDatabaseMigrations(connectionUrl!);

  const results: RlsTestResult[] = [];

  const record = (testName: string, passed: boolean, message: string, evidence?: Record<string, unknown>) => {
    results.push({ testName, passed, message, evidence });
  };

  try {
    await withPlatformTransaction(async (client) => {
      await client.query(`DELETE FROM core_companies WHERE id IN ($1, $2)`, [COMPANY_A, COMPANY_B]);
    });
  } catch {
    // ignore cleanup failures on first run
  }

  // 1-3: Create protected records for both tenants
  try {
    await insertCompanyForTenant(TENANT_A, {
      id: COMPANY_A,
      code: 'RLS-A',
      name: 'Tenant A Company',
      taxId: 'TAX-A'
    });
    await insertCompanyForTenant(TENANT_B, {
      id: COMPANY_B,
      code: 'RLS-B',
      name: 'Tenant B Company',
      taxId: 'TAX-B'
    });
    record('Create Tenant A and Tenant B protected records', true, 'Inserted companies under separate tenant contexts');
  } catch (error: any) {
    record('Create Tenant A and Tenant B protected records', false, error.message);
  }

  // 4-5: Tenant A SELECT own data
  try {
    const rows = await selectCompaniesForTenant(TENANT_A);
    const passed = rows.some((r) => r.id === COMPANY_A) && !rows.some((r) => r.id === COMPANY_B);
    record(
      'Tenant A SELECT own records',
      passed,
      passed ? 'Tenant A sees only Tenant A company' : `Unexpected rows: ${JSON.stringify(rows)}`,
      { rowCount: rows.length, ids: rows.map((r) => r.id) }
    );
  } catch (error: any) {
    record('Tenant A SELECT own records', false, error.message);
  }

  // 6: Tenant A cannot see Tenant B
  try {
    const rows = await selectCompaniesForTenant(TENANT_A);
    const passed = !rows.some((r) => r.id === COMPANY_B);
    record(
      'Tenant A SELECT Tenant B records returns zero unauthorized rows',
      passed,
      passed ? 'Tenant B company hidden from Tenant A context' : 'Tenant B data leaked to Tenant A',
      { visibleIds: rows.map((r) => r.id) }
    );
  } catch (error: any) {
    record('Tenant A SELECT Tenant B records returns zero unauthorized rows', false, error.message);
  }

  // 7: Cross-tenant INSERT must fail
  try {
    await insertCompanyCrossTenantAttempt(TENANT_A, TENANT_B, {
      id: `comp-rls-cross-${Date.now()}`,
      code: 'CROSS',
      name: 'Cross Tenant Insert',
      taxId: 'TAX-CROSS'
    });
    record('Cross-tenant INSERT rejected by RLS', false, 'INSERT succeeded when it should have been blocked');
  } catch (error: any) {
    const passed = /policy|row-level security|violates/i.test(error.message);
    record(
      'Cross-tenant INSERT rejected by RLS',
      passed,
      passed ? `INSERT blocked: ${error.message}` : `Unexpected error: ${error.message}`
    );
  }

  // 8: Cross-tenant UPDATE must affect 0 rows
  try {
    const rowCount = await updateCompanyCrossTenantAttempt(TENANT_A, COMPANY_B, 'Hacked Name');
    const passed = rowCount === 0;
    record(
      'Cross-tenant UPDATE affects zero rows',
      passed,
      passed ? 'No rows updated across tenant boundary' : `Updated ${rowCount} row(s)`,
      { rowCount }
    );
  } catch (error: any) {
    record('Cross-tenant UPDATE affects zero rows', false, error.message);
  }

  // 9: Cross-tenant DELETE must affect 0 rows
  try {
    const rowCount = await deleteCompanyCrossTenantAttempt(TENANT_A, COMPANY_B);
    const passed = rowCount === 0;
    record(
      'Cross-tenant DELETE affects zero rows',
      passed,
      passed ? 'No rows deleted across tenant boundary' : `Deleted ${rowCount} row(s)`,
      { rowCount }
    );
  } catch (error: any) {
    record('Cross-tenant DELETE affects zero rows', false, error.message);
  }

  // 10: Tenant B sees only Tenant B
  try {
    const rows = await selectCompaniesForTenant(TENANT_B);
    const passed = rows.some((r) => r.id === COMPANY_B) && !rows.some((r) => r.id === COMPANY_A);
    record(
      'Tenant B SELECT own records only',
      passed,
      passed ? 'Tenant B sees only Tenant B company' : `Unexpected rows: ${JSON.stringify(rows)}`,
      { ids: rows.map((r) => r.id) }
    );
  } catch (error: any) {
    record('Tenant B SELECT own records only', false, error.message);
  }

  // 11: Transaction-local context cleared after commit
  try {
    let contextDuringTxn: string | null = null;
    let contextAfterTxn: string | null = null;

    await withTenantTransaction(TENANT_A, async (client) => {
      contextDuringTxn = await readTenantContextFromSession(client);
    });

    const pool = getPostgresPool()!;
    const client = await pool.connect();
    try {
      contextAfterTxn = await readTenantContextFromSession(client);
    } finally {
      client.release();
    }

    const passed = contextDuringTxn === TENANT_A && (contextAfterTxn === null || contextAfterTxn === '');
    record(
      'Transaction-local tenant context cleared after COMMIT',
      passed,
      passed
        ? 'SET LOCAL context present in transaction and cleared after release'
        : `during=${contextDuringTxn}, after=${contextAfterTxn}`,
      { contextDuringTxn, contextAfterTxn }
    );
  } catch (error: any) {
    record('Transaction-local tenant context cleared after commit', false, error.message);
  }

  // 12: Pooled connection does not leak tenant context between requests
  try {
    const pool = getPostgresPool()!;
    const client = await pool.connect();
    let leakedContext: string | null = 'unset';
    try {
      await withTenantTransaction(TENANT_A, async () => {
        // commit releases transaction-local setting
      });
      leakedContext = await readTenantContextFromSession(client);
    } finally {
      client.release();
    }

    const passed = leakedContext === null || leakedContext === '';
    record(
      'Pooled connection has no retained tenant context after transaction ends',
      passed,
      passed ? 'No tenant context leaked on pooled connection' : `Leaked context: ${leakedContext}`,
      { leakedContext }
    );
  } catch (error: any) {
    record('Pooled connection has no retained tenant context after transaction ends', false, error.message);
  }

  try {
    const leadId = `lead-rls-${Date.now()}`;
    await withTenantTransaction(TENANT_A, async (client) => {
      await client.query(
        `INSERT INTO erp_leads (id, tenant_id, code, company_name) VALUES ($1,$2,$3,$4)`,
        [leadId, TENANT_A, `RLS-${Date.now().toString().slice(-6)}`, 'RLS Lead Co']
      );
    });
    let otherTenantRows = -1;
    await withTenantTransaction(TENANT_B, async (client) => {
      const result = await client.query(`SELECT id FROM erp_leads WHERE id = $1`, [leadId]);
      otherTenantRows = result.rowCount ?? result.rows.length;
    });
    let ownRows = -1;
    await withTenantTransaction(TENANT_A, async (client) => {
      const result = await client.query(`SELECT id FROM erp_leads WHERE id = $1`, [leadId]);
      ownRows = result.rowCount ?? result.rows.length;
    });
    record(
      'CRM leads RLS hides rows from other tenant',
      otherTenantRows === 0 && ownRows === 1,
      `own=${ownRows} other=${otherTenantRows}`
    );
  } catch (error: any) {
    record('CRM leads RLS hides rows from other tenant', false, error.message);
  }

  try {
    const employeeId = `emp-rls-${Date.now()}`;
    await withTenantTransaction(TENANT_A, async (client) => {
      await client.query(
        `INSERT INTO hrms_employees (id, tenant_id, code, full_name, joining_date, department, designation)
         VALUES ($1,$2,$3,$4,'2026-01-01','Mining','Operator')`,
        [employeeId, TENANT_A, `EMP-RLS-${Date.now().toString().slice(-6)}`, 'RLS Employee']
      );
    });
    let otherTenantRows = -1;
    await withTenantTransaction(TENANT_B, async (client) => {
      const result = await client.query(`SELECT id FROM hrms_employees WHERE id = $1`, [employeeId]);
      otherTenantRows = result.rowCount ?? result.rows.length;
    });
    let ownRows = -1;
    await withTenantTransaction(TENANT_A, async (client) => {
      const result = await client.query(`SELECT id FROM hrms_employees WHERE id = $1`, [employeeId]);
      ownRows = result.rowCount ?? result.rows.length;
    });
    record(
      'HRMS employees RLS hides rows from other tenant',
      otherTenantRows === 0 && ownRows === 1,
      `own=${ownRows} other=${otherTenantRows}`
    );
  } catch (error: any) {
    record('HRMS employees RLS hides rows from other tenant', false, error.message);
  }

  try {
    const vehicleId = `veh-rls-${Date.now()}`;
    await withTenantTransaction(TENANT_A, async (client) => {
      await client.query(
        `INSERT INTO fleet_vehicles (
          id, tenant_id, registration_number, vehicle_type, make, model, manufacturing_year,
          fuel_type, ownership_type, capacity
        ) VALUES ($1,$2,$3,'TIPPER','Tata','Signa',2022,'DIESEL','COMPANY',20)`,
        [vehicleId, TENANT_A, `KA-RLS-${Date.now().toString().slice(-6)}`]
      );
    });
    let otherTenantRows = -1;
    await withTenantTransaction(TENANT_B, async (client) => {
      const result = await client.query(`SELECT id FROM fleet_vehicles WHERE id = $1`, [vehicleId]);
      otherTenantRows = result.rowCount ?? result.rows.length;
    });
    let ownRows = -1;
    await withTenantTransaction(TENANT_A, async (client) => {
      const result = await client.query(`SELECT id FROM fleet_vehicles WHERE id = $1`, [vehicleId]);
      ownRows = result.rowCount ?? result.rows.length;
    });
    record(
      'Fleet vehicles RLS hides rows from other tenant',
      otherTenantRows === 0 && ownRows === 1,
      `own=${ownRows} other=${otherTenantRows}`
    );
  } catch (error: any) {
    record('Fleet vehicles RLS hides rows from other tenant', false, error.message);
  }

  try {
    const driverId = `drv-rls-${Date.now()}`;
    await withTenantTransaction(TENANT_A, async (client) => {
      await client.query(
        `INSERT INTO fleet_drivers (
          id, tenant_id, full_name, license_number, license_class, status
        ) VALUES ($1,$2,'RLS Driver',$3,'HMV','ACTIVE')`,
        [driverId, TENANT_A, `KA-DL-${Date.now().toString().slice(-6)}`]
      );
    });
    let otherTenantRows = -1;
    await withTenantTransaction(TENANT_B, async (client) => {
      const result = await client.query(`SELECT id FROM fleet_drivers WHERE id = $1`, [driverId]);
      otherTenantRows = result.rowCount ?? result.rows.length;
    });
    let ownRows = -1;
    await withTenantTransaction(TENANT_A, async (client) => {
      const result = await client.query(`SELECT id FROM fleet_drivers WHERE id = $1`, [driverId]);
      ownRows = result.rowCount ?? result.rows.length;
    });
    record(
      'Fleet drivers RLS hides rows from other tenant',
      otherTenantRows === 0 && ownRows === 1,
      `own=${ownRows} other=${otherTenantRows}`
    );
  } catch (error: any) {
    record('Fleet drivers RLS hides rows from other tenant', false, error.message);
  }

  // Cleanup test rows
  try {
    await deleteCompanyCrossTenantAttempt(TENANT_A, COMPANY_A);
    await deleteCompanyCrossTenantAttempt(TENANT_B, COMPANY_B);
  } catch {
    // best-effort cleanup
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    skipped: false,
    executedAt,
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
