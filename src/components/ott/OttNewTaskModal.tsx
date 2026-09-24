import React, { useState } from 'react';
import {
  X,
  Plus,
  Calendar,
  Clock,
  User,
  Tag,
  Paperclip,
  FileText,
  AlertCircle,
  Briefcase,
  Layers,
  MapPin,
  Repeat,
  Bell,
  Sparkles,
  Link2
} from 'lucide-react';
import {
  OttTask,
  OttCategory,
  OttTaskPriority,
  OttUser,
  DEMO_OTT_USERS,
  CURRENT_USER,
  OttSourceSystem
} from '../../data/rzOttData';

interface OttNewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<OttTask>) => void;
  initialCategory?: OttCategory;
  initialSource?: OttSourceSystem;
}

export const OttNewTaskModal: React.FC<OttNewTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory = 'WORK',
  initialSource
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<OttCategory>(initialCategory);
  const [priority, setPriority] = useState<OttTaskPriority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>(CURRENT_USER.id);
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState<string>('05:00 PM');
  const [reminder, setReminder] = useState<string>('30 minutes before');
  const [repeat, setRepeat] = useState<'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'>('NONE');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [sourceSystem, setSourceSystem] = useState<OttSourceSystem>(initialSource || 'RZ_OTT');
  const [sourceRecordId, setSourceRecordId] = useState('');
  const [sourceEvent, setSourceEvent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee = DEMO_OTT_USERS.find(u => u.id === assigneeId) || CURRENT_USER;

    const tags = tagsInput
      ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : [category.charAt(0) + category.slice(1).toLowerCase()];

    const newTask: Partial<OttTask> = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'ASSIGNED',
      assignee,
      createdBy: CURRENT_USER,
      dueDate,
      dueTime,
      startDate: new Date().toISOString().split('T')[0],
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      reminderRule: reminder,
      reminderStatus: 'SCHEDULED',
      repeatRule: repeat,
      tags,
      subtasks: [],
      attachments: [],
      comments: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          action: `Task created and assigned to ${assignee.name}`,
          actor: CURRENT_USER.name,
          timestamp: 'Just now'
        }
      ]
    };

    if (sourceSystem !== 'RZ_OTT') {
      newTask.source = {
        sourceSystem,
        sourceModule: `${sourceSystem} Operations Hub`,
        sourceRecordId: sourceRecordId || `${sourceSystem}-MANUAL-01`,
        sourceEvent: sourceEvent || 'Manual User Creation in OTT',
        targetSectionId: 'universal-dashboard',
        sourceStatusBefore: 'OPEN',
        sourceStatusAfter: 'TASK_COMPLETED'
      };
    }

    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NEW TASK
                </span>
                <span className="text-[10px] font-mono text-slate-400">RZ® OTT Engine</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">Create New OTT Task</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Task Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule Periodic Service for Tipper KL-14-Y-9201"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 font-semibold focus:outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Description &amp; Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, required tools, inspection steps, or expected outcomes..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OttCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="WORK">Work (Operations &amp; Mining)</option>
                <option value="PERSONAL">Personal</option>
                <option value="FAMILY">Family</option>
                <option value="BUSINESS">Business &amp; Finance</option>
                <option value="STUDY">Study &amp; Learning</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as OttTaskPriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent (Immediate Action)</option>
              </select>
            </div>
          </div>

          {/* Assignee & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Assignee */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-semibold focus:outline-none cursor-pointer"
              >
                {DEMO_OTT_USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Location / Site
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kasaragod Central Workshop"
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Due Date & Due Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Due Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="e.g. 05:00 PM"
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Reminder & Repeat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Gentle Reminder
              </label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="At due time">At due time</option>
                <option value="10 minutes before">10 minutes before</option>
                <option value="30 minutes before">30 minutes before</option>
                <option value="1 hour before">1 hour before</option>
                <option value="Tomorrow morning">Tomorrow morning</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Repeat Rule
              </label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="NONE">Does not repeat</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="CUSTOM">Custom Rule</option>
              </select>
            </div>
          </div>

          {/* Cross-Platform Source System (Optional) */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-amber-400" />
                Cross-Platform Origin (Traceability)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <select
                  value={sourceSystem}
                  onChange={(e) => setSourceSystem(e.target.value as OttSourceSystem)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="RZ_OTT">RZ OTT (Native)</option>
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
                <input
                  type="text"
                  value={sourceRecordId}
                  onChange={(e) => setSourceRecordId(e.target.value)}
                  placeholder="Record ID (e.g. VEH-001)"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={sourceEvent}
                  onChange={(e) => setSourceEvent(e.target.value)}
                  placeholder="Event (e.g. Service Due)"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Urgent, Maintenance, Vehicle, Inspection"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 focus:outline-none transition"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              Assigned by <strong className="text-slate-300">{CURRENT_USER.name}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
