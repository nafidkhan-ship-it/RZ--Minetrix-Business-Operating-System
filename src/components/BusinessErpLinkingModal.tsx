import React, { useState, useEffect } from 'react';
import {
  X, Building2, Link2, ShieldCheck, AlertCircle, CheckCircle2,
  Unlink, ArrowRight, History, Layers, Lock, Sparkles
} from 'lucide-react';
import {
  BusinessErpLink,
  ErpOrganizationRef,
  AuditLogRecord
} from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface BusinessErpLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  currentUserId: string;
  onLinkStatusChanged?: () => void;
}

export const BusinessErpLinkingModal: React.FC<BusinessErpLinkingModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  currentUserId,
  onLinkStatusChanged
}) => {
  const [erpOrgs, setErpOrgs] = useState<ErpOrganizationRef[]>([]);
  const [currentLink, setCurrentLink] = useState<BusinessErpLink | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('ORG-101');
  const [linkNotes, setLinkNotes] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    try {
      const orgs = rzChatService.getErpOrganizations();
      setErpOrgs(orgs);
      const link = rzChatService.getBusinessErpLink(businessId);
      setCurrentLink(link);
      if (link?.organizationId) {
        setSelectedOrgId(link.organizationId);
      } else if (orgs && orgs.length > 0 && orgs[0]?.id) {
        setSelectedOrgId(orgs[0].id);
      }
      const logs = rzChatService.getAuditLogsForBusiness(businessId, currentUserId);
      setAuditLogs(logs.filter(l => l.action.includes('business_link')));
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, businessId, currentUserId]);

  if (!isOpen) return null;

  const handleLinkBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId) {
      setError('Please select an ERP Organization');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      rzChatService.requestBusinessErpLink(currentUserId, businessId, selectedOrgId, linkNotes.trim());
      setIsSubmitting(false);
      loadData();
      if (onLinkStatusChanged) onLinkStatusChanged();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to link business to ERP');
    }
  };

  const handleUnlinkBusiness = () => {
    if (!confirm('Are you sure you want to unlink this business from the ERP Organization? Public chat customers will remain in chat.')) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      rzChatService.unlinkBusinessErp(currentUserId, businessId);
      setIsSubmitting(false);
      loadData();
      if (onLinkStatusChanged) onLinkStatusChanged();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to unlink business');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ERP Organization Integration</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" /> {businessName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-300">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Core Status Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Current Link Status
            </span>

            {currentLink && currentLink.status === 'linked' ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-emerald-300">{currentLink.organizationName}</h5>
                    <p className="text-xs font-mono text-emerald-400/80 mt-0.5">Org ID: {currentLink.organizationId}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Linked on {new Date(currentLink.linkedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                  <span className="text-slate-400 block font-semibold">Integration Scope:</span>
                  <p className="text-slate-300">
                    Enquiries created in chat automatically route to this ERP Organization's Sales Leads & Customer Masters.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUnlinkBusiness}
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold rounded-xl text-xs border border-rose-500/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <Unlink className="w-4 h-4" /> Unlink ERP Organization
                </button>
              </div>
            ) : (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                ⚠️ Business is currently operating in <strong>Standalone Discovery Mode</strong>. Link to an ERP Organization to sync Leads, Customer Masters, and Enquiries.
              </div>
            )}
          </div>

          {/* Form to Link Organization */}
          {(!currentLink || currentLink.status !== 'linked') && (
            <form onSubmit={handleLinkBusiness} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select ERP Organization <span className="text-amber-400">*</span>
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                >
                  {erpOrgs.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.code} - {org.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Integration Notes / Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g., Primary Mining Operations Division Link"
                  value={linkNotes}
                  onChange={(e) => setLinkNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Linking requires ERP Organization Authorization. Public users will never see internal ERP credentials, ledgers, or private business financials.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                {isSubmitting ? 'Linking...' : 'Authorize & Link ERP Organization'}
              </button>
            </form>
          )}

          {/* Audit Trail */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-400" /> Link Audit History
            </span>

            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No link status modifications recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono text-amber-400">{log.action}</span>
                      <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
