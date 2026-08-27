import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, loginQuarryManager, seedCompliantFleet, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

const RZ_TENANT = 'tenant-rz-global-001';

export async function runErpLifecycleApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const manager = await loginQuarryManager(app);
  const results: ModuleTestResult[] = [];

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({
    code: uniqueCode('QLC'),
    name: 'Lifecycle Quarry'
  });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PLC'),
    name: 'Lifecycle Aggregate',
    category: 'Crushed Aggregate',
    defaultUom: 'TON'
  });
  const size = await request(app).post(`/api/v1/erp/products/${product.body.data.id}/sizes`).set(ctx.header).send({
    sizeCode: '20MM',
    sizeLabel: '20mm'
  });
  await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BLC'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, productSizeId: size.body.data.id, quantity: 30, quantityUom: 'TON' }]
  });
  const parcel = await request(app).post('/api/v1/erp/land-parcels').set(ctx.header).send({
    surveyNumber: uniqueCode('SY'),
    ownerName: 'Lifecycle Landowner',
    acreage: 3
  });
  await request(app).post('/api/v1/erp/settlement-rates').set(ctx.header).send({
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    ratePerUom: 80,
    quantityUom: 'TON',
    effectiveFrom: '2026-01-01'
  });

  const customer = await request(app).post('/api/v1/erp/customers').set(ctx.header).send({
    code: uniqueCode('CLC'),
    name: 'Lifecycle Customer'
  });
  results.push({
    testName: 'Customer → order seed',
    passed: customer.status === 201 && Boolean(customer.body?.data?.id),
    message: `status=${customer.status}`
  });

  const fleet = await seedCompliantFleet(ctx);
  const foreignFleet = await seedCompliantFleet(other);

  const order = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('SOLC'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    taxAmount: 40,
    lines: [{ productId: product.body.data.id, productSizeId: size.body.data.id, quantity: 10, unitPrice: 640, quantityUom: 'TON' }]
  });
  results.push({
    testName: 'Order → product size and server-side total',
    passed: order.status === 201 && order.body?.data?.subtotal === 6400 && order.body?.data?.totalAmount === 6440,
    message: `status=${order.status} total=${order.body?.data?.totalAmount}`
  });

  const confirm = await request(app).post(`/api/v1/erp/orders/${order.body.data.id}/confirm`).set(ctx.header);
  results.push({
    testName: 'Order status transition DRAFT → CONFIRMED',
    passed: confirm.status === 200 && confirm.body?.data?.status === 'CONFIRMED',
    message: `status=${confirm.status}`
  });

  const secondOrder = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('SOL2'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, productSizeId: size.body.data.id, quantity: 25, unitPrice: 640 }]
  });
  const overAllocate = await request(app).post(`/api/v1/erp/orders/${secondOrder.body.data.id}/confirm`).set(ctx.header);
  results.push({
    testName: 'Inventory availability blocks over-allocation',
    passed: overAllocate.status === 409 && overAllocate.body?.error === 'INSUFFICIENT_STOCK',
    message: `status=${overAllocate.status} error=${overAllocate.body?.error}`
  });

  const gpNoFleet = await request(app).post(`/api/v1/erp/orders/${order.body.data.id}/gate-pass`).set(ctx.header).send({
    gatePassNumber: uniqueCode('GPN'),
    vehicleNumber: 'KA-00-XX-0000',
    driverName: 'Free text'
  });
  results.push({
    testName: 'Order → Gate Pass requires fleet vehicle/driver IDs',
    passed: gpNoFleet.status === 400,
    message: `status=${gpNoFleet.status}`
  });

  const crossVehicle = await request(app).post(`/api/v1/erp/orders/${order.body.data.id}/gate-pass`).set(ctx.header).send({
    gatePassNumber: uniqueCode('GPX'),
    vehicleId: foreignFleet.vehicleId,
    driverId: foreignFleet.driverId
  });
  results.push({
    testName: 'Cross-tenant vehicle protection on order gate pass',
    passed: crossVehicle.status === 404,
    message: `status=${crossVehicle.status}`
  });

  const crossDriver = await request(app).post(`/api/v1/erp/orders/${order.body.data.id}/gate-pass`).set(ctx.header).send({
    gatePassNumber: uniqueCode('GPD'),
    vehicleId: fleet.vehicleId,
    driverId: foreignFleet.driverId
  });
  results.push({
    testName: 'Cross-tenant driver protection on order gate pass',
    passed: crossDriver.status === 404,
    message: `status=${crossDriver.status}`
  });

  const gp = await request(app).post(`/api/v1/erp/orders/${order.body.data.id}/gate-pass`).set(ctx.header).send({
    gatePassNumber: uniqueCode('GPL'),
    vehicleId: fleet.vehicleId,
    driverId: fleet.driverId,
    destination: 'Lifecycle site'
  });
  results.push({
    testName: 'Order → Gate Pass with fleet vehicle and driver',
    passed: gp.status === 201 && gp.body?.data?.vehicleId === fleet.vehicleId && gp.body?.data?.driverId === fleet.driverId,
    message: `status=${gp.status} vehicle=${gp.body?.data?.vehicleId}`
  });

  const earlyDispatch = await request(app).post('/api/v1/erp/dispatches').set(ctx.header).send({
    dispatchNumber: uniqueCode('DSE'),
    gatePassId: gp.body.data.id
  });
  results.push({
    testName: 'Dispatch before ISSUED + fleet operation is rejected',
    passed: earlyDispatch.status === 400 || earlyDispatch.status === 409,
    message: `status=${earlyDispatch.status} error=${earlyDispatch.body?.error}`
  });

  await request(app).post(`/api/v1/erp/gate-passes/${gp.body.data.id}/approve`).set(ctx.header);
  const issued = await request(app).post(`/api/v1/erp/gate-passes/${gp.body.data.id}/issue`).set(ctx.header);
  results.push({
    testName: 'Gate Pass issue creates fleet operation',
    passed: issued.status === 200 && issued.body?.data?.status === 'ISSUED',
    message: `status=${issued.status}`
  });

  const ops = await request(app).get(`/api/v1/fleet/operations?vehicleId=${fleet.vehicleId}`).set(ctx.header);
  const linkedOp = Array.isArray(ops.body?.data)
    ? ops.body.data.find((row: { gatePassId?: string }) => row.gatePassId === gp.body.data.id)
    : undefined;
  results.push({
    testName: 'Fleet operation linked to issued gate pass',
    passed: Boolean(linkedOp?.id) && linkedOp.status === 'ASSIGNED',
    message: `op=${linkedOp?.id} status=${linkedOp?.status}`
  });

  const unauthorized = await request(app).post('/api/v1/erp/dispatches').send({
    dispatchNumber: uniqueCode('DSU'),
    gatePassId: gp.body.data.id
  });
  results.push({
    testName: 'Unauthorized access to dispatch',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const rbac = await request(app).post('/api/v1/erp/dispatches').set(manager.header).send({
    dispatchNumber: uniqueCode('DSM'),
    gatePassId: gp.body.data.id
  });
  results.push({
    testName: 'RBAC enforcement on dispatch create',
    passed: rbac.status === 403,
    message: `status=${rbac.status}`
  });

  const stockBefore = await request(app).get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`).set(ctx.header);
  const qtyBefore = Array.isArray(stockBefore.body?.data)
    ? stockBefore.body.data.find((row: { productId: string }) => row.productId === product.body.data.id)?.quantity
    : undefined;

  const dispatch = await request(app).post('/api/v1/erp/dispatches').set(ctx.header).send({
    dispatchNumber: uniqueCode('DSL'),
    gatePassId: gp.body.data.id
  });
  results.push({
    testName: 'Fleet operation → ERP dispatch',
    passed: dispatch.status === 201 && dispatch.body?.data?.status === 'POSTED',
    message: `status=${dispatch.status}`
  });

  const stockAfter = await request(app).get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`).set(ctx.header);
  const qtyAfter = Array.isArray(stockAfter.body?.data)
    ? stockAfter.body.data.find((row: { productId: string }) => row.productId === product.body.data.id)?.quantity
    : undefined;
  const ledger = await request(app).get(`/api/v1/erp/stock/ledger?quarryId=${quarry.body.data.id}`).set(ctx.header);
  const stockOuts = Array.isArray(ledger.body?.data)
    ? ledger.body.data.filter((row: { movementType: string; referenceId: string }) =>
      row.movementType === 'STOCK_OUT' && row.referenceId === dispatch.body.data.id)
    : [];
  results.push({
    testName: 'Dispatch → one STOCK_OUT and correct balance',
    passed: qtyBefore === 30 && qtyAfter === 20 && stockOuts.length === 1,
    message: `before=${qtyBefore} after=${qtyAfter} outs=${stockOuts.length}`
  });

  const duplicate = await request(app).post('/api/v1/erp/dispatches').set(ctx.header).send({
    dispatchNumber: uniqueCode('DSD'),
    gatePassId: gp.body.data.id
  });
  results.push({
    testName: 'Duplicate dispatch protection',
    passed: duplicate.status === 409,
    message: `status=${duplicate.status}`
  });

  const opAfter = await request(app).get(`/api/v1/fleet/operations/${linkedOp.id}`).set(ctx.header);
  results.push({
    testName: 'Dispatch attached to fleet operation',
    passed: opAfter.status === 200 && opAfter.body?.data?.dispatchId === dispatch.body.data.id && opAfter.body?.data?.status === 'IN_PROGRESS',
    message: `status=${opAfter.status} dispatch=${opAfter.body?.data?.dispatchId}`
  });

  const orderAfter = await request(app).get(`/api/v1/erp/orders/${order.body.data.id}`).set(ctx.header);
  results.push({
    testName: 'Order marked DISPATCHED after fulfillment',
    passed: orderAfter.body?.data?.status === 'DISPATCHED',
    message: `order=${orderAfter.body?.data?.status}`
  });

  const settlementClientQty = await request(app).post('/api/v1/erp/settlements').set(ctx.header).send({
    settlementNumber: uniqueCode('STX'),
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    basis: 'DISPATCH',
    dispatchId: dispatch.body.data.id,
    quantity: 999,
    deductions: 25
  });
  results.push({
    testName: 'Settlement calculation uses dispatch quantity, not client input',
    passed:
      settlementClientQty.status === 201 &&
      settlementClientQty.body?.data?.quantity === 10 &&
      settlementClientQty.body?.data?.grossAmount === 800 &&
      settlementClientQty.body?.data?.netAmount === 775 &&
      settlementClientQty.body?.data?.dispatchId === dispatch.body.data.id,
    message: `status=${settlementClientQty.status} qty=${settlementClientQty.body?.data?.quantity} net=${settlementClientQty.body?.data?.netAmount}`
  });

  const settlementNoDispatch = await request(app).post('/api/v1/erp/settlements').set(ctx.header).send({
    settlementNumber: uniqueCode('STY'),
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    basis: 'DISPATCH',
    quantity: 10
  });
  results.push({
    testName: 'Settlement linkage requires dispatch reference',
    passed: settlementNoDispatch.status === 400,
    message: `status=${settlementNoDispatch.status}`
  });

  const audit = await request(app).get('/api/v1/audit/search').set(ctx.header);
  const auditText = JSON.stringify(audit.body?.data || []);
  results.push({
    testName: 'Audit references for order, gate pass, fleet, dispatch, settlement',
    passed:
      audit.status === 200 &&
      auditText.includes('/erp/orders') &&
      auditText.includes('/erp/gate-passes') &&
      auditText.includes('/fleet/operations') &&
      auditText.includes('/erp/dispatches') &&
      auditText.includes('/erp/settlements') &&
      !auditText.toLowerCase().includes('password') &&
      !auditText.toLowerCase().includes('token'),
    message: `status=${audit.status}`
  });

  const isolatedOrder = await request(app).get(`/api/v1/erp/orders/${order.body.data.id}`).set(other.header);
  const isolatedGp = await request(app).get(`/api/v1/erp/gate-passes/${gp.body.data.id}`).set(other.header);
  const isolatedDispatch = await request(app).post('/api/v1/erp/dispatches').set(other.header).send({
    dispatchNumber: uniqueCode('DSA'),
    gatePassId: gp.body.data.id
  });
  const isolatedSettlement = await request(app).post('/api/v1/erp/settlements').set(other.header).send({
    settlementNumber: uniqueCode('STA'),
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    basis: 'DISPATCH',
    dispatchId: dispatch.body.data.id
  });
  const isolatedCustomer = await request(app).get(`/api/v1/erp/customers/${customer.body.data.id}`).set(other.header);
  const isolatedProduct = await request(app).post('/api/v1/erp/orders').set(other.header).send({
    orderNumber: uniqueCode('SOA'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, quantity: 1, unitPrice: 10 }]
  });
  results.push({
    testName: 'Tenant isolation across customer, product, vehicle, driver, dispatch, settlement',
    passed:
      [isolatedOrder.status, isolatedGp.status, isolatedCustomer.status].every((code) => code === 404 || code === 403) &&
      [isolatedDispatch.status, isolatedSettlement.status, isolatedProduct.status].every((code) => code === 404 || code === 403 || code === 400),
    message: `order=${isolatedOrder.status} gp=${isolatedGp.status} disp=${isolatedDispatch.status} stl=${isolatedSettlement.status} cust=${isolatedCustomer.status} prod=${isolatedProduct.status}`
  });

  const bareVehicle = await request(app).post('/api/v1/fleet/vehicles').set(ctx.header).send({
    registrationNumber: uniqueCode('KA18').replace(/\./g, ''),
    vehicleType: 'TIPPER',
    make: 'Ashok',
    model: 'Leyland',
    manufacturingYear: 2021,
    fuelType: 'DIESEL',
    ownershipType: 'COMPANY',
    capacity: 20
  });
  const bareDriver = await request(app).post('/api/v1/fleet/drivers').set(ctx.header).send({
    fullName: 'Noncompliant Driver',
    licenseNumber: uniqueCode('DLX').replace(/\./g, '-'),
    licenseClass: 'HMV',
    status: 'ACTIVE'
  });
  const complianceOrder = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('SOF'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, productSizeId: size.body.data.id, quantity: 1, unitPrice: 10 }]
  });
  await request(app).post(`/api/v1/erp/orders/${complianceOrder.body.data.id}/confirm`).set(ctx.header);
  const gpNoDocs = await request(app).post(`/api/v1/erp/orders/${complianceOrder.body.data.id}/gate-pass`).set(ctx.header).send({
    gatePassNumber: uniqueCode('GPF'),
    vehicleId: bareVehicle.body.data.id,
    driverId: bareDriver.body.data.id
  });
  results.push({
    testName: 'Fleet compliance blocks order gate pass without mandatory documents',
    passed: gpNoDocs.status === 409 && gpNoDocs.body?.error === 'DOCUMENT_EXPIRED',
    message: `status=${gpNoDocs.status} error=${gpNoDocs.body?.error}`
  });

  const stockFailFleet = await seedCompliantFleet(ctx);
  const stockFailOrder = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('SOI'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, productSizeId: size.body.data.id, quantity: 2, unitPrice: 10 }]
  });
  await request(app).post(`/api/v1/erp/orders/${stockFailOrder.body.data.id}/confirm`).set(ctx.header);
  const gpFail = await request(app).post(`/api/v1/erp/orders/${stockFailOrder.body.data.id}/gate-pass`).set(ctx.header).send({
    gatePassNumber: uniqueCode('GPI'),
    vehicleId: stockFailFleet.vehicleId,
    driverId: stockFailFleet.driverId
  });
  await request(app).post(`/api/v1/erp/gate-passes/${gpFail.body.data.id}/approve`).set(ctx.header);
  await request(app).post(`/api/v1/erp/gate-passes/${gpFail.body.data.id}/issue`).set(ctx.header);
  await withTenantTransaction(RZ_TENANT, async (client) => {
    await client.query(
      `UPDATE erp_stock_balances
       SET quantity = 0, updated_at = NOW()
       WHERE tenant_id = $1 AND quarry_id = $2 AND product_id = $3
         AND COALESCE(product_size_id, '') = COALESCE($4, '')`,
      [RZ_TENANT, quarry.body.data.id, product.body.data.id, size.body.data.id]
    );
  });
  const stockBeforeFail = await request(app).get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`).set(ctx.header);
  const qtyBeforeFail = Array.isArray(stockBeforeFail.body?.data)
    ? stockBeforeFail.body.data.find((row: { productId: string }) => row.productId === product.body.data.id)?.quantity
    : undefined;
  const failDispatch = await request(app).post('/api/v1/erp/dispatches').set(ctx.header).send({
    dispatchNumber: uniqueCode('DSI'),
    gatePassId: gpFail.body.data.id
  });
  const stockAfterFail = await request(app).get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`).set(ctx.header);
  const qtyAfterFail = Array.isArray(stockAfterFail.body?.data)
    ? stockAfterFail.body.data.find((row: { productId: string }) => row.productId === product.body.data.id)?.quantity
    : undefined;
  const gpAfterFail = await request(app).get(`/api/v1/erp/gate-passes/${gpFail.body.data.id}`).set(ctx.header);
  results.push({
    testName: 'Insufficient stock dispatch fails and rolls back',
    passed:
      failDispatch.status === 409 &&
      failDispatch.body?.error === 'INSUFFICIENT_STOCK' &&
      qtyBeforeFail === 0 &&
      qtyAfterFail === 0 &&
      gpAfterFail.body?.data?.status === 'ISSUED',
    message: `status=${failDispatch.status} error=${failDispatch.body?.error} before=${qtyBeforeFail} after=${qtyAfterFail} gp=${gpAfterFail.body?.data?.status}`
  });

  const spoof = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    tenantId: 'tenant-apex-quarry-002',
    orderNumber: uniqueCode('SOZ'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, quantity: 1, unitPrice: 10 }]
  });
  results.push({
    testName: 'Client tenantId cannot override authenticated tenant',
    passed: spoof.status === 400,
    message: `status=${spoof.status}`
  });

  const cancelled = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('SOC'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, productSizeId: size.body.data.id, quantity: 1, unitPrice: 10 }]
  });
  await request(app).post(`/api/v1/erp/orders/${cancelled.body.data.id}/cancel`).set(ctx.header);
  const cancelFulfill = await request(app).post(`/api/v1/erp/orders/${cancelled.body.data.id}/gate-pass`).set(ctx.header).send({
    gatePassNumber: uniqueCode('GPC'),
    vehicleId: fleet.vehicleId,
    driverId: fleet.driverId
  });
  results.push({
    testName: 'Cancelled order cannot be fulfilled',
    passed: cancelFulfill.status === 400 || cancelFulfill.status === 409,
    message: `status=${cancelFulfill.status}`
  });

  const badSize = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('SOS'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, productSizeId: 'missing-size-id', quantity: 1, unitPrice: 10 }]
  });
  results.push({
    testName: 'Invalid product size is rejected',
    passed: badSize.status === 404,
    message: `status=${badSize.status}`
  });

  const passedCount = results.filter((result) => result.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
