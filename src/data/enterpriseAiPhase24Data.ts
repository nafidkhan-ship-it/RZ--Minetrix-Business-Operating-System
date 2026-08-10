// RZ® Minetrix BOS Phase 24 - Enterprise AI, Automation, Workflow & Decision Intelligence Platform

export interface AiCopilotQueryRecord {
  id: string;
  queryCode: string;
  userRole: 'CEO / Executive' | 'Mining Safety Officer' | 'Fleet Logistics Manager' | 'Chief Accountant' | 'HR Director';
  userLanguage: 'Hindi' | 'English' | 'Rajasthani' | 'Gujarati';
  promptCategory: 'Real-Time Operational Intelligence' | 'Financial & Ledger Audit' | 'Safety & Compliance Check' | 'Fleet Route & Fuel Analysis';
  userPromptText: string;
  aiResponseSummary: string;
  suggestedActionName: string;
  confidenceScorePercent: number;
  timestamp: string;
}

export interface WorkflowInstanceRecord {
  id: string;
  workflowCode: string;
  workflowName: string;
  triggerEvent: 'High-Value Purchase Order (>₹5 Lakhs)' | 'Pit Blasting Safety Permit' | 'Driver Salary Advance (>₹10k)' | 'Credit Limit Exception Approval';
  approvalLevels: Array<{
    levelIndex: number;
    approverRole: string;
    status: 'Approved' | 'Pending Review' | 'Bypassed Auto-SLA';
    approvedAt?: string;
  }>;
  slaDeadlineHours: number;
  currentStatus: 'In Workflow Execution' | 'Approved & Executed' | 'Escalated to VP Operations';
}

export interface BusinessRuleRecord {
  id: string;
  ruleCode: string;
  ruleName: string;
  targetDomain: 'Building Materials Pricing' | 'Freight Rate Calculation' | 'Overtime Eligibility' | 'Credit Limit Risk Guard';
  conditionalLogic: string;
  actionOnTrigger: string;
  isActive: boolean;
  timesTriggeredThisMonth: number;
}

export interface DocumentAiScanRecord {
  id: string;
  scanCode: string;
  documentType: 'Tax Invoice (GST)' | 'Crusher Diesel Purchase Receipt' | 'Equipment Lease Agreement' | 'Heavy Vehicle Driver License';
  scannedFileName: string;
  extractedFields: Record<string, string>;
  ocrConfidencePercent: number;
  classificationTag: 'Automated Ledger Entry Ready' | 'Compliance Approved' | 'Requires Manual Discrepancy Check';
}

export interface PredictiveAiForecastRecord {
  id: string;
  forecastModel: '30-Day Aggregate Demand Forecast' | 'Quarry Equipment Breakdown Probability' | '30-Day Cash Flow Runway' | 'Crusher Plant Fuel Efficiency';
  targetDomain: 'Mining & Materials' | 'Fleet Maintenance' | 'Finance Treasury' | 'HR Workforce';
  predictedValue: string;
  confidenceInterval: string;
  riskFactorAlert: 'Optimal Runway' | 'High Machine Breakdown Warning' | 'Seasonal Demand Surge';
  recommendedIntervention: string;
}

export interface GenerativeAiDocument {
  id: string;
  docCode: string;
  generatorType: 'Quotation Generator' | 'Contract Agreement Builder' | 'Board Executive Summary' | 'WhatsApp Dispatch Notice';
  targetClientOrVendor: string;
  generatedContentSnippet: string;
  status: 'Ready for Signature' | 'Draft Dispatched';
  createdDate: string;
}

export interface DecisionRecommendation {
  id: string;
  recommendationCode: string;
  category: 'Profit & Yield Optimization' | 'Route & Fuel Optimization' | 'Inventory Reorder Balance' | 'Capital Allocation';
  problemStatement: string;
  aiOptimizedSolution: string;
  projectedCostSavingsRs: number;
  decisionImpactRating: 'Critical Executive Priority' | 'Operational Gain' | 'Yield Booster';
}

export interface AiPromptLibraryRecord {
  id: string;
  promptCode: string;
  title: string;
  targetRole: string;
  systemPromptTemplate: string;
  domainModule: 'Mining' | 'Fleet' | 'Finance' | 'HRMS' | 'CRM' | 'Marketplace';
}

export interface AiHealthGovernanceMetrics {
  totalInferences24h: number;
  averageResponseLatencyMs: number;
  ocrAccuracyPercent: number;
  governanceAuditsPassedPercent: number;
  promptSecurityBlockedAttacks: number;
  monthlyTokensConsumedMillions: number;
}

export interface KnowledgeHubArticle {
  id: string;
  articleCode: string;
  title: string;
  category: 'Mine Blasting SOP' | 'Volvo FMX 440 Maintenance' | 'GST & E-Way Bill Compliance' | 'Safety & Emergency Response';
  fileFormat: 'PDF Guide' | 'Interactive Flowchart' | 'Video SOP';
  accessPermission: 'All Site Supervisors' | 'Safety Officers Only' | 'Executive Committee';
  viewsCount: number;
}

// EXTENDED MODULES 26-46 INTERFACES

export interface AiAgentEcosystemRecord {
  id: string;
  agentCode: string;
  agentName: string;
  domainFocus: 'Mining' | 'Fleet' | 'Finance' | 'HR' | 'CRM' | 'Marketplace' | 'Building Materials' | 'Procurement' | 'Compliance' | 'Executive';
  collaborationPeerAgents: string[];
  lastDelegatedTask: string;
  memoryStoreBytes: string;
  activeStatus: 'Idle Listener' | 'Autonomous Execution' | 'Collaborating with Fleet Agent';
}

export interface DigitalTwinStatusRecord {
  id: string;
  twinCode: string;
  twinName: string;
  twinCategory: 'Mining Pit' | 'Crusher Plant' | 'Haulage Fleet' | 'Central Warehouse' | 'Employee Workforce' | 'Finance Ledger';
  liveHealthScorePercent: number;
  activeTelemetryNodes: number;
  aiPredictedAnomaly: string;
  lastUpdated: string;
}

export interface KnowledgeGraphRelationship {
  id: string;
  entityA: string;
  relationshipType: 'Supplies Raw Aggregate To' | 'Hauls Freight For' | 'Leases Equipment From' | 'Employs Certified Operator';
  entityB: string;
  semanticWeightScore: number;
  contextModule: string;
}

export interface VisionAiInspectionRecord {
  id: string;
  inspectionCode: string;
  targetCategory: 'Equipment Damage' | 'Aggregate Stockpile Volumetrics' | 'Stone Granite Quality Grading' | 'Safety PPE Compliance';
  imageUrlOrSource: string;
  aiDetectionSummary: string;
  severityGrade: 'Optimal Quality' | 'Minor Wear' | 'Safety Hazard Warning' | 'High Value Grade A';
  timestamp: string;
}

export interface ExecutiveBriefingRecord {
  id: string;
  role: 'CEO' | 'COO' | 'CFO' | 'CHRO';
  briefingTitle: string;
  keyAiInsightBullet: string;
  flaggedRiskAction: string;
  financialImpactEstimateRs: string;
  date: string;
}

export interface AiSimulationScenario {
  id: string;
  scenarioCode: string;
  simulationName: string;
  whatIfParameters: string;
  simulatedOutcome: string;
  projectedProfitDeltaPercent: number;
  confidenceScorePercent: number;
}

export interface FutureAiCapabilityRecord {
  id: string;
  featureCode: string;
  technologyTag: 'MCP Protocol' | 'LLM Agnostic Router' | 'Edge / Offline AI' | 'Drone Pit Photogrammetry' | 'GIS / BIM 3D Integration';
  deploymentStatus: 'Production Active' | 'Staging Tested' | 'Field Ready';
  impactDescription: string;
}

// MOCK DATASETS

export const MOCK_AI_COPILOT_QUERIES: AiCopilotQueryRecord[] = [
  {
    id: 'cop-1',
    queryCode: 'AI-QRY-8819',
    userRole: 'CEO / Executive',
    userLanguage: 'English',
    promptCategory: 'Real-Time Operational Intelligence',
    userPromptText: 'What is our net aggregate production across Bhilwara and Rajsamand pits today, and is fuel consumption within budget?',
    aiResponseSummary: 'Today’s total aggregate output is 4,820 Metric Tons (+8.4% above daily target). Bhilwara Pit #1 produced 2,940 MT; Rajsamand Crusher produced 1,880 MT. Total diesel consumed across fleet & crushers was 2,410 Liters (₹2.12 Lakhs), which is 3.2% lower than the baseline budget.',
    suggestedActionName: 'Approve Night Shift Production Expansion',
    confidenceScorePercent: 98.9,
    timestamp: '10:42 AM Today'
  },
  {
    id: 'cop-2',
    queryCode: 'AI-QRY-8820',
    userRole: 'Fleet Logistics Manager',
    userLanguage: 'Hindi',
    promptCategory: 'Fleet Route & Fuel Analysis',
    userPromptText: 'Chittorgarh highway haulage ke drivers ka transit time check karo aur batao sabse zyada idle diesel kaha waste ho raha hai?',
    aiResponseSummary: 'Chittorgarh-Udaipur NH-79 route pe 14 dumpers ka average transit time 2 hrs 15 mins hai. Maximum idling Toll Plaza #2 bypass bottleneck aur Rajsamand unloading ramp drop-off points pe ho rahi hai (Total 48 Machine Hours Idling = 120 Liters diesel loss).',
    suggestedActionName: 'Re-route 6 Dumpers via State Highway 12',
    confidenceScorePercent: 96.5,
    timestamp: '11:15 AM Today'
  }
];

export const MOCK_WORKFLOW_INSTANCES: WorkflowInstanceRecord[] = [
  {
    id: 'wf-101',
    workflowCode: 'WF-CAPEX-2026-09',
    workflowName: 'Volvo Excavator Heavy Spare Parts Purchase (>₹5 Lakhs)',
    triggerEvent: 'High-Value Purchase Order (>₹5 Lakhs)',
    approvalLevels: [
      { levelIndex: 1, approverRole: 'Plant Maintenance Lead', status: 'Approved', approvedAt: '2026-08-06 09:30 AM' },
      { levelIndex: 2, approverRole: 'VP Operations', status: 'Approved', approvedAt: '2026-08-06 02:15 PM' },
      { levelIndex: 3, approverRole: 'Group CFO', status: 'Pending Review' }
    ],
    slaDeadlineHours: 24,
    currentStatus: 'In Workflow Execution'
  },
  {
    id: 'wf-102',
    workflowCode: 'WF-BLAST-SAFETY-88',
    workflowName: 'Bench #3 Ammonium Nitrate Deep Hole Blasting Clearance',
    triggerEvent: 'Pit Blasting Safety Permit',
    approvalLevels: [
      { levelIndex: 1, approverRole: 'Licensed Blasting Engineer', status: 'Approved', approvedAt: '2026-08-07 06:00 AM' },
      { levelIndex: 2, approverRole: 'Mine Safety Director', status: 'Approved', approvedAt: '2026-08-07 06:30 AM' }
    ],
    slaDeadlineHours: 2,
    currentStatus: 'Approved & Executed'
  }
];

export const MOCK_BUSINESS_RULES: BusinessRuleRecord[] = [
  {
    id: 'br-1',
    ruleCode: 'RULE-PRICE-AGGR-01',
    ruleName: 'Dynamic Tiered Aggregate Pricing Rule',
    targetDomain: 'Building Materials Pricing',
    conditionalLogic: 'IF Customer.CreditScore >= 750 AND OrderVolume >= 500 MT THEN Apply 6.5% Bulk Rebate AND Grant 30 Days Credit',
    actionOnTrigger: 'Apply automatic invoice line-item discount & credit terms',
    isActive: true,
    timesTriggeredThisMonth: 142
  },
  {
    id: 'br-2',
    ruleCode: 'RULE-FLEET-OVERTIME',
    ruleName: 'Driver 14-Hour Safety Rest Lock Rule',
    targetDomain: 'Overtime Eligibility',
    conditionalLogic: 'IF Driver.ContinuousShiftHours >= 12 THEN Block Dispatch Assignment AND Notify Shift Supervisor',
    actionOnTrigger: 'Enforce mandatory 10-hour rest period in TMS',
    isActive: true,
    timesTriggeredThisMonth: 28
  }
];

export const MOCK_DOCUMENT_AI_SCANS: DocumentAiScanRecord[] = [
  {
    id: 'docai-1',
    scanCode: 'OCR-INV-2026-441',
    documentType: 'Tax Invoice (GST)',
    scannedFileName: 'Vendor_HPCL_Diesel_Bulk_Invoice_Aug.pdf',
    extractedFields: {
      VendorName: 'Hindustan Petroleum Corporation Ltd',
      GSTIN: '08AAACH1111A1Z9',
      InvoiceNumber: 'HPCL-2026-90123',
      InvoiceAmountRs: '₹14,85,000',
      TaxableValueRs: '₹12,58,474',
      GSTAmountRs: '₹2,26,526 (18% IGST)',
      InvoiceDate: '2026-08-04'
    },
    ocrConfidencePercent: 99.4,
    classificationTag: 'Automated Ledger Entry Ready'
  },
  {
    id: 'docai-2',
    scanCode: 'OCR-LIC-8821',
    documentType: 'Heavy Vehicle Driver License',
    scannedFileName: 'Driver_Sukhwinder_Singh_License.jpg',
    extractedFields: {
      DriverName: 'Sukhwinder Singh',
      LicenseNumber: 'RJ-06-2018-99201',
      Authorizations: 'TRANS, LMV, HPMV, HPV',
      ExpiryDate: '2028-11-30',
      IssueAuthority: 'RTO Bhilwara'
    },
    ocrConfidencePercent: 98.7,
    classificationTag: 'Compliance Approved'
  }
];

export const MOCK_PREDICTIVE_AI_FORECASTS: PredictiveAiForecastRecord[] = [
  {
    id: 'pred-1',
    forecastModel: '30-Day Aggregate Demand Forecast',
    targetDomain: 'Mining & Materials',
    predictedValue: '1,45,000 Metric Tons Required',
    confidenceInterval: '± 2.4% Accuracy',
    riskFactorAlert: 'Seasonal Demand Surge',
    recommendedIntervention: 'Increase Rajsamand Crusher shift duration to 18 hrs/day starting Aug 12 to maintain 15% safety stock buffer.'
  },
  {
    id: 'pred-2',
    forecastModel: 'Quarry Equipment Breakdown Probability',
    targetDomain: 'Fleet Maintenance',
    predictedValue: 'Excavator CAT-336D (Unit #4) 82% Risk of Hydraulic Pump Failure within 70 Hours',
    confidenceInterval: '± 1.8% Accuracy',
    riskFactorAlert: 'High Machine Breakdown Warning',
    recommendedIntervention: 'Schedule preventative hydraulic oil seal replacement during scheduled Sunday maintenance window.'
  }
];

export const MOCK_GENERATIVE_AI_DOCS: GenerativeAiDocument[] = [
  {
    id: 'gen-1',
    docCode: 'GEN-QUO-2026-88',
    generatorType: 'Quotation Generator',
    targetClientOrVendor: 'L&T Infrastructure Highway Project (NH-79 Expansion)',
    generatedContentSnippet: 'Official Quotation for 50,000 MT Wet Mix Macadam (WMM) @ ₹520/MT + GST 18%, including site haulage delivery within 45 km radius.',
    status: 'Ready for Signature',
    createdDate: '2026-08-06'
  },
  {
    id: 'gen-2',
    docCode: 'GEN-AGR-2026-12',
    generatorType: 'Contract Agreement Builder',
    targetClientOrVendor: 'Mewar Mining Equipment Leasing Corp',
    generatedContentSnippet: 'Tri-partite Dry Lease Agreement for 3 Volvo FMX 440 Tippers at ₹1.85 Lakhs/month with 2,500 km guaranteed monthly haulage clause.',
    status: 'Draft Dispatched',
    createdDate: '2026-08-05'
  }
];

export const MOCK_DECISION_RECOMMENDATIONS: DecisionRecommendation[] = [
  {
    id: 'dec-1',
    recommendationCode: 'DEC-OPT-2026-01',
    category: 'Profit & Yield Optimization',
    problemStatement: 'High diesel consumption during GSB (Granular Sub-Base) crushing due to uneven boulder feed size.',
    aiOptimizedSolution: 'Adjust primary jaw crusher gap setting from 120mm to 95mm at Bhilwara Pit before feeding Rajsamand plant. Decreases secondary crushing load by 22%.',
    projectedCostSavingsRs: 480000,
    decisionImpactRating: 'Critical Executive Priority'
  },
  {
    id: 'dec-2',
    recommendationCode: 'DEC-OPT-2026-02',
    category: 'Route & Fuel Optimization',
    problemStatement: 'Empty return trips of 12-wheeler tippers on Jaipur-Chittorgarh corridor.',
    aiOptimizedSolution: 'Integrate with Phase 21 Load Exchange Marketplace to pick up silica sand or cement clinker backhaul trips on return journeys.',
    projectedCostSavingsRs: 850000,
    decisionImpactRating: 'Yield Booster'
  }
];

export const MOCK_PROMPT_LIBRARY: AiPromptLibraryRecord[] = [
  {
    id: 'prt-1',
    promptCode: 'PRM-MINE-01',
    title: 'Pit Blasting Safety Risk Auditor',
    targetRole: 'Mine Safety Director',
    systemPromptTemplate: 'You are an expert DGMS Mining Safety Inspector. Analyze bench geometry, explosive charge weight, weather wind speed, and proximity to structures to verify blast permit safety compliance.',
    domainModule: 'Mining'
  },
  {
    id: 'prt-2',
    promptCode: 'PRM-FIN-02',
    title: 'Automated GST E-Way Bill Discrepancy Checker',
    targetRole: 'Chief Accountant',
    systemPromptTemplate: 'Compare weighbridge slip gross weight, dispatch invoice line items, and GST portal E-Way Bill payload. Highlight any weight or tax rate variances exceeding 0.5%.',
    domainModule: 'Finance'
  }
];

export const MOCK_AI_HEALTH_METRICS: AiHealthGovernanceMetrics = {
  totalInferences24h: 18450,
  averageResponseLatencyMs: 380,
  ocrAccuracyPercent: 99.2,
  governanceAuditsPassedPercent: 100.0,
  promptSecurityBlockedAttacks: 14,
  monthlyTokensConsumedMillions: 18.5
};

export const MOCK_KNOWLEDGE_HUB: KnowledgeHubArticle[] = [
  {
    id: 'kn-1',
    articleCode: 'SOP-MINE-DGMS-01',
    title: 'DGMS Deep-Hole Heavy Blasting & Safety Distance SOP',
    category: 'Mine Blasting SOP',
    fileFormat: 'PDF Guide',
    accessPermission: 'All Site Supervisors',
    viewsCount: 480
  },
  {
    id: 'kn-2',
    articleCode: 'SOP-FLEET-VOLVO-04',
    title: 'Volvo FMX 440 Tipper Preventative Maintenance & Oil Change Checklist',
    category: 'Volvo FMX 440 Maintenance',
    fileFormat: 'Interactive Flowchart',
    accessPermission: 'All Site Supervisors',
    viewsCount: 310
  }
];

export const MOCK_AI_AGENT_ECOSYSTEM: AiAgentEcosystemRecord[] = [
  {
    id: 'agt-1',
    agentCode: 'AGT-MINE-01',
    agentName: 'Mining Operations Autonomous Agent',
    domainFocus: 'Mining',
    collaborationPeerAgents: ['Fleet Agent', 'Compliance Agent'],
    lastDelegatedTask: 'Delegated haulage dispatch quota adjustment to Fleet Agent based on crusher intake bottleneck.',
    memoryStoreBytes: '4.2 MB Short/Long Term Vector Memory',
    activeStatus: 'Collaborating with Fleet Agent'
  },
  {
    id: 'agt-2',
    agentCode: 'AGT-FLEET-02',
    agentName: 'Fleet & Logistics Autonomous Agent',
    domainFocus: 'Fleet',
    collaborationPeerAgents: ['Mining Agent', 'Marketplace Agent'],
    lastDelegatedTask: 'Auto-booked 4 backhaul shipments on Phase 21 Load Exchange for empty returning tippers.',
    memoryStoreBytes: '8.1 MB Short/Long Term Vector Memory',
    activeStatus: 'Autonomous Execution'
  },
  {
    id: 'agt-3',
    agentCode: 'AGT-FINANCE-03',
    agentName: 'Finance Treasury & Audit Agent',
    domainFocus: 'Finance',
    collaborationPeerAgents: ['Procurement Agent', 'Compliance Agent'],
    lastDelegatedTask: 'Reconciled ₹14.85 Lakhs diesel tax invoice against weighbridge slip & E-Way bill.',
    memoryStoreBytes: '12.4 MB Ledger History Memory',
    activeStatus: 'Idle Listener'
  }
];

export const MOCK_DIGITAL_TWIN_NODES: DigitalTwinStatusRecord[] = [
  {
    id: 'dt-1',
    twinCode: 'DT-MINE-BHILWARA',
    twinName: 'Bhilwara Pit #1 Digital Twin',
    twinCategory: 'Mining Pit',
    liveHealthScorePercent: 98.4,
    activeTelemetryNodes: 42,
    aiPredictedAnomaly: 'Bench #2 Slope Stability Optimal; Zero Rockfall Hazard',
    lastUpdated: 'Live Sync (2s ago)'
  },
  {
    id: 'dt-2',
    twinCode: 'DT-PLANT-RAJSAMAND',
    twinName: 'Rajsamand 350 TPH Crusher Plant Twin',
    twinCategory: 'Crusher Plant',
    liveHealthScorePercent: 92.1,
    activeTelemetryNodes: 68,
    aiPredictedAnomaly: 'Vibration spike on Secondary Screen Bearings (Recommend Check in 24h)',
    lastUpdated: 'Live Sync (1s ago)'
  }
];

export const MOCK_KNOWLEDGE_GRAPH_NODES: KnowledgeGraphRelationship[] = [
  {
    id: 'kg-1',
    entityA: 'Bhilwara Pit #1 (Mining Unit)',
    relationshipType: 'Supplies Raw Aggregate To',
    entityB: 'Rajsamand 350 TPH Crusher Plant',
    semanticWeightScore: 0.98,
    contextModule: 'Mining ↔ Building Materials Bridge'
  },
  {
    id: 'kg-2',
    entityA: 'Volvo FMX 440 Tipper Fleet (Unit #12-18)',
    relationshipType: 'Hauls Freight For',
    entityB: 'L&T Infrastructure NH-79 Highway Project',
    semanticWeightScore: 0.95,
    contextModule: 'Fleet ↔ CRM Contract Bridge'
  }
];

export const MOCK_VISION_AI_INSPECTIONS: VisionAiInspectionRecord[] = [
  {
    id: 'vis-1',
    inspectionCode: 'VIS-CRUSH-0881',
    targetCategory: 'Stone Granite Quality Grading',
    imageUrlOrSource: 'Camera Feed #4 - Primary Jaw Conveyor',
    aiDetectionSummary: 'Granite boulder density: 88% High Density Black Granite, 12% GSB aggregate. Size distribution within 60-90mm specification.',
    severityGrade: 'High Value Grade A',
    timestamp: '10 mins ago'
  },
  {
    id: 'vis-2',
    inspectionCode: 'VIS-SAFETY-9912',
    targetCategory: 'Safety PPE Compliance',
    imageUrlOrSource: 'Camera Feed #1 - Quarry Pit Entrance Gate',
    aiDetectionSummary: 'All 14 workers detected wearing High-Vis Vests and Hard Hats. 1 operator missing safety goggles near drill rig.',
    severityGrade: 'Safety Hazard Warning',
    timestamp: '15 mins ago'
  }
];

export const MOCK_EXECUTIVE_BRIEFINGS: ExecutiveBriefingRecord[] = [
  {
    id: 'exec-1',
    role: 'CEO',
    briefingTitle: 'CEO Daily Operations & Revenue Briefing',
    keyAiInsightBullet: 'Aggregate production is +8.4% above monthly target. Dynamic pricing rules delivered ₹4.8 Lakhs incremental margin this week.',
    flaggedRiskAction: 'Monitor Rajsamand Crusher Secondary Screen bearing vibration. Preventive maintenance scheduled for Sunday.',
    financialImpactEstimateRs: '+ ₹12.5 Lakhs Projected Weekly Net Margin',
    date: '2026-08-07 Today'
  },
  {
    id: 'exec-2',
    role: 'CFO',
    briefingTitle: 'CFO Treasury & Cash Flow Briefing',
    keyAiInsightBullet: 'Working capital runway stands at 64 Days. Automated OCR GST matching cleared ₹14.85 Lakhs input tax credits with 0 discrepancy.',
    flaggedRiskAction: 'Approve pending Volvo Excavator spare parts CAPEX purchase order (₹5.2 Lakhs).',
    financialImpactEstimateRs: '₹68.4 Lakhs Cash Reserve Healthy',
    date: '2026-08-07 Today'
  }
];

export const MOCK_SIMULATION_SCENARIOS: AiSimulationScenario[] = [
  {
    id: 'sim-1',
    scenarioCode: 'SIM-PRICING-2026-01',
    simulationName: 'Diesel Price Increase (+₹5/L) Impact on Freight Margin',
    whatIfParameters: 'IF Fuel Price = +₹5/L AND Freight Rates = Static THEN Calculate Net Haulage Margin Reduction',
    simulatedOutcome: 'Haulage margin drops by 3.8%. Recommendation: Trigger Phase 20 Dynamic Freight Fuel Surcharge (+2.2% freight rate adjustment).',
    projectedProfitDeltaPercent: -3.8,
    confidenceScorePercent: 97.4
  },
  {
    id: 'sim-2',
    scenarioCode: 'SIM-SHIFT-2026-02',
    simulationName: 'Night Shift Addition at Bhilwara Crusher Plant',
    whatIfParameters: 'IF Night Shift = +6 Hours THEN Calculate Extra Aggregate Yield vs Electricity & Overtime Cost',
    simulatedOutcome: 'Net daily production increases by +1,200 MT. Net weekly operating profit increases by ₹3.4 Lakhs after overtime pay.',
    projectedProfitDeltaPercent: +14.2,
    confidenceScorePercent: 95.8
  }
];

export const MOCK_FUTURE_AI_CAPABILITIES: FutureAiCapabilityRecord[] = [
  {
    id: 'fut-1',
    featureCode: 'MCP-READY-PROTOCOL',
    technologyTag: 'MCP Protocol',
    deploymentStatus: 'Production Active',
    impactDescription: 'Model Context Protocol (MCP) server enables seamless tool calling across local sensors, ERP databases & external LLM models.'
  },
  {
    id: 'fut-2',
    featureCode: 'DRONE-PIT-3D',
    technologyTag: 'Drone Pit Photogrammetry',
    deploymentStatus: 'Staging Tested',
    impactDescription: 'Autonomous drone pit flyover scans generate 3D volumetric stockpile meshes with ±0.5% volume accuracy.'
  },
  {
    id: 'fut-3',
    featureCode: 'EDGE-OFFLINE-AI',
    technologyTag: 'Edge / Offline AI',
    deploymentStatus: 'Field Ready',
    impactDescription: 'On-device quantized Gemini models installed on remote quarry weighbridge terminals operate without cellular connectivity.'
  }
];

