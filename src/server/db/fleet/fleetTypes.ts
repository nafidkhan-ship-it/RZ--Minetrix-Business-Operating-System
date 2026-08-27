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
