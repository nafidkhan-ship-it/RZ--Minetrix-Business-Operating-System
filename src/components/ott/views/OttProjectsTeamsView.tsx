import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  FolderKanban,
  Layers,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  OttProject,
  OttTeam,
  DEMO_OTT_PROJECTS,
  DEMO_OTT_TEAMS,
  CURRENT_USER
} from '../../../data/rzOttData';

interface OttProjectsTeamsViewProps {
  viewMode: 'PROJECTS' | 'TEAMS';
  onFilterTasksByProject?: (projectName: string) => void;
  onFilterTasksByTeam?: (teamName: string) => void;
}

export const OttProjectsTeamsView: React.FC<OttProjectsTeamsViewProps> = ({
  viewMode,
  onFilterTasksByProject,
  onFilterTasksByTeam
}) => {
  const [projects, setProjects] = useState<OttProject[]>(DEMO_OTT_PROJECTS);
  const [teams, setTeams] = useState<OttTeam[]>(DEMO_OTT_TEAMS);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    const newP: OttProject = {
      id: `PRJ-${Date.now().toString().slice(-4)}`,
      name: newProjTitle.trim(),
      description: newProjDesc.trim() || 'Strategic operational project within RZ MINETRIX',
      owner: CURRENT_USER,
      members: [CURRENT_USER],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      progressPercent: 0,
      status: 'PLANNING',
      tasksCount: 0,
      completedTasksCount: 0,
      tags: ['Operational', 'RZ_BOS']
    };

    setProjects([newP, ...projects]);
    setIsAddingProject(false);
    setNewProjTitle('');
    setNewProjDesc('');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {viewMode === 'PROJECTS' ? <FolderKanban className="w-5 h-5" /> : <Users className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                {viewMode === 'PROJECTS' ? 'STRATEGIC PORTFOLIO' : 'ORGANISATIONAL UNITS'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {viewMode === 'PROJECTS' ? `${projects.length} Active Initiatives` : `${teams.length} Operating Squads`}
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-0.5">
              {viewMode === 'PROJECTS' ? 'Project Workspaces & Initiatives' : 'Operational Teams & Division Workloads'}
            </h2>
            <div className="text-xs text-slate-400">
              {viewMode === 'PROJECTS'
                ? 'Coordinated workstreams across mining expansions, crushing plants, and software upgrades'
                : 'Performance metrics, member assignments, and operational capacity across squads'}
            </div>
          </div>
        </div>

        {viewMode === 'PROJECTS' && (
          <button
            onClick={() => setIsAddingProject(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Inline Create Project */}
      {isAddingProject && (
        <form onSubmit={handleAddProject} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-3 text-xs">
          <h3 className="font-bold text-white text-sm">Create Strategic Project Workspace</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Project Name</label>
              <input
                type="text"
                required
                value={newProjTitle}
                onChange={(e) => setNewProjTitle(e.target.value)}
                placeholder="e.g. Phase 3 Heavy Vehicle Automation & Telematics"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description &amp; Goals</label>
              <textarea
                rows={2}
                value={newProjDesc}
                onChange={(e) => setNewProjDesc(e.target.value)}
                placeholder="Key deliverables, compliance checkpoints, and budget objectives..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingProject(false)}
              className="px-3 py-1 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl shadow"
            >
              Create Project
            </button>
          </div>
        </form>
      )}

      {/* PROJECTS VIEW */}
      {viewMode === 'PROJECTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition shadow-lg flex flex-col justify-between space-y-4 text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    proj.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    proj.status === 'ACTIVE' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Target: {proj.endDate}</span>
                  </div>
                </div>

                <h3 className="font-black text-base text-white">{proj.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{proj.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Tasks: <strong className="text-white">{proj.completedTasksCount}</strong> / {proj.tasksCount} Done
                  </span>
                  <span className="font-mono font-bold text-amber-400">{proj.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${proj.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Members & Action */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 mr-1">Squad:</span>
                  {proj.members.map((m, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {m.name.split(' ')[0]}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => alert(`Showing tasks for project: ${proj.name}`)}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Open Tasks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TEAMS VIEW */}
      {viewMode === 'TEAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((tm) => (
            <div
              key={tm.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-4 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-sm text-white">{tm.name}</h3>
                  <div className="text-[11px] text-amber-400 mt-0.5">Lead: {tm.lead.name}</div>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-bold text-[10px]">
                  {tm.completionRatePercent}% EFF
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Members</span>
                  <strong className="text-white font-mono text-sm">{tm.membersCount}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Active Tasks</span>
                  <strong className="text-amber-400 font-mono text-sm">{tm.activeTasksCount}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Completed</span>
                  <strong className="text-emerald-400 font-mono text-sm">{tm.completedTasksCount}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Operations Squad</span>
                <button
                  onClick={() => alert(`Opening squad workspace for ${tm.name}`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <span>Team Board</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
