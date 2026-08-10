export interface FleetGroupSpec {
  id: string;
  name: string;
  category: 'Tipper' | 'Trailer' | 'Tanker' | 'Pickup' | 'LowBed';
  totalVehicles: number;
  activeOnRoad: number;
  underMaintenance: number;
  averageMileageKmpl: number;
  operatingZones: string[];
}

export interface VehicleMasterRecord {
  id: string;
  registrationNo: string;
  vehicleType: 'Heavy Tipper (10-Wheeler)' | 'Multi-Axle Trailer (18-Wheeler)' | 'Low-Bed Heavy Machinery Carrier' | 'Diesel Water Tanker' | 'Commercial Pickup';
  makeModel: string;
  capacityTons: number;
  ownerType: 'Company Owned' | 'Attached Owner Fleet' | 'Sub-Contractor';
  ownerName: string;
  chassisNo: string;
  engineNo: string;
  fitnessExpiryDate: string;
  insuranceExpiryDate: string;
  permitType: 'National Goods Permit' | 'State Mining Transport Permit';
  fastagStatus: 'ACTIVE_RECHARGED' | 'LOW_BALANCE';
  gpsDeviceId: string;
  currentStatus: 'DISPATCHED_IN_TRIP' | 'LOADING_QUEUE' | 'AVAILABLE_IN_YARD' | 'WORKSHOP_SERVICE';
  assignedDriver: string;
}

export interface DriverRecord {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  licenseExpiry: string;
  badgeNo: string;
  experienceYears: number;
  assignedVehicleReg: string;
  walletBalanceRs: number;
  performanceScore: number; // e.g. 96/100
  dutyStatus: 'ON_TRIP' | 'READY_IN_YARD' | 'OFF_DUTY' | 'ON_LEAVE';
}

export interface TripLogRecord {
  tripId: string;
  originLocation: string;
  destinationLocation: string;
  cargoType: string;
  tonnageLoaded: number;
  assignedVehicleNo: string;
  driverName: string;
  freightAmountRs: number;
  fuelAdvanceLiters: number;
  customerOtp: string;
  podStatus: 'POD_VERIFIED_DIGITAL' | 'IN_TRANSIT' | 'PENDING_OTP';
  tripStatus: 'DISPATCHED' | 'DELIVERED' | 'IN_QUEUE';
  estimatedEta: string;
}

export interface FleetRentalContract {
  contractId: string;
  clientName: string;
  rentalType: 'Dedicated Monthly Mining Fleet' | 'Per Trip Aggregate Transport' | 'Daily Equipment Low-Bed Shift';
  vehiclesAssignedCount: number;
  monthlyRentalRateRs: number;
  agreementStartDate: string;
  agreementEndDate: string;
  paymentTerms: string;
  status: 'ACTIVE_LEASE' | 'PENDING_RENEWAL';
}

export interface MaintenanceLog {
  jobCardId: string;
  vehicleNo: string;
  maintenanceType: string;
  workshopName: 'Central Mining Fleet Workshop #1';
  costRs: number;
  odometerReadingKm: number;
  servicedDate: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
}

export interface UsedVehicleListing {
  id: string;
  title: string;
  category: string;
  manufactureYear: number;
  odometerKm: number;
  askingPriceRs: number;
  inspectionScore: number;
  location: string;
}

export interface FreightLoadMarketplaceItem {
  id: string;
  consignorName: string;
  routeFromTo: string;
  materialType: string;
  weightTons: number;
  offeredFreightPerTonRs: number;
  requiredVehicleType: string;
  bidsReceivedCount: number;
}

export const FLEET_GROUPS: FleetGroupSpec[] = [
  {
    id: 'GRP-TIPPER-10W',
    name: '10-Wheeler Heavy Mining Tipper Division',
    category: 'Tipper',
    totalVehicles: 28,
    activeOnRoad: 24,
    underMaintenance: 4,
    averageMileageKmpl: 2.85,
    operatingZones: ['Bantwal Quarry Zone', 'Crusher Yard #1', 'Mangalore Highway Corridor']
  },
  {
    id: 'GRP-TRAILER-18W',
    name: 'Multi-Axle Bulk Aggregate Trailer Division',
    category: 'Trailer',
    totalVehicles: 16,
    activeOnRoad: 15,
    underMaintenance: 1,
    averageMileageKmpl: 2.40,
    operatingZones: ['Inter-State Freight Highway', 'Port Trust Logistics Terminal']
  },
  {
    id: 'GRP-LOWBED-HD',
    name: 'Low-Bed Heavy Machinery Transport Division',
    category: 'LowBed',
    totalVehicles: 6,
    activeOnRoad: 5,
    underMaintenance: 1,
    averageMileageKmpl: 1.90,
    operatingZones: ['Heavy Excavator Rental Transit', 'Quarry Relocation Routes']
  }
];

export const VEHICLE_MASTER_LIST: VehicleMasterRecord[] = [
  {
    id: 'VEH-101',
    registrationNo: 'KA-19-AB-4491',
    vehicleType: 'Heavy Tipper (10-Wheeler)',
    makeModel: 'BharatBenz 2823R Mining Tipper',
    capacityTons: 25.0,
    ownerType: 'Company Owned',
    ownerName: 'RZ Minetrix Mining Logistics Pvt Ltd',
    chassisNo: 'MB1BB2823RK104921',
    engineNo: 'ENG-BB-992014',
    fitnessExpiryDate: '2027-04-30',
    insuranceExpiryDate: '2026-11-15',
    permitType: 'State Mining Transport Permit',
    fastagStatus: 'ACTIVE_RECHARGED',
    gpsDeviceId: 'GPS-AIS-9921',
    currentStatus: 'DISPATCHED_IN_TRIP',
    assignedDriver: 'Suresh Kumar'
  },
  {
    id: 'VEH-102',
    registrationNo: 'KA-20-C-9912',
    vehicleType: 'Heavy Tipper (10-Wheeler)',
    makeModel: 'Tata Prima 2830.K Heavy Duty',
    capacityTons: 28.0,
    ownerType: 'Attached Owner Fleet',
    ownerName: 'Coastal Freight Logistics (Partner)',
    chassisNo: 'MAT2830K9211029',
    engineNo: 'ENG-TATA-88120',
    fitnessExpiryDate: '2026-12-31',
    insuranceExpiryDate: '2026-09-20',
    permitType: 'National Goods Permit',
    fastagStatus: 'ACTIVE_RECHARGED',
    gpsDeviceId: 'GPS-AIS-8812',
    currentStatus: 'LOADING_QUEUE',
    assignedDriver: 'Ramesh Naik'
  },
  {
    id: 'VEH-103',
    registrationNo: 'KA-19-MC-8812',
    vehicleType: 'Multi-Axle Trailer (18-Wheeler)',
    makeModel: 'Ashok Leyland 5525 6x4 Trailer',
    capacityTons: 42.0,
    ownerType: 'Company Owned',
    ownerName: 'RZ Minetrix Mining Logistics Pvt Ltd',
    chassisNo: 'AL5525TR991204',
    engineNo: 'ENG-AL-77401',
    fitnessExpiryDate: '2027-08-15',
    insuranceExpiryDate: '2027-01-10',
    permitType: 'National Goods Permit',
    fastagStatus: 'ACTIVE_RECHARGED',
    gpsDeviceId: 'GPS-AIS-7711',
    currentStatus: 'AVAILABLE_IN_YARD',
    assignedDriver: 'Vikram Singh'
  }
];

export const DRIVER_DIRECTORY: DriverRecord[] = [
  { id: 'DRV-201', name: 'Suresh Kumar', phone: '+91 98450 11223', licenseNo: 'KA19-2018004921', licenseExpiry: '2032-05-20', badgeNo: 'BDG-MIN-401', experienceYears: 12, assignedVehicleReg: 'KA-19-AB-4491', walletBalanceRs: 4850, performanceScore: 97, dutyStatus: 'ON_TRIP' },
  { id: 'DRV-202', name: 'Ramesh Naik', phone: '+91 94481 22334', licenseNo: 'KA20-2015001192', licenseExpiry: '2030-08-14', badgeNo: 'BDG-MIN-388', experienceYears: 9, assignedVehicleReg: 'KA-20-C-9912', walletBalanceRs: 2100, performanceScore: 94, dutyStatus: 'READY_IN_YARD' },
  { id: 'DRV-203', name: 'Vikram Singh', phone: '+91 97312 88440', licenseNo: 'KA19-2012008812', licenseExpiry: '2029-11-01', badgeNo: 'BDG-MIN-512', experienceYears: 15, assignedVehicleReg: 'KA-19-MC-8812', walletBalanceRs: 6200, performanceScore: 99, dutyStatus: 'READY_IN_YARD' }
];

export const MOCK_TRIP_LOGS: TripLogRecord[] = [
  { tripId: 'TRP-2026-9001', originLocation: 'Crusher Yard #1, Bantwal', destinationLocation: 'Shri Balaji Villa Site, Mangalore', cargoType: 'Washed M-Sand Concrete Grade', tonnageLoaded: 32.5, assignedVehicleNo: 'KA-19-AB-4491', driverName: 'Suresh Kumar', freightAmountRs: 8500, fuelAdvanceLiters: 45, customerOtp: '8492', podStatus: 'POD_VERIFIED_DIGITAL', tripStatus: 'DELIVERED', estimatedEta: 'Delivered at 10:45 AM' },
  { tripId: 'TRP-2026-9002', originLocation: 'Bantwal Quarry Bench #2', destinationLocation: 'Highway Bypass Km 42 Depot', cargoType: 'Laterite Stone Grade A (30x20x15)', tonnageLoaded: 28.0, assignedVehicleNo: 'KA-20-C-9912', driverName: 'Ramesh Naik', freightAmountRs: 7200, fuelAdvanceLiters: 35, customerOtp: '3319', podStatus: 'IN_TRANSIT', tripStatus: 'DISPATCHED', estimatedEta: 'Arriving in 25 Mins' }
];

export const RENTAL_CONTRACTS: FleetRentalContract[] = [
  { contractId: 'RNT-2026-01', clientName: 'L&T Construction Highway Division', rentalType: 'Dedicated Monthly Mining Fleet', vehiclesAssignedCount: 8, monthlyRentalRateRs: 1250000, agreementStartDate: '2026-01-01', agreementEndDate: '2026-12-31', paymentTerms: 'Monthly Net 15 Days', status: 'ACTIVE_LEASE' },
  { contractId: 'RNT-2026-02', clientName: 'Southern Railways Ballast Supply', rentalType: 'Per Trip Aggregate Transport', vehiclesAssignedCount: 5, monthlyRentalRateRs: 680000, agreementStartDate: '2026-04-01', agreementEndDate: '2027-03-31', paymentTerms: 'Fortnightly Billing', status: 'ACTIVE_LEASE' }
];

export const MAINTENANCE_LOGS: MaintenanceLog[] = [
  { jobCardId: 'JC-2026-401', vehicleNo: 'KA-19-AB-4491', maintenanceType: 'Preventive Periodic Service', workshopName: 'Central Mining Fleet Workshop #1', costRs: 14500, odometerReadingKm: 84200, servicedDate: '2026-08-01', status: 'COMPLETED' },
  { jobCardId: 'JC-2026-402', vehicleNo: 'KA-20-C-9912', maintenanceType: 'Tyre Replacement (4 Rear Drive Tyres)', workshopName: 'Central Mining Fleet Workshop #1', costRs: 48000, odometerReadingKm: 112500, servicedDate: '2026-08-04', status: 'COMPLETED' }
];

export const USED_VEHICLE_MARKETPLACE: UsedVehicleListing[] = [
  { id: 'MKT-VEH-01', title: '2023 BharatBenz 2823R 10-Wheeler Mining Tipper', category: 'Heavy Tipper', manufactureYear: 2023, odometerKm: 42000, askingPriceRs: 3450000, inspectionScore: 95, location: 'Mangalore Yard' },
  { id: 'MKT-VEH-02', title: '2022 Tata Prima 3130.K Multi-Axle Rock Tipper', category: 'Heavy Tipper', manufactureYear: 2022, odometerKm: 68000, askingPriceRs: 2980000, inspectionScore: 91, location: 'Udupi Yard' }
];

export const FREIGHT_MARKETPLACE_LOADS: FreightLoadMarketplaceItem[] = [
  { id: 'LOAD-8801', consignorName: 'Mangalore Cement Works', routeFromTo: 'Panambur Port -> Bantwal Yard', materialType: 'Raw Clinker Bags', weightTons: 120, offeredFreightPerTonRs: 420, requiredVehicleType: '10-Wheeler Heavy Tipper', bidsReceivedCount: 6 },
  { id: 'LOAD-8802', consignorName: 'Karnataka Road Dev Corp', routeFromTo: 'Karkala Quarry -> NH 66 Site', materialType: '40mm Sub-Base Aggregate', weightTons: 450, offeredFreightPerTonRs: 380, requiredVehicleType: 'Multi-Axle Trailer', bidsReceivedCount: 12 }
];
