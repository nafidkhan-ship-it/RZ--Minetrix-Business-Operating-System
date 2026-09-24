import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Phone,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Navigation
} from 'lucide-react';
import {
  MARKETPLACE_DEALS,
  MarketplaceDeal
} from '../../data/usedMachineryMarketplaceData';

interface TransferDeliveryViewProps {
  onNavigateToPlatform3?: () => void;
  onOpenOttModal: (contextRef?: string) => void;
}

export const TransferDeliveryView: React.FC<TransferDeliveryViewProps> = ({
  onNavigateToPlatform3,
  onOpenOttModal
}) => {
  const [deals, setDeals] = useState<MarketplaceDeal[]>(MARKETPLACE_DEALS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Equipment Transfer & Heavy Haulage Fleet</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              Platform 3 Integrated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinate buyer self-pickup gate passes or dispatch low-bed hydraulic trailers from RZ® Vehicle Management
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToPlatform3 && (
            <button
              onClick={onNavigateToPlatform3}
              className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Go to Platform 3 Vehicle Fleet</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* DISPATCH TILES */}
      <div className="space-y-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {deal.dealCode}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{deal.listingCategory}</span>
                </div>
                <h3 className="text-base font-black text-white mt-1">{deal.listingTitle}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  <span>{deal.deliveryMode}</span>
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {deal.deliveryStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500">Pick-up Origin (Quarry Depot)</div>
                <div className="font-bold text-white">Taliparamba Quarry Depot, Kannur</div>
                <div className="text-slate-400 text-[11px]">Concession Dispatch Gate #01</div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500">Destination Site</div>
                <div className="font-bold text-white">NH-66 Project Depot, Calicut</div>
                <div className="text-slate-400 text-[11px]">Consignee: {deal.buyerCompany}</div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500">Assigned Fleet Resource</div>
                {deal.assignedTrailerNumber ? (
                  <>
                    <div className="font-mono font-bold text-amber-400">{deal.assignedTrailerNumber}</div>
                    <div className="text-slate-400 text-[11px]">
                      Driver: {deal.driverName} ({deal.driverPhone})
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 italic">Self-Pickup via Buyer Fleet</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                Gate Pass Status: <span className="text-emerald-400 font-bold">Approved for Exit</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenOttModal(`LOGISTICS-${deal.dealCode}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Create Transport OTT Task</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Print Gate Transit Pass
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
