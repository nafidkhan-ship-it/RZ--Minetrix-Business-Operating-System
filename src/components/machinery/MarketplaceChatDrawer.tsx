import React, { useState } from 'react';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  DollarSign,
  FileText,
  Truck,
  CheckCircle2,
  Building2,
  Phone
} from 'lucide-react';

interface MarketplaceChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  contextCode: string;
}

export const MarketplaceChatDrawer: React.FC<MarketplaceChatDrawerProps> = ({
  isOpen,
  onClose,
  recipientName,
  contextCode
}) => {
  const [messages, setMessages] = useState<{ id: string; sender: 'me' | 'them'; text: string; time: string }[]>([
    {
      id: '1',
      sender: 'them',
      text: `Hello! Regarding ${contextCode}: This unit is stationed at our Nileshwaram Quarry facility, fully serviced with original RC smart card. Are you available for a surveyor inspection this week?`,
      time: '10:45 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'me' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'them',
          text: `Acknowledged! I have noted your message regarding ${contextCode}. Our site foreman will prepare the machine for cold-start demo.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* HEADER */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-amber-400 font-bold">{contextCode}</div>
            <div className="text-sm font-black text-white">{recipientName}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* QUICK CONTEXT BAR */}
      <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Channel: RZ® Real-Time Negotiation</span>
        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3 h-3" />
          Encrypted
        </span>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === 'me'
                  ? 'bg-amber-500 text-slate-950 font-medium'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}
      </div>

      {/* QUICK ATTACH SHORTCUTS */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => setInputText('Can you share the latest hydraulic pump test report?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap cursor-pointer"
        >
          Request Inspection Report
        </button>
        <button
          onClick={() => setInputText('Are RTO Form 29 & 30 ready with active NOC?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap cursor-pointer"
        >
          Ask RTO NOC
        </button>
      </div>

      {/* INPUT BAR */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${recipientName}...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
