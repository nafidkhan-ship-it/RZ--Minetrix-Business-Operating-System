import React, { useState } from 'react';
import {
  Wallet,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  DollarSign,
  Calendar,
  Tag,
  Paperclip,
  Check,
  XCircle,
  X
} from 'lucide-react';
import {
  JobExpense,
  ExpenseCategory,
  SAMPLE_EXPENSES,
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

export const ExpensesView: React.FC = () => {
  const [expenses, setExpenses] = useState<JobExpense[]>(SAMPLE_EXPENSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Expense form
  const [newExp, setNewExp] = useState<Partial<JobExpense>>({
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    date: '2026-09-23',
    category: 'Explosives / Blasting',
    description: '',
    amount: 75000,
    paidTo: 'Apex Explosives Ltd',
    paymentMethod: 'Bank Transfer (RTGS)',
    approvedBy: 'Er. Rajesh Varma',
    status: 'Approved'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.description || !newExp.amount) return;

    const created: JobExpense = {
      id: `EXP-2026-0${expenses.length + 80}`,
      jobId: newExp.jobId || 'JOB-4001',
      date: newExp.date || '2026-09-23',
      category: (newExp.category as ExpenseCategory) || 'Miscellaneous',
      description: newExp.description,
      amount: Number(newExp.amount) || 10000,
      paidTo: newExp.paidTo || 'Vendor',
      paymentMethod: newExp.paymentMethod || 'Bank Transfer',
      receiptUrl: '#',
      approvedBy: newExp.approvedBy || 'Project Manager',
      status: 'Approved'
    };

    setExpenses([created, ...expenses]);
    setIsAddModalOpen(false);
    showToast(`Recorded expense ${created.id} of ₹${created.amount.toLocaleString('en-IN')}`);
  };

  const handleApprove = (id: string) => {
    setExpenses(
      expenses.map((e) =>
        e.id === id ? { ...e, status: 'Approved', approvedBy: 'Er. Rajesh Varma' } : e
      )
    );
    showToast(`Expense ${id} marked as Approved`);
  };

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalExpense = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
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
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Cost Control
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
              Total ₹{(totalExpense / 100000).toFixed(2)} Lakhs
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Job Expenses Management</h2>
          <p className="text-xs text-slate-400">
            Categorized job cost tracking: Explosives, fuel, machinery repairs, labour wages, and statutory permits.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Job Expense</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expenses by ID, job ID, vendor, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Material">Material</option>
            <option value="Labour">Labour</option>
            <option value="Contractor">Contractor</option>
            <option value="Subcontractor">Subcontractor</option>
            <option value="Fuel">Fuel</option>
            <option value="Vehicle Hire">Vehicle Hire</option>
            <option value="Machinery Maintenance">Machinery Maintenance</option>
            <option value="Explosives / Blasting">Explosives / Blasting</option>
            <option value="Transport">Transport</option>
            <option value="Permits & Approvals">Permits & Approvals</option>
            <option value="Site Office">Site Office</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Expense ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Approved By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-850 transition">
                  <td className="py-3 px-4 font-mono font-bold text-rose-400">{exp.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{exp.date}</td>
                  <td className="py-3 px-4 font-mono text-purple-400">{exp.jobId}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-white max-w-xs truncate">{exp.description}</td>
                  <td className="py-3 px-4 text-slate-400">{exp.paidTo}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-300">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{exp.approvedBy}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        exp.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {exp.status !== 'Approved' ? (
                      <button
                        onClick={() => handleApprove(exp.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/20 cursor-pointer"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Posted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-rose-400" />
                <span>Record Site / Job Expense</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Job</label>
                  <select
                    value={newExp.jobId}
                    onChange={(e) => setNewExp({ ...newExp, jobId: e.target.value })}
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
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={newExp.category}
                    onChange={(e) => setNewExp({ ...newExp, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Explosives / Blasting">Explosives / Blasting</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Labour">Labour</option>
                    <option value="Material">Material</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Vehicle Hire">Vehicle Hire</option>
                    <option value="Machinery Maintenance">Machinery Maintenance</option>
                    <option value="Permits & Approvals">Permits & Approvals</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newExp.amount}
                    onChange={(e) => setNewExp({ ...newExp, amount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Paid To / Payee</label>
                  <input
                    type="text"
                    value={newExp.paidTo}
                    onChange={(e) => setNewExp({ ...newExp, paidTo: e.target.value })}
                    placeholder="e.g. Canara Fuel Outlet"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Payment Method</label>
                  <select
                    value={newExp.paymentMethod}
                    onChange={(e) => setNewExp({ ...newExp, paymentMethod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Bank Transfer (RTGS/NEFT)">Bank Transfer (RTGS/NEFT)</option>
                    <option value="UPI / QR">UPI / QR</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Petty Cash">Petty Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Approving Manager</label>
                  <input
                    type="text"
                    value={newExp.approvedBy}
                    onChange={(e) => setNewExp({ ...newExp, approvedBy: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Expense Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  placeholder="Detail purchase receipt, litre quantity, replacement part..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
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
                  Post Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
