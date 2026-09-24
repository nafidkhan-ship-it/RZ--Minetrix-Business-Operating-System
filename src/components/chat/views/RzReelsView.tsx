import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  UserCheck,
  UserPlus,
  Send,
  X,
  Sparkles,
  Music,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RzReelItem, DEMO_REELS } from '../../../data/rzChatData';

export const RzReelsView: React.FC = () => {
  const [reels, setReels] = useState<RzReelItem[]>(DEMO_REELS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const currentReel = reels[currentIndex] || reels[0];

  const handleLike = () => {
    const updated = reels.map((r, i) =>
      i === currentIndex
        ? {
            ...r,
            isLiked: !r.isLiked,
            likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1
          }
        : r
    );
    setReels(updated);
  };

  const handleSave = () => {
    const updated = reels.map((r, i) =>
      i === currentIndex
        ? {
            ...r,
            isSaved: !r.isSaved,
            savesCount: r.isSaved ? r.savesCount - 1 : r.savesCount + 1
          }
        : r
    );
    setReels(updated);
    showToast(currentReel.isSaved ? 'Removed from saved reels' : 'Saved to your profile bookmarks');
  };

  const handleFollow = () => {
    const updated = reels.map((r, i) =>
      i === currentIndex
        ? {
            ...r,
            isFollowing: !r.isFollowing
          }
        : r
    );
    setReels(updated);
    showToast(currentReel.isFollowing ? `Unfollowed ${currentReel.creatorHandle}` : `Now following ${currentReel.creatorHandle}`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: `C-${Date.now()}`,
      userName: 'You (Operations)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: commentInput,
      timeAgo: 'Just now',
      likes: 0
    };

    const updated = reels.map((r, i) =>
      i === currentIndex
        ? {
            ...r,
            commentsCount: r.commentsCount + 1,
            comments: [newComment, ...r.comments]
          }
        : r
    );

    setReels(updated);
    setCommentInput('');
  };

  const nextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-xs overflow-hidden relative">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white font-black text-xs shadow-lg">
            RZ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-sm">RZ® Reels</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                Short Video Network
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Field footage, machine walkthroughs, drone surveys & stone quarrying tricks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">
            {currentIndex + 1} / {reels.length}
          </span>
          <button
            onClick={prevReel}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={nextReel}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden">
        {/* Video Card Container */}
        <div className="relative w-full max-w-[400px] h-[580px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Background Video simulation */}
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 cursor-pointer"
          >
            <img
              src={currentReel.thumbnailUrl}
              alt="Reel content"
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-950/70 border border-slate-700 flex items-center justify-center text-white backdrop-blur-sm">
                  <Play className="w-8 h-8 ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Top Audio & Sound overlay */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-xs border border-slate-800 text-white font-mono text-[10px]">
              <Music className="w-3.5 h-3.5 text-pink-400 animate-spin" />
              <span className="truncate max-w-[180px]">{currentReel.audioTrack}</span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-slate-950/70 border border-slate-800 text-white cursor-pointer hover:bg-slate-900"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Right Floating Actions (Like, Comment, Share, Save) */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-3">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-lg ${
                  currentReel.isLiked
                    ? 'bg-rose-500 text-white scale-110'
                    : 'bg-slate-950/70 backdrop-blur-xs border border-slate-800 text-white hover:bg-rose-500/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${currentReel.isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-white font-mono drop-shadow">
                {currentReel.likesCount}
              </span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setCommentDrawerOpen(true)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-slate-950/70 backdrop-blur-xs border border-slate-800 text-white flex items-center justify-center hover:bg-slate-800 shadow-lg">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white font-mono drop-shadow">
                {currentReel.commentsCount}
              </span>
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-lg ${
                  currentReel.isSaved
                    ? 'bg-amber-500 text-slate-950 scale-110'
                    : 'bg-slate-950/70 backdrop-blur-xs border border-slate-800 text-white hover:bg-amber-500/20'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${currentReel.isSaved ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-white font-mono drop-shadow">
                {currentReel.savesCount}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={() => showToast('Reel link copied to clipboard!')}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-slate-950/70 backdrop-blur-xs border border-slate-800 text-white flex items-center justify-center hover:bg-slate-800 shadow-lg">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white font-mono drop-shadow">
                {currentReel.sharesCount}
              </span>
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="relative z-10 p-4 space-y-2 max-w-[85%]">
            {/* Creator Bar */}
            <div className="flex items-center gap-2.5">
              <img
                src={currentReel.creatorAvatar}
                alt={currentReel.creatorName}
                className="w-9 h-9 rounded-xl object-cover border border-emerald-400"
              />
              <div className="min-w-0">
                <div className="font-bold text-white text-xs truncate">
                  {currentReel.creatorName}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  {currentReel.creatorHandle}
                </div>
              </div>

              <button
                onClick={handleFollow}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer shrink-0 ${
                  currentReel.isFollowing
                    ? 'bg-slate-800/90 text-slate-300 border border-slate-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow'
                }`}
              >
                {currentReel.isFollowing ? 'Following' : '+ Follow'}
              </button>
            </div>

            {/* Caption & Tags */}
            <p className="text-slate-200 text-xs line-clamp-2 leading-relaxed drop-shadow">
              {currentReel.caption}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {currentReel.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-pink-300 font-medium hover:underline cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Drawer */}
      {commentDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="font-black text-white text-sm">
                Comments ({currentReel.commentsCount})
              </h3>
              <button
                onClick={() => setCommentDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentReel.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={c.userAvatar}
                    alt={c.userName}
                    className="w-7 h-7 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                  <div className="flex-1 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
                    <div className="font-bold text-white text-[11px]">{c.userName}</div>
                    <div className="text-slate-300 text-xs mt-0.5">{c.text}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      {c.timeAgo}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddComment}
              className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Add a comment to this reel..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
