import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Truck,
  FileText,
  Clock,
  Plus,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Vehicle, VehicleComplianceItem } from '../../data/vehicleStudioData';

interface VehicleComplianceViewProps {
  vehicles: Vehicle[];
  onCreateOttTask?: (msg: string) => void;
  onRenewDocument?: (vehicleNumber: string, docType: string) => void;
}

export const VehicleComplianceView: React.FC<VehicleComplianceViewProps> = ({
  vehicles,
  onCreateOttTask,
  onRenewDocument
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Flatten all compliance records from vehicles
  const complianceRecords = vehicles.flatMap((v) => {
    return Object.entries(v.compliance).map(([key, item]) => {
      const complianceItem = item as VehicleComplianceItem;
      return {
        ...complianceItem,
        vehicleId: v.id,
        vehicleNumber: v.vehicleNumber,
        vehicleCode: v.vehicleCode,
        categoryKey: key
      };
    });
  });

  const filtered = complianceRecords.filter((rec) => {
    const matchesSearch =
      rec.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.providerOrAuthority.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'ALL' || rec.categoryKey.toLowerCase() === activeCategory.toLowerCase();

    const matchesStatus = filterStatus === 'ALL' || rec.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const expiringCount = complianceRecords.filter((r) => r.status === 'Expiring Soon').length;
  const expiredCount = complianceRecords.filter((r) => r.status === 'Expired').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              RTO & STATUTORY CERTIFICATES &bull; {complianceRecords.length} POLICIES & PERMITS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Statutory Compliance, Permits & RTO Expiry Center</h2>
          <p className="text-xs text-slate-400">
            Real-time countdowns for Comprehensive Insurance, Road Tax, National Permits, Fitness (FC) & PUCC
          </p>
        </div>

        {/* Expiry Alarm Badges */}
        <div className="flex items-center gap-2">
          {expiringCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{expiringCount} Expiring Soon</span>
            </div>
          )}
          {expiredCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{expiredCount} Expired</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'insurance', 'tax', 'permit', 'fitness', 'pollution'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition border cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All 5 Documents' : cat}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vehicle number, policy/permit number, authority..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active & Valid</option>
              <option value="Expiring Soon">Expiring Soon (30 Days)</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compliance Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={`${item.vehicleNumber}-${item.type}-${idx}`}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
                  {item.vehicleCode}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm capitalize">{item.type}</h3>
                  <div className="font-mono text-cyan-400 text-xs font-bold">{item.vehicleNumber}</div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  item.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : item.status === 'Expiring Soon'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Document Specifics */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Policy / Permit #:</span>
                <span className="font-mono font-bold text-white">{item.identifier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issuer / Authority:</span>
                <span className="text-slate-200">{item.providerOrAuthority}</span>
              </div>
              {item.amountOrPremium && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Fee / Premium:</span>
                  <span className="font-mono font-bold text-emerald-400">₹{item.amountOrPremium.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Expiry Counter */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="text-slate-400">
                Expiry Date: <strong className="text-white font-mono">{item.expiryDate}</strong>
              </div>
            </div>

            {/* Actions: OTT Task and Renewal */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => onRenewDocument && onRenewDocument(item.vehicleNumber, item.type)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] transition cursor-pointer"
              >
                Renew Document
              </button>

              {onCreateOttTask && (
                <button
                  onClick={() => onCreateOttTask(`Renew ${item.type} for ${item.vehicleNumber} (Exp: ${item.expiryDate})`)}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-[10px] transition cursor-pointer"
                >
                  Create OTT Task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
