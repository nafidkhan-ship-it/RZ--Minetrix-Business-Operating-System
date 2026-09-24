import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  ShieldCheck,
  Calendar,
  Truck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { VehicleDocument, Vehicle } from '../../data/vehicleStudioData';

interface VehicleDocumentsViewProps {
  documents: VehicleDocument[];
  vehicles: Vehicle[];
  onUploadDocument?: () => void;
}

export const VehicleDocumentsView: React.FC<VehicleDocumentsViewProps> = ({
  documents,
  vehicles,
  onUploadDocument
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              DOCUMENT REPOSITORY &bull; {documents.length} VERIFIED FILES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Commercial Vehicle Document & Legal Vault</h2>
          <p className="text-xs text-slate-400">
            Encrypted storage for RC Books, National Permits, RTO Fitness, Insurance Policies & Owner Agreements
          </p>
        </div>

        {onUploadDocument && (
          <button
            onClick={onUploadDocument}
            className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Document</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document title, vehicle number, file name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Registration">Registration (RC)</option>
              <option value="Insurance">Insurance Policy</option>
              <option value="Fitness">Fitness Certificate</option>
              <option value="Permit">National / State Permit</option>
              <option value="Tax">Road Tax Receipt</option>
              <option value="Agreement">Owner Syndicate Agreement</option>
              <option value="Pollution">PUC Certificate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{doc.title}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">{doc.category}</div>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {doc.status}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Vehicle:</span>
                <span className="font-mono font-bold text-cyan-400">{doc.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">File Name:</span>
                <span className="font-mono text-slate-300">{doc.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Size:</span>
                <span className="text-slate-400">{doc.fileSize}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span>Issue: {doc.issueDate}</span>
              {doc.expiryDate && (
                <span className="text-amber-400 font-medium">Exp: {doc.expiryDate}</span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => alert(`Simulated preview for ${doc.fileName}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <button
                onClick={() => alert(`Simulated download for ${doc.fileName}`)}
                className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
