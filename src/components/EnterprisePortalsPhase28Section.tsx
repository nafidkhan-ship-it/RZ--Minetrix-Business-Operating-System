import React, { useState } from 'react';
import {
  Users,
  Building2,
  Truck,
  HardHat,
  Briefcase,
  FileText,
  Shield,
  Bot,
  Bell,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  BarChart3,
  Globe,
  Pickaxe,
  Zap,
  Calculator,
  RefreshCw,
  QrCode,
  Lock,
  ArrowRight,
  TrendingUp,
  Download,
  LifeBuoy,
  PhoneCall,
  MessageSquare,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Plug,
  Layout,
  ShoppingBag,
  Palette,
  Crown,
  BookOpen,
  Volume2,
  Smartphone,
  Share2,
  Sliders,
  CheckSquare,
  CreditCard,
  Send,
  ThumbsUp,
  Eye,
  FileCode,
  Paperclip,
  X,
  Plus
} from 'lucide-react';

import {
  MOCK_PORTALS_LIST,
  MOCK_PORTAL_MODULES,
  MOCK_CUSTOMER_ORDERS,
  MOCK_DEALER_STATEMENTS,
  MOCK_SUPPLIER_POS,
  MOCK_CONTRACTOR_BOQS,
  MOCK_SUPPORT_TICKETS,
  MOCK_DOCUMENT_VAULT,
  MOCK_PORTAL_METRICS,
  MOCK_WORKSPACE_TASKS,
  MOCK_WORKSPACE_WALLET,
  MOCK_COLLABORATION_THREADS,
  MOCK_PUBLIC_COMMERCE_CATALOG,
  MOCK_PROCUREMENT_RFQS,
  MOCK_EXECUTIVE_WORKSPACES,
  MOCK_WHITE_LABEL_CONFIG,
  MOCK_KNOWLEDGE_SOPS,
  MOCK_COMMUNITY_TOPICS,
  PortalRoleDefinition
} from '../data/enterprisePortalsPhase28Data';

export const EnterprisePortalsPhase28Section: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'portals-directory'
    | 'unified-workspace-26'
    | 'collaboration-chat-27'
    | 'public-commerce-28'
    | 'construction-procurement-29-30'
    | 'cad-white-label-31-39'
    | 'executive-csuite-37'
    | 'success-platforms-34-36'
    | 'knowledge-community-41-42'
    | 'all-45-modules-matrix'
  >('portals-directory');

  // Search & Category Filters for Portals Directory
  const [portalSearch, setPortalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPortal, setSelectedPortal] = useState<PortalRoleDefinition>(MOCK_PORTALS_LIST[0]);

  // Interactive Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // MODULE 26: Unified Workspace State
  const [tasks, setTasks] = useState(MOCK_WORKSPACE_TASKS);
  const [wallet, setWallet] = useState(MOCK_WORKSPACE_WALLET);
  const [taskFilter, setTaskFilter] = useState('All');

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: t.status === 'Completed' ? 'Pending Approval' : 'Completed' } : t))
    );
    showToast(`Updated task [${taskId}] status.`);
  };

  // MODULE 27: Business Collaboration Chat State
  const [selectedChat, setSelectedChat] = useState(MOCK_COLLABORATION_THREADS[0]);
  const [chatMessages, setChatMessages] = useState<Record<string, { sender: string; text: string; time: string; isAi?: boolean }[]>>({
    'CHAT-101': [
      { sender: 'Vikramaditya (Dealer)', text: 'Hello Minetrix dispatch team, we need urgent 100 MT 20mm aggregate at site #4 in Chittorgarh.', time: '09:00 AM' },
      { sender: 'Minetrix Automated Copilot', text: 'Order #ORD-2026-8810 confirmed with 3 Volvo tippers assigned. ETA: 25 mins.', time: '09:01 AM', isAi: true }
    ],
    'CHAT-102': [
      { sender: 'Gulf Oil Fuel Representative', text: 'Diesel tanker truck RJ-09-GC-4412 carrying 12,000L fuel has passed quarry weighbridge gate #1.', time: '08:42 AM' }
    ],
    'CHAT-103': [
      { sender: 'L&T Senior Resident Engineer', text: 'Sharing revised AutoCAD drawing file for bridge pillar pour #3. Please verify aggregate sizing.', time: '08:15 AM' }
    ]
  });
  const [newMsgText, setNewMsgText] = useState('');

  const handleSendMessage = () => {
    if (!newMsgText.trim()) return;
    const threadId = selectedChat.threadId;
    const userMsg = { sender: 'You (Portal Administrator)', text: newMsgText, time: 'Just now' };
    setChatMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), userMsg]
    }));
    setNewMsgText('');

    // Simulate AI response
    setTimeout(() => {
      const aiReply = {
        sender: 'Gemini Collaboration Copilot',
        text: `AI Context Engine: Received message regarding ${selectedChat.linkedItem}. Updated thread log & notified relevant logistics dispatch team.`,
        time: 'Just now',
        isAi: true
      };
      setChatMessages(prev => ({
        ...prev,
        [threadId]: [...(prev[threadId] || []), aiReply]
      }));
      showToast('AI Collaboration Agent indexed chat thread and notified stakeholders.');
    }, 700);
  };

  // MODULE 28: Public Digital Commerce State
  const [cartItem, setCartItem] = useState<{ product: typeof MOCK_PUBLIC_COMMERCE_CATALOG[0]; qty: number } | null>(null);
  const [guestPhone, setGuestPhone] = useState('');
  const [isGuestCheckingOut, setIsGuestCheckingOut] = useState(false);

  // MODULE 29 & 30: Construction & Procurement State
  const [calcSqFt, setCalcSqFt] = useState(3200);
  const [calcMaterial, setCalcMaterial] = useState<'Laterite Blocks' | '20mm Aggregate' | 'M-Sand'>('20mm Aggregate');
  const [boqParsed, setBoqParsed] = useState(false);
  const [rfqList, setRfqList] = useState(MOCK_PROCUREMENT_RFQS);

  // MODULE 31 & 39: White Label Branding Config State
  const [branding, setBranding] = useState(MOCK_WHITE_LABEL_CONFIG);
  const [activeTheme, setActiveTheme] = useState<'Amber Gold' | 'Emerald Green' | 'Midnight Cyan' | 'Royal Indigo'>('Amber Gold');

  // MODULE 37: Executive C-Suite Workspace State
  const [execTab, setExecTab] = useState<'ceo' | 'coo' | 'cfo' | 'chro'>('ceo');

  // MODULE 41 & 42: Knowledge & Community State
  const [sops, setSops] = useState(MOCK_KNOWLEDGE_SOPS);
  const [communityTopics, setCommunityTopics] = useState(MOCK_COMMUNITY_TOPICS);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) return;
    const newTop = {
      id: `TOP-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTopicTitle,
      author: 'You (Ecosystem Partner)',
      replies: 0,
      upvotes: 1
    };
    setCommunityTopics([newTop, ...communityTopics]);
    setNewTopicTitle('');
    showToast('Community Forum topic posted successfully!');
  };

  // MODULES 1 - 45 Filter State
  const [moduleSearch, setModuleSearch] = useState('');
  const [moduleCategoryFilter, setModuleCategoryFilter] = useState('All');

  const filteredModules = MOCK_PORTAL_MODULES.filter(m => {
    const matchesSearch =
      m.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      m.description.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      m.subModules.some(s => s.toLowerCase().includes(moduleSearch.toLowerCase()));
    const matchesCat = moduleCategoryFilter === 'All' || m.category === moduleCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 border border-amber-400 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Phase 28 Enterprise Portals Platform
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 45 Enterprise DXP Modules
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono mt-2">
              Enterprise Self-Service Portals &amp; Digital Experience Platform
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl font-mono">
              23 Role-Based Portals &amp; 45 Functional Modules across Unified Digital Workspace, Collaboration Hub, Public Commerce, Construction BOQs, White-Label Branding, C-Suite Center &amp; Ecosystem Matrix.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Exporting Complete Phase 28 Portals Architecture Specification PDF...')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-mono font-bold text-xs rounded-2xl transition cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export DXP Spec
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Portals Deployed</span>
            <strong className="text-amber-400 text-xs font-black">{MOCK_PORTAL_METRICS.totalPortalsDeployed} Self-Service</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Active DXP Users</span>
            <strong className="text-emerald-400 text-xs font-black">{MOCK_PORTAL_METRICS.totalSelfServiceUsers.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Daily Orders</span>
            <strong className="text-cyan-300 text-xs font-black">{MOCK_PORTAL_METRICS.dailyPortalOrdersVolume}</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">AI Bot Deflection</span>
            <strong className="text-indigo-300 text-xs font-black">{MOCK_PORTAL_METRICS.aiBotDeflectionRate}</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Signed Docs/Mo</span>
            <strong className="text-purple-300 text-xs font-black">{MOCK_PORTAL_METRICS.monthlyDocumentsSigned.toLocaleString()}</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">DXP Modules</span>
            <strong className="text-amber-300 text-xs font-black">45 Modules</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">MFA Security</span>
            <strong className="text-emerald-300 text-xs font-black">{MOCK_PORTAL_METRICS.mfaEnforcedUsersPercent}%</strong>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Ecosystem Events</span>
            <strong className="text-rose-400 text-xs font-black">{MOCK_PORTAL_METRICS.ecosystemEventsPerDay}/day</strong>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {[
          { id: 'portals-directory', label: '23 Portals Directory', icon: Globe },
          { id: 'unified-workspace-26', label: 'Module 26 • Unified Workspace', icon: Layout },
          { id: 'collaboration-chat-27', label: 'Module 27 • Collaboration Hub', icon: MessageSquare },
          { id: 'public-commerce-28', label: 'Module 28 • Public Commerce', icon: ShoppingBag },
          { id: 'construction-procurement-29-30', label: 'Modules 29 & 30 • BOQ & RFQs', icon: HardHat },
          { id: 'cad-white-label-31-39', label: 'Modules 31 & 39 • CAD & White Label', icon: Palette },
          { id: 'executive-csuite-37', label: 'Module 37 • C-Suite Center', icon: Crown },
          { id: 'success-platforms-34-36', label: 'Modules 34-36 • Success Hubs', icon: Award },
          { id: 'knowledge-community-41-42', label: 'Modules 41 & 42 • SOPs & Forum', icon: BookOpen },
          { id: 'all-45-modules-matrix', label: 'All 45 Modules Specification Matrix', icon: Layers }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 23 SELF-SERVICE PORTALS DIRECTORY */}
      {activeTab === 'portals-directory' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-amber-400 font-bold uppercase tracking-wider">Enterprise DX Platform</span>
                <h2 className="text-xl font-bold text-white mt-0.5">All 23 Self-Service Enterprise Portals</h2>
              </div>

              {/* SEARCH & CATEGORY FILTER */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search 23 portals..."
                    value={portalSearch}
                    onChange={e => setPortalSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                >
                  <option value="All">All Categories (6)</option>
                  <option value="Commercial & Sales">Commercial &amp; Sales</option>
                  <option value="Production & Infrastructure">Production &amp; Infrastructure</option>
                  <option value="Logistics & Fleet">Logistics &amp; Fleet</option>
                  <option value="Projects & Construction">Projects &amp; Construction</option>
                  <option value="Workforce & Field">Workforce &amp; Field</option>
                  <option value="Ecosystem & Governance">Ecosystem &amp; Governance</option>
                </select>
              </div>
            </div>

            {/* PORTALS GRID & SELECTED DETAIL VIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* PORTAL CARDS LIST */}
              <div className="lg:col-span-2 space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {MOCK_PORTALS_LIST.filter(p => {
                  const mSearch =
                    p.name.toLowerCase().includes(portalSearch.toLowerCase()) ||
                    p.targetAudience.toLowerCase().includes(portalSearch.toLowerCase()) ||
                    p.description.toLowerCase().includes(portalSearch.toLowerCase());
                  const mCat = selectedCategory === 'All' || p.category === selectedCategory;
                  return mSearch && mCat;
                }).map(portal => (
                  <div
                    key={portal.id}
                    onClick={() => setSelectedPortal(portal)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      selectedPortal.id === portal.id
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-lg'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-bold text-sm">{portal.name}</strong>
                        <span className="px-2 py-0.5 bg-slate-900 text-amber-400 border border-amber-500/20 text-[10px] rounded-full font-bold">
                          {portal.category}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {portal.activeUsers.toLocaleString()} Users
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{portal.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {portal.primaryFeatures.slice(0, 4).map((feat, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                          ✓ {feat}
                        </span>
                      ))}
                      {portal.primaryFeatures.length > 4 && (
                        <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-amber-400 font-bold rounded border border-slate-800">
                          +{portal.primaryFeatures.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* SELECTED PORTAL ARCHITECTURE VIEW */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-[10px]">SELECTED PORTAL SPEC:</span>
                    <h3 className="text-amber-400 font-bold text-base mt-0.5">{selectedPortal.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full font-bold text-[10px]">
                    {selectedPortal.securityLevel}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] block">Target Audience:</span>
                  <p className="text-slate-200 text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800">{selectedPortal.targetAudience}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] block">Key Live Performance KPIs:</span>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedPortal.kpis.map((kpi, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">{kpi.label}</span>
                        <strong className="text-emerald-400 font-bold text-xs">{kpi.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">All Configured Portal Capabilities:</span>
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                    {selectedPortal.primaryFeatures.map((feat, idx) => (
                      <div key={idx} className="p-1.5 bg-slate-900 rounded-lg text-slate-300 text-[11px] flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Launched Self-Service Session for [${selectedPortal.name}] with SSO token.`)}
                  className="w-full py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition hover:bg-amber-400 mt-2"
                >
                  <ExternalLink className="w-4 h-4" /> Enter {selectedPortal.name} Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODULE 26 - UNIFIED DIGITAL WORKSPACE */}
      {activeTab === 'unified-workspace-26' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-amber-400 font-bold uppercase tracking-wider">Module 26 • Productivity Command</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Unified Personal Workspace &amp; Digital Wallet</h2>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-xs">
                Single Pane of Glass
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TASKS KANBAN & ACTION ITEMS */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-amber-400" /> My Pending Action Items &amp; Tasks
                  </h3>
                  <div className="flex gap-1">
                    {['All', 'Compliance', 'Finance', 'Engineering'].map(f => (
                      <button
                        key={f}
                        onClick={() => setTaskFilter(f)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          taskFilter === f ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {tasks
                    .filter(t => taskFilter === 'All' || t.category === taskFilter)
                    .map(t => (
                      <div key={t.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-900 text-amber-400 border border-amber-500/20 text-[9px] rounded font-bold">
                              {t.category}
                            </span>
                            <strong className="text-white font-bold text-xs">{t.title}</strong>
                          </div>
                          <p className="text-slate-400 text-[10px]">Due: {t.dueDate} • Priority: <span className="text-rose-400">{t.priority}</span></p>
                        </div>

                        <button
                          onClick={() => handleToggleTask(t.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                            t.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                          }`}
                        >
                          {t.status === 'Completed' ? '✓ Completed' : 'Action'}
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* PERSONAL WALLET & ESCROW */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-amber-400 font-bold text-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> My Digital Wallet &amp; Escrow
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold">UPI / Escrow Sync</span>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 text-[10px] block">AVAILABLE BALANCE:</span>
                  <strong className="text-emerald-400 font-black text-xl">₹{wallet.balanceInr.toLocaleString()}</strong>
                  <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2">
                    <span>Locked Escrow:</span>
                    <strong className="text-amber-400">₹{wallet.escrowInr.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] block font-bold">Recent Wallet Activity:</span>
                  {wallet.recentTransactions.map(tx => (
                    <div key={tx.txId} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-[10px]">
                      <div>
                        <strong className="text-white block">{tx.type}</strong>
                        <span className="text-slate-500">{tx.date}</span>
                      </div>
                      <strong className={tx.type.includes('Credit') ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        ₹{tx.amount.toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => showToast('Disbursed instant wallet balance withdrawal of ₹50,000 via IMPS.')}
                  className="w-full py-2.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-400"
                >
                  <Zap className="w-4 h-4" /> Request Wallet Withdrawal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MODULE 27 - BUSINESS COLLABORATION HUB */}
      {activeTab === 'collaboration-chat-27' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-amber-400 font-bold uppercase tracking-wider">Module 27 • B2B Messaging</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Business Collaboration Hub &amp; Context Chat</h2>
              </div>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full font-bold text-xs">
                PO &amp; AutoCAD Linked Threads
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CHAT THREADS LIST */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] block font-bold">Active B2B Channels:</span>
                {MOCK_COLLABORATION_THREADS.map(th => (
                  <div
                    key={th.threadId}
                    onClick={() => setSelectedChat(th)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                      selectedChat.threadId === th.threadId
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-bold text-xs line-clamp-1">{th.participant}</strong>
                      <span className="px-1.5 py-0.5 bg-slate-900 text-amber-400 border border-amber-500/20 text-[9px] rounded font-bold">
                        {th.channelType}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{th.lastMessage}</p>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1">
                      <span>Linked: {th.linkedItem}</span>
                      <span>{th.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHAT WINDOW */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-[480px]">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-amber-400 font-bold text-sm">{selectedChat.participant}</h3>
                    <span className="text-slate-400 text-[10px]">Context Item: {selectedChat.linkedItem}</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-[10px]">
                    Encrypted Channel
                  </span>
                </div>

                {/* MESSAGES BODY */}
                <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
                  {(chatMessages[selectedChat.threadId] || []).map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl max-w-lg space-y-1 ${
                        msg.isAi
                          ? 'bg-violet-950/40 border border-violet-500/30 ml-auto'
                          : msg.sender.startsWith('You')
                          ? 'bg-amber-500/20 border border-amber-500/30 ml-auto'
                          : 'bg-slate-900 border border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <strong className={msg.isAi ? 'text-violet-400 font-bold' : 'text-amber-300 font-bold'}>{msg.sender}</strong>
                        <span className="text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* CHAT INPUT */}
                <div className="flex gap-2 pt-3 border-t border-slate-900">
                  <input
                    type="text"
                    placeholder="Type message or attach PO/Drawing..."
                    value={newMsgText}
                    onChange={e => setNewMsgText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-400"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MODULE 28 - PUBLIC DIGITAL COMMERCE */}
      {activeTab === 'public-commerce-28' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-amber-400 font-bold uppercase tracking-wider">Module 28 • Guest Checkout &amp; Store</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Public Digital Store, Laterite &amp; Machinery Rentals</h2>
              </div>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full font-bold text-xs">
                No Registration Guest Checkout
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_PUBLIC_COMMERCE_CATALOG.map(item => (
                <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-slate-900 text-amber-400 border border-amber-500/20 text-[9px] font-bold rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">{item.deliveryTime}</span>
                    </div>

                    <strong className="text-white font-bold text-sm block">{item.name}</strong>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 text-[10px]">RATE:</span>
                      <strong className="text-emerald-400 font-black text-xs">₹{item.priceInrPerUnit} / {item.unit}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCartItem({ product: item, qty: item.minOrder });
                      setIsGuestCheckingOut(true);
                      showToast(`Selected [${item.name}] for Guest Instant Order.`);
                    }}
                    className="w-full py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-amber-400 mt-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Book via Guest Checkout
                  </button>
                </div>
              ))}
            </div>

            {/* GUEST CHECKOUT MODAL / DRAWER */}
            {isGuestCheckingOut && cartItem && (
              <div className="p-5 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-4 font-mono text-xs animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <strong className="text-amber-400 font-bold text-sm">Guest Instant Order Confirmation</strong>
                  <button onClick={() => setIsGuestCheckingOut(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Product:</span>
                    <strong className="text-white text-xs">{cartItem.product.name}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Minimum Order Quantity:</span>
                    <strong className="text-emerald-400 text-xs">{cartItem.qty} {cartItem.product.unit}s</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Total Payable:</span>
                    <strong className="text-amber-400 text-xs">₹{(cartItem.qty * cartItem.product.priceInrPerUnit).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Enter Mobile Phone Number for OTP..."
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs w-64"
                  />
                  <button
                    onClick={() => {
                      setIsGuestCheckingOut(false);
                      showToast(`Guest Order Booked! SMS OTP receipt sent to ${guestPhone || '+91 98290XXXXX'}. GPS Dispatch Active!`);
                    }}
                    className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer hover:bg-emerald-400"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirm &amp; Pay via UPI Guest Gateway
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: MODULES 29 & 30 - CONSTRUCTION & SMART PROCUREMENT */}
      {activeTab === 'construction-procurement-29-30' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MODULE 29: BOQ & AI COST ESTIMATION */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Module 29 • Construction Engineering</span>
                  <h3 className="text-white font-bold text-base mt-0.5">BOQ Parser &amp; AI Cost Estimator</h3>
                </div>
                <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold rounded-full">
                  AutoCAD / Excel Sync
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-slate-300 font-bold block">Upload Construction BOQ Document</span>
                <button
                  onClick={() => {
                    setBoqParsed(true);
                    showToast('AI BOQ Parser processed 42 lines. Calculated 85,000 MT Aggregate requirement.');
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-dashed border-amber-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" /> Simulate Uploading BOQ (PDF / Excel / CAD)
                </button>

                {boqParsed && (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2">
                    <strong className="text-indigo-300 font-bold block">AI BOQ ANALYSIS COMPLETE:</strong>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-400 block">Calculated Aggregate:</span>
                        <strong className="text-emerald-400">85,000 Metric Tons</strong>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-400 block">AI Estimated Cost:</span>
                        <strong className="text-amber-400">₹5.52 Crore</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MODULE 30: SMART PROCUREMENT RFQS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Module 30 • Smart Procurement</span>
                  <h3 className="text-white font-bold text-base mt-0.5">RFQs &amp; Vendor Bidding Matrix</h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">
                  Automated RFQ Routing
                </span>
              </div>

              <div className="space-y-3">
                {rfqList.map(rfq => (
                  <div key={rfq.rfqId} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-amber-300 font-bold">{rfq.rfqId} • {rfq.title}</strong>
                      <span className="px-2 py-0.5 bg-slate-900 text-emerald-400 text-[10px] rounded font-bold border border-slate-800">
                        {rfq.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-300">
                      <span>Bids Received: <strong>{rfq.bidsReceived} Vendors</strong></span>
                      <span>Lowest Bid: <strong className="text-emerald-400">₹{rfq.lowestBidInr.toLocaleString()}</strong></span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                      <span className="text-slate-400 text-[10px]">AI Recommended: <strong className="text-amber-400">{rfq.recommendedVendor}</strong></span>
                      <button
                        onClick={() => showToast(`Awarded Purchase Order for [${rfq.rfqId}] to ${rfq.recommendedVendor}!`)}
                        className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer hover:bg-emerald-400"
                      >
                        Award PO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MODULES 31 & 39 - CAD VAULT & WHITE LABEL BRANDING */}
      {activeTab === 'cad-white-label-31-39' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MODULE 31: CAD & DIGITAL SIGNATURE VAULT */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Module 31 • CAD &amp; Document Center</span>
                  <h3 className="text-white font-bold text-base mt-0.5">AutoCAD Viewer &amp; eSignature</h3>
                </div>
                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold rounded-full">
                  Vector .DWG Renderer
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <strong className="text-white font-bold">Chittorgarh_Flyover_Pillar_Struct.dwg</strong>
                  <span className="text-emerald-400 font-bold text-[10px]">✓ Digitally eSigned</span>
                </div>
                <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500 font-bold gap-2">
                  <FileCode className="w-6 h-6 text-amber-400" /> [Browser Native Vector AutoCAD 2D/3D Viewer Active]
                </div>
                <button
                  onClick={() => showToast('Applied Aadhaar eSign Cryptographic Token to Quarry Lease Agreement!')}
                  className="w-full py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" /> Apply Cryptographic eSignature
                </button>
              </div>
            </div>

            {/* MODULE 39: WHITE LABEL BRANDING ENGINE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Module 39 • Multi-Tenant Engine</span>
                  <h3 className="text-white font-bold text-base mt-0.5">White Label Portal Configurator</h3>
                </div>
                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold rounded-full">
                  Custom Domain Ready
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">Partner Joint-Venture Branding Name:</label>
                  <input
                    type="text"
                    value={branding.tenantName}
                    onChange={e => setBranding({ ...branding, tenantName: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">Select Active Theme Palette:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Amber Gold', 'Emerald Green', 'Midnight Cyan', 'Royal Indigo'] as const).map(th => (
                      <button
                        key={th}
                        onClick={() => {
                          setActiveTheme(th);
                          showToast(`Switched Portal Palette to [${th}] for all 23 self-service portals!`);
                        }}
                        className={`p-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                          activeTheme === th ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {th}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">CUSTOM DOMAIN:</span>
                  <strong className="text-emerald-400 font-bold">{branding.customDomain}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: MODULE 37 - EXECUTIVE EXPERIENCE CENTER */}
      {activeTab === 'executive-csuite-37' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-amber-400 font-bold uppercase tracking-wider">Module 37 • Strategic Command</span>
                <h2 className="text-xl font-bold text-white mt-0.5">C-Suite Executive Experience Center</h2>
              </div>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full font-bold text-xs">
                CEO • COO • CFO • CHRO Workspaces
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(['ceo', 'coo', 'cfo', 'chro'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setExecTab(role)}
                  className={`p-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    execTab === role
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {role.toUpperCase()} Workspace
                </button>
              ))}
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-slate-400 text-[10px]">EXECUTIVE WORKSPACE STRATEGY:</span>
                  <h3 className="text-amber-400 font-bold text-lg mt-0.5">{MOCK_EXECUTIVE_WORKSPACES[execTab].focus}</h3>
                </div>
                <strong className="text-emerald-400 font-black text-base bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {MOCK_EXECUTIVE_WORKSPACES[execTab].keyMetric}
                </strong>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-amber-500/30 space-y-2">
                <span className="text-amber-400 font-bold text-[10px] flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> GEMINI C-SUITE AI INSIGHT BRIEFING:
                </span>
                <p className="text-slate-200 text-xs leading-relaxed">{MOCK_EXECUTIVE_WORKSPACES[execTab].topInsight}</p>
              </div>

              <button
                onClick={() => showToast(`Generated audio briefing stream for ${execTab.toUpperCase()} Workspace.`)}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Play Morning AI Audio Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: MODULES 34 - 36 CUSTOMER, DEALER & SUPPLIER SUCCESS PLATFORMS */}
      {activeTab === 'success-platforms-34-36' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MODULE 34: CUSTOMER SUCCESS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-white font-bold text-sm">Module 34 • Customer Success</h3>
                <span className="text-emerald-400 font-bold">CSAT 98.4%</span>
              </div>
              <p className="text-slate-400 text-xs">Complaint resolution, AMC warranties, and post-delivery NPS feedback loops.</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">LATEST NPS SCORE:</span>
                <strong className="text-emerald-400 text-lg font-black block">+74 World Class</strong>
              </div>
            </div>

            {/* MODULE 35: DEALER SUCCESS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-white font-bold text-sm">Module 35 • Dealer Success</h3>
                <span className="text-amber-400 font-bold">1,450 Dealers</span>
              </div>
              <p className="text-slate-400 text-xs">Sales targets, incentive calculators, reward wallets, and training videos.</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">REWARD POINTS DISBURSED:</span>
                <strong className="text-amber-400 text-lg font-black block">4.2 Million Pts</strong>
              </div>
            </div>

            {/* MODULE 36: SUPPLIER SUCCESS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-white font-bold text-sm">Module 36 • Supplier Success</h3>
                <span className="text-cyan-300 font-bold">890 Suppliers</span>
              </div>
              <p className="text-slate-400 text-xs">Purchase orders, early payment discounts, and 3-month AI demand forecasting.</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">EARLY PAYOUT ADOPTION:</span>
                <strong className="text-cyan-300 text-lg font-black block">92.1% Settled</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: MODULES 41 & 42 - KNOWLEDGE CENTER & COMMUNITY */}
      {activeTab === 'knowledge-community-41-42' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MODULE 41: KNOWLEDGE & SOPS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Module 41 • SOP Vault</span>
                  <h3 className="text-white font-bold text-base mt-0.5">Digital Knowledge Center</h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">
                  Mining &amp; Fleet SOPs
                </span>
              </div>

              <div className="space-y-3">
                {sops.map(sop => (
                  <div key={sop.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-bold text-xs">{sop.title}</strong>
                      <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[9px] rounded font-bold border border-slate-800">
                        {sop.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                      <span>Views: {sop.views.toLocaleString()}</span>
                      <span className="text-emerald-400 font-bold">Rating: ★ {sop.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MODULE 42: COMMUNITY FORUM */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Module 42 • Ecosystem Forum</span>
                  <h3 className="text-white font-bold text-base mt-0.5">Community &amp; Business Discussion</h3>
                </div>
                <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold rounded-full">
                  Peer to Peer Forum
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask community e.g. Best crusher maintenance schedule..."
                    value={newTopicTitle}
                    onChange={e => setNewTopicTitle(e.target.value)}
                    className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                  <button
                    onClick={handleAddTopic}
                    className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer hover:bg-amber-400 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Post
                  </button>
                </div>

                <div className="space-y-2">
                  {communityTopics.map(top => (
                    <div key={top.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <strong className="text-amber-300 font-bold text-xs block">{top.title}</strong>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                        <span>By: {top.author}</span>
                        <span className="text-emerald-400 font-bold">{top.replies} Replies • ▲ {top.upvotes} Upvotes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: ALL 45 ENTERPRISE PORTAL MODULES ARCHITECTURE MATRIX */}
      {activeTab === 'all-45-modules-matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-amber-400 font-bold uppercase tracking-wider">Phase 28 Master Specification</span>
              <h2 className="text-xl font-bold text-white mt-0.5">All 45 Self-Service Enterprise DXP Modules</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter 45 modules..."
                  value={moduleSearch}
                  onChange={e => setModuleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <select
                value={moduleCategoryFilter}
                onChange={e => setModuleCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              >
                <option value="All">All Categories</option>
                <option value="Customer Experience">Customer Experience</option>
                <option value="Dealer Network">Dealer Network</option>
                <option value="Supplier & Vendor">Supplier &amp; Vendor</option>
                <option value="Mine Operations">Mine Operations</option>
                <option value="Fleet & Logistics">Fleet &amp; Logistics</option>
                <option value="Workspace & Productivity">Workspace &amp; Productivity</option>
                <option value="Collaboration & Chat">Collaboration &amp; Chat</option>
                <option value="Commerce & Marketplace">Commerce &amp; Marketplace</option>
                <option value="Projects & Engineering">Projects &amp; Engineering</option>
                <option value="C-Suite Command">C-Suite Command</option>
                <option value="Ecosystem Bridge">Ecosystem Bridge</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map(mod => (
              <div key={mod.moduleId} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-amber-400 font-bold text-[10px] block">MODULE {mod.moduleId}</span>
                      <strong className="text-white font-bold text-xs">{mod.title}</strong>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-900 text-emerald-400 text-[9px] rounded font-bold border border-slate-800">
                      {mod.category}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">{mod.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-900">
                  <span className="text-slate-500 text-[10px] block font-bold">Sub-Modules:</span>
                  <div className="flex flex-wrap gap-1">
                    {mod.subModules.slice(0, 3).map((sub, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                        • {sub}
                      </span>
                    ))}
                    {mod.subModules.length > 3 && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 text-amber-400 font-bold rounded border border-slate-800">
                        +{mod.subModules.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
