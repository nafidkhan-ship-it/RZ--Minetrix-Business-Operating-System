import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  OttApproval,
  DEMO_OTT_APPROVALS,
  CURRENT_USER
} from '../../../data/rzOttData';
import { SectionId } from '../../../types/architecture';

interface OttApprovalsViewProps {
  onOpenSource: (sectionId: SectionId) => void;
}

export const OttApprovalsView: React.FC<OttApprovalsViewProps> = ({
  onOpenSource
}) => {
  const [approvals, setApprovals] = useState<OttApproval[]>(DEMO_OTT_APPROVALS);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = approvals.filter((a) => {
    if (filterType !== 'ALL' && a.approvalType !== filterType) return false;
    return true;
  });

  const handleUpdate = (id: string, status: OttApproval['status']) => {
    setApprovals(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          history: [
            ...a.history,
            {
              action: `${status.toUpperCase()} by ${CURRENT_USER.name}`,
              actor: CURRENT_USER.name,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return a;
    }));
  };

  const getStatusBadge = (status: OttApproval['status']) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'REJECTED': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'RETURNED': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PENDING': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GOVERNANCE &amp; AUTHORIZATION
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {approvals.length} Approval Requests
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-0.5">Authorizations &amp; Approvals Engine</h2>
            <div className="text-xs text-slate-400">
              Multi-tier approval workflows for Capex, POs, land settlements, and operator leaves
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'ALL', label: 'All Requests' },
          { id: 'PURCHASE', label: 'Purchase Orders' },
          { id: 'EXPENSE', label: 'Expenses' },
          { id: 'SETTLEMENT', label: 'Land Settlements' },
          { id: 'AGREEMENT', label: 'Agreements' },
          { id: 'JOB', label: 'Civil Jobs' },
          { id: 'LEAVE', label: 'Leaves' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
              filterType === tab.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((appr) => (
          <div
            key={appr.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getStatusBadge(appr.status)}`}>
                    {appr.status}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {appr.approvalType}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {appr.sourceSystem} &bull; {appr.sourceRecordId}
                  </span>
                </div>

                <h3 className="font-black text-sm text-white">{appr.title}</h3>
                <p className="text-slate-400 text-xs">{appr.details}</p>
              </div>

              {/* Financial Amount & Requester */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 min-w-[190px] text-right">
                {appr.amountRs !== undefined && (
                  <div className="font-black text-white text-base font-mono text-amber-400">
                    ₹{appr.amountRs.toLocaleString('en-IN')}
                  </div>
                )}
                <div className="text-[11px] text-slate-300 font-semibold mt-1">
                  Req by: <strong className="text-white">{appr.requestedBy.name}</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Approver: {appr.approver.name}
                </div>
              </div>
            </div>

            {/* Audit log preview */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-500 uppercase text-[9px] block">Audit Log:</span>
              {appr.history.map((h, i) => (
                <div key={i} className="flex items-center gap-1.5 font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{h.action} &bull; {h.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Submitted: {new Date(appr.submissionDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {appr.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleUpdate(appr.id, 'APPROVED')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(appr.id, 'REJECTED')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleUpdate(appr.id, 'RETURNED')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Request Changes
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
                    Decision Recorded
                  </span>
                )}

                <button
                  onClick={() => onOpenSource('universal-dashboard')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Source Record</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
