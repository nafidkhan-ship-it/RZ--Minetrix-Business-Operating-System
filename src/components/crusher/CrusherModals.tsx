import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  Layers,
  Activity,
  DollarSign,
  Scale,
  ShoppingBag,
  Truck,
  CheckCircle2,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import {
  CrusherPlant,
  CrusherPartner,
  CrusherInvestment,
  MaterialReceipt,
  CrusherProduction,
  CrusherProduct,
  CrusherStockItem,
  CrusherSale,
  CrusherGateEntry,
  CrusherGatePass,
  CrusherExpense,
  CrusherPartnerSettlement,
  CrusherType,
  RawMaterialType
} from '../../data/crusherStudioData';

// -------------------------------------------------------------
// 1. NEW CRUSHER PLANT MODAL
// -------------------------------------------------------------
interface NewCrusherPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plant: Partial<CrusherPlant>) => void;
}

export const NewCrusherPlantModal: React.FC<NewCrusherPlantModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [tab, setTab] = useState<'BASIC' | 'TECHNICAL' | 'PRODUCTS' | 'COMPLIANCE'>('BASIC');
  const [formData, setFormData] = useState({
    name: '',
    businessName: 'RZ Minetrix Aggregates & Sand LLP',
    location: '',
    district: 'Kasaragod',
    state: 'Kerala',
    contactPerson: '',
    contactPhone: '',
    plantType: '3-Stage Multi-Plant (Jaw + Cone + VSI)' as CrusherType,
    capacityTPH: 250,
    machineCount: 5,
    connectedPowerKW: 650,
    permitNumber: '',
    permitType: 'KSPCB Consent to Operate',
    permitExpiryDate: '2028-12-31'
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    'M-Sand (Concrete)',
    'P-Sand (Plastering)',
    '20mm Aggregate',
    '12mm Down',
    '6mm Grit',
    'Rock Dust'
  ]);

  if (!isOpen) return null;

  const toggleProduct = (prod: string) => {
    setSelectedProducts(prev =>
      prev.includes(prod) ? prev.filter(p => p !== prod) : [...prev, prod]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      code: `CP-${Date.now().toString().slice(-4)}`,
      mainProducts: selectedProducts,
      status: 'OPERATIONAL',
      capacityUnit: 'TPH (Tons Per Hour)',
      installedDate: new Date().toISOString().split('T')[0],
      permitStatus: 'VALID',
      todayProductionTons: 0,
      monthProductionTons: 0,
      rawMaterialStockTons: 1500,
      finishedProductStockTons: 3200,
      machineDetails: [
        'Primary Jaw Crusher (Heavy Duty)',
        'Secondary Cone Crusher',
        'VSI Sand Making Station',
        'Multi-Deck Vibrating Screens'
      ],
      partnerNames: ['Managing Partner'],
      partnerCount: 1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                STUDIO PREVIEW &bull; CRUSHER MASTER
              </span>
              <h2 className="text-lg font-black text-white">Register New Crusher Plant</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-2 gap-2 text-xs font-semibold">
          {[
            { id: 'BASIC', label: '1. Basic Info' },
            { id: 'TECHNICAL', label: '2. Plant & Machinery' },
            { id: 'PRODUCTS', label: '3. Products Manufactured' },
            { id: 'COMPLIANCE', label: '4. Permits & Pollution' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`pb-2.5 px-3 border-b-2 transition ${
                tab === t.id
                  ? 'border-cyan-400 text-cyan-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {tab === 'BASIC' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Crusher Plant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasaragod High-Tech Blue Metal & VSI Complex"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Business Name / Entity</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Location / Industrial Zone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Badiadka Mining Belt, Kasaragod"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Plant Incharge"
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 9447..."
                    value={formData.contactPhone}
                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'TECHNICAL' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Crusher Plant Architecture *</label>
                <select
                  value={formData.plantType}
                  onChange={e => setFormData({ ...formData, plantType: e.target.value as CrusherType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Jaw Crusher">Jaw Crusher (Primary Coarse Crushing)</option>
                  <option value="Cone Crusher">Cone Crusher (Secondary Crushing Station)</option>
                  <option value="VSI (Vertical Shaft Impactor)">VSI (Vertical Shaft Impactor - Sand Maker)</option>
                  <option value="Impact Crusher">Impact Crusher (Horizontal Shaft)</option>
                  <option value="3-Stage Multi-Plant (Jaw + Cone + VSI)">3-Stage Multi-Plant (Jaw + Cone + VSI Integrated)</option>
                  <option value="Sand Washing Plant">Sand Washing & Hydrocyclone Plant</option>
                  <option value="Other / Custom">Other Custom Aggregates Setup</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Design Capacity (TPH) *</label>
                  <input
                    type="number"
                    value={formData.capacityTPH}
                    onChange={e => setFormData({ ...formData, capacityTPH: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Tons Per Hour</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Major Machines Count</label>
                  <input
                    type="number"
                    value={formData.machineCount}
                    onChange={e => setFormData({ ...formData, machineCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Connected Power (KW)</label>
                  <input
                    type="number"
                    value={formData.connectedPowerKW}
                    onChange={e => setFormData({ ...formData, connectedPowerKW: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">High-Tension Power Load</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-cyan-400">SCADA & Sensors Integration</span>
                <p className="text-xs text-slate-400">
                  Real-time belt scale telemetry, weighbridge RS232 synchronization, and silo level radar integration will be enabled automatically.
                </p>
              </div>
            </div>
          )}

          {tab === 'PRODUCTS' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                Select Finished Aggregates & Manufactured Sands Produced:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'M-Sand (Concrete)',
                  'P-Sand (Plastering)',
                  '20mm Aggregate',
                  '12mm Down',
                  '6mm Grit',
                  '40mm Ballast',
                  'GSB Sub-Base Mix',
                  'Rock Dust',
                  'Washed Sand',
                  'Armor Rock'
                ].map(p => {
                  const isChecked = selectedProducts.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => toggleProduct(p)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isChecked
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{p}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'COMPLIANCE' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Permit / CTO Number</label>
                  <input
                    type="text"
                    placeholder="e.g. PCB/KSD/CTO/2023/491"
                    value={formData.permitNumber}
                    onChange={e => setFormData({ ...formData, permitNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Permit Classification</label>
                  <input
                    type="text"
                    value={formData.permitType}
                    onChange={e => setFormData({ ...formData, permitType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Permit Expiry Date</label>
                <input
                  type="date"
                  value={formData.permitExpiryDate}
                  onChange={e => setFormData({ ...formData, permitExpiryDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Consent to Operate (CTO) must be renewed 60 days before expiration per PCB guidelines.</span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">RZ® MINETRIX CRUSHER SUITE</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Save Crusher Plant
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. ADD CRUSHER PARTNER MODAL (Independent from Quarry)
// -------------------------------------------------------------
interface AddCrusherPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Partial<CrusherPartner>) => void;
}

export const AddCrusherPartnerModal: React.FC<AddCrusherPartnerModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    panNumber: '',
    bankDetails: '',
    totalInvestment: 5000000,
    ownershipPercent: 25.0,
    profitSharePercent: 25.0,
    lossSharePercent: 25.0,
    isAlsoQuarryPartner: false,
    isAlsoVehicleOwner: false,
    isAlsoLandOwner: false,
    isAlsoSupplier: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleTags: string[] = ['Crusher Partner'];
    if (formData.isAlsoQuarryPartner) roleTags.push('Quarry Partner');
    if (formData.isAlsoVehicleOwner) roleTags.push('Vehicle Owner');
    if (formData.isAlsoLandOwner) roleTags.push('Land Owner');
    if (formData.isAlsoSupplier) roleTags.push('Supplier');

    onSave({
      ...formData,
      status: 'ACTIVE',
      revenueSharePercent: formData.profitSharePercent,
      expenseSharePercent: formData.profitSharePercent,
      capitalContributed: formData.totalInvestment,
      profitPaidToDate: 0,
      currentOutstandingPayable: 0,
      assignedPlantIds: ['CP-01'],
      assignedPlantNames: ['Kasaragod High-Tech Blue Metal & VSI Complex'],
      roleTags,
      effectiveDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                INDEPENDENT PARTNERSHIP ARCHITECTURE
              </span>
              <h2 className="text-lg font-black text-white">Add Crusher Plant Partner</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-300 text-xs flex items-center gap-2.5">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong>Crucial Rule:</strong> Crusher partnership is legally & operationally independent from Quarry partnership. A person may be a Crusher Partner only, Quarry Partner only, or both.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Partner Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Farooq Ahmed"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98450..."
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="partner@minetrix.demo"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">PAN Card Number</label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Settlement Bank Details</label>
            <input
              type="text"
              placeholder="Bank Name, Account Number, IFSC Code"
              value={formData.bankDetails}
              onChange={e => setFormData({ ...formData, bankDetails: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Capital Investment (₹)</label>
              <input
                type="number"
                value={formData.totalInvestment}
                onChange={e => setFormData({ ...formData, totalInvestment: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Ownership Ratio (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.ownershipPercent}
                onChange={e => setFormData({ ...formData, ownershipPercent: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Profit Share Ratio (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.profitSharePercent}
                onChange={e => setFormData({ ...formData, profitSharePercent: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Can differ from equity %</span>
            </div>
          </div>

          {/* Multi-role Flags */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block">Cross-Platform Roles (Shared Person Profile):</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAlsoQuarryPartner}
                  onChange={e => setFormData({ ...formData, isAlsoQuarryPartner: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Also Quarry Partner</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAlsoVehicleOwner}
                  onChange={e => setFormData({ ...formData, isAlsoVehicleOwner: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Also Vehicle / Tipper Owner</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAlsoLandOwner}
                  onChange={e => setFormData({ ...formData, isAlsoLandOwner: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Also Land Owner</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAlsoSupplier}
                  onChange={e => setFormData({ ...formData, isAlsoSupplier: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Also Raw Material Supplier</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Save Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. MATERIAL RECEIPT MODAL (Quarry to Crusher Traceability)
// -------------------------------------------------------------
interface NewMaterialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (receipt: Partial<MaterialReceipt>) => void;
}

export const NewMaterialReceiptModal: React.FC<NewMaterialReceiptModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    sourceQuarryName: 'Kasaragod North Laterite Pit #01',
    sourceWorkingArea: 'Bench A - North Face',
    supplierName: 'RZ Minetrix Natural Resources Concession',
    material: 'Hard Rock Boulder' as RawMaterialType,
    vehicleNumber: 'KL-14-AC-9901',
    driverName: 'Moideen Kunhi',
    driverPhone: '+91 94471 88123',
    weighbridgeGrossTons: 39.5,
    weighbridgeTareTons: 14.5,
    ratePerTon: 340,
    referenceChallanNo: 'CH-KSD-8820',
    qualityGrade: 'Grade A Hard Granite' as any
  });

  if (!isOpen) return null;

  const netWeight = Math.max(0, formData.weighbridgeGrossTons - formData.weighbridgeTareTons);
  const totalAmount = netWeight * formData.ratePerTon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      receiptNumber: `CR-RCPT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      crusherPlantId: 'CP-01',
      crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
      quantityTons: netWeight,
      unit: 'Tons',
      weighbridgeNetTons: netWeight,
      moistureDeductionPercent: 0,
      payableNetTons: netWeight,
      totalAmount,
      weighbridgeSlipNo: `WB-CR-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Accepted',
      receivedBy: 'Gopal Naik (Weighbridge Incharge)'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                QUARRY → CRUSHER WEIGHBRIDGE RECEIPT
              </span>
              <h2 className="text-lg font-black text-white">Record Raw Material Inward</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quarry Selector */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Source Quarry & Mining Concession</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Own Quarry Transfer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Source Quarry *</label>
                <select
                  value={formData.sourceQuarryName}
                  onChange={e => setFormData({ ...formData, sourceQuarryName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Kasaragod North Laterite Pit #01">Kasaragod North Laterite Pit #01</option>
                  <option value="Manjeshwar Granite Quarry Pit #02">Manjeshwar Granite Quarry Pit #02</option>
                  <option value="Malabar Mining & Stone Supplies (External)">Malabar Mining (External Quarry)</option>
                  <option value="Direct Market Supplier">Direct Market Supplier</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Quarry Working Area</label>
                <input
                  type="text"
                  value={formData.sourceWorkingArea}
                  onChange={e => setFormData({ ...formData, sourceWorkingArea: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Raw Material Grade *</label>
              <select
                value={formData.material}
                onChange={e => setFormData({ ...formData, material: e.target.value as RawMaterialType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Hard Rock Boulder">Hard Rock Boulder (Blue Granite)</option>
                <option value="Granite Run-of-Mine">Granite Run-of-Mine (Pit Blasted)</option>
                <option value="Laterite Ballast">Laterite Ballast</option>
                <option value="Overburden / GSB Feed">Overburden / GSB Feed</option>
                <option value="River Gravel">River Gravel</option>
                <option value="Quarry Spalls">Quarry Spalls</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Quality Inspection</label>
              <select
                value={formData.qualityGrade}
                onChange={e => setFormData({ ...formData, qualityGrade: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Grade A Hard Granite">Grade A Hard Granite (High Compressive)</option>
                <option value="Grade B Trap Rock">Grade B Trap Rock</option>
                <option value="Laterite Spalls">Laterite Spalls</option>
                <option value="Sub-grade (High Dust)">Sub-grade (High Dust / GSB Feed)</option>
              </select>
            </div>
          </div>

          {/* Vehicle & Weighbridge */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-300 block">Weighbridge Dual Gross/Tare Measurement:</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Gross (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weighbridgeGrossTons}
                  onChange={e => setFormData({ ...formData, weighbridgeGrossTons: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tare (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weighbridgeTareTons}
                  onChange={e => setFormData({ ...formData, weighbridgeTareTons: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-cyan-400 font-bold block mb-1">Net Weight</label>
                <div className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-2 text-xs font-mono font-black text-cyan-400">
                  {netWeight.toFixed(2)} MT
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Vehicle No *</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleNumber}
                  onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Driver Name</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Rate Per Ton (₹)</label>
                <input
                  type="number"
                  value={formData.ratePerTon}
                  onChange={e => setFormData({ ...formData, ratePerTon: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-400 block mb-1">Total Valuation</label>
                <div className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono font-black text-emerald-400">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Accept Receipt & Generate Weighbridge Slip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. PRODUCTION ENTRY MODAL (Multiple Outputs Breakdown)
// -------------------------------------------------------------
interface NewProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prod: Partial<CrusherProduction>) => void;
}

export const NewProductionModal: React.FC<NewProductionModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [inputTons, setInputTons] = useState(800);
  const [shift, setShift] = useState<'Shift 1 (Day 07:00 - 15:30)' | 'Shift 2 (Evening 15:30 - 23:00)' | 'Shift 3 (Night Batch)'>('Shift 1 (Day 07:00 - 15:30)');
  const [operator, setOperator] = useState('Sunil Kumar (Chief Operator)');
  const [workingHours, setWorkingHours] = useState(7.5);
  const [powerUnits, setPowerUnits] = useState(3200);
  const [dieselLiters, setDieselLiters] = useState(105);

  // Percent outputs
  const [pct20mm, setPct20mm] = useState(45);
  const [pct12mm, setPct12mm] = useState(25);
  const [pct6mm, setPct6mm] = useState(15);
  const [pctDust, setPctDust] = useState(13);

  if (!isOpen) return null;

  const totalPct = pct20mm + pct12mm + pct6mm + pctDust;
  const wastagePct = Math.max(0, 100 - totalPct);
  const output20mm = (inputTons * pct20mm) / 100;
  const output12mm = (inputTons * pct12mm) / 100;
  const output6mm = (inputTons * pct6mm) / 100;
  const outputDust = (inputTons * pctDust) / 100;
  const totalOutput = output20mm + output12mm + output6mm + outputDust;
  const wastageTons = inputTons - totalOutput;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      productionNumber: `PRD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      shift,
      plantId: 'CP-01',
      plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
      rawMaterialType: 'Hard Rock Boulder',
      inputQuantityTons: inputTons,
      outputs: [
        { productCode: 'AGG-20MM', productName: '20mm Aggregate', quantityTons: output20mm, percentageOfOutput: pct20mm, siloAllocation: 'Hopper 1' },
        { productCode: 'AGG-12MM', productName: '12mm Blue Metal', quantityTons: output12mm, percentageOfOutput: pct12mm, siloAllocation: 'Hopper 2' },
        { productCode: 'AGG-6MM', productName: '6mm Grit', quantityTons: output6mm, percentageOfOutput: pct6mm, siloAllocation: 'Bunker 3' },
        { productCode: 'DUST-01', productName: 'Quarry Rock Dust', quantityTons: outputDust, percentageOfOutput: pctDust, siloAllocation: 'Cyclone Bin' }
      ],
      totalOutputTons: totalOutput,
      wastageTons,
      wastagePercent: wastagePct,
      operatorName: operator,
      primaryCrusherUnit: 'Jaw + Cone + VSI Stream 1',
      workingHours,
      powerUnitsConsumedKWh: powerUnits,
      dieselConsumedLiters: dieselLiters,
      crushingEfficiencyTPH: +(totalOutput / workingHours).toFixed(1),
      notes: 'Operational batch completed with screen calibration.',
      status: 'VERIFIED'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                CRUSHER PRODUCTION BATCH
              </span>
              <h2 className="text-lg font-black text-white">Log Daily Crushing Production</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Input Boulders (Tons) *</label>
              <input
                type="number"
                required
                value={inputTons}
                onChange={e => setInputTons(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold text-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Operational Shift</label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Shift 1 (Day 07:00 - 15:30)">Shift 1 (Day 07:00 - 15:30)</option>
                <option value="Shift 2 (Evening 15:30 - 23:00)">Shift 2 (Evening 15:30 - 23:00)</option>
                <option value="Shift 3 (Night Batch)">Shift 3 (Night Batch)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Plant Operator</label>
              <input
                type="text"
                value={operator}
                onChange={e => setOperator(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Multiple Finished Product Output Percentages */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">Multi-Deck Screen Output Split (%)</span>
              <span className={`text-xs font-mono font-bold ${totalPct <= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                Total: {totalPct}% (Wastage: {wastagePct}%)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">20mm Aggregate</span>
                <input
                  type="number"
                  value={pct20mm}
                  onChange={e => setPct20mm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono mt-1"
                />
                <span className="text-[11px] font-mono text-cyan-400 block mt-1">{output20mm} MT</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">12mm Down</span>
                <input
                  type="number"
                  value={pct12mm}
                  onChange={e => setPct12mm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono mt-1"
                />
                <span className="text-[11px] font-mono text-cyan-400 block mt-1">{output12mm} MT</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">6mm Grit</span>
                <input
                  type="number"
                  value={pct6mm}
                  onChange={e => setPct6mm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono mt-1"
                />
                <span className="text-[11px] font-mono text-cyan-400 block mt-1">{output6mm} MT</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Rock Dust</span>
                <input
                  type="number"
                  value={pctDust}
                  onChange={e => setPctDust(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono mt-1"
                />
                <span className="text-[11px] font-mono text-cyan-400 block mt-1">{outputDust} MT</span>
              </div>
            </div>
          </div>

          {/* Machine & Energy Usage */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Working Hours</label>
              <input
                type="number"
                step="0.5"
                value={workingHours}
                onChange={e => setWorkingHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Electricity (kWh)</label>
              <input
                type="number"
                value={powerUnits}
                onChange={e => setPowerUnits(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Diesel Consumed (L)</label>
              <input
                type="number"
                value={dieselLiters}
                onChange={e => setDieselLiters(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Total Production: {totalOutput} MT &bull; Yield: {((totalOutput / inputTons) * 100).toFixed(1)}%
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Save Production Batch
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. CRUSHER END-TO-END WORKFLOW & TRACEABILITY MODAL
// -------------------------------------------------------------
interface EndToEndWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateStep?: (stepId: string) => void;
}

export const EndToEndWorkflowModal: React.FC<EndToEndWorkflowModalProps> = ({
  isOpen,
  onClose,
  onNavigateStep
}) => {
  if (!isOpen) return null;

  const STEPS = [
    {
      num: '01',
      title: 'Quarry Pit Mining',
      desc: 'Blasting & sorting raw boulders in Pit #01 Bench A',
      nav: 'quarry-management',
      category: 'QUARRY'
    },
    {
      num: '02',
      title: 'Raw Material Haulage',
      desc: 'Tipper loading with gross weight dispatch note',
      nav: 'raw-material',
      category: 'LOGISTICS'
    },
    {
      num: '03',
      title: 'Crusher Gate Entry',
      desc: 'Inward security timestamp and initial vehicle check',
      nav: 'gate-entry',
      category: 'GATE'
    },
    {
      num: '04',
      title: 'Weighbridge Material Receipt',
      desc: 'Dual gross/tare recording and quality inspection',
      nav: 'material-receipt',
      category: 'INTAKE'
    },
    {
      num: '05',
      title: '3-Stage Crushing & Screening',
      desc: 'Jaw primary -> Cone secondary -> VSI sand shaping',
      nav: 'production',
      category: 'OPERATIONS'
    },
    {
      num: '06',
      title: 'Silo & Stockpile Storage',
      desc: 'Automated silo radar level and stock reconciliation',
      nav: 'stock',
      category: 'INVENTORY'
    },
    {
      num: '07',
      title: 'Customer Commercial Order',
      desc: 'Order booking for M-Sand, 20mm & plastering sand',
      nav: 'sales',
      category: 'COMMERCE'
    },
    {
      num: '08',
      title: 'Dispatch & Digital Gate Pass',
      desc: 'Outgoing weighbridge slip, QR code gate pass issuance',
      nav: 'gate-pass',
      category: 'DISPATCH'
    },
    {
      num: '09',
      title: 'Independent Partner Settlement',
      desc: 'Separate Crusher P&L calculation and dividend payout',
      nav: 'partner-settlement',
      category: 'FINANCE'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                END-TO-END WORKFLOW & RELATIONSHIP MODEL
              </span>
              <h2 className="text-lg font-black text-white">Quarry → Crusher → Sales Pipeline</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Model Banner */}
          <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-2">
              CORE INDUSTRY RELATIONSHIP
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-white">
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-400">QUARRY PIT</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">RAW BOULDERS</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">CRUSHER PLANT</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-blue-400">SILO STOCK</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400">SALES & DISPATCH</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-purple-400">CUSTOMER SITE</span>
            </div>
          </div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STEPS.map(s => (
              <div
                key={s.num}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition group cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  if (onNavigateStep) onNavigateStep(s.nav);
                  onClose();
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black text-cyan-400">{s.num}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                      {s.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition mb-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
                  <span>Open Section</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>

          {/* Independent Partner & Party Architecture Note */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Independent Entity & Multi-Role Person Architecture</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crusher plants maintain completely separate legal partnerships, capital accounts, expense ledgers, and profit shares from quarry entities. The RZ Minetrix party layer unifies the human profile so a person (e.g. Ramesh Shetty) can simultaneously exist as a Quarry Partner, Crusher Partner, Tipper Owner, or Commercial Customer without cross-mingling accounts.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20"
          >
            Close Interactive Guide
          </button>
        </div>
      </div>
    </div>
  );
};
