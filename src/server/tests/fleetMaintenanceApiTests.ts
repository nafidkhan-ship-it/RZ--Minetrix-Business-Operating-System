import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, loginQuarryManager, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

function vehiclePayload(overrides: Record<string, unknown> = {}) {
  return {
    registrationNumber: uniqueCode('KA19').replace(/\./g, ''),
    vehicleType: 'TIPPER',
    make: 'Tata',
    model: 'Signa',
    manufacturingYear: 2022,
    fuelType: 'DIESEL',
    ownershipType: 'COMPANY',
    capacity: 28,
    ...overrides
  };
}

function maintenancePayload(vehicleId: string, overrides: Record<string, unknown> = {}) {
  return {
    vehicleId,
    maintenanceType: 'Engine Service',
    serviceDate: '2026-08-01',
    odometerReading: 42000,
    workshopName: 'RZ Workshop',
    description: 'Oil and filter change',
    cost: 8500,
    status: 'OPEN',
    ...overrides
  };
}

export async function runFleetMaintenanceApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const manager = await loginQuarryManager(app);
  const results: ModuleTestResult[] = [];

  const vehicle = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  const vehicleId = vehicle.body?.data?.id as string;

  const unauthorized = await request(app).get('/api/v1/fleet/maintenance');
  results.push({ testName: 'GET maintenance requires authentication', passed: unauthorized.status === 401, message: `status=${unauthorized.status}` });

  const created = await request(app).post('/api/v1/fleet/maintenance').set(ctx.header).send(maintenancePayload(vehicleId));
  results.push({
    testName: 'POST maintenance creates record',
    passed: created.status === 201 && Boolean(created.body?.data?.id) && created.body?.data?.status === 'OPEN',
    message: `status=${created.status} id=${created.body?.data?.id}`
  });

  const maintenanceId = created.body?.data?.id as string;

  const retrieved = await request(app).get(`/api/v1/fleet/maintenance/${maintenanceId}`).set(ctx.header);
  results.push({
    testName: 'GET maintenance persists in PostgreSQL',
    passed: retrieved.status === 200 && retrieved.body?.data?.vehicleId === vehicleId && retrieved.body?.data?.cost === 8500,
    message: `status=${retrieved.status}`
  });

  const listed = await request(app).get(`/api/v1/fleet/maintenance?vehicleId=${vehicleId}`).set(ctx.header);
  results.push({
    testName: 'GET maintenance lists created record',
    passed: listed.status === 200 && listed.body?.data?.some((row: { id: string }) => row.id === maintenanceId),
    message: `status=${listed.status}`
  });

  const badCost = await request(app).post('/api/v1/fleet/maintenance').set(ctx.header).send(maintenancePayload(vehicleId, { cost: -1 }));
  results.push({ testName: 'Invalid cost is rejected', passed: badCost.status === 400, message: `status=${badCost.status}` });

  const badStatus = await request(app).post('/api/v1/fleet/maintenance').set(ctx.header).send(maintenancePayload(vehicleId, { status: 'BROKEN' }));
  results.push({ testName: 'Invalid status is rejected', passed: badStatus.status === 400, message: `status=${badStatus.status}` });

  const foreignVehicleId = `veh-apex-maint-${Date.now()}`;
  await withTenantTransaction('tenant-apex-quarry-002', async (client) => {
    await client.query(
      `INSERT INTO fleet_vehicles (
        id, tenant_id, registration_number, vehicle_type, make, model, manufacturing_year,
        fuel_type, ownership_type, capacity
      ) VALUES ($1,$2,$3,'TIPPER','Tata','Signa',2022,'DIESEL','COMPANY',20)`,
      [foreignVehicleId, 'tenant-apex-quarry-002', `APX-M-${Date.now().toString().slice(-6)}`]
    );
  });
  const crossVehicle = await request(app).post('/api/v1/fleet/maintenance').set(ctx.header).send(maintenancePayload(foreignVehicleId));
  results.push({ testName: 'Cross-tenant vehicle reference is blocked', passed: crossVehicle.status === 404, message: `status=${crossVehicle.status}` });

  const managerCreate = await request(app).post('/api/v1/fleet/maintenance').set(manager.header).send(maintenancePayload(vehicleId));
  results.push({ testName: 'Read-only quarry manager cannot create maintenance', passed: managerCreate.status === 403, message: `status=${managerCreate.status}` });

  const otherGet = await request(app).get(`/api/v1/fleet/maintenance/${maintenanceId}`).set(other.header);
  results.push({ testName: 'Tenant isolation blocks maintenance retrieval', passed: otherGet.status === 403, message: `status=${otherGet.status}` });

  const patched = await request(app).patch(`/api/v1/fleet/maintenance/${maintenanceId}`).set(ctx.header).send({ status: 'COMPLETED', cost: 9000 });
  results.push({
    testName: 'PATCH maintenance updates status and cost',
    passed: patched.status === 200 && patched.body?.data?.status === 'COMPLETED' && patched.body?.data?.cost === 9000,
    message: `status=${patched.status}`
  });

  const audit = await request(app).get('/api/v1/audit/search').set(ctx.header);
  const auditHits = Array.isArray(audit.body?.data)
    ? audit.body.data.some((row: { resource?: string }) => String(row.resource || '').includes('/api/v1/fleet/maintenance'))
    : false;
  results.push({ testName: 'Audit record created for maintenance mutation', passed: audit.status === 200 && auditHits, message: `status=${audit.status}` });

  const archived = await request(app).delete(`/api/v1/fleet/maintenance/${maintenanceId}`).set(ctx.header);
  const afterArchive = await request(app).get(`/api/v1/fleet/maintenance/${maintenanceId}`).set(ctx.header);
  results.push({
    testName: 'DELETE maintenance soft-archives record',
    passed: archived.status === 200 && afterArchive.status === 404,
    message: `archive=${archived.status} get=${afterArchive.status}`
  });

  const passedCount = results.filter((row) => row.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
