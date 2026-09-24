import React, { useState } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  Phone,
  Video,
  Plus,
  ShieldCheck,
  Building2,
  MapPin,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { ChatContact, DEMO_CONTACTS } from '../../../data/rzChatData';

interface RzContactsViewProps {
  onStartChat: (contact: ChatContact) => void;
  onViewProfile: (contact: ChatContact) => void;
}

export const RzContactsView: React.FC<RzContactsViewProps> = ({
  onStartChat,
  onViewProfile
}) => {
  const [contacts] = useState<ChatContact[]>(DEMO_CONTACTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const CATEGORIES = [
    'ALL',
    'Customer',
    'Supplier',
    'Driver',
    'Staff',
    'Land Owner',
    'Contractor'
  ];

  const filtered = contacts.filter((c) => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white">Contacts Directory</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {contacts.length} Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Quarry partners, transport operators, land owners, civil contractors & staff
          </p>
        </div>

        <button
          onClick={() => alert('New Contact: Input phone number or scan RZ QR Card')}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-950/40">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search contacts by name, role, firm, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer border ${
                  isSel
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'All Contacts' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/30 transition flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                    />
                    {c.onlineStatus === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-1.5 group-hover:text-emerald-400 transition">
                      <span>{c.name}</span>
                      {c.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">{c.role}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{c.company}</div>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {c.category}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                "{c.about}"
              </p>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2 font-mono">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{c.location}</span>
                <span>&bull;</span>
                <span>{c.phone}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => onViewProfile(c)}
                className="text-[11px] text-slate-400 hover:text-white font-bold cursor-pointer transition"
              >
                View Profile
              </button>

              <button
                onClick={() => onStartChat(c)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-sm shadow-emerald-500/20 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
