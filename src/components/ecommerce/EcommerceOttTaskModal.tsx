import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  AlertCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { CommerceOrder } from '../../data/ecommerceStudioData';
import { ottEcosystemBridge } from '../../services/ottEcosystemBridge';

interface EcommerceOttTaskModalProps {
  order: CommerceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

export const EcommerceOttTaskModal: React.FC<EcommerceOttTaskModalProps> = ({
  order,
  isOpen,
  onClose,
  onTaskCreated
}) => {
  const [title, setTitle] = useState(
    order
      ? `Verify Weighbridge Slip & Dispatch for Order ${order.orderNumber}`
      : 'Verify Material Loading & Vehicle Dispatch'
  );
  const [description, setDescription] = useState(
    order
      ? `Customer: ${order.customerName}. Destination: ${order.siteProjectName} (${order.district}). Quantity: ${order.quantity} ${order.unit}s.`
      : 'Coordinate tipper haulage with quarry gate desk.'
  );
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [assigneeName, setAssigneeName] = useState('Logistics Desk Officer');
  const [dueDate, setDueDate] = useState(order?.requiredDate || '2026-10-04');
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    try {
      ottEcosystemBridge.createItem({
        title,
        description,
        type: 'TASK',
        priority,
        timeSlot,
        assigneeName,
        assigneeRole: 'Logistics Desk',
        source_system: 'ORDER',
        source_module: 'Building Materials E-Commerce',
        source_record_id: order?.id || `ORD-${Date.now()}`,
        source_event: 'ECOMMERCE_MANUAL_TASK_CREATED',
        source_task_id: `OTT-TASK-${Date.now()}`,
        idempotency_key: `ecommerce-task-${Date.now()}`,
        sourceStatusBefore: 'CONFIRMED_AWAITING_DISPATCH',
        sourceStatusAfter: 'DISPATCHED_ON_TRIP'
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onTaskCreated) onTaskCreated();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                RZ® OTT SCHEDULE INTEGRATION
              </span>
              <h2 className="text-base font-black text-white">Create Operational Task</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Task Synced to RZ® OTT!</h3>
            <p className="text-xs text-slate-400">Added to daily schedule & notification board.</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Description & Operational Notes</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Assignee</label>
                <input
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Time Slot</label>
                <input
                  type="text"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                Task automatically attaches <code className="font-mono text-white">source_system: 'ORDER'</code> and bidirectionally syncs with RZ® OTT.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md shadow-amber-500/20"
              >
                Create OTT Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
