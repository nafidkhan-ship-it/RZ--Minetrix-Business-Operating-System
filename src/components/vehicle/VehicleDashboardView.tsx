import React from 'react';
import {
  Truck,
  Activity,
  Fuel,
  Wrench,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Navigation,
  FileText,
  Users,
  CreditCard,
  Scale,
  Sparkles,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Disc,
  Layers,
  Calendar
} from 'lucide-react';
import {
  Vehicle,
  VehicleOwner,
  Driver,
  Trip,
  FLEET_KPI_SUMMARY
} from '../../data/vehicleStudioData';

interface VehicleDashboardViewProps {
  vehicles: Vehicle[];
  owners: VehicleOwner[];
  drivers: Driver[];
  trips: Trip[];
  onSelectSubpage: (pageId: any) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSelectOwner: (owner: VehicleOwner) => void;
  onOpenQuickAction: (action: string) => void;
  onOpenWorkflowModal: () => void;
  onCreateOttTask: (msg: string) => void;
}

export const VehicleDashboardView: React.FC<VehicleDashboardViewProps> = ({
  vehicles,
  owners,
  drivers,
  trips,
  onSelectSubpage,
  onSelectVehicle,
  onSelectOwner,
  onOpenQuickAction,
  onOpenWorkflowModal,
  onCreateOttTask
}) => {
  const activeCount = vehicles.filter(v => v.status === 'On Trip' || v.status === 'Loading' || v.status === 'Delivery').length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const onTripCount = vehicles.filter(v => v.status === 'On Trip').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length;

  return (
    <div className="space-y-6">
      {/* Studio Preview Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-blue-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
            Studio Preview / Demo Data
          </span>
          <span className="text-slate-300">
            Platform 3 &bull; Commercial Heavy Mining Fleet, Multi-Owner Syndicates & Real-time Trip Accounts
          </span>
        </div>
        <button
          onClick={onOpenWorkflowModal}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold transition text-[11px] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Interactive End-to-End Workflow</span>
        </button>
      </div>

      {/* TOP 8 MANDATORY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div
          onClick={() => onSelectSubpage('vehicles')}
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Total Vehicles</span>
            <Truck className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-xl font-black text-white font-mono mt-1">{FLEET_KPI_SUMMARY.totalVehicles}</div>
          <div className="text-[10px] text-blue-400 font-semibold mt-0.5">Heavy Tippers & Haulers</div>
        </div>

        <div
          onClick={() => onSelectSubpage('vehicles')}
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Active</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">{activeCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">84.2% Fleet In Action</div>
        </div>

        <div
          onClick={() => onSelectSubpage('vehicles')}
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Available</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono mt-1">{availableCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Ready for Assignment</div>
        </div>

        <div
          onClick={() => onSelectSubpage('trips')}
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>On Trip</span>
            <Navigation className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-xl font-black text-blue-400 font-mono mt-1">{onTripCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">In Transit / Delivering</div>
        </div>

        <div
          onClick={() => onSelectSubpage('maintenance')}
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Maintenance</span>
            <Wrench className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">{maintenanceCount}</div>
          <div className="text-[10px] text-amber-400 mt-0.5">Service & Repairs</div>
        </div>

        <div
          onClick={() => onSelectSubpage('trips')}
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Today's Trips</span>
            <Calendar className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-xl font-black text-purple-400 font-mono mt-1">{FLEET_KPI_SUMMARY.todayTrips}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Scheduled & Rolling</div>
        </div>

        <div
          onClick={() => onSelectSubpage('loads')}
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Today's Loads</span>
            <Layers className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-xl font-black text-teal-400 font-mono mt-1">{FLEET_KPI_SUMMARY.todayLoads}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">1,280 MT Aggregates</div>
        </div>

        <div
          onClick={() => onSelectSubpage('trip-accounts')}
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Today's Income</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">₹4.86 L</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Trip Freight Gross</div>
        </div>
      </div>

      {/* ADDITIONAL 6 MANDATORY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onSelectSubpage('fuel')}
          className="p-4 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fuel Cost (Month)</span>
            <Fuel className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono mt-1">₹12.48 L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">13,500 L Diesel &bull; ₹92.4/L</div>
        </div>

        <div
          onClick={() => onSelectSubpage('toll')}
          className="p-4 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Toll Cost</span>
            <CreditCard className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-indigo-400 font-mono mt-1">₹94,600</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Fastag Automated Deductions</div>
        </div>

        <div
          onClick={() => onSelectSubpage('batta')}
          className="p-4 bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Driver Batta</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">₹2.84 L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Trip Batta & Night Allowance</div>
        </div>

        <div
          onClick={() => onSelectSubpage('maintenance')}
          className="p-4 bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Maintenance Cost</span>
            <Wrench className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400 font-mono mt-1">₹3.42 L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Oils, Brakes & Tyres</div>
        </div>

        <div
          onClick={() => onSelectSubpage('owner-settlement')}
          className="p-4 bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Settlement</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">₹8.94 L</div>
          <div className="text-[11px] text-amber-400 mt-0.5">4 Owners Awaiting Share</div>
        </div>

        <div
          onClick={() => onSelectSubpage('finance')}
          className="p-4 bg-slate-900/90 border border-slate-800 hover:border-yellow-500/40 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Finance Outstanding</span>
            <TrendingUp className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-xl font-black text-yellow-400 font-mono mt-1">₹48.20 L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Bank Loans & HP Contracts</div>
        </div>
      </div>

      {/* QUICK ACTION CENTER (Mandatory Item 26) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Action Center &bull; Fast Fleet Dispatch & Entry
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">One-click multi-modal operational entry</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenQuickAction('NEW_VEHICLE')}
            className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Vehicle</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('ADD_OWNER')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>+ Add Owner</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('ADD_DRIVER')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add Driver</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('NEW_TRIP')}
            className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs transition flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ New Trip</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('NEW_LOAD')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>+ New Load</span>
          </button>

          <button
            onClick={() => onSelectSubpage('delivery')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Delivery Tracking</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('FUEL_ENTRY')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            <span>Fuel Entry</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('TOLL_ENTRY')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Toll Entry</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('BATTA_ENTRY')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add Batta</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('MAINTENANCE_ENTRY')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-rose-400" />
            <span>Maintenance</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('TYRE_ENTRY')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Disc className="w-3.5 h-3.5 text-purple-400" />
            <span>Tyre Entry</span>
          </button>

          <button
            onClick={() => onSelectSubpage('finance')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
            <span>Finance / EMI</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('SETTLEMENT')}
            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition flex items-center gap-1.5 border border-amber-500/30 cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Owner Settlement</span>
          </button>
        </div>
      </div>

      {/* CROSS-PLATFORM TRACEABILITY & FLEET STATUS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Trips & Deliveries Radar */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-400" />
                <span>Active Commercial Trips & Haulage Operations</span>
              </h3>
              <p className="text-xs text-slate-400">Connected with Quarry, Crusher & NHAI Fastag corridors</p>
            </div>
            <button
              onClick={() => onSelectSubpage('trips')}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
            >
              <span>View All 46 Trips</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {trips.slice(0, 4).map((trip) => {
              const vehicle = vehicles.find(v => v.id === trip.vehicleId);
              return (
                <div
                  key={trip.id}
                  className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{trip.vehicleNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                        {trip.tripNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                        {trip.status}
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium">
                      {trip.material} &bull; <strong className="text-white">{trip.quantity} {trip.unit}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{trip.pickupLocation} &rarr; {trip.destinationLocation}</span>
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      ₹{trip.tripIncome.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Contribution: <strong className="text-emerald-400">₹{trip.tripContribution.toLocaleString()}</strong>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => vehicle && onSelectVehicle(vehicle)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition"
                      >
                        Vehicle Profile
                      </button>
                      <button
                        onClick={() => onCreateOttTask(`Follow up trip ${trip.tripNumber} to ${trip.customerName}`)}
                        className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold transition"
                      >
                        OTT Task
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Owner Syndicate Ledger Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Vehicle Owner Syndicates</span>
              </h3>
              <p className="text-xs text-slate-400">Multi-owner equity, revenue & profit shares</p>
            </div>
            <button
              onClick={() => onSelectSubpage('vehicle-owners')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <span>All Owners</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {owners.map((owner) => (
              <div
                key={owner.id}
                onClick={() => onSelectOwner(owner)}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl hover:border-amber-500/40 transition cursor-pointer space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white">{owner.personName}</div>
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {owner.vehiclesOwned.length} Vehicles
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  {owner.vehiclesOwned.map(v => `${v.vehicleCode} (${v.ownershipPercent}%)`).join(' &bull; ')}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{owner.currentBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Independent Formula Support</span>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              Ownership %, investment %, revenue %, expense %, profit % and loss % are independently configured per contract.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
