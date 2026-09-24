import React, { useState, useEffect } from 'react';
import {
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { ChatConversation } from '../../../data/rzChatData';

interface RzCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: ChatConversation;
  callType: 'audio' | 'video';
}

export const RzCallModal: React.FC<RzCallModalProps> = ({
  isOpen,
  onClose,
  conversation,
  callType
}) => {
  if (!isOpen) return null;

  const [callState, setCallState] = useState<'calling' | 'connected'>('calling');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCallState('connected');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md h-[560px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6">
        {/* Top bar info */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-[10px] text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>RZ Encrypted {callType === 'video' ? 'Video' : 'Voice'} Call</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">STUDIO PREVIEW</span>
        </div>

        {/* Video simulation or Center Avatar */}
        {callType === 'video' && !isVideoOff ? (
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&auto=format&fit=crop&q=80"
              alt="Remote Video"
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
            {/* Self video thumbnail */}
            <div className="absolute top-16 right-5 w-24 h-32 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Self"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : null}

        {/* Center Caller Info */}
        <div className="relative z-10 text-center my-auto space-y-4">
          <div className="relative inline-block">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className={`w-28 h-28 rounded-3xl mx-auto object-cover border-2 border-emerald-500/50 shadow-2xl ${
                callState === 'calling' ? 'animate-pulse' : ''
              }`}
            />
            {callState === 'connected' && (
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full" />
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl font-black text-white">{conversation.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {conversation.businessContext?.title || (conversation.isGroup ? 'Group Call' : '+91 94471 20045')}
            </p>
            <p className="text-sm font-mono font-bold text-emerald-400 mt-2">
              {callState === 'calling' ? 'Calling...' : formatDuration(seconds)}
            </p>
          </div>
        </div>

        {/* Bottom Call Controls */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-center gap-3">
            {/* Mute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition cursor-pointer border ${
                isMuted
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video toggle */}
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition cursor-pointer border ${
                isVideoOff
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Speaker */}
            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition cursor-pointer border ${
                isSpeaker
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* End Call */}
            <button
              onClick={onClose}
              className="w-14 h-12 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition cursor-pointer shadow-lg shadow-red-600/30 font-bold"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-500">
            Click End Call to return to RZ® Chat conversation
          </p>
        </div>
      </div>
    </div>
  );
};
