import React, { useState } from 'react';
import {
  Building2,
  Award,
  CalendarDays,
  Plus,
  Search,
  Filter,
  Users,
  Edit,
  UserCheck,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  AlertCircle
} from 'lucide-react';
import { Department, Designation, Shift, WorkforceSectionTab } from '../types';
import { MOCK_DEPARTMENTS, MOCK_DESIGNATIONS, MOCK_SHIFTS } from '../workforceMockData';

interface ViewProps {
  onNavigateTab?: (tab: WorkforceSectionTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}

/* ========================================================================
   1. DEPARTMENTS VIEW
   ======================================================================== */
export const DepartmentsView: React.FC<ViewProps> = ({ onNavigateTab, onToast, onOpenPrintModal }) => {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              ORGANIZATIONAL STRUCTURE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Master Department Hierarchy ({departments.length} Units)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Departmental headcount, executive managers, allocated monthly budgets, and operational staffing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPrintModal?.('Departments Roster', departments)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print List</span>
          </button>
          <button
            onClick={() => onToast('Opened Add Department Dialog')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments or designated managers..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold">{dept.id}</span>
                  <h3 className="text-sm font-bold text-white font-sans mt-0.5">{dept.name}</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {dept.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-2 line-clamp-2">
                {dept.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Department Head:</span>
                <span className="text-white font-bold font-sans">{dept.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employees on Roll:</span>
                <span className="text-cyan-400 font-bold">{dept.employeeCount} ({dept.activeCount} Active)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allocated Budget:</span>
                <span className="text-emerald-400 font-bold">₹{dept.budgetAllocated.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  onToast(`Filtered directory for ${dept.name}`);
                  onNavigateTab?.('employees');
                }}
                className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition text-center"
              >
                View Staff ({dept.employeeCount})
              </button>
              <button
                onClick={() => onToast(`Assign manager for ${dept.name}`)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Assign Manager"
              >
                <UserCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onToast(`Editing ${dept.name}`)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Edit Department"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========================================================================
   2. DESIGNATIONS VIEW
   ======================================================================== */
export const DesignationsView: React.FC<ViewProps> = ({ onNavigateTab, onToast, onOpenPrintModal }) => {
  const [designations, setDesignations] = useState<Designation[]>(MOCK_DESIGNATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDesigs = designations.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              ROLE &amp; GRADE SPECIFICATIONS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Designation Master Register ({designations.length} Roles)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Job titles, departmental alignment, pay grades, and default overtime &amp; batta eligibility rules.
          </p>
        </div>

        <button
          onClick={() => onToast('Opened New Designation Modal')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Designation</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Designation Name</th>
                <th className="py-3.5 px-4 font-bold">Department</th>
                <th className="py-3.5 px-4 font-bold">Pay Grade</th>
                <th className="py-3.5 px-4 font-bold">Default Compensation</th>
                <th className="py-3.5 px-4 font-bold">OT Allowed</th>
                <th className="py-3.5 px-4 font-bold">Batta Allowed</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDesigs.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="text-white font-bold font-sans text-sm block">{d.name}</span>
                    <span className="text-[10px] text-amber-400">{d.id}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{d.department}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                      Grade {d.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    ₹{d.defaultSalary.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">
                      {d.salaryType === 'Daily Wage' ? '/day' : '/mo'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={d.overtimeEligible ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                      {d.overtimeEligible ? 'Yes (1.5x)' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={d.battaEligible ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      {d.battaEligible ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          onToast(`Filtered directory for ${d.name}`);
                          onNavigateTab?.('employees');
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                      >
                        Employees
                      </button>
                      <button
                        onClick={() => onToast(`Editing ${d.name}`)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
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

/* ========================================================================
   3. SHIFTS VIEW
   ======================================================================== */
export const ShiftsView: React.FC<ViewProps> = ({ onNavigateTab, onToast, onOpenPrintModal }) => {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              WORKFORCE ROSTER &amp; TIMINGS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <span>Operational Shift Configurations ({shifts.length} Shifts)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configurable quarry, crusher plant, weighbridge, and logistics haulage timing patterns.
          </p>
        </div>

        <button
          onClick={() => onToast('Opened New Shift Modal')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Shift</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {shifts.map((shf) => (
          <div
            key={shf.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold">{shf.id}</span>
                  <h3 className="text-sm font-bold text-white font-sans mt-0.5">{shf.name}</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {shf.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-bold mt-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{shf.startTime} &mdash; {shf.endTime}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Break Duration:</span>
                <span className="text-white">{shf.breakDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grace Period:</span>
                <span className="text-orange-400">{shf.gracePeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Overtime Rule:</span>
                <span className="text-purple-400">{shf.overtimeRule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="text-slate-300 font-sans">{shf.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Staff:</span>
                <span className="text-cyan-400 font-bold">{shf.assignedStaffCount} Personnel</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onToast(`Staff roster assigned for ${shf.name}`)}
                className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition text-center"
              >
                Assign Staff
              </button>
              <button
                onClick={() => onToast(`Editing ${shf.name}`)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
