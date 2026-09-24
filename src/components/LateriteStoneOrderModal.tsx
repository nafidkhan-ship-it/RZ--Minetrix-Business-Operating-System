import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Layers,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  FileText,
  Calendar,
  Sparkles,
  DollarSign,
  Clock,
  Info,
  Navigation
} from 'lucide-react';
import { ottEcosystemBridge } from '../services/ottEcosystemBridge';

interface LateriteStoneOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (orderId: string) => void;
}

export interface LateriteProductSpec {
  id: string;
  name: string;
  grade: string;
  dimensions: string;
  weight: string;
  compressiveStrength: string;
  recommendedUse: string;
  basePricePerBlock: number;
  imageAccent: string;
  inStock: number;
}

const LATERITE_PRODUCTS: LateriteProductSpec[] = [
  {
    id: 'LAT-STD-01',
    name: 'Standard Laterite Building Stone',
    grade: 'Class-A Red Masonry Grade',
    dimensions: '30 cm × 20 cm × 15 cm (12" × 8" × 6")',
    weight: '~18.5 kg / block',
    compressiveStrength: '3.5 - 4.2 N/mm²',
    recommendedUse: 'Load-bearing residential walls, compound walls, commercial buildings',
    basePricePerBlock: 38,
    imageAccent: 'border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-900/20',
    inStock: 14500
  },
  {
    id: 'LAT-JMB-02',
    name: 'Jumbo Foundation Laterite Block',
    grade: 'Heavy Concession Basement Grade',
    dimensions: '35 cm × 25 cm × 18 cm (14" × 10" × 7")',
    weight: '~28.0 kg / block',
    compressiveStrength: '4.8 - 5.5 N/mm²',
    recommendedUse: 'Deep basements, retaining structures, foundation plinths',
    basePricePerBlock: 58,
    imageAccent: 'border-orange-500/40 bg-gradient-to-br from-orange-950/40 via-slate-900 to-amber-950/30',
    inStock: 8200
  },
  {
    id: 'LAT-CUT-03',
    name: 'Machine Cut Exposed Finish Stone',
    grade: 'Precision Wire-Sawn Architectural',
    dimensions: '30 cm × 20 cm × 15 cm (Machine Uniform)',
    weight: '~17.8 kg / block',
    compressiveStrength: '4.0 - 4.5 N/mm²',
    recommendedUse: 'Exposed heritage architecture, villas, cladding with zero plastering',
    basePricePerBlock: 48,
    imageAccent: 'border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900 to-amber-950/20',
    inStock: 6400
  },
  {
    id: 'LAT-FAC-04',
    name: 'Wire-Cut Luxury Facing Stone',
    grade: 'Architectural Special Selection',
    dimensions: '40 cm × 20 cm × 20 cm (16" × 8" × 8")',
    weight: '~24.0 kg / block',
    compressiveStrength: '4.2 - 5.0 N/mm²',
    recommendedUse: 'Luxury resorts, facade accents, landscape retaining masonry',
    basePricePerBlock: 65,
    imageAccent: 'border-yellow-500/40 bg-gradient-to-br from-yellow-950/40 via-slate-900 to-amber-900/30',
    inStock: 4100
  }
];

const SUPPLIERS = [
  { id: 'SUP-01', name: 'Kasaragod Concession Pit #01', distanceKm: 18, rating: 4.9, certified: true },
  { id: 'SUP-02', name: 'Nileshwaram Bench Quarries Ltd', distanceKm: 34, rating: 4.8, certified: true },
  { id: 'SUP-03', name: 'Kannur Hill Minerals & Laterite Hub', distanceKm: 52, rating: 4.7, certified: true }
];

export const LateriteStoneOrderModal: React.FC<LateriteStoneOrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProduct, setSelectedProduct] = useState<LateriteProductSpec>(LATERITE_PRODUCTS[0]);
  const [quantity, setQuantity] = useState<number>(1000);
  const [deliveryLocation, setDeliveryLocation] = useState('Kannur Coastal Villa Site, Kerala');
  const [pinCode, setPinCode] = useState('670001');
  const [vehicleType, setVehicleType] = useState<'6_WHEELER' | '10_WHEELER' | '12_WHEELER'>('10_WHEELER');
  const [selectedSupplier, setSelectedSupplier] = useState(SUPPLIERS[0]);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Rate calculations
  const materialCost = selectedProduct.basePricePerBlock * quantity;
  const haulageRatePerKm = vehicleType === '6_WHEELER' ? 32 : vehicleType === '10_WHEELER' ? 48 : 62;
  const freightCost = Math.round(selectedSupplier.distanceKm * haulageRatePerKm * (quantity > 1800 ? 2 : 1));
  const royaltyPassFee = Math.round(quantity * 2.5); // Government E-Pass royalty
  const gstTax = Math.round((materialCost + freightCost) * 0.05); // 5% GST
  const grandTotal = materialCost + freightCost + royaltyPassFee + gstTax;

  const handleCreateOrder = () => {
    setIsSubmitting(true);
    const newOrderId = `ORD-LAT-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      // Create connected OTT task automatically
      ottEcosystemBridge.createItem({
        title: `Dispatch Laterite Stones (${quantity} blocks) — ${newOrderId}`,
        description: `Deliver ${quantity} units of ${selectedProduct.name} to ${deliveryLocation}. Vehicle: ${vehicleType}. Supplier: ${selectedSupplier.name}.`,
        type: 'TASK',
        priority: 'HIGH',
        timeSlot: '01:00 PM',
        assigneeName: 'Muhammed Shafi / Dispatch Lead',
        assigneeRole: 'DISPATCH',
        source_system: 'ORDER',
        source_module: 'LATERITE_COMMERCE',
        source_record_id: newOrderId,
        source_event: 'LATERITE_ORDER_CREATED',
        source_task_id: `TASK-${newOrderId}`,
        external_reference: `LOC-${pinCode}`,
        idempotency_key: `IDEMP_${newOrderId}`,
        sourceStatusBefore: 'CONFIRMED_PENDING_DISPATCH',
        sourceStatusAfter: 'DISPATCHED_TO_SITE'
      });

      setCreatedOrderId(newOrderId);
      setIsSubmitting(false);
      setStep(4);
      if (onSuccess) onSuccess(newOrderId);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header with Laterite Accent */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-amber-500/20 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold tracking-wider uppercase border border-amber-500/30">
                    RZ® LATERITE COMMERCE
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Quarries
                  </span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mt-1">
                  ORDER LATERITE STONE
                </h3>
                <p className="text-xs text-slate-400">
                  Order premium laterite stones directly from verified quarries with live tipper tracking.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 13-Stage Enterprise Lifecycle Pipeline */}
          <div className="mt-4 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max text-[10px] font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider mr-1">Lifecycle:</span>
              {[
                { stage: 'Product', active: step >= 1 },
                { stage: 'Quantity', active: step >= 2 },
                { stage: 'Location', active: step >= 2 },
                { stage: 'Delivery Req.', active: step >= 2 },
                { stage: 'Supplier Avail.', active: step >= 3 },
                { stage: 'Price / Quotation', active: step >= 3 },
                { stage: 'Order', active: step >= 3 },
                { stage: 'Payment', active: step >= 3 },
                { stage: 'Dispatch', active: step === 4 },
                { stage: 'Vehicle', active: step === 4 },
                { stage: 'Delivery', active: step === 4 },
                { stage: 'Invoice', active: step === 4 },
                { stage: 'Completed', active: step === 4 }
              ].map((s, idx, arr) => (
                <React.Fragment key={idx}>
                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold ${
                      s.active
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {s.stage}
                  </span>
                  {idx < arr.length - 1 && <span className="text-slate-600 font-bold">&rarr;</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-[11px] font-bold">
            <div className={`p-2 rounded-xl border text-center transition-all ${step === 1 ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' : step > 1 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
              1. Product & Sizing
            </div>
            <div className={`p-2 rounded-xl border text-center transition-all ${step === 2 ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' : step > 2 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
              2. Quantity & Site
            </div>
            <div className={`p-2 rounded-xl border text-center transition-all ${step === 3 ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' : step > 3 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
              3. Quotation & Dispatch
            </div>
            <div className={`p-2 rounded-xl border text-center transition-all ${step === 4 ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
              4. Confirmed & OTT Sync
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[68vh] overflow-y-auto">
          {/* STEP 1: Product Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 font-semibold mb-2">
                Select Laterite Stone Specification & Cut Grade:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {LATERITE_PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                            {prod.grade}
                          </span>
                          <span className="text-xs font-black text-amber-400">
                            ₹{prod.basePricePerBlock} <span className="text-[10px] text-slate-400 font-normal">/ block</span>
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {prod.name}
                        </h4>
                        <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                          <div><strong className="text-slate-300">Dimensions:</strong> {prod.dimensions}</div>
                          <div><strong className="text-slate-300">Weight:</strong> {prod.weight}</div>
                          <div><strong className="text-slate-300">Compressive:</strong> {prod.compressiveStrength}</div>
                          <div className="line-clamp-2 text-slate-500 text-[10px] pt-1">{prod.recommendedUse}</div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> In Stock: {prod.inStock.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-amber-400">
                          {isSelected ? '✓ Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Quantity & Delivery Site */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Selected Product Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Selected Stone</span>
                  <div className="text-sm font-bold text-white">{selectedProduct.name}</div>
                  <div className="text-xs text-slate-400">{selectedProduct.dimensions}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-amber-400">₹{selectedProduct.basePricePerBlock}</div>
                  <div className="text-[10px] text-slate-500">per block ex-quarry</div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Order Quantity (Stones / Blocks):
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {[500, 1000, 1800, 3000, 5000].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        quantity === q
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {q.toLocaleString()} blocks
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(100, parseInt(e.target.value) || 100))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-mono">Blocks</span>
                </div>
              </div>

              {/* Delivery Site Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Delivery Site Address / Landmark:
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="e.g. Near New Bypass Bridge, Kannur"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    PIN Code:
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="670001"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Haulage Vehicle & Supplier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Haulage Vehicle Type:
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="6_WHEELER">6-Wheeler Tipper (~800 stones max)</option>
                    <option value="10_WHEELER">10-Wheeler Tipper (~1,800 stones max)</option>
                    <option value="12_WHEELER">12-Wheeler Multi-Axle (~2,500 stones max)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Verified Concession Quarry:
                  </label>
                  <select
                    value={selectedSupplier.id}
                    onChange={(e) => {
                      const found = SUPPLIERS.find((s) => s.id === e.target.value);
                      if (found) setSelectedSupplier(found);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {SUPPLIERS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.distanceKm} km)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Transparent Quotation & Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">Live Transparent Rate Breakdown</span>
                  <span className="text-xs text-slate-400">{selectedSupplier.distanceKm} km haulage</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Stone Material ({quantity.toLocaleString()} × ₹{selectedProduct.basePricePerBlock}):</span>
                    <span className="font-mono font-bold text-white">₹{materialCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Dedicated Tipper Freight & Site Unloading:</span>
                    <span className="font-mono font-bold text-white">₹{freightCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Govt Mining Department E-Pass Royalty (₹2.50/block):</span>
                    <span className="font-mono font-bold text-white">₹{royaltyPassFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>GST (5% Mining Material):</span>
                    <span className="font-mono font-bold text-white">₹{gstTax.toLocaleString()}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-sm font-black text-white">Total Order Value (All-Inclusive):</span>
                    <span className="text-lg font-black text-amber-400 font-mono">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Connected Ecosystem Benefit Note */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" /> Connected Ecosystem Automation
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Submitting this order immediately creates a synchronized task in the <strong>RZ® OTT Engine</strong> for the Quarry Pit Supervisor and assigns the nearest active Tipper vehicle with automated Weighbridge gross/tare pass tracking.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Tracking */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase font-bold text-emerald-400">
                  Order Successfully Placed & Dispatched
                </span>
                <h4 className="text-2xl font-black text-white mt-1">
                  {createdOrderId}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Your order for <strong>{quantity.toLocaleString()} {selectedProduct.name}</strong> has been routed to {selectedSupplier.name}.
                </p>
              </div>

              {/* Status Timeline */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <div className="font-bold text-white">1. Order Confirmed & Synced to RZ® OTT</div>
                    <div className="text-[10px] text-slate-400">Actionable dispatch task assigned to Muhammed Shafi</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div>
                    <div className="font-bold text-white">2. Vehicle Assigned: Tipper KL-14-Y-9201</div>
                    <div className="text-[10px] text-slate-400">Driver: Jaleel Ahmed (+91 97455 22091)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <div>
                    <div className="font-bold text-slate-400">3. Weighbridge & Royalty E-Way Pass</div>
                    <div className="text-[10px] text-slate-500">Digital pass will generate on gate exit</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(3, s + 1) as any)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCreateOrder}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Order & Syncing OTT...</span>
              ) : (
                <>
                  <span>CONFIRM & PLACE ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer"
            >
              Close & View in RZ® OTT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
