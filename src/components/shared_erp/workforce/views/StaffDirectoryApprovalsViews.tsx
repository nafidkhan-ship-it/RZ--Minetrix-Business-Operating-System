import React, { useState } from 'react';
import {
  Contact,
  CheckSquare,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CreditCard,
  Truck,
  FolderLock
} from 'lucide-react';
import { Employee, WorkforceApproval, WorkforceSectionTab } from '../types';
import { MOCK_EMPLOYEES, MOCK_WORKFORCE_APPROVALS } from '../workforceMockData';

interface ViewProps {
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onNavigateTab?: (tab: WorkforceSectionTab) => void;
  onSelectEmployee?: (emp: Employee) => void;
}

/* ========================================================================
   1. VISUAL STAFF DIRECTORY VIEW
   ======================================================================== */
export const StaffDirectoryView: React.FC<ViewProps> = ({ onToast, onSelectEmployee }) => {
  const [employees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              COMMUNICATION &amp; ROSTER DIRECTORY
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Contact className="w-5 h-5 text-amber-400" />
            <span>Visual Staff Directory ({filtered.length} Contacts)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Direct communication channels: Phone calling, company email dispatch, and RZ&reg; Chat bridge.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name or role..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-amber-500/40 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start gap-3">
                <img
                  src={emp.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={emp.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-amber-400 font-bold">{emp.id}</span>
                  <h3 className="text-sm font-bold text-white font-sans truncate">{emp.name}</h3>
                  <p className="text-[11px] text-slate-400 font-sans truncate">{emp.designation}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                <div className="text-slate-300 font-sans flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="text-slate-400 text-[11px] truncate">{emp.branch}</div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => onToast(`Initiating call to ${emp.phone}`)}
                className="py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 flex items-center justify-center cursor-pointer border border-slate-800"
                title="Call"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onToast(`Opened mail composer for ${emp.email}`)}
                className="py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-400 flex items-center justify-center cursor-pointer border border-slate-800"
                title="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onToast(`Switched to RZ® Chat with ${emp.name}`)}
                className="py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 flex items-center justify-center cursor-pointer border border-slate-800"
                title="Open RZ® Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectEmployee?.(emp)}
                className="py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center cursor-pointer font-bold"
                title="Profile Dossier"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========================================================================
   2. WORKFORCE APPROVALS HUB VIEW
   ======================================================================== */
export const WorkforceApprovalsView: React.FC<ViewProps> = ({ onToast }) => {
  const [approvals, setApprovals] = useState<WorkforceApproval[]>(MOCK_WORKFORCE_APPROVALS);
  const [filterType, setFilterType] = useState('ALL');

  const filtered = approvals.filter((a) => filterType === 'ALL' || a.type === filterType);

  const handleApprove = (id: string, name: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Approved' } : a))
    );
    onToast(`Approved ${name} request`);
  };

  const handleReject = (id: string, name: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Rejected' } : a))
    );
    onToast(`Rejected ${name} request`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Leave': return Calendar;
      case 'Overtime': return Clock;
      case 'Staff Advance': return CreditCard;
      case 'Batta': return Truck;
      case 'Salary': return DollarSign;
      case 'Documents': return FolderLock;
      default: return CheckSquare;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              UNIFIED WORKFORCE AUTHORIZATION
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            <span>Workforce Approvals Hub ({approvals.filter((a) => a.status === 'Pending').length} Pending)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Centralized approval queue across Leave, Overtime, Advances, Batta, Salary, and Compliance Documents.
          </p>
        </div>

        <button
          onClick={() => {
            setApprovals((prev) => prev.map((a) => ({ ...a, status: 'Approved' })));
            onToast('All pending approvals authorized');
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approve All Pending</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex items-center gap-2 overflow-x-auto scrollbar-none font-mono">
        {['ALL', 'Leave', 'Overtime', 'Staff Advance', 'Batta', 'Salary', 'Documents'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
              filterType === type
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {type === 'ALL' ? 'All Queues' : type}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filtered.map((item) => {
          const Icon = getTypeIcon(item.type);
          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold">{item.id}</span>
                      <h4 className="text-xs font-bold text-white uppercase">{item.type}</h4>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                      item.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : item.status === 'Rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="text-sm font-bold text-white font-sans">{item.employeeName}</div>
                  <div className="text-[10px] text-slate-500">{item.employeeId} &bull; {item.department}</div>
                  <div className="text-xs font-bold text-cyan-400 mt-1">{item.amountOrDays}</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2">{item.details}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500">{item.date}</span>
                {item.status === 'Pending' ? (
                  <div className="flex items-center gap-1.5 font-sans">
                    <button
                      onClick={() => handleReject(item.id, item.type)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(item.id, item.type)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-bold font-sans">Resolved</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
