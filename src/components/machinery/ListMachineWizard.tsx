import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Truck,
  Building2,
  Wrench,
  DollarSign,
  FileText,
  Upload,
  AlertCircle,
  ShieldCheck,
  Eye,
  Lock
} from 'lucide-react';
import {
  ListingCategory,
  EquipmentType,
  MachineCondition,
  PriceType,
  MachineryListing
} from '../../data/usedMachineryMarketplaceData';

interface ListMachineWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishListing: (newListing: MachineryListing) => void;
}

export const ListMachineWizard: React.FC<ListMachineWizardProps> = ({
  isOpen,
  onClose,
  onPublishListing
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [category, setCategory] = useState<ListingCategory>('Machinery');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('Excavators');
  
  // Basic Details
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2022);
  const [usageValue, setUsageValue] = useState(3200);
  const [usageType, setUsageType] = useState<'Hours' | 'KM'>('Hours');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [locationCity, setLocationCity] = useState('Kozhikode Mining Zone');
  const [locationDistrict, setLocationDistrict] = useState('Kozhikode');
  const [locationState, setLocationState] = useState('Kerala');
  const [condition, setCondition] = useState<MachineCondition>('Excellent');

  // Specifications
  const [engineMakeModel, setEngineMakeModel] = useState('');
  const [enginePowerHp, setEnginePowerHp] = useState('150 HP');
  const [operatingWeightTons, setOperatingWeightTons] = useState(20.5);
  const [capacity, setCapacity] = useState('1.1 m³ Rock Bucket');
  const [fuelType, setFuelType] = useState<'Diesel' | 'Electric' | 'Dual'>('Diesel');
  const [productionCapacity, setProductionCapacity] = useState('');
  const [chassisSerialNumber, setChassisSerialNumber] = useState('');

  // Price & Commercials
  const [priceType, setPriceType] = useState<PriceType>('Negotiable');
  const [askingPriceRs, setAskingPriceRs] = useState(3800000);
  const [minimumAcceptablePriceRs, setMinimumAcceptablePriceRs] = useState(3500000);
  const [financeAvailable, setFinanceAvailable] = useState(true);
  const [paymentTerms, setPaymentTerms] = useState('20% Advance Escrow, 80% upon delivery & RTO NOC handover');

  // Media Placeholders
  const [frontImage, setFrontImage] = useState('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80');
  const [videoUrl, setVideoUrl] = useState('');

  // Documents
  const [hasRc, setHasRc] = useState(true);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [hasFitness, setHasFitness] = useState(true);
  const [hasPollution, setHasPollution] = useState(true);
  const [hasNoc, setHasNoc] = useState(true);
  const [hasServiceRecords, setHasServiceRecords] = useState(true);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePublish = () => {
    const finalTitle = title.trim() || `${brand || 'Heavy'} ${model || equipmentType} (${year})`;
    const newListing: MachineryListing = {
      id: `LST-NEW-${Date.now()}`,
      listingCode: `RZ-LST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: finalTitle,
      category,
      type: equipmentType,
      brand: brand || 'Standard OEM',
      model: model || 'Commercial',
      year,
      hoursWorked: usageType === 'Hours' ? Number(usageValue) : undefined,
      odometerKm: usageType === 'KM' ? Number(usageValue) : undefined,
      registrationNumber: registrationNumber || undefined,
      locationState,
      locationDistrict,
      locationCity,
      condition,
      askingPriceRs: Number(askingPriceRs),
      priceType,
      minimumAcceptablePriceRs: Number(minimumAcceptablePriceRs),
      financeAvailable,
      paymentTerms,
      engineMakeModel: engineMakeModel || 'Turbocharged Industrial Diesel',
      enginePowerHp: enginePowerHp || '160 HP',
      operatingWeightTons: Number(operatingWeightTons),
      bucketOrPayloadCapacity: capacity,
      fuelType,
      productionCapacity: productionCapacity || undefined,
      chassisSerialNumber: chassisSerialNumber || `SRN-${Date.now().toString().slice(-6)}`,
      hasRcRegistration: hasRc,
      hasInsurance,
      hasFitness,
      hasPollutionTax: hasPollution,
      hasNocClearance: hasNoc,
      hasServiceRecords,
      ownershipCount: 1,
      inspectionStatus: 'Requested',
      sellerId: 'SEL-CURRENT',
      sellerName: 'Nafid Khan (Verified Operator)',
      sellerBusiness: 'Coastal Quarry & Logistics Hub',
      sellerType: 'Quarry Owner',
      sellerPhone: '+91 98450 11223',
      sellerCity: locationCity,
      sellerRating: 5.0,
      sellerTotalListings: 1,
      featuredImage: frontImage,
      galleryImages: [frontImage],
      hasVideo: Boolean(videoUrl),
      viewsCount: 1,
      enquiriesCount: 0,
      offersCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      featured: false
    };

    onPublishListing(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
              <span>STEP {currentStep} OF 8</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 uppercase">Seller Listing Wizard</span>
            </div>
            <h2 className="text-base font-black text-white">List Heavy Machine / Vehicle for Sale</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="w-full bg-slate-950 h-1.5 overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>

        {/* STEP BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: CATEGORY */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Select Marketplace Category</h3>
                <p className="text-xs text-slate-400">Choose the primary category for this equipment asset.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'Machinery' as ListingCategory,
                    label: 'Machinery',
                    desc: 'Excavators, wheel loaders, crushers, drills, breakers',
                    icon: Wrench
                  },
                  {
                    id: 'Commercial Vehicles' as ListingCategory,
                    label: 'Commercial Vehicles',
                    desc: 'Tippers, trucks, trailers, tankers, site haulers',
                    icon: Truck
                  },
                  {
                    id: 'Quarry / Crusher Equipment' as ListingCategory,
                    label: 'Crusher Plants & Ancillaries',
                    desc: 'Screens, feeders, conveyor belts, hoppers, motors',
                    icon: Building2
                  }
                ].map((c) => {
                  const Icon = c.icon;
                  const isSel = category === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? 'bg-amber-500/10 border-amber-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${isSel ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-sm text-white">{c.label}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{c.desc}</div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs font-mono">
                        <span className={isSel ? 'text-amber-400 font-bold' : 'text-slate-600'}>
                          {isSel ? 'SELECTED' : 'SELECT'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: EQUIPMENT TYPE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Select Equipment Type</h3>
                <p className="text-xs text-slate-400">Classify the specific equipment type for targeted buyer matching.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {(category === 'Machinery'
                  ? [
                      'Excavators',
                      'Wheel Loaders',
                      'Backhoe Loaders',
                      'Jaw Crushers',
                      'Cone Crushers',
                      'VSI',
                      'Screening Plants',
                      'Drilling Machines',
                      'Hydraulic Breakers',
                      'Generators',
                      'Compressors',
                      'Other Machinery'
                    ]
                  : category === 'Commercial Vehicles'
                  ? [
                      'Tippers',
                      'Trucks',
                      'Trailers',
                      'Tankers',
                      'Pickup Vehicles',
                      'Heavy Vehicles',
                      'Other Commercial Vehicles'
                    ]
                  : [
                      'Crusher Plants',
                      'Conveyor Systems',
                      'Feeders',
                      'Screens',
                      'Hoppers',
                      'Motors',
                      'Spare Equipment',
                      'Other Equipment'
                    ]
                ).map((t) => (
                  <button
                    key={t}
                    onClick={() => setEquipmentType(t as EquipmentType)}
                    className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                      equipmentType === t
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: BASIC DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Basic Equipment Details</h3>
                <p className="text-xs text-slate-400">Enter title, brand, manufacture year, and location.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Listing Headline / Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Caterpillar 320D Heavy Hydraulic Excavator (20.5 Ton)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Brand / OEM</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Caterpillar / Komatsu / Ashok Leyland"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Model Number</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. 320D / PC210-10 / 2820"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Manufacturing Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Usage Metric</label>
                    <div className="flex gap-2">
                      <select
                        value={usageType}
                        onChange={(e) => setUsageType(e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="Hours">Hours</option>
                        <option value="KM">KM</option>
                      </select>
                      <input
                        type="number"
                        value={usageValue}
                        onChange={(e) => setUsageValue(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Registration / RTO No. (If vehicle)</label>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="e.g. KL-14-EA-4412 (Optional)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Overall Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Excellent">Excellent (Immediately Deployable)</option>
                      <option value="Good">Good (Working with normal wear)</option>
                      <option value="Fair">Fair (Needs scheduled service)</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">City / Mining Hub</label>
                    <input
                      type="text"
                      value={locationCity}
                      onChange={(e) => setLocationCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">District</label>
                    <input
                      type="text"
                      value={locationDistrict}
                      onChange={(e) => setLocationDistrict(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">State</label>
                    <select
                      value={locationState}
                      onChange={(e) => setLocationState(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SPECIFICATIONS */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Technical Specifications</h3>
                <p className="text-xs text-slate-400">Provide verified powertrain and payload metrics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Engine Make & Model</label>
                  <input
                    type="text"
                    value={engineMakeModel}
                    onChange={(e) => setEngineMakeModel(e.target.value)}
                    placeholder="e.g. Cat C6.4 / Cummins 6BT / Ashok Leyland H-Series"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Engine Power Rating</label>
                  <input
                    type="text"
                    value={enginePowerHp}
                    onChange={(e) => setEnginePowerHp(e.target.value)}
                    placeholder="e.g. 150 HP @ 1800 RPM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Operating Weight (Metric Tons)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={operatingWeightTons}
                    onChange={(e) => setOperatingWeightTons(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Bucket / Box / Payload Capacity</label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 1.2 m³ Rock Bucket / 16 m³ Tipper Box"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric Motor Driven</option>
                    <option value="Dual">Dual Fuel</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Chassis / Serial No.</label>
                  <input
                    type="text"
                    value={chassisSerialNumber}
                    onChange={(e) => setChassisSerialNumber(e.target.value)}
                    placeholder="e.g. CAT0320DPG099182"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PRICE & COMMERCIALS */}
          {currentStep === 5 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Pricing & Settlement Terms</h3>
                <p className="text-xs text-slate-400">
                  Set asking price and private reserve. Note: Minimum Acceptable Price is never disclosed to buyers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Price Format</label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Negotiable">Negotiable (Offers Accepted)</option>
                    <option value="Fixed">Fixed Price</option>
                    <option value="Price on Request">Price on Request</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Public Asking Price (₹)</label>
                  <input
                    type="number"
                    value={askingPriceRs}
                    onChange={(e) => setAskingPriceRs(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-amber-400 font-medium block mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private Minimum Price (₹)</span>
                  </label>
                  <input
                    type="number"
                    value={minimumAcceptablePriceRs}
                    onChange={(e) => setMinimumAcceptablePriceRs(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Strictly confidential; used by RZ® to filter lowball offers.
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Payment & Milestone Terms</label>
                  <textarea
                    rows={2}
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={financeAvailable}
                    onChange={(e) => setFinanceAvailable(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Commercial Equipment Finance / Loan transfer assistance available for this machine</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: IMAGES & VIDEO */}
          {currentStep === 6 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Images & Walkaround Video</h3>
                <p className="text-xs text-slate-400">
                  Upload crisp photos covering front, rear, side, engine bay, cabin, and chassis plate.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Front View', 'Engine Bay', 'Cabin / Controls', 'Chassis / Serial'].map((label, idx) => (
                  <div
                    key={label}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 h-36"
                  >
                    <Upload className="w-5 h-5 text-amber-400" />
                    <div className="font-bold text-white text-[11px]">{label}</div>
                    <span className="text-[10px] text-slate-500">Image Attached</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Video Walkaround Link (YouTube / Cloud)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 7: DOCUMENTS */}
          {currentStep === 7 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Document Verification Checklist</h3>
                <p className="text-xs text-slate-400">
                  Check all verified documents available for immediate physical inspection and buyer transfer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { label: 'Original RC Book (Smart Card)', val: hasRc, set: setHasRc },
                  { label: 'Commercial Comprehensive Insurance', val: hasInsurance, set: setHasInsurance },
                  { label: 'Commercial Fitness Certificate (FC)', val: hasFitness, set: setHasFitness },
                  { label: 'Pollution Under Control (PUC)', val: hasPollution, set: setHasPollution },
                  { label: 'RTO Form 29 & 30 + Clear NOC', val: hasNoc, set: setHasNoc },
                  { label: 'Authorized OEM Service History', val: hasServiceRecords, set: setHasServiceRecords }
                ].map((doc) => (
                  <label
                    key={doc.label}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700"
                  >
                    <span className="text-white font-medium">{doc.label}</span>
                    <input
                      type="checkbox"
                      checked={doc.val}
                      onChange={(e) => doc.set(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: REVIEW & CONFIRM */}
          {currentStep === 8 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Review Listing Preview</h3>
                <p className="text-xs text-slate-400">
                  Confirm all details before publishing to the RZ® Used Machinery Marketplace.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <div>
                    <div className="font-mono text-amber-400 text-[10px] font-bold">{category} &bull; {equipmentType}</div>
                    <div className="text-sm font-black text-white">{title || `${brand} ${model} (${year})`}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">Asking Price</div>
                    <div className="text-base font-black text-white font-mono">
                      ₹{(askingPriceRs / 100000).toFixed(2)} Lakh
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
                  <div>Brand: <span className="text-white font-bold">{brand}</span></div>
                  <div>Year: <span className="text-white font-bold">{year}</span></div>
                  <div>Usage: <span className="text-white font-bold">{usageValue} {usageType}</span></div>
                  <div>Condition: <span className="text-emerald-400 font-bold">{condition}</span></div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 text-[11px]">
                  <span className="text-slate-500">Location: </span>
                  {locationCity}, {locationDistrict}, {locationState}
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-amber-300 text-xs">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  By publishing, you agree to allow prospective buyers to schedule certified RZ® physical surveyor inspections.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER CONTROLS */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentStep === 1
                ? 'opacity-40 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 8 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>PUBLISH LISTING</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
