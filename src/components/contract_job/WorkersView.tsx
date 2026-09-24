import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRightLeft,
  Clock,
  UserCheck,
  X
} from 'lucide-react';
import {
  JobWorker,
  WorkerRole,
  SAMPLE_WORKERS,
  SAMPLE_JOBS,
  SAMPLE_CONTRACTORS
} from '../../data/contractJobStudioData';

export const WorkersView: React.FC = () => {
  const [workers, setWorkers] = useState<JobWorker[]>(SAMPLE_WORKERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedWorker, setSelectedWorker] = useState<JobWorker | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Worker form state
  const [newW, setNewW] = useState<Partial<JobWorker>>({
    name: '',
    role: 'Excavator Operator',
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    contractorName: SAMPLE_CONTRACTORS[0]?.name || 'Coastal Blasting & Excavations',
    dailyRate: 900,
    phone: '',
    status: 'Present'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleMarkAttendance = (workerId: string) => {
    setWorkers(
      workers.map((w) =>
        w.id === workerId
          ? {
              ...w,
              attendanceDays: w.attendanceDays + 1,
              status: 'Present'
            }
          : w
      )
    );
    showToast(`Marked today's attendance for Worker ${workerId}`);
  };

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newW.name) return;

    const created: JobWorker = {
      id: `WRK-0${workers.length + 80}`,
      name: newW.name,
      role: (newW.role as WorkerRole) || 'Labourer',
      jobId: newW.jobId || 'JOB-4001',
      contractorName: newW.contractorName || 'Site Direct',
      dailyRate: Number(newW.dailyRate) || 700,
      attendanceDays: 1,
      overtimeHours: 0,
      battaAmount: 150,
      phone: newW.phone || '+91 98450 00000',
      status: 'Present'
    };

    setWorkers([created, ...workers]);
    setIsAddModalOpen(false);
    showToast(`Enrolled worker ${created.name} (${created.id})`);
  };

  const filtered = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.jobId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || w.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Workforce Roster
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filtered.length} Crew Deployed
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Worker Management</h2>
          <p className="text-xs text-slate-400">
            Attendance logs, overtime tracking, site food & travel batta, wage calculations, and cross-job transfers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Enroll Worker</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workers by name, ID, contractor, job ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Roles</option>
            <option value="Excavator Operator">Excavator Operator</option>
            <option value="Tipper Driver">Tipper Driver</option>
            <option value="Blasting Assistant">Blasting Assistant</option>
            <option value="Mason">Mason</option>
            <option value="Labourer">Labourer</option>
            <option value="Site Supervisor">Site Supervisor</option>
          </select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Worker / ID</th>
                <th className="py-3 px-4">Designation / Role</th>
                <th className="py-3 px-4">Contractor / Vendor</th>
                <th className="py-3 px-4">Assigned Job</th>
                <th className="py-3 px-4 text-right">Daily Rate</th>
                <th className="py-3 px-4 text-right">Attendance</th>
                <th className="py-3 px-4 text-right">OT Hours</th>
                <th className="py-3 px-4 text-right">Batta (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-850 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{w.name}</div>
                    <div className="font-mono text-[10px] text-emerald-400">{w.id}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-200">{w.role}</td>
                  <td className="py-3 px-4 text-slate-400">{w.contractorName}</td>
                  <td className="py-3 px-4 font-mono text-purple-400">{w.jobId}</td>
                  <td className="py-3 px-4 text-right font-mono text-white">₹{w.dailyRate}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    {w.attendanceDays} Days
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-400">{w.overtimeHours} hrs</td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400">₹{w.battaAmount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        w.status === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleMarkAttendance(w.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/20 cursor-pointer"
                        title="Mark Attendance"
                      >
                        + Attend
                      </button>
                      <button
                        onClick={() => setSelectedWorker(w)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] cursor-pointer"
                      >
                        Salary
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SALARY / BATTA MODAL */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">{selectedWorker.id}</span>
                <h3 className="text-base font-black text-white">{selectedWorker.name}</h3>
                <div className="text-xs text-slate-400">{selectedWorker.role}</div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Daily Wage Rate:</span>
                <span className="text-white font-mono font-bold">₹{selectedWorker.dailyRate} / day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Days Present (This Month):</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {selectedWorker.attendanceDays} Days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Basic Earned Wages:</span>
                <span className="text-white font-mono font-bold">
                  ₹{(selectedWorker.dailyRate * selectedWorker.attendanceDays).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Overtime Earnings (hrs @ ₹120):</span>
                <span className="text-cyan-400 font-mono font-bold">
                  ₹{(selectedWorker.overtimeHours * 120).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Food & Travel Batta:</span>
                <span className="text-amber-400 font-mono font-bold">
                  ₹{selectedWorker.battaAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                <span className="text-white">Gross Payable:</span>
                <span className="text-emerald-400 font-mono font-black">
                  ₹
                  {(
                    selectedWorker.dailyRate * selectedWorker.attendanceDays +
                    selectedWorker.overtimeHours * 120 +
                    selectedWorker.battaAmount
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`Disbursed salary for ${selectedWorker.name}`);
                  setSelectedWorker(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Approve Wage Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLL WORKER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Enroll Field Worker</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Worker Full Name *</label>
                <input
                  type="text"
                  required
                  value={newW.name}
                  onChange={(e) => setNewW({ ...newW, name: e.target.value })}
                  placeholder="e.g. Suresh Poojary"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Role / Trade</label>
                  <select
                    value={newW.role}
                    onChange={(e) => setNewW({ ...newW, role: e.target.value as WorkerRole })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Excavator Operator">Excavator Operator</option>
                    <option value="Tipper Driver">Tipper Driver</option>
                    <option value="Blasting Assistant">Blasting Assistant</option>
                    <option value="Mason">Mason</option>
                    <option value="Labourer">Labourer</option>
                    <option value="Site Supervisor">Site Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Daily Wage Rate (₹)</label>
                  <input
                    type="number"
                    value={newW.dailyRate}
                    onChange={(e) => setNewW({ ...newW, dailyRate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Assigned Job</label>
                  <select
                    value={newW.jobId}
                    onChange={(e) => setNewW({ ...newW, jobId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    {SAMPLE_JOBS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.id} - {j.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contractor / Vendor</label>
                  <select
                    value={newW.contractorName}
                    onChange={(e) => setNewW({ ...newW, contractorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {SAMPLE_CONTRACTORS.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newW.phone}
                  onChange={(e) => setNewW({ ...newW, phone: e.target.value })}
                  placeholder="+91 98450 XXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Enroll Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
