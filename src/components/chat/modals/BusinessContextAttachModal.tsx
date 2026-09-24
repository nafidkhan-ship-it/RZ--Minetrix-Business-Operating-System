import React, { useState } from 'react';
import {
  Building2,
  X,
  Pickaxe,
  Truck,
  ShoppingBag,
  Briefcase,
  Landmark,
  Search,
  CheckCircle2,
  Paperclip
} from 'lucide-react';
import { BusinessContextReference, BusinessModuleType } from '../../../data/rzChatData';

interface BusinessContextAttachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: BusinessContextReference) => void;
}

const ECOSYSTEM_RECORDS: BusinessContextReference[] = [
  {
    module: 'LAND',
    recordId: 'PARCEL-KSD-01',
    title: 'Hosdurg Survey 412/1A (Pai Plantations)',
    subtitle: 'Laterite Stone Quarry &bull; Agreement AGR-2026-001 &bull; 14.50 Cents',
    badge: 'Active Mining',
    actionLabel: 'Open Land Parcel',
    amountRs: 487500
  },
  {
    module: 'QUARRY',
    recordId: 'QUARRY-01',
    title: 'Hilltop Pit #01 Laterite Mine',
    subtitle: 'Working Area WA-01 &bull; Benchmark Depth 18m &bull; Daily target 120 loads',
    badge: 'Operational',
    actionLabel: 'Open Quarry Pit'
  },
  {
    module: 'ORDER',
    recordId: 'ORD-2026-8812',
    title: 'Order ORD-2026-8812 (Deccan Infrastructure)',
    subtitle: '600 MT 20mm Granite Aggregate &bull; NH-66 Flyover Project',
    badge: 'Dispatched',
    actionLabel: 'Open Order',
    amountRs: 345000
  },
  {
    module: 'VEHICLE',
    recordId: 'VEH-KL14-9901',
    title: 'Vehicle KL-14-AC-9901 (10-Wheel Tipper)',
    subtitle: 'Trip TRP-9021 &bull; Driver: Suresh Shetty &bull; Live GPS Speed 42 km/h',
    badge: 'In Transit',
    actionLabel: 'Open Telematics'
  },
  {
    module: 'JOB',
    recordId: 'JOB-2026-441',
    title: 'Subcontract JOB-441 (NH-66 Earthwork & GSB)',
    subtitle: 'Deccan Projects &bull; Chainage 142 to 148 &bull; RA Bill #04',
    badge: '72% Progress',
    actionLabel: 'Open Contract Job',
    amountRs: 1850000
  },
  {
    module: 'MARKETPLACE',
    recordId: 'LST-CAT-320D',
    title: '2021 CAT 320D2 GC Hydraulic Excavator',
    subtitle: 'Listing LST-CAT-320D &bull; Seller: Western Ghats Machinery &bull; ₹34,50,000',
    badge: 'Verified Unit',
    actionLabel: 'Open Listing',
    amountRs: 3450000
  }
];

export const BusinessContextAttachModal: React.FC<BusinessContextAttachModalProps> = ({
  isOpen,
  onClose,
  onSelectRecord
}) => {
  if (!isOpen) return null;

  const [activeModule, setActiveModule] = useState<'ALL' | BusinessModuleType>('ALL');
  const [search, setSearch] = useState('');

  const MODULES: { id: 'ALL' | BusinessModuleType; label: string; icon: any }[] = [
    { id: 'ALL', label: 'All Records', icon: Building2 },
    { id: 'LAND', label: 'Land Parcels', icon: Landmark },
    { id: 'QUARRY', label: 'Quarry Pits', icon: Pickaxe },
    { id: 'ORDER', label: 'Orders', icon: ShoppingBag },
    { id: 'VEHICLE', label: 'Fleet / Trucks', icon: Truck },
    { id: 'JOB', label: 'Contracts', icon: Briefcase },
    { id: 'MARKETPLACE', label: 'Marketplace', icon: ShoppingBag }
  ];

  const filtered = ECOSYSTEM_RECORDS.filter((rec) => {
    const matchesModule = activeModule === 'ALL' || rec.module === activeModule;
    const matchesSearch =
      rec.title.toLowerCase().includes(search.toLowerCase()) ||
      rec.recordId.toLowerCase().includes(search.toLowerCase()) ||
      (rec.subtitle && rec.subtitle.toLowerCase().includes(search.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Paperclip className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  ECOSYSTEM BRIDGE
                </span>
                <span className="text-[10px] text-slate-400">&bull; RZ MINETRIX Records</span>
              </div>
              <h3 className="text-sm font-black text-white">Attach Business Context</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, parcel, vehicle, order, or machine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Module Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {MODULES.map((m) => {
              const isSel = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer border ${
                    isSel
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Record Cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((record) => (
            <div
              key={record.recordId}
              onClick={() => {
                onSelectRecord(record);
                onClose();
              }}
              className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-800/40 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[10px] text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {record.recordId}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                    {record.module}
                  </span>
                </div>
                {record.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    {record.badge}
                  </span>
                )}
              </div>

              <div className="font-bold text-white group-hover:text-cyan-300 transition text-xs">
                {record.title}
              </div>

              {record.subtitle && (
                <div
                  className="text-[11px] text-slate-400"
                  dangerouslySetInnerHTML={{ __html: record.subtitle }}
                />
              )}

              {record.amountRs && (
                <div className="text-[11px] font-mono text-emerald-400 font-bold pt-1">
                  Valuation / Value: ₹{record.amountRs.toLocaleString('en-IN')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 text-[10px]">
            Selected record will attach as an interactive chip to your message
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
