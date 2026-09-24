import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Eye,
  Camera,
  Type,
  X,
  Send,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Share2
} from 'lucide-react';
import { UserStatusItem, DEMO_STATUSES } from '../../../data/rzChatData';

export const RzStatusView: React.FC = () => {
  const [statuses, setStatuses] = useState<UserStatusItem[]>(DEMO_STATUSES);
  const [activeStory, setActiveStory] = useState<UserStatusItem | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'text' | 'image'>('text');
  const [statusText, setStatusText] = useState('');
  const [statusColor, setStatusColor] = useState('from-indigo-600 to-purple-600');
  const [replyInput, setReplyInput] = useState('');
  const [privacySetting, setPrivacySetting] = useState<'all' | 'selected' | 'hide'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Story progress timer
  useEffect(() => {
    let timer: any;
    if (activeStory) {
      setStoryProgress(0);
      timer = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            setActiveStory(null);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [activeStory]);

  const handlePublishStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusText.trim()) return;

    const newStatus: UserStatusItem = {
      id: `ST-${Date.now()}`,
      userId: 'SELF',
      userName: 'My Status',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      mediaType: createMode,
      textContent: createMode === 'text' ? statusText : undefined,
      mediaUrl: createMode === 'image' ? 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80' : undefined,
      caption: createMode === 'image' ? statusText : undefined,
      backgroundColor: statusColor,
      createdAt: new Date().toISOString(),
      timeAgo: 'Just now',
      isViewed: false,
      expiresInHours: 24,
      viewersCount: 0,
      viewers: []
    };

    setStatuses([newStatus, ...statuses]);
    setIsCreateOpen(false);
    setStatusText('');
    showToast('Your status update is published! Active for 24 hours.');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeStory) return;
    showToast(`Reply sent to ${activeStory.userName}: "${replyInput}"`);
    setReplyInput('');
    setActiveStory(null);
  };

  const myStatus = statuses.find((s) => s.userId === 'SELF') || statuses[0];
  const recentUpdates = statuses.filter((s) => s.userId !== 'SELF');

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
          <h2 className="text-base font-black text-white">Status Stories</h2>
          <p className="text-[11px] text-slate-400">
            24-hour visual updates across the RZ Minetrix quarry & logistics network
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Privacy dropdown */}
          <select
            value={privacySetting}
            onChange={(e) => {
              setPrivacySetting(e.target.value as any);
              showToast('Status privacy updated');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium text-[11px] focus:outline-none"
          >
            <option value="all">My Contacts (All)</option>
            <option value="selected">Selected Contacts Only</option>
            <option value="hide">Hide from Selected</option>
          </select>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Status</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
        {/* My Status Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
          <div
            onClick={() => setActiveStory(myStatus)}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-emerald-500 to-amber-400 group-hover:scale-105 transition">
                <img
                  src={myStatus.userAvatar}
                  alt="My Status"
                  className="w-full h-full rounded-2xl object-cover border-2 border-slate-900"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
                +
              </div>
            </div>

            <div>
              <div className="font-black text-sm text-white group-hover:text-emerald-400 transition">
                My Status
              </div>
              <div className="text-[11px] text-slate-400">
                {myStatus.timeAgo} &bull; {myStatus.viewersCount} views
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                Expires in {myStatus.expiresInHours} hours
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStory(myStatus)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{myStatus.viewersCount} Views</span>
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
              Recent Network Updates ({recentUpdates.length})
            </span>
            <span className="text-[11px] text-slate-500">Tap to view full story</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentUpdates.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveStory(item)}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-3.5 group"
              >
                <div
                  className={`w-13 h-13 rounded-2xl p-0.5 transition ${
                    item.isViewed
                      ? 'border border-slate-700'
                      : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 group-hover:scale-105'
                  }`}
                >
                  <img
                    src={item.userAvatar}
                    alt={item.userName}
                    className="w-full h-full rounded-2xl object-cover border-2 border-slate-900"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-black text-white text-xs group-hover:text-emerald-300 transition truncate">
                    {item.userName}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {item.textContent || item.caption}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {item.timeAgo} &bull; 24h Story
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm sm:max-w-md h-[600px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            {/* Progress bar */}
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-emerald-400 h-full transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${storyProgress}%` }}
              />
            </div>

            {/* Top user bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.userAvatar}
                  alt={activeStory.userName}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="font-bold text-white text-xs">{activeStory.userName}</div>
                  <div className="text-[10px] text-slate-400">{activeStory.timeAgo}</div>
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 rounded-xl bg-slate-950/60 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Content Area */}
            <div className="flex-1 flex items-center justify-center p-4 my-2 rounded-2xl overflow-hidden relative">
              {activeStory.mediaType === 'image' && activeStory.mediaUrl ? (
                <div className="absolute inset-0">
                  <img
                    src={activeStory.mediaUrl}
                    alt="Status Content"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  {activeStory.caption && (
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-xs text-white text-xs font-medium">
                      {activeStory.caption}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`w-full h-full rounded-2xl bg-gradient-to-br ${
                    activeStory.backgroundColor || 'from-indigo-600 to-purple-600'
                  } p-6 flex items-center justify-center text-center shadow-inner`}
                >
                  <p className="text-lg font-black text-white leading-relaxed">
                    {activeStory.textContent}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom reply bar */}
            <form onSubmit={handleSendReply} className="flex items-center gap-2 z-10 pt-2">
              <input
                type="text"
                placeholder={`Reply to ${activeStory.userName}...`}
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Status Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-sm font-black text-white">Create Status Update</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishStatus} className="p-4 space-y-4">
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateMode('text')}
                  className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                    createMode === 'text'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Type className="w-3.5 h-3.5 inline mr-1" />
                  Text Status
                </button>
                <button
                  type="button"
                  onClick={() => setCreateMode('image')}
                  className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                    createMode === 'image'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 inline mr-1" />
                  Photo Status
                </button>
              </div>

              {createMode === 'text' ? (
                <div className="space-y-3">
                  <div
                    className={`w-full h-40 rounded-2xl bg-gradient-to-br ${statusColor} p-4 flex items-center justify-center shadow-inner`}
                  >
                    <textarea
                      rows={3}
                      placeholder="Type your status update..."
                      value={statusText}
                      onChange={(e) => setStatusText(e.target.value)}
                      className="w-full bg-transparent text-center text-white font-bold text-base placeholder-white/60 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    {[
                      'from-indigo-600 to-purple-600',
                      'from-amber-600 to-yellow-600',
                      'from-emerald-700 to-teal-800',
                      'from-rose-600 to-pink-600'
                    ].map((grad) => (
                      <button
                        type="button"
                        key={grad}
                        onClick={() => setStatusColor(grad)}
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} border-2 ${
                          statusColor === grad ? 'border-white scale-110' : 'border-transparent'
                        } transition`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-40 rounded-2xl overflow-hidden relative border border-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80"
                      alt="Sample"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-xl bg-slate-950/80 text-white text-[11px] font-bold">
                        Quarry Pit Sample Photo Selected
                      </span>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Add a photo caption..."
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Expires in 24 hours
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
