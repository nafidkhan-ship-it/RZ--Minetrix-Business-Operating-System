// RZ® Minetrix BOS Phase 27 Enterprise Mobile Platform & Field Workforce Data

export interface MobileUserRole {
  roleId: string;
  roleName: string;
  userCategory: string;
  offlineCapabilities: string[];
  primaryMobileSuite: string;
  activeUsersCount: number;
  menuPermissions: string[];
  dashboardsAvailable: string[];
}

export interface OfflineSyncQueueItem {
  id: string;
  entityType: 'WEIGHBRIDGE_TICKET' | 'ATTENDANCE_PUNCH' | 'FUEL_DISPENSE' | 'SITE_INSPECTION' | 'FIELD_ORDER' | 'CASH_COLLECTION' | 'DIGITAL_SIGNATURE';
  timestamp: string;
  syncStatus: 'Pending Sync' | 'In-Flight' | 'Synced' | 'Conflict Resolved';
  offlineStorageKey: string;
  payloadSummary: string;
  gpsCoordinates: string;
}

export interface FieldOperationInspection {
  id: string;
  inspectionType: 'Machine Safety' | 'Vehicle Trip Closing' | 'Quarry Pit Face' | 'Customer Site Visit' | 'Wearable Sensor Check';
  operatorName: string;
  equipmentCode: string;
  geoFenceLocation: string;
  photoProofUrl: string;
  voiceNoteDurationSec: number;
  aiOcrVerified: boolean;
  timestamp: string;
}

export interface DigitalIdentityCard {
  id: string;
  holderName: string;
  roleTitle: string;
  idType: 'Employee' | 'Driver' | 'Operator' | 'Dealer' | 'Supplier' | 'Contractor';
  qrEncryptedToken: string;
  nfcStatus: 'Active' | 'Ready' | 'Blocked';
  emergencyContact: string;
  bloodGroup: string;
  medicalInfo: string;
  validUntil: string;
}

export interface MobileWalletAccount {
  id: string;
  holderName: string;
  walletType: 'Salary Wallet' | 'Trip Earnings' | 'Expense Wallet' | 'Incentive Wallet' | 'Weekly Wage Wallet';
  balanceInr: number;
  lastPayoutDate: string;
  pendingClaimsCount: number;
  upiId: string;
}

export interface RegisteredMdmDevice {
  deviceId: string;
  deviceName: string;
  ownerName: string;
  deviceType: 'Android Rugged' | 'Industrial Tablet' | 'Smart Watch' | 'iOS Handheld';
  batteryPercent: number;
  networkStatus: '5G Online' | '4G LTE' | 'Offline Mesh' | 'WiFi';
  complianceStatus: 'Compliant' | 'Pending Update' | 'Root Check Passed';
  appVersion: string;
  lastSyncTimestamp: string;
}

export interface MobileCommunicationMessage {
  id: string;
  senderName: string;
  channel: 'WhatsApp' | 'Push Alert' | 'Emergency Broadcast' | 'Internal Team Chat';
  messageText: string;
  timestamp: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  recipientCount: number;
}

export interface LiveCommandCenterItem {
  id: string;
  entityName: string;
  category: 'Workforce' | 'Tipper Vehicle' | 'Excavator/Crusher' | 'Quarry Pit' | 'Customer Visit';
  gpsLocation: string;
  status: 'Active Operating' | 'In Transit' | 'Idle' | 'Offline Cache Mode';
  aiInsight: string;
  speedKmh?: number;
}

export interface ModularPluginItem {
  pluginId: string;
  moduleName: string;
  category: string;
  downloadSizeMb: number;
  status: 'Installed' | 'Available for Download' | 'Update Pending' | 'Tenant Disabled';
  version: string;
}

export interface DigitalTwinEntity {
  id: string;
  entityName: string;
  type: 'Quarry Pit' | 'Crusher Plant' | 'Tipper Vehicle' | 'Excavator' | 'Workforce Group' | 'Stockpile Yard';
  status: 'Operational' | 'Optimal Yield' | 'In Transit' | 'Maintenance Required' | 'Offline Mesh';
  liveGps: string;
  metricsSummary: string;
  model3dAsset: string;
}

export interface SmartCameraAiDetection {
  id: string;
  cameraName: string;
  detectionType: 'Stone Counting AI' | 'ANPR License Plate' | 'Machine Damage' | 'PPE & Helmet Check' | 'Crack Detection' | 'Inventory Counting';
  confidenceScore: number;
  detectedResult: string;
  status: 'VERIFIED' | 'WARNING_ALERT' | 'COMPLIANT';
  timestamp: string;
}

export interface SmartWeighbridgeSlip {
  slipId: string;
  vehicleNumber: string;
  driverName: string;
  materialType: string;
  grossWeightMt: number;
  tareWeightMt: number;
  netWeightMt: number;
  qrSlipToken: string;
  cameraSnapshotUrl: string;
  syncStatus: 'Stored Offline' | 'Synced to Cloud';
  timestamp: string;
}

export interface DroneMissionItem {
  missionId: string;
  quarrySiteName: string;
  droneModel: string;
  surveyType: 'Stockpile Volume 3D' | 'Pit Wall Stability Mapping' | 'Topographical GPS Survey';
  estimatedVolumeCuM: number;
  orthomosaicStatus: 'Photo Stitching Ready' | 'Uploading Telemetry' | 'Completed';
  timestamp: string;
}

export interface EmergencyResponseAlert {
  alertId: string;
  initiatorName: string;
  alertType: 'SOS Button Trigger' | 'Medical Alert' | 'Quarry Blast Emergency Broadcast' | 'Equipment Incident';
  gpsCoordinates: string;
  status: 'CRITICAL_ACTIVE' | 'RESPONDERS_DISPATCHED' | 'RESOLVED';
  respondersAssigned: number;
  timestamp: string;
}

export interface ExecutiveBriefingItem {
  executiveRole: 'CEO App' | 'COO App' | 'CFO App' | 'Operations Head App' | 'Regional Manager App';
  executiveName: string;
  kpiSummary: string;
  aiDailyBriefingText: string;
  emergencyAlertCount: number;
  revenueRunRateInrCr: number;
}

export interface FutureTechCapability {
  platformName: string;
  technologyCategory: 'Android Auto' | 'Apple CarPlay' | 'Wear OS / Apple Watch' | 'AR / VR Support' | 'Satellite & 5G Edge';
  status: 'Production Ready' | 'Active Telemetry' | 'Edge AI Deployed';
  useCaseDescription: string;
}

export interface MobileFeatureModule {
  moduleId: number;
  moduleTitle: string;
  category: string;
  description: string;
  hardwareHooks: string[];
  offlineModeSupported: boolean;
}

export interface Phase27MobileMetrics {
  totalRegisteredMobileDevices: number;
  offlineSyncSuccessRatePercent: number;
  activeFieldWorkforceUsers: number;
  dailyVoiceCommandsProcessed: number;
  cameraOcrTicketsScannedDaily: number;
  avgOfflineSyncLatencyMs: number;
  totalDigitalIdsIssued: number;
  activeMobileWalletsCount: number;
  dailyUpiCollectionsInr: number;
  mdmCompliantDevicesPercent: number;
  activeDigitalTwinEntities: number;
  dailyAiVisionScans: number;
  droneSurveysCompleted: number;
  emergencySosResponseAvgMin: number;
}

export const MOCK_MOBILE_ROLES: MobileUserRole[] = [
  {
    roleId: 'role-1',
    roleName: 'Machine & Crusher Operator',
    userCategory: 'Field Workforce',
    offlineCapabilities: ['Machine Hours Log', 'Diesel Fuel Entry', 'Safety Checklists', 'Voice Notes'],
    primaryMobileSuite: 'Mobile Mining & Heavy Equipment',
    activeUsersCount: 1420,
    menuPermissions: ['Pit Operations', 'Fuel Log', 'Safety Checklist', 'Voice Assistant'],
    dashboardsAvailable: ['Equipment Operator Dashboard']
  },
  {
    roleId: 'role-2',
    roleName: 'Tipper & Fleet Driver',
    userCategory: 'Fleet Logistics',
    offlineCapabilities: ['Offline Gate Pass', 'GPS Trip Start/End', 'Proof of Delivery (POD)', 'Voice SOS'],
    primaryMobileSuite: 'Mobile Fleet & Trip Logistics',
    activeUsersCount: 3850,
    menuPermissions: ['My Trips', 'GPS Route Navigator', 'Digital POD', 'Fuel Expense Log', 'Driver Wallet'],
    dashboardsAvailable: ['Driver Earnings & Trip Dashboard']
  },
  {
    roleId: 'role-3',
    roleName: 'Quarry Owner & Mine Manager',
    userCategory: 'Executive & Management',
    offlineCapabilities: ['Offline Dashboard Cache', 'Voice AI Queries', 'Emergency Approval Override'],
    primaryMobileSuite: 'Super Mobile App Executive Command',
    activeUsersCount: 320,
    menuPermissions: ['Pit Live Monitoring', 'Production Yield', 'Cash Receipts', 'Approval Center', 'AI Copilot'],
    dashboardsAvailable: ['Quarry Owner Master Dashboard', 'Operations KPI Dashboard']
  },
  {
    roleId: 'role-4',
    roleName: 'Field Sales & CRM Executive',
    userCategory: 'Commercial',
    offlineCapabilities: ['Offline Lead Capture', 'GPS Customer Visit Check-in', 'Digital Signature Quote'],
    primaryMobileSuite: 'Mobile CRM & Order Booking',
    activeUsersCount: 890,
    menuPermissions: ['Leads & Deals', 'Customer GPS Visit', 'Instant Quotation', 'Collection Receipt'],
    dashboardsAvailable: ['Sales Territory & Pipeline Dashboard']
  },
  {
    roleId: 'role-5',
    roleName: 'Building Material Dealer & Contractor',
    userCategory: 'Ecosystem Partner',
    offlineCapabilities: ['Cart Booking', 'Spot Price Check', 'Vehicle Rental Request', 'Material Tracking'],
    primaryMobileSuite: 'Mobile Building Materials & Marketplace',
    activeUsersCount: 4210,
    menuPermissions: ['Order Aggregate', 'Rent Equipment', 'Hire Driver', 'Live Truck Tracking'],
    dashboardsAvailable: ['Dealer Procurement & Wallet Dashboard']
  },
  {
    roleId: 'role-6',
    roleName: 'Customer (B2B / Retail)',
    userCategory: 'End User',
    offlineCapabilities: ['Cached Orders', 'Download Tax Invoices', 'Live Order Status'],
    primaryMobileSuite: 'Customer Portal Mobile Skin',
    activeUsersCount: 6800,
    menuPermissions: ['Order Materials', 'Track Delivery', 'UPI Payment', 'Support Chat'],
    dashboardsAvailable: ['Customer Purchases & Order Tracking']
  },
  {
    roleId: 'role-7',
    roleName: 'Employee (Corporate / Staff)',
    userCategory: 'Internal Staff',
    offlineCapabilities: ['Geofenced Attendance', 'Leave Application', 'Payslip PDF Download'],
    primaryMobileSuite: 'Mobile HRMS & ESS',
    activeUsersCount: 2150,
    menuPermissions: ['Biometric Punch', 'My Salary Wallet', 'Expense Reimbursement', 'Digital ID'],
    dashboardsAvailable: ['Employee Self Service (ESS)']
  },
  {
    roleId: 'role-8',
    roleName: 'Supervisor (Site & Pit)',
    userCategory: 'Field Operations',
    offlineCapabilities: ['Bulk Attendance Punch', 'Safety Inspection Forms', 'Voice Memos'],
    primaryMobileSuite: 'Site Supervision & Quality',
    activeUsersCount: 480,
    menuPermissions: ['Shift Roster', 'Field Inspection', 'Stockyard Audit', 'Dispatch Approval'],
    dashboardsAvailable: ['Pit Supervisor Live Command']
  },
  {
    roleId: 'role-9',
    roleName: 'Supplier (Spares & Explosives)',
    userCategory: 'Vendor Partner',
    offlineCapabilities: ['PO Acknowledgement', 'Delivery Note Upload', 'Invoice Submission'],
    primaryMobileSuite: 'Supplier Procurement Mobile',
    activeUsersCount: 310,
    menuPermissions: ['Purchase Orders', 'Dispatch Goods', 'Payment Status', 'Quality Certificates'],
    dashboardsAvailable: ['Supplier Delivery & Wallet']
  },
  {
    roleId: 'role-10',
    roleName: 'Fleet Owner (Transporter Partner)',
    userCategory: 'Fleet Partner',
    offlineCapabilities: ['Vehicle Roster Log', 'Fuel Pass Offline', 'Trip Settlements'],
    primaryMobileSuite: 'Fleet Owner Partner Portal',
    activeUsersCount: 520,
    menuPermissions: ['My Truck Fleet', 'Driver Roster', 'Trip Revenues', 'Maintenance Alerts'],
    dashboardsAvailable: ['Fleet Owner Revenue & Trip Dashboard']
  },
  {
    roleId: 'role-11',
    roleName: 'Executive CEO / C-Suite',
    userCategory: 'C-Suite Executive',
    offlineCapabilities: ['Offline Executive Summary', 'Voice AI Query', 'Biometric Override'],
    primaryMobileSuite: 'Executive Mobile Command Center',
    activeUsersCount: 45,
    menuPermissions: ['Enterprise P&L', 'Real-Time Map', 'AI Risk Radar', 'Emergency Broadcast'],
    dashboardsAvailable: ['CEO Master Mobile Command Dashboard']
  },
  {
    roleId: 'role-12',
    roleName: 'Super Admin & MDM Controller',
    userCategory: 'System Administration',
    offlineCapabilities: ['Remote Wipe Token', 'MDM Audit Log', 'System Health Cache'],
    primaryMobileSuite: 'Mobile Enterprise Admin & MDM',
    activeUsersCount: 18,
    menuPermissions: ['Device Registration', 'App Store Controls', 'Remote Lock/Wipe', 'Security Logs'],
    dashboardsAvailable: ['MDM & Mobile Security Dashboard']
  }
];

export const MOCK_OFFLINE_SYNC_QUEUE: OfflineSyncQueueItem[] = [
  {
    id: 'SYNC-88102',
    entityType: 'WEIGHBRIDGE_TICKET',
    timestamp: '2026-08-07 08:42:10',
    syncStatus: 'Synced',
    offlineStorageKey: 'sqlite_wb_tickets_88102',
    payloadSummary: 'Gross Weight: 48.2 MT • Tipper RJ-06-GB-8821 • Quarry Pit #1',
    gpsCoordinates: '25.3478° N, 74.6392° E'
  },
  {
    id: 'SYNC-88103',
    entityType: 'ATTENDANCE_PUNCH',
    timestamp: '2026-08-07 08:45:02',
    syncStatus: 'Pending Sync',
    offlineStorageKey: 'sqlite_hrms_punch_9912',
    payloadSummary: 'Geofenced Biometric Face Punch • Sukhwinder Singh (Driver)',
    gpsCoordinates: '25.3481° N, 74.6389° E'
  },
  {
    id: 'SYNC-88104',
    entityType: 'FUEL_DISPENSE',
    timestamp: '2026-08-07 08:49:50',
    syncStatus: 'Pending Sync',
    offlineStorageKey: 'sqlite_fuel_disp_4412',
    payloadSummary: '180 Litres High-Speed Diesel • Excavator CAT-349D',
    gpsCoordinates: '25.3465° N, 74.6410° E'
  },
  {
    id: 'SYNC-88105',
    entityType: 'SITE_INSPECTION',
    timestamp: '2026-08-07 08:52:14',
    syncStatus: 'Synced',
    offlineStorageKey: 'sqlite_inspect_1102',
    payloadSummary: 'Crusher Belt Tension OK • Voice Note Attached (14s) • Photo Verified',
    gpsCoordinates: '25.3490° N, 74.6355° E'
  },
  {
    id: 'SYNC-88106',
    entityType: 'CASH_COLLECTION',
    timestamp: '2026-08-07 08:55:30',
    syncStatus: 'Pending Sync',
    offlineStorageKey: 'sqlite_cash_rec_1002',
    payloadSummary: 'Cash Receipt ₹45,000 • Customer: Apex Infra Pvt Ltd • Offline Receipt #RCP-9921',
    gpsCoordinates: '25.3501° N, 74.6321° E'
  }
];

export const MOCK_FIELD_INSPECTIONS: FieldOperationInspection[] = [
  {
    id: 'INSP-2026-01',
    inspectionType: 'Machine Safety',
    operatorName: 'Ramesh Kumar',
    equipmentCode: 'EXC-CAT-349D',
    geoFenceLocation: 'Bhilwara Pit Block C',
    photoProofUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    voiceNoteDurationSec: 18,
    aiOcrVerified: true,
    timestamp: '2026-08-07 08:15:00'
  },
  {
    id: 'INSP-2026-02',
    inspectionType: 'Vehicle Trip Closing',
    operatorName: 'Sukhwinder Singh',
    equipmentCode: 'TIPPER-RJ-06-GB-8821',
    geoFenceLocation: 'Chittorgarh Stockyard Gate #2',
    photoProofUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    voiceNoteDurationSec: 12,
    aiOcrVerified: true,
    timestamp: '2026-08-07 08:30:22'
  }
];

export const MOCK_DIGITAL_IDS: DigitalIdentityCard[] = [
  {
    id: 'DID-2026-091',
    holderName: 'Sukhwinder Singh',
    roleTitle: 'Heavy Tipper Lead Driver',
    idType: 'Driver',
    qrEncryptedToken: 'rz_did_v2_99281a8b7c6d',
    nfcStatus: 'Active',
    emergencyContact: '+91 98290-11234 (Wife)',
    bloodGroup: 'O+ Positive',
    medicalInfo: 'Heavy Commercial Driving License Valid till 2031 • Annual Eye Test OK',
    validUntil: '2027-12-31'
  },
  {
    id: 'DID-2026-092',
    holderName: 'Ramesh Kumar',
    roleTitle: 'Excavator & Crusher Operator',
    idType: 'Operator',
    qrEncryptedToken: 'rz_did_v2_44120x9921',
    nfcStatus: 'Active',
    emergencyContact: '+91 94140-55412 (Brother)',
    bloodGroup: 'B+ Positive',
    medicalInfo: 'Industrial Safety Level 3 Certified • No Asthma',
    validUntil: '2027-12-31'
  }
];

export const MOCK_MOBILE_WALLETS: MobileWalletAccount[] = [
  {
    id: 'WAL-001',
    holderName: 'Sukhwinder Singh',
    walletType: 'Trip Earnings',
    balanceInr: 14850,
    lastPayoutDate: '2026-08-01',
    pendingClaimsCount: 2,
    upiId: 'sukhwinder@paytm'
  },
  {
    id: 'WAL-002',
    holderName: 'Ramesh Kumar',
    walletType: 'Weekly Wage Wallet',
    balanceInr: 8900,
    lastPayoutDate: '2026-08-05',
    pendingClaimsCount: 1,
    upiId: 'ramesh.operator@upi'
  }
];

export const MOCK_REGISTERED_DEVICES: RegisteredMdmDevice[] = [
  {
    deviceId: 'MDM-DEV-9921',
    deviceName: 'Samsung Galaxy XCover 6 Pro',
    ownerName: 'Sukhwinder Singh (Driver)',
    deviceType: 'Android Rugged',
    batteryPercent: 88,
    networkStatus: '5G Online',
    complianceStatus: 'Compliant',
    appVersion: 'v27.4.2-prod',
    lastSyncTimestamp: '2 mins ago'
  },
  {
    deviceId: 'MDM-DEV-9922',
    deviceName: 'Honeywell ScanPal EDA52',
    ownerName: 'Bhilwara Pit Gate #1 Terminal',
    deviceType: 'Industrial Tablet',
    batteryPercent: 94,
    networkStatus: 'WiFi',
    complianceStatus: 'Compliant',
    appVersion: 'v27.4.2-prod',
    lastSyncTimestamp: '1 min ago'
  }
];

export const MOCK_COMMUNICATION_MESSAGES: MobileCommunicationMessage[] = [
  {
    id: 'MSG-77102',
    senderName: 'Quarry Control Tower',
    channel: 'Emergency Broadcast',
    messageText: 'CRITICAL: Scheduled Pit Blast at Block B at 11:30 AM. All personnel clear 500m radius immediately!',
    timestamp: '2026-08-07 08:50:00',
    priority: 'CRITICAL',
    recipientCount: 420
  },
  {
    id: 'MSG-77103',
    senderName: 'Dispatch Manager',
    channel: 'WhatsApp',
    messageText: 'Dispatch Order #DO-9921 assigned to Tipper RJ-06-GB-8821. Route optimized via NH-79.',
    timestamp: '2026-08-07 08:45:12',
    priority: 'HIGH',
    recipientCount: 1
  }
];

export const MOCK_LIVE_COMMAND_CENTER: LiveCommandCenterItem[] = [
  {
    id: 'CMD-101',
    entityName: 'Excavator CAT-349D',
    category: 'Excavator/Crusher',
    gpsLocation: 'Bhilwara Pit Block C (25.3478° N, 74.6392° E)',
    status: 'Active Operating',
    aiInsight: 'Hydraulic temperature optimal (72°C). Fuel consumption 32.4 L/hr within efficient band.'
  },
  {
    id: 'CMD-102',
    entityName: 'Tipper RJ-06-GB-8821',
    category: 'Tipper Vehicle',
    gpsLocation: 'En Route to Chittorgarh (Speed: 52 km/h)',
    status: 'In Transit',
    speedKmh: 52,
    aiInsight: 'Estimated ETA to Stockyard #2: 18 mins. Geofence breach risk: Zero.'
  }
];

export const MOCK_MODULAR_PLUGINS: ModularPluginItem[] = [
  { pluginId: 'PLG-01', moduleName: 'Mining Module', category: 'Core Operations', downloadSizeMb: 14.2, status: 'Installed', version: 'v27.4.2' },
  { pluginId: 'PLG-02', moduleName: 'Fleet Module', category: 'Logistics', downloadSizeMb: 18.5, status: 'Installed', version: 'v27.4.2' },
  { pluginId: 'PLG-03', moduleName: 'Building Materials Module', category: 'Inventory', downloadSizeMb: 12.0, status: 'Installed', version: 'v27.4.1' },
  { pluginId: 'PLG-04', moduleName: 'Finance & Payments Module', category: 'Fintech', downloadSizeMb: 9.8, status: 'Installed', version: 'v27.4.2' },
  { pluginId: 'PLG-05', moduleName: 'HRMS Module', category: 'Workforce', downloadSizeMb: 11.4, status: 'Installed', version: 'v27.4.0' },
  { pluginId: 'PLG-06', moduleName: 'CRM Module', category: 'Commercial', downloadSizeMb: 15.1, status: 'Installed', version: 'v27.4.2' },
  { pluginId: 'PLG-07', moduleName: 'Marketplace Module', category: 'Ecosystem', downloadSizeMb: 22.4, status: 'Available for Download', version: 'v27.5.0-beta' },
  { pluginId: 'PLG-08', moduleName: 'Offline AI Copilot Module', category: 'Edge AI', downloadSizeMb: 45.0, status: 'Update Pending', version: 'v27.4.3' }
];

export const MOCK_DIGITAL_TWIN: DigitalTwinEntity[] = [
  {
    id: 'DT-101',
    entityName: 'Bhilwara Quarry Pit Block-A',
    type: 'Quarry Pit',
    status: 'Optimal Yield',
    liveGps: '25.3478° N, 74.6392° E',
    metricsSummary: 'Rock Excavation: 1,420 MT/day • Blasting Vector Clear • Seismic Normal',
    model3dAsset: 'bhilwara_pit_block_a_v3.gltf'
  },
  {
    id: 'DT-102',
    entityName: 'Primary Jaw Crusher Unit #1',
    type: 'Crusher Plant',
    status: 'Operational',
    liveGps: '25.3482° N, 74.6385° E',
    metricsSummary: 'Feed Rate: 280 MT/hr • Motor Temp: 68°C • Belt Speed: 2.4 m/s',
    model3dAsset: 'primary_jaw_crusher_u1.gltf'
  },
  {
    id: 'DT-103',
    entityName: 'Heavy Tipper Fleet (18 Trucks)',
    type: 'Tipper Vehicle',
    status: 'In Transit',
    liveGps: 'NH-79 Corridor (En Route Chittorgarh)',
    metricsSummary: 'Average Speed: 48 km/h • Diesel Efficiency: 3.8 km/L • Total Payload: 720 MT',
    model3dAsset: 'tipper_fleet_cluster.gltf'
  },
  {
    id: 'DT-104',
    entityName: 'Central Aggregates Stockpile Yard',
    type: 'Stockpile Yard',
    status: 'Optimal Yield',
    liveGps: '25.3510° N, 74.6311° E',
    metricsSummary: 'Total Volume: 42,800 CuM • 20mm GSB: 18,200 MT • M-Sand: 14,100 MT',
    model3dAsset: 'stockpile_yard_master.gltf'
  }
];

export const MOCK_CAMERA_AI_DETECTIONS: SmartCameraAiDetection[] = [
  {
    id: 'CAM-AI-001',
    cameraName: 'Gate #1 ANPR Camera',
    detectionType: 'ANPR License Plate',
    confidenceScore: 99.4,
    detectedResult: 'Vehicle RJ-06-GB-8821 verified. Matched Active Gate Pass #GP-99201.',
    status: 'VERIFIED',
    timestamp: '2026-08-07 09:01:12'
  },
  {
    id: 'CAM-AI-002',
    cameraName: 'Crusher Conveyor Belt AI Scanner',
    detectionType: 'Stone Counting AI',
    confidenceScore: 98.2,
    detectedResult: 'Aggregate Grain Distribution: 62% 20mm, 28% 10mm, 10% Dust. Oversize Stone Alert: None.',
    status: 'COMPLIANT',
    timestamp: '2026-08-07 09:02:45'
  },
  {
    id: 'CAM-AI-003',
    cameraName: 'Quarry Pit Face AI Camera',
    detectionType: 'PPE & Helmet Check',
    confidenceScore: 97.8,
    detectedResult: '12 Field Workers Scanned • 1 Worker missing safety high-vis vest in Sector 3.',
    status: 'WARNING_ALERT',
    timestamp: '2026-08-07 09:03:10'
  },
  {
    id: 'CAM-AI-004',
    cameraName: 'Excavator Boom Arm Camera',
    detectionType: 'Crack Detection',
    confidenceScore: 96.5,
    detectedResult: 'Hydraulic Hose Wear Normal • Micro-Crack Inspection: 0.02mm (Safe Limit).',
    status: 'COMPLIANT',
    timestamp: '2026-08-07 09:04:00'
  }
];

export const MOCK_WEIGHBRIDGE_SLIPS: SmartWeighbridgeSlip[] = [
  {
    slipId: 'WB-SLIP-9921',
    vehicleNumber: 'RJ-06-GB-8821',
    driverName: 'Sukhwinder Singh',
    materialType: '20mm Aggregate Stone',
    grossWeightMt: 48.25,
    tareWeightMt: 16.10,
    netWeightMt: 32.15,
    qrSlipToken: 'rz_wb_slip_2026_9921_valid',
    cameraSnapshotUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    syncStatus: 'Stored Offline',
    timestamp: '2026-08-07 09:05:00'
  }
];

export const MOCK_DRONE_MISSIONS: DroneMissionItem[] = [
  {
    missionId: 'DRONE-MSN-2026-08',
    quarrySiteName: 'Bhilwara Central Pit',
    droneModel: 'DJI Matrice 300 RTK',
    surveyType: 'Stockpile Volume 3D',
    estimatedVolumeCuM: 42800,
    orthomosaicStatus: 'Photo Stitching Ready',
    timestamp: '2026-08-07 08:30:00'
  }
];

export const MOCK_EMERGENCY_ALERTS: EmergencyResponseAlert[] = [
  {
    alertId: 'EMG-911-01',
    initiatorName: 'Pit Supervisor (Block B)',
    alertType: 'Quarry Blast Emergency Broadcast',
    gpsCoordinates: '25.3478° N, 74.6392° E',
    status: 'RESPONDERS_DISPATCHED',
    respondersAssigned: 12,
    timestamp: '2026-08-07 08:50:00'
  }
];

export const MOCK_EXECUTIVE_BRIEFINGS: ExecutiveBriefingItem[] = [
  {
    executiveRole: 'CEO App',
    executiveName: 'Rajesh Sharma (CEO)',
    kpiSummary: 'Daily Revenue Run-rate: ₹1.42 Cr • Pit Yield: 18,400 MT • Zero Safety Incidents',
    aiDailyBriefingText: 'Good morning CEO. All 4 Quarry Pits operating at 98.4% target capacity. Aggregates demand in Chittorgarh & Jaipur corridors up 14%. Margin per MT stands at ₹245.',
    emergencyAlertCount: 0,
    revenueRunRateInrCr: 1.42
  },
  {
    executiveRole: 'COO App',
    executiveName: 'Vikramaditya Singh (COO)',
    kpiSummary: 'Active Tipper Fleet: 94% Operational • Crusher Downtime: 0 mins • Diesel Efficiency: +2.8%',
    aiDailyBriefingText: 'Operations optimal. Jaw Crusher #2 maintenance completed 15 mins ahead of schedule. Stockpile 20mm reserves sufficient for 8 days of customer dispatch.',
    emergencyAlertCount: 1,
    revenueRunRateInrCr: 1.42
  },
  {
    executiveRole: 'CFO App',
    executiveName: 'Ananya Roy (CFO)',
    kpiSummary: 'Daily Cash Collections: ₹48.5 Lakh • Outstanding Receivables: ₹2.1 Cr • Fuel Costs -4.2%',
    aiDailyBriefingText: 'Financial summary: Instant UPI collections hit record ₹48.5L today. Cash flow positive with working capital ratio at 1.85.',
    emergencyAlertCount: 0,
    revenueRunRateInrCr: 1.42
  }
];

export const MOCK_FUTURE_TECH_CAPABILITIES: FutureTechCapability[] = [
  {
    platformName: 'Android Auto & Apple CarPlay Integration',
    technologyCategory: 'Android Auto',
    status: 'Production Ready',
    useCaseDescription: 'In-vehicle dashboard projection for Tipper drivers with voice-guided quarry navigation & live gate pass alerts.'
  },
  {
    platformName: 'Wear OS & Apple Watch Companion App',
    technologyCategory: 'Wear OS / Apple Watch',
    status: 'Active Telemetry',
    useCaseDescription: 'Wrist vibration emergency blast alerts, biometrics heart-rate fatigue monitoring, and quick attendance tap.'
  },
  {
    platformName: 'Augmented Reality (AR) Stockpile Volume Mesh',
    technologyCategory: 'AR / VR Support',
    status: 'Production Ready',
    useCaseDescription: 'Mobile camera overlay showing 3D wireframe mesh and instant volumetric cubic meter calculations in real-time.'
  },
  {
    platformName: 'Satellite Comm & 5G Edge Computing',
    technologyCategory: 'Satellite & 5G Edge',
    status: 'Edge AI Deployed',
    useCaseDescription: 'Direct-to-satellite messaging fallback for ultra-remote quarry pits without cellular connectivity.'
  }
];

export const MOCK_PHASE27_MODULES: MobileFeatureModule[] = [
  {
    moduleId: 1,
    moduleTitle: 'Super Mobile App Architecture',
    category: 'Ecosystem Core',
    description: 'Single Flutter codebase providing role-based dynamic UI skins for all 15 enterprise personas with zero code duplication.',
    hardwareHooks: ['Biometric Auth', 'Secure Storage', 'Dynamic Theme Engine'],
    offlineModeSupported: true
  },
  {
    moduleId: 2,
    moduleTitle: 'Offline Platform & Sync Engine',
    category: 'Data & Storage',
    description: 'WatermelonDB / SQLite local transactional store with transactional outbox queue, background sync worker & CRDT conflict resolution.',
    hardwareHooks: ['Background Worker', 'SQLite Storage', 'Network State Listener'],
    offlineModeSupported: true
  },
  {
    moduleId: 3,
    moduleTitle: 'Field Workforce Operations',
    category: 'Operations',
    description: 'Geotagged inspections, voice notes recording, machine hours logger, and site visit validation.',
    hardwareHooks: ['GPS Receiver', 'Microphone', 'High-Res Camera'],
    offlineModeSupported: true
  },
  {
    moduleId: 4,
    moduleTitle: 'Mobile CRM & Field Order Booking',
    category: 'Commercial',
    description: 'GPS customer visit check-in, instant quotation engine, digital touch signature capture, and offline lead pipeline.',
    hardwareHooks: ['Touch Screen Canvas', 'GPS Tracking', 'PDF Generator'],
    offlineModeSupported: true
  },
  {
    moduleId: 5,
    moduleTitle: 'Mobile Mining & Blast/Production',
    category: 'Mining',
    description: 'Stone counting OCR, production entry, loading logs, machine engine hours, and gate pass dispatching directly at quarry pit face.',
    hardwareHooks: ['Camera OCR', 'NFC Gate Tag', 'Bluetooth Weighbridge'],
    offlineModeSupported: true
  },
  {
    moduleId: 6,
    moduleTitle: 'Mobile Fleet & Driver Logistics',
    category: 'Logistics',
    description: 'Trip lifecycle management, live GPS tracking, fuel level sensor sync, digital Proof of Delivery (POD) and driver safety alerts.',
    hardwareHooks: ['OBD2 Bluetooth', 'Background GPS', 'Accelerometers'],
    offlineModeSupported: true
  },
  {
    moduleId: 7,
    moduleTitle: 'Mobile Building Materials',
    category: 'Materials',
    description: 'Warehouse stock scanner, dispatch verification, customer material return processing, and inter-yard transfer entry.',
    hardwareHooks: ['2D Barcode Scanner', 'Thermal Printer Bluetooth'],
    offlineModeSupported: true
  },
  {
    moduleId: 8,
    moduleTitle: 'Mobile HRMS & Digital ID',
    category: 'Human Capital',
    description: 'Geofenced biometric facial attendance, digital employee ID card with encrypted QR, leave requests, and mobile pay slips.',
    hardwareHooks: ['Front Camera ML-Kit', 'NFC ID Badge', 'Secure Enclave'],
    offlineModeSupported: true
  },
  {
    moduleId: 9,
    moduleTitle: 'Mobile Marketplace & Load Exchange',
    category: 'Marketplace',
    description: 'B2B order booking for aggregate, tipper rental marketplace, driver-for-hire, and real-time in-app chat.',
    hardwareHooks: ['WebSockets', 'Push Notifications', 'Razorpay SDK'],
    offlineModeSupported: false
  },
  {
    moduleId: 10,
    moduleTitle: 'Voice Platform & Speech Engine',
    category: 'Voice AI',
    description: 'Multi-lingual voice command engine (Hindi, English, Rajasthani, Gujarati) for hands-free driver and operator input.',
    hardwareHooks: ['Microphone DSP', 'Text-To-Speech Synthesizer', 'On-Device Whisper STT'],
    offlineModeSupported: true
  },
  {
    moduleId: 11,
    moduleTitle: 'Camera & Document OCR Platform',
    category: 'Computer Vision',
    description: 'Automated weighbridge ticket OCR scanner, ANPR license plate reader, vehicle damage detection, and document scanner.',
    hardwareHooks: ['Camera Flash', 'Google ML Kit OCR', 'GPU Vision Acceleration'],
    offlineModeSupported: true
  },
  {
    moduleId: 12,
    moduleTitle: 'Push & Emergency Alert Platform',
    category: 'Alerting',
    description: 'Firebase Cloud Messaging (FCM) & Apple Push Notification (APNs) integration for critical quarry blast alerts and approval requests.',
    hardwareHooks: ['FCM / APNs', 'Vibration Motor', 'High Priority Alarm Tone'],
    offlineModeSupported: true
  },
  {
    moduleId: 13,
    moduleTitle: 'GPS Platform & Geofence Tracker',
    category: 'Spatial GPS',
    description: 'High-frequency background location engine with geofence breach alarms, route history player, and speed violation logger.',
    hardwareHooks: ['Fused Location Provider', 'Geofence Manager', 'Battery Optimizer'],
    offlineModeSupported: true
  },
  {
    moduleId: 14,
    moduleTitle: 'AI Mobile Assistant (Gemini Copilot)',
    category: 'Mobile AI',
    description: 'Gemini 2.5 Flash powered field copilot assisting quarry managers with production predictions and voice form filling.',
    hardwareHooks: ['Server-Side Gemini Proxy', 'Streaming Response Reader'],
    offlineModeSupported: false
  },
  {
    moduleId: 15,
    moduleTitle: 'Mobile Device Management (MDM) & Security',
    category: 'Security',
    description: 'Remote device wipe, encrypted SQLite database, jailbreak/root detection, and automatic session revocation.',
    hardwareHooks: ['Hardware Keystore', 'Root Detection Native Plugin'],
    offlineModeSupported: true
  },
  {
    moduleId: 16,
    moduleTitle: 'Full Ecosystem Integration Hub',
    category: 'Integration',
    description: 'Bi-directional sync bridge connecting field mobile apps with all 10 DDD Bounded Contexts, PostgreSQL RLS, and Event Bus.',
    hardwareHooks: ['REST / GraphQL Endpoints', 'gRPC Bridge', 'MQTT Stream'],
    offlineModeSupported: true
  },
  // MODULES 28 THRU 45 (EXTENDED ENTERPRISE MOBILE SUITE)
  {
    moduleId: 28,
    moduleTitle: 'Enterprise Super App (12 Dynamic Role Skins)',
    category: 'Super App',
    description: 'Single Flutter app dynamically changing layouts, menus, and theme skins for Customer, Employee, Driver, Operator, Manager, Dealer, Supplier, etc.',
    hardwareHooks: ['Role Permissions Manager', 'Dynamic Theme Renderer', 'Hot Shell Switcher'],
    offlineModeSupported: true
  },
  {
    moduleId: 29,
    moduleTitle: 'Smart Offline Engine & Isar/SQLite',
    category: 'Offline DB',
    description: 'Local transactional Isar & SQLite store with CRDT vector clocks, incremental outbox queue, and automatic background reconnection sync.',
    hardwareHooks: ['Isar NoSQL Engine', 'SQLite Cipher', 'Background Reconnect Daemon'],
    offlineModeSupported: true
  },
  {
    moduleId: 30,
    moduleTitle: 'Field Productivity & Digital Inspection Platform',
    category: 'Productivity',
    description: 'Geotagged attendance punches, photos, HD video clips, voice memos, digital checklists, and pit/vehicle inspection forms.',
    hardwareHooks: ['Camera HD Video', 'Voice Recorder', 'GPS Geofence', 'Touch Canvas'],
    offlineModeSupported: true
  },
  {
    moduleId: 31,
    moduleTitle: 'Mobile Document Platform & OCR Engine',
    category: 'Vision & Documents',
    description: 'OCR ticket scanner, 2D barcode/QR reader, PDF invoice generator, image compression, touch digital signature, and upload queue.',
    hardwareHooks: ['Google ML Kit', 'PDF Canvas Generator', 'Touch Canvas', 'Image Compressor'],
    offlineModeSupported: true
  },
  {
    moduleId: 32,
    moduleTitle: 'Mobile Communication Hub',
    category: 'Messaging',
    description: 'WhatsApp Business API trigger, automated SMS alerts, FCM push notifications, voice messages, team chat rooms, and emergency blasts.',
    hardwareHooks: ['WhatsApp Webhooks', 'Twilio SMS SDK', 'FCM High Priority Channel'],
    offlineModeSupported: true
  },
  {
    moduleId: 33,
    moduleTitle: 'Smart Device Management (MDM Platform)',
    category: 'MDM',
    description: 'Device registration, health monitoring, battery & network telemetry, remote lock/wipe token, and enforced app version control.',
    hardwareHooks: ['Android Device Admin API', 'iOS MDM Profile', 'Battery Manager API'],
    offlineModeSupported: true
  },
  {
    moduleId: 34,
    moduleTitle: 'Mobile Security & Keystore Vault',
    category: 'Security',
    description: 'Biometric Face/Fingerprint unlock, PIN fallback, SQLCipher hardware encryption, certificate pinning, and jailbreak/root detection.',
    hardwareHooks: ['Biometric Prompt', 'Android Keystore', 'iOS Secure Enclave'],
    offlineModeSupported: true
  },
  {
    moduleId: 35,
    moduleTitle: 'AI Mobile Copilot (Gemini Field Assistant)',
    category: 'Mobile AI',
    description: 'Voice AI assistant, document OCR AI, natural language search over local SQLite, AI voice command filling, and instant translation.',
    hardwareHooks: ['Server-Side Gemini 2.5 Proxy', 'On-Device Whisper STT', 'TTS Synthesizer'],
    offlineModeSupported: false
  },
  {
    moduleId: 36,
    moduleTitle: 'Digital Identity & NFC Smart Cards',
    category: 'Digital Identity',
    description: 'Digital ID cards with encrypted QR codes for drivers, operators, and dealers, with NFC badge support and emergency medical profiles.',
    hardwareHooks: ['NFC Tag Reader/Writer', 'Encrypted QR Generator', 'Secure Wallet'],
    offlineModeSupported: true
  },
  {
    moduleId: 37,
    moduleTitle: 'Mobile Wallet & Trip Earnings Engine',
    category: 'Fintech',
    description: 'Multi-wallet account managing salary, trip earnings, expense reimbursements, driver weekly wage payouts, and incentive rewards.',
    hardwareHooks: ['UPI SDK Integration', 'Encrypted Balance Ledger', 'PDF Voucher Generator'],
    offlineModeSupported: true
  },
  {
    moduleId: 38,
    moduleTitle: 'Field Command Center & Live Tracking',
    category: 'Command Center',
    description: 'Live interactive map displaying active workforce, tipper trucks, quarry excavators, delivery statuses, and AI operational insights.',
    hardwareHooks: ['Mapbox GL Mobile SDK', 'Fused Location Provider', 'WebSocket Stream'],
    offlineModeSupported: true
  },
  {
    moduleId: 39,
    moduleTitle: 'Mobile Analytics & Crash Telemetry',
    category: 'Analytics',
    description: 'Real-time usage telemetry, crash stack reporting, offline sync latency tracking, battery drain profiling, and GPS accuracy audit.',
    hardwareHooks: ['Firebase Crashlytics', 'Performance Monitoring Agent', 'Battery Log Service'],
    offlineModeSupported: true
  },
  {
    moduleId: 40,
    moduleTitle: 'Enterprise App Store & OTA Distribution',
    category: 'App Management',
    description: 'Internal distribution portal with forced mandatory updates, remote feature flags, A/B beta channels, and instant version rollback.',
    hardwareHooks: ['OTA APK In-App Installer', 'Remote Config Service', 'Feature Flag Evaluator'],
    offlineModeSupported: true
  },
  {
    moduleId: 41,
    moduleTitle: 'Wearable & Industrial Rugged Device Support',
    category: 'Industrial Hardware',
    description: 'Support for Zebra/Honeywell rugged devices, smart watch alerts, Bluetooth barcode scanners, portable thermal printers, and RFID.',
    hardwareHooks: ['Bluetooth Serial Port Profile (SPP)', 'ESC/POS Printer Engine', 'NFC/RFID Reader'],
    offlineModeSupported: true
  },
  {
    moduleId: 42,
    moduleTitle: 'Mobile Payment & Cash Collection Platform',
    category: 'Payments',
    description: 'UPI QR code dynamic generation, cash collection logging, instant offline receipt printing, and payment proof photo upload.',
    hardwareHooks: ['Dynamic UPI QR Engine', 'Bluetooth Thermal Printer', 'Encrypted Payment Ledger'],
    offlineModeSupported: true
  },
  {
    moduleId: 43,
    moduleTitle: 'Mobile Executive & Operational Dashboards',
    category: 'Dashboards',
    description: 'Native mobile dashboards for CEO, Operations, Mining, Fleet, Finance, HRMS, and Marketplace with offline chart caching.',
    hardwareHooks: ['Flutter Canvas Charts', 'Local SQLite Chart Cache', 'Haptic Touch Feedback'],
    offlineModeSupported: true
  },
  {
    moduleId: 44,
    moduleTitle: 'Future-Ready Mobility (Edge AI, AR & Drones)',
    category: 'Next-Gen Mobility',
    description: 'Cross-platform Flutter framework ready for Edge AI inference, Augmented Reality stockpile volume estimation, and Drone telemetry.',
    hardwareHooks: ['TensorFlow Lite GPU', 'ARCore / ARKit Engine', 'M300 Drone Telemetry SDK'],
    offlineModeSupported: true
  },
  {
    moduleId: 45,
    moduleTitle: 'Complete Ecosystem Mobile Synchronization Bridge',
    category: 'Ecosystem Bridge',
    description: 'Full bi-directional event synchronization bridge connecting field mobile apps with all 10 DDD Bounded Contexts and PostgreSQL RLS.',
    hardwareHooks: ['PostgreSQL RLS Listener', 'REST/gRPC Endpoint Proxy', 'Kafka/RabbitMQ Event Stream'],
    offlineModeSupported: true
  },
  // FLAGSHIP MODULES 46 THRU 60
  {
    moduleId: 46,
    moduleTitle: 'Super App Modular Platform & Dynamic Plugins',
    category: 'Super App Architecture',
    description: 'Dynamic module download framework supporting Mining, Fleet, Building Materials, Finance, HRMS, CRM, Marketplace, AI & Tenant Plugins.',
    hardwareHooks: ['Flutter Dynamic Plugin Loader', 'Tenant Module Resolver', 'Hot Package Installer'],
    offlineModeSupported: true
  },
  {
    moduleId: 47,
    moduleTitle: 'Digital Twin Mobile Platform',
    category: 'Digital Twin',
    description: 'Live mobile Digital Twin mapping Quarry Pits, Crushers, Tipper Vehicles, Excavators, Workforce Groups, Deliveries, and Stockpile Yards.',
    hardwareHooks: ['3D WebGL / Flutter Canvas', 'Live GPS Vector Stream', 'IoT Sensor Telemetry'],
    offlineModeSupported: true
  },
  {
    moduleId: 48,
    moduleTitle: 'Smart Camera AI Vision Suite',
    category: 'Computer Vision',
    description: 'Edge Computer Vision for Stone Counting, ANPR License Plate, Machine Damage Detection, Safety Helmet & PPE, and Crack Detection.',
    hardwareHooks: ['TensorFlow Lite GPU', 'Google ML Kit', 'Camera High-Speed Capture'],
    offlineModeSupported: true
  },
  {
    moduleId: 49,
    moduleTitle: 'Smart Weighbridge Mobile Station',
    category: 'Weighbridge Mobility',
    description: 'Offline weight entry, dynamic QR weight slips, camera snapshot verification, vehicle verification, and touch digital signature.',
    hardwareHooks: ['Bluetooth Serial Weighbridge', 'Thermal Printer ESC/POS', 'Touch Signature Pad'],
    offlineModeSupported: true
  },
  {
    moduleId: 50,
    moduleTitle: 'Drone Mobile Survey & Mapping Platform',
    category: 'Areal Drone Tech',
    description: 'Mobile control center for drone missions, survey upload, 3D stockpile volume calculation, quarry mapping, and photo stitching.',
    hardwareHooks: ['DJI Mobile SDK', 'Telemetry Receiver', 'Photogrammetry Engine'],
    offlineModeSupported: true
  },
  {
    moduleId: 51,
    moduleTitle: 'Emergency Response & Blast SOS Platform',
    category: 'Safety & Emergency',
    description: 'One-touch SOS button, emergency call dispatch, live GPS share, quarry blast emergency broadcast, and medical alert dashboard.',
    hardwareHooks: ['Hardware Panic Button', 'FCM High Priority Alert', 'Cellular SOS Dispatcher'],
    offlineModeSupported: true
  },
  {
    moduleId: 52,
    moduleTitle: 'Team Collaboration & Field Comms',
    category: 'Collaboration',
    description: 'Internal field chat, voice channels, video meetings, task assignments, file sharing, and site-wide broadcast announcements.',
    hardwareHooks: ['WebRTC Audio/Video', 'WebSocket Chat Stream', 'File Storage Vault'],
    offlineModeSupported: true
  },
  {
    moduleId: 53,
    moduleTitle: 'Field Inspection AI & Compliance',
    category: 'AI Quality Control',
    description: 'Smart inspection checklists, AI inspection assistant, photo proof validation, GPS geo-verification, and compliance scoring.',
    hardwareHooks: ['Camera Vision AI', 'Geofence Validator', 'Compliance Rating Engine'],
    offlineModeSupported: true
  },
  {
    moduleId: 54,
    moduleTitle: 'Offline AI Engine & Knowledge Base',
    category: 'Offline AI',
    description: 'Cached AI knowledge base, offline recommendations, local SQLite search, offline SOP manuals, and offline AI voice form filling.',
    hardwareHooks: ['On-Device SQLite Vector DB', 'Whisper STT Offline', 'Local Search Indexer'],
    offlineModeSupported: true
  },
  {
    moduleId: 55,
    moduleTitle: 'Enterprise Field Dashboards Matrix',
    category: 'Analytics & BI',
    description: 'Mobile native dashboards for Regional, Zone, Branch, Quarry, Fleet, Sales, and HR with real-time AI operational insights.',
    hardwareHooks: ['Flutter Native Charts', 'Local Metric Cache', 'Haptic Drilldown'],
    offlineModeSupported: true
  },
  {
    moduleId: 56,
    moduleTitle: 'Mobile Device Analytics & Health Audit',
    category: 'Device Telemetry',
    description: 'Battery drain analytics, storage utilization, GPS accuracy audit, camera hardware health, offline time, and sync duration metrics.',
    hardwareHooks: ['Battery Manager API', 'Disk Storage Auditor', 'GPS Accuracy Meter'],
    offlineModeSupported: true
  },
  {
    moduleId: 57,
    moduleTitle: 'App Security Center & Shielding',
    category: 'Enterprise Security',
    description: 'Device hardware binding, SSL certificate pinning, tamper detection, root/jailbreak detection, App Shield, and SQLCipher.',
    hardwareHooks: ['Android Keystore', 'iOS Secure Enclave', 'SafetyNet / Play Integrity'],
    offlineModeSupported: true
  },
  {
    moduleId: 58,
    moduleTitle: 'Mobile DevOps & Remote Configuration',
    category: 'Mobile DevOps',
    description: 'Crash stack analytics, performance profiling, remote logging stream, dynamic feature flags, remote debug, and OTA updates.',
    hardwareHooks: ['Firebase Crashlytics', 'Remote Config Service', 'In-App OTA Installer'],
    offlineModeSupported: true
  },
  {
    moduleId: 59,
    moduleTitle: 'Executive Mobile Command Center (C-Suite Apps)',
    category: 'Executive Suite',
    description: 'Dedicated executive mobile apps for CEO, COO, CFO, Operations Head & Regional Managers with daily AI briefings and SOS override.',
    hardwareHooks: ['Executive Biometric Lock', 'AI Summary Synthesizer', 'Voice AI Query'],
    offlineModeSupported: true
  },
  {
    moduleId: 60,
    moduleTitle: 'Future Mobility (CarPlay, Wearables, AR & Satellite)',
    category: 'Future Tech',
    description: 'Android Auto & CarPlay projection, Wear OS / Apple Watch alerts, AR stockpile mesh visualization, 5G edge computing & Satellite fallback.',
    hardwareHooks: ['Android Auto / CarPlay SDK', 'Wear OS / WatchOS Engine', 'ARCore / ARKit', 'Satellite Messaging'],
    offlineModeSupported: true
  }
];

export const MOCK_PHASE27_METRICS: Phase27MobileMetrics = {
  totalRegisteredMobileDevices: 12850,
  offlineSyncSuccessRatePercent: 99.98,
  activeFieldWorkforceUsers: 7890,
  dailyVoiceCommandsProcessed: 34200,
  cameraOcrTicketsScannedDaily: 18600,
  avgOfflineSyncLatencyMs: 310,
  totalDigitalIdsIssued: 8420,
  activeMobileWalletsCount: 6150,
  dailyUpiCollectionsInr: 4850000,
  mdmCompliantDevicesPercent: 99.92,
  activeDigitalTwinEntities: 142,
  dailyAiVisionScans: 8900,
  droneSurveysCompleted: 48,
  emergencySosResponseAvgMin: 1.2
};

