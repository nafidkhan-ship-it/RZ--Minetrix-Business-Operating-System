import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Server,
  Zap,
  Shield,
  Gauge,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Cpu,
  Layers,
  Lock,
  Clock,
  HardDrive,
  Users,
  MessageSquare,
  Globe,
  Radio,
  Sliders,
  Check,
  ArrowUpRight,
  TrendingUp,
  Play
} from 'lucide-react';
import { rzChatService } from '../services/rzChatService';
import {
  ProductionHealthMetrics,
  SystemHealthCheck,
  LoadTestScenarioResult,
  PerformanceAuditReport,
  BackupStatusInfo,
  BackgroundJobRecord
} from '../types/rzChatTypes';

interface ProductionHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductionHealthModal: React.FC<ProductionHealthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'load_test' | 'audit' | 'realtime' | 'security' | 'health' | 'jobs'>('load_test');

  const [healthMetrics, setHealthMetrics] = useState<ProductionHealthMetrics>(rzChatService.getProductionHealthMetrics());
  const [systemHealth, setSystemHealth] = useState<SystemHealthCheck>(rzChatService.getSystemHealthCheck());
  const [auditReport, setAuditReport] = useState<PerformanceAuditReport>(rzChatService.getPerformanceAuditReport());
  const [backupInfo, setBackupInfo] = useState<BackupStatusInfo>(rzChatService.getBackupStatusInfo());

  const [activeLoadTest, setActiveLoadTest] = useState<LoadTestScenarioResult | null>(null);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState<boolean>(false);
  const [loadTestUsers, setLoadTestUsers] = useState<5000 | 10000 | 20000>(20000);

  const [backgroundJobs, setBackgroundJobs] = useState<BackgroundJobRecord[]>(rzChatService.getBackgroundJobs());
  const [isProcessingJobs, setIsProcessingJobs] = useState<boolean>(false);

  const [rateLimitTestResult, setRateLimitTestResult] = useState<{ allowed: boolean; remaining: number } | null>(null);
  const [reconnectResult, setReconnectResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setHealthMetrics(rzChatService.getProductionHealthMetrics());
    setSystemHealth(rzChatService.getSystemHealthCheck());
    setAuditReport(rzChatService.getPerformanceAuditReport());
    setBackupInfo(rzChatService.getBackupStatusInfo());
    setBackgroundJobs([...rzChatService.getBackgroundJobs()]);
  };

  const runLoadTest = (users: 5000 | 10000 | 20000) => {
    setLoadTestUsers(users);
    setIsSimulatingLoad(true);
    setTimeout(() => {
      const res = rzChatService.runLoadTestSimulation(users);
      setActiveLoadTest(res);
      setIsSimulatingLoad(false);
      refreshData();
    }, 800);
  };

  const handleProcessJobs = () => {
    setIsProcessingJobs(true);
    setTimeout(() => {
      rzChatService.processPendingBackgroundJobs();
      setBackgroundJobs([...rzChatService.getBackgroundJobs()]);
      setIsProcessingJobs(false);
      refreshData();
    }, 600);
  };

  const handleTestRateLimit = () => {
    const res = rzChatService.checkRateLimitSlidingWindow('test_api_client_ip', 60, 60);
    setRateLimitTestResult(res);
  };

  const handleTestSyncReconnect = () => {
    const res = rzChatService.syncOnReconnect();
    setReconnectResult(`${res.status} (Synced ${res.syncedMessagesCount} messages)`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Production Readiness &amp; 5K–20K Scalability Monitor</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Phase 35 Complete
                </span>
              </div>
              <p className="text-xs text-slate-400">RZ Minetrix ERP + RZ Chat Platform SLA &amp; Optimization Suite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-3 bg-slate-950/40 border-b border-slate-800 shrink-0 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div>
              <div className="text-slate-400">Registered Users</div>
              <div className="text-base font-bold text-emerald-400">{healthMetrics.registeredUsersCount.toLocaleString()}</div>
            </div>
            <Users className="w-5 h-5 text-emerald-400/50" />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div>
              <div className="text-slate-400">Active Realtime Connections</div>
              <div className="text-base font-bold text-cyan-400">{healthMetrics.activeRealtimeConnections.toLocaleString()}</div>
            </div>
            <Radio className="w-5 h-5 text-cyan-400/50 animate-pulse" />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div>
              <div className="text-slate-400">DB Avg Query Time</div>
              <div className="text-base font-bold text-amber-400">{healthMetrics.dbQueryTimeAvgMs} ms</div>
            </div>
            <Zap className="w-5 h-5 text-amber-400/50" />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div>
              <div className="text-slate-400">Cache Hit Rate</div>
              <div className="text-base font-bold text-indigo-400">{healthMetrics.cacheHitRatePercent}%</div>
            </div>
            <Server className="w-5 h-5 text-indigo-400/50" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 bg-slate-900 border-b border-slate-800 overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab('load_test')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'load_test'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gauge className="w-4 h-4" />
            5K–20K Load Testing
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Performance Audit
          </button>
          <button
            onClick={() => setActiveTab('realtime')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'realtime'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            Realtime &amp; Presence
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            Security &amp; Rate Limits
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'health'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-4 h-4" />
            Health &amp; Backups
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Background Jobs ({backgroundJobs.filter(j => j.status === 'pending').length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 grow">
          {/* TAB 1: LOAD TESTING */}
          {activeTab === 'load_test' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base">5,000 to 20,000 User Concurrency Load Benchmark</h3>
                  <p className="text-xs text-slate-400">
                    Simulates simultaneous message deliveries, business discovery queries, and presence updates under peak SLA load.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => runLoadTest(5000)}
                    disabled={isSimulatingLoad}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-600 transition cursor-pointer"
                  >
                    Test 5K Users
                  </button>
                  <button
                    onClick={() => runLoadTest(10000)}
                    disabled={isSimulatingLoad}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-600 transition cursor-pointer"
                  >
                    Test 10K Users
                  </button>
                  <button
                    onClick={() => runLoadTest(20000)}
                    disabled={isSimulatingLoad}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    {isSimulatingLoad ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                    )}
                    Run 20K SLA Test
                  </button>
                </div>
              </div>

              {/* Benchmark Results Display */}
              {activeLoadTest ? (
                <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-4 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-white text-sm">
                        Load Test Results — {activeLoadTest.targetUsers.toLocaleString()} Registered Users Scenario
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      STATUS: {activeLoadTest.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Concurrent Users</div>
                      <div className="text-lg font-bold text-white">{activeLoadTest.concurrentUsers.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Throughput</div>
                      <div className="text-lg font-bold text-emerald-400">{activeLoadTest.reqPerSecond.toLocaleString()} req/sec</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Avg / P99 Latency</div>
                      <div className="text-lg font-bold text-amber-400">{activeLoadTest.avgLatencyMs}ms / {activeLoadTest.p99LatencyMs}ms</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Message Delivery SLA</div>
                      <div className="text-lg font-bold text-cyan-400">{activeLoadTest.messageDeliveryMs}ms (&lt;50ms)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs border-t border-slate-800 pt-3">
                    <div>
                      <span className="text-slate-400">DB CPU Load:</span> <span className="text-slate-200 font-bold">{activeLoadTest.dbLoadPercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Server RAM Usage:</span> <span className="text-slate-200 font-bold">{activeLoadTest.memoryMB} MB</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Error Rate:</span> <span className="text-emerald-400 font-bold">{activeLoadTest.errorRatePercent}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                  Click <span className="text-emerald-400 font-bold">Run 20K SLA Test</span> above to simulate peak load benchmarks.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUDIT & INDEXES */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Active Database Indexes</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{auditReport.activeDatabaseIndexesCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Users, Conv, Msgs, Status, Enquiries</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Unbounded Queries Found</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{auditReport.unboundedQueriesDetected}</div>
                  <div className="text-[11px] text-slate-500 mt-1">100% cursor paginated</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">P50 / P95 / P99 Query Speed</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">
                    {auditReport.databaseQueryP50Ms}ms / {auditReport.databaseQueryP95Ms}ms / {auditReport.databaseQueryP99Ms}ms
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Target SLA &lt;20ms</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Applied Scalability Optimizations (20K Users Ready)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {auditReport.optimizationsApplied.map((opt, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="text-slate-200">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REALTIME & PRESENCE */}
          {activeTab === 'realtime' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <span className="font-bold text-white text-sm">Realtime Connection &amp; Throttling Status</span>
                  </div>
                  <button
                    onClick={handleTestSyncReconnect}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-600 transition cursor-pointer"
                  >
                    Simulate Sync on Reconnect
                  </button>
                </div>

                {reconnectResult && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    {reconnectResult}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans font-bold text-sm">Presence Throttling</div>
                    <p className="text-slate-300 font-sans">
                      Heartbeat writes are throttled to a maximum of 1 update per 30 seconds per user. Avoids DB write exhaustion during high concurrency.
                    </p>
                    <div className="text-emerald-400 font-bold">Throttling Active (30s Window)</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans font-bold text-sm">Typing Indicator Ephemeral Engine</div>
                    <p className="text-slate-300 font-sans">
                      Typing state auto-expires after 4 seconds of inactivity. Kept strictly in memory pub/sub without database persistence.
                    </p>
                    <div className="text-cyan-400 font-bold">Auto-Expiry Enabled (4s Timer)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & RATE LIMITS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white text-sm">Sliding Window Rate Limiter Test</span>
                  </div>
                  <button
                    onClick={handleTestRateLimit}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition cursor-pointer"
                  >
                    Test Rate Limit Bucket
                  </button>
                </div>

                {rateLimitTestResult && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono flex items-center justify-between">
                    <div>
                      Allowed: <span className="text-emerald-400 font-bold">{String(rateLimitTestResult.allowed)}</span>
                    </div>
                    <div>
                      Remaining Tokens in Window: <span className="text-amber-400 font-bold">{rateLimitTestResult.remaining} / 60</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white">Active View Suppression</div>
                    <div className="text-slate-400">Push notifications suppressed when user is in the open chat screen.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white">Zero ERP Secret Leak</div>
                    <div className="text-slate-400">Public profile queries scrub ERP financial tokens and internal staff notes.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white">Idempotency Keys</div>
                    <div className="text-slate-400">Client-generated UUID idempotency prevents duplicate message posts.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HEALTH & BACKUPS */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  System Health Component Status
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                  {Object.entries(systemHealth.components).map(([comp, status]) => (
                    <div key={comp} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="capitalize text-slate-300">{comp}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {String(status).toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Automated Backup &amp; Disaster Recovery Metadata</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    RESTORE VERIFIED
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Last Snapshot:</span> {new Date(backupInfo.lastAutomatedBackup).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-slate-400">Backup Size:</span> {backupInfo.backupSizeMB} MB
                  </div>
                  <div>
                    <span className="text-slate-400">Recovery Point Objective (RPO):</span> {backupInfo.recoveryPointObjectiveMinutes} mins
                  </div>
                  <div>
                    <span className="text-slate-400">Recovery Time Objective (RTO):</span> {backupInfo.recoveryTimeObjectiveMinutes} mins
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BACKGROUND JOBS */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">Asynchronous Background Job Queue</h4>
                <button
                  onClick={handleProcessJobs}
                  disabled={isProcessingJobs || backgroundJobs.filter(j => j.status === 'pending').length === 0}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  {isProcessingJobs && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Process Pending Queue
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {backgroundJobs.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                    No background jobs queued.
                  </div>
                ) : (
                  backgroundJobs.map(job => (
                    <div key={job.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{job.id} — <span className="text-cyan-400">{job.jobType}</span></div>
                        <div className="text-[11px] text-slate-400">Payload: {JSON.stringify(job.payload)}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div>
            System Status: <span className="text-emerald-400 font-bold">🟢 HEALTHY</span> | Uptime: {Math.floor(healthMetrics.uptimeSeconds / 3600)}h {Math.floor((healthMetrics.uptimeSeconds % 3600) / 60)}m
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
