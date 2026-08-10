import React, { useState } from 'react';
import { X, ClipboardList, Send, AlertCircle, Building2, MapPin, Tag, ShieldCheck } from 'lucide-react';
import { EnquiryPriority } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface CreateEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  conversationId: string;
  customerUserId: string;
  onEnquiryCreated?: (enquiryId: string) => void;
}

const QUARRY_CATEGORIES = [
  'Quarry / Aggregates',
  'Laterite Stone Blocks',
  'M-Sand & Crusher Materials',
  'Excavator & Loader Rental',
  'Volvo Tipper Logistics & Freight',
  'General Commercial Enquiry'
];

export const CreateEnquiryModal: React.FC<CreateEnquiryModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  conversationId,
  customerUserId,
  onEnquiryCreated
}) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Quarry / Aggregates');
  const [quantity, setQuantity] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [priority, setPriority] = useState<EnquiryPriority>('normal');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Please provide an enquiry subject');
      return;
    }
    if (!message.trim()) {
      setError('Please enter enquiry details or message');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const enquiry = rzChatService.createEnquiry({
        businessId,
        conversationId,
        customerUserId,
        subject: subject.trim(),
        message: message.trim(),
        category,
        priority,
        quantity: quantity.trim() || undefined,
        deliveryLocation: deliveryLocation.trim() || undefined
      });

      setIsSubmitting(false);
      if (onEnquiryCreated) {
        onEnquiryCreated(enquiry.id);
      }
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to create enquiry');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Create Customer Enquiry
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {businessName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-sm text-slate-300">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enquiry Subject <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Urgent 120 MT VSI 20mm Aggregate Supply"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Industry Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
              >
                {QUARRY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EnquiryPriority)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>
          </div>

          {/* Quantity & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Quantity / Volume
              </label>
              <input
                type="text"
                placeholder="e.g., 120 MT or 3 Volvo Loads"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Delivery Location
              </label>
              <input
                type="text"
                placeholder="e.g., NH-79 Expressway Depot"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Details / Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enquiry Details & Specifications <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe requirements, grade specifications, delivery timeline, or questions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Submitting this enquiry creates an official record in the Business Inbox. Business staff will process and respond directly inside this chat channel.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Creating...' : 'Submit Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
