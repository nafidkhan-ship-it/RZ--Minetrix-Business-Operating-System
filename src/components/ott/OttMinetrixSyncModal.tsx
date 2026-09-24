import React, { useState } from 'react';
import { X, Link2, Sparkles, CheckCircle2, ArrowRight, Pickaxe, Truck, Landmark, UserCheck } from 'lucide-react';
import { TaskItem, UserRef } from '../../types/ottTypes';

interface OttMinetrixSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncTask: (payload: any) => void;
  contacts: UserRef[];
}

const MINETRIX_PRESETS = [
  {
    module: 'QUARRY' as const,
    title: 'Daily Secondary Blasting & Rockface Clearance Check',
    description: 'Ensure oversize boulders from bench #3 are fractured with hydraulic breaker before crusher haulage.',
    priority: 'URGENT' as const,
    estimatedMinutes: 60,
    entityId: 'PIT-04',
    entityTitle: 'Chittorgarh Pit #04 High-Grade Granite',
    icon: Pickaxe
  },
  {
    module: 'FLEET' as const,
    title: 'Weighbridge Digital Tare Slip Verification - NH-79 Convoy',
    description: 'Verify tare weight for 12 Volvo 10-wheeler tippers returning from bypass unloading.',
    priority: 'HIGH' as const,
    estimatedMinutes: 45,
    entityId: 'WB-02',
    entityTitle: 'Station 2 Electronic Weighbridge',
    icon: Truck
  },
  {
    module: 'FINANCE' as const,
    title: 'Sign Quarry Landowner Quarterly Royalty Settlement Slip',
    description: 'Verify 4,200 MT production volume calculation for Bhilwara Land Parcel A-12 before bank RTGS transfer.',
    priority: 'HIGH' as const,
    estimatedMinutes: 30,
    entityId: 'LEASE-A12',
    entityTitle: 'Bhilwara Land Lease Agreement 2026',
    icon: Landmark
  },
  {
    module: 'HR' as const,
    title: 'Biometric Excavator Operator Shift Handover Attendance Signoff',
    description: 'Confirm 8-hour shift logs for 6 CAT excavator operators and safety helmet inspection.',
    priority: 'MEDIUM' as const,
    estimatedMinutes: 20,
    entityId: 'SHIFT-MORNING',
    entityTitle: 'Morning Heavy Equipment Shift #01',
    icon: UserCheck
  }
];

export const OttMinetrixSyncModal: React.FC<OttMinetrixSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncTask,
  contacts
}) => {
  const [selectedPreset, setSelectedPreset] = useState(MINETRIX_PRESETS[0]);
  const [assignedToId, setAssignedToId] = useState(contacts[1]?.id || contacts[0]?.id || 'USR-1002');
  const [syncedResult, setSyncedResult] = useState<boolean>(false);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const handleTriggerSync = () => {
    onSyncTask({
      module: selectedPreset.module,
      title: selectedPreset.title,
      description: selectedPreset.description,
      assignedToId,
      assignedByName: 'Nafid Khan (Quarry Owner)',
      priority: selectedPreset.priority,
      dueDate: todayStr,
      dueTime: '18:00',
      estimatedMinutes: selectedPreset.estimatedMinutes,
      entityId: selectedPreset.entityId,
      entityTitle: selectedPreset.entityTitle
    });

    setSyncedResult(true);
    setTimeout(() => {
      setSyncedResult(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">RZ® Minetrix BOS &rarr; OTT Dispatch Bridge</h3>
              <p className="text-[11px] text-slate-400">Automated task assignment from Mining & Fleet Operations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <strong>Seamless BOS Integration:</strong> When a Quarry Owner or Fleet Manager triggers an operation inside RZ Minetrix BOS, it automatically appears on the staff&apos;s personal OTT day schedule. Once completed, the status streams back into Minetrix live registers.
          </p>

          {/* Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Minetrix BOS Workflow Action
            </label>
            <div className="space-y-2">
              {MINETRIX_PRESETS.map((p, idx) => {
                const Icon = p.icon;
                const isSelected = selectedPreset.title === p.title;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPreset(p)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {p.module}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{p.description}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                        <span>Entity: {p.entityTitle}</span>
                        <span>•</span>
                        <span>{p.estimatedMinutes} mins</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignee selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Assign to Field Staff in OTT
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} • {c.role || 'Staff Member'}
                </option>
              ))}
            </select>
          </div>

          {syncedResult && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-300 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Task successfully dispatched to OTT Universal Planner & Minetrix synchronized!
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTriggerSync}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Simulate Minetrix BOS Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
