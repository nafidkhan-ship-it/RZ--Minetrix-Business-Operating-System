import React from 'react';
import {
  X,
  Layers,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  FileText,
  Star,
  Info
} from 'lucide-react';
import { CommerceProduct } from '../../data/ecommerceStudioData';

interface ProductDetailModalProps {
  product: CommerceProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderNow: (product: CommerceProduct) => void;
  onRequestQuote: (product: CommerceProduct) => void;
  onChatWithSupplier: (supplierName: string, productContext: string) => void;
  onAddToRequirement: (product: CommerceProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderNow,
  onRequestQuote,
  onChatWithSupplier,
  onAddToRequirement
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {product.code}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {product.category}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">{product.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Gallery & Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-5 h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-slate-800 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div className="flex items-baseline gap-2">
                {product.priceType === 'Fixed' && product.basePrice ? (
                  <>
                    <span className="text-2xl font-black text-amber-400 font-mono">₹{product.basePrice}</span>
                    <span className="text-xs text-slate-400">/ {product.unit} (Ex-Quarry)</span>
                  </>
                ) : (
                  <span className="text-lg font-black text-amber-400">{product.priceType}</span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Dimensions</span>
                  <span className="text-slate-200 font-bold font-mono">{product.dimensions}</span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Finish & Edge</span>
                  <span className="text-slate-200 font-bold">{product.finish}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Product Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Product Information
            </h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Material</span>
                <span className="text-white font-medium">{product.material}</span>
              </div>
              {product.weight && (
                <div>
                  <span className="text-[11px] text-slate-500 block">Unit Weight</span>
                  <span className="text-white font-mono font-medium">{product.weight}</span>
                </div>
              )}
              <div>
                <span className="text-[11px] text-slate-500 block">Standard Unit</span>
                <span className="text-white font-medium">{product.unit}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-[11px] text-slate-500 block">Recommended Applications</span>
                <span className="text-slate-300">{product.application}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Availability */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Quarry Availability & Logistics
            </h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Available Yards</span>
                <span className="text-emerald-400 font-bold">{product.supplierCount} Quarries / Mills</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Available Stock</span>
                <span className="text-white font-mono font-bold">{product.availableQuantity.toLocaleString()} {product.unit}s</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Minimum Order</span>
                <span className="text-white font-mono font-bold">{product.minimumOrder} {product.unit}s</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Est. Dispatch</span>
                <span className="text-white font-mono font-bold">{product.estimatedDispatchHours} Hours</span>
              </div>
              <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-500 block mb-1">Direct Delivery Coverage Districts</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.deliveryAreas.map((area, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[11px] border border-slate-800">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Commercial Terms & Taxes
            </h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Applicable GST</span>
                <span className="text-white font-bold">{product.taxPercent}% Royalty & Mineral Tax</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Est. Haulage / Km</span>
                <span className="text-white font-mono font-bold">~₹{product.estimatedDeliveryPerKm} / km / MT</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Payment Settlement</span>
                <span className="text-white font-medium">{product.paymentTerms}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar (Requirement 6) */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChatWithSupplier('Direct Quarry Concession', product.name)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Chat with Supplier</span>
            </button>
            <button
              onClick={() => onAddToRequirement(product)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add to Requirement</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRequestQuote(product)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Request Quote
            </button>
            <button
              onClick={() => onOrderNow(product)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>ORDER NOW</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
