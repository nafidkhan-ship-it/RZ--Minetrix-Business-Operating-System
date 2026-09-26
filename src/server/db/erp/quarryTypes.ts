export type QuarryOperationalStatus = 'ACTIVE' | 'MAINTENANCE' | 'ENVIRONMENTAL_PAUSE' | 'INACTIVE';
export type QuarryMineralType = 'LATERITE' | 'GRANITE' | 'HARD_ROCK' | 'BLUE_METAL' | 'OTHER';
export type ErpRecordStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface ErpQuarry {
  id: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  code: string;
  name: string;
  mineralType: QuarryMineralType;
  operationalStatus: QuarryOperationalStatus;
  gpsLatitude?: number;
  gpsLongitude?: number;
  capacityTons?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  version: number;
}

export interface ErpQuarryLocation {
  id: string;
  tenantId: string;
  quarryId: string;
  name: string;
  locationType: 'BENCH' | 'HAUL_ROAD' | 'ENTRY' | 'STOCKPILE' | 'OTHER';
  gpsLatitude?: number;
  gpsLongitude?: number;
  boundary?: Record<string, unknown>;
  status: ErpRecordStatus;
}

export interface ErpLandParcel {
  id: string;
  tenantId: string;
  surveyNumber: string;
  villageTaluk?: string;
  acreage?: number;
  ownerName: string;
  status: ErpRecordStatus;
}

export interface ErpQuarryLease {
  id: string;
  tenantId: string;
  landParcelId: string;
  quarryId?: string;
  leaseNumber: string;
  royaltyType: string;
  royaltyRate?: number;
  revenueSharePercent?: number;
  startDate: string;
  endDate: string;
  status: ErpRecordStatus;
}

export interface ErpProduct {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: string;
  defaultUom: 'TON' | 'CFT' | 'PIECE' | 'BAG';
  densityTonPerCft?: number;
  gstPercent: number;
  status: ErpRecordStatus;
}

export interface ErpProductSize {
  id: string;
  tenantId: string;
  productId: string;
  sizeCode: string;
  sizeLabel: string;
  dimensions?: string;
  status: ErpRecordStatus;
}

export interface ErpProductPrice {
  id: string;
  tenantId: string;
  productId: string;
  productSizeId?: string;
  quarryId?: string;
  unitPrice: number;
  currency: string;
  priceIncludesGst: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  status: ErpRecordStatus;
}

export interface ErpProductionBatch {
  id: string;
  tenantId: string;
  quarryId: string;
  batchNumber: string;
  productionDate: string;
  shiftName?: string;
  operatorUserId?: string;
  totalQuantity: number;
  quantityUom: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  details?: Record<string, unknown>;
}
