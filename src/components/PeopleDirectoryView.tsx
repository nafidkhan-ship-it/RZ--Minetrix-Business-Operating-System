import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  UserCheck,
  MessageSquare,
  ShieldAlert,
  User,
  Building2,
  BadgeCheck,
  ShieldCheck,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ChatUser } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface PeopleDirectoryViewProps {
  viewerUserId: string;
  onViewProfile: (user: ChatUser) => void;
  onStartChat: (userId: string) => void;
  onBlockReport: (user: ChatUser) => void;
  onToast: (msg: string) => void;
}

export const PeopleDirectoryView: React.FC<PeopleDirectoryViewProps> = ({
  viewerUserId,
  onViewProfile,
  onStartChat,
  onBlockReport,
  onToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'contacts'>('all');
  const [page, setPage] = useState(1);

  // Fetch paginated public users or contacts
  const paginatedResult = rzChatService.searchPublicUsers(searchQuery, page, 12, viewerUserId);
  const contactsList = rzChatService.getContacts(viewerUserId);

  const displayedUsers = activeSubTab === 'contacts'
    ? contactsList.filter(u =>
        !searchQuery ||
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : paginatedResult.users;

  const totalPages = activeSubTab === 'contacts'
    ? Math.ceil(displayedUsers.length / 12) || 1
    : paginatedResult.totalPages;

  const handleToggleContact = (targetUser: ChatUser, e: React.MouseEvent) => {
    e.stopPropagation();
    const isContact = rzChatService.isContact(viewerUserId, targetUser.id);
    if (isContact) {
      rzChatService.removeContact(viewerUserId, targetUser.id);
      onToast(`Removed @${targetUser.username} from contacts.`);
    } else {
      rzChatService.addContact(viewerUserId, targetUser.id);
      onToast(`Saved @${targetUser.username} to contacts.`);
    }
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'business_user':
        return (
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Business
          </span>
        );
      case 'erp_org_user':
        return (
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" /> ERP Staff
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <User className="w-3 h-3" /> Public
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* SEARCH & SUB-TABS HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl font-mono flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* SUB TABS */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setActiveSubTab('all');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Discover People ({paginatedResult.total})
          </button>

          <button
            onClick={() => {
              setActiveSubTab('contacts');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'contacts'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> My Contacts ({contactsList.length})
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by username @handle, display name, or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* USER CARDS GRID */}
      {displayedUsers.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3 font-mono">
          <User className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">No users found matching your search.</p>
          <p className="text-xs text-slate-500">Try searching for handle `@nafid_khan` or location `Lusaka`.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedUsers.map(u => {
            const isContact = rzChatService.isContact(viewerUserId, u.id);
            const pub = rzChatService.getPublicUserProfile(viewerUserId, u.id);

            return (
              <div
                key={u.id}
                onClick={() => onViewProfile(u)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-3xl shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                {/* TOP HEADER */}
                <div>
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="relative">
                      {pub.canSeePhoto && u.profilePhoto ? (
                        <img
                          src={u.profilePhoto}
                          alt={u.displayName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-800 group-hover:border-amber-500/50 transition"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-800 flex items-center justify-center text-slate-500">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                          u.accountStatus === 'active' ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                    </div>

                    {getCategoryBadge(u.accountCategory)}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition font-mono truncate">
                    {u.displayName}
                  </h3>
                  <p className="text-amber-400 font-mono font-bold text-xs">@{u.username}</p>

                  <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed font-mono">
                    {pub.canSeeAbout ? u.about || 'No public bio provided.' : '🔒 Privacy Restricted'}
                  </p>

                  {u.location && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                      <span className="truncate">{u.location}</span>
                    </div>
                  )}
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 font-mono" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onStartChat(u.id)}
                    className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>

                  <button
                    onClick={e => handleToggleContact(u, e)}
                    className={`p-2 rounded-xl transition cursor-pointer border ${
                      isContact
                        ? 'bg-slate-800 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                    title={isContact ? 'Saved in Contacts' : 'Add to Contacts'}
                  >
                    {isContact ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onBlockReport(u)}
                    className="p-2 bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-xl transition cursor-pointer"
                    title="Block or Report"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs">
          <span className="text-slate-400">
            Page <strong className="text-amber-400">{page}</strong> of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
