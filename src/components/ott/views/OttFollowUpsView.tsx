import React, { useState } from 'react';
import {
  PhoneCall,
  User,
  Clock,
  CheckCircle2,
  Calendar,
  Plus,
  MessageCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import {
  OttFollowUp,
  DEMO_OTT_FOLLOW_UPS,
  CURRENT_USER,
  OttSourceSystem
} from '../../../data/rzOttData';

interface OttFollowUpsViewProps {
  onOpenChatWithAssignee: (userName: string) => void;
}

export const OttFollowUpsView: React.FC<OttFollowUpsViewProps> = ({
  onOpenChatWithAssignee
}) => {
  const [followUps, setFollowUps] = useState<OttFollowUp[]>(DEMO_OTT_FOLLOW_UPS);
  const [filterSystem, setFilterSystem] = useState<string>('ALL');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTargetName, setNewTargetName] = useState('');
  const [newTargetPhone, setNewTargetPhone] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newSystem, setNewSystem] = useState<OttSourceSystem>('BUILDING_MATERIALS');

  const filtered = followUps.filter((f) => {
    if (filterSystem !== 'ALL' && f.sourceSystem !== filterSystem) return false;
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: OttFollowUp['status']) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const item: OttFollowUp = {
      id: `FLW-${Date.now()}`,
      title: newSubject,
      contactName: newTargetName || 'Valued Client',
      contactPhone: newTargetPhone || '+91 94471 22890',
      contactRole: 'Customer Representative',
      sourceSystem: newSystem,
      sourceRecordId: `REC-${Date.now().toString().slice(-4)}`,
      dueDate: 'Today, 05:00 PM',
      assignedUser: CURRENT_USER,
      status: 'PENDING',
      priority: 'HIGH',
      notes: 'Scheduled via OTT relationship pipeline.',
      createdAt: new Date().toISOString()
    };

    setFollowUps([item, ...followUps]);
    setIsAddingNew(false);
    setNewSubject('');
    setNewTargetName('');
    setNewTargetPhone('');
  };

  const getStatusStyle = (status: OttFollowUp['status']) => {
    switch (status) {
      case 'RESOLVED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'IN_DISCUSSION': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'CONTACTED': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PENDING': return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                RELATIONSHIP CADENCE
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {followUps.length} Registered Outreaches
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-0.5">Follow-ups &amp; Counterparty Engagements</h2>
            <div className="text-xs text-slate-400">
              Track customer quotes, supplier negotiations, land owners, and payment collections
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Follow-up</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'ALL', label: 'All Contacts' },
          { id: 'BUILDING_MATERIALS', label: 'Commerce & Orders' },
          { id: 'QUARRY', label: 'Quarry Pit' },
          { id: 'QUARRY_LAND', label: 'Land Owners' },
          { id: 'CONTRACT_JOB', label: 'Contract & Civil' },
          { id: 'RZ_CHAT', label: 'From Chat' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterSystem(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
              filterSystem === tab.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* New Follow-up Form Modal Inline */}
      {isAddingNew && (
        <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Schedule Follow-up Outreach</h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Source System</label>
              <select
                value={newSystem}
                onChange={(e) => setNewSystem(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              >
                <option value="BUILDING_MATERIALS">Building Materials</option>
                <option value="QUARRY">Quarry Management</option>
                <option value="QUARRY_LAND">Quarry Land</option>
                <option value="CONTRACT_JOB">Contract &amp; Job</option>
                <option value="RZ_CHAT">RZ Chat</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Name</label>
              <input
                type="text"
                required
                value={newTargetName}
                onChange={(e) => setNewTargetName(e.target.value)}
                placeholder="e.g. Al-Madina Infrastructure"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={newTargetPhone}
                onChange={(e) => setNewTargetPhone(e.target.value)}
                placeholder="+91 98470 11223"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject / Agenda</label>
            <input
              type="text"
              required
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Review updated 20mm aggregate rate per metric ton for next quarter"
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl shadow"
            >
              Save Follow-up
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.map((fu) => (
          <div
            key={fu.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                    {fu.sourceSystem}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getStatusStyle(fu.status)}`}>
                    {fu.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-black text-sm text-white">{fu.title}</h3>
                <p className="text-slate-400 text-xs">{fu.notes}</p>
              </div>

              {/* Target info */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 min-w-[200px]">
                <div className="font-bold text-white text-xs">{fu.contactName}</div>
                <div className="text-[11px] font-mono text-amber-400 mt-0.5">{fu.contactPhone}</div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {fu.dueDate}
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500 font-mono">
                Assigned: <strong className="text-slate-300">{fu.assignedUser.name}</strong>
              </div>

              <div className="flex items-center gap-2">
                {fu.status !== 'CONTACTED' && fu.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateStatus(fu.id, 'CONTACTED')}
                    className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <PhoneCall className="w-3 h-3" /> Mark Contacted
                  </button>
                )}

                {fu.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleUpdateStatus(fu.id, 'RESOLVED')}
                    className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Resolve
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(fu.id, 'PENDING')}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Re-open
                  </button>
                )}

                <button
                  onClick={() => onOpenChatWithAssignee(fu.contactName)}
                  className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                >
                  <MessageCircle className="w-3 h-3" /> Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
