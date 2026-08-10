import { CrmSuiteModule } from '../types/architecture';

export const CRM_PARTNER_ROLES = [
  {
    role: 'Customers & B2B Buyers',
    icon: 'Users',
    description: 'Retail buyers, construction companies, real estate developers, and infrastructure contractors.',
    entities: ['CustomerMaster', 'CustomerProfile', 'CustomerCreditLedger']
  },
  {
    role: 'Dealers & Distributors',
    icon: 'Store',
    description: 'Authorized regional distributors, exclusive building material stores, and stone yards.',
    entities: ['DealerMaster', 'DistributorMaster', 'DealerTerritoryMap']
  },
  {
    role: 'Suppliers & Vendors',
    icon: 'Truck',
    description: 'Raw material suppliers, explosives providers, equipment vendors, and fuel traders.',
    entities: ['SupplierMaster', 'TransportContractorMaster', 'VendorRating']
  },
  {
    role: 'AEC Influencers',
    icon: 'Compass',
    description: 'Architects, structural engineers, civil contractors, and site project managers.',
    entities: ['ArchitectMaster', 'EngineerMaster', 'BuilderMaster', 'ContractorMaster']
  },
  {
    role: 'Intermediaries & Logistics',
    icon: 'Briefcase',
    description: 'Commission agents, sales brokers, transport contractors, and business partners.',
    entities: ['CommissionAgentMaster', 'BusinessPartnerMaster', 'TransportContractor']
  }
];

export const CRM_SUITE_MODULES: CrmSuiteModule[] = [
  {
    id: 'crm-dashboard',
    number: 1,
    title: 'CRM & Business Intelligence Executive Dashboard',
    icon: 'LayoutDashboard',
    category: 'Marketing & Intelligence',
    summary: 'Executive command center displaying lead conversion velocity, sales pipeline health, quotation realization, dealer network revenue, supplier performance scores, pending customer follow-ups, and AI revenue insights.',
    subModules: [
      'Lead KPIs (Lead Velocity Rate, Source ROI, Lead-to-Opportunity Ratio)',
      'Sales KPIs (Won vs Lost Revenue, Average Deal Size, Sales Cycle Length)',
      'Quotation Conversion Matrix & Win/Loss Reason Analytics',
      'Customer Growth & Cohort Retention Index',
      'Dealer & Distributor Performance Leaderboard',
      'Supplier Delivery & Quality Performance Index',
      'Pending Task, Call & Site Visit Follow-up Queue',
      'Weighted Revenue Pipeline Forecast by Stage',
      'Gemini AI Revenue Anomaly & Churn Risk Insights Feed'
    ],
    keyCapabilities: [
      'Real-time pipeline aggregation across Mining, Fleet, and Building Material customer touchpoints.',
      'Weighted deal stage probability calculation (Qualification 20%, Quote 50%, Order 90%).',
      'Instant drill-down from macro executive metrics to individual sales rep activity logs.'
    ],
    masterDataEntities: ['LeadMaster', 'SalesQuotation', 'CustomerMaster', 'DealerMaster'],
    eventIntegrations: {
      publishes: ['crm.dashboard.viewed'],
      subscribes: ['crm.lead.created', 'crm.quote.won', 'crm.order.created']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Natural language pipeline queries & automated sales velocity forecast']
  },
  {
    id: 'crm-masters',
    number: 2,
    title: 'Party & Stakeholder Master Data Directory',
    icon: 'Database',
    category: 'Partner & Network',
    summary: 'Universal master data register managing structured profiles, tax identities, credit limits, and territory mappings for Customers, Suppliers, Dealers, Distributors, Contractors, Architects, Engineers, and Agents.',
    subModules: [
      'Customer Master (Retail, Commercial, Project Accounts, Tax Identification)',
      'Supplier & Vendor Master (Material suppliers, Machinery vendors, Fuel providers)',
      'Dealer & Sub-Dealer Directory (Showroom locations, Storage yard capacity)',
      'Distributor Network Master (Tier-1 and Tier-2 wholesale franchises)',
      'Contractor Directory (Civil, Infrastructure, Masonry, Earthwork)',
      'Architect & Structural Engineer Registry (Influencer tracking & commission logs)',
      'Builder & Real Estate Developer Accounts',
      'Transport Contractor Registry (Third-party haulage partners)',
      'Commission Agent & Broker Master',
      'Business Partner & Joint Venture Master',
      'Business Category, Sales Territory & Industry Classification Matrix'
    ],
    keyCapabilities: [
      'Single View of Customer (360° profile linking sales, deliveries, credit limits, and support history).',
      'GSTIN and PAN validation adapter for instant business verification.',
      'Territory geofencing mapping sales reps to specific postal codes and districts.'
    ],
    masterDataEntities: ['CustomerMaster', 'SupplierMaster', 'DealerMaster', 'ContractorMaster', 'ArchitectMaster'],
    eventIntegrations: {
      publishes: ['crm.master.party_created', 'crm.master.party_updated'],
      subscribes: ['core.master.tax_updated']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Multi-Tenant Platform (Mod 3)']
  },
  {
    id: 'lead-management',
    number: 3,
    title: 'Omni-Channel Lead Acquisition & Scoring Engine',
    icon: 'UserPlus',
    category: 'Lead & Opportunity',
    summary: 'Automated lead ingestion and nurturing suite capturing leads from WhatsApp, website forms, public ordering marketplace, inbound calls, walk-ins, and field referrals with AI lead scoring.',
    subModules: [
      'Omni-Channel Lead Ingestion (Website, Marketplace, WhatsApp, Call Center, Walk-in)',
      'Automated Lead Assignment & Round-Robin Territory Router',
      'Lead Qualification & BANT (Budget, Authority, Need, Timeline) Assessment',
      'AI-Powered Predictive Lead Scoring & Intent Matrix',
      'Lead Conversion Workflow (Lead → Opportunity → Enquiry → Quote)',
      'Referral & Partner Attribution Tracking Engine',
      'Lead Re-engagement & Stale Lead Reclamation Center'
    ],
    keyCapabilities: [
      'Instant WhatsApp lead capture parsing chat messages directly into structured lead records.',
      'Round-robin lead distribution based on sales rep workload, shift status, and geographic proximity.',
      'AI Lead Score based on historical win rates of similar customer profiles and order sizes.'
    ],
    masterDataEntities: ['LeadRecord', 'LeadSource', 'LeadScoreHistory', 'LeadAssignmentRule'],
    eventIntegrations: {
      publishes: ['crm.lead.created', 'crm.lead.qualified', 'crm.lead.converted'],
      subscribes: ['marketplace.order.initiated', 'core.notification.inbound_whatsapp']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Shared Workflow Engine (Mod 16)']
  },
  {
    id: 'enquiry-management',
    number: 4,
    title: 'Multi-Product Enquiry & Technical Feasibility Engine',
    icon: 'FileQuestion',
    category: 'Lead & Opportunity',
    summary: 'Unified enquiry management capturing specific product inquiries across Quarry Laterite Stones, Crusher Aggregates, Fleet Tipper Rentals, Heavy Machinery, and Bulk Infrastructure Supply Projects.',
    subModules: [
      'Product Enquiry Register (General building materials & hardwares)',
      'Laterite Stone Specific Enquiry (1st/2nd/3rd Dressing Grade, Block dimensions)',
      'Crusher Product Enquiry (M-Sand, P-Sand, 20mm/40mm Aggregate volumes)',
      'Vehicle & Tipper Fleet Rental Enquiry (Haulage tonnage, Shift duration)',
      'Mining Equipment & Heavy Machinery Rental Enquiry (Excavator, Rock Breaker)',
      'Building Materials & Finishing Enquiry (Tiles, Cement, TMT Steel)',
      'Bulk Infrastructure Project Tender & Material Requirement Estimator'
    ],
    keyCapabilities: [
      'Multi-suite product routing automatically checking stock/fleet availability before quoting.',
      'Technical specification validator ensuring requested stone dressing or aggregate meets project standards.',
      'Project enquiry breakdown linking material specs to estimated delivery schedules.'
    ],
    masterDataEntities: ['EnquiryRecord', 'EnquiryLineItem', 'ProductSpecification'],
    eventIntegrations: {
      publishes: ['crm.enquiry.received', 'crm.enquiry.feasibility_checked'],
      subscribes: ['materials.stock.updated', 'fleet.vehicle.availability_changed']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Shared Workflow Engine (Mod 16)']
  },
  {
    id: 'quotation-management',
    number: 5,
    title: 'Commercial Quotation Builder & Approval Workflow',
    icon: 'FileText',
    category: 'Sales & Commercial',
    summary: 'Dynamic quotation creation suite supporting custom templates, dynamic price list application, tiered volume discount rules, multi-level manager approvals, revision tracking, and electronic customer acceptance.',
    subModules: [
      'Quotation Template Builder (Product sales, Fleet rental, Project supply)',
      'Dynamic Price List & Freight Surcharge Application',
      'Tiered Volume & Promotional Discount Matrix',
      'Multi-Level Manager Approval Workflow for Below-Margin Quotes',
      'Quotation Version Control & Revision Comparison Log',
      'Digital Customer Acceptance & E-Signature Capture',
      'Automated Quotation Expiry & Follow-up Trigger'
    ],
    keyCapabilities: [
      'Automatic freight haulage calculation incorporating distance matrix from dispatch yard to site.',
      'Margin protection guardrail blocking quote issuance if gross profit falls below threshold without CFO sign-off.',
      'PDF quote generation with interactive WhatsApp/Email acceptance link.'
    ],
    masterDataEntities: ['SalesQuotation', 'QuotationRevision', 'DiscountApprovalRule'],
    eventIntegrations: {
      publishes: ['crm.quote.created', 'crm.quote.approved', 'crm.quote.won'],
      subscribes: ['materials.pricing.updated', 'crm.enquiry.received']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Shared Workflow Engine (Mod 16)']
  },
  {
    id: 'sales-order-crm',
    number: 6,
    title: 'Sales Order Conversion & Multi-Suite Allocation',
    icon: 'ShoppingCart',
    category: 'Sales & Commercial',
    summary: 'Commercial sales order bridge converting accepted quotations into binding sales orders, enforcing credit limit checks, reserving stock in Building Materials or Mining, and scheduling dispatch in Fleet Logistics.',
    subModules: [
      'Quotation-to-Sales Order One-Click Conversion',
      'Credit Limit & Overdue Payment Lockout Checker',
      'Sales Order Status Tracker (Pending Approval, Reserved, Dispatched, Invoiced)',
      'Multi-Suite Stock & Yard Allocation Trigger',
      'Fleet Delivery Slot Scheduling Adapter',
      'Finance General Ledger Pre-Posting Reservation'
    ],
    keyCapabilities: [
      'Instant stock reservation across quarry yards or building material warehouses upon order confirmation.',
      'Automated credit check verifying customer balance against approved credit terms.',
      'Direct order dispatch payload transmission to Mining, Building Materials, or Fleet suites.'
    ],
    masterDataEntities: ['SalesOrder', 'OrderAllocationRecord', 'CustomerCreditLedger'],
    eventIntegrations: {
      publishes: ['crm.order.created', 'crm.order.allocated'],
      subscribes: ['crm.quote.won', 'materials.stock.reserved']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Shared Workflow Engine (Mod 16)']
  },
  {
    id: 'customer-relationship',
    number: 7,
    title: '360° Customer Experience & Interactions Timeline',
    icon: 'Contact',
    category: 'Partner & Network',
    summary: 'Unified customer interaction hub tracking 360-degree activity timelines, call logs, meeting notes, field site visit reports, uploaded blueprints/contracts, credit classification, and credit limits.',
    subModules: [
      '360° Customer Activity Timeline (Calls, Emails, Meetings, Orders, Invoices)',
      'Field Sales Mobile App Meeting Notes & Site Visit Geo-Checkin Register',
      'Call Center History & Inbound/Outbound Telephony Integration',
      'Document Vault (GSTO Certs, Project Blueprints, Credit Agreements)',
      'Customer Account Classification (VIP, Tier-1 Developer, Regular, High-Risk)',
      'Dynamic Credit Limit & Payment Terms Governance'
    ],
    keyCapabilities: [
      'GPS-verified sales rep site visit check-in capturing site photo and meeting summary.',
      'Unified document repository linking architectural plans to customer orders.',
      'Credit score rating based on historical payment timeliness and dispute frequency.'
    ],
    masterDataEntities: ['CustomerProfile', 'InteractionLog', 'SiteVisitRecord', 'CustomerDocument'],
    eventIntegrations: {
      publishes: ['crm.interaction.logged', 'crm.credit.updated'],
      subscribes: ['materials.sales.invoiced', 'fin.payment.received']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'dealer-supplier-mgmt',
    number: 8,
    title: 'Dealer, Distributor & Vendor Relationship Management',
    icon: 'Store',
    category: 'Partner & Network',
    summary: 'Partner ecosystem management governing dealer onboarding, performance scorecards, commission models, territory allocations, contract compliance, and vendor rating audits.',
    subModules: [
      'Dealer & Sub-Dealer Digital Onboarding Portal',
      'Supplier & Vendor Registration & Audit Register',
      'Partner Performance Rating Scorecards (Volume, Quality, Timeliness)',
      'Tiered Commission & Sales Incentive Calculation Rules',
      'Exclusive Territory & District Allocation Governance',
      'Contract & SLA Compliance Tracking'
    ],
    keyCapabilities: [
      'Automated commission calculation for dealers and agents linked to realized customer payments.',
      'Supplier rating scorecards incorporating material quality, weighbridge accuracy, and delivery SLA.',
      'Territory protection preventing sales overlap between adjacent dealer franchises.'
    ],
    masterDataEntities: ['DealerMaster', 'SupplierMaster', 'CommissionRule', 'PartnerContract'],
    eventIntegrations: {
      publishes: ['crm.dealer.commission_calculated', 'crm.supplier.rated'],
      subscribes: ['materials.sales.invoiced', 'materials.purchase.grn_posted']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Shared Master Data Management (Mod 5)']
  },
  {
    id: 'contractor-project-mgmt',
    number: 9,
    title: 'Construction Project & Contractor Relationship Suite',
    icon: 'Building2',
    category: 'Partner & Network',
    summary: 'Specialized module tracking major construction projects, infrastructure tenders, contractor material requirement plans (MRP), phased delivery schedules, and site progress milestones.',
    subModules: [
      'Contractor & Developer Project Database',
      'Construction Project Milestone & Material Requirement Planner (MRP)',
      'Phased Delivery Schedule Builder (e.g. 500 Tons Aggregate / week for 10 weeks)',
      'On-Site Material Consumption & Stockyard Audit Tracker',
      'Project Completion & Contractor Payment Milestone Sync'
    ],
    keyCapabilities: [
      'Material schedule planner linking project concrete pouring dates to crusher production runs.',
      'Contractor credit drawdown tracking material consumption against project credit bank.',
      'Multi-site delivery routing for large contractors managing multiple construction projects simultaneously.'
    ],
    masterDataEntities: ['ConstructionProject', 'ContractorMaster', 'ProjectMaterialPlan'],
    eventIntegrations: {
      publishes: ['crm.project.created', 'crm.project.schedule_updated'],
      subscribes: ['materials.sales.order_created']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Shared Workflow Engine (Mod 16)']
  },
  {
    id: 'complaint-service',
    number: 10,
    title: 'Customer Complaint, Quality & Warranty Service Desk',
    icon: 'LifeBuoy',
    category: 'Service & Contracts',
    summary: 'Customer service desk handling material quality complaints, stone breakage disputes, weight ticket discrepancies, site delivery delays, warranty claims, and resolution workflow SLAs.',
    subModules: [
      'Multi-Channel Complaint Registration (App, WhatsApp, Call Center)',
      'Automated Ticket Assignment to Yard Quality / Logistics Managers',
      'Material Sample Testing & Quality Inspection Dispatch Request',
      'Equipment & Machinery Warranty Claims Register',
      'Resolution Workflow & Credit Note Replacement Issuance',
      'Customer Satisfaction (CSAT) & Feedback Survey Engine'
    ],
    keyCapabilities: [
      'Automated credit note recommendation for verified weight or stone quality defects.',
      'SLA escalation matrix notifying branch managers if complaints remain unresolved > 24 hours.',
      'CSAT survey sent via WhatsApp immediately after complaint resolution.'
    ],
    masterDataEntities: ['ComplaintTicket', 'QualityDisputeLog', 'WarrantyClaim', 'CustomerFeedback'],
    eventIntegrations: {
      publishes: ['crm.complaint.registered', 'crm.complaint.resolved'],
      subscribes: ['materials.delivery.completed', 'fleet.trip.completed']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Document Management System (Mod 7)']
  },
  {
    id: 'agreement-management',
    number: 11,
    title: 'Enterprise Agreement & Digital Contract Lifecycle Management',
    icon: 'FileCheck',
    category: 'Service & Contracts',
    summary: 'Contract repository governing customer supply contracts, vendor purchasing agreements, tipper/machinery lease agreements, digital signature storage, and automated expiry/renewal alerts.',
    subModules: [
      'Customer Long-Term Supply Agreement Repository',
      'Supplier & Vendor Purchase Contract Register',
      'Machinery & Tipper Fleet Rental Agreement Repository',
      'Quarry Site Land Lease & Extraction Rights Agreements',
      'Digital Document Storage & E-Signature Vault',
      'Automated Contract Expiry & Renewal Alert Engine'
    ],
    keyCapabilities: [
      'Price escalation clause tracking in multi-year infrastructure supply contracts.',
      'Automated WhatsApp/Email alerts sent 60/30/15 days before contract expiry.',
      'Digital signature audit trail recording signer IP, timestamp, and verification certificate.'
    ],
    masterDataEntities: ['AgreementMaster', 'ContractClause', 'DigitalSignatureLog'],
    eventIntegrations: {
      publishes: ['crm.agreement.created', 'crm.agreement.expiring_soon'],
      subscribes: ['core.cron.daily_tick']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'marketing-automation',
    number: 12,
    title: 'Omni-Channel Marketing & Festival Promotion Automation',
    icon: 'Megaphone',
    category: 'Marketing & Intelligence',
    summary: 'Marketing automation suite driving targeted email, WhatsApp, and SMS campaigns, seasonal festival offers, regional contractor promotions, customer audience segmentation, and campaign ROI tracking.',
    subModules: [
      'Omni-Channel Campaign Management (WhatsApp, Email, SMS)',
      'Audience Segmentation Engine (By Industry, Order Volume, Last Purchase Date)',
      'WhatsApp Broadcast & Interactive Template Message Sender',
      'Seasonal Festival & Bulk Construction Offers Engine',
      'Contractor Loyalty & Rewards Points Engine',
      'Campaign Analytics & Revenue Attribution Matrix'
    ],
    keyCapabilities: [
      'Segmentation filter targeting inactive contractors who haven\'t ordered laterite stone in 60 days.',
      'WhatsApp interactive buttons allowing customers to click "Reorder Aggregate" directly from promotion message.',
      'Campaign ROI tracker linking broadcast messages to subsequent sales orders.'
    ],
    masterDataEntities: ['MarketingCampaign', 'AudienceSegment', 'CampaignMetrics'],
    eventIntegrations: {
      publishes: ['crm.campaign.sent', 'crm.campaign.converted'],
      subscribes: ['core.notification.sent']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Shared Master Data Management (Mod 5)']
  },
  {
    id: 'crm-finance-integration',
    number: 13,
    title: 'Customer/Supplier Finance Bridge & Collections Engine',
    icon: 'Receipt',
    category: 'Sales & Commercial',
    summary: 'Commercial finance bridge synchronizing customer ledgers, supplier accounts payable, overdue payment collections, credit control enforcement, and customer account profitability.',
    subModules: [
      'Real-Time Customer Accounts Receivable Ledger Sync',
      'Supplier Accounts Payable Ledger Sync',
      'Automated Overdue Payment Collection Reminders (WhatsApp/SMS)',
      'Credit Control Lockout Enforcement Adapter',
      'Payment Collection & UPI/Bank Gateway Ingestion',
      'Customer Account Gross Margin & Lifetime Profitability Analytics'
    ],
    keyCapabilities: [
      'Automated credit hold triggered when invoice age exceeds 45 days.',
      'WhatsApp payment link dispatch enabling instant customer settlement via UPI/Netbanking.',
      'Customer profitability matrix accounting for material discounts, freight costs, and credit payment delays.'
    ],
    masterDataEntities: ['CustomerCreditLedger', 'PaymentCollectionRecord', 'CreditControlRule'],
    eventIntegrations: {
      publishes: ['crm.fin.credit_hold_applied', 'crm.fin.payment_reminded'],
      subscribes: ['materials.sales.invoiced', 'fin.payment.received']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Omni-Channel Notification Router (Mod 6)']
  },
  {
    id: 'crm-reports',
    number: 14,
    title: 'CRM Sales, Pipeline & Relationship Intelligence Reports',
    icon: 'BarChart3',
    category: 'Marketing & Intelligence',
    summary: 'Reporting engine generating lead conversion funnels, sales rep performance scorecards, quotation hit rates, customer credit aging matrices, dealer revenue rankings, and complaint resolution analytics.',
    subModules: [
      'Lead Acquisition & Conversion Funnel Reports',
      'Sales Representative Activity & Revenue Realization Reports',
      'Quotation Hit-Rate & Discount Audit Reports',
      'Customer Credit Aging & Payment Delay Summaries',
      'Dealer & Distributor Sales Realization Leaderboards',
      'Supplier Delivery SLA & Material Rejection Reports',
      'Complaint SLA & Customer Satisfaction (CSAT) Analytics'
    ],
    keyCapabilities: [
      'Interactive Recharts funnels visualizing lead drop-off across sales stages.',
      'Scheduled Monday morning sales pipeline digest sent to regional directors.',
      'Exportable Excel & PDF reports with multi-tenant data filters.'
    ],
    masterDataEntities: ['CRMReportTemplate', 'ScheduledCRMJob'],
    eventIntegrations: {
      publishes: ['crm.report.generated'],
      subscribes: ['core.report.trigger_requested']
    },
    sharedCoreDependencies: ['Dynamic Reporting Engine (Mod 11)', 'Document Management System (Mod 7)']
  },
  {
    id: 'crm-ai-features',
    number: 15,
    title: 'Gemini AI Customer Intelligence & Predictive Copilot',
    icon: 'Sparkles',
    category: 'Marketing & Intelligence',
    summary: 'Server-side AI suite powered by Gemini models for predictive lead scoring, sales velocity forecasting, Customer Lifetime Value (CLV) estimation, churn risk prediction, smart follow-up suggestions, and cross-sell recommendations.',
    subModules: [
      'AI Predictive Lead Scoring & Intent Analysis Model',
      'Weighted Sales Revenue & Cash Flow Forecasting',
      'Customer Lifetime Value (CLV) Estimation Engine',
      'AI Customer Churn Risk Detector & Retention Guardrail',
      'Smart Follow-up Action & Next-Best-Offer Copilot',
      'Automated Cross-Selling & Up-Selling Recommendation Engine',
      'Executive CRM & Sales Copilot'
    ],
    keyCapabilities: [
      'Server-side Gemini 2.5 Flash execution via `/api/ai/crm/*` maintaining secret safety.',
      'Predicts churn risk when customer order frequency drops 35% below historical mean.',
      'Generates tailored WhatsApp re-engagement message drafts for sales reps.'
    ],
    masterDataEntities: ['AICrmInsight', 'AILeadScore', 'AIChurnPrediction'],
    eventIntegrations: {
      publishes: ['crm.ai.lead_scored', 'crm.ai.churn_alerted'],
      subscribes: ['crm.lead.created', 'crm.order.created']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'Audit & Telemetry (Mod 14)'],
    aiFeatures: ['Gemini 2.5 Flash predictive lead scoring', 'Customer churn risk detector', 'Smart follow-up & cross-sell copilot']
  }
];

export const CUSTOMER_PORTAL_ARCHITECTURE = {
  title: 'Self-Service Customer & Contractor Portal Architecture',
  description: 'Secure multi-device web and mobile self-service portal giving construction clients, real estate developers, contractors, and retail buyers 24/7 visibility into quotes, orders, delivery transit, invoices, payments, and support.',
  portalFeatures: [
    {
      feature: '1. Quotation Management & Digital Approval',
      detail: 'View pending commercial quotations, inspect itemized pricing/freight breakdowns, and accept quotes with digital signature.'
    },
    {
      feature: '2. Instant Order Placement',
      detail: 'Place repeat orders for 1st/2nd/3rd Laterite Stones, aggregates, cement, and steel with pre-configured delivery sites.'
    },
    {
      feature: '3. Live Order & Delivery Transit Tracking',
      detail: 'Interactive vector map tracking assigned tippers/lorries in real time with driver contact links and ETA countdowns.'
    },
    {
      feature: '4. Dedicated Laterite Stone Order Monitor',
      detail: 'Specialized view tracking quarry dressing status, truck loading queue, and delivery dispatch for laterite stone orders.'
    },
    {
      feature: '5. Invoice Vault & GST Statement Download',
      detail: 'Download tax-compliant GST sales invoices, delivery challans, e-way bills, and monthly account ledger statements.'
    },
    {
      feature: '6. Payment History & Online Settlement',
      detail: 'View past payments, outstanding balances, and pay overdue bills via integrated UPI, Netbanking, or Credit Card.'
    },
    {
      feature: '7. Complaint Registration & Quality Support Desk',
      detail: 'Submit material quality or delivery tickets with site photo uploads and live dispute resolution tracking.'
    },
    {
      feature: '8. Contract & Agreement Repository',
      detail: 'Access active supply agreements, rate contracts, machine rental terms, and expiry renewal dates.'
    }
  ]
};

export const CRM_BUSINESS_WORKFLOW = [
  {
    step: 1,
    title: '1. Omni-Channel Lead Capture & Qualification',
    subtitle: 'Lead Ingestion, BANT & AI Scoring',
    description: 'Lead arrives via WhatsApp, website, or marketplace. System scores lead intent, checks territory, and assigns to sales rep.',
    icon: 'UserPlus',
    entities: ['LeadRecord', 'LeadSource', 'SalesTerritory'],
    events: ['crm.lead.created', 'crm.lead.scored']
  },
  {
    step: 2,
    title: '2. Customer Enquiry & Material Feasibility',
    subtitle: 'Product Specs & Yard Stock Check',
    description: 'Customer submits enquiry for Laterite Stones or Aggregates. System verifies yard stock, quarry capacity, and fleet availability.',
    icon: 'FileQuestion',
    entities: ['EnquiryRecord', 'ProductSpecification'],
    events: ['crm.enquiry.received', 'materials.stock.updated']
  },
  {
    step: 3,
    title: '3. Dynamic Quotation & Customer Acceptance',
    subtitle: 'Price Matrix, Freight Surcharge & Approval',
    description: 'Sales rep generates quotation with automated freight surcharge. Upon approval, customer accepts digitally via WhatsApp link.',
    icon: 'FileText',
    entities: ['SalesQuotation', 'PriceList', 'ApprovalWorkflow'],
    events: ['crm.quote.created', 'crm.quote.won']
  },
  {
    step: 4,
    title: '4. Sales Order & Multi-Suite Stock Allocation',
    subtitle: 'Credit Limit Check & Yard Reservation',
    description: 'Quotation converts to Sales Order. Credit check executes and inventory is reserved in Mining or Building Materials suite.',
    icon: 'ShoppingCart',
    entities: ['SalesOrder', 'CustomerCreditLedger', 'StockReservation'],
    events: ['crm.order.created', 'materials.stock.reserved']
  },
  {
    step: 5,
    title: '5. Fleet Tipper Dispatch & Site Delivery',
    subtitle: 'Tipper Allocation, Transit GPS & e-POD',
    description: 'Fleet Suite allocates tipper, dispatch controller issues gate pass, driver delivers to site, and captures digital signature POD.',
    icon: 'Truck',
    entities: ['DeliveryPlan', 'VehicleAllocation', 'ProofOfDelivery'],
    events: ['materials.delivery.scheduled', 'fleet.trip.completed']
  },
  {
    step: 6,
    title: '6. Invoicing, Finance Ledger & Payment Collection',
    subtitle: 'GST Invoice, AR Ledger & Payment Link',
    description: 'System generates GST invoice. AR ledger updates, automated WhatsApp payment reminder triggers, and customer settles bill.',
    icon: 'Receipt',
    entities: ['SalesInvoice', 'CustomerAccountsReceivable', 'PaymentRecord'],
    events: ['materials.sales.invoiced', 'fin.payment.received']
  },
  {
    step: 7,
    title: '7. Service Feedback, AI Churn Prevention & Reorder',
    subtitle: 'CSAT Survey, AI Retention & Repeat Business',
    description: 'Customer submits CSAT score. AI evaluates reorder cycle and sends smart follow-up recommendation to sales rep.',
    icon: 'Sparkles',
    entities: ['CustomerFeedback', 'AICrmInsight', 'ReorderTrigger'],
    events: ['crm.complaint.resolved', 'crm.ai.reorder_suggested']
  }
];

export const CRM_INTEGRATIONS_TOPOLOGY = [
  {
    system: 'Shared Core Platform',
    purpose: 'Universal Single Sign-On, 4-Tier RLS Tenant Isolation, Master Data Management, PDF Document Engine, Omni-Channel WhatsApp/SMS Notifications, Gemini AI Server Proxy.',
    protocol: 'gRPC Internal Mesh / Node.js Local Imports'
  },
  {
    system: 'Mining Operations Suite',
    purpose: 'Direct quarry stock check, stone dressing availability, weighbridge ticket sync, and bulk raw material sales order routing.',
    protocol: 'Kafka / NATS Event Streaming (`mining.stock.updated`, `crm.order.allocated`)'
  },
  {
    system: 'Fleet & Logistics Suite',
    purpose: 'Vehicle availability verification, automated tipper allocation, live transit tracking URL sync, and e-POD signature ingestion.',
    protocol: 'Inter-Service Event Adapter (`materials.delivery.scheduled`, `fleet.trip.completed`)'
  },
  {
    system: 'Building Materials Suite',
    purpose: 'Multi-warehouse product catalog lookup, instant stock reservation, pricing matrix sync, and sales invoice generation.',
    protocol: 'Inter-Service Event Adapter (`materials.stock.reserved`, `materials.sales.invoiced`)'
  },
  {
    system: 'Marketplace Suite',
    purpose: 'Inbound online consumer leads, public order conversion, online payment status sync, and contractor directory ratings.',
    protocol: 'REST API Proxy via API Gateway (`marketplace.lead.captured`)'
  },
  {
    system: 'Finance Shared Engine',
    purpose: 'Accounts Receivable ledger updates, customer credit limit enforcement, payment collection receipts, and landed margin analysis.',
    protocol: 'Direct Event Adapter (`fin.ar.posted`, `fin.payment.received`)'
  },
  {
    system: 'HRMS Engine',
    purpose: 'Sales rep commission calculation, field agent site visit travel allowance, and customer service staff KPI bonus sync.',
    protocol: 'REST Bridge (`core.hr.commission_logged`)'
  }
];

export const CRM_FOLDER_STRUCTURE = [
  'src/modules/crm/',
  '├── controllers/',
  '│   ├── lead.controller.ts',
  '│   ├── enquiry.controller.ts',
  '│   ├── quotation.controller.ts',
  '│   ├── sales-order.controller.ts',
  '│   ├── customer-portal.controller.ts',
  '│   ├── dealer-supplier.controller.ts',
  '│   └── crm-analytics.controller.ts',
  '├── services/',
  '│   ├── omni-lead-router.service.ts',
  '│   ├── dynamic-quote-builder.service.ts',
  '│   ├── credit-limit-guardrail.service.ts',
  '│   ├── portal-auth.service.ts',
  '│   └── crm-ai-copilot.service.ts',
  '├── models/',
  '│   ├── lead.model.ts',
  '│   ├── quotation.model.ts',
  '│   ├── customer-profile.model.ts',
  '│   ├── agreement.model.ts',
  '│   └── complaint.model.ts',
  '├── events/',
  '│   ├── crm-events.publisher.ts',
  '│   └── crm-events.subscriber.ts',
  '└── interfaces/',
  '    ├── party-master.interface.ts',
  '    └── portal-order.interface.ts'
];

export const PHASE8_TRANSITION_REVIEW = {
  title: 'Phase 7 CRM & Business Suite Architectural Review & Phase 8 Transition Plan',
  validatedCapabilities: [
    'Comprehensive Customer & Partner Coverage: 100% lifecycle management across Customers, Dealers, Suppliers, Contractors, Architects, and Commission Agents.',
    'Omni-Channel Lead & Communication Pipeline: Ingestion from WhatsApp, Web, Public Ordering Marketplace, and Walk-ins with automated lead scoring.',
    'Self-Service Customer Portal: Complete self-service architecture for quote approval, order placement, live tipper tracking, invoice download, and complaints.',
    'Multi-Suite Order Synchronization: Instant stock reservation in Mining / Building Materials and tipper allocation in Fleet Logistics.',
    'Gemini AI Sales Copilot: Predictive lead scoring, customer churn detection, and smart follow-up suggestions executed server-side.'
  ],
  identifiedImprovementsForPhase8: [
    'Public Marketplace Catalog Sync: Expose dealer inventory and quarry products directly onto the Phase 8 Public E-Commerce Marketplace.',
    'Cross-Tenant B2B Trading Network: Enable B2B contractors on BOS to order directly from suppliers hosted on different BOS tenant accounts.',
    'Gemini AI Voice Support Bot: Integrate real-time voice speech-to-text in WhatsApp customer support desk.'
  ],
  status: 'APPROVED — READY FOR PHASE 8 (PUBLIC E-COMMERCE MARKETPLACE & GEMINI AI ECOSYSTEM)'
};
