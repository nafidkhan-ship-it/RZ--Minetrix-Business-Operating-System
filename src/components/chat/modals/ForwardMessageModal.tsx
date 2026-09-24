import React, { useState } from 'react';
import {
  Share2,
  X,
  Search,
  CheckCircle2,
  Users,
  Building2,
  Send
} from 'lucide-react';
import {
  ChatMessage,
  DEMO_CONVERSATIONS,
  DEMO_CONTACTS
} from '../../../data/rzChatData';

interface ForwardMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: ChatMessage | null;
  onForwardComplete: (targetIds: string[]) => void;
}

export const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  isOpen,
  onClose,
  message,
  onForwardComplete
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredConversations = DEMO_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (selectedIds.length === 0) return;
    setDone(true);
    setTimeout(() => {
      onForwardComplete(selectedIds);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Forward Message</h3>
              <p className="text-[11px] text-slate-400">
                Share to contacts, groups, or business channels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message preview snippet */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">
            Forwarding Content:
          </span>
          <p className="text-slate-300 italic line-clamp-2">
            "{message?.text || 'Attachment / Media file'}"
          </p>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search contacts, teams, or groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Target List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-800/40">
          {done ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Message Forwarded!</h4>
              <p className="text-xs text-slate-400">
                Sent to {selectedIds.length} destination{selectedIds.length > 1 ? 's' : ''}.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedIds.includes(conv.id);
              return (
                <div
                  key={conv.id}
                  onClick={() => toggleSelect(conv.id)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/10 border border-purple-500/30'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{conv.name}</span>
                        {conv.isGroup && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-purple-300 font-mono">
                            {conv.groupCategory}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {conv.businessContext?.title || (conv.isGroup ? 'Group Conversation' : 'Direct Chat')}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-purple-500 border-purple-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {selectedIds.length} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={selectedIds.length === 0}
                onClick={handleSend}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  selectedIds.length > 0
                    ? 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-md shadow-purple-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Forward Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
