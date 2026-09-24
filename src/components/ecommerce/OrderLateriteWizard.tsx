import React, { useState } from 'react';
import {
  X,
  Layers,
  MapPin,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Info,
  Phone,
  Building,
  User,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import {
  COMMERCE_PRODUCTS,
  COMMERCE_SUPPLIERS,
  COMMERCE_SUPPLIER_QUOTES,
  COMMERCE_ORDERS,
  CommerceProduct,
  CommerceOrder,
  SupplierQuote
} from '../../data/ecommerceStudioData';
import { ottEcosystemBridge } from '../../services/ottEcosystemBridge';

interface OrderLateriteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
  onOrderSuccess?: (newOrder: CommerceOrder) => void;
  onOpenChatWithSupplier?: (supplierName: string, orderRef: string) => void;
}

export const OrderLateriteWizard: React.FC<OrderLateriteWizardProps> = ({
  isOpen,
  onClose,
  preselectedProductId,
  onOrderSuccess,
  onOpenChatWithSupplier
}) => {
  // Step State (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Select Product
  const lateriteProducts = COMMERCE_PRODUCTS.filter(p => p.isLaterite);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preselectedProductId || lateriteProducts[0]?.id || 'prod-lat-01'
  );
  const [quantity, setQuantity] = useState<number>(2000);
  const [customDimensions, setCustomDimensions] = useState<string>('30 cm × 20 cm × 15 cm');

  // Step 2: Delivery Location
  const [customerName, setCustomerName] = useState('Arun Menon');
  const [customerPhone, setCustomerPhone] = useState('+91 98840 91200');
  const [projectName, setProjectName] = useState('Beachfront Villa Enclave');
  const [address, setAddress] = useState('Plot 48, Beach Road, Near Lighthouse');
  const [district, setDistrict] = useState('Kasaragod');
  const [state, setState] = useState('Kerala');
  const [pinCode, setPinCode] = useState('671121');

  // Step 3: Delivery Requirement
  const [requiredDate, setRequiredDate] = useState('2026-10-04');
  const [preferredTime, setPreferredTime] = useState('Morning (08:00 AM - 12:00 PM)');
  const [deliveryType, setDeliveryType] = useState<'Direct Tipper Dump' | 'Unloaded Stacked' | 'Crane Offloaded'>('Direct Tipper Dump');
  const [vehicleRequirement, setVehicleRequirement] = useState<'6-Wheeler Medium' | '10-Wheeler Tipper' | '14-Wheeler Multi-Axle' | 'Mini Truck'>('10-Wheeler Tipper');
  const [siteAccessNotes, setSiteAccessNotes] = useState('Concrete approach road, 12ft gate width, direct tipper unloading access at foundation plinth.');

  // Step 4 & 5: Matching & Quotes
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('QTE-WIZ-01');
  const [isComparingQuotes, setIsComparingQuotes] = useState(false);

  // Selected Product details
  const activeProduct = COMMERCE_PRODUCTS.find(p => p.id === selectedProductId) || lateriteProducts[0];

  // Dynamic quotes generated based on user input
  const baseRate = activeProduct.basePrice || 38.5;
  const quotesList: SupplierQuote[] = [
    {
      id: 'QTE-WIZ-01',
      quoteNumber: `QTE-${activeProduct.code}-01`,
      supplierId: 'SUP-401',
      supplierName: 'Kasaragod Laterite Concession Pit #01',
      supplierRating: 4.95,
      customerName,
      customerPhone,
      productId: activeProduct.id,
      productName: activeProduct.name,
      quantity,
      unit: 'Block',
      deliveryLocation: `${address}, ${district}`,
      district,
      requiredDate,
      unitRate: baseRate,
      materialAmount: Math.round(quantity * baseRate),
      deliveryCharge: 6200,
      taxAmount: Math.round(quantity * baseRate * 0.05),
      discountAmount: 1000,
      totalAmount: Math.round(quantity * baseRate * 1.05 + 6200 - 1000),
      advanceRequired: Math.round((quantity * baseRate * 1.05 + 6200 - 1000) * 0.3),
      balanceAmount: Math.round((quantity * baseRate * 1.05 + 6200 - 1000) * 0.7),
      estimatedDispatch: `${requiredDate} 06:30 AM`,
      estimatedDelivery: `${requiredDate} 11:00 AM`,
      quoteValidityDays: 7,
      terms: 'Grade-A Pit Concession selection. Tipper haulage with computerized weighbridge pass included.',
      status: 'Submitted',
      notes: 'Direct pit extraction concession. 100% mineral royalty certified.',
      createdDate: '2026-09-23'
    },
    {
      id: 'QTE-WIZ-02',
      quoteNumber: `QTE-${activeProduct.code}-02`,
      supplierId: 'SUP-402',
      supplierName: 'Kannur Valley Wire-Cut Quarry Co.',
      supplierRating: 4.9,
      customerName,
      customerPhone,
      productId: activeProduct.id,
      productName: activeProduct.name,
      quantity,
      unit: 'Block',
      deliveryLocation: `${address}, ${district}`,
      district,
      requiredDate,
      unitRate: baseRate + 1.5,
      materialAmount: Math.round(quantity * (baseRate + 1.5)),
      deliveryCharge: 7500,
      taxAmount: Math.round(quantity * (baseRate + 1.5) * 0.05),
      discountAmount: 500,
      totalAmount: Math.round(quantity * (baseRate + 1.5) * 1.05 + 7500 - 500),
      advanceRequired: Math.round((quantity * (baseRate + 1.5) * 1.05 + 7500 - 500) * 0.35),
      balanceAmount: Math.round((quantity * (baseRate + 1.5) * 1.05 + 7500 - 500) * 0.65),
      estimatedDispatch: `${requiredDate} 07:00 AM`,
      estimatedDelivery: `${requiredDate} 01:30 PM`,
      quoteValidityDays: 5,
      terms: 'Includes palletized stacking with shock absorption separators for edge protection.',
      status: 'Submitted',
      notes: 'Diamond wire cutting equipment used for ultra-sharp edges.',
      createdDate: '2026-09-23'
    }
  ];

  const activeQuote = quotesList.find(q => q.id === selectedQuoteId) || quotesList[0];

  // Final Confirmation Handler
  const handleConfirmOrder = () => {
    const orderNumber = `ORD-RZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: CommerceOrder = {
      id: `ORD-${Date.now()}`,
      orderNumber,
      customerName,
      customerPhone,
      customerAddress: address,
      siteProjectName: projectName,
      district,
      state,
      pinCode,
      productId: activeProduct.id,
      productName: activeProduct.name,
      productCode: activeProduct.code,
      dimensions: activeProduct.dimensions || customDimensions,
      quantity,
      unit: 'Block',
      isLaterite: true,
      supplierId: activeQuote.supplierId,
      supplierName: activeQuote.supplierName,
      quoteId: activeQuote.id,
      requiredDate,
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: activeQuote.estimatedDelivery,
      deliveryType,
      vehicleRequirement,
      siteAccessNotes,
      materialRate: activeQuote.unitRate,
      materialAmount: activeQuote.materialAmount,
      deliveryCharge: activeQuote.deliveryCharge,
      taxAmount: activeQuote.taxAmount,
      discountAmount: activeQuote.discountAmount,
      totalAmount: activeQuote.totalAmount,
      advancePaid: activeQuote.advanceRequired,
      balanceAmount: activeQuote.balanceAmount,
      paymentStatus: 'Advance Paid',
      dispatchStatus: 'Pending',
      deliveryStatusTimeline: 'Order Placed — Quarry Processing',
      status: 'Order Confirmed',
      documentsCount: 2,
      hasDispute: false,
      timeline: [
        {
          id: `tm-${Date.now()}-1`,
          date: new Date().toISOString().split('T')[0],
          time: 'Just now',
          actor: 'Customer',
          status: 'Order Confirmed',
          notes: `Order placed via Order Laterite Stone wizard with ${activeQuote.supplierName}. Advance ₹${activeQuote.advanceRequired.toLocaleString()} logged.`
        }
      ]
    };

    // Add to demo list
    COMMERCE_ORDERS.unshift(newOrder);

    // Create RZ OTT Task
    try {
      ottEcosystemBridge.createItem({
        title: `Laterite Order ${orderNumber}: Coordinate Quarry Dispatch`,
        description: `Deliver ${quantity} ${activeProduct.name} to ${projectName} (${district}). Supplier: ${activeQuote.supplierName}. Vehicle: ${vehicleRequirement}.`,
        type: 'TASK',
        priority: 'HIGH',
        timeSlot: '09:00 AM',
        assigneeName: 'Dispatch Logistics Lead',
        assigneeRole: 'Logistics Desk',
        source_system: 'ORDER',
        source_module: 'Building Materials E-Commerce',
        source_record_id: newOrder.id,
        source_event: 'ORDER_PLACED_CONFIRMED',
        source_task_id: `OTT-TASK-${orderNumber}`,
        idempotency_key: `ecommerce-order-${newOrder.id}`,
        sourceStatusBefore: 'CONFIRMED_AWAITING_DISPATCH',
        sourceStatusAfter: 'DISPATCHED_ON_TRIP'
      });
    } catch (e) {
      console.warn('OTT Bridge notification skipped:', e);
    }

    if (onOrderSuccess) {
      onOrderSuccess(newOrder);
    }

    setCurrentStep(7); // Show Success Confirmation view
  };

  if (!isOpen) return null;

  const STEPS = [
    { num: 1, label: 'Select Product' },
    { num: 2, label: 'Delivery Location' },
    { num: 3, label: 'Delivery Requirement' },
    { num: 4, label: 'Supplier Matching' },
    { num: 5, label: 'Supplier Quotes' },
    { num: 6, label: 'Order Confirmation' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  STUDIO PREVIEW &bull; FLOW 7
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Certified Concessions
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Order Laterite Stone &bull; Direct Quarry Dispatches
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        {currentStep <= 6 && (
          <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 overflow-x-auto">
            <div className="flex items-center justify-between min-w-max gap-2 sm:gap-4">
              {STEPS.map((s) => {
                const isCompleted = currentStep > s.num;
                const isCurrent = currentStep === s.num;
                return (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-amber-400 font-bold'
                          : isCompleted
                          ? 'text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                    {s.num < 6 && <div className="w-4 h-px bg-slate-800 ml-1 hidden sm:block" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SELECT PRODUCT */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Step 1: Select Laterite Stone Product</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose from standard masonry, wire-cut architectural, or jumbo foundation stone blocks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {lateriteProducts.map((prod) => {
                  const isSelected = selectedProductId === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setCustomDimensions(prod.dimensions);
                      }}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-amber-400 font-bold">{prod.code}</span>
                          <span className="text-slate-400">{prod.dimensions}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{prod.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Base Unit Rate</div>
                          <div className="text-base font-black text-amber-400">
                            ₹{prod.basePrice} <span className="text-[10px] text-slate-400">/ block</span>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                            isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quantity & Size Parameters */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">
                    Order Quantity (Blocks)
                  </label>
                  <input
                    type="number"
                    min={activeProduct.minimumOrder}
                    step={100}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(activeProduct.minimumOrder, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Min order: {activeProduct.minimumOrder} blocks
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">
                    Standard Sizing / Specification
                  </label>
                  <input
                    type="text"
                    value={customDimensions}
                    onChange={(e) => setCustomDimensions(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Length × Width × Height
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">
                    Estimated Material Amount
                  </label>
                  <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 font-mono font-black text-sm">
                    ₹{(quantity * (activeProduct.basePrice || 38.5)).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Ex-quarry (before taxes & haulage)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Step 2: Delivery Location & Site Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Provide exact site destination for automated distance calculation and vehicle routing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Customer / Builder Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Project / Site Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Kasaragod">Kasaragod (Kerala)</option>
                    <option value="Kannur">Kannur (Kerala)</option>
                    <option value="Wayanad">Wayanad (Kerala)</option>
                    <option value="Kozhikode">Kozhikode (Kerala)</option>
                    <option value="Mangalore">Mangalore (Karnataka)</option>
                    <option value="Udupi">Udupi (Karnataka)</option>
                    <option value="Kodagu">Kodagu / Coorg (Karnataka)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Full Site Address & Landmarks</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DELIVERY REQUIREMENT */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Step 3: Delivery Logistics & Site Requirements</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Specify scheduled delivery dates, vehicle axle requirements, and site road accessibility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Required Delivery Date</label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Preferred Time Window</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Morning (08:00 AM - 12:00 PM)">Morning (08:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                    <option value="Early Bird (06:00 AM - 08:00 AM)">Early Bird (06:00 AM - 08:00 AM)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Delivery Unloading Type</label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Direct Tipper Dump">Direct Tipper Dump (Standard for rough masonry)</option>
                    <option value="Unloaded Stacked">Manual Unloaded & Neatly Stacked (+₹1.5/block)</option>
                    <option value="Crane Offloaded">Crane Offloaded (Palletized)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Vehicle Axle Requirement</label>
                  <select
                    value={vehicleRequirement}
                    onChange={(e) => setVehicleRequirement(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="10-Wheeler Tipper">10-Wheeler Tipper (~1,600 to 2,000 blocks)</option>
                    <option value="6-Wheeler Medium">6-Wheeler Medium Tipper (~800 to 1,200 blocks)</option>
                    <option value="14-Wheeler Multi-Axle">14-Wheeler Multi-Axle (~2,500 to 3,000 blocks)</option>
                    <option value="Mini Truck">Mini Truck (Small batch / narrow street)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Site Access Notes / Gate Constraints</label>
                  <textarea
                    rows={2}
                    value={siteAccessNotes}
                    onChange={(e) => setSiteAccessNotes(e.target.value)}
                    placeholder="e.g. Low hanging power lines, narrow bridge, mud slush road..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUPPLIER MATCHING */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Step 4: AI & Concession Supplier Matching</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Matched 2 certified quarries based on your location ({district}), quantity ({quantity} blocks), and delivery schedule.
                </p>
              </div>

              <div className="space-y-3">
                {COMMERCE_SUPPLIERS.filter(s => s.productCategories.includes('Laterite Stone')).map((sup) => (
                  <div
                    key={sup.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">{sup.id}</span>
                        <h4 className="text-sm font-bold text-white">{sup.name}</h4>
                        {sup.verifiedQuarryBadge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                            Verified Concession
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex flex-wrap gap-3">
                        <span>{sup.address}, {sup.district}</span>
                        <span>&bull; Capacity: {sup.monthlyCapacity}</span>
                        <span>&bull; Rating: {sup.rating} ★</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onOpenChatWithSupplier) {
                            onOpenChatWithSupplier(sup.name, `Requirement: ${quantity} blocks`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                      <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        100% Stock Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SUPPLIER QUOTES */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Step 5: Supplier Quotes Comparison</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select your preferred quote or open side-by-side comparison.
                  </p>
                </div>
                <button
                  onClick={() => setIsComparingQuotes(!isComparingQuotes)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isComparingQuotes ? 'Show Cards' : 'Compare Factual Table'}</span>
                </button>
              </div>

              {!isComparingQuotes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quotesList.map((q) => {
                    const isSelected = selectedQuoteId === q.id;
                    return (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQuoteId(q.id)}
                        className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-xl shadow-amber-500/10'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-amber-400">{q.quoteNumber}</span>
                            <span className="text-xs font-bold text-amber-300">{q.supplierRating} ★</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{q.supplierName}</h4>
                          <p className="text-xs text-slate-400">{q.terms}</p>

                          <div className="bg-slate-900/90 p-3 rounded-xl space-y-1.5 text-xs">
                            <div className="flex justify-between text-slate-300">
                              <span>Material Rate:</span>
                              <span className="font-mono font-bold text-white">₹{q.unitRate}/block</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Material Subtotal:</span>
                              <span className="font-mono">₹{q.materialAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Delivery Charge:</span>
                              <span className="font-mono">₹{q.deliveryCharge.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>GST Tax (5%):</span>
                              <span className="font-mono">₹{q.taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-amber-400">
                              <span>Total Amount:</span>
                              <span>₹{q.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <div className="text-[11px] text-slate-400">
                            Est. Delivery: <span className="text-white font-medium">{q.estimatedDelivery}</span>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-xl font-bold ${
                              isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {isSelected ? 'Selected Quote' : 'Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Factual Comparison Table */
                <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="p-3">Parameter</th>
                        {quotesList.map(q => (
                          <th key={q.id} className="p-3 font-bold text-white">{q.supplierName}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="p-3 text-slate-400 font-sans">Unit Rate</td>
                        {quotesList.map(q => (
                          <td key={q.id} className="p-3 text-amber-400 font-bold">₹{q.unitRate}/block</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-400 font-sans">Delivery Charge</td>
                        {quotesList.map(q => (
                          <td key={q.id} className="p-3 text-white">₹{q.deliveryCharge.toLocaleString()}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-400 font-sans">Total Amount</td>
                        {quotesList.map(q => (
                          <td key={q.id} className="p-3 text-emerald-400 font-bold">₹{q.totalAmount.toLocaleString()}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-400 font-sans">Estimated Delivery</td>
                        {quotesList.map(q => (
                          <td key={q.id} className="p-3 text-slate-300">{q.estimatedDelivery}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-400 font-sans">Supplier Rating</td>
                        {quotesList.map(q => (
                          <td key={q.id} className="p-3 text-amber-400">{q.supplierRating} ★</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-400 font-sans">Action</td>
                        {quotesList.map(q => (
                          <td key={q.id} className="p-3">
                            <button
                              onClick={() => setSelectedQuoteId(q.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                selectedQuoteId === q.id
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {selectedQuoteId === q.id ? 'Active' : 'Choose'}
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: ORDER CONFIRMATION */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Step 6: Review & Confirm Laterite Order</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Confirm all operational parameters and schedule initial advance escrow deposit.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Product</span>
                    <span className="font-bold text-white">{activeProduct.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Quantity</span>
                    <span className="font-bold text-amber-400 font-mono">{quantity.toLocaleString()} Blocks</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Selected Quarry</span>
                    <span className="font-bold text-white">{activeQuote.supplierName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Delivery Date</span>
                    <span className="font-bold text-white font-mono">{requiredDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Destination Site</span>
                    <span className="text-white font-medium">{projectName}, {address}, {district}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Vehicle & Unloading</span>
                    <span className="text-white font-medium">{vehicleRequirement} &bull; {deliveryType}</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-slate-900 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Material Amount ({quantity} blocks @ ₹{activeQuote.unitRate}):</span>
                    <span className="font-mono">₹{activeQuote.materialAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Direct Quarry Haulage & Tipper Delivery:</span>
                    <span className="font-mono">₹{activeQuote.deliveryCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>GST (5% Mineral Royalty & Transport):</span>
                    <span className="font-mono">₹{activeQuote.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Platform Special Discount:</span>
                    <span className="font-mono">-₹{activeQuote.discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-black text-white">
                    <span>Total Order Value:</span>
                    <span className="text-amber-400">₹{activeQuote.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 pt-1">
                    <span>Advance Booking Required (30%):</span>
                    <span className="text-white font-mono">₹{activeQuote.advanceRequired.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Balance Due on Delivery Weighbridge Slip:</span>
                    <span className="text-white font-mono">₹{activeQuote.balanceAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    Studio Preview: Submitting this form creates a live order record in Platform 5 and auto-synchronizes a dispatch task to RZ® OTT.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: ORDER SUCCESS */}
          {currentStep === 7 && (
            <div className="py-8 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Laterite Order Confirmed!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your order for <strong className="text-white">{quantity} Laterite Blocks</strong> has been sent to{' '}
                <strong className="text-amber-400">{activeQuote.supplierName}</strong>. A dispatch coordination task has been logged to your RZ® OTT schedule.
              </p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 space-y-1">
                <div>Delivery Date: <span className="text-white font-bold">{requiredDate}</span></div>
                <div>Advance Paid: <span className="text-emerald-400 font-bold">₹{activeQuote.advanceRequired.toLocaleString()}</span></div>
                <div>Vehicle: <span className="text-amber-400 font-bold">{vehicleRequirement}</span></div>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Return to E-Commerce
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {currentStep <= 6 && (
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmOrder}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-500/25"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM ORDER &bull; ADVANCE ₹{activeQuote.advanceRequired.toLocaleString()}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
