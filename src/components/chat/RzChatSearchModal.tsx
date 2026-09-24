import React, { useState } from 'react';
import {
  Search,
  X,
  MessageSquare,
  Users,
  FileText,
  Image,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import {
  DEMO_CONVERSATIONS,
  DEMO_CONTACTS,
  DEMO_MEDIA_ITEMS,
  DEMO_FILES_ITEMS
} from '../../data/rzChatData';

interface RzChatSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (convId: string) => void;
}

export const RzChatSearchModal: React.FC<RzChatSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectConversation
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<
    'ALL' | 'CHATS' | 'PEOPLE' | 'FILES' | 'MEDIA' | 'BUSINESS'
  >('ALL');

  const matchedConversations = DEMO_CONVERSATIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(query.toLowerCase()) ||
      (c.businessContext &&
        c.businessContext.title.toLowerCase().includes(query.toLowerCase()))
  );

  const matchedContacts = DEMO_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.company.toLowerCase().includes(query.toLowerCase()) ||
      c.role.toLowerCase().includes(query.toLowerCase())
  );

  const matchedFiles = DEMO_FILES_ITEMS.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const matchedMedia = DEMO_MEDIA_ITEMS.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] text-xs">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            placeholder="Search all conversations, contacts, files, pit records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-slate-500 font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Results' },
            { id: 'CHATS', label: 'Conversations' },
            { id: 'PEOPLE', label: 'People / Contacts' },
            { id: 'BUSINESS', label: 'Ecosystem Records' },
            { id: 'FILES', label: 'Documents & Files' },
            { id: 'MEDIA', label: 'Photos & Media' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer border ${
                filterType === tab.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Conversations Section */}
          {(filterType === 'ALL' || filterType === 'CHATS') && matchedConversations.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold px-1">
                Conversations ({matchedConversations.length})
              </span>
              {matchedConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{conv.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {conv.lastMessage}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              ))}
            </div>
          )}

          {/* Contacts Section */}
          {(filterType === 'ALL' || filterType === 'PEOPLE') && matchedContacts.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold px-1">
                Contacts ({matchedContacts.length})
              </span>
              {matchedContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    const foundConv = DEMO_CONVERSATIONS.find((c) => c.name === contact.name);
                    if (foundConv) onSelectConversation(foundConv.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>{contact.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                          {contact.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {contact.role} &bull; {contact.company}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              ))}
            </div>
          )}

          {/* Files Section */}
          {(filterType === 'ALL' || filterType === 'FILES') && matchedFiles.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold px-1">
                Files & Documents ({matchedFiles.length})
              </span>
              {matchedFiles.map((f) => (
                <div
                  key={f.id}
                  className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-rose-400" />
                    <div>
                      <div className="font-bold text-white text-xs">{f.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {f.size} &bull; {f.sender} &bull; {f.businessTag}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">{f.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
