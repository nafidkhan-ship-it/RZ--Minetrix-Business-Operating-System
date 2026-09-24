import React, { useState } from 'react';
import { X, BellRing, Send, Clock, CheckCircle, ShieldAlert } from 'lucide-react';
import { TaskItem } from '../../types/ottTypes';

interface OttFollowUpModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSendFollowUp: (taskId: string, message: string) => void;
}

const TEMPLATES = [
  {
    title: 'Gentle Friendly Check-in',
    text: 'Hi, just checking in on the status of this task. Let me know if you need any help or clarification.'
  },
  {
    title: 'Upcoming Deadline Alert',
    text: 'Friendly reminder that this task is due shortly. Please update your progress when you have a moment.'
  },
  {
    title: 'Urgent Overdue Escalation',
    text: 'URGENT: This task is currently overdue and blocking dependent operations. Please provide immediate ETA.'
  },
  {
    title: 'BOS Production Alignment',
    text: 'Minetrix quarry/dispatch operations require completion of this item to finalize daily gate pass registers.'
  }
];

export const OttFollowUpModal: React.FC<OttFollowUpModalProps> = ({
  task,
  isOpen,
  onClose,
  onSendFollowUp
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].text);
  const [customText, setCustomText] = useState('');

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg = customText.trim() || selectedTemplate;
    onSendFollowUp(task.id, finalMsg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Gentle Follow-Up & Reminder</h3>
              <p className="text-[11px] text-slate-400">Non-spam reminder to {task.assignedTo.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Task Brief */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-300">{task.title}</span>
              <span className="text-purple-400 font-mono">Follow-up #{ (task.followUpCount || 0) + 1 }</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-3">
              <span>Due: {task.dueDate} at {task.dueTime}</span>
              <span>Status: <strong className="text-amber-400">{task.status}</strong></span>
            </div>
          </div>

          {/* Preset Templates */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Preset Reminder Tone
            </label>
            <div className="space-y-1.5">
              {TEMPLATES.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(t.text);
                    setCustomText('');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                    selectedTemplate === t.text && !customText
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-200 font-medium'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-white text-[11px] mb-0.5">{t.title}</div>
                  <div className="line-clamp-1">{t.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Edit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Custom Message (Optional Override)
            </label>
            <textarea
              rows={3}
              placeholder="Or write a customized follow-up message..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition resize-none"
            />
          </div>

          {/* Anti-Spam Policy Notice */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Smart Anti-Spam Safeguard:</strong> Follow-ups are limited to once per 2 hours to maintain team harmony while keeping deadlines transparent.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Gentle Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
