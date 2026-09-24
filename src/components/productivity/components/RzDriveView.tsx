import React, { useState } from 'react';
import {
  FolderSync,
  Folder,
  FolderPlus,
  Upload,
  Plus,
  Search,
  Filter,
  Star,
  Trash2,
  Share2,
  Download,
  MoreVertical,
  FileSpreadsheet,
  FileText,
  FormInput,
  Presentation,
  FileType,
  Image,
  Video,
  FileQuestion,
  Building2,
  Mountain,
  Cpu,
  Truck,
  FileSignature,
  Receipt,
  BarChart3,
  Users,
  Landmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Move
} from 'lucide-react';
import { ProductivityFile, ProductivityToolId, FileType as FileKind } from '../types';
import { DRIVE_FOLDERS, MOCK_PRODUCTIVITY_FILES } from '../mockData';

interface RzDriveViewProps {
  files?: ProductivityFile[];
  onOpenFile: (file: ProductivityFile) => void;
  onOpenShareModal: (file: ProductivityFile) => void;
  onOpenVersionModal: (file: ProductivityFile) => void;
  onToast?: (msg: string) => void;
}

export const RzDriveView: React.FC<RzDriveViewProps> = ({
  files = MOCK_PRODUCTIVITY_FILES,
  onOpenFile,
  onOpenShareModal,
  onOpenVersionModal,
  onToast
}) => {
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [fileList, setFileList] = useState<ProductivityFile[]>(files);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const getFolderIcon = (name: string) => {
    switch (name) {
      case 'Quarry': return Mountain;
      case 'Crusher': return Cpu;
      case 'Vehicle': return Truck;
      case 'Contracts': return FileSignature;
      case 'Invoices': return Receipt;
      case 'Reports': return BarChart3;
      case 'HR': return Users;
      case 'Finance': return Landmark;
      default: return Folder;
    }
  };

  const getFileIcon = (type: FileKind) => {
    switch (type) {
      case 'sheet': return FileSpreadsheet;
      case 'word': return FileText;
      case 'form': return FormInput;
      case 'slide': return Presentation;
      case 'pdf': return FileType;
      case 'image': return Image;
      case 'video': return Video;
      default: return FileQuestion;
    }
  };

  const getFileColor = (type: FileKind) => {
    switch (type) {
      case 'sheet': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'word': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'form': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'slide': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'pdf': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFileList(fileList.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
    onToast?.('Updated starred status');
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFileList(fileList.filter(f => f.id !== id));
    onToast?.('Moved file to Trash');
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onToast?.(`Created folder: ${newFolderName}`);
    setNewFolderName('');
    setIsNewFolderOpen(false);
  };

  const filteredFiles = fileList.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = activeFolderId === 'all' || f.category.toLowerCase() === activeFolderId.toLowerCase();
    const matchesType = selectedFileType === 'all' || f.type.toLowerCase() === selectedFileType.toLowerCase();
    return matchesSearch && matchesFolder && matchesType;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <FolderSync className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">RZ® Drive — Cloud DMS Vault</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                AES-256 Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure enterprise document repository powering all 10 Platforms and Shared ERP Core.
            </p>
          </div>
        </div>

        {/* Global Drive Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setIsNewFolderOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Folder</span>
          </button>
          <button
            onClick={() => onToast?.('Select file dialog opened for upload')}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Main Drive Layout: Sidebar & Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Tree */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
            <span className="text-[10px] text-slate-500 uppercase font-bold px-2 block mb-1">
              Drive Locations
            </span>
            {[
              { id: 'all', label: 'My Drive (All Files)', icon: FolderSync, count: fileList.length },
              { id: 'shared', label: 'Shared With Me', icon: Share2, count: 4 },
              { id: 'recent', label: 'Recent Documents', icon: Clock, count: 6 },
              { id: 'starred', label: 'Starred Files', icon: Star, count: 3 },
              { id: 'trash', label: 'Trash', icon: Trash2, count: 0 }
            ].map((loc) => {
              const Icon = loc.icon;
              const isActive = activeFolderId === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setActiveFolderId(loc.id);
                    onToast?.(`Navigated to ${loc.label}`);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                    isActive ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{loc.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{loc.count}</span>
                </button>
              );
            })}
          </div>

          {/* 8 Business Domain Folders */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
            <span className="text-[10px] text-slate-500 uppercase font-bold px-2 block mb-1">
              8 Business Folders
            </span>
            {DRIVE_FOLDERS.map((fld) => {
              const Icon = getFolderIcon(fld.name);
              const isActive = activeFolderId.toLowerCase() === fld.name.toLowerCase();
              return (
                <button
                  key={fld.id}
                  onClick={() => {
                    setActiveFolderId(fld.name);
                    onToast?.(`Opened ${fld.name} Folder`);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition cursor-pointer ${
                    isActive ? 'bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${fld.color}`} />
                    <span>{fld.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{fld.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Explorer Canvas */}
        <div className="lg:col-span-9 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 8 business folders..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
              >
                <option value="all">All 8 File Types</option>
                <option value="sheet">Sheets (.rzs)</option>
                <option value="word">Documents (.rzw)</option>
                <option value="form">Forms (.rzf)</option>
                <option value="slide">Slides (.rzp)</option>
                <option value="pdf">PDF Documents</option>
                <option value="image">Images &amp; Scans</option>
                <option value="video">Site Videos</option>
                <option value="other">Other Assets</option>
              </select>

              <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-bold ${
                    viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-bold ${
                    viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>

          {/* Folder Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DRIVE_FOLDERS.slice(0, 4).map((df) => {
              const Icon = getFolderIcon(df.name);
              return (
                <div
                  key={df.id}
                  onClick={() => setActiveFolderId(df.name)}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition">
                    <Icon className={`w-4 h-4 ${df.color}`} />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-white text-xs group-hover:text-cyan-400 truncate">
                      {df.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{df.count} files &bull; {df.size}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* File Explorer Table */}
          {viewMode === 'table' ? (
            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="p-3 font-bold">NAME &bull; TYPE</th>
                    <th className="p-3 font-bold">OWNER</th>
                    <th className="p-3 font-bold">LAST MODIFIED</th>
                    <th className="p-3 font-bold">SIZE</th>
                    <th className="p-3 font-bold">SHARING</th>
                    <th className="p-3 text-right font-bold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredFiles.map((f) => {
                    const Icon = getFileIcon(f.type);
                    const colorCls = getFileColor(f.type);
                    return (
                      <tr key={f.id} className="hover:bg-slate-900/60 transition group">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={(e) => handleToggleStar(f.id, e)}
                              className="text-slate-600 hover:text-amber-400 cursor-pointer"
                            >
                              <Star className={`w-3.5 h-3.5 ${f.starred ? 'text-amber-400 fill-amber-400' : ''}`} />
                            </button>
                            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${colorCls}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate max-w-xs font-sans">
                              <button
                                onClick={() => onOpenFile(f)}
                                className="font-bold text-white hover:text-cyan-400 transition truncate block text-left cursor-pointer"
                              >
                                {f.name}
                              </button>
                              <span className="text-[10px] text-slate-500 font-mono block">
                                {f.location}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-slate-300">
                          <span className="truncate block max-w-xs">{f.owner}</span>
                        </td>

                        <td className="p-3 text-slate-500 font-mono">
                          {f.lastModified}
                        </td>

                        <td className="p-3 text-slate-400 font-mono">
                          {f.size}
                        </td>

                        <td className="p-3">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold uppercase">
                            {f.sharedStatus}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenShareModal(f)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                              title="Share"
                            >
                              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                            </button>
                            <button
                              onClick={() => onToast?.(`Downloaded ${f.name}`)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteFile(f.id, e)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFiles.map((f) => {
                const Icon = getFileIcon(f.type);
                const colorCls = getFileColor(f.type);
                return (
                  <div
                    key={f.id}
                    onClick={() => onOpenFile(f)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${colorCls}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <button
                        onClick={(e) => handleToggleStar(f.id, e)}
                        className="text-slate-600 hover:text-amber-400"
                      >
                        <Star className={`w-4 h-4 ${f.starred ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs truncate group-hover:text-cyan-400 transition">
                        {f.name}
                      </h4>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                        <span>{f.size}</span>
                        <span>&bull;</span>
                        <span>{f.lastModified}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{f.category}</span>
                      <span className="uppercase">{f.sharedStatus}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal Dialog */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateFolder} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-white text-sm">Create New Folder in My Drive</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Kasaragod Pit #02 Permits"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newFolderName.trim()}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
