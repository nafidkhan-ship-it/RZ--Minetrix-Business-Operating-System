import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Calendar,
  UserCheck,
  AlertCircle,
  Tag,
  Briefcase
} from 'lucide-react';

interface MarketplaceOttModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextRef?: string;
}

export const MarketplaceOttModal: React.FC<MarketplaceOttModalProps> = ({
  isOpen,
  onClose,
  contextRef = 'GENERAL-MARKETPLACE'
}) => {
  const [taskTitle, setTaskTitle] = useState(`Marketplace Follow-up [${contextRef}]`);
  const [taskCategory, setTaskCategory] = useState<'Inspection' | 'Document RTO' | 'Deal Escrow' | 'Transport Haulage'>('Inspection');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Normal'>('High');
  const [assignee, setAssignee] = useState('Er. Rajesh Nair (Surveyor)');
  const [dueDate, setDueDate] = useState('2026-09-25');
  const [notes, setNotes] = useState('Coordinate on-site machinery audit and verify hydraulic pressure gauges.');
  const [isCreated, setIsCreated] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreated(true);
    setTimeout(() => {
      setIsCreated(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-xs">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-purple-400 font-bold">RZ® OTT TASK ENGINE INTEGRATION</div>
            <h2 className="text-base font-black text-white">Create Marketplace Operational Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isCreated ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">OTT Task Dispatched</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Task successfully injected into RZ® Central OTT Operations Board with high priority routing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Task Headline</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Marketplace Sub-Domain</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Inspection">Surveyor Technical Inspection</option>
                  <option value="Document RTO">Document Transfer & RTO NOC</option>
                  <option value="Deal Escrow">Deal Escrow Milestone</option>
                  <option value="Transport Haulage">Transport & Trailer Haulage</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Urgent">Urgent (Immediate Action)</option>
                  <option value="High">High Priority</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Assignee</label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Target Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Operational Instructions & Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold transition cursor-pointer shadow-md shadow-purple-500/20"
              >
                Dispatch to RZ® OTT
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
