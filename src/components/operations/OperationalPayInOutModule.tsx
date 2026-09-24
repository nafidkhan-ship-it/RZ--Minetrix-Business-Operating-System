import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  Truck,
  Pickaxe,
  Check,
  Paperclip,
  Eye,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { OperationalPlatform } from './OperationalAttendanceModule';

export interface PayRecord {
  id: string;
  referenceNo: string;
  direction: 'PAY_IN' | 'PAY_OUT';
  platform: OperationalPlatform;
  date: string;
  partyName: string;
  partyType: 'Customer' | 'Supplier' | 'Driver' | 'Vendor' | 'Contractor' | 'Land Owner' | 'Employee' | 'Other';
  entryType: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer (NEFT/RTGS)' | 'UPI' | 'Cheque' | 'Credit';
  bankAccount: string;
  category: string;
  description: string;
  documentAttached: boolean;
  createdBy: string;
  approvedBy: string;
  status: 'APPROVED' | 'PENDING' | 'DRAFT' | 'REJECTED';
}

interface OperationalPayInOutModuleProps {
  platform: OperationalPlatform;
  defaultMode?: 'ALL' | 'PAY_IN' | 'PAY_OUT';
  onCreateOttTask?: (taskTitle: string) => void;
}

export const OperationalPayInOutModule: React.FC<OperationalPayInOutModuleProps> = ({
  platform,
  defaultMode = 'ALL',
  onCreateOttTask
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAY_IN' | 'PAY_OUT'>(defaultMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalDirection, setModalDirection] = useState<'PAY_IN' | 'PAY_OUT'>('PAY_IN');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Pre-seed sample transactions tagged strictly with platform
  const getInitialRecords = (): PayRecord[] => {
    if (platform === 'QUARRY') {
      return [
        {
          id: 'TRX-Q-001',
          referenceNo: 'PAYIN-Q-2609-01',
          direction: 'PAY_IN',
          platform: 'QUARRY',
          date: '2026-09-21',
          partyName: 'Malabar Infrastructure Ltd',
          partyType: 'Customer',
          entryType: 'Advance for Laterite Stones',
          amount: 250000,
          paymentMethod: 'Bank Transfer (NEFT/RTGS)',
          bankAccount: 'HDFC Escrow Mining A/c #9941',
          category: 'Stone Sales Advance',
          description: 'Payment for 5,000 Grade A Laterite cut blocks',
          documentAttached: true,
          createdBy: 'Finance Desk (P. Nair)',
          approvedBy: 'Quarry General Manager',
          status: 'APPROVED'
        },
        {
          id: 'TRX-Q-002',
          referenceNo: 'PAYOUT-Q-2609-02',
          direction: 'PAY_OUT',
          platform: 'QUARRY',
          date: '2026-09-21',
          partyName: 'K. Shankaran (Land Owner)',
          partyType: 'Land Owner',
          entryType: 'Royalty / Lease Payment',
          amount: 84000,
          paymentMethod: 'Bank Transfer (NEFT/RTGS)',
          bankAccount: 'SBI Current A/c #3102',
          category: 'Land Royalty',
          description: 'Fortnightly extraction royalty for Survey #412/1A (14,000 blocks @ ₹6.00)',
          documentAttached: true,
          createdBy: 'Mining Accountant',
          approvedBy: 'Managing Director',
          status: 'APPROVED'
        },
        {
          id: 'TRX-Q-003',
          referenceNo: 'PAYOUT-Q-2609-03',
          direction: 'PAY_OUT',
          platform: 'QUARRY',
          date: '2026-09-20',
          partyName: 'Bharat Petroleum Depot',
          partyType: 'Supplier',
          entryType: 'Fuel Payment',
          amount: 145000,
          paymentMethod: 'Bank Transfer (NEFT/RTGS)',
          bankAccount: 'HDFC Current A/c #8812',
          category: 'High Speed Diesel (HSD)',
          description: '1,800 L Diesel for Excavators & Stone Cutters',
          documentAttached: true,
          createdBy: 'Store In-Charge',
          approvedBy: 'Quarry Manager',
          status: 'APPROVED'
        },
        {
          id: 'TRX-Q-004',
          referenceNo: 'PAYIN-Q-2609-04',
          direction: 'PAY_IN',
          platform: 'QUARRY',
          date: '2026-09-20',
          partyName: 'Apex Builders & Developers',
          partyType: 'Customer',
          entryType: 'Invoice Payment',
          amount: 180000,
          paymentMethod: 'Cheque',
          bankAccount: 'ICICI Commercial A/c #5521',
          category: 'Direct Sales',
          description: 'Settlement of Bill #INV-QP-4091',
          documentAttached: false,
          createdBy: 'Billing Desk',
          approvedBy: 'Chief Accountant',
          status: 'APPROVED'
        }
      ];
    } else if (platform === 'CRUSHER') {
      return [
        {
          id: 'TRX-C-001',
          referenceNo: 'PAYIN-C-2609-01',
          direction: 'PAY_IN',
          platform: 'CRUSHER',
          date: '2026-09-21',
          partyName: 'Kochi Metro Contractors JV',
          partyType: 'Customer',
          entryType: 'Commercial Aggregate Supply',
          amount: 420000,
          paymentMethod: 'Bank Transfer (NEFT/RTGS)',
          bankAccount: 'Federal Bank Crusher A/c #4401',
          category: 'M-Sand & 20mm Aggregates',
          description: 'Supply of 600 MT certified washed M-Sand',
          documentAttached: true,
          createdBy: 'Sales Officer',
          approvedBy: 'Crusher Operations Head',
          status: 'APPROVED'
        },
        {
          id: 'TRX-C-002',
          referenceNo: 'PAYOUT-C-2609-02',
          direction: 'PAY_OUT',
          platform: 'CRUSHER',
          date: '2026-09-21',
          partyName: 'State Electricity Board (KSEB)',
          partyType: 'Vendor',
          entryType: 'Power Utility Bill',
          amount: 198000,
          paymentMethod: 'Bank Transfer (NEFT/RTGS)',
          bankAccount: 'Federal Bank Crusher A/c #4401',
          category: 'HT Industrial Power',
          description: 'August HT Tariff 250kVA demand for VSI & Jaw Plants',
          documentAttached: true,
          createdBy: 'Plant Accountant',
          approvedBy: 'Director of Plant',
          status: 'APPROVED'
        },
        {
          id: 'TRX-C-003',
          referenceNo: 'PAYOUT-C-2609-03',
          direction: 'PAY_OUT',
          platform: 'CRUSHER',
          date: '2026-09-19',
          partyName: 'Trio Engineering & Spares',
          partyType: 'Vendor',
          entryType: 'Repair / Maintenance',
          amount: 72500,
          paymentMethod: 'UPI',
          bankAccount: 'Cash in Hand Petty A/c',
          category: 'Crusher Wear Plates',
          description: 'High manganese jaw plate wear replacement',
          documentAttached: true,
          createdBy: 'Mechanical Engineer',
          approvedBy: 'Plant Supervisor',
          status: 'APPROVED'
        }
      ];
    } else {
      // VEHICLE
      return [
        {
          id: 'TRX-V-001',
          referenceNo: 'PAYIN-V-2609-01',
          direction: 'PAY_IN',
          platform: 'VEHICLE',
          date: '2026-09-21',
          partyName: 'Sobha Horizon City Project',
          partyType: 'Customer',
          entryType: 'Freight / Haulage Billing',
          amount: 175000,
          paymentMethod: 'Bank Transfer (NEFT/RTGS)',
          bankAccount: 'Axis Fleet Logistics A/c #1120',
          category: 'Dedicated Tipper Trips',
          description: '14 round-trip loads of Aggregates (KL-14-AJ-8821 & 8822)',
          documentAttached: true,
          createdBy: 'Fleet Dispatch Desk',
          approvedBy: 'Fleet Logistics Head',
          status: 'APPROVED'
        },
        {
          id: 'TRX-V-002',
          referenceNo: 'PAYOUT-V-2609-02',
          direction: 'PAY_OUT',
          platform: 'VEHICLE',
          date: '2026-09-21',
          partyName: 'Indian Oil Highway Pump',
          partyType: 'Supplier',
          entryType: 'Fleet Diesel Fill',
          amount: 92000,
          paymentMethod: 'Bank Transfer (NEFT/RTGS)',
          bankAccount: 'Axis Fleet Logistics A/c #1120',
          category: 'Vehicle Fuel Card Refill',
          description: '1,000 L HSD for 6 Heavy Tippers',
          documentAttached: true,
          createdBy: 'Fleet Officer',
          approvedBy: 'Transport Manager',
          status: 'APPROVED'
        },
        {
          id: 'TRX-V-003',
          referenceNo: 'PAYOUT-V-2609-03',
          direction: 'PAY_OUT',
          platform: 'VEHICLE',
          date: '2026-09-20',
          partyName: 'National Insurance Company',
          partyType: 'Vendor',
          entryType: 'Comprehensive Insurance',
          amount: 68500,
          paymentMethod: 'Bank Transfer (NEFT/RTGS)',
          bankAccount: 'Axis Fleet Logistics A/c #1120',
          category: 'Vehicle Regulatory Compliance',
          description: 'Annual comprehensive policy renewal for KL-14-B-7719 12-Wheeler',
          documentAttached: true,
          createdBy: 'Fleet Compliance Officer',
          approvedBy: 'Managing Director',
          status: 'APPROVED'
        },
        {
          id: 'TRX-V-004',
          referenceNo: 'PAYOUT-V-2609-04',
          direction: 'PAY_OUT',
          platform: 'VEHICLE',
          date: '2026-09-20',
          partyName: 'Muneer Ahmed & Drivers Pool',
          partyType: 'Driver',
          entryType: 'Driver Trip Allowance & Bata',
          amount: 24500,
          paymentMethod: 'Cash',
          bankAccount: 'Fleet Petty Cash',
          category: 'Trip Wages',
          description: 'Weekly trip bata and food allowance for 6 drivers',
          documentAttached: true,
          createdBy: 'Dispatcher',
          approvedBy: 'Fleet Manager',
          status: 'APPROVED'
        }
      ];
    }
  };

  const [records, setRecords] = useState<PayRecord[]>(getInitialRecords());

  // Form state for modal
  const [formParty, setFormParty] = useState('');
  const [formPartyType, setFormPartyType] = useState<PayRecord['partyType']>('Customer');
  const [formEntryType, setFormEntryType] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formMethod, setFormMethod] = useState<PayRecord['paymentMethod']>('Bank Transfer (NEFT/RTGS)');
  const [formAccount, setFormAccount] = useState('Primary Escrow A/c');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formParty || !formAmount) {
      showToast('Party and Amount are required');
      return;
    }

    const numAmt = parseFloat(formAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      showToast('Enter a valid amount');
      return;
    }

    const newRec: PayRecord = {
      id: `TRX-${platform[0]}-${Date.now().toString().slice(-4)}`,
      referenceNo: `${modalDirection === 'PAY_IN' ? 'PAYIN' : 'PAYOUT'}-${platform[0]}-${Date.now().toString().slice(-5)}`,
      direction: modalDirection,
      platform,
      date: new Date().toISOString().split('T')[0],
      partyName: formParty,
      partyType: formPartyType,
      entryType: formEntryType || (modalDirection === 'PAY_IN' ? 'Invoice Settlement' : 'Operational Expense'),
      amount: numAmt,
      paymentMethod: formMethod,
      bankAccount: formAccount,
      category: formCategory || 'General Ledger',
      description: formDescription,
      documentAttached: true,
      createdBy: 'Finance Operator',
      approvedBy: 'Pending Authorization',
      status: 'PENDING'
    };

    setRecords([newRec, ...records]);
    setIsNewModalOpen(false);
    setFormParty('');
    setFormAmount('');
    setFormDescription('');
    showToast(`Created ${modalDirection === 'PAY_IN' ? 'Pay-In' : 'Pay-Out'} voucher for ₹${numAmt.toLocaleString('en-IN')}`);
  };

  const filteredRecords = records.filter((r) => {
    const matchesDirection = activeTab === 'ALL' || r.direction === activeTab;
    const matchesSearch =
      r.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesDirection && matchesSearch && matchesStatus;
  });

  const totalPayIn = records
    .filter((r) => r.direction === 'PAY_IN' && r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPayOut = records
    .filter((r) => r.direction === 'PAY_OUT' && r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.amount, 0);

  const netCashFlow = totalPayIn - totalPayOut;

  const PlatformIcon = platform === 'QUARRY' ? Pickaxe : platform === 'CRUSHER' ? Building2 : Truck;

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & KPI Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <PlatformIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {platform} FINANCIAL LEDGER & ACCOUNTS
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Real-Time Cash & Bank Audit</span>
              </div>
              <h2 className="text-lg font-black text-white">{platform} Pay-In & Pay-Out Ledger</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setModalDirection('PAY_IN');
                setIsNewModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>+ New Pay-In</span>
            </button>
            <button
              onClick={() => {
                setModalDirection('PAY_OUT');
                setIsNewModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>- New Pay-Out</span>
            </button>
            <button
              onClick={() => {
                if (onCreateOttTask) {
                  onCreateOttTask(`Reconcile ${platform} Pay-In / Pay-Out Bank Statements`);
                }
                showToast(`Created OTT Task: Reconcile ${platform} accounts`);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Audit OTT Task</span>
            </button>
            <button
              onClick={() => showToast(`Exported ${platform} Cash/Bank Ledger (Excel)`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Export Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast(`Printing ${platform} Official Day Book Ledger`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-950/70 border border-emerald-500/20 rounded-2xl">
            <div className="flex items-center justify-between text-[11px] text-emerald-400">
              <span>Total Approved Pay-In</span>
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div className="text-xl font-mono font-black text-white mt-1">
              ₹{(totalPayIn / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Collections, advances & invoices</div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-rose-500/20 rounded-2xl">
            <div className="flex items-center justify-between text-[11px] text-rose-400">
              <span>Total Approved Pay-Out</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="text-xl font-mono font-black text-white mt-1">
              ₹{(totalPayOut / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Fuel, spares, royalty & expenses</div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-[11px] text-cyan-400">
              <span>Net Platform Liquidity</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className={`text-xl font-mono font-black mt-1 ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{(netCashFlow / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Current cycle surplus</div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-[11px] text-amber-400">
              <span>Audit Verification</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl font-mono font-black text-white mt-1">100% Tax Compliant</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">GST & e-Way bill cross-linked</div>
          </div>
        </div>
      </div>

      {/* Tabs and Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            All Transactions ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('PAY_IN')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
              activeTab === 'PAY_IN'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-emerald-400 hover:text-emerald-300 bg-slate-950'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Pay-In ({records.filter((r) => r.direction === 'PAY_IN').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('PAY_OUT')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
              activeTab === 'PAY_OUT'
                ? 'bg-rose-500 text-white shadow'
                : 'text-rose-400 hover:text-rose-300 bg-slate-950'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Pay-Out ({records.filter((r) => r.direction === 'PAY_OUT').length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search reference, party, remark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Reference / Date</th>
                <th className="p-3">Party & Relation</th>
                <th className="p-3">Transaction Type</th>
                <th className="p-3">Payment Method & Bank</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Authorized By</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {rec.direction === 'PAY_IN' ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      )}
                      <span className="font-bold text-white font-mono">{rec.referenceNo}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{rec.date}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{rec.partyName}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {rec.partyType}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-200 font-medium">{rec.entryType}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs">{rec.description}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-300">{rec.paymentMethod}</div>
                    <div className="text-[10px] font-mono text-slate-500">{rec.bankAccount}</div>
                  </td>
                  <td className="p-3 font-mono font-black text-sm">
                    {rec.direction === 'PAY_IN' ? (
                      <span className="text-emerald-400">+₹{rec.amount.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-rose-400">-₹{rec.amount.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        rec.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : rec.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-400">
                    <div>{rec.approvedBy}</div>
                    <div className="text-[10px] text-slate-500">Created: {rec.createdBy}</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => showToast(`Voucher ${rec.referenceNo} downloaded`)}
                        title="Download Receipt"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (onCreateOttTask) {
                            onCreateOttTask(`Follow up on payment: ${rec.partyName} (₹${rec.amount})`);
                          }
                          showToast(`Created OTT follow-up task for ${rec.partyName}`);
                        }}
                        title="Create OTT Task"
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Voucher Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {modalDirection === 'PAY_IN' ? (
                  <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-rose-400" />
                )}
                <div>
                  <h3 className="text-base font-bold text-white">
                    Create {platform} {modalDirection === 'PAY_IN' ? 'Pay-In (Receipt)' : 'Pay-Out (Payment)'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Platform Identifier: {platform}</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Party Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Builders, K. Mohan"
                    value={formParty}
                    onChange={(e) => setFormParty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Party Type</label>
                  <select
                    value={formPartyType}
                    onChange={(e) => setFormPartyType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Driver">Driver</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Land Owner">Land Owner</option>
                    <option value="Employee">Employee</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 50000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit Ledger</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Cash / Bank Account</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Escrow Mining A/c #9941"
                    value={formAccount}
                    onChange={(e) => setFormAccount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Ledger Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Stone Advance, Fuel, Machinery Repair"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transaction Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Provide transaction details, invoice ref, or vehicle registration"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">Attach Bill / Proof / e-Way Bill</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Proof of payment attached')}
                  className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700"
                >
                  Choose File
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl font-bold shadow ${
                    modalDirection === 'PAY_IN'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  Save {modalDirection === 'PAY_IN' ? 'Pay-In' : 'Pay-Out'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
