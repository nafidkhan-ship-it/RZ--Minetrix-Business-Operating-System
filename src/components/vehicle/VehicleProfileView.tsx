import React, { useState } from 'react';
import {
  Truck,
  Users,
  Navigation,
  Layers,
  Clock,
  Fuel,
  CreditCard,
  DollarSign,
  Wrench,
  Disc,
  ShieldCheck,
  FileText,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ArrowRight,
  ExternalLink,
  Printer,
  Download,
  Scale
} from 'lucide-react';
import {
  Vehicle,
  VehicleOwner,
  Driver,
  Trip,
  VehicleLoad,
  Delivery,
  DriverBattaRecord,
  FuelRecord,
  TollRecord,
  MaintenanceRecord,
  TyreRecord,
  OwnerSettlementRecord,
  VehicleDocument
} from '../../data/vehicleStudioData';

interface VehicleProfileViewProps {
  vehicle: Vehicle;
  owners: VehicleOwner[];
  drivers: Driver[];
  trips: Trip[];
  loads: VehicleLoad[];
  deliveries: Delivery[];
  battas: DriverBattaRecord[];
  fuels: FuelRecord[];
  tolls: TollRecord[];
  maintenances: MaintenanceRecord[];
  tyres: TyreRecord[];
  settlements: OwnerSettlementRecord[];
  documents: VehicleDocument[];
  onBack: () => void;
  onSelectOwner?: (owner: VehicleOwner) => void;
  onCreateOttTask?: (msg: string) => void;
}

export type VehicleProfileTab =
  | 'overview'
  | 'ownership'
  | 'drivers'
  | 'trips'
  | 'loads'
  | 'delivery'
  | 'fuel'
  | 'toll'
  | 'batta'
  | 'maintenance'
  | 'tyres'
  | 'insurance'
  | 'tax'
  | 'permit'
  | 'fitness'
  | 'pollution'
  | 'finance'
  | 'trip-accounts'
  | 'pnl'
  | 'settlement'
  | 'documents'
  | 'reports';

export const VehicleProfileView: React.FC<VehicleProfileViewProps> = ({
  vehicle,
  owners,
  drivers,
  trips,
  loads,
  deliveries,
  battas,
  fuels,
  tolls,
  maintenances,
  tyres,
  settlements,
  documents,
  onBack,
  onSelectOwner,
  onCreateOttTask
}) => {
  const [activeTab, setActiveTab] = useState<VehicleProfileTab>('overview');

  // Filter vehicle-specific data
  const vehicleTrips = trips.filter((t) => t.vehicleId === vehicle.id || t.vehicleNumber === vehicle.vehicleNumber);
  const vehicleLoads = loads.filter((l) => l.vehicleNumber === vehicle.vehicleNumber);
  const vehicleDeliveries = deliveries.filter((d) => d.vehicleNumber === vehicle.vehicleNumber);
  const vehicleBattas = battas.filter((b) => b.vehicleNumber === vehicle.vehicleNumber);
  const vehicleFuels = fuels.filter((f) => f.vehicleId === vehicle.id || f.vehicleNumber === vehicle.vehicleNumber);
  const vehicleTolls = tolls.filter((t) => t.vehicleNumber === vehicle.vehicleNumber);
  const vehicleMaintenances = maintenances.filter((m) => m.vehicleNumber === vehicle.vehicleNumber);
  const vehicleTyres = tyres.filter((ty) => ty.vehicleNumber === vehicle.vehicleNumber);
  const vehicleSettlements = settlements.filter((s) => s.vehicleNumber === vehicle.vehicleNumber || s.vehicleCode === vehicle.vehicleCode);
  const vehicleDocuments = documents.filter((d) => d.vehicleNumber === vehicle.vehicleNumber);

  // Exact 22 tabs per Specification Item 7
  const PROFILE_TABS: { id: VehicleProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Truck },
    { id: 'ownership', label: 'Ownership', icon: Users },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'trips', label: 'Trips', icon: Navigation },
    { id: 'loads', label: 'Loads', icon: Layers },
    { id: 'delivery', label: 'Delivery', icon: Clock },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'toll', label: 'Toll', icon: CreditCard },
    { id: 'batta', label: 'Batta', icon: DollarSign },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'tyres', label: 'Tyres', icon: Disc },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'tax', label: 'Tax', icon: FileText },
    { id: 'permit', label: 'Permit', icon: FileText },
    { id: 'fitness', label: 'Fitness', icon: CheckCircle2 },
    { id: 'pollution', label: 'Pollution', icon: AlertTriangle },
    { id: 'finance', label: 'Finance', icon: TrendingUp },
    { id: 'trip-accounts', label: 'Trip Accounts', icon: DollarSign },
    { id: 'pnl', label: 'P&L', icon: BarChart3 },
    { id: 'settlement', label: 'Settlement', icon: Scale },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Vehicle Master Registry</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
            Studio Preview / Demo Data
          </span>
          {onCreateOttTask && (
            <button
              onClick={() => onCreateOttTask(`Vehicle Inspection & Routine Check: ${vehicle.vehicleNumber}`)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs transition border border-amber-500/20 cursor-pointer"
            >
              Create OTT Task
            </button>
          )}
        </div>
      </div>

      {/* VEHICLE PROFILE HEADER (Specification item 7) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 font-mono font-black text-lg">
              {vehicle.vehicleCode}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-white font-mono">{vehicle.vehicleNumber}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {vehicle.vehicleType}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    vehicle.status === 'On Trip'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : vehicle.status === 'Available'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {vehicle.make} {vehicle.model} &bull; {vehicle.variant} &bull; Mfgr {vehicle.manufacturingYear} &bull; Capacity {vehicle.capacity} {vehicle.capacityUnit}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
            <div>
              <div className="text-slate-500 text-[10px] uppercase font-mono">Assigned Driver</div>
              <div className="font-bold text-white mt-0.5">{vehicle.currentDriverName || 'None'}</div>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <div className="text-slate-500 text-[10px] uppercase font-mono">Current Location</div>
              <div className="font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span className="truncate max-w-[150px]">{vehicle.currentLocation}</span>
              </div>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <div className="text-slate-500 text-[10px] uppercase font-mono">Active Trip</div>
              <div className="font-bold text-blue-400 mt-0.5">{vehicle.currentTripId || 'Depot Standby'}</div>
            </div>
          </div>
        </div>

        {/* Ownership Summary Banner in Header */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Configured Owners:</span>
            <div className="flex flex-wrap gap-2">
              {vehicle.owners.map((owner) => (
                <div
                  key={owner.id}
                  onClick={() => {
                    const found = owners.find((o) => o.id === owner.ownerId);
                    if (found && onSelectOwner) onSelectOwner(found);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/20 transition"
                >
                  <span>{owner.ownerName}</span>
                  <span className="text-amber-400 font-black">({owner.ownershipPercent}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Odometer: <strong className="text-white font-mono">{vehicle.odometerKm.toLocaleString()} KM</strong> &bull; Avg Fuel: <strong className="text-cyan-400 font-mono">{vehicle.avgMileageKmpL} km/L</strong>
          </div>
        </div>
      </div>

      {/* 22-TAB SUBNAVIGATOR (Scrollable) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {PROFILE_TABS.map((tab) => {
            const isAct = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isAct
                    ? 'bg-blue-500 text-slate-950 border-blue-400 font-bold shadow-md'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT IMPLEMENTATIONS */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Spec Sheet */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Technical Specifications
              </h3>
              <div className="divide-y divide-slate-800/80 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Chassis Number</span>
                  <span className="font-mono text-slate-200">{vehicle.chassisNumber}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Engine Number</span>
                  <span className="font-mono text-slate-200">{vehicle.engineNumber}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Registration Date</span>
                  <span className="text-slate-200">{vehicle.registrationDate}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Fuel Type</span>
                  <span className="text-slate-200">{vehicle.fuelType}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Haulage Capacity</span>
                  <span className="font-mono text-white font-bold">{vehicle.capacity} {vehicle.capacityUnit}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Colour</span>
                  <span className="text-slate-200">{vehicle.colour}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Operating Branch</span>
                  <span className="text-slate-200">{vehicle.branch}</span>
                </div>
              </div>
            </div>

            {/* Compliance Quick Check */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Compliance Status
              </h3>
              <div className="space-y-2 text-xs">
                {Object.entries(vehicle.compliance).map(([key, item]) => {
                  const doc = item as any;
                  return (
                    <div
                      key={key}
                      className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white capitalize">{doc.type}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[170px]">{doc.identifier}</div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : doc.status === 'Expiring Soon'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {doc.status}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">Exp: {doc.expiryDate}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Performance Month */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Month-to-Date Financials
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-slate-400 text-[11px]">Gross Freight Revenue</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                    ₹{vehicle.monthRevenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">{vehicle.monthTripsCount} Trips Executed</div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-slate-400 text-[11px]">Operating Expenses (Fuel, Toll, Batta, Maintenance)</div>
                  <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
                    ₹{vehicle.monthExpense.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <div className="text-emerald-300 text-[11px] font-bold">Net Vehicle Contribution</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                    ₹{vehicle.monthNetContribution.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. OWNERSHIP (Crucial Module: Single, Multiple, 3+ Owners with Independent Config) */}
      {activeTab === 'ownership' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Configured Capital & Ownership Allocation</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Ownership %, investment, capital, revenue %, expense %, profit % and loss % independently configured
                </p>
              </div>

              <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                Total Equity: 100% Configured
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicle.owners.map((ownerConfig, idx) => (
                <div
                  key={ownerConfig.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">Owner #{idx + 1}</div>
                      <div className="font-bold text-white text-sm">{ownerConfig.ownerName}</div>
                    </div>
                    <span className="font-mono font-black text-sm px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {ownerConfig.ownershipPercent}% Ownership
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-900/60 rounded-xl">
                      <span className="text-slate-400">Capital Investment:</span>
                      <div className="font-mono font-bold text-white mt-0.5">
                        ₹{ownerConfig.investmentAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-xl">
                      <span className="text-slate-400">Agreement Ref:</span>
                      <div className="font-mono text-blue-400 mt-0.5">{ownerConfig.agreementNumber}</div>
                    </div>
                  </div>

                  {/* Independent % Configuration Grid */}
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px]">
                    <div className="font-semibold text-slate-300 pb-1 border-b border-slate-800">
                      Independent Financial Allocation Ratios:
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono">
                      <div>
                        <div className="text-slate-500 text-[10px]">Revenue %</div>
                        <div className="font-bold text-cyan-400">{ownerConfig.revenuePercent}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Expense %</div>
                        <div className="font-bold text-rose-400">{ownerConfig.expensePercent}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Profit %</div>
                        <div className="font-bold text-emerald-400">{ownerConfig.profitPercent}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Loss %</div>
                        <div className="font-bold text-amber-400">{ownerConfig.lossPercent}%</div>
                      </div>
                    </div>
                  </div>

                  {ownerConfig.formulaNotes && (
                    <div className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                      &ldquo;{ownerConfig.formulaNotes}&rdquo;
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Effective: {ownerConfig.effectiveDate}</span>
                    <span className="text-emerald-400 font-bold">Status: {ownerConfig.agreementStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. DRIVERS */}
      {activeTab === 'drivers' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Driver Assignments & History for {vehicle.vehicleNumber}
            </h3>

            <div className="space-y-3">
              {drivers.slice(0, 3).map((drv) => (
                <div
                  key={drv.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{drv.name}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {drv.driverId}
                      </span>
                      {drv.assignedVehicleNumber === vehicle.vehicleNumber && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                          Current Assigned Driver
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400">
                      License: <strong className="text-slate-300 font-mono">{drv.licenseNumber}</strong> ({drv.licenseType}) &bull; Expiry: {drv.licenseExpiry}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Phone: {drv.phone} &bull; Emergency: {drv.emergencyContact} &bull; Rating: {drv.safetyRating} / 5
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="font-semibold text-slate-300">Batta: {drv.battaType}</div>
                    <div className="text-slate-400 text-[11px]">{drv.totalTripsCompleted} Lifetime Trips</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TRIPS */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Trips Executed by {vehicle.vehicleNumber} ({vehicleTrips.length})
              </h3>
              <span className="text-xs text-blue-400 font-mono">Total Trips Tracked</span>
            </div>

            <div className="space-y-3">
              {vehicleTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{trip.tripNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                        {trip.status}
                      </span>
                      <span className="text-slate-400">{trip.date}</span>
                    </div>
                    <div className="text-slate-200">
                      Customer: <strong>{trip.customerName}</strong>
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{trip.pickupLocation} &rarr; {trip.destinationLocation}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Material: <strong className="text-white">{trip.material}</strong> ({trip.quantity} {trip.unit})
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      ₹{trip.tripIncome.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Contribution: <strong className="text-emerald-400">₹{trip.tripContribution.toLocaleString()}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500">Driver: {trip.driverName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. LOADS */}
      {activeTab === 'loads' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Vehicle Load Records & Weighbridge Tare/Gross
            </h3>
            <div className="space-y-3">
              {vehicleLoads.map((load) => (
                <div
                  key={load.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{load.loadNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                        {load.sourceType}: {load.sourceName}
                      </span>
                    </div>
                    <div className="text-slate-300">{load.material} &bull; Working Area: {load.workingArea}</div>
                    <div className="text-[11px] text-slate-400">Gate Pass: {load.gatePassNumber} &bull; Dest: {load.destination}</div>
                  </div>
                  <div className="sm:text-right font-mono">
                    <div className="text-white font-bold">Net: {load.netWeightMT} MT</div>
                    <div className="text-[10px] text-slate-500">Gross: {load.grossWeightMT} MT &bull; Tare: {load.tareWeightMT} MT</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. DELIVERY */}
      {activeTab === 'delivery' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Delivery Milestones & Dispatch Status
            </h3>
            <div className="space-y-3">
              {vehicleDeliveries.map((del) => (
                <div
                  key={del.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{del.deliveryNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                        {del.status}
                      </span>
                    </div>
                    <div className="text-slate-300">Customer: {del.customerName}</div>
                    <div className="text-[11px] text-slate-400">
                      Dispatched: {del.dispatchTime} &bull; Expected: {del.expectedDeliveryTime}
                    </div>
                    {del.notes && <div className="text-[11px] text-slate-500 italic">{del.notes}</div>}
                  </div>
                  <div className="sm:text-right">
                    <div className="text-slate-300 font-mono text-[11px]">{del.ewayBillNumber}</div>
                    <div className="text-[10px] text-emerald-400 font-bold mt-1">
                      Signature: {del.signatureStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. FUEL */}
      {activeTab === 'fuel' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Fuel Refilling Logs & Kilometric Efficiency
              </h3>
              <span className="text-xs text-cyan-400 font-mono">
                Avg: {vehicle.avgMileageKmpL} km/L &bull; Current Level: {vehicle.fuelLevelPercent}%
              </span>
            </div>

            <div className="space-y-3">
              {vehicleFuels.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{f.slipNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold">
                        {f.fuelType}
                      </span>
                      <span className="text-slate-400">{f.date}</span>
                    </div>
                    <div className="text-slate-300">Station: {f.fuelStation}</div>
                    <div className="text-[11px] text-slate-400">
                      Odometer: <strong className="text-white font-mono">{f.odometerKm} KM</strong> &bull; Km Run: {f.kmRun} KM &bull; Mileage: <strong className="text-cyan-400 font-mono">{f.mileageKmpL} km/L</strong>
                    </div>
                  </div>
                  <div className="sm:text-right font-mono">
                    <div className="text-cyan-400 font-bold text-sm">
                      {f.quantityLiters} L @ ₹{f.ratePerLiter}/L
                    </div>
                    <div className="text-white font-bold text-sm">₹{f.totalAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">{f.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. TOLL */}
      {activeTab === 'toll' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Fastag & Cash Toll Deductions
            </h3>
            <div className="space-y-3">
              {vehicleTolls.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{t.tollPlaza}</div>
                    <div className="text-[11px] text-slate-400">Route: {t.route} &bull; {t.date} {t.time}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Tag ID: {t.fastagTagId}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-indigo-400 text-sm">₹{t.amount}</div>
                    <div className="text-[10px] text-slate-400">{t.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. BATTA */}
      {activeTab === 'batta' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Driver Batta Disbursed on this Vehicle
            </h3>
            <div className="space-y-3">
              {vehicleBattas.map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{b.driverName} &bull; {b.battaType}</div>
                    <div className="text-[11px] text-slate-400">Date: {b.date} &bull; Approved by: {b.approvedBy}</div>
                    <div className="text-[10px] text-slate-500">Ref: {b.referenceNumber}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-amber-400 font-bold text-sm">₹{b.amount.toLocaleString()}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                      {b.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Vehicle Maintenance & Workshop Work Orders
            </h3>
            <div className="space-y-3">
              {vehicleMaintenances.map((m) => (
                <div
                  key={m.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-sm">
                      {m.category} &bull; {m.description}
                    </div>
                    <span className="font-mono font-bold text-rose-400 text-sm">
                      ₹{m.cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Workshop: {m.serviceProvider} &bull; Date: {m.date} &bull; Odometer: {m.odometerKm} KM &bull; Tech: {m.technicianName}
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-xl text-[11px] text-slate-300">
                    <strong>Parts Replaced:</strong> {m.partsReplaced.join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Next Service Target: {m.nextServiceDate} or {m.nextServiceOdometerKm} KM
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 11. TYRES */}
      {activeTab === 'tyres' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Tyre Inventory & Position Tracking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vehicleTyres.map((tyre) => (
                <div
                  key={tyre.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white">{tyre.tyreNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                      {tyre.position}
                    </span>
                  </div>
                  <div className="text-slate-300 font-medium">
                    {tyre.brand} &bull; {tyre.size}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Installed at: {tyre.installedOdometerKm} KM &bull; Run: <strong className="text-white font-mono">{tyre.kmRun} KM</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">History: {tyre.rotationHistory}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 12. INSURANCE */}
      {activeTab === 'insurance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Commercial Insurance Policy
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-white">{vehicle.compliance.insurance.providerOrAuthority}</div>
                <div className="font-mono text-blue-400 text-xs">{vehicle.compliance.insurance.identifier}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                {vehicle.compliance.insurance.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400">Start Date:</span>
                <div className="text-white font-mono mt-0.5">{vehicle.compliance.insurance.startDate}</div>
              </div>
              <div>
                <span className="text-slate-400">Expiry Date:</span>
                <div className="text-amber-400 font-mono font-bold mt-0.5">{vehicle.compliance.insurance.expiryDate}</div>
              </div>
              <div>
                <span className="text-slate-400">Annual Premium:</span>
                <div className="text-emerald-400 font-mono font-bold mt-0.5">
                  ₹{vehicle.compliance.insurance.amountOrPremium?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. TAX */}
      {activeTab === 'tax' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Motor Vehicle Road Tax & Quarterly Dues
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white">{vehicle.compliance.tax.providerOrAuthority}</div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                {vehicle.compliance.tax.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Token: {vehicle.compliance.tax.identifier}</div>
            <div className="text-[11px] text-slate-400">
              Valid: {vehicle.compliance.tax.startDate} to {vehicle.compliance.tax.expiryDate} &bull; Amount Paid: ₹{vehicle.compliance.tax.amountOrPremium?.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* 14. PERMIT */}
      {activeTab === 'permit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Goods Carriage Permit
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white">{vehicle.compliance.permit.providerOrAuthority}</div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                {vehicle.compliance.permit.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Permit Number: {vehicle.compliance.permit.identifier}</div>
            <div className="text-[11px] text-slate-400">
              Valid till: <strong className="text-amber-400 font-mono">{vehicle.compliance.permit.expiryDate}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 15. FITNESS */}
      {activeTab === 'fitness' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Vehicle Fitness Certificate (RTO Inspection)
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white">{vehicle.compliance.fitness.providerOrAuthority}</div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                {vehicle.compliance.fitness.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">FC Number: {vehicle.compliance.fitness.identifier}</div>
            <div className="text-[11px] text-slate-400">
              Issue Date: {vehicle.compliance.fitness.issueDate} &bull; Expiry Date: <strong className="text-white font-mono">{vehicle.compliance.fitness.expiryDate}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 16. POLLUTION */}
      {activeTab === 'pollution' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Pollution Under Control Certificate (PUCC)
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white">{vehicle.compliance.pollution.providerOrAuthority}</div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  vehicle.compliance.pollution.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {vehicle.compliance.pollution.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Cert Number: {vehicle.compliance.pollution.identifier}</div>
            <div className="text-[11px] text-slate-400">
              Expiry Date: <strong className="text-white font-mono">{vehicle.compliance.pollution.expiryDate}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 17. FINANCE / EMI */}
      {activeTab === 'finance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Vehicle Hypothecation & EMI Schedule
          </h3>
          {vehicle.finance.hasFinance ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-white">{vehicle.finance.financeProvider}</div>
                    <div className="font-mono text-slate-400 text-[11px]">Loan A/C: {vehicle.finance.loanAccountNumber}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                    {vehicle.finance.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400">Sanctioned Loan:</span>
                    <div className="font-mono font-bold text-white mt-0.5">₹{vehicle.finance.loanAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Monthly EMI:</span>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">₹{vehicle.finance.emiAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Paid:</span>
                    <div className="font-mono font-bold text-cyan-400 mt-0.5">₹{vehicle.finance.totalPaid.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Outstanding:</span>
                    <div className="font-mono font-bold text-amber-400 mt-0.5">₹{vehicle.finance.outstandingAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  Tenure: {vehicle.finance.tenureMonths} Months &bull; Rate: {vehicle.finance.interestRate}% &bull; Next Due: <strong className="text-white font-mono">{vehicle.finance.nextDueDate}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
              This vehicle is 100% self-funded with zero outstanding bank hypothecation.
            </div>
          )}
        </div>
      )}

      {/* 18. TRIP ACCOUNTS (VADAKA) */}
      {activeTab === 'trip-accounts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Trip Income / Vadaka & Cost Deductions
          </h3>
          <div className="space-y-3">
            {vehicleTrips.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-mono font-bold text-white text-sm">{t.tripNumber} &bull; {t.customerName}</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">Gross: ₹{t.tripIncome.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-slate-400">
                  <div>Fuel: <strong className="text-slate-200">₹{t.fuelCost}</strong></div>
                  <div>Toll: <strong className="text-slate-200">₹{t.tollCost}</strong></div>
                  <div>Batta: <strong className="text-slate-200">₹{t.driverBatta}</strong></div>
                  <div>Loading: <strong className="text-slate-200">₹{t.loadingUnloadingCost}</strong></div>
                  <div>Other: <strong className="text-slate-200">₹{t.otherExpense}</strong></div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400">Net Trip Contribution:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ₹{t.tripContribution.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 19. P&L */}
      {activeTab === 'pnl' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Vehicle Profit & Loss Statement (Month-to-Date)
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
            <div className="flex justify-between font-bold text-sm text-emerald-400 pb-2 border-b border-slate-800">
              <span>Gross Freight Revenue (48 Trips)</span>
              <span>₹{vehicle.monthRevenue.toLocaleString()}</span>
            </div>
            <div className="space-y-1 text-slate-400 text-[11px] pl-2">
              <div className="flex justify-between">
                <span>Fuel (HSD Diesel)</span>
                <span>₹1,56,400</span>
              </div>
              <div className="flex justify-between">
                <span>Driver Wages & Batta</span>
                <span>₹48,200</span>
              </div>
              <div className="flex justify-between">
                <span>Fastag Toll Charges</span>
                <span>₹14,800</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle Maintenance & Tyres</span>
                <span>₹36,400</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance, Tax & Compliance Prorated</span>
                <span>₹12,200</span>
              </div>
              <div className="flex justify-between">
                <span>EMI Interest Allocation</span>
                <span>₹16,000</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-rose-400 pt-2 border-t border-slate-800">
              <span>Total Vehicle Operating Expenses</span>
              <span>₹{vehicle.monthExpense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-black text-base text-emerald-400 pt-2 border-t border-slate-700 bg-emerald-500/10 p-3 rounded-xl">
              <span>Vehicle Net Contribution</span>
              <span>₹{vehicle.monthNetContribution.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* 20. SETTLEMENT */}
      {activeTab === 'settlement' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Owner Profit Settlements for {vehicle.vehicleNumber}
          </h3>
          <div className="space-y-3">
            {vehicleSettlements.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">{s.ownerName} &bull; {s.period}</div>
                  <div className="text-[11px] text-slate-400">
                    Settlement: {s.settlementNumber} &bull; Date: {s.settlementDate}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ownership: {s.ownershipPercent}% &bull; Profit Formula Ratio: {s.profitPercent}%
                  </div>
                </div>
                <div className="sm:text-right font-mono">
                  <div className="text-amber-400 font-bold text-sm">Share: ₹{s.ownerShare.toLocaleString()}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 21. DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Statutory & Operational Document Vault
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicleDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{doc.title}</div>
                  <div className="text-[11px] text-slate-400">{doc.category} &bull; {doc.fileSize}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{doc.fileName}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                    {doc.status}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">{doc.issueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 22. REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Vehicle Operational & Financial Audit Reports
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="font-bold text-white">Monthly Trip Log Statement</div>
              <p className="text-[11px] text-slate-400">Complete summary of 48 trips, client delivery timestamps & freight.</p>
              <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="font-bold text-white">Fuel Consumption Audit</div>
              <p className="text-[11px] text-slate-400">Km/L telemetry analysis, fuel station receipts & mileage alerts.</p>
              <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="font-bold text-white">Owner Syndicate Settlement Slip</div>
              <p className="text-[11px] text-slate-400">Detailed calculation sheet of profit share and disbursements.</p>
              <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
