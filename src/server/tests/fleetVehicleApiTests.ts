import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, loginQuarryManager, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

function vehiclePayload(overrides: Record<string, unknown> = {}) {
  return {
    registrationNumber: uniqueCode('KA19').replace(/\./g, ''),
    vehicleType: 'TIPPER',
    make: 'Tata',
    model: 'Signa',
    variant: '3518.S',
    manufacturingYear: 2022,
    fuelType: 'DIESEL',
    ownershipType: 'COMPANY',
    ownerReference: 'RZ Mining Fleet',
    capacity: 28,
    capacityUnit: 'TON',
    insuranceReference: 'INS-2026-001',
    fitnessReference: 'FIT-2026-001',
    permitReference: 'PMT-KA-2026',
    ...overrides
  };
}

export async function runFleetVehicleApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const manager = await loginQuarryManager(app);
  const results: ModuleTestResult[] = [];

  const unauthorized = await request(app).get('/api/v1/fleet/vehicles');
  results.push({
    testName: 'GET vehicles requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const created = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  results.push({
    testName: 'POST vehicle creates master record',
    passed:
      created.status === 201 &&
      Boolean(created.body?.data?.id) &&
      created.body?.data?.status === 'ACTIVE' &&
      created.body?.data?.vehicleType === 'TIPPER' &&
      Boolean(created.body?.data?.createdAt),
    message: `status=${created.status} id=${created.body?.data?.id}`
  });

  const vehicleId = created.body?.data?.id as string;
  const registration = created.body?.data?.registrationNumber as string;

  const retrieved = await request(app).get(`/api/v1/fleet/vehicles/${vehicleId}`).set(ctx.header);
  results.push({
    testName: 'GET vehicle persists in PostgreSQL',
    passed:
      retrieved.status === 200 &&
      retrieved.body?.data?.id === vehicleId &&
      retrieved.body?.data?.registrationNumber === registration &&
      retrieved.body?.data?.capacity === 28,
    message: `status=${retrieved.status}`
  });

  const listed = await request(app).get(`/api/v1/fleet/vehicles?search=${encodeURIComponent(registration)}`).set(ctx.header);
  results.push({
    testName: 'GET vehicles lists created record',
    passed:
      listed.status === 200 &&
      Array.isArray(listed.body?.data) &&
      listed.body.data.some((row: { id: string }) => row.id === vehicleId),
    message: `status=${listed.status} count=${listed.body?.data?.length}`
  });

  const duplicate = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(
    vehiclePayload({ registrationNumber: registration })
  );
  results.push({
    testName: 'Duplicate registration is rejected',
    passed: duplicate.status === 409 && duplicate.body?.error === 'DUPLICATE_REGISTRATION',
    message: `status=${duplicate.status} error=${duplicate.body?.error}`
  });

  const badCapacity = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload({ capacity: -5 }));
  results.push({
    testName: 'Invalid capacity is rejected',
    passed: badCapacity.status === 400,
    message: `status=${badCapacity.status}`
  });

  const badYear = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload({ manufacturingYear: 1901 }));
  results.push({
    testName: 'Invalid year is rejected',
    passed: badYear.status === 400,
    message: `status=${badYear.status}`
  });

  const badStatus = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload({ status: 'BROKEN' }));
  results.push({
    testName: 'Invalid status is rejected',
    passed: badStatus.status === 400,
    message: `status=${badStatus.status}`
  });

  const emptyReg = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload({ registrationNumber: '' }));
  results.push({
    testName: 'Empty registration is rejected',
    passed: emptyReg.status === 400,
    message: `status=${emptyReg.status}`
  });

  const clientTenant = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(
    vehiclePayload({ tenantId: 'tenant-apex-quarry-002' })
  );
  results.push({
    testName: 'POST vehicle rejects client-supplied tenantId',
    passed: clientTenant.status === 400,
    message: `status=${clientTenant.status}`
  });

  const managerList = await request(app).get('/api/v1/fleet/vehicles').set(manager.header);
  results.push({
    testName: 'Read-only quarry manager can view vehicles',
    passed: managerList.status === 200 && Array.isArray(managerList.body?.data),
    message: `status=${managerList.status}`
  });

  const managerCreate = await request(app).post('/api/v1/fleet/vehicles').set(manager.header).send(vehiclePayload());
  results.push({
    testName: 'Read-only quarry manager cannot create vehicles',
    passed: managerCreate.status === 403,
    message: `status=${managerCreate.status}`
  });

  const otherList = await request(app).get('/api/v1/fleet/vehicles').set(other.header);
  results.push({
    testName: 'Other tenant is denied vehicle view',
    passed: otherList.status === 403,
    message: `status=${otherList.status}`
  });

  const otherGet = await request(app).get(`/api/v1/fleet/vehicles/${vehicleId}`).set(other.header);
  results.push({
    testName: 'Tenant isolation blocks vehicle retrieval',
    passed: otherGet.status === 403,
    message: `status=${otherGet.status}`
  });

  const otherPatch = await request(app).patch(`/api/v1/fleet/vehicles/${vehicleId}`).set(other.header).send({ status: 'INACTIVE' });
  results.push({
    testName: 'Cross-tenant update is blocked',
    passed: otherPatch.status === 403,
    message: `status=${otherPatch.status}`
  });

  const otherDelete = await request(app).delete(`/api/v1/fleet/vehicles/${vehicleId}`).set(other.header);
  results.push({
    testName: 'Cross-tenant archive is blocked',
    passed: otherDelete.status === 403,
    message: `status=${otherDelete.status}`
  });

  const patched = await request(app).patch(`/api/v1/fleet/vehicles/${vehicleId}`).set(ctx.header).send({
    status: 'MAINTENANCE',
    capacity: 30
  });
  results.push({
    testName: 'PATCH vehicle updates status and capacity',
    passed: patched.status === 200 && patched.body?.data?.status === 'MAINTENANCE' && patched.body?.data?.capacity === 30,
    message: `status=${patched.status} vehicleStatus=${patched.body?.data?.status}`
  });

  const second = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  const rollback = await request(app).patch(`/api/v1/fleet/vehicles/${second.body.data.id}`).set(ctx.header).send({
    registrationNumber: registration
  });
  const secondAfter = await request(app).get(`/api/v1/fleet/vehicles/${second.body.data.id}`).set(ctx.header);
  results.push({
    testName: 'Duplicate registration update rolls back original row',
    passed:
      rollback.status === 409 &&
      secondAfter.status === 200 &&
      secondAfter.body?.data?.registrationNumber === second.body.data.registrationNumber,
    message: `status=${rollback.status} kept=${secondAfter.body?.data?.registrationNumber}`
  });

  const audit = await request(app).get('/api/v1/audit/search').set(ctx.header);
  const auditHits = Array.isArray(audit.body?.data)
    ? audit.body.data.some((row: { resource?: string; action?: string }) =>
        String(row.resource || '').includes('/api/v1/fleet/vehicles') || String(row.action || '').includes('API_POST_MUTATION')
      )
    : false;
  results.push({
    testName: 'Audit record created for vehicle mutation',
    passed: audit.status === 200 && auditHits,
    message: `status=${audit.status} hits=${auditHits}`
  });

  const archived = await request(app).delete(`/api/v1/fleet/vehicles/${vehicleId}`).set(ctx.header);
  const afterArchive = await request(app).get(`/api/v1/fleet/vehicles/${vehicleId}`).set(ctx.header);
  const listedAfter = await request(app).get('/api/v1/fleet/vehicles').set(ctx.header);
  results.push({
    testName: 'DELETE vehicle soft-archives and hides from list',
    passed:
      archived.status === 200 &&
      afterArchive.status === 404 &&
      Array.isArray(listedAfter.body?.data) &&
      !listedAfter.body.data.some((row: { id: string }) => row.id === vehicleId),
    message: `archive=${archived.status} get=${afterArchive.status}`
  });

  const passedCount = results.filter((row) => row.passed).length;
  return {
    skipped: false,
    executedAt,
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
