import React, { useState } from 'react';
import {
  Star,
  Search,
  CheckCircle2,
  ShieldCheck,
  User,
  MessageSquare
} from 'lucide-react';
import { COMMERCE_REVIEWS, CommerceReview } from '../../data/ecommerceStudioData';

export const ReviewsRatingsView: React.FC = () => {
  const [reviews, setReviews] = useState<CommerceReview[]>(COMMERCE_REVIEWS);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              QUALITY VERIFICATION & FEEDBACK
            </span>
            <span className="text-xs text-slate-400 font-medium">100% Verified Purchase Ratings</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Customer Reviews ({reviews.length})</h1>
        </div>

        <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>Average Supplier Rating: 4.9 / 5.0</span>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{rev.customerName}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Order
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Order: {rev.orderNumber} &bull; {rev.date}
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{rev.rating}.0</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              "{rev.comment}"
            </p>

            {rev.supplierResponse && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] space-y-1">
                <span className="font-bold text-amber-400 font-mono block">Supplier Response ({rev.supplierName}):</span>
                <p className="text-slate-400">{rev.supplierResponse}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
