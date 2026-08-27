import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import {
  ErpCustomerContactRecord,
  ErpCustomerHistoryRecord,
  ErpLeadRecord,
  ErpOrderLineInput,
  ErpOrderRecord,
  LeadStatus,
  roundMoney
} from '../db/erp/operationsTypes.js';
import { ErpCatalogRepository } from './erpCatalogRepository.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';

type PoolClient = pg.PoolClient;

function iso(value: unknown): string {
  return new Date(String(value)).toISOString();
}

export class ErpCrmRepository {
  private catalog = new ErpCatalogRepository();

  async createContact(tenantId: string, input: {
    customerId: string;
    fullName: string;
    roleTitle?: string;
    phone?: string;
    email?: string;
  }): Promise<ErpCustomerContactRecord> {
    const customer = await this.catalog.findCustomer(tenantId, input.customerId);
    if (!customer) throw new ErpServiceError('NOT_FOUND', 'Customer not found.', 404);
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_customer_contacts (id, tenant_id, customer_id, full_name, role_title, phone, email)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
        [id, tenantId, input.customerId, input.fullName.trim(), input.roleTitle || null, input.phone || null, input.email || null]
      );
      return this.mapContact(result.rows[0]);
    });
  }

  async listContacts(tenantId: string, customerId: string): Promise<ErpCustomerContactRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_customer_contacts WHERE tenant_id = $1 AND customer_id = $2 AND status = 'ACTIVE' ORDER BY created_at`,
        [tenantId, customerId]
      );
      return result.rows.map((row) => this.mapContact(row));
    });
  }

  async createLead(tenantId: string, input: {
    code: string;
    companyName: string;
    contactName?: string;
    phone?: string;
    email?: string;
    source?: string;
    notes?: string;
    createdBy?: string;
  }): Promise<ErpLeadRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_leads (id, tenant_id, code, company_name, contact_name, phone, email, source, notes, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [
          id,
          tenantId,
          input.code.trim().toUpperCase(),
          input.companyName.trim(),
          input.contactName || null,
          input.phone || null,
          input.email || null,
          input.source || null,
          input.notes || null,
          input.createdBy || null
        ]
      );
      return this.mapLead(result.rows[0]);
    });
  }

  async listLeads(tenantId: string): Promise<ErpLeadRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_leads WHERE tenant_id = $1 ORDER BY created_at DESC`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapLead(row));
    });
  }

  async convertLead(tenantId: string, leadId: string): Promise<ErpLeadRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const leadRes = await client.query(
        `SELECT * FROM erp_leads WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
        [tenantId, leadId]
      );
      if (!leadRes.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Lead not found.', 404);
      const lead = leadRes.rows[0];
      if (String(lead.status) === 'CONVERTED') {
        throw new ErpServiceError('INVALID_STATUS', 'Lead is already converted.');
      }
      if (String(lead.status) === 'LOST') {
        throw new ErpServiceError('INVALID_STATUS', 'Lost leads cannot be converted.');
      }
      const customerId = generateUuidV7();
      const code = `C${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 100)}`;
      await client.query(
        `INSERT INTO erp_customers (id, tenant_id, code, name, phone, email)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [customerId, tenantId, code, String(lead.company_name), lead.phone, lead.email]
      );
      if (lead.contact_name) {
        await client.query(
          `INSERT INTO erp_customer_contacts (id, tenant_id, customer_id, full_name, phone, email)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [generateUuidV7(), tenantId, customerId, String(lead.contact_name), lead.phone, lead.email]
        );
      }
      const updated = await client.query(
        `UPDATE erp_leads
         SET status = 'CONVERTED', converted_customer_id = $3, converted_at = NOW(), updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2
         RETURNING *`,
        [tenantId, leadId, customerId]
      );
      return this.mapLead(updated.rows[0]);
    });
  }

  async createOrder(tenantId: string, input: {
    orderNumber: string;
    customerId: string;
    quarryId: string;
    notes?: string;
    createdBy?: string;
    taxAmount?: number;
    lines: ErpOrderLineInput[];
  }): Promise<ErpOrderRecord> {
    if (!input.lines.length) {
      throw new ErpServiceError('BAD_REQUEST', 'At least one order line is required.');
    }
    const id = generateUuidV7();
    const subtotal = roundMoney(input.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0));
    const taxAmount = roundMoney(input.taxAmount || 0);
    const totalAmount = roundMoney(subtotal + taxAmount);

    return withTenantTransaction(tenantId, async (client) => {
      await client.query(
        `INSERT INTO erp_orders (
          id, tenant_id, order_number, customer_id, quarry_id, status, subtotal, tax_amount, total_amount, notes, created_by
        ) VALUES ($1,$2,$3,$4,$5,'DRAFT',$6,$7,$8,$9,$10)`,
        [
          id,
          tenantId,
          input.orderNumber.trim().toUpperCase(),
          input.customerId,
          input.quarryId,
          subtotal,
          taxAmount,
          totalAmount,
          input.notes || null,
          input.createdBy || null
        ]
      );
      for (const line of input.lines) {
        const lineTotal = roundMoney(line.quantity * line.unitPrice);
        await client.query(
          `INSERT INTO erp_order_lines (
            id, tenant_id, order_id, product_id, product_size_id, location_id, quantity, quantity_uom, unit_price, line_total
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            generateUuidV7(),
            tenantId,
            id,
            line.productId,
            line.productSizeId || null,
            line.locationId || null,
            line.quantity,
            line.quantityUom || 'TON',
            line.unitPrice,
            lineTotal
          ]
        );
      }
      return this.loadOrder(client, tenantId, id);
    });
  }

  async getOrder(tenantId: string, orderId: string): Promise<ErpOrderRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT id FROM erp_orders WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, orderId]
      );
      if (!result.rows[0]) return null;
      return this.loadOrder(client, tenantId, orderId);
    });
  }

  async listOrders(tenantId: string, customerId?: string): Promise<ErpOrderRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = customerId
        ? await client.query(
            `SELECT id FROM erp_orders WHERE tenant_id = $1 AND customer_id = $2 ORDER BY created_at DESC`,
            [tenantId, customerId]
          )
        : await client.query(
            `SELECT id FROM erp_orders WHERE tenant_id = $1 ORDER BY created_at DESC`,
            [tenantId]
          );
      const orders: ErpOrderRecord[] = [];
      for (const row of result.rows) {
        orders.push(await this.loadOrder(client, tenantId, String(row.id)));
      }
      return orders;
    });
  }

  async confirmOrder(tenantId: string, orderId: string): Promise<ErpOrderRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const orderRes = await client.query(
        `SELECT * FROM erp_orders WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
        [tenantId, orderId]
      );
      if (!orderRes.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Order not found.', 404);
      const status = String(orderRes.rows[0].status);
      if (status !== 'DRAFT') {
        throw new ErpServiceError('INVALID_STATUS', `Cannot confirm order in status ${status}.`);
      }
      const lines = await client.query(
        `SELECT * FROM erp_order_lines WHERE tenant_id = $1 AND order_id = $2`,
        [tenantId, orderId]
      );
      for (const row of lines.rows) {
        const stock = await client.query(
          `SELECT quantity FROM erp_stock_balances
           WHERE tenant_id = $1 AND quarry_id = $2 AND product_id = $3
             AND COALESCE(product_size_id, '') = COALESCE($4, '')
             AND COALESCE(location_id, '') = COALESCE($5, '')
           FOR UPDATE`,
          [
            tenantId,
            orderRes.rows[0].quarry_id,
            row.product_id,
            row.product_size_id,
            row.location_id
          ]
        );
        const available = stock.rows[0] ? Number(stock.rows[0].quantity) : 0;
        if (available < Number(row.quantity)) {
          throw new ErpServiceError('INSUFFICIENT_STOCK', 'Insufficient stock to confirm this order.', 409);
        }
      }
      await client.query(
        `UPDATE erp_orders SET status = 'CONFIRMED', confirmed_at = NOW(), updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2`,
        [tenantId, orderId]
      );
      return this.loadOrder(client, tenantId, orderId);
    });
  }

  async cancelOrder(tenantId: string, orderId: string): Promise<ErpOrderRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const orderRes = await client.query(
        `SELECT * FROM erp_orders WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
        [tenantId, orderId]
      );
      if (!orderRes.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Order not found.', 404);
      const status = String(orderRes.rows[0].status);
      if (status === 'DISPATCHED' || status === 'CANCELLED') {
        throw new ErpServiceError('INVALID_STATUS', `Cannot cancel order in status ${status}.`);
      }
      if (orderRes.rows[0].gate_pass_id) {
        throw new ErpServiceError('INVALID_STATUS', 'Cancel the linked gate pass before cancelling this order.');
      }
      await client.query(
        `UPDATE erp_orders SET status = 'CANCELLED', cancelled_at = NOW(), updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2`,
        [tenantId, orderId]
      );
      return this.loadOrder(client, tenantId, orderId);
    });
  }

  async attachGatePass(tenantId: string, orderId: string, gatePassId: string): Promise<void> {
    await withTenantTransaction(tenantId, async (client) => {
      await client.query(
        `UPDATE erp_orders SET gate_pass_id = $3, status = 'ALLOCATED', updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2`,
        [tenantId, orderId, gatePassId]
      );
    });
  }

  async getCustomerHistory(tenantId: string, customerId: string): Promise<ErpCustomerHistoryRecord> {
    const customer = await this.catalog.findCustomer(tenantId, customerId);
    if (!customer) throw new ErpServiceError('NOT_FOUND', 'Customer not found.', 404);
    const contacts = await this.listContacts(tenantId, customerId);
    const orders = await this.listOrders(tenantId, customerId);
    const lead = await withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_leads WHERE tenant_id = $1 AND converted_customer_id = $2 LIMIT 1`,
        [tenantId, customerId]
      );
      return result.rows[0] ? this.mapLead(result.rows[0]) : undefined;
    });
    return { customer, contacts, orders, convertedFromLead: lead };
  }

  private async loadOrder(client: PoolClient, tenantId: string, orderId: string): Promise<ErpOrderRecord> {
    const order = await client.query(
      `SELECT * FROM erp_orders WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
      [tenantId, orderId]
    );
    const lines = await client.query(
      `SELECT * FROM erp_order_lines WHERE tenant_id = $1 AND order_id = $2`,
      [tenantId, orderId]
    );
    const row = order.rows[0];
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      orderNumber: String(row.order_number),
      customerId: String(row.customer_id),
      quarryId: String(row.quarry_id),
      status: String(row.status) as ErpOrderRecord['status'],
      currency: String(row.currency),
      subtotal: Number(row.subtotal),
      taxAmount: Number(row.tax_amount),
      totalAmount: Number(row.total_amount),
      notes: row.notes ? String(row.notes) : undefined,
      gatePassId: row.gate_pass_id ? String(row.gate_pass_id) : undefined,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at),
      lines: lines.rows.map((line) => ({
        id: String(line.id),
        productId: String(line.product_id),
        productSizeId: line.product_size_id ? String(line.product_size_id) : undefined,
        locationId: line.location_id ? String(line.location_id) : undefined,
        quantity: Number(line.quantity),
        quantityUom: String(line.quantity_uom),
        unitPrice: Number(line.unit_price),
        lineTotal: Number(line.line_total)
      }))
    };
  }

  private mapContact(row: Record<string, unknown>): ErpCustomerContactRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      customerId: String(row.customer_id),
      fullName: String(row.full_name),
      roleTitle: row.role_title ? String(row.role_title) : undefined,
      phone: row.phone ? String(row.phone) : undefined,
      email: row.email ? String(row.email) : undefined,
      status: String(row.status)
    };
  }

  private mapLead(row: Record<string, unknown>): ErpLeadRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      code: String(row.code),
      companyName: String(row.company_name),
      contactName: row.contact_name ? String(row.contact_name) : undefined,
      phone: row.phone ? String(row.phone) : undefined,
      email: row.email ? String(row.email) : undefined,
      source: row.source ? String(row.source) : undefined,
      notes: row.notes ? String(row.notes) : undefined,
      status: String(row.status) as LeadStatus,
      convertedCustomerId: row.converted_customer_id ? String(row.converted_customer_id) : undefined
    };
  }
}
