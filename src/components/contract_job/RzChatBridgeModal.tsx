import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MapPin,
  Pin,
  Users,
  CheckCircle2,
  X
} from 'lucide-react';

interface RzChatBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelTitle?: string;
  channelSubtitle?: string;
}

interface ChatMsg {
  id: string;
  sender: string;
  role: string;
  time: string;
  text: string;
  attachment?: string;
  isPinned?: boolean;
}

export const RzChatBridgeModal: React.FC<RzChatBridgeModalProps> = ({
  isOpen,
  onClose,
  channelTitle = 'JOB-4001 • Moodbidri Quarry Pit 2 Operational Channel',
  channelSubtitle = 'Coastal Blasting, Er. Rajesh Varma, Fleet Logistics, Site Safety'
}) => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'm1',
      sender: 'Er. Rajesh Varma',
      role: 'Project Manager',
      time: '08:30 AM',
      text: 'Morning crew! Controlled blast at Bench 3 is scheduled for 11:30 AM today. Sirens must sound at T-15 mins.',
      isPinned: true
    },
    {
      id: 'm2',
      sender: 'Suresh Poojary',
      role: 'Blasting In-Charge',
      time: '08:45 AM',
      text: 'Explosives arrived from Apex Magazine under police escort. 24 non-electric delay detonators loaded.',
      attachment: 'blast_pattern_bench3.dwg'
    },
    {
      id: 'm3',
      sender: 'Santhosh Kumar',
      role: 'Fleet Supervisor',
      time: '09:10 AM',
      text: '6 tippers queued at Crusher Primary hopper. First load of 40mm sub-base dispatched to flyover site.',
      attachment: 'site_photo_loading.jpg'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: ChatMsg = {
      id: `m_${Date.now()}`,
      sender: 'Er. Rajesh Varma (You)',
      role: 'Project Director',
      time: 'Just now',
      text: inputVal.trim()
    };

    setMessages([...messages, newMsg]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl h-[600px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  RZ® Chat Real-Time Channel
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">{channelTitle}</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-md">{channelSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pinned Announcement */}
        <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
          <Pin className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold text-[11px] truncate">
            Controlled blast at Bench 3 scheduled for 11:30 AM today. Sirens sound at T-15 mins.
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{m.sender}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {m.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{m.text}</p>
              {m.attachment && (
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{m.attachment}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              className="p-2 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Attach Site Photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Pin Job Site Location"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Type field instruction, blast alert, or @mention team..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
