import React, { useState } from 'react';
import {
  Link2,
  Sparkles,
  Truck,
  Mountain,
  Wrench,
  Briefcase,
  ShoppingCart,
  Landmark,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Shield,
  Send,
  Plus
} from 'lucide-react';
import {
  OttTask,
  OttSourceSystem,
  CURRENT_USER
} from '../../../data/rzOttData';
import { SectionId } from '../../../types/architecture';

interface OttCrossPlatformBridgeViewProps {
  onInjectCrossPlatformTask: (task: Partial<OttTask>) => void;
  onOpenSource: (sectionId: SectionId) => void;
}

export const OttCrossPlatformBridgeView: React.FC<OttCrossPlatformBridgeViewProps> = ({
  onInjectCrossPlatformTask,
  onOpenSource
}) => {
  const [lastDispatchedEvent, setLastDispatchedEvent] = useState<string | null>(null);

  const crossPlatformTriggers: {
    system: OttSourceSystem;
    name: string;
    icon: any;
    sectionId: SectionId;
    color: string;
    examples: {
      title: string;
      module: string;
      recordId: string;
      event: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      category: 'WORK' | 'BUSINESS';
      dueTime: string;
    }[];
  }[] = [
    {
      system: 'QUARRY',
      name: 'Platform 1 — Quarry Management',
      icon: Mountain,
      sectionId: 'universal-dashboard',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      examples: [
        {
          title: 'Explosive Magazine Permit Renewal Check',
          module: 'Pit Regulatory Compliance',
          recordId: 'PERMIT-DGMS-2026-B',
          event: 'Quarterly Permit Expiry Flag',
          priority: 'URGENT',
          category: 'WORK',
          dueTime: '01:00 PM'
        },
        {
          title: 'Bench 3 Overburden Slope Stability Inspection',
          module: 'Geotechnical Safety',
          recordId: 'BENCH-03-GEO',
          event: 'Post-Monsoon Seepage Alert',
          priority: 'HIGH',
          category: 'WORK',
          dueTime: '04:00 PM'
        }
      ]
    },
    {
      system: 'CRUSHER',
      name: 'Platform 2 — Crusher Management',
      icon: Wrench,
      sectionId: 'universal-dashboard',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      examples: [
        {
          title: 'Jaw Crusher CJ-411 Toggle Plate Replacement',
          module: 'Preventive Plant Maintenance',
          recordId: 'CRUSH-JAW-01',
          event: 'Operating Hours Threshold (2,500 hrs)',
          priority: 'HIGH',
          category: 'WORK',
          dueTime: '06:00 PM'
        },
        {
          title: 'Stockpile 20mm Blue Metal Volume Audit',
          module: 'Inventory Reconciliation',
          recordId: 'STOCK-20MM-09',
          event: 'Discrepancy Variance Exceeded 5%',
          priority: 'MEDIUM',
          category: 'WORK',
          dueTime: '05:00 PM'
        }
      ]
    },
    {
      system: 'VEHICLE',
      name: 'Platform 3 — Vehicle & Heavy Fleet',
      icon: Truck,
      sectionId: 'universal-dashboard',
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      examples: [
        {
          title: 'Tipper KL-14-Y-9201 Fitness Certificate Expiry',
          module: 'Fleet Compliance & RTO',
          recordId: 'VEH-TIP-9201',
          event: 'RTO National Permit Expiry in 3 Days',
          priority: 'URGENT',
          category: 'WORK',
          dueTime: '02:00 PM'
        },
        {
          title: 'Volvo Excavator EC-480 Hydraulic Line Pressure Test',
          module: 'Heavy Machinery Maintenance',
          recordId: 'EXC-VOLVO-480',
          event: 'Operator Daily Defect Slip Submission',
          priority: 'HIGH',
          category: 'WORK',
          dueTime: '03:30 PM'
        }
      ]
    },
    {
      system: 'CONTRACT_JOB',
      name: 'Platform 4 — Contract & Civil Jobs',
      icon: Briefcase,
      sectionId: 'universal-dashboard',
      color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      examples: [
        {
          title: 'NH-66 Highway Milestone 3 Sub-base Compaction Sign-off',
          module: 'Site Inspection & Quality',
          recordId: 'JOB-NH66-PKG3',
          event: 'Site Engineer Work Order Sign-off Required',
          priority: 'HIGH',
          category: 'WORK',
          dueTime: '05:30 PM'
        }
      ]
    },
    {
      system: 'BUILDING_MATERIALS',
      name: 'Platform 5 — Building Materials Commerce',
      icon: ShoppingCart,
      sectionId: 'universal-dashboard',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      examples: [
        {
          title: 'Order ORD-8812: 50 MT M-Sand Ready for Dispatch Dispatcher',
          module: 'Logistics Fulfillment',
          recordId: 'ORD-8812',
          event: 'Payment Cleared - Dispatch Queue Trigger',
          priority: 'HIGH',
          category: 'BUSINESS',
          dueTime: '03:00 PM'
        }
      ]
    },
    {
      system: 'MARKETPLACE',
      name: 'Platform 6 — Used Machinery Marketplace',
      icon: Briefcase,
      sectionId: 'universal-dashboard',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      examples: [
        {
          title: 'Buyer Physical Inspection: 2021 CAT 320D Excavator',
          module: 'Escrow & Inspection Hub',
          recordId: 'LIST-CAT-320D',
          event: 'Buyer Inspection Deposit Confirmed',
          priority: 'MEDIUM',
          category: 'BUSINESS',
          dueTime: '11:00 AM'
        }
      ]
    },
    {
      system: 'QUARRY_LAND',
      name: 'Platform 7 — Quarry Land Management',
      icon: Landmark,
      sectionId: 'universal-dashboard',
      color: 'text-lime-400 border-lime-500/30 bg-lime-500/10',
      examples: [
        {
          title: 'Survey No. 44/2B Lease Agreement Royalty Calculation',
          module: 'Landowner Royalty Settlement',
          recordId: 'LAND-SURV-44-2B',
          event: 'Monthly Extraction Volume Finalized',
          priority: 'HIGH',
          category: 'BUSINESS',
          dueTime: '04:30 PM'
        }
      ]
    },
    {
      system: 'RZ_CHAT',
      name: 'Platform 8 — RZ® Chat Ecosystem',
      icon: MessageSquare,
      sectionId: 'rz-chating',
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      examples: [
        {
          title: 'Action Item from Quarry Supervisors Group: Night Shift Floodlights',
          module: 'Group Conversation Action Parser',
          recordId: 'MSG-CHAT-7729',
          event: 'User created Task from Chat Message',
          priority: 'HIGH',
          category: 'WORK',
          dueTime: '07:00 PM'
        }
      ]
    }
  ];

  const handleSimulateDispatch = (ex: any, sys: OttSourceSystem, secId: SectionId) => {
    const newTask: Partial<OttTask> = {
      title: ex.title,
      description: `Cross-platform task auto-triggered from ${sys} (${ex.module}). Source Event: ${ex.event}.`,
      category: ex.category,
      priority: ex.priority,
      status: 'ASSIGNED',
      assignee: CURRENT_USER,
      createdBy: {
        id: 'user-system',
        name: `${sys} Event Engine`,
        role: 'Automated Event Daemon',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        email: 'daemon@minetrix.in',
        phone: '+91 94470 00000',
        team: 'Automated Operations'
      },
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: ex.dueTime,
      startDate: new Date().toISOString().split('T')[0],
      reminderRule: '30 minutes before',
      reminderStatus: 'SCHEDULED',
      repeatRule: 'NONE',
      tags: ['CrossPlatform', sys, ex.recordId],
      subtasks: [
        { id: `st-${Date.now()}-1`, title: `Inspect source record ${ex.recordId}`, completed: false },
        { id: `st-${Date.now()}-2`, title: 'Execute operational remediation', completed: false },
        { id: `st-${Date.now()}-3`, title: `Confirm callback status to ${sys}`, completed: false }
      ],
      attachments: [],
      comments: [],
      source: {
        sourceSystem: sys,
        sourceModule: ex.module,
        sourceRecordId: ex.recordId,
        sourceEvent: ex.event,
        targetSectionId: secId,
        sourceStatusBefore: 'FLAGGED_IN_OPERATIONS',
        sourceStatusAfter: 'RESOLVED_BY_OTT'
      },
      activityLog: [
        {
          id: `act-${Date.now()}`,
          action: `Received via RZ® Ecosystem Bridge from ${sys}`,
          actor: `${sys} System Bridge`,
          timestamp: 'Just now'
        }
      ]
    };

    onInjectCrossPlatformTask(newTask);
    setLastDispatchedEvent(`${sys} &bull; ${ex.recordId} &rarr; Injected into My Day!`);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ECOSYSTEM SYNC ENGINE
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                8 Integrated Platforms
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-0.5">Cross-Platform Integration Bridge</h2>
            <div className="text-xs text-slate-400">
              Interactive testbed: Simulate automated task generation from any RZ MINETRIX platform into OTT
            </div>
          </div>
        </div>

        {lastDispatchedEvent && (
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: lastDispatchedEvent }} />
          </div>
        )}
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crossPlatformTriggers.map((p) => {
          const Icon = p.icon;

          return (
            <div
              key={p.system}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-3.5 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${p.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm">{p.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">System Code: {p.system}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenSource(p.sectionId)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    title={`Go to ${p.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Example triggers list */}
                <div className="space-y-2 mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Available Trigger Events:
                  </span>

                  {p.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate text-xs">{ex.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {ex.module} &bull; <span className="font-mono text-amber-400">{ex.recordId}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSimulateDispatch(ex, p.system, p.sectionId)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shrink-0 shadow-md transition cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Send to OTT</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Bi-directional lifecycle sync</span>
                <span className="text-emerald-400">&bull; Live</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
