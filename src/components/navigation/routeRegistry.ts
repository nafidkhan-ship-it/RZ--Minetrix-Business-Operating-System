import { SectionId } from '../../types/architecture';
import { RouteDefinition, RoleNavigationPreset, UniversalSearchRecord, QuickActionItem } from './types';

export const ALL_ROUTES_REGISTRY: Record<string, RouteDefinition> = {
  // B. HOME & ALIASES
  '/': {
    path: '/',
    sectionId: 'universal-dashboard',
    label: 'Ecosystem Home',
    category: 'Home',
    description: 'Universal command center and multi-platform dashboard',
    breadcrumbs: [{ label: 'Home' }]
  },
  '/dashboard': {
    path: '/dashboard',
    sectionId: 'universal-dashboard',
    label: 'Ecosystem Home',
    category: 'Home',
    description: 'Universal command center and multi-platform dashboard',
    breadcrumbs: [{ label: 'Home' }]
  },
  '/home': {
    path: '/home',
    sectionId: 'universal-dashboard',
    label: 'Ecosystem Home',
    category: 'Home',
    description: 'Universal command center and multi-platform dashboard',
    breadcrumbs: [{ label: 'Home' }]
  },
  '/10-platforms': {
    path: '/10-platforms',
    sectionId: 'universal-dashboard',
    label: 'All 10 Platforms',
    category: 'Platforms',
    description: 'Complete 10-platform catalog & directory',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '10 Platforms' }]
  },

  // C. 01 — QUARRY
  '/quarry': {
    path: '/quarry',
    sectionId: 'quarry-management',
    label: 'Quarry Management',
    category: 'Platform 01',
    description: 'Mine sites, extraction, land parcels, production & gate pass',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry' }],
    crossPlatformLinks: [
      { label: 'Vehicle Fleet', path: '/vehicle' },
      { label: 'Crusher Plants', path: '/crusher' },
      { label: 'Land Parcels', path: '/land' }
    ]
  },
  '/quarry/dashboard': {
    path: '/quarry/dashboard',
    sectionId: 'quarry-management',
    subtab: 'dashboard',
    label: 'Quarry Dashboard',
    category: 'Platform 01',
    description: 'Live pit extraction KPIs, daily targets & dispatch metrics',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Dashboard' }]
  },
  '/quarry/quarries': {
    path: '/quarry/quarries',
    sectionId: 'quarry-management',
    subtab: 'quarries',
    label: 'Quarry Directory',
    category: 'Platform 01',
    description: 'Active pit licenses, mining permits & concessions',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Quarries' }]
  },
  '/quarry/land-parcels': {
    path: '/quarry/land-parcels',
    sectionId: 'quarry-management',
    subtab: 'parcels',
    label: 'Land Parcels',
    category: 'Platform 01',
    description: 'Survey numbers, acreage & geographical GPS polygons',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Land Parcels' }]
  },
  '/quarry/land-owners': {
    path: '/quarry/land-owners',
    sectionId: 'quarry-management',
    subtab: 'owners',
    label: 'Land Owners',
    category: 'Platform 01',
    description: 'Title holders, leaseholders & royalty beneficiaries',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Land Owners' }]
  },
  '/quarry/partners': {
    path: '/quarry/partners',
    sectionId: 'quarry-management',
    subtab: 'partners',
    label: 'Quarry Partners',
    category: 'Platform 01',
    description: 'Operating partners, profit splits & capital equity',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Partners' }]
  },
  '/quarry/agreements': {
    path: '/quarry/agreements',
    sectionId: 'quarry-management',
    subtab: 'agreements',
    label: 'Mining Agreements',
    category: 'Platform 01',
    description: 'Legal extraction deeds, tenures & notarized pacts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Agreements' }]
  },
  '/quarry/working-areas': {
    path: '/quarry/working-areas',
    sectionId: 'quarry-management',
    subtab: 'working-areas',
    label: 'Working Areas',
    category: 'Platform 01',
    description: 'Active benches, blasting faces & overburden strips',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Working Areas' }]
  },
  '/quarry/production': {
    path: '/quarry/production',
    sectionId: 'quarry-management',
    subtab: 'production',
    label: 'Production Log',
    category: 'Platform 01',
    description: 'Daily cutting, block dressing & cubic meter yields',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Production' }]
  },
  '/quarry/loads': {
    path: '/quarry/loads',
    sectionId: 'quarry-management',
    subtab: 'loads',
    label: 'Quarry Loads',
    category: 'Platform 01',
    description: 'Tipper loads, weighbridge gross/tare & vehicle linking',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Loads' }]
  },
  '/quarry/gate-passes': {
    path: '/quarry/gate-passes',
    sectionId: 'quarry-management',
    subtab: 'gate-pass',
    label: 'Gate Passes',
    category: 'Platform 01',
    description: 'Security exit clearance, transit passes & mineral permits',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Gate Passes' }]
  },
  '/quarry/sales': {
    path: '/quarry/sales',
    sectionId: 'quarry-management',
    subtab: 'sales',
    label: 'Quarry Sales',
    category: 'Platform 01',
    description: 'Direct pithead commercial invoices & debtor dispatch',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Sales' }]
  },
  '/quarry/expenses': {
    path: '/quarry/expenses',
    sectionId: 'quarry-management',
    subtab: 'expenses',
    label: 'Operating Expenses',
    category: 'Platform 01',
    description: 'Diesel, explosives, drill bits, compressor maintenance',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Expenses' }]
  },
  '/quarry/settlements': {
    path: '/quarry/settlements',
    sectionId: 'quarry-management',
    subtab: 'settlements',
    label: 'Partner Settlements',
    category: 'Platform 01',
    description: 'Royalty pay-outs, investor share distribution & net margins',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Settlements' }]
  },
  '/quarry/reports': {
    path: '/quarry/reports',
    sectionId: 'quarry-management',
    subtab: 'reports',
    label: 'Quarry Reports',
    category: 'Platform 01',
    description: 'SEIAA compliance, statutory royalty registers & yield BI',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '01 Quarry', path: '/quarry' }, { label: 'Reports' }]
  },

  // D. 02 — CRUSHER
  '/crusher': {
    path: '/crusher',
    sectionId: 'crusher-management',
    label: 'Crusher Management',
    category: 'Platform 02',
    description: 'Crusher plants, aggregate processing, M-sand & silos',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher' }]
  },
  '/crusher/dashboard': {
    path: '/crusher/dashboard',
    sectionId: 'crusher-management',
    subtab: 'dashboard',
    label: 'Crusher Dashboard',
    category: 'Platform 02',
    description: 'Plant telemetry, TPH production rate & silo inventory',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher', path: '/crusher' }, { label: 'Dashboard' }]
  },
  '/crusher/plants': {
    path: '/crusher/plants',
    sectionId: 'crusher-management',
    subtab: 'plants',
    label: 'Crusher Plants',
    category: 'Platform 02',
    description: 'Primary jaw crushers, cone units & VSI sand lines',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher', path: '/crusher' }, { label: 'Plants' }]
  },
  '/crusher/raw-material': {
    path: '/crusher/raw-material',
    sectionId: 'crusher-management',
    subtab: 'intake',
    label: 'Raw Material Intake',
    category: 'Platform 02',
    description: 'Quarry boulder intake, feed hopper weight & feeder logs',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher', path: '/crusher' }, { label: 'Raw Material' }]
  },
  '/crusher/production': {
    path: '/crusher/production',
    sectionId: 'crusher-management',
    subtab: 'production',
    label: 'Aggregate Production',
    category: 'Platform 02',
    description: 'Fraction yield: 20mm, 10mm, 6mm, M-Sand, P-Sand, GSB',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher', path: '/crusher' }, { label: 'Production' }]
  },
  '/crusher/stock': {
    path: '/crusher/stock',
    sectionId: 'crusher-management',
    subtab: 'stock',
    label: 'Silo & Yard Stock',
    category: 'Platform 02',
    description: 'Current bay tonnage, volumetric stockpile scans & balance',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher', path: '/crusher' }, { label: 'Stock' }]
  },
  '/crusher/sales': {
    path: '/crusher/sales',
    sectionId: 'crusher-management',
    subtab: 'sales',
    label: 'Crusher Sales',
    category: 'Platform 02',
    description: 'Weighbridge commercial outbound billing & gate receipts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher', path: '/crusher' }, { label: 'Sales' }]
  },
  '/crusher/gate-passes': {
    path: '/crusher/gate-passes',
    sectionId: 'crusher-management',
    subtab: 'gate-pass',
    label: 'Crusher Gate Passes',
    category: 'Platform 02',
    description: 'Automated weighbridge gross/tare print vouchers',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher', path: '/crusher' }, { label: 'Gate Passes' }]
  },
  '/crusher/settlements': {
    path: '/crusher/settlements',
    sectionId: 'crusher-management',
    subtab: 'settlements',
    label: 'Crusher Settlements',
    category: 'Platform 02',
    description: 'Investor yields, power bill apportioning & royalty shares',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '02 Crusher', path: '/crusher' }, { label: 'Settlements' }]
  },

  // E. 03 — VEHICLE
  '/vehicle': {
    path: '/vehicle',
    sectionId: 'vehicle-management',
    label: 'Vehicle Management',
    category: 'Platform 03',
    description: 'Heavy tippers, GPS tracking, driver batta, fuel & trips',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle' }]
  },
  '/vehicle/dashboard': {
    path: '/vehicle/dashboard',
    sectionId: 'vehicle-management',
    subtab: 'dashboard',
    label: 'Fleet Dashboard',
    category: 'Platform 03',
    description: 'Live truck map, active haulage trips & fleet fuel burn',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle', path: '/vehicle' }, { label: 'Dashboard' }]
  },
  '/vehicle/vehicles': {
    path: '/vehicle/vehicles',
    sectionId: 'vehicle-management',
    subtab: 'vehicles',
    label: 'Fleet Registry',
    category: 'Platform 03',
    description: 'Multi-axle tippers, transit mixers, tankers & loaders',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle', path: '/vehicle' }, { label: 'Vehicles' }]
  },
  '/vehicle/drivers': {
    path: '/vehicle/drivers',
    sectionId: 'vehicle-management',
    subtab: 'drivers',
    label: 'Driver Management',
    category: 'Platform 03',
    description: 'Commercial heavy licenses, biometric check-in & roster',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle', path: '/vehicle' }, { label: 'Drivers' }]
  },
  '/vehicle/trips': {
    path: '/vehicle/trips',
    sectionId: 'vehicle-management',
    subtab: 'trips',
    label: 'Trip Management',
    category: 'Platform 03',
    description: 'Pit-to-site hauls, turnaround intervals & digital logsheet',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle', path: '/vehicle' }, { label: 'Trips' }]
  },
  '/vehicle/fuel': {
    path: '/vehicle/fuel',
    sectionId: 'vehicle-management',
    subtab: 'fuel',
    label: 'Fuel & Dispensing',
    category: 'Platform 03',
    description: 'Diesel bunk logs, fuel card debits & mileage efficiency',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle', path: '/vehicle' }, { label: 'Fuel' }]
  },
  '/vehicle/driver-batta': {
    path: '/vehicle/driver-batta',
    sectionId: 'vehicle-management',
    subtab: 'batta',
    label: 'Driver Batta & Allowances',
    category: 'Platform 03',
    description: 'Per-trip mileage incentive, meal batta & daily settlement',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle', path: '/vehicle' }, { label: 'Driver Batta' }]
  },
  '/vehicle/maintenance': {
    path: '/vehicle/maintenance',
    sectionId: 'vehicle-management',
    subtab: 'maintenance',
    label: 'Fleet Maintenance',
    category: 'Platform 03',
    description: 'Tyre retreading, engine overhaul, greasing & job cards',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle', path: '/vehicle' }, { label: 'Maintenance' }]
  },
  '/vehicle/settlements': {
    path: '/vehicle/settlements',
    sectionId: 'vehicle-management',
    subtab: 'settlements',
    label: 'Owner Settlements',
    category: 'Platform 03',
    description: 'Hired truck trip accounting, toll deduction & payouts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '03 Vehicle', path: '/vehicle' }, { label: 'Settlements' }]
  },

  // F. 04 — CONTRACT & JOB
  '/jobs': {
    path: '/jobs',
    sectionId: 'contract-job-management',
    label: 'Contract & Job Management',
    category: 'Platform 04',
    description: 'Civil contracts, earthmoving work orders, subcontractor bills',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '04 Contract & Job' }]
  },
  '/jobs/dashboard': {
    path: '/jobs/dashboard',
    sectionId: 'contract-job-management',
    subtab: 'dashboard',
    label: 'Contract Dashboard',
    category: 'Platform 04',
    description: 'Active worksite progress, contract billing & profitability',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '04 Jobs', path: '/jobs' }, { label: 'Dashboard' }]
  },
  '/jobs/work-orders': {
    path: '/jobs/work-orders',
    sectionId: 'contract-job-management',
    subtab: 'orders',
    label: 'Work Orders',
    category: 'Platform 04',
    description: 'Excavation, levelling, road base & foundation contracts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '04 Jobs', path: '/jobs' }, { label: 'Work Orders' }]
  },
  '/jobs/billing': {
    path: '/jobs/billing',
    sectionId: 'contract-job-management',
    subtab: 'billing',
    label: 'Progress Billing',
    category: 'Platform 04',
    description: 'Measurement book (MB), RA bills & retention money',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '04 Jobs', path: '/jobs' }, { label: 'Billing' }]
  },

  // G. 05 — BUILDING MATERIALS E-COMMERCE
  '/commerce': {
    path: '/commerce',
    sectionId: 'building-materials-ecommerce',
    label: 'Building Materials E-Commerce',
    category: 'Platform 05',
    description: 'Direct trade in laterite stone, aggregates, M-sand & cement',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '05 E-Commerce' }]
  },
  '/commerce/laterite': {
    path: '/commerce/laterite',
    sectionId: 'building-materials-ecommerce',
    subtab: 'laterite',
    label: 'Laterite Stone Catalog',
    category: 'Platform 05',
    description: 'Dressed laterite blocks, cut stones & quarry supply',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '05 Commerce', path: '/commerce' }, { label: 'Laterite' }]
  },
  '/commerce/laterite/order': {
    path: '/commerce/laterite/order',
    sectionId: 'building-materials-ecommerce',
    subtab: 'laterite-order',
    label: 'Instant Laterite Booking',
    category: 'Platform 05',
    description: 'Priority CTA: Order dressed laterite stone with direct dispatch',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '05 Commerce', path: '/commerce' }, { label: 'Order Laterite' }]
  },
  '/commerce/orders': {
    path: '/commerce/orders',
    sectionId: 'building-materials-ecommerce',
    subtab: 'orders',
    label: 'Client Orders',
    category: 'Platform 05',
    description: 'Order lifecycle from quotation to site delivery',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '05 Commerce', path: '/commerce' }, { label: 'Orders' }]
  },

  // H. 06 — USED MACHINERY & VEHICLE MARKETPLACE
  '/marketplace': {
    path: '/marketplace',
    sectionId: 'used-machinery-marketplace',
    label: 'Machinery Marketplace',
    category: 'Platform 06',
    description: 'Buy, sell & rent excavators, crushers, tippers & wheel loaders',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '06 Marketplace' }]
  },
  '/marketplace/listings': {
    path: '/marketplace/listings',
    sectionId: 'used-machinery-marketplace',
    subtab: 'listings',
    label: 'Equipment Listings',
    category: 'Platform 06',
    description: 'Verified heavy equipment listings with certified inspection',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '06 Marketplace', path: '/marketplace' }, { label: 'Listings' }]
  },

  // I. 07 — QUARRY LAND
  '/land': {
    path: '/land',
    sectionId: 'quarry-land-management',
    label: 'Quarry Land Management',
    category: 'Platform 07',
    description: 'Mineral-bearing land bank, mining lease deeds & surveys',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '07 Land' }]
  },
  '/land/parcels': {
    path: '/land/parcels',
    sectionId: 'quarry-land-management',
    subtab: 'parcels',
    label: 'Land Parcels Bank',
    category: 'Platform 07',
    description: 'Survey titles, geo-fenced coordinates & exploration data',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '07 Land', path: '/land' }, { label: 'Parcels' }]
  },

  // J. 08 — RZ® CHAT
  '/chat': {
    path: '/chat',
    sectionId: 'rz-chating',
    label: 'RZ® Chat',
    category: 'Platform 08',
    description: 'Universal 1-to-1, group, broadcast & cross-module messaging',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '08 RZ Chat' }]
  },
  '/chat/business': {
    path: '/chat/business',
    sectionId: 'rz-chating',
    subtab: 'business',
    label: 'Business Channels',
    category: 'Platform 08',
    description: 'Channels tied to Quarry loads, Orders, Vehicles & OTT Tasks',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '08 RZ Chat', path: '/chat' }, { label: 'Business' }]
  },

  // K. 09 — RZ® OTT
  '/ott': {
    path: '/ott',
    sectionId: 'rz-ott',
    label: 'RZ® OTT: Organise Today & Tomorrow',
    category: 'Platform 09',
    description: 'Universal task engine, time planning, follow-ups & reminders',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '09 RZ OTT' }]
  },
  '/ott/my-day': {
    path: '/ott/my-day',
    sectionId: 'rz-ott',
    subtab: 'my-day',
    label: 'My Day Planner',
    category: 'Platform 09',
    description: 'Prioritized schedule, daily checklists & overdue items',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '09 RZ OTT', path: '/ott' }, { label: 'My Day' }]
  },
  '/ott/tasks': {
    path: '/ott/tasks',
    sectionId: 'rz-ott',
    subtab: 'tasks',
    label: 'All Tasks & Workspaces',
    category: 'Platform 09',
    description: 'Cross-platform tasks dispatched from Quarry, Fleet & ERP',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '09 RZ OTT', path: '/ott' }, { label: 'Tasks' }]
  },

  // L. 10 — RZ® CALCULATOR (FREE)
  '/calculator': {
    path: '/calculator',
    sectionId: 'rz-calculator',
    label: 'RZ® Calculator — FREE',
    category: 'Platform 10',
    description: 'Free public engineering, financial, GST & quarry calculators',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '10 Calculator (FREE)' }]
  },
  '/calculator/basic': {
    path: '/calculator/basic',
    sectionId: 'rz-calculator',
    subtab: 'basic',
    label: 'Basic Math Calculator',
    category: 'Platform 10',
    description: 'Standard memory, percentage & arithmetic operations',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '10 Calculator', path: '/calculator' }, { label: 'Basic' }]
  },
  '/calculator/gst': {
    path: '/calculator/gst',
    sectionId: 'rz-calculator',
    subtab: 'gst',
    label: 'GST & Tax Calculator',
    category: 'Platform 10',
    description: 'Split CGST, SGST, IGST calculations for mineral billing',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '10 Calculator', path: '/calculator' }, { label: 'GST' }]
  },
  '/calculator/quarry': {
    path: '/calculator/quarry',
    sectionId: 'rz-calculator',
    subtab: 'quarry',
    label: 'Quarry Yield & Density Calculator',
    category: 'Platform 10',
    description: 'Cubic meter to MT conversion & blasting rock yield',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: '10 Calculator', path: '/calculator' }, { label: 'Quarry' }]
  },

  // M. SHARED ERP CORE
  '/erp': {
    path: '/erp',
    sectionId: 'shared-erp-core',
    label: 'Shared ERP Core',
    category: 'ERP Core',
    description: 'Common business engine uniting all 10 ecosystem platforms',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Shared ERP Core' }]
  },
  '/erp/dashboard': {
    path: '/erp/dashboard',
    sectionId: 'shared-erp-core',
    subtab: 'dashboard',
    label: 'ERP Command Center',
    category: 'ERP Core',
    description: 'Executive view of daily trade, ledger health & personnel',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Dashboard' }]
  },

  // 1. PEOPLE & WORKFORCE
  '/erp/workforce': {
    path: '/erp/workforce',
    sectionId: 'shared-erp-core',
    subtab: 'dashboard',
    label: 'People & Workforce Hub',
    category: 'ERP Core',
    description: 'Central workforce, employee, attendance, leave, payroll-support and staff administration workspace',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'People & Workforce' }]
  },
  '/erp/workforce/employees': {
    path: '/erp/workforce/employees',
    sectionId: 'shared-erp-core',
    subtab: 'employees',
    label: 'Employee Directory',
    category: 'ERP Core',
    description: 'Master personnel records, KYC documents & role profiles',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Employees' }]
  },
  '/erp/workforce/departments': {
    path: '/erp/workforce/departments',
    sectionId: 'shared-erp-core',
    subtab: 'departments',
    label: 'Departments',
    category: 'ERP Core',
    description: 'Departmental management, headcounts, managers and allocations',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Departments' }]
  },
  '/erp/workforce/designations': {
    path: '/erp/workforce/designations',
    sectionId: 'shared-erp-core',
    subtab: 'designations',
    label: 'Designations Master',
    category: 'ERP Core',
    description: 'Designations, pay grades, overtime rules and batta eligibility',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Designations' }]
  },
  '/erp/workforce/attendance': {
    path: '/erp/workforce/attendance',
    sectionId: 'shared-erp-core',
    subtab: 'attendance',
    label: 'Attendance Management',
    category: 'ERP Core',
    description: 'Muster roll, daily/bulk attendance entry, biometric integration placeholder',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Attendance' }]
  },
  '/erp/workforce/shifts': {
    path: '/erp/workforce/shifts',
    sectionId: 'shared-erp-core',
    subtab: 'shifts',
    label: 'Shifts Roster',
    category: 'ERP Core',
    description: 'Shift timings, breaks, grace periods and staff assignments',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Shifts' }]
  },
  '/erp/workforce/leave': {
    path: '/erp/workforce/leave',
    sectionId: 'shared-erp-core',
    subtab: 'leave',
    label: 'Leave Management',
    category: 'ERP Core',
    description: 'Casual, sick & annual leave balances, approvals & requests',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Leave' }]
  },
  '/erp/workforce/overtime': {
    path: '/erp/workforce/overtime',
    sectionId: 'shared-erp-core',
    subtab: 'overtime',
    label: 'Overtime Register',
    category: 'ERP Core',
    description: 'OT hours, differential rates, approvals and wage calculation',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Overtime' }]
  },
  '/erp/workforce/salary-setup': {
    path: '/erp/workforce/salary-setup',
    sectionId: 'shared-erp-core',
    subtab: 'salary-setup',
    label: 'Salary Setup',
    category: 'ERP Core',
    description: 'Daily wage, weekly wage, monthly salary rules & component setup',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Salary Setup' }]
  },
  '/erp/workforce/payroll': {
    path: '/erp/workforce/payroll',
    sectionId: 'shared-erp-core',
    subtab: 'payroll',
    label: 'Payroll Engine',
    category: 'ERP Core',
    description: '11-step payroll batch calculation, review, approval & disbursement',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Payroll' }]
  },
  '/erp/workforce/advances': {
    path: '/erp/workforce/advances',
    sectionId: 'shared-erp-core',
    subtab: 'advances',
    label: 'Staff Advances',
    category: 'ERP Core',
    description: 'Worker advances, approval pipeline, repayment ledger & receipts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Advances' }]
  },
  '/erp/workforce/batta': {
    path: '/erp/workforce/batta',
    sectionId: 'shared-erp-core',
    subtab: 'batta',
    label: 'Batta & Allowances',
    category: 'ERP Core',
    description: 'Trip batta, night halt, food allowance & vehicle accounts sync',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Batta' }]
  },
  '/erp/workforce/salary-slips': {
    path: '/erp/workforce/salary-slips',
    sectionId: 'shared-erp-core',
    subtab: 'salary-slips',
    label: 'Salary Slips Center',
    category: 'ERP Core',
    description: 'RZ® MINETRIX professional salary slips, printable dossier & share',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Salary Slips' }]
  },
  '/erp/workforce/documents': {
    path: '/erp/workforce/documents',
    sectionId: 'shared-erp-core',
    subtab: 'documents',
    label: 'Staff Documents Vault',
    category: 'ERP Core',
    description: 'Statutory mining certificates, DGMS/PESO licenses & KYC tracking',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Documents' }]
  },
  '/erp/workforce/directory': {
    path: '/erp/workforce/directory',
    sectionId: 'shared-erp-core',
    subtab: 'directory',
    label: 'Staff Directory',
    category: 'ERP Core',
    description: 'Visual staff contact cards with direct call, email & RZ® Chat bridge',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Staff Directory' }]
  },
  '/erp/workforce/reports': {
    path: '/erp/workforce/reports',
    sectionId: 'shared-erp-core',
    subtab: 'reports',
    label: 'Workforce Reports',
    category: 'ERP Core',
    description: '14 statutory and analytical workforce reports with PDF/CSV export',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Reports' }]
  },
  '/erp/workforce/approvals': {
    path: '/erp/workforce/approvals',
    sectionId: 'shared-erp-core',
    subtab: 'approvals',
    label: 'Workforce Approvals Hub',
    category: 'ERP Core',
    description: 'Unified approval queue across leave, overtime, advances, batta & salary',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Approvals' }]
  },
  '/erp/workforce/settings': {
    path: '/erp/workforce/settings',
    sectionId: 'shared-erp-core',
    subtab: 'settings',
    label: 'Workforce Settings',
    category: 'ERP Core',
    description: 'Standard work hours, grace periods, OT multipliers & biometric gateway',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Workforce', path: '/erp/workforce' }, { label: 'Settings' }]
  },
  '/erp/people': {
    path: '/erp/people',
    sectionId: 'shared-erp-core',
    subtab: 'employees',
    label: 'People & Workforce Hub',
    category: 'ERP Core',
    description: 'Master staff roster, biometric attendance, payroll & batta',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'People' }]
  },
  '/erp/employees': {
    path: '/erp/employees',
    sectionId: 'shared-erp-core',
    subtab: 'employees',
    label: 'Employee Directory',
    category: 'ERP Core',
    description: 'Master personnel records, KYC documents & role profiles',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Employees' }]
  },
  '/erp/attendance': {
    path: '/erp/attendance',
    sectionId: 'shared-erp-core',
    subtab: 'attendance',
    label: 'Biometric Attendance',
    category: 'ERP Core',
    description: 'Shift rosters, overtime, corrections & punch logs',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Attendance' }]
  },
  '/erp/leave': {
    path: '/erp/leave',
    sectionId: 'shared-erp-core',
    subtab: 'leave',
    label: 'Leave Management',
    category: 'ERP Core',
    description: 'Casual, sick & earned leave balances, approvals & calendar',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Leave' }]
  },
  '/erp/payroll': {
    path: '/erp/payroll',
    sectionId: 'shared-erp-core',
    subtab: 'payroll',
    label: 'Payroll Processing',
    category: 'ERP Core',
    description: 'Working days, basic salary, overtime, batta, deductions & net pay',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Payroll' }]
  },
  '/erp/advances': {
    path: '/erp/advances',
    sectionId: 'shared-erp-core',
    subtab: 'advances',
    label: 'Staff Advances',
    category: 'ERP Core',
    description: 'Salary advance disbursements, EMI schedules & balance tracking',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Advances' }]
  },
  '/erp/advance-receipts': {
    path: '/erp/advance-receipts',
    sectionId: 'shared-erp-core',
    subtab: 'advance-receipts',
    label: 'Advance Receipts',
    category: 'ERP Core',
    description: 'Printable signed vouchers & acknowledgment slips',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Advance Receipts' }]
  },
  '/erp/batta': {
    path: '/erp/batta',
    sectionId: 'shared-erp-core',
    subtab: 'batta',
    label: 'Batta & Allowances',
    category: 'ERP Core',
    description: 'Driver trip batta, food allowance, night halt & outstation claims',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Batta' }]
  },
  '/erp/salary-slips': {
    path: '/erp/salary-slips',
    sectionId: 'shared-erp-core',
    subtab: 'salary-slips',
    label: 'Salary Slips',
    category: 'ERP Core',
    description: 'Digital & printable payslips with QR security verification',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Salary Slips' }]
  },
  '/erp/staff-accounts': {
    path: '/erp/staff-accounts',
    sectionId: 'shared-erp-core',
    subtab: 'staff-accounts',
    label: 'Staff Financial Accounts',
    category: 'ERP Core',
    description: 'Individual employee ledgers, credit, debit & payable balances',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Staff Accounts' }]
  },

  // 2. COMMERCE & TRADE
  '/erp/products': {
    path: '/erp/products',
    sectionId: 'shared-erp-core',
    subtab: 'products',
    label: 'Product Master',
    category: 'ERP Core',
    description: 'Catalog of laterite, aggregates, sand, fuel & consumables',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Products' }]
  },
  '/erp/categories': {
    path: '/erp/categories',
    sectionId: 'shared-erp-core',
    subtab: 'categories',
    label: 'Product Categories',
    category: 'ERP Core',
    description: 'HSN/SAC taxonomies, mineral grading & GST brackets',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Categories' }]
  },
  '/erp/rates': {
    path: '/erp/rates',
    sectionId: 'shared-erp-core',
    subtab: 'rates',
    label: 'Dynamic Rate Setup',
    category: 'ERP Core',
    description: 'Default, customer, agreement, branch & location rate engine',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Rates' }]
  },
  '/erp/customers': {
    path: '/erp/customers',
    sectionId: 'shared-erp-core',
    subtab: 'customers',
    label: 'Customers CRM',
    category: 'ERP Core',
    description: 'Buyer accounts, credit limits, statements & chat integration',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Customers' }]
  },
  '/erp/suppliers': {
    path: '/erp/suppliers',
    sectionId: 'shared-erp-core',
    subtab: 'suppliers',
    label: 'Suppliers SRM',
    category: 'ERP Core',
    description: 'Vendor registry, diesel bunks, spare dealers & bills',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Suppliers' }]
  },
  '/erp/purchase': {
    path: '/erp/purchase',
    sectionId: 'shared-erp-core',
    subtab: 'purchase',
    label: 'Purchase Pipeline',
    category: 'ERP Core',
    description: 'Requisition, RFQ, PO, GRN, Bill & Payment lifecycle',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Purchase' }]
  },
  '/erp/purchase-orders': {
    path: '/erp/purchase-orders',
    sectionId: 'shared-erp-core',
    subtab: 'purchase-orders',
    label: 'Purchase Orders',
    category: 'ERP Core',
    description: 'Authorized commercial procurement orders & supplier terms',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Purchase Orders' }]
  },
  '/erp/grn': {
    path: '/erp/grn',
    sectionId: 'shared-erp-core',
    subtab: 'grn',
    label: 'GRN / Material Receipts',
    category: 'ERP Core',
    description: 'Inward weighbridge gross/tare verification & physical inspection',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'GRN' }]
  },
  '/erp/sales': {
    path: '/erp/sales',
    sectionId: 'shared-erp-core',
    subtab: 'sales',
    label: 'Sales Pipeline',
    category: 'ERP Core',
    description: 'Quotation, sales orders, delivery, invoices & payments',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Sales' }]
  },
  '/erp/sales-orders': {
    path: '/erp/sales-orders',
    sectionId: 'shared-erp-core',
    subtab: 'sales-orders',
    label: 'Sales Orders',
    category: 'ERP Core',
    description: 'Active client bookings, site delivery tracking & freight',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Sales Orders' }]
  },
  '/erp/invoices': {
    path: '/erp/invoices',
    sectionId: 'shared-erp-core',
    subtab: 'invoices',
    label: 'Commercial Invoices',
    category: 'ERP Core',
    description: 'GST tax invoices, e-way bills & debtor debiting',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Invoices' }]
  },
  '/erp/sales-returns': {
    path: '/erp/sales-returns',
    sectionId: 'shared-erp-core',
    subtab: 'sales-returns',
    label: 'Sales Returns',
    category: 'ERP Core',
    description: 'Rejection credit notes & return gate pass adjustments',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Sales Returns' }]
  },
  '/erp/purchase-returns': {
    path: '/erp/purchase-returns',
    sectionId: 'shared-erp-core',
    subtab: 'purchase-returns',
    label: 'Purchase Returns',
    category: 'ERP Core',
    description: 'Vendor debit notes for substandard spares or diesel variance',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Purchase Returns' }]
  },
  '/erp/gate-pass': {
    path: '/erp/gate-pass',
    sectionId: 'shared-erp-core',
    subtab: 'gate-pass',
    label: 'Universal Gate Pass (QR)',
    category: 'ERP Core',
    description: 'Incoming, outgoing, quarry/crusher dispatch & weighbridge tokens',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Gate Pass' }]
  },

  // 3. FINANCE & ACCOUNTS
  '/finance': {
    path: '/finance',
    sectionId: 'shared-erp-core',
    subtab: 'finance-dashboard',
    label: 'Finance & Accounts',
    category: 'ERP Core',
    description: 'Universal financial command center, 10 ledgers & treasury',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'ERP Core', path: '/erp' }, { label: 'Finance' }]
  },
  '/finance/debtors': {
    path: '/finance/debtors',
    sectionId: 'shared-erp-core',
    subtab: 'debtors',
    label: 'Debtors Ledger',
    category: 'ERP Core',
    description: 'Customer receivables aging, payment receipts & statements',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Debtors' }]
  },
  '/finance/creditors': {
    path: '/finance/creditors',
    sectionId: 'shared-erp-core',
    subtab: 'creditors',
    label: 'Creditors Ledger',
    category: 'ERP Core',
    description: 'Vendor dues, diesel bills, royalty payables & settlements',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Creditors' }]
  },
  '/finance/banks': {
    path: '/finance/banks',
    sectionId: 'shared-erp-core',
    subtab: 'banks',
    label: 'Bank Accounts',
    category: 'ERP Core',
    description: 'Current, escrow & overdraft bank balances & fund transfers',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Banks' }]
  },
  '/finance/cash': {
    path: '/finance/cash',
    sectionId: 'shared-erp-core',
    subtab: 'cash',
    label: 'Cash Book',
    category: 'ERP Core',
    description: 'Pit head drawer, weighbridge counter & daily cash closing',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Cash' }]
  },
  '/finance/pay-in': {
    path: '/finance/pay-in',
    sectionId: 'shared-erp-core',
    subtab: 'pay-in',
    label: 'Pay-In Vouchers',
    category: 'ERP Core',
    description: 'Customer payments, cash advances & capital receipts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Pay-In' }]
  },
  '/finance/pay-out': {
    path: '/finance/pay-out',
    sectionId: 'shared-erp-core',
    subtab: 'pay-out',
    label: 'Pay-Out Vouchers',
    category: 'ERP Core',
    description: 'Vendor payments, driver batta, diesel, salaries & expenses',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Pay-Out' }]
  },
  '/finance/investors': {
    path: '/finance/investors',
    sectionId: 'shared-erp-core',
    subtab: 'investors',
    label: 'Investors Equity',
    category: 'ERP Core',
    description: 'Capital equity, ROI formulas, revenue shares & capital accounts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Investors' }]
  },
  '/finance/partners': {
    path: '/finance/partners',
    sectionId: 'shared-erp-core',
    subtab: 'partners',
    label: 'Partners Accounts',
    category: 'ERP Core',
    description: 'Operating partners, profit/loss splits & equity history',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Partners' }]
  },
  '/finance/staff-accounts': {
    path: '/finance/staff-accounts',
    sectionId: 'shared-erp-core',
    subtab: 'staff-accounts',
    label: 'Staff Ledger',
    category: 'ERP Core',
    description: 'Salary, advance, batta & reimbursement ledgers per employee',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Staff Accounts' }]
  },
  '/finance/trips': {
    path: '/finance/trips',
    sectionId: 'shared-erp-core',
    subtab: 'trips',
    label: 'Trip Accounts',
    category: 'ERP Core',
    description: 'Freight revenue, diesel, toll, batta & trip contribution margin',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Trip Accounts' }]
  },
  '/finance/vehicle-owners': {
    path: '/finance/vehicle-owners',
    sectionId: 'shared-erp-core',
    subtab: 'vehicle-owners',
    label: 'Vehicle Owner Accounts',
    category: 'ERP Core',
    description: 'Multi-owner tipper revenue shares, expense deductions & payouts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Vehicle Owners' }]
  },
  '/finance/ledger': {
    path: '/finance/ledger',
    sectionId: 'shared-erp-core',
    subtab: 'ledger',
    label: 'Universal General Ledger',
    category: 'ERP Core',
    description: 'Chronological double-entry audit trail across all entities',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Ledger' }]
  },
  '/finance/reconciliation': {
    path: '/finance/reconciliation',
    sectionId: 'shared-erp-core',
    subtab: 'reconciliation',
    label: 'Bank Reconciliation',
    category: 'ERP Core',
    description: 'Bank statement matching, unpresented cheques & ledger sync',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Reconciliation' }]
  },
  '/finance/pnl': {
    path: '/finance/pnl',
    sectionId: 'shared-erp-core',
    subtab: 'pnl',
    label: 'Profit & Loss Statement',
    category: 'ERP Core',
    description: 'Revenue, COGS, gross profit, operating cost & net profit breakdown',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'P&L' }]
  },
  '/finance/reports': {
    path: '/finance/reports',
    sectionId: 'shared-erp-core',
    subtab: 'reports',
    label: 'Financial BI Reports',
    category: 'ERP Core',
    description: 'Balance sheet, trial balance, tax audit & cash flow forecasts',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Finance', path: '/finance' }, { label: 'Reports' }]
  },

  // P. ORGANIZATION
  '/organization': {
    path: '/organization',
    sectionId: 'shared-erp-organization',
    label: 'Organization Engine',
    category: 'Organization',
    description: 'Corporate master profile, multi-branch hierarchy & sites',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Organization' }]
  },
  '/organization/branches': {
    path: '/organization/branches',
    sectionId: 'shared-erp-organization',
    subtab: 'branches',
    label: 'Branches & Mining Sites',
    category: 'Organization',
    description: 'Operating hubs in Kozhikode, Wayanad, Palakkad & extraction pits',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Organization', path: '/organization' }, { label: 'Branches' }]
  },

  // Q. SUBSCRIPTION
  '/subscription': {
    path: '/subscription',
    sectionId: 'billing-subscription',
    label: 'Subscription & Quotas',
    category: 'Subscription',
    description: 'Enterprise BOS plan, 10-platform entitlement & capacity meters',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Subscription' }]
  },
  '/subscription/plans': {
    path: '/subscription/plans',
    sectionId: 'billing-subscription',
    subtab: 'plans',
    label: 'Subscription Plans',
    category: 'Subscription',
    description: 'Compare Starter, Business, Professional & Enterprise BOS',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Subscription', path: '/subscription' }, { label: 'Plans' }]
  },

  // R. STAFF & RBAC
  '/staff': {
    path: '/staff',
    sectionId: 'shared-erp-organization',
    subtab: 'staff',
    label: 'Staff Directory',
    category: 'Staff & RBAC',
    description: 'Active personnel, invitation workflows & seat allocations',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Staff & RBAC' }]
  },
  '/staff/roles': {
    path: '/staff/roles',
    sectionId: 'shared-erp-organization',
    subtab: 'rbac',
    label: '24 Roles & 9 Permission Levels',
    category: 'Staff & RBAC',
    description: 'Granular access control across all 24 official ecosystem roles',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Staff & RBAC', path: '/staff' }, { label: '24 Roles' }]
  },

  // S. PRODUCTIVITY SUITE
  '/productivity': {
    path: '/productivity',
    sectionId: 'rz-productivity-suite',
    label: 'RZ® Productivity Suite',
    category: 'Productivity',
    description: 'All 7 integrated office applications: Sheet, Word, Form, Slide, Drive, PDF & Print',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Productivity Suite' }]
  },
  '/productivity/sheet': {
    path: '/productivity/sheet',
    sectionId: 'rz-productivity-suite',
    subtab: 'sheet',
    label: 'RZ® Sheet',
    category: 'Productivity',
    description: 'Enterprise grid calculations & volumetric ledger spreadsheets',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Productivity', path: '/productivity' }, { label: 'Sheet' }]
  },
  '/productivity/word': {
    path: '/productivity/word',
    sectionId: 'rz-productivity-suite',
    subtab: 'word',
    label: 'RZ® Word',
    category: 'Productivity',
    description: 'Commercial agreements, contracts, work orders & proposal drafter',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Productivity', path: '/productivity' }, { label: 'Word' }]
  },
  '/productivity/form': {
    path: '/productivity/form',
    sectionId: 'rz-productivity-suite',
    subtab: 'form',
    label: 'RZ® Form',
    category: 'Productivity',
    description: 'Dynamic field enquiry forms, order requests & customer intake',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Productivity', path: '/productivity' }, { label: 'Form' }]
  },
  '/productivity/slide': {
    path: '/productivity/slide',
    sectionId: 'rz-productivity-suite',
    subtab: 'slide',
    label: 'RZ® Slide',
    category: 'Productivity',
    description: 'Executive presentations, investor decks & operational yield slides',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Productivity', path: '/productivity' }, { label: 'Slide' }]
  },
  '/productivity/drive': {
    path: '/productivity/drive',
    sectionId: 'rz-productivity-suite',
    subtab: 'drive',
    label: 'RZ® Drive',
    category: 'Productivity',
    description: 'Centralized document management system across 8 business domains',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Productivity', path: '/productivity' }, { label: 'Drive' }]
  },
  '/productivity/pdf': {
    path: '/productivity/pdf',
    sectionId: 'rz-productivity-suite',
    subtab: 'pdf',
    label: 'RZ® PDF',
    category: 'Productivity',
    description: 'PDF merging, splitting, compression & digital certificate sealing',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Productivity', path: '/productivity' }, { label: 'PDF' }]
  },
  '/productivity/print': {
    path: '/productivity/print',
    sectionId: 'rz-productivity-suite',
    subtab: 'print',
    label: 'RZ® Print',
    category: 'Productivity',
    description: 'Thermal weighbridge slips, triplicate tax invoices & driver batta print center',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Productivity', path: '/productivity' }, { label: 'Print' }]
  },

  // T. SETTINGS
  '/settings': {
    path: '/settings',
    sectionId: 'shared-erp-organization',
    subtab: 'settings',
    label: 'Organization Settings',
    category: 'Settings',
    description: 'Branding studio, localization, notification routing & audit trail',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Settings' }]
  },

  // U. UNIVERSAL SEARCH
  '/search': {
    path: '/search',
    sectionId: 'universal-dashboard',
    label: 'Universal Search',
    category: 'Utilities',
    description: 'Global index search across all 15 core business record types',
    breadcrumbs: [{ label: 'Home', path: '/home' }, { label: 'Universal Search' }]
  }
};

// SECTION AA: ROLE-AWARE NAVIGATION PREVIEWS
export const ROLE_NAVIGATION_PRESETS: RoleNavigationPreset[] = [
  {
    role: 'OWNER',
    title: 'Al-Haj R. Zain (Owner & MD)',
    badge: 'Executive Oversight',
    description: 'Full unconstrained business operating authority across all 10 Platforms & Shared ERP Core.',
    featuredRoutes: [
      { label: 'Ecosystem Home', path: '/home', tag: 'Universal' },
      { label: 'Quarry Pitheads', path: '/quarry', tag: 'Platform 01' },
      { label: 'Crusher Plants', path: '/crusher', tag: 'Platform 02' },
      { label: 'Fleet Haulage', path: '/vehicle', tag: 'Platform 03' },
      { label: 'Finance & Ledgers', path: '/finance', tag: 'ERP Core' },
      { label: 'Organization & Quotas', path: '/organization', tag: 'Settings' }
    ]
  },
  {
    role: 'ACCOUNTANT',
    title: 'Anjali Menon (Senior Accountant)',
    badge: 'Financial & Billing Scope',
    description: 'Optimized workflow focusing on commercial invoices, daybooks, debtor aging, tax filings & payroll adjustments.',
    featuredRoutes: [
      { label: 'Finance & Ledgers', path: '/finance', tag: '10 Ledgers' },
      { label: 'Debtors Ledger', path: '/finance/debtors', tag: 'Receivables' },
      { label: 'Creditors Ledger', path: '/finance/creditors', tag: 'Payables' },
      { label: 'GST Calculator', path: '/calculator/gst', tag: 'Tax Tool' },
      { label: 'RZ Sheet', path: '/productivity/sheet', tag: 'Audit Books' },
      { label: 'Tasks & Follow-ups', path: '/ott', tag: 'RZ OTT' }
    ]
  },
  {
    role: 'DRIVER',
    title: 'Arun Varma (Lead Heavy Tipper Driver)',
    badge: 'Mobile Fleet Operator',
    description: 'Streamlined mobile-first view focused on active haulage trips, fuel bunk stops, digital gate passes & daily batta.',
    featuredRoutes: [
      { label: 'My Haulage Trips', path: '/vehicle/trips', tag: 'Active Route' },
      { label: 'Fuel Logs', path: '/vehicle/fuel', tag: 'Bunk Dispense' },
      { label: 'Driver Batta', path: '/vehicle/driver-batta', tag: 'Earnings' },
      { label: 'Gate Passes', path: '/vehicle', tag: 'Weighbridge' },
      { label: 'Driver Chat', path: '/chat', tag: 'Dispatch Desk' },
      { label: 'Today Tasks', path: '/ott/my-day', tag: 'RZ OTT' }
    ]
  },
  {
    role: 'CUSTOMER',
    title: 'K. Mohammed (Apex Infra Corp)',
    badge: 'Buyer & Contractor',
    description: 'Clean client portal to order dressed laterite blocks, aggregates, track delivery vehicles, and view GST invoices.',
    featuredRoutes: [
      { label: 'Order Laterite Stone', path: '/commerce/laterite/order', tag: 'Priority' },
      { label: 'Building Materials Shop', path: '/commerce', tag: 'Aggregates' },
      { label: 'Track Dispatches', path: '/commerce/orders', tag: 'GPS Live' },
      { label: 'Used Equipment', path: '/marketplace', tag: 'Marketplace' },
      { label: 'Supplier Support Chat', path: '/chat', tag: 'Support' }
    ]
  }
];

// SECTION AB: GLOBAL QUICK ACTIONS
export const GLOBAL_QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'new-quarry',
    title: '+ New Quarry Pit',
    subtitle: 'Register new mining concession, lease or laterite pit',
    icon: 'Pickaxe',
    category: 'Operations',
    targetPath: '/quarry/quarries'
  },
  {
    id: 'new-crusher',
    title: '+ New Crusher Plant',
    subtitle: 'Provision jaw, cone or VSI crushing production line',
    icon: 'Building2',
    category: 'Operations',
    targetPath: '/crusher/plants'
  },
  {
    id: 'add-vehicle',
    title: '+ Add Fleet Vehicle',
    subtitle: 'Register multi-axle tipper, transit mixer or heavy loader',
    icon: 'Truck',
    category: 'Fleet & Commerce',
    targetPath: '/vehicle/vehicles'
  },
  {
    id: 'new-job',
    title: '+ New Contract Job',
    subtitle: 'Issue work order, excavation contract or road job',
    icon: 'GitFork',
    category: 'Operations',
    targetPath: '/jobs/work-orders'
  },
  {
    id: 'new-order',
    title: '+ New Laterite / Material Order',
    subtitle: 'Direct customer booking for dressed stone or aggregates',
    icon: 'ShoppingBag',
    category: 'Fleet & Commerce',
    targetPath: '/commerce/laterite/order'
  },
  {
    id: 'new-product',
    title: '+ New Material Product',
    subtitle: 'Create catalog SKU for aggregates, M-Sand or masonry blocks',
    icon: 'Package',
    category: 'Fleet & Commerce',
    targetPath: '/commerce'
  },
  {
    id: 'new-customer',
    title: '+ New Customer Account',
    subtitle: 'Register builder, infrastructure firm or private client',
    icon: 'Users',
    category: 'Fleet & Commerce',
    targetPath: '/erp/people'
  },
  {
    id: 'new-supplier',
    title: '+ New Supplier / Vendor',
    subtitle: 'Add quarry supplier, spare parts dealer or diesel pump',
    icon: 'Building2',
    category: 'Operations',
    targetPath: '/erp/people'
  },
  {
    id: 'new-task',
    title: '+ New OTT Task / Reminder',
    subtitle: 'Dispatch time-planned task with priority alert & connection',
    icon: 'Clock',
    category: 'Workforce',
    targetPath: '/ott/tasks'
  },
  {
    id: 'new-expense',
    title: '+ New Operating Expense',
    subtitle: 'Record pithead diesel, explosives, spares or toll voucher',
    icon: 'DollarSign',
    category: 'Financial',
    targetPath: '/quarry/expenses'
  },
  {
    id: 'new-invoice',
    title: '+ Generate Tax Invoice',
    subtitle: 'Create GST tax invoice with weighbridge slip linkage',
    icon: 'FileText',
    category: 'Financial',
    targetPath: '/finance'
  },
  {
    id: 'invite-staff',
    title: '+ Invite Staff Member',
    subtitle: 'Dispatch workspace invitation link with 1 of 24 roles',
    icon: 'Shield',
    category: 'Workforce',
    targetPath: '/staff'
  }
];

// SECTION U: UNIVERSAL SEARCH DATABASE ACROSS ALL 15 RECORD TYPES
export const UNIVERSAL_SEARCH_DATABASE: UniversalSearchRecord[] = [
  // 1. People
  { id: 'REC-P-01', module: 'ERP Workforce', recordType: 'People', name: 'Al-Haj R. Zain', subtitle: 'Managing Director & Principal Owner • Kozhikode HQ', status: 'Active', targetPath: '/staff' },
  { id: 'REC-P-02', module: 'ERP Workforce', recordType: 'People', name: 'Anjali Menon', subtitle: 'Senior Accountant • Finance & Tax Compliance', status: 'Active', targetPath: '/staff' },
  { id: 'REC-P-03', module: 'ERP Workforce', recordType: 'People', name: 'Arun Varma', subtitle: 'Lead Tipper Driver • Commercial Heavy Badge', status: 'On Route', targetPath: '/vehicle/drivers' },

  // 2. Companies
  { id: 'REC-C-01', module: 'Organization', recordType: 'Companies', name: 'RZ Mining & Infrastructure Pvt Ltd', subtitle: 'Corporate Legal Entity • GSTIN: 32AABCR1234F1Z8', status: 'Verified', targetPath: '/organization' },
  { id: 'REC-C-02', module: 'Commerce', recordType: 'Companies', name: 'Malabar Expressway Infra Consortium', subtitle: 'Key Account Contractor • Credit Cap ₹50 Lakhs', status: 'Active', targetPath: '/erp' },

  // 3. Quarries
  { id: 'REC-Q-01', module: '01 Quarry', recordType: 'Quarries', name: 'Palazhi Laterite Pit #1', subtitle: 'Active Concession • 38,000 blocks monthly capacity', status: 'Operational', targetPath: '/quarry/quarries' },
  { id: 'REC-Q-02', module: '01 Quarry', recordType: 'Quarries', name: 'Wayanad High-Range Granite Pit #4', subtitle: 'Dimension Stone Extraction • SEIAA Certified', status: 'Operational', targetPath: '/quarry/quarries' },

  // 4. Crusher Plants
  { id: 'REC-CR-01', module: '02 Crusher', recordType: 'Crusher Plants', name: 'Wayanad VSI Sand Crushing Complex', subtitle: '250 TPH Dual-Line VSI & Cone • M-Sand / P-Sand', status: 'Operational', targetPath: '/crusher/plants' },

  // 5. Vehicles
  { id: 'REC-V-01', module: '03 Vehicle', recordType: 'Vehicles', name: 'KL-11-BH-9921 (Tata Signa 2823.K)', subtitle: 'Driver: Arun Varma • Destination: Calicut Bypass', status: 'On Trip (GPS)', targetPath: '/vehicle/trips' },
  { id: 'REC-V-02', module: '03 Vehicle', recordType: 'Vehicles', name: 'KL-12-E-4410 (Ashok Leyland 2518)', subtitle: 'Driver: Jaleel Ahmed • Return Trip Tare', status: 'Available', targetPath: '/vehicle/vehicles' },

  // 6. Jobs
  { id: 'REC-J-01', module: '04 Jobs', recordType: 'Jobs', name: 'Kozhikode Coastal Highway Section 3B', subtitle: 'Subgrade filling, laterite pitching & sub-base work', status: 'In Progress', targetPath: '/jobs/work-orders' },

  // 7. Orders
  { id: 'REC-ORD-01', module: '05 Commerce', recordType: 'Orders', name: 'ORD-2026-9921 (Laterite Stone 1,200 Nos)', subtitle: 'Client: ABC Civil Infra • Dispatched via KL-11-BH-9921', status: 'In Transit', targetPath: '/commerce/orders' },

  // 8. Products
  { id: 'REC-PRD-01', module: '05 Commerce', recordType: 'Products', name: 'Dressed Laterite Stone (12x8x6 in)', subtitle: 'High compressive strength pitstone • Grade A', status: 'In Stock', targetPath: '/commerce/laterite' },
  { id: 'REC-PRD-02', module: '02 Crusher', recordType: 'Products', name: 'Manufactured Sand (M-Sand) Zone II', subtitle: 'Washed concrete fine aggregate • Tonnage: 1,450 MT', status: 'In Silo', targetPath: '/crusher/stock' },

  // 9. Land
  { id: 'REC-L-01', module: '07 Land', recordType: 'Land', name: 'Survey No. 412/3B (Kozhikode Mining Zone)', subtitle: '4.8 Acres • Laterite Stone Reserve • Clean Title Deed', status: 'Registered', targetPath: '/land/parcels' },

  // 10. Marketplace
  { id: 'REC-MKT-01', module: '06 Marketplace', recordType: 'Marketplace', name: '2023 Komatsu PC210-10M0 Excavator', subtitle: 'Working Hours: 1,840 Hrs • Calicut Yard Inspected', status: 'Certified Available', targetPath: '/marketplace/listings' },

  // 11. Chats
  { id: 'REC-CHT-01', module: '08 RZ Chat', recordType: 'Chats', name: 'Quarry Pit #1 Operations Dispatch Channel', subtitle: 'Active shift coordination between weighbridge & pit supervisor', status: 'Live', targetPath: '/chat/business' },

  // 12. Tasks
  { id: 'REC-TSK-01', module: '09 RZ OTT', recordType: 'Tasks', name: 'Explosives Storage PESO Audit Inspection', subtitle: 'Scheduled for 24-Feb-2026 10:00 AM • High Priority', status: 'Upcoming', targetPath: '/ott/tasks' },

  // 13. Invoices
  { id: 'REC-INV-01', module: 'Finance', recordType: 'Invoices', name: 'Tax Invoice RZ-INV-2026-9921', subtitle: 'Amount: ₹78,450 • GST Paid • Customer: ABC Civil Infra', status: 'Approved', targetPath: '/finance' },

  // 14. Payments
  { id: 'REC-PAY-01', module: 'Finance', recordType: 'Payments', name: 'Payment Voucher PV-2026-0814', subtitle: 'Amount: ₹1,50,000 • Diesel Bunk NEFT Remittance', status: 'Cleared', targetPath: '/finance' },

  // 15. Documents
  { id: 'REC-DOC-01', module: 'Organization', recordType: 'Documents', name: 'Mining Lease Deed (Govt of Kerala)', subtitle: 'Deed No: 412/2022 • Valid until March 2032', status: 'Verified', targetPath: '/organization' }
];

// AD. 20-STEP END-TO-END NAVIGATION TEST LOOP
export const END_TO_END_TEST_SEQUENCE = [
  { step: 1, path: '/home', label: 'HOME', sectionId: 'universal-dashboard', desc: 'Universal command center and multi-platform dashboard' },
  { step: 2, path: '/10-platforms', label: '10 PLATFORMS', sectionId: 'universal-dashboard', desc: 'Complete 10-platform catalog & directory' },
  { step: 3, path: '/quarry', label: 'QUARRY', sectionId: 'quarry-management', desc: 'Platform 01 — Quarry & Pithead Management' },
  { step: 4, path: '/land', label: 'LAND', sectionId: 'quarry-land-management', desc: 'Platform 07 — Quarry Land & Mining Concessions' },
  { step: 5, path: '/crusher', label: 'CRUSHER', sectionId: 'crusher-management', desc: 'Platform 02 — Crusher & Aggregate Processing' },
  { step: 6, path: '/vehicle', label: 'VEHICLE', sectionId: 'vehicle-management', desc: 'Platform 03 — Vehicle Fleet & Telematics' },
  { step: 7, path: '/jobs', label: 'JOB', sectionId: 'contract-job-management', desc: 'Platform 04 — Contract & Job Management' },
  { step: 8, path: '/commerce', label: 'BUILDING MATERIALS', sectionId: 'building-materials-ecommerce', desc: 'Platform 05 — Building Materials E-Commerce & Laterite' },
  { step: 9, path: '/marketplace', label: 'MARKETPLACE', sectionId: 'used-machinery-marketplace', desc: 'Platform 06 — Used Machinery & Vehicle Marketplace' },
  { step: 10, path: '/chat', label: 'RZ CHAT', sectionId: 'rz-chating', desc: 'Platform 08 — RZ Chat Messaging & OTT Bridge' },
  { step: 11, path: '/ott', label: 'RZ OTT', sectionId: 'rz-ott', desc: 'Platform 09 — RZ OTT Universal Task Engine' },
  { step: 12, path: '/calculator', label: 'RZ CALCULATOR', sectionId: 'rz-calculator', desc: 'Platform 10 — RZ Free Universal Calculator' },
  { step: 13, path: '/erp', label: 'SHARED ERP CORE', sectionId: 'shared-erp-core', desc: 'Shared ERP Core Business Engine' },
  { step: 14, path: '/finance', label: 'FINANCE', sectionId: 'shared-erp-finance', desc: 'Shared ERP Finance & 10 Ledgers' },
  { step: 15, path: '/organization', label: 'ORGANIZATION', sectionId: 'shared-erp-organization', desc: 'Organization Engine & Workspace' },
  { step: 16, path: '/subscription', label: 'SUBSCRIPTION', sectionId: 'billing-subscription', desc: 'Subscription Plans & Quotas' },
  { step: 17, path: '/staff', label: 'STAFF', sectionId: 'shared-erp-organization', desc: 'Staff Directory & Personnel' },
  { step: 18, path: '/staff/roles', label: 'RBAC', sectionId: 'shared-erp-organization', desc: '24 Roles & 9 Permission Levels' },
  { step: 19, path: '/productivity', label: 'PRODUCTIVITY', sectionId: 'rz-productivity-suite', desc: 'RZ Productivity Suite (7 Office Apps)' },
  { step: 20, path: '/settings', label: 'SETTINGS', sectionId: 'shared-erp-organization', desc: 'Organization Settings & Security Audit Trail' }
];

export function resolveRoute(path: string): RouteDefinition {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (ALL_ROUTES_REGISTRY[cleanPath]) {
    return ALL_ROUTES_REGISTRY[cleanPath];
  }

  // Prefix matching
  for (const [routePath, def] of Object.entries(ALL_ROUTES_REGISTRY)) {
    if (cleanPath.startsWith(routePath) && routePath !== '/home') {
      return def;
    }
  }

  return ALL_ROUTES_REGISTRY['/home'];
}
