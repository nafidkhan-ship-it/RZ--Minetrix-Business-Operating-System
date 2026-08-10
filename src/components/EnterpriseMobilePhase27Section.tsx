import React, { useState } from 'react';
import {
  Smartphone,
  WifiOff,
  Mic,
  Camera,
  MapPin,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Truck,
  HardHat,
  FileText,
  Scan,
  Volume2,
  Radio,
  Sliders,
  Play,
  Layers,
  Database,
  Lock,
  Cpu,
  Globe,
  Plus,
  Send,
  Eye,
  Activity,
  Award,
  HelpCircle,
  CreditCard,
  QrCode,
  Wallet,
  MessageSquare,
  Compass,
  BatteryCharging,
  Printer,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import {
  MOCK_MOBILE_ROLES,
  MOCK_OFFLINE_SYNC_QUEUE,
  MOCK_FIELD_INSPECTIONS,
  MOCK_DIGITAL_IDS,
  MOCK_MOBILE_WALLETS,
  MOCK_REGISTERED_DEVICES,
  MOCK_COMMUNICATION_MESSAGES,
  MOCK_LIVE_COMMAND_CENTER,
  MOCK_PHASE27_MODULES,
  MOCK_PHASE27_METRICS,
  MOCK_MODULAR_PLUGINS,
  MOCK_DIGITAL_TWIN,
  MOCK_CAMERA_AI_DETECTIONS,
  MOCK_WEIGHBRIDGE_SLIPS,
  MOCK_DRONE_MISSIONS,
  MOCK_EMERGENCY_ALERTS,
  MOCK_EXECUTIVE_BRIEFINGS,
  MOCK_FUTURE_TECH_CAPABILITIES,
  OfflineSyncQueueItem,
  MobileUserRole,
  DigitalIdentityCard,
  MobileWalletAccount,
  RegisteredMdmDevice
} from '../data/enterpriseMobilePhase27Data';
import { RZLogo } from './RZLogo';

interface EnterpriseMobilePhase27SectionProps {
  showToast?: (msg: string) => void;
}

export const EnterpriseMobilePhase27Section: React.FC<EnterpriseMobilePhase27SectionProps> = ({
  showToast = (msg: string) => alert(msg)
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'super-app-roles'
    | 'digital-id-wallet'
    | 'offline-sync-engine'
    | 'camera-ocr-voice'
    | 'mdm-security'
    | 'command-center-comms'
    | 'payments-wearables'
    | 'flagship-46-60'
    | 'modules-overview'
    | 'flutter-architecture'
  >('super-app-roles');

  // Plugins Manager state
  const [pluginList, setPluginList] = useState(MOCK_MODULAR_PLUGINS);
  
  // Smart Camera AI Detector State
  const [selectedCamAiType, setSelectedCamAiType] = useState<'Stone Counting AI' | 'ANPR License Plate' | 'PPE & Helmet Check' | 'Crack Detection'>('ANPR License Plate');
  const [simulatedVisionResult, setSimulatedVisionResult] = useState<string | null>(null);
  const [isVisionScanning, setIsVisionScanning] = useState<boolean>(false);

  // Weighbridge Slip Generator State
  const [wbVehicle, setWbVehicle] = useState<string>('RJ-06-GB-8821');
  const [wbGross, setWbGross] = useState<number>(48.25);
  const [wbTare, setWbTare] = useState<number>(16.10);
  const [generatedSlip, setGeneratedSlip] = useState<boolean>(false);

  // Drone Survey Calculator State
  const [stockpileHeight, setStockpileHeight] = useState<number>(18.5);
  const [calculatedVolume, setCalculatedVolume] = useState<number>(42800);

  // Emergency SOS State
  const [sosActive, setSosActive] = useState<boolean>(false);

  // Executive Role View State
  const [selectedExecRole, setSelectedExecRole] = useState<'CEO App' | 'COO App' | 'CFO App'>('CEO App');

  // Handle Dynamic Plugin Download Toggle
  const handleTogglePluginDownload = (pluginId: string) => {
    setPluginList(prev => prev.map(p => {
      if (p.pluginId === pluginId) {
        const nextStatus = p.status === 'Installed' ? 'Available for Download' : 'Installed';
        showToast(`Plugin [${p.moduleName}] ${nextStatus === 'Installed' ? 'Downloaded & Dynamic Route Injected' : 'Unloaded'}`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Run Smart Camera AI Scan Simulation
  const handleRunVisionAiScan = () => {
    setIsVisionScanning(true);
    setSimulatedVisionResult(null);
    setTimeout(() => {
      setIsVisionScanning(false);
      if (selectedCamAiType === 'ANPR License Plate') {
        setSimulatedVisionResult('ANPR AI Match: Plate RJ-06-GB-8821 detected (99.8% confidence). Gate Pass verified.');
      } else if (selectedCamAiType === 'Stone Counting AI') {
        setSimulatedVisionResult('Stone Counting AI: Grain Distribution 60% 20mm, 30% 10mm, 10% Dust. No oversize stone.');
      } else if (selectedCamAiType === 'PPE & Helmet Check') {
        setSimulatedVisionResult('PPE AI Vision: 14 Safety Helmets detected. 1 High-Vis Vest missing in Sector 2.');
      } else {
        setSimulatedVisionResult('Crack Detection AI: Micro-crack inspection 0.015mm on Crusher Arm (Safe tolerance).');
      }
      showToast(`Smart Camera AI scan completed for [${selectedCamAiType}]!`);
    }, 500);
  };

  // Role Simulator State
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-1');
  const selectedRole = MOCK_MOBILE_ROLES.find(r => r.roleId === selectedRoleId) || MOCK_MOBILE_ROLES[0];

  // Offline Sync Queue State
  const [syncQueue, setSyncQueue] = useState<OfflineSyncQueueItem[]>(MOCK_OFFLINE_SYNC_QUEUE);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Camera OCR & Voice Command Interactive Simulator
  const [cameraOcrResult, setCameraOcrResult] = useState<string | null>(null);
  const [isScanningOcr, setIsScanningOcr] = useState<boolean>(false);

  const [voiceCommandText, setVoiceCommandText] = useState<string>('');
  const [voiceProcessing, setVoiceProcessing] = useState<boolean>(false);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);

  // UPI Payment State Simulator
  const [upiAmount, setUpiAmount] = useState<number>(12500);
  const [generatedUpiQr, setGeneratedUpiQr] = useState<string | null>(null);

  // Search Filter for 45 Modules
  const [moduleSearch, setModuleSearch] = useState<string>('');

  // Trigger Offline Queue Sync
  const handleTriggerBackgroundSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSyncQueue(prev =>
        prev.map(item => ({ ...item, syncStatus: 'Synced' }))
      );
      setIsSyncing(false);
      showToast('Smart Offline Isar/SQLite Sync Engine executed! 100% of pending outbox queue synchronized.');
    }, 600);
  };

  // Add Offline Transaction
  const handleAddOfflineTicket = () => {
    const newId = `SYNC-${Math.floor(88100 + Math.random() * 1000)}`;
    const newItem: OfflineSyncQueueItem = {
      id: newId,
      entityType: 'WEIGHBRIDGE_TICKET',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      syncStatus: 'Pending Sync',
      offlineStorageKey: `sqlite_wb_${newId.toLowerCase()}`,
      payloadSummary: `Offline Entry • Gross 44.8 MT • Quarry Pit #2 • Tipper RJ-06-GA-9912`,
      gpsCoordinates: '25.3488° N, 74.6399° E'
    };
    setSyncQueue([newItem, ...syncQueue]);
    showToast(`Created offline weighbridge transaction [${newId}] stored in encrypted local SQLite!`);
  };

  // Simulate Camera Ticket OCR Scan
  const handleScanTicketOcr = () => {
    setIsScanningOcr(true);
    setCameraOcrResult(null);
    setTimeout(() => {
      setIsScanningOcr(false);
      setCameraOcrResult(
        'OCR Match: Ticket #WB-2026-99182 | Vehicle: RJ-06-GB-8821 | Gross: 48.40 MT | Tare: 14.20 MT | Net Aggregate: 34.20 MT | Confidence: 99.4%'
      );
      showToast('Camera ML-Kit OCR successfully extracted weighbridge ticket data!');
    }, 500);
  };

  // Simulate Voice Command AI Assistant
  const handleExecuteVoiceCommand = (cmd: string) => {
    setVoiceCommandText(cmd);
    setVoiceProcessing(true);
    setVoiceResponse(null);
    setTimeout(() => {
      setVoiceProcessing(false);
      if (cmd.includes('attend')) {
        setVoiceResponse('Voice Action Executed: Marked Geofenced Attendance for Driver Sukhwinder Singh. GPS verified at Bhilwara Yard.');
      } else if (cmd.includes('stock')) {
        setVoiceResponse('Voice Action Executed: Current 40mm Aggregate stock at Chittorgarh Yard is 14,280 MT. Reorder threshold healthy.');
      } else if (cmd.includes('dispatch')) {
        setVoiceResponse('Voice Action Executed: Generated Offline Gate Pass #GP-2026-1189 for Tipper RJ-06-GA-4412.');
      } else {
        setVoiceResponse(`Voice Action Executed: Processing voice intent "${cmd}" via Gemini 2.5 Flash Field Assistant.`);
      }
      showToast(`Voice Assistant executed command: "${cmd}"`);
    }, 400);
  };

  // Generate UPI QR Code
  const handleGenerateUpiQr = () => {
    setGeneratedUpiQr(`upi://pay?pa=rzminetrix@icici&pn=RZMinetrixBOS&am=${upiAmount}&cu=INR&tn=Collection_Receipt_${Date.now()}`);
    showToast(`Dynamic UPI QR code generated for ₹${upiAmount.toLocaleString()}! Offline thermal printer receipt ready.`);
  };

  // Filtered modules
  const filteredModules = MOCK_PHASE27_MODULES.filter(m =>
    m.moduleTitle.toLowerCase().includes(moduleSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(moduleSearch.toLowerCase()) ||
    m.description.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Phase 27 Enterprise Mobile Platform (Flagship)
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" /> Modules 1–60 Complete Enterprise Suite
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RZLogo variant="full" size="lg" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono mt-2">
              Enterprise Mobile Platform, Digital Twin, Smart AI &amp; Executive Command
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl font-mono">
              Dynamic Super App Plugins, Live Digital Twin Map, Smart Camera Vision AI, Smart Weighbridge Station, Drone Surveys, Emergency SOS, Offline AI, Executive C-Suite Apps &amp; Future Tech (CarPlay/Wear OS/AR).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            <button
              onClick={handleTriggerBackgroundSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isSyncing ? 'Syncing SQLite...' : 'Trigger Offline Sync Engine'}
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Active Devices</span>
            <strong className="text-amber-400 text-xs font-black">{MOCK_PHASE27_METRICS.totalRegisteredMobileDevices.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Offline Sync Rate</span>
            <strong className="text-emerald-400 text-xs font-black">{MOCK_PHASE27_METRICS.offlineSyncSuccessRatePercent}%</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Digital IDs</span>
            <strong className="text-cyan-300 text-xs font-black">{MOCK_PHASE27_METRICS.totalDigitalIdsIssued.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Mobile Wallets</span>
            <strong className="text-indigo-300 text-xs font-black">{MOCK_PHASE27_METRICS.activeMobileWalletsCount.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Digital Twin Entities</span>
            <strong className="text-emerald-300 text-xs font-black">{MOCK_PHASE27_METRICS.activeDigitalTwinEntities} Live</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">AI Vision Scans/Day</span>
            <strong className="text-amber-300 text-xs font-black">{MOCK_PHASE27_METRICS.dailyAiVisionScans.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Drone 3D Surveys</span>
            <strong className="text-purple-300 text-xs font-black">{MOCK_PHASE27_METRICS.droneSurveysCompleted} Completed</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">SOS Emergency Response</span>
            <strong className="text-rose-400 text-xs font-black">{MOCK_PHASE27_METRICS.emergencySosResponseAvgMin} min</strong>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {[
          { id: 'flagship-46-60', label: 'Modules 46–60 Flagship Suite', icon: Sparkles },
          { id: 'super-app-roles', label: '12 Super App Roles', icon: Smartphone },
          { id: 'digital-id-wallet', label: 'Digital ID & Wallets', icon: QrCode },
          { id: 'offline-sync-engine', label: 'Offline Isar/SQLite Sync', icon: WifiOff },
          { id: 'camera-ocr-voice', label: 'Camera OCR & Voice AI', icon: Camera },
          { id: 'mdm-security', label: 'MDM & Device Security', icon: ShieldCheck },
          { id: 'command-center-comms', label: 'Command Center & Comms', icon: MapPin },
          { id: 'payments-wearables', label: 'UPI Payments & Thermal Printer', icon: CreditCard },
          { id: 'modules-overview', label: '60 Modules Matrix', icon: Layers },
          { id: 'flutter-architecture', label: 'Flutter Architecture Spec', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 0: FLAGSHIP MODULES 46 - 60 ENTERPRISE SUITE */}
      {activeTab === 'flagship-46-60' && (
        <div className="space-y-6">
          {/* MODULE 46 & 47: SUPER APP DYNAMIC PLUGINS & DIGITAL TWIN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MODULE 46: DYNAMIC PLUGIN MANAGER */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Module 46 • Super App Platform</span>
                  <h3 className="text-white font-bold text-base mt-0.5">Dynamic Module Download &amp; Plugins</h3>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold rounded-full">
                  Tenant Dynamic Loader
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-normal">
                On-demand Flutter dynamic module injection for Mining, Fleet, Building Materials, Finance, HRMS, CRM, Marketplace &amp; Offline AI Copilot.
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {pluginList.map((plugin) => (
                  <div key={plugin.pluginId} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-bold">{plugin.moduleName}</strong>
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">{plugin.category}</span>
                      </div>
                      <span className="text-slate-500 text-[10px] block mt-0.5">Size: {plugin.downloadSizeMb} MB • Version: {plugin.version}</span>
                    </div>

                    <button
                      onClick={() => handleTogglePluginDownload(plugin.pluginId)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer transition ${
                        plugin.status === 'Installed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500 text-slate-950 font-black hover:bg-amber-400'
                      }`}
                    >
                      {plugin.status === 'Installed' ? '✓ Installed' : 'Download Plugin'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MODULE 47: DIGITAL TWIN MOBILE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Module 47 • Spatial Intelligence</span>
                  <h3 className="text-white font-bold text-base mt-0.5">Live Digital Twin Mobile Map</h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Live IoT Mesh
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-normal">
                Real-time 3D spatial twin rendering quarry pit faces, crusher belt vibration, tipper fleets, stockpiles, and active workforce.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_DIGITAL_TWIN.map((dt) => (
                  <div key={dt.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-amber-300 font-bold text-[11px]">{dt.entityName}</strong>
                      <span className="px-1.5 py-0.5 bg-slate-900 text-emerald-400 text-[9px] rounded font-bold border border-emerald-500/20">{dt.status}</span>
                    </div>
                    <span className="text-slate-400 text-[10px] block font-mono">GPS: {dt.liveGps}</span>
                    <p className="text-slate-300 text-[10px] leading-tight bg-slate-900/80 p-2 rounded border border-slate-800">{dt.metricsSummary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MODULE 48 & 49: SMART CAMERA AI VISION & SMART WEIGHBRIDGE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MODULE 48: SMART CAMERA AI VISION */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Module 48 • Edge Computer Vision</span>
                  <h3 className="text-white font-bold text-base mt-0.5">Smart Camera AI Suite</h3>
                </div>
                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold rounded-full">
                  TensorFlow Lite GPU
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['ANPR License Plate', 'Stone Counting AI', 'PPE & Helmet Check', 'Crack Detection'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedCamAiType(type)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedCamAiType === type
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Target AI Engine: <strong className="text-amber-400">{selectedCamAiType}</strong></span>
                  <button
                    onClick={handleRunVisionAiScan}
                    disabled={isVisionScanning}
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {isVisionScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                    {isVisionScanning ? 'Inferencing...' : 'Run Vision AI'}
                  </button>
                </div>

                {simulatedVisionResult ? (
                  <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-xl space-y-1 text-xs">
                    <span className="text-emerald-400 font-bold text-[10px]">VISION INFERENCE MATCH:</span>
                    <p className="text-slate-200 text-xs font-mono">{simulatedVisionResult}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-[11px] text-center">
                    Click "Run Vision AI" to simulate real-time camera inference for {selectedCamAiType}.
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Recent AI Camera Logs:</span>
                {MOCK_CAMERA_AI_DETECTIONS.map(det => (
                  <div key={det.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 font-bold">{det.cameraName}</span>
                    <span className="text-amber-400 font-mono">{det.confidenceScore}% match</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${det.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{det.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MODULE 49: SMART WEIGHBRIDGE MOBILE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Module 49 • Weighbridge Mobility</span>
                  <h3 className="text-white font-bold text-base mt-0.5">Offline Weighbridge &amp; QR Slip Generator</h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">
                  Offline Bluetooth Weighing
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">Vehicle No:</label>
                  <input
                    type="text"
                    value={wbVehicle}
                    onChange={e => setWbVehicle(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">Gross (MT):</label>
                  <input
                    type="number"
                    value={wbGross}
                    onChange={e => setWbGross(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">Tare (MT):</label>
                  <input
                    type="number"
                    value={wbTare}
                    onChange={e => setWbTare(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">NET MATERIAL WEIGHT:</span>
                  <strong className="text-emerald-400 text-sm font-black font-mono">{(wbGross - wbTare).toFixed(2)} MT Aggregate</strong>
                </div>
                <button
                  onClick={() => {
                    setGeneratedSlip(true);
                    showToast(`Generated Smart Weighbridge Ticket for ${wbVehicle} • Net: ${(wbGross - wbTare).toFixed(2)} MT! Saved in SQLite queue.`);
                  }}
                  className="px-3 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" /> Generate QR Weight Slip
                </button>
              </div>

              {generatedSlip && (
                <div className="p-3 bg-slate-950 border border-amber-500/30 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold">WEIGHBRIDGE TICKET #WB-2026-9921</span>
                    <span className="text-emerald-400 text-[9px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">Stored Offline</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">Vehicle: {wbVehicle} • Gross: {wbGross} MT • Tare: {wbTare} MT • Net: {(wbGross - wbTare).toFixed(2)} MT</p>
                  <div className="text-[9px] text-slate-500">QR Encrypted Token: rz_wb_slip_2026_{Math.floor(Math.random()*9000+1000)}_valid</div>
                </div>
              )}
            </div>
          </div>

          {/* MODULE 50 & 51: DRONE SURVEY & EMERGENCY RESPONSE SOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MODULE 50: DRONE MOBILE PLATFORM */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Module 50 • Aerial Photogrammetry</span>
                  <h3 className="text-white font-bold text-base mt-0.5">Drone Mobile Survey &amp; 3D Volume</h3>
                </div>
                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold rounded-full">
                  DJI Matrice 300 Telemetry
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Bhilwara Central Pit 3D Survey</span>
                  <span className="text-amber-400 font-bold">42,800 CuM Estimated</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Automatic GPS photo stitching &amp; point cloud surface mesh processing. Calculates stockpile cut/fill volumes directly on mobile.
                </p>

                <div className="flex items-center gap-3">
                  <label className="text-slate-400 text-[10px]">Stockpile Height Filter (m):</label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={stockpileHeight}
                    onChange={e => {
                      const h = parseFloat(e.target.value);
                      setStockpileHeight(h);
                      setCalculatedVolume(Math.round(h * 2313.5));
                    }}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-amber-400 font-bold text-xs">{stockpileHeight}m</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">CALCULATED STOCKPILE VOLUME:</span>
                  <strong className="text-emerald-400 font-black text-sm">{calculatedVolume.toLocaleString()} CuM</strong>
                </div>
              </div>
            </div>

            {/* MODULE 51: EMERGENCY RESPONSE SOS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Module 51 • Critical Safety</span>
                  <h3 className="text-white font-bold text-base mt-0.5">Emergency Blast SOS &amp; Medical Alert</h3>
                </div>
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> One-Touch Panic
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <strong className="text-white font-bold text-sm block">Quarry Pit Blast Panic SOS Trigger</strong>
                  <span className="text-slate-400 text-xs block">Broadcasting high-priority push alert &amp; GPS coordinates to all 420 personnel.</span>
                </div>
                <button
                  onClick={() => {
                    setSosActive(!sosActive);
                    showToast(sosActive ? 'Emergency SOS Broadcast Disarmed.' : 'CRITICAL EMERGENCY SOS TRIGGERED! Dispatched rescue team & notified Control Tower.');
                  }}
                  className={`px-5 py-3 rounded-2xl font-black text-xs cursor-pointer shadow-xl transition flex items-center gap-2 ${
                    sosActive
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/30'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  {sosActive ? 'SOS BROADCAST ACTIVE' : 'TRIGGER SOS'}
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Active Emergency Incidents:</span>
                {MOCK_EMERGENCY_ALERTS.map(emg => (
                  <div key={emg.alertId} className="p-2.5 bg-slate-950 rounded-xl border border-rose-500/30 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-rose-400 font-bold block">{emg.alertType}</strong>
                      <span className="text-slate-400 text-[10px]">{emg.initiatorName} • {emg.gpsCoordinates}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded font-bold text-[10px]">{emg.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MODULES 55 & 59: EXECUTIVE COMMAND CENTER & C-SUITE APPS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Module 59 • C-Suite Mobility</span>
                <h3 className="text-white font-bold text-base mt-0.5">Executive Mobile Command Center (CEO / COO / CFO Apps)</h3>
              </div>
              <div className="flex gap-2">
                {(['CEO App', 'COO App', 'CFO App'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedExecRole(role)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedExecRole === role
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const exec = MOCK_EXECUTIVE_BRIEFINGS.find(b => b.executiveRole === selectedExecRole) || MOCK_EXECUTIVE_BRIEFINGS[0];
              return (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-amber-400 font-black text-sm">{exec.executiveName}</strong>
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full font-bold text-[10px]">
                      Daily AI Briefing Ready
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 font-mono leading-relaxed">
                    "{exec.aiDailyBriefingText}"
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">ENTERPRISE KPI RUN-RATE:</span>
                      <strong className="text-emerald-400 font-bold text-xs">{exec.kpiSummary}</strong>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 text-[10px]">EMERGENCY ALERTS OVERRIDE:</span>
                      <strong className="text-amber-400 font-bold text-xs">{exec.emergencyAlertCount} Active</strong>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* MODULE 60 & FUTURE TECH MATRIX */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Module 60 • Future Technology</span>
                <h3 className="text-white font-bold text-base mt-0.5">Android Auto, Wear OS, AR &amp; Satellite Readiness</h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">
                5G &amp; Edge AI Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {MOCK_FUTURE_TECH_CAPABILITIES.map((ft, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <strong className="text-amber-300 font-bold text-[11px]">{ft.platformName}</strong>
                    <span className="px-1.5 py-0.5 bg-slate-900 text-cyan-300 text-[9px] rounded font-bold border border-slate-800">{ft.status}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-normal">{ft.useCaseDescription}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: 12 DYNAMIC SUPER APP ROLE SKINS */}
      {activeTab === 'super-app-roles' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Module 28 • Enterprise Super App</span>
              <h2 className="text-xl font-bold text-white mt-1">12 Dynamic Role-Based Mobile UI Skins</h2>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-full text-xs flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> 12 Active Roles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ROLE SELECTOR LIST */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">SELECT ENTERPRISE PERSONA:</span>
              {MOCK_MOBILE_ROLES.map((role) => (
                <button
                  key={role.roleId}
                  onClick={() => setSelectedRoleId(role.roleId)}
                  className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer flex justify-between items-center ${
                    selectedRoleId === role.roleId
                      ? 'bg-slate-950 border-amber-500 ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h3 className="text-white font-bold text-xs">{role.roleName}</h3>
                    <span className="text-slate-400 text-[10px] block mt-0.5">{role.userCategory}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-900 text-amber-400 font-mono font-bold rounded text-[10px]">
                    {role.activeUsersCount}
                  </span>
                </button>
              ))}
            </div>

            {/* DYNAMIC MOBILE MOCKUP DISPLAY */}
            <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-amber-400 font-bold text-xs">{selectedRole.roleName} Mobile Workspace</span>
                    <span className="text-slate-400 text-[10px] block">Suite: {selectedRole.primaryMobileSuite}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  100% Offline Mode
                </span>
              </div>

              {/* SIMULATED MOBILE SCREEN HEADER */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <RZLogo variant="icon" size="sm" showText={false} />
                  <span className="text-amber-400 font-black text-xs">RZ® MINETRIX SUPER APP</span>
                  <span className="px-2 py-0.5 bg-slate-950 text-slate-300 font-mono text-[9px] rounded">09:05 AM</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-[10px] block">ACTIVE MODE</span>
                    <strong className="text-white text-xs">{selectedRole.roleName}</strong>
                  </div>
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded border border-amber-500/20">
                    Role Switched
                  </span>
                </div>
              </div>

              {/* DYNAMIC MENU PERMISSIONS */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">DYNAMIC HOME NAVIGATION MENUS:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.menuPermissions.map((menu, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-900 text-amber-300 border border-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-amber-400" /> {menu}
                    </span>
                  ))}
                </div>
              </div>

              {/* AVAILABLE DASHBOARDS */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">AVAILABLE NATIVE DASHBOARDS:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.dashboardsAvailable.map((dash, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-900 text-emerald-300 border border-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-emerald-400" /> {dash}
                    </span>
                  ))}
                </div>
              </div>

              {/* ROLE SPECIFIC DIRECT ACTION */}
              <button
                onClick={() => showToast(`Launched mobile workspace for role "${selectedRole.roleName}" in selected suite "${selectedRole.primaryMobileSuite}".`)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" /> Launch {selectedRole.roleName} Mobile Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL ID & MOBILE WALLETS */}
      {activeTab === 'digital-id-wallet' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Modules 36 &amp; 37 • Digital Identity &amp; Mobile Wallet</span>
            <h2 className="text-xl font-bold text-white mt-1">Encrypted QR Identity Cards &amp; Multi-Wallet Earnings Engine</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DIGITAL ID CARDS */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" /> Encrypted QR &amp; NFC Digital Identity Cards
              </h3>

              {MOCK_DIGITAL_IDS.map((did) => (
                <div key={did.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-amber-400 font-bold text-xs">{did.idType} ID • {did.id}</span>
                      <h4 className="text-white font-black text-sm">{did.holderName}</h4>
                      <span className="text-slate-400 text-[10px]">{did.roleTitle}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px] flex items-center gap-1">
                      NFC {did.nfcStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">BLOOD GROUP</span>
                      <strong className="text-red-400">{did.bloodGroup}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">EMERGENCY CONTACT</span>
                      <strong className="text-amber-300">{did.emergencyContact}</strong>
                    </div>
                  </div>

                  <p className="text-slate-300 text-[10px] bg-slate-900 p-2 rounded border border-slate-800">
                    Medical Info: {did.medicalInfo}
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[10px]">
                    <span className="text-slate-500">QR Token: <strong className="text-slate-300">{did.qrEncryptedToken}</strong></span>
                    <span className="text-emerald-400 font-bold">Valid Till: {did.validUntil}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* MOBILE WALLETS */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-400" /> Multi-Wallet Account &amp; Trip Earnings
              </h3>

              {MOCK_MOBILE_WALLETS.map((wal) => (
                <div key={wal.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-amber-400 font-bold text-xs">{wal.walletType}</span>
                      <h4 className="text-white font-bold text-xs mt-0.5">{wal.holderName}</h4>
                    </div>
                    <span className="text-2xl font-black text-emerald-400">₹{wal.balanceInr.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-300">
                    <span>UPI ID: <strong className="text-amber-300">{wal.upiId}</strong></span>
                    <span>Last Payout: <strong className="text-slate-400">{wal.lastPayoutDate}</strong></span>
                  </div>

                  <button
                    onClick={() => showToast(`Initiated UPI instant payout claim for ${wal.holderName} [${wal.walletType}] of ₹${wal.balanceInr.toLocaleString()}`)}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Trigger Instant UPI Payout
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SMART OFFLINE ENGINE */}
      {activeTab === 'offline-sync-engine' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Module 29 • Smart Offline Engine</span>
              <h2 className="text-xl font-bold text-white mt-1">Isar &amp; SQLCipher Encrypted Transactional Outbox Queue</h2>
            </div>
            <button
              onClick={handleAddOfflineTicket}
              className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-400"
            >
              <Plus className="w-3.5 h-3.5" /> Add Offline Entry
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase">LOCAL TRANSACTION OUTBOX QUEUE (ISAR / SQLITE):</span>
              <span className="text-slate-400 text-[10px]">
                Pending Items: <strong className="text-amber-400">{syncQueue.filter(i => i.syncStatus !== 'Synced').length}</strong>
              </span>
            </div>

            <div className="space-y-2">
              {syncQueue.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold font-mono">{item.id}</span>
                      <span className="px-2 py-0.5 bg-slate-900 text-slate-300 font-mono text-[10px] rounded border border-slate-800">
                        {item.entityType}
                      </span>
                      <span className="text-slate-500 text-[10px]">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-200 text-xs font-mono">{item.payloadSummary}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>GPS: <strong className="text-cyan-300">{item.gpsCoordinates}</strong></span>
                      <span>Key: <strong className="text-slate-300">{item.offlineStorageKey}</strong></span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 font-bold rounded-full text-[10px] shrink-0 ${
                      item.syncStatus === 'Synced'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {item.syncStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CAMERA OCR & VOICE AI */}
      {activeTab === 'camera-ocr-voice' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Modules 31 &amp; 35 • Document OCR &amp; AI Copilot</span>
            <h2 className="text-xl font-bold text-white mt-1">Google ML-Kit Camera OCR &amp; Multi-Lingual Speech Engine</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CAMERA OCR SCANNER */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" /> Weighbridge Ticket OCR &amp; ANPR License Plate Scanner
              </h3>

              <div className="p-6 bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl text-center space-y-3">
                <Scan className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-slate-300 text-xs">Position weighbridge ticket or truck license plate inside camera viewfinder</p>
                <button
                  onClick={handleScanTicketOcr}
                  disabled={isScanningOcr}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs cursor-pointer hover:bg-amber-400 transition"
                >
                  {isScanningOcr ? 'Scanning with Google ML Kit...' : 'Capture & Extract OCR Data'}
                </button>
              </div>

              {cameraOcrResult && (
                <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs leading-relaxed font-mono">
                  {cameraOcrResult}
                </div>
              )}
            </div>

            {/* VOICE COMMAND ASSISTANT */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" /> Multi-Lingual Voice Command Engine (Hindi / English / Gujarati)
              </h3>

              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] font-bold block">TEST PRESET VOICE COMMANDS:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Mark Attendance for Sukhwinder Singh',
                    'Check Aggregate Stock at Chittorgarh Yard',
                    'Issue Gate Pass for Tipper RJ-06-GA-4412'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExecuteVoiceCommand(preset)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-[11px] rounded-lg cursor-pointer transition flex items-center gap-1.5"
                    >
                      <Mic className="w-3 h-3 text-amber-400" /> {preset}
                    </button>
                  ))}
                </div>
              </div>

              {voiceProcessing && (
                <div className="p-3 bg-slate-900 rounded-xl text-amber-400 text-xs animate-pulse">
                  Processing Voice STT intent via Gemini 2.5 Flash On-Device Whisper Model...
                </div>
              )}

              {voiceResponse && (
                <div className="p-3.5 bg-slate-900 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-mono leading-relaxed">
                  {voiceResponse}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MDM & DEVICE SECURITY */}
      {activeTab === 'mdm-security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Modules 33 &amp; 34 • Smart Device Management &amp; Security</span>
            <h2 className="text-xl font-bold text-white mt-1">MDM Rugged Device Telemetry &amp; Hardware Keystore Security</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_REGISTERED_DEVICES.map((dev) => (
              <div key={dev.deviceId} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-amber-400 font-bold text-xs">{dev.deviceId} • {dev.deviceType}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{dev.deviceName}</h3>
                    <span className="text-slate-400 text-[10px]">{dev.ownerName}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                    {dev.complianceStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">BATTERY TELEMETRY</span>
                    <strong className="text-emerald-400">{dev.batteryPercent}% Charged</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">NETWORK</span>
                    <strong className="text-cyan-300">{dev.networkStatus}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">APP VERSION</span>
                    <strong className="text-amber-300">{dev.appVersion}</strong>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => showToast(`Executed Remote Lock signal for MDM device [${dev.deviceId}]`)}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-lg text-[10px] font-bold"
                  >
                    Remote Lock Token
                  </button>
                  <button
                    onClick={() => showToast(`Executed Remote Wipe signal for MDM device [${dev.deviceId}]`)}
                    className="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-[10px] font-bold"
                  >
                    Remote Wipe Database
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: COMMAND CENTER & COMMS */}
      {activeTab === 'command-center-comms' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Modules 32 &amp; 38 • Field Command Center &amp; Communication Hub</span>
            <h2 className="text-xl font-bold text-white mt-1">Real-Time Field Telemetry &amp; Multi-Channel Messaging</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LIVE FIELD COMMAND CENTER */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" /> Live Field Workforce &amp; Fleet Command
              </h3>

              {MOCK_LIVE_COMMAND_CENTER.map((cmd) => (
                <div key={cmd.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold">{cmd.entityName}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                      {cmd.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs font-mono">{cmd.gpsLocation}</p>
                  <p className="text-slate-400 text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                    AI Insight: {cmd.aiInsight}
                  </p>
                </div>
              ))}
            </div>

            {/* COMMUNICATION MESSAGES */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" /> Communication Hub &amp; Emergency Alerts
              </h3>

              {MOCK_COMMUNICATION_MESSAGES.map((msg) => (
                <div key={msg.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold">{msg.senderName}</span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-300 font-bold rounded text-[10px]">
                      {msg.channel}
                    </span>
                  </div>
                  <p className="text-slate-200 text-xs leading-normal">{msg.messageText}</p>
                  <div className="flex justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-1">
                    <span>Recipients: {msg.recipientCount}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: UPI PAYMENTS & THERMAL PRINTER */}
      {activeTab === 'payments-wearables' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Modules 41 &amp; 42 • Mobile Payments &amp; Thermal Printer</span>
            <h2 className="text-xl font-bold text-white mt-1">Dynamic UPI QR Cash Collection &amp; Bluetooth Thermal Receipts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" /> Dynamic UPI Collection Generator
              </h3>

              <div className="space-y-2">
                <label className="text-slate-400 text-[10px] font-bold block">COLLECTION AMOUNT (INR):</label>
                <input
                  type="number"
                  value={upiAmount}
                  onChange={(e) => setUpiAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold font-mono text-sm"
                />
              </div>

              <button
                onClick={handleGenerateUpiQr}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" /> Generate Dynamic UPI QR Code
              </button>

              {generatedUpiQr && (
                <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-xl space-y-2 text-center">
                  <span className="text-amber-400 font-bold text-xs block">UPI QR STRING READY:</span>
                  <p className="text-slate-300 text-[10px] break-all font-mono">{generatedUpiQr}</p>
                </div>
              )}
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-400" /> Portable Thermal Printer Hardware Hook
              </h3>
              <p className="text-slate-300 text-xs leading-normal">
                Connected via Bluetooth Serial Port Profile (SPP). ESC/POS command parser formats weighing tickets, gate passes, and cash receipts for instant offline field printing.
              </p>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">PRINTER STATUS:</span>
                <strong className="text-emerald-400">Zebra ZQ521 Connected (100% Paper)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ALL 60 PLATFORM MODULES OVERVIEW */}
      {activeTab === 'modules-overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Phase 27 Extended Architecture</span>
              <h2 className="text-xl font-bold text-white mt-1">60 Complete Enterprise Mobile Platform Modules</h2>
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search 60 mobile modules..."
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredModules.map((mod) => (
              <div key={mod.moduleId} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold text-xs">Module #{mod.moduleId}</span>
                    <span className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded font-bold text-[9px]">{mod.category}</span>
                  </div>
                  <h3 className="text-white font-bold text-xs mt-1">{mod.moduleTitle}</h3>
                  <p className="text-slate-400 text-[11px] mt-1 leading-normal">{mod.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[9px] font-bold block">HARDWARE HOOKS:</span>
                  <div className="flex flex-wrap gap-1">
                    {mod.hardwareHooks.map((h, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-900 text-cyan-300 text-[9px] rounded border border-slate-800">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: FLUTTER & ARCHITECTURE SPEC */}
      {activeTab === 'flutter-architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Developer Documentation</span>
            <h2 className="text-xl font-bold text-white mt-1">Flutter Clean Architecture &amp; Native Bridge Implementation</h2>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-amber-400 font-bold text-xs">Pubspec &amp; Native Plugin Specification</h3>
            <pre className="p-4 bg-slate-900 rounded-xl text-slate-200 text-[11px] font-mono overflow-x-auto border border-slate-800">
{`// pubspec.yaml - RZ® Minetrix BOS Phase 27 Super App
name: rz_minetrix_bos_mobile
version: 27.4.2+100

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  isar: ^3.1.0                         # High-performance NoSQL offline database
  isar_flutter_libs: ^3.1.0
  google_mlkit_text_recognition: ^0.13.0 # Camera OCR Scanner
  geolocator: ^12.0.0                 # Fused Location Provider
  flutter_speech_to_text: ^2.5.0      # Multi-lingual Voice STT
  firebase_messaging: ^15.0.0         # FCM High Priority Alerts
  flutter_secure_storage: ^9.2.0      # Encrypted Hardware Keystore
  razorpay_flutter: ^1.3.0            # Dynamic UPI Payment Checkout
  esc_pos_printer: ^4.1.0             # Portable Thermal Receipt Printer
  qr_flutter: ^4.1.0                  # Encrypted Digital ID QR Generator`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

