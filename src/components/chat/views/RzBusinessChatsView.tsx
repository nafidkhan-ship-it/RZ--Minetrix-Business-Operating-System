import React, { useState } from 'react';
import {
  Building2,
  Pickaxe,
  Truck,
  ShoppingBag,
  Briefcase,
  Landmark,
  MessageSquare,
  Clock,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import {
  ChatConversation,
  BusinessModuleType,
  DEMO_CONVERSATIONS
} from '../../../data/rzChatData';

interface RzBusinessChatsViewProps {
  onOpenConversation: (convId: string) => void;
  onOpenOttModal: (conv: ChatConversation) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const RzBusinessChatsView: React.FC<RzBusinessChatsViewProps> = ({
  onOpenConversation,
  onOpenOttModal,
  onNavigateSection
}) => {
  const [selectedModule, setSelectedModule] = useState<'ALL' | BusinessModuleType>('ALL');
  const [search, setSearch] = useState('');

  const MODULES: { id: 'ALL' | BusinessModuleType; label: string; icon: any; route: string }[] = [
    { id: 'ALL', label: 'All Business Hubs', icon: Building2, route: 'universal-dashboard' },
    { id: 'LAND', label: '07 Land Management', icon: Landmark, route: 'quarry-land-management' },
    { id: 'QUARRY', label: '01 Quarry Management', icon: Pickaxe, route: 'quarry-management' },
    { id: 'ORDER', label: '05 Materials E-Commerce', icon: ShoppingBag, route: 'building-materials-ecommerce' },
    { id: 'VEHICLE', label: '03 Vehicle Management', icon: Truck, route: 'vehicle-management' },
    { id: 'JOB', label: '04 Contract & Jobs', icon: Briefcase, route: 'contract-job-management' },
    { id: 'MARKETPLACE', label: '06 Used Machinery', icon: ShoppingBag, route: 'used-machinery-marketplace' }
  ];

  const businessConversations = DEMO_CONVERSATIONS.filter((c) => Boolean(c.businessContext));

  const filtered = businessConversations.filter((c) => {
    const matchesModule =
      selectedModule === 'ALL' || c.businessContext?.module === selectedModule;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.businessContext?.title.toLowerCase().includes(search.toLowerCase()) ||
      c.businessContext?.recordId.toLowerCase().includes(search.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const handleRouteToPlatform = (module: BusinessModuleType) => {
    const match = MODULES.find((m) => m.id === module);
    if (match && onNavigateSection) {
      onNavigateSection(match.route);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white">Ecosystem Business Chats</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              Cross-Platform Synced
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Dedicated operational threads linked to real Quarry pits, haul dispatches, orders, subcontracts & land parcels
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-950/40">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order ID, Parcel Survey, Vehicle Plate or Quarry name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Modules Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {MODULES.map((m) => {
            const isSel = selectedModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer border ${
                  isSel
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Business Cards */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((conv) => {
          const ctx = conv.businessContext!;
          return (
            <div
              key={conv.id}
              className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition flex flex-col justify-between space-y-3 group shadow-xl"
            >
              <div>
                {/* Top Badge & Module */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                      {ctx.recordId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                      Platform: {ctx.module}
                    </span>
                  </div>

                  {ctx.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {ctx.badge}
                    </span>
                  )}
                </div>

                {/* Conversation Title & Avatar */}
                <div className="flex items-center gap-3 mt-3">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-white text-xs group-hover:text-cyan-300 transition">
                      {conv.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      {ctx.title}
                    </p>
                    {ctx.subtitle && (
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {ctx.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Last Message Quote */}
                <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800/80 text-slate-300 text-xs mt-3 italic line-clamp-2">
                  "{conv.lastMessage}"
                </div>

                {/* Financial Value if applicable */}
                {ctx.amountRs && (
                  <div className="mt-2 text-right">
                    <span className="text-[10px] text-slate-500 mr-1.5">Value / Settlement:</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      ₹{ctx.amountRs.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenOttModal(conv)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Create OTT Task</span>
                  </button>

                  <button
                    onClick={() => handleRouteToPlatform(ctx.module)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{ctx.actionLabel || 'Open Record'}</span>
                  </button>
                </div>

                <button
                  onClick={() => onOpenConversation(conv.id)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-sm shadow-cyan-500/20 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
