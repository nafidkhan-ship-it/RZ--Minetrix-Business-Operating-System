import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Navigation,
  FileText,
  DollarSign,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  MapPin,
  Fuel,
  ArrowUpDown
} from 'lucide-react';
import {
  Vehicle,
  VehicleType,
  VehicleStatus,
  VehicleOwner
} from '../../data/vehicleStudioData';

interface VehicleListViewProps {
  vehicles: Vehicle[];
  owners: VehicleOwner[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenNewVehicleModal: () => void;
  onOpenQuickTripModal?: (vehicle: Vehicle) => void;
  onOpenFinanceModal?: (vehicle: Vehicle) => void;
  onSelectOwner?: (owner: VehicleOwner) => void;
}

export const VehicleListView: React.FC<VehicleListViewProps> = ({
  vehicles,
  owners,
  onSelectVehicle,
  onOpenNewVehicleModal,
  onOpenQuickTripModal,
  onOpenFinanceModal,
  onSelectOwner
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [complianceFilter, setComplianceFilter] = useState<string>('ALL');
  const [financeFilter, setFinanceFilter] = useState<string>('ALL');

  // Filter logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vehicleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.currentDriverName && v.currentDriverName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || v.vehicleType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesOwner =
      ownerFilter === 'ALL' || v.owners.some((o) => o.ownerId === ownerFilter);

    const hasExpiringOrExpired = Object.values(v.compliance).some(
      (c: any) => c.status === 'Expiring Soon' || c.status === 'Expired'
    );
    const matchesCompliance =
      complianceFilter === 'ALL' ||
      (complianceFilter === 'EXPIRING' && hasExpiringOrExpired) ||
      (complianceFilter === 'VALID' && !hasExpiringOrExpired);

    const matchesFinance =
      financeFilter === 'ALL' ||
      (financeFilter === 'FINANCED' && v.finance.hasFinance) ||
      (financeFilter === 'PAID_OFF' && !v.finance.hasFinance);

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesOwner &&
      matchesCompliance &&
      matchesFinance
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              FLEET REGISTRY &bull; {filteredVehicles.length} of {vehicles.length} VEHICLES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Commercial Vehicle Master Registry</h2>
          <p className="text-xs text-slate-400">
            Multi-owner equity configurations, statutory certificates, fastag tracking & maintenance logs
          </p>
        </div>

        <button
          onClick={onOpenNewVehicleModal}
          className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Vehicle</span>
        </button>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicle number, make, driver, code..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Vehicle Types</option>
              <option value="Tipper">Tipper</option>
              <option value="Truck">Truck</option>
              <option value="Lorry">Lorry</option>
              <option value="Pickup">Pickup</option>
              <option value="Trailer">Trailer</option>
              <option value="Tanker">Tanker</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Loading">Loading</option>
              <option value="Delivery">Delivery</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Owner Filter */}
          <div>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Owners</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.personName}
                </option>
              ))}
            </select>
          </div>

          {/* Compliance & Finance Status */}
          <div>
            <select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Compliance</option>
              <option value="VALID">All Documents Valid</option>
              <option value="EXPIRING">Expiring / Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* VEHICLE LIST TABLE (All mandatory columns) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Vehicle Number</th>
                <th className="py-3.5 px-3">Type & Make</th>
                <th className="py-3.5 px-3">Owner(s) & Share</th>
                <th className="py-3.5 px-3">Driver</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Current Location</th>
                <th className="py-3.5 px-3">Fuel</th>
                <th className="py-3.5 px-3">Compliance</th>
                <th className="py-3.5 px-3">Finance</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <Truck className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-60" />
                    <div className="text-sm font-bold text-slate-400">No vehicles match the selected criteria</div>
                    <p className="text-xs text-slate-500 mt-1">Adjust filters or click + New Vehicle to add to registry.</p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const hasExpiringPermit =
                    vehicle.compliance.permit.status === 'Expiring Soon' ||
                    vehicle.compliance.permit.status === 'Expired';
                  const hasExpiringInsurance =
                    vehicle.compliance.insurance.status === 'Expiring Soon' ||
                    vehicle.compliance.insurance.status === 'Expired';
                  const hasExpiringPollution =
                    vehicle.compliance.pollution.status === 'Expired';

                  return (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-slate-800/40 transition group cursor-pointer"
                      onClick={() => onSelectVehicle(vehicle)}
                    >
                      {/* Vehicle Number & Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-black text-xs shrink-0">
                            {vehicle.vehicleCode}
                          </div>
                          <div>
                            <div className="font-mono font-bold text-white group-hover:text-blue-400 transition">
                              {vehicle.vehicleNumber}
                            </div>
                            <div className="text-[10px] text-slate-400">{vehicle.variant}</div>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle Type & Make */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-200">{vehicle.vehicleType}</div>
                        <div className="text-[10px] text-slate-400">
                          {vehicle.make} {vehicle.model}
                        </div>
                      </td>

                      {/* Owner(s) & Ownership % (Crucial module) */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          {vehicle.owners.map((owner) => (
                            <div
                              key={owner.id}
                              className="flex items-center gap-1.5 text-[11px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                const found = owners.find((o) => o.id === owner.ownerId);
                                if (found && onSelectOwner) onSelectOwner(found);
                              }}
                            >
                              <span className="font-medium text-amber-300 hover:underline">
                                {owner.ownerName}
                              </span>
                              <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {owner.ownershipPercent}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Assigned Driver */}
                      <td className="py-3.5 px-3">
                        {vehicle.currentDriverName ? (
                          <div>
                            <div className="font-medium text-slate-200">{vehicle.currentDriverName}</div>
                            <div className="text-[10px] text-slate-400">Driver Active</div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            vehicle.status === 'On Trip'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : vehicle.status === 'Available'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : vehicle.status === 'Maintenance'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{vehicle.status}</span>
                        </span>
                      </td>

                      {/* Current Location */}
                      <td className="py-3.5 px-3 max-w-[180px]">
                        <div className="text-[11px] text-slate-300 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{vehicle.currentLocation}</span>
                        </div>
                      </td>

                      {/* Fuel */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Fuel className="w-3 h-3 text-cyan-400" />
                          <span className="text-white">{vehicle.fuelLevelPercent}%</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{vehicle.avgMileageKmpL} km/L</div>
                      </td>

                      {/* Compliance Status Badges */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          <span
                            title={`Insurance: ${vehicle.compliance.insurance.status}`}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                              hasExpiringInsurance
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            INS
                          </span>
                          <span
                            title={`Permit: ${vehicle.compliance.permit.status}`}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                              hasExpiringPermit
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            PRM
                          </span>
                          <span
                            title={`Pollution: ${vehicle.compliance.pollution.status}`}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                              hasExpiringPollution
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            PUC
                          </span>
                        </div>
                      </td>

                      {/* Finance */}
                      <td className="py-3.5 px-3">
                        {vehicle.finance.hasFinance ? (
                          <div>
                            <div className="font-mono text-emerald-400 text-[11px] font-bold">
                              ₹{vehicle.finance.emiAmount.toLocaleString()}/mo
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Bal: ₹{(vehicle.finance.outstandingAmount / 100000).toFixed(1)}L
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">Paid Off</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => onSelectVehicle(vehicle)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="View Vehicle Profile (22 Tabs)"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {onOpenQuickTripModal && (
                            <button
                              onClick={() => onOpenQuickTripModal(vehicle)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                              title="Create Trip for Vehicle"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onOpenFinanceModal && vehicle.finance.hasFinance && (
                            <button
                              onClick={() => onOpenFinanceModal(vehicle)}
                              className="p-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition"
                              title="Finance & EMI Details"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
