import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Layers,
  ChevronRight,
  Check
} from 'lucide-react';
import { END_TO_END_TEST_SEQUENCE } from './routeRegistry';

interface EndToEndRouteTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePath: (path: string) => void;
  currentPath: string;
}

export const EndToEndRouteTesterModal: React.FC<EndToEndRouteTesterModalProps> = ({
  isOpen,
  onClose,
  onNavigatePath,
  currentPath
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1]);

  if (!isOpen) return null;

  const activeStep = END_TO_END_TEST_SEQUENCE[currentStepIdx];

  const handleExecuteStep = (index: number) => {
    setCurrentStepIdx(index);
    const step = END_TO_END_TEST_SEQUENCE[index];
    if (!visitedSteps.includes(step.step)) {
      setVisitedSteps(prev => [...prev, step.step]);
    }
    onNavigatePath(step.path);
  };

  const handleNext = () => {
    if (currentStepIdx < END_TO_END_TEST_SEQUENCE.length - 1) {
      handleExecuteStep(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      handleExecuteStep(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setVisitedSteps([1]);
    onNavigatePath(END_TO_END_TEST_SEQUENCE[0].path);
  };

  const progressPercent = Math.round((visitedSteps.length / END_TO_END_TEST_SEQUENCE.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Section AD &bull; Complete 20-Step Navigation Loop
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">
                {visitedSteps.length}/20 Verified
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>RZ® Minetrix Ecosystem Route Loop</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify seamless end-to-end traversal from Home through all 10 Platforms, ERP Core, Finance, Org, RBAC to Settings and back.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Sequence Traversal Progress</span>
            <span className="text-amber-400 font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Current Active Step Showcase Card */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
                {activeStep.step}
              </span>
              <span className="text-sm font-black text-white tracking-wide">{activeStep.label}</span>
              <span className="font-mono text-[11px] text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                {activeStep.path}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {activeStep.desc}
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Target Component Section: <span className="text-slate-300 font-bold">{activeStep.sectionId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleExecuteStep(currentStepIdx)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Navigate Now</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Grid (1 to 20) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[36vh]">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {END_TO_END_TEST_SEQUENCE.map((s, idx) => {
              const isActive = idx === currentStepIdx;
              const isVisited = visitedSteps.includes(s.step);

              return (
                <button
                  key={s.step}
                  onClick={() => handleExecuteStep(idx)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                      : isVisited
                      ? 'bg-slate-950/80 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/60'
                      : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{s.step}
                    </span>
                    {isVisited && !isActive && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold truncate leading-tight">{s.label}</div>
                    <div className={`text-[9px] font-mono truncate ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                      {s.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Traversal Controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Loop</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIdx === END_TO_END_TEST_SEQUENCE.length - 1}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 text-xs font-black transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <span>Next Step ({currentStepIdx + 2}/20)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
