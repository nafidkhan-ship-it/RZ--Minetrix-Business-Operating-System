import {
  ProductivityFile,
  FormResponseItem,
  SlideItem,
  VersionHistoryItem
} from './types';

export const MOCK_PRODUCTIVITY_FILES: ProductivityFile[] = [
  {
    id: 'DOC-001',
    name: 'Laterite_Extraction_Log_Kasaragod_Pit01.rzs',
    type: 'sheet',
    tool: 'sheet',
    owner: 'Nafid Khan (MD)',
    lastModified: '10 mins ago',
    size: '1.4 MB',
    location: 'My Drive / Quarry',
    category: 'Quarry',
    sharedStatus: 'organization',
    starred: true,
    erpSource: 'Platform 01: Quarry Kasaragod Pit #01',
    erpConnected: true,
    versionCount: 4
  },
  {
    id: 'DOC-002',
    name: 'Landowner_Lease_Agreement_Moideenkutty.rzw',
    type: 'word',
    tool: 'word',
    owner: 'Nafid Khan (MD)',
    lastModified: '1 hour ago',
    size: '840 KB',
    location: 'My Drive / Contracts',
    category: 'Contracts',
    sharedStatus: 'shared',
    starred: true,
    erpSource: 'Platform 07: Quarry Land Concession',
    erpConnected: true,
    versionCount: 7
  },
  {
    id: 'DOC-003',
    name: 'Customer_Bulk_Stone_Enquiry_Intake.rzf',
    type: 'form',
    tool: 'form',
    owner: 'Commercial Sales Desk',
    lastModified: '2 hours ago',
    size: '220 KB',
    location: 'My Drive / General',
    category: 'General',
    sharedStatus: 'public',
    erpSource: 'CRM & Trade Portal',
    erpConnected: true,
    versionCount: 2
  },
  {
    id: 'DOC-004',
    name: 'Investor_Pitch_Crusher_Expansion_2026.rzp',
    type: 'slide',
    tool: 'slide',
    owner: 'Nafid Khan (MD)',
    lastModified: 'Yesterday',
    size: '12.8 MB',
    location: 'My Drive / Crusher',
    category: 'Crusher',
    sharedStatus: 'shared',
    starred: true,
    erpSource: 'Finance: Equity & Capital Projects',
    erpConnected: true,
    versionCount: 5
  },
  {
    id: 'DOC-005',
    name: 'Commercial_Tax_Invoice_Sobha_INV2026_081.pdf',
    type: 'pdf',
    tool: 'pdf',
    owner: 'Anjali Menon (Accounts)',
    lastModified: '3 hours ago',
    size: '480 KB',
    location: 'My Drive / Invoices',
    category: 'Invoices',
    sharedStatus: 'organization',
    erpSource: 'Finance: Debtors Invoices',
    erpConnected: true,
    versionCount: 1
  },
  {
    id: 'DOC-006',
    name: 'Tipper_Haulage_Trip_Accounts_Register.rzs',
    type: 'sheet',
    tool: 'sheet',
    owner: 'Sujith Kumar (Fleet Dispatch)',
    lastModified: '4 hours ago',
    size: '2.1 MB',
    location: 'My Drive / Vehicle',
    category: 'Vehicle',
    sharedStatus: 'organization',
    erpSource: 'Platform 03: Fleet Logistics',
    erpConnected: true,
    versionCount: 12
  },
  {
    id: 'DOC-007',
    name: 'Staff_Salary_Slips_March2026_Batch.rzpr',
    type: 'other',
    tool: 'print',
    owner: 'Anjali Menon (Accounts)',
    lastModified: 'Yesterday',
    size: '3.6 MB',
    location: 'My Drive / HR',
    category: 'HR',
    sharedStatus: 'private',
    erpSource: 'ERP Core: Payroll Engine',
    erpConnected: true,
    versionCount: 2
  },
  {
    id: 'DOC-008',
    name: 'Crusher_Plant_Aggregate_Daily_Yield.rzs',
    type: 'sheet',
    tool: 'sheet',
    owner: 'Ramesh Babu (Plant Mgr)',
    lastModified: '2 days ago',
    size: '950 KB',
    location: 'My Drive / Crusher',
    category: 'Crusher',
    sharedStatus: 'shared',
    erpSource: 'Platform 02: Crusher Plants',
    erpConnected: true,
    versionCount: 8
  },
  {
    id: 'DOC-009',
    name: 'Gate_Pass_Thermal_Batch_GP1092.pdf',
    type: 'pdf',
    tool: 'print',
    owner: 'Weighbridge Terminal #01',
    lastModified: 'Just now',
    size: '120 KB',
    location: 'My Drive / Quarry',
    category: 'Quarry',
    sharedStatus: 'organization',
    erpSource: 'Weighbridge Sensor Integration',
    erpConnected: true,
    versionCount: 1
  },
  {
    id: 'DOC-010',
    name: 'Executive_P_and_L_Q1_2026_Audit.rzs',
    type: 'sheet',
    tool: 'sheet',
    owner: 'Anjali Menon (Accounts)',
    lastModified: '3 days ago',
    size: '3.4 MB',
    location: 'My Drive / Finance',
    category: 'Finance',
    sharedStatus: 'private',
    erpSource: 'Finance: General Ledger',
    erpConnected: true,
    versionCount: 6
  }
];

export const MOCK_FORM_RESPONSES: FormResponseItem[] = [
  {
    id: 'RES-901',
    formId: 'DOC-003',
    submittedAt: 'Today, 10:15 AM',
    respondentName: 'Thomas Mathew (Sobha Developers)',
    respondentContact: '+91 94471 28901',
    answers: {
      stoneGrade: 'Dressed Grade A Laterite (12x8x6)',
      quantityRequired: '2,500 Blocks',
      deliverySite: 'Sobha City, NH 66 Bypass, Kozhikode',
      desiredDeliveryDate: '2026-03-28',
      vehicleTypeRequired: '10-Wheel Heavy Tipper with Offloading'
    },
    status: 'Converted to Quote',
    crmLinked: true
  },
  {
    id: 'RES-902',
    formId: 'DOC-003',
    submittedAt: 'Today, 09:30 AM',
    respondentName: 'Malabar Precast LLC',
    respondentContact: '+91 98460 77123',
    answers: {
      stoneGrade: '20mm Crushed Blue Metal Aggregate',
      quantityRequired: '180 MT',
      deliverySite: 'Malabar Industrial Yard, Kanjikode, Palakkad',
      desiredDeliveryDate: '2026-03-26',
      vehicleTypeRequired: 'Multi-axle Trailer'
    },
    status: 'Under Review',
    crmLinked: true
  },
  {
    id: 'RES-903',
    formId: 'DOC-003',
    submittedAt: 'Yesterday, 04:45 PM',
    respondentName: 'Calicut Central Infra Works',
    respondentContact: '+91 97455 33019',
    answers: {
      stoneGrade: 'Wet Mixed Macadam (WMM) & GSB Base',
      quantityRequired: '400 MT',
      deliverySite: 'NH-766 Wayanad Pass Highway Project',
      desiredDeliveryDate: '2026-04-02',
      vehicleTypeRequired: 'Heavy Tippers'
    },
    status: 'Actioned',
    crmLinked: true
  }
];

export const MOCK_SLIDES: SlideItem[] = [
  {
    id: 'SL-01',
    title: 'RZ® MINETRIX OPERATIONAL OVERVIEW',
    subtitle: 'Fully Integrated Ecosystem for Mining, Aggregate Production & Heavy Fleet Haulage',
    layout: 'title',
    speakerNotes: 'Welcome stakeholders. Emphasize that RZ MINETRIX runs on a unified real-time multi-ledger backbone.'
  },
  {
    id: 'SL-02',
    title: 'Extraction Reserves & Concession Economics',
    subtitle: 'Proven laterite and hard rock mineral deposits across Kozhikode, Wayanad & Kasaragod',
    layout: 'stats',
    stats: [
      { label: 'Proven Reserves', value: '4.8M MT', change: '+18% YoY' },
      { label: 'Active Pitheads', value: '12 Pits', change: '100% SEIAA Cleared' },
      { label: 'Daily Extraction', value: '2,400 MT', change: 'Peak Season' },
      { label: 'Landowner Royalty Margin', value: '₹4.50/block', change: 'Direct Escrow' }
    ],
    speakerNotes: 'Highlight compliance with SEIAA and Department of Mining & Geology permits.'
  },
  {
    id: 'SL-03',
    title: 'Crusher Plants & Granular Distribution',
    subtitle: 'High-yield VSI impact crushers delivering M-sand, plastering sand & structural aggregates',
    layout: 'bullets',
    points: [
      '200 TPH primary jaw crushing unit paired with 3-stage VSI cubical shapers.',
      'Precision washing plant removing silt to <3% compliant with IS 383 standards.',
      'Silo storage capacity of 18,000 MT with automated overhead tipper chutes.',
      'Live weighbridge weighing under 45 seconds per vehicle exit.'
    ],
    speakerNotes: 'Focus on M-Sand market transition as river sand extraction remains strictly prohibited.'
  },
  {
    id: 'SL-04',
    title: 'Fleet Logistics, Telematics & Trip Net Margin',
    subtitle: 'Real-time GPS telematics, fuel sensors and automated owner profit settlements',
    layout: 'stats',
    stats: [
      { label: 'Active Tippers', value: '46 Vehicles', change: '10-Wheel & Multi-axle' },
      { label: 'Daily Trips', value: '184 Dispatches', change: 'Avg 4.0 trips/truck' },
      { label: 'Fleet Fuel Efficiency', value: '3.42 km/L', change: 'Telematics Monitored' },
      { label: 'Net Trip Profit Pool', value: '₹4,120/trip', change: 'Distributed to Owners' }
    ],
    speakerNotes: 'Show the mathematical trip account formula: Gross Freight - Fuel - Toll - Batta = Contribution.'
  }
];

export const MOCK_VERSIONS: VersionHistoryItem[] = [
  {
    id: 'V-04',
    version: 'Version 4.2 (Current)',
    timestamp: 'Today at 11:20 AM',
    author: 'Nafid Khan (MD)',
    changeSummary: 'Updated Kasaragod Pit #01 royalty rate formula from ₹4.20 to ₹4.50 per dressed block.',
    isCurrent: true
  },
  {
    id: 'V-03',
    version: 'Version 4.1',
    timestamp: 'Yesterday at 04:30 PM',
    author: 'Anjali Menon (Accounts)',
    changeSummary: 'Appended Sobha Developers dispatch entries for 2,500 blocks and verified weighbridge slips.',
    isCurrent: false
  },
  {
    id: 'V-02',
    version: 'Version 3.8',
    timestamp: '21 Mar 2026 at 09:15 AM',
    author: 'Ramesh Babu (Quarry Mgr)',
    changeSummary: 'Integrated Survey Boundary Coordinates for Wayanad Block A & B into cell range F12:F28.',
    isCurrent: false
  },
  {
    id: 'V-01',
    version: 'Version 1.0 (Initial)',
    timestamp: '15 Mar 2026 at 08:00 AM',
    author: 'Nafid Khan (MD)',
    changeSummary: 'Created initial template from RZ Sheet Quarry Load Register standard business template.',
    isCurrent: false
  }
];

export const DRIVE_FOLDERS = [
  { id: 'f-quarry', name: 'Quarry', icon: 'Mountain', count: 18, color: 'text-amber-400', size: '42.8 MB' },
  { id: 'f-crusher', name: 'Crusher', icon: 'Cpu', count: 12, color: 'text-emerald-400', size: '28.4 MB' },
  { id: 'f-vehicle', name: 'Vehicle', icon: 'Truck', count: 24, color: 'text-cyan-400', size: '64.1 MB' },
  { id: 'f-contracts', name: 'Contracts', icon: 'FileSignature', count: 15, color: 'text-purple-400', size: '18.9 MB' },
  { id: 'f-invoices', name: 'Invoices', icon: 'Receipt', count: 142, color: 'text-rose-400', size: '88.3 MB' },
  { id: 'f-reports', name: 'Reports', icon: 'BarChart3', count: 31, color: 'text-blue-400', size: '52.0 MB' },
  { id: 'f-hr', name: 'HR', icon: 'Users', count: 48, color: 'text-indigo-400', size: '36.5 MB' },
  { id: 'f-finance', name: 'Finance', icon: 'Landmark', count: 65, color: 'text-teal-400', size: '94.2 MB' }
];
