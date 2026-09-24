import React, { useState } from 'react';
import {
  Navigation,
  Search,
  Filter,
  Plus,
  Play,
  CheckCircle2,
  MapPin,
  Clock,
  Fuel,
  CreditCard,
  DollarSign,
  Truck,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar
} from 'lucide-react';
import { Trip, TripStatus, Vehicle } from '../../data/vehicleStudioData';

interface VehicleTripsViewProps {
  trips: Trip[];
  vehicles: Vehicle[];
  onOpenNewTripModal: () => void;
  onOpenFuelModal: (trip: Trip) => void;
  onOpenTollModal: (trip: Trip) => void;
  onOpenBattaModal: (trip: Trip) => void;
  onUpdateTripStatus: (tripId: string, newStatus: TripStatus) => void;
}

export const VehicleTripsView: React.FC<VehicleTripsViewProps> = ({
  trips,
  vehicles,
  onOpenNewTripModal,
  onOpenFuelModal,
  onOpenTollModal,
  onOpenBattaModal,
  onUpdateTripStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destinationLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              HAULAGE TRIP PIPELINE &bull; {filteredTrips.length} TRIPS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Commercial Trips & Vadaka Income Engine</h2>
          <p className="text-xs text-slate-400">
            End-to-end trip status pipeline with direct fuel, toll, batta and net freight contribution tracking
          </p>
        </div>

        <button
          onClick={onOpenNewTripModal}
          className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Trip</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trip #, vehicle, customer, driver, destination..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Trip Statuses</option>
              <option value="Planned">Planned</option>
              <option value="Assigned">Assigned</option>
              <option value="Loading">Loading</option>
              <option value="Started">Started</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trips Cards / Table */}
      <div className="space-y-3">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold flex items-center justify-center text-xs">
                  {trip.vehicleCode}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{trip.tripNumber}</span>
                    <span className="font-mono text-slate-300 font-bold">{trip.vehicleNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        trip.status === 'In Transit' || trip.status === 'Started'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : trip.status === 'Completed' || trip.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Customer: <strong className="text-white">{trip.customerName}</strong> &bull; Driver: {trip.driverName} &bull; Date: {trip.date}
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {trip.status === 'In Transit' && (
                  <button
                    onClick={() => onUpdateTripStatus(trip.id, 'Delivered')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Delivered</span>
                  </button>
                )}

                {trip.status === 'Delivered' && (
                  <button
                    onClick={() => onUpdateTripStatus(trip.id, 'Completed')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Trip</span>
                  </button>
                )}

                {trip.status === 'Planned' && (
                  <button
                    onClick={() => onUpdateTripStatus(trip.id, 'In Transit')}
                    className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Trip</span>
                  </button>
                )}
              </div>
            </div>

            {/* Route & Material Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Route & Corridor</span>
                <div className="text-white font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{trip.pickupLocation} &rarr; {trip.destinationLocation}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Distance: {trip.distanceKm} KM &bull; Odo: {trip.odometerStart} &rarr; {trip.odometerEnd}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Material & Freight Rate</span>
                <div className="text-white font-bold">
                  {trip.material} &bull; {trip.quantity} {trip.unit}
                </div>
                <div className="text-[11px] text-slate-400">
                  Rate: ₹{trip.ratePerUnit}/{trip.unit} &bull; Gross: <strong className="text-emerald-400 font-mono">₹{trip.tripIncome.toLocaleString()}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Trip Deductions & Vadaka</span>
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Fuel: ₹{trip.fuelCost}</span>
                  <span>Toll: ₹{trip.tollCost}</span>
                  <span>Batta: ₹{trip.driverBatta}</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold flex justify-between pt-0.5 border-t border-slate-800">
                  <span>Net Contribution:</span>
                  <span className="font-mono text-sm">₹{trip.tripContribution.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Entries */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onOpenFuelModal(trip)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  <Fuel className="w-3 h-3 text-cyan-400" />
                  <span>+ Fuel Slip</span>
                </button>
                <button
                  onClick={() => onOpenTollModal(trip)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  <CreditCard className="w-3 h-3 text-indigo-400" />
                  <span>+ Toll Deduction</span>
                </button>
                <button
                  onClick={() => onOpenBattaModal(trip)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  <DollarSign className="w-3 h-3 text-amber-400" />
                  <span>+ Driver Batta</span>
                </button>
              </div>

              <div className="text-slate-500 font-mono text-[10px]">
                Start: {trip.startTime} &bull; End: {trip.endTime || 'In Transit'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
