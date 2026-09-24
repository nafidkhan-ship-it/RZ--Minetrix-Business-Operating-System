import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  Eye,
  MessageSquare
} from 'lucide-react';
import {
  MARKETPLACE_LISTINGS,
  MachineryListing
} from '../../data/usedMachineryMarketplaceData';

interface WatchlistCompareViewProps {
  watchlistIds: string[];
  onToggleWatchlist: (id: string) => void;
  onSelectList: (listing: MachineryListing) => void;
  onEnquireList: (listing: MachineryListing) => void;
  onOpenChat: (seller: string, listingCode: string) => void;
}

export const WatchlistCompareView: React.FC<WatchlistCompareViewProps> = ({
  watchlistIds,
  onToggleWatchlist,
  onSelectList,
  onEnquireList,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'compare'>('watchlist');

  // Selected listings in watchlist
  const savedItems = MARKETPLACE_LISTINGS.filter((item) =>
    watchlistIds.includes(item.id)
  );

  // If watchlist is empty, fall back to first 2 listings for comparison demonstration
  const compareItems = savedItems.length > 0 ? savedItems.slice(0, 3) : MARKETPLACE_LISTINGS.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Saved Watchlist & Technical Specifications Comparison</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare side-by-side engineering specs, hours worked, hydraulic pressures, and asking prices
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'watchlist'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Watchlist ({savedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side Comparison
          </button>
        </div>
      </div>

      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          {savedItems.length === 0 ? (
            <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Your Watchlist is Empty</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Save machines or commercial vehicles while browsing the marketplace to track price revisions and compare specs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-slate-950">
                      <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => onToggleWatchlist(item.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition cursor-pointer"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[11px] text-slate-400">
                        {item.brand} &bull; {item.year} &bull; {item.locationCity}
                      </div>
                      <h3
                        onClick={() => onSelectList(item)}
                        className="text-sm font-black text-white hover:text-amber-400 transition cursor-pointer line-clamp-1"
                      >
                        {item.title}
                      </h3>
                      <div className="text-base font-black text-white font-mono">
                        ₹{(item.askingPriceRs / 100000).toFixed(2)} Lakh
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onSelectList(item)}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onEnquireList(item)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 25. COMPARE FACTUAL SPECIFICATIONS (No arbitrary scores or fake rankings) */}
      {activeTab === 'compare' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Objective Specifications Matrix ({compareItems.length} Units)
            </h2>
            <span className="text-xs text-slate-400">Factual metrics without arbitrary scores</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="p-3 text-slate-400 font-semibold w-48">Specification Parameter</th>
                  {compareItems.map((m) => (
                    <th key={m.id} className="p-3 font-black text-white min-w-[200px]">
                      <div className="text-amber-400 font-mono text-[10px]">{m.listingCode}</div>
                      <div>{m.title}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Asking Price</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 font-mono font-black text-white text-sm">
                      ₹{(m.askingPriceRs / 100000).toFixed(2)} Lakh
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Brand & Model</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 text-slate-200 font-bold">
                      {m.brand} {m.model}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Year of Manufacture</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 text-slate-200 font-mono font-bold">
                      {m.year}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Usage (Hours / KM)</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 font-mono text-white">
                      {m.hoursWorked ? `${m.hoursWorked.toLocaleString()} Hours` : `${m.odometerKm?.toLocaleString()} KM`}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Engine & Horsepower</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 text-slate-300">
                      {m.engineMakeModel} ({m.enginePowerHp})
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Operating Weight / Payload</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 text-slate-300">
                      {m.operatingWeightTons} Tons &bull; {m.bucketOrPayloadCapacity}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Physical Condition</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 text-emerald-400 font-bold">
                      {m.condition}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Location / District</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 text-slate-300">
                      {m.locationCity}, {m.locationDistrict}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Surveyor Inspection Status</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{m.inspectionStatus}</span>
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-400 font-semibold">Documentation Available</td>
                  {compareItems.map((m) => (
                    <td key={m.id} className="p-3 text-slate-300 text-[11px]">
                      {m.hasRcRegistration && 'RC '}
                      {m.hasInsurance && '&bull; Insurance '}
                      {m.hasFitness && '&bull; Fitness '}
                      {m.hasNocClearance && '&bull; NOC'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
