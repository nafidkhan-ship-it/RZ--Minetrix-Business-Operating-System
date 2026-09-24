import {
  MasterPerson,
  ErpProduct,
  CentralOrder,
  PurchaseRequest,
  PurchaseOrder,
  GoodsReceiptNote,
  PurchaseBill,
  SalesQuotation,
  SalesInvoice,
  InventoryItem,
  GatePassRecord,
  StaffProfile,
  AttendanceRecord,
  StaffAdvance,
  BattaAllowance,
  BankAccount,
  OwnershipPartner,
  VehicleTripAccount,
  SettlementRecord
} from '../types';

// ==========================================
// 1. MASTER PERSON DIRECTORY (Single Person Profile, Multiple Roles)
// ==========================================
export const MOCK_MASTER_PEOPLE: MasterPerson[] = [
  {
    id: 'PER-001',
    fullName: 'K. P. Moideenkutty',
    phone: '+91 98470 12345',
    email: 'moideenkutty.kp@gmail.com',
    address: 'Near Hillway Concession, Meppadi Post, Wayanad 673577',
    panNumber: 'AAQPM9921D',
    relationships: ['LAND_OWNER', 'PARTNER', 'CUSTOMER'],
    primaryRole: 'LAND_OWNER',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '30918239019',
      ifsc: 'SBIN0008621',
      branch: 'Kalpetta Main'
    },
    creditLimit: 500000,
    paymentTerms: 'Royalty per load (₹250/load) & Net 15 days',
    status: 'ACTIVE',
    notes: 'Primary lessor for Quarry Block A & B; also procures dressed stone for family commercial villa project.',
    createdAt: '15 Jan 2021',
    totalReceivable: 45000,
    totalPayable: 185000
  },
  {
    id: 'PER-002',
    fullName: 'Al-Haj R. Zain',
    phone: '+91 98470 00001',
    email: 'zain@racezoneventures.com',
    address: 'Racezone Towers, Mavoor Road, Calicut 673004',
    panNumber: 'AAAPZ1102A',
    relationships: ['INVESTOR', 'PARTNER'],
    primaryRole: 'INVESTOR',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '50200019283711',
      ifsc: 'HDFC0000182',
      branch: 'Calicut Main'
    },
    status: 'ACTIVE',
    notes: 'Core equity partner (45% equity) and capital provider for Wayanad VSI Crusher Plant & Heavy Fleet.',
    createdAt: '01 Jan 2020',
    totalReceivable: 0,
    totalPayable: 620000
  },
  {
    id: 'PER-003',
    fullName: 'Thomas Mathew',
    phone: '+91 94471 88990',
    email: 'thomas.mathew@malabarinfra.com',
    address: 'Sobha City Commercial Hub, Thrissur 680553',
    gstin: '32AABCS8891P1ZR',
    panNumber: 'AABCS8891P',
    relationships: ['CUSTOMER', 'CONTRACTOR'],
    primaryRole: 'CUSTOMER',
    creditLimit: 3000000,
    paymentTerms: '30 Days Net Credit',
    status: 'ACTIVE',
    notes: 'Managing Director of Malabar Highway Infra & Sobha subcontracting syndicate.',
    createdAt: '10 Feb 2022',
    totalReceivable: 1240000,
    totalPayable: 0
  },
  {
    id: 'PER-004',
    fullName: 'M. K. Balaraman',
    phone: '+91 98462 33411',
    email: 'balaraman.tippers@gmail.com',
    address: 'Depot Junction, Thamarassery, Calicut 673573',
    relationships: ['VEHICLE_OWNER', 'SUPPLIER'],
    primaryRole: 'VEHICLE_OWNER',
    bankDetails: {
      bankName: 'Federal Bank',
      accountNumber: '1102910029381',
      ifsc: 'FDRL0001402',
      branch: 'Thamarassery'
    },
    paymentTerms: 'Weekly Trip Profit Distribution (60:40 Split)',
    status: 'ACTIVE',
    notes: 'Owns 3 attached 10-wheel tippers (KL-11-BH-9921, KL-11-BH-9922, KL-11-CE-1004).',
    createdAt: '05 Mar 2022',
    totalReceivable: 0,
    totalPayable: 94000
  },
  {
    id: 'PER-005',
    fullName: 'Rajesh Nair',
    phone: '+91 98471 22334',
    email: 'rajesh.nair@rzminetrix.com',
    address: 'Quarry Staff Quarters, Block 2, Calicut',
    relationships: ['STAFF'],
    primaryRole: 'STAFF',
    bankDetails: {
      bankName: 'Canara Bank',
      accountNumber: '0812101099234',
      ifsc: 'CNRB0000812',
      branch: 'Feroke'
    },
    status: 'ACTIVE',
    notes: 'Senior Quarry Pit Supervisor; oversees laterite wire sawing, excavator roster, and fuel bowsers.',
    createdAt: '12 Jan 2022',
    totalReceivable: 4000, // advance
    totalPayable: 28000 // pending salary
  },
  {
    id: 'PER-006',
    fullName: 'Arun Varma',
    phone: '+91 99951 10293',
    email: 'arun.varma@rzminetrix.com',
    address: 'Near Old Bus Stand, Thamarassery',
    relationships: ['STAFF', 'DRIVER'],
    primaryRole: 'DRIVER',
    bankDetails: {
      bankName: 'Kerala Gramin Bank',
      accountNumber: '40192837102',
      ifsc: 'KLGB0040192',
      branch: 'Koduvally'
    },
    status: 'ACTIVE',
    notes: 'Heavy commercial driver for tipper KL-11-BH-9921; holds valid hazardous transport permit.',
    createdAt: '15 Aug 2021',
    totalReceivable: 5000,
    totalPayable: 22600
  },
  {
    id: 'PER-007',
    fullName: 'Naveen Jindal',
    phone: '+91 80 4400 1100',
    email: 'sales.south@sandvikspares.com',
    address: 'Industrial Area Phase 2, Peenya, Bengaluru 560058',
    gstin: '29AABCS9912Q1ZZ',
    relationships: ['SUPPLIER'],
    primaryRole: 'SUPPLIER',
    paymentTerms: '30 Days Net Credit',
    status: 'ACTIVE',
    notes: 'Authorized OEM supplier for Cone & Jaw Crusher manganese manganese liners and bearings.',
    createdAt: '20 May 2023',
    totalReceivable: 0,
    totalPayable: 185000
  }
];

// ==========================================
// 2. PRODUCT MASTER & DYNAMIC RATE ENGINE
// ==========================================
export const MOCK_ERP_PRODUCTS: ErpProduct[] = [
  {
    id: 'PRD-001',
    name: 'Dressed Laterite Stone (30×20×15 cm)',
    sku: 'LAT-DIM-302015',
    category: 'DIMENSION_STONE',
    unit: 'Piece',
    hsnSac: '2516',
    gstRatePct: 5,
    purchaseRate: 32,
    salesRate: 46,
    minRate: 40,
    maxRate: 52,
    stockTracking: true,
    currentStock: 18400,
    reorderLevel: 5000,
    sourceQuarry: 'Calicut Laterite Concession #1',
    description: 'Precision-cut red dimension laterite stone extracted using computerized circular track saws.',
    isActive: true,
    rates: [
      {
        id: 'RR-101',
        rateType: 'DEFAULT',
        rate: 46,
        unit: 'Piece',
        effectiveFrom: '2026-01-01',
        sourceLabel: 'Standard Catalog Default Rate'
      },
      {
        id: 'RR-102',
        rateType: 'CUSTOMER_SPECIFIC',
        targetEntityName: 'Sobha Developers Ltd',
        rate: 42,
        unit: 'Piece',
        effectiveFrom: '2026-01-15',
        sourceLabel: 'Enterprise Client Contractual Discount'
      },
      {
        id: 'RR-103',
        rateType: 'QUANTITY_TIER',
        minQty: 3000,
        rate: 41,
        unit: 'Piece',
        effectiveFrom: '2026-01-01',
        sourceLabel: 'Bulk Order Wholesale Tier (>3,000 Pcs)'
      },
      {
        id: 'RR-104',
        rateType: 'LOCATION',
        location: 'Wayanad Hill Sector',
        rate: 49,
        unit: 'Piece',
        effectiveFrom: '2026-01-01',
        sourceLabel: 'High-Altitude Haulage Area Rate'
      }
    ]
  },
  {
    id: 'PRD-002',
    name: 'Manufactured Sand (M-Sand Zone II)',
    sku: 'AGG-MSAND-Z2',
    category: 'CRUSHED_SAND',
    unit: 'Ton',
    hsnSac: '2517',
    gstRatePct: 5,
    purchaseRate: 580,
    salesRate: 850,
    minRate: 780,
    maxRate: 920,
    stockTracking: true,
    currentStock: 4280,
    reorderLevel: 1000,
    sourceCrusher: 'Wayanad VSI Sand Plant',
    description: 'Cubical VSI-crushed granite sand graded to IS 383 Zone II specifications for high-strength RCC.',
    isActive: true,
    rates: [
      {
        id: 'RR-201',
        rateType: 'DEFAULT',
        rate: 850,
        unit: 'Ton',
        effectiveFrom: '2026-01-01',
        sourceLabel: 'Standard Ex-Plant Weighbridge Rate'
      },
      {
        id: 'RR-202',
        rateType: 'AGREEMENT',
        targetEntityName: 'National Highway NH-766 Package',
        rate: 800,
        unit: 'Ton',
        effectiveFrom: '2026-02-01',
        sourceLabel: 'State PWD Agreement Rate #PWD/2026/09'
      }
    ]
  },
  {
    id: 'PRD-003',
    name: '20mm Graded Concrete Blue Metal',
    sku: 'AGG-BLUEMETAL-20MM',
    category: 'CRUSHED_AGGREGATES',
    unit: 'Ton',
    hsnSac: '2517',
    gstRatePct: 5,
    purchaseRate: 510,
    salesRate: 780,
    minRate: 720,
    maxRate: 840,
    stockTracking: true,
    currentStock: 6120,
    reorderLevel: 1500,
    sourceCrusher: 'Wayanad VSI Sand Plant',
    description: 'Hard blue granite aggregates with flakiness index < 15%, ideal for bridge columns and slabs.',
    isActive: true,
    rates: [
      {
        id: 'RR-301',
        rateType: 'DEFAULT',
        rate: 780,
        unit: 'Ton',
        effectiveFrom: '2026-01-01',
        sourceLabel: 'Ex-Crusher Standard Gate Rate'
      }
    ]
  },
  {
    id: 'PRD-004',
    name: 'Plastering Sand (P-Sand <150µ Controlled)',
    sku: 'AGG-PSAND-FINE',
    category: 'CRUSHED_SAND',
    unit: 'Ton',
    hsnSac: '2517',
    gstRatePct: 5,
    purchaseRate: 640,
    salesRate: 960,
    minRate: 880,
    maxRate: 1040,
    stockTracking: true,
    currentStock: 1840,
    reorderLevel: 500,
    sourceCrusher: 'Wayanad VSI Sand Plant',
    description: 'Triple-washed micro-graded sand eliminating plaster cracks and efflorescence.',
    isActive: true,
    rates: [
      {
        id: 'RR-401',
        rateType: 'DEFAULT',
        rate: 960,
        unit: 'Ton',
        effectiveFrom: '2026-01-01',
        sourceLabel: 'Standard Premium Ex-Plant Rate'
      }
    ]
  },
  {
    id: 'PRD-005',
    name: 'Commercial High-Speed Diesel (Bulk)',
    sku: 'FUEL-HSD-BULK',
    category: 'FUEL_CONSUMABLE',
    unit: 'Litre',
    hsnSac: '2710',
    gstRatePct: 18,
    purchaseRate: 86.4,
    salesRate: 92.5,
    minRate: 88.0,
    maxRate: 95.0,
    stockTracking: true,
    currentStock: 14200,
    reorderLevel: 4000,
    preferredSupplier: 'Bharat Petroleum Yard Depot',
    description: 'Direct tanker delivery for quarry mobile bowser, excavators and diesel generators.',
    isActive: true,
    rates: [
      {
        id: 'RR-501',
        rateType: 'DEFAULT',
        rate: 92.5,
        unit: 'Litre',
        effectiveFrom: '2026-02-15',
        sourceLabel: 'Internal Yard Cost Allocation Rate'
      }
    ]
  }
];

// ==========================================
// 3. CENTRAL ORDERS (All 17 Statuses Supported)
// ==========================================
export const MOCK_CENTRAL_ORDERS: CentralOrder[] = [
  {
    id: 'ORD-9001',
    orderNumber: 'ORD-2026-0901',
    customerName: 'Thomas Mathew',
    customerId: 'PER-003',
    customerPhone: '+91 94471 88990',
    date: '2026-02-21 09:30 AM',
    deliveryDate: '2026-02-23',
    productName: 'Dressed Laterite Stone (30×20×15 cm)',
    productId: 'PRD-001',
    quantity: 2500,
    unit: 'Piece',
    appliedRate: 42,
    rateSource: 'Enterprise Client Contractual Discount (Sobha Group)',
    subtotal: 105000,
    gstAmount: 5250,
    totalAmount: 110250,
    paidAmount: 50000,
    balanceAmount: 60250,
    status: 'READY_FOR_DISPATCH',
    destination: 'NH Bypass Project Site, Calicut',
    assignedVehicle: 'KL-11-BH-9921',
    assignedDriver: 'Arun Varma',
    supplierOrPlantSource: 'Calicut Laterite Concession #1',
    dispatchId: 'DSP-8812',
    invoiceId: 'INV-2026-081',
    notes: 'Load inspection passed. Awaiting weighbridge tare slip before departure.'
  },
  {
    id: 'ORD-9002',
    orderNumber: 'ORD-2026-0902',
    customerName: 'Malabar Highway Infrastructure',
    customerId: 'PER-003',
    customerPhone: '+91 94470 33445',
    date: '2026-02-21 08:45 AM',
    deliveryDate: '2026-02-22',
    productName: 'Manufactured Sand (M-Sand Zone II)',
    productId: 'PRD-002',
    quantity: 220,
    unit: 'Ton',
    appliedRate: 800,
    rateSource: 'State PWD Agreement Rate #PWD/2026/09',
    subtotal: 176000,
    gstAmount: 8800,
    totalAmount: 184800,
    paidAmount: 184800,
    balanceAmount: 0,
    status: 'DISPATCHED',
    destination: 'Ghat Road Sector 2, Wayanad',
    assignedVehicle: 'KL-11-BH-9922',
    assignedDriver: 'M. K. Balaraman',
    supplierOrPlantSource: 'Wayanad VSI Sand Plant',
    dispatchId: 'DSP-8815',
    invoiceId: 'INV-2026-082',
    notes: 'En route via Thamarassery Churam. GPS tracker active.'
  },
  {
    id: 'ORD-9003',
    orderNumber: 'ORD-2026-0903',
    customerName: 'Calicut Heritage Villa Builders',
    customerId: 'PER-001',
    customerPhone: '+91 98470 12345',
    date: '2026-02-20 04:15 PM',
    deliveryDate: '2026-02-21',
    productName: '20mm Graded Concrete Blue Metal',
    productId: 'PRD-003',
    quantity: 140,
    unit: 'Ton',
    appliedRate: 780,
    rateSource: 'Ex-Crusher Standard Gate Rate',
    subtotal: 109200,
    gstAmount: 5460,
    totalAmount: 114660,
    paidAmount: 114660,
    balanceAmount: 0,
    status: 'COMPLETED',
    destination: 'Heritage Enclave Site, Meppadi',
    assignedVehicle: 'KL-11-CE-1004',
    assignedDriver: 'Mustafa K.',
    supplierOrPlantSource: 'Wayanad VSI Sand Plant',
    dispatchId: 'DSP-8809',
    invoiceId: 'INV-2026-080',
    notes: 'Delivered and acknowledged by site engineer.'
  },
  {
    id: 'ORD-9004',
    orderNumber: 'ORD-2026-0904',
    customerName: 'Kalyan Precast Industries',
    customerId: 'CUST-004',
    customerPhone: '+91 97441 77889',
    date: '2026-02-21 11:00 AM',
    deliveryDate: '2026-02-25',
    productName: 'Plastering Sand (P-Sand <150µ)',
    productId: 'PRD-004',
    quantity: 80,
    unit: 'Ton',
    appliedRate: 960,
    rateSource: 'Standard Premium Ex-Plant Rate',
    subtotal: 76800,
    gstAmount: 3840,
    totalAmount: 80640,
    paidAmount: 0,
    balanceAmount: 80640,
    status: 'PAYMENT_PENDING',
    destination: 'Precast Yard, Feroke',
    supplierOrPlantSource: 'Wayanad VSI Sand Plant',
    notes: 'Waiting for RTGS advance confirmation before dispatch scheduling.'
  },
  {
    id: 'ORD-9005',
    orderNumber: 'ORD-2026-0905',
    customerName: 'Skyline Builders Kerala',
    customerId: 'CUST-005',
    customerPhone: '+91 98472 66778',
    date: '2026-02-21 11:30 AM',
    deliveryDate: '2026-02-28',
    productName: 'Dressed Laterite Stone (30×20×15 cm)',
    productId: 'PRD-001',
    quantity: 5000,
    unit: 'Piece',
    appliedRate: 41,
    rateSource: 'Bulk Order Wholesale Tier (>3,000 Pcs)',
    subtotal: 205000,
    gstAmount: 10250,
    totalAmount: 215250,
    paidAmount: 0,
    balanceAmount: 215250,
    status: 'QUOTATION_RECEIVED',
    destination: 'Skyline Luxury Towers, Kozhikode',
    notes: 'Quotation sent via RZ OTT Task. Awaiting customer confirmation.'
  }
];

// ==========================================
// 4. PURCHASE LIFECYCLE (Request -> RFQ -> PO -> GRN -> Bill -> Payment)
// ==========================================
export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] = [
  {
    id: 'PR-101',
    requestNo: 'REQ-2026-0101',
    requestedBy: 'Rajesh Nair (Supervisor)',
    department: 'MINING',
    product: 'High-Tensile Wire Saw Diamond Beads',
    quantity: '150 Meters',
    requiredDate: '2026-02-26',
    purpose: 'Wire cutting for Laterite Pit Bench #3',
    priority: 'HIGH',
    approvalStatus: 'APPROVED'
  },
  {
    id: 'PR-102',
    requestNo: 'REQ-2026-0102',
    requestedBy: 'Mustafa K. (Crusher Plant Operator)',
    department: 'CRUSHER',
    product: 'VSI Crusher Rotor Tips & Anvil Wear Plates',
    quantity: '2 Complete Sets',
    requiredDate: '2026-02-28',
    purpose: 'Bi-monthly scheduled rotor lining replacement',
    priority: 'URGENT',
    approvalStatus: 'PENDING'
  },
  {
    id: 'PR-103',
    requestNo: 'REQ-2026-0103',
    requestedBy: 'Bilal Ahmed (Fleet Store In-Charge)',
    department: 'FLEET',
    product: 'Heavy Radial Tipper Tyres (10.00R20)',
    quantity: '12 Tyres',
    requiredDate: '2026-03-05',
    purpose: 'Tyre renewal for Tipper fleet units V001 to V003',
    priority: 'MEDIUM',
    approvalStatus: 'PENDING'
  }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-2026-01',
    poNumber: 'PO-2026-9041',
    supplierId: 'PER-007',
    supplierName: 'Sandvik Mining Spare Parts',
    date: '2026-02-18',
    deliveryDate: '2026-02-24',
    items: [
      {
        productName: 'Cone Crusher Manganese Mantle & Concave',
        qty: 2,
        unit: 'Piece',
        rate: 85000,
        discountPct: 5,
        gstPct: 18,
        total: 190570
      }
    ],
    subtotal: 161500,
    taxTotal: 29070,
    totalAmount: 190570,
    paymentTerms: '30 Days Net Credit',
    status: 'IN_TRANSIT'
  },
  {
    id: 'PO-2026-02',
    poNumber: 'PO-2026-9042',
    supplierId: 'SUPP-001',
    supplierName: 'Bharat Petroleum Yard Depot',
    date: '2026-02-20',
    deliveryDate: '2026-02-21',
    items: [
      {
        productName: 'Commercial High-Speed Diesel (Bulk)',
        qty: 12000,
        unit: 'Litre',
        rate: 86.4,
        discountPct: 0,
        gstPct: 18,
        total: 1223424
      }
    ],
    subtotal: 1036800,
    taxTotal: 186624,
    totalAmount: 1223424,
    paymentTerms: '15 Days Credit',
    status: 'DELIVERED'
  }
];

export const MOCK_GOODS_RECEIPT_NOTES: GoodsReceiptNote[] = [
  {
    id: 'GRN-101',
    grnNumber: 'GRN-2026-8801',
    poNumber: 'PO-2026-9042',
    supplierName: 'Bharat Petroleum Yard Depot',
    date: '2026-02-21 07:30 AM',
    productName: 'Commercial High-Speed Diesel (Bulk)',
    orderedQty: 12000,
    receivedQty: 12000,
    acceptedQty: 12000,
    rejectedQty: 0,
    vehicleNumber: 'KL-07-CD-4412',
    driverName: 'K. R. Varghese',
    gatePassNo: 'GP-IN-2026-041',
    remarks: 'Dip-stick calibration verified. Density test passed at 832 kg/m³.',
    status: 'VERIFIED'
  }
];

export const MOCK_PURCHASE_BILLS: PurchaseBill[] = [
  {
    id: 'BILL-101',
    billNumber: 'BILL-BP-9921',
    supplierName: 'Bharat Petroleum Yard Depot',
    grnNumber: 'GRN-2026-8801',
    poNumber: 'PO-2026-9042',
    billDate: '2026-02-21',
    dueDate: '2026-03-08',
    amount: 1036800,
    taxAmount: 186624,
    discount: 0,
    totalAmount: 1223424,
    paidAmount: 773424,
    balance: 450000,
    paymentStatus: 'PARTIALLY_PAID'
  },
  {
    id: 'BILL-102',
    billNumber: 'BILL-SV-4401',
    supplierName: 'Sandvik Mining Spare Parts',
    grnNumber: 'GRN-2026-8790',
    poNumber: 'PO-2026-9041',
    billDate: '2026-02-15',
    dueDate: '2026-03-15',
    amount: 161500,
    taxAmount: 29070,
    discount: 0,
    totalAmount: 190570,
    paidAmount: 0,
    balance: 190570,
    paymentStatus: 'UNPAID'
  }
];

// ==========================================
// 5. SALES INVOICES & QUOTATIONS
// ==========================================
export const MOCK_SALES_INVOICES: SalesInvoice[] = [
  {
    id: 'INV-101',
    invoiceNumber: 'INV-2026-081',
    orderNumber: 'ORD-2026-0901',
    customerName: 'Thomas Mathew (Sobha Developers)',
    customerId: 'PER-003',
    customerGst: '32AABCS8891P1ZR',
    invoiceDate: '2026-02-21',
    dueDate: '2026-03-23',
    items: [
      {
        name: 'Dressed Laterite Stone (30×20×15 cm)',
        qty: 2500,
        unit: 'Piece',
        rate: 42,
        amount: 105000
      }
    ],
    subtotal: 105000,
    gstTotal: 5250,
    roundOff: 0,
    totalAmount: 110250,
    paidAmount: 50000,
    balanceAmount: 60250,
    paymentStatus: 'PARTIALLY_PAID'
  },
  {
    id: 'INV-102',
    invoiceNumber: 'INV-2026-082',
    orderNumber: 'ORD-2026-0902',
    customerName: 'Malabar Highway Infrastructure',
    customerId: 'PER-003',
    customerGst: '32AACCM4412L1ZQ',
    invoiceDate: '2026-02-21',
    dueDate: '2026-03-05',
    items: [
      {
        name: 'Manufactured Sand (M-Sand Zone II)',
        qty: 220,
        unit: 'Ton',
        rate: 800,
        amount: 176000
      }
    ],
    subtotal: 176000,
    gstTotal: 8800,
    roundOff: 0,
    totalAmount: 184800,
    paidAmount: 184800,
    balanceAmount: 0,
    paymentStatus: 'PAID'
  }
];

// ==========================================
// 6. INVENTORY & SILOS ACROSS LOCATIONS
// ==========================================
export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'INV-ITM-01',
    productId: 'PRD-001',
    productName: 'Dressed Laterite Stone',
    category: 'Dimension Stone',
    location: 'Quarry #1 Pit',
    unit: 'Piece',
    openingStock: 16000,
    stockIn: 4800,
    stockOut: 2400,
    currentBalance: 18400,
    valuationRate: 35,
    totalValuation: 644000,
    status: 'OPTIMAL'
  },
  {
    id: 'INV-ITM-02',
    productId: 'PRD-002',
    productName: 'Manufactured Sand (M-Sand Zone II)',
    category: 'Crushed Sand',
    location: 'Crusher Plant Wayanad',
    unit: 'Ton',
    openingStock: 3500,
    stockIn: 1200,
    stockOut: 420,
    currentBalance: 4280,
    valuationRate: 600,
    totalValuation: 2568000,
    status: 'OPTIMAL'
  },
  {
    id: 'INV-ITM-03',
    productId: 'PRD-003',
    productName: '20mm Graded Concrete Blue Metal',
    category: 'Aggregates',
    location: 'Crusher Plant Wayanad',
    unit: 'Ton',
    openingStock: 5200,
    stockIn: 1400,
    stockOut: 480,
    currentBalance: 6120,
    valuationRate: 530,
    totalValuation: 3243600,
    status: 'OPTIMAL'
  },
  {
    id: 'INV-ITM-04',
    productId: 'PRD-004',
    productName: 'Plastering Sand (P-Sand fine)',
    category: 'Crushed Sand',
    location: 'Calicut Central Yard',
    unit: 'Ton',
    openingStock: 2100,
    stockIn: 200,
    stockOut: 460,
    currentBalance: 1840,
    valuationRate: 670,
    totalValuation: 1232800,
    status: 'OPTIMAL'
  },
  {
    id: 'INV-ITM-05',
    productId: 'PRD-005',
    productName: 'Bulk High-Speed Diesel',
    category: 'Consumable Fuel',
    location: 'Fuel Bowser Depot',
    unit: 'Litre',
    openingStock: 4200,
    stockIn: 12000,
    stockOut: 2000,
    currentBalance: 14200,
    valuationRate: 86.4,
    totalValuation: 1226880,
    status: 'OPTIMAL'
  }
];

// ==========================================
// 7. GATE PASSES (Incoming & Outgoing with QR)
// ==========================================
export const MOCK_GATE_PASSES: GatePassRecord[] = [
  {
    id: 'GP-001',
    gatePassNo: 'GP-OUT-2026-1092',
    passType: 'OUTGOING',
    dateTime: '2026-02-21 09:45 AM',
    location: 'Calicut Laterite Concession #1',
    partyName: 'Thomas Mathew (Sobha Developers)',
    partyType: 'CUSTOMER',
    orderOrPoNo: 'ORD-2026-0901',
    materialName: 'Dressed Laterite Stone (30×20×15 cm)',
    quantity: '2,500 Pieces (Weighbridge Gross 36.2 MT)',
    vehicleNumber: 'KL-11-BH-9921',
    driverName: 'Arun Varma',
    driverPhone: '+91 99951 10293',
    loadNumber: 'LOAD-LT-4412',
    destination: 'NH Bypass Project Site, Calicut',
    authorizedBy: 'Suresh Babu (Weighbridge Inspector)',
    qrCodeRef: 'RZ-GATEPASS-VALID-1092-TOKEN-OK'
  },
  {
    id: 'GP-002',
    gatePassNo: 'GP-IN-2026-041',
    passType: 'INCOMING',
    dateTime: '2026-02-21 07:20 AM',
    location: 'Wayanad VSI Sand Plant Yard',
    partyName: 'Bharat Petroleum Yard Depot',
    partyType: 'SUPPLIER',
    orderOrPoNo: 'PO-2026-9042',
    materialName: 'High-Speed Diesel (Tanker)',
    quantity: '12,000 Litres (Net Decanted)',
    vehicleNumber: 'KL-07-CD-4412',
    driverName: 'K. R. Varghese',
    driverPhone: '+91 98472 99881',
    loadNumber: 'TANK-HSD-09',
    destination: 'Yard Underground Tank #1',
    authorizedBy: 'Mustafa K. (Plant Operator)',
    qrCodeRef: 'RZ-GATEPASS-INSPECT-0041-TOKEN-OK'
  }
];

// ==========================================
// 8. STAFF, ATTENDANCE, ADVANCES, PAYROLL & BATTA
// ==========================================
export const MOCK_STAFF_MEMBERS: StaffProfile[] = [
  {
    id: 'STF-001',
    employeeId: 'EMP-001',
    name: 'Rajesh Nair',
    phone: '+91 98471 22334',
    department: 'MINING',
    designation: 'Quarry Pit Supervisor',
    role: 'SUPERVISOR',
    joiningDate: '2022-01-12',
    salaryType: 'MONTHLY',
    salaryRate: 28000,
    workLocation: 'Calicut Laterite Concession #1',
    bankName: 'Canara Bank',
    accountNo: '0812101099234',
    ifsc: 'CNRB0000812',
    status: 'ACTIVE',
    activeAdvancesBalance: 4000
  },
  {
    id: 'STF-002',
    employeeId: 'EMP-002',
    name: 'Mustafa K.',
    phone: '+91 94472 88192',
    department: 'CRUSHER',
    designation: 'VSI Sand Plant Lead Operator',
    role: 'OPERATOR',
    joiningDate: '2023-03-04',
    salaryType: 'MONTHLY',
    salaryRate: 24000,
    workLocation: 'Wayanad VSI Sand Plant',
    bankName: 'Federal Bank',
    accountNo: '1102910029381',
    ifsc: 'FDRL0001402',
    status: 'ACTIVE',
    activeAdvancesBalance: 1500
  },
  {
    id: 'STF-003',
    employeeId: 'EMP-003',
    name: 'Arun Varma',
    phone: '+91 99951 10293',
    department: 'FLEET',
    designation: 'Heavy Tipper Commercial Driver',
    role: 'DRIVER',
    joiningDate: '2021-08-15',
    salaryType: 'MONTHLY',
    salaryRate: 22000,
    workLocation: 'Malabar Fleet Depot',
    bankName: 'Kerala Gramin Bank',
    accountNo: '40192837102',
    ifsc: 'KLGB0040192',
    status: 'ACTIVE',
    activeAdvancesBalance: 5000
  },
  {
    id: 'STF-004',
    employeeId: 'EMP-004',
    name: 'Anjali Menon',
    phone: '+91 97455 33412',
    department: 'FINANCE',
    designation: 'Senior Commercial Accountant',
    role: 'ACCOUNTANT',
    joiningDate: '2021-02-01',
    salaryType: 'MONTHLY',
    salaryRate: 38000,
    workLocation: 'Corporate HQ Calicut',
    bankName: 'HDFC Bank',
    accountNo: '50100918231011',
    ifsc: 'HDFC0000182',
    status: 'ACTIVE',
    activeAdvancesBalance: 0
  }
];

export const MOCK_ATTENDANCE_LOGS: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    employeeId: 'EMP-001',
    employeeName: 'Rajesh Nair',
    date: '2026-02-21',
    shift: 'DAY',
    inTime: '07:45 AM',
    outTime: '05:30 PM',
    status: 'PRESENT',
    overtimeHours: 1.5,
    remarks: 'Overseeing double-wire saw shift'
  },
  {
    id: 'ATT-002',
    employeeId: 'EMP-002',
    employeeName: 'Mustafa K.',
    date: '2026-02-21',
    shift: 'DAY',
    inTime: '08:00 AM',
    outTime: '05:00 PM',
    status: 'PRESENT',
    overtimeHours: 0,
    remarks: 'Standard crusher run'
  },
  {
    id: 'ATT-003',
    employeeId: 'EMP-003',
    employeeName: 'Arun Varma',
    date: '2026-02-21',
    shift: 'DAY',
    inTime: '07:15 AM',
    outTime: '06:45 PM',
    status: 'PRESENT',
    overtimeHours: 2.5,
    remarks: 'Calicut bypass double-trip dispatch'
  }
];

export const MOCK_STAFF_ADVANCES: StaffAdvance[] = [
  {
    id: 'ADV-01',
    advanceNo: 'ADV-2026-012',
    employeeId: 'EMP-003',
    employeeName: 'Arun Varma (Driver)',
    requestDate: '2026-02-10',
    amount: 10000,
    purpose: 'Family medical expense and school fees',
    repaymentMethod: 'MONTHLY_SALARY_DEDUCTION',
    installmentPerMonth: 2500,
    balanceRemaining: 5000,
    status: 'DISBURSED'
  },
  {
    id: 'ADV-02',
    advanceNo: 'ADV-2026-014',
    employeeId: 'EMP-001',
    employeeName: 'Rajesh Nair (Supervisor)',
    requestDate: '2026-02-14',
    amount: 8000,
    purpose: 'Home festival maintenance',
    repaymentMethod: 'MONTHLY_SALARY_DEDUCTION',
    installmentPerMonth: 2000,
    balanceRemaining: 4000,
    status: 'DISBURSED'
  }
];

export const MOCK_BATTA_ALLOWANCES: BattaAllowance[] = [
  {
    id: 'BAT-01',
    employeeId: 'EMP-003',
    employeeName: 'Arun Varma',
    tripNo: 'TRIP-2026-441',
    date: '2026-02-21',
    allowanceType: 'TRIP_BATTA',
    amount: 600,
    approvalStatus: 'APPROVED',
    remarks: 'Calicut - Wayanad Ghat run batta'
  },
  {
    id: 'BAT-02',
    employeeId: 'EMP-003',
    employeeName: 'Arun Varma',
    tripNo: 'TRIP-2026-441',
    date: '2026-02-21',
    allowanceType: 'FOOD_ALLOWANCE',
    amount: 150,
    approvalStatus: 'PAID',
    remarks: 'Lunch allowance'
  }
];

// ==========================================
// 9. FINANCE, BANKS & CASH
// ==========================================
export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'BNK-01',
    bankName: 'HDFC Bank Corporate Current',
    accountNumber: '50200019283711',
    accountType: 'CURRENT',
    ifsc: 'HDFC0000182',
    branch: 'Calicut Main',
    openingBalance: 2500000,
    currentBalance: 2845200,
    status: 'ACTIVE'
  },
  {
    id: 'BNK-02',
    bankName: 'State Bank of India Operational',
    accountNumber: '30918239019',
    accountType: 'CURRENT',
    ifsc: 'SBIN0008621',
    branch: 'Kalpetta Main',
    openingBalance: 1200000,
    currentBalance: 1435250,
    status: 'ACTIVE'
  }
];

// ==========================================
// 10. OWNERSHIP, TRIP ACCOUNTS & SETTLEMENTS
// ==========================================
export const MOCK_OWNERSHIP_PARTNERS: OwnershipPartner[] = [
  {
    id: 'OWN-01',
    entityType: 'QUARRY',
    entityName: 'Calicut Laterite Concession #1',
    stakeholderName: 'K. P. Moideenkutty',
    relationship: 'LAND_OWNER',
    ownershipPct: 0,
    investmentAmount: 0,
    investmentPct: 0,
    revenuePct: 0,
    expensePct: 0,
    profitPct: 0,
    lossPct: 0,
    fixedRoyaltyPerUnit: 250,
    royaltyUnit: 'Load',
    unsettledAmount: 45000,
    settledYTD: 540000
  },
  {
    id: 'OWN-02',
    entityType: 'CRUSHER',
    entityName: 'Wayanad VSI Sand Plant',
    stakeholderName: 'Al-Haj R. Zain',
    relationship: 'INVESTOR',
    ownershipPct: 45,
    investmentAmount: 6500000,
    investmentPct: 45,
    revenuePct: 45,
    expensePct: 45,
    profitPct: 50, // Note: Investment % != Profit %
    lossPct: 45,
    unsettledAmount: 185000,
    settledYTD: 1420000
  },
  {
    id: 'OWN-03',
    entityType: 'VEHICLE',
    entityName: 'Tipper KL-11-BH-9921',
    stakeholderName: 'M. K. Balaraman',
    relationship: 'VEHICLE_OWNER',
    ownershipPct: 60,
    investmentAmount: 1800000,
    investmentPct: 60,
    revenuePct: 60,
    expensePct: 60,
    profitPct: 60,
    lossPct: 60,
    unsettledAmount: 38400,
    settledYTD: 420000
  }
];

export const MOCK_VEHICLE_TRIP_ACCOUNTS: VehicleTripAccount[] = [
  {
    id: 'TRIP-441',
    tripNo: 'TRIP-2026-441',
    date: '2026-02-21',
    vehicleNumber: 'KL-11-BH-9921',
    driverName: 'Arun Varma',
    customerName: 'Thomas Mathew (Sobha Developers)',
    pickupLocation: 'Calicut Laterite Concession #1',
    destination: 'NH Bypass Project Site, Calicut',
    loadMaterial: 'Dressed Laterite Stone',
    quantityTons: 18.5,
    freightRate: 450,
    tripIncome: 8325,
    dieselExpense: 2400,
    tollExpense: 180,
    driverBatta: 750,
    loadingUnloadingCost: 600,
    maintenanceReserve: 400,
    otherExpenses: 0,
    netTripProfit: 3995,
    ownerSettlementStatus: 'PENDING'
  },
  {
    id: 'TRIP-442',
    tripNo: 'TRIP-2026-442',
    date: '2026-02-20',
    vehicleNumber: 'KL-11-BH-9922',
    driverName: 'M. K. Balaraman',
    customerName: 'Malabar Highway Infrastructure',
    pickupLocation: 'Wayanad VSI Sand Plant',
    destination: 'Ghat Road Sector 2',
    loadMaterial: 'M-Sand Zone II',
    quantityTons: 24.0,
    freightRate: 480,
    tripIncome: 11520,
    dieselExpense: 3600,
    tollExpense: 220,
    driverBatta: 850,
    loadingUnloadingCost: 800,
    maintenanceReserve: 600,
    otherExpenses: 150,
    netTripProfit: 5300,
    ownerSettlementStatus: 'SETTLED'
  }
];

export const MOCK_SETTLEMENT_RECORDS: SettlementRecord[] = [
  {
    id: 'SET-001',
    settlementNo: 'SET-2026-041',
    category: 'LAND_OWNER',
    beneficiaryName: 'K. P. Moideenkutty',
    entityRef: 'Calicut Laterite Concession #1',
    period: 'Jan 2026 (180 Loads @ ₹250/load)',
    totalGrossEligible: 45000,
    deductions: 0,
    netPayable: 45000,
    status: 'APPROVED',
    paymentMode: 'NEFT / Bank Transfer'
  },
  {
    id: 'SET-002',
    settlementNo: 'SET-2026-042',
    category: 'VEHICLE_OWNER',
    beneficiaryName: 'M. K. Balaraman',
    entityRef: 'Tipper KL-11-BH-9921',
    period: 'Week 07 (14 Trips Profit Pool)',
    totalGrossEligible: 55930,
    deductions: 2500, // advance fuel adjustment
    netPayable: 53430,
    status: 'CALCULATED',
    paymentMode: 'IMPS'
  },
  {
    id: 'SET-003',
    settlementNo: 'SET-2026-043',
    category: 'INVESTOR',
    beneficiaryName: 'Al-Haj R. Zain',
    entityRef: 'Wayanad VSI Sand Plant',
    period: 'Q3 FY26 Net Operating Profit Distribution',
    totalGrossEligible: 310000,
    deductions: 0,
    netPayable: 310000,
    status: 'PENDING_APPROVAL',
    paymentMode: 'RTGS'
  }
];
