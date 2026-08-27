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

function driverPayload(overrides: Record<string, unknown> = {}) {
  return {
    fullName: 'Fleet Ops Driver',
    licenseNumber: uniqueCode('DL').replace(/\./g, '-'),
    licenseClass: 'HMV',
    status: 'ACTIVE',
    ...overrides
  };
}

function documentPayload(vehicleId: string, overrides: Record<string, unknown> = {}) {
  return {
    vehicleId,
    documentType: 'INSURANCE',
    documentNumber: uniqueCode('INS').replace(/\./g, '-'),
    issueDate: '2025-01-01',
    expiryDate: '2027-12-31',
    ...overrides
  };
}

export async function runFleetOperationApiTests() {
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
  const driver = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(driverPayload());
  const driverId = driver.body?.data?.id as string;

  await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(documentPayload(vehicleId, { documentType: 'INSURANCE' }));
  await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(documentPayload(vehicleId, { documentType: 'FITNESS' }));
  await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(documentPayload(vehicleId, { documentType: 'PERMIT' }));

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({ code: uniqueCode('QO'), name: 'Fleet Ops Quarry' });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PO'),
    name: 'Ops Aggregate',
    category: 'Aggregate',
    defaultUom: 'TON'
  });
  await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BO'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity: 30, quantityUom: 'TON' }]
  });
  const customer = await request(app).post('/api/v1/erp/customers').set(ctx.header).send({
    code: uniqueCode('CO'),
    name: 'Fleet Ops Customer',
    destination: 'Site North'
  });
  const gp = await request(app).post('/api/v1/erp/gate-passes').set(ctx.header).send({
    gatePassNumber: uniqueCode('GPO'),
    quarryId: quarry.body.data.id,
    customerId: customer.body.data.id,
    vehicleNumber: vehicle.body.data.registrationNumber,
    driverName: driver.body.data.fullName,
    destination: 'Site North',
    lines: [{ productId: product.body.data.id, quantity: 10, quantityUom: 'TON' }]
  });
  await request(app).post(`/api/v1/erp/gate-passes/${gp.body.data.id}/approve`).set(ctx.header);
  await request(app).post(`/api/v1/erp/gate-passes/${gp.body.data.id}/issue`).set(ctx.header);
  const dispatch = await request(app).post('/api/v1/erp/dispatches').set(ctx.header).send({
    dispatchNumber: uniqueCode('DSPO'),
    gatePassId: gp.body.data.id
  });

  const unauthorized = await request(app).get('/api/v1/fleet/operations');
  results.push({ testName: 'GET operations requires authentication', passed: unauthorized.status === 401, message: `status=${unauthorized.status}` });

  const created = await request(app).post('/api/v1/fleet/operations').set(ctx.header).send({
    operationNumber: uniqueCode('OP'),
    vehicleId,
    driverId,
    gatePassId: gp.body.data.id,
    dispatchId: dispatch.body.data.id,
    destination: 'Site North',
    status: 'ASSIGNED'
  });
  results.push({
    testName: 'POST fleet operation creates valid assignment',
    passed:
      created.status === 201 &&
      Boolean(created.body?.data?.id) &&
      created.body?.data?.gatePassId === gp.body.data.id &&
      created.body?.data?.dispatchId === dispatch.body.data.id,
    message: `status=${created.status} id=${created.body?.data?.id}`
  });

  const operationId = created.body?.data?.id as string;

  const retrieved = await request(app).get(`/api/v1/fleet/operations/${operationId}`).set(ctx.header);
  results.push({
    testName: 'GET fleet operation persists in PostgreSQL',
    passed: retrieved.status === 200 && retrieved.body?.data?.vehicleId === vehicleId,
    message: `status=${retrieved.status}`
  });

  const listed = await request(app).get(`/api/v1/fleet/operations?vehicleId=${vehicleId}`).set(ctx.header);
  results.push({
    testName: 'GET fleet operations lists created record',
    passed: listed.status === 200 && listed.body?.data?.some((row: { id: string }) => row.id === operationId),
    message: `status=${listed.status}`
  });

  const inactiveVehicle = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  await request(app).patch(`/api/v1/fleet/vehicles/${inactiveVehicle.body.data.id}`).set(ctx.header).send({ status: 'MAINTENANCE' });
  const inactiveDriver = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(driverPayload());
  const unavailableOp = await request(app).post('/api/v1/fleet/operations').set(ctx.header).send({
    operationNumber: uniqueCode('OP2'),
    vehicleId: inactiveVehicle.body.data.id,
    driverId: inactiveDriver.body.data.id
  });
  results.push({
    testName: 'Unavailable vehicle is rejected',
    passed: unavailableOp.status === 409 && unavailableOp.body?.error === 'VEHICLE_UNAVAILABLE',
    message: `status=${unavailableOp.status} error=${unavailableOp.body?.error}`
  });

  const suspendedDriver = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(driverPayload({ status: 'SUSPENDED' }));
  const activeVehicle2 = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  const badDriver = await request(app).post('/api/v1/fleet/operations').set(ctx.header).send({
    operationNumber: uniqueCode('OP3'),
    vehicleId: activeVehicle2.body.data.id,
    driverId: suspendedDriver.body.data.id
  });
  results.push({
    testName: 'Inactive driver assignment is rejected',
    passed: badDriver.status === 409 && badDriver.body?.error === 'DRIVER_UNAVAILABLE',
    message: `status=${badDriver.status}`
  });

  const expiredVehicle = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send(vehiclePayload());
  const expiredDriver = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send(driverPayload());
  await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(
    documentPayload(expiredVehicle.body.data.id, {
      documentType: 'INSURANCE',
      issueDate: '2019-01-01',
      expiryDate: '2020-01-01'
    })
  );
  await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(
    documentPayload(expiredVehicle.body.data.id, { documentType: 'FITNESS' })
  );
  await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(
    documentPayload(expiredVehicle.body.data.id, { documentType: 'PERMIT' })
  );
  const expiredDocOp = await request(app).post('/api/v1/fleet/operations').set(ctx.header).send({
    operationNumber: uniqueCode('OP4'),
    vehicleId: expiredVehicle.body.data.id,
    driverId: expiredDriver.body.data.id
  });
  results.push({
    testName: 'Expired mandatory document blocks operation',
    passed: expiredDocOp.status === 409 && expiredDocOp.body?.error === 'DOCUMENT_EXPIRED',
    message: `status=${expiredDocOp.status}`
  });

  const duplicateGatePass = await request(app).post('/api/v1/fleet/operations').set(ctx.header).send({
    operationNumber: uniqueCode('OP5'),
    vehicleId: activeVehicle2.body.data.id,
    driverId: driverId,
    gatePassId: gp.body.data.id
  });
  results.push({
    testName: 'Duplicate gate pass linkage is rejected',
    passed: duplicateGatePass.status === 409,
    message: `status=${duplicateGatePass.status} error=${duplicateGatePass.body?.error}`
  });

  const foreignVehicleId = `veh-apex-op-${Date.now()}`;
  const foreignDriverId = `drv-apex-op-${Date.now()}`;
  await withTenantTransaction('tenant-apex-quarry-002', async (client) => {
    await client.query(
      `INSERT INTO fleet_vehicles (
        id, tenant_id, registration_number, vehicle_type, make, model, manufacturing_year,
        fuel_type, ownership_type, capacity
      ) VALUES ($1,$2,$3,'TIPPER','Tata','Signa',2022,'DIESEL','COMPANY',20)`,
      [foreignVehicleId, 'tenant-apex-quarry-002', `APX-O-${Date.now().toString().slice(-6)}`]
    );
    await client.query(
      `INSERT INTO fleet_drivers (
        id, tenant_id, full_name, license_number, license_class, status
      ) VALUES ($1,$2,'Foreign Driver',$3,'HMV','ACTIVE')`,
      [foreignDriverId, 'tenant-apex-quarry-002', `DL-APX-${Date.now().toString().slice(-6)}`]
    );
  });
  const crossTenant = await request(app).post('/api/v1/fleet/operations').set(ctx.header).send({
    operationNumber: uniqueCode('OP6'),
    vehicleId: foreignVehicleId,
    driverId: foreignDriverId
  });
  results.push({
    testName: 'Cross-tenant vehicle reference is blocked',
    passed: crossTenant.status === 404,
    message: `status=${crossTenant.status}`
  });

  const managerCreate = await request(app).post('/api/v1/fleet/operations').set(manager.header).send({
    operationNumber: uniqueCode('OP7'),
    vehicleId,
    driverId
  });
  results.push({ testName: 'Read-only quarry manager cannot create operations', passed: managerCreate.status === 403, message: `status=${managerCreate.status}` });

  const otherGet = await request(app).get(`/api/v1/fleet/operations/${operationId}`).set(other.header);
  results.push({ testName: 'Tenant isolation blocks operation retrieval', passed: otherGet.status === 403, message: `status=${otherGet.status}` });

  const patched = await request(app).patch(`/api/v1/fleet/operations/${operationId}`).set(ctx.header).send({
    status: 'IN_PROGRESS',
    actualStartAt: '2026-08-27T06:00:00.000Z'
  });
  results.push({
    testName: 'PATCH fleet operation updates status',
    passed: patched.status === 200 && patched.body?.data?.status === 'IN_PROGRESS',
    message: `status=${patched.status}`
  });

  const audit = await request(app).get('/api/v1/audit/search').set(ctx.header);
  const auditHits = Array.isArray(audit.body?.data)
    ? audit.body.data.some((row: { resource?: string }) => String(row.resource || '').includes('/api/v1/fleet/operations'))
    : false;
  results.push({ testName: 'Audit record created for fleet operation mutation', passed: audit.status === 200 && auditHits, message: `status=${audit.status}` });

  const archived = await request(app).delete(`/api/v1/fleet/operations/${operationId}`).set(ctx.header);
  const afterArchive = await request(app).get(`/api/v1/fleet/operations/${operationId}`).set(ctx.header);
  results.push({
    testName: 'DELETE fleet operation soft-archives record',
    passed: archived.status === 200 && afterArchive.status === 404,
    message: `archive=${archived.status} get=${afterArchive.status}`
  });

  const passedCount = results.filter((row) => row.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
