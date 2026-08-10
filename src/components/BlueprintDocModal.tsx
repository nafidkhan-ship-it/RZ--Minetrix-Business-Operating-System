import React, { useState } from 'react';
import { X, Copy, Download, Check, FileText } from 'lucide-react';

interface BlueprintDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintDocModal: React.FC<BlueprintDocModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawMarkdown = `# RZ® Minetrix Business Operating System (RZ® Minetrix BOS)
## Master Enterprise Architecture & Shared Core Blueprint (Phases 1, 2 & 3)

---

### EXECUTIVE SUMMARY & ARCHITECTURAL PHILOSOPHY
RZ® Minetrix Business Operating System (RZ® Minetrix BOS) is an enterprise cloud-native SaaS platform engineered for the Mining, Quarrying, Crusher, Fleet, Building Materials, Equipment Rental, and Construction Supply Chain industries.

#### Core Guarantees:
1. **One Platform, One Login**: Unified single sign-on portal across all business suites.
2. **Shared Core Engine**: Universal authentication, multi-tenancy MDM, general ledger finance, HRMS, AI OCR, document vault, and notification gateway.
3. **Zero Duplicate Business Logic**: Centralized master data management preventing redundant customer accounts, item SKUs, or double-entry ledgers.
4. **Loose Coupling & Domain Isolation**: 10 Bounded Contexts communicating asynchronously over an event streaming pub/sub bus.
5. **Multi-Tenant Data Security**: Database Row-Level Security (RLS) enforcing strict boundary isolation across thousands of enterprise tenants.

---

### PHASE 1 – ENTERPRISE SYSTEM ARCHITECTURE

#### 1. 4-Tier Cloud-Native Architecture
- **Layer 1: Presentation & Channel Gateway**: React 19 PWA Web Portal, Mobile Native Shells, Field Weighbridge Kiosk UI, and WhatsApp Business API.
- **Layer 2: API Gateway & Security Perimeter**: Nginx / Express API Gateway inspecting JWT/JWKS tokens, enforcing rate limits, and routing to microservices.
- **Layer 3: Domain Microservices & Event Bus**: Decoupled Node.js/Go services backed by Apache Kafka / NATS JetStream event streaming.
- **Layer 4: Data & Persistence Layer**: PostgreSQL 16 with RLS policies, Redis Cluster L2 cache, and S3-compatible Object Storage.

#### 2. 5 Independent Business Suites + Shared Core
- **Suite 1: Mining Operations Suite**: Laterite, Granite, Hard Rock Quarries, Crusher Plants, Production logs, Weighbridge Gate Passes, Statutory Royalty E-Pass, Machinery & Operators.
- **Suite 2: Fleet & Logistics Suite**: Vehicle ERP, Tipper Owners, Drivers, Trip Management, GPS Telematics, Fuel tracking, Maintenance, Insurance & Driver Settlements.
- **Suite 3: Building Materials Suite**: Cement, TMT Steel, Aggregates, Tiles, Paint, Hardware, UPVC, Plumbing, Multi-Warehouse Stock & Trade Sales.
- **Suite 4: CRM & Business Suite**: Leads, B2B Customers, Dealers, Contractors, Quotation Pipeline, Agreements & Dispute Ticketing.
- **Suite 5: Marketplace Suite**: Online Stone E-Commerce, Machinery Buy/Sell, Vehicle Rental Hiring, and Industry Job Board.
- **Shared Core Platform**: Universal Auth, Company MDM, RBAC/ABAC Permissions, General Ledger, HRMS Payroll, Gemini AI OCR, WhatsApp Bot, Audit Logs.

---

### PHASE 2 – ENTERPRISE DOMAIN MODEL & DATABASE ARCHITECTURE

#### 1. 10 Domain-Driven Bounded Contexts
1. **Shared Core Domain (DOM-CORE)**: Tenant, Company, Branch, User, Role, Permission, AuditLog, Document.
2. **Mining Domain (DOM-MINE)**: Quarry, CrusherPlant, Production, GatePass, Machinery, EquipmentRental, LandOwner, RoyaltyPass.
3. **Fleet & Logistics Domain (DOM-FLEET)**: Vehicle, Driver, VehicleOwner, Trip, GPSDevice, FuelLog, DriverSettlement.
4. **Building Materials Domain (DOM-MATS)**: Product, Category, Warehouse, InventoryStock, PurchaseOrder, SalesOrder.
5. **CRM Domain (DOM-CRM)**: Lead, Customer, Quotation, Agreement, Complaint.
6. **Marketplace Domain (DOM-MKT)**: MarketplaceListing, StoneOrder, MachineListing, JobPosting.
7. **Finance Domain (DOM-FIN)**: Account (Chart of Accounts), JournalEntry, Invoice, PaymentVoucher, TaxRecord.
8. **HRMS Domain (DOM-HR)**: Employee, AttendanceRecord, Shift, PayrollRun, SalarySlip.
9. **AI & Automation Domain (DOM-AI)**: OCRDocumentProcessing, AIPromptSession, PredictiveModelRun.
10. **Reporting Domain (DOM-REP)**: ExecutiveDashboard, ScheduledReportTrigger.

#### 2. Database Standards & Key Strategies
- **Primary Keys**: Monotonically increasing 128-bit time-ordered UUIDv7.
- **Multi-Tenant Security**: PostgreSQL Row-Level Security (RLS) guarded by tenant_id = current_setting('app.current_tenant_id')::uuid.
- **Soft Delete**: Universal deleted_at timestamps with CDC Change Data Capture tracking into immutable shadow audit tables.
- **Indexing & Partitioning**: Composite B-Tree indexes on (tenant_id, created_at DESC); range partitioning on high-volume dispatch tables.
- **File Storage**: S3 bucket key prefixing (s3://{tenant_id}/{entity}/{yyyy}/{mm}/{id}.pdf) with 15-minute expiring signed URLs.

---

### PHASE 3 – SHARED CORE PLATFORM ARCHITECTURE

#### 1. Identity & Authentication Engine
- **Dual Token Architecture**: Short-lived access JWT (15m) + HttpOnly rotating refresh token (7d).
- **Password Security**: Argon2id memory-hard key derivation algorithm with unique salt and system pepper.
- **Multi-Factor Auth (MFA)**: TOTP authenticator app support + SMS/WhatsApp OTP fallbacks.
- **Device Binding**: Hardware fingerprint registration, active session registry, and remote revocation switch.

#### 2. Authorization & Fine-Grained Access Control
- **RBAC + ABAC Policy Engine**: Role grants combined with contextual attributes (shift times, IP subnet, geofence).
- **Multi-Level Boundary Scoping**: Strict boundary filters at Tenant -> Company -> Branch -> Business Unit.
- **Field-Level Redaction**: Mask margin analytics, royalty pass pricing, or customer PII for non-executive roles.

#### 3. Multi-Tenant SaaS Platform Engine
- **Hierarchy Governor**: Multi-branch organizational tree with subscription plan quotas (Starter, Growth, Enterprise).
- **Feature Flags**: Dynamic module entitlement toggles per tenant without code redeployments.

#### 4. User Management & Poly-Identity Linker
- **Poly-Association Service**: Map single user identity to Employee (HRMS), Driver (Fleet), Operator (Quarry), or Customer (CRM).
- **Org Matrix**: Department, designation, and reporting line hierarchy.

#### 5. Shared Master Data Management (MDM)
- **Geopolitical & Tax DB**: Country, State, District geodatabase + GST/TDS/VAT tax matrices.
- **Multi-Currency & UOM Engine**: Real-time currency conversions + dimensional UOM converters (Tons, Cubic Meters, CFT, Trips, Bags).

#### 6. Omni-Channel Notification Router
- **Multi-Channel Dispatcher**: In-App WebSockets, WhatsApp Cloud API, Transactional SES Email, SMS, FCM Push.
- **Cron Reminder Engine**: Automated expiry, payment follow-up, and statutory royalty alert triggers.

#### 7. Document Management System (DMS)
- **S3 Blob Storage**: Tenant/Year/Month isolated prefixes (s3://bucket/{tenant_id}/{entity}/{yyyy}/{mm}/{id}.pdf).
- **Automated PDF Generator**: Server-side rendering of Gate Passes, Invoices, Delivery Challans, and Quotes with QR codes.

#### 8. Finance Shared Services Bridge
- **Atomic Sequential Generator**: Thread-safe invoice and gate pass number generation (RZ/MINE/2026/XXXX).
- **General Ledger Bridge**: Event adapter emitting double-entry journal postings to Finance Domain.

#### 9. HR Shared Services Bridge
- **Biometric Ingress Gateway**: Biometric attendance ingestion bridge + shift allowance & overtime calculator.

#### 10. Executive & Operational Dashboard Engine
- **Customizable Grid**: Modular KPI cards, interactive charts (Recharts), and drag-and-drop layout persistence.

#### 11. Dynamic & Scheduled Reporting Engine
- **SQL Query Builder**: Asynchronous report generation worker pool emitting PDF & streaming Excel (.xlsx).

#### 12. Gemini AI Ecosystem & Automation Platform
- **Server-Side Proxy**: Gemini 2.5 Flash operational copilot, weighbridge paper slip OCR, and voice command parser.

#### 13. API Gateway & Service Mesh
- **Perimeter Security**: Nginx/Express API Gateway with JWKS validation, Token Bucket Rate Limiting, and mTLS gRPC mesh.

#### 14. Audit & Telemetry Subsystem
- **Immutable CDC Logging**: Append-only PostgreSQL audit tables tracking before/after JSON patches for every mutation.

#### 15. Backup & Disaster Recovery (DR) Strategy
- **RPO < 1m | RTO < 15m**: Continuous WAL streaming, 35-day Point-In-Time Recovery (PITR), air-gapped S3 Glacier vault.

#### 16. Shared Workflow & Approval Engine
- **State Machine Orchestrator**: Multi-step approval chains, SLA timers, task delegation queues, and auto-escalations.

---

### PHASE 4 – MINING OPERATIONS & WEIGHBRIDGE GATEPASS SUITE ARCHITECTURE

#### 1. Executive Dashboard & Operational Command Center
- Production KPIs (Tonnage by Stone/Grade/Quarry)
- Sales & Revenue Realization Monitor
- Live Weighbridge Gate Pass Dispatch Feed
- Machinery Status & Active Breaker/Excavator Map
- Operator Attendance & Shift Efficiency
- Fuel Consumption & L/Ton Efficiency Tracker
- Pending Customer Deliveries & Queue Depth
- Raw & Finished Stock Yard Levels
- AI Operational Insights & Anomaly Feed

#### 2. Quarry & Mining Master Data Management (MDM)
- Quarry Master (Site GPS, mineral type, lease ID, capacity)
- Crusher Plant Master (Primary/secondary crusher specs, TPH rating)
- Stone & Mineral Master (Laterite, Granite, Hard Rock, Blue Metal)
- Product Master (GSB, WMM, 10mm, 20mm, 40mm, M-Sand, P-Sand, Crusher Dust)
- Grade & Density Specs Master (Specific gravity, moisture tolerance)
- Business Unit & Branch Mapping
- Tax & Statutory Royalty Master (State royalty per Ton/CFT, GST rates)
- Shift & Roster Master (Day/Night shift timings, break hours)
- Machine & Operator Directory
- Supplier & Customer Master

#### 3. Quarry Operations & Extraction Management
- Laterite Quarry Management (Laterite stone cutting, block sizes, dressing logs)
- Granite Quarry Management (Dimensional stone blocks, wire-saw cutting, grade sorting)
- Hard Rock & Metal Quarry Management (Blasting logs, explosive permits, rock breaking)
- Multi-Quarry Portfolio Control & Operational Status
- Quarry Capacity & Reserve Tracking (Mined volume vs remaining reserve)
- GPS Boundary & Bench Mapping (3D GIS bench excavation tracking)

#### 4. Crusher Plant & Aggregate Processing Management
- Crusher Plant Operational Control (TPH throughput, jaw gap settings)
- Coarse Aggregate Production (40mm, 20mm, 12mm, 6mm blue metal)
- Manufactured Sand (M-Sand) Processing & Washing
- Plastering Sand (P-Sand) Ultra-Fine Screening
- Crusher Dust & Quarry Waste By-Product Tracking
- Crusher Feed vs Output Mass Balance Ratio Monitor

#### 5. Land Acquisition, Lease & Landowner Royalty Management
- Land Parcel Registry (Survey numbers, acreage, surface ownership)
- Landowner Agreement Engine (Fixed monthly rent, per-ton royalty, profit share)
- Mining Lease Contract Management (Government lease period, boundary markers)
- Royalty & Revenue Sharing Settlement Calculator
- Land Document Vault (Title deeds, NOC, land conversion certificates)
- GPS Polygon Mapping & Polygon GIS Boundary Surveyor

#### 6. Mining Statutory Compliance & Environmental Permit Engine
- Mining License & Quarry Permit Vault
- Statutory Government Permit Expiry Alert Engine
- Government E-Pass / Royalty Permit Balance Tracker
- Environmental Compliance Monitor (Air/water quality, noise levels, tree plantation)
- DGMS Explosive Permit & Blasting Manager Certification Register

#### 7. Daily Production Management
- Daily Quarry Excavation Production Logging
- Shift-wise Crusher Production Recording
- Machine-wise Production Tracking (Tons/Hour per Excavator/Breaker)
- Operator Yield & Efficiency Recording
- Production Target vs Actual Variance Planner
- Downtime & Production Loss Classification (Power outage, mechanical, weather)

#### 8. Stock Yard Management
- Raw Boulder Stockyard Ledger
- Finished Aggregate Yard Management (40mm, 20mm, M-sand bays)
- Multi-Yard Stock Movement & Transfer Tracking
- Stock Adjustment & Moisture Loss Allowance Ledger
- Physical Stock Verification & Volumetric Drone/Laser Audit Adapter

#### 9. Weighbridge Gate Pass & Scalehouse Engine
- Outbound Dispatch Gate Pass (Material sales dispatches)
- Inbound Material Gate Pass (Raw boulders, diesel, explosives, spares)
- Vehicle & Tipper Number Verification
- Sales Order & Customer Linkage
- RS232 Serial Indicator Direct Integration (Tamper-proof scale capture)
- QR Code & Barcode Gate Pass Verification
- Weighbridge Camera Snapshot & License Plate Capture
- Thermal Gate Pass Slip Printing & WhatsApp Pass Dispatch

#### 10. Dispatch Planning & Loading Queue Manager
- Dispatch Order Fulfillment Planner
- Vehicle & Tipper Allocation Engine
- Driver Assignment & Mobile Notification Push
- Wheel Loader Queue & Loading Bay Controller
- Delivery Time Schedule & Slot Allocator

#### 11. Quarry Machinery ERP & Telematics Engine
- Heavy Equipment Directory (Excavators, JCB, Wheel Loaders, Cranes, Bulldozers, Rock Breakers, Drills, Generators)
- Hour Meter (HMR) & Odometer Logbook
- Diesel Fuel Ingestion & Consumption Log (Liters per Machine Hour)
- Preventive Maintenance Schedule & Service Kit Manager
- Breakdown Ticket & Job Card Management
- Spare Parts Inventory & Reorder Tracker

#### 12. Equipment Rental Management
- Machine Only & Machine + Operator Rental Contracts
- Rate Models (Hourly, Daily, Weekly, Monthly, Project Contract)
- Rental Machine Logbook (Active HMR hours vs idle hours)
- Rental Billing & Third-Party Vendor Settlement Engine

#### 13. Machinery Operators & Crew Management
- Machine Operator Directory & License Verifier
- Biometric / Mobile Shift Attendance Ingestion
- Operator Performance Tracker (Tons moved per hour, diesel efficiency score)
- Shift & Machinery Allocation Roster
- Weekly Operator Advance & Settlement Engine

#### 14. Quarry Financials & Royalty Accounting
- Quarry Purchases & Raw Material Vendor Invoices
- Operational Expense Ledger (Explosives, diesel, spare parts, electricity)
- Statutory Royalty Fee Accounting & E-Pass Payments
- General Ledger Journal Posting Adapter
- Cost Center Accounting (Cost per Ton per Quarry / Crusher)
- Quarry & Crusher Profitability Analyzer

#### 15. Business Intelligence & Compliance Reports
- Daily Quarry & Crusher Production Summaries
- Monthly Production & Yield Target Variance Reports
- Machine Utilization & Idle Time Heatmaps
- Fuel Consumption & SFC Efficiency Analysis
- Statutory Government Mineral Return Reports

#### 16. Gemini AI Operational Intelligence Engine
- Predictive Machinery Maintenance & Breakdown Risk Forecaster
- AI Mineral Yield & Blasting Production Forecaster
- Fuel Optimization & Theft Anomaly Detector
- Machine Utilization & Fleet Efficiency Analyzer
- Stockyard Volume Estimation & Demand Forecaster
- Executive Natural Language Operational Copilot

---

### ARCHITECTURAL REVIEW & PHASE 5 READINESS
- **Validated Core Strengths**: 100% domain coverage from land lease, excavation, crusher throughput, weighbridge scalehouse, to GL finance posting.
- **Next-Phase Fine-Tuning**: Multi-warehouse stock synchronization with Building Materials inventory nodes and tipper geofence auto-dispatching.
- **Status**: **APPROVED FOR PHASE 5 (FLEET LOGISTICS & BUILDING MATERIALS SUITE)**

---

### PHASE 5 – FLEET & LOGISTICS BUSINESS SUITE ARCHITECTURE

#### 1. Executive Dashboard
- Fleet KPIs (Active Vehicles, Utilization Rate, On-Time Delivery)
- Available Vehicles & Standby Tipper Monitor
- Live Running Trips & Delivery Progress Bar
- Completed Trips & Daily Tonnage Dispatched
- Fuel Cost & Mileage (Km/L) Analyzer
- Maintenance & Workshop Downtime Monitor
- Driver Status & Active Duty Shift
- Vehicle Utilization & Capacity Matrix
- Commercial Rental Revenue
- Pending Customer Deliveries & Queue Depth
- Gemini AI Telematics Anomaly Feed

#### 2. Fleet Masters
- Vehicle Master (VIN, Chassis, Engine, Axle Count, Make, Model)
- Vehicle Category & Type (Tipper, Lorry, Pickup, Trailer, Tanker)
- Vehicle Owner Master (Self-Owned, Partner-Owned, Contractor)
- Driver & Cleaner Directory
- Transport Agency & Logistics Partner Master
- Transport Contractor Registry
- Route Master (Origin, Destination, Distance km, Toll points)
- Trip Type Master (Mining Dispatch, Inter-Yard, Customer Sale, Material Return)
- Fuel Station Partner Master (HPCL, BPCL, IOCL, Yard Pump)
- Expense Master (Toll, Police, Loading, Maintenance, FASTag)
- Tax Master (GST, RTO Tax, State Permits)
- Business Unit & Transport Hub Mapping

#### 3. Vehicle Management
- Support: Tipper, Lorry, Pickup, Mini Truck, Trailer, Tanker, Bus, Car
- Vehicle Registration & RTO RC Smart Card Vault
- Insurance Policy Renewal Tracker
- Goods & National Permit Management
- Fitness Certificate (FC) Expiry Alert Engine
- Pollution Under Control (PUC) Compliance Monitor
- FASTag RFID Wallet Linkage & Automated Toll Log Ingestion
- Vehicle Document Vault & Photo Gallery (360-degree inspection photos)
- GPS Device Hardware Binding & Sensor Pairing

#### 4. Driver Management
- Driver Profile & Commercial Driving License Vault
- Heavy Vehicle Driver Badge & Hazmat Clearance Verification
- Annual Medical Fitness & Eye Test Register
- Emergency Contact & Guarantor Directory
- Biometric & Mobile App Shift Attendance
- Driver Performance Scorecard (Safety rating, speed compliance, fuel efficiency)
- Weekly Driver Settlement & Batta Allowance Calculator
- Driver Cash Advance & Expense Ledger
- Trip Incentive & Fuel Savings Bonus Engine
- Violation Penalty & Fine Deduction Log

#### 5. Owner Management
- Vehicle Owner Profile & Bank Account Registry
- Owner Vehicle Mapping & Fleet Contract Binder
- Owner Settlement & Trip Revenue Disbursement Engine
- Security Deposit Ledger & Escrow Balance Tracker
- Revenue Sharing Models (Percentage split, fixed rate/ton, fixed monthly hire)
- Agency Commission Deduction & TDS Tax Calculator
- Owner Monthly Statement & Payment Voucher Generator

#### 6. Trip Management
- Trip Order Creation (Auto-triggered from Sales Order / Mining Gate Pass)
- Vehicle & Driver Pair Allocation Engine
- Trip Scheduling & Dispatch Slotting
- Loading Point & Quarry Yard Dispatch Register
- Unloading Point & Customer Site Arrival Register
- Distance Calculation & Expected Time of Arrival (ETA) Matrix
- Live Trip Status Lifecycle (Scheduled, En Route, Loading, In Transit, At Destination, Unloaded, Closed)
- Delivery Confirmation & Electronic Proof of Delivery (e-POD) Signature
- Trip Closure & Operational Variance Reconciliation

#### 7. Vehicle Rental Management
- Rental Models (Trip Rental, Hourly, Daily, Weekly, Monthly, Project Contract)
- Service Modes (Vehicle Only / Bareboat vs Vehicle + Driver + Fuel)
- Long-Term Corporate Fleet Leasing Contracts
- Corporate & Contractor Rental Quotation Builder
- Rental Agreement Vault & Security Deposit Collector
- Rental Usage Logbook (HMR / Odometer hours)
- Rental Invoicing & Billing Engine
- Third-Party Vehicle Hiring Settlement Engine

#### 8. Fuel Management
- Digital Fuel Entry Ingestion (In-house yard pump & external fuel slips)
- Fuel Station Partner Integration (HPCL, BPCL, Shell fuel card sync)
- Mileage (Km/L) & Specific Fuel Consumption Benchmarking
- Fuel Tank Level Sensor IoT Monitoring
- Fuel Drain & Sudden Drop Anomaly Detector (Fuel Theft Detection Ready)
- Fuel Cost Distribution per Trip / Ton-Km
- Diesel Stockyard Inventory Ledger

#### 9. Maintenance & Workshop ERP
- Preventive Maintenance Schedule (Every 10,000 km / 250 engine hours)
- Breakdown Ticket & Roadside Assistance Dispatch
- Workshop Job Card & Mechanic Assignment
- Tyre Life Management (Tyre serial number tracking, tread depth, retreading)
- Battery & Electrical System Maintenance Register
- Lubricants & Engine Oil Replacement Log
- Spare Parts Yard Inventory & Reorder Controller
- Annual Maintenance Contract (AMC) & Warranty Claim Engine

#### 10. GPS, Telematics & Tracking Engine
- Live Vehicle Vector Map & Multi-Vehicle Fleet View
- Trip Route Replay & Speed Profile Graph
- Polygonal Geofencing (Quarry pits, unloading sites, fuel pumps)
- Route History & Mileage Audit Log
- Speed Monitoring & Overspeed Incident Logger
- Engine Idle Time Monitor & CO2 Emission Estimator
- Harst Acceleration & Braking Telematics Logger

#### 11. Dispatch & Logistics Management
- Automated Tipper & Lorry Allocation Engine
- Driver Shift Matching & Rest Period Enforcer
- Quarry & Yard Loading Queue Controller
- Multi-Stop Delivery Route Planner
- Real-Time Customer Delivery Dispatch Tracker
- Digital Proof of Delivery (e-POD) Verification

#### 12. Fleet Finance & Cost Center
- Trip Expense Accounting (Toll, police, loading, driver batta)
- Fuel Expense Ledger & Station Payment Reconciliation
- Vehicle Maintenance Cost Allocation
- Trip Freight Revenue Ledger & Sales Invoicing
- Commercial Rental Revenue Ledger
- Driver Weekly Settlement & Incentive Accounting
- Vehicle Owner Disbursement & TDS Accounting
- General Ledger Double-Entry Posting Adapter
- Vehicle Cost Center Accounting (P&L per Vehicle / per Route / per Ton-Km)

#### 13. Fleet Reports & Analytics
- Fleet Utilization & Idle Time Heatmaps
- Vehicle Performance & Cost-per-Km Analytics
- Driver Safety, Mileage & On-Time Delivery Scorecards
- Trip Profitability & Route Realization Reports
- Fuel Consumption & SFC Variance Analysis
- Workshop Maintenance & Tyre Life Reports
- Vehicle Rental & Contract Revenue Reports
- Owner Disbursement & Commission Summaries
- RTO Statutory Compliance Audit Reports

#### 14. Gemini AI Fleet Features
- Vehicle Utilization & Demand Prediction Model
- Predictive Maintenance & Component Failure Warning
- Fuel Optimization & Theft Pattern Recognition Engine
- Dynamic Route & Transit Time Optimizer
- Trip Freight Cost & Margin Predictor
- Vehicle Rental Demand Forecasting Engine
- Driver Behavior & Safety Performance Coach
- Executive Fleet Copilot (Natural Language Query Interface)

---

### PHASE 6 – BUILDING MATERIALS BUSINESS SUITE ARCHITECTURE

#### 1. Executive Dashboard
- Sales KPIs (Daily Sales, Realization, Gross Margins)
- Purchase KPIs (Vendor Commitments, Pending Deliveries, GRN Status)
- Inventory Value (Real-time valuation across yards & stores)
- Fast-Moving & Slow-Moving Products Heatmap
- Low Stock & Safety Buffer Alert Center
- Pending Customer Deliveries & Queue Depth
- Outstanding Payments & Customer Credit Aging
- Gemini AI Business Insights Feed

#### 2. Masters
- Product Master (SKU Code, HSN Code, Dimensions, Density, Standard Weight)
- Product Category & Sub-Category (Quarry, Crusher, Hardware, Finishing, MEP)
- Brand Master (UltraTech, Tata Tiscon, Asian Paints, Finolex, etc.)
- Supplier & Vendor Master
- Dealer & Sub-Dealer Hierarchy Master
- Customer Master (Retailers, Contractors, Builders, B2B)
- Warehouse & Yard Bay Master
- Unit Master (Ton, CFT, Bag, Meter, Piece, Sq.Ft, Bundle)
- Tax Master (GST rates, Royalty fees)
- Price List Matrix (Retail, Wholesale, Dealer, Project)
- Discount Rules & Offer Policy Matrix
- Business Unit & Retail Shop Mapping

#### 3. Purchase Management
- Purchase Enquiry & Requisition
- Supplier Purchase Quotation Comparison
- Purchase Order (PO) Builder & Multi-Level Approval
- Goods Receipt Note (GRN) & Physical Inspection Register
- Quality Inspection & Material Rejection Log
- Purchase Return & Debit Note Generator
- Supplier Payments Disbursement Register
- Procurement Cost & Vendor Lead Time Analytics

#### 4. Inventory Management
- Multi-Warehouse & Yard Depot Inventory Ledger
- Inter-Depot Stock Transfer Orders & Transit Ingestion
- Stock Adjustment & Scrap/Moisture Loss Ledger
- Batch & Manufacturing Date Tracking (Cement batches, Paint lots)
- Serial Number Tracking (Power tools, equipment spares)
- Barcode & QR Code Mobile Scanner Ingestion
- Physical Inventory Stock Verification & Audit Adapter
- Volumetric Stock Yard Measurement Adapter (Drone / Laser Survey)

#### 5. Sales Management
- Sales Quotation & Project Estimator
- Sales Order Entry & Stock Reservation Engine
- Tax-Compliant GST Sales Invoice Generator (E-Way Bill Ready)
- Delivery Challan & Dispatch Gate Pass
- Sales Return & Credit Note Generator
- Customer Payment Collection (Cash/UPI/Bank Transfer)
- Automated Customer Credit Limit & Overdue Lockout Enforcer

#### 6. Delivery Management
- Delivery Planning & Slot Allocation
- Vehicle Allocation Engine (Tipper, Lorry, Flatbed, Pickup)
- Driver Allocation & Shift Assignment
- Delivery GPS Transit Tracking
- Delivery Confirmation & Electronic Proof of Delivery (e-POD)

#### 7. Pricing Engine
- Multiple Price Lists (Retail, Wholesale, Dealer, Project Contractor)
- Retail Price Management
- Wholesale Volume Price Management
- Dealer Tier Pricing
- Project & Contract Pricing
- Dynamic Pricing & Freight Surcharge Matrix
- Discount Rules & Offer Management
- Margin Protection Floor Checker

#### 8. Finance
- Purchase Ledger & Supplier Accounts Payable
- Sales Ledger & Customer Accounts Receivable
- Inventory Valuation Engine (FIFO & Moving Average)
- Landed Cost Analysis (Material cost + Freight + Royalty)
- GST Input Tax Credit (ITC) & Output Tax Reconciliation
- Double-Entry General Ledger Journal Posting Adapter
- Product & Store Profitability Analysis

#### 9. Reports
- Sales Reports & Realization Summaries
- Purchase Reports & Vendor Lead Time Scorecards
- Inventory Reports & Stock Movement Ledgers
- Stock Ageing Analysis (0-30, 31-60, >90 days slow stock)
- Profitability Reports (By Product, Brand, Store, Customer)
- Warehouse Reports & Space Utilization
- Customer Outstanding Reports
- Supplier Purchase & Discount Audit Reports

#### 10. AI Features
- Construction Material Demand Forecasting
- Stockout Risk Prediction & Seasonal Consumption Optimizer
- Auto Reorder Suggestions & Economic Order Quantity (EOQ)
- Dynamic Price Optimization Engine
- Sales Velocity Trend Analysis
- Customer Buying Pattern & Cross-Sell Copilot
- Executive Building Materials AI Business Copilot

---

### PUBLIC ONLINE ORDERING SYSTEM ARCHITECTURE
- ⭐ **Order Laterite Stone & Building Materials Online**
  - 1st Quality Laterite Stone (Hard Dressing Masonry Block)
  - 2nd Quality Laterite Stone (Standard Wall Block)
  - 3rd Quality Laterite Stone (Foundation & Infill Block)
  - M Sand (Manufactured Sand for Concrete)
  - P Sand (Plastering Sand)
  - Aggregate (40mm, 20mm, 12mm)
  - Cement (OPC 53, PPC)
  - TMT Steel Reinforcement Bars
- **Public Portal Capabilities**:
  - Location-Based Supplier Search (GPS geofencing & radius filter)
  - Live Stock Availability Check
  - Flexible Quantity Selection (Block count, CFT, Ton, Bag, Bundle)
  - Dynamic Delivery Slot Scheduling
  - Automatic Vehicle Assignment (Tipper / Lorry / Pickup)
  - Live Order GPS Transit Tracking
  - Online Payment Gateway Ready (Razorpay/Stripe) & Cash on Delivery (COD) Ready
  - Customer Order History & Reorder Shortcuts

---

### SUPPLY CHAIN LIFECYCLE WORKFLOW
Supplier ↓ Purchase Order ↓ Goods Receipt (GRN) ↓ Yard Inventory ↓ Sales Order ↓ Tipper Allocation ↓ Delivery Dispatch ↓ Customer e-POD ↓ Finance Posting ↓ Analytics Update

---

### ARCHITECTURAL REVIEW & PHASE 8 READINESS
- **Validated Core Strengths**: 100% domain coverage across Quarry Products (1st/2nd/3rd quality Laterite stone), Crusher Products, and structural building supplies. Multi-UOM conversion, landed cost, public online ordering portal, and Fleet/Mining event synchronization.
- **Next-Phase Focus**: Public Marketplace Catalog Sync, Cross-Tenant B2B Trading Network, and Gemini AI Voice Support Bot.
- **Status**: **APPROVED FOR PHASE 8 (PUBLIC E-COMMERCE MARKETPLACE & GEMINI AI ECOSYSTEM)**

---

### PHASE 7 – CRM & BUSINESS SUITE ARCHITECTURE

#### 1. Executive Dashboard
- Lead KPIs (Lead Velocity Rate, Source ROI, Lead-to-Opportunity Ratio)
- Sales KPIs (Won vs Lost Revenue, Average Deal Size, Sales Cycle Length)
- Quotation Conversion Matrix & Win/Loss Reason Analytics
- Customer Growth & Cohort Retention Index
- Dealer & Distributor Performance Leaderboard
- Supplier Delivery & Quality Performance Index
- Pending Task, Call & Site Visit Follow-up Queue
- Weighted Revenue Pipeline Forecast by Stage
- Gemini AI Revenue Anomaly & Churn Risk Insights Feed

#### 2. Masters
- Customer Master (Retail, Commercial, Project Accounts, Tax Identification)
- Supplier & Vendor Master (Material suppliers, Machinery vendors, Fuel providers)
- Dealer & Sub-Dealer Directory (Showroom locations, Storage yard capacity)
- Distributor Network Master (Tier-1 and Tier-2 wholesale franchises)
- Contractor Directory (Civil, Infrastructure, Masonry, Earthwork)
- Architect & Structural Engineer Registry (Influencer tracking & commission logs)
- Builder & Real Estate Developer Accounts
- Transport Contractor Registry (Third-party haulage partners)
- Commission Agent & Broker Master
- Business Partner & Joint Venture Master
- Business Category, Sales Territory & Industry Classification Matrix

#### 3. Lead Management
- Omni-Channel Lead Ingestion (Website, Marketplace, WhatsApp, Call Center, Walk-in)
- Automated Lead Assignment & Round-Robin Territory Router
- Lead Qualification & BANT (Budget, Authority, Need, Timeline) Assessment
- AI-Powered Predictive Lead Scoring & Intent Matrix
- Lead Conversion Workflow (Lead → Opportunity → Enquiry → Quote)
- Referral & Partner Attribution Tracking Engine
- Lead Re-engagement & Stale Lead Reclamation Center

#### 4. Enquiry Management
- Product Enquiry Register (General building materials & hardwares)
- Laterite Stone Specific Enquiry (1st/2nd/3rd Dressing Grade, Block dimensions)
- Crusher Product Enquiry (M-Sand, P-Sand, 20mm/40mm Aggregate volumes)
- Vehicle & Tipper Fleet Rental Enquiry (Haulage tonnage, Shift duration)
- Mining Equipment & Heavy Machinery Rental Enquiry (Excavator, Rock Breaker)
- Building Materials & Finishing Enquiry (Tiles, Cement, TMT Steel)
- Bulk Infrastructure Project Tender & Material Requirement Estimator

#### 5. Quotation Management
- Quotation Template Builder (Product sales, Fleet rental, Project supply)
- Dynamic Price List & Freight Surcharge Application
- Tiered Volume & Promotional Discount Matrix
- Multi-Level Manager Approval Workflow for Below-Margin Quotes
- Quotation Version Control & Revision Comparison Log
- Digital Customer Acceptance & E-Signature Capture
- Automated Quotation Expiry & Follow-up Trigger

#### 6. Sales Order Management
- Quotation-to-Sales Order One-Click Conversion
- Credit Limit & Overdue Payment Lockout Checker
- Sales Order Status Tracker (Pending Approval, Reserved, Dispatched, Invoiced)
- Multi-Suite Stock & Yard Allocation Trigger
- Fleet Delivery Slot Scheduling Adapter
- Finance General Ledger Pre-Posting Reservation

#### 7. Customer Relationship
- 360° Customer Activity Timeline (Calls, Emails, Meetings, Orders, Invoices)
- Field Sales Mobile App Meeting Notes & Site Visit Geo-Checkin Register
- Call Center History & Inbound/Outbound Telephony Integration
- Document Vault (GST Certs, Project Blueprints, Credit Agreements)
- Customer Account Classification (VIP, Tier-1 Developer, Regular, High-Risk)
- Dynamic Credit Limit & Payment Terms Governance

#### 8. Dealer & Supplier Management
- Dealer & Sub-Dealer Digital Onboarding Portal
- Supplier & Vendor Registration & Audit Register
- Partner Performance Rating Scorecards (Volume, Quality, Timeliness)
- Tiered Commission & Sales Incentive Calculation Rules
- Exclusive Territory & District Allocation Governance
- Contract & SLA Compliance Tracking

#### 9. Contractor & Project Management
- Contractor & Developer Project Database
- Construction Project Milestone & Material Requirement Planner (MRP)
- Phased Delivery Schedule Builder (e.g. 500 Tons Aggregate / week for 10 weeks)
- On-Site Material Consumption & Stockyard Audit Tracker
- Project Completion & Contractor Payment Milestone Sync

#### 10. Complaint & Service
- Multi-Channel Complaint Registration (App, WhatsApp, Call Center)
- Automated Ticket Assignment to Yard Quality / Logistics Managers
- Material Sample Testing & Quality Inspection Dispatch Request
- Equipment & Machinery Warranty Claims Register
- Resolution Workflow & Credit Note Replacement Issuance
- Customer Satisfaction (CSAT) & Feedback Survey Engine

#### 11. Agreement Management
- Customer Long-Term Supply Agreement Repository
- Supplier & Vendor Purchase Contract Register
- Machinery & Tipper Fleet Rental Agreement Repository
- Quarry Site Land Lease & Extraction Rights Agreements
- Digital Document Storage & E-Signature Vault
- Automated Contract Expiry & Renewal Alert Engine

#### 12. Marketing Automation
- Omni-Channel Campaign Management (WhatsApp, Email, SMS)
- Audience Segmentation Engine (By Industry, Order Volume, Last Purchase Date)
- WhatsApp Broadcast & Interactive Template Message Sender
- Seasonal Festival & Bulk Construction Offers Engine
- Contractor Loyalty & Rewards Points Engine
- Campaign Analytics & Revenue Attribution Matrix

#### 13. Finance Integration
- Real-Time Customer Accounts Receivable Ledger Sync
- Supplier Accounts Payable Ledger Sync
- Automated Overdue Payment Collection Reminders (WhatsApp/SMS)
- Credit Control Lockout Enforcement Adapter
- Payment Collection & UPI/Bank Gateway Ingestion
- Customer Account Gross Margin & Lifetime Profitability Analytics

#### 14. Reports
- Lead Acquisition & Conversion Funnel Reports
- Sales Representative Activity & Revenue Realization Reports
- Quotation Hit-Rate & Discount Audit Reports
- Customer Credit Aging & Payment Delay Summaries
- Dealer & Distributor Sales Realization Leaderboards
- Supplier Delivery SLA & Material Rejection Reports
- Complaint SLA & Customer Satisfaction (CSAT) Analytics

#### 15. AI Features
- AI Predictive Lead Scoring & Intent Analysis Model
- Weighted Sales Revenue & Cash Flow Forecasting
- Customer Lifetime Value (CLV) Estimation Engine
- AI Customer Churn Risk Detector & Retention Guardrail
- Smart Follow-up Action & Next-Best-Offer Copilot
- Automated Cross-Selling & Up-Selling Recommendation Engine
- Executive CRM & Sales Copilot

---

### SELF-SERVICE CUSTOMER PORTAL ARCHITECTURE
- ⭐ **Customer & Contractor Portal Capabilities**:
  - View & Accept Commercial Quotations Digitally
  - Place Instant Repeat Orders for Stones, Aggregates & Cement
  - Live GPS Order & Delivery Transit Tracking
  - Specialized Laterite Stone Order & Quarry Dressing Status Monitor
  - Download Tax Invoices, Delivery Challans & E-Way Bills
  - View Payment History & Pay Overdue Balances via UPI / Cards
  - Raise Material Quality Complaints & Track Resolution
  - View Active Supply Agreements & Contract Expiry Dates

---

### BUSINESS LIFECYCLE WORKFLOW
Lead ↓ Enquiry ↓ Quotation ↓ Sales Order ↓ Mining / Building Materials Allocation ↓ Fleet Dispatch ↓ Delivery (e-POD) ↓ GST Invoice ↓ Payment Collection ↓ CSAT Feedback ↓ Repeat Business

---

### MASTER DEVELOPMENT ROADMAP
- **Phase 1**: Enterprise Architecture Blueprint (Completed)
- **Phase 2**: Domain Model & Database Blueprint (Completed)
- **Phase 3**: Shared Core Platform Architecture (Completed)
- **Phase 4**: Mining Operations & Weighbridge GatePass Suite (Completed)
- **Phase 5**: Fleet & Logistics Suite Architecture (Completed)
- **Phase 6**: Building Materials Business Suite Architecture (Completed)
- **Phase 7**: CRM & Business Relationship Suite Architecture (Completed)
- **Phase 8**: Marketplace & Digital Commerce Platform Architecture (Completed)
- **Phase 9**: Enterprise Finance, Accounts & Business Intelligence Suite Architecture (Completed)
- **Phase 10**: HRMS, Payroll & Workforce Management Suite Architecture (Completed)
- **Phase 11**: AI Platform, Automation Engine & Enterprise Intelligence Suite (Completed)
- **Phase 12**: Enterprise Platform, Mobile Apps, Portals, DevOps & Production Architecture (Completed)
- **Phase 13**: Master Development Blueprint & Implementation Roadmap (Completed)
- **Phase 14**: Enterprise UI/UX Design System & Frontend Foundation (Completed)
- **Phase 15**: Enterprise Database Schema & Backend Foundation (Completed)
- **Phase 16**: Shared Core Platform Implementation (Completed)
- **Phase 16A**: Authentication, Multi-Tenant SaaS & User Management Implementation (Completed)
- **Phase 16B**: Shared Masters, Company Settings & Document Management Implementation (Completed)
- **Phase 16C**: Notification Engine, Email, WhatsApp & Reminder Engine Implementation (Completed)
- **Phase 16D**: Enterprise Dashboard Engine, KPI Framework & Reporting Platform Implementation (Completed)
- **Phase 16E**: Workflow Engine, Approval Engine, Business Rules & Audit Platform Implementation (Completed)
- **Phase 16F**: Integration Platform, API Gateway, Webhooks & Ecosystem Connectors (Completed)
- **Phase 16G**: Domain-Driven Business Suites Implementation (Mining, Fleet, Building Materials, Finance, HRMS) (Next - Ready)
- **Phase 17**: Autonomous Drone Quarry Pit Mapping, Edge ML & Global Multi-Region Expansion (Ready)
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rawMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RZ_Minetrix_BOS_Master_Architecture_Blueprint.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Official Master Architecture & Shared Core Blueprint</h3>
              <p className="text-xs text-slate-400">RZ_Minetrix_BOS_Master_Architecture_Blueprint.md</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-slate-950 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Markdown Preview */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950 space-y-4 leading-relaxed">
          <pre className="whitespace-pre-wrap">{rawMarkdown}</pre>
        </div>
      </div>
    </div>
  );
};
