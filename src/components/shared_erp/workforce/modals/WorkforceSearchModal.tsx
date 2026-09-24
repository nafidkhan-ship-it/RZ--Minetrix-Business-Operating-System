import React, { useState } from 'react';
import {
  Search,
  X,
  User,
  Building2,
  Clock,
  DollarSign,
  CreditCard,
  Truck,
  FolderLock,
  ArrowRight
} from 'lucide-react';
import { WorkforceSectionTab } from '../types';
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS, MOCK_STAFF_ADVANCES, MOCK_STAFF_DOCUMENTS } from '../workforceMockData';

interface WorkforceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: WorkforceSectionTab) => void;
  onToast: (msg: string) => void;
}

export const WorkforceSearchModal: React.FC<WorkforceSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onToast
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedEmployees = query
    ? MOCK_EMPLOYEES.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.id.toLowerCase().includes(query.toLowerCase()) ||
          e.designation.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedDepartments = query
    ? MOCK_DEPARTMENTS.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const matchedAdvances = query
    ? MOCK_STAFF_ADVANCES.filter(
        (a) =>
          a.employeeName.toLowerCase().includes(query.toLowerCase()) ||
          a.id.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedDocuments = query
    ? MOCK_STAFF_DOCUMENTS.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.employeeName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Universal Workforce Search (Staff, Department, Advance, Document, Slip)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 font-mono text-xs">
          {!query && (
            <div className="text-center py-8 text-slate-500">
              Type employee name, department, ID, advance ref, or document keyword...
            </div>
          )}

          {query && (
            <>
              {/* Matched Employees */}
              {matchedEmployees.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    Employees ({matchedEmployees.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => {
                          onClose();
                          onNavigateTab('employees');
                          onToast(`Selected ${emp.name}`);
                        }}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-cyan-400" />
                          <div>
                            <span className="font-bold text-white font-sans">{emp.name}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {emp.id} &bull; {emp.designation} &bull; {emp.department}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Departments */}
              {matchedDepartments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">
                    Departments ({matchedDepartments.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedDepartments.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onClose();
                          onNavigateTab('departments');
                          onToast(`Selected ${d.name}`);
                        }}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-bold text-white font-sans">{d.name}</span>
                            <span className="text-[10px] text-slate-500 block">
                              Manager: {d.manager} &bull; {d.employeeCount} Employees
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Advances */}
              {matchedAdvances.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-yellow-400">
                    Staff Advances ({matchedAdvances.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedAdvances.map((adv) => (
                      <div
                        key={adv.id}
                        onClick={() => {
                          onClose();
                          onNavigateTab('advances');
                          onToast(`Navigated to advance ${adv.id}`);
                        }}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-yellow-500/50 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-yellow-400" />
                          <div>
                            <span className="font-bold text-white font-sans">{adv.employeeName}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {adv.id} &bull; Balance: ₹{adv.balance.toLocaleString('en-IN')} &bull; {adv.purpose}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Documents */}
              {matchedDocuments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-purple-400">
                    Staff Documents ({matchedDocuments.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          onClose();
                          onNavigateTab('documents');
                          onToast(`Navigated to document ${doc.title}`);
                        }}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderLock className="w-4 h-4 text-purple-400" />
                          <div>
                            <span className="font-bold text-white font-sans">{doc.title}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {doc.employeeName} &bull; Expiry: {doc.expiryDate} &bull; {doc.status}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedEmployees.length === 0 &&
                matchedDepartments.length === 0 &&
                matchedAdvances.length === 0 &&
                matchedDocuments.length === 0 && (
                  <div className="text-center py-6 text-slate-500">
                    No matching records found across master workforce database.
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
