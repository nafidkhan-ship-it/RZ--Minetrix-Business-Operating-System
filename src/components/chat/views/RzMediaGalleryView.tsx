import React, { useState } from 'react';
import {
  Image,
  Video,
  FileText,
  Link,
  Search,
  Download,
  Share2,
  X,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { DEMO_MEDIA_ITEMS } from '../../../data/rzChatData';

export const RzMediaGalleryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [search, setSearch] = useState('');
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const filtered = DEMO_MEDIA_ITEMS.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.sender.toLowerCase().includes(search.toLowerCase()) ||
      item.conversation.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white">Media, Photos & Documents</h2>
          <p className="text-[11px] text-slate-400">
            All visual attachments, field photos, drone flyovers & laboratory reports
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {(['all', 'image', 'video', 'document'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold capitalize transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Media' : `${tab}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search media by title, chat sender or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setPreviewItem(item)}
            className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square cursor-pointer hover:border-emerald-500/50 transition shadow-lg flex flex-col justify-end"
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
              />
            ) : item.type === 'video' ? (
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                <Video className="w-12 h-12 text-purple-400 group-hover:scale-110 transition" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-950 p-4 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-amber-400 mb-2" />
                <span className="font-bold text-white text-[11px] line-clamp-2">{item.title}</span>
              </div>
            )}

            {/* Overlay Info */}
            <div className="relative z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 pt-6">
              <div className="font-bold text-white text-xs truncate">{item.title}</div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                <span>{item.sender}</span>
                <span className="font-mono text-emerald-400">{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="font-black text-white text-sm">{previewItem.title}</h3>
                <div className="text-[10px] text-slate-400">
                  Sent by {previewItem.sender} in "{previewItem.conversation}" &bull; {previewItem.size}
                </div>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-slate-950 max-h-[60vh] overflow-hidden">
              {previewItem.type === 'image' ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.title}
                  className="max-h-[50vh] max-w-full rounded-2xl object-contain"
                />
              ) : (
                <div className="p-12 text-center space-y-3">
                  <FileText className="w-16 h-16 text-emerald-400 mx-auto" />
                  <p className="text-white font-bold text-sm">{previewItem.title}</p>
                  <p className="text-slate-400 text-xs">Studio Preview Document</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Date: {previewItem.date}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Downloading ${previewItem.title}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => {
                    alert('Forward media to another chat');
                    setPreviewItem(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
