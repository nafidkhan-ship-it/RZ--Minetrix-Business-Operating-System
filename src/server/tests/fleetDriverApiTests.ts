import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, loginQuarryManager, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

function driverPayload(overrides: Record<string, unknown> = {}) {
  return {
    fullName: 'Ramesh Hegde',
    phone: '9845012345',
    licenseNumber: uniqueCode('KA19DL').replace(/\./g, ''),
    licenseClass: 'HMV',
    licenseIssueDate: '2022-01-15',
    licenseExpiryDate: '2030-01-14',
    badgeCode: uniqueCode('BDG').replace(/\./g, ''),
    status: 'ACTIVE',
    notes: 'Primary Bantwal tipper driver',
    ...overrides
  };
}

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
    capacityUnit: 'TON',
    ...overrides
  };
}

export async function runFleetDriverApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const manager = await loginQuarryManager(app);
  const results: ModuleTestResult[] = [];

  const unauthorized = await request(app).get('/api/v1/fleet/drivers');
  results.push({
    testName: 'GET drivers requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const created = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(driverPayload());
  results.push({
    testName: 'POST driver creates master record',
    passed:
      created.status === 201 &&
      Boolean(created.body?.data?.id) &&
      created.body?.data?.status === 'ACTIVE' &&
      created.body?.data?.licenseClass === 'HMV' &&
      Boolean(created.body?.data?.createdAt),
    message: `status=${created.status} id=${created.body?.data?.id}`
  });

  const driverId = created.body?.data?.id as string;
  const licenseNumber = created.body?.data?.licenseNumber as string;

  const retrieved = await request(app).get(`/api/v1/fleet/drivers/${driverId}`).set(ctx.header);
  results.push({
    testName: 'GET driver persists in PostgreSQL',
    passed:
      retrieved.status === 200 &&
      retrieved.body?.data?.id === driverId &&
      retrieved.body?.data?.licenseNumber === licenseNumber &&
      retrieved.body?.data?.fullName === 'Ramesh Hegde',
    message: `status=${retrieved.status}`
  });

  const listed = await request(app).get(`/api/v1/fleet/drivers?search=${encodeURIComponent(licenseNumber)}`).set(ctx.header);
  results.push({
    testName: 'GET drivers lists created record',
    passed:
      listed.status === 200 &&
      Array.isArray(listed.body?.data) &&
      listed.body.data.some((row: { id: string }) => row.id === driverId),
    message: `status=${listed.status} count=${listed.body?.data?.length}`
  });

  const licenseFilter = await request(app)
    .get(`/api/v1/fleet/drivers?licenseNumber=${encodeURIComponent(licenseNumber)}&licenseClass=HMV`)
    .set(ctx.header);
  results.push({
    testName: 'GET drivers supports license filters',
    passed:
      licenseFilter.status === 200 &&
      Array.isArray(licenseFilter.body?.data) &&
      licenseFilter.body.data.some((row: { id: string }) => row.id === driverId),
    message: `status=${licenseFilter.status}`
  });

  const duplicate = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(
    driverPayload({ licenseNumber })
  );
  results.push({
    testName: 'Duplicate license is rejected',
    passed: duplicate.status === 409 && duplicate.body?.error === 'DUPLICATE_LICENSE',
    message: `status=${duplicate.status} error=${duplicate.body?.error}`
  });

  const emptyName = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(driverPayload({ fullName: '   ' }));
  results.push({
    testName: 'Empty name is rejected',
    passed: emptyName.status === 400,
    message: `status=${emptyName.status}`
  });

  const badStatus = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(driverPayload({ status: 'BANNED' }));
  results.push({
    testName: 'Invalid status is rejected',
    passed: badStatus.status === 400,
    message: `status=${badStatus.status}`
  });

  const badDate = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(
    driverPayload({ licenseIssueDate: '2030-01-01', licenseExpiryDate: '2020-01-01' })
  );
  results.push({
    testName: 'Invalid license dates are rejected',
    passed: badDate.status === 400,
    message: `status=${badDate.status}`
  });

  const badEmployee = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(
    driverPayload({ employeeId: uniqueCode('emp') })
  );
  results.push({
    testName: 'Invalid employee reference is rejected',
    passed: badEmployee.status === 404,
    message: `status=${badEmployee.status}`
  });

  const clientTenant = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(
    driverPayload({ tenantId: 'tenant-apex-quarry-002' })
  );
  results.push({
    testName: 'POST driver rejects client-supplied tenantId',
    passed: clientTenant.status === 400,
    message: `status=${clientTenant.status}`
  });

  const managerList = await request(app).get('/api/v1/fleet/drivers').set(manager.header);
  results.push({
    testName: 'Read-only quarry manager can view drivers',
    passed: managerList.status === 200 && Array.isArray(managerList.body?.data),
    message: `status=${managerList.status}`
  });

  const managerCreate = await request(app).post('/api/v1/fleet/drivers').set(manager.header).send(driverPayload());
  results.push({
    testName: 'Read-only quarry manager cannot create drivers',
    passed: managerCreate.status === 403,
    message: `status=${managerCreate.status}`
  });

  const otherList = await request(app).get('/api/v1/fleet/drivers').set(other.header);
  results.push({
    testName: 'Other tenant is denied driver view',
    passed: otherList.status === 403,
    message: `status=${otherList.status}`
  });

  const otherGet = await request(app).get(`/api/v1/fleet/drivers/${driverId}`).set(other.header);
  results.push({
    testName: 'Tenant isolation blocks driver retrieval',
    passed: otherGet.status === 403,
    message: `status=${otherGet.status}`
  });

  const otherPatch = await request(app).patch(`/api/v1/fleet/drivers/${driverId}`).set(other.header).send({ status: 'SUSPENDED' });
  results.push({
    testName: 'Cross-tenant update is blocked',
    passed: otherPatch.status === 403,
    message: `status=${otherPatch.status}`
  });

  const otherDelete = await request(app).delete(`/api/v1/fleet/drivers/${driverId}`).set(other.header);
  results.push({
    testName: 'Cross-tenant archive is blocked',
    passed: otherDelete.status === 403,
    message: `status=${otherDelete.status}`
  });

  const ownVehicle = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  const assigned = await request(app).patch(`/api/v1/fleet/drivers/${driverId}`).set(ctx.header).send({
    status: 'SUSPENDED',
    assignedVehicleId: ownVehicle.body?.data?.id
  });
  results.push({
    testName: 'PATCH driver updates status and vehicle assignment',
    passed:
      assigned.status === 200 &&
      assigned.body?.data?.status === 'SUSPENDED' &&
      assigned.body?.data?.assignedVehicleId === ownVehicle.body?.data?.id,
    message: `status=${assigned.status} assigned=${assigned.body?.data?.assignedVehicleId}`
  });

  const retiredVehicle = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  await request(app).patch(`/api/v1/fleet/vehicles/${retiredVehicle.body.data.id}`).set(ctx.header).send({ status: 'RETIRED' });
  const retiredAssign = await request(app).patch(`/api/v1/fleet/drivers/${driverId}`).set(ctx.header).send({
    assignedVehicleId: retiredVehicle.body.data.id
  });
  results.push({
    testName: 'Retired vehicle assignment is rejected',
    passed: retiredAssign.status === 409 && retiredAssign.body?.error === 'VEHICLE_NOT_ASSIGNABLE',
    message: `status=${retiredAssign.status} error=${retiredAssign.body?.error}`
  });

  const archivedVehicle = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  await request(app).delete(`/api/v1/fleet/vehicles/${archivedVehicle.body.data.id}`).set(ctx.header);
  const archivedAssign = await request(app).patch(`/api/v1/fleet/drivers/${driverId}`).set(ctx.header).send({
    assignedVehicleId: archivedVehicle.body.data.id
  });
  results.push({
    testName: 'Archived vehicle assignment is rejected',
    passed: archivedAssign.status === 404,
    message: `status=${archivedAssign.status}`
  });

  const foreignVehicleId = `veh-apex-${Date.now()}`;
  await withTenantTransaction('tenant-apex-quarry-002', async (client) => {
    await client.query(
      `INSERT INTO fleet_vehicles (
        id, tenant_id, registration_number, vehicle_type, make, model, manufacturing_year,
        fuel_type, ownership_type, capacity
      ) VALUES ($1,$2,$3,'TIPPER','Tata','Signa',2022,'DIESEL','COMPANY',20)`,
      [foreignVehicleId, 'tenant-apex-quarry-002', `APX-${Date.now().toString().slice(-6)}`]
    );
  });
  const crossVehicle = await request(app).patch(`/api/v1/fleet/drivers/${driverId}`).set(ctx.header).send({
    assignedVehicleId: foreignVehicleId
  });
  results.push({
    testName: 'Cross-tenant vehicle assignment is blocked',
    passed: crossVehicle.status === 404,
    message: `status=${crossVehicle.status}`
  });

  const second = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(driverPayload());
  const rollback = await request(app).patch(`/api/v1/fleet/drivers/${second.body.data.id}`).set(ctx.header).send({
    licenseNumber
  });
  const secondAfter = await request(app).get(`/api/v1/fleet/drivers/${second.body.data.id}`).set(ctx.header);
  results.push({
    testName: 'Duplicate license update rolls back original row',
    passed:
      rollback.status === 409 &&
      secondAfter.status === 200 &&
      secondAfter.body?.data?.licenseNumber === second.body.data.licenseNumber,
    message: `status=${rollback.status} kept=${secondAfter.body?.data?.licenseNumber}`
  });

  const audit = await request(app).get('/api/v1/audit/search').set(ctx.header);
  const auditHits = Array.isArray(audit.body?.data)
    ? audit.body.data.some((row: { resource?: string; action?: string }) =>
        String(row.resource || '').includes('/api/v1/fleet/drivers') || String(row.action || '').includes('API_POST_MUTATION')
      )
    : false;
  results.push({
    testName: 'Audit record created for driver mutation',
    passed: audit.status === 200 && auditHits,
    message: `status=${audit.status} hits=${auditHits}`
  });

  const archived = await request(app).delete(`/api/v1/fleet/drivers/${driverId}`).set(ctx.header);
  const afterArchive = await request(app).get(`/api/v1/fleet/drivers/${driverId}`).set(ctx.header);
  const listedAfter = await request(app).get('/api/v1/fleet/drivers').set(ctx.header);
  results.push({
    testName: 'DELETE driver soft-archives and hides from list',
    passed:
      archived.status === 200 &&
      afterArchive.status === 404 &&
      Array.isArray(listedAfter.body?.data) &&
      !listedAfter.body.data.some((row: { id: string }) => row.id === driverId),
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
