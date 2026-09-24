import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Send,
  Building2,
  Phone
} from 'lucide-react';
import {
  MARKETPLACE_ENQUIRIES,
  MarketplaceEnquiry
} from '../../data/usedMachineryMarketplaceData';

interface EnquiriesViewProps {
  type: 'buyer' | 'seller';
  onOpenChat: (party: string, listingCode: string) => void;
  onOpenOttModal: (contextRef?: string) => void;
  onConvertToDeal: (enquiry: MarketplaceEnquiry) => void;
}

export const EnquiriesView: React.FC<EnquiriesViewProps> = ({
  type,
  onOpenChat,
  onOpenOttModal,
  onConvertToDeal
}) => {
  const [enquiries, setEnquiries] = useState<MarketplaceEnquiry[]>(MARKETPLACE_ENQUIRIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const filtered = enquiries.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.buyerName.toLowerCase().includes(q) ||
        item.listingTitle.toLowerCase().includes(q) ||
        item.enquiryCode.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendReply = (id: string) => {
    if (!replyText[id]?.trim()) return;
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Contacted' } : e))
    );
    setReplyText((prev) => ({ ...prev, [id]: '' }));
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">
            {type === 'buyer' ? 'Buyer Inquiries & Leads' : 'Seller Inquiry Dispatch'}
          </h1>
          <p className="text-xs text-slate-400">
            {type === 'buyer'
              ? 'Inbound equipment purchase requirements from regional infrastructure contractors'
              : 'Direct seller responses and operational inquiry status'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenOttModal('ENQ-BULK-FOLLOWUP')}
            className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>+ Create Follow-up OTT Task</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'New', 'Contacted', 'Negotiation', 'Inspection', 'Offer'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filtered.map((enq) => (
          <div
            key={enq.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {enq.enquiryCode}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">{enq.date}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-amber-400 font-semibold">{enq.requirementUrgency}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  Status: {enq.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-2">
                <div className="text-xs text-slate-400">
                  Equipment: <span className="text-white font-bold">{enq.listingTitle}</span>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  "{enq.message}"
                </div>
              </div>

              <div className="md:col-span-4 bg-slate-950 rounded-2xl border border-slate-800 p-3.5 space-y-1.5 text-xs">
                <div className="text-slate-400 font-medium">Prospective Buyer:</div>
                <div className="font-bold text-white text-sm">{enq.buyerName}</div>
                <div className="text-slate-400">{enq.buyerCompany}</div>
                <div className="text-slate-400 flex items-center gap-1.5 pt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{enq.buyerPhone}</span>
                </div>
                <div className="text-slate-500 text-[11px]">{enq.buyerLocation}</div>
              </div>
            </div>

            {/* In-Line Reply Box */}
            {activeReplyId === enq.id && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <textarea
                  rows={2}
                  value={replyText[enq.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [enq.id]: e.target.value })}
                  placeholder={`Write official reply to ${enq.buyerName}...`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(enq.id)}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveReplyId(activeReplyId === enq.id ? null : enq.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Reply
                </button>

                <button
                  onClick={() => onOpenChat(enq.buyerName, enq.enquiryCode)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>RZ Chat</span>
                </button>

                <button
                  onClick={() => onOpenOttModal(enq.enquiryCode)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Create OTT Task</span>
                </button>
              </div>

              <button
                onClick={() => onConvertToDeal(enq)}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Convert to Deal</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
