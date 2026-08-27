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

function documentPayload(vehicleId: string, overrides: Record<string, unknown> = {}) {
  return {
    vehicleId,
    documentType: 'INSURANCE',
    documentNumber: uniqueCode('INS').replace(/\./g, '-'),
    issueDate: '2025-01-01',
    expiryDate: '2027-12-31',
    issuingAuthority: 'ICICI Lombard',
    storageKey: 'tenant-rz-global-001/fleet_insurance.pdf',
    fileName: 'insurance.pdf',
    ...overrides
  };
}

export async function runFleetVehicleDocumentApiTests() {
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

  const unauthorized = await request(app).get('/api/v1/fleet/vehicle-documents');
  results.push({
    testName: 'GET vehicle documents requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const created = await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(documentPayload(vehicleId));
  results.push({
    testName: 'POST vehicle document creates record',
    passed:
      created.status === 201 &&
      Boolean(created.body?.data?.id) &&
      created.body?.data?.documentType === 'INSURANCE' &&
      created.body?.data?.status === 'VALID' &&
      Boolean(created.body?.data?.signedUrl),
    message: `status=${created.status} id=${created.body?.data?.id}`
  });

  const documentId = created.body?.data?.id as string;
  const documentNumber = created.body?.data?.documentNumber as string;

  const retrieved = await request(app).get(`/api/v1/fleet/vehicle-documents/${documentId}`).set(ctx.header);
  results.push({
    testName: 'GET vehicle document persists in PostgreSQL',
    passed:
      retrieved.status === 200 &&
      retrieved.body?.data?.id === documentId &&
      retrieved.body?.data?.vehicleId === vehicleId &&
      Boolean(retrieved.body?.data?.signedUrl),
    message: `status=${retrieved.status}`
  });

  const listed = await request(app).get(`/api/v1/fleet/vehicle-documents?vehicleId=${vehicleId}`).set(ctx.header);
  results.push({
    testName: 'GET vehicle documents lists created record',
    passed:
      listed.status === 200 &&
      Array.isArray(listed.body?.data) &&
      listed.body.data.some((row: { id: string }) => row.id === documentId),
    message: `status=${listed.status} count=${listed.body?.data?.length}`
  });

  const duplicate = await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(
    documentPayload(vehicleId, { documentNumber })
  );
  results.push({
    testName: 'Duplicate document number is rejected',
    passed: duplicate.status === 409 && duplicate.body?.error === 'DUPLICATE_DOCUMENT',
    message: `status=${duplicate.status} error=${duplicate.body?.error}`
  });

  const badType = await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(
    documentPayload(vehicleId, { documentType: 'INVALID' })
  );
  results.push({
    testName: 'Invalid document type is rejected',
    passed: badType.status === 400,
    message: `status=${badType.status}`
  });

  const badDates = await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(
    documentPayload(vehicleId, { issueDate: '2026-06-01', expiryDate: '2026-01-01' })
  );
  results.push({
    testName: 'Invalid document dates are rejected',
    passed: badDates.status === 400,
    message: `status=${badDates.status}`
  });

  const clientTenant = await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(
    documentPayload(vehicleId, { tenantId: 'tenant-apex-quarry-002' })
  );
  results.push({
    testName: 'POST vehicle document rejects client-supplied tenantId',
    passed: clientTenant.status === 400,
    message: `status=${clientTenant.status}`
  });

  const foreignVehicleId = `veh-apex-doc-${Date.now()}`;
  await withTenantTransaction('tenant-apex-quarry-002', async (client) => {
    await client.query(
      `INSERT INTO fleet_vehicles (
        id, tenant_id, registration_number, vehicle_type, make, model, manufacturing_year,
        fuel_type, ownership_type, capacity
      ) VALUES ($1,$2,$3,'TIPPER','Tata','Signa',2022,'DIESEL','COMPANY',20)`,
      [foreignVehicleId, 'tenant-apex-quarry-002', `APX-DOC-${Date.now().toString().slice(-6)}`]
    );
  });
  const crossVehicle = await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(documentPayload(foreignVehicleId));
  results.push({
    testName: 'Cross-tenant vehicle reference is blocked',
    passed: crossVehicle.status === 404,
    message: `status=${crossVehicle.status}`
  });

  const managerList = await request(app).get('/api/v1/fleet/vehicle-documents').set(manager.header);
  results.push({
    testName: 'Read-only quarry manager can view vehicle documents',
    passed: managerList.status === 200 && Array.isArray(managerList.body?.data),
    message: `status=${managerList.status}`
  });

  const managerCreate = await request(app).post('/api/v1/fleet/vehicle-documents').set(manager.header).send(documentPayload(vehicleId));
  results.push({
    testName: 'Read-only quarry manager cannot create vehicle documents',
    passed: managerCreate.status === 403,
    message: `status=${managerCreate.status}`
  });

  const otherList = await request(app).get('/api/v1/fleet/vehicle-documents').set(other.header);
  results.push({
    testName: 'Other tenant is denied vehicle document view',
    passed: otherList.status === 403,
    message: `status=${otherList.status}`
  });

  const otherGet = await request(app).get(`/api/v1/fleet/vehicle-documents/${documentId}`).set(other.header);
  results.push({
    testName: 'Tenant isolation blocks vehicle document retrieval',
    passed: otherGet.status === 403,
    message: `status=${otherGet.status}`
  });

  const otherPatch = await request(app).patch(`/api/v1/fleet/vehicle-documents/${documentId}`).set(other.header).send({ notes: 'hacked' });
  results.push({
    testName: 'Cross-tenant update is blocked',
    passed: otherPatch.status === 403,
    message: `status=${otherPatch.status}`
  });

  const otherDelete = await request(app).delete(`/api/v1/fleet/vehicle-documents/${documentId}`).set(other.header);
  results.push({
    testName: 'Cross-tenant archive is blocked',
    passed: otherDelete.status === 403,
    message: `status=${otherDelete.status}`
  });

  const patched = await request(app).patch(`/api/v1/fleet/vehicle-documents/${documentId}`).set(ctx.header).send({
    issueDate: '2019-01-01',
    expiryDate: '2020-01-01',
    notes: 'Expired policy'
  });
  results.push({
    testName: 'PATCH vehicle document updates expiry status',
    passed: patched.status === 200 && patched.body?.data?.status === 'EXPIRED',
    message: `status=${patched.status} docStatus=${patched.body?.data?.status}`
  });

  const second = await request(app).post('/api/v1/fleet/vehicle-documents').set(ctx.header).send(documentPayload(vehicleId));
  const rollback = await request(app).patch(`/api/v1/fleet/vehicle-documents/${second.body.data.id}`).set(ctx.header).send({
    documentNumber
  });
  const secondAfter = await request(app).get(`/api/v1/fleet/vehicle-documents/${second.body.data.id}`).set(ctx.header);
  results.push({
    testName: 'Duplicate document update rolls back original row',
    passed:
      rollback.status === 409 &&
      secondAfter.status === 200 &&
      secondAfter.body?.data?.documentNumber === second.body.data.documentNumber,
    message: `status=${rollback.status}`
  });

  const audit = await request(app).get('/api/v1/audit/search').set(ctx.header);
  const auditHits = Array.isArray(audit.body?.data)
    ? audit.body.data.some((row: { resource?: string; action?: string }) =>
        String(row.resource || '').includes('/api/v1/fleet/vehicle-documents') || String(row.action || '').includes('API_POST_MUTATION')
      )
    : false;
  results.push({
    testName: 'Audit record created for vehicle document mutation',
    passed: audit.status === 200 && auditHits,
    message: `status=${audit.status} hits=${auditHits}`
  });

  const archived = await request(app).delete(`/api/v1/fleet/vehicle-documents/${documentId}`).set(ctx.header);
  const afterArchive = await request(app).get(`/api/v1/fleet/vehicle-documents/${documentId}`).set(ctx.header);
  const listedAfter = await request(app).get(`/api/v1/fleet/vehicle-documents?vehicleId=${vehicleId}`).set(ctx.header);
  results.push({
    testName: 'DELETE vehicle document soft-archives and hides from list',
    passed:
      archived.status === 200 &&
      afterArchive.status === 404 &&
      Array.isArray(listedAfter.body?.data) &&
      !listedAfter.body.data.some((row: { id: string }) => row.id === documentId),
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
