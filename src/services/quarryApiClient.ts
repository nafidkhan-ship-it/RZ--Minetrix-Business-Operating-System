/**
 * RZ® Minetrix BOS - Quarry Management API Client (Phase 17)
 * Strictly typed frontend gateway for all /api/quarries endpoints.
 * Reuses the authenticated session context from apiClient.
 */

import { apiClient, ApiResponse } from './apiClient';

export type QuarryType = 'LATERITE' | 'HARD_ROCK';

export interface QuarryMaster {
  id: string;
  tenantId: string;
  companyId: string;
  branchId: string;
  businessUnitId?: string;
  name: string;
  quarryType: QuarryType;
  location: string;
  address?: string;
  ownerId?: string;
  leaseReference?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

export interface CreateQuarryDto {
  companyId: string;
  branchId: string;
  businessUnitId?: string;
  name: string;
  quarryType: QuarryType;
  location: string;
  address?: string;
  ownerId?: string;
  leaseReference?: string;
}

export interface UpdateQuarryDto {
  name?: string;
  location?: string;
  address?: string;
  ownerId?: string;
  leaseReference?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

export interface StoneProduct {
  id: string;
  tenantId: string;
  quarryId: string;
  productCode: string;
  name: string;
  mineralType: QuarryType;
  dimensions?: string;
  unit: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  defaultPrice: number;
  gstRate?: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoneProductDto {
  quarryId: string;
  productCode: string;
  name: string;
  mineralType: QuarryType;
  dimensions?: string;
  unit: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  defaultPrice: number;
  gstRate?: number;
}

export interface UpdateStoneProductDto {
  name?: string;
  dimensions?: string;
  unit?: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  defaultPrice?: number;
  gstRate?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ProductionLog {
  id: string;
  tenantId: string;
  quarryId: string;
  productId: string;
  productionType?: 'LATERITE_CUTTING' | 'HARD_ROCK_EXTRACTION';
  productionDate?: string;
  shift?: 'DAY' | 'NIGHT' | 'GENERAL';
  quantity: number;
  operatorId: string;
  machineId?: string;
  remarks?: string;
  createdAt: string;
}

export interface RecordProductionDto {
  id?: string;
  quarryId: string;
  productId: string;
  productionType?: 'LATERITE_CUTTING' | 'HARD_ROCK_EXTRACTION';
  productionDate?: string;
  shift?: 'DAY' | 'NIGHT' | 'GENERAL';
  quantity: number;
  operatorId: string;
  machineId?: string;
  remarks?: string;
}

export interface StockSummaryItem {
  productId: string;
  productCode: string;
  productName: string;
  mineralType: QuarryType;
  unit: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  totalIn: number;
  totalOut: number;
  balanceQuantity: number;
  lastUpdated: string;
}

export interface StockLedgerEntry {
  id: string;
  tenantId: string;
  quarryId: string;
  productId: string;
  transactionType: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';
  referenceType?: 'PRODUCTION' | 'GATE_PASS' | 'STOCK_ADJUSTMENT' | 'INTERNAL_TRANSFER';
  referenceId?: string;
  quantityIn: number;
  quantityOut: number;
  balanceQuantity: number;
  transactionDate: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
}

export interface RecordStockAdjustmentDto {
  quarryId: string;
  productId: string;
  adjustmentType: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';
  quantity: number;
  reason: string;
  remarks?: string;
}

export interface GatePass {
  id: string;
  tenantId: string;
  quarryId: string;
  passNumber: string;
  customerId: string;
  productId: string;
  quantity: number;
  unit: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  vehicleId?: string;
  vehicleNo?: string;
  driverId?: string;
  driverName?: string;
  grossWeight?: number;
  tareWeight?: number;
  netWeight?: number;
  status: 'DRAFT' | 'ISSUED' | 'VERIFIED' | 'DISPATCHED' | 'CANCELLED';
  salesReference?: string;
  cancellationReason?: string;
  approvedBy?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGatePassDto {
  id?: string;
  quarryId: string;
  customerId: string;
  productId: string;
  quantity: number;
  unit?: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  vehicleId?: string;
  vehicleNo?: string;
  driverId?: string;
  driverName?: string;
  grossWeight?: number;
  tareWeight?: number;
  salesReference?: string;
}

export interface VerifyWeighbridgeDto {
  grossWeight?: number;
  tareWeight?: number;
}

export interface LandLease {
  id: string;
  tenantId: string;
  quarryId: string;
  ownerId?: string;
  ownerName: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  area: number;
  leaseType: 'OWNED' | 'LEASED' | 'REVENUE_SHARE';
  royaltyType: 'FIXED_MONTHLY' | 'PER_TON' | 'PER_PIECE' | 'REVENUE_PERCENT';
  royaltyRate: number;
  startDate: string;
  expiryDate: string;
  documentReference?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLandLeaseDto {
  quarryId: string;
  ownerId?: string;
  ownerName: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  area: number;
  leaseType: 'OWNED' | 'LEASED' | 'REVENUE_SHARE';
  royaltyType: 'FIXED_MONTHLY' | 'PER_TON' | 'PER_PIECE' | 'REVENUE_PERCENT';
  royaltyRate: number;
  startDate: string;
  expiryDate: string;
  documentReference?: string;
}

export interface UpdateLandLeaseDto {
  ownerName?: string;
  area?: number;
  royaltyType?: 'FIXED_MONTHLY' | 'PER_TON' | 'PER_PIECE' | 'REVENUE_PERCENT';
  royaltyRate?: number;
  expiryDate?: string;
  status?: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  documentReference?: string;
}

export interface LandownerSettlementStatement {
  id: string;
  tenantId: string;
  quarryId: string;
  statementNumber: string;
  leaseId: string;
  ownerName: string;
  periodStart: string;
  periodEnd: string;
  basisQuantity: number;
  royaltyRate: number;
  calculatedAmount: number;
  tdsDeduction: number;
  netPayable: number;
  status: 'DRAFT' | 'APPROVED' | 'PAID' | 'CANCELLED';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSettlementDto {
  leaseId: string;
  periodStart: string;
  periodEnd: string;
  basisQuantity: number;
}

class QuarryApiClient {
  // -------------------------------------------------------------
  // Quarry Master API
  // -------------------------------------------------------------
  public async listQuarries(): Promise<ApiResponse<QuarryMaster[]>> {
    return apiClient.request<QuarryMaster[]>('GET', '/api/quarries');
  }

  public async getQuarry(quarryId: string): Promise<ApiResponse<QuarryMaster>> {
    return apiClient.request<QuarryMaster>('GET', `/api/quarries/${quarryId}`);
  }

  public async createQuarry(dto: CreateQuarryDto): Promise<ApiResponse<QuarryMaster>> {
    return apiClient.request<QuarryMaster>('POST', '/api/quarries', dto);
  }

  public async updateQuarry(quarryId: string, dto: UpdateQuarryDto): Promise<ApiResponse<QuarryMaster>> {
    return apiClient.request<QuarryMaster>('PUT', `/api/quarries/${quarryId}`, dto);
  }

  public async deactivateQuarry(quarryId: string): Promise<ApiResponse<QuarryMaster>> {
    return apiClient.request<QuarryMaster>('DELETE', `/api/quarries/${quarryId}`);
  }

  // -------------------------------------------------------------
  // Stone Products API
  // -------------------------------------------------------------
  public async listProducts(quarryId: string): Promise<ApiResponse<StoneProduct[]>> {
    return apiClient.request<StoneProduct[]>('GET', `/api/quarries/${quarryId}/products`);
  }

  public async getProduct(quarryId: string, productId: string): Promise<ApiResponse<StoneProduct>> {
    return apiClient.request<StoneProduct>('GET', `/api/quarries/${quarryId}/products/${productId}`);
  }

  public async createProduct(quarryId: string, dto: CreateStoneProductDto): Promise<ApiResponse<StoneProduct>> {
    return apiClient.request<StoneProduct>('POST', `/api/quarries/${quarryId}/products`, dto);
  }

  public async updateProduct(quarryId: string, productId: string, dto: UpdateStoneProductDto): Promise<ApiResponse<StoneProduct>> {
    return apiClient.request<StoneProduct>('PUT', `/api/quarries/${quarryId}/products/${productId}`, dto);
  }

  public async deactivateProduct(quarryId: string, productId: string): Promise<ApiResponse<StoneProduct>> {
    return apiClient.request<StoneProduct>('DELETE', `/api/quarries/${quarryId}/products/${productId}`);
  }

  // -------------------------------------------------------------
  // Production Register API
  // -------------------------------------------------------------
  public async listProduction(quarryId: string): Promise<ApiResponse<ProductionLog[]>> {
    return apiClient.request<ProductionLog[]>('GET', `/api/quarries/${quarryId}/production`);
  }

  public async recordProduction(quarryId: string, dto: RecordProductionDto): Promise<ApiResponse<ProductionLog>> {
    return apiClient.request<ProductionLog>('POST', `/api/quarries/${quarryId}/production`, dto);
  }

  // -------------------------------------------------------------
  // Stock & Inventory API
  // -------------------------------------------------------------
  public async getStockSummary(quarryId: string): Promise<ApiResponse<StockSummaryItem[]>> {
    return apiClient.request<StockSummaryItem[]>('GET', `/api/quarries/${quarryId}/stock`);
  }

  public async getStockBalance(quarryId: string, productId: string): Promise<ApiResponse<{ productId: string; balanceQuantity: number }>> {
    return apiClient.request<{ productId: string; balanceQuantity: number }>('GET', `/api/quarries/${quarryId}/stock/${productId}`);
  }

  public async getStockLedger(quarryId: string, productId?: string): Promise<ApiResponse<StockLedgerEntry[]>> {
    const url = productId
      ? `/api/quarries/${quarryId}/stock/ledger?productId=${productId}`
      : `/api/quarries/${quarryId}/stock/ledger`;
    return apiClient.request<StockLedgerEntry[]>('GET', url);
  }

  public async recordStockAdjustment(quarryId: string, dto: RecordStockAdjustmentDto): Promise<ApiResponse<StockLedgerEntry>> {
    return apiClient.request<StockLedgerEntry>('POST', `/api/quarries/${quarryId}/stock/adjustment`, dto);
  }

  // -------------------------------------------------------------
  // Gate Pass & Weighbridge API
  // -------------------------------------------------------------
  public async listGatePasses(quarryId: string): Promise<ApiResponse<GatePass[]>> {
    return apiClient.request<GatePass[]>('GET', `/api/quarries/${quarryId}/gate-passes`);
  }

  public async getGatePass(quarryId: string, gatePassId: string): Promise<ApiResponse<GatePass>> {
    return apiClient.request<GatePass>('GET', `/api/quarries/${quarryId}/gate-passes/${gatePassId}`);
  }

  public async createGatePass(quarryId: string, dto: CreateGatePassDto): Promise<ApiResponse<GatePass>> {
    return apiClient.request<GatePass>('POST', `/api/quarries/${quarryId}/gate-passes`, dto);
  }

  public async verifyGatePass(quarryId: string, gatePassId: string, dto?: VerifyWeighbridgeDto): Promise<ApiResponse<GatePass>> {
    return apiClient.request<GatePass>('POST', `/api/quarries/${quarryId}/gate-passes/${gatePassId}/verify`, dto || {});
  }

  public async dispatchGatePass(quarryId: string, gatePassId: string): Promise<ApiResponse<{ gatePass: GatePass; stockLedgerEntry: StockLedgerEntry; remainingStock: number }>> {
    return apiClient.request<{ gatePass: GatePass; stockLedgerEntry: StockLedgerEntry; remainingStock: number }>('POST', `/api/quarries/${quarryId}/gate-passes/${gatePassId}/dispatch`);
  }

  public async cancelGatePass(quarryId: string, gatePassId: string, reason: string): Promise<ApiResponse<GatePass>> {
    return apiClient.request<GatePass>('POST', `/api/quarries/${quarryId}/gate-passes/${gatePassId}/cancel`, { reason });
  }

  // -------------------------------------------------------------
  // Land Lease API
  // -------------------------------------------------------------
  public async listLeases(quarryId: string): Promise<ApiResponse<LandLease[]>> {
    return apiClient.request<LandLease[]>('GET', `/api/quarries/${quarryId}/land-leases`);
  }

  public async getLease(quarryId: string, leaseId: string): Promise<ApiResponse<LandLease>> {
    return apiClient.request<LandLease>('GET', `/api/quarries/${quarryId}/land-leases/${leaseId}`);
  }

  public async createLease(quarryId: string, dto: CreateLandLeaseDto): Promise<ApiResponse<LandLease>> {
    return apiClient.request<LandLease>('POST', `/api/quarries/${quarryId}/land-leases`, dto);
  }

  public async updateLease(quarryId: string, leaseId: string, dto: UpdateLandLeaseDto): Promise<ApiResponse<LandLease>> {
    return apiClient.request<LandLease>('PUT', `/api/quarries/${quarryId}/land-leases/${leaseId}`, dto);
  }

  public async deactivateLease(quarryId: string, leaseId: string): Promise<ApiResponse<LandLease>> {
    return apiClient.request<LandLease>('DELETE', `/api/quarries/${quarryId}/land-leases/${leaseId}`);
  }

  // -------------------------------------------------------------
  // Landowner Settlement API
  // -------------------------------------------------------------
  public async listSettlements(quarryId: string, leaseId?: string): Promise<ApiResponse<LandownerSettlementStatement[]>> {
    const url = leaseId
      ? `/api/quarries/${quarryId}/settlements?leaseId=${leaseId}`
      : `/api/quarries/${quarryId}/settlements`;
    return apiClient.request<LandownerSettlementStatement[]>('GET', url);
  }

  public async getSettlement(quarryId: string, settlementId: string): Promise<ApiResponse<LandownerSettlementStatement>> {
    return apiClient.request<LandownerSettlementStatement>('GET', `/api/quarries/${quarryId}/settlements/${settlementId}`);
  }

  public async createSettlement(quarryId: string, dto: CreateSettlementDto): Promise<ApiResponse<LandownerSettlementStatement>> {
    return apiClient.request<LandownerSettlementStatement>('POST', `/api/quarries/${quarryId}/settlements`, dto);
  }

  public async approveSettlement(quarryId: string, settlementId: string): Promise<ApiResponse<LandownerSettlementStatement>> {
    return apiClient.request<LandownerSettlementStatement>('POST', `/api/quarries/${quarryId}/settlements/${settlementId}/approve`);
  }
}

export const quarryApiClient = new QuarryApiClient();
