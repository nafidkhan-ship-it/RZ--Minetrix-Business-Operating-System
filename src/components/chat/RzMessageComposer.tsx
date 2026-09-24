import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  X,
  FileText,
  Image,
  Building2,
  Trash2,
  Square
} from 'lucide-react';
import { BusinessContextReference, ChatMessage } from '../../data/rzChatData';

interface RzMessageComposerProps {
  onSendMessage: (payload: {
    text: string;
    messageType?: 'text' | 'image' | 'document' | 'voice' | 'business_record';
    businessContext?: BusinessContextReference;
    replyTo?: { id: string; senderName: string; text: string };
    voiceDurationSec?: number;
    fileName?: string;
    fileSize?: string;
  }) => void;
  replyToMessage?: ChatMessage | null;
  onCancelReply: () => void;
  onOpenAttachBusiness: () => void;
}

export const RzMessageComposer: React.FC<RzMessageComposerProps> = ({
  onSendMessage,
  replyToMessage,
  onCancelReply,
  onOpenAttachBusiness
}) => {
  const [text, setText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick emojis
  const QUICK_EMOJIS = ['👍', '🚜', '🚛', '⛏️', '✅', '💰', '🤝', '📐', '⚠️', '🔥'];

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = () => {
    if (!text.trim()) return;

    onSendMessage({
      text: text.trim(),
      messageType: 'text',
      replyTo: replyToMessage
        ? {
            id: replyToMessage.id,
            senderName: replyToMessage.senderName,
            text: replyToMessage.text
          }
        : undefined
    });

    setText('');
    setShowAttachMenu(false);
    setShowEmojiBar(false);
    if (replyToMessage) onCancelReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFinishVoiceRecord = () => {
    setIsRecording(false);
    const duration = recordSeconds > 0 ? recordSeconds : 12;
    onSendMessage({
      text: `Voice message (${duration}s)`,
      messageType: 'voice',
      voiceDurationSec: duration
    });
  };

  const handleCancelVoiceRecord = () => {
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const formatRecordTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative border-t border-slate-800 bg-slate-950/90 backdrop-blur-sm p-3">
      {/* Reply Preview Bar */}
      {replyToMessage && (
        <div className="mb-2 p-2.5 rounded-2xl bg-slate-900 border-l-4 border-l-emerald-500 border border-slate-800 flex items-center justify-between animate-fadeIn text-xs">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] text-emerald-400 font-bold block">
              Replying to {replyToMessage.senderName}
            </span>
            <p className="text-slate-300 italic line-clamp-1 text-[11px]">
              "{replyToMessage.text || 'Attached Media'}"
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Emoji Bar */}
      {showEmojiBar && (
        <div className="mb-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto animate-fadeIn">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setText((prev) => prev + emoji);
                inputRef.current?.focus();
              }}
              className="text-lg hover:scale-125 transition p-1 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Popover */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-4 z-30 bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl space-y-1.5 w-60 animate-fadeIn text-xs">
          <div className="text-[10px] font-mono text-slate-500 px-2 py-1 uppercase font-bold">
            Attach Ecosystem Record
          </div>

          <button
            onClick={() => {
              setShowAttachMenu(false);
              onOpenAttachBusiness();
            }}
            className="w-full p-2 rounded-2xl hover:bg-slate-800 flex items-center gap-2.5 text-left text-slate-200 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Business Record</div>
              <div className="text-[10px] text-slate-400">Order, Parcel, Pit, Fleet</div>
            </div>
          </button>

          <button
            onClick={() => {
              setShowAttachMenu(false);
              onSendMessage({
                text: 'Dispatched Quarry Weighbridge Slip #W-8812 (Verified Tare: 12.4 MT)',
                messageType: 'document',
                fileName: 'Weighbridge_Slip_W8812.pdf',
                fileSize: '650 KB'
              });
            }}
            className="w-full p-2 rounded-2xl hover:bg-slate-800 flex items-center gap-2.5 text-left text-slate-200 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Document / PDF</div>
              <div className="text-[10px] text-slate-400">Bills, CADs, Test Reports</div>
            </div>
          </button>

          <button
            onClick={() => {
              setShowAttachMenu(false);
              onSendMessage({
                text: 'Excavator bench inspection photo from south boundary pit',
                messageType: 'image'
              });
            }}
            className="w-full p-2 rounded-2xl hover:bg-slate-800 flex items-center gap-2.5 text-left text-slate-200 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Photos & Media</div>
              <div className="text-[10px] text-slate-400">Field cameras, drone clips</div>
            </div>
          </button>
        </div>
      )}

      {/* Voice Recording Bar OR Standard Composer */}
      {isRecording ? (
        <div className="flex items-center justify-between gap-3 p-2 bg-slate-900 border border-red-500/40 rounded-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono font-bold text-white text-sm">
              Recording Voice Note {formatRecordTime(recordSeconds)}
            </span>
            <div className="hidden sm:flex items-center gap-1 text-slate-500 font-mono text-[10px]">
              <span>||||||||||||||||||||||</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelVoiceRecord}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-red-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            <button
              onClick={handleFinishVoiceRecord}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Voice</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Attach Button */}
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`p-2.5 rounded-2xl transition cursor-pointer ${
              showAttachMenu
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Attach documents, records or media"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiBar(!showEmojiBar)}
            className={`p-2.5 rounded-2xl transition cursor-pointer ${
              showEmojiBar
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Insert quick emojis"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Main Text Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message, coordinates, dispatch status... (Enter to send)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition"
          />

          {/* Voice Record Mic OR Send Button */}
          {text.trim() ? (
            <button
              onClick={handleSend}
              className="p-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer shadow-lg shadow-emerald-500/20"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(true)}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
              title="Record voice message"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
