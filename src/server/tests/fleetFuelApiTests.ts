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

function fuelPayload(vehicleId: string, overrides: Record<string, unknown> = {}) {
  return {
    vehicleId,
    fuelType: 'DIESEL',
    quantity: 120,
    rate: 94.5,
    odometerReading: 42100,
    stationName: 'HP Pump Bantwal',
    referenceNumber: uniqueCode('FUEL').replace(/\./g, '-'),
    ...overrides
  };
}

export async function runFleetFuelApiTests() {
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

  const unauthorized = await request(app).get('/api/v1/fleet/fuel');
  results.push({ testName: 'GET fuel requires authentication', passed: unauthorized.status === 401, message: `status=${unauthorized.status}` });

  const created = await request(app).post('/api/v1/fleet/fuel').set(ctx.header).send(fuelPayload(vehicleId));
  const expectedTotal = Math.round(120 * 94.5 * 100) / 100;
  results.push({
    testName: 'POST fuel creates record with server-side total',
    passed:
      created.status === 201 &&
      Boolean(created.body?.data?.id) &&
      created.body?.data?.totalAmount === expectedTotal,
    message: `status=${created.status} total=${created.body?.data?.totalAmount}`
  });

  const fuelId = created.body?.data?.id as string;
  const referenceNumber = created.body?.data?.referenceNumber as string;

  const retrieved = await request(app).get(`/api/v1/fleet/fuel/${fuelId}`).set(ctx.header);
  results.push({
    testName: 'GET fuel persists in PostgreSQL',
    passed: retrieved.status === 200 && retrieved.body?.data?.vehicleId === vehicleId,
    message: `status=${retrieved.status}`
  });

  const listed = await request(app).get(`/api/v1/fleet/fuel?vehicleId=${vehicleId}`).set(ctx.header);
  results.push({
    testName: 'GET fuel lists created record',
    passed: listed.status === 200 && listed.body?.data?.some((row: { id: string }) => row.id === fuelId),
    message: `status=${listed.status}`
  });

  const badQuantity = await request(app).post('/api/v1/fleet/fuel').set(ctx.header).send(fuelPayload(vehicleId, { quantity: 0 }));
  results.push({ testName: 'Invalid quantity is rejected', passed: badQuantity.status === 400, message: `status=${badQuantity.status}` });

  const badRate = await request(app).post('/api/v1/fleet/fuel').set(ctx.header).send(fuelPayload(vehicleId, { rate: -1 }));
  results.push({ testName: 'Invalid rate is rejected', passed: badRate.status === 400, message: `status=${badRate.status}` });

  const clientTotal = await request(app).post('/api/v1/fleet/fuel').set(ctx.header).send(fuelPayload(vehicleId, { totalAmount: 999 }));
  results.push({ testName: 'Client-supplied totalAmount is rejected', passed: clientTotal.status === 400, message: `status=${clientTotal.status}` });

  const duplicate = await request(app).post('/api/v1/fleet/fuel').set(ctx.header).send(fuelPayload(vehicleId, { referenceNumber }));
  results.push({
    testName: 'Duplicate reference number is rejected',
    passed: duplicate.status === 409 && duplicate.body?.error === 'DUPLICATE_REFERENCE',
    message: `status=${duplicate.status}`
  });

  const foreignVehicleId = `veh-apex-fuel-${Date.now()}`;
  await withTenantTransaction('tenant-apex-quarry-002', async (client) => {
    await client.query(
      `INSERT INTO fleet_vehicles (
        id, tenant_id, registration_number, vehicle_type, make, model, manufacturing_year,
        fuel_type, ownership_type, capacity
      ) VALUES ($1,$2,$3,'TIPPER','Tata','Signa',2022,'DIESEL','COMPANY',20)`,
      [foreignVehicleId, 'tenant-apex-quarry-002', `APX-F-${Date.now().toString().slice(-6)}`]
    );
  });
  const crossVehicle = await request(app).post('/api/v1/fleet/fuel').set(ctx.header).send(fuelPayload(foreignVehicleId));
  results.push({ testName: 'Cross-tenant vehicle reference is blocked', passed: crossVehicle.status === 404, message: `status=${crossVehicle.status}` });

  const managerCreate = await request(app).post('/api/v1/fleet/fuel').set(manager.header).send(fuelPayload(vehicleId));
  results.push({ testName: 'Read-only quarry manager cannot create fuel', passed: managerCreate.status === 403, message: `status=${managerCreate.status}` });

  const otherGet = await request(app).get(`/api/v1/fleet/fuel/${fuelId}`).set(other.header);
  results.push({ testName: 'Tenant isolation blocks fuel retrieval', passed: otherGet.status === 403, message: `status=${otherGet.status}` });

  const patched = await request(app).patch(`/api/v1/fleet/fuel/${fuelId}`).set(ctx.header).send({ quantity: 100, rate: 95 });
  const patchedTotal = Math.round(100 * 95 * 100) / 100;
  results.push({
    testName: 'PATCH fuel recalculates total server-side',
    passed: patched.status === 200 && patched.body?.data?.totalAmount === patchedTotal,
    message: `status=${patched.status} total=${patched.body?.data?.totalAmount}`
  });

  const audit = await request(app).get('/api/v1/audit/search').set(ctx.header);
  const auditHits = Array.isArray(audit.body?.data)
    ? audit.body.data.some((row: { resource?: string }) => String(row.resource || '').includes('/api/v1/fleet/fuel'))
    : false;
  results.push({ testName: 'Audit record created for fuel mutation', passed: audit.status === 200 && auditHits, message: `status=${audit.status}` });

  const archived = await request(app).delete(`/api/v1/fleet/fuel/${fuelId}`).set(ctx.header);
  const afterArchive = await request(app).get(`/api/v1/fleet/fuel/${fuelId}`).set(ctx.header);
  results.push({
    testName: 'DELETE fuel soft-archives record',
    passed: archived.status === 200 && afterArchive.status === 404,
    message: `archive=${archived.status} get=${afterArchive.status}`
  });

  const passedCount = results.filter((row) => row.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
