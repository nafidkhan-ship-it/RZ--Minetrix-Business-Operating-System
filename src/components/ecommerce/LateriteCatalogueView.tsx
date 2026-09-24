import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Star,
  Truck,
  ArrowRight,
  Info,
  CheckCircle2,
  FileText,
  MessageSquare,
  Sparkles,
  MapPin
} from 'lucide-react';
import { COMMERCE_PRODUCTS, CommerceProduct } from '../../data/ecommerceStudioData';

interface LateriteCatalogueViewProps {
  onSelectProduct: (product: CommerceProduct) => void;
  onOrderProduct: (product: CommerceProduct) => void;
  onRequestQuote: (product: CommerceProduct) => void;
  onOpenOrderWizard: () => void;
}

export const LateriteCatalogueView: React.FC<LateriteCatalogueViewProps> = ({
  onSelectProduct,
  onOrderProduct,
  onRequestQuote,
  onOpenOrderWizard
}) => {
  const [filterFinish, setFilterFinish] = useState<'All' | 'Dressed' | 'Wire-Cut' | 'Rough' | 'Custom'>('All');

  const lateriteList = COMMERCE_PRODUCTS.filter(p => p.isLaterite);

  const filteredLaterite = lateriteList.filter(p => {
    if (filterFinish === 'All') return true;
    if (filterFinish === 'Wire-Cut') return p.finish.toLowerCase().includes('wire-cut');
    if (filterFinish === 'Dressed') return p.finish.toLowerCase().includes('dressed') || p.finish.toLowerCase().includes('chiseled');
    if (filterFinish === 'Rough') return p.finish.toLowerCase().includes('rough');
    if (filterFinish === 'Custom') return p.priceType === 'Quote Required' || p.code.includes('CUS');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                COMMERCIAL PRIORITY &bull; CONCESSION SPECIFICATIONS
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Geological Pit Cut
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Laterite Stone Architectural & Foundation Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Excavated from certified geological pits across Kasaragod, Nileshwaram, and Kannur. Standard 30×20×15 cm, diamond wire-sawn exposed facing blocks, and heavy jumbo basement foundation plinths.
            </p>
          </div>

          <button
            onClick={onOpenOrderWizard}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer transition transform hover:scale-[1.02] shrink-0"
          >
            <Layers className="w-4 h-4" />
            <span>LAUNCH ORDER WIZARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 font-mono text-[11px] px-2 font-bold uppercase">Finish:</span>
        {(['All', 'Dressed', 'Wire-Cut', 'Rough', 'Custom'] as const).map((finish) => (
          <button
            key={finish}
            onClick={() => setFilterFinish(finish)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterFinish === finish
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            {finish === 'All' ? 'All Specifications (5)' : finish}
          </button>
        ))}
      </div>

      {/* Detailed Catalogue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLaterite.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Product Visual */}
              <div
                onClick={() => onSelectProduct(item)}
                className="h-52 bg-slate-950 relative overflow-hidden cursor-pointer group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-slate-800">
                  {item.code}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-emerald-400" /> {item.rating}
                </div>
              </div>

              {/* Product Spec Details */}
              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    {item.finish}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(item)}
                    className="text-base font-bold text-white hover:text-amber-400 transition cursor-pointer mt-0.5"
                  >
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Structured Spec Table */}
                <div className="bg-slate-950/90 rounded-2xl p-3 border border-slate-800/80 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Dimensions:</span>
                    <span className="text-white font-bold">{item.dimensions}</span>
                  </div>
                  {item.weight && (
                    <div className="flex justify-between text-slate-400">
                      <span>Unit Weight:</span>
                      <span className="text-slate-200">{item.weight}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Stock in Concessions:</span>
                    <span className="text-emerald-400 font-bold">{item.availableQuantity.toLocaleString()} {item.unit}s</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Quarry Suppliers:</span>
                    <span className="text-slate-200">{item.supplierCount} Verified Pits</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Coverage:</span>
                    <span className="text-slate-200">{item.deliveryAreas.slice(0, 3).join(', ')}...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">INDICATIVE EX-QUARRY</div>
                  <div className="text-lg font-black text-amber-400 font-mono">
                    {item.priceType === 'Fixed' && item.basePrice ? (
                      <>₹{item.basePrice} <span className="text-[10px] text-slate-400 font-normal">/ block</span></>
                    ) : item.priceType === 'Price on Request' ? (
                      <span className="text-xs font-bold text-amber-300">Price on Request</span>
                    ) : (
                      <span className="text-xs font-bold text-cyan-300">Get Supplier Quote</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRequestQuote(item)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Quote
                  </button>
                  <button
                    onClick={() => onOrderProduct(item)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    ORDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
