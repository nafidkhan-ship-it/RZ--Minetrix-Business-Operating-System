import React, { useState } from 'react';
import {
  X,
  Send,
  Calendar,
  Clock,
  User,
  AlertCircle,
  FileText,
  Link2,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import {
  OttTask,
  OttUser,
  OttTaskPriority,
  OttSourceSystem,
  DEMO_OTT_USERS,
  CURRENT_USER
} from '../../data/rzOttData';

interface OttAssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (task: Partial<OttTask>) => void;
  prefillTaskTitle?: string;
  prefillSource?: OttSourceSystem;
}

export const OttAssignTaskModal: React.FC<OttAssignTaskModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  prefillTaskTitle = '',
  prefillSource = 'RZ_OTT'
}) => {
  const [taskTitle, setTaskTitle] = useState(prefillTaskTitle);
  const [assignToId, setAssignToId] = useState<string>(DEMO_OTT_USERS[1].id); // Vikramaditya GM by default
  const [priority, setPriority] = useState<OttTaskPriority>('HIGH');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState<string>('04:00 PM');
  const [instructions, setInstructions] = useState('');
  const [sourceSystem, setSourceSystem] = useState<OttSourceSystem>(prefillSource);
  const [sourceRecordId, setSourceRecordId] = useState('');
  const [hasAttachment, setHasAttachment] = useState(false);

  if (!isOpen) return null;

  const assignee = DEMO_OTT_USERS.find(u => u.id === assignToId) || DEMO_OTT_USERS[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: Partial<OttTask> = {
      title: taskTitle.trim(),
      description: instructions.trim() || `Delegated work order assigned by ${CURRENT_USER.name}`,
      category: 'WORK',
      priority,
      status: 'ASSIGNED',
      assignee,
      createdBy: CURRENT_USER,
      dueDate,
      dueTime,
      startDate: new Date().toISOString().split('T')[0],
      reminderRule: '30 minutes before',
      reminderStatus: 'SCHEDULED',
      repeatRule: 'NONE',
      tags: ['Assigned', priority, sourceSystem],
      subtasks: [],
      attachments: hasAttachment
        ? [
            {
              id: `att-${Date.now()}`,
              name: 'Work_Order_Authorization.pdf',
              size: '850 KB',
              type: 'PDF',
              uploadedAt: 'Just now'
            }
          ]
        : [],
      comments: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          action: `Assigned by ${CURRENT_USER.name} to ${assignee.name}`,
          actor: CURRENT_USER.name,
          timestamp: 'Just now'
        }
      ]
    };

    if (sourceSystem !== 'RZ_OTT') {
      newTask.source = {
        sourceSystem,
        sourceModule: `${sourceSystem} Delegation`,
        sourceRecordId: sourceRecordId || `${sourceSystem}-ASSIGN-01`,
        sourceEvent: 'Task Delegated to Staff',
        targetSectionId: 'universal-dashboard',
        sourceStatusBefore: 'DELEGATED',
        sourceStatusAfter: 'TASK_COMPLETED'
      };
    }

    onAssign(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                DELEGATE &amp; ASSIGN
              </span>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">Assign Task to Team Member</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Assigned By & Assigned To Cards */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Assigned By:
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
                />
                <div className="min-w-0">
                  <div className="text-xs font-black text-white truncate">{CURRENT_USER.name}</div>
                  <div className="text-[10px] text-amber-400 truncate">{CURRENT_USER.role}</div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Assigned To:
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
                />
                <div className="min-w-0">
                  <div className="text-xs font-black text-white truncate">{assignee.name}</div>
                  <div className="text-[10px] text-blue-400 truncate">{assignee.team}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Assign To Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Select Recipient <span className="text-amber-400">*</span>
            </label>
            <select
              value={assignToId}
              onChange={(e) => setAssignToId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-semibold focus:outline-none cursor-pointer"
            >
              {DEMO_OTT_USERS.filter(u => u.id !== CURRENT_USER.id).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.role} ({u.team})
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Task Work Order <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Conduct Ultrasonic Tire Wall Check on Tipper KL-14-Y-9201"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-semibold placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Due Date, Time & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Due Time
              </label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as OttTaskPriority)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Instructions &amp; Requirements
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Detail specific instructions, safety protocols, or deliverables expected..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Source Origin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Source System
              </label>
              <select
                value={sourceSystem}
                onChange={(e) => setSourceSystem(e.target.value as OttSourceSystem)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="RZ_OTT">RZ OTT</option>
                <option value="QUARRY">Quarry Management</option>
                <option value="CRUSHER">Crusher Management</option>
                <option value="VEHICLE">Vehicle Management</option>
                <option value="CONTRACT_JOB">Contract &amp; Job</option>
                <option value="BUILDING_MATERIALS">Building Materials</option>
                <option value="MARKETPLACE">Marketplace</option>
                <option value="QUARRY_LAND">Quarry Land</option>
                <option value="RZ_CHAT">RZ Chat</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Source Record
              </label>
              <input
                type="text"
                value={sourceRecordId}
                onChange={(e) => setSourceRecordId(e.target.value)}
                placeholder="e.g. VEH-001 or ORD-8812"
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Attachment Toggle */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-slate-400" />
              <div>
                <div className="font-bold text-white">Attach Work Order Authorization PDF</div>
                <div className="text-[10px] text-slate-500">Auto-attaches formal digital sign-off</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasAttachment}
              onChange={(e) => setHasAttachment(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch &amp; Assign Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
