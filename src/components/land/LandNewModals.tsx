import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  DollarSign,
  FileText,
  MapPin,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Users,
  Compass,
  AlertCircle
} from 'lucide-react';
import {
  LandUnit,
  LandType,
  AgreementType,
  DEMO_LAND_OWNERS,
  DEMO_LAND_PARCELS,
  DEMO_LAND_AGREEMENTS,
  convertLandUnit
} from '../../data/quarryLandData';

// -------------------------------------------------------------
// 1. NEW LAND OWNER MODAL
// -------------------------------------------------------------
interface NewLandOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ownerName: string) => void;
}

export const NewLandOwnerModal: React.FC<NewLandOwnerModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Kasaragod');
  const [state, setState] = useState('Kerala');
  const [idDocRef, setIdDocRef] = useState('');
  const [bankName, setBankName] = useState('Canara Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branch, setBranch] = useState('');
  const [roles, setRoles] = useState<string[]>(['Land Owner']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSuccess(name);
    onClose();
  };

  const toggleRole = (r: string) => {
    if (roles.includes(r)) {
      setRoles(roles.filter((x) => x !== r));
    } else {
      setRoles([...roles, r]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-xs">
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">
              Platform 7 &bull; Shared Person Identity
            </div>
            <h3 className="text-base font-black text-white">Register Land Owner</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-[11px] text-purple-300">
            <strong>Rule:</strong> Land Ownership ≠ Quarry Partnership. Multiple roles can be assigned to the same person without creating duplicate profiles.
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Roles Held by Person</label>
            <div className="flex flex-wrap gap-2">
              {['Land Owner', 'Quarry Partner', 'Vehicle Owner', 'Crusher Partner', 'Investor'].map((role) => {
                const isSelected = roles.includes(role);
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. V. Prabhakar Pai"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Phone / WhatsApp</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94471 22890"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@domain.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">ID / PAN / Aadhaar Reference</label>
              <input
                type="text"
                value={idDocRef}
                onChange={(e) => setIdDocRef(e.target.value)}
                placeholder="PAN: ABCPP1234K or Aadhaar"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Postal / Residential Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House name, street, post office..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
            <div className="font-bold text-slate-200">Bank Details for Direct Payouts</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono"
              />
              <input
                type="text"
                placeholder="IFSC Code"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono uppercase"
              />
              <input
                type="text"
                placeholder="Branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              Register Land Owner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. NEW LAND PARCEL MODAL (With Multi-Owner % Share Support)
// -------------------------------------------------------------
interface NewLandParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (surveyNumber: string) => void;
  preselectedOwnerId?: string;
}

export const NewLandParcelModal: React.FC<NewLandParcelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedOwnerId
}) => {
  const [surveyNumber, setSurveyNumber] = useState('');
  const [subdivisionNumber, setSubdivisionNumber] = useState('');
  const [village, setVillage] = useState('Bare Village');
  const [localBody, setLocalBody] = useState('Pallikkara Grama Panchayat');
  const [taluk, setTaluk] = useState('Hosdurg');
  const [district, setDistrict] = useState('Kasaragod');
  const [state, setState] = useState('Kerala');
  const [extent, setExtent] = useState<number>(200);
  const [unit, setUnit] = useState<LandUnit>('Cent');
  const [landType, setLandType] = useState<LandType>('Laterite Hillock');
  const [selectedOwnerId, setSelectedOwnerId] = useState(preselectedOwnerId || DEMO_LAND_OWNERS[0]?.id || '');
  const [sharePercent, setSharePercent] = useState<number>(100);
  const [accessRoad, setAccessRoad] = useState('12m Tarred Haul Road');
  const [northBoundary, setNorthBoundary] = useState('');
  const [southBoundary, setSouthBoundary] = useState('');
  const [eastBoundary, setEastBoundary] = useState('');
  const [westBoundary, setWestBoundary] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyNumber.trim()) return;
    onSuccess(surveyNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-xs">
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">
              Cadastral Mapping & Multi-Owner Engine
            </div>
            <h3 className="text-base font-black text-white">Add New Land Parcel</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Owner Allocation */}
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Land Owner & Ownership Share Allocation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-400">Primary Owner</label>
                <select
                  value={selectedOwnerId}
                  onChange={(e) => setSelectedOwnerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                >
                  {DEMO_LAND_OWNERS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Share %</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={sharePercent}
                  onChange={(e) => setSharePercent(parseFloat(e.target.value) || 100)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Survey Number</label>
              <input
                type="text"
                required
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                placeholder="e.g. 412/1A"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Subdivision</label>
              <input
                type="text"
                value={subdivisionNumber}
                onChange={(e) => setSubdivisionNumber(e.target.value)}
                placeholder="e.g. 1A"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Extent</label>
              <input
                type="number"
                required
                value={extent}
                onChange={(e) => setExtent(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as LandUnit)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Cent">Cent</option>
                <option value="Acre">Acre</option>
                <option value="Hectare">Hectare</option>
                <option value="Sq.Ft">Sq.Ft</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Land Type</label>
              <select
                value={landType}
                onChange={(e) => setLandType(e.target.value as LandType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Laterite Hillock">Laterite Hillock</option>
                <option value="Granite Outcrop">Granite Outcrop</option>
                <option value="Basalt Hard Rock">Basalt Hard Rock</option>
                <option value="Agricultural / Dry Land">Agricultural / Dry Land</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Panchayat / Local Body</label>
              <input
                type="text"
                value={localBody}
                onChange={(e) => setLocalBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Access Road Description</label>
            <input
              type="text"
              value={accessRoad}
              onChange={(e) => setAccessRoad(e.target.value)}
              placeholder="e.g. 12m Tarred PWD Haul Road with heavy tipper turning bay"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* 4 Boundaries */}
          <div className="space-y-2 pt-1">
            <div className="font-bold text-slate-200">Four Boundary Demarcations</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="North Boundary"
                value={northBoundary}
                onChange={(e) => setNorthBoundary(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="South Boundary"
                value={southBoundary}
                onChange={(e) => setSouthBoundary(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="East Boundary"
                value={eastBoundary}
                onChange={(e) => setEastBoundary(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="West Boundary"
                value={westBoundary}
                onChange={(e) => setWestBoundary(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              Add Parcel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. NEW AGREEMENT BUILDER MODAL (4 Types Engine)
// -------------------------------------------------------------
interface NewAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (agrNumber: string) => void;
  preselectedOwnerId?: string;
  defaultType?: AgreementType;
}

export const NewAgreementModal: React.FC<NewAgreementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedOwnerId,
  defaultType = 'Mining & Return'
}) => {
  const [type, setType] = useState<AgreementType>(defaultType);
  const [selectedOwnerId, setSelectedOwnerId] = useState(preselectedOwnerId || DEMO_LAND_OWNERS[0]?.id || '');
  const [selectedParcelId, setSelectedParcelId] = useState(DEMO_LAND_PARCELS[0]?.id || '');
  const [quarryName, setQuarryName] = useState('Kasaragod Pit #01');
  const [material, setMaterial] = useState('Laterite Stone (Grade A)');
  const [extentCents, setExtentCents] = useState<number>(200);

  // Type 1: Purchase
  const [purchaseRatePerCent, setPurchaseRatePerCent] = useState<number>(250000);
  
  // Type 2: Mining & Return
  const [miningRatePerCent, setMiningRatePerCent] = useState<number>(160000);
  const [miningMonths, setMiningMonths] = useState<number>(36);
  const [returnCondition, setReturnCondition] = useState('Leveled to road grade (+1.5m) and graded with topsoil for replanting.');

  // Type 3: Per-Load
  const [ratePerLoad, setRatePerLoad] = useState<number>(5000);
  const [minCommitmentLoads, setMinCommitmentLoads] = useState<number>(400);

  // Type 4: Hybrid
  const [hybridBaseAnnual, setHybridBaseAnnual] = useState<number>(1200000);
  const [hybridPerLoadRate, setHybridPerLoadRate] = useState<number>(450);
  const [hybridDeposit, setHybridDeposit] = useState<number>(2500000);

  const [advanceAmount, setAdvanceAmount] = useState<number>(500000);
  const [paymentCycle, setPaymentCycle] = useState<'Per Load' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Lump Sum'>('Monthly');

  if (!isOpen) return null;

  // Calculate dynamic total value based on type
  let calculatedTotal = 0;
  if (type === 'Purchase') {
    calculatedTotal = extentCents * purchaseRatePerCent;
  } else if (type === 'Mining & Return') {
    calculatedTotal = extentCents * miningRatePerCent;
  } else if (type === 'Per-Load') {
    calculatedTotal = minCommitmentLoads * ratePerLoad;
  } else if (type === 'Hybrid') {
    calculatedTotal = hybridBaseAnnual + (1000 * hybridPerLoadRate);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const agrCode = `RZ-LND-2026-${type.substring(0, 3).toUpperCase()}-991`;
    onSuccess(agrCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-xs">
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">
              Quarry Land Agreement Engine & Commercial Builder
            </div>
            <h3 className="text-base font-black text-white">Create Land Agreement</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Agreement Type Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Select Agreement Model</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Purchase', 'Mining & Return', 'Per-Load', 'Hybrid'] as AgreementType[]).map((t) => {
                const isSelected = type === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`p-2.5 rounded-2xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{t}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parties & Parcel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold">Land Owner</label>
              <select
                value={selectedOwnerId}
                onChange={(e) => setSelectedOwnerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
              >
                {DEMO_LAND_OWNERS.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold">Land Parcel</label>
              <select
                value={selectedParcelId}
                onChange={(e) => setSelectedParcelId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
              >
                {DEMO_LAND_PARCELS.map((p) => (
                  <option key={p.id} value={p.id}>{p.surveyNumber} ({p.extent} {p.unit})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold">Extent (Cents)</label>
              <input
                type="number"
                value={extentCents}
                onChange={(e) => setExtentCents(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white font-mono"
              />
            </div>
          </div>

          {/* DYNAMIC COMMERCIAL FIELDS BASED ON TYPE */}
          {type === 'Purchase' && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="font-bold text-emerald-400">1. Land Purchase Commercial Terms</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300">Rate per Cent (₹)</label>
                  <input
                    type="number"
                    value={purchaseRatePerCent}
                    onChange={(e) => setPurchaseRatePerCent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">e.g. 1 Cent = ₹2.5 Lakh</span>
                </div>
                <div>
                  <label className="text-slate-300">Calculated Land Value</label>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                    ₹{(extentCents * purchaseRatePerCent).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'Mining & Return' && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="font-bold text-purple-400">2. Mining & Return Terms</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300">Agreed Rate per Cent (₹)</label>
                  <input
                    type="number"
                    value={miningRatePerCent}
                    onChange={(e) => setMiningRatePerCent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">e.g. 1 Cent = ₹1.6 Lakh</span>
                </div>
                <div>
                  <label className="text-slate-300">Concession Period (Months)</label>
                  <input
                    type="number"
                    value={miningMonths}
                    onChange={(e) => setMiningMonths(parseInt(e.target.value) || 24)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300">Restoration & Land Return Conditions</label>
                <textarea
                  rows={2}
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                />
              </div>
            </div>
          )}

          {type === 'Per-Load' && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="font-bold text-cyan-400">3. Per-Load Dispatch Terms</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300">Rate Per Load (₹)</label>
                  <input
                    type="number"
                    value={ratePerLoad}
                    onChange={(e) => setRatePerLoad(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">e.g. ₹5,000 per multi-axle tipper</span>
                </div>
                <div>
                  <label className="text-slate-300">Minimum Commitment Loads</label>
                  <input
                    type="number"
                    value={minCommitmentLoads}
                    onChange={(e) => setMinCommitmentLoads(parseInt(e.target.value) || 100)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'Hybrid' && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="font-bold text-yellow-400">4. Hybrid Custom Commercial Terms</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-300 text-[10px]">Base Annual (₹)</label>
                  <input
                    type="number"
                    value={hybridBaseAnnual}
                    onChange={(e) => setHybridBaseAnnual(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-[10px]">Royalty / MT or Load (₹)</label>
                  <input
                    type="number"
                    value={hybridPerLoadRate}
                    onChange={(e) => setHybridPerLoadRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-[10px]">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={hybridDeposit}
                    onChange={(e) => setHybridDeposit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Advances & Settlement Cycle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold">Advance Payment Committed (₹)</label>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-amber-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold">Payment Cadence</label>
              <select
                value={paymentCycle}
                onChange={(e) => setPaymentCycle(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Per Load">Per Load Dispatch</option>
                <option value="Weekly">Weekly Reconciliation</option>
                <option value="Monthly">Monthly Payout</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Lump Sum">Lump Sum Milestone</option>
              </select>
            </div>
          </div>

          {/* Total Preview */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-purple-400">Total Agreement Value</div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                ₹{calculatedTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              Advance: <span className="font-mono text-amber-400">₹{advanceAmount.toLocaleString('en-IN')}</span>
              <br />
              Balance: <span className="font-mono text-emerald-400">₹{Math.max(0, calculatedTotal - advanceAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              Create Agreement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. NEW ADVANCE / PAYMENT MODAL
// -------------------------------------------------------------
interface NewAdvancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ref: string) => void;
  mode: 'Advance' | 'Payment';
  preselectedOwnerId?: string;
}

export const NewAdvancePaymentModal: React.FC<NewAdvancePaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  preselectedOwnerId
}) => {
  const [selectedOwnerId, setSelectedOwnerId] = useState(preselectedOwnerId || DEMO_LAND_OWNERS[0]?.id || '');
  const [amount, setAmount] = useState<number>(mode === 'Advance' ? 200000 : 75000);
  const [paymentMethod, setPaymentMethod] = useState<'RTGS' | 'NEFT' | 'Cheque' | 'Cash' | 'UPI'>('RTGS');
  const [referenceNumber, setReferenceNumber] = useState(`RTGS/CNRB/${Date.now().toString().slice(-6)}`);
  const [notes, setNotes] = useState(mode === 'Advance' ? 'Mobilization advance' : 'Monthly load reconciliation');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(referenceNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-xs">
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">
              Financial Disbursements & Adjustments
            </div>
            <h3 className="text-base font-black text-white">{mode === 'Advance' ? 'Issue Owner Advance' : 'Record Payout'}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Land Owner</label>
            <select
              value={selectedOwnerId}
              onChange={(e) => setSelectedOwnerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              {DEMO_LAND_OWNERS.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Disbursement Amount (₹)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-base font-bold text-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="RTGS">RTGS</option>
                <option value="NEFT">NEFT</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash Voucher</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Bank Reference No</label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Voucher / Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              {mode === 'Advance' ? 'Issue Advance' : 'Confirm Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. CADASTRAL BOUNDARY MAP MODAL
// -------------------------------------------------------------
interface CadastralMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelCode?: string;
  surveyNumber?: string;
  extent?: string;
}

export const CadastralMapModal: React.FC<CadastralMapModalProps> = ({
  isOpen,
  onClose,
  parcelCode = 'LND-KL-412-1A',
  surveyNumber = 'Survey 412/1A',
  extent = '250 Cents (2.50 Acres)'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-xs">
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                Survey / Boundary Preview — Prototyped Cadastral Map
              </div>
              <h3 className="text-base font-black text-white">{surveyNumber} &bull; {extent}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Cadastral Polygon Canvas Simulation */}
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 h-72 flex flex-col items-center justify-center overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

            {/* Polygon SVG */}
            <svg className="w-full h-full relative z-10" viewBox="0 0 400 240">
              <polygon
                points="80,50 320,30 360,190 60,180"
                fill="rgba(168, 85, 247, 0.15)"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeDasharray="6,3"
              />
              {/* Benchmarks */}
              <circle cx="80" cy="50" r="5" fill="#10b981" />
              <text x="85" y="45" fill="#cbd5e1" fontSize="10" fontFamily="monospace">N-W Benchmark (BM-01)</text>

              <circle cx="320" cy="30" r="5" fill="#10b981" />
              <text x="325" y="30" fill="#cbd5e1" fontSize="10" fontFamily="monospace">N-E Cairn (BM-02)</text>

              <circle cx="360" cy="190" r="5" fill="#10b981" />
              <text x="310" y="210" fill="#cbd5e1" fontSize="10" fontFamily="monospace">S-E Benchmark (BM-03)</text>

              <circle cx="60" cy="180" r="5" fill="#10b981" />
              <text x="40" y="200" fill="#cbd5e1" fontSize="10" fontFamily="monospace">S-W Benchmark (BM-04)</text>

              {/* Haul Road Path */}
              <line x1="20" y1="220" x2="380" y2="220" stroke="#f59e0b" strokeWidth="4" />
              <text x="140" y="235" fill="#f59e0b" fontSize="10" fontWeight="bold">PWD 12m Tarred Haul Road</text>

              {/* Center Pit indicator */}
              <circle cx="210" cy="115" r="22" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="165" y="118" fill="#f43f5e" fontSize="9" fontWeight="bold">ACTIVE MINING PIT</text>
            </svg>

            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] text-purple-300 font-mono">
              FMB Sheet: 412/HSD/2023
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] text-emerald-400 font-mono">
              Area: 250 Cents &bull; Perimeter: 640m
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">North:</span>
              <span className="text-white font-medium">Rubber Plantation</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">South:</span>
              <span className="text-white font-medium">PWD 12m Haul Road</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">East:</span>
              <span className="text-white font-medium">Survey 412/2B Cairn</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">West:</span>
              <span className="text-white font-medium">Drainage Channel</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 text-[10px]">
              DGPS Surveyed by K. Balakrishnan (Licensed Surveyor #LR-412)
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-500 text-slate-950 font-bold hover:bg-purple-400 transition"
            >
              Close Cadastral Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
