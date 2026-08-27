import request from 'supertest';
import { Express } from 'express';
import { createCoreApp } from '../app.js';
import { notFoundHandler, errorHandler } from '../middleware/errorHandler.js';
import { initializeDatabase } from '../db/database.js';

export interface ErpAuthContext {
  app: Express;
  token: string;
  header: { Authorization: string };
}

export async function createErpTestApp(): Promise<Express> {
  await initializeDatabase();
  const app = createCoreApp();
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

export async function loginErpAdmin(app: Express): Promise<ErpAuthContext> {
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@racezoneventures.com', password: 'AdminPass2026!' });
  const token = loginRes.body?.data?.token as string;
  return { app, token, header: { Authorization: `Bearer ${token}` } };
}

export async function loginOtherTenant(app: Express): Promise<ErpAuthContext> {
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'site.mgr@apexmining.com', password: 'ApexPass2026!' });
  const token = loginRes.body?.data?.token as string;
  return { app, token, header: { Authorization: `Bearer ${token}` } };
}

export async function loginQuarryManager(app: Express): Promise<ErpAuthContext> {
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'quarry.manager@racezoneventures.com', password: 'ManagerPass2026!' });
  const token = loginRes.body?.data?.token as string;
  return { app, token, header: { Authorization: `Bearer ${token}` } };
}

export function uniqueCode(prefix: string): string {
  return `${prefix}-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;
}

export async function seedQuarryProduct(ctx: ErpAuthContext) {
  const quarry = await request(ctx.app)
    .post('/api/v1/erp/quarries')
    .set(ctx.header)
    .send({ code: uniqueCode('QRY'), name: 'Vertical Slice Quarry', mineralType: 'HARD_ROCK' });

  const product = await request(ctx.app)
    .post('/api/v1/erp/products')
    .set(ctx.header)
    .send({ code: uniqueCode('PRD'), name: '20mm Aggregate', category: 'Crushed Aggregate', defaultUom: 'TON', gstPercent: 5 });

  const size = await request(ctx.app)
    .post(`/api/v1/erp/products/${product.body.data.id}/sizes`)
    .set(ctx.header)
    .send({ sizeCode: '20MM', sizeLabel: '20mm metal' });

  const price = await request(ctx.app)
    .post('/api/v1/erp/product-prices')
    .set(ctx.header)
    .send({
      productId: product.body.data.id,
      productSizeId: size.body.data.id,
      quarryId: quarry.body.data.id,
      unitPrice: 640,
      effectiveFrom: '2026-01-01'
    });

  return {
    quarryId: quarry.body.data.id as string,
    productId: product.body.data.id as string,
    sizeId: size.body.data.id as string,
    priceId: price.body.data.id as string
  };
}

export async function seedCompliantFleet(ctx: ErpAuthContext) {
  const vehicle = await request(ctx.app)
    .post('/api/v1/fleet/vehicles')
    .set(ctx.header)
    .send({
      registrationNumber: uniqueCode('KA19').replace(/\./g, ''),
      vehicleType: 'TIPPER',
      make: 'Tata',
      model: 'Signa',
      manufacturingYear: 2022,
      fuelType: 'DIESEL',
      ownershipType: 'COMPANY',
      capacity: 28
    });
  const driver = await request(ctx.app)
    .post('/api/v1/fleet/drivers')
    .set(ctx.header)
    .send({
      fullName: 'Lifecycle Driver',
      licenseNumber: uniqueCode('DL').replace(/\./g, '-'),
      licenseClass: 'HMV',
      status: 'ACTIVE'
    });
  const vehicleId = vehicle.body?.data?.id as string;
  if (!vehicleId) {
    throw new Error(`Failed to seed fleet vehicle: status=${vehicle.status} body=${JSON.stringify(vehicle.body)}`);
  }
  for (const documentType of ['INSURANCE', 'FITNESS', 'PERMIT']) {
    await request(ctx.app)
      .post('/api/v1/fleet/vehicle-documents')
      .set(ctx.header)
      .send({
        vehicleId,
        documentType,
        documentNumber: uniqueCode(documentType.slice(0, 3)).replace(/\./g, '-'),
        issueDate: '2025-01-01',
        expiryDate: '2027-12-31'
      });
  }
  return {
    vehicleId,
    driverId: driver.body.data.id as string,
    registrationNumber: vehicle.body.data.registrationNumber as string,
    driverName: driver.body.data.fullName as string
  };
}
