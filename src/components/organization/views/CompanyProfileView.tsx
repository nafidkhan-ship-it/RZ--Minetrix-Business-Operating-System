import React, { useState } from 'react';
import {
  Building2,
  Edit,
  Upload,
  FileText,
  Plus,
  Send,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  Download,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { DEMO_COMPANY_PROFILE } from '../data/orgDemoData';

interface CompanyProfileViewProps {
  onOpenInviteModal: () => void;
  onOpenAddBranch: () => void;
  onOpenAddSite: () => void;
}

export const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({
  onOpenInviteModal,
  onOpenAddBranch,
  onOpenAddSite
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(DEMO_COMPANY_PROFILE);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const STATUTORY_DOCUMENTS = [
    { name: 'Certificate of Incorporation (MCA)', type: 'Corporate Legal', certNo: 'CIN-U14200KL2020PTC063214', date: '15 Jan 2020', status: 'Verified' },
    { name: 'Goods and Services Tax Registration', type: 'Taxation GST', certNo: '32AABCR1234F1Z8', date: '01 Jul 2020', status: 'Active' },
    { name: 'Permanent Account Number (PAN Card)', type: 'Direct Tax', certNo: 'AABCR1234F', date: '10 Feb 2020', status: 'Verified' },
    { name: 'State Mining Department Concession Deed', type: 'Mining Regulatory', certNo: 'DMG-KL-2021-9921', date: 'Valid till 2035', status: 'Approved' },
    { name: 'State Pollution Control Board Consent (CTO)', type: 'Environmental', certNo: 'KSPCB-RO-KKD-2022', date: 'Valid till 2028', status: 'Compliant' }
  ];

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
              CORPORATE REGISTRY &bull; ENTITY IDENTITY
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-400" />
            <span>Company Master Profile</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Official legal identity, tax registrations, executive governance, statutory documents, and corporate contact records.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEditing ? 'Save Changes' : 'Edit Company'}</span>
          </button>
          <button
            onClick={() => showToast('Company logo updated with high-resolution vector asset')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Logo</span>
          </button>
          <button
            onClick={onOpenAddBranch}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Branch</span>
          </button>
          <button
            onClick={onOpenAddSite}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            <span>Add Mining Site</span>
          </button>
          <button
            onClick={onOpenInviteModal}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Invite Staff</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details + Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Company Detailed Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Information */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>1. Basic Corporate Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Legal Corporate Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.legalName}
                    onChange={e => setProfile({ ...profile, legalName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                  />
                ) : (
                  <div className="font-bold text-white text-sm">{profile.legalName}</div>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Display Brand Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={e => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                  />
                ) : (
                  <div className="font-bold text-amber-400">{profile.displayName}</div>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Business Classification</span>
                <div className="font-bold text-slate-200">{profile.businessType}</div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Industry Vertical</span>
                <div className="font-bold text-slate-200">{profile.industry}</div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Corporate Owner / Promoter</span>
                <div className="font-bold text-white">{profile.owner}</div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Primary Operational Contact</span>
                <div className="font-bold text-cyan-400">{profile.primaryContact}</div>
              </div>
            </div>
          </div>

          {/* 2. Contact & Address Details */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>2. Contact &amp; Registered Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <span className="text-slate-400 flex items-center gap-1 mb-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> Registered Head Office
                </span>
                <div className="font-bold text-white pl-4.5">{profile.address}</div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">District &amp; State</span>
                <div className="font-bold text-slate-200">{profile.district}, {profile.state} - {profile.pin}</div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Country</span>
                <div className="font-bold text-slate-200">{profile.country}</div>
              </div>

              <div>
                <span className="text-slate-400 flex items-center gap-1 mb-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Telephone Numbers
                </span>
                <div className="font-mono font-bold text-white pl-4.5">{profile.phone}</div>
              </div>

              <div>
                <span className="text-slate-400 flex items-center gap-1 mb-0.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Official Email
                </span>
                <div className="font-mono font-bold text-cyan-400 pl-4.5">{profile.email}</div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 flex items-center gap-1 mb-0.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400" /> Corporate Portal
                </span>
                <div className="font-mono font-bold text-blue-400 pl-4.5">{profile.website}</div>
              </div>
            </div>
          </div>

          {/* 3. Statutory & Tax Registration */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>3. Statutory Tax &amp; Corporate Registrations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">GSTIN (India)</span>
                <div className="font-bold text-amber-400 text-xs">{profile.gstin}</div>
                <div className="text-[9px] text-emerald-400 font-sans">Active &bull; Regular Taxpayer</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Corporate PAN</span>
                <div className="font-bold text-cyan-400 text-xs">{profile.pan}</div>
                <div className="text-[9px] text-emerald-400 font-sans">Verified by ITD</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">MCA CIN Registration</span>
                <div className="font-bold text-white text-xs">{profile.cin}</div>
                <div className="text-[9px] text-slate-500 font-sans">RoC Ernakulam / Kerala</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statutory Document Vault */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Statutory Certificates</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">{STATUTORY_DOCUMENTS.length} Verified</span>
            </div>

            <div className="space-y-3 text-xs">
              {STATUTORY_DOCUMENTS.map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{doc.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{doc.certNo}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold shrink-0">
                      {doc.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
                    <span className="text-slate-500">{doc.date}</span>
                    <button
                      onClick={() => showToast(`Downloaded certificate: ${doc.name}`)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => showToast('Open DMS upload dialog')}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Upload New Compliance Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
