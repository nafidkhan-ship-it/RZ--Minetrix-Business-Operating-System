import { AiSuiteModule } from '../types/architecture';

export const AI_SUITE_MODULES: AiSuiteModule[] = [
  {
    id: 'ai-enterprise-dashboard',
    number: 1,
    title: 'AI Enterprise Executive Dashboard',
    icon: 'LayoutDashboard',
    category: 'Command & Copilot',
    summary: 'Centralized executive command center rendering real-time Business Health Scores, predictive revenue/cashflow forecasts, quarry pit yield predictions, fleet availability gauges, employee productivity indexes, and automated cross-suite AI recommendations.',
    subModules: [
      'Real-Time Enterprise Business Health Index (0-100 Scorecard)',
      'Operational & Financial Risk Alert Radar (Credit Overdue, Pit Bottlenecks)',
      'Predictive Revenue & 90-Day Cash Flow Forecasting Graph',
      'Aggregate Mining Production & Yield Accuracy Gauge',
      'Commercial Fleet & Heavy Equipment Live Utilization Pulse',
      'Workforce Productivity & Attendance Health Matrix',
      'Marketplace Commerce & Rental Opportunity Heatmap',
      'Gemini Executive AI Recommendation Action Stream'
    ],
    keyCapabilities: [
      'Unified executive score calculation updating every 15 seconds across all 8 business suites.',
      'Instant drill-down from enterprise-level risk flags directly to raw transaction or sensor logs.',
      'Predictive cashflow alerts warning CFO of liquidity gaps 30 days before payroll or tax due dates.'
    ],
    masterDataEntities: ['BusinessHealthScoreRecord', 'ExecutiveRiskAlert', 'RevenueForecastCache', 'AIRecommendationStream'],
    eventIntegrations: {
      publishes: ['ai.dashboard.refreshed', 'ai.risk.flagged'],
      subscribes: ['fin.journal.posted', 'mining.dispatch.completed', 'fleet.trip.completed', 'hrms.payroll.calculated']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Server-side Gemini 1.5/2.0 Pro multi-metric synthesis & executive health forecasting']
  },
  {
    id: 'enterprise-copilot',
    number: 2,
    title: 'Enterprise AI Copilot & Context Conversational Agent',
    icon: 'Bot',
    category: 'Command & Copilot',
    summary: 'Role-aware natural language assistant answering complex operational, financial, and regulatory questions, generating instant reports, guiding approval workflows, and providing context-driven decision support.',
    subModules: [
      'Role-Aware Conversational Context Engine (CFO, Quarry Manager, Logistics Head)',
      'Natural Language Business & Financial Query Resolver ("What was Kannur pit margin last week?")',
      'Operational Bottleneck & Fleet Telematics Voice/Text Query Assistant',
      'Instant Dynamic On-the-Fly Report Generator from Plain Text Prompts',
      'Interactive Workflow Execution & Action Prompt Assistant',
      'Multilingual Speech & Natural Text Translation Bridge (Malayalam, English, Tamil, Hindi)',
      'Deep RAG (Retrieval-Augmented Generation) Vector Knowledge Search'
    ],
    keyCapabilities: [
      'Role-based data masking ensuring a field supervisor cannot query executive salary structures.',
      'Server-side Gemini execution returning structured markdown with dynamic chart widgets.',
      'Multi-turn conversational memory retaining transaction context across complex decision trees.'
    ],
    masterDataEntities: ['CopilotSessionLog', 'UserConversationContext', 'PromptResponseAudit'],
    eventIntegrations: {
      publishes: ['ai.copilot.query_resolved', 'ai.copilot.action_triggered'],
      subscribes: ['core.tenant.provisioned', 'rbac.permission.updated']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'RBAC Engine (Mod 2)'],
    aiFeatures: ['Conversational RAG with server-side Gemini multi-turn session handling']
  },
  {
    id: 'ocr-intelligence',
    number: 3,
    title: 'OCR & Document Intelligence Extraction Engine',
    icon: 'FileScan',
    category: 'Document & Voice AI',
    summary: 'High-speed document parsing engine processing supplier invoices, purchase bills, weighbridge gate passes, vehicle RC/insurance, driver licenses, machine permits, and employee Aadhaar/PAN cards with zero manual keying.',
    subModules: [
      'Supplier Invoice & Vendor Purchase Bill Auto-Extraction & 3-Way Match',
      'Weighbridge Ticket, Gate Pass & Delivery Challan Visual Parser',
      'Commercial Vehicle RC, Insurance & Pollution Certificate Extractor',
      'Driver Driving License & Heavy Equipment Operator Permit Parser',
      'Government Mining Lease, Environmental Cess & Royalty Receipt OCR',
      'Employee Aadhaar, PAN Card & Bank Passbook e-KYC OCR Extractor',
      'Document Classification, Quality Validation & Visual Distortion Cleaner'
    ],
    keyCapabilities: [
      'Extracts structured line items, GST numbers, and totals from smudged or hand-annotated paper bills.',
      'Automated 3-way matching: Compares OCR-parsed purchase bills against POs and Gate Passes in under 2 seconds.',
      'Direct synchronization with Accounts Payable and Employee Master Document Lockers.'
    ],
    masterDataEntities: ['OCRDocumentExtraction', 'ParsedBillLineItem', 'DocumentValidationLog'],
    eventIntegrations: {
      publishes: ['ai.ocr.document_parsed', 'ai.ocr.validation_failed'],
      subscribes: ['doc.file.uploaded', 'fin.ap.bill_received']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Accounts Payable (Mod 6)'],
    aiFeatures: ['Gemini Vision multi-modal document extraction & layout parsing']
  },
  {
    id: 'voice-intelligence',
    number: 4,
    title: 'Voice Intelligence & Multilingual Speech Gateway',
    icon: 'Mic',
    category: 'Document & Voice AI',
    summary: 'Voice-driven interface enabling quarry site supervisors, truck drivers, and yard cashiers to issue hands-free voice commands, log attendance, dictate equipment breakdown notes, and perform voice-based inventory search.',
    subModules: [
      'Hands-Free Voice Command Ingestion Engine for Remote Field Workers',
      'Real-Time Speech-to-Text Transcriber with Heavy Industrial Noise Filtering',
      'Natural Text-to-Speech Audio Feedback Generator in Local Dialects',
      'Voice-Driven Inventory, Order & Fleet Location Search Assistant',
      'Voice Data Entry for Quarry Pit Production & Fuel Dispenser Logs',
      'Multilingual Dialect Adapter (Keralite Malayalam, Tamil, Kannada, Hindi, English)'
    ],
    keyCapabilities: [
      'Acoustic background noise suppression tuned for noisy quarry rock crushers and diesel engines.',
      'Voice-guided Malayalam audio prompts for operators with limited digital literacy.',
      'One-tap voice recording converting spoken site updates into structured database records.'
    ],
    masterDataEntities: ['VoiceCommandLog', 'SpeechTranscriptRecord', 'AudioFeedbackCache'],
    eventIntegrations: {
      publishes: ['ai.voice.command_executed', 'ai.voice.transcription_completed'],
      subscribes: ['mobile.audio.stream_received']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Gemini Live Speech / Audio Transcriber & Speech Synthesizer']
  },
  {
    id: 'smart-automation-engine',
    number: 5,
    title: 'Smart Event-Driven Business Automation Engine',
    icon: 'Workflow',
    category: 'Automation & Rules',
    summary: 'Autonomous orchestration framework executing automatic multi-step workflows, threshold reminders, multi-tier approvals, escalation chains, scheduled cron jobs, and complex rule-based business logic.',
    subModules: [
      'Autonomous Business Rule & Trigger-Action Workflow Configurator',
      'Automatic Threshold Notification & Expiry Reminder Router',
      'Multi-Tier Escalation Chain Manager for Delayed Approvals',
      'Approval Request Router (Purchase Orders, Credit Limits, Leave Requests)',
      'Scheduled Cron Job & Batch Processing Scheduler (Daily Tally, Weekly Payroll)',
      'Cross-Suite Event Choreography & Workflow State Machine',
      'Failed Task Auto-Retry & Dead-Letter Queue (DLQ) Recovery Manager'
    ],
    keyCapabilities: [
      'Executes end-to-end workflows: Low quarry aggregate stock automatically triggers supplier RFQs without human delay.',
      'Escalation rules: Automatically routes unapproved invoices >₹5,00,000 to CFO after 24 hours.',
      'Zero-code visual workflow orchestrator binding all 8 business suites.'
    ],
    masterDataEntities: ['AutomationRuleDefinition', 'WorkflowExecutionState', 'EscalationChainConfig', 'ScheduledJobRecord'],
    eventIntegrations: {
      publishes: ['ai.automation.workflow_triggered', 'ai.automation.escalated'],
      subscribes: ['*.*.*']
    },
    sharedCoreDependencies: ['Event Bus Architecture (Mod 3)', 'Omni-Channel Notification Router (Mod 6)']
  },
  {
    id: 'ai-recommendations',
    number: 6,
    title: 'Cross-Suite Predictive AI Recommendations Engine',
    icon: 'Lightbulb',
    category: 'Predictive & Decision Intelligence',
    summary: 'Context-aware recommendation matrix delivering real-time advice on aggregate inventory replenishment, optimal vehicle dispatch matching, machine pit allocation, equipment rental opportunities, and sales cross-selling.',
    subModules: [
      'Aggregate Stock Replenishment & Safety Stock Reorder Point Recommender',
      'Smart Vehicle & Tipper Assignment Matching Engine (Distance, Rate, Driver Score)',
      'Heavy Equipment & Pit Machine Allocation Recommender',
      'Marketplace Machinery Rental & Idle Fleet Monetization Suggestions',
      'CRM Sales Cross-Selling & High-Margin Customer Up-Sell Recommender',
      'Strategic Procurement Supplier Selection & Price Trend Recommender',
      'Customer Credit Limit & Payment Follow-Up Priority Recommender'
    ],
    keyCapabilities: [
      'Distance-cost minimization algorithm matching available tipper trucks to active quarry sales orders.',
      'Automated prompt alerting sales managers to offer washed sand when granite aggregate orders are placed.',
      'Continuous machine learning feedback loop tracking recommendation acceptance rates.'
    ],
    masterDataEntities: ['AIRecommendationLog', 'RecommendationFeedbackRecord', 'MatchingScoreMatrix'],
    eventIntegrations: {
      publishes: ['ai.recommendation.generated', 'ai.recommendation.accepted'],
      subscribes: ['materials.inventory.updated', 'fleet.vehicle.status_changed', 'crm.deal.created']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Shared Master Data Management (Mod 5)'],
    aiFeatures: ['Multi-variable heuristic and Gemini contextual recommendation ranking']
  },
  {
    id: 'predictive-analytics',
    number: 7,
    title: 'Enterprise Predictive Analytics & Machine Forecasting',
    icon: 'TrendingUp',
    category: 'Predictive & Decision Intelligence',
    summary: 'Predictive modeling engine forecasting quarry production volumes, fleet fuel consumption, equipment breakdown probabilities, stock depletion rates, regional building material demand, and financial cash flows.',
    subModules: [
      'Mining Quarry Production Tonnage & Rock Quality Yield Predictor',
      'Fleet & Heavy Equipment Fuel Consumption & Anomalous Mileage Predictor',
      'Predictive Equipment Maintenance & Component Breakdown Early Warning',
      'Stock Depot Depletion & Regional Demand Trend Forecaster',
      'Dynamic Customer Order Volume & Seasonal Demand Forecaster',
      'Enterprise 90-Day Cash Flow & Working Capital Inflow Predictor',
      'Revenue & Gross Margin Forecasting Model by Quarry / Crusher Branch'
    ],
    keyCapabilities: [
      'Early breakdown warning: Telematics vibration anomalies flag excavator hydraulic pump failure 48 hours before breakdown.',
      'Seasonal demand forecaster adjusting inventory levels ahead of monsoon quarry shutdown periods.',
      'High-precision financial forecasting combining historical trends with active pipeline deals.'
    ],
    masterDataEntities: ['PredictiveModelRun', 'BreakdownRiskScore', 'DemandForecastCache', 'TelemetryAnomalyRecord'],
    eventIntegrations: {
      publishes: ['ai.predictive.breakdown_warned', 'ai.predictive.forecast_updated'],
      subscribes: ['telematics.sensor.ingested', 'mining.production.logged', 'fin.cash.reconciled']
    },
    sharedCoreDependencies: ['Audit & Telemetry (Mod 14)', 'Executive Dashboard Engine (Mod 10)'],
    aiFeatures: ['Time-series forecasting models & Gemini anomaly detection']
  },
  {
    id: 'decision-intelligence',
    number: 8,
    title: 'Strategic Decision Intelligence & Risk Advisory Suite',
    icon: 'Brain',
    category: 'Predictive & Decision Intelligence',
    summary: 'Executive advisory engine evaluating operational risks, financial liquidity threats, quarry pit profitability, workforce allocation bottlenecks, and capital expenditure decisions to present actionable strategic scenarios.',
    subModules: [
      'Executive Strategic Suggestion Engine for Profitability Optimization',
      'Enterprise Operational Risk Analysis Radar (Mine Safety, Transport Delays)',
      'Financial Counterparty Credit Risk & Debt Overdue Vulnerability Analyzer',
      'Workforce Shift Balancing & Inter-Branch Labor Deployment Analyzer',
      'Quarry Pit & Crusher Unit Cost-Benefit & Capital Expenditure (CapEx) Simulator',
      'Business Unit & Branch Comparative Profit Margin Diagnostic Desk'
    ],
    keyCapabilities: [
      'Simulates CapEx scenarios: Analyzes whether purchasing a new 30-ton excavator or leasing yields higher 3-year ROI.',
      'Identifies money-losing delivery routes and suggests rate revisions or carrier restructuring.',
      'Provides clear visual risk impact vs probability heatmaps for board-level decision making.'
    ],
    masterDataEntities: ['DecisionScenarioSimulation', 'RiskImpactScorecard', 'StrategicCapExProposal'],
    eventIntegrations: {
      publishes: ['ai.decision.scenario_simulated', 'ai.risk.escalated'],
      subscribes: ['fin.gl.balanced', 'mining.pit.closed']
    },
    sharedCoreDependencies: ['Finance Shared Bridge (Mod 8)', 'Executive Dashboard Engine (Mod 10)'],
    aiFeatures: ['Gemini multi-scenario trade-off analysis & strategic simulation']
  },
  {
    id: 'smart-notifications',
    number: 9,
    title: 'Omni-Channel Smart Notification & Dispatch Engine',
    icon: 'BellRing',
    category: 'Automation & Rules',
    summary: 'Centralized notification delivery matrix dispatching contextual alerts via WhatsApp Business API, transactional SMS, email, mobile push, and in-app alerts with automated fallback channels and read receipts.',
    subModules: [
      'Omni-Channel Notification Gateway (WhatsApp API, SMS, Email, Push)',
      'Context-Aware Message Template & Localization Engine (Malayalam, English, Tamil)',
      'Automated Delivery Status Tracker & Read Receipt Ledger',
      'Channel Fallback Router (WhatsApp -> SMS -> Mobile Push)',
      'Urgent Escalation Pager for Critical Accidents or Mining Hazards',
      'User Preference & Notification Frequency Rate Limiter Desk'
    ],
    keyCapabilities: [
      'Delivers automated WhatsApp trip vouchers to drivers and instant PDF tax invoices to customers.',
      'Automated channel retry ensuring critical safety alerts reach field supervisors even on poor network connections.',
      'Complete audit trail logging exact send timestamp, gateway response code, and delivery receipt.'
    ],
    masterDataEntities: ['NotificationDispatchLog', 'WhatsAppTemplateMaster', 'DeliveryReceiptTracker'],
    eventIntegrations: {
      publishes: ['ai.notification.sent', 'ai.notification.failed'],
      subscribes: ['ai.automation.workflow_triggered', 'fin.payout.released', 'fleet.dispatch.created']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'smart-search',
    number: 10,
    title: 'Enterprise Smart Search & Vector Indexing Gateway',
    icon: 'Search',
    category: 'Search & Knowledge',
    summary: 'Sub-second unified search engine powered by hybrid keyword and semantic vector embeddings, enabling instant discovery of customers, vehicles, quarry machinery, inventory products, invoices, and marketplace listings.',
    subModules: [
      'Global Enterprise Unified Search Bar across all 8 Business Suites',
      'Semantic Vector Embedding Indexer for Unstructured Documents & Notes',
      'Customer, Supplier & Partner 360-Degree Quick-Lookup Search',
      'Vehicle License Plate, Chassis Number & Telematics GPS Search',
      'Heavy Equipment & Machinery Part Number / Serial Number Finder',
      'Building Material Product Catalog & Marketplace SKU Search',
      'Fuzzy Search & Phonetic Typo Corrector (Handles regional name variations)'
    ],
    keyCapabilities: [
      'Sub-50ms query execution across 10+ million database records using PostgreSQL pgvector indexing.',
      'Phonetic search handling misspelled driver names or customer trading names in regional accents.',
      'Contextual auto-complete suggesting active orders or machinery when typing numbers in the search bar.'
    ],
    masterDataEntities: ['SearchVectorIndex', 'SearchQueryLog', 'SemanticEmbeddingCache'],
    eventIntegrations: {
      publishes: ['ai.search.query_executed'],
      subscribes: ['core.entity.created', 'core.entity.updated']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Identity & Auth (Mod 1)']
  },
  {
    id: 'ai-report-generator',
    number: 11,
    title: 'Dynamic AI Report & Analytics Generator Engine',
    icon: 'FileBarChart',
    category: 'Search & Knowledge',
    summary: 'Autonomous reporting engine generating executive summaries, mining production tallies, financial P&L breakdowns, fleet mileage statements, and HR muster rolls from natural language prompts or scheduled timers.',
    subModules: [
      'Natural Language Prompt-to-Report Query Builder ("Generate Kannur pit yield vs fuel cost")',
      'Executive C-Suite Digest Summarizer with Visual Chart Graphics',
      'Automated Daily / Weekly / Monthly Scheduled PDF & Excel Exporter',
      'Multi-Format Data Exporter (PDF, XLSX, CSV, JSON, Print Layout)',
      'Custom KPI & Cross-Departmental Query Drag-and-Drop Builder',
      'Interactive Drill-Through Report Viewer with Parameter Filters'
    ],
    keyCapabilities: [
      'Transforms plain text requests into formatted, audit-ready PDF reports in under 3 seconds.',
      'Automated daily 6:00 AM email dispatch of quarry production and sales receipts to directors.',
      'Includes auto-generated executive narrative summaries pointing out major variances and drivers.'
    ],
    masterDataEntities: ['ReportTemplateConfig', 'GeneratedReportPackage', 'ReportScheduleJob'],
    eventIntegrations: {
      publishes: ['ai.report.generated', 'ai.report.dispatched'],
      subscribes: ['ai.automation.workflow_triggered']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Executive Dashboard Engine (Mod 10)'],
    aiFeatures: ['Gemini text-to-SQL report generation & visual charting']
  },
  {
    id: 'business-intelligence',
    number: 12,
    title: 'Enterprise Business Intelligence & Comparative Analytics',
    icon: 'BarChart3',
    category: 'Search & Knowledge',
    summary: 'High-density business intelligence platform tracking departmental KPIs, multi-branch comparative metrics, cost center performance, vehicle fleet ROI, customer profitability, and historical growth trends.',
    subModules: [
      'Executive KPI Performance & Historical Trend Tracker',
      'Departmental Metrics Dashboard (Mining, Fleet, Materials, Sales, HR, Finance)',
      'Multi-Company & Inter-Branch Comparative Performance Matrix',
      'Quarry Pit & Crusher Plant Unit Production Cost Comparison',
      'Commercial Fleet Vehicle-wise Revenue vs Maintenance Cost Analyzer',
      'Customer Cohort Profitability & Lifetime Value (LTV) Analyzer'
    ],
    keyCapabilities: [
      'Side-by-side branch comparison revealing cost discrepancies between different quarry pit locations.',
      'Dynamic OLAP cube slicing enabling analysis by date, customer, vehicle type, aggregate size, or site.',
      'Direct synchronization with General Ledger Finance Vouchers for verified accuracy.'
    ],
    masterDataEntities: ['BIAggregationCube', 'BranchPerformanceComparison', 'CustomerLTVRecord'],
    eventIntegrations: {
      publishes: ['ai.bi.cube_refreshed', 'ai.bi.anomaly_flagged'],
      subscribes: ['fin.journal.posted', 'mining.dispatch.completed']
    },
    sharedCoreDependencies: ['Finance Shared Bridge (Mod 8)', 'Executive Dashboard Engine (Mod 10)']
  },
  {
    id: 'knowledge-base',
    number: 13,
    title: 'Enterprise Knowledge Base & SOP AI Engine',
    icon: 'BookOpen',
    category: 'Search & Knowledge',
    summary: 'Centralized operational wisdom repository storing company Standard Operating Procedures (SOPs), safety manuals, DGMS mining regulations, machinery repair guides, FAQs, and corporate HR policies with RAG search.',
    subModules: [
      'Digital SOP & Standard Operating Procedure Library',
      'DGMS Mining Safety Regulations & Compliance Document Vault',
      'Heavy Machinery Repair & Maintenance Field Manual Repository',
      'Company HR Policy, Leave Rules & Conduct Handbook Search',
      'Interactive AI Help Center & Employee Onboarding Guide',
      'SOP Version Control & Regulatory Update Distribution Desk'
    ],
    keyCapabilities: [
      'RAG-powered instant answer engine: Mechanics can ask "How to bleed hydraulic air on Kobelco SK380?" and get step-by-step instructions.',
      'Ensures site supervisors stay compliant with latest DGMS statutory safety mandates.',
      'Multilingual document translation allowing workers to read English manuals in Malayalam or Tamil.'
    ],
    masterDataEntities: ['SOPDocumentMaster', 'KnowledgeArticleVector', 'HelpCenterQueryLog'],
    eventIntegrations: {
      publishes: ['ai.kb.article_created', 'ai.kb.searched'],
      subscribes: ['doc.file.uploaded']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Vector-backed RAG knowledge search with Gemini summarization']
  },
  {
    id: 'ai-security-governance',
    number: 14,
    title: 'AI Security, Data Privacy & Prompt Governance Suite',
    icon: 'ShieldAlert',
    category: 'Security & Governance',
    summary: 'Enterprise AI governance framework ensuring strict role-aware response filtering, tenant isolation, PII data masking, prompt injection defenses, model output auditing, and regulatory compliance.',
    subModules: [
      'Role-Aware AI Output Filter & RLS Context Validator',
      'Multi-Tenant AI Memory & Vector Isolation Guardrail',
      'Sensitive PII / Salary Data Masking Engine prior to LLM Prompt Dispatch',
      'Prompt Injection & Jailbreak Defense Firewall',
      'Model Hallucination & Factuality Verification Engine',
      'Immutable AI Prompt & Response Audit Logging System'
    ],
    keyCapabilities: [
      'Guarantees zero data leakage: Encrypts and masks employee salary/Aadhaar data before sending prompts to server-side AI models.',
      'Strict multi-tenant boundary checks ensuring Tenant A cannot query vector embeddings belonging to Tenant B.',
      'Complete governance dashboard auditing every single AI query, tokens consumed, and response confidence score.'
    ],
    masterDataEntities: ['AIPromptAuditLog', 'TenantVectorBoundaryRule', 'PIIMaskingPolicy'],
    eventIntegrations: {
      publishes: ['ai.security.prompt_blocked', 'ai.security.pii_masked'],
      subscribes: ['ai.copilot.query_resolved']
    },
    sharedCoreDependencies: ['Identity & Auth (Mod 1)', 'RBAC Engine (Mod 2)', 'Audit & Telemetry (Mod 14)']
  }
];

export const AUTOMATION_WORKFLOWS_DATA = [
  {
    title: 'Mining Production to Low Stock Purchase Workflow',
    description: 'Autonomous inventory replenishment pipeline triggered when quarry production drops below safety thresholds.',
    steps: [
      { step: 1, title: 'Mining Production Logging', description: 'Crusher plant logs daily crushed aggregate production tonnage.' },
      { step: 2, title: 'Stock Balance Update', description: 'Inventory master updates depot stock balance across aggregate sizes.' },
      { step: 3, title: 'Low Stock Detection', description: 'Automation engine detects 20mm aggregate falling below 500-ton safety stock.' },
      { step: 4, title: 'Purchase Suggestion', description: 'AI recommendation engine generates Purchase Requisition for raw granite boulders.' },
      { step: 5, title: 'Supplier Notification', description: 'Smart notification engine sends RFQ to preferred quarry suppliers via WhatsApp & Email.' }
    ]
  },
  {
    title: 'Customer Order to Delivery & Payment Workflow',
    description: 'End-to-end commercial transaction execution from customer order placement to cash collection.',
    steps: [
      { step: 1, title: 'Customer Order Received', description: 'Order logged via CRM, Building Materials portal, or WhatsApp sales bot.' },
      { step: 2, title: 'Vehicle Allocation', description: 'AI recommends nearest available 10-wheeler tipper truck with optimal rate.' },
      { step: 3, title: 'Driver Assignment', description: 'Driver assigned based on active shift, performance score, and availability.' },
      { step: 4, title: 'Quarry Dispatch', description: 'Weighbridge ticket generated, gate pass issued, and tipper dispatched.' },
      { step: 5, title: 'Delivery Tracking', description: 'GPS telematics tracks tipper route in real time with e-POD customer sign-off.' },
      { step: 6, title: 'Tax Invoice Generation', description: 'Automated GST invoice generated and sent to customer phone.' },
      { step: 7, title: 'Payment Reminder', description: 'Automated payment reminder scheduled 3 days prior to due date.' }
    ]
  },
  {
    title: 'Machine Breakdown to Workshop Completion Workflow',
    description: 'Automated heavy machinery breakdown response minimizing quarry pit operational downtime.',
    steps: [
      { step: 1, title: 'Machine Breakdown Logged', description: 'Excavator operator logs hydraulic leak via mobile app or telematics sensor flags anomaly.' },
      { step: 2, title: 'Operator Report Verification', description: 'Field supervisor validates breakdown and attaches voice/photo note.' },
      { step: 3, title: 'Maintenance Ticket Creation', description: 'Automated maintenance ticket created in Fleet & Equipment Suite.' },
      { step: 4, title: 'Workshop Allocation', description: 'Service job assigned to resident mechanic and spare parts reserved in store.' },
      { step: 5, title: 'Completion & Machine Sign-Off', description: 'Mechanic completes repair, logs hour-meter, and returns machine to active pit duty.' }
    ]
  },
  {
    title: 'Attendance to Payroll & Salary Payout Workflow',
    description: 'Streamlined weekly/monthly workforce compensation and financial posting pipeline.',
    steps: [
      { step: 1, title: 'Biometric Attendance Punch', description: 'Worker punches face-recognition IoT biometric device at quarry site.' },
      { step: 2, title: 'Payroll Calculation Engine', description: 'Weekly wage computed based on attendance, piece-rate loading, and trip bata.' },
      { step: 3, title: 'Finance GL Posting', description: 'Automated journal voucher debits Wage Expense and credits Payable Ledger.' },
      { step: 4, title: 'Salary Notification', description: 'Payslip generated and WhatsApp payout notification sent with direct bank credit.' }
    ]
  }
];

export const AI_INTEGRATION_TOPOLOGY = [
  {
    suite: 'Shared Core Platform (Mod 1-15)',
    interaction: 'Provides tenant isolation, 4-tier RLS context, RBAC permissions, audit telemetry, and WhatsApp/Email routing.',
    protocol: 'Internal gRPC & Shared Engine Function Calls'
  },
  {
    suite: 'Mining Operations Suite (Phase 4)',
    interaction: 'Consumes production yield forecasts, pit bottleneck warnings, and machine telematics breakdown alerts.',
    protocol: 'Event Topics (`mining.production.logged`, `mining.pit.alert`)'
  },
  {
    suite: 'Fleet & Logistics Suite (Phase 5)',
    interaction: 'Powers vehicle-driver matching, fuel efficiency anomaly detection, and predictive maintenance schedules.',
    protocol: 'Event Topics (`fleet.trip.completed`, `fleet.fuel.dispensed`)'
  },
  {
    suite: 'Building Materials Suite (Phase 6)',
    interaction: 'Drives inventory safety stock replenishment, price trend recommendations, and automated customer order notifications.',
    protocol: 'Event Topics (`materials.inventory.updated`, `materials.order.created`)'
  },
  {
    suite: 'CRM & Business Suite (Phase 7)',
    interaction: 'Provides lead scoring, cross-selling recommendations, automated invoice reminders, and customer LTV analytics.',
    protocol: 'Event Topics (`crm.deal.updated`, `crm.lead.scored`)'
  },
  {
    suite: 'Marketplace Suite (Phase 8)',
    interaction: 'Enables smart search across aggregate listings, dynamic equipment rental matching, and automated seller payouts.',
    protocol: 'Event Topics (`marketplace.listing.created`, `marketplace.order.placed`)'
  },
  {
    suite: 'Finance Suite (Phase 9)',
    interaction: 'Feeds predictive cash flow models, 3-way OCR invoice matching, financial risk analysis, and automated GL voucher generation.',
    protocol: 'Event Topics (`fin.journal.posted`, `fin.ap.bill_received`)'
  },
  {
    suite: 'HRMS Suite (Phase 10)',
    interaction: 'Powers absenteeism predictions, payroll fraud detection, biometric voice entry, and automated payslip distribution.',
    protocol: 'Event Topics (`hrms.attendance.punched`, `hrms.payroll.calculated`)'
  }
];

export const AI_FOLDER_STRUCTURE = [
  'src/modules/ai/',
  '├── controllers/',
  '│   ├── ai-dashboard.controller.ts',
  '│   ├── copilot.controller.ts',
  '│   ├── ocr-intelligence.controller.ts',
  '│   ├── voice-gateway.controller.ts',
  '│   ├── automation-engine.controller.ts',
  '│   ├── recommendation.controller.ts',
  '│   ├── predictive-analytics.controller.ts',
  '│   ├── decision-intelligence.controller.ts',
  '│   ├── notification-dispatch.controller.ts',
  '│   ├── smart-search.controller.ts',
  '│   ├── report-generator.controller.ts',
  '│   ├── bi-analytics.controller.ts',
  '│   ├── knowledge-base.controller.ts',
  '│   └── ai-security.controller.ts',
  '├── services/',
  '│   ├── gemini-copilot.service.ts',
  '│   ├── ocr-parser.service.ts',
  '│   ├── speech-transcriber.service.ts',
  '│   ├── workflow-orchestrator.service.ts',
  '│   ├── predictive-model.service.ts',
  '│   ├── vector-search.service.ts',
  '│   └── prompt-governance.service.ts',
  '├── models/',
  '│   ├── ai-prompt-log.model.ts',
  '│   ├── vector-embedding.model.ts',
  '│   ├── automation-rule.model.ts',
  '│   └── forecast-cache.model.ts',
  '├── events/',
  '│   ├── ai-events.publisher.ts',
  '│   └── ai-events.subscriber.ts',
  '└── interfaces/',
  '    ├── copilot-context.interface.ts',
  '    └── ocr-result.interface.ts'
];

export const AI_PROMPT_GOVERNANCE_AND_SECURITY = {
  promptGovernance: [
    'Strict PII Masking: Automatically detects and redacts customer phone numbers, driver Aadhaar numbers, and employee salary figures prior to sending prompts to external AI models.',
    'System Instruction Guardrails: Enforces immutable system prompts that restrict model behavior to verified business domain context, preventing jailbreaks and off-topic outputs.',
    'Response Verification & Grounding: Validates generated answers against internal database facts and vector embeddings before presenting results to executives.'
  ],
  securityModel: [
    'Role-Aware Response Filtering: Integrated with RBAC Engine (Mod 2) to ensure users only receive AI insights for data within their authorized tenant and role scope.',
    'Tenant Isolation in Vector Storage: PostgreSQL pgvector tables enforced with Row-Level Security (RLS) partition keys, preventing cross-tenant data leaks.',
    'Audit & Compliance Logging: Every AI prompt, raw token count, latency metric, and output response is recorded in an immutable audit ledger for security compliance.'
  ],
  scalabilityStrategy: [
    'Asynchronous Job Queue: OCR heavy vision parsing and batch predictive models execute in dedicated background worker pools using BullMQ & Redis.',
    'Vector Embedding Caching: Frequently queried document embeddings cached in memory to deliver sub-50ms semantic search responses.',
    'Rate Limiting & Token Budgeting: Enforces per-tenant and per-user monthly AI token quotas to prevent API cost overruns.'
  ]
};

export const PHASE12_TRANSITION_REVIEW = {
  title: 'Phase 11 AI Platform Review & Phase 12 Transition Roadmap',
  validatedCapabilities: [
    'Shared AI Microservice Architecture: Single reusable intelligence layer serving all 8 business suites without redundant code.',
    'Server-Side Gemini Integration: Multi-modal vision OCR, conversational RAG copilot, and dynamic report generation executing securely via `/api/ai/*`.',
    'Autonomous Business Automation: Event-driven rule engine executing multi-step cross-suite workflows from low stock alerts to payment reminders.',
    'Enterprise Governance & Privacy: PII data masking, role-aware RLS output filtering, and full prompt audit logging.'
  ],
  identifiedImprovementsForPhase12: [
    'Edge Machine Learning Models: Lightweight on-device computer vision models running directly on quarry gate camera hardware for instant license plate recognition.',
    'Autonomous Multi-Entity Resource Balancer: Global AI agent dynamically shifting equipment and trucks across separate corporate entities during regional demand surges.',
    'Global Multi-Region Cloud Deployment: Multi-region database replication and CDN edge routing for international quarry operations.'
  ],
  status: 'APPROVED — READY FOR PHASE 12 (AUTONOMOUS MULTI-ENTITY RESOURCE BALANCING, EDGE ML & GLOBAL SCALING)'
};
