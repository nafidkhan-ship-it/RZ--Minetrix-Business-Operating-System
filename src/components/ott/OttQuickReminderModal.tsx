import React, { useState } from 'react';
import {
  X,
  Bell,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { OttTask, CURRENT_USER } from '../../data/rzOttData';

interface OttQuickReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminderTask: Partial<OttTask>) => void;
}

export const OttQuickReminderModal: React.FC<OttQuickReminderModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [text, setText] = useState('');
  const [preset, setPreset] = useState<'10m' | '30m' | '1h' | 'tomorrow' | 'custom'>('30m');
  const [customTime, setCustomTime] = useState('04:30 PM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    let dueTime = 'In 30 minutes';
    let reminderRule = '30 minutes before';

    if (preset === '10m') {
      dueTime = 'In 10 minutes';
      reminderRule = '10 minutes before';
    } else if (preset === '1h') {
      dueTime = 'In 1 hour';
      reminderRule = '1 hour before';
    } else if (preset === 'tomorrow') {
      dueTime = 'Tomorrow 09:00 AM';
      reminderRule = 'Tomorrow morning';
    } else if (preset === 'custom') {
      dueTime = customTime;
      reminderRule = `At ${customTime}`;
    }

    const reminderTask: Partial<OttTask> = {
      title: text.trim(),
      description: `Quick notification reminder created by ${CURRENT_USER.name}`,
      category: 'PERSONAL',
      priority: 'HIGH',
      status: 'ASSIGNED',
      assignee: CURRENT_USER,
      createdBy: CURRENT_USER,
      dueDate: preset === 'tomorrow' ? 'Tomorrow' : new Date().toISOString().split('T')[0],
      dueTime,
      reminderRule,
      reminderStatus: 'SCHEDULED',
      repeatRule: 'NONE',
      tags: ['Reminder', 'QuickAction'],
      subtasks: [],
      attachments: [],
      comments: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          action: `Quick reminder scheduled for ${dueTime}`,
          actor: CURRENT_USER.name,
          timestamp: 'Just now'
        }
      ]
    };

    onSave(reminderTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                GENTLE NUDGE
              </span>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5">Quick Reminder</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Remind me to: <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Call weighbridge operator about 14 MT tare slip"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-semibold placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Trigger Timing
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: '10m', label: 'In 10 mins' },
                { id: '30m', label: 'In 30 mins' },
                { id: '1h', label: 'In 1 hour' },
                { id: 'tomorrow', label: 'Tomorrow morning' },
                { id: 'custom', label: 'Custom time' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPreset(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    preset === opt.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {preset === 'custom' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Custom Time
              </label>
              <input
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="e.g. 06:15 PM"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>OTT will send a gentle banner notification &amp; sync to your My Day schedule.</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
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
              <Bell className="w-4 h-4" />
              <span>Set Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
