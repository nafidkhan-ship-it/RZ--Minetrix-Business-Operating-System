import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import {
  ErpDispatchRecord,
  ErpGatePassRecord,
  ErpProductionBatchRecord,
  ErpProductionLineInput,
  ErpSettlementRateRecord,
  ErpSettlementRecord,
  ErpStockBalanceRecord,
  ErpStockLedgerRecord,
  calculateSettlementAmounts
} from '../db/erp/operationsTypes.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';

type Line = ErpProductionLineInput;

function isoDate(value: unknown): string {
  return String(value).slice(0, 10);
}

function iso(value: unknown): string {
  return new Date(String(value)).toISOString();
}

export class ErpOperationsRepository {
  async createProductionBatch(
    tenantId: string,
    input: {
      quarryId: string;
      batchNumber: string;
      productionDate: string;
      shiftName?: string;
      operatorUserId?: string;
      quantityUom?: string;
      details?: Record<string, unknown>;
      createdBy?: string;
      lines: Line[];
    }
  ): Promise<ErpProductionBatchRecord> {
    const batchId = generateUuidV7();
    const total = input.lines.reduce((sum, line) => sum + line.quantity, 0);

    return withTenantTransaction(tenantId, async (client) => {
      const batch = await client.query(
        `INSERT INTO erp_production_batches (
          id, tenant_id, quarry_id, batch_number, production_date, shift_name,
          operator_user_id, total_quantity, quantity_uom, status, details_json, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'DRAFT',$10,$11)
        RETURNING *`,
        [
          batchId,
          tenantId,
          input.quarryId,
          input.batchNumber.trim().toUpperCase(),
          input.productionDate,
          input.shiftName || null,
          input.operatorUserId || null,
          total,
          input.quantityUom || 'TON',
          JSON.stringify(input.details || {}),
          input.createdBy || null
        ]
      );

      for (const line of input.lines) {
        await client.query(
          `INSERT INTO erp_production_batch_lines (
            id, tenant_id, batch_id, product_id, product_size_id, location_id, quantity, quantity_uom, notes
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            generateUuidV7(),
            tenantId,
            batchId,
            line.productId,
            line.productSizeId || null,
            line.locationId || null,
            line.quantity,
            line.quantityUom || input.quantityUom || 'TON',
            line.notes || null
          ]
        );
      }

      return this.loadBatch(client, tenantId, batchId, batch.rows[0]);
    });
  }

  async getProductionBatch(tenantId: string, batchId: string): Promise<ErpProductionBatchRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_production_batches WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, batchId]
      );
      if (!result.rows[0]) return null;
      return this.loadBatch(client, tenantId, batchId, result.rows[0]);
    });
  }

  async listProductionBatches(tenantId: string, quarryId?: string): Promise<ErpProductionBatchRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = quarryId
        ? await client.query(
            `SELECT * FROM erp_production_batches WHERE tenant_id = $1 AND quarry_id = $2 ORDER BY production_date DESC, created_at DESC`,
            [tenantId, quarryId]
          )
        : await client.query(
            `SELECT * FROM erp_production_batches WHERE tenant_id = $1 ORDER BY production_date DESC, created_at DESC`,
            [tenantId]
          );
      const batches: ErpProductionBatchRecord[] = [];
      for (const row of result.rows) {
        batches.push(await this.loadBatch(client, tenantId, String(row.id), row));
      }
      return batches;
    });
  }

  async postProductionBatch(tenantId: string, batchId: string, postedBy?: string): Promise<ErpProductionBatchRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const batchRes = await client.query(
        `SELECT * FROM erp_production_batches WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
        [tenantId, batchId]
      );
      if (!batchRes.rows[0]) {
        throw new ErpServiceError('NOT_FOUND', 'Production batch not found.', 404);
      }
      const batch = batchRes.rows[0];
      if (batch.status === 'POSTED') {
        throw new ErpServiceError('DUPLICATE_PRODUCTION_POSTING', 'Production batch is already posted.', 409);
      }
      if (batch.status === 'CANCELLED') {
        throw new ErpServiceError('INVALID_STATUS', 'Cancelled production batches cannot be posted.');
      }

      const lines = await client.query(
        `SELECT * FROM erp_production_batch_lines WHERE tenant_id = $1 AND batch_id = $2`,
        [tenantId, batchId]
      );
      if (lines.rows.length === 0) {
        throw new ErpServiceError('BAD_REQUEST', 'Production batch has no lines to post.');
      }

      for (const line of lines.rows) {
        await this.applyStockMovement(client, {
          tenantId,
          quarryId: String(batch.quarry_id),
          productId: String(line.product_id),
          productSizeId: line.product_size_id ? String(line.product_size_id) : undefined,
          locationId: line.location_id ? String(line.location_id) : undefined,
          movementType: 'STOCK_IN',
          quantity: Number(line.quantity),
          quantityUom: String(line.quantity_uom),
          referenceType: 'PRODUCTION',
          referenceId: batchId,
          createdBy: postedBy
        });
      }

      const updated = await client.query(
        `UPDATE erp_production_batches
         SET status = 'POSTED', posted_at = NOW(), posted_by = $3, updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2
         RETURNING *`,
        [tenantId, batchId, postedBy || null]
      );
      return this.loadBatch(client, tenantId, batchId, updated.rows[0]);
    });
  }

  async listStockBalances(tenantId: string, quarryId?: string): Promise<ErpStockBalanceRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = quarryId
        ? await client.query(
            `SELECT * FROM erp_stock_balances WHERE tenant_id = $1 AND quarry_id = $2 ORDER BY product_id`,
            [tenantId, quarryId]
          )
        : await client.query(
            `SELECT * FROM erp_stock_balances WHERE tenant_id = $1 ORDER BY quarry_id, product_id`,
            [tenantId]
          );
      return result.rows.map((row) => this.mapBalance(row));
    });
  }

  async listStockLedger(tenantId: string, quarryId?: string): Promise<ErpStockLedgerRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = quarryId
        ? await client.query(
            `SELECT * FROM erp_stock_ledger WHERE tenant_id = $1 AND quarry_id = $2 ORDER BY occurred_at DESC`,
            [tenantId, quarryId]
          )
        : await client.query(
            `SELECT * FROM erp_stock_ledger WHERE tenant_id = $1 ORDER BY occurred_at DESC LIMIT 200`,
            [tenantId]
          );
      return result.rows.map((row) => this.mapLedger(row));
    });
  }

  async createAdjustment(
    tenantId: string,
    input: {
      quarryId: string;
      productId: string;
      productSizeId?: string;
      locationId?: string;
      quantity: number;
      quantityUom?: string;
      notes?: string;
      createdBy?: string;
    }
  ): Promise<ErpStockLedgerRecord> {
    const referenceId = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      return this.applyStockMovement(client, {
        tenantId,
        quarryId: input.quarryId,
        productId: input.productId,
        productSizeId: input.productSizeId,
        locationId: input.locationId,
        movementType: 'ADJUSTMENT',
        quantity: input.quantity,
        quantityUom: input.quantityUom || 'TON',
        referenceType: 'ADJUSTMENT',
        referenceId,
        createdBy: input.createdBy,
        notes: input.notes
      });
    });
  }

  async createGatePass(
    tenantId: string,
    input: {
      gatePassNumber: string;
      quarryId: string;
      customerId: string;
      vehicleNumber: string;
      driverName: string;
      destination?: string;
      notes?: string;
      createdBy?: string;
      lines: Line[];
    }
  ): Promise<ErpGatePassRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      await this.assertStockAvailable(client, tenantId, input.quarryId, input.lines);

      await client.query(
        `INSERT INTO erp_gate_passes (
          id, tenant_id, gate_pass_number, quarry_id, customer_id, vehicle_number,
          driver_name, destination, status, notes, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'DRAFT',$9,$10)`,
        [
          id,
          tenantId,
          input.gatePassNumber.trim().toUpperCase(),
          input.quarryId,
          input.customerId,
          input.vehicleNumber.trim().toUpperCase(),
          input.driverName.trim(),
          input.destination || null,
          input.notes || null,
          input.createdBy || null
        ]
      );

      for (const line of input.lines) {
        await client.query(
          `INSERT INTO erp_gate_pass_lines (
            id, tenant_id, gate_pass_id, product_id, product_size_id, location_id, quantity, quantity_uom
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            generateUuidV7(),
            tenantId,
            id,
            line.productId,
            line.productSizeId || null,
            line.locationId || null,
            line.quantity,
            line.quantityUom || 'TON'
          ]
        );
      }

      return this.loadGatePass(client, tenantId, id);
    });
  }

  async getGatePass(tenantId: string, gatePassId: string): Promise<ErpGatePassRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT id FROM erp_gate_passes WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, gatePassId]
      );
      if (!result.rows[0]) return null;
      return this.loadGatePass(client, tenantId, gatePassId);
    });
  }

  async listGatePasses(tenantId: string): Promise<ErpGatePassRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT id FROM erp_gate_passes WHERE tenant_id = $1 ORDER BY created_at DESC`,
        [tenantId]
      );
      const records: ErpGatePassRecord[] = [];
      for (const row of result.rows) {
        records.push(await this.loadGatePass(client, tenantId, String(row.id)));
      }
      return records;
    });
  }

  async transitionGatePass(
    tenantId: string,
    gatePassId: string,
    nextStatus: 'APPROVED' | 'ISSUED' | 'CANCELLED',
    actorUserId?: string
  ): Promise<ErpGatePassRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_gate_passes WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
        [tenantId, gatePassId]
      );
      if (!result.rows[0]) {
        throw new ErpServiceError('NOT_FOUND', 'Gate pass not found.', 404);
      }
      const current = String(result.rows[0].status);
      const allowed: Record<string, string[]> = {
        DRAFT: ['APPROVED', 'CANCELLED'],
        APPROVED: ['ISSUED', 'CANCELLED'],
        ISSUED: ['CANCELLED']
      };
      if (!allowed[current]?.includes(nextStatus)) {
        throw new ErpServiceError(
          'INVALID_STATUS_TRANSITION',
          `Cannot transition gate pass from ${current} to ${nextStatus}.`
        );
      }

      const actorColumn =
        nextStatus === 'APPROVED' ? 'approved_by' : nextStatus === 'ISSUED' ? 'issued_by' : 'cancelled_by';
      const timeColumn =
        nextStatus === 'APPROVED' ? 'approved_at' : nextStatus === 'ISSUED' ? 'issued_at' : 'cancelled_at';

      await client.query(
        `UPDATE erp_gate_passes
         SET status = $3, ${actorColumn} = $4, ${timeColumn} = NOW(), updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2`,
        [tenantId, gatePassId, nextStatus, actorUserId || null]
      );
      return this.loadGatePass(client, tenantId, gatePassId);
    });
  }

  async createDispatch(
    tenantId: string,
    input: {
      dispatchNumber: string;
      gatePassId: string;
      createdBy?: string;
      idempotencyKey?: string;
    }
  ): Promise<ErpDispatchRecord> {
    const dispatchId = generateUuidV7();

    try {
      return await withTenantTransaction(tenantId, async (client) => {
        if (input.idempotencyKey) {
          const existing = await client.query(
            `SELECT resource_id FROM erp_idempotency_keys
             WHERE tenant_id = $1 AND scope = 'DISPATCH' AND idempotency_key = $2`,
            [tenantId, input.idempotencyKey]
          );
          if (existing.rows[0]) {
            return this.loadDispatch(client, tenantId, String(existing.rows[0].resource_id));
          }
        }

        const gpRes = await client.query(
          `SELECT * FROM erp_gate_passes WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
          [tenantId, input.gatePassId]
        );
        if (!gpRes.rows[0]) {
          throw new ErpServiceError('NOT_FOUND', 'Gate pass not found.', 404);
        }
        const gatePass = gpRes.rows[0];
        if (gatePass.status === 'CANCELLED') {
          throw new ErpServiceError('GATE_PASS_CANCELLED', 'Cannot dispatch a cancelled gate pass.');
        }
        if (gatePass.status !== 'ISSUED') {
          throw new ErpServiceError('INVALID_STATUS', 'Gate pass must be ISSUED before dispatch.');
        }
        if (gatePass.dispatch_id) {
          throw new ErpServiceError('DUPLICATE_DISPATCH', 'This gate pass already has a dispatch.', 409);
        }

        const lines = await client.query(
          `SELECT * FROM erp_gate_pass_lines WHERE tenant_id = $1 AND gate_pass_id = $2`,
          [tenantId, input.gatePassId]
        );
        const mappedLines: Line[] = lines.rows.map((row) => ({
          productId: String(row.product_id),
          productSizeId: row.product_size_id ? String(row.product_size_id) : undefined,
          locationId: row.location_id ? String(row.location_id) : undefined,
          quantity: Number(row.quantity),
          quantityUom: String(row.quantity_uom)
        }));

        for (const line of mappedLines) {
          await this.applyStockMovement(client, {
            tenantId,
            quarryId: String(gatePass.quarry_id),
            productId: line.productId,
            productSizeId: line.productSizeId,
            locationId: line.locationId,
            movementType: 'STOCK_OUT',
            quantity: line.quantity,
            quantityUom: line.quantityUom || 'TON',
            referenceType: 'DISPATCH',
            referenceId: dispatchId,
            createdBy: input.createdBy
          });
        }

        await client.query(
          `INSERT INTO erp_dispatches (
            id, tenant_id, dispatch_number, gate_pass_id, quarry_id, customer_id,
            vehicle_number, driver_name, destination, status, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'POSTED',$10)`,
          [
            dispatchId,
            tenantId,
            input.dispatchNumber.trim().toUpperCase(),
            input.gatePassId,
            gatePass.quarry_id,
            gatePass.customer_id,
            gatePass.vehicle_number,
            gatePass.driver_name,
            gatePass.destination,
            input.createdBy || null
          ]
        );

        for (const line of mappedLines) {
          await client.query(
            `INSERT INTO erp_dispatch_lines (
              id, tenant_id, dispatch_id, product_id, product_size_id, location_id, quantity, quantity_uom
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              generateUuidV7(),
              tenantId,
              dispatchId,
              line.productId,
              line.productSizeId || null,
              line.locationId || null,
              line.quantity,
              line.quantityUom || 'TON'
            ]
          );
        }

        await client.query(
          `UPDATE erp_gate_passes
           SET status = 'DISPATCHED', dispatch_id = $3, updated_at = NOW()
           WHERE tenant_id = $1 AND id = $2`,
          [tenantId, input.gatePassId, dispatchId]
        );

        if (input.idempotencyKey) {
          await client.query(
            `INSERT INTO erp_idempotency_keys (
              id, tenant_id, scope, idempotency_key, resource_type, resource_id
            ) VALUES ($1,$2,'DISPATCH',$3,'DISPATCH',$4)`,
            [generateUuidV7(), tenantId, input.idempotencyKey, dispatchId]
          );
        }

        return this.loadDispatch(client, tenantId, dispatchId);
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_DISPATCH', 'Dispatch already exists for this gate pass or number.', 409);
      }
      throw error;
    }
  }

  async getDispatch(tenantId: string, dispatchId: string): Promise<ErpDispatchRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT id FROM erp_dispatches WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, dispatchId]
      );
      if (!result.rows[0]) return null;
      return this.loadDispatch(client, tenantId, dispatchId);
    });
  }

  async listDispatches(tenantId: string): Promise<ErpDispatchRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT id FROM erp_dispatches WHERE tenant_id = $1 ORDER BY dispatched_at DESC`,
        [tenantId]
      );
      const records: ErpDispatchRecord[] = [];
      for (const row of result.rows) {
        records.push(await this.loadDispatch(client, tenantId, String(row.id)));
      }
      return records;
    });
  }

  async createSettlementRate(tenantId: string, input: {
    landParcelId: string;
    quarryId?: string;
    productId?: string;
    ratePerUom: number;
    quantityUom?: string;
    effectiveFrom: string;
    effectiveTo?: string;
  }): Promise<ErpSettlementRateRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO erp_settlement_rates (
          id, tenant_id, land_parcel_id, quarry_id, product_id, rate_per_uom,
          quantity_uom, effective_from, effective_to
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
          id,
          tenantId,
          input.landParcelId,
          input.quarryId || null,
          input.productId || null,
          input.ratePerUom,
          input.quantityUom || 'TON',
          input.effectiveFrom,
          input.effectiveTo || null
        ]
      );
      return this.mapRate(result.rows[0]);
    });
  }

  async listSettlementRates(tenantId: string): Promise<ErpSettlementRateRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_settlement_rates WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY effective_from DESC`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapRate(row));
    });
  }

  async createSettlement(
    tenantId: string,
    input: {
      settlementNumber: string;
      landParcelId: string;
      quarryId: string;
      basis: 'PRODUCTION' | 'DISPATCH';
      quantity?: number;
      productionBatchId?: string;
      dispatchId?: string;
      deductions?: number;
      statementRef?: string;
      createdBy?: string;
      asOfDate?: string;
    }
  ): Promise<ErpSettlementRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const asOf = input.asOfDate || new Date().toISOString().slice(0, 10);
      const rateRes = await client.query(
        `SELECT * FROM erp_settlement_rates
         WHERE tenant_id = $1
           AND land_parcel_id = $2
           AND status = 'ACTIVE'
           AND effective_from <= $3::date
           AND (effective_to IS NULL OR effective_to >= $3::date)
           AND (quarry_id IS NULL OR quarry_id = $4)
         ORDER BY quarry_id NULLS LAST, effective_from DESC
         LIMIT 1`,
        [tenantId, input.landParcelId, asOf, input.quarryId]
      );
      if (!rateRes.rows[0]) {
        throw new ErpServiceError('RATE_NOT_CONFIGURED', 'No active settlement rate is configured for this parcel.');
      }
      const rate = Number(rateRes.rows[0].rate_per_uom);
      const uom = String(rateRes.rows[0].quantity_uom);

      let quantity = input.quantity;
      if (input.basis === 'PRODUCTION' && input.productionBatchId) {
        const batch = await client.query(
          `SELECT total_quantity, status FROM erp_production_batches WHERE tenant_id = $1 AND id = $2`,
          [tenantId, input.productionBatchId]
        );
        if (!batch.rows[0] || batch.rows[0].status !== 'POSTED') {
          throw new ErpServiceError('BAD_REQUEST', 'Settlement requires a posted production batch.');
        }
        quantity = Number(batch.rows[0].total_quantity);
      }
      if (input.basis === 'DISPATCH' && input.dispatchId) {
        const qty = await client.query(
          `SELECT COALESCE(SUM(quantity),0) AS qty FROM erp_dispatch_lines WHERE tenant_id = $1 AND dispatch_id = $2`,
          [tenantId, input.dispatchId]
        );
        quantity = Number(qty.rows[0].qty);
      }
      if (!quantity || quantity <= 0) {
        throw new ErpServiceError('BAD_REQUEST', 'Settlement quantity must be greater than zero.');
      }

      let amounts;
      try {
        amounts = calculateSettlementAmounts(quantity, rate, input.deductions || 0);
      } catch (error) {
        throw new ErpServiceError('CALCULATION_ERROR', error instanceof Error ? error.message : 'Invalid settlement calculation.');
      }

      const result = await client.query(
        `INSERT INTO erp_settlements (
          id, tenant_id, settlement_number, land_parcel_id, quarry_id, basis,
          quantity, quantity_uom, rate_per_uom, gross_amount, deductions, net_amount,
          status, statement_ref, production_batch_id, dispatch_id, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'POSTED',$13,$14,$15,$16)
        RETURNING *`,
        [
          id,
          tenantId,
          input.settlementNumber.trim().toUpperCase(),
          input.landParcelId,
          input.quarryId,
          input.basis,
          quantity,
          uom,
          rate,
          amounts.grossAmount,
          input.deductions || 0,
          amounts.netAmount,
          input.statementRef || null,
          input.productionBatchId || null,
          input.dispatchId || null,
          input.createdBy || null
        ]
      );
      return this.mapSettlement(result.rows[0]);
    });
  }

  async listSettlements(tenantId: string): Promise<ErpSettlementRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM erp_settlements WHERE tenant_id = $1 ORDER BY created_at DESC`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapSettlement(row));
    });
  }

  private async applyStockMovement(
    client: pg.PoolClient,
    input: {
      tenantId: string;
      quarryId: string;
      productId: string;
      productSizeId?: string;
      locationId?: string;
      movementType: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT';
      quantity: number;
      quantityUom: string;
      referenceType: string;
      referenceId: string;
      createdBy?: string;
      notes?: string;
    }
  ): Promise<ErpStockLedgerRecord> {
    if (input.quantity <= 0) {
      throw new ErpServiceError('BAD_REQUEST', 'Stock movement quantity must be greater than zero.');
    }

    const delta = input.movementType === 'STOCK_OUT' ? -input.quantity : input.quantity;
    const existing = await client.query(
      `SELECT * FROM erp_stock_balances
       WHERE tenant_id = $1 AND quarry_id = $2 AND product_id = $3
         AND COALESCE(product_size_id, '') = COALESCE($4, '')
         AND COALESCE(location_id, '') = COALESCE($5, '')
       FOR UPDATE`,
      [input.tenantId, input.quarryId, input.productId, input.productSizeId || null, input.locationId || null]
    );

    const currentQty = existing.rows[0] ? Number(existing.rows[0].quantity) : 0;
    const nextQty = currentQty + delta;
    if (nextQty < 0) {
      throw new ErpServiceError('INSUFFICIENT_STOCK', 'Insufficient stock for this movement.', 409);
    }

    if (existing.rows[0]) {
      await client.query(
        `UPDATE erp_stock_balances
         SET quantity = $2, version = version + 1, updated_at = NOW()
         WHERE id = $1`,
        [existing.rows[0].id, nextQty]
      );
    } else {
      await client.query(
        `INSERT INTO erp_stock_balances (
          id, tenant_id, quarry_id, product_id, product_size_id, location_id, quantity, quantity_uom
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          generateUuidV7(),
          input.tenantId,
          input.quarryId,
          input.productId,
          input.productSizeId || null,
          input.locationId || null,
          nextQty,
          input.quantityUom
        ]
      );
    }

    try {
      const ledger = await client.query(
        `INSERT INTO erp_stock_ledger (
          id, tenant_id, quarry_id, product_id, product_size_id, location_id,
          movement_type, quantity, quantity_uom, reference_type, reference_id, created_by, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *`,
        [
          generateUuidV7(),
          input.tenantId,
          input.quarryId,
          input.productId,
          input.productSizeId || null,
          input.locationId || null,
          input.movementType,
          input.quantity,
          input.quantityUom,
          input.referenceType,
          input.referenceId,
          input.createdBy || null,
          input.notes || null
        ]
      );
      return this.mapLedger(ledger.rows[0]);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_STOCK_POSTING', 'This stock movement was already posted.', 409);
      }
      throw error;
    }
  }

  private async assertStockAvailable(client: pg.PoolClient, tenantId: string, quarryId: string, lines: Line[]): Promise<void> {
    for (const line of lines) {
      const result = await client.query(
        `SELECT quantity FROM erp_stock_balances
         WHERE tenant_id = $1 AND quarry_id = $2 AND product_id = $3
           AND COALESCE(product_size_id, '') = COALESCE($4, '')
           AND COALESCE(location_id, '') = COALESCE($5, '')
         FOR UPDATE`,
        [tenantId, quarryId, line.productId, line.productSizeId || null, line.locationId || null]
      );
      const available = result.rows[0] ? Number(result.rows[0].quantity) : 0;
      if (available < line.quantity) {
        throw new ErpServiceError('INSUFFICIENT_STOCK', 'Insufficient stock to create this gate pass.', 409);
      }
    }
  }

  private async loadBatch(
    client: pg.PoolClient,
    tenantId: string,
    batchId: string,
    row: Record<string, unknown>
  ): Promise<ErpProductionBatchRecord> {
    const lines = await client.query(
      `SELECT * FROM erp_production_batch_lines WHERE tenant_id = $1 AND batch_id = $2`,
      [tenantId, batchId]
    );
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      quarryId: String(row.quarry_id),
      batchNumber: String(row.batch_number),
      productionDate: isoDate(row.production_date),
      shiftName: row.shift_name ? String(row.shift_name) : undefined,
      operatorUserId: row.operator_user_id ? String(row.operator_user_id) : undefined,
      totalQuantity: Number(row.total_quantity),
      quantityUom: String(row.quantity_uom),
      status: String(row.status) as ErpProductionBatchRecord['status'],
      details: (row.details_json as Record<string, unknown>) || {},
      lines: lines.rows.map((line) => ({
        id: String(line.id),
        productId: String(line.product_id),
        productSizeId: line.product_size_id ? String(line.product_size_id) : undefined,
        locationId: line.location_id ? String(line.location_id) : undefined,
        quantity: Number(line.quantity),
        quantityUom: String(line.quantity_uom),
        notes: line.notes ? String(line.notes) : undefined
      })),
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at),
      postedAt: row.posted_at ? iso(row.posted_at) : undefined
    };
  }

  private async loadGatePass(client: pg.PoolClient, tenantId: string, gatePassId: string): Promise<ErpGatePassRecord> {
    const header = await client.query(
      `SELECT * FROM erp_gate_passes WHERE tenant_id = $1 AND id = $2`,
      [tenantId, gatePassId]
    );
    const lines = await client.query(
      `SELECT * FROM erp_gate_pass_lines WHERE tenant_id = $1 AND gate_pass_id = $2`,
      [tenantId, gatePassId]
    );
    const row = header.rows[0];
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      gatePassNumber: String(row.gate_pass_number),
      quarryId: String(row.quarry_id),
      customerId: String(row.customer_id),
      vehicleNumber: String(row.vehicle_number),
      driverName: String(row.driver_name),
      destination: row.destination ? String(row.destination) : undefined,
      status: String(row.status) as ErpGatePassRecord['status'],
      dispatchId: row.dispatch_id ? String(row.dispatch_id) : undefined,
      lines: lines.rows.map((line) => ({
        id: String(line.id),
        productId: String(line.product_id),
        productSizeId: line.product_size_id ? String(line.product_size_id) : undefined,
        locationId: line.location_id ? String(line.location_id) : undefined,
        quantity: Number(line.quantity),
        quantityUom: String(line.quantity_uom)
      })),
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at)
    };
  }

  private async loadDispatch(client: pg.PoolClient, tenantId: string, dispatchId: string): Promise<ErpDispatchRecord> {
    const header = await client.query(
      `SELECT * FROM erp_dispatches WHERE tenant_id = $1 AND id = $2`,
      [tenantId, dispatchId]
    );
    const lines = await client.query(
      `SELECT * FROM erp_dispatch_lines WHERE tenant_id = $1 AND dispatch_id = $2`,
      [tenantId, dispatchId]
    );
    const row = header.rows[0];
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      dispatchNumber: String(row.dispatch_number),
      gatePassId: String(row.gate_pass_id),
      quarryId: String(row.quarry_id),
      customerId: String(row.customer_id),
      vehicleNumber: String(row.vehicle_number),
      driverName: String(row.driver_name),
      destination: row.destination ? String(row.destination) : undefined,
      status: String(row.status) as ErpDispatchRecord['status'],
      dispatchedAt: iso(row.dispatched_at),
      lines: lines.rows.map((line) => ({
        id: String(line.id),
        productId: String(line.product_id),
        productSizeId: line.product_size_id ? String(line.product_size_id) : undefined,
        locationId: line.location_id ? String(line.location_id) : undefined,
        quantity: Number(line.quantity),
        quantityUom: String(line.quantity_uom)
      }))
    };
  }

  private mapBalance(row: Record<string, unknown>): ErpStockBalanceRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      quarryId: String(row.quarry_id),
      productId: String(row.product_id),
      productSizeId: row.product_size_id ? String(row.product_size_id) : undefined,
      locationId: row.location_id ? String(row.location_id) : undefined,
      quantity: Number(row.quantity),
      quantityUom: String(row.quantity_uom),
      version: Number(row.version)
    };
  }

  private mapLedger(row: Record<string, unknown>): ErpStockLedgerRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      quarryId: String(row.quarry_id),
      productId: String(row.product_id),
      productSizeId: row.product_size_id ? String(row.product_size_id) : undefined,
      locationId: row.location_id ? String(row.location_id) : undefined,
      movementType: String(row.movement_type) as ErpStockLedgerRecord['movementType'],
      quantity: Number(row.quantity),
      quantityUom: String(row.quantity_uom),
      referenceType: String(row.reference_type),
      referenceId: String(row.reference_id),
      occurredAt: iso(row.occurred_at)
    };
  }

  private mapRate(row: Record<string, unknown>): ErpSettlementRateRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      landParcelId: String(row.land_parcel_id),
      quarryId: row.quarry_id ? String(row.quarry_id) : undefined,
      productId: row.product_id ? String(row.product_id) : undefined,
      ratePerUom: Number(row.rate_per_uom),
      quantityUom: String(row.quantity_uom),
      effectiveFrom: isoDate(row.effective_from),
      effectiveTo: row.effective_to ? isoDate(row.effective_to) : undefined,
      status: String(row.status)
    };
  }

  private mapSettlement(row: Record<string, unknown>): ErpSettlementRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      settlementNumber: String(row.settlement_number),
      landParcelId: String(row.land_parcel_id),
      quarryId: String(row.quarry_id),
      basis: String(row.basis) as ErpSettlementRecord['basis'],
      quantity: Number(row.quantity),
      quantityUom: String(row.quantity_uom),
      ratePerUom: Number(row.rate_per_uom),
      grossAmount: Number(row.gross_amount),
      deductions: Number(row.deductions),
      netAmount: Number(row.net_amount),
      status: String(row.status) as ErpSettlementRecord['status'],
      statementRef: row.statement_ref ? String(row.statement_ref) : undefined,
      productionBatchId: row.production_batch_id ? String(row.production_batch_id) : undefined,
      dispatchId: row.dispatch_id ? String(row.dispatch_id) : undefined
    };
  }
}
