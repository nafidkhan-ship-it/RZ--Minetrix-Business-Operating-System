import { MarketplaceSuiteModule } from '../types/architecture';

export const MARKETPLACE_PORTALS = [
  {
    portal: 'Public Commerce Portal',
    icon: 'Globe',
    description: 'Public storefront enabling B2C and B2B buyers to search nearby quarries, compare prices, order laterite stone & aggregates online, and request equipment rentals.',
    keyFeatures: ['Nearby Quarry & Supplier Geo-Search', 'Order Laterite Stone Online (1st/2nd/3rd Grade)', 'Live Tipper Delivery Tracking', 'Multi-Category Product Catalog']
  },
  {
    portal: 'Seller & Quarry Operator Portal',
    icon: 'Store',
    description: 'Self-service portal for quarry owners, crusher plants, and manufacturers to manage product listings, inventory levels, order acceptances, and payouts.',
    keyFeatures: ['Quarry Yard Stock Management', 'Order Confirmation & Loading Dispatch', 'Payout Ledger & Commission Summaries', 'Sponsored Listing Management']
  },
  {
    portal: 'Dealer & Distributor Portal',
    icon: 'Building2',
    description: 'B2B hub for regional building material dealers and stockyards to manage wholesale orders, distributor pricing, sub-dealer networks, and bulk deliveries.',
    keyFeatures: ['Wholesale Volume Discount Configurator', 'Credit Line Management for Sub-Dealers', 'Territory Demand Analytics', 'Supplier Purchase Requests']
  },
  {
    portal: 'Buyer & Contractor Portal',
    icon: 'UserCheck',
    description: 'Unified account portal for civil contractors, builders, real estate developers, and homeowners to track orders, manage rental contracts, download GST invoices, and post jobs.',
    keyFeatures: ['Instant Reordering & Bulk Bids', 'Active Machine/Vehicle Rental Tracker', 'GST Invoice & Delivery Challan Vault', 'Project Material Requirement Planner']
  }
];

export const MARKETPLACE_SUITE_MODULES: MarketplaceSuiteModule[] = [
  {
    id: 'marketplace-dashboard',
    number: 1,
    title: 'Marketplace Executive & Commerce Analytics Dashboard',
    icon: 'LayoutDashboard',
    category: 'E-Commerce & Portals',
    summary: 'Executive commerce command center tracking Gross Merchandise Value (GMV), net marketplace revenue, active listings, order & rental volumes, verified sellers, active buyers, trending regional products, and AI market insights.',
    subModules: [
      'Gross Merchandise Value (GMV) & Take-Rate Revenue Tracker',
      'Order Volume & Fulfillment SLA Realization Metrics',
      'Active Vehicle & Heavy Equipment Rental Utilization Index',
      'Verified Seller, Quarry & Dealer Onboarding Leaderboard',
      'Active Buyer Growth & Contractor Retention Index',
      'Popular Products & Regional Commodity Price Trend Matrix',
      'Geographic Demand & Delivery Density Heatmaps',
      'Ad Platform Revenue & Sponsored Listing ROI Analytics',
      'Gemini AI Supply-Demand Imbalance & Price Surge Insights'
    ],
    keyCapabilities: [
      'Real-time aggregation of GMV across Direct Sales, Rentals, Advertisements, and Service Bookings.',
      'Geo-spatial heatmapping highlighting aggregate and laterite stone shortage zones.',
      'Instant drill-down into escrow payment balances and pending seller payouts.'
    ],
    masterDataEntities: ['MarketplaceOrder', 'MarketplaceListing', 'SellerPayoutLedger', 'PlatformCommissionRule'],
    eventIntegrations: {
      publishes: ['marketplace.dashboard.viewed'],
      subscribes: ['marketplace.order.completed', 'marketplace.rental.booked', 'marketplace.payout.processed']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Automated GMV forecasting & regional price surge prediction']
  },
  {
    id: 'public-home-portal',
    number: 2,
    title: 'Public Commerce Portal & Geo-Search Engine',
    icon: 'Globe',
    category: 'E-Commerce & Portals',
    summary: 'Public digital front door featuring location-based discovery of nearby quarries, stone yards, fleet rentals, trending building supplies, promotional offers, and instant online ordering.',
    subModules: [
      '⭐ Order Laterite Stone Online Quick-Checkout Bar',
      'Nearby Quarry & Crusher Plant Geo-Locator Map',
      'Nearby Material Suppliers, Hardware & Hardware Dealers Directory',
      'Nearby Commercial Vehicle & Heavy Equipment Rental Finder',
      'Omni-Bar Elastic Marketplace Search (Products, Machinery, Services, Quarries)',
      'Trending Building Products & Seasonal Festival Offers Carousel',
      'Dynamic Banner Advertisements & Sponsored Category Pins'
    ],
    keyCapabilities: [
      'Instant GPS geo-location finding quarries and building material yards within a 20km radius.',
      'One-click Laterite Stone order bar estimating transport fare based on delivery postal code.',
      'SEO-optimized public catalog pages for all verified sellers and product categories.'
    ],
    masterDataEntities: ['PublicStorefrontConfig', 'BannerAdvertisement', 'GeoLocationRegistry'],
    eventIntegrations: {
      publishes: ['marketplace.search.executed', 'marketplace.lead.captured'],
      subscribes: ['materials.catalog.updated', 'mining.quarry.status_changed']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Omni-Channel Notification Router (Mod 6)']
  },
  {
    id: 'laterite-stone-marketplace',
    number: 3,
    title: 'Laterite Stone Quarry-Direct Marketplace',
    icon: 'Pickaxe',
    category: 'Category Marketplaces',
    summary: 'Dedicated digital marketplace for ordering 1st Dressing, 2nd Dressing, 3rd Dressing, and Custom Dimension Laterite Stone blocks directly from certified quarry pits with live stock, delivery booking, and tipper tracking.',
    subModules: [
      '1st Dressing Grade Laterite Stone Catalog (Premium Structural Blocks)',
      '2nd Dressing Grade Laterite Stone Catalog (Standard Masonry Blocks)',
      '3rd Dressing Grade Laterite Stone Catalog (Economy/Compound Wall Blocks)',
      'Custom Dimension & Wire-Cut Architectural Laterite Block Configurator',
      'Live Quarry Pit Stock Availability & Dressing Queue Status',
      'Dynamic Per-Block Price & Mileage Freight Calculator',
      'Integrated Tipper Vehicle Allocation & Live Quarry Gate Pass Sync'
    ],
    keyCapabilities: [
      'Direct synchronization with Quarry Dressing Yards ensuring listed block counts match physical pit stock.',
      'Automated tipper load optimizer calculating exact block weight against vehicle axle limits.',
      'Live GPS map tracking tipper movement from quarry pit directly to construction site.'
    ],
    masterDataEntities: ['LateriteProductMaster', 'QuarryPitStock', 'LateriteOrderLine'],
    eventIntegrations: {
      publishes: ['marketplace.stone_order.placed', 'marketplace.stone_order.dispatched'],
      subscribes: ['mining.stock.updated', 'fleet.vehicle.assigned']
    },
    sharedCoreDependencies: ['Mining Operations Suite (Phase 4)', 'Fleet & Logistics Suite (Phase 5)']
  },
  {
    id: 'crusher-products-marketplace',
    number: 4,
    title: 'Crusher Products & Aggregates Marketplace',
    icon: 'Layers',
    category: 'Category Marketplaces',
    summary: 'Digital ordering portal for Crusher Aggregate products including Manufactured Sand (M-Sand), Plastering Sand (P-Sand), 10mm/20mm/40mm Coarse Aggregates, GSB, and Quarry Dust with weighbridge ticket integration.',
    subModules: [
      'Manufactured Sand (M-Sand) & Plastering Sand (P-Sand) Catalog',
      'Coarse Aggregate Matrix (10mm, 20mm, 40mm, Granular Sub-Base GSB)',
      'Quarry Dust & Crusher Run Bulk Supply Ordering',
      'Dynamic Price-per-Tonnage & Freight Surcharge Engine',
      'Weighbridge Electronic Ticket Integration & Multi-Trips Delivery Scheduler',
      'Concrete Mix Ratio Material Requirement Calculator'
    ],
    keyCapabilities: [
      'Tonnage-based volume calculator estimating exact aggregate requirements from site dimensions.',
      'Automated weighbridge ticket validation issuing e-Challans upon vehicle departure from crusher.',
      'Bulk project order scheduling for multi-day continuous aggregate supply.'
    ],
    masterDataEntities: ['CrusherProductMaster', 'AggregatePriceMatrix', 'WeighbridgeTicketRef'],
    eventIntegrations: {
      publishes: ['marketplace.aggregate_order.placed', 'marketplace.aggregate_order.weighed'],
      subscribes: ['materials.stock.updated', 'mining.weighbridge.ticket_created']
    },
    sharedCoreDependencies: ['Building Materials Suite (Phase 6)', 'Mining Operations Suite (Phase 4)']
  },
  {
    id: 'building-materials-marketplace',
    number: 5,
    title: 'Universal Building Materials & Supplies Marketplace',
    icon: 'ShoppingBag',
    category: 'Category Marketplaces',
    summary: 'Comprehensive multi-vendor e-commerce catalog covering Cement, TMT Steel, Tiles, Paints, Electrical, Plumbing, Hardware, Roofing, Glass, Aluminium, UPVC, Interlock Pavers, and Construction Chemicals.',
    subModules: [
      'Cement & Ready-Mix Concrete (RMC) Catalog (OPC 43/53, PPC, PSC)',
      'TMT Rebars & Structural Steel Section Catalog (Fe 500D, Fe 550D)',
      'Ceramic, Vitrified & Granite Flooring Tiles Marketplace',
      'Exterior Paints, Waterproofing & Construction Chemicals Section',
      'Electrical Conduit, Wiring, Switchgear & Lighting Store',
      'Plumbing Pipes, Fittings, Sanitaryware & Water Storage Tanks',
      'Roofing Sheets, Glass, UPVC Windows & Aluminium Fabrication Hardware',
      'Interlock Paver Blocks & Precast Concrete Product Catalog'
    ],
    keyCapabilities: [
      'Multi-vendor cart allowing buyers to order cement, steel, and tiles in a single transaction.',
      'Tiered bulk volume discounts automatically applied for registered contractor accounts.',
      'Manufacturer brand verification badges (e.g., UltraTech, Tata Tiscon, Asian Paints).'
    ],
    masterDataEntities: ['BuildingMaterialProduct', 'BrandMaster', 'MultiVendorCart'],
    eventIntegrations: {
      publishes: ['marketplace.materials_order.placed', 'marketplace.materials_order.fulfilled'],
      subscribes: ['materials.inventory.synced']
    },
    sharedCoreDependencies: ['Building Materials Suite (Phase 6)', 'Finance Shared Bridge (Mod 8)']
  },
  {
    id: 'quarry-marketplace',
    number: 6,
    title: 'Quarry Land, Mining Leases & Joint Venture Portal',
    icon: 'Compass',
    category: 'Category Marketplaces',
    summary: 'Specialized B2B marketplace for buying, leasing, and joint-venturing quarry sites, mining lands, environmental clearances, extraction rights, and mining investment opportunities.',
    subModules: [
      'Quarry Sites For Outright Sale Registry (Geological survey report attached)',
      'Quarry Mining Land For Lease & Royalty Sharing Marketplace',
      'Mining Land Required Public Procurement Bulletin',
      'Quarry Joint Venture (JV) & Investor Matching Portal',
      'Mining Permit, KPCB Environmental Clearance & Extraction Rights Vault',
      'Geological Reserve Estimation & Valuation Benchmark Tool'
    ],
    keyCapabilities: [
      'NDA-protected data room for sharing quarry reserves, survey maps, and extraction permits.',
      'Verified seller verification verifying land ownership and KPCB environmental consent numbers.',
      'Investor matchmaking connecting land owners with experienced quarry operators.'
    ],
    masterDataEntities: ['QuarryListing', 'MiningLeaseAgreement', 'GeologicalReportVault'],
    eventIntegrations: {
      publishes: ['marketplace.quarry_listing.created', 'marketplace.quarry_inquiry.submitted'],
      subscribes: ['mining.quarry.registered']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Document Management System (Mod 7)']
  },
  {
    id: 'vehicle-marketplace',
    number: 7,
    title: 'Commercial Vehicle Buy, Sell & Exchange Marketplace',
    icon: 'Truck',
    category: 'Category Marketplaces',
    summary: 'Commercial vehicle exchange platform for buying, selling, and trading Tippers, Heavy Lorries, Trailers, Pickups, Transit Mixers, and Fleet Commercial Vehicles with RTO transfer verification.',
    subModules: [
      'Commercial Tipper & Dump Truck Sales Catalog (Multi-Axle 10-Wheeler / 12-Wheeler)',
      'Heavy Goods Lorries & Long-Haul Trailer Marketplace',
      'Light Commercial Vehicle (LCV) & Pickup Truck Directory',
      'Vehicle Trade-In & Exchange Valuation Estimator',
      'RTO Vehicle Registration, Fitness Certificate & Permit Audit Verification',
      'Commercial Fleet Financing & Vehicle Insurance Calculator'
    ],
    keyCapabilities: [
      'Integration with Vahan RTO database verifying chassis number, tax status, and national permit.',
      'Commercial vehicle valuation algorithm based on vehicle age, odometer mileage, and engine health.',
      'Direct vehicle inspection booking with certified Minetrix mechanics.'
    ],
    masterDataEntities: ['VehicleSalesListing', 'RTOVerificationRecord', 'VehicleTradeInQuote'],
    eventIntegrations: {
      publishes: ['marketplace.vehicle_sale.listed', 'marketplace.vehicle_sale.sold'],
      subscribes: ['fleet.vehicle.decommissioned']
    },
    sharedCoreDependencies: ['Fleet & Logistics Suite (Phase 5)', 'Finance Shared Bridge (Mod 8)']
  },
  {
    id: 'machinery-marketplace',
    number: 8,
    title: 'Used Quarry & Construction Heavy Machinery Exchange',
    icon: 'Cog',
    category: 'Category Marketplaces',
    summary: 'Heavy equipment trading platform for buying, selling, and exchanging used JCB Earthmovers, Hydraulic Excavators, Wheel Loaders, Rock Breakers, Mobile Crushers, Generators, and Compressors.',
    subModules: [
      'Used Excavator & Hydraulic Rock Breaker Machinery Catalog',
      'Wheel Loaders, Backhoe Loaders (JCB) & Bulldozers Marketplace',
      'Mobile Cone/Jaw Crushers & Vibrating Screening Plant Directory',
      'Diesel Generators, Air Compressors & Pneumatic Rock Drills Section',
      'Equipment Health Inspection Scorecard & Hour-Meter Audit Log',
      'Machinery Refurbishment & Trade-In Exchange Hub'
    ],
    keyCapabilities: [
      'Verified equipment hour-meter log verified through Telematics/IoT gateway.',
      'Standardized 50-point mechanical inspection report uploaded for every listed excavator or breaker.',
      'Escrow payment hold releasing funds only after physical site machine demonstration.'
    ],
    masterDataEntities: ['MachinerySalesListing', 'InspectionReport', 'MachineryEscrowHold'],
    eventIntegrations: {
      publishes: ['marketplace.machinery_sale.listed', 'marketplace.machinery_sale.inspected'],
      subscribes: ['mining.equipment.decommissioned']
    },
    sharedCoreDependencies: ['Mining Operations Suite (Phase 4)', 'Shared Master Data Management (Mod 5)']
  },
  {
    id: 'vehicle-rental-marketplace',
    number: 9,
    title: 'Commercial Fleet & Tipper Vehicle Rental Marketplace',
    icon: 'Truck',
    category: 'Rentals & Services',
    summary: 'On-demand commercial vehicle rental booking engine offering Trip-based, Daily, Weekly, Monthly, and Corporate Tipper/Lorry rentals with Vehicle-Only or Vehicle-with-Driver options.',
    subModules: [
      'Trip-Based Bulk Haulage Rental Booking Engine',
      'Daily, Weekly & Monthly Commercial Tipper Lease Contracts',
      'Vehicle-Only (Self-Drive Fleet) vs. Vehicle + Verified Driver Rentals',
      'Corporate Fleet Long-Term Haulage Contract Bidding',
      'GPS Telematics Live Route Tracking & Mileage Billing Sync',
      'Overload Protection & Toll Charges Auto-Settlement Engine'
    ],
    keyCapabilities: [
      'Dynamic per-ton-km rate bidding matching material shippers with independent tipper owners.',
      'Automated trip log generation linking toll plaza hits and GPS mileage to rental invoice.',
      'Instant replacement driver request in case of breakdown or shift expiry.'
    ],
    masterDataEntities: ['VehicleRentalBooking', 'HaulageContract', 'TripLogReceipt'],
    eventIntegrations: {
      publishes: ['marketplace.vehicle_rental.booked', 'marketplace.vehicle_rental.dispatched'],
      subscribes: ['fleet.vehicle.availability_changed', 'fleet.trip.completed']
    },
    sharedCoreDependencies: ['Fleet & Logistics Suite (Phase 5)', 'Finance Shared Bridge (Mod 8)']
  },
  {
    id: 'equipment-rental-marketplace',
    number: 10,
    title: 'Heavy Machinery & Mining Equipment Rental Marketplace',
    icon: 'Wrench',
    category: 'Rentals & Services',
    summary: 'On-demand heavy machinery rental suite enabling contractors to rent Excavators, Rock Breakers, JCBs, and Crushers on Hourly, Daily, Weekly, or Project-Contract terms with machine-only or operator options.',
    subModules: [
      'Hourly & Shift-Based Machinery Rental Booking Engine',
      'Machine-Only vs Machine + Certified Operator Options',
      'Hydraulic Rock Breaker Attachment Specific Rental Add-ons',
      'Project-Based Long-Term Site Machine Deployment Contracts',
      'Telematics Engine Hour-Meter Telemetry Billing Adapter',
      'Equipment Mobilization & Low-Bed Trailer Transport Booking'
    ],
    keyCapabilities: [
      'Real-time IoT hour-meter tracking billing exact machine operating hours.',
      'Low-bed heavy trailer transport booking automatically bundled for machine site delivery.',
      'Operator skill verification validating operator driving license and safety badges.'
    ],
    masterDataEntities: ['EquipmentRentalBooking', 'HourMeterTelemetryLog', 'MobilizationQuote'],
    eventIntegrations: {
      publishes: ['marketplace.equipment_rental.booked', 'marketplace.equipment_rental.settled'],
      subscribes: ['mining.equipment.availability_changed', 'fleet.trip.completed']
    },
    sharedCoreDependencies: ['Mining Operations Suite (Phase 4)', 'HRMS Engine (Phase 9)']
  },
  {
    id: 'jobs-marketplace',
    number: 11,
    title: 'Mining, Logistics & Construction Industry Jobs Portal',
    icon: 'Briefcase',
    category: 'Ecosystem Networks',
    summary: 'Specialized recruitment marketplace connecting quarry owners, transport operators, and civil contractors with licensed Tipper Drivers, Heavy Machine Operators, Quarry Workers, Mechanics, and Engineers.',
    subModules: [
      'Commercial Tipper & Lorry Driver Job Openings & Candidate Registry',
      'Certified Heavy Machinery Operator (Excavator, Breaker, JCB) Job Portal',
      'Quarry Blaster, Stone Dresser & Crusher Plant Worker Hiring Desk',
      'Heavy Fleet Mechanic, Electrician & Auto-Welder Job Listings',
      'Mining Engineers, Quarry Managers, Site Supervisors & Accountants',
      'Badge Verification (License, Safety Certification, Experience Log)'
    ],
    keyCapabilities: [
      'RTO Commercial Driving License verification for all registered drivers.',
      'Skill endorsement system allowing previous quarry owners to rate operator performance.',
      'WhatsApp job alerts matching candidates to vacancies within 30km radius.'
    ],
    masterDataEntities: ['JobPosting', 'WorkerCandidateProfile', 'SkillBadgeRecord'],
    eventIntegrations: {
      publishes: ['marketplace.job.posted', 'marketplace.job.applied'],
      subscribes: ['core.notification.sent']
    },
    sharedCoreDependencies: ['HRMS Engine (Phase 9)', 'Omni-Channel Notification Router (Mod 6)']
  },
  {
    id: 'services-marketplace',
    number: 12,
    title: 'Contractor & Technical Services Marketplace',
    icon: 'UserCheck',
    category: 'Rentals & Services',
    summary: 'Service marketplace connecting project owners with Transport Contractors, Heavy Machinery Repair Shops, Earthwork Contractors, Mining Technical Consultants, Civil Contractors, and Fabricators.',
    subModules: [
      'Third-Party Transport Contractor & Haulage Agent Directory',
      'On-Site Heavy Machinery Repair, Hydraulic & Engine Service Specialists',
      'Earthwork, Site Leveling, Foundation & Demolition Contractors',
      'Mining Technical Consultants, KPCB Environmental & Statutory Advisory',
      'Civil Construction, Masonry & Structural Contractors Registry',
      'Mechanical Welding, Crusher Conveyor & Fabrication Services'
    ],
    keyCapabilities: [
      'Service milestone escrow holding payment until site engineer signs off work completion.',
      'Contractor license and GST compliance verification.',
      'Geo-located emergency breakdown mechanic dispatch for stalled tippers or excavators.'
    ],
    masterDataEntities: ['ServiceListing', 'ServiceContract', 'ServiceMilestoneEscrow'],
    eventIntegrations: {
      publishes: ['marketplace.service.requested', 'marketplace.service.completed'],
      subscribes: ['crm.contractor.registered']
    },
    sharedCoreDependencies: ['CRM & Business Suite (Phase 7)', 'Finance Shared Bridge (Mod 8)']
  },
  {
    id: 'supplier-dealer-marketplace',
    number: 13,
    title: 'Supplier & Dealer Directory & Network Hub',
    icon: 'Store',
    category: 'Ecosystem Networks',
    summary: 'B2B directory and network hub showcasing verified manufacturers, building material distributors, authorized hardware dealers, quarry owners, and explosive suppliers.',
    subModules: [
      'Verified Manufacturer & Primary Producer Directory',
      'Authorized Regional Building Material Dealer Showrooms',
      'Distributor & Wholesale Stockyard Network Master',
      'Quarry Owners & Aggregate Producer Association Directory',
      'Explosives, Detonator & Quarry Hardware Licensed Suppliers'
    ],
    keyCapabilities: [
      'Official Manufacturer Verification Badges (e.g., UltraTech Authorized Dealer).',
      'Sub-dealer request workflow enabling retail stores to request dealership terms.',
      'Integrated B2B inquiry form transmitting direct purchase requests to dealer sales teams.'
    ],
    masterDataEntities: ['DealerDirectoryRecord', 'SupplierVerificationBadge', 'B2BDealershipRequest'],
    eventIntegrations: {
      publishes: ['marketplace.dealer.verified', 'marketplace.b2b_inquiry.created'],
      subscribes: ['crm.master.party_created']
    },
    sharedCoreDependencies: ['CRM & Business Suite (Phase 7)', 'Shared Master Data Management (Mod 5)']
  },
  {
    id: 'advertisement-platform',
    number: 14,
    title: 'Ad Monetization, Featured Listings & Sponsored Network',
    icon: 'Megaphone',
    category: 'Ad Network & Intelligence',
    summary: 'Marketplace ad platform enabling suppliers, quarry owners, dealers, and vehicle sellers to run targeted banner campaigns, feature listings on top of search results, and promote products.',
    subModules: [
      'Homepage & Category Banner Advertisement Self-Service Ad Manager',
      'Featured Product & Search Result Top-Pinning Bidding Engine',
      'Sponsored Quarry & Crusher Plant Promotion Slots',
      'Sponsored Commercial Vehicle & Machine Sales Ad Engine',
      'Pay-Per-Click (PPC) & Cost-Per-Mille (CPM) Ad Billing Engine',
      'Ad Performance Analytics (Impressions, Clicks, Conversions, CTR)'
    ],
    keyCapabilities: [
      'Targeted ad placement based on buyer location and search keywords (e.g., "Laterite Stone in Kannur").',
      'Automated ad budget spending limit preventing overcharges.',
      'Real-time CTR and lead conversion analytics dashboard for advertisers.'
    ],
    masterDataEntities: ['AdCampaign', 'AdSlotReservation', 'AdClickLog'],
    eventIntegrations: {
      publishes: ['marketplace.ad.impression_logged', 'marketplace.ad.click_logged'],
      subscribes: ['fin.payment.received']
    },
    sharedCoreDependencies: ['Finance Shared Bridge (Mod 8)', 'Omni-Channel Notification Router (Mod 6)']
  },
  {
    id: 'reviews-ratings',
    number: 15,
    title: 'Trust, Verification & Customer Review System',
    icon: 'ShieldCheck',
    category: 'Ecosystem Networks',
    summary: 'Ecosystem trust framework capturing verified buyer reviews, seller ratings, material quality feedback, delivery SLA compliance scores, and dispute resolution history.',
    subModules: [
      'Verified Transaction Buyer Review Engine (Only post-delivery reviews permitted)',
      'Quarry & Crusher Plant Aggregate Quality Rating Matrix',
      'Fleet Driver & Transport Contractor Delivery Timeliness Rating',
      'Seller Trust Scorecard & Verified Merchant Badge Issuance',
      'Dispute & Complaint History Audit Log',
      'Review Moderation & Anti-Fraud Spam Detector'
    ],
    keyCapabilities: [
      'Strict verification lock: Reviews can ONLY be submitted by buyers with completed delivered orders.',
      'Weight discrepancy & material breakage feedback directly impacting seller Trust Score.',
      'Automated seller suspension trigger if rating falls below 3.2 stars over 10 consecutive orders.'
    ],
    masterDataEntities: ['VerifiedReviewRecord', 'SellerTrustScore', 'ReviewDisputeFlag'],
    eventIntegrations: {
      publishes: ['marketplace.review.posted', 'marketplace.seller_score.updated'],
      subscribes: ['marketplace.order.completed']
    },
    sharedCoreDependencies: ['CRM & Business Suite (Phase 7)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'ai-marketplace',
    number: 16,
    title: 'Gemini AI Marketplace Intelligence & Matchmaking Copilot',
    icon: 'Sparkles',
    category: 'Ad Network & Intelligence',
    summary: 'Server-side AI engine powered by Gemini models for dynamic product recommendations, automated price optimization, AI buyer-seller matchmaking, commodity demand forecasting, and nearby supply suggestions.',
    subModules: [
      'AI Contextual Product Recommendation Model for Contractors',
      'Dynamic Commodity Price Optimization & Rate Recommendation Engine',
      'AI Smart Matchmaking Engine (Connecting Buyers with Optimal Quarry/Fleet)',
      'Regional Mining & Building Material Demand Forecast Model',
      'AI Geo-Proximity & Nearby Supply Optimization Engine',
      'Natural Language AI Search & Voice Order Assistant'
    ],
    keyCapabilities: [
      'Server-side Gemini execution via `/api/ai/marketplace/*` maintaining secret safety.',
      'Recommends optimal quarry source balancing material price, stone dressing quality, and haulage freight cost.',
      'Voice-based search assistant understanding local dialect queries for building materials.'
    ],
    masterDataEntities: ['AIMarketplaceInsight', 'AIPriceRecommendation', 'AISellerMatch'],
    eventIntegrations: {
      publishes: ['marketplace.ai.recommendation_generated', 'marketplace.ai.price_suggested'],
      subscribes: ['marketplace.search.executed', 'marketplace.order.placed']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'Audit & Telemetry (Mod 14)'],
    aiFeatures: ['Gemini AI product recommendation', 'Smart buyer-seller matchmaking', 'Dynamic price & haulage freight optimization']
  }
];

export const MARKETPLACE_ORDER_WORKFLOW = [
  {
    step: 1,
    title: '1. Product Search & Geo-Discovery',
    subtitle: 'Geo-Search, Elastic Search & AI Match',
    description: 'Buyer searches for Laterite Stone or Aggregates on Public Portal. AI geo-engine lists nearby quarries with live stock.',
    icon: 'Search',
    entities: ['MarketplaceListing', 'GeoLocationRegistry'],
    events: ['marketplace.search.executed']
  },
  {
    step: 2,
    title: '2. Supplier Comparison & Cart Building',
    subtitle: 'Price, Dressing Quality & Freight Compare',
    description: 'Buyer compares per-block stone rates, quarry dressing quality grades, and automated haulage transport costs.',
    icon: 'CheckSquare',
    entities: ['MultiVendorCart', 'FreightCalculatorRef'],
    events: ['marketplace.cart.updated']
  },
  {
    step: 3,
    title: '3. Order Placement & Escrow Payment',
    subtitle: 'Checkout, Razorpay/UPI & Escrow Hold',
    description: 'Buyer confirms delivery site and settles payment via Razorpay/UPI. Funds are held in escrow pending site delivery.',
    icon: 'CreditCard',
    entities: ['MarketplaceOrder', 'EscrowHoldRecord'],
    events: ['marketplace.order.placed', 'fin.payment.received']
  },
  {
    step: 4,
    title: '4. Seller Confirmation & Quarry Loading',
    subtitle: 'Quarry Pit Stock Reserve & Dressing Queue',
    description: 'Quarry operator accepts order in Seller Portal. Yard team reserves physical stone blocks or schedules crusher loading.',
    icon: 'Store',
    entities: ['QuarryPitStock', 'OrderConfirmationRecord'],
    events: ['mining.stock.reserved', 'marketplace.order.confirmed']
  },
  {
    step: 5,
    title: '5. Fleet Tipper Assignment & Dispatch',
    subtitle: 'Tipper Allocation, Gate Pass & e-Challan',
    description: 'Fleet Logistics assigns available tipper. Quarry issues gate pass and digital e-Challan upon vehicle departure.',
    icon: 'Truck',
    entities: ['VehicleAllocation', 'QuarryGatePass'],
    events: ['fleet.vehicle.assigned', 'marketplace.order.dispatched']
  },
  {
    step: 6,
    title: '6. Live GPS Transit & Site e-POD Delivery',
    subtitle: 'Live Map Tracking, OTP & Signature POD',
    description: 'Buyer tracks tipper on live map in Buyer Portal. Tipper arrives at site, driver verifies OTP, and captures e-POD.',
    icon: 'MapPin',
    entities: ['ProofOfDelivery', 'GPSTrackingSession'],
    events: ['fleet.trip.completed', 'marketplace.order.delivered']
  },
  {
    step: 7,
    title: '7. Escrow Release, Seller Payout & Review',
    subtitle: 'Payout Settlement, GST Invoice & Trust Rating',
    description: 'Escrow releases payment to quarry owner minus platform take-rate. Buyer downloads GST invoice and posts verified review.',
    icon: 'ShieldCheck',
    entities: ['SellerPayoutLedger', 'VerifiedReviewRecord'],
    events: ['marketplace.payout.processed', 'marketplace.review.posted']
  }
];

export const MARKETPLACE_RENTAL_WORKFLOW = [
  {
    step: 1,
    title: '1. Heavy Equipment / Tipper Search',
    subtitle: 'Hourly, Shift or Monthly Rental Search',
    description: 'Contractor searches for 20-Ton Excavator with Rock Breaker or Tipper Fleet for 2-week project contract.',
    icon: 'Search',
    entities: ['RentalListing', 'EquipmentCategory'],
    events: ['marketplace.rental_search.executed']
  },
  {
    step: 2,
    title: '2. Availability & Operator Verification',
    subtitle: 'Machine Inspection & Operator Skill Check',
    description: 'System verifies machine telematics hour-meter health, low-bed transport availability, and operator driving badge.',
    icon: 'Wrench',
    entities: ['EquipmentTelematics', 'OperatorBadge'],
    events: ['mining.equipment.verified']
  },
  {
    step: 3,
    title: '3. Digital Quote & Rental Agreement',
    subtitle: 'Mobilization Surcharge & Rental Terms',
    description: 'Rental provider generates quotation including low-bed trailer mobilization cost. Contractor signs agreement digitally.',
    icon: 'FileText',
    entities: ['RentalAgreement', 'MobilizationQuote'],
    events: ['marketplace.rental.quote_accepted']
  },
  {
    step: 4,
    title: '4. Booking Deposit & Mobilization',
    subtitle: 'Escrow Advance Payment & Site Transport',
    description: 'Contractor pays booking deposit into escrow. Low-bed trailer mobilizes excavator to construction site.',
    icon: 'Truck',
    entities: ['RentalEscrowDeposit', 'TrailerDispatchPass'],
    events: ['fleet.trip.dispatched', 'marketplace.rental.mobilized']
  },
  {
    step: 5,
    title: '5. On-Site Machine Operation & Telematics Tracking',
    subtitle: 'IoT Hour-Meter Log & Shift Sign-Off',
    description: 'Machine operates on site. IoT gateway transmits engine running hours daily to calculate exact usage billing.',
    icon: 'Activity',
    entities: ['HourMeterTelemetryLog', 'ShiftLogSheet'],
    events: ['mining.equipment.hour_logged']
  },
  {
    step: 6,
    title: '6. Rental Demobilization & Final Settlement',
    subtitle: 'Inspection, Damage Audit & Escrow Settlement',
    description: 'Equipment demobilizes from site. Both parties inspect machine health, audit total hours, and settle final escrow.',
    icon: 'DollarSign',
    entities: ['RentalSettlementInvoice', 'DamageAuditReport'],
    events: ['marketplace.rental.settled', 'fin.payout.released']
  }
];

export const MARKETPLACE_REVENUE_MODELS = [
  {
    model: 'Platform Take-Rate (Commission)',
    description: 'Percentage-based transaction fee (1.5% to 4%) deducted automatically from direct product sales, aggregate orders, and stone deliveries.'
  },
  {
    model: 'Rental Booking Fee',
    description: 'Service fee (2% to 5%) levied on commercial vehicle and heavy machinery rental bookings processed through escrow.'
  },
  {
    model: 'Dealer & Supplier Subscription Tiers',
    description: 'Monthly/Annual subscription plans for registered stockyards, distributors, and quarry operators offering advanced lead routing and ERP sync.'
  },
  {
    model: 'Advertisement & Sponsored Listings',
    description: 'Pay-Per-Click (PPC) and Cost-Per-Mille (CPM) revenue from featured quarry listings, banner ads, and top-tier search result pins.'
  },
  {
    model: 'Escrow Financial Service Fees',
    description: 'Micro-fee charged for providing secure payment escrow holds, contractor credit line guarantees, and instant seller payouts.'
  },
  {
    model: 'Jobs & Contractor Recruitment Placement',
    description: 'Fixed fee per successful driver, machine operator, or engineer hiring placement on the Jobs Marketplace.'
  }
];

export const MARKETPLACE_INTEGRATIONS_TOPOLOGY = [
  {
    system: 'Shared Core Platform',
    purpose: 'Universal Single Sign-On, 4-Tier RLS Tenant Isolation, Master Data Management, PDF Document Engine, Omni-Channel Notifications, Gemini AI Proxy.',
    protocol: 'gRPC Internal Mesh / Node.js Local Imports'
  },
  {
    system: 'Mining Operations Suite (Phase 4)',
    purpose: 'Direct quarry stock check, stone dressing queue sync, weighbridge ticket validation, and equipment availability routing.',
    protocol: 'Kafka / NATS Event Streaming (`mining.stock.updated`, `mining.weighbridge.ticket_created`)'
  },
  {
    system: 'Fleet & Logistics Suite (Phase 5)',
    purpose: 'Automated tipper vehicle allocation, live GPS transit tracking stream, low-bed heavy transport booking, and e-POD signature ingestion.',
    protocol: 'Inter-Service Event Adapter (`fleet.vehicle.assigned`, `fleet.trip.completed`)'
  },
  {
    system: 'Building Materials Suite (Phase 6)',
    purpose: 'Multi-warehouse product catalog lookup, instant inventory reservation, pricing matrix sync, and sales invoice generation.',
    protocol: 'Inter-Service Event Adapter (`materials.inventory.synced`, `materials.sales.invoiced`)'
  },
  {
    system: 'CRM & Business Suite (Phase 7)',
    purpose: 'Inbound lead capture from public portal, contractor account credit limits, customer support ticket escalation, and verified review sync.',
    protocol: 'REST API Proxy & Event Adapter (`crm.lead.created`, `crm.complaint.registered`)'
  },
  {
    system: 'Finance Shared Engine (Phase 9)',
    purpose: 'Razorpay/UPI Payment gateway webhook ingestion, escrow hold management, seller payout ledger settlement, and platform take-rate accounting.',
    protocol: 'Direct Event Adapter (`fin.payment.received`, `fin.payout.released`)'
  },
  {
    system: 'HRMS Engine (Phase 9)',
    purpose: 'Jobs Marketplace candidate driving license verification, driver safety scorecards, and operator skill badge validations.',
    protocol: 'REST Bridge (`core.hr.badge_verified`)'
  },
  {
    system: 'External Payment Gateways & RTO Vahan API',
    purpose: 'Razorpay/Stripe payment links, UPI intent flow, and Vahan RTO commercial vehicle chassis verification.',
    protocol: 'External REST / HTTPS Webhooks'
  }
];

export const MARKETPLACE_FOLDER_STRUCTURE = [
  'src/modules/marketplace/',
  '├── controllers/',
  '│   ├── public-portal.controller.ts',
  '│   ├── laterite-marketplace.controller.ts',
  '│   ├── crusher-marketplace.controller.ts',
  '│   ├── vehicle-rental.controller.ts',
  '│   ├── equipment-rental.controller.ts',
  '│   ├── ad-platform.controller.ts',
  '│   └── marketplace-analytics.controller.ts',
  '├── services/',
  '│   ├── geo-search-engine.service.ts',
  '│   ├── escrow-settlement.service.ts',
  '│   ├── vahan-rto-verification.service.ts',
  '│   ├── ad-bidding-engine.service.ts',
  '│   └── marketplace-ai-copilot.service.ts',
  '├── models/',
  '│   ├── listing.model.ts',
  '│   ├── marketplace-order.model.ts',
  '│   ├── rental-booking.model.ts',
  '│   ├── escrow-hold.model.ts',
  '│   └── ad-campaign.model.ts',
  '├── events/',
  '│   ├── marketplace-events.publisher.ts',
  '│   └── marketplace-events.subscriber.ts',
  '└── interfaces/',
  '    ├── listing-filter.interface.ts',
  '    └── portal-seller.interface.ts'
];

export const PHASE9_TRANSITION_REVIEW = {
  title: 'Phase 8 Marketplace Platform Architectural Review & Phase 9 Transition Plan',
  validatedCapabilities: [
    'Comprehensive Ecosystem Marketplace: Complete coverage across B2B, B2C, C2C, Laterite Stone, Aggregates, Building Materials, Vehicles, Heavy Equipment, Rentals, Jobs, and Services.',
    'Geo-Spatial Quarry & Fleet Discovery: Real-time GPS search locating nearby quarries, stone yards, and transport tippers within a specific radius.',
    '4-Tier Portal Architecture: Dedicated specialized portals for Public Commerce, Sellers/Quarry Owners, Dealers/Distributors, and Buyers/Contractors.',
    'Integrated Escrow & Delivery Workflow: End-to-end checkout, payment escrow hold, tipper dispatch, live GPS map tracking, and e-POD signature settlement.',
    'Gemini AI Marketplace Copilot: Dynamic commodity price optimization, smart buyer-seller matchmaking, and voice order assistance.'
  ],
  identifiedImprovementsForPhase9: [
    'General Ledger Real-Time Sync: Automated double-entry pre-posting of platform take-rate commissions directly into General Ledger financial accounts.',
    'HRMS Yard Labor Incentive Matrix: Direct payroll linkage between marketplace order volumes and quarry dressing worker piece-rate wages.',
    'Autonomous AI Price Bidding Agents: AI agents negotiating bulk haulage freight rates on behalf of contractors and fleet owners.'
  ],
  status: 'APPROVED — READY FOR PHASE 9 (GENERAL LEDGER FINANCE, HRMS & AI PLATFORM DEEP EXPANSION)'
};
