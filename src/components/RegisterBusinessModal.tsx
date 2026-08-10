import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { BusinessCategory } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface RegisterBusinessModalProps {
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onToast: (msg: string) => void;
}

const CATEGORIES: BusinessCategory[] = [
  'Quarry',
  'Transport',
  'Construction',
  'Equipment Rental',
  'Machinery',
  'Manufacturing',
  'Wholesale',
  'Retail',
  'Service',
  'Professional Services',
  'Food',
  'Automotive',
  'Other'
];

export const RegisterBusinessModal: React.FC<RegisterBusinessModalProps> = ({
  currentUserId,
  isOpen,
  onClose,
  onSuccess,
  onToast
}) => {
  const [businessName, setBusinessName] = useState('');
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Quarry');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [servicesInput, setServicesInput] = useState('Aggregate Mining, Fleet Haulage');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=200&auto=format&fit=crop&q=80');
  const [coverImageUrl, setCoverImageUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1000&auto=format&fit=crop&q=80');

  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Live Username Validation Check
  const usernameCheck = username.trim()
    ? rzChatService.validateUsername(username)
    : { valid: false, error: 'Username is required' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!businessName.trim()) {
      setFormError('Please enter a business name.');
      return;
    }

    if (!usernameCheck.valid) {
      setFormError(usernameCheck.error || 'Invalid or taken username.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please provide a brief business description.');
      return;
    }

    if (!location.trim()) {
      setFormError('Please enter business location or operating region.');
      return;
    }

    const services = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const res = rzChatService.createBusinessProfile(currentUserId, {
      businessName,
      username,
      category,
      description,
      location,
      phone,
      email,
      website,
      services,
      logoUrl,
      coverImageUrl
    });

    if (res.success && res.business) {
      onToast(`Registered business profile @${res.business.username} successfully!`);
      onSuccess();
      onClose();
    } else {
      setFormError(res.error || 'Failed to create business profile.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative font-sans max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-mono">Create Business Profile</h2>
              <p className="text-xs text-slate-400 font-mono">Establish public commercial identity on RZ Chat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono overflow-y-auto">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* NAME & USERNAME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Business Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Quarry & Mining Co."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Handle Username <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-amber-400 font-bold text-xs">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="apex_quarry"
                  className="w-full pl-8 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                />
                {username.trim() && (
                  <span className="absolute right-3 top-3">
                    {usernameCheck.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </span>
                )}
              </div>
              {username.trim() && !usernameCheck.valid && (
                <span className="text-[10px] text-rose-400 mt-1 block">{usernameCheck.error}</span>
              )}
            </div>
          </div>

          {/* CATEGORY & LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Business Category <span className="text-amber-400">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as BusinessCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Location / Region <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Copperbelt Industrial Zone, ZM"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Business Overview <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your commercial activities, offerings, and operational scope..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* SERVICES OFFERED */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Services Offered (Comma Separated)
            </label>
            <input
              type="text"
              value={servicesInput}
              onChange={e => setServicesInput(e.target.value)}
              placeholder="Aggregate Supply, Heavy Equipment Rental, Crushing"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* CONTACT INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+260 971 000 111"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sales@apex.co"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Website</label>
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://apex.co"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* LOGO & COVER URLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300 focus:outline-none focus:border-amber-500 truncate"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Cover Image URL</label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={e => setCoverImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300 focus:outline-none focus:border-amber-500 truncate"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Sparkles className="w-4 h-4" /> Create Public Business Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
