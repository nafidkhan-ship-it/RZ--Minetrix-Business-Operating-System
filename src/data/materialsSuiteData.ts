import { BuildingMaterialsSuiteModule } from '../types/architecture';

export const MATERIALS_PRODUCT_CATEGORIES = [
  {
    category: 'Quarry Products',
    icon: 'Pickaxe',
    description: 'Directly excavated natural stone blocks and laterite building blocks.',
    items: ['1st Grade Laterite Stone (Hard Dressing)', '2nd Grade Laterite Stone (Standard Block)', '3rd Grade Laterite Stone (Foundation Grade)']
  },
  {
    category: 'Crusher Products',
    icon: 'Layers',
    description: 'Crushed granite, aggregates, manufactured sand, and quarry by-products.',
    items: ['40mm Aggregate', '20mm Aggregate', '12mm Blue Metal', 'M-Sand (Manufactured Sand - Concrete)', 'P-Sand (Plastering Sand)', 'Quarry Dust / Crusher Waste']
  },
  {
    category: 'Core Construction Materials',
    icon: 'Building',
    description: 'Structural building essentials for masonry, reinforcement, and roofing.',
    items: ['Cement (OPC 53, PPC, PSC)', 'TMT Steel Bars (Fe 500D, Fe 550)', 'Ready-Mix Concrete (RMC)', 'Interlock & Paver Blocks']
  },
  {
    category: 'Finishing & Interior Materials',
    icon: 'Grid',
    description: 'Tiles, paints, woodwork, glass, and architectural fittings.',
    items: ['Vitrified & Ceramic Tiles', 'Emulsion Paints & Primers', 'Timber & Seasoned Wood', 'Plywood & Laminates', 'Glass & Mirror Panels', 'Aluminium & UPVC Window Profiles']
  },
  {
    category: 'MEP, Roofing & Safety',
    icon: 'Wrench',
    description: 'Electrical, plumbing, chemicals, roofing sheets, and site safety gear.',
    items: ['Electrical Wires & Cables', 'PVC & CPVC Plumbing Pipes', 'Roofing Sheets & Tiles', 'Construction Chemicals & Waterproofing', 'Site Safety Equipment (Helmets, Harnesses, Gloves)']
  }
];

export const BUILDING_MATERIALS_MODULES: BuildingMaterialsSuiteModule[] = [
  {
    id: 'executive-dashboard',
    number: 1,
    title: 'Building Materials Executive Dashboard',
    icon: 'LayoutDashboard',
    category: 'Finance & Intelligence',
    summary: 'Executive control tower displaying live sales volume, purchase order commitments, real-time inventory valuations, fast/slow-moving product heatmaps, low stock warnings, outstanding receivables, and AI business insights.',
    subModules: [
      'Sales KPIs (Daily Sales, Monthly Realization, Gross Margins)',
      'Purchase KPIs (Vendor Commitment, Pending Deliveries, GRN Status)',
      'Real-Time Multi-Warehouse Inventory Valuation (FIFO & Moving Average)',
      'Fast-Moving vs Slow-Moving Material Velocity Heatmap',
      'Low Stock & Safety Buffer Threshold Alert Center',
      'Pending Customer Delivery Backlog & Queue Monitor',
      'Customer Outstanding Balances & Credit Aging Matrix',
      'Gemini AI Supply Chain Anomaly & Demand Insights Feed'
    ],
    keyCapabilities: [
      'Real-time inventory valuation updates upon every GRN or Sales Invoice posting.',
      'Fast/Slow-moving ABC analysis categorizing materials into high-velocity vs dead stock.',
      'Multi-unit branch and warehouse consolidation with instant drill-down to bin level.'
    ],
    masterDataEntities: ['WarehouseMaster', 'StockLedger', 'SalesOrder', 'PurchaseOrder'],
    eventIntegrations: {
      publishes: ['materials.dashboard.viewed'],
      subscribes: ['materials.stock.updated', 'materials.sales.invoiced', 'materials.purchase.grn_posted']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Natural language query for inventory turnover and product margin trends']
  },
  {
    id: 'materials-masters',
    number: 2,
    title: 'Product Catalog & Master Data Management (MDM)',
    icon: 'Database',
    category: 'Masters & Catalog',
    summary: 'Centralized product and party master data repository managing SKU taxonomies, multi-brand listings, supplier profiles, dealer hierarchies, warehouse layouts, price lists, and GST tax codes.',
    subModules: [
      'Product Master (SKU Code, HSN Code, Dimensions, Density, Standard Weight)',
      'Product Category & Sub-Category Hierarchy (Quarry, Crusher, Hardware, Finishing)',
      'Brand & Manufacturer Directory (UltraTech, Tata Tiscon, Asian Paints, Finolex)',
      'Supplier & Vendor Master (Commercial terms, Lead times, Payment terms)',
      'Dealer & Sub-Dealer Hierarchy Master',
      'Customer Directory (Retailers, Contractors, Builders, B2B Accounts)',
      'Warehouse & Storage Bay Master (Aisle, Rack, Shelf, Yard Bin)',
      'Unit of Measure (UOM) Master (Ton, CFT, Bag, Meter, Piece, Sq.Ft, Bundle)',
      'GST Tax Code & Royalty Surcharge Master',
      'Multi-Tier Price List & Discount Policy Matrix',
      'Business Unit & Retail Store Mapping'
    ],
    keyCapabilities: [
      'Multi-UOM conversion engine supporting dual units (e.g. 1 Ton = 35.31 CFT for aggregates; 1 Bundle = 10 TMT Steel Bars).',
      'HSN code auto-mapping with corresponding GST rates (e.g. 5% for aggregate, 18% for cement/steel, 28% for paints).',
      'Dealer network mapping with tiered discount and rebate qualification rules.'
    ],
    masterDataEntities: ['ProductMaster', 'ProductCategory', 'BrandMaster', 'SupplierMaster', 'DealerMaster', 'WarehouseMaster'],
    eventIntegrations: {
      publishes: ['materials.master.product_created', 'materials.master.pricelist_updated'],
      subscribes: ['core.master.tax_updated']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Multi-Tenant Platform (Mod 3)']
  },
  {
    id: 'purchase-management',
    number: 3,
    title: 'Procurement & Purchase Order Management',
    icon: 'ShoppingBag',
    category: 'Procurement & Inventory',
    summary: 'End-to-end purchasing workflow governing vendor RFQs, purchase quotations, PO approval cycles, Goods Receipt Notes (GRN), quality inspections, purchase returns, and supplier payables.',
    subModules: [
      'Purchase Enquiry & Requisition Management',
      'Supplier Purchase Quotation Comparison Matrix',
      'Purchase Order (PO) Builder & Multi-Level Approval Workflow',
      'Goods Receipt Note (GRN) & Physical Inspection Register',
      'Quality Inspection & Material Rejection Log',
      'Purchase Return & Debit Note Generator',
      'Supplier Payment Disbursement Register',
      'Procurement Cost & Vendor Lead Time Analytics'
    ],
    keyCapabilities: [
      'Three-way match validation (Purchase Order vs GRN Weight Ticket vs Supplier Invoice).',
      'Quality tolerance parameters (e.g., moisture deduction for sand, bent bar tolerance for steel).',
      'Automated purchase order creation when stock drops below safety reorder points.'
    ],
    masterDataEntities: ['PurchaseEnquiry', 'PurchaseOrder', 'GoodsReceiptNote', 'PurchaseInvoice'],
    eventIntegrations: {
      publishes: ['materials.purchase.po_created', 'materials.purchase.grn_posted'],
      subscribes: ['materials.stock.reorder_triggered']
    },
    sharedCoreDependencies: ['Shared Workflow Engine (Mod 16)', 'Finance Shared Services Bridge (Mod 8)']
  },
  {
    id: 'inventory-management',
    number: 4,
    title: 'Multi-Warehouse & Stock Control Management',
    icon: 'PackageSearch',
    category: 'Procurement & Inventory',
    summary: 'Advanced inventory control system supporting multi-warehouse transfers, yard bin management, batch/serial tracking, QR/barcode scanning, stock adjustments, and physical audit reconciliation.',
    subModules: [
      'Multi-Warehouse & Yard Depot Inventory Ledger',
      'Inter-Depot Stock Transfer Orders & Transit Ingestion',
      'Stock Adjustment & Scrap/Moisture Loss Ledger',
      'Batch & Manufacturing Date Tracking (Cement batches, Paint lots)',
      'Serial Number Tracking (Power tools, heavy machinery spares)',
      'Barcode & QR Code Mobile Scanner Ingestion',
      'Physical Inventory Stock Verification & Audit Adapter',
      'Volumetric Stock Yard Measurement Adapter (Drone / Laser Survey)'
    ],
    keyCapabilities: [
      'FIFO and Moving Average stock valuation updated continuously in real time.',
      'Mobile handheld QR code scanning for fast stock receiving, picking, and dispatching.',
      'Moisture loss allowance ledger for washed sand and aggregates in transit.'
    ],
    masterDataEntities: ['StockEntry', 'StockTransferOrder', 'BatchLotRecord', 'StockAdjustmentLog'],
    eventIntegrations: {
      publishes: ['materials.stock.updated', 'materials.stock.reorder_triggered'],
      subscribes: ['materials.purchase.grn_posted', 'materials.sales.dispatched']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'sales-management',
    number: 5,
    title: 'Sales Order, B2B Invoicing & Credit Limit Engine',
    icon: 'ShoppingCart',
    category: 'Sales & Public Ordering',
    summary: 'Commercial sales suite managing customer quotations, sales order entry, automated credit limit checks, tax-compliant GST sales invoicing, delivery challans, and customer payment collections.',
    subModules: [
      'Sales Quotation & Project Cost Estimator',
      'Sales Order Entry & Stock Reservation Engine',
      'Tax-Compliant GST Sales Invoice Generator (E-Way Bill Ready)',
      'Delivery Challan & Dispatch Gate Pass',
      'Sales Return & Credit Note Generator',
      'Customer Payment Collection & Cash/UPI Ingestion',
      'Automated Customer Credit Limit & Overdue Lockout Enforcer'
    ],
    keyCapabilities: [
      'Instant stock reservation upon Sales Order confirmation preventing over-commitment.',
      'Automated credit limit check — blocks order processing if customer overdue balance exceeds terms.',
      'Direct GST E-Way Bill JSON generation for goods movement exceeding threshold value.'
    ],
    masterDataEntities: ['SalesQuotation', 'SalesOrder', 'SalesInvoice', 'CustomerCreditLedger'],
    eventIntegrations: {
      publishes: ['materials.sales.order_created', 'materials.sales.invoiced'],
      subscribes: ['crm.quote.approved']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Document Management System (Mod 7)']
  },
  {
    id: 'delivery-management',
    number: 6,
    title: 'Building Materials Delivery & Dispatch Planning',
    icon: 'Truck',
    category: 'Pricing & Logistics',
    summary: 'Fulfillment and transport dispatch suite linking sales orders to tippers, flatbed lorries, and pickups, managing route slotting, driver notifications, live transit tracking, and electronic proof of delivery.',
    subModules: [
      'Delivery Order Planning & Slot Allocation',
      'Vehicle Allocation Engine (Tipper, Lorry, Flatbed, Pickup)',
      'Driver Shift Assignment & Mobile App Push Notification',
      'Yard Loading Queue & Scalehouse Dispatch Register',
      'Live Delivery Transit GPS Tracking',
      'Customer Delivery Confirmation & Digital Proof of Delivery (e-POD)'
    ],
    keyCapabilities: [
      'Integration with Fleet & Logistics Suite triggering automatic tipper allocation.',
      'Customer WhatsApp delivery notification with live vehicle tracking URL.',
      'Digital signature and photo upload of unloaded material on customer site.'
    ],
    masterDataEntities: ['DeliveryPlan', 'VehicleAllocation', 'ProofOfDelivery'],
    eventIntegrations: {
      publishes: ['materials.delivery.scheduled', 'materials.delivery.completed'],
      subscribes: ['fleet.trip.completed', 'materials.sales.order_created']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Fleet Suite Bridge (Phase 5)']
  },
  {
    id: 'pricing-engine',
    number: 7,
    title: 'Multi-Tier Dynamic Pricing & Discount Rules Engine',
    icon: 'Tag',
    category: 'Pricing & Logistics',
    summary: 'Flexible pricing matrix supporting retail, wholesale, dealer, contractor, and project-specific price lists, volume break discounts, promotional schemes, and dynamic location surcharge calculations.',
    subModules: [
      'Multi-List Price Matrix (Retail, Wholesale, Dealer, Project Contractor)',
      'Location-Based Dynamic Freight Surcharge Calculator',
      'Quantity Volume Break Discount Matrix',
      'Trade Scheme & Seasonal Promotional Offer Management',
      'Dealer Margin & Turnover Rebate Settlement Engine',
      'Real-Time Margin Protection Floor Checker'
    ],
    keyCapabilities: [
      'Hierarchical price precedence: Contract/Project Price > Dealer Price > Volume Break > Base List Price.',
      'Margin floor protection preventing sales staff from discounting below minimum gross profit threshold.',
      'Dynamic freight matrix adding per-kilometer haulage cost to material price.'
    ],
    masterDataEntities: ['PriceList', 'DiscountRule', 'PromotionalScheme', 'FreightSurchargeMatrix'],
    eventIntegrations: {
      publishes: ['materials.pricing.updated'],
      subscribes: ['materials.master.product_created']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Finance Shared Services Bridge (Mod 8)']
  },
  {
    id: 'materials-finance',
    number: 8,
    title: 'Inventory Accounting, GST & Financials Engine',
    icon: 'Receipt',
    category: 'Finance & Intelligence',
    summary: 'Specialized building materials cost accounting engine governing purchase ledgers, sales ledgers, inventory valuation, GST input tax credit (ITC) reconciliation, and product profitability analysis.',
    subModules: [
      'Purchase Ledger & Supplier Accounts Payable',
      'Sales Ledger & Customer Accounts Receivable',
      'Inventory Valuation Engine (FIFO & Moving Average cost ledgers)',
      'Material Margin & Landed Cost Analyzer (Product cost + Freight + Royalty)',
      'GST Input Tax Credit (ITC) & Output Tax Reconciliation',
      'Double-Entry General Ledger Journal Posting Adapter',
      'Product & Store Cost Center Profitability Analyzer'
    ],
    keyCapabilities: [
      'Automated landed cost calculation incorporating material base price, transport freight, and government royalty fee.',
      'Direct integration with General Ledger creating double-entry accounting journals for every sale/purchase.',
      'GST tax liability calculation comparing ITC against output GST collected.'
    ],
    masterDataEntities: ['InventoryValuationLedger', 'GSTReconciliationRecord', 'LandedCostCalculator'],
    eventIntegrations: {
      publishes: ['materials.fin.journal_posted', 'materials.fin.margin_analyzed'],
      subscribes: ['materials.sales.invoiced', 'materials.purchase.grn_posted']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Shared Master Data Management (Mod 5)']
  },
  {
    id: 'materials-reports',
    number: 9,
    title: 'Supply Chain Analytics & Inventory Intelligence Reports',
    icon: 'BarChart3',
    category: 'Finance & Intelligence',
    summary: 'Comprehensive reporting module delivering real-time stock aging reports, product margin breakdowns, warehouse throughput velocity, vendor performance scorecards, and sales realization summaries.',
    subModules: [
      'Sales Realization & Margin Breakdown Reports',
      'Procurement Lead Time & Vendor Quality Scorecards',
      'Inventory Aging Analysis (0-30 days, 31-60 days, > 90 days slow stock)',
      'Stock Turnover & ABC Velocity Analysis',
      'Product & Category Profitability Heatmaps',
      'Warehouse Space Utilization & Stock Loss Summaries',
      'Customer Credit Aging & Outstanding Balance Summaries',
      'Supplier Purchase Volume & Discount Audit Reports'
    ],
    keyCapabilities: [
      'Streaming PDF and Excel report generation with custom column filters.',
      'Scheduled daily morning inventory balance alerts sent to warehouse managers via WhatsApp/Email.',
      'Interactive Recharts visualizations for stock turnover and sales margin trends.'
    ],
    masterDataEntities: ['MaterialsReportTemplate', 'ScheduledReportJob'],
    eventIntegrations: {
      publishes: ['materials.report.generated'],
      subscribes: ['core.report.trigger_requested']
    },
    sharedCoreDependencies: ['Dynamic Reporting Engine (Mod 11)', 'Document Management System (Mod 7)']
  },
  {
    id: 'materials-ai-features',
    number: 10,
    title: 'Gemini AI Inventory Forecasting & Smart Reorder Engine',
    icon: 'Sparkles',
    category: 'Finance & Intelligence',
    summary: 'Server-side AI suite powered by Gemini models for demand forecasting, stockout prediction, auto-reorder point optimization, dynamic pricing recommendations, and customer purchasing pattern analytics.',
    subModules: [
      'AI Construction Material Demand Forecasting Model',
      'Stockout Risk Prediction & Seasonal Consumption Optimizer',
      'Automated Reorder Point (ROP) & Economic Order Quantity (EOQ) Generator',
      'AI Dynamic Price Optimization Engine',
      'Sales Velocity Trend & Weather Correlation Analyzer',
      'Customer Buying Pattern & Cross-Sell Recommendation Copilot',
      'Executive Building Materials AI Copilot'
    ],
    keyCapabilities: [
      'Server-side Gemini 2.5 Flash execution via `/api/ai/materials/*` ensuring security.',
      'Monsoon weather correlation algorithm predicting cement/aggregate demand slumps and adjusting reorder levels.',
      'Cross-sell recommendation engine suggesting complementary items (e.g. tile adhesive when vitrified tiles are added to sales order).'
    ],
    masterDataEntities: ['AIMaterialsPrediction', 'AIDemandForecast'],
    eventIntegrations: {
      publishes: ['materials.ai.reorder_suggested', 'materials.ai.forecast_generated'],
      subscribes: ['materials.stock.updated', 'materials.sales.invoiced']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'Audit & Telemetry (Mod 14)'],
    aiFeatures: ['Gemini 2.5 Flash demand forecasting', 'Auto-reorder point optimization', 'Weather-correlated stock planner']
  }
];

export const PUBLIC_ORDERING_ARCHITECTURE = {
  title: 'Public Online Ordering System Architecture — "Order Laterite Stone & Building Materials Online"',
  description: 'Consumer and contractor e-commerce portal enabling online ordering of 1st/2nd/3rd quality Laterite Stones, M-Sand, P-Sand, Aggregates, Cement, and TMT Steel with location-based supplier discovery, live stock verification, dynamic delivery slotting, and payment processing.',
  coreCapabilities: [
    {
      feature: '1. Location-Based Supplier & Yard Discovery',
      detail: 'Uses user browser GPS coordinates or pin code geofencing to discover nearest quarry yards, crushers, and building material stores within 25 km radius.'
    },
    {
      feature: '2. Live Stock & Capacity Verification',
      detail: 'Queries live inventory ledger across nearby supplier warehouses to guarantee instant material availability before cart confirmation.'
    },
    {
      feature: '3. Flexible Material Unit & Quantity Selector',
      detail: 'Supports intuitive unit selection: Laterite Stones in Block count / Truck load; Sands & Aggregates in CFT / Ton; Cement in Bags; Steel in Bundles / Ton.'
    },
    {
      feature: '4. Dynamic Freight & Haulage Estimator',
      detail: 'Calculates exact delivery transport charge in real time using GIS road distance matrix from dispatch yard to customer site.'
    },
    {
      feature: '5. Automated Tipper & Delivery Scheduling',
      detail: 'Reserves tippers or lorries via Fleet & Logistics Suite, granting customers time-slot selection (e.g. Morning 7:00 AM - 10:00 AM delivery).'
    },
    {
      feature: '6. Live GPS Transit Order Tracking',
      detail: 'Provides customer with live interactive vector map displaying assigned tipper location, ETA countdown, and driver phone link.'
    },
    {
      feature: '7. Dual Payment Modes (Online Gateway & COD)',
      detail: 'Integrated with Razorpay/Stripe for instant UPI/Credit Card payments and Cash on Delivery (COD) with driver collection slip.'
    }
  ],
  supportedProducts: [
    '1st Quality Laterite Stone (Dressed Masonry Block)',
    '2nd Quality Laterite Stone (Standard Wall Block)',
    '3rd Quality Laterite Stone (Foundation & Infill Block)',
    'M-Sand (Manufactured Sand for Concrete)',
    'P-Sand (Plastering Fine Sand)',
    '20mm & 40mm Granite Aggregates',
    'OPC 53 & PPC Cement Bags',
    'TMT Fe 550 Steel Reinforcement Bars'
  ]
};

export const MATERIALS_SUPPLY_CHAIN_WORKFLOWS = [
  {
    step: 1,
    title: '1. Supplier & Purchase Order',
    subtitle: 'Requisition, Quotation & PO Approval',
    description: 'System detects low stock or receives customer project order, generates RFQ, compares vendor quotes, and issues approved Purchase Order.',
    icon: 'ShoppingBag',
    entities: ['PurchaseOrder', 'SupplierMaster', 'Requisition'],
    events: ['materials.purchase.po_created', 'materials.stock.reorder_triggered']
  },
  {
    step: 2,
    title: '2. Goods Receipt & Quality Inspection',
    subtitle: 'Weighbridge Ticket, GRN & Yard Bin Stacking',
    description: 'Material arrives at warehouse yard. Scalehouse measures weight, quality inspector verifies specs, and GRN posts stock to specific yard bin.',
    icon: 'PackageSearch',
    entities: ['GoodsReceiptNote', 'StockEntry', 'QualityInspection'],
    events: ['materials.purchase.grn_posted', 'materials.stock.updated']
  },
  {
    step: 3,
    title: '3. Sales Order & Inventory Reservation',
    subtitle: 'Customer Quote, Order & Price Matrix',
    description: 'B2B customer or public app user places order. System applies multi-tier price matrix, performs credit check, and reserves inventory.',
    icon: 'ShoppingCart',
    entities: ['SalesOrder', 'CustomerCreditLedger', 'PriceList'],
    events: ['materials.sales.order_created', 'materials.stock.reserved']
  },
  {
    step: 4,
    title: '4. Tipper Allocation & Delivery Dispatch',
    subtitle: 'Fleet Suite Integration & Route Slotting',
    description: 'Dispatch controller allocates tipper/lorry from Fleet Suite, generates Delivery Challan and E-Way Bill, and hands over to driver.',
    icon: 'Truck',
    entities: ['DeliveryPlan', 'VehicleAllocation', 'DeliveryChallan'],
    events: ['materials.delivery.scheduled', 'fleet.dispatch.allocated']
  },
  {
    step: 5,
    title: '5. Site Delivery, e-POD & Customer Invoicing',
    subtitle: 'Geofence Arrival, Customer Signature & GST Invoice',
    description: 'Tipper delivers aggregate/laterite to site. Driver captures e-POD photo and digital signature. System generates GST Sales Invoice.',
    icon: 'MapPin',
    entities: ['ProofOfDelivery', 'SalesInvoice', 'GSTRecord'],
    events: ['materials.delivery.completed', 'materials.sales.invoiced']
  },
  {
    step: 6,
    title: '6. General Ledger Finance & AI Demand Analytics',
    subtitle: 'Double-Entry Posting, ITC Reconciliation & Demand Forecast',
    description: 'Finance engine posts GL journals for sales revenue, inventory COGS, and freight. Gemini AI analyzes sales velocity to update demand forecasts.',
    icon: 'Receipt',
    entities: ['JournalEntry', 'InventoryValuationLedger', 'AIDemandForecast'],
    events: ['materials.fin.journal_posted', 'materials.ai.forecast_generated']
  }
];

export const MATERIALS_INTEGRATIONS_TOPOLOGY = [
  {
    system: 'Shared Core Platform',
    purpose: 'Universal Single Sign-On, 4-Tier RLS Tenant Isolation, Master Data Management, PDF Invoicing Engine, Omni-Channel WhatsApp/SMS Notifications, Gemini AI Server Proxy.',
    protocol: 'gRPC Internal Mesh / Node.js Local Imports'
  },
  {
    system: 'Mining Operations Suite',
    purpose: 'Direct raw material procurement from quarries and crusher plants (Laterite blocks, Blue Metal, M-Sand, P-Sand) with weighbridge gate pass sync.',
    protocol: 'Kafka / NATS Event Streaming (`mining.gatepass.issued`, `materials.purchase.grn_posted`)'
  },
  {
    system: 'Fleet & Logistics Suite',
    purpose: 'Automated tipper and lorry vehicle allocation, driver dispatch, live GPS transit tracking, and e-POD signature synchronization.',
    protocol: 'Inter-Service Event Adapter (`materials.delivery.scheduled`, `fleet.trip.created`)'
  },
  {
    system: 'CRM & Business Suite',
    purpose: 'Customer relationship tracking, builder/contractor credit terms management, leads from B2B projects.',
    protocol: 'Kafka Events (`crm.quote.approved`, `materials.sales.order_created`)'
  },
  {
    system: 'Marketplace Suite',
    purpose: 'Public e-commerce storefront for online ordering of Laterite Stones, sands, and aggregates with online payment gateway.',
    protocol: 'REST API Proxy via API Gateway'
  },
  {
    system: 'Finance Shared Engine',
    purpose: 'Double-entry General Ledger posting, customer receivables ledger, GST Input Tax Credit (ITC) reconciliation, landed cost accounting.',
    protocol: 'Direct Event Adapter (`materials.fin.journal_posted`)'
  },
  {
    system: 'HRMS Engine',
    purpose: 'Yard labor attendance, warehouse staff commissions, driver sales incentives.',
    protocol: 'REST Bridge (`core.hr.attendance_logged`)'
  }
];

export const MATERIALS_FOLDER_STRUCTURE = [
  'src/modules/building-materials/',
  '├── controllers/',
  '│   ├── product-catalog.controller.ts',
  '│   ├── purchase.controller.ts',
  '│   ├── inventory.controller.ts',
  '│   ├── sales.controller.ts',
  '│   ├── pricing.controller.ts',
  '│   ├── delivery.controller.ts',
  '│   └── public-ordering.controller.ts',
  '├── services/',
  '│   ├── multi-uom-converter.service.ts',
  '│   ├── fifo-valuation.service.ts',
  '│   ├── credit-limit-checker.service.ts',
  '│   ├── public-supplier-search.service.ts',
  '│   └── materials-ai-forecast.service.ts',
  '├── models/',
  '│   ├── product.model.ts',
  '│   ├── purchase-order.model.ts',
  '│   ├── stock-ledger.model.ts',
  '│   ├── sales-invoice.model.ts',
  '│   └── price-list.model.ts',
  '├── events/',
  '│   ├── materials-events.publisher.ts',
  '│   └── materials-events.subscriber.ts',
  '└── interfaces/',
  '    ├── public-order.interface.ts',
  '    └── stock-batch.interface.ts'
];

export const PHASE7_TRANSITION_REVIEW = {
  title: 'Phase 6 Building Materials Suite Architectural Review & Phase 7 Transition Plan',
  validatedCapabilities: [
    'Comprehensive Building Materials Coverage: 100% domain coverage across Quarry Products (Laterite 1st/2nd/3rd quality), Crusher Products, and structural building supplies.',
    'Multi-UOM & Landed Cost Mechanics: Seamless conversion between Tons, CFTs, Bags, and Bundles with landed cost calculation combining material + freight + royalty.',
    'Public Online Ordering Platform: Complete e-commerce architecture for ordering Laterite Stones and aggregates online with GPS supplier search and live stock check.',
    'Fleet & Mining Synchronization: Direct event integration with Mining Suite (scalehouse gate passes) and Fleet Suite (tipper dispatching).',
    'Gemini AI Supply Chain Copilot: Weather-correlated demand forecasting and automated reorder point optimization.'
  ],
  identifiedImprovementsForPhase7: [
    'CRM Opportunity Pipeline Sync: Auto-convert CRM construction project leads directly into multi-item building material quotations.',
    'General Ledger Accounts Receivable Integration: Real-time credit score rating of B2B builders based on payment behavior across suites.',
    'HRMS Yard Staff Incentive Matrix: Link warehouse picking accuracy and yard loading speed to monthly HRMS payroll bonuses.'
  ],
  status: 'APPROVED — READY FOR PHASE 7 (CRM, GENERAL LEDGER FINANCE & HRMS PAYROLL)'
};
