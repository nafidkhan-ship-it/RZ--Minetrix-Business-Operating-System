import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Clock,
  DollarSign,
  CreditCard,
  FolderLock,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  MapPin
} from 'lucide-react';
import { Employee, EmployeeStatus, WorkforceRole, SalaryType } from '../types';

interface EmployeeDirectoryViewProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onOpenNewEmployeeModal: () => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onToast: (msg: string) => void;
  onNavigateToTab?: (tab: string, empId?: string) => void;
}

export const EmployeeDirectoryView: React.FC<EmployeeDirectoryViewProps> = ({
  employees,
  onSelectEmployee,
  onOpenNewEmployeeModal,
  onOpenPrintModal,
  onToast,
  onNavigateToTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSalaryType, setSelectedSalaryType] = useState('ALL');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery);

    const matchesDept = selectedDepartment === 'ALL' || emp.department === selectedDepartment;
    const matchesRole = selectedRole === 'ALL' || emp.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
    const matchesSalary = selectedSalaryType === 'ALL' || emp.salaryType === selectedSalaryType;

    return matchesSearch && matchesDept && matchesRole && matchesStatus && matchesSalary;
  });

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Probation':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'On Leave':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Suspended':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Inactive':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              PEOPLE &amp; WORKFORCE DIRECTORY
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Master Employee Directory ({filteredEmployees.length} of {employees.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of staff profiles, contracts, compensation brackets, KYC documents, and ledgers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenPrintModal?.('Employee Master Directory', filteredEmployees)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
          <button
            onClick={() => onToast('Exported Employee Register as CSV')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenNewEmployeeModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Employee Profile</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 font-mono">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Employee ID, Name, Designation, Phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="ALL">All Departments</option>
              <option value="Quarry Operations">Quarry Operations</option>
              <option value="Crusher Plant">Crusher Plant</option>
              <option value="Vehicle & Fleet Logistics">Vehicle & Fleet Logistics</option>
              <option value="Accounts & Finance">Accounts & Finance</option>
              <option value="Dispatch & Weighbridge">Dispatch & Weighbridge</option>
              <option value="Human Resources (HR)">Human Resources (HR)</option>
              <option value="Administration">Administration</option>
            </select>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="DRIVER">DRIVER</option>
              <option value="ACCOUNTANT">ACCOUNTANT</option>
              <option value="HR">HR</option>
              <option value="STAFF">STAFF</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Salary Type Filter */}
            <select
              value={selectedSalaryType}
              onChange={(e) => setSelectedSalaryType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="ALL">All Salary Types</option>
              <option value="Monthly Salary">Monthly Salary</option>
              <option value="Daily Wage">Daily Wage</option>
              <option value="Weekly Wage">Weekly Wage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Department</th>
                <th className="py-3.5 px-4 font-bold">Designation &amp; Role</th>
                <th className="py-3.5 px-4 font-bold">Location / Branch</th>
                <th className="py-3.5 px-4 font-bold">Joined</th>
                <th className="py-3.5 px-4 font-bold">Salary Bracket</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={emp.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div
                          onClick={() => onSelectEmployee(emp)}
                          className="font-bold text-white hover:text-amber-400 cursor-pointer font-sans text-sm truncate max-w-[160px]"
                        >
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-sans font-bold text-xs">{emp.department}</div>
                    <div className="text-[10px] text-slate-500 font-sans">Mgr: {emp.reportingManager}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white font-sans text-xs">{emp.designation}</div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-slate-300 font-sans text-xs truncate max-w-[170px]">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{emp.branch}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {emp.joiningDate}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-emerald-400 text-xs">
                      ₹{emp.salaryRate.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        {emp.salaryType === 'Daily Wage' ? '/day' : '/mo'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">{emp.salaryType}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1 font-sans">
                      <button
                        title="View Profile"
                        onClick={() => onSelectEmployee(emp)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Attendance"
                        onClick={() => {
                          onToast(`Opened Attendance ledger for ${emp.name}`);
                          onNavigateToTab?.('attendance', emp.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Salary & Pay Slip"
                        onClick={() => {
                          onToast(`Opened Payroll calculation for ${emp.name}`);
                          onNavigateToTab?.('payroll', emp.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Staff Advance"
                        onClick={() => {
                          onToast(`Opened Advance ledger for ${emp.name}`);
                          onNavigateToTab?.('advances', emp.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Documents"
                        onClick={() => {
                          onToast(`Opened Document vault for ${emp.name}`);
                          onNavigateToTab?.('documents', emp.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        <FolderLock className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Deactivate Employee"
                        onClick={() => onToast(`Status changed for ${emp.name}`)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
