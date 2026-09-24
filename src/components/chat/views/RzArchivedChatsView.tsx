import React from 'react';
import {
  Archive,
  ArchiveRestore,
  MessageSquare,
  Search,
  CheckCircle2
} from 'lucide-react';
import { ChatConversation } from '../../../data/rzChatData';

interface RzArchivedChatsViewProps {
  archivedConversations: ChatConversation[];
  onUnarchive: (convId: string) => void;
  onOpenConversation: (convId: string) => void;
}

export const RzArchivedChatsView: React.FC<RzArchivedChatsViewProps> = ({
  archivedConversations,
  onUnarchive,
  onOpenConversation
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white">Archived Conversations</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold">
              {archivedConversations.length} Archived
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Completed contracts, past quarry leases, and resolved supply negotiations
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {archivedConversations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center">
              <Archive className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No Archived Conversations</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Chats you archive will remain safely stored here and will not appear in your main active chat list.
            </p>
          </div>
        ) : (
          archivedConversations.map((conv) => (
            <div
              key={conv.id}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
            >
              <div
                onClick={() => onOpenConversation(conv.id)}
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-700 opacity-80 group-hover:opacity-100 transition"
                />
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-emerald-400 transition">
                    {conv.name}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {conv.lastMessage}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {conv.lastMessageTimeFormatted}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onUnarchive(conv.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Unarchive"
              >
                <ArchiveRestore className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unarchive</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
