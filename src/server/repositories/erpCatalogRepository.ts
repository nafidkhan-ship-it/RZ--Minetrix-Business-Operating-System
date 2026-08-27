import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import {
  ErpCustomerRecord,
  ErpLandParcelRecord,
  ErpLeaseRecord,
  ErpProductPriceRecord,
  ErpProductRecord,
  ErpProductSizeRecord
} from '../db/erp/operationsTypes.js';
import { ErpQuarryLocation } from '../db/erp/quarryTypes.js';

function num(value: unknown): number | undefined {
  return value == null ? undefined : Number(value);
}

function iso(value: unknown): string {
  return new Date(String(value)).toISOString();
}

export class ErpCatalogRepository {
  async createProduct(tenantId: string, input: {
    code: string;
    name: string;
    category: string;
    defaultUom?: string;
    densityTonPerCft?: number;
    gstPercent?: number;
  }): Promise<ErpProductRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_products (
          id, tenant_id, code, name, category, default_uom, density_ton_per_cft, gst_percent
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [
          id,
          tenantId,
          input.code.trim().toUpperCase(),
          input.name.trim(),
          input.category.trim(),
          input.defaultUom || 'TON',
          input.densityTonPerCft ?? null,
          input.gstPercent ?? 0
        ]
      );
      return this.mapProduct(result.rows[0]);
    });
  }

  async listProducts(tenantId: string): Promise<ErpProductRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_products WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY name`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapProduct(row));
    });
  }

  async findProduct(tenantId: string, productId: string): Promise<ErpProductRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_products WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, productId]
      );
      return result.rows[0] ? this.mapProduct(result.rows[0]) : null;
    });
  }

  async createProductSize(tenantId: string, input: {
    productId: string;
    sizeCode: string;
    sizeLabel: string;
    dimensions?: string;
  }): Promise<ErpProductSizeRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_product_sizes (id, tenant_id, product_id, size_code, size_label, dimensions)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [id, tenantId, input.productId, input.sizeCode.trim().toUpperCase(), input.sizeLabel.trim(), input.dimensions || null]
      );
      return this.mapSize(result.rows[0]);
    });
  }

  async listProductSizes(tenantId: string, productId: string): Promise<ErpProductSizeRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_product_sizes WHERE tenant_id = $1 AND product_id = $2 AND status = 'ACTIVE' ORDER BY size_code`,
        [tenantId, productId]
      );
      return result.rows.map((row) => this.mapSize(row));
    });
  }

  async createProductPrice(tenantId: string, input: {
    productId: string;
    productSizeId?: string;
    quarryId?: string;
    unitPrice: number;
    currency?: string;
    priceIncludesGst?: boolean;
    effectiveFrom: string;
    effectiveTo?: string;
  }): Promise<ErpProductPriceRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_product_prices (
          id, tenant_id, product_id, product_size_id, quarry_id, unit_price, currency,
          price_includes_gst, effective_from, effective_to
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
          id,
          tenantId,
          input.productId,
          input.productSizeId || null,
          input.quarryId || null,
          input.unitPrice,
          input.currency || 'INR',
          input.priceIncludesGst === true,
          input.effectiveFrom,
          input.effectiveTo || null
        ]
      );
      return this.mapPrice(result.rows[0]);
    });
  }

  async listProductPrices(tenantId: string, productId?: string): Promise<ErpProductPriceRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = productId
        ? await client.query(
            `SELECT * FROM erp_product_prices WHERE tenant_id = $1 AND product_id = $2 AND status = 'ACTIVE' ORDER BY effective_from DESC`,
            [tenantId, productId]
          )
        : await client.query(
            `SELECT * FROM erp_product_prices WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY effective_from DESC`,
            [tenantId]
          );
      return result.rows.map((row) => this.mapPrice(row));
    });
  }

  async createLocation(tenantId: string, input: {
    quarryId: string;
    name: string;
    locationType?: string;
  }): Promise<ErpQuarryLocation> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_quarry_locations (id, tenant_id, quarry_id, name, location_type)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [id, tenantId, input.quarryId, input.name.trim(), input.locationType || 'BENCH']
      );
      const row = result.rows[0];
      return {
        id: String(row.id),
        tenantId: String(row.tenant_id),
        quarryId: String(row.quarry_id),
        name: String(row.name),
        locationType: String(row.location_type) as ErpQuarryLocation['locationType'],
        status: String(row.status) as ErpQuarryLocation['status']
      };
    });
  }

  async listLocations(tenantId: string, quarryId: string): Promise<ErpQuarryLocation[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_quarry_locations WHERE tenant_id = $1 AND quarry_id = $2 ORDER BY name`,
        [tenantId, quarryId]
      );
      return result.rows.map((row) => ({
        id: String(row.id),
        tenantId: String(row.tenant_id),
        quarryId: String(row.quarry_id),
        name: String(row.name),
        locationType: String(row.location_type) as ErpQuarryLocation['locationType'],
        status: String(row.status) as ErpQuarryLocation['status']
      }));
    });
  }

  async createLandParcel(tenantId: string, input: {
    surveyNumber: string;
    villageTaluk?: string;
    acreage?: number;
    ownerName: string;
  }): Promise<ErpLandParcelRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_land_parcels (id, tenant_id, survey_number, village_taluk, acreage, owner_name)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [id, tenantId, input.surveyNumber.trim(), input.villageTaluk || null, input.acreage ?? null, input.ownerName.trim()]
      );
      return this.mapParcel(result.rows[0]);
    });
  }

  async listLandParcels(tenantId: string): Promise<ErpLandParcelRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_land_parcels WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY owner_name`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapParcel(row));
    });
  }

  async createLease(tenantId: string, input: {
    landParcelId: string;
    quarryId?: string;
    leaseNumber: string;
    royaltyType: string;
    royaltyRate?: number;
    revenueSharePercent?: number;
    startDate: string;
    endDate: string;
  }): Promise<ErpLeaseRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_quarry_leases (
          id, tenant_id, land_parcel_id, quarry_id, lease_number, royalty_type,
          royalty_rate, revenue_share_percent, start_date, end_date
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
          id,
          tenantId,
          input.landParcelId,
          input.quarryId || null,
          input.leaseNumber.trim().toUpperCase(),
          input.royaltyType.trim(),
          input.royaltyRate ?? null,
          input.revenueSharePercent ?? null,
          input.startDate,
          input.endDate
        ]
      );
      return this.mapLease(result.rows[0]);
    });
  }

  async listLeases(tenantId: string): Promise<ErpLeaseRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_quarry_leases WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY lease_number`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapLease(row));
    });
  }

  async createCustomer(tenantId: string, input: {
    code: string;
    name: string;
    destination?: string;
    phone?: string;
    email?: string;
  }): Promise<ErpCustomerRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_customers (id, tenant_id, code, name, destination, phone, email)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
        [id, tenantId, input.code.trim().toUpperCase(), input.name.trim(), input.destination || null, input.phone || null, input.email || null]
      );
      return this.mapCustomer(result.rows[0]);
    });
  }

  async listCustomers(tenantId: string): Promise<ErpCustomerRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_customers WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY name`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapCustomer(row));
    });
  }

  async findCustomer(tenantId: string, customerId: string): Promise<ErpCustomerRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_customers WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, customerId]
      );
      return result.rows[0] ? this.mapCustomer(result.rows[0]) : null;
    });
  }

  private mapProduct(row: Record<string, unknown>): ErpProductRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      code: String(row.code),
      name: String(row.name),
      category: String(row.category),
      defaultUom: String(row.default_uom),
      densityTonPerCft: num(row.density_ton_per_cft),
      gstPercent: Number(row.gst_percent),
      status: String(row.status),
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at)
    };
  }

  private mapSize(row: Record<string, unknown>): ErpProductSizeRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      productId: String(row.product_id),
      sizeCode: String(row.size_code),
      sizeLabel: String(row.size_label),
      dimensions: row.dimensions ? String(row.dimensions) : undefined,
      status: String(row.status)
    };
  }

  private mapPrice(row: Record<string, unknown>): ErpProductPriceRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      productId: String(row.product_id),
      productSizeId: row.product_size_id ? String(row.product_size_id) : undefined,
      quarryId: row.quarry_id ? String(row.quarry_id) : undefined,
      unitPrice: Number(row.unit_price),
      currency: String(row.currency),
      priceIncludesGst: Boolean(row.price_includes_gst),
      effectiveFrom: String(row.effective_from).slice(0, 10),
      effectiveTo: row.effective_to ? String(row.effective_to).slice(0, 10) : undefined,
      status: String(row.status)
    };
  }

  private mapParcel(row: Record<string, unknown>): ErpLandParcelRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      surveyNumber: String(row.survey_number),
      villageTaluk: row.village_taluk ? String(row.village_taluk) : undefined,
      acreage: num(row.acreage),
      ownerName: String(row.owner_name),
      status: String(row.status)
    };
  }

  private mapLease(row: Record<string, unknown>): ErpLeaseRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      landParcelId: String(row.land_parcel_id),
      quarryId: row.quarry_id ? String(row.quarry_id) : undefined,
      leaseNumber: String(row.lease_number),
      royaltyType: String(row.royalty_type),
      royaltyRate: num(row.royalty_rate),
      revenueSharePercent: num(row.revenue_share_percent),
      startDate: String(row.start_date).slice(0, 10),
      endDate: String(row.end_date).slice(0, 10),
      status: String(row.status)
    };
  }

  private mapCustomer(row: Record<string, unknown>): ErpCustomerRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      code: String(row.code),
      name: String(row.name),
      destination: row.destination ? String(row.destination) : undefined,
      phone: row.phone ? String(row.phone) : undefined,
      email: row.email ? String(row.email) : undefined,
      status: String(row.status)
    };
  }
}
