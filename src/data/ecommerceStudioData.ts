/**
 * RZ® MINETRIX — PLATFORM 05: BUILDING MATERIALS E-COMMERCE
 * Studio Preview / Demo Data Models & Operational Datasets
 * All figures, supplier credentials, stock levels, and quotes are clearly labelled as Studio Demo Data.
 */

import heroLateriteImg from '../assets/images/hero_laterite_quarry_1790166404713.jpg';
import productLateriteStdImg from '../assets/images/product_laterite_standard_1790166415777.jpg';
import productLateriteWirecutImg from '../assets/images/product_wirecut_laterite_1790166427415.jpg';
import productAggregateImg from '../assets/images/product_crushed_aggregate_1790166439659.jpg';

export interface CommerceCategory {
  id: string;
  name: string;
  group: 'Stone' | 'Building Materials' | 'Other';
  description: string;
  itemCount: number;
  featured?: boolean;
  priorityOrder: number;
  iconName: string;
}

export interface CommerceProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  group: 'Stone' | 'Building Materials' | 'Other';
  dimensions: string;
  weight?: string;
  unit: string;
  material: string;
  finish: string;
  application: string;
  description: string;
  isLaterite: boolean;
  featured: boolean;
  image: string;
  // Availability
  supplierCount: number;
  availableQuantity: number;
  minimumOrder: number;
  deliveryAreas: string[];
  estimatedDispatchHours: number;
  // Commercial
  priceType: 'Fixed' | 'Quote Required' | 'Price on Request' | 'Customer Specific';
  basePrice?: number;
  taxPercent: number;
  estimatedDeliveryPerKm: number;
  paymentTerms: string;
  rating: number;
  reviewCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  state: string;
  gstNumber: string;
  productCategories: string[];
  deliveryAreas: string[];
  monthlyCapacity: string;
  status: 'Active' | 'Pending Verification' | 'Suspended' | 'Inactive';
  documentsCount: number;
  rating: number;
  activeOrdersCount: number;
  totalSalesRs: number;
  outstandingPayableRs: number;
  verifiedQuarryBadge: boolean;
}

export interface SupplierProductListing {
  id: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  productCode: string;
  category: string;
  specifications: string;
  dimensions: string;
  unit: string;
  availableQuantity: number;
  minimumOrder: number;
  priceType: 'Fixed' | 'Quote Required' | 'Customer Specific' | 'Agreement Rate';
  baseRate: number;
  deliveryAreas: string[];
  dispatchTime: string;
  status: 'Active' | 'Low Stock' | 'Unavailable';
}

export type QuoteStatus =
  | 'Requested'
  | 'Submitted'
  | 'Viewed'
  | 'Negotiation'
  | 'Accepted'
  | 'Rejected'
  | 'Expired';

export interface SupplierQuote {
  id: string;
  quoteNumber: string;
  rfqId?: string;
  supplierId: string;
  supplierName: string;
  supplierRating: number;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  deliveryLocation: string;
  district: string;
  requiredDate: string;
  // Commercials
  unitRate: number;
  materialAmount: number;
  deliveryCharge: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  advanceRequired: number;
  balanceAmount: number;
  // Delivery & Validity
  estimatedDispatch: string;
  estimatedDelivery: string;
  quoteValidityDays: number;
  terms: string;
  status: QuoteStatus;
  notes: string;
  createdDate: string;
}

export type OrderStatus =
  | 'Draft'
  | 'Enquiry'
  | 'Quotation Requested'
  | 'Quotation Received'
  | 'Customer Selected'
  | 'Order Confirmed'
  | 'Payment Pending'
  | 'Processing'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Customer Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Disputed'
  | 'Refund Pending'
  | 'Refunded';

export interface OrderTimelineEvent {
  id: string;
  date: string;
  time: string;
  actor: string;
  status: OrderStatus;
  notes: string;
}

export interface CommerceOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  siteProjectName: string;
  district: string;
  state: string;
  pinCode: string;
  // Product
  productId: string;
  productName: string;
  productCode: string;
  dimensions: string;
  quantity: number;
  unit: string;
  isLaterite: boolean;
  // Supplier
  supplierId: string;
  supplierName: string;
  quoteId?: string;
  // Schedule
  requiredDate: string;
  orderDate: string;
  estimatedDelivery: string;
  deliveryType: 'Direct Tipper Dump' | 'Unloaded Stacked' | 'Crane Offloaded';
  vehicleRequirement: '6-Wheeler Medium' | '10-Wheeler Tipper' | '14-Wheeler Multi-Axle' | 'Mini Truck';
  siteAccessNotes: string;
  // Financials
  materialRate: number;
  materialAmount: number;
  deliveryCharge: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  advancePaid: number;
  balanceAmount: number;
  paymentStatus: 'Unpaid' | 'Advance Paid' | 'Fully Paid' | 'Refunded';
  // Logistics
  dispatchStatus: 'Pending' | 'Ready' | 'Vehicle Assigned' | 'Loading' | 'Dispatched' | 'In Transit' | 'Delivered';
  assignedVehicleNumber?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  deliveryStatusTimeline: string;
  customerConfirmedAt?: string;
  // Core Status
  status: OrderStatus;
  documentsCount: number;
  hasDispute: boolean;
  timeline: OrderTimelineEvent[];
}

export interface OrderPaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  paymentType: 'Advance' | 'Partial Payment' | 'Full Payment' | 'Balance Payment' | 'Refund';
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer (NEFT/RTGS)' | 'UPI' | 'Card' | 'Cheque';
  transactionReference: string;
  date: string;
  status: 'Confirmed' | 'Pending Verification' | 'Failed';
  receiptNumber: string;
  notes: string;
}

export interface DispatchRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  supplierName: string;
  productName: string;
  quantity: number;
  unit: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  pickupLocation: string;
  destinationLocation: string;
  dispatchDate: string;
  expectedDelivery: string;
  gatePassNumber: string;
  loadingStatus: 'Pending' | 'Loading in Progress' | 'Weighed & Cleared' | 'Exited Quarry Gate';
  notes: string;
  grossWeightTons?: number;
  tareWeightTons?: number;
  netWeightTons?: number;
}

export interface CommerceVehicle {
  id: string;
  vehicleNumber: string;
  type: string;
  capacityTons: number;
  driverName: string;
  driverPhone: string;
  availability: 'Available' | 'On Delivery Trip' | 'Maintenance' | 'Loading';
  currentTripOrderNumber?: string;
  currentDestination?: string;
  baseHub: string;
}

export interface ReturnDispute {
  id: string;
  disputeNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  supplierName: string;
  issue: 'Wrong Product' | 'Quantity Issue' | 'Quality Issue' | 'Delivery Issue' | 'Damaged Material' | 'Other';
  description: string;
  evidencePlaceholder: string;
  requestedResolution: 'Replacement Dispatched' | 'Full Refund' | 'Partial Credit Note' | 'Free Delivery Compensation';
  status: 'Open' | 'Under Review' | 'Supplier Response' | 'Resolution Proposed' | 'Resolved' | 'Rejected' | 'Refund Pending' | 'Refunded';
  openedDate: string;
  resolvedDate?: string;
  refundAmount?: number;
}

export interface CustomerCommerceAccount {
  id: string;
  customerName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  totalOrdersCount: number;
  totalPurchasedRs: number;
  totalPaidRs: number;
  outstandingBalanceRs: number;
  advancesHeldRs: number;
  refundsProcessedRs: number;
  creditLimitRs: number;
}

export interface CommerceReview {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  supplierName: string;
  customerName: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface CommerceDocument {
  id: string;
  orderNumber: string;
  title: string;
  category: 'Tax Invoice' | 'Transit Pass' | 'E-Way Bill' | 'Weighbridge Slip' | 'Quality Lab Report' | 'Quarry Mining Permit';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
}

// -------------------------------------------------------------
// SAMPLE DATASETS
// -------------------------------------------------------------

export const COMMERCE_CATEGORIES: CommerceCategory[] = [
  // Stone Categories
  { id: 'cat-laterite', name: 'Laterite Stone', group: 'Stone', description: 'Natural red laterite quarry masonry, wire-cut and jumbo foundation blocks.', itemCount: 6, featured: true, priorityOrder: 1, iconName: 'Layers' },
  { id: 'cat-hard-rock', name: 'Hard Rock', group: 'Stone', description: 'Raw blasting stone, boulder riprap, and foundation rubble.', itemCount: 4, priorityOrder: 2, iconName: 'Mountain' },
  { id: 'cat-aggregate', name: 'Aggregate', group: 'Stone', description: 'Graded crushed blue metal stone for RMC and concrete mixtures.', itemCount: 5, featured: true, priorityOrder: 3, iconName: 'Layers' },
  { id: 'cat-20mm', name: '20mm Aggregate', group: 'Stone', description: 'Standard coarse blue metal stone aggregate for structural RCC beams & columns.', itemCount: 3, priorityOrder: 4, iconName: 'Layers' },
  { id: 'cat-12mm', name: '12mm Aggregate', group: 'Stone', description: 'Medium aggregate chips for lintels, precast pavers, and flooring concrete.', itemCount: 2, priorityOrder: 5, iconName: 'Layers' },
  { id: 'cat-6mm', name: '6mm Aggregate', group: 'Stone', description: 'Fine aggregate grit for asphalt wet mix macadam and designer tiles.', itemCount: 2, priorityOrder: 6, iconName: 'Layers' },
  { id: 'cat-m-sand', name: 'M-Sand', group: 'Stone', description: 'Double washed VSI manufactured sand for RCC structural concrete.', itemCount: 4, featured: true, priorityOrder: 7, iconName: 'Layers' },
  { id: 'cat-p-sand', name: 'P-Sand', group: 'Stone', description: 'Triple washed micro-fines plastering sand for crack-free wall plastering.', itemCount: 3, priorityOrder: 8, iconName: 'Layers' },
  { id: 'cat-dust', name: 'Dust', group: 'Stone', description: 'Quarry crushed stone powder for hollow brick manufacturing and backfilling.', itemCount: 2, priorityOrder: 9, iconName: 'Layers' },
  // Building Materials Categories
  { id: 'cat-cement', name: 'Cement', group: 'Building Materials', description: 'Grade 53 & 43 OPC, PPC, and PSC cement bags with direct mill supply.', itemCount: 8, featured: true, priorityOrder: 10, iconName: 'Package' },
  { id: 'cat-tmt', name: 'TMT Steel', group: 'Building Materials', description: 'Primary brand Fe550D earthquake resistant Thermo-Mechanically Treated rebars.', itemCount: 7, featured: true, priorityOrder: 11, iconName: 'Package' },
  { id: 'cat-blocks', name: 'Blocks', group: 'Building Materials', description: 'Solid concrete masonry blocks and autoclaved aerated concrete (AAC) blocks.', itemCount: 5, priorityOrder: 12, iconName: 'Package' },
  { id: 'cat-upvc', name: 'UPVC', group: 'Building Materials', description: 'Heavy gauge electrical conduits, drainage pipes, and pressure water fittings.', itemCount: 6, priorityOrder: 13, iconName: 'Package' },
  { id: 'cat-hardware', name: 'Hardware', group: 'Building Materials', description: 'Structural binding wire, shuttering plywood, tie rods, and fasteners.', itemCount: 9, priorityOrder: 14, iconName: 'Tag' },
  { id: 'cat-other', name: 'Other Materials', group: 'Building Materials', description: 'Waterproofing admixtures, geosynthetics, and boundary mesh wire.', itemCount: 4, priorityOrder: 15, iconName: 'Package' }
];

export const COMMERCE_PRODUCTS: CommerceProduct[] = [
  // PRIORITY COMMERCIAL: LATERITE STONE
  {
    id: 'prod-lat-01',
    code: 'LAT-STD-302015',
    name: 'Standard Laterite Building Block',
    category: 'Laterite Stone',
    group: 'Stone',
    dimensions: '30 cm × 20 cm × 15 cm (12" × 8" × 6")',
    weight: '18.5 kg / block',
    unit: 'Block',
    material: 'Natural Red Laterite (Geological Pit Concession)',
    finish: 'Dressed Masonry Edge',
    application: 'Load-bearing residential walls, compound boundary masonry, commercial facades',
    description: 'High compressive strength dense red laterite excavated from mature geological strata in Kasaragod & Kannur. Excellent thermal insulation in tropical climates with superior mortar bond.',
    isLaterite: true,
    featured: true,
    image: productLateriteStdImg,
    supplierCount: 6,
    availableQuantity: 42000,
    minimumOrder: 500,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Udupi', 'Wayanad', 'Calicut'],
    estimatedDispatchHours: 12,
    priceType: 'Fixed',
    basePrice: 38.5,
    taxPercent: 5,
    estimatedDeliveryPerKm: 1.8,
    paymentTerms: '30% Advance on order, balance against vehicle weighment dispatch',
    rating: 4.9,
    reviewCount: 88
  },
  {
    id: 'prod-lat-02',
    code: 'LAT-WIR-302015',
    name: 'Wire-Cut Architectural Laterite Block',
    category: 'Laterite Stone',
    group: 'Stone',
    dimensions: '30 cm × 20 cm × 15 cm (Precision Machine Sawn)',
    weight: '18.2 kg / block',
    unit: 'Block',
    material: 'Uniform Dense Red Laterite',
    finish: 'Machine Wire-Cut (Sharp 90° Bevel-Free Edge)',
    application: 'Unplastered exposed natural brickwork, resort architecture, luxury villa cladding',
    description: 'Diamond wire-sawn cutting gives perfectly square corners and plane surfaces requiring zero wall plastering. Direct clear varnish or natural sealant application ready.',
    isLaterite: true,
    featured: true,
    image: productLateriteWirecutImg,
    supplierCount: 4,
    availableQuantity: 18500,
    minimumOrder: 400,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Udupi', 'Kozhikode', 'Bengaluru'],
    estimatedDispatchHours: 24,
    priceType: 'Fixed',
    basePrice: 48.0,
    taxPercent: 5,
    estimatedDeliveryPerKm: 2.0,
    paymentTerms: '40% Advance, balance upon quarry transit pass issue',
    rating: 4.95,
    reviewCount: 64
  },
  {
    id: 'prod-lat-03',
    code: 'LAT-JMB-352518',
    name: 'Foundation Jumbo Laterite Block',
    category: 'Laterite Stone',
    group: 'Stone',
    dimensions: '35 cm × 25 cm × 18 cm (Heavy Section)',
    weight: '28.0 kg / block',
    unit: 'Block',
    material: 'Hard Deep-Pit Iron-Rich Laterite',
    finish: 'Quarry Rough Dressed',
    application: 'Basement foundation plinths, heavy retaining earth walls, slope stabilization',
    description: 'Extra-large dimension massive block designed to distribute building loads across foundation trenches. High iron mineral density resists prolonged groundwater exposure.',
    isLaterite: true,
    featured: true,
    image: productLateriteStdImg,
    supplierCount: 5,
    availableQuantity: 26000,
    minimumOrder: 300,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Coorg', 'Wayanad'],
    estimatedDispatchHours: 18,
    priceType: 'Fixed',
    basePrice: 58.0,
    taxPercent: 5,
    estimatedDeliveryPerKm: 2.2,
    paymentTerms: '25% Advance, balance against gate delivery pass',
    rating: 4.85,
    reviewCount: 42
  },
  {
    id: 'prod-lat-04',
    code: 'LAT-ARC-402020',
    name: 'Architectural Facing Cladding Laterite Block',
    category: 'Laterite Stone',
    group: 'Stone',
    dimensions: '40 cm × 20 cm × 20 cm (Specimen Selected)',
    weight: '25.0 kg / block',
    unit: 'Block',
    material: 'Selected Deep Ochre Red Laterite',
    finish: 'Fine Chiseled / Calibrated Smooth Face',
    application: 'Contemporary heritage architecture, landscape terraces, accent feature walls',
    description: 'Handpicked blocks with rich pigmentation and uniform porosity. Calibrated for seamless mortar joint thickness (3-5mm) in exposed masonry construction.',
    isLaterite: true,
    featured: false,
    image: productLateriteWirecutImg,
    supplierCount: 3,
    availableQuantity: 9800,
    minimumOrder: 250,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Udupi', 'Ernakulam'],
    estimatedDispatchHours: 36,
    priceType: 'Price on Request',
    basePrice: 66.0,
    taxPercent: 5,
    estimatedDeliveryPerKm: 2.2,
    paymentTerms: '50% Advance with custom sizing cut schedule',
    rating: 4.9,
    reviewCount: 29
  },
  {
    id: 'prod-lat-05',
    code: 'LAT-CUS-VAR',
    name: 'Custom Dimension Laterite Stone Block',
    category: 'Laterite Stone',
    group: 'Stone',
    dimensions: 'Custom / As Per Structural Architect Drawing',
    weight: 'Variable as per cut',
    unit: 'Cubic Foot (CFT)',
    material: 'Dense Quarry Bedrock Laterite',
    finish: 'Wire-cut or rough-dressed on demand',
    application: 'Heritage restoration, curved columns, lintel stones, heavy boundary coping',
    description: 'Bespoke quarry extraction cut directly to your structural drawings. In-pit CNC wire cutting available for architectural restoration projects across Southern India.',
    isLaterite: true,
    featured: false,
    image: heroLateriteImg,
    supplierCount: 3,
    availableQuantity: 15000,
    minimumOrder: 100,
    deliveryAreas: ['All Southern States (Kerala, Karnataka, Goa, Tamil Nadu)'],
    estimatedDispatchHours: 48,
    priceType: 'Quote Required',
    basePrice: 85.0,
    taxPercent: 5,
    estimatedDeliveryPerKm: 2.5,
    paymentTerms: '50% Advance upon shop drawing signoff',
    rating: 4.8,
    reviewCount: 16
  },
  // GENERAL BUILDING MATERIALS
  {
    id: 'prod-agg-20mm',
    code: 'AGG-20MM-GRN',
    name: '20mm Crushed Blue Metal Granite Aggregate',
    category: '20mm Aggregate',
    group: 'Stone',
    dimensions: '20mm Angular Cubical Fractions (IS 383:2016)',
    weight: '1,550 kg / m³ bulk density',
    unit: 'Metric Ton (MT)',
    material: 'High-Density Crushed Granite Rock',
    finish: 'VSI Tertiary Impact Crushed',
    application: 'RCC slabs, columns, foundation footings, highway asphalt concrete',
    description: 'Clean washed 20mm aggregates with excellent elongation and flakiness index (<15%). Zero silt and low water absorption certified for M25 to M50 concrete mixes.',
    isLaterite: false,
    featured: true,
    image: productAggregateImg,
    supplierCount: 8,
    availableQuantity: 12500,
    minimumOrder: 10,
    deliveryAreas: ['Wayanad', 'Kozhikode', 'Malappuram', 'Mysuru', 'Kannur', 'Coorg'],
    estimatedDispatchHours: 6,
    priceType: 'Fixed',
    basePrice: 680.0,
    taxPercent: 5,
    estimatedDeliveryPerKm: 4.5,
    paymentTerms: 'Full weighbridge slip settlement on tipper dispatch',
    rating: 4.9,
    reviewCount: 112
  },
  {
    id: 'prod-sand-msand',
    code: 'SND-MSAND-VSI',
    name: 'VSI Washed Manufactured Sand (M-Sand)',
    category: 'M-Sand',
    group: 'Stone',
    dimensions: 'Zone-II Graded Particle Distribution (0 to 4.75 mm)',
    weight: '1,650 kg / m³ bulk density',
    unit: 'Metric Ton (MT)',
    material: 'Tertiary Impact VSI Crushed Granite',
    finish: 'Hydro-cyclone Double Washed',
    application: 'All structural concrete, RCC slabs, precast concrete hollow blocks',
    description: 'Eco-friendly alternative to river sand. Controlled fines (<7% through 75 micron sieve) with cubical grain geometry for superior compressive strength and workability.',
    isLaterite: false,
    featured: true,
    image: productAggregateImg,
    supplierCount: 7,
    availableQuantity: 8400,
    minimumOrder: 12,
    deliveryAreas: ['Wayanad', 'Calicut', 'Kannur', 'Kasaragod', 'Mysuru'],
    estimatedDispatchHours: 6,
    priceType: 'Fixed',
    basePrice: 720.0,
    taxPercent: 5,
    estimatedDeliveryPerKm: 4.5,
    paymentTerms: 'Payment against weighbridge printout & transit pass',
    rating: 4.88,
    reviewCount: 95
  },
  {
    id: 'prod-sand-psand',
    code: 'SND-PSAND-PLAS',
    name: 'Micro-Washed Plastering Sand (P-Sand)',
    category: 'P-Sand',
    group: 'Stone',
    dimensions: 'Zone-IV Micro Fine Particles (0 to 2.36 mm)',
    weight: '1,600 kg / m³ bulk density',
    unit: 'Metric Ton (MT)',
    material: 'VSI Crushed Granite with Silt Extraction',
    finish: 'Air-classified & Triple Washed',
    application: 'Internal & external wall plastering, ceiling render, tile fixing mortar',
    description: 'Silica-rich ultra-fine aggregate engineered to eliminate plaster shrinkage cracks and rebound loss. Delivers mirror-smooth wall finish with lower cement consumption.',
    isLaterite: false,
    featured: false,
    image: productAggregateImg,
    supplierCount: 5,
    availableQuantity: 6200,
    minimumOrder: 10,
    deliveryAreas: ['Wayanad', 'Calicut', 'Kannur', 'Kasaragod'],
    estimatedDispatchHours: 8,
    priceType: 'Fixed',
    basePrice: 840.0,
    taxPercent: 5,
    estimatedDeliveryPerKm: 4.5,
    paymentTerms: 'Payment against dispatch e-Way bill',
    rating: 4.85,
    reviewCount: 54
  },
  {
    id: 'prod-cem-opc53',
    code: 'CEM-OPC-53',
    name: 'OPC 53 Grade High-Strength Cement (50kg Bag)',
    category: 'Cement',
    group: 'Building Materials',
    dimensions: 'Standard 50 kg HDPE Bag',
    weight: '50.0 kg / bag',
    unit: 'Bag (50kg)',
    material: 'Portland Clinker & Gypsum (IS 269:2015)',
    finish: 'Fresh Direct-Mill Packed',
    application: 'Multi-storey RCC columns, prestressed concrete girders, heavy load slabs',
    description: 'High 28-day compressive strength exceeding 53 MPa. Faster curing cycle allowing rapid shuttering de-staging on fast-track civil projects.',
    isLaterite: false,
    featured: true,
    image: productAggregateImg,
    supplierCount: 6,
    availableQuantity: 14000,
    minimumOrder: 100,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Wayanad', 'Kozhikode'],
    estimatedDispatchHours: 12,
    priceType: 'Fixed',
    basePrice: 385.0,
    taxPercent: 28,
    estimatedDeliveryPerKm: 0.25,
    paymentTerms: '100% Payment prior to lorry dispatch',
    rating: 4.92,
    reviewCount: 76
  },
  {
    id: 'prod-tmt-550d',
    code: 'TMT-FE-550D',
    name: 'Fe550D High-Ductility TMT Rebars (8mm - 25mm)',
    category: 'TMT Steel',
    group: 'Building Materials',
    dimensions: '12m Standard Lengths (Bundle Assorted 8, 10, 12, 16, 20, 25mm)',
    weight: 'As per standard IS 1786 bundle weight',
    unit: 'Metric Ton (MT)',
    material: 'Primary Billet Thermo-Mechanically Treated Steel',
    finish: 'Corrosion-Resistant Ribbed Profile',
    application: 'Seismic resistant civil reinforcement, bridges, commercial towers',
    description: 'Super-ductile Fe550D rebar designed to absorb earthquake shocks. High tensile elongation (>16%) with superior bendability and weldability.',
    isLaterite: false,
    featured: true,
    image: productAggregateImg,
    supplierCount: 4,
    availableQuantity: 450,
    minimumOrder: 2,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Wayanad', 'Calicut'],
    estimatedDispatchHours: 24,
    priceType: 'Fixed',
    basePrice: 58500.0,
    taxPercent: 18,
    estimatedDeliveryPerKm: 12.0,
    paymentTerms: 'RTGS before trailer dispatch from depot',
    rating: 4.9,
    reviewCount: 49
  },
  {
    id: 'prod-blk-solid',
    code: 'BLK-SLD-8IN',
    name: 'High-Density Solid Concrete Blocks (8")',
    category: 'Blocks',
    group: 'Building Materials',
    dimensions: '400 mm × 200 mm × 200 mm (16" × 8" × 8")',
    weight: '24.0 kg / block',
    unit: 'Block',
    material: 'Crushed Granite M-Sand & 53G Cement',
    finish: 'Hydraulic Compaction Cured',
    application: 'Load-bearing masonry, commercial partition walls, compound walling',
    description: 'Hydraulically pressed high-density solid blocks with flat true surfaces. Reduces plaster thickness by 30% compared to traditional brickwork.',
    isLaterite: false,
    featured: false,
    image: productLateriteStdImg,
    supplierCount: 5,
    availableQuantity: 32000,
    minimumOrder: 400,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Udupi'],
    estimatedDispatchHours: 12,
    priceType: 'Fixed',
    basePrice: 42.0,
    taxPercent: 12,
    estimatedDeliveryPerKm: 1.8,
    paymentTerms: 'Advance payment or verified builder 15-day credit terms',
    rating: 4.8,
    reviewCount: 38
  }
];

export const COMMERCE_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-401',
    name: 'Kasaragod Laterite Concession Pit #01',
    businessName: 'Malabar Stone Mines & Minerals LLP',
    contactPerson: 'K. Raveendran Nair',
    phone: '+91 98471 22845',
    email: 'raveendran@malabarstonemines.com',
    address: 'Survey No. 412/3, Nileshwaram Taluk',
    district: 'Kasaragod',
    state: 'Kerala',
    gstNumber: '32AABCM4589L1Z8',
    productCategories: ['Laterite Stone', 'Hard Rock'],
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Udupi', 'Wayanad'],
    monthlyCapacity: '1,20,000 Blocks / Month',
    status: 'Active',
    documentsCount: 6,
    rating: 4.95,
    activeOrdersCount: 8,
    totalSalesRs: 4850000,
    outstandingPayableRs: 340000,
    verifiedQuarryBadge: true
  },
  {
    id: 'SUP-402',
    name: 'Kannur Valley Wire-Cut Quarry Co.',
    businessName: 'Kannur Natural Stones Pvt Ltd',
    contactPerson: 'Sajid M. P.',
    phone: '+91 94472 90112',
    email: 'orders@kannurstones.in',
    address: 'Plot 18, Sreekandapuram Mining Zone',
    district: 'Kannur',
    state: 'Kerala',
    gstNumber: '32AACCK8912P1ZF',
    productCategories: ['Laterite Stone', 'Blocks'],
    deliveryAreas: ['Kannur', 'Kasaragod', 'Kozhikode', 'Wayanad', 'Mangalore'],
    monthlyCapacity: '85,000 Wire-cut Blocks / Month',
    status: 'Active',
    documentsCount: 5,
    rating: 4.9,
    activeOrdersCount: 6,
    totalSalesRs: 3920000,
    outstandingPayableRs: 280000,
    verifiedQuarryBadge: true
  },
  {
    id: 'SUP-403',
    name: 'Wayanad VSI Crusher & Sand Works',
    businessName: 'Sahyadri Aggregates & Ready Sand Corp',
    contactPerson: 'Mathews George',
    phone: '+91 97455 33410',
    email: 'crushers@sahyadriaggregates.com',
    address: 'Meppadi Industrial Estate, Vythiri',
    district: 'Wayanad',
    state: 'Kerala',
    gstNumber: '32AAHCS7821Q1ZU',
    productCategories: ['Aggregate', '20mm Aggregate', '12mm Aggregate', '6mm Aggregate', 'M-Sand', 'P-Sand', 'Dust'],
    deliveryAreas: ['Wayanad', 'Calicut', 'Malappuram', 'Mysuru', 'Kannur'],
    monthlyCapacity: '35,000 MT Crushed Products',
    status: 'Active',
    documentsCount: 8,
    rating: 4.88,
    activeOrdersCount: 11,
    totalSalesRs: 8420000,
    outstandingPayableRs: 620000,
    verifiedQuarryBadge: true
  },
  {
    id: 'SUP-404',
    name: 'Mangalore Coastal Builders Depot',
    businessName: 'Karavali Building Solutions Ltd',
    contactPerson: 'Ganesh Kamath',
    phone: '+91 98801 44520',
    email: 'gkamath@karavalibuild.com',
    address: 'NH-66 Baikampady Industrial Area',
    district: 'Mangalore',
    state: 'Karnataka',
    gstNumber: '29AABCK3310N1ZW',
    productCategories: ['Cement', 'TMT Steel', 'UPVC', 'Hardware', 'Blocks'],
    deliveryAreas: ['Mangalore', 'Udupi', 'Kasaragod', 'Bantwal', 'Puttur'],
    monthlyCapacity: '5,000 MT Steel & 80,000 Bags Cement',
    status: 'Active',
    documentsCount: 4,
    rating: 4.85,
    activeOrdersCount: 5,
    totalSalesRs: 6150000,
    outstandingPayableRs: 490000,
    verifiedQuarryBadge: false
  },
  {
    id: 'SUP-405',
    name: 'Coorg Foothills Quarry Works',
    businessName: 'Brahmagiri Stone & Mineral Consortium',
    contactPerson: 'K. B. Appanna',
    phone: '+91 94802 67891',
    email: 'info@brahmagiristone.com',
    address: 'Gonikoppal Quarry Road, Virajpet',
    district: 'Kodagu',
    state: 'Karnataka',
    gstNumber: '29AAFCB1290R1ZY',
    productCategories: ['Laterite Stone', 'Hard Rock', 'Aggregate'],
    deliveryAreas: ['Kodagu', 'Mysuru', 'Wayanad', 'Kannur'],
    monthlyCapacity: '40,000 Blocks / Month',
    status: 'Pending Verification',
    documentsCount: 3,
    rating: 4.65,
    activeOrdersCount: 2,
    totalSalesRs: 980000,
    outstandingPayableRs: 120000,
    verifiedQuarryBadge: false
  }
];

export const COMMERCE_SUPPLIER_LISTINGS: SupplierProductListing[] = [
  {
    id: 'LST-101',
    supplierId: 'SUP-401',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    productId: 'prod-lat-01',
    productName: 'Standard Laterite Building Block',
    productCode: 'LAT-STD-302015',
    category: 'Laterite Stone',
    specifications: '30×20×15 cm, Grade-A Natural Quarry Pit extraction',
    dimensions: '30×20×15 cm',
    unit: 'Block',
    availableQuantity: 28000,
    minimumOrder: 500,
    priceType: 'Fixed',
    baseRate: 38.5,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore', 'Udupi'],
    dispatchTime: 'Same day if ordered before 2 PM',
    status: 'Active'
  },
  {
    id: 'LST-102',
    supplierId: 'SUP-401',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    productId: 'prod-lat-03',
    productName: 'Foundation Jumbo Laterite Block',
    productCode: 'LAT-JMB-352518',
    category: 'Laterite Stone',
    specifications: '35×25×18 cm, High density heavy foundation stone',
    dimensions: '35×25×18 cm',
    unit: 'Block',
    availableQuantity: 14000,
    minimumOrder: 300,
    priceType: 'Fixed',
    baseRate: 58.0,
    deliveryAreas: ['Kasaragod', 'Kannur', 'Mangalore'],
    dispatchTime: '24 Hours',
    status: 'Active'
  },
  {
    id: 'LST-103',
    supplierId: 'SUP-402',
    supplierName: 'Kannur Valley Wire-Cut Quarry Co.',
    productId: 'prod-lat-02',
    productName: 'Wire-Cut Architectural Laterite Block',
    productCode: 'LAT-WIR-302015',
    category: 'Laterite Stone',
    specifications: '30×20×15 cm, Diamond wire sawn, razor sharp edges',
    dimensions: '30×20×15 cm',
    unit: 'Block',
    availableQuantity: 16500,
    minimumOrder: 400,
    priceType: 'Fixed',
    baseRate: 48.0,
    deliveryAreas: ['Kannur', 'Kasaragod', 'Kozhikode', 'Wayanad'],
    dispatchTime: '24-36 Hours',
    status: 'Active'
  },
  {
    id: 'LST-104',
    supplierId: 'SUP-403',
    supplierName: 'Wayanad VSI Crusher & Sand Works',
    productId: 'prod-agg-20mm',
    productName: '20mm Crushed Blue Metal Granite Aggregate',
    productCode: 'AGG-20MM-GRN',
    category: '20mm Aggregate',
    specifications: 'IS 383:2016 Compliant, Cubical VSI washed',
    dimensions: '20mm Angular',
    unit: 'Metric Ton (MT)',
    availableQuantity: 9500,
    minimumOrder: 10,
    priceType: 'Fixed',
    baseRate: 680.0,
    deliveryAreas: ['Wayanad', 'Calicut', 'Malappuram', 'Mysuru'],
    dispatchTime: 'Instant Tipper Dispatch',
    status: 'Active'
  },
  {
    id: 'LST-105',
    supplierId: 'SUP-403',
    supplierName: 'Wayanad VSI Crusher & Sand Works',
    productId: 'prod-sand-msand',
    productName: 'VSI Washed Manufactured Sand (M-Sand)',
    productCode: 'SND-MSAND-VSI',
    category: 'M-Sand',
    specifications: 'Zone-II structural concrete sand with <5% silt',
    dimensions: '0 to 4.75 mm',
    unit: 'Metric Ton (MT)',
    availableQuantity: 6200,
    minimumOrder: 12,
    priceType: 'Fixed',
    baseRate: 720.0,
    deliveryAreas: ['Wayanad', 'Calicut', 'Kannur', 'Kasaragod'],
    dispatchTime: 'Instant Tipper Dispatch',
    status: 'Active'
  },
  {
    id: 'LST-106',
    supplierId: 'SUP-404',
    supplierName: 'Mangalore Coastal Builders Depot',
    productId: 'prod-cem-opc53',
    productName: 'OPC 53 Grade High-Strength Cement (50kg Bag)',
    productCode: 'CEM-OPC-53',
    category: 'Cement',
    specifications: 'UltraTech / ACC Grade 53 Fresh Mill Dispatch',
    dimensions: '50kg Bag',
    unit: 'Bag (50kg)',
    availableQuantity: 12000,
    minimumOrder: 100,
    priceType: 'Customer Specific',
    baseRate: 385.0,
    deliveryAreas: ['Mangalore', 'Udupi', 'Kasaragod'],
    dispatchTime: '12 Hours',
    status: 'Active'
  }
];

export const COMMERCE_SUPPLIER_QUOTES: SupplierQuote[] = [
  {
    id: 'QTE-901',
    quoteNumber: 'QTE-RZ-2026-0881',
    supplierId: 'SUP-401',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    supplierRating: 4.95,
    customerName: 'Sobha Horizon Construction Ltd',
    customerPhone: '+91 98840 91200',
    productId: 'prod-lat-01',
    productName: 'Standard Laterite Building Block',
    quantity: 2400,
    unit: 'Block',
    deliveryLocation: 'Plot 48, Beach Road, Kasaragod North',
    district: 'Kasaragod',
    requiredDate: '2026-10-02',
    unitRate: 38.5,
    materialAmount: 92400,
    deliveryCharge: 6800,
    taxAmount: 4960,
    discountAmount: 1200,
    totalAmount: 102960,
    advanceRequired: 30000,
    balanceAmount: 72960,
    estimatedDispatch: '2026-10-01 07:00 AM',
    estimatedDelivery: '2026-10-02 11:30 AM',
    quoteValidityDays: 7,
    terms: 'Includes 10-wheeler tipper haulage with gate weighbridge pass. Unloading by customer mason labour at site.',
    status: 'Accepted',
    notes: 'Grade-A pit cut with test certificate of compressive strength attached.',
    createdDate: '2026-09-22'
  },
  {
    id: 'QTE-902',
    quoteNumber: 'QTE-RZ-2026-0882',
    supplierId: 'SUP-402',
    supplierName: 'Kannur Valley Wire-Cut Quarry Co.',
    supplierRating: 4.9,
    customerName: 'Sobha Horizon Construction Ltd',
    customerPhone: '+91 98840 91200',
    productId: 'prod-lat-01',
    productName: 'Standard Laterite Building Block',
    quantity: 2400,
    unit: 'Block',
    deliveryLocation: 'Plot 48, Beach Road, Kasaragod North',
    district: 'Kasaragod',
    requiredDate: '2026-10-02',
    unitRate: 39.0,
    materialAmount: 93600,
    deliveryCharge: 8200,
    taxAmount: 5090,
    discountAmount: 0,
    totalAmount: 106890,
    advanceRequired: 35000,
    balanceAmount: 71890,
    estimatedDispatch: '2026-10-01 08:30 AM',
    estimatedDelivery: '2026-10-02 02:00 PM',
    quoteValidityDays: 5,
    terms: 'Delivery by Kannur fleet multi-axle tippers. Site unloading by customer.',
    status: 'Negotiation',
    notes: 'Can offer 2% discount if advance is paid via direct RTGS on confirmation.',
    createdDate: '2026-09-22'
  },
  {
    id: 'QTE-903',
    quoteNumber: 'QTE-RZ-2026-0883',
    supplierId: 'SUP-402',
    supplierName: 'Kannur Valley Wire-Cut Quarry Co.',
    supplierRating: 4.9,
    customerName: 'EcoVillas Coastal Developers',
    customerPhone: '+91 94471 67200',
    productId: 'prod-lat-02',
    productName: 'Wire-Cut Architectural Laterite Block',
    quantity: 1800,
    unit: 'Block',
    deliveryLocation: 'Hilltop Villa Enclave, Payyannur',
    district: 'Kannur',
    requiredDate: '2026-10-05',
    unitRate: 48.0,
    materialAmount: 86400,
    deliveryCharge: 4500,
    taxAmount: 4545,
    discountAmount: 1500,
    totalAmount: 93945,
    advanceRequired: 37500,
    balanceAmount: 56445,
    estimatedDispatch: '2026-10-04 06:00 AM',
    estimatedDelivery: '2026-10-05 09:00 AM',
    quoteValidityDays: 10,
    terms: 'Razor sharp machine wire-cut edge blocks wrapped in cardboard spacers to prevent transit corner chipping.',
    status: 'Submitted',
    notes: 'Sample block approved by lead architect in site meeting.',
    createdDate: '2026-09-21'
  },
  {
    id: 'QTE-904',
    quoteNumber: 'QTE-RZ-2026-0884',
    supplierId: 'SUP-403',
    supplierName: 'Wayanad VSI Crusher & Sand Works',
    supplierRating: 4.88,
    customerName: 'Skyline Infrastructure Consortium',
    customerPhone: '+91 97450 88210',
    productId: 'prod-agg-20mm',
    productName: '20mm Crushed Blue Metal Granite Aggregate',
    quantity: 45,
    unit: 'Metric Ton (MT)',
    deliveryLocation: 'NH 766 Bypass Construction Yard, Kalpetta',
    district: 'Wayanad',
    requiredDate: '2026-09-28',
    unitRate: 680.0,
    materialAmount: 30600,
    deliveryCharge: 3800,
    taxAmount: 1720,
    discountAmount: 500,
    totalAmount: 35620,
    advanceRequired: 15000,
    balanceAmount: 20620,
    estimatedDispatch: '2026-09-27 10:00 AM',
    estimatedDelivery: '2026-09-28 01:00 PM',
    quoteValidityDays: 3,
    terms: 'Weighbridge computerized ticket attached at crusher gate exit.',
    status: 'Submitted',
    notes: 'Available for immediate load allocation.',
    createdDate: '2026-09-23'
  }
];

export const COMMERCE_ORDERS: CommerceOrder[] = [
  {
    id: 'ORD-5001',
    orderNumber: 'ORD-RZ-2026-1042',
    customerName: 'Sobha Horizon Construction Ltd',
    customerPhone: '+91 98840 91200',
    customerAddress: 'Site 48, Beach Road, Near Light House',
    siteProjectName: 'Horizon Grand Palms Luxury Villas',
    district: 'Kasaragod',
    state: 'Kerala',
    pinCode: '671121',
    productId: 'prod-lat-01',
    productName: 'Standard Laterite Building Block',
    productCode: 'LAT-STD-302015',
    dimensions: '30 cm × 20 cm × 15 cm',
    quantity: 2400,
    unit: 'Block',
    isLaterite: true,
    supplierId: 'SUP-401',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    quoteId: 'QTE-901',
    requiredDate: '2026-10-02',
    orderDate: '2026-09-22',
    estimatedDelivery: '2026-10-02 11:30 AM',
    deliveryType: 'Direct Tipper Dump',
    vehicleRequirement: '10-Wheeler Tipper',
    siteAccessNotes: 'Wide asphalt entrance road; tipper can dump directly at plinth edge.',
    materialRate: 38.5,
    materialAmount: 92400,
    deliveryCharge: 6800,
    taxAmount: 4960,
    discountAmount: 1200,
    totalAmount: 102960,
    advancePaid: 30000,
    balanceAmount: 72960,
    paymentStatus: 'Advance Paid',
    dispatchStatus: 'Vehicle Assigned',
    assignedVehicleNumber: 'KL-14-V-8812',
    assignedDriverName: 'Babu Chacko',
    assignedDriverPhone: '+91 98472 11902',
    deliveryStatusTimeline: 'Processing at Pit #01 & Vehicle Assigned',
    status: 'Processing',
    documentsCount: 4,
    hasDispute: false,
    timeline: [
      { id: 'tm-1', date: '2026-09-22', time: '10:15 AM', actor: 'Customer', status: 'Enquiry', notes: 'RFQ submitted for 2,400 Standard Laterite Blocks.' },
      { id: 'tm-2', date: '2026-09-22', time: '11:40 AM', actor: 'Supplier', status: 'Quotation Received', notes: 'Kasaragod Concession Pit #01 offered ₹38.5/block with haulage.' },
      { id: 'tm-3', date: '2026-09-22', time: '02:20 PM', actor: 'Customer', status: 'Customer Selected', notes: 'Quote QTE-RZ-2026-0881 selected following price comparison.' },
      { id: 'tm-4', date: '2026-09-22', time: '04:00 PM', actor: 'System', status: 'Order Confirmed', notes: 'Commercial order contract generated and signed.' },
      { id: 'tm-5', date: '2026-09-22', time: '05:30 PM', actor: 'Finance Desk', status: 'Processing', notes: 'Advance payment of ₹30,000 received via RTGS.' },
      { id: 'tm-6', date: '2026-09-23', time: '08:00 AM', actor: 'Fleet Desk', status: 'Ready for Dispatch', notes: '10-Wheeler Tipper KL-14-V-8812 assigned with driver Babu Chacko.' }
    ]
  },
  {
    id: 'ORD-5002',
    orderNumber: 'ORD-RZ-2026-1038',
    customerName: 'EcoVillas Coastal Developers',
    customerPhone: '+91 94471 67200',
    customerAddress: 'Enclave Hill, Payyannur South',
    siteProjectName: 'Boutique Forest Eco Resort',
    district: 'Kannur',
    state: 'Kerala',
    pinCode: '670307',
    productId: 'prod-lat-02',
    productName: 'Wire-Cut Architectural Laterite Block',
    productCode: 'LAT-WIR-302015',
    dimensions: '30 cm × 20 cm × 15 cm',
    quantity: 1800,
    unit: 'Block',
    isLaterite: true,
    supplierId: 'SUP-402',
    supplierName: 'Kannur Valley Wire-Cut Quarry Co.',
    quoteId: 'QTE-903',
    requiredDate: '2026-09-24',
    orderDate: '2026-09-20',
    estimatedDelivery: '2026-09-24 10:00 AM',
    deliveryType: 'Unloaded Stacked',
    vehicleRequirement: '6-Wheeler Medium',
    siteAccessNotes: 'Gentle gradient driveway; manual stack offloading required.',
    materialRate: 48.0,
    materialAmount: 86400,
    deliveryCharge: 4500,
    taxAmount: 4545,
    discountAmount: 1500,
    totalAmount: 93945,
    advancePaid: 93945,
    balanceAmount: 0,
    paymentStatus: 'Fully Paid',
    dispatchStatus: 'In Transit',
    assignedVehicleNumber: 'KL-13-W-4019',
    assignedDriverName: 'M. Suresh Kumar',
    assignedDriverPhone: '+91 94475 22019',
    deliveryStatusTimeline: 'En route on NH-66 near Payyannur checkpost',
    status: 'Out for Delivery',
    documentsCount: 5,
    hasDispute: false,
    timeline: [
      { id: 'tm-10', date: '2026-09-20', time: '09:00 AM', actor: 'Customer', status: 'Order Confirmed', notes: 'Wire-cut Laterite contract confirmed.' },
      { id: 'tm-11', date: '2026-09-20', time: '01:00 PM', actor: 'Finance Desk', status: 'Processing', notes: '100% Payment settled in advance.' },
      { id: 'tm-12', date: '2026-09-22', time: '04:00 PM', actor: 'Quarry Loading', status: 'Ready for Dispatch', notes: '1,800 Wire-cut blocks stacked with foam liners.' },
      { id: 'tm-13', date: '2026-09-23', time: '05:30 AM', actor: 'Gate Pass Desk', status: 'Dispatched', notes: 'Gate pass GP-2026-441 issued. Lorry departed quarry.' },
      { id: 'tm-14', date: '2026-09-23', time: '08:45 AM', actor: 'Logistics Desk', status: 'Out for Delivery', notes: 'Driver confirmed 45 min arrival ETA at Payyannur site.' }
    ]
  },
  {
    id: 'ORD-5003',
    orderNumber: 'ORD-RZ-2026-1025',
    customerName: 'Prestige Habitat Infrastructure',
    customerPhone: '+91 98801 77312',
    customerAddress: 'Kadri Hills Plot 12, Mangalore',
    siteProjectName: 'Prestige Serenity Apartments',
    district: 'Mangalore',
    state: 'Karnataka',
    pinCode: '575004',
    productId: 'prod-agg-20mm',
    productName: '20mm Crushed Blue Metal Granite Aggregate',
    productCode: 'AGG-20MM-GRN',
    dimensions: '20mm Angular Cubical',
    quantity: 60,
    unit: 'Metric Ton (MT)',
    isLaterite: false,
    supplierId: 'SUP-403',
    supplierName: 'Wayanad VSI Crusher & Sand Works',
    requiredDate: '2026-09-18',
    orderDate: '2026-09-16',
    estimatedDelivery: '2026-09-18 04:00 PM',
    deliveryType: 'Direct Tipper Dump',
    vehicleRequirement: '14-Wheeler Multi-Axle',
    siteAccessNotes: 'Direct access to batching plant aggregate bunker.',
    materialRate: 680.0,
    materialAmount: 40800,
    deliveryCharge: 5200,
    taxAmount: 2300,
    discountAmount: 800,
    totalAmount: 47500,
    advancePaid: 47500,
    balanceAmount: 0,
    paymentStatus: 'Fully Paid',
    dispatchStatus: 'Delivered',
    assignedVehicleNumber: 'KA-19-AB-9921',
    assignedDriverName: 'Vinod Poojary',
    assignedDriverPhone: '+91 98802 44321',
    deliveryStatusTimeline: 'Delivered & Confirmed at RMC Batching Plant',
    customerConfirmedAt: '2026-09-18 05:15 PM',
    status: 'Completed',
    documentsCount: 6,
    hasDispute: false,
    timeline: [
      { id: 'tm-20', date: '2026-09-16', time: '11:00 AM', actor: 'Customer', status: 'Order Confirmed', notes: '60 MT 20mm Aggregates booked.' },
      { id: 'tm-21', date: '2026-09-17', time: '02:00 PM', actor: 'Crusher Unit', status: 'Dispatched', notes: 'Multi-Axle KA-19-AB-9921 dispatched with computerized weigh slip.' },
      { id: 'tm-22', date: '2026-09-18', time: '04:10 PM', actor: 'Driver', status: 'Delivered', notes: 'Dumped in concrete batching hopper.' },
      { id: 'tm-23', date: '2026-09-18', time: '05:15 PM', actor: 'Site Engineer', status: 'Customer Confirmed', notes: 'Signed delivery receipt. Lab sieve certificate accepted.' },
      { id: 'tm-24', date: '2026-09-19', time: '10:00 AM', actor: 'Finance System', status: 'Completed', notes: 'Escrow released to crusher unit. Order closed.' }
    ]
  },
  {
    id: 'ORD-5004',
    orderNumber: 'ORD-RZ-2026-1019',
    customerName: 'Nile Builders & Promoters',
    customerPhone: '+91 94460 33119',
    customerAddress: 'Kanhangad Bypass, Near Railway Bridge',
    siteProjectName: 'Green Crest Commercial Complex',
    district: 'Kasaragod',
    state: 'Kerala',
    pinCode: '671315',
    productId: 'prod-lat-03',
    productName: 'Foundation Jumbo Laterite Block',
    productCode: 'LAT-JMB-352518',
    dimensions: '35 cm × 25 cm × 18 cm',
    quantity: 1200,
    unit: 'Block',
    isLaterite: true,
    supplierId: 'SUP-401',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    requiredDate: '2026-09-14',
    orderDate: '2026-09-11',
    estimatedDelivery: '2026-09-14 11:00 AM',
    deliveryType: 'Direct Tipper Dump',
    vehicleRequirement: '10-Wheeler Tipper',
    siteAccessNotes: 'Site mud road requires cautious tipping.',
    materialRate: 58.0,
    materialAmount: 69600,
    deliveryCharge: 5400,
    taxAmount: 3750,
    discountAmount: 1000,
    totalAmount: 77750,
    advancePaid: 25000,
    balanceAmount: 52750,
    paymentStatus: 'Advance Paid',
    dispatchStatus: 'Delivered',
    assignedVehicleNumber: 'KL-14-T-2201',
    assignedDriverName: 'Santhosh Kumar',
    assignedDriverPhone: '+91 94472 88401',
    deliveryStatusTimeline: 'Delivered — Quality Variance Reported',
    status: 'Disputed',
    documentsCount: 4,
    hasDispute: true,
    timeline: [
      { id: 'tm-30', date: '2026-09-11', time: '03:00 PM', actor: 'Customer', status: 'Order Confirmed', notes: 'Jumbo Foundation Stone Order placed.' },
      { id: 'tm-31', date: '2026-09-14', time: '12:30 PM', actor: 'Driver', status: 'Delivered', notes: '1,200 blocks dumped at Kanhangad site.' },
      { id: 'tm-32', date: '2026-09-15', time: '09:30 AM', actor: 'Customer', status: 'Disputed', notes: 'Customer logged dispute DISP-101: 65 blocks observed fractured during tipper unload.' }
    ]
  }
];

export const COMMERCE_PAYMENTS: OrderPaymentRecord[] = [
  {
    id: 'PAY-301',
    orderId: 'ORD-5001',
    orderNumber: 'ORD-RZ-2026-1042',
    customerName: 'Sobha Horizon Construction Ltd',
    paymentType: 'Advance',
    amount: 30000,
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'HDFCR520260922881920',
    date: '2026-09-22',
    status: 'Confirmed',
    receiptNumber: 'RCPT-RZ-4011',
    notes: '30% Advance booking confirmation for 2,400 laterite blocks.'
  },
  {
    id: 'PAY-302',
    orderId: 'ORD-5002',
    orderNumber: 'ORD-RZ-2026-1038',
    customerName: 'EcoVillas Coastal Developers',
    paymentType: 'Full Payment',
    amount: 93945,
    paymentMethod: 'UPI',
    transactionReference: 'UPI/20260920/ECOVIL/4412',
    date: '2026-09-20',
    status: 'Confirmed',
    receiptNumber: 'RCPT-RZ-4008',
    notes: '100% Payment settled in advance for precision wire-cut laterite blocks.'
  },
  {
    id: 'PAY-303',
    orderId: 'ORD-5003',
    orderNumber: 'ORD-RZ-2026-1025',
    customerName: 'Prestige Habitat Infrastructure',
    paymentType: 'Full Payment',
    amount: 47500,
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'ICICIR2026091699042',
    date: '2026-09-16',
    status: 'Confirmed',
    receiptNumber: 'RCPT-RZ-3995',
    notes: 'Payment for 60 MT 20mm Blue Metal Granite Aggregates.'
  },
  {
    id: 'PAY-304',
    orderId: 'ORD-5004',
    orderNumber: 'ORD-RZ-2026-1019',
    customerName: 'Nile Builders & Promoters',
    paymentType: 'Advance',
    amount: 25000,
    paymentMethod: 'Card',
    transactionReference: 'POS-CORP-VISA-8821',
    date: '2026-09-11',
    status: 'Confirmed',
    receiptNumber: 'RCPT-RZ-3982',
    notes: 'Advance deposit on jumbo foundation stone consignment.'
  }
];

export const COMMERCE_DISPATCHES: DispatchRecord[] = [
  {
    id: 'DISP-701',
    orderId: 'ORD-5001',
    orderNumber: 'ORD-RZ-2026-1042',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    productName: 'Standard Laterite Building Block',
    quantity: 2400,
    unit: 'Block',
    vehicleNumber: 'KL-14-V-8812',
    vehicleType: '10-Wheeler Tipper (16 MT Capacity)',
    driverName: 'Babu Chacko',
    driverPhone: '+91 98472 11902',
    pickupLocation: 'Nileshwaram Pit #01 Weighbridge',
    destinationLocation: 'Beach Road, Kasaragod North',
    dispatchDate: '2026-10-01 07:00 AM',
    expectedDelivery: '2026-10-02 11:30 AM',
    gatePassNumber: 'GP-KL14-2026-904',
    loadingStatus: 'Loading in Progress',
    notes: 'Stacking first tier by hand to safeguard laterite face.',
    grossWeightTons: 38.4,
    tareWeightTons: 12.2,
    netWeightTons: 26.2
  },
  {
    id: 'DISP-702',
    orderId: 'ORD-5002',
    orderNumber: 'ORD-RZ-2026-1038',
    supplierName: 'Kannur Valley Wire-Cut Quarry Co.',
    productName: 'Wire-Cut Architectural Laterite Block',
    quantity: 1800,
    unit: 'Block',
    vehicleNumber: 'KL-13-W-4019',
    vehicleType: '6-Wheeler Medium Tipper',
    driverName: 'M. Suresh Kumar',
    driverPhone: '+91 94475 22019',
    pickupLocation: 'Sreekandapuram Mining Yard',
    destinationLocation: 'Hilltop Villa Enclave, Payyannur',
    dispatchDate: '2026-09-23 05:30 AM',
    expectedDelivery: '2026-09-23 10:00 AM',
    gatePassNumber: 'GP-KN13-2026-441',
    loadingStatus: 'Exited Quarry Gate',
    notes: 'Transit pass validated by Mineral Resources Department.',
    grossWeightTons: 24.1,
    tareWeightTons: 8.5,
    netWeightTons: 15.6
  }
];

export const COMMERCE_VEHICLES: CommerceVehicle[] = [
  {
    id: 'VEH-201',
    vehicleNumber: 'KL-14-V-8812',
    type: '10-Wheeler Heavy Tipper',
    capacityTons: 16,
    driverName: 'Babu Chacko',
    driverPhone: '+91 98472 11902',
    availability: 'Loading',
    currentTripOrderNumber: 'ORD-RZ-2026-1042',
    currentDestination: 'Kasaragod Beach Road',
    baseHub: 'Kasaragod Logistics Depot'
  },
  {
    id: 'VEH-202',
    vehicleNumber: 'KL-13-W-4019',
    type: '6-Wheeler Medium Tipper',
    capacityTons: 10,
    driverName: 'M. Suresh Kumar',
    driverPhone: '+91 94475 22019',
    availability: 'On Delivery Trip',
    currentTripOrderNumber: 'ORD-RZ-2026-1038',
    currentDestination: 'Payyannur Villa Site',
    baseHub: 'Kannur Fleet Yard'
  },
  {
    id: 'VEH-203',
    vehicleNumber: 'KA-19-AB-9921',
    type: '14-Wheeler Multi-Axle Tipper',
    capacityTons: 25,
    driverName: 'Vinod Poojary',
    driverPhone: '+91 98802 44321',
    availability: 'Available',
    baseHub: 'Mangalore Logistics Fleet Hub'
  },
  {
    id: 'VEH-204',
    vehicleNumber: 'KL-12-G-7740',
    type: '10-Wheeler Tipper',
    capacityTons: 16,
    driverName: 'Rashid K. V.',
    driverPhone: '+91 97452 88120',
    availability: 'Available',
    baseHub: 'Wayanad Crusher Depot'
  }
];

export const COMMERCE_DISPUTES: ReturnDispute[] = [
  {
    id: 'DISP-101',
    disputeNumber: 'DSP-RZ-2026-014',
    orderId: 'ORD-5004',
    orderNumber: 'ORD-RZ-2026-1019',
    customerName: 'Nile Builders & Promoters',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    issue: 'Damaged Material',
    description: 'During offloading from tipper KL-14-T-2201, 65 Jumbo Laterite Blocks suffered heavy corner cracking and fracturing due to excessive dump angle.',
    evidencePlaceholder: 'Uploaded 4 site photographs showing fractured blocks at Kanhangad yard.',
    requestedResolution: 'Replacement Dispatched',
    status: 'Supplier Response',
    openedDate: '2026-09-15',
    refundAmount: 3770
  }
];

export const COMMERCE_CUSTOMER_ACCOUNTS: CustomerCommerceAccount[] = [
  {
    id: 'CUST-101',
    customerName: 'Sobha Horizon Construction Ltd',
    contactPerson: 'Arun V. Menon (Project Director)',
    phone: '+91 98840 91200',
    email: 'amenon@sobha-horizon.com',
    address: 'Site Office, Beach Road, Kasaragod North',
    district: 'Kasaragod',
    totalOrdersCount: 14,
    totalPurchasedRs: 1845000,
    totalPaidRs: 1772040,
    outstandingBalanceRs: 72960,
    advancesHeldRs: 30000,
    refundsProcessedRs: 0,
    creditLimitRs: 250000
  },
  {
    id: 'CUST-102',
    customerName: 'EcoVillas Coastal Developers',
    contactPerson: 'Sreekanth P.',
    phone: '+91 94471 67200',
    email: 'sreekanth@ecovillas.in',
    address: 'Hilltop Villa Enclave, Payyannur',
    district: 'Kannur',
    totalOrdersCount: 9,
    totalPurchasedRs: 1220000,
    totalPaidRs: 1220000,
    outstandingBalanceRs: 0,
    advancesHeldRs: 0,
    refundsProcessedRs: 0,
    creditLimitRs: 150000
  },
  {
    id: 'CUST-103',
    customerName: 'Prestige Habitat Infrastructure',
    contactPerson: 'Rajesh Shenoy',
    phone: '+91 98801 77312',
    email: 'rshenoy@prestigeinfra.com',
    address: 'Kadri Hills, Mangalore',
    district: 'Mangalore',
    totalOrdersCount: 22,
    totalPurchasedRs: 4190000,
    totalPaidRs: 4190000,
    outstandingBalanceRs: 0,
    advancesHeldRs: 0,
    refundsProcessedRs: 0,
    creditLimitRs: 500000
  }
];

export const COMMERCE_REVIEWS: CommerceReview[] = [
  {
    id: 'REV-01',
    orderNumber: 'ORD-RZ-2026-1025',
    productId: 'prod-agg-20mm',
    productName: '20mm Crushed Blue Metal Granite Aggregate',
    supplierName: 'Wayanad VSI Crusher & Sand Works',
    customerName: 'Prestige Habitat Infrastructure',
    rating: 5,
    date: '2026-09-19',
    title: 'Flakiness index within 12%, highly uniform cubical aggregates',
    comment: 'Conducted lab sieve testing on batch arrival. Excellent quality blue metal. Fast tipper dispatch with computerized weighbridge receipts.',
    verifiedPurchase: true
  },
  {
    id: 'REV-02',
    orderNumber: 'ORD-RZ-2026-1002',
    productId: 'prod-lat-02',
    productName: 'Wire-Cut Architectural Laterite Block',
    supplierName: 'Kannur Valley Wire-Cut Quarry Co.',
    customerName: 'Malabar Heritage Resort Architects',
    rating: 5,
    date: '2026-09-10',
    title: 'Flawless 90-degree edges, zero plaster required',
    comment: 'The wire-cut laterite blocks arrived with protective cardboard dividers. Beautiful warm red tones on our villa facade.',
    verifiedPurchase: true
  },
  {
    id: 'REV-03',
    orderNumber: 'ORD-RZ-2026-0994',
    productId: 'prod-lat-01',
    productName: 'Standard Laterite Building Block',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    customerName: 'Vikas Earthworks & Builders',
    rating: 5,
    date: '2026-09-05',
    title: 'Solid mature quarry cut blocks',
    comment: 'Extremely dense stone with high crushing load resistance. Good mortar bond. Timely delivery to Nileshwaram site.',
    verifiedPurchase: true
  }
];

export const COMMERCE_DOCUMENTS: CommerceDocument[] = [
  {
    id: 'DOC-101',
    orderNumber: 'ORD-RZ-2026-1042',
    title: 'Tax Invoice INV-RZ-2026-0881',
    category: 'Tax Invoice',
    fileName: 'INV_RZ_2026_0881_Sobha_Laterite.pdf',
    fileSize: '342 KB',
    uploadedAt: '2026-09-22 04:30 PM',
    uploadedBy: 'Automated Billing Service'
  },
  {
    id: 'DOC-102',
    orderNumber: 'ORD-RZ-2026-1042',
    title: 'Kerala Mining Transit Pass (Form O-A)',
    category: 'Transit Pass',
    fileName: 'TransitPass_Kasaragod_Pit01_KL14V8812.pdf',
    fileSize: '512 KB',
    uploadedAt: '2026-09-23 07:15 AM',
    uploadedBy: 'Quarry Dispatch Supervisor'
  },
  {
    id: 'DOC-103',
    orderNumber: 'ORD-RZ-2026-1038',
    title: 'GST E-Way Bill 4410299104',
    category: 'E-Way Bill',
    fileName: 'EWayBill_EcoVillas_WireCut.pdf',
    fileSize: '280 KB',
    uploadedAt: '2026-09-22 05:00 PM',
    uploadedBy: 'Logistics Tax Portal'
  },
  {
    id: 'DOC-104',
    orderNumber: 'ORD-RZ-2026-1025',
    title: 'Computerized Weighbridge Slip',
    category: 'Weighbridge Slip',
    fileName: 'Weighbridge_KA19AB9921_60MT.pdf',
    fileSize: '190 KB',
    uploadedAt: '2026-09-17 02:15 PM',
    uploadedBy: 'Wayanad Crusher Scale Operator'
  }
];

export const COMMERCE_KPIS = {
  totalOrders: 214,
  ordersToday: 8,
  pendingQuotes: 19,
  confirmedOrders: 42,
  processing: 16,
  dispatchPending: 18,
  inTransit: 11,
  delivered: 122,
  completed: 118,
  outstandingRs: 842000,
  refundsDisputesCount: 2,
  // Financial Overview
  grossOrderValueRs: 9420000,
  paidRs: 8578000,
  supplierPayableRs: 6840000,
  deliveryChargesRs: 984000
};

export const COMMERCE_DASHBOARD_METRICS = {
  totalOrders: 214,
  activeOrders: 42,
  ordersProcessing: 16,
  ordersReadyForDispatch: 18,
  ordersInTransit: 11,
  deliveredToday: 8,
  completedOrders: 118,
  openDisputes: 2,
  totalSalesRs: 9420000,
  receivedAmountRs: 8578000,
  outstandingAmountRs: 842000,
  supplierPayoutsRs: 6840000,
  estimatedMarginRs: 1110000,
  activeSuppliers: 14,
  activeVehicles: 28,
  productsInStock: 48,
  openInquiries: 19
};

// Aliases for unified Platform 5 consumption
export type CommercePayment = OrderPaymentRecord;
export type CommerceDispatch = any;
export type CommerceDispute = any;
export type CustomerAccount = any;

export interface SupplierAccount {
  id: string;
  supplierName: string;
  gstNumber: string;
  bankDetails: string;
  settlementTerms: string;
  totalBilledRs: number;
  totalPaidRs: number;
  pendingPayableRs: number;
  lastPayoutDate: string;
  status: string;
}

export const COMMERCE_SUPPLIER_ACCOUNTS: SupplierAccount[] = [
  {
    id: 'SUP-ACC-01',
    supplierName: 'Kasaragod Laterite Concession Pit #01',
    gstNumber: '32AABCK8812K1Z4',
    bankDetails: 'SBI A/c 30988129910 (IFSC: SBIN000412)',
    settlementTerms: 'Net 7 Days on weighbridge clearance',
    totalBilledRs: 4850000,
    totalPaidRs: 4320000,
    pendingPayableRs: 530000,
    lastPayoutDate: '2026-09-21',
    status: 'Active'
  },
  {
    id: 'SUP-ACC-02',
    supplierName: 'Kannur Valley Wire-Cut Quarry Co.',
    gstNumber: '32AAECK4102P1Z8',
    bankDetails: 'Federal Bank A/c 14090288112 (IFSC: FDRL0001409)',
    settlementTerms: 'Immediate advance payout on truck dispatch',
    totalBilledRs: 2890000,
    totalPaidRs: 2750000,
    pendingPayableRs: 140000,
    lastPayoutDate: '2026-09-22',
    status: 'Active'
  },
  {
    id: 'SUP-ACC-03',
    supplierName: 'Wayanad VSI Crusher & Sand Works',
    gstNumber: '32AACCR1009Q1Z1',
    bankDetails: 'Canara Bank A/c 08911029481 (IFSC: CNRB0000891)',
    settlementTerms: '15 Days Bi-weekly batch transfer',
    totalBilledRs: 3620000,
    totalPaidRs: 3620000,
    pendingPayableRs: 0,
    lastPayoutDate: '2026-09-18',
    status: 'Active'
  }
];

