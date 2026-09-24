import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  ArrowRight,
  ExternalLink,
  Users,
  Building2,
  Pickaxe,
  Truck,
  GitFork,
  ShoppingBag,
  Package,
  Landmark,
  MessageSquare,
  Clock,
  FileText,
  DollarSign
} from 'lucide-react';
import { UNIVERSAL_SEARCH_DATABASE } from './routeRegistry';
import { UniversalSearchRecord } from './types';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePath: (path: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigatePath
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const recordTypes = [
    'ALL',
    'People',
    'Companies',
    'Quarries',
    'Crusher Plants',
    'Vehicles',
    'Jobs',
    'Orders',
    'Products',
    'Land',
    'Marketplace',
    'Chats',
    'Tasks',
    'Invoices',
    'Payments',
    'Documents'
  ];

  const filteredResults = useMemo(() => {
    return UNIVERSAL_SEARCH_DATABASE.filter(item => {
      const matchesType = selectedType === 'ALL' || item.recordType === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.module.toLowerCase().includes(q) ||
        item.recordType.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q);

      return matchesType && matchesQuery;
    });
  }, [searchQuery, selectedType]);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'People': return Users;
      case 'Companies': return Building2;
      case 'Quarries': return Pickaxe;
      case 'Crusher Plants': return Building2;
      case 'Vehicles': return Truck;
      case 'Jobs': return GitFork;
      case 'Orders': return ShoppingBag;
      case 'Products': return Package;
      case 'Land': return Landmark;
      case 'Marketplace': return Truck;
      case 'Chats': return MessageSquare;
      case 'Tasks': return Clock;
      case 'Invoices': return FileText;
      case 'Payments': return DollarSign;
      case 'Documents': return FileText;
      default: return Search;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Section U &bull; Universal Search Index
              </span>
              <span className="text-[9px] font-mono text-purple-400">15 Core Record Types</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <span>Universal Record Search</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search People, Companies, Quarries, Crushers, Vehicles, Jobs, Orders, Tasks..."
            autoFocus
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
          />
        </div>

        {/* 15 Record Types Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
          {recordTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border text-[11px] ${
                selectedType === type
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[50vh]">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No records matching &quot;{searchQuery}&quot; found.</p>
              <p className="text-[11px] text-slate-600">Try searching for &quot;Quarry&quot;, &quot;Laterite&quot;, &quot;Driver&quot;, or &quot;Invoice&quot;.</p>
            </div>
          ) : (
            filteredResults.map((record) => {
              const Icon = getTypeIcon(record.recordType);

              return (
                <div
                  key={record.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                          {record.recordType}
                        </span>
                        <span className="font-bold text-white text-xs truncate">
                          {record.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {record.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {record.subtitle}
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 mt-1">
                        Module: <span className="text-purple-400">{record.module}</span> &bull; Target: {record.targetPath}
                      </div>
                    </div>
                  </div>

                  {/* Open Button (Requirement U: Module, Record Type, Record Name, Status, Open) */}
                  <button
                    onClick={() => {
                      onNavigatePath(record.targetPath);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 border border-slate-700 hover:border-amber-400"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
