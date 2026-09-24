import React, { useState } from 'react';
import {
  X,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { OttTask } from '../../data/rzOttData';

interface OttSnoozeModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: OttTask | null;
  onSnooze: (taskId: string, snoozedUntilText: string) => void;
}

export const OttSnoozeModal: React.FC<OttSnoozeModalProps> = ({
  isOpen,
  onClose,
  task,
  onSnooze
}) => {
  const [selectedDuration, setSelectedDuration] = useState<'10m' | '30m' | '1h' | 'tomorrow' | 'custom'>('30m');
  const [customText, setCustomText] = useState('Tomorrow, 02:00 PM');

  if (!isOpen || !task) return null;

  const handleApply = () => {
    let snoozeString = '';
    const now = new Date();

    if (selectedDuration === '10m') {
      snoozeString = `Today, ${new Date(now.getTime() + 10 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (selectedDuration === '30m') {
      snoozeString = `Today, ${new Date(now.getTime() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (selectedDuration === '1h') {
      snoozeString = `Today, ${new Date(now.getTime() + 60 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (selectedDuration === 'tomorrow') {
      snoozeString = 'Tomorrow morning, 09:00 AM';
    } else {
      snoozeString = customText || 'Tomorrow morning';
    }

    onSnooze(task.id, snoozeString);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                RESCHEDULE &amp; DEFER
              </span>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5">Snooze Task</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Current Task:</span>
            <div className="font-bold text-white line-clamp-2">{task.title}</div>
            <div className="text-[10px] text-amber-400 mt-1">Due: {task.dueDate} at {task.dueTime}</div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Snooze Duration
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '10m', label: '10 minutes' },
                { id: '30m', label: '30 minutes' },
                { id: '1h', label: '1 hour' },
                { id: 'tomorrow', label: 'Tomorrow morning' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDuration(opt.id as any)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    selectedDuration === opt.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setSelectedDuration('custom')}
              className={`w-full p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                selectedDuration === 'custom'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              Custom Date &amp; Time
            </button>
          </div>

          {selectedDuration === 'custom' && (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">
                Custom Snooze Specification
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Next Monday, 10:00 AM"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            Task status will update to <strong className="text-amber-400">SNOOZED</strong> and automatically re-surface in your My Day list when the snooze timer expires.
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
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" />
              <span>Confirm Snooze</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
