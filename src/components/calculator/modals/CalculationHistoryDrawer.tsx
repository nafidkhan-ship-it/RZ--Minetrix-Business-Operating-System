import React from 'react';
import { X, Clock, Trash2, Copy, ArrowRight, Check } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface CalculationHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onClearHistory: () => void;
  onSelectCalculator?: (calculatorId: string) => void;
}

export const CalculationHistoryDrawer: React.FC<CalculationHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectCalculator
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: CalculationHistoryItem) => {
    const text = `${item.calculatorName}: ${item.resultSummary} (Calculated on ${item.timestamp})`;
    navigator.clipboard?.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Calculation History</h3>
              <p className="text-[11px] text-slate-500 font-mono">{history.length} records this session</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-24 text-slate-500 text-xs space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-600" />
              <p>No calculations saved yet.</p>
              <p className="text-[11px] text-slate-600">
                Run any calculator and click "Save to History" or calculate values to populate this audit tape.
              </p>
            </div>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-white text-xs block">{item.calculatorName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition cursor-pointer"
                      title="Copy result"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    {onSelectCalculator && (
                      <button
                        onClick={() => {
                          onSelectCalculator(item.calculatorId);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Open calculator"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-amber-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                  {item.resultSummary}
                </div>

                {item.inputs && Object.keys(item.inputs).length > 0 && (
                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5 pt-1">
                    {Object.entries(item.inputs).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500 capitalize">{k}:</span>
                        <span>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-500 text-center font-mono">
          Stored locally in private browser storage
        </div>
      </div>
    </div>
  );
};
