import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  FileText,
  DollarSign,
  TrendingUp,
  CreditCard,
  MessageSquare,
  Clock,
  Printer,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Coins,
  CheckCircle2,
  Send,
  Plus,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import {
  LandOwner,
  DEMO_LAND_PARCELS,
  DEMO_LAND_AGREEMENTS,
  DEMO_LAND_WORKING_AREAS,
  DEMO_TRACEABILITY_LOADS,
  DEMO_OWNER_ADVANCES,
  DEMO_OWNER_PAYMENTS,
  DEMO_OWNER_SETTLEMENTS,
  DEMO_OWNER_STATEMENTS,
  DEMO_LAND_DOCUMENTS,
  DEMO_BUYER_ENQUIRIES
} from '../../data/quarryLandData';
import { SectionId } from '../../types/architecture';

interface LandOwnerProfileModalProps {
  owner: LandOwner | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection?: (sectionId: SectionId) => void;
  onOpenNewParcel?: (ownerId: string) => void;
  onOpenNewAgreement?: (ownerId: string) => void;
  onOpenNewAdvance?: (ownerId: string) => void;
  onOpenNewPayment?: (ownerId: string) => void;
  onOpenNewSettlement?: (ownerId: string) => void;
  onOpenChat?: (ownerName: string, refCode: string) => void;
  onOpenOtt?: (refCode: string) => void;
}

export type ProfileTab =
  | 'overview'
  | 'parcels'
  | 'connections'
  | 'agreements'
  | 'working-areas'
  | 'loads'
  | 'advances'
  | 'payments'
  | 'settlement'
  | 'account'
  | 'statements'
  | 'documents'
  | 'enquiries'
  | 'rz-chat'
  | 'rz-ott';

export const LandOwnerProfileModal: React.FC<LandOwnerProfileModalProps> = ({
  owner,
  isOpen,
  onClose,
  onNavigateSection,
  onOpenNewParcel,
  onOpenNewAgreement,
  onOpenNewAdvance,
  onOpenNewPayment,
  onOpenNewSettlement,
  onOpenChat,
  onOpenOtt
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'me' | 'owner'; text: string; time: string }[]
  >([
    {
      sender: 'owner',
      text: 'Namaskaram. Please send the certified dispatch weighment summary for Kasaragod Pit Bench A for this past week.',
      time: '09:40 AM'
    },
    {
      sender: 'me',
      text: 'Good morning Shri Prabhakar Pai. Weighment slips for 48 loads verified. Payout of ₹1,20,000 processed via RTGS.',
      time: '10:05 AM'
    }
  ]);

  if (!isOpen || !owner) return null;

  // Filter owner data
  const parcels = DEMO_LAND_PARCELS.filter((p) =>
    p.owners.some((o) => o.ownerId === owner.id)
  );
  const agreements = DEMO_LAND_AGREEMENTS.filter((a) => a.ownerId === owner.id);
  const workingAreas = DEMO_LAND_WORKING_AREAS.filter((w) =>
    w.ownerIds.includes(owner.id)
  );
  const loads = DEMO_TRACEABILITY_LOADS.filter((l) => l.ownerId === owner.id);
  const advances = DEMO_OWNER_ADVANCES.filter((a) => a.ownerId === owner.id);
  const payments = DEMO_OWNER_PAYMENTS.filter((p) => p.ownerId === owner.id);
  const settlements = DEMO_OWNER_SETTLEMENTS.filter((s) => s.ownerId === owner.id);
  const statements = DEMO_OWNER_STATEMENTS.filter((s) => s.ownerId === owner.id);
  const documents = DEMO_LAND_DOCUMENTS.filter((d) => d.ownerId === owner.id);
  const enquiries = DEMO_BUYER_ENQUIRIES.filter((e) =>
    agreements.some((a) => a.parcelIds.includes(e.listingId)) || true
  ).slice(0, 2);

  const TABS: { id: ProfileTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'parcels', label: 'Land Parcels', count: parcels.length },
    { id: 'connections', label: 'Quarry Connections', count: owner.quarryConnections.length },
    { id: 'agreements', label: 'Agreements', count: agreements.length },
    { id: 'working-areas', label: 'Working Areas', count: workingAreas.length },
    { id: 'loads', label: 'Loads', count: loads.length },
    { id: 'advances', label: 'Advances', count: advances.length },
    { id: 'payments', label: 'Payments', count: payments.length },
    { id: 'settlement', label: 'Settlement', count: settlements.length },
    { id: 'account', label: 'Account' },
    { id: 'statements', label: 'Statements', count: statements.length },
    { id: 'documents', label: 'Documents', count: documents.length },
    { id: 'enquiries', label: 'Enquiries', count: enquiries.length },
    { id: 'rz-chat', label: 'RZ® Chat' },
    { id: 'rz-ott', label: 'RZ® OTT Tasks' }
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      sender: 'me' as const,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
              {owner.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-purple-400">{owner.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {owner.status}
                </span>
                {owner.roles.map((r, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-black text-white">{owner.name}</h2>
              <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap mt-0.5">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {owner.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {owner.district}, {owner.state}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics in Header */}
          <div className="flex items-center gap-4 text-right flex-wrap self-end sm:self-center">
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Extent</div>
              <div className="text-base font-black text-white font-mono">
                {owner.totalExtentCents} Cents{' '}
                <span className="text-slate-400 text-xs">({owner.totalExtentAcres} Ac)</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Outstanding</div>
              <div className="text-base font-black text-amber-400 font-mono">
                ₹{owner.outstandingBalanceRs.toLocaleString('en-IN')}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 15-TAB NAVIGATION (Horizontal scroll) */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1 min-w-max">
            {TABS.map((tab) => {
              const isAct = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                    isAct
                      ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold shadow-md'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isAct ? 'bg-slate-950 text-purple-300' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENTS (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Studio preview note */}
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-between text-purple-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    <strong>Studio Preview / Demo Data:</strong> Land Ownership verified against Hosdurg Revenue Sub-Registry records.
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-purple-400">
                  Cadastral Verified
                </span>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="text-slate-400 text-[11px]">Total Land Parcels</div>
                  <div className="text-xl font-black text-white font-mono mt-0.5">
                    {owner.totalParcels} Parcels
                  </div>
                  <div className="text-[10px] text-purple-400 mt-0.5">
                    {owner.totalExtentCents} Cents ({owner.totalExtentAcres} Acres)
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="text-slate-400 text-[11px]">Active Agreements</div>
                  <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">
                    {owner.activeAgreementsCount} Active
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Mining & Return + Per-Load
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="text-slate-400 text-[11px]">Cumulative Earnings</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                    ₹{owner.totalPayableEarnedRs.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    ₹{owner.totalPaidReceivedRs.toLocaleString('en-IN')} Received
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="text-slate-400 text-[11px]">Net Outstanding Payable</div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                    ₹{owner.outstandingBalanceRs.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-amber-300 mt-0.5">
                    ₹{advances.reduce((a, b) => a + b.remainingAdvanceRs, 0).toLocaleString('en-IN')} Active Advance
                  </div>
                </div>
              </div>

              {/* Personal & Legal Dossier Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Identity & Address Registry</span>
                  </h4>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Full Legal Name:</span>
                      <span className="font-bold text-white">{owner.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Person ID:</span>
                      <span className="font-mono text-purple-400">{owner.personId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">ID / Doc Reference:</span>
                      <span className="font-mono text-white">{owner.idDocRef}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Primary Contact:</span>
                      <span className="text-white">{owner.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Official Email:</span>
                      <span className="text-white">{owner.email}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Residential Address:</span>
                      <span className="text-right text-white max-w-[220px]">{owner.address}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Bank & Financial Routing</span>
                  </h4>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Bank Name:</span>
                      <span className="font-bold text-white">{owner.bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Account Number:</span>
                      <span className="font-mono text-emerald-400">{owner.bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">IFSC Code:</span>
                      <span className="font-mono text-white">{owner.bankDetails.ifscCode}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Branch Name:</span>
                      <span className="text-white">{owner.bankDetails.branch}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Direct RTGS / NEFT Payouts:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Auto-Reconciled
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => onOpenNewAgreement && onOpenNewAgreement(owner.id)}
                  className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Agreement</span>
                </button>
                <button
                  onClick={() => onOpenNewParcel && onOpenNewParcel(owner.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Parcel</span>
                </button>
                <button
                  onClick={() => onOpenNewAdvance && onOpenNewAdvance(owner.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>+ Issue Advance</span>
                </button>
                <button
                  onClick={() => onOpenNewPayment && onOpenNewPayment(owner.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>+ Record Payment</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LAND PARCELS */}
          {activeTab === 'parcels' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">
                  Registered Parcels Owned by {owner.name} ({parcels.length})
                </h4>
                <button
                  onClick={() => onOpenNewParcel && onOpenNewParcel(owner.id)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Land Parcel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-purple-400">{parcel.code}</span>
                        <h5 className="font-black text-white text-sm">
                          Survey {parcel.surveyNumber} ({parcel.extent} {parcel.unit})
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          {parcel.village}, {parcel.localBody}, {parcel.district}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {parcel.currentStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-slate-900/60 p-2.5 rounded-xl">
                      <div><strong>Material Potential:</strong> {parcel.estimatedMineralYield}</div>
                      <div><strong>Access Road:</strong> {parcel.accessRoad}</div>
                      {parcel.quarryName && (
                        <div><strong>Connected Quarry:</strong> <span className="text-purple-300">{parcel.quarryName}</span></div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">{parcel.documentsCount} Legal Documents</span>
                      <button
                        onClick={() => setActiveTab('agreements')}
                        className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Agreements</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUARRY CONNECTIONS */}
          {activeTab === 'connections' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">
                Quarries Connected to {owner.name}&apos;s Land Parcels
              </h4>
              <div className="space-y-3">
                {owner.quarryConnections.map((qc, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{qc.quarryName}</div>
                        <div className="text-slate-400 text-xs font-mono">{qc.quarryId}</div>
                        <div className="text-purple-400 text-[11px] mt-0.5">{qc.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateSection && onNavigateSection('quarry-management')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Open in Platform 1 (Quarry)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AGREEMENTS */}
          {activeTab === 'agreements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">
                  Active & Executed Land Agreements ({agreements.length})
                </h4>
                <button
                  onClick={() => onOpenNewAgreement && onOpenNewAgreement(owner.id)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Agreement</span>
                </button>
              </div>

              <div className="space-y-3">
                {agreements.map((agr) => (
                  <div
                    key={agr.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-400">
                            {agr.agreementNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {agr.type}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {agr.status}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-sm mt-1">
                          {agr.parcelSurveys} &bull; {agr.material}
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          Connected Quarry: {agr.quarryName} | Working Area: {agr.workingAreaName || 'N/A'}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Agreed Value</div>
                        <div className="text-lg font-black text-white font-mono">
                          ₹{agr.totalAgreedPayableRs.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          ₹{agr.paidAmountRs.toLocaleString('en-IN')} Paid &bull; Bal: ₹{agr.balanceAmountRs.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/70 rounded-xl text-[11px] text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Payment Cycle:</span>
                        <span className="font-bold text-white">{agr.paymentCycle}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Effective Period:</span>
                        <span className="text-white">{agr.effectiveDate} to {agr.expiryDate || 'Perpetual'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Registration:</span>
                        <span className="text-white">{agr.registrationStatus}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Advance Paid:</span>
                        <span className="font-mono font-bold text-amber-400">₹{agr.advanceAmountRs.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {agr.returnCondition && (
                      <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        <strong>Restoration & Return Terms:</strong> {agr.returnCondition}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WORKING AREAS */}
          {activeTab === 'working-areas' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">
                Active Quarry Working Areas / Benches ({workingAreas.length})
              </h4>
              <div className="space-y-3">
                {workingAreas.map((wa) => (
                  <div
                    key={wa.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-400">{wa.code}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {wa.productionStatus}
                        </span>
                      </div>
                      <h5 className="font-bold text-white text-sm mt-0.5">{wa.name}</h5>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Quarry: {wa.quarryName} | Extent: {wa.areaExtentCents} Cents ({wa.areaExtentAcres} Ac) | Depth: {wa.benchDepthMeters}m
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Extraction</div>
                      <div className="text-base font-black text-white font-mono">{wa.totalExtractedQty}</div>
                      <div className="text-[10px] text-purple-400 font-mono">{wa.loadCount} Total Dispatched Loads</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LOADS */}
          {activeTab === 'loads' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">
                Dispatched Loads Traceable to {owner.name}&apos;s Land ({loads.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                      <th className="py-2 px-3">Load No</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Working Bench</th>
                      <th className="py-2 px-3">Vehicle</th>
                      <th className="py-2 px-3">Quantity</th>
                      <th className="py-2 px-3 text-right">Payable</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {loads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-bold text-purple-400">{l.loadNumber}</td>
                        <td className="py-2.5 px-3 text-slate-300">{l.date}</td>
                        <td className="py-2.5 px-3 text-white font-sans">{l.workingAreaName}</td>
                        <td className="py-2.5 px-3 text-cyan-400">{l.vehicleNumber}</td>
                        <td className="py-2.5 px-3 text-white">{l.quantity} {l.unit}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                          ₹{l.payableToOwnerRs.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                            {l.settlementStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: ADVANCES */}
          {activeTab === 'advances' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">
                  Owner Advances & Commitment Adjustments ({advances.length})
                </h4>
                <button
                  onClick={() => onOpenNewAdvance && onOpenNewAdvance(owner.id)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Issue Advance</span>
                </button>
              </div>

              <div className="space-y-3">
                {advances.map((adv) => (
                  <div
                    key={adv.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {adv.advanceNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                          {adv.paymentMethod}
                        </span>
                        <span className="text-[10px] text-slate-400">{adv.date}</span>
                      </div>
                      <div className="text-white font-bold text-sm mt-1">{adv.agreementNumber}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{adv.notes}</p>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">Ref: {adv.referenceNumber}</div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Advance Amount</div>
                      <div className="text-lg font-black text-amber-400 font-mono">
                        ₹{adv.amountRs.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Adjusted: ₹{adv.adjustedAgainstLoadsRs.toLocaleString('en-IN')} | Remaining: ₹{adv.remainingAdvanceRs.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">
                  Historical Payment Disbursements ({payments.length})
                </h4>
                <button
                  onClick={() => onOpenNewPayment && onOpenNewPayment(owner.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>
              </div>

              <div className="space-y-3">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">{p.paymentNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {p.paymentMethod}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.date}</span>
                      </div>
                      <div className="text-white font-bold text-sm mt-1">{p.notes}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        Ref: {p.referenceNumber} | Agreement: {p.agreementNumber}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Disbursed</div>
                      <div className="text-lg font-black text-emerald-400 font-mono">
                        ₹{p.amountRs.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SETTLEMENT */}
          {activeTab === 'settlement' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">
                  Settlement Runs & Reconciliations ({settlements.length})
                </h4>
                <button
                  onClick={() => onOpenNewSettlement && onOpenNewSettlement(owner.id)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Settlement</span>
                </button>
              </div>

              <div className="space-y-3">
                {settlements.map((set) => (
                  <div
                    key={set.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-400">
                            {set.settlementNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {set.settlementStatus}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-sm mt-0.5">
                          Period: {set.period} &bull; {set.totalLoadsCount} Loads Audited
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          {set.workingAreaName} ({set.agreementNumber})
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Payout</div>
                        <div className="text-lg font-black text-emerald-400 font-mono">
                          ₹{set.netPayableRs.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-xl text-[11px] font-mono grid grid-cols-3 gap-2">
                      <div>Gross Payable: <span className="text-white font-bold">₹{set.totalPayableRs.toLocaleString('en-IN')}</span></div>
                      <div>Advance Deducted: <span className="text-amber-400 font-bold">-₹{set.advanceDeductionRs.toLocaleString('en-IN')}</span></div>
                      <div>Net Payout: <span className="text-emerald-400 font-bold">₹{set.netPayableRs.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">
                Financial Ledger Summary for {owner.name}
              </h4>
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Agreements Committed Value</span>
                    <div className="text-lg font-black text-white font-mono mt-0.5">
                      ₹{owner.totalAgreementsValueRs ? owner.totalAgreementsValueRs.toLocaleString('en-IN') : '60,00,000'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Total Advances Disbursed</span>
                    <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                      ₹{owner.totalAdvancesReceivedRs.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Earned Load Payables</span>
                    <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                      ₹{owner.totalPayableEarnedRs.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Total Payments Credited</span>
                    <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                      ₹{owner.totalPaidReceivedRs.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Outstanding Ledger Balance</span>
                    <div className="text-lg font-black text-yellow-400 font-mono mt-0.5">
                      ₹{owner.outstandingBalanceRs.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Current Pending Settlement</span>
                    <div className="text-lg font-black text-purple-400 font-mono mt-0.5">
                      ₹85,000
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-[11px] text-purple-300">
                  <strong>Ledger Formula:</strong> Outstanding = Total Load Payables + Agreement Value - Advances - Disbursed Payments.
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: STATEMENTS */}
          {activeTab === 'statements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">
                  Chronological Ledger Statement
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Statement</span>
                  </button>
                  <button
                    onClick={() => alert('Exporting Owner Statement CSV...')}
                    className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Reference</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Debit (Payout)</th>
                      <th className="py-2 px-3 text-right">Credit (Earned)</th>
                      <th className="py-2 px-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {statements.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 text-slate-300">{st.date}</td>
                        <td className="py-2.5 px-3 text-purple-400">{st.referenceNo}</td>
                        <td className="py-2.5 px-3 text-white font-sans">{st.remarks}</td>
                        <td className="py-2.5 px-3 text-right text-rose-400">
                          {st.debitRs ? `₹${st.debitRs.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">
                          {st.creditRs ? `₹${st.creditRs.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-white">
                          ₹{st.balanceRs.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">
                Title Deeds, Survey FMB Sketched & Permissions ({documents.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{doc.docTitle}</div>
                        <div className="text-[10px] text-purple-400">{doc.docType}</div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Authority: {doc.notaryOrAuthority}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Size: {doc.fileSize} &bull; Uploaded: {doc.uploadDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {doc.verifiedStatus}
                      </span>
                      <button
                        onClick={() => alert(`Viewing document: ${doc.docTitle}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 13: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">
                Marketplace Enquiries Linked to Land Parcels
              </h4>
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-purple-400 font-bold">{enq.enquiryCode}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300">
                        {enq.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">{enq.buyerCompany} ({enq.buyerName})</div>
                    <p className="text-slate-300 text-xs">{enq.requirement}</p>
                    <div className="text-slate-400 text-[11px] pt-1">
                      Budget: ₹{enq.budgetRs.toLocaleString('en-IN')} &bull; Assigned: {enq.assignedExecutive}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 14: RZ® CHAT */}
          {activeTab === 'rz-chat' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white text-sm">
                    Direct Channel with {owner.name}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>

              {/* Chat Thread */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 h-60 overflow-y-auto space-y-3">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs ${
                        m.sender === 'me'
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 font-mono">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Send message to ${owner.name}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 15: RZ® OTT TASKS */}
          {activeTab === 'rz-ott' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    RZ® OTT Operational Tasks for {owner.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Source Tag: <code>Source: Quarry Land Management, Owner ID: {owner.id}</code>
                  </p>
                </div>
                <button
                  onClick={() => onOpenOtt && onOpenOtt(owner.id)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Task</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs">
                        Title Search & Encumbrance Certificate Verification
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Assigned: Er. Rajesh Nair (Surveyor) &bull; Due: 28 Sep 2026
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    In Progress
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs">
                        Bench A Boundary Cairns & FMB Benchmark Staking
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Assigned: Licensed Surveyor K. Balakrishnan &bull; Completed
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>RZ® MINETRIX BOS &bull; Platform 7</span>
            <span>&bull;</span>
            <span className="text-purple-400 font-mono">ID: {owner.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
