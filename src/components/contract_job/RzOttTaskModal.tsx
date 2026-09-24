import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  Camera,
  CheckSquare,
  Plus,
  X
} from 'lucide-react';
import {
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

interface RzOttTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatedTask?: (taskTitle: string) => void;
}

export const RzOttTaskModal: React.FC<RzOttTaskModalProps> = ({
  isOpen,
  onClose,
  onCreatedTask
}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState('Site Inspection Task');
  const [linkedJob, setLinkedJob] = useState(SAMPLE_JOBS[0]?.id || 'JOB-4001');
  const [assignee, setAssignee] = useState('Er. Rajesh Varma');
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [dueDate, setDueDate] = useState('2026-09-25');
  const [dueTime, setDueTime] = useState('11:00');
  const [photoProofRequired, setPhotoProofRequired] = useState(true);
  const [checklistItems, setChecklistItems] = useState([
    'Verify blaster DGMS certification ID',
    'Clear 500m safety exclusion perimeter',
    'Sound audible warning sirens 15 mins prior',
    'Check seismic vibration monitors at nearby structures'
  ]);
  const [newItem, setNewItem] = useState('');

  if (!isOpen) return null;

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setChecklistItems([...checklistItems, newItem.trim()]);
    setNewItem('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    if (onCreatedTask) {
      onCreatedTask(taskTitle);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-xl max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Create RZ® OTT One-Time Task</h2>
              <div className="text-xs text-slate-400 font-mono">
                Direct integration with RZ OTT Site Task System
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Conduct Pre-blast Perimeter & Sounding Inspection"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Task Category</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Site Inspection Task">Site Inspection Task</option>
                <option value="Blasting Preparation Task">Blasting Preparation Task</option>
                <option value="Material Delivery Task">Material Delivery Task</option>
                <option value="Machinery Mobilization Task">Machinery Mobilization Task</option>
                <option value="Bill Approval Task">Bill Approval Task</option>
                <option value="Payment Collection Follow-up Task">Payment Collection Follow-up Task</option>
                <option value="Safety Audit Task">Safety Audit Task</option>
                <option value="Customer Meeting Task">Customer Meeting Task</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Linked Contract Job</label>
              <select
                value={linkedJob}
                onChange={(e) => setLinkedJob(e.target.value)}
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
              <label className="block text-slate-400 font-medium mb-1">Assignee</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Critical">Critical (Immediate)</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Due Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <Camera className="w-4 h-4 text-purple-400" />
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
              <input
                type="checkbox"
                checked={photoProofRequired}
                onChange={(e) => setPhotoProofRequired(e.target.checked)}
                className="rounded accent-purple-500"
              />
              <span>Mandatory Photo Proof Required on Site Completion</span>
            </label>
          </div>

          {/* Checklist */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              Task Checklist Items ({checklistItems.length})
            </label>
            <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto">
              {checklistItems.map((chk, i) => (
                <div
                  key={i}
                  className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300 text-xs"
                >
                  <span className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>{chk}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setChecklistItems(checklistItems.filter((_, idx) => idx !== i))}
                    className="text-slate-500 hover:text-rose-400 text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add checklist bullet..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-bold"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/20"
            >
              Dispatch Task to RZ OTT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
