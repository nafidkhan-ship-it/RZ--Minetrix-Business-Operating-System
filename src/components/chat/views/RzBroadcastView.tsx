import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Users,
  Send,
  CheckCheck,
  Check,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { BroadcastList, DEMO_BROADCAST_LISTS, DEMO_CONTACTS } from '../../../data/rzChatData';

export const RzBroadcastView: React.FC = () => {
  const [lists, setLists] = useState<BroadcastList[]>(DEMO_BROADCAST_LISTS);
  const [selectedList, setSelectedList] = useState<BroadcastList | null>(lists[0]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([
    'USR-001',
    'USR-002',
    'USR-003'
  ]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim() || !selectedList) return;

    const updated = lists.map((l) =>
      l.id === selectedList.id
        ? {
            ...l,
            lastSentMessage: broadcastText,
            lastSentDate: 'Just now',
            deliveredCount: l.recipientsCount,
            readCount: Math.floor(l.recipientsCount * 0.75)
          }
        : l
    );

    setLists(updated);
    setSelectedList({
      ...selectedList,
      lastSentMessage: broadcastText,
      lastSentDate: 'Just now',
      deliveredCount: selectedList.recipientsCount,
      readCount: Math.floor(selectedList.recipientsCount * 0.75)
    });
    setBroadcastText('');
    showToast(`Broadcast message dispatched to ${selectedList.recipientsCount} recipients!`);
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList: BroadcastList = {
      id: `BC-${Date.now()}`,
      name: newListName,
      description: newListDesc || 'Custom broadcast channel for fast dispatches.',
      recipientsCount: selectedRecipients.length,
      recipientIds: selectedRecipients,
      createdAt: new Date().toISOString().split('T')[0],
      deliveredCount: 0,
      readCount: 0
    };

    setLists([newList, ...lists]);
    setSelectedList(newList);
    setIsCreateOpen(false);
    setNewListName('');
    setNewListDesc('');
    showToast(`Created broadcast list "${newListName}"!`);
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
            <h2 className="text-base font-black text-white">Broadcast Lists</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
              One-to-Many Direct
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Send bulk notices, price updates, and pit alerts without recipients seeing each other
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast List</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Lists */}
        <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/40 p-3 space-y-2 overflow-y-auto shrink-0">
          <div className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider px-2 py-1">
            Active Lists ({lists.length})
          </div>

          {lists.map((list) => {
            const isSel = selectedList?.id === list.id;
            return (
              <div
                key={list.id}
                onClick={() => setSelectedList(list)}
                className={`p-3 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                  isSel
                    ? 'bg-purple-500/10 border-purple-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{list.name}</span>
                  <span className="font-mono text-[10px] text-purple-400 font-bold px-1.5 py-0.2 rounded bg-purple-500/10">
                    {list.recipientsCount} rcpts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{list.description}</p>
                {list.lastSentDate && (
                  <div className="text-[10px] text-slate-500 font-mono">
                    Last sent: {list.lastSentDate}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Active Broadcast Composer & Analytics */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
          {selectedList ? (
            <>
              {/* Selected List Overview */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-sm">{selectedList.name}</h3>
                      <p className="text-[11px] text-slate-400">{selectedList.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-xs font-black text-purple-400">
                      {selectedList.recipientsCount} Recipients
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Private Delivery
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Stats Card */}
              {selectedList.lastSentMessage && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-xs">Last Dispatched Notice</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {selectedList.lastSentDate}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 italic text-xs">
                    "{selectedList.lastSentMessage}"
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Delivered</div>
                      <div className="text-base font-black font-mono text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{selectedList.deliveredCount}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Read Receipts</div>
                      <div className="text-base font-black font-mono text-cyan-400 flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{selectedList.readCount}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-slate-500">Delivery Rate</div>
                      <div className="text-base font-black font-mono text-purple-400">
                        100% Studio Rate
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Broadcast Composer */}
              <form
                onSubmit={handleSendBroadcast}
                className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <label className="text-white font-bold text-xs">
                    Compose Broadcast to "{selectedList.name}"
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    All replies arrive as 1-to-1 chats
                  </span>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Type broadcast announcement, daily rates, quarry haul schedules or weather warnings..."
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Will reach {selectedList.recipientsCount} contacts individually
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Broadcast</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Select a broadcast list from the left
            </div>
          )}
        </div>
      </div>

      {/* Create Broadcast List Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-xs">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-sm font-black text-white">Create Broadcast List</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="p-4 space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">List Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasaragod Quarry Landowners"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Purpose of this broadcast list..."
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Select Recipients ({selectedRecipients.length})
                </label>
                <div className="max-h-40 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-2 space-y-1">
                  {DEMO_CONTACTS.map((c) => {
                    const isSel = selectedRecipients.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() =>
                          setSelectedRecipients((prev) =>
                            isSel ? prev.filter((i) => i !== c.id) : [...prev, c.id]
                          )
                        }
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-900 cursor-pointer"
                      >
                        <span className="text-slate-200">{c.name} ({c.category})</span>
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => {}}
                          className="rounded text-purple-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
