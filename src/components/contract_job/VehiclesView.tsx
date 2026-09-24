import React, { useState } from 'react';
import {
  Truck,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Fuel,
  DollarSign,
  X
} from 'lucide-react';
import {
  JobVehicleAllocation,
  SAMPLE_VEHICLE_ALLOCATIONS,
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

export const VehiclesView: React.FC = () => {
  const [vehicles, setVehicles] = useState<JobVehicleAllocation[]>(SAMPLE_VEHICLE_ALLOCATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New vehicle assignment form state
  const [newVeh, setNewVeh] = useState<Partial<JobVehicleAllocation>>({
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    vehicleNumber: 'KA-19-ME-9081',
    vehicleType: '16-Wheeler Multi-Axle Tipper',
    driverName: 'Santhosh Kumar',
    purpose: 'Aggregates hauling to bypass flyover piers',
    dailyRate: 4200,
    tripsCount: 18,
    fuelExpenses: 12000,
    startDate: '2026-09-15'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trips = Number(newVeh.tripsCount) || 10;
    const rate = Number(newVeh.dailyRate) || 4000;
    const fuel = Number(newVeh.fuelExpenses) || 8000;

    const created: JobVehicleAllocation = {
      id: `VEH-AL-${100 + vehicles.length + 1}`,
      jobId: newVeh.jobId || 'JOB-4001',
      vehicleNumber: newVeh.vehicleNumber || 'KA-19-AA-0000',
      vehicleType: newVeh.vehicleType || 'Tipper',
      driverName: newVeh.driverName || 'Site Driver',
      tripsCount: trips,
      purpose: newVeh.purpose || 'Material transit',
      dailyRate: rate,
      fuelExpenses: fuel,
      totalCost: rate * 10 + fuel,
      startDate: newVeh.startDate || '2026-09-15',
      status: 'Active'
    };

    setVehicles([created, ...vehicles]);
    setIsAddModalOpen(false);
    showToast(`Vehicle ${created.vehicleNumber} assigned to Job ${created.jobId}`);
  };

  const handleLogTrip = (id: string) => {
    setVehicles(
      vehicles.map((v) =>
        v.id === id
          ? {
              ...v,
              tripsCount: v.tripsCount + 1,
              totalCost: v.totalCost + 400
            }
          : v
      )
    );
    showToast(`Logged new delivery trip for vehicle ${id}`);
  };

  const filtered = vehicles.filter((v) =>
    v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Platform 3 Integration
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              {filtered.length} Fleet Allocated
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Vehicle & Fleet Logistics</h2>
          <p className="text-xs text-slate-400">
            Flow: <strong className="text-white">Job &rarr; Vehicle Assignment &rarr; Trip &rarr; Load &rarr; Delivery &rarr; Vehicle Cost &rarr; Job Cost</strong>
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Assign Vehicle</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search vehicles by registration plate, driver, job ID, type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Vehicles Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-amber-400">
                    {v.vehicleNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {v.jobId}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    {v.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{v.vehicleType}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Driver: <strong className="text-slate-200">{v.driverName}</strong> &bull; Assigned: {v.startDate}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">Total Fleet Cost</div>
                <div className="text-xl font-black text-white font-mono mt-0.5">
                  ₹{v.totalCost.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-amber-400 font-mono font-semibold">
                  Rate: ₹{v.dailyRate} / day
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <strong className="text-amber-400 font-mono text-[10px] uppercase block mb-0.5">
                Purpose:
              </strong>
              {v.purpose}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 text-[10px]">Trips Completed</span>
                <div className="text-emerald-400 font-mono font-black text-base mt-0.5">
                  {v.tripsCount} Trips
                </div>
              </div>
              <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 text-[10px]">Fuel Billed</span>
                <div className="text-white font-mono font-bold text-base mt-0.5">
                  ₹{v.fuelExpenses.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Actions: Log Trip, Vehicle Expenses, Release */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => handleLogTrip(v.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Trip</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Added fuel expense voucher for ${v.vehicleNumber}`)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  <Fuel className="w-3.5 h-3.5 inline mr-1 text-rose-400" />
                  Fuel
                </button>
                <button
                  onClick={() => {
                    setVehicles(vehicles.map((item) => (item.id === v.id ? { ...item, status: 'Released' } : item)));
                    showToast(`Vehicle ${v.vehicleNumber} released back to Central Fleet`);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 font-semibold cursor-pointer"
                >
                  Release
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ASSIGN VEHICLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Assign Fleet from Platform 3</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Job</label>
                  <select
                    value={newVeh.jobId}
                    onChange={(e) => setNewVeh({ ...newVeh, jobId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    {SAMPLE_JOBS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.id} - {j.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Vehicle Registration #</label>
                  <input
                    type="text"
                    required
                    value={newVeh.vehicleNumber}
                    onChange={(e) => setNewVeh({ ...newVeh, vehicleNumber: e.target.value })}
                    placeholder="e.g. KA-19-ME-9081"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={newVeh.vehicleType}
                    onChange={(e) => setNewVeh({ ...newVeh, vehicleType: e.target.value })}
                    placeholder="e.g. 10-Wheel Tipper, Water Tanker"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Designated Driver</label>
                  <input
                    type="text"
                    value={newVeh.driverName}
                    onChange={(e) => setNewVeh({ ...newVeh, driverName: e.target.value })}
                    placeholder="e.g. Santhosh Kumar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Daily Hire Rate (₹)</label>
                  <input
                    type="number"
                    value={newVeh.dailyRate}
                    onChange={(e) => setNewVeh({ ...newVeh, dailyRate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Initial Trips Logged</label>
                  <input
                    type="number"
                    value={newVeh.tripsCount}
                    onChange={(e) => setNewVeh({ ...newVeh, tripsCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Operational Purpose Directive</label>
                <textarea
                  rows={2}
                  value={newVeh.purpose}
                  onChange={(e) => setNewVeh({ ...newVeh, purpose: e.target.value })}
                  placeholder="Quarry pit hauling to crusher feeder, delivery to site..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Commit Vehicle to Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
