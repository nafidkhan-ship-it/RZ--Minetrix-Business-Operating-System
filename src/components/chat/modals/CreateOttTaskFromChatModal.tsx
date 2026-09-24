import React, { useState } from 'react';
import {
  Clock,
  X,
  CheckCircle2,
  Calendar,
  User,
  AlertCircle,
  Tag,
  FileText,
  Sparkles
} from 'lucide-react';
import { ChatMessage, ChatConversation } from '../../../data/rzChatData';

interface CreateOttTaskFromChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: ChatMessage | null;
  conversation?: ChatConversation | null;
  onTaskCreated: (taskData: any) => void;
}

export const CreateOttTaskFromChatModal: React.FC<CreateOttTaskFromChatModalProps> = ({
  isOpen,
  onClose,
  message,
  conversation,
  onTaskCreated
}) => {
  if (!isOpen) return null;

  const defaultTitle = message?.text
    ? `Task: ${message.text.slice(0, 50)}${message.text.length > 50 ? '...' : ''}`
    : 'New RZ OTT Task from Chat';

  const [title, setTitle] = useState(defaultTitle);
  const [assignedTo, setAssignedTo] = useState('Suresh Shetty (Fleet Lead)');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [dueDate, setDueDate] = useState('2026-09-24');
  const [dueTime, setDueTime] = useState('11:00');
  const [notes, setNotes] = useState(
    `Originated from RZ® Chat: "${message?.text || 'Direct Chat'}"\nSender: ${message?.senderName || 'Staff'}\nSource Ref: ${message?.id || 'MSG-REF'}`
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskId = `OTT-${Math.floor(1000 + Math.random() * 9000)}`;
    const taskPayload = {
      id: taskId,
      title,
      sourceSystem: 'RZ® Chat (Platform 8)',
      sourceModule: conversation?.isGroup ? 'Group Conversation' : '1-to-1 Chat',
      sourceRecord: conversation?.name || 'Direct Chat',
      sourceMessageId: message?.id,
      assignedUser: assignedTo,
      dueDate: `${dueDate} ${dueTime}`,
      priority,
      status: 'PENDING',
      notes
    };

    setSubmitted(true);
    setTimeout(() => {
      onTaskCreated(taskPayload);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  RZ® OTT TASK ENGINE
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-semibold">
                  Cross-Platform Bridge
                </span>
              </div>
              <h3 className="text-base font-black text-white">Create OTT Task from Chat</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-white">OTT Task Dispatched!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Task successfully routed to RZ® OTT: Organise Today & Tomorrow taskboard and assigned staff schedule.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Context Badge */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Source Message Reference:
              </span>
              <p className="text-white font-medium italic line-clamp-2">
                "{message?.text || 'Selected chat context'}"
              </p>
              <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <span>Sender: <strong className="text-slate-200">{message?.senderName || 'Contact'}</strong></span>
                <span>&bull;</span>
                <span>Chat: <strong className="text-slate-200">{conversation?.name || 'Active'}</strong></span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Assignee & Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assign Responsible Staff</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Suresh Shetty (Fleet Lead)">Suresh Shetty (Fleet Lead)</option>
                  <option value="K. Mohan Kumar (Quarry Head)">K. Mohan Kumar (Quarry Head)</option>
                  <option value="Er. Rajesh Nair (Surveyor)">Er. Rajesh Nair (Surveyor)</option>
                  <option value="Accounts & Billing Desk">Accounts & Billing Desk</option>
                  <option value="Logistics Gate Coordinator">Logistics Gate Coordinator</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (Default)</option>
                  <option value="CRITICAL">Critical &bull; Urgent</option>
                </select>
              </div>
            </div>

            {/* Due Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Time</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Execution Notes & Audit Trace</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 resize-none font-mono text-[11px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Publish to RZ® OTT</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
