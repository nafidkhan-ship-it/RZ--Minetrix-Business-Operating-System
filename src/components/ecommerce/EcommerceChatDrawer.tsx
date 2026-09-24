import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  User,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface EcommerceChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName?: string;
  contextRef?: string;
}

export const EcommerceChatDrawer: React.FC<EcommerceChatDrawerProps> = ({
  isOpen,
  onClose,
  supplierName = 'Kasaragod Laterite Concession Pit #01',
  contextRef = 'ORD-RZ-2026-8821'
}) => {
  const [messages, setMessages] = useState([
    { sender: 'System', text: `Chat session initiated for ${contextRef} with ${supplierName}.`, time: '10:00 AM' },
    { sender: supplierName, text: 'Hello, our quarry cutting line is operational. How can we assist with your delivery requirement?', time: '10:02 AM' }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([
      ...messages,
      { sender: 'You (Operations Desk)', text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputText('');

    // Demo automated reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: supplierName,
          text: 'Acknowledged. We have logged the instructions with the pit supervisor and dispatch desk.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white truncate max-w-[200px]">{supplierName}</h3>
            <span className="text-[10px] text-amber-400 font-mono">{contextRef}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, i) => (
          <div key={i} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="font-bold text-amber-400">{m.sender}</span>
              <span className="text-slate-500">{m.time}</span>
            </div>
            <p className="text-slate-200">{m.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type message to quarry..."
          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={handleSend}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
