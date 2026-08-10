import { BoundedContextDomain, BusinessSuite, ArchitectureLayer } from '../types/architecture';

export const SYSTEM_OVERVIEW = {
  name: 'RZ® Minetrix Business Operating System (RZ® Minetrix BOS)',
  version: '1.0.0 Enterprise Architecture Blueprint',
  tagline: 'Modular Enterprise Operating Platform for Mining, Quarrying, Crusher, Fleet, Building Materials, Equipment Rental, and Construction Supply Chains',
  principles: [
    { title: 'One Platform, One Login', description: 'Single sign-on unified portal providing seamless role-based contextual switching across all business suites.' },
    { title: 'Shared Core Engine', description: 'Centralized authentication, multi-tenancy, finance, HRMS, AI, document management, and notification services.' },
    { title: 'Zero Duplicate Business Logic', description: 'Centralized master data management (MDM) preventing redundant item masters, customer accounts, or ledger books.' },
    { title: 'Loose Coupling & High Cohesion', description: 'Domain-Driven Design (DDD) bounded contexts communicating through event-driven asynchronous message buses and REST/gRPC APIs.' },
    { title: 'Multi-Tenant Cloud Native', description: 'Database row-level security (RLS) with strict tenant isolation (`tenant_id`, `company_id`, `branch_id`), supporting thousands of enterprise tenants.' },
    { title: 'Offline-First Mobile Capability', description: 'Field operator PWA apps with local IndexedDB queuing and auto-reconciliation upon cellular connectivity restore.' }
  ]
};

export const DOMAINS: BoundedContextDomain[] = [
  {
    id: 'shared-core',
    name: 'Shared Core Domain',
    code: 'DOM-CORE',
    iconName: 'ShieldCheck',
    color: 'emerald',
    description: 'Central foundation for multi-tenancy, identity, RBAC, subscription billing, documents, system configuration, and compliance audit logging.',
    aggregateRoots: ['Tenant', 'Company', 'User', 'Subscription', 'AuditLog'],
    entities: [
      {
        name: 'Company',
        aggregateRoot: 'Company',
        description: 'Primary legal enterprise tenant or subsidiary organization.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Unique company identifier' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'SaaS multi-tenant boundary' },
          { name: 'legal_name', type: 'VARCHAR(255)', description: 'Official registered company name' },
          { name: 'tax_id_gst', type: 'VARCHAR(50)', description: 'GSTIN / VAT / Tax Identification Number' },
          { name: 'currency_code', type: 'VARCHAR(3)', description: 'Default currency (e.g. INR, USD, AED)' },
          { name: 'status', type: 'ENUM', description: 'ACTIVE, SUSPENDED, ARCHIVED' },
          { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Record creation timestamp' }
        ],
        relationships: [
          { targetEntity: 'Branch', type: '1:N', description: 'Company owns multiple operating branches' },
          { targetEntity: 'BusinessUnit', type: '1:N', description: 'Company operates multiple business units' }
        ]
      },
      {
        name: 'Branch',
        description: 'Physical operational unit, quarry site, yard, or regional office.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Branch primary key' },
          { name: 'company_id', type: 'UUIDv7', isFk: true, description: 'Parent company ID' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'Tenant isolation key' },
          { name: 'code', type: 'VARCHAR(50)', description: 'Branch short code (e.g. QRY-NORTH-01)' },
          { name: 'name', type: 'VARCHAR(255)', description: 'Branch name' },
          { name: 'location_gps', type: 'GEOMETRY(Point)', description: 'Geographic coordinate for geofencing' }
        ],
        relationships: [
          { targetEntity: 'Company', type: '1:1', description: 'Belongs to parent company' }
        ]
      },
      {
        name: 'User',
        aggregateRoot: 'User',
        description: 'Enterprise user account with multi-tenant access rights and role assignments.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Global user ID' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'Tenant identifier' },
          { name: 'email', type: 'VARCHAR(255)', description: 'Unique login email' },
          { name: 'phone_number', type: 'VARCHAR(20)', description: 'Mobile phone for OTP & WhatsApp auth' },
          { name: 'password_hash', type: 'VARCHAR(255)', description: 'Argon2id encrypted password' },
          { name: 'is_active', type: 'BOOLEAN', description: 'Account status flag' }
        ],
        relationships: [
          { targetEntity: 'Role', type: 'N:M', description: 'Assigned multiple security roles' }
        ]
      },
      {
        name: 'AuditLog',
        aggregateRoot: 'AuditLog',
        description: 'Immutable record of system activities, schema changes, and sensitive data access.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Audit record ID' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'Tenant key' },
          { name: 'user_id', type: 'UUIDv7', isFk: true, description: 'Actor user ID' },
          { name: 'action', type: 'VARCHAR(100)', description: 'CREATE, UPDATE, DELETE, EXPORT' },
          { name: 'entity_name', type: 'VARCHAR(100)', description: 'Target entity (e.g., GatePass)' },
          { name: 'before_state', type: 'JSONB', description: 'Snapshot before mutation' },
          { name: 'after_state', type: 'JSONB', description: 'Snapshot after mutation' },
          { name: 'ip_address', type: 'INET', description: 'Request origin IP' }
        ],
        relationships: []
      }
    ],
    domainEvents: [
      { eventName: 'Core.UserAuthenticated', producer: 'Shared Core Auth', consumers: ['Audit Engine', 'Notification Service'], description: 'Triggered upon successful login or token refresh.' },
      { eventName: 'Core.CompanyCreated', producer: 'Shared Core Admin', consumers: ['Finance Domain', 'HRMS Domain'], description: 'Initializes default Chart of Accounts and HR policies.' }
    ]
  },
  {
    id: 'mining',
    name: 'Mining Domain',
    code: 'DOM-MINE',
    iconName: 'Pickaxe',
    color: 'amber',
    description: 'Manages Quarry operations (Laterite, Granite, Hard Rock), Crusher Plants, Production logs, Dispatch, Gate Passes, Royalty clearance, Machinery & Operator tracking.',
    aggregateRoots: ['Quarry', 'CrusherPlant', 'ProductionBatch', 'GatePass', 'Equipment'],
    entities: [
      {
        name: 'Quarry',
        aggregateRoot: 'Quarry',
        description: 'Physical mineral extraction site with lease metadata, environmental permits, and bench reserves.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Quarry primary key' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'Tenant key' },
          { name: 'company_id', type: 'UUIDv7', isFk: true, description: 'Operating company' },
          { name: 'quarry_type', type: 'ENUM', description: 'LATERITE, GRANITE, HARD_ROCK, AGGREGATE' },
          { name: 'lease_number', type: 'VARCHAR(100)', description: 'Government mining lease permit ID' },
          { name: 'total_area_acres', type: 'DECIMAL(10,2)', description: 'Lease boundary area' },
          { name: 'royalty_rate_per_ton', type: 'DECIMAL(12,2)', description: 'Government statutory royalty fee' }
        ],
        relationships: [
          { targetEntity: 'Production', type: '1:N', description: 'Daily blasted/excavated rock yield' },
          { targetEntity: 'LandOwner', type: 'N:M', description: 'Lease royalty agreements' }
        ]
      },
      {
        name: 'CrusherPlant',
        aggregateRoot: 'CrusherPlant',
        description: 'Crusher plant processing raw boulders into aggregates (20mm, 12mm, 6mm), M Sand, and P Sand.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Crusher plant ID' },
          { name: 'quarry_id', type: 'UUIDv7', isFk: true, description: 'Feed quarry location' },
          { name: 'plant_name', type: 'VARCHAR(200)', description: 'Plant name / Unit designation' },
          { name: 'capacity_tph', type: 'DECIMAL(8,2)', description: 'Rated production capacity in Tons Per Hour' }
        ],
        relationships: [
          { targetEntity: 'Production', type: '1:N', description: 'M-Sand / Aggregate production logs' }
        ]
      },
      {
        name: 'GatePass',
        aggregateRoot: 'GatePass',
        description: 'Weighbridge integrated dispatch ticket for outbound trucks carrying stones/aggregates.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Gate pass ticket ID' },
          { name: 'pass_number', type: 'VARCHAR(50)', description: 'Sequential barcode/QR dispatch number' },
          { name: 'vehicle_id', type: 'UUIDv7', isFk: true, description: 'Dispatched vehicle reference' },
          { name: 'driver_id', type: 'UUIDv7', isFk: true, description: 'Hauler driver reference' },
          { name: 'gross_weight_kg', type: 'DECIMAL(12,2)', description: 'Weighbridge gross weight' },
          { name: 'tare_weight_kg', type: 'DECIMAL(12,2)', description: 'Weighbridge empty truck weight' },
          { name: 'net_weight_tons', type: 'DECIMAL(12,2)', description: 'Calculated sale weight' },
          { name: 'royalty_pass_no', type: 'VARCHAR(100)', description: 'Statutory government E-Pass token' }
        ],
        relationships: [
          { targetEntity: 'Vehicle', type: '1:1', description: 'Assigned transport truck' },
          { targetEntity: 'SalesOrder', type: '1:1', description: 'Fulfills customer sales order' }
        ]
      },
      {
        name: 'Machinery',
        aggregateRoot: 'Equipment',
        description: 'Excavators, Wheel Loaders, Rock Breakers, Drills, and Dumpers operating in quarry.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Machine serial ID' },
          { name: 'machine_code', type: 'VARCHAR(50)', description: 'Internal fleet code (e.g. EXC-CAT-320)' },
          { name: 'category', type: 'ENUM', description: 'EXCAVATOR, BREAKER, DRILL_RIG, WHEEL_LOADER, DUMPER' },
          { name: 'hour_meter_current', type: 'DECIMAL(10,2)', description: 'Current engine runtime hours' },
          { name: 'fuel_capacity_liters', type: 'DECIMAL(8,2)', description: 'Fuel tank capacity' }
        ],
        relationships: [
          { targetEntity: 'MachineOperator', type: '1:N', description: 'Operators logging operational hours' }
        ]
      }
    ],
    domainEvents: [
      { eventName: 'Mining.GatePassIssued', producer: 'Mining Weighbridge Engine', consumers: ['Fleet Domain', 'Finance Domain', 'Building Materials Inventory'], description: 'Emitted when truck leaves quarry gate; auto-generates trip log, ledger invoice, and stock deduction.' },
      { eventName: 'Mining.RoyaltyThresholdExceeded', producer: 'Mining Compliance Engine', consumers: ['Notification Service', 'Executive Dashboard'], description: 'Alerts management when government royalty token balances run low.' }
    ]
  },
  {
    id: 'fleet',
    name: 'Fleet & Logistics Domain',
    code: 'DOM-FLEET',
    iconName: 'Truck',
    color: 'blue',
    description: 'Manages owned and third-party trucks, trip ticketing, GPS live telematics, fuel logs, vehicle maintenance, permits, and driver settlements.',
    aggregateRoots: ['Vehicle', 'Trip', 'Driver', 'VehicleOwner'],
    entities: [
      {
        name: 'Vehicle',
        aggregateRoot: 'Vehicle',
        description: 'Tipper trucks, trailers, dumpers, and logistics transit vehicles.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Vehicle ID' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'Tenant key' },
          { name: 'registration_no', type: 'VARCHAR(20)', description: 'Official license plate number' },
          { name: 'owner_type', type: 'ENUM', description: 'COMPANY_OWNED, ATTACHED_AGENCY, FREELANCE_OWNER' },
          { name: 'carrying_capacity_tons', type: 'DECIMAL(8,2)', description: 'Rated payload tonnage' },
          { name: 'insurance_expiry', type: 'DATE', description: 'Policy expiration date' },
          { name: 'permit_expiry', type: 'DATE', description: 'State/National permit renewal date' }
        ],
        relationships: [
          { targetEntity: 'VehicleOwner', type: '1:1', description: 'Vehicle ownership entity' },
          { targetEntity: 'Driver', type: '1:1', description: 'Currently assigned driver' }
        ]
      },
      {
        name: 'Trip',
        aggregateRoot: 'Trip',
        description: 'Single material transit execution from source quarry/yard to destination site/customer.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Trip ID' },
          { name: 'trip_number', type: 'VARCHAR(50)', description: 'Unique trip tracking reference' },
          { name: 'vehicle_id', type: 'UUIDv7', isFk: true, description: 'Transit truck' },
          { name: 'driver_id', type: 'UUIDv7', isFk: true, description: 'Transit driver' },
          { name: 'start_odometer', type: 'DECIMAL(10,2)', description: 'Odometer reading at departure' },
          { name: 'end_odometer', type: 'DECIMAL(10,2)', description: 'Odometer reading at arrival' },
          { name: 'freight_amount', type: 'DECIMAL(12,2)', description: 'Total trip freight charge' },
          { name: 'fuel_consumed_liters', type: 'DECIMAL(8,2)', description: 'Fuel consumed on trip' }
        ],
        relationships: [
          { targetEntity: 'GatePass', type: '1:1', description: 'Associated material dispatch ticket' }
        ]
      },
      {
        name: 'Driver',
        aggregateRoot: 'Driver',
        description: 'Commercial heavy vehicle operator with driving license and biometric compliance records.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Driver ID' },
          { name: 'employee_id', type: 'UUIDv7', isFk: true, description: 'Link to HRMS Employee profile' },
          { name: 'license_number', type: 'VARCHAR(50)', description: 'Heavy Commercial Driving License' },
          { name: 'license_expiry', type: 'DATE', description: 'License expiration date' },
          { name: 'settlement_type', type: 'ENUM', description: 'PER_TRIP_BATTA, MONTHLY_SALARY, PERCENTAGE_COMMISSION' }
        ],
        relationships: [
          { targetEntity: 'DriverSettlement', type: '1:N', description: 'Weekly trip payment vouchers' }
        ]
      }
    ],
    domainEvents: [
      { eventName: 'Fleet.TripCompleted', producer: 'Fleet Management System', consumers: ['Finance Domain', 'HRMS Payroll'], description: 'Triggers freight billing to customer and driver trip batta calculation.' },
      { eventName: 'Fleet.GeofenceViolation', producer: 'GPS Telematics Service', consumers: ['Notification Engine'], description: 'Alerts security if transit vehicle deviates from approved quarry route.' }
    ]
  },
  {
    id: 'building-materials',
    name: 'Building Materials Domain',
    code: 'DOM-MATS',
    iconName: 'Package',
    color: 'purple',
    description: 'Inventory, multi-warehouse, trade procurement and sales for Laterite, Aggregates, Cement, TMT Steel, Tiles, Paints, Hardware, UPVC, Plumbing & Electrical supplies.',
    aggregateRoots: ['Product', 'Warehouse', 'InventoryStock', 'PurchaseOrder'],
    entities: [
      {
        name: 'Product',
        aggregateRoot: 'Product',
        description: 'Master catalog item spanning quarried stone, crushed aggregates, and retail hardware items.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Product ID' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'Tenant key' },
          { name: 'sku', type: 'VARCHAR(100)', description: 'Stock Keeping Unit / Barcode' },
          { name: 'name', type: 'VARCHAR(255)', description: 'Product name' },
          { name: 'category', type: 'VARCHAR(100)', description: 'LATERITE_STONE, CEMENT, TMT_STEEL, PLUMBING, TILES' },
          { name: 'uom', type: 'VARCHAR(20)', description: 'Unit of Measure (TON, CFT, NOS, BAG, SQFT)' },
          { name: 'hsn_code', type: 'VARCHAR(20)', description: 'Harmonized System Nomenclature for Tax' },
          { name: 'min_reorder_level', type: 'DECIMAL(12,2)', description: 'Automated purchase trigger safety stock' }
        ],
        relationships: [
          { targetEntity: 'InventoryStock', type: '1:N', description: 'Stock quantities across warehouses' }
        ]
      },
      {
        name: 'Warehouse',
        aggregateRoot: 'Warehouse',
        description: 'Storage facility, depot, or quarry stockyard.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Warehouse ID' },
          { name: 'branch_id', type: 'UUIDv7', isFk: true, description: 'Operating branch' },
          { name: 'code', type: 'VARCHAR(50)', description: 'Facility identifier (e.g. YARD-MAIN-01)' },
          { name: 'name', type: 'VARCHAR(255)', description: 'Yard or Warehouse description' }
        ],
        relationships: [
          { targetEntity: 'InventoryStock', type: '1:N', description: 'Inventory holdings' }
        ]
      }
    ],
    domainEvents: [
      { eventName: 'Materials.StockDepletedBelowReorder', producer: 'Inventory Manager', consumers: ['CRM Purchase Module', 'AI Recommendation Engine'], description: 'Generates automated draft purchase order when stock dips.' }
    ]
  },
  {
    id: 'crm',
    name: 'CRM & Business Domain',
    code: 'DOM-CRM',
    iconName: 'Users',
    color: 'indigo',
    description: 'Manages Leads, Customers, Dealers, Contractors, Quotations, Agreements, Complaints, and Marketing workflows.',
    aggregateRoots: ['Lead', 'Customer', 'Quotation', 'ContractorAgreement'],
    entities: [
      {
        name: 'Customer',
        aggregateRoot: 'Customer',
        description: 'B2B Contractors, Real Estate Developers, Retail Buyers, and Infrastructure Companies.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Customer ID' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'Tenant key' },
          { name: 'customer_type', type: 'ENUM', description: 'CONTRACTOR, DEALER, INDIVIDUAL_BUILDER, GOVT_BODY' },
          { name: 'company_name', type: 'VARCHAR(255)', description: 'Business trading name' },
          { name: 'credit_limit', type: 'DECIMAL(14,2)', description: 'Approved credit limit' },
          { name: 'credit_days', type: 'INTEGER', description: 'Payment terms credit window (e.g. 30 days)' }
        ],
        relationships: [
          { targetEntity: 'Quotation', type: '1:N', description: 'Issued commercial proposals' },
          { targetEntity: 'SalesOrder', type: '1:N', description: 'Active material supply contracts' }
        ]
      }
    ],
    domainEvents: [
      { eventName: 'CRM.QuotationApproved', producer: 'CRM Workflow', consumers: ['Building Materials Domain', 'Mining Dispatch'], description: 'Converts lead quotation into confirmed Sales Order.' }
    ]
  },
  {
    id: 'marketplace',
    name: 'Marketplace Domain',
    code: 'DOM-MKT',
    iconName: 'ShoppingBag',
    color: 'rose',
    description: 'Public e-commerce ecosystem for ordering Laterite stone, Quarry material, buying/selling used quarry machinery, vehicle rental, and job listings.',
    aggregateRoots: ['MarketplaceListing', 'OnlineOrder', 'MachineBuySellListing', 'JobBoard'],
    entities: [
      {
        name: 'MarketplaceListing',
        aggregateRoot: 'MarketplaceListing',
        description: 'Public listing for materials, equipment rentals, or machinery sales.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Listing ID' },
          { name: 'listing_type', type: 'ENUM', description: 'STONE_ONLINE, USED_MACHINE_SALE, VEHICLE_RENTAL, JOB_VACANCY' },
          { name: 'title', type: 'VARCHAR(255)', description: 'Listing headline' },
          { name: 'price_amount', type: 'DECIMAL(12,2)', description: 'Asking price or rental rate' },
          { name: 'location_state_district', type: 'VARCHAR(150)', description: 'Regional location' },
          { name: 'is_verified_quarry', type: 'BOOLEAN', description: 'RZ Verified Seller badge' }
        ],
        relationships: []
      }
    ],
    domainEvents: [
      { eventName: 'Marketplace.StoneOrderPlaced', producer: 'Marketplace Portal', consumers: ['Mining Dispatch Suite', 'Finance Payment Gateway'], description: 'Direct customer order routed to nearest verified quarry.' }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Accounting Domain',
    code: 'DOM-FIN',
    iconName: 'Landmark',
    color: 'emerald',
    description: 'Double-entry general ledger, Chart of Accounts, Journal Vouchers, Accounts Receivable/Payable, Cash/Bank books, GST/Tax filings, and P&L statements.',
    aggregateRoots: ['Account', 'JournalEntry', 'Invoice', 'PaymentVoucher'],
    entities: [
      {
        name: 'Account',
        aggregateRoot: 'Account',
        description: 'Chart of Accounts node (Assets, Liabilities, Equity, Revenue, Expense).',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Account ID' },
          { name: 'tenant_id', type: 'UUID', isTenantKey: true, description: 'Tenant key' },
          { name: 'account_code', type: 'VARCHAR(50)', description: 'Ledger code (e.g. 1010-CASH)' },
          { name: 'account_name', type: 'VARCHAR(255)', description: 'Ledger description' },
          { name: 'account_type', type: 'ENUM', description: 'ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE' },
          { name: 'current_balance', type: 'DECIMAL(16,2)', description: 'Calculated real-time ledger balance' }
        ],
        relationships: [
          { targetEntity: 'JournalEntry', type: '1:N', description: 'Debits and credits postings' }
        ]
      },
      {
        name: 'Invoice',
        aggregateRoot: 'Invoice',
        description: 'Tax Invoice generated for quarry dispatches, sales, or transport trips.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Invoice ID' },
          { name: 'invoice_number', type: 'VARCHAR(100)', description: 'Statutory GST Tax Invoice Number' },
          { name: 'total_amount', type: 'DECIMAL(14,2)', description: 'Gross billable value' },
          { name: 'tax_amount_cgst_sgst', type: 'DECIMAL(14,2)', description: 'Calculated tax liability' },
          { name: 'payment_status', type: 'ENUM', description: 'UNPAID, PARTIALLY_PAID, PAID, OVERDUE' }
        ],
        relationships: [
          { targetEntity: 'GatePass', type: '1:1', description: 'Originating dispatch pass' }
        ]
      }
    ],
    domainEvents: [
      { eventName: 'Finance.InvoicePaid', producer: 'Payment Processor', consumers: ['CRM Customer Credit Manager', 'Notification Service'], description: 'Releases customer credit hold upon receipt confirmation.' }
    ]
  },
  {
    id: 'hrms',
    name: 'HRMS & Payroll Domain',
    code: 'DOM-HR',
    iconName: 'UserCheck',
    color: 'teal',
    description: 'Employee profiles, biometric attendance, shift scheduling, weekly quarry wage settlements, overtime, advances, and payroll slips.',
    aggregateRoots: ['Employee', 'AttendanceRecord', 'PayrollRun'],
    entities: [
      {
        name: 'Employee',
        aggregateRoot: 'Employee',
        description: 'Staff, quarry lab, crusher technician, weighbridge clerk, or driver.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Employee ID' },
          { name: 'employee_code', type: 'VARCHAR(50)', description: 'Internal badge code' },
          { name: 'full_name', type: 'VARCHAR(255)', description: 'Staff full name' },
          { name: 'wage_type', type: 'ENUM', description: 'MONTHLY_SALARY, DAILY_WAGE, PIECE_RATE_PER_TON' },
          { name: 'base_rate', type: 'DECIMAL(12,2)', description: 'Base salary or per-ton piece rate' }
        ],
        relationships: [
          { targetEntity: 'AttendanceRecord', type: '1:N', description: 'Biometric shift logs' }
        ]
      }
    ],
    domainEvents: [
      { eventName: 'HRMS.WeeklyPayrollFinalized', producer: 'HRMS Engine', consumers: ['Finance Journal Posting', 'WhatsApp Slip Dispatcher'], description: 'Posts labor expense journals and sends salary advice via WhatsApp.' }
    ]
  },
  {
    id: 'ai-automation',
    name: 'AI & Automation Domain',
    code: 'DOM-AI',
    iconName: 'Sparkles',
    color: 'amber',
    description: 'Gemini-powered OCR document extraction (Weighbridge tickets, Mining licenses, Vehicle RC/Insurance), Voice commands in local languages, and predictive demand analytics.',
    aggregateRoots: ['AIPromptSession', 'OCRDocumentProcessing', 'PredictiveModelRun'],
    entities: [
      {
        name: 'OCRDocumentProcessing',
        aggregateRoot: 'OCRDocumentProcessing',
        description: 'Automated OCR extraction record for physical weighbridge receipts or vehicle RC documents.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'OCR Record ID' },
          { name: 'document_type', type: 'ENUM', description: 'WEIGHBRIDGE_SLIP, VEHICLE_RC, MINING_LEASE_PERMIT, BANK_RECEIPT' },
          { name: 'image_url', type: 'VARCHAR(500)', description: 'Cloud Object Storage S3 link' },
          { name: 'extracted_json', type: 'JSONB', description: 'Gemini structured JSON parse result' },
          { name: 'confidence_score', type: 'DECIMAL(5,2)', description: 'Extraction accuracy rating' }
        ],
        relationships: []
      }
    ],
    domainEvents: [
      { eventName: 'AI.DocumentParsedSuccessfully', producer: 'Gemini AI OCR Service', consumers: ['Mining GatePass Form Auto-Fill'], description: 'Auto-populates gate pass details from scanned paper weighbridge slip.' }
    ]
  },
  {
    id: 'reporting',
    name: 'Reporting & Analytics Domain',
    code: 'DOM-REP',
    iconName: 'BarChart3',
    color: 'cyan',
    description: 'Cross-suite executive dashboards, KPI monitors, production yield analytics, vehicle fuel efficiency trends, and scheduled regulatory exports.',
    aggregateRoots: ['ExecutiveDashboard', 'ScheduledReportTrigger'],
    entities: [
      {
        name: 'ExecutiveDashboard',
        aggregateRoot: 'ExecutiveDashboard',
        description: 'Configurable metric visualization board for quarry owners and enterprise CFOs.',
        fields: [
          { name: 'id', type: 'UUIDv7', isPk: true, description: 'Dashboard ID' },
          { name: 'user_id', type: 'UUIDv7', isFk: true, description: 'Dashboard owner' },
          { name: 'widgets_config', type: 'JSONB', description: 'Grid layout & KPI metric bindings' }
        ],
        relationships: []
      }
    ],
    domainEvents: [
      { eventName: 'Reporting.DailySummaryGenerated', producer: 'Analytics Scheduler', consumers: ['WhatsApp Executive Broadcast'], description: 'Sends daily 8:00 PM quarry dispatch & revenue summary to owners.' }
    ]
  }
];

export const BUSINESS_SUITES: BusinessSuite[] = [
  {
    id: 'mining-suite',
    name: '1. Mining Operations Suite',
    code: 'SUITE-MINE',
    tagline: 'Quarrying, Crusher Plants, Dispatches, Weighbridge & Regulatory Royalty Compliance',
    color: 'amber',
    icon: 'Pickaxe',
    description: 'Complete operational control over Laterite, Granite, and Hard Rock quarries, Crusher Plants, Stone sizing, Gate Passes, Royalty tokens, Machine operator hours, and Land owner agreements.',
    modules: [
      {
        name: 'Quarry Extraction Management',
        description: 'Tracks blasting, bench cutting, block excavation yield, and rock density grading.',
        keyFeatures: ['Laterite stone size yield tracking', 'Granite block grade tagging', 'Excavator & breaker hour logging', 'Overburden clearance monitoring'],
        sharedCoreDependencies: ['Shared Core Tenant MDM', 'HRMS Operator Attendance', 'AI Voice Notes']
      },
      {
        name: 'Crusher Plant Automation',
        description: 'Monitors raw stone feeder input vs aggregate output (20mm, 12mm, 6mm, M Sand, P Sand).',
        keyFeatures: ['Feed rate vs aggregate yield ratio', 'Screen mesh wear tracking', 'Power consumption per ton', 'Stockpile volumetric estimating'],
        sharedCoreDependencies: ['Building Materials Inventory Engine', 'Finance Cost Center Engine']
      },
      {
        name: 'Automated Weighbridge & Gate Pass',
        description: 'Integrated weighbridge hardware automation producing instantaneous statutory gate tickets.',
        keyFeatures: ['RS232/IP Weighbridge camera integration', 'Tare & Gross weight calculation', 'QR Code Gate Pass printing', 'Statutory Royalty E-Pass token tracking'],
        sharedCoreDependencies: ['Fleet Vehicle Registry', 'Finance Invoicing Engine', 'WhatsApp Notification Gateway']
      }
    ]
  },
  {
    id: 'fleet-suite',
    name: '2. Fleet & Logistics Suite',
    code: 'SUITE-FLEET',
    tagline: 'Transport Operations, Tipper Management, GPS Telematics, Fuel & Maintenance',
    color: 'blue',
    icon: 'Truck',
    description: 'Manages transit tippers, freelance attached vehicles, driver settlements, GPS route tracking, fuel consumption ratios, and vehicle rental contracts.',
    modules: [
      {
        name: 'Vehicle & Owner ERP',
        description: 'Master record for company-owned trucks, attached private tippers, permits, and RC compliance.',
        keyFeatures: ['RC, Insurance & Pollution renewal alerts', 'Vehicle ownership profit-share setup', 'Fitness certificate vault', 'Driver assignment roster'],
        sharedCoreDependencies: ['Document Vault', 'Notification Engine']
      },
      {
        name: 'Trip & Freight Management',
        description: 'Real-time dispatch trip management from quarry to delivery site.',
        keyFeatures: ['Odometer & GPS route verification', 'Customer freight billing calculation', 'Driver trip batta vouchers', 'Fuel efficiency (Km/Liter) analysis'],
        sharedCoreDependencies: ['Mining Dispatch Engine', 'Finance AR/AP Ledger']
      }
    ]
  },
  {
    id: 'building-materials-suite',
    name: '3. Building Materials Suite',
    code: 'SUITE-MATS',
    tagline: 'Construction Inventory, Hardware, Multi-Warehouse & Trade Sales',
    color: 'purple',
    icon: 'Package',
    description: 'Covers retail and wholesale sales of Laterite, Aggregates, M-Sand, Cement, TMT Steel, Tiles, Paints, Plumbing, Electrical, Hardware, Roofing, UPVC, and Plywood.',
    modules: [
      {
        name: 'Multi-Warehouse Inventory Control',
        description: 'Real-time stock valuation across quarries, stockyards, and building material retail depots.',
        keyFeatures: ['FIFO/Weighted Average stock valuation', 'Barcode & QR Code inventory scanner', 'Inter-yard stock transfer transit tracking', 'Batch & expiry tracking for cement/paint'],
        sharedCoreDependencies: ['Shared Core Warehouse MDM', 'Finance Inventory Valuation']
      }
    ]
  },
  {
    id: 'crm-suite',
    name: '4. CRM & Business Suite',
    code: 'SUITE-CRM',
    tagline: 'Leads, Quotations, Contractor Supply Agreements, Customer Care & Marketing',
    color: 'indigo',
    icon: 'Users',
    description: 'Pipeline management for builders, infrastructure contractors, retail buyers, and supply dealers.',
    modules: [
      {
        name: 'Contractor & Quotation Pipeline',
        description: 'Customized rate sheets per ton/CFT, project supply agreements, and lead follow-ups.',
        keyFeatures: ['Multi-tier volume rate cards', 'Credit limit check before order approval', 'Contractor payment schedule tracking', 'Customer dispute & complaint ticketing'],
        sharedCoreDependencies: ['Finance Ledger Balance Check', 'WhatsApp Quoting Engine']
      }
    ]
  },
  {
    id: 'marketplace-suite',
    name: '5. Marketplace Suite',
    code: 'SUITE-MKT',
    tagline: 'Public Quarry Portal, Stone E-Commerce, Machinery Buy/Sell & Equipment Rentals',
    color: 'rose',
    icon: 'ShoppingBag',
    description: 'Public B2B/B2C marketplace for direct stone ordering, verified quarry listings, used machine trading, vehicle hiring, and industry job vacancies.',
    modules: [
      {
        name: 'Online Stone & Material Ordering',
        description: 'Direct online ordering portal for retail customers and contractors to purchase Laterite and aggregates.',
        keyFeatures: ['Geo-based nearest quarry finder', 'Instant delivery cost estimation', 'Online payment gateway integration', 'Live dispatch order tracking'],
        sharedCoreDependencies: ['Mining Dispatch Gateway', 'Finance Payment Gateway']
      }
    ]
  }
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    name: 'Layer 1: Presentation & Channel Gateway',
    title: 'Multi-Experience Frontend Channels',
    description: 'Responsive React PWA web console, iOS/Android native shell, Field Weighbridge kiosk UI, and WhatsApp Chatbot Interface.',
    components: [
      { name: 'Web Portal', tech: 'React 19 / TypeScript / Tailwind CSS', purpose: 'Responsive desktop executive & manager operational dashboard.' },
      { name: 'Mobile PWA Engine', tech: 'Workbox / IndexedDB Offline Sync', purpose: 'Field app for weighbridge operators, drivers, and quarry supervisors.' },
      { name: 'WhatsApp Bot Interface', tech: 'WhatsApp Business API Gateway', purpose: 'Conversational order placement, Gate Pass receipts, and daily sales alerts.' }
    ]
  },
  {
    name: 'Layer 2: API Gateway & Security Perimeter',
    title: 'Enterprise API Gateway & Security',
    description: 'Centralized entry point managing authentication, rate limiting, request validation, tenant routing, and SSL termination.',
    components: [
      { name: 'API Gateway', tech: 'Express / Nginx / Envoy', purpose: 'JWKS token inspection, tenant identification, rate limiting (10,000 rps).' },
      { name: 'Auth & OAuth Server', tech: 'Argon2id / JWT / OpenID Connect', purpose: 'SSO, MFA, and OAuth2 token authorization.' }
    ]
  },
  {
    name: 'Layer 3: Domain Service Mesh',
    title: 'Microservices & Event-Driven Engine',
    description: 'Decoupled domain services executing core business logic in isolation, bound by an asynchronous event bus.',
    components: [
      { name: 'Core Microservices', tech: 'Node.js / Express / TypeScript / Go', purpose: 'Services for Mining, Fleet, Building Materials, CRM, Finance, HRMS, AI.' },
      { name: 'Event Bus', tech: 'Apache Kafka / NATS JetStream / RabbitMQ', purpose: 'High-throughput event streaming for asynchronous cross-domain workflows.' }
    ]
  },
  {
    name: 'Layer 4: Data & Persistence Store',
    title: 'Isolated Multi-Tenant Storage',
    description: 'Polyglot storage layer supporting transactional PostgreSQL with RLS, Redis cache, and S3 Blob Storage.',
    components: [
      { name: 'Primary Relational DB', tech: 'PostgreSQL 16 with Row-Level Security', purpose: 'ACID transactional data store with tenant_id isolation.' },
      { name: 'L2 Cache & Session Store', tech: 'Redis Cluster', purpose: 'Session cache, weighbridge queue buffers, and rate-limit counters.' },
      { name: 'Document Object Storage', tech: 'S3 / Cloud Storage Engine', purpose: 'Storage for scanned RC documents, weighbridge images, and PDF tax invoices.' }
    ]
  }
];

export const DEVELOPMENT_ROADMAP = [
  { phase: 'Phase 1', title: 'Enterprise Architecture Blueprint', status: 'Completed', details: 'Complete software, system, module, layer, and deployment architecture specification.' },
  { phase: 'Phase 2', title: 'Domain Model & Database Blueprint', status: 'Completed', details: 'DDD bounded context domain modeling, entity definitions, schema strategies, and isolation standards.' },
  { phase: 'Phase 3', title: 'Core Engine & Shared Services Development', status: 'Upcoming', details: 'Multi-tenant auth, RBAC, Shared Core MDM, tenant context middleware, and API Gateway setup.' },
  { phase: 'Phase 4', title: 'Mining Operations & Weighbridge Suite', status: 'Planned', details: 'Quarry production, weighbridge camera integration, Gate Pass generation, and Royalty clearance.' },
  { phase: 'Phase 5', title: 'Fleet Logistics & Building Materials Suite', status: 'Planned', details: 'Vehicle ERP, GPS telematics, driver settlements, inventory management, and multi-warehouse stock.' },
  { phase: 'Phase 6', title: 'CRM, Finance & HRMS Integration', status: 'Planned', details: 'General ledger, Accounts Receivable/Payable, weekly wages, payroll, and quotation pipeline.' },
  { phase: 'Phase 7', title: 'Public Marketplace & AI Ecosystem', status: 'Planned', details: 'Online stone ordering portal, used machine trading, Gemini OCR, and predictive analytics.' }
];
