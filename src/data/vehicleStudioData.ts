// =============================================================
// RZ® MINETRIX — PLATFORM 3: VEHICLE MANAGEMENT STUDIO DATA
// Commercial Fleet, Heavy Mining Tippers, Multi-Owner Capital & Trip Accounts
// Note: STUDIO PREVIEW / DEMO DATA (Not live production database)
// =============================================================

export type VehicleType =
  | 'Tipper'
  | 'Truck'
  | 'Lorry'
  | 'Pickup'
  | 'Trailer'
  | 'Tanker'
  | 'Car'
  | 'Van'
  | 'Other';

export type VehicleStatus =
  | 'Available'
  | 'On Trip'
  | 'Loading'
  | 'Delivery'
  | 'Maintenance'
  | 'Inactive';

export type TripStatus =
  | 'Planned'
  | 'Assigned'
  | 'Loading'
  | 'Started'
  | 'In Transit'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export type DeliveryStatus =
  | 'Order Received'
  | 'Vehicle Assigned'
  | 'Loading'
  | 'Weighed'
  | 'Dispatched'
  | 'In Transit'
  | 'Arrived at Site'
  | 'Arrived'
  | 'Unloading'
  | 'Delivered'
  | 'Customer Confirmed'
  | 'Completed';

export type BattaType =
  | 'Daily Batta'
  | 'Trip Batta'
  | 'Food'
  | 'Night Halt'
  | 'Outstation'
  | 'Other Allowance';

export type MaintenanceCategory =
  | 'Service'
  | 'Engine'
  | 'Brake'
  | 'Electrical'
  | 'Suspension'
  | 'Tyre'
  | 'Body'
  | 'Oil'
  | 'Other';

export type TyrePosition =
  | 'Front-Left'
  | 'Front-Right'
  | 'Rear-Left-Outer'
  | 'Rear-Left-Inner'
  | 'Rear-Right-Outer'
  | 'Rear-Right-Inner'
  | 'Spare 1'
  | 'Spare 2';

export type ComplianceStatus = 'Active' | 'Expiring Soon' | 'Expired';

export type RzPersonRole =
  | 'Quarry Partner'
  | 'Crusher Partner'
  | 'Vehicle Owner'
  | 'Land Owner'
  | 'Investor'
  | 'Customer'
  | 'Supplier'
  | 'Staff'
  | 'Driver';

// -------------------------------------------------------------
// CORE INTERFACES
// -------------------------------------------------------------

export interface VehicleOwnershipConfig {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  ownerId: string;
  ownerName: string;
  ownershipPercent: number; // e.g. 60%
  investmentAmount: number; // e.g. ₹24,00,000
  capitalAmount: number;    // e.g. ₹24,00,000
  revenuePercent: number;   // Independent from ownership, e.g. 60%
  expensePercent: number;   // Independent, e.g. 60%
  profitPercent: number;    // Independent, e.g. 65%
  lossPercent: number;      // Independent, e.g. 60%
  effectiveDate: string;
  agreementNumber: string;
  agreementStatus: 'ACTIVE' | 'DRAFT' | 'SUPERSEDED';
  formulaNotes?: string;
}

export interface VehicleComplianceItem {
  type: 'Insurance' | 'Tax' | 'Permit' | 'Fitness' | 'Pollution';
  identifier: string; // Policy or cert #
  providerOrAuthority: string;
  issueDate?: string;
  startDate?: string;
  expiryDate: string;
  amountOrPremium?: number;
  status: ComplianceStatus;
  documentRef?: string;
}

export interface VehicleFinanceDetail {
  hasFinance: boolean;
  financeProvider: string;
  loanAccountNumber: string;
  loanAmount: number;
  downPayment: number;
  interestRate: number; // % p.a.
  tenureMonths: number;
  emiAmount: number;
  startDate: string;
  endDate: string;
  totalPaid: number;
  outstandingAmount: number;
  nextDueDate: string;
  status: 'ACTIVE' | 'OVERDUE' | 'CLOSED';
}

export interface Vehicle {
  id: string;
  vehicleNumber: string; // e.g. "KL-14-V-4088"
  vehicleCode: string;   // e.g. "V001"
  vehicleType: VehicleType;
  registrationDate: string;
  make: string;          // e.g. "BharatBenz"
  model: string;         // e.g. "2828C"
  variant: string;       // e.g. "Mining Tipper 16 Cu.M"
  manufacturingYear: number;
  colour: string;
  fuelType: 'Diesel' | 'Petrol' | 'CNG' | 'Electric';
  capacity: number;      // e.g. 16 or 28
  capacityUnit: string;  // e.g. "Cu.M", "Tons"
  chassisNumber: string;
  engineNumber: string;
  status: VehicleStatus;
  currentDriverId?: string;
  currentDriverName?: string;
  currentLocation: string;
  currentTripId?: string;
  odometerKm: number;
  fuelLevelPercent: number;
  avgMileageKmpL: number;
  branch: string;
  // Ownership Structure
  owners: VehicleOwnershipConfig[];
  // Compliance
  compliance: {
    insurance: VehicleComplianceItem;
    tax: VehicleComplianceItem;
    permit: VehicleComplianceItem;
    fitness: VehicleComplianceItem;
    pollution: VehicleComplianceItem;
  };
  // Finance / EMI
  finance: VehicleFinanceDetail;
  // Operational aggregates
  todayTripsCount: number;
  monthTripsCount: number;
  monthRevenue: number;
  monthExpense: number;
  monthNetContribution: number;
}

export interface VehicleOwner {
  id: string;
  ownerCode: string; // e.g. "OWN-B"
  personName: string; // e.g. "Owner B (Basheer Haji)"
  alias: string;     // e.g. "Owner B"
  phone: string;
  email: string;
  panNumber: string;
  aadharNumber: string;
  address: string;
  bankDetails: string;
  rzRoles: RzPersonRole[];
  vehiclesOwned: {
    vehicleId: string;
    vehicleNumber: string;
    vehicleCode: string;
    vehicleType: VehicleType;
    ownershipPercent: number;
    investmentAmount: number;
    revenuePercent: number;
    expensePercent: number;
    profitPercent: number;
    lossPercent: number;
  }[];
  totalInvestment: number;
  totalReceivable: number;
  totalPayable: number;
  totalSettledAmount: number;
  currentBalance: number; // positive = company owes owner, negative = owner owes company
  effectiveDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Driver {
  id: string;
  driverId: string; // e.g. "DRV-101"
  name: string;
  phone: string;
  emergencyContact: string;
  licenseNumber: string;
  licenseType: 'Heavy Commercial HGV / HPMV' | 'Medium Goods' | 'Light Motor' | 'Hazardous Goods';
  licenseExpiry: string;
  joiningDate: string;
  salaryType: 'Monthly Fixed' | 'Per Trip Commission' | 'Daily Wage + Batta';
  battaType: 'Trip Batta + Daily Food' | 'Distance Slab Batta' | 'Fixed Daily Allowance';
  baseSalary: number;
  assignedVehicleId?: string;
  assignedVehicleNumber?: string;
  status: 'Available' | 'On Trip' | 'Leave' | 'Inactive';
  totalTripsCompleted: number;
  safetyRating: number; // e.g. 4.8 / 5
  documentsCount: number;
}

export interface Trip {
  id: string;
  tripNumber: string; // e.g. "TRIP-2026-0881"
  date: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  customerId: string;
  customerName: string;
  pickupLocation: string; // e.g. "Kasaragod Quarry Pit Alpha"
  destinationLocation: string; // e.g. "NH66 Highway Project Package 3"
  material: string; // e.g. "40mm Blue Metal Aggregate"
  quantity: number; // e.g. 24
  unit: string; // "Tons", "Cu.M"
  rate: number; // Rate per ton / unit, e.g. 650
  tripIncome: number; // e.g. 15600
  advanceReceived: number;
  balanceAmount: number;
  startTime: string;
  endTime?: string;
  status: TripStatus;
  gatePassRef?: string;
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  fuelCost: number;
  tollCost: number;
  driverBatta: number;
  loadingUnloadingCost: number;
  otherExpense: number;
  tripContribution: number;
  ottTaskId?: string;
}

export interface VehicleLoad {
  id: string;
  loadNumber: string; // e.g. "LOAD-9042"
  tripId: string;
  tripNumber: string;
  date: string;
  time: string;
  vehicleNumber: string;
  driverName: string;
  sourceType: 'Quarry' | 'Crusher' | 'Building Materials' | 'External Pit';
  sourceName: string; // e.g. "RZ Kasaragod Granite Pit"
  workingArea: string; // e.g. "Bench 03 North-East"
  material: string;
  quantity: number;
  unit: string;
  customerName: string;
  destination: string;
  gatePassNumber: string;
  deliveryStatus: 'Pending' | 'Loading' | 'Dispatched' | 'Delivered';
  tareWeightMT: number;
  grossWeightMT: number;
  netWeightMT: number;
}

export interface Delivery {
  id: string;
  deliveryNumber: string; // e.g. "DEL-5021"
  tripNumber: string;
  customerName: string;
  vehicleNumber: string;
  driverName: string;
  material: string;
  quantity: number;
  unit: string;
  pickupLocation: string;
  destinationLocation: string;
  dispatchTime: string;
  expectedDeliveryTime: string;
  actualDeliveryTime?: string;
  status: DeliveryStatus;
  ewayBillNumber: string;
  customerConfirmedBy?: string;
  signatureStatus: 'PENDING' | 'SIGNED';
  notes?: string;
}

export interface TripAccountItem {
  id: string;
  tripNumber: string;
  customerName: string;
  vehicleNumber: string;
  driverName: string;
  route: string;
  material: string;
  quantity: number;
  unit: string;
  rate: number;
  tripIncome: number;
  advance: number;
  balance: number;
  fuelCost: number;
  tollCost: number;
  driverBatta: number;
  loadingUnloading: number;
  otherExpenses: number;
  tripContribution: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
}

export interface DriverBattaRecord {
  id: string;
  voucherNumber: string;
  driverId: string;
  driverName: string;
  tripId?: string;
  tripNumber?: string;
  vehicleNumber: string;
  date: string;
  battaType: BattaType;
  rate: number;
  daysOrTrips: number;
  amount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  paymentMode: 'Cash' | 'UPI' | 'Direct Bank Transfer';
  referenceNumber: string;
  approvedBy: string;
}

export interface FuelRecord {
  id: string;
  slipNumber: string; // e.g. "FUEL-7801"
  date: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  fuelType: 'HSD Diesel' | 'Petrol' | 'CNG';
  quantityLiters: number;
  ratePerLiter: number;
  totalAmount: number;
  odometerKm: number;
  previousOdometerKm: number;
  kmRun: number;
  mileageKmpL: number;
  fuelStation: string;
  paymentMethod: 'Corporate Fuel Card' | 'Fastag Petro' | 'Cash' | 'UPI' | 'Credit Account';
  referenceNumber: string;
}

export interface TollRecord {
  id: string;
  tollId: string;
  date: string;
  time: string;
  vehicleNumber: string;
  tripNumber: string;
  route: string;
  tollPlaza: string;
  amount: number;
  paymentMethod: 'Fastag Auto-Debit' | 'Cash' | 'UPI';
  fastagTagId: string;
  referenceNumber: string;
}

export interface MaintenanceRecord {
  id: string;
  serviceNumber: string;
  vehicleNumber: string;
  date: string;
  odometerKm: number;
  category: MaintenanceCategory;
  description: string;
  serviceProvider: string;
  cost: number;
  nextServiceDate: string;
  nextServiceOdometerKm: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  partsReplaced: string[];
  invoiceDocRef?: string;
  technicianName: string;
}

export interface TyreRecord {
  id: string;
  tyreNumber: string; // e.g. "MRF-M77-0981"
  vehicleNumber: string;
  brand: string;      // e.g. "MRF", "Apollo", "JK Tyre", "Bridgestone"
  size: string;       // e.g. "10.00R20 16PR Mining Lug"
  purchaseDate: string;
  purchaseCost: number;
  position: TyrePosition;
  currentOdometerKm: number;
  installedOdometerKm: number;
  kmRun: number;
  rotationHistory: string;
  repairsHistory: string;
  replacementDueKm: number;
  status: 'Active' | 'Rotated' | 'Retreaded' | 'Replaced' | 'Scrapped';
}

export interface OwnerSettlementRecord {
  id: string;
  settlementNumber: string; // e.g. "SETTL-OWN-2026-08"
  settlementDate: string;
  period: string; // e.g. "August 2026 Monthly Settlement"
  vehicleNumber: string;
  vehicleCode: string;
  ownerId: string;
  ownerName: string;
  ownershipPercent: number; // e.g. 60%
  revenuePercent: number;   // e.g. 60%
  expensePercent: number;   // e.g. 60%
  profitPercent: number;    // e.g. 65%
  tripRevenue: number;
  eligibleRevenue: number;
  sharedExpenses: number;
  netDistributableAmount: number;
  ownerShare: number;
  previousBalance: number;
  paidAmount: number;
  currentBalance: number;
  paymentMethod: 'RTGS / NEFT' | 'Cheque' | 'Account Adjustment';
  referenceNumber: string;
  status: 'Draft' | 'Approved' | 'Disbursed';
  ottReminderRef?: string;
}

export interface VehicleDocument {
  id: string;
  docNumber: string;
  vehicleNumber: string;
  category:
    | 'Registration'
    | 'Insurance'
    | 'Tax'
    | 'Permit'
    | 'Fitness'
    | 'Pollution'
    | 'Finance'
    | 'Driver Documents'
    | 'Maintenance'
    | 'Ownership Agreement'
    | 'Settlement Documents';
  title: string;
  fileName: string;
  fileFormat: 'PDF' | 'JPG' | 'PNG';
  fileSize: string;
  issueDate: string;
  expiryDate?: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  uploadedBy: string;
  verified: boolean;
}

// -------------------------------------------------------------
// SAMPLE / DEMO DATA (STUDIO PREVIEW)
// -------------------------------------------------------------

export const SAMPLE_VEHICLE_OWNERS: VehicleOwner[] = [
  {
    id: 'OWN-B',
    ownerCode: 'OWN-B',
    personName: 'Basheer Haji (Owner B)',
    alias: 'Owner B',
    phone: '+91 98470 11200',
    email: 'basheer.haji@rzminetrix.demo',
    panNumber: 'AACPH8821K',
    aadharNumber: 'XXXX-XXXX-9912',
    address: 'Hill View Estate, Vidyanagar, Kasaragod, Kerala',
    bankDetails: 'HDFC Bank, Kasaragod &bull; A/C 502000412891 &bull; IFSC HDFC000182',
    rzRoles: ['Quarry Partner', 'Vehicle Owner', 'Investor'],
    vehiclesOwned: [
      {
        vehicleId: 'V-01',
        vehicleNumber: 'KL-14-V-4088',
        vehicleCode: 'V001',
        vehicleType: 'Tipper',
        ownershipPercent: 100,
        investmentAmount: 3800000,
        revenuePercent: 100,
        expensePercent: 100,
        profitPercent: 100,
        lossPercent: 100
      },
      {
        vehicleId: 'V-02',
        vehicleNumber: 'KL-14-W-8812',
        vehicleCode: 'V002',
        vehicleType: 'Tipper',
        ownershipPercent: 60,
        investmentAmount: 2400000,
        revenuePercent: 60,
        expensePercent: 60,
        profitPercent: 65,
        lossPercent: 60
      },
      {
        vehicleId: 'V-03',
        vehicleNumber: 'KL-60-E-3310',
        vehicleCode: 'V003',
        vehicleType: 'Tipper',
        ownershipPercent: 35,
        investmentAmount: 1400000,
        revenuePercent: 35,
        expensePercent: 35,
        profitPercent: 35,
        lossPercent: 35
      },
      {
        vehicleId: 'V-04',
        vehicleNumber: 'KA-19-MG-9020',
        vehicleCode: 'V004',
        vehicleType: 'Trailer',
        ownershipPercent: 40,
        investmentAmount: 2200000,
        revenuePercent: 40,
        expensePercent: 40,
        profitPercent: 40,
        lossPercent: 40
      }
    ],
    totalInvestment: 9800000,
    totalReceivable: 412500,
    totalPayable: 0,
    totalSettledAmount: 3280000,
    currentBalance: 412500,
    effectiveDate: '2022-01-15',
    status: 'ACTIVE'
  },
  {
    id: 'OWN-E',
    ownerCode: 'OWN-E',
    personName: 'Ershad Mohammed (Owner E)',
    alias: 'Owner E',
    phone: '+91 94471 22890',
    email: 'ershad.m@rzminetrix.demo',
    panNumber: 'BMEPM4491J',
    aadharNumber: 'XXXX-XXXX-3341',
    address: 'Ullal Marine Road, Mangalore, Karnataka',
    bankDetails: 'Canara Bank, Ullal &bull; A/C 1190201004812 &bull; IFSC CNRB0001190',
    rzRoles: ['Vehicle Owner', 'Crusher Partner', 'Supplier'],
    vehiclesOwned: [
      {
        vehicleId: 'V-02',
        vehicleNumber: 'KL-14-W-8812',
        vehicleCode: 'V002',
        vehicleType: 'Tipper',
        ownershipPercent: 40,
        investmentAmount: 1600000,
        revenuePercent: 40,
        expensePercent: 40,
        profitPercent: 35,
        lossPercent: 40
      },
      {
        vehicleId: 'V-03',
        vehicleNumber: 'KL-60-E-3310',
        vehicleCode: 'V003',
        vehicleType: 'Tipper',
        ownershipPercent: 25,
        investmentAmount: 1000000,
        revenuePercent: 25,
        expensePercent: 25,
        profitPercent: 25,
        lossPercent: 25
      }
    ],
    totalInvestment: 2600000,
    totalReceivable: 184200,
    totalPayable: 0,
    totalSettledAmount: 890000,
    currentBalance: 184200,
    effectiveDate: '2023-04-10',
    status: 'ACTIVE'
  },
  {
    id: 'OWN-A',
    ownerCode: 'OWN-A',
    personName: 'Anil Kumar Shetty (Owner A)',
    alias: 'Owner A',
    phone: '+91 98450 77110',
    email: 'anil.shetty@rzminetrix.demo',
    panNumber: 'AAQPS9920F',
    aadharNumber: 'XXXX-XXXX-4512',
    address: 'Kadri Hills, Mangalore, Karnataka',
    bankDetails: 'State Bank of India, Kadri &bull; A/C 38819201948 &bull; IFSC SBIN0004018',
    rzRoles: ['Quarry Partner', 'Crusher Partner', 'Vehicle Owner'],
    vehiclesOwned: [
      {
        vehicleId: 'V-03',
        vehicleNumber: 'KL-60-E-3310',
        vehicleCode: 'V003',
        vehicleType: 'Tipper',
        ownershipPercent: 40,
        investmentAmount: 1600000,
        revenuePercent: 40,
        expensePercent: 40,
        profitPercent: 40,
        lossPercent: 40
      }
    ],
    totalInvestment: 1600000,
    totalReceivable: 142000,
    totalPayable: 0,
    totalSettledAmount: 510000,
    currentBalance: 142000,
    effectiveDate: '2023-08-01',
    status: 'ACTIVE'
  },
  {
    id: 'OWN-C',
    ownerCode: 'OWN-C',
    personName: 'Cyril D’Souza (Owner C)',
    alias: 'Owner C',
    phone: '+91 98452 33490',
    email: 'cyril.dsouza@rzminetrix.demo',
    panNumber: 'ABSPD5512L',
    aadharNumber: 'XXXX-XXXX-7721',
    address: 'Kankanady Bypass, Mangalore, Karnataka',
    bankDetails: 'Axis Bank, Mangalore &bull; A/C 9140200881290 &bull; IFSC UTIB0000142',
    rzRoles: ['Vehicle Owner'],
    vehiclesOwned: [
      {
        vehicleId: 'V-05',
        vehicleNumber: 'KL-14-Z-1199',
        vehicleCode: 'V005',
        vehicleType: 'Tipper',
        ownershipPercent: 100,
        investmentAmount: 4200000,
        revenuePercent: 100,
        expensePercent: 100,
        profitPercent: 100,
        lossPercent: 100
      }
    ],
    totalInvestment: 4200000,
    totalReceivable: 295000,
    totalPayable: 0,
    totalSettledAmount: 1450000,
    currentBalance: 295000,
    effectiveDate: '2024-01-10',
    status: 'ACTIVE'
  }
];

export const SAMPLE_DRIVERS: Driver[] = [
  {
    id: 'DRV-01',
    driverId: 'DRV-101',
    name: 'Manoj Kumar P.',
    phone: '+91 97441 55012',
    emergencyContact: '+91 97441 55015 (Wife)',
    licenseNumber: 'KL-14-20120004921',
    licenseType: 'Heavy Commercial HGV / HPMV',
    licenseExpiry: '2028-11-14',
    joiningDate: '2021-03-01',
    salaryType: 'Daily Wage + Batta',
    battaType: 'Trip Batta + Daily Food',
    baseSalary: 18000,
    assignedVehicleId: 'V-01',
    assignedVehicleNumber: 'KL-14-V-4088',
    status: 'On Trip',
    totalTripsCompleted: 428,
    safetyRating: 4.9,
    documentsCount: 4
  },
  {
    id: 'DRV-02',
    driverId: 'DRV-102',
    name: 'Suresh Babu',
    phone: '+91 98453 11849',
    emergencyContact: '+91 98453 11850 (Brother)',
    licenseNumber: 'KA-19-20150008819',
    licenseType: 'Heavy Commercial HGV / HPMV',
    licenseExpiry: '2027-05-30',
    joiningDate: '2022-06-15',
    salaryType: 'Per Trip Commission',
    battaType: 'Trip Batta + Daily Food',
    baseSalary: 15000,
    assignedVehicleId: 'V-02',
    assignedVehicleNumber: 'KL-14-W-8812',
    status: 'On Trip',
    totalTripsCompleted: 312,
    safetyRating: 4.7,
    documentsCount: 3
  },
  {
    id: 'DRV-03',
    driverId: 'DRV-103',
    name: 'Rajesh V. Nair',
    phone: '+91 94470 66201',
    emergencyContact: '+91 94470 66205 (Father)',
    licenseNumber: 'KL-60-20160002104',
    licenseType: 'Heavy Commercial HGV / HPMV',
    licenseExpiry: '2026-10-25',
    joiningDate: '2023-01-10',
    salaryType: 'Daily Wage + Batta',
    battaType: 'Distance Slab Batta',
    baseSalary: 19000,
    assignedVehicleId: 'V-03',
    assignedVehicleNumber: 'KL-60-E-3310',
    status: 'Available',
    totalTripsCompleted: 245,
    safetyRating: 4.8,
    documentsCount: 4
  },
  {
    id: 'DRV-04',
    driverId: 'DRV-104',
    name: 'Hameed K. K.',
    phone: '+91 98472 88192',
    emergencyContact: '+91 98472 88190 (Son)',
    licenseNumber: 'KA-20-20100007812',
    licenseType: 'Heavy Commercial HGV / HPMV',
    licenseExpiry: '2029-01-20',
    joiningDate: '2020-08-01',
    salaryType: 'Monthly Fixed',
    battaType: 'Fixed Daily Allowance',
    baseSalary: 24000,
    assignedVehicleId: 'V-04',
    assignedVehicleNumber: 'KA-19-MG-9020',
    status: 'On Trip',
    totalTripsCompleted: 580,
    safetyRating: 4.95,
    documentsCount: 5
  },
  {
    id: 'DRV-05',
    driverId: 'DRV-105',
    name: 'Praveen G.',
    phone: '+91 99014 55820',
    emergencyContact: '+91 99014 55825 (Uncle)',
    licenseNumber: 'KA-19-20180003490',
    licenseType: 'Heavy Commercial HGV / HPMV',
    licenseExpiry: '2027-12-10',
    joiningDate: '2023-07-01',
    salaryType: 'Daily Wage + Batta',
    battaType: 'Trip Batta + Daily Food',
    baseSalary: 17500,
    assignedVehicleId: 'V-05',
    assignedVehicleNumber: 'KL-14-Z-1199',
    status: 'Available',
    totalTripsCompleted: 189,
    safetyRating: 4.6,
    documentsCount: 3
  },
  {
    id: 'DRV-06',
    driverId: 'DRV-106',
    name: 'Deepak Mohan',
    phone: '+91 94002 99120',
    emergencyContact: '+91 94002 99121 (Wife)',
    licenseNumber: 'KL-13-20190001290',
    licenseType: 'Medium Goods',
    licenseExpiry: '2028-04-18',
    joiningDate: '2024-02-15',
    salaryType: 'Daily Wage + Batta',
    battaType: 'Trip Batta + Daily Food',
    baseSalary: 16000,
    status: 'Leave',
    totalTripsCompleted: 98,
    safetyRating: 4.5,
    documentsCount: 3
  }
];

export const SAMPLE_VEHICLES: Vehicle[] = [
  {
    id: 'V-01',
    vehicleNumber: 'KL-14-V-4088',
    vehicleCode: 'V001',
    vehicleType: 'Tipper',
    registrationDate: '2022-02-10',
    make: 'BharatBenz',
    model: '2828C',
    variant: 'Heavy Mining Tipper 16 Cu.M',
    manufacturingYear: 2022,
    colour: 'Deep Golden Yellow',
    fuelType: 'Diesel',
    capacity: 16,
    capacityUnit: 'Cu.M (28 MT)',
    chassisNumber: 'ME458A282N0088192',
    engineNumber: 'OM906LA10882190',
    status: 'On Trip',
    currentDriverId: 'DRV-01',
    currentDriverName: 'Manoj Kumar P.',
    currentLocation: 'NH66 Expressway Km 42 (In Transit)',
    currentTripId: 'TRIP-881',
    odometerKm: 78420,
    fuelLevelPercent: 68,
    avgMileageKmpL: 3.4,
    branch: 'Kasaragod North Operations',
    owners: [
      {
        id: 'OWN-CFG-01',
        vehicleId: 'V-01',
        vehicleNumber: 'KL-14-V-4088',
        ownerId: 'OWN-B',
        ownerName: 'Owner B (Basheer Haji)',
        ownershipPercent: 100,
        investmentAmount: 3800000,
        capitalAmount: 3800000,
        revenuePercent: 100,
        expensePercent: 100,
        profitPercent: 100,
        lossPercent: 100,
        effectiveDate: '2022-02-10',
        agreementNumber: 'RZ-V-AGR-001',
        agreementStatus: 'ACTIVE',
        formulaNotes: 'Sole Ownership — 100% Net Profit / Loss to Owner B'
      }
    ],
    compliance: {
      insurance: {
        type: 'Insurance',
        identifier: 'ICICI-LOMB-77821904',
        providerOrAuthority: 'ICICI Lombard Commercial Vehicle Package',
        startDate: '2026-02-05',
        expiryDate: '2027-02-04',
        amountOrPremium: 68500,
        status: 'Active',
        documentRef: 'DOC-INS-V001.pdf'
      },
      tax: {
        type: 'Tax',
        identifier: 'KL-MVT-2026-Q3-0091',
        providerOrAuthority: 'Kerala Motor Vehicles Dept',
        startDate: '2026-07-01',
        expiryDate: '2026-09-30',
        amountOrPremium: 14200,
        status: 'Active'
      },
      permit: {
        type: 'Permit',
        identifier: 'KL-STA-AITP-4401',
        providerOrAuthority: 'All India Goods Carriage Permit',
        issueDate: '2022-03-01',
        expiryDate: '2027-02-28',
        status: 'Active',
        documentRef: 'DOC-PERMIT-V001.pdf'
      },
      fitness: {
        type: 'Fitness',
        identifier: 'FC-KL14-2025-8812',
        providerOrAuthority: 'RTO Kasaragod Test Center',
        issueDate: '2025-02-15',
        expiryDate: '2027-02-14',
        status: 'Active',
        documentRef: 'DOC-FC-V001.pdf'
      },
      pollution: {
        type: 'Pollution',
        identifier: 'PUC-KL-2026-90214',
        providerOrAuthority: 'Greenway Auto Emissions Testing',
        issueDate: '2026-04-10',
        expiryDate: '2026-10-09',
        status: 'Active',
        documentRef: 'DOC-PUC-V001.pdf'
      }
    },
    finance: {
      hasFinance: true,
      financeProvider: 'Sundaram Finance Commercial Vehicle Division',
      loanAccountNumber: 'SFL-CV-KL-99014',
      loanAmount: 3000000,
      downPayment: 800000,
      interestRate: 8.75,
      tenureMonths: 48,
      emiAmount: 74250,
      startDate: '2022-03-01',
      endDate: '2026-02-28',
      totalPaid: 2970000,
      outstandingAmount: 222750,
      nextDueDate: '2026-10-05',
      status: 'ACTIVE'
    },
    todayTripsCount: 2,
    monthTripsCount: 48,
    monthRevenue: 492000,
    monthExpense: 284000,
    monthNetContribution: 208000
  },
  {
    id: 'V-02',
    vehicleNumber: 'KL-14-W-8812',
    vehicleCode: 'V002',
    vehicleType: 'Tipper',
    registrationDate: '2023-04-15',
    make: 'Tata Motors',
    model: 'Prima 2830.K',
    variant: 'HRV 9-Speed Heavy Mining Tipper',
    manufacturingYear: 2023,
    colour: 'Arctic White with Blue Trim',
    fuelType: 'Diesel',
    capacity: 18,
    capacityUnit: 'Cu.M (32 MT)',
    chassisNumber: 'MAT628045P0091823',
    engineNumber: 'CUMMINS-ISBe6.7-9021',
    status: 'On Trip',
    currentDriverId: 'DRV-02',
    currentDriverName: 'Suresh Babu',
    currentLocation: 'Someshwar Crusher Yard &bull; Weighbridge 2',
    currentTripId: 'TRIP-882',
    odometerKm: 52140,
    fuelLevelPercent: 54,
    avgMileageKmpL: 3.1,
    branch: 'Ullal Coastal Hub',
    // MULTIPLE OWNERS (Owner B — 60%, Owner E — 40%)
    owners: [
      {
        id: 'OWN-CFG-02A',
        vehicleId: 'V-02',
        vehicleNumber: 'KL-14-W-8812',
        ownerId: 'OWN-B',
        ownerName: 'Owner B (Basheer Haji)',
        ownershipPercent: 60,
        investmentAmount: 2400000,
        capitalAmount: 2400000,
        revenuePercent: 60,
        expensePercent: 60,
        profitPercent: 65, // Independently configured!
        lossPercent: 60,
        effectiveDate: '2023-04-15',
        agreementNumber: 'RZ-V-AGR-002-PARTNERSHIP',
        agreementStatus: 'ACTIVE',
        formulaNotes: 'Joint Ownership Agreement: Owner B has 60% Equity & 65% Profit distribution for providing management supervision.'
      },
      {
        id: 'OWN-CFG-02B',
        vehicleId: 'V-02',
        vehicleNumber: 'KL-14-W-8812',
        ownerId: 'OWN-E',
        ownerName: 'Owner E (Ershad Mohammed)',
        ownershipPercent: 40,
        investmentAmount: 1600000,
        capitalAmount: 1600000,
        revenuePercent: 40,
        expensePercent: 40,
        profitPercent: 35, // Independently configured!
        lossPercent: 40,
        effectiveDate: '2023-04-15',
        agreementNumber: 'RZ-V-AGR-002-PARTNERSHIP',
        agreementStatus: 'ACTIVE',
        formulaNotes: 'Joint Ownership Agreement: Owner E has 40% Equity & 35% Profit distribution.'
      }
    ],
    compliance: {
      insurance: {
        type: 'Insurance',
        identifier: 'TATA-AIG-CV-991204',
        providerOrAuthority: 'Tata AIG General Insurance',
        startDate: '2026-04-10',
        expiryDate: '2027-04-09',
        amountOrPremium: 72000,
        status: 'Active',
        documentRef: 'DOC-INS-V002.pdf'
      },
      tax: {
        type: 'Tax',
        identifier: 'KL-MVT-2026-Q3-0104',
        providerOrAuthority: 'Kerala Motor Vehicles Dept',
        startDate: '2026-07-01',
        expiryDate: '2026-09-30',
        amountOrPremium: 15600,
        status: 'Active'
      },
      permit: {
        type: 'Permit',
        identifier: 'KL-STA-AITP-8812',
        providerOrAuthority: 'National Goods Carriage Permit',
        issueDate: '2023-05-01',
        expiryDate: '2026-10-15', // Expiring soon!
        status: 'Expiring Soon',
        documentRef: 'DOC-PERMIT-V002.pdf'
      },
      fitness: {
        type: 'Fitness',
        identifier: 'FC-KL14-2025-9941',
        providerOrAuthority: 'RTO Kasaragod',
        issueDate: '2025-04-20',
        expiryDate: '2027-04-19',
        status: 'Active',
        documentRef: 'DOC-FC-V002.pdf'
      },
      pollution: {
        type: 'Pollution',
        identifier: 'PUC-KL-2026-11849',
        providerOrAuthority: 'RTO Authorized Pollution Lab',
        issueDate: '2026-05-12',
        expiryDate: '2026-11-11',
        status: 'Active',
        documentRef: 'DOC-PUC-V002.pdf'
      }
    },
    finance: {
      hasFinance: true,
      financeProvider: 'HDFC Bank Equipment Finance',
      loanAccountNumber: 'HDFC-EQ-2023-90812',
      loanAmount: 2800000,
      downPayment: 1200000,
      interestRate: 8.5,
      tenureMonths: 36,
      emiAmount: 88350,
      startDate: '2023-05-01',
      endDate: '2026-04-30',
      totalPaid: 2650500,
      outstandingAmount: 353400,
      nextDueDate: '2026-10-01',
      status: 'ACTIVE'
    },
    todayTripsCount: 3,
    monthTripsCount: 52,
    monthRevenue: 546000,
    monthExpense: 312000,
    monthNetContribution: 234000
  },
  {
    id: 'V-03',
    vehicleNumber: 'KL-60-E-3310',
    vehicleCode: 'V003',
    vehicleType: 'Tipper',
    registrationDate: '2023-08-20',
    make: 'Ashok Leyland',
    model: 'Captain 2825',
    variant: 'Bogie Suspension Quarry Tipper 16 Cu.M',
    manufacturingYear: 2023,
    colour: 'Deep Navy Blue',
    fuelType: 'Diesel',
    capacity: 16,
    capacityUnit: 'Cu.M (28 MT)',
    chassisNumber: 'MB1A28A25R0077192',
    engineNumber: 'H6ETIC4RU26-8812',
    status: 'Available',
    currentDriverId: 'DRV-03',
    currentDriverName: 'Rajesh V. Nair',
    currentLocation: 'Central Maintenance Yard Kasaragod',
    odometerKm: 41800,
    fuelLevelPercent: 82,
    avgMileageKmpL: 3.6,
    branch: 'Kanhangad Central Depot',
    // THREE OWNERS (Owner A — 40%, Owner B — 35%, Owner E — 25%)
    owners: [
      {
        id: 'OWN-CFG-03A',
        vehicleId: 'V-03',
        vehicleNumber: 'KL-60-E-3310',
        ownerId: 'OWN-A',
        ownerName: 'Owner A (Anil Kumar Shetty)',
        ownershipPercent: 40,
        investmentAmount: 1600000,
        capitalAmount: 1600000,
        revenuePercent: 40,
        expensePercent: 40,
        profitPercent: 40,
        lossPercent: 40,
        effectiveDate: '2023-08-20',
        agreementNumber: 'RZ-V-AGR-003-TRIO',
        agreementStatus: 'ACTIVE',
        formulaNotes: 'Tri-Party Syndicate: Owner A holds 40% equity & voting control.'
      },
      {
        id: 'OWN-CFG-03B',
        vehicleId: 'V-03',
        vehicleNumber: 'KL-60-E-3310',
        ownerId: 'OWN-B',
        ownerName: 'Owner B (Basheer Haji)',
        ownershipPercent: 35,
        investmentAmount: 1400000,
        capitalAmount: 1400000,
        revenuePercent: 35,
        expensePercent: 35,
        profitPercent: 35,
        lossPercent: 35,
        effectiveDate: '2023-08-20',
        agreementNumber: 'RZ-V-AGR-003-TRIO',
        agreementStatus: 'ACTIVE',
        formulaNotes: 'Tri-Party Syndicate: Owner B holds 35% equity.'
      },
      {
        id: 'OWN-CFG-03C',
        vehicleId: 'V-03',
        vehicleNumber: 'KL-60-E-3310',
        ownerId: 'OWN-E',
        ownerName: 'Owner E (Ershad Mohammed)',
        ownershipPercent: 25,
        investmentAmount: 1000000,
        capitalAmount: 1000000,
        revenuePercent: 25,
        expensePercent: 25,
        profitPercent: 25,
        lossPercent: 25,
        effectiveDate: '2023-08-20',
        agreementNumber: 'RZ-V-AGR-003-TRIO',
        agreementStatus: 'ACTIVE',
        formulaNotes: 'Tri-Party Syndicate: Owner E holds 25% equity.'
      }
    ],
    compliance: {
      insurance: {
        type: 'Insurance',
        identifier: 'NEW-INDIA-CV-449102',
        providerOrAuthority: 'The New India Assurance Co. Ltd.',
        startDate: '2026-08-15',
        expiryDate: '2027-08-14',
        amountOrPremium: 65400,
        status: 'Active',
        documentRef: 'DOC-INS-V003.pdf'
      },
      tax: {
        type: 'Tax',
        identifier: 'KL-MVT-2026-Q3-0219',
        providerOrAuthority: 'Kerala Motor Vehicles Dept',
        startDate: '2026-07-01',
        expiryDate: '2026-09-30',
        amountOrPremium: 14200,
        status: 'Active'
      },
      permit: {
        type: 'Permit',
        identifier: 'KL-STA-AITP-3310',
        providerOrAuthority: 'State Goods Carriage Permit',
        issueDate: '2023-08-25',
        expiryDate: '2028-08-24',
        status: 'Active',
        documentRef: 'DOC-PERMIT-V003.pdf'
      },
      fitness: {
        type: 'Fitness',
        identifier: 'FC-KL60-2025-1102',
        providerOrAuthority: 'RTO Kanhangad',
        issueDate: '2025-08-10',
        expiryDate: '2027-08-09',
        status: 'Active',
        documentRef: 'DOC-FC-V003.pdf'
      },
      pollution: {
        type: 'Pollution',
        identifier: 'PUC-KL-2026-44129',
        providerOrAuthority: 'EcoCheck Mobile Testing Unit',
        issueDate: '2026-02-15',
        expiryDate: '2026-08-14', // Expired demo
        status: 'Expired',
        documentRef: 'DOC-PUC-V003.pdf'
      }
    },
    finance: {
      hasFinance: false,
      financeProvider: 'Self-Funded by Syndicate Partners',
      loanAccountNumber: 'N/A',
      loanAmount: 0,
      downPayment: 4000000,
      interestRate: 0,
      tenureMonths: 0,
      emiAmount: 0,
      startDate: '2023-08-20',
      endDate: '2023-08-20',
      totalPaid: 4000000,
      outstandingAmount: 0,
      nextDueDate: 'N/A',
      status: 'CLOSED'
    },
    todayTripsCount: 1,
    monthTripsCount: 42,
    monthRevenue: 432000,
    monthExpense: 238000,
    monthNetContribution: 194000
  },
  {
    id: 'V-04',
    vehicleNumber: 'KA-19-MG-9020',
    vehicleCode: 'V004',
    vehicleType: 'Trailer',
    registrationDate: '2022-11-05',
    make: 'Volvo Trucks',
    model: 'FMX 460 8x4',
    variant: 'Heavy Haulage Low-Bed Rock Trailer 40 MT',
    manufacturingYear: 2022,
    colour: 'Granite Grey',
    fuelType: 'Diesel',
    capacity: 24,
    capacityUnit: 'Cu.M (40 MT)',
    chassisNumber: 'YV2R4W0A4N1098234',
    engineNumber: 'D13A460-EC06-9021',
    status: 'On Trip',
    currentDriverId: 'DRV-04',
    currentDriverName: 'Hameed K. K.',
    currentLocation: 'Mangalore Port Terminal 3 (Discharging)',
    currentTripId: 'TRIP-884',
    odometerKm: 94200,
    fuelLevelPercent: 42,
    avgMileageKmpL: 2.7,
    branch: 'Mangalore Port Transport Wing',
    owners: [
      {
        id: 'OWN-CFG-04A',
        vehicleId: 'V-04',
        vehicleNumber: 'KA-19-MG-9020',
        ownerId: 'OWN-B',
        ownerName: 'Owner B (Basheer Haji)',
        ownershipPercent: 40,
        investmentAmount: 2200000,
        capitalAmount: 2200000,
        revenuePercent: 40,
        expensePercent: 40,
        profitPercent: 40,
        lossPercent: 40,
        effectiveDate: '2022-11-05',
        agreementNumber: 'RZ-V-AGR-004',
        agreementStatus: 'ACTIVE',
        formulaNotes: 'Consortium Share: Owner B has 40% equity in Port Heavy Haulage'
      }
    ],
    compliance: {
      insurance: {
        type: 'Insurance',
        identifier: 'UNITED-CV-881902',
        providerOrAuthority: 'United India Insurance Co.',
        startDate: '2025-11-01',
        expiryDate: '2026-10-31', // Expiring soon!
        amountOrPremium: 98000,
        status: 'Expiring Soon',
        documentRef: 'DOC-INS-V004.pdf'
      },
      tax: {
        type: 'Tax',
        identifier: 'KA-MVT-2026-Q3-8812',
        providerOrAuthority: 'Karnataka Transport Dept',
        startDate: '2026-07-01',
        expiryDate: '2026-09-30',
        amountOrPremium: 22400,
        status: 'Active'
      },
      permit: {
        type: 'Permit',
        identifier: 'KA-STA-NP-9020',
        providerOrAuthority: 'National Heavy Trailer Permit',
        issueDate: '2022-11-10',
        expiryDate: '2027-11-09',
        status: 'Active',
        documentRef: 'DOC-PERMIT-V004.pdf'
      },
      fitness: {
        type: 'Fitness',
        identifier: 'FC-KA19-2025-4491',
        providerOrAuthority: 'RTO Mangalore',
        issueDate: '2025-11-05',
        expiryDate: '2027-11-04',
        status: 'Active',
        documentRef: 'DOC-FC-V004.pdf'
      },
      pollution: {
        type: 'Pollution',
        identifier: 'PUC-KA-2026-88190',
        providerOrAuthority: 'Mangalore RTO Testing Center',
        issueDate: '2026-05-02',
        expiryDate: '2026-11-01',
        status: 'Active',
        documentRef: 'DOC-PUC-V004.pdf'
      }
    },
    finance: {
      hasFinance: true,
      financeProvider: 'Tata Capital Commercial Finance',
      loanAccountNumber: 'TC-HEAVY-2022-00918',
      loanAmount: 4200000,
      downPayment: 1300000,
      interestRate: 8.9,
      tenureMonths: 60,
      emiAmount: 86900,
      startDate: '2022-11-15',
      endDate: '2027-11-14',
      totalPaid: 3997400,
      outstandingAmount: 1216600,
      nextDueDate: '2026-10-15',
      status: 'ACTIVE'
    },
    todayTripsCount: 1,
    monthTripsCount: 28,
    monthRevenue: 616000,
    monthExpense: 374000,
    monthNetContribution: 242000
  },
  {
    id: 'V-05',
    vehicleNumber: 'KL-14-Z-1199',
    vehicleCode: 'V005',
    vehicleType: 'Tipper',
    registrationDate: '2024-01-20',
    make: 'BharatBenz',
    model: '3528CM',
    variant: '8x4 Multi-Axle 22 Cu.M Mining Tipper',
    manufacturingYear: 2024,
    colour: 'Bright Canary Yellow',
    fuelType: 'Diesel',
    capacity: 22,
    capacityUnit: 'Cu.M (35 MT)',
    chassisNumber: 'ME458A352P0011928',
    engineNumber: 'OM906LA10994182',
    status: 'Maintenance',
    currentDriverId: 'DRV-05',
    currentDriverName: 'Praveen G.',
    currentLocation: 'BharatBenz Authorized Service Center Kasaragod',
    odometerKm: 32400,
    fuelLevelPercent: 35,
    avgMileageKmpL: 3.2,
    branch: 'Kasaragod North Operations',
    owners: [
      {
        id: 'OWN-CFG-05A',
        vehicleId: 'V-05',
        vehicleNumber: 'KL-14-Z-1199',
        ownerId: 'OWN-C',
        ownerName: 'Owner C (Cyril D’Souza)',
        ownershipPercent: 100,
        investmentAmount: 4200000,
        capitalAmount: 4200000,
        revenuePercent: 100,
        expensePercent: 100,
        profitPercent: 100,
        lossPercent: 100,
        effectiveDate: '2024-01-20',
        agreementNumber: 'RZ-V-AGR-005',
        agreementStatus: 'ACTIVE',
        formulaNotes: 'Sole Ownership — 100% Owner C'
      }
    ],
    compliance: {
      insurance: {
        type: 'Insurance',
        identifier: 'HDFC-ERGO-CV-331092',
        providerOrAuthority: 'HDFC ERGO General Insurance',
        startDate: '2026-01-18',
        expiryDate: '2027-01-17',
        amountOrPremium: 84000,
        status: 'Active',
        documentRef: 'DOC-INS-V005.pdf'
      },
      tax: {
        type: 'Tax',
        identifier: 'KL-MVT-2026-Q3-0981',
        providerOrAuthority: 'Kerala Motor Vehicles Dept',
        startDate: '2026-07-01',
        expiryDate: '2026-09-30',
        amountOrPremium: 18400,
        status: 'Active'
      },
      permit: {
        type: 'Permit',
        identifier: 'KL-STA-AITP-1199',
        providerOrAuthority: 'All India Goods Carriage Permit',
        issueDate: '2024-02-01',
        expiryDate: '2029-01-31',
        status: 'Active',
        documentRef: 'DOC-PERMIT-V005.pdf'
      },
      fitness: {
        type: 'Fitness',
        identifier: 'FC-KL14-2026-1199',
        providerOrAuthority: 'RTO Kasaragod',
        issueDate: '2026-01-20',
        expiryDate: '2028-01-19',
        status: 'Active',
        documentRef: 'DOC-FC-V005.pdf'
      },
      pollution: {
        type: 'Pollution',
        identifier: 'PUC-KL-2026-99120',
        providerOrAuthority: 'Greenway Auto Emissions',
        issueDate: '2026-04-15',
        expiryDate: '2026-10-14',
        status: 'Active',
        documentRef: 'DOC-PUC-V005.pdf'
      }
    },
    finance: {
      hasFinance: true,
      financeProvider: 'IndusInd Bank Commercial Vehicle Finance',
      loanAccountNumber: 'IB-CV-2024-11992',
      loanAmount: 3400000,
      downPayment: 1400000,
      interestRate: 8.65,
      tenureMonths: 48,
      emiAmount: 84150,
      startDate: '2024-02-01',
      endDate: '2028-01-31',
      totalPaid: 2608650,
      outstandingAmount: 1430550,
      nextDueDate: '2026-10-05',
      status: 'ACTIVE'
    },
    todayTripsCount: 0,
    monthTripsCount: 36,
    monthRevenue: 432000,
    monthExpense: 278000,
    monthNetContribution: 154000
  },
  {
    id: 'V-06',
    vehicleNumber: 'KA-19-B-6721',
    vehicleCode: 'V006',
    vehicleType: 'Pickup',
    registrationDate: '2023-09-10',
    make: 'Mahindra & Mahindra',
    model: 'Bolero Maxi Truck Plus',
    variant: 'Power Steering Utility 1.7 MT',
    manufacturingYear: 2023,
    colour: 'Diamond White',
    fuelType: 'Diesel',
    capacity: 2,
    capacityUnit: 'Tons',
    chassisNumber: 'MA1MN2AB4P0081290',
    engineNumber: 'M2DiCR-4CYL-7712',
    status: 'Available',
    currentLocation: 'Crusher Maintenance Spare Parts Store',
    odometerKm: 28400,
    fuelLevelPercent: 75,
    avgMileageKmpL: 13.8,
    branch: 'Ullal Coastal Hub',
    owners: [
      {
        id: 'OWN-CFG-06',
        vehicleId: 'V-06',
        vehicleNumber: 'KA-19-B-6721',
        ownerId: 'OWN-B',
        ownerName: 'Owner B (Basheer Haji)',
        ownershipPercent: 100,
        investmentAmount: 850000,
        capitalAmount: 850000,
        revenuePercent: 100,
        expensePercent: 100,
        profitPercent: 100,
        lossPercent: 100,
        effectiveDate: '2023-09-10',
        agreementNumber: 'RZ-V-AGR-006',
        agreementStatus: 'ACTIVE'
      }
    ],
    compliance: {
      insurance: {
        type: 'Insurance',
        identifier: 'SBI-GEN-CV-99120',
        providerOrAuthority: 'SBI General Insurance',
        startDate: '2026-09-01',
        expiryDate: '2027-08-31',
        amountOrPremium: 24500,
        status: 'Active'
      },
      tax: {
        type: 'Tax',
        identifier: 'KA-MVT-2026-Q3-4412',
        providerOrAuthority: 'Karnataka Transport Dept',
        startDate: '2026-07-01',
        expiryDate: '2026-09-30',
        amountOrPremium: 4200,
        status: 'Active'
      },
      permit: {
        type: 'Permit',
        identifier: 'KA-STA-LGV-6721',
        providerOrAuthority: 'Karnataka Goods Permit',
        issueDate: '2023-09-15',
        expiryDate: '2028-09-14',
        status: 'Active'
      },
      fitness: {
        type: 'Fitness',
        identifier: 'FC-KA19-2025-6721',
        providerOrAuthority: 'RTO Mangalore',
        issueDate: '2025-09-10',
        expiryDate: '2027-09-09',
        status: 'Active'
      },
      pollution: {
        type: 'Pollution',
        identifier: 'PUC-KA-2026-67210',
        providerOrAuthority: 'Auto Pollution Test Center',
        issueDate: '2026-03-10',
        expiryDate: '2026-09-09', // Expired
        status: 'Expired'
      }
    },
    finance: {
      hasFinance: false,
      financeProvider: 'Company Owned',
      loanAccountNumber: 'N/A',
      loanAmount: 0,
      downPayment: 850000,
      interestRate: 0,
      tenureMonths: 0,
      emiAmount: 0,
      startDate: '2023-09-10',
      endDate: '2023-09-10',
      totalPaid: 850000,
      outstandingAmount: 0,
      nextDueDate: 'N/A',
      status: 'CLOSED'
    },
    todayTripsCount: 0,
    monthTripsCount: 18,
    monthRevenue: 85000,
    monthExpense: 42000,
    monthNetContribution: 43000
  }
];

export const SAMPLE_TRIPS: Trip[] = [
  {
    id: 'TRIP-881',
    tripNumber: 'TRIP-2026-0881',
    date: '2026-09-22',
    vehicleId: 'V-01',
    vehicleNumber: 'KL-14-V-4088',
    driverId: 'DRV-01',
    driverName: 'Manoj Kumar P.',
    customerId: 'CUST-01',
    customerName: 'KNR Constructions (NH-66 Highway Package 4)',
    pickupLocation: 'RZ Kasaragod Central Crusher &bull; Bay 3',
    destinationLocation: 'NH66 Expressway Km 42 Flyover Construction Site',
    material: '20mm Graded Blue Metal Aggregate',
    quantity: 28,
    unit: 'Tons',
    rate: 640,
    tripIncome: 17920,
    advanceReceived: 5000,
    balanceAmount: 12920,
    startTime: '08:30 AM',
    status: 'In Transit',
    gatePassRef: 'GP-CRU-2026-0941',
    paymentStatus: 'Partial',
    fuelCost: 3200,
    tollCost: 380,
    driverBatta: 950,
    loadingUnloadingCost: 600,
    otherExpense: 150,
    tripContribution: 12640,
    ottTaskId: 'OTT-TASK-TRIP-881'
  },
  {
    id: 'TRIP-882',
    tripNumber: 'TRIP-2026-0882',
    date: '2026-09-22',
    vehicleId: 'V-02',
    vehicleNumber: 'KL-14-W-8812',
    driverId: 'DRV-02',
    driverName: 'Suresh Babu',
    customerId: 'CUST-02',
    customerName: 'Mangalore Metro Ready Mix Concrete Ltd.',
    pickupLocation: 'Someshwar Coastal M-Sand Plant',
    destinationLocation: 'Baikampady Industrial Estate RMC Plant',
    material: 'IS 383 Concrete Grade Washed M-Sand',
    quantity: 32,
    unit: 'Tons',
    rate: 720,
    tripIncome: 23040,
    advanceReceived: 10000,
    balanceAmount: 13040,
    startTime: '07:15 AM',
    status: 'In Transit',
    gatePassRef: 'GP-CRU-2026-0942',
    paymentStatus: 'Partial',
    fuelCost: 4100,
    tollCost: 450,
    driverBatta: 1100,
    loadingUnloadingCost: 800,
    otherExpense: 200,
    tripContribution: 16390,
    ottTaskId: 'OTT-TASK-TRIP-882'
  },
  {
    id: 'TRIP-883',
    tripNumber: 'TRIP-2026-0883',
    date: '2026-09-22',
    vehicleId: 'V-03',
    vehicleNumber: 'KL-60-E-3310',
    driverId: 'DRV-03',
    driverName: 'Rajesh V. Nair',
    customerId: 'CUST-03',
    customerName: 'Prestige Group Commercial Tower Site',
    pickupLocation: 'RZ Kasaragod Central Crusher &bull; Silo 1',
    destinationLocation: 'Pumpwell Junction Construction Site Mangalore',
    material: 'Plastering Grade Fine P-Sand (Zone IV)',
    quantity: 26,
    unit: 'Tons',
    rate: 850,
    tripIncome: 22100,
    advanceReceived: 22100,
    balanceAmount: 0,
    startTime: '06:00 AM',
    endTime: '11:45 AM',
    status: 'Completed',
    gatePassRef: 'GP-CRU-2026-0938',
    paymentStatus: 'Paid',
    fuelCost: 3800,
    tollCost: 380,
    driverBatta: 1000,
    loadingUnloadingCost: 650,
    otherExpense: 100,
    tripContribution: 16170
  },
  {
    id: 'TRIP-884',
    tripNumber: 'TRIP-2026-0884',
    date: '2026-09-22',
    vehicleId: 'V-04',
    vehicleNumber: 'KA-19-MG-9020',
    driverId: 'DRV-04',
    driverName: 'Hameed K. K.',
    customerId: 'CUST-04',
    customerName: 'New Mangalore Port Authority &bull; Breakwater Berth 8',
    pickupLocation: 'RZ Quarry Pit Alpha &bull; Blast Bench 04',
    destinationLocation: 'Panambur Port Breakwater Extension',
    material: 'Heavy Armour Boulders (1 - 2 Ton Cut Stone)',
    quantity: 38,
    unit: 'Tons',
    rate: 880,
    tripIncome: 33440,
    advanceReceived: 15000,
    balanceAmount: 18440,
    startTime: '09:00 AM',
    status: 'In Transit',
    gatePassRef: 'GP-QRY-2026-0419',
    paymentStatus: 'Partial',
    fuelCost: 6500,
    tollCost: 520,
    driverBatta: 1400,
    loadingUnloadingCost: 1200,
    otherExpense: 300,
    tripContribution: 23520,
    ottTaskId: 'OTT-TASK-TRIP-884'
  },
  {
    id: 'TRIP-880',
    tripNumber: 'TRIP-2026-0880',
    date: '2026-09-21',
    vehicleId: 'V-01',
    vehicleNumber: 'KL-14-V-4088',
    driverId: 'DRV-01',
    driverName: 'Manoj Kumar P.',
    customerId: 'CUST-01',
    customerName: 'KNR Constructions',
    pickupLocation: 'RZ Kasaragod Central Crusher',
    destinationLocation: 'NH66 Km 38 Base Camp',
    material: 'GSB (Granular Sub Base) Road-Metal Mix',
    quantity: 28,
    unit: 'Tons',
    rate: 520,
    tripIncome: 14560,
    advanceReceived: 14560,
    balanceAmount: 0,
    startTime: '01:00 PM',
    endTime: '06:30 PM',
    status: 'Completed',
    gatePassRef: 'GP-CRU-2026-0929',
    paymentStatus: 'Paid',
    fuelCost: 2900,
    tollCost: 380,
    driverBatta: 950,
    loadingUnloadingCost: 500,
    otherExpense: 100,
    tripContribution: 9730
  }
];

export const SAMPLE_LOADS: VehicleLoad[] = [
  {
    id: 'LOAD-9041',
    loadNumber: 'LOAD-2026-9041',
    tripId: 'TRIP-881',
    tripNumber: 'TRIP-2026-0881',
    date: '2026-09-22',
    time: '08:20 AM',
    vehicleNumber: 'KL-14-V-4088',
    driverName: 'Manoj Kumar P.',
    sourceType: 'Crusher',
    sourceName: 'RZ Kasaragod 250 TPH VSI Plant',
    workingArea: 'Aggregate Sizing Deck 2 &bull; 20mm Silo',
    material: '20mm Graded Blue Metal Aggregate',
    quantity: 28,
    unit: 'Tons',
    customerName: 'KNR Constructions (NH-66 Highway Package 4)',
    destination: 'NH66 Expressway Km 42 Flyover Construction Site',
    gatePassNumber: 'GP-CRU-2026-0941',
    deliveryStatus: 'Dispatched',
    tareWeightMT: 12.8,
    grossWeightMT: 40.8,
    netWeightMT: 28.0
  },
  {
    id: 'LOAD-9042',
    loadNumber: 'LOAD-2026-9042',
    tripId: 'TRIP-882',
    tripNumber: 'TRIP-2026-0882',
    date: '2026-09-22',
    time: '07:05 AM',
    vehicleNumber: 'KL-14-W-8812',
    driverName: 'Suresh Babu',
    sourceType: 'Crusher',
    sourceName: 'Someshwar Coastal M-Sand Plant',
    workingArea: 'Hydro-cyclone Dewatering Bay 1',
    material: 'IS 383 Concrete Grade Washed M-Sand',
    quantity: 32,
    unit: 'Tons',
    customerName: 'Mangalore Metro Ready Mix Concrete Ltd.',
    destination: 'Baikampady Industrial Estate RMC Plant',
    gatePassNumber: 'GP-CRU-2026-0942',
    deliveryStatus: 'Dispatched',
    tareWeightMT: 13.5,
    grossWeightMT: 45.5,
    netWeightMT: 32.0
  },
  {
    id: 'LOAD-9043',
    loadNumber: 'LOAD-2026-9043',
    tripId: 'TRIP-884',
    tripNumber: 'TRIP-2026-0884',
    date: '2026-09-22',
    time: '08:45 AM',
    vehicleNumber: 'KA-19-MG-9020',
    driverName: 'Hameed K. K.',
    sourceType: 'Quarry',
    sourceName: 'RZ Kasaragod Granite Pit Alpha',
    workingArea: 'Deep Pit Bench 04 &bull; Heavy Blasting Zone',
    material: 'Heavy Armour Boulders (1 - 2 Ton Cut Stone)',
    quantity: 38,
    unit: 'Tons',
    customerName: 'New Mangalore Port Authority',
    destination: 'Panambur Port Breakwater Extension',
    gatePassNumber: 'GP-QRY-2026-0419',
    deliveryStatus: 'Dispatched',
    tareWeightMT: 18.2,
    grossWeightMT: 56.2,
    netWeightMT: 38.0
  },
  {
    id: 'LOAD-9040',
    loadNumber: 'LOAD-2026-9040',
    tripId: 'TRIP-883',
    tripNumber: 'TRIP-2026-0883',
    date: '2026-09-22',
    time: '05:40 AM',
    vehicleNumber: 'KL-60-E-3310',
    driverName: 'Rajesh V. Nair',
    sourceType: 'Crusher',
    sourceName: 'RZ Kasaragod Central Crusher',
    workingArea: 'Silo 1 Fine Sand Bagging & Chute',
    material: 'Plastering Grade Fine P-Sand (Zone IV)',
    quantity: 26,
    unit: 'Tons',
    customerName: 'Prestige Group Commercial Tower Site',
    destination: 'Pumpwell Junction Construction Site Mangalore',
    gatePassNumber: 'GP-CRU-2026-0938',
    deliveryStatus: 'Delivered',
    tareWeightMT: 12.4,
    grossWeightMT: 38.4,
    netWeightMT: 26.0
  }
];

export const SAMPLE_DELIVERIES: Delivery[] = [
  {
    id: 'DEL-5021',
    deliveryNumber: 'DEL-2026-5021',
    tripNumber: 'TRIP-2026-0881',
    customerName: 'KNR Constructions (NH-66 Highway Package 4)',
    vehicleNumber: 'KL-14-V-4088',
    driverName: 'Manoj Kumar P.',
    material: '20mm Graded Blue Metal Aggregate',
    quantity: 28,
    unit: 'Tons',
    pickupLocation: 'RZ Kasaragod Central Crusher &bull; Bay 3',
    destinationLocation: 'NH66 Expressway Km 42 Flyover Construction Site',
    dispatchTime: '08:30 AM',
    expectedDeliveryTime: '11:15 AM',
    status: 'In Transit',
    ewayBillNumber: 'EWB-KL-2026-88192014',
    signatureStatus: 'PENDING',
    notes: 'Tipper GPS telematics active. Unloading bay allocated near pier P-14.'
  },
  {
    id: 'DEL-5022',
    deliveryNumber: 'DEL-2026-5022',
    tripNumber: 'TRIP-2026-0882',
    customerName: 'Mangalore Metro Ready Mix Concrete Ltd.',
    vehicleNumber: 'KL-14-W-8812',
    driverName: 'Suresh Babu',
    material: 'IS 383 Concrete Grade Washed M-Sand',
    quantity: 32,
    unit: 'Tons',
    pickupLocation: 'Someshwar Coastal M-Sand Plant',
    destinationLocation: 'Baikampady Industrial Estate RMC Plant',
    dispatchTime: '07:15 AM',
    expectedDeliveryTime: '09:45 AM',
    status: 'Arrived',
    ewayBillNumber: 'EWB-KA-2026-99120481',
    signatureStatus: 'PENDING',
    notes: 'Vehicle arrived at plant gate. Awaiting quality lab moisture check.'
  },
  {
    id: 'DEL-5020',
    deliveryNumber: 'DEL-2026-5020',
    tripNumber: 'TRIP-2026-0883',
    customerName: 'Prestige Group Commercial Tower Site',
    vehicleNumber: 'KL-60-E-3310',
    driverName: 'Rajesh V. Nair',
    material: 'Plastering Grade Fine P-Sand (Zone IV)',
    quantity: 26,
    unit: 'Tons',
    pickupLocation: 'RZ Kasaragod Central Crusher &bull; Silo 1',
    destinationLocation: 'Pumpwell Junction Construction Site Mangalore',
    dispatchTime: '06:00 AM',
    expectedDeliveryTime: '09:00 AM',
    actualDeliveryTime: '08:45 AM',
    status: 'Completed',
    ewayBillNumber: 'EWB-KL-2026-77812904',
    customerConfirmedBy: 'Sanjay Hegde (Site Engineer)',
    signatureStatus: 'SIGNED',
    notes: 'Discharged safely at batching bin 2. Signed physical challan uploaded.'
  },
  {
    id: 'DEL-5024',
    deliveryNumber: 'DEL-2026-5024',
    tripNumber: 'TRIP-2026-0884',
    customerName: 'New Mangalore Port Authority &bull; Breakwater Berth 8',
    vehicleNumber: 'KA-19-MG-9020',
    driverName: 'Hameed K. K.',
    material: 'Heavy Armour Boulders (1 - 2 Ton Cut Stone)',
    quantity: 38,
    unit: 'Tons',
    pickupLocation: 'RZ Quarry Pit Alpha &bull; Blast Bench 04',
    destinationLocation: 'Panambur Port Breakwater Extension',
    dispatchTime: '09:00 AM',
    expectedDeliveryTime: '12:30 PM',
    status: 'In Transit',
    ewayBillNumber: 'EWB-KA-2026-55190284',
    signatureStatus: 'PENDING',
    notes: 'Heavy escort vehicle arranged for port perimeter transit.'
  }
];

export const SAMPLE_BATTA_RECORDS: DriverBattaRecord[] = [
  {
    id: 'BATTA-01',
    voucherNumber: 'BATTA-2026-0881',
    driverId: 'DRV-01',
    driverName: 'Manoj Kumar P.',
    tripId: 'TRIP-881',
    tripNumber: 'TRIP-2026-0881',
    vehicleNumber: 'KL-14-V-4088',
    date: '2026-09-22',
    battaType: 'Trip Batta',
    rate: 950,
    daysOrTrips: 1,
    amount: 950,
    paidAmount: 950,
    balanceAmount: 0,
    paymentStatus: 'PAID',
    paymentMode: 'UPI',
    referenceNumber: 'UPI-9844-0981-88',
    approvedBy: 'Basheer Haji (Fleet Owner)'
  },
  {
    id: 'BATTA-02',
    voucherNumber: 'BATTA-2026-0882',
    driverId: 'DRV-02',
    driverName: 'Suresh Babu',
    tripId: 'TRIP-882',
    tripNumber: 'TRIP-2026-0882',
    vehicleNumber: 'KL-14-W-8812',
    date: '2026-09-22',
    battaType: 'Trip Batta',
    rate: 1100,
    daysOrTrips: 1,
    amount: 1100,
    paidAmount: 1100,
    balanceAmount: 0,
    paymentStatus: 'PAID',
    paymentMode: 'Cash',
    referenceNumber: 'CASH-VOUCHER-0882',
    approvedBy: 'Farooq Ahmed (Transport Officer)'
  },
  {
    id: 'BATTA-03',
    voucherNumber: 'BATTA-2026-0884',
    driverId: 'DRV-04',
    driverName: 'Hameed K. K.',
    tripId: 'TRIP-884',
    tripNumber: 'TRIP-2026-0884',
    vehicleNumber: 'KA-19-MG-9020',
    date: '2026-09-22',
    battaType: 'Night Halt',
    rate: 1400,
    daysOrTrips: 1,
    amount: 1400,
    paidAmount: 1400,
    balanceAmount: 0,
    paymentStatus: 'PAID',
    paymentMode: 'UPI',
    referenceNumber: 'UPI-PORT-0981-44',
    approvedBy: 'Basheer Haji'
  },
  {
    id: 'BATTA-04',
    voucherNumber: 'BATTA-2026-0870',
    driverId: 'DRV-03',
    driverName: 'Rajesh V. Nair',
    vehicleNumber: 'KL-60-E-3310',
    date: '2026-09-21',
    battaType: 'Daily Batta',
    rate: 600,
    daysOrTrips: 2,
    amount: 1200,
    paidAmount: 600,
    balanceAmount: 600,
    paymentStatus: 'PARTIAL',
    paymentMode: 'Cash',
    referenceNumber: 'CASH-BAL-3310',
    approvedBy: 'Anil Kumar Shetty'
  }
];

export const SAMPLE_FUEL_RECORDS: FuelRecord[] = [
  {
    id: 'FUEL-01',
    slipNumber: 'FUEL-2026-7801',
    date: '2026-09-22',
    vehicleId: 'V-01',
    vehicleNumber: 'KL-14-V-4088',
    driverId: 'DRV-01',
    driverName: 'Manoj Kumar P.',
    fuelType: 'HSD Diesel',
    quantityLiters: 95,
    ratePerLiter: 92.5,
    totalAmount: 8787.5,
    odometerKm: 78420,
    previousOdometerKm: 78097,
    kmRun: 323,
    mileageKmpL: 3.4,
    fuelStation: 'Indian Oil Retail Outlet Vidyanagar Kasaragod',
    paymentMethod: 'Corporate Fuel Card',
    referenceNumber: 'IOCL-CARD-TXN-90812'
  },
  {
    id: 'FUEL-02',
    slipNumber: 'FUEL-2026-7802',
    date: '2026-09-22',
    vehicleId: 'V-02',
    vehicleNumber: 'KL-14-W-8812',
    driverId: 'DRV-02',
    driverName: 'Suresh Babu',
    fuelType: 'HSD Diesel',
    quantityLiters: 110,
    ratePerLiter: 92.2,
    totalAmount: 10142.0,
    odometerKm: 52140,
    previousOdometerKm: 51799,
    kmRun: 341,
    mileageKmpL: 3.1,
    fuelStation: 'Bharat Petroleum Highway Hub Ullal',
    paymentMethod: 'Fastag Petro',
    referenceNumber: 'BPCL-PETRO-88120'
  },
  {
    id: 'FUEL-03',
    slipNumber: 'FUEL-2026-7803',
    date: '2026-09-21',
    vehicleId: 'V-04',
    vehicleNumber: 'KA-19-MG-9020',
    driverId: 'DRV-04',
    driverName: 'Hameed K. K.',
    fuelType: 'HSD Diesel',
    quantityLiters: 180,
    ratePerLiter: 92.2,
    totalAmount: 16596.0,
    odometerKm: 94200,
    previousOdometerKm: 93714,
    kmRun: 486,
    mileageKmpL: 2.7,
    fuelStation: 'HPCL Auto Care Panambur Port Gate',
    paymentMethod: 'Credit Account',
    referenceNumber: 'HPCL-ACC-2026-4491'
  },
  {
    id: 'FUEL-04',
    slipNumber: 'FUEL-2026-7798',
    date: '2026-09-20',
    vehicleId: 'V-03',
    vehicleNumber: 'KL-60-E-3310',
    driverId: 'DRV-03',
    driverName: 'Rajesh V. Nair',
    fuelType: 'HSD Diesel',
    quantityLiters: 85,
    ratePerLiter: 92.5,
    totalAmount: 7862.5,
    odometerKm: 41800,
    previousOdometerKm: 41494,
    kmRun: 306,
    mileageKmpL: 3.6,
    fuelStation: 'Indian Oil Kanhangad Depot',
    paymentMethod: 'Corporate Fuel Card',
    referenceNumber: 'IOCL-CARD-TXN-88123'
  }
];

export const SAMPLE_TOLL_RECORDS: TollRecord[] = [
  {
    id: 'TOLL-01',
    tollId: 'FASTAG-2026-9041',
    date: '2026-09-22',
    time: '09:12 AM',
    vehicleNumber: 'KL-14-V-4088',
    tripNumber: 'TRIP-2026-0881',
    route: 'Kasaragod to Mangalore NH66',
    tollPlaza: 'Talapady Toll Plaza (NHAI Plaza 21008)',
    amount: 190,
    paymentMethod: 'Fastag Auto-Debit',
    fastagTagId: '34161FA820328819',
    referenceNumber: 'NETC-NHAI-7782190'
  },
  {
    id: 'TOLL-02',
    tollId: 'FASTAG-2026-9042',
    date: '2026-09-22',
    time: '01:45 PM',
    vehicleNumber: 'KL-14-V-4088',
    tripNumber: 'TRIP-2026-0881',
    route: 'Mangalore to Kasaragod NH66 Return',
    tollPlaza: 'Talapady Toll Plaza (NHAI Plaza 21008)',
    amount: 190,
    paymentMethod: 'Fastag Auto-Debit',
    fastagTagId: '34161FA820328819',
    referenceNumber: 'NETC-NHAI-7783401'
  },
  {
    id: 'TOLL-03',
    tollId: 'FASTAG-2026-9043',
    date: '2026-09-22',
    time: '08:05 AM',
    vehicleNumber: 'KL-14-W-8812',
    tripNumber: 'TRIP-2026-0882',
    route: 'Someshwar to Baikampady Port Corridor',
    tollPlaza: 'Surathkal Port Access Toll Plaza',
    amount: 225,
    paymentMethod: 'Fastag Auto-Debit',
    fastagTagId: '34161FA820449102',
    referenceNumber: 'NETC-PORT-8819024'
  },
  {
    id: 'TOLL-04',
    tollId: 'FASTAG-2026-9044',
    date: '2026-09-22',
    time: '09:40 AM',
    vehicleNumber: 'KA-19-MG-9020',
    tripNumber: 'TRIP-2026-0884',
    route: 'Kasaragod to Panambur Multi-Axle',
    tollPlaza: 'Talapady Toll Plaza (Multi-Axle Heavy)',
    amount: 260,
    paymentMethod: 'Fastag Auto-Debit',
    fastagTagId: '34161FA820991823',
    referenceNumber: 'NETC-NHAI-7789012'
  }
];

export const SAMPLE_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: 'MAINT-01',
    serviceNumber: 'SRV-2026-0182',
    vehicleNumber: 'KL-14-Z-1199',
    date: '2026-09-21',
    odometerKm: 32400,
    category: 'Service',
    description: 'Scheduled 30,000 Km Periodic Maintenance & Engine Lubrication',
    serviceProvider: 'BharatBenz Authorized Service Center Kasaragod',
    cost: 48500,
    nextServiceDate: '2027-01-20',
    nextServiceOdometerKm: 45000,
    status: 'In Progress',
    partsReplaced: [
      'Engine Oil Synthetic 15W40 (28 Litres)',
      'Primary & Secondary Diesel Fuel Filters',
      'Air Cleaner Heavy Duty Element',
      'Hydraulic Tipping Pump Oil Filter'
    ],
    technicianName: 'Santhosh Poojary (Senior Master Tech)'
  },
  {
    id: 'MAINT-02',
    serviceNumber: 'SRV-2026-0174',
    vehicleNumber: 'KL-14-V-4088',
    date: '2026-08-15',
    odometerKm: 75000,
    category: 'Brake',
    description: 'Rear Axle Heavy Brake Lining Replacement & Drum Skimming',
    serviceProvider: 'RZ Fleet Workshop Central Pit',
    cost: 18400,
    nextServiceDate: '2026-11-15',
    nextServiceOdometerKm: 85000,
    status: 'Completed',
    partsReplaced: [
      'Heavy Duty Asbestos-Free Brake Linings (8 Sets)',
      'Brake Return Springs & Cam Bush Kit',
      'Pneumatic Brake Booster Diaphragm'
    ],
    technicianName: 'Iqbal K. (Workshop Head)'
  },
  {
    id: 'MAINT-03',
    serviceNumber: 'SRV-2026-0160',
    vehicleNumber: 'KL-14-W-8812',
    date: '2026-07-28',
    odometerKm: 48000,
    category: 'Suspension',
    description: 'Bogie Suspension Leaf Spring Retensioning & Bush Pin Replacement',
    serviceProvider: 'Tata Commercial Workshop Baikampady',
    cost: 26800,
    nextServiceDate: '2026-12-28',
    nextServiceOdometerKm: 60000,
    status: 'Completed',
    partsReplaced: [
      'Main Leaf Spring Plate 1st & 2nd',
      'Heavy Phosphor Bronze Bogie Bushes',
      'U-Bolts & High Tensile Locking Nuts'
    ],
    technicianName: 'Mahesh Nayak'
  }
];

export const SAMPLE_TYRE_RECORDS: TyreRecord[] = [
  {
    id: 'TYRE-01',
    tyreNumber: 'MRF-M77-0981',
    vehicleNumber: 'KL-14-V-4088',
    brand: 'MRF Super Lug-FS',
    size: '11.00R20 16PR Mining',
    purchaseDate: '2023-05-10',
    purchaseCost: 24500,
    position: 'Front-Left',
    currentOdometerKm: 78420,
    installedOdometerKm: 42000,
    kmRun: 36420,
    rotationHistory: 'Rotated Front to Rear-Inner at 62,000 Km',
    repairsHistory: '1 Puncture vulcanized at 55,000 Km',
    replacementDueKm: 65000,
    status: 'Active'
  },
  {
    id: 'TYRE-02',
    tyreNumber: 'APOLLO-ENDURACE-4412',
    vehicleNumber: 'KL-14-V-4088',
    brand: 'Apollo EnduTrax HD',
    size: '11.00R20 16PR',
    purchaseDate: '2023-05-10',
    purchaseCost: 23800,
    position: 'Front-Right',
    currentOdometerKm: 78420,
    installedOdometerKm: 42000,
    kmRun: 36420,
    rotationHistory: 'Rotated at 62,000 Km',
    repairsHistory: 'Nil',
    replacementDueKm: 65000,
    status: 'Active'
  },
  {
    id: 'TYRE-03',
    tyreNumber: 'JK-TYRE-JETTRAK-9901',
    vehicleNumber: 'KL-14-W-8812',
    brand: 'JK Tyre Jet Trak HD',
    size: '11.00R20 18PR Mining Cut-Resistant',
    purchaseDate: '2024-02-15',
    purchaseCost: 26200,
    position: 'Rear-Right-Outer',
    currentOdometerKm: 52140,
    installedOdometerKm: 28000,
    kmRun: 24140,
    rotationHistory: 'Initial mount at rear right outer',
    repairsHistory: 'Nil',
    replacementDueKm: 70000,
    status: 'Active'
  },
  {
    id: 'TYRE-04',
    tyreNumber: 'BRIDGESTONE-L301-8812',
    vehicleNumber: 'KA-19-MG-9020',
    brand: 'Bridgestone L301 Multi-Axle Heavy',
    size: '12.00R24 20PR Port Trailer',
    purchaseDate: '2023-01-20',
    purchaseCost: 34500,
    position: 'Rear-Left-Outer',
    currentOdometerKm: 94200,
    installedOdometerKm: 45000,
    kmRun: 49200,
    rotationHistory: 'Retreaded once at Bandag Mangalore at 42,000 Km',
    repairsHistory: '2 sidewall patches reinforced',
    replacementDueKm: 60000,
    status: 'Retreaded'
  }
];

export const SAMPLE_OWNER_SETTLEMENTS: OwnerSettlementRecord[] = [
  {
    id: 'SETTL-01',
    settlementNumber: 'SETTL-V002-2026-08',
    settlementDate: '2026-09-05',
    period: 'August 2026 Monthly Trip Settlement',
    vehicleNumber: 'KL-14-W-8812',
    vehicleCode: 'V002',
    ownerId: 'OWN-B',
    ownerName: 'Owner B (Basheer Haji)',
    ownershipPercent: 60,
    revenuePercent: 60,
    expensePercent: 60,
    profitPercent: 65, // Agreement formula!
    tripRevenue: 512000,
    eligibleRevenue: 307200,
    sharedExpenses: 182400,
    netDistributableAmount: 208000,
    ownerShare: 135200, // 65% of 208,000
    previousBalance: 277300,
    paidAmount: 135200,
    currentBalance: 277300,
    paymentMethod: 'RTGS / NEFT',
    referenceNumber: 'HDFC-RTGS-8819024',
    status: 'Disbursed',
    ottReminderRef: 'OTT-SETTL-OWN-B-AUG'
  },
  {
    id: 'SETTL-02',
    settlementNumber: 'SETTL-V002-2026-08-E',
    settlementDate: '2026-09-05',
    period: 'August 2026 Monthly Trip Settlement',
    vehicleNumber: 'KL-14-W-8812',
    vehicleCode: 'V002',
    ownerId: 'OWN-E',
    ownerName: 'Owner E (Ershad Mohammed)',
    ownershipPercent: 40,
    revenuePercent: 40,
    expensePercent: 40,
    profitPercent: 35, // Agreement formula!
    tripRevenue: 512000,
    eligibleRevenue: 204800,
    sharedExpenses: 121600,
    netDistributableAmount: 208000,
    ownerShare: 72800, // 35% of 208,000
    previousBalance: 111400,
    paidAmount: 72800,
    currentBalance: 111400,
    paymentMethod: 'RTGS / NEFT',
    referenceNumber: 'CANARA-NEFT-991204',
    status: 'Disbursed',
    ottReminderRef: 'OTT-SETTL-OWN-E-AUG'
  },
  {
    id: 'SETTL-03',
    settlementNumber: 'SETTL-V001-2026-08',
    settlementDate: '2026-09-05',
    period: 'August 2026 Monthly Trip Settlement',
    vehicleNumber: 'KL-14-V-4088',
    vehicleCode: 'V001',
    ownerId: 'OWN-B',
    ownerName: 'Owner B (Basheer Haji)',
    ownershipPercent: 100,
    revenuePercent: 100,
    expensePercent: 100,
    profitPercent: 100,
    tripRevenue: 486000,
    eligibleRevenue: 486000,
    sharedExpenses: 282000,
    netDistributableAmount: 204000,
    ownerShare: 204000,
    previousBalance: 135200,
    paidAmount: 204000,
    currentBalance: 135200,
    paymentMethod: 'RTGS / NEFT',
    referenceNumber: 'HDFC-RTGS-7712091',
    status: 'Disbursed'
  }
];

export const SAMPLE_VEHICLE_DOCUMENTS: VehicleDocument[] = [
  {
    id: 'DOC-01',
    docNumber: 'RC-KL14V4088',
    vehicleNumber: 'KL-14-V-4088',
    category: 'Registration',
    title: 'Registration Certificate (RC Smart Card)',
    fileName: 'RC_KL14V4088_SmartCard.pdf',
    fileFormat: 'PDF',
    fileSize: '1.8 MB',
    issueDate: '2022-02-10',
    status: 'VALID',
    uploadedBy: 'Fleet Admin',
    verified: true
  },
  {
    id: 'DOC-02',
    docNumber: 'INS-KL14V4088-26',
    vehicleNumber: 'KL-14-V-4088',
    category: 'Insurance',
    title: 'Commercial Comprehensive Policy 2026-27',
    fileName: 'ICICI_Lombard_Policy_KL14V4088.pdf',
    fileFormat: 'PDF',
    fileSize: '3.4 MB',
    issueDate: '2026-02-05',
    expiryDate: '2027-02-04',
    status: 'VALID',
    uploadedBy: 'Accounts Officer',
    verified: true
  },
  {
    id: 'DOC-03',
    docNumber: 'PERM-KL14W8812',
    vehicleNumber: 'KL-14-W-8812',
    category: 'Permit',
    title: 'Goods Carriage All-India National Permit',
    fileName: 'National_Permit_KL14W8812.pdf',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    issueDate: '2023-05-01',
    expiryDate: '2026-10-15',
    status: 'EXPIRING_SOON',
    uploadedBy: 'Transport Supervisor',
    verified: true
  },
  {
    id: 'DOC-04',
    docNumber: 'AGR-V002-PARTNERSHIP',
    vehicleNumber: 'KL-14-W-8812',
    category: 'Ownership Agreement',
    title: 'Joint Ownership Agreement (Owner B 60% / Owner E 40%)',
    fileName: 'Vehicle_Partnership_Deed_KL14W8812.pdf',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    issueDate: '2023-04-15',
    status: 'VALID',
    uploadedBy: 'Legal Counsel',
    verified: true
  },
  {
    id: 'DOC-05',
    docNumber: 'PUC-KL60E3310',
    vehicleNumber: 'KL-60-E-3310',
    category: 'Pollution',
    title: 'Pollution Under Control Certificate (PUCC)',
    fileName: 'PUCC_KL60E3310_2026.jpg',
    fileFormat: 'JPG',
    fileSize: '950 KB',
    issueDate: '2026-02-15',
    expiryDate: '2026-08-14',
    status: 'EXPIRED',
    uploadedBy: 'Driver Rajesh',
    verified: false
  },
  {
    id: 'DOC-06',
    docNumber: 'FIN-KL14W8812',
    vehicleNumber: 'KL-14-W-8812',
    category: 'Finance',
    title: 'HDFC Bank Equipment Hypothecation & Sanction Letter',
    fileName: 'HDFC_Loan_Sanction_KL14W8812.pdf',
    fileFormat: 'PDF',
    fileSize: '2.9 MB',
    issueDate: '2023-05-01',
    expiryDate: '2026-04-30',
    status: 'VALID',
    uploadedBy: 'Finance Head',
    verified: true
  }
];

export const FLEET_KPI_SUMMARY = {
  totalVehicles: 38,
  activeVehicles: 32,
  availableVehicles: 4,
  onTripVehicles: 28,
  underMaintenance: 2,
  todayTrips: 46,
  todayLoads: 46,
  todayTripIncome: 486200,
  // Additional requested KPI cards
  fuelCostMonth: 1248000,
  tollCostMonth: 94600,
  driverBattaMonth: 284500,
  maintenanceCostMonth: 342000,
  pendingOwnerSettlement: 894500,
  vehicleFinanceOutstanding: 4820000
};

// Aliases for unified platform exports
export type DispatchLoad = VehicleLoad;
export const DEMO_VEHICLES = SAMPLE_VEHICLES;
export const DEMO_DRIVERS = SAMPLE_DRIVERS;
export const DEMO_OWNERS = SAMPLE_VEHICLE_OWNERS;
export const DEMO_TRIPS = SAMPLE_TRIPS;
export const DEMO_DISPATCH_LOADS = SAMPLE_LOADS;
export const DEMO_DELIVERIES = SAMPLE_DELIVERIES;
export const DEMO_FUEL_RECORDS = SAMPLE_FUEL_RECORDS;
export const DEMO_TOLL_RECORDS = SAMPLE_TOLL_RECORDS;
export const DEMO_BATTA_RECORDS = SAMPLE_BATTA_RECORDS;
export const DEMO_MAINTENANCE_RECORDS = SAMPLE_MAINTENANCE_RECORDS;
export const DEMO_TYRE_RECORDS = SAMPLE_TYRE_RECORDS;
export const DEMO_SETTLEMENTS = SAMPLE_OWNER_SETTLEMENTS;
export const DEMO_DOCUMENTS = SAMPLE_VEHICLE_DOCUMENTS;

