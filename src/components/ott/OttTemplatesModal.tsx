import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Truck,
  Mountain,
  Wrench,
  Briefcase,
  ShoppingCart,
  Landmark,
  Plus,
  Clock,
  Repeat,
  CheckCircle2
} from 'lucide-react';
import {
  OttTemplate,
  OttTask,
  SMART_TASK_TEMPLATES,
  CURRENT_USER
} from '../../data/rzOttData';

interface OttTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (task: Partial<OttTask>) => void;
}

export const OttTemplatesModal: React.FC<OttTemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate
}) => {
  const [filterSystem, setFilterSystem] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = filterSystem === 'ALL'
    ? SMART_TASK_TEMPLATES
    : SMART_TASK_TEMPLATES.filter(t => t.sourceSystem === filterSystem);

  const handleInstantiate = (tpl: OttTemplate) => {
    const newTask: Partial<OttTask> = {
      title: tpl.title,
      description: tpl.description,
      category: tpl.category,
      priority: tpl.priority,
      status: 'ASSIGNED',
      assignee: CURRENT_USER,
      createdBy: CURRENT_USER,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '04:00 PM',
      startDate: new Date().toISOString().split('T')[0],
      reminderRule: '30 minutes before',
      reminderStatus: 'SCHEDULED',
      repeatRule: tpl.repeatRule,
      tags: [...tpl.tags, 'TemplateInstantiated'],
      estimatedMinutes: tpl.estimatedMinutes,
      subtasks: tpl.subtasks.map((st, i) => ({
        id: `st-${Date.now()}-${i}`,
        title: st,
        completed: false
      })),
      attachments: [],
      comments: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          action: `Instantiated from Smart Template [${tpl.id}]`,
          actor: CURRENT_USER.name,
          timestamp: 'Just now'
        }
      ]
    };

    if (tpl.sourceSystem !== 'RZ_OTT') {
      newTask.source = {
        sourceSystem: tpl.sourceSystem,
        sourceModule: `${tpl.sourceSystem} Operational Checklist`,
        sourceRecordId: `${tpl.sourceSystem}-TPL-01`,
        sourceEvent: 'Instantiated via Smart OTT Template',
        targetSectionId: 'universal-dashboard',
        sourceStatusBefore: 'TEMPLATE_DISPATCHED',
        sourceStatusAfter: 'TASK_COMPLETED'
      };
    }

    onApplyTemplate(newTask);
    onClose();
  };

  const categories = [
    { id: 'ALL', label: 'All Templates', icon: Layers },
    { id: 'VEHICLE', label: 'Vehicle Fleet', icon: Truck },
    { id: 'QUARRY', label: 'Quarry Pit', icon: Mountain },
    { id: 'CRUSHER', label: 'Crusher Plant', icon: Wrench },
    { id: 'CONTRACT_JOB', label: 'Civil Jobs', icon: Briefcase },
    { id: 'BUILDING_MATERIALS', label: 'Materials Commerce', icon: ShoppingCart },
    { id: 'QUARRY_LAND', label: 'Quarry Land', icon: Landmark }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                READY-MADE WORKFLOWS
              </span>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">Smart Task Templates</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isAct = filterSystem === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterSystem(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border cursor-pointer ${
                  isAct
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Template Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1 text-xs">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                    {tpl.sourceSystem}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {tpl.estimatedMinutes}m
                    </span>
                    {tpl.repeatRule !== 'NONE' && (
                      <span className="flex items-center gap-1 text-blue-400">
                        <Repeat className="w-3 h-3" />
                        {tpl.repeatRule}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-black text-sm text-white group-hover:text-amber-300 transition">
                  {tpl.title}
                </h3>
                <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">
                  {tpl.description}
                </p>

                {/* Subtask preview list */}
                <div className="mt-3 space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Pre-Configured Subtasks ({tpl.subtasks.length}):
                  </span>
                  {tpl.subtasks.slice(0, 3).map((st, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="truncate">{st}</span>
                    </div>
                  ))}
                  {tpl.subtasks.length > 3 && (
                    <div className="text-[10px] text-slate-500 italic pl-3">
                      +{tpl.subtasks.length - 3} more subtasks included
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {tpl.tags.slice(0, 2).map((t, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleInstantiate(tpl)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
