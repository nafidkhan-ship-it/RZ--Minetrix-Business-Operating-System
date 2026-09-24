import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Calendar,
  Phone,
  Clock,
  CheckCircle2,
  DollarSign,
  Building2,
  MapPin,
  ArrowUpRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  BuyerEnquiryItem,
  SiteVisitItem,
  DEMO_BUYER_ENQUIRIES,
  DEMO_SITE_VISITS
} from '../../../data/quarryLandData';

interface LandEnquiriesViewProps {
  onScheduleVisit: (listingTitle?: string) => void;
  onOpenOtt: (refCode: string) => void;
  onOpenChat: (contactName: string, refCode: string) => void;
}

export const LandEnquiriesView: React.FC<LandEnquiriesViewProps> = ({
  onScheduleVisit,
  onOpenOtt,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'visits'>('enquiries');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEnquiries = DEMO_BUYER_ENQUIRIES.filter((e) => {
    return (
      e.enquiryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.requirement.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredVisits = DEMO_SITE_VISITS.filter((v) => {
    return (
      v.visitCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-yellow-400 font-bold uppercase">
              Platform 7 &bull; Marketplace Operations
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20">
              {DEMO_BUYER_ENQUIRIES.length} Enquiries &bull; {DEMO_SITE_VISITS.length} Scheduled Visits
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Buyer & Investor Enquiries</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional quarry buyers, road contractors, and commercial investors linked with RZ® OTT field tasks.
          </p>
        </div>

        <button
          onClick={() => onScheduleVisit()}
          className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>+ Schedule Site Visit</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              activeTab === 'enquiries'
                ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Buyer & Investor Enquiries ({DEMO_BUYER_ENQUIRIES.length})
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              activeTab === 'visits'
                ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Scheduled Site Visits ({DEMO_SITE_VISITS.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enquiries or visits..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-yellow-500/40 rounded-3xl transition space-y-4 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-yellow-400">{enq.enquiryCode}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {enq.buyerCompany}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                      {enq.status}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">
                    {enq.buyerCompany} &bull; <span className="text-slate-300 font-semibold">{enq.buyerName}</span>
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {enq.buyerPhone}
                    </span>
                    <span>{enq.buyerEmail}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Allocated Budget</div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    ₹{enq.budgetRs.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Assigned: {enq.assignedExecutive}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Commercial Requirement:</span>
                <p className="text-slate-200">{enq.requirement}</p>
                <div className="text-[10px] text-purple-400 font-mono pt-1">Target Listing Ref: {enq.listingId}</div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onScheduleVisit(enq.requirement)}
                    className="px-3 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Field Visit</span>
                  </button>
                  <button
                    onClick={() => onOpenOtt(enq.enquiryCode)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Create RZ OTT Task</span>
                  </button>
                </div>

                <button
                  onClick={() => onOpenChat(enq.buyerName, enq.enquiryCode)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Chat with Lead</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISITS TAB */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          {filteredVisits.map((visit) => (
            <div
              key={visit.id}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-yellow-500/40 rounded-3xl transition space-y-4 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-yellow-400">{visit.visitCode}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {visit.status}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">{visit.listingTitle}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                    <span className="text-white font-semibold">{visit.visitorName} ({visit.visitorType})</span>
                    <span className="font-mono text-slate-400">{visit.visitorPhone}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{visit.date} at {visit.time}</span>
                  </div>
                  <div className="text-[10px] text-purple-400 font-mono mt-0.5">{visit.ottTaskId || 'OTT-DISPATCH-QUEUED'}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Assigned RZ Escort Officer:</span>
                  <span className="text-white font-semibold">{visit.assignedExecutive}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Purpose & Instructions:</span>
                  <span className="text-slate-300">{visit.purpose} &bull; {visit.notes}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                <span className="text-[11px] text-slate-400">
                  Linked to RZ® OTT Engine &bull; Geofenced check-in at pit entrance benchmark
                </span>

                <button
                  onClick={() => onOpenOtt(visit.visitCode)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Open OTT Task</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
