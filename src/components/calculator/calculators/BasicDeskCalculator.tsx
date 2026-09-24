import React, { useState } from 'react';
import { Copy, RotateCcw, Check, Clock, Delete, CornerDownLeft } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface BasicDeskCalculatorProps {
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

export const BasicDeskCalculator: React.FC<BasicDeskCalculatorProps> = ({ onRecordHistory }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number>(0);
  const [tapeHistory, setTapeHistory] = useState<string[]>([
    '125000 × 18% = 22,500',
    '45000 + 17500 = 62,500'
  ]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'AC') {
      setDisplay('0');
      setEquation('');
    } else if (key === 'C') {
      setDisplay('0');
    } else if (key === 'DEL') {
      if (display.length > 1 && display !== 'Error') {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay('0');
      }
    } else if (key === '±') {
      const num = parseFloat(display);
      if (!isNaN(num)) {
        setDisplay(String(-num));
      }
    } else if (key === '%') {
      const num = parseFloat(display);
      if (!isNaN(num)) {
        setDisplay(String(num / 100));
      }
    } else if (['+', '−', '×', '÷'].includes(key)) {
      setEquation(`${display} ${key}`);
      setDisplay('0');
    } else if (key === '=') {
      if (!equation) return;
      try {
        const parts = equation.trim().split(' ');
        const op1 = parseFloat(parts[0]);
        const op = parts[1];
        const op2 = parseFloat(display);

        if (isNaN(op1) || isNaN(op2)) return;

        let result = 0;
        if (op === '+') result = op1 + op2;
        if (op === '−' || op === '-') result = op1 - op2;
        if (op === '×' || op === '*') result = op1 * op2;
        if (op === '÷' || op === '/') {
          if (op2 === 0) {
            setDisplay('Cannot divide by 0');
            setEquation('');
            return;
          }
          result = op1 / op2;
        }

        // Format neatly
        const rounded = Number(result.toFixed(8));
        const resStr = String(rounded);
        const tapeEntry = `${parts[0]} ${op} ${display} = ${resStr}`;

        setTapeHistory(prev => [tapeEntry, ...prev.slice(0, 15)]);
        setDisplay(resStr);
        setEquation('');

        if (onRecordHistory) {
          onRecordHistory({
            calculatorId: 'basic-desk',
            calculatorName: 'Standard Desk Calculator',
            inputs: { operand1: parts[0], operation: op, operand2: display },
            resultSummary: `= ${resStr}`,
            details: { fullEquation: tapeEntry }
          });
        }
      } catch {
        setDisplay('Error');
      }
    } else if (key === '.') {
      if (!display.includes('.')) {
        setDisplay(display + '.');
      }
    } else {
      // Numbers
      if (display === '0' || display === 'Error' || display === 'Cannot divide by 0') {
        setDisplay(key);
      } else {
        setDisplay(display + key);
      }
    }
  };

  // Memory Handlers
  const handleMemory = (action: 'MC' | 'MR' | 'M+' | 'M-') => {
    const current = parseFloat(display) || 0;
    if (action === 'MC') setMemory(0);
    if (action === 'MR') setDisplay(String(memory));
    if (action === 'M+') setMemory(prev => prev + current);
    if (action === 'M-') setMemory(prev => prev - current);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Keypad & Display Area */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        {/* Main Display Box */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-inner text-right relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${memory !== 0 ? 'bg-amber-400' : 'bg-slate-700'}`} />
              <span>MEM: {memory}</span>
            </span>
            <span className="truncate max-w-[200px] text-slate-400">{equation || 'Ready'}</span>
          </div>

          <div className="text-3xl sm:text-5xl font-black font-mono text-amber-400 tracking-tight overflow-x-auto scrollbar-none py-1 select-all">
            {display}
          </div>

          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-900 text-[11px] text-slate-500 font-mono">
            <span>RZ-64 PRECISION</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-amber-400 transition flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Calculator Keypad */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {/* Row 1: Memory Controls */}
          <button
            onClick={() => handleMemory('MC')}
            className="py-3 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold border border-slate-800 transition cursor-pointer"
          >
            MC
          </button>
          <button
            onClick={() => handleMemory('MR')}
            className="py-3 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold border border-slate-800 transition cursor-pointer"
          >
            MR
          </button>
          <button
            onClick={() => handleMemory('M+')}
            className="py-3 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold border border-slate-800 transition cursor-pointer"
          >
            M+
          </button>
          <button
            onClick={() => handleMemory('M-')}
            className="py-3 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold border border-slate-800 transition cursor-pointer"
          >
            M−
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleKeyPress('AC')}
            className="py-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold border border-rose-500/30 text-xs transition cursor-pointer"
          >
            AC
          </button>
          <button
            onClick={() => handleKeyPress('DEL')}
            className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 text-xs transition cursor-pointer flex items-center justify-center"
            title="Backspace"
          >
            DEL
          </button>
          <button
            onClick={() => handleKeyPress('%')}
            className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 text-sm transition cursor-pointer"
          >
            %
          </button>
          <button
            onClick={() => handleKeyPress('÷')}
            className="py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl transition cursor-pointer shadow-md"
          >
            ÷
          </button>

          {/* Row 3 */}
          {['7', '8', '9'].map(n => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="py-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-white font-bold font-mono text-xl border border-slate-800 shadow-inner transition cursor-pointer active:scale-95"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress('×')}
            className="py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl transition cursor-pointer shadow-md"
          >
            ×
          </button>

          {/* Row 4 */}
          {['4', '5', '6'].map(n => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="py-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-white font-bold font-mono text-xl border border-slate-800 shadow-inner transition cursor-pointer active:scale-95"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress('−')}
            className="py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl transition cursor-pointer shadow-md"
          >
            −
          </button>

          {/* Row 5 */}
          {['1', '2', '3'].map(n => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="py-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-white font-bold font-mono text-xl border border-slate-800 shadow-inner transition cursor-pointer active:scale-95"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress('+')}
            className="py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl transition cursor-pointer shadow-md"
          >
            +
          </button>

          {/* Row 6 */}
          <button
            onClick={() => handleKeyPress('±')}
            className="py-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-slate-300 font-mono text-base border border-slate-800 transition cursor-pointer"
          >
            ±
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="py-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-white font-bold font-mono text-xl border border-slate-800 shadow-inner transition cursor-pointer active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => handleKeyPress('.')}
            className="py-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-white font-bold font-mono text-xl border border-slate-800 shadow-inner transition cursor-pointer"
          >
            .
          </button>
          <button
            onClick={() => handleKeyPress('=')}
            className="py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-2xl transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
          >
            =
          </button>
        </div>
      </div>

      {/* Tape History Panel */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Calculation Tape</span>
            </h3>
            {tapeHistory.length > 0 && (
              <button
                onClick={() => setTapeHistory([])}
                className="text-[10px] text-slate-500 hover:text-rose-400 transition cursor-pointer"
              >
                Clear Tape
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2 max-h-[360px] overflow-y-auto scrollbar-none pr-1">
            {tapeHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-600 text-xs">
                No recent calculations on tape
              </div>
            ) : (
              tapeHistory.map((entry, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const res = entry.split('=')[1]?.trim();
                    if (res) setDisplay(res);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer group text-right"
                  title="Click to load result"
                >
                  <div className="text-xs font-mono text-slate-400 group-hover:text-white transition">
                    {entry}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <span className="font-bold text-slate-300 block">Keyboard Shortcuts</span>
          <p className="text-slate-500 leading-relaxed">
            Click any entry on the tape to reload that value into the current calculation buffer.
          </p>
        </div>
      </div>
    </div>
  );
};
