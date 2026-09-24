import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { ChatMessage, DEMO_MESSAGES_BY_CONV, DEMO_CONVERSATIONS } from '../../../data/rzChatData';

interface RzStarredMessagesViewProps {
  onOpenConversation: (convId: string) => void;
}

export const RzStarredMessagesView: React.FC<RzStarredMessagesViewProps> = ({
  onOpenConversation
}) => {
  const [starredMessages, setStarredMessages] = useState<
    { message: ChatMessage; conversationName: string }[]
  >([
    {
      message: DEMO_MESSAGES_BY_CONV['CONV-001'][3],
      conversationName: 'Shri V. Prabhakar Pai'
    },
    {
      message: DEMO_MESSAGES_BY_CONV['CONV-001'][0],
      conversationName: 'Shri V. Prabhakar Pai'
    },
    {
      message: DEMO_MESSAGES_BY_CONV['CONV-002'][1],
      conversationName: 'Hilltop Pit 01 & Crusher Operations'
    }
  ]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const removeStarred = (id: string) => {
    setStarredMessages((prev) => prev.filter((item) => item.message.id !== id));
    showToast('Removed from starred messages');
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs overflow-hidden">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white">Starred & Saved Messages</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              {starredMessages.length} Pinned
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Crucial dispatch directives, rate agreements and coordinate confirmations
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {starredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No Starred Messages</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Hover over any chat message and click the Star icon to bookmark it here for quick reference.
            </p>
          </div>
        ) : (
          starredMessages.map(({ message, conversationName }) => (
            <div
              key={message.id}
              className="p-4 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-bold text-white text-xs">{conversationName}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {message.timeFormatted}
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 text-slate-200 leading-relaxed text-xs">
                {message.text}
                {message.fileName && (
                  <div className="mt-1 font-mono text-[11px] text-cyan-400">
                    Attachment: {message.fileName} ({message.fileSize})
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-500">
                  Sender: <strong className="text-slate-400">{message.senderName}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeStarred(message.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                    title="Remove from Starred"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenConversation(message.conversationId)}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Jump to Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
