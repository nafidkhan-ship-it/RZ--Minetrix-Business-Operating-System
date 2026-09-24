import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileText,
  Building2,
  Pickaxe,
  Truck,
  Users,
  DollarSign,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react';
import {
  QuarryItem,
  LandParcel,
  LandOwnerProfile,
  QuarryAgreement,
  WorkingArea,
  ProductionEntry,
  QuarryLoad,
  GatePassItem,
  QuarrySale,
  QuarryExpense,
  SettlementRecord,
  AgreementType,
  ExpenseCategory,
  SettlementType,
  QuarryMaterialType
} from '../../data/quarryStudioData';

// -------------------------------------------------------------
// 1. MULTI-SECTION NEW QUARRY MODAL
// -------------------------------------------------------------
interface NewQuarryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quarry: Partial<QuarryItem>) => void;
}

export const NewQuarryModal: React.FC<NewQuarryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [formData, setFormData] = useState({
    name: '',
    code: `QP-KL-${Math.floor(100 + Math.random() * 900)}`,
    businessName: 'RZ Minetrix Natural Resources LLP',
    location: '',
    district: 'Kasaragod',
    state: 'Kerala',
    contactPerson: '',
    contactPhone: '',
    status: 'ACTIVE' as const,
    material: 'Laterite' as QuarryMaterialType,
    secondaryMaterials: [] as QuarryMaterialType[],
    permitNumber: '',
    permitType: 'Quarrying Lease (Major Mineral)',
    permitIssueDate: new Date().toISOString().split('T')[0],
    permitExpiryDate: new Date(Date.now() + 5 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    totalLandAreaAcres: 10.0,
    activeWorkingAreaAcres: 6.0,
    dailyCapacity: '3,000 Cut Stones',
    partners: [
      {
        person: 'Managing Partner',
        investment: 3000000,
        ownershipPercent: 50,
        profitPercent: 50,
        lossPercent: 50,
        effectiveDate: new Date().toISOString().split('T')[0]
      }
    ]
  });

  if (!isOpen) return null;

  const handleAddPartner = () => {
    setFormData((prev) => ({
      ...prev,
      partners: [
        ...prev.partners,
        {
          person: '',
          investment: 1000000,
          ownershipPercent: 25,
          profitPercent: 25,
          lossPercent: 25,
          effectiveDate: new Date().toISOString().split('T')[0]
        }
      ]
    }));
  };

  const handleRemovePartner = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      partners: prev.partners.filter((_, i) => i !== index)
    }));
  };

  const handlePartnerChange = (index: number, field: string, value: any) => {
    const updated = [...formData.partners];
    (updated[index] as any)[field] = value;
    setFormData({ ...formData, partners: updated });
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: `Q-${Date.now()}`,
      workingAreasCount: 1,
      partnersCount: formData.partners.length,
      todayProduction: '0',
      monthProduction: '0',
      pitStock: '0',
      permitStatus: 'VALID'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Pickaxe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                QUARRY CREATION WIZARD &bull; MULTI-SECTION
              </span>
              <h2 className="text-lg font-black text-white">+ Register New Quarry Concession</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Steps Navigation */}
        <div className="grid grid-cols-5 border-b border-slate-800 bg-slate-950/60 text-xs text-center font-bold">
          {[
            { step: 1, label: '1. Basic Info' },
            { step: 2, label: '2. Quarry Type' },
            { step: 3, label: '3. Compliance' },
            { step: 4, label: '4. Operations' },
            { step: 5, label: '5. Partners' }
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step as any)}
              className={`py-3 px-2 transition border-b-2 ${
                activeStep === s.step
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinish} className="p-6 space-y-6">
          {/* SECTION 1: BASIC INFO */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Section 1: Concession Identification & Legal Entity
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Quarry Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasaragod South Laterite Concession #02"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Quarry ID / Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Operating Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Location / Village *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Badiadka, Kasaragod"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">District *</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. K. Mohan Kumar"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 94471 28911"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: QUARRY TYPE */}
          {activeStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Section 2: Primary Geological Material & Commodity
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['Laterite', 'Hard Rock', 'Granite', 'Aggregate', 'Other'] as QuarryMaterialType[]).map((mat) => {
                  const selected = formData.material === mat;
                  return (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setFormData({ ...formData, material: mat })}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        selected
                          ? 'border-amber-400 bg-amber-500/10 text-white shadow-lg'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-white mb-1">{mat}</div>
                      <div className="text-[11px] text-slate-400">
                        {mat === 'Laterite' && 'Building cut stones, laterite clay & red blocks'}
                        {mat === 'Hard Rock' && 'Blue metal, basalt rock for crushers & foundation'}
                        {mat === 'Granite' && 'Dimension granite slabs, boulders & road base'}
                        {mat === 'Aggregate' && 'Crushed 20mm, 40mm, GSB, WMM & M-Sand'}
                        {mat === 'Other' && 'Gravel, silica sand, filling earth & sub-base'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: PERMIT / COMPLIANCE */}
          {activeStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Section 3: Department of Mining & Geology Permits
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Permit / Lease Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DMG/KSD/QL/2026/044"
                    value={formData.permitNumber}
                    onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Permit Type</label>
                  <select
                    value={formData.permitType}
                    onChange={(e) => setFormData({ ...formData, permitType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Quarrying Lease (Major Mineral)">Quarrying Lease (Major Mineral)</option>
                    <option value="Minor Mineral Quarrying Permit">Minor Mineral Quarrying Permit</option>
                    <option value="Laterite Extraction Concession">Laterite Extraction Concession</option>
                    <option value="Environmental Clearance (SEIAA)">Environmental Clearance (SEIAA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Issue Date</label>
                  <input
                    type="date"
                    value={formData.permitIssueDate}
                    onChange={(e) => setFormData({ ...formData, permitIssueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.permitExpiryDate}
                    onChange={(e) => setFormData({ ...formData, permitExpiryDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 border-dashed text-center">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <div className="text-white font-bold">Attach Mining Permit / Environmental NOC</div>
                <div className="text-[11px] text-slate-500">PDF, JPG, PNG up to 25MB (Demo simulation)</div>
              </div>
            </div>
          )}

          {/* SECTION 4: OPERATIONAL INFORMATION */}
          {activeStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Section 4: Land Extents & Planned Production Yield
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Total Land Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.totalLandAreaAcres}
                    onChange={(e) =>
                      setFormData({ ...formData, totalLandAreaAcres: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Active Working Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.activeWorkingAreaAcres}
                    onChange={(e) =>
                      setFormData({ ...formData, activeWorkingAreaAcres: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Daily Production Capacity</label>
                  <input
                    type="text"
                    value={formData.dailyCapacity}
                    onChange={(e) => setFormData({ ...formData, dailyCapacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Operating Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE (Fully Operational)</option>
                    <option value="UNDER_DEVELOPMENT">UNDER_DEVELOPMENT</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: PARTNERS (Configured Independently) */}
          {activeStep === 5 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Section 5: Quarry Partners
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Investment %, Ownership %, Profit %, and Loss % must be configurable independently.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPartner}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1 hover:bg-amber-500/30 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Partner</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.partners.map((partner, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Partner #{idx + 1}</span>
                      {formData.partners.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePartner(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-400 mb-0.5">Person / Legal Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nafid Khan"
                          value={partner.person}
                          onChange={(e) => handlePartnerChange(idx, 'person', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Investment (₹)</label>
                        <input
                          type="number"
                          value={partner.investment}
                          onChange={(e) =>
                            handlePartnerChange(idx, 'investment', parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Ownership %</label>
                        <input
                          type="number"
                          value={partner.ownershipPercent}
                          onChange={(e) =>
                            handlePartnerChange(idx, 'ownershipPercent', parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Profit %</label>
                        <input
                          type="number"
                          value={partner.profitPercent}
                          onChange={(e) =>
                            handlePartnerChange(idx, 'profitPercent', parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Loss %</label>
                        <input
                          type="number"
                          value={partner.lossPercent}
                          onChange={(e) =>
                            handlePartnerChange(idx, 'lossPercent', parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  &larr; Previous Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>

              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev + 1) as any)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                >
                  Next Step &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  Confirm & Create Quarry
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. ADD LAND PARCEL MODAL
// -------------------------------------------------------------
export const AddParcelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (parcel: Partial<LandParcel>) => void;
  owners: LandOwnerProfile[];
  quarries: QuarryItem[];
}> = ({ isOpen, onClose, onSave, owners, quarries }) => {
  const [form, setForm] = useState({
    quarryId: quarries[0]?.id || 'Q-01',
    surveyNumber: '',
    subdivision: 'Sub-Division 1',
    ownerId: owners[0]?.id || 'LO-01',
    extent: 3.5,
    unit: 'Acres' as const,
    northBoundary: '',
    southBoundary: '',
    eastBoundary: '',
    westBoundary: '',
    location: '',
    status: 'ACTIVE_MINING' as const
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selOwner = owners.find((o) => o.id === form.ownerId);
    onSave({
      id: `LP-${Date.now().toString().slice(-4)}`,
      quarryId: form.quarryId,
      surveyNumber: form.surveyNumber,
      subdivision: form.subdivision,
      ownerId: form.ownerId,
      ownerName: selOwner?.name || 'Owner',
      extent: form.extent,
      unit: form.unit,
      boundaries: {
        north: form.northBoundary || 'Village Path',
        south: form.southBoundary || 'Adjacent Farmland',
        east: form.eastBoundary || 'Haul Road',
        west: form.westBoundary || 'Quarry Bench'
      },
      location: form.location || 'North Sector Pit',
      status: form.status,
      documentsCount: 1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">LAND DEPT</span>
              <h3 className="text-lg font-black text-white">+ Add Land Parcel</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Quarry Assignment *</label>
              <select
                value={form.quarryId}
                onChange={(e) => setForm({ ...form, quarryId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {quarries.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Registered Land Owner *</label>
              <select
                value={form.ownerId}
                onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.totalParcels} existing parcels)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Survey Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 414/2B"
                value={form.surveyNumber}
                onChange={(e) => setForm({ ...form, surveyNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Subdivision</label>
              <input
                type="text"
                value={form.subdivision}
                onChange={(e) => setForm({ ...form, subdivision: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Extent (Area) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.extent}
                onChange={(e) => setForm({ ...form, extent: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                <option value="Acres">Acres</option>
                <option value="Cents">Cents</option>
                <option value="Hectares">Hectares</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-bold text-slate-300 block text-[11px]">Boundary Details</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <input
                type="text"
                placeholder="North: e.g. Survey 412"
                value={form.northBoundary}
                onChange={(e) => setForm({ ...form, northBoundary: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
              />
              <input
                type="text"
                placeholder="South: e.g. Taluk Road"
                value={form.southBoundary}
                onChange={(e) => setForm({ ...form, southBoundary: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
              />
              <input
                type="text"
                placeholder="East: e.g. Stream Buffer"
                value={form.eastBoundary}
                onChange={(e) => setForm({ ...form, eastBoundary: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
              />
              <input
                type="text"
                placeholder="West: e.g. Haul Road"
                value={form.westBoundary}
                onChange={(e) => setForm({ ...form, westBoundary: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
            >
              Save Land Parcel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. ADD LAND OWNER MODAL (Reusable Person Profile)
// -------------------------------------------------------------
export const AddLandOwnerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (owner: Partial<LandOwnerProfile>) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    panNumber: '',
    bankDetails: '',
    isAlsoPartner: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `LO-${Date.now().toString().slice(-4)}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      panNumber: form.panNumber,
      bankDetails: form.bankDetails,
      totalParcels: 0,
      totalQuarryAreaAcres: 0,
      agreementCount: 0,
      loadCount: 0,
      advancePaid: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      isAlsoPartner: form.isAlsoPartner
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                REUSABLE PERSON PROFILE
              </span>
              <h3 className="text-lg font-black text-white">+ Register Land Owner</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Smt. Kamala Pai"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Contact Phone *</label>
              <input
                type="text"
                required
                placeholder="+91 98450 11223"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="owner@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">PAN Number</label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={form.panNumber}
                onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono uppercase"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAlsoPartner}
                  onChange={(e) => setForm({ ...form, isAlsoPartner: e.target.checked })}
                  className="rounded border-slate-800 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300 font-semibold">Also a Quarry Partner?</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Address</label>
            <input
              type="text"
              placeholder="e.g. Village, Taluk, District"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Bank Account & IFSC (for Royalty Transfers)</label>
            <input
              type="text"
              placeholder="e.g. Canara Bank A/c 0142..., IFSC: CNRB0000142"
              value={form.bankDetails}
              onChange={(e) => setForm({ ...form, bankDetails: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
            >
              Register Person
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. NEW AGREEMENT MODAL (Land Purchase, Mining & Return, Per Load, Hybrid)
// -------------------------------------------------------------
export const NewAgreementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (agreement: Partial<QuarryAgreement>) => void;
  quarries: QuarryItem[];
  owners: LandOwnerProfile[];
  parcels: LandParcel[];
}> = ({ isOpen, onClose, onSave, quarries, owners, parcels }) => {
  const [type, setType] = useState<AgreementType>('Per Load');
  const [quarryId, setQuarryId] = useState(quarries[0]?.id || 'Q-01');
  const [ownerId, setOwnerId] = useState(owners[0]?.id || 'LO-01');
  const [material, setMaterial] = useState<QuarryMaterialType>('Laterite');
  const [selectedParcelIds, setSelectedParcelIds] = useState<string[]>([parcels[0]?.id || 'LP-101']);
  const [ratePerLoad, setRatePerLoad] = useState(600);
  const [loadUnit, setLoadUnit] = useState('Lorry Load (approx 100 Stones)');
  const [purchaseRate, setPurchaseRate] = useState(1800000);
  const [totalAmount, setTotalAmount] = useState(7200000);
  const [agreedMiningAmount, setAgreedMiningAmount] = useState(1800000);
  const [miningPeriodMonths, setMiningPeriodMonths] = useState(36);
  const [returnCondition, setReturnCondition] = useState('Land leveled and topsoil restored');
  const [customRules, setCustomRules] = useState('Base royalty ₹45/MT + ₹1,00,000 monthly minimum guarantee');
  const [advance, setAdvance] = useState(500000);
  const [paymentCycle, setPaymentCycle] = useState<'Per Load' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Lump Sum'>('Monthly');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selQuarry = quarries.find((q) => q.id === quarryId);
    const selOwner = owners.find((o) => o.id === ownerId);
    const selSurveys = parcels
      .filter((p) => selectedParcelIds.includes(p.id))
      .map((p) => p.surveyNumber)
      .join(', ');

    onSave({
      id: `AGR-${Date.now().toString().slice(-4)}`,
      agreementNumber: `RZ-AGR-${selQuarry?.district.slice(0, 3).toUpperCase() || 'PIT'}-${Math.floor(100 + Math.random() * 900)}`,
      quarryId,
      quarryName: selQuarry?.name || 'Quarry',
      type,
      ownerId,
      ownerName: selOwner?.name || 'Land Owner',
      parcelIds: selectedParcelIds,
      parcelSurveys: selSurveys || 'Survey 412/1A',
      material,
      extentAcres: 5.0,
      ratePerLoad,
      loadUnit,
      purchaseRatePerAcre: purchaseRate,
      totalAmount,
      agreedMiningAmount,
      miningPeriodMonths,
      returnCondition,
      customRules,
      advanceAmount: advance,
      paidAmount: advance,
      balanceAmount: totalAmount - advance,
      paymentCycle,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'ACTIVE',
      documents: ['Executed_Agreement_Notarized.pdf']
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">LEGAL & CONCESSION</span>
              <h3 className="text-lg font-black text-white">+ Create Land Agreement</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Agreement Type Picker */}
          <div>
            <label className="block text-slate-300 mb-1.5 font-bold">Agreement Archetype *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Per Load', 'Mining & Return', 'Land Purchase', 'Hybrid / Custom'] as AgreementType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                    type === t
                      ? 'border-amber-400 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Quarry Concession</label>
              <select
                value={quarryId}
                onChange={(e) => setQuarryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {quarries.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Land Owner *</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Fields based on Agreement Type */}
          {type === 'Per Load' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-bold text-amber-400 block text-[11px]">Type C: Per Load Royalty Rules</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Rate Per Load (₹) *</label>
                  <input
                    type="number"
                    value={ratePerLoad}
                    onChange={(e) => setRatePerLoad(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Load Unit</label>
                  <input
                    type="text"
                    value={loadUnit}
                    onChange={(e) => setLoadUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Payment Cycle</label>
                  <select
                    value={paymentCycle}
                    onChange={(e) => setPaymentCycle(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Per Load">Per Load Direct</option>
                    <option value="Weekly">Weekly Statement</option>
                    <option value="Monthly">Monthly Cycle</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === 'Mining & Return' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-bold text-amber-400 block text-[11px]">Type B: Mining & Return Conditions</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Total Agreed Mining Amount (₹)</label>
                  <input
                    type="number"
                    value={agreedMiningAmount}
                    onChange={(e) => setAgreedMiningAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Mining Period (Months)</label>
                  <input
                    type="number"
                    value={miningPeriodMonths}
                    onChange={(e) => setMiningPeriodMonths(parseInt(e.target.value, 10) || 12)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Land Return Condition</label>
                <input
                  type="text"
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          )}

          {type === 'Land Purchase' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-bold text-amber-400 block text-[11px]">Type A: Land Purchase Agreement</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Purchase Rate Per Acre (₹)</label>
                  <input
                    type="number"
                    value={purchaseRate}
                    onChange={(e) => setPurchaseRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Total Consideration Amount (₹)</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'Hybrid / Custom' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-bold text-amber-400 block text-[11px]">Type D: Custom / Tiered Rules</span>
              <div>
                <label className="block text-slate-300 mb-1">Custom Terms & Formula</label>
                <textarea
                  rows={2}
                  value={customRules}
                  onChange={(e) => setCustomRules(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Initial Advance Payment (₹)</label>
              <input
                type="number"
                value={advance}
                onChange={(e) => setAdvance(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Material Extracted</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                <option value="Laterite">Laterite Stones</option>
                <option value="Hard Rock">Hard Rock / Granite</option>
                <option value="Aggregate">Aggregate & Road Metal</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
            >
              Execute Agreement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. PRODUCTION ENTRY MODAL
// -------------------------------------------------------------
export const ProductionEntryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<ProductionEntry>) => void;
  quarries: QuarryItem[];
  workingAreas: WorkingArea[];
}> = ({ isOpen, onClose, onSave, quarries, workingAreas }) => {
  const [quarryId, setQuarryId] = useState(quarries[0]?.id || 'Q-01');
  const [workingAreaId, setWorkingAreaId] = useState(workingAreas[0]?.id || 'WA-01');
  const [material, setMaterial] = useState<QuarryMaterialType>('Laterite');
  const [quantity, setQuantity] = useState(1200);
  const [unit, setUnit] = useState<'Stones' | 'MT' | 'CFT'>('Stones');
  const [shift, setShift] = useState<'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'General Shift'>('Shift A (06:00 - 14:00)');
  const [operator, setOperator] = useState('Raju Wire-Saw Gang');
  const [excavatorId, setExcavatorId] = useState('CAT-320D-01');
  const [notes, setNotes] = useState('High Density Laterite Stone Cuts 12x8x6 in');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selQ = quarries.find((q) => q.id === quarryId);
    const selWA = workingAreas.find((w) => w.id === workingAreaId);

    onSave({
      id: `PRD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quarryId,
      quarryName: selQ?.name || 'Quarry',
      workingAreaId,
      workingAreaName: selWA?.name || 'Bench A',
      material,
      quantity,
      unit,
      shift,
      operator,
      excavatorId,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Pickaxe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">PIT EXTRACTION</span>
              <h3 className="text-lg font-black text-white">+ Production Daily Entry</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Quarry</label>
              <select
                value={quarryId}
                onChange={(e) => setQuarryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {quarries.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Working Area Bench</label>
              <select
                value={workingAreaId}
                onChange={(e) => setWorkingAreaId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {workingAreas.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Material</label>
              <select
                value={material}
                onChange={(e) => {
                  const m = e.target.value as QuarryMaterialType;
                  setMaterial(m);
                  if (m === 'Laterite') setUnit('Stones');
                  else setUnit('MT');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                <option value="Laterite">Laterite Stone</option>
                <option value="Hard Rock">Hard Rock</option>
                <option value="Granite">Granite Block</option>
                <option value="Aggregate">Aggregate</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Quantity Cut / Extracted *</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                <option value="Stones">Stones</option>
                <option value="MT">MT (Tonne)</option>
                <option value="CFT">CFT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                <option value="General Shift">General Shift</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Operator / Team</label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Notes & Cut Quality</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
            >
              Record Production
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. NEW LOAD MODAL (Traceable to Quarry -> Working Area -> Parcel -> Owner -> Agreement -> Vehicle -> Customer)
// -------------------------------------------------------------
export const NewLoadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (load: Partial<QuarryLoad>) => void;
  quarries: QuarryItem[];
  workingAreas: WorkingArea[];
}> = ({ isOpen, onClose, onSave, quarries, workingAreas }) => {
  const [quarryId, setQuarryId] = useState(quarries[0]?.id || 'Q-01');
  const [workingAreaId, setWorkingAreaId] = useState(workingAreas[0]?.id || 'WA-01');
  const [material, setMaterial] = useState<QuarryMaterialType>('Laterite');
  const [quantity, setQuantity] = useState(120);
  const [vehicleNumber, setVehicleNumber] = useState('KL-14-AC-8912');
  const [driverName, setDriverName] = useState('Mustafa K.');
  const [driverPhone, setDriverPhone] = useState('+91 94478 12340');
  const [customerName, setCustomerName] = useState('Sobha Builders Kasaragod');
  const [destination, setDestination] = useState('Sobha Sapphire Villa Project');
  const [ratePerUnit, setRatePerUnit] = useState(54);
  const [status, setStatus] = useState<any>('Ready');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selQ = quarries.find((q) => q.id === quarryId);
    const selWA = workingAreas.find((w) => w.id === workingAreaId);

    const loadNo = `LOAD-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    onSave({
      id: `LD-${Date.now().toString().slice(-4)}`,
      loadNumber: loadNo,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quarryId,
      quarryName: selQ?.name || 'Quarry',
      workingAreaId,
      workingAreaName: selWA?.name || 'Bench A',
      parcelId: selWA?.parcelIds[0] || 'LP-101',
      parcelSurvey: selWA?.parcelSurveys || '412/1A',
      agreementId: selWA?.agreementIds[0] || 'AGR-2023-01',
      agreementNumber: selWA?.agreementNumbers || 'RZ-AGR-001',
      ownerId: selWA?.ownerIds[0] || 'LO-01',
      ownerName: selWA?.ownerNames || 'Shri V. Prabhakar Pai',
      material,
      quantity,
      unit: material === 'Laterite' ? 'Stones' : 'MT',
      vehicleNumber,
      driverName,
      driverPhone,
      customerName,
      destination,
      ratePerUnit,
      totalAmount: quantity * ratePerUnit,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                LOAD DISPATCH ENGINE &bull; TRACEABLE
              </span>
              <h3 className="text-lg font-black text-white">+ Create Quarry Load</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Traceability chain preview */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
            <span className="text-amber-400 font-bold">Quarry</span> &rarr;
            <span className="text-white">Working Area</span> &rarr;
            <span className="text-white">Parcel</span> &rarr;
            <span className="text-cyan-400 font-bold">Owner Royalty</span> &rarr;
            <span className="text-emerald-400 font-bold">Vehicle / Sale</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Quarry Source *</label>
              <select
                value={quarryId}
                onChange={(e) => setQuarryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {quarries.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Working Area Face *</label>
              <select
                value={workingAreaId}
                onChange={(e) => setWorkingAreaId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {workingAreas.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.ownerNames})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Material</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                <option value="Laterite">Laterite Stone</option>
                <option value="Hard Rock">Hard Rock</option>
                <option value="Granite">Granite</option>
                <option value="Aggregate">Aggregate</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Quantity *</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Rate / Unit (₹) *</label>
              <input
                type="number"
                required
                value={ratePerUnit}
                onChange={(e) => setRatePerUnit(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Vehicle Registration Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. KL-14-AC-8912"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Driver Name & Phone</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Mustafa K."
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="+91..."
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sobha Builders"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Destination Site</label>
              <input
                type="text"
                placeholder="Vidyanagar Kasaragod"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-400">Total Billing Value:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm ml-2">
                ₹{(quantity * ratePerUnit).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-400">Initial Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
              >
                <option value="Ready">Ready</option>
                <option value="Draft">Draft</option>
                <option value="Gate Pass Issued">Gate Pass Issued</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
            >
              Register Load
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. EXPENSE ENTRY MODAL
// -------------------------------------------------------------
export const ExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (exp: Partial<QuarryExpense>) => void;
  quarries: QuarryItem[];
}> = ({ isOpen, onClose, onSave, quarries }) => {
  const [quarryId, setQuarryId] = useState(quarries[0]?.id || 'Q-01');
  const [category, setCategory] = useState<ExpenseCategory>('Labour');
  const [amount, setAmount] = useState(15000);
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Cash' | 'Petty Cash' | 'Cheque'>('Bank Transfer');
  const [description, setDescription] = useState('Daily stone cutter wages for Bench A & B');
  const [referenceNumber, setReferenceNumber] = useState('UPI-REF-992140');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selQ = quarries.find((q) => q.id === quarryId);
    onSave({
      id: `EXP-${Date.now().toString().slice(-4)}`,
      voucherNumber: `VOUCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      quarryId,
      quarryName: selQ?.name || 'Quarry',
      category,
      amount,
      paymentMethod,
      description,
      attachmentName: 'Invoice_Challan.pdf',
      referenceNumber,
      approvedBy: 'K. Mohan Kumar'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">FINANCIAL LEDGER</span>
              <h3 className="text-lg font-black text-white">+ Record Quarry Expense</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Quarry Concession</label>
              <select
                value={quarryId}
                onChange={(e) => setQuarryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {quarries.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Category (10 Categories)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                {(
                  [
                    'Labour',
                    'Fuel',
                    'Machinery',
                    'Maintenance',
                    'Electricity',
                    'Permit',
                    'Transport',
                    'Land Owner',
                    'Partner',
                    'Other'
                  ] as ExpenseCategory[]
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              >
                <option value="Bank Transfer">Bank Transfer / UPI</option>
                <option value="Cash">Cash</option>
                <option value="Petty Cash">Petty Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Description / Particulars *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Reference / UTR Number</label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
            >
              Record Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
