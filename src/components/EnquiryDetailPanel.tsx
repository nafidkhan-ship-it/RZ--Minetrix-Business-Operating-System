import React, { useState, useEffect } from 'react';
import {
  X, ClipboardList, AlertCircle, CheckCircle2, UserCheck, ShieldCheck,
  Building2, MessageSquare, Plus, Tag, Phone, Mail, FileText,
  UserPlus, Link2, Clock, Lock, Check, Send, ChevronRight, History
} from 'lucide-react';
import {
  CustomerEnquiry,
  EnquiryStatus,
  EnquiryPriority,
  InternalStaffNote,
  ErpCustomerMaster,
  AuditLogRecord
} from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface EnquiryDetailPanelProps {
  enquiryId: string;
  viewerUserId: string;
  onClose: () => void;
  onEnquiryUpdated?: () => void;
  onOpenCustomerMatchModal?: () => void;
}

export const EnquiryDetailPanel: React.FC<EnquiryDetailPanelProps> = ({
  enquiryId,
  viewerUserId,
  onClose,
  onEnquiryUpdated,
  onOpenCustomerMatchModal
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'customer' | 'audit'>('details');
  const [enquiry, setEnquiry] = useState<CustomerEnquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState<InternalStaffNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [noteError, setNoteError] = useState('');

  const loadData = () => {
    const enq = rzChatService.getEnquiryById(enquiryId);
    if (enq) {
      setEnquiry({ ...enq });
      const notes = rzChatService.getInternalNotesForEnquiry(enquiryId, viewerUserId);
      setInternalNotes(notes);
      const logs = rzChatService.getAuditLogsForBusiness(enq.businessId, viewerUserId);
      setAuditLogs(logs.filter(l => l.entityId === enquiryId || l.details.includes(enq.enquiryCode)));
    }
  };

  useEffect(() => {
    loadData();
  }, [enquiryId, viewerUserId]);

  if (!enquiry) return null;

  const handleStatusChange = (newStatus: EnquiryStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updated = rzChatService.updateEnquiryStatus(viewerUserId, enquiryId, newStatus);
      setEnquiry({ ...updated });
      loadData();
      if (onEnquiryUpdated) onEnquiryUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    try {
      setNoteError('');
      rzChatService.addInternalNoteForEnquiry(viewerUserId, enquiryId, newNoteText.trim());
      setNewNoteText('');
      loadData();
    } catch (err: any) {
      setNoteError(err.message || 'Failed to add note');
    }
  };

  const handleCreateErpCustomer = () => {
    try {
      const cust = rzChatService.createErpCustomerFromChatUser(viewerUserId, enquiryId);
      loadData();
      if (onEnquiryUpdated) onEnquiryUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: Record<EnquiryStatus, string> = {
    new: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    open: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    in_progress: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    awaiting_customer: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    resolved: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    closed: 'bg-slate-800 border-slate-700 text-slate-400',
    cancelled: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
  };

  const priorityColors: Record<EnquiryPriority, string> = {
    low: 'text-slate-400',
    normal: 'text-blue-400',
    high: 'text-amber-400',
    urgent: 'text-rose-400 font-bold'
  };

  return (
    <div className="w-full md:w-96 border-l border-slate-800 bg-slate-900/95 flex flex-col h-full overflow-hidden shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-amber-400">{enquiry.enquiryCode}</span>
            <h4 className="text-sm font-bold text-white line-clamp-1">{enquiry.subject}</h4>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/50 p-1 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-colors ${
            activeTab === 'details' ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'notes' ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-3 h-3 text-amber-400" />
          Notes ({internalNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-colors ${
            activeTab === 'customer' ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          ERP Link
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-colors ${
            activeTab === 'audit' ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Audit
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
        {activeTab === 'details' && (
          <>
            {/* Quick Status Control */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Manage Enquiry Status
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['open', 'in_progress', 'awaiting_customer', 'resolved'] as EnquiryStatus[]).map((st) => (
                  <button
                    key={st}
                    disabled={isUpdatingStatus || enquiry.status === st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                      enquiry.status === st
                        ? statusColors[st] + ' ring-1 ring-amber-500/50 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {st.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Info Card */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-400" /> {enquiry.category}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Priority</span>
                <span className={`font-bold capitalize ${priorityColors[enquiry.priority]}`}>
                  {enquiry.priority}
                </span>
              </div>

              {enquiry.quantity && (
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Quantity / Volume</span>
                  <span className="font-mono font-semibold text-white">{enquiry.quantity}</span>
                </div>
              )}

              {enquiry.deliveryLocation && (
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Delivery Location</span>
                  <span className="font-semibold text-slate-200">{enquiry.deliveryLocation}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Staff</span>
                <span className="font-semibold text-amber-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-amber-400" /> {enquiry.assignedToName || 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Public Customer Profile
              </span>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400">
                  {enquiry.customerDisplayName?.charAt(0) || 'C'}
                </div>
                <div>
                  <h5 className="font-bold text-white">{enquiry.customerDisplayName}</h5>
                  {enquiry.customerUsername && (
                    <p className="text-[11px] text-slate-400">@{enquiry.customerUsername}</p>
                  )}
                </div>
              </div>

              {enquiry.customerPhone && (
                <div className="flex items-center gap-2 text-slate-300 pt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{enquiry.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Enquiry Message Text */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Original Message / Spec
              </span>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-xs">
                {enquiry.message}
              </p>
            </div>
          </>
        )}

        {/* STAFF INTERNAL NOTES (ISOLATED) */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Internal staff notes are strictly private and isolated. Public customers cannot see these entries.
              </span>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Write internal staff note (e.g. discount approved, stock checked at Pit #04)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
              />
              {noteError && <p className="text-rose-400 text-[11px]">{noteError}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Save Internal Note
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2 pt-2">
              {internalNotes.length === 0 ? (
                <div className="p-4 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No internal staff notes recorded yet.
                </div>
              ) : (
                internalNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-amber-400">{note.authorName}</span>
                      <span className="text-slate-500">
                        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-xs">{note.noteText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CUSTOMER ERP INTEGRATION TAB */}
        {activeTab === 'customer' && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                ERP Customer Master Status
              </span>

              {enquiry.erpCustomerId ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Linked to ERP Account
                  </div>
                  <p className="text-xs font-mono">Customer ID: {enquiry.erpCustomerId}</p>
                  <p className="text-[11px] text-slate-400">
                    This customer enquiry is linked to ERP Master. Transactions, quotes, and orders will sync automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px]">
                    This chat user is not yet matched to an ERP Customer Master Record.
                  </div>

                  <button
                    onClick={handleCreateErpCustomer}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" /> Create New ERP Customer
                  </button>

                  {onOpenCustomerMatchModal && (
                    <button
                      onClick={onOpenCustomerMatchModal}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                    >
                      <Link2 className="w-4 h-4 text-amber-400" /> Match Existing ERP Account
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AUDIT LOG TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Enquiry Security Audit Trail
            </span>
            {auditLogs.length === 0 ? (
              <div className="p-4 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No audit entries recorded for this enquiry.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-amber-400 font-semibold">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{log.details}</p>
                  <p className="text-[10px] text-slate-500">Actor: {log.actorName}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
