import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { CommerceDispute, COMMERCE_DISPUTES } from '../../data/ecommerceStudioData';

export const ReturnsDisputesView: React.FC = () => {
  const [disputes, setDisputes] = useState<CommerceDispute[]>(COMMERCE_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<CommerceDispute | null>(COMMERCE_DISPUTES[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
              QUALITY ASSURANCE & RESOLUTION DESK
            </span>
            <span className="text-xs text-slate-400 font-medium">Claims & Replacements</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Returns & Disputes ({disputes.length})</h1>
        </div>

        <button
          onClick={() => alert('Opening claim submission form...')}
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ File Quality Dispute</span>
        </button>
      </div>

      {/* Disputes Dossier & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          {disputes.map((disp) => {
            const isSelected = selectedDispute?.id === disp.id;
            return (
              <div
                key={disp.id}
                onClick={() => setSelectedDispute(disp)}
                className={`p-5 rounded-3xl border transition cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-slate-900 border-rose-500/50 shadow-xl'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">{disp.disputeId}</span>
                    <span className="text-xs font-bold text-white font-mono">{disp.orderNumber}</span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    disp.status === 'Resolved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {disp.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <div className="font-bold text-white">{disp.issueType}</div>
                  <p className="text-slate-400 mt-1 line-clamp-2">{disp.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{disp.customerName} vs {disp.supplierName}</span>
                  <span className="text-amber-400 font-bold">{disp.requestedResolution}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Dispute Detail */}
        {selectedDispute && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 self-start sticky top-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-rose-400 font-bold">{selectedDispute.disputeId}</span>
                <h3 className="text-base font-black text-white mt-0.5">{selectedDispute.issueType}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{selectedDispute.createdAt}</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div><span className="text-slate-500">Order:</span> <span className="text-white font-mono font-bold">{selectedDispute.orderNumber}</span></div>
              <div><span className="text-slate-500">Customer:</span> <span className="text-white font-medium">{selectedDispute.customerName}</span></div>
              <div><span className="text-slate-500">Supplier:</span> <span className="text-amber-400 font-medium">{selectedDispute.supplierName}</span></div>
              <div className="pt-2 border-t border-slate-800 text-slate-300 leading-relaxed">
                {selectedDispute.description}
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Requested Resolution:</span>
                <span className="text-white font-bold">{selectedDispute.requestedResolution}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Resolution Decision:</span>
                <span className="text-emerald-400 font-bold">{selectedDispute.resolutionNotes || 'Under Assessment'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => alert(`Issuing resolution for ${selectedDispute.disputeId}`)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
              >
                Approve & Execute Resolution
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
