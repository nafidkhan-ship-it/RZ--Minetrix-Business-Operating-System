export type VehicleType = 'TIPPER' | 'TRAILER' | 'TANKER' | 'PICKUP' | 'LOWBED' | 'OTHER';
export type FuelType = 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC' | 'HYBRID';
export type OwnershipType = 'COMPANY' | 'ATTACHED' | 'CONTRACTOR' | 'LEASED';
export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RETIRED';

export interface FleetVehicleRecord {
  id: string;
  tenantId: string;
  registrationNumber: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  variant?: string;
  manufacturingYear: number;
  fuelType: FuelType;
  ownershipType: OwnershipType;
  ownerReference?: string;
  capacity: number;
  capacityUnit: string;
  branchId?: string;
  status: VehicleStatus;
  insuranceReference?: string;
  fitnessReference?: string;
  permitReference?: string;
  createdAt: string;
  updatedAt: string;
}

export type DriverStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type LicenseClass = 'LMV' | 'HMV' | 'HGMV' | 'TRANS' | 'OTHER';

export interface FleetDriverRecord {
  id: string;
  tenantId: string;
  employeeId?: string;
  fullName: string;
  phone?: string;
  licenseNumber: string;
  licenseClass: LicenseClass;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  badgeCode?: string;
  branchId?: string;
  status: DriverStatus;
  assignedVehicleId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type VehicleDocumentType =
  | 'INSURANCE'
  | 'FITNESS'
  | 'PERMIT'
  | 'REGISTRATION'
  | 'POLLUTION'
  | 'TAX'
  | 'OTHER';

export type VehicleDocumentStatus = 'PENDING' | 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'ARCHIVED';

export interface FleetVehicleDocumentRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  documentType: VehicleDocumentType;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  status: VehicleDocumentStatus;
  storageKey?: string;
  fileName?: string;
  signedUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface FleetMaintenanceRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  maintenanceType: string;
  serviceDate: string;
  odometerReading?: number;
  workshopName?: string;
  description?: string;
  partsDetails?: string;
  cost: number;
  nextServiceDate?: string;
  nextServiceOdometer?: number;
  status: MaintenanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetFuelRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  fuelDate: string;
  fuelType: FuelType | 'OTHER';
  quantity: number;
  unit: string;
  rate: number;
  totalAmount: number;
  odometerReading?: number;
  stationName?: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type FleetOperationStatus = 'PLANNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface FleetOperationRecord {
  id: string;
  tenantId: string;
  operationNumber: string;
  vehicleId: string;
  driverId: string;
  gatePassId?: string;
  dispatchId?: string;
  destination?: string;
  plannedStartAt?: string;
  plannedEndAt?: string;
  actualStartAt?: string;
  actualEndAt?: string;
  odometerStart?: number;
  odometerEnd?: number;
  status: FleetOperationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
