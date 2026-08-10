// RZ® Minetrix BOS Phase 25 - Enterprise Integration Platform (iPaaS), API Gateway, IoT & Digital Ecosystem Data

export interface ApiGatewayEndpointRecord {
  id: string;
  apiRoute: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  targetService: 'Mining Service' | 'Fleet Logistics' | 'Finance Ledger' | 'AI Copilot Engine' | 'Weighbridge IoT';
  authMethod: 'OAuth 2.0 / Bearer' | 'API Key (HMAC)' | 'mTLS / Certificate';
  rateLimitPerMin: number;
  averageLatencyMs: number;
  status: 'Active 200 OK' | 'Throttled 429' | 'Maintenance Mode';
  dailyCallsTotal: number;
}

export interface WebhookEndpointRecord {
  id: string;
  webhookCode: string;
  sourceSystem: 'Government GST Portal' | 'ICICI FastTag Gateway' | 'Razorpay UPI' | 'Volvo Telematics Cloud';
  targetHandlerUrl: string;
  eventTrigger: 'payment.received' | 'ewaybill.generated' | 'fasttag.toll_debited' | 'telemetry.fault_code';
  deliverySuccessPercent: number;
  retriesInDlqCount: number;
  securityHashType: 'SHA-256 HMAC' | 'RSA-2048 Sig';
  lastDispatchedAt: string;
}

export interface EventBusTopicRecord {
  id: string;
  topicName: string;
  publisherService: string;
  subscriberCount: number;
  messagesProcessed24h: number;
  queueBacklogCount: number;
  priorityLevel: 'High (Realtime IoT)' | 'Medium (Ledger Sync)' | 'Batch (EOD Analytics)';
}

export interface MessageQueueJobRecord {
  id: string;
  jobCode: string;
  jobCategory: 'WhatsApp Dispatch Slips' | 'E-Way Bill PDF Generation' | 'Biometric Payroll Sync' | 'SMS Safety Alert';
  payloadSummary: string;
  attemptsCount: number;
  maxAttempts: number;
  status: 'Processing in Worker #3' | 'Completed' | 'Dead Letter Queue';
  scheduledTime: string;
}

export interface PaymentGatewayBridgeRecord {
  id: string;
  bridgeCode: string;
  paymentProvider: 'Razorpay / UPI' | 'HDFC Bank Host-to-Host' | 'ICICI Auto Reconciliation' | 'Paytm Corporate Wallet';
  transactionType: 'Public Quarry Order' | 'Driver Daily Wage UPI' | 'Vendor Invoice Payout' | 'Security Deposit';
  settlementStatus: 'Auto-Reconciled' | 'Pending Bank Clearance' | 'Settled to Escrow';
  amountRs: number;
  utrOrTxnRef: string;
  timestamp: string;
}

export interface IotDeviceTelemetryRecord {
  id: string;
  deviceCode: string;
  deviceName: string;
  sensorType: 'Weighbridge Load Cells' | 'Diesel Tank Ultrasonic' | 'Crusher Plant Vibration PLC' | 'Fleet GPS & Fuel Sensor';
  installedLocation: string;
  liveReadingValue: string;
  sensorHealthStatus: 'Optimal Telemetry' | 'Calibration Warning' | 'Offline Sensor';
  lastPingTime: string;
}

export interface ExternalErpConnectorRecord {
  id: string;
  connectorCode: string;
  externalSystemName: 'SAP S/4HANA Enterprise' | 'Tally Prime Cloud' | 'Govt GSTIN & E-Way Bill Portal' | 'ICICI Bank API Gateway';
  integrationType: 'Bi-directional Sync' | 'Push Webhooks' | 'Batch ETL File Sync';
  recordsSynced24h: number;
  syncLatencySec: number;
  lastSyncStatus: 'Connected & Synced' | 'Token Expired';
}

export interface ApiGatewayMetrics {
  totalApiRequests24h: number;
  gatewayUptimePercent: number;
  activeApiKeysIssued: number;
  webhookDeliverySuccessRate: number;
  messageQueueJobsProcessed: number;
  iotSensorsConnectedTotal: number;
  monthlyBandwidthGb: number;
}

// MOCK DATASETS

export const MOCK_API_GATEWAY_ENDPOINTS: ApiGatewayEndpointRecord[] = [
  {
    id: 'api-1',
    apiRoute: '/api/v1/mining/pits/bhilwara/dispatch',
    httpMethod: 'POST',
    targetService: 'Mining Service',
    authMethod: 'OAuth 2.0 / Bearer',
    rateLimitPerMin: 1200,
    averageLatencyMs: 42,
    status: 'Active 200 OK',
    dailyCallsTotal: 18420
  },
  {
    id: 'api-2',
    apiRoute: '/api/v1/fleet/telemetry/gps-stream',
    httpMethod: 'POST',
    targetService: 'Fleet Logistics',
    authMethod: 'API Key (HMAC)',
    rateLimitPerMin: 5000,
    averageLatencyMs: 18,
    status: 'Active 200 OK',
    dailyCallsTotal: 142000
  },
  {
    id: 'api-3',
    apiRoute: '/api/v1/finance/ledger/gst-reconcile',
    httpMethod: 'POST',
    targetService: 'Finance Ledger',
    authMethod: 'mTLS / Certificate',
    rateLimitPerMin: 300,
    averageLatencyMs: 110,
    status: 'Active 200 OK',
    dailyCallsTotal: 2450
  }
];

export const MOCK_WEBHOOK_ENDPOINTS: WebhookEndpointRecord[] = [
  {
    id: 'wh-1',
    webhookCode: 'WH-GST-001',
    sourceSystem: 'Government GST Portal',
    targetHandlerUrl: 'https://api.minetrixbos.com/v1/webhooks/gst-ewaybill',
    eventTrigger: 'ewaybill.generated',
    deliverySuccessPercent: 99.8,
    retriesInDlqCount: 0,
    securityHashType: 'SHA-256 HMAC',
    lastDispatchedAt: '2 mins ago'
  },
  {
    id: 'wh-2',
    webhookCode: 'WH-FASTTAG-882',
    sourceSystem: 'ICICI FastTag Gateway',
    targetHandlerUrl: 'https://api.minetrixbos.com/v1/webhooks/fasttag-toll',
    eventTrigger: 'fasttag.toll_debited',
    deliverySuccessPercent: 99.4,
    retriesInDlqCount: 2,
    securityHashType: 'RSA-2048 Sig',
    lastDispatchedAt: '5 mins ago'
  }
];

export const MOCK_EVENT_BUS_TOPICS: EventBusTopicRecord[] = [
  {
    id: 'ev-1',
    topicName: 'minetrix.mining.pit_blasted.v1',
    publisherService: 'Mining Pit Service',
    subscriberCount: 6,
    messagesProcessed24h: 42,
    queueBacklogCount: 0,
    priorityLevel: 'High (Realtime IoT)'
  },
  {
    id: 'ev-2',
    topicName: 'minetrix.weighbridge.gross_measured.v1',
    publisherService: 'Weighbridge IoT Service',
    subscriberCount: 9,
    messagesProcessed24h: 1840,
    queueBacklogCount: 0,
    priorityLevel: 'High (Realtime IoT)'
  }
];

export const MOCK_MESSAGE_QUEUE_JOBS: MessageQueueJobRecord[] = [
  {
    id: 'job-101',
    jobCode: 'JOB-PDF-EWAY-991',
    jobCategory: 'E-Way Bill PDF Generation',
    payloadSummary: 'Generate PDF E-Way Bill & QR Code for Invoice #INV-2026-881 (50 MT Aggregate)',
    attemptsCount: 1,
    maxAttempts: 3,
    status: 'Completed',
    scheduledTime: '10:40 AM Today'
  },
  {
    id: 'job-102',
    jobCode: 'JOB-WA-SLIP-441',
    jobCategory: 'WhatsApp Dispatch Slips',
    payloadSummary: 'Dispatch WhatsApp weighbridge slip to driver Sukhwinder Singh (+91 98290XXXXX)',
    attemptsCount: 1,
    maxAttempts: 5,
    status: 'Processing in Worker #3',
    scheduledTime: '10:42 AM Today'
  }
];

export const MOCK_PAYMENT_GATEWAY_BRIDGES: PaymentGatewayBridgeRecord[] = [
  {
    id: 'pay-1',
    bridgeCode: 'PAY-UPI-2026-881',
    paymentProvider: 'Razorpay / UPI',
    transactionType: 'Public Quarry Order',
    settlementStatus: 'Auto-Reconciled',
    amountRs: 48500,
    utrOrTxnRef: 'UPI-421908219081',
    timestamp: '10:15 AM Today'
  },
  {
    id: 'pay-2',
    bridgeCode: 'PAY-HDFC-9912',
    paymentProvider: 'HDFC Bank Host-to-Host',
    transactionType: 'Vendor Invoice Payout',
    settlementStatus: 'Settled to Escrow',
    amountRs: 1485000,
    utrOrTxnRef: 'NEFT-HDFC00012026',
    timestamp: '09:30 AM Today'
  }
];

export const MOCK_IOT_TELEMETRY_DEVICES: IotDeviceTelemetryRecord[] = [
  {
    id: 'iot-1',
    deviceCode: 'IOT-WB-BHILWARA-01',
    deviceName: 'Bhilwara Gate #1 Digital Weighbridge',
    sensorType: 'Weighbridge Load Cells',
    installedLocation: 'Bhilwara Pit Entrance Ramp',
    liveReadingValue: '48,450 kg Gross Load (Calibrated ±0.1%)',
    sensorHealthStatus: 'Optimal Telemetry',
    lastPingTime: 'Live (1s ago)'
  },
  {
    id: 'iot-2',
    deviceCode: 'IOT-CRUSH-VIB-02',
    deviceName: 'Rajsamand Secondary Jaw Crusher PLC',
    sensorType: 'Crusher Plant Vibration PLC',
    installedLocation: 'Rajsamand Plant #2 Bearing Box',
    liveReadingValue: '3.4 mm/s RMS Vibration (Normal Range)',
    sensorHealthStatus: 'Optimal Telemetry',
    lastPingTime: 'Live (2s ago)'
  },
  {
    id: 'iot-3',
    deviceCode: 'IOT-DIESEL-TANK-01',
    deviceName: 'Central Diesel Bulk Storage Tank #1',
    sensorType: 'Diesel Tank Ultrasonic',
    installedLocation: 'Main Fuel Depot - Rajsamand',
    liveReadingValue: '34,800 Liters Remaining (87% Capacity)',
    sensorHealthStatus: 'Optimal Telemetry',
    lastPingTime: 'Live (5s ago)'
  }
];

export const MOCK_EXTERNAL_ERP_CONNECTORS: ExternalErpConnectorRecord[] = [
  {
    id: 'erp-1',
    connectorCode: 'CONN-SAP-01',
    externalSystemName: 'SAP S/4HANA Enterprise',
    integrationType: 'Bi-directional Sync',
    recordsSynced24h: 12480,
    syncLatencySec: 1.2,
    lastSyncStatus: 'Connected & Synced'
  },
  {
    id: 'erp-2',
    connectorCode: 'CONN-GSTIN-02',
    externalSystemName: 'Govt GSTIN & E-Way Bill Portal',
    integrationType: 'Push Webhooks',
    recordsSynced24h: 840,
    syncLatencySec: 0.8,
    lastSyncStatus: 'Connected & Synced'
  }
];

export const MOCK_API_GATEWAY_METRICS: ApiGatewayMetrics = {
  totalApiRequests24h: 184500,
  gatewayUptimePercent: 99.99,
  activeApiKeysIssued: 142,
  webhookDeliverySuccessRate: 99.8,
  messageQueueJobsProcessed: 12400,
  iotSensorsConnectedTotal: 184,
  monthlyBandwidthGb: 485.2
};
