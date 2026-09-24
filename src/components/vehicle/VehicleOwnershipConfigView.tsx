import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Scale,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Truck
} from 'lucide-react';
import {
  Vehicle,
  VehicleOwner,
  VehicleOwnershipConfig
} from '../../data/vehicleStudioData';

interface VehicleOwnershipConfigViewProps {
  vehicles: Vehicle[];
  owners?: VehicleOwner[];
  onSaveOwnershipConfig?: (vehicleId: string, updatedOwners: VehicleOwnershipConfig[]) => void;
  onSaveRatios?: (vehicleId: string, updatedOwners: VehicleOwnershipConfig[]) => void;
}

export const VehicleOwnershipConfigView: React.FC<VehicleOwnershipConfigViewProps> = ({
  vehicles,
  owners = [],
  onSaveOwnershipConfig,
  onSaveRatios
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Local state for editing ownership structure
  const [editableConfigs, setEditableConfigs] = useState<VehicleOwnershipConfig[]>(
    selectedVehicle?.owners || []
  );

  const handleVehicleChange = (vId: string) => {
    setSelectedVehicleId(vId);
    const v = vehicles.find((item) => item.id === vId);
    if (v) {
      setEditableConfigs([...v.owners]);
      setSaveSuccess(false);
    }
  };

  const handleUpdateField = (index: number, field: keyof VehicleOwnershipConfig, value: any) => {
    const updated = [...editableConfigs];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEditableConfigs(updated);
    setSaveSuccess(false);
  };

  const handleAddOwnerToVehicle = () => {
    const newConfig: VehicleOwnershipConfig = {
      id: `voc-${Date.now()}`,
      vehicleId: selectedVehicle?.id || 'V-01',
      vehicleNumber: selectedVehicle?.vehicleNumber || 'KL-14-V-4088',
      ownerId: owners[0]?.id || 'vo-01',
      ownerName: owners[0]?.personName || 'New Partner',
      ownershipPercent: 0,
      investmentAmount: 0,
      capitalAmount: 0,
      revenuePercent: 0,
      expensePercent: 0,
      profitPercent: 0,
      lossPercent: 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      agreementNumber: `AGR-RZ-${Date.now().toString().slice(-4)}`,
      agreementStatus: 'ACTIVE',
      formulaNotes: 'Custom syndicate ratio agreement'
    };
    setEditableConfigs([...editableConfigs, newConfig]);
    setSaveSuccess(false);
  };

  const handleRemoveOwner = (index: number) => {
    if (editableConfigs.length <= 1) return;
    const updated = editableConfigs.filter((_, i) => i !== index);
    setEditableConfigs(updated);
    setSaveSuccess(false);
  };

  const totalOwnershipPercent = editableConfigs.reduce((acc, c) => acc + (Number(c.ownershipPercent) || 0), 0);
  const totalRevenuePercent = editableConfigs.reduce((acc, c) => acc + (Number(c.revenuePercent) || 0), 0);
  const totalExpensePercent = editableConfigs.reduce((acc, c) => acc + (Number(c.expensePercent) || 0), 0);
  const totalProfitPercent = editableConfigs.reduce((acc, c) => acc + (Number(c.profitPercent) || 0), 0);

  const handleSave = () => {
    if (onSaveOwnershipConfig && selectedVehicle) {
      onSaveOwnershipConfig(selectedVehicle.id, editableConfigs);
    }
    if (onSaveRatios && selectedVehicle) {
      onSaveRatios(selectedVehicle.id, editableConfigs);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              MULTIPLE OWNER SYNDICATE ENGINE &bull; 1, 2, 3+ CO-OWNERS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Vehicle Ownership & Ratio Configuration</h2>
          <p className="text-xs text-slate-400">
            Independent configuration of ownership %, capital, revenue %, expense %, profit % and loss %
          </p>
        </div>

        {/* Vehicle Selector */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-mono uppercase">Select Commercial Vehicle</div>
            <select
              value={selectedVehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="mt-0.5 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} ({v.vehicleCode}) - {v.owners.length} Co-Owners
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Explanatory Banner (Item 9) */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white font-semibold">
            RZ MINETRIX Flexible Multi-Owner Commercial Model:
          </strong>
          <p className="text-amber-200/90 leading-relaxed text-[11px]">
            Unlike rigid commercial software that forces equity = profit share, RZ MINETRIX accommodates real-world mining transport partnerships: an owner may invest 50% capital, hold 30% legal RC title, receive 40% gross revenue, bear 25% maintenance, and take 50% net profit according to formal lease/partnership agreements.
          </p>
        </div>
      </div>

      {/* Configuration Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              <span>Co-Owners Matrix for {selectedVehicle?.vehicleNumber}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {editableConfigs.length} configured ownership stakeholders on this asset
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddOwnerToVehicle}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Add Co-Owner</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Matrix</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ownership configuration saved successfully to Studio Demo Model!</span>
          </div>
        )}

        {/* Dynamic Co-Owner Cards */}
        <div className="space-y-4">
          {editableConfigs.map((config, idx) => (
            <div
              key={config.id || idx}
              className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <select
                      value={config.ownerId}
                      onChange={(e) => {
                        const oId = e.target.value;
                        const matched = owners.find((o) => o.id === oId);
                        handleUpdateField(idx, 'ownerId', oId);
                        if (matched) handleUpdateField(idx, 'ownerName', matched.personName);
                      }}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                    >
                      {owners.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.personName} ({o.companyName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Effective:</span>
                  <input
                    type="date"
                    value={config.effectiveDate}
                    onChange={(e) => handleUpdateField(idx, 'effectiveDate', e.target.value)}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                  {editableConfigs.length > 1 && (
                    <button
                      onClick={() => handleRemoveOwner(idx)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                      title="Remove Owner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Ratios Input Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono">Title Ownership %</label>
                  <input
                    type="number"
                    value={config.ownershipPercent}
                    onChange={(e) => handleUpdateField(idx, 'ownershipPercent', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono">Capital Invested (₹)</label>
                  <input
                    type="number"
                    value={config.investmentAmount}
                    onChange={(e) => handleUpdateField(idx, 'investmentAmount', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono">Revenue Share %</label>
                  <input
                    type="number"
                    value={config.revenuePercent}
                    onChange={(e) => handleUpdateField(idx, 'revenuePercent', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-cyan-400 font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono">Expense Share %</label>
                  <input
                    type="number"
                    value={config.expensePercent}
                    onChange={(e) => handleUpdateField(idx, 'expensePercent', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-rose-400 font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono">Profit Share %</label>
                  <input
                    type="number"
                    value={config.profitPercent}
                    onChange={(e) => handleUpdateField(idx, 'profitPercent', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono">Loss Share %</label>
                  <input
                    type="number"
                    value={config.lossPercent}
                    onChange={(e) => handleUpdateField(idx, 'lossPercent', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-400 font-mono font-bold text-xs"
                  />
                </div>
              </div>

              {/* Formula & Legal Agreement Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Legal Agreement / Contract Reference</label>
                  <input
                    type="text"
                    value={config.agreementNumber}
                    onChange={(e) => handleUpdateField(idx, 'agreementNumber', e.target.value)}
                    placeholder="e.g. AGR-RZ-2024-001"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Formula Rule / Partnership Condition</label>
                  <input
                    type="text"
                    value={config.formulaNotes || ''}
                    onChange={(e) => handleUpdateField(idx, 'formulaNotes', e.target.value)}
                    placeholder="e.g. Fixed 40% net revenue after diesel deduction"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Validation Footers */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-slate-500 text-[10px] block">Total Title Equity:</span>
              <span className={`text-sm font-bold ${totalOwnershipPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalOwnershipPercent}% {totalOwnershipPercent === 100 ? '✓ Balanced' : '⚠️ Adjust to 100%'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block">Total Profit Share:</span>
              <span className={`text-sm font-bold ${totalProfitPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalProfitPercent}% {totalProfitPercent === 100 ? '✓ Balanced' : '⚠️ Custom'}
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-sans transition flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Syndicate Config</span>
          </button>
        </div>
      </div>
    </div>
  );
};
