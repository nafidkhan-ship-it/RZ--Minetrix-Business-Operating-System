import React, { useState } from 'react';
import {
  Globe,
  Network,
  Webhook,
  Radio,
  ListOrdered,
  CreditCard,
  MessageSquare,
  Navigation,
  Cpu,
  FileCheck2,
  Share2,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Send,
  Lock,
  Database,
  ArrowRight,
  Sliders,
  Bell,
  Check
} from 'lucide-react';
import {
  MOCK_API_GATEWAY_ENDPOINTS,
  MOCK_WEBHOOK_ENDPOINTS,
  MOCK_EVENT_BUS_TOPICS,
  MOCK_MESSAGE_QUEUE_JOBS,
  MOCK_PAYMENT_GATEWAY_BRIDGES,
  MOCK_IOT_TELEMETRY_DEVICES,
  MOCK_EXTERNAL_ERP_CONNECTORS,
  MOCK_API_GATEWAY_METRICS,
  ApiGatewayEndpointRecord
} from '../data/enterpriseIntegrationPhase25Data';

interface EnterpriseIntegrationPhase25SectionProps {
  showToast?: (msg: string) => void;
}

export const EnterpriseIntegrationPhase25Section: React.FC<EnterpriseIntegrationPhase25SectionProps> = ({
  showToast = (msg: string) => alert(msg)
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'mod1-apigateway'
    | 'mod2-hub'
    | 'mod3-webhooks'
    | 'mod4-eventbus'
    | 'mod5-messagequeue'
    | 'mod6-payments'
    | 'mod7-communication'
    | 'mod8-gps'
    | 'mod9-iot'
    | 'mod10-docintegration'
    | 'mod11-connectors'
    | 'mod12-security'
    | 'mod13-monitoring'
    | 'mod14-ecosystem'
    | 'phase25-review'
  >('mod1-apigateway');

  // Interactive Test API State
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiGatewayEndpointRecord>(MOCK_API_GATEWAY_ENDPOINTS[0]);
  const [testRequestBody, setTestRequestBody] = useState('{\n  "tenantId": "minetrix-bhilwara-01",\n  "dispatchQtyMT": 50,\n  "vehicleNo": "RJ-06-GB-8821"\n}');
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [apiResponseText, setApiResponseText] = useState<string | null>(null);

  const handleTestApiCall = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCallingApi(true);
    setApiResponseText(null);
    setTimeout(() => {
      setIsCallingApi(false);
      setApiResponseText(`HTTP/1.1 200 OK\nContent-Type: application/json\nX-Gateway-Latency: ${selectedEndpoint.averageLatencyMs}ms\nX-RateLimit-Remaining: 1198\n\n{\n  "status": "success",\n  "transactionId": "TXN-${Date.now()}",\n  "route": "${selectedEndpoint.apiRoute}",\n  "authenticated": true,\n  "authMethod": "${selectedEndpoint.authMethod}",\n  "message": "Dispatch transaction successfully verified across API Gateway and routed to ${selectedEndpoint.targetService}."\n}`);
      showToast(`API Call Succeeded! Gateway latency: ${selectedEndpoint.averageLatencyMs}ms`);
    }, 500);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" /> Phase 25 Complete
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-full">
                14 Integration Modules
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              Enterprise Integration Platform (iPaaS), API Gateway &amp; IoT Ecosystem
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl font-mono">
              Central iPaaS Integration Layer connecting Mining, Fleet, Materials, CRM, Marketplace, Finance, HRMS &amp; AI with IoT Weighbridges, GPS Telemetry, UPI Payments, WhatsApp Gateways &amp; Government GST Portals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            <button
              onClick={() => showToast('iPaaS Health Diagnostics: Gateway 99.99% Uptime, 184 IoT Sensors Online!')}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition"
            >
              <Activity className="w-4 h-4" /> Run Gateway Diagnostics
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">24h API Requests</span>
            <strong className="text-cyan-400 text-sm font-black">{MOCK_API_GATEWAY_METRICS.totalApiRequests24h.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Gateway Uptime</span>
            <strong className="text-emerald-400 text-sm font-black">{MOCK_API_GATEWAY_METRICS.gatewayUptimePercent}%</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Active API Keys</span>
            <strong className="text-indigo-300 text-sm font-black">{MOCK_API_GATEWAY_METRICS.activeApiKeysIssued} Keys</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Webhook Success</span>
            <strong className="text-purple-300 text-sm font-black">{MOCK_API_GATEWAY_METRICS.webhookDeliverySuccessRate}%</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Queue Jobs Sync</span>
            <strong className="text-amber-300 text-sm font-black">{MOCK_API_GATEWAY_METRICS.messageQueueJobsProcessed.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">IoT Sensors Live</span>
            <strong className="text-emerald-300 text-sm font-black">{MOCK_API_GATEWAY_METRICS.iotSensorsConnectedTotal} Connected</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Bandwidth Used</span>
            <strong className="text-cyan-300 text-sm font-black">{MOCK_API_GATEWAY_METRICS.monthlyBandwidthGb} GB</strong>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {[
          { id: 'mod1-apigateway', label: '1. API Gateway', icon: Globe },
          { id: 'mod2-hub', label: '2. Integration Hub', icon: Network },
          { id: 'mod3-webhooks', label: '3. Webhooks', icon: Webhook },
          { id: 'mod4-eventbus', label: '4. Event Bus', icon: Radio },
          { id: 'mod5-messagequeue', label: '5. Message Queue', icon: ListOrdered },
          { id: 'mod6-payments', label: '6. Payment Gateways', icon: CreditCard },
          { id: 'mod7-communication', label: '7. Communication', icon: MessageSquare },
          { id: 'mod8-gps', label: '8. GPS & Maps', icon: Navigation },
          { id: 'mod9-iot', label: '9. IoT Sensors', icon: Cpu },
          { id: 'mod10-docintegration', label: '10. Doc OCR/QR', icon: FileCheck2 },
          { id: 'mod11-connectors', label: '11. ERP Connectors', icon: Share2 },
          { id: 'mod12-security', label: '12. Security Vault', icon: ShieldCheck },
          { id: 'mod13-monitoring', label: '13. Observability', icon: Activity },
          { id: 'mod14-ecosystem', label: '14. Ecosystem Bridges', icon: Layers },
          { id: 'phase25-review', label: 'Phase 25 Review', icon: CheckCircle2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* MODULE 1: ENTERPRISE API GATEWAY */}
      {activeTab === 'mod1-apigateway' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 1</span>
              <h2 className="text-xl font-bold text-white mt-1">Enterprise REST &amp; GraphQL Ready API Gateway</h2>
            </div>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-bold rounded-full text-xs flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Rate Limiting &amp; mTLS Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ENDPOINT LIST */}
            <div className="space-y-3">
              <h3 className="text-cyan-400 font-bold text-xs uppercase">Active Enterprise API Routes</h3>
              {MOCK_API_GATEWAY_ENDPOINTS.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                    selectedEndpoint.id === ep.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[10px]">{ep.httpMethod}</span>
                      <span className="text-white font-bold text-xs">{ep.apiRoute}</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">{ep.status}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>Target: <strong className="text-slate-200">{ep.targetService}</strong></span>
                    <span>Latency: <strong className="text-cyan-300">{ep.averageLatencyMs}ms</strong></span>
                    <span>Auth: <strong className="text-indigo-300">{ep.authMethod}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* API CALL TESTER */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" /> Interactive API Console Tester
              </h3>

              <div>
                <label className="text-slate-400 text-[10px] block font-bold mb-1">Target Endpoint Route:</label>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono font-bold flex justify-between">
                  <span>{selectedEndpoint.httpMethod} {selectedEndpoint.apiRoute}</span>
                  <span className="text-slate-400 text-[10px]">Auth: {selectedEndpoint.authMethod}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block font-bold mb-1">JSON Request Payload:</label>
                <textarea
                  rows={4}
                  value={testRequestBody}
                  onChange={(e) => setTestRequestBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleTestApiCall}
                disabled={isCallingApi}
                className="w-full py-2.5 bg-cyan-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-cyan-400 transition"
              >
                {isCallingApi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Execute API Route Request
              </button>

              {apiResponseText && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-mono text-[11px] whitespace-pre-wrap">
                  {apiResponseText}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: INTEGRATION HUB */}
      {activeTab === 'mod2-hub' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 2</span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise iPaaS Integration Hub</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'Mining Operations', status: 'Active Bi-Directional', sync: '0.4s Latency' },
              { title: 'Fleet & Haulage', status: 'Active Bi-Directional', sync: '0.2s Latency' },
              { title: 'Building Materials', status: 'Active Bi-Directional', sync: '0.5s Latency' },
              { title: 'CRM Commercials', status: 'Active Bi-Directional', sync: '0.8s Latency' },
              { title: 'Marketplace Load Exch', status: 'Active Bi-Directional', sync: '0.3s Latency' },
              { title: 'Finance & Ledger', status: 'Active Bi-Directional', sync: '0.1s Latency' },
              { title: 'HRMS & Payroll', status: 'Active Bi-Directional', sync: '0.6s Latency' },
              { title: 'AI Copilot Platform', status: 'Active Bi-Directional', sync: '0.1s Latency' }
            ].map((hub, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <strong className="text-white block text-xs">{hub.title}</strong>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[10px] block w-max">{hub.status}</span>
                <span className="text-slate-400 text-[10px] block">Sync Speed: {hub.sync}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 3: WEBHOOK PLATFORM */}
      {activeTab === 'mod3-webhooks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 3</span>
              <h2 className="text-xl font-bold text-white mt-1">Enterprise Webhook Platform (DLQ &amp; Auto-Retry)</h2>
            </div>
            <button onClick={() => showToast('New Webhook Endpoint Configured with HMAC SHA-256 Signature')} className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <Webhook className="w-4 h-4" /> Add Webhook Listener
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_WEBHOOK_ENDPOINTS.map((wh) => (
              <div key={wh.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-cyan-400 font-bold">{wh.webhookCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">Source: {wh.sourceSystem}</h3>
                    <span className="text-slate-400 text-[10px]">Event: {wh.eventTrigger}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{wh.deliverySuccessPercent}% Success</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] font-bold block">TARGET HANDLER URL:</span>
                  <span className="text-slate-200 text-xs font-mono">{wh.targetHandlerUrl}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Security: <strong className="text-indigo-300">{wh.securityHashType}</strong></span>
                  <span>DLQ Retries: <strong className="text-amber-400">{wh.retriesInDlqCount} Jobs</strong></span>
                  <span>Last Dispatched: {wh.lastDispatchedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: EVENT BUS */}
      {activeTab === 'mod4-eventbus' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 4</span>
            <h2 className="text-xl font-bold text-white mt-1">High-Throughput Enterprise Event Bus (Pub/Sub)</h2>
          </div>

          <div className="space-y-3">
            {MOCK_EVENT_BUS_TOPICS.map((ev) => (
              <div key={ev.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <span className="text-cyan-400 font-bold text-xs">{ev.topicName}</span>
                  <p className="text-slate-300 text-xs">Publisher: {ev.publisherService}</p>
                  <span className="text-slate-400 text-[10px]">Subscribers: {ev.subscriberCount} Active Services</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded-full text-[10px] block mb-1">{ev.priorityLevel}</span>
                  <span className="text-slate-400 text-[10px]">24h Processed: <strong className="text-white">{ev.messagesProcessed24h}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 5: MESSAGE QUEUE */}
      {activeTab === 'mod5-messagequeue' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 5</span>
            <h2 className="text-xl font-bold text-white mt-1">Background Message Queue &amp; Worker Orchestrator</h2>
          </div>

          <div className="space-y-3">
            {MOCK_MESSAGE_QUEUE_JOBS.map((job) => (
              <div key={job.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-cyan-400 font-bold">{job.jobCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{job.jobCategory}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{job.status}</span>
                </div>

                <p className="text-slate-300 text-xs p-3 bg-slate-900 rounded-xl border border-slate-800">{job.payloadSummary}</p>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Attempts: <strong className="text-white">{job.attemptsCount} / {job.maxAttempts}</strong></span>
                  <span>Scheduled: {job.scheduledTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: PAYMENT INTEGRATIONS */}
      {activeTab === 'mod6-payments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 6</span>
            <h2 className="text-xl font-bold text-white mt-1">UPI &amp; Bank Host-to-Host Payment Integrations</h2>
          </div>

          <div className="space-y-3">
            {MOCK_PAYMENT_GATEWAY_BRIDGES.map((pay) => (
              <div key={pay.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-cyan-400 font-bold">{pay.bridgeCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{pay.paymentProvider}</h3>
                    <span className="text-slate-400 text-[10px]">Type: {pay.transactionType}</span>
                  </div>
                  <span className="text-emerald-400 font-black text-sm">₹{pay.amountRs.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Ref/UTR: <strong className="text-slate-200">{pay.utrOrTxnRef}</strong></span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full">{pay.settlementStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: COMMUNICATION PLATFORM */}
      {activeTab === 'mod7-communication' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 7</span>
            <h2 className="text-xl font-bold text-white mt-1">Omnichannel Communication Platform (WhatsApp, SMS &amp; Push)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-center">
              <strong className="text-emerald-400 text-sm block">WhatsApp Business API</strong>
              <p className="text-slate-400 text-[11px]">Instant dispatch slips, driver assignment alerts &amp; E-Way bill PDFs.</p>
              <span className="text-white font-bold block pt-2">Active • 1,240 Sent Today</span>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-center">
              <strong className="text-cyan-400 text-sm block">SMS Gateway (DLT Approved)</strong>
              <p className="text-slate-400 text-[11px]">Transactional OTPs, gate pass verification codes &amp; weighbridge tickets.</p>
              <span className="text-white font-bold block pt-2">Active • 4,820 Sent Today</span>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-center">
              <strong className="text-purple-400 text-sm block">Email &amp; Mobile Push</strong>
              <p className="text-slate-400 text-[11px]">Board executive summaries, PO approval alerts &amp; shift schedules.</p>
              <span className="text-white font-bold block pt-2">Active • 380 Sent Today</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 8: GPS PLATFORM */}
      {activeTab === 'mod8-gps' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 8</span>
            <h2 className="text-xl font-bold text-white mt-1">GPS Telematics &amp; Google Maps Geofencing Platform</h2>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-white font-bold text-xs">Live Telematics Feed Sync Active</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <strong className="text-cyan-400 block mb-1">Vehicle &amp; Tipper GPS</strong>
                <p className="text-slate-400 text-[11px]">142 Tippers tracking speed, route deviation &amp; fuel drop warnings.</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <strong className="text-emerald-400 block mb-1">Google Maps Geofencing</strong>
                <p className="text-slate-400 text-[11px]">Automated entry/exit timestamps at Bhilwara Quarry &amp; Rajsamand Plant.</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <strong className="text-purple-400 block mb-1">Customer Delivery ETA</strong>
                <p className="text-slate-400 text-[11px]">Real-time live map link dispatched to public buyers upon weighbridge exit.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 9: IOT PLATFORM */}
      {activeTab === 'mod9-iot' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 9</span>
            <h2 className="text-xl font-bold text-white mt-1">IoT Sensor Telemetry Platform (Weighbridges &amp; Crushers)</h2>
          </div>

          <div className="space-y-3">
            {MOCK_IOT_TELEMETRY_DEVICES.map((iot) => (
              <div key={iot.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-cyan-400 font-bold">{iot.deviceCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{iot.deviceName}</h3>
                    <span className="text-slate-400 text-[10px]">Location: {iot.installedLocation}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{iot.sensorHealthStatus}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-bold">LIVE TELEMETRY READING:</span>
                  <strong className="text-indigo-300 text-xs mt-0.5 block">{iot.liveReadingValue}</strong>
                </div>

                <span className="text-slate-500 text-[10px] block text-right">{iot.lastPingTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 11: EXTERNAL CONNECTORS */}
      {activeTab === 'mod11-connectors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 11</span>
            <h2 className="text-xl font-bold text-white mt-1">External ERP &amp; Government System Connectors</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_EXTERNAL_ERP_CONNECTORS.map((erp) => (
              <div key={erp.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-cyan-400 font-bold">{erp.connectorCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{erp.externalSystemName}</h3>
                    <span className="text-slate-400 text-[10px]">Type: {erp.integrationType}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{erp.lastSyncStatus}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-300">
                  <span>24h Synced: <strong className="text-white">{erp.recordsSynced24h.toLocaleString()} Records</strong></span>
                  <span>Latency: <strong className="text-cyan-300">{erp.syncLatencySec}s</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 12: SECURITY PLATFORM */}
      {activeTab === 'mod12-security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 12</span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise API Security, Vault &amp; TLS Certificates</h2>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-emerald-400 font-bold text-xs">✓ Active Security Controls</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div>• <strong>HMAC SHA-256 Signatures:</strong> All webhook payloads cryptographically signed before dispatch.</div>
              <div>• <strong>API Key Vault &amp; Key Rotation:</strong> Secrets managed in cloud vault with automated 90-day rotation.</div>
              <div>• <strong>mTLS (Mutual TLS):</strong> Required for direct Bank API and Government GST Portal communication.</div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 14: ECOSYSTEM BRIDGES */}
      {activeTab === 'mod14-ecosystem' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Module 14</span>
            <h2 className="text-xl font-bold text-white mt-1">Cross-Platform iPaaS Integration Bridges</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
              <div>
                <strong className="text-white block">iPaaS ↔ Mining Operations</strong>
                <span className="text-slate-400 text-[10px]">Weighbridge IoT &amp; Pit Telemetry</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">Live Sync</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
              <div>
                <strong className="text-white block">iPaaS ↔ Fleet Logistics</strong>
                <span className="text-slate-400 text-[10px]">GPS Stream &amp; Fuel Sensor Telemetry</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">Live Sync</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
              <div>
                <strong className="text-white block">iPaaS ↔ Finance &amp; Government</strong>
                <span className="text-slate-400 text-[10px]">GST Portal &amp; Bank Host-to-Host UPI</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">Live Sync</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
              <div>
                <strong className="text-white block">iPaaS ↔ AI Copilot Engine</strong>
                <span className="text-slate-400 text-[10px]">Real-time Event Stream &amp; Prompt Triggers</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">Live Sync</span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 25 REVIEW */}
      {activeTab === 'phase25-review' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Phase 25 Sign-off</span>
            <h2 className="text-xl font-bold text-white mt-1">Phase 25 Architectural Completion Review</h2>
          </div>

          <div className="p-5 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl space-y-3">
            <h3 className="text-cyan-300 font-bold text-sm">✓ Phase 25 Enterprise Integration Platform Sign-off</h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Phase 25 completes the Enterprise Integration Platform (iPaaS), API Gateway, IoT Telemetry &amp; Digital Ecosystem for RZ® Minetrix BOS. It provides secure REST/GraphQL API Gateways, Webhook Event Buses with DLQ Retries, Background Message Queues, Bank UPI Gateways, WhatsApp Communication Engines, Weighbridge &amp; Crusher IoT Telemetry, and Bi-Directional SAP/Govt ERP Connectors across all 10 business domains.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] pt-2">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Gateway Status</span>
                <strong className="text-cyan-400 text-sm">99.99% SLA Active</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">IoT Devices Live</span>
                <strong className="text-emerald-400 text-sm">184 Connected</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Queue Processed</span>
                <strong className="text-purple-400 text-sm">12,400 Jobs/Day</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ecosystem Bridges</span>
                <strong className="text-emerald-400 text-sm">Full BOS Coverage</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
