import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Star,
  ShieldCheck,
  FileText,
  DollarSign
} from 'lucide-react';
import { CommerceOrder } from '../../data/ecommerceStudioData';

interface CustomerConfirmationModalProps {
  order: CommerceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSuccess: (orderId: string, rating: number, feedback: string) => void;
  onSwitchToDispute: (order: CommerceOrder) => void;
}

export const CustomerConfirmationModal: React.FC<CustomerConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmSuccess,
  onSwitchToDispute
}) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('Blocks unloaded cleanly at plinth. Excellent wire-cut edges and zero breakage.');
  const [isQtyVerified, setIsQtyVerified] = useState(true);
  const [isConditionVerified, setIsConditionVerified] = useState(true);

  if (!isOpen || !order) return null;

  const handleSubmit = () => {
    onConfirmSuccess(order.id, rating, feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto space-y-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                SITE SIGN-OFF &bull; {order.orderNumber}
              </span>
              <h2 className="text-base font-black text-white">Confirm Material Receipt</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Info */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-300">
            <span>Material:</span>
            <strong className="text-white font-sans">{order.quantity.toLocaleString()} {order.unit}s &bull; {order.productName}</strong>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Supplier Concession:</span>
            <span className="text-amber-400">{order.supplierName}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Destination Site:</span>
            <span className="text-slate-300 font-sans">{order.siteProjectName}</span>
          </div>
        </div>

        {/* Verification Checkboxes */}
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isQtyVerified}
              onChange={(e) => setIsQtyVerified(e.target.checked)}
              className="rounded text-emerald-500 focus:ring-0"
            />
            <span className="text-slate-200">
              I have verified the delivered count ({order.quantity.toLocaleString()} {order.unit}s) against the weighbridge slip.
            </span>
          </label>

          <label className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isConditionVerified}
              onChange={(e) => setIsConditionVerified(e.target.checked)}
              className="rounded text-emerald-500 focus:ring-0"
            />
            <span className="text-slate-200">
              Stone finish and structural integrity verified free of major transit cracks.
            </span>
          </label>
        </div>

        {/* Rating & Feedback */}
        <div className="space-y-2 text-xs">
          <label className="text-slate-400 font-bold block">Quarry Supplier Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-slate-600 hover:text-amber-400 cursor-pointer transition"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-mono text-amber-400 ml-2 font-bold">{rating}.0 / 5.0</span>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-slate-400 font-bold block">Delivery & Handling Remarks</label>
          <textarea
            rows={2}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onSwitchToDispute(order);
            }}
            className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
          >
            Issues Found? Raise Dispute
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isQtyVerified || !isConditionVerified}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Confirm & Release Escrow
          </button>
        </div>
      </div>
    </div>
  );
};
