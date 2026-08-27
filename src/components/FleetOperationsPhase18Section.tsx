import React, { useState, useEffect, useCallback } from 'react';
import {
  Truck, Fuel, MapPin, Wrench, ShieldCheck, DollarSign,
  UserCheck, Activity, Award, BarChart3, Clock, AlertTriangle,
  CheckCircle2, Search, Filter, ShoppingBag, FileText, QrCode,
  Sparkles, Compass, Eye, ArrowUpRight, Zap, Scale, Navigation,
  ChevronRight, Phone, ShieldAlert, FileSpreadsheet, HardHat,
  Sliders, ArrowDownRight, RefreshCw, Key, Box, Cpu, Building2
} from 'lucide-react';

import {
  FLEET_GROUPS,
  MOCK_TRIP_LOGS,
  RENTAL_CONTRACTS,
  MAINTENANCE_LOGS,
  USED_VEHICLE_MARKETPLACE,
  FREIGHT_MARKETPLACE_LOADS,
  TripLogRecord
} from '../data/fleetOperationsPhase18Data';
import { apiClient } from '../services/apiClient';

export const FleetOperationsPhase18Section: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'fleet-org'
    | 'vehicle-master'
    | 'owner-management'
    | 'driver-management'
    | 'trip-dispatch'
    | 'rental-contracts'
    | 'gps-tracking'
    | 'fuel-management'
    | 'maintenance'
    | 'marketplace'
    | 'customer-portal'
    | 'ai-analytics'
    | 'ecosystem'
  >('fleet-org');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // States
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [assignableVehicles, setAssignableVehicles] = useState<any[]>([]);
  const [trips, setTrips] = useState<TripLogRecord[]>(MOCK_TRIP_LOGS);
  const [searchVehicle, setSearchVehicle] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchDriver, setSearchDriver] = useState('');
  const [driverStatusFilter, setDriverStatusFilter] = useState('');
  const [driverLicenseFilter, setDriverLicenseFilter] = useState('');
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [driverForm, setDriverForm] = useState({
    fullName: '',
    phone: '',
    licenseNumber: '',
    licenseClass: 'HMV',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    badgeCode: '',
    status: 'ACTIVE',
    assignedVehicleId: '',
    notes: ''
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: '',
    vehicleType: 'TIPPER',
    make: 'Tata',
    model: 'Signa',
    variant: '',
    manufacturingYear: 2022,
    fuelType: 'DIESEL',
    ownershipType: 'COMPANY',
    ownerReference: '',
    capacity: 28,
    capacityUnit: 'TON',
    status: 'ACTIVE',
    insuranceReference: '',
    fitnessReference: '',
    permitReference: ''
  });

  // New Trip Creation Form State
  const [newTripForm, setNewTripForm] = useState({
    origin: 'Crusher Yard #1, Bantwal',
    destination: 'Smart Highway Project Site #4',
    cargo: '20mm Crushed Blue Metal Aggregate',
    tonnage: 28,
    assignedVehicle: 'KA-19-AB-4491',
    assignedDriver: 'Suresh Kumar',
    freight: 9200
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadLiveVehicles = useCallback(async () => {
    if (!apiClient.getAuthToken()) {
      setVehicles([]);
      setVehiclesError('Login via Shared Core to load live vehicles.');
      return;
    }
    setVehiclesLoading(true);
    setVehiclesError(null);
    const res = await apiClient.listFleetVehicles({
      search: searchVehicle || undefined,
      status: statusFilter || undefined,
      vehicleType: typeFilter || undefined
    });
    if (res.success && Array.isArray(res.data)) {
      setVehicles(res.data);
    } else {
      setVehicles([]);
      setVehiclesError(res.message || 'Unable to load vehicles');
    }
    setVehiclesLoading(false);
  }, [searchVehicle, statusFilter, typeFilter]);

  const loadLiveDrivers = useCallback(async () => {
    if (!apiClient.getAuthToken()) {
      setDrivers([]);
      setAssignableVehicles([]);
      setDriversError('Login via Shared Core to load live drivers.');
      return;
    }
    setDriversLoading(true);
    setDriversError(null);
    const [driverRes, vehicleRes] = await Promise.all([
      apiClient.listFleetDrivers({
        search: searchDriver || undefined,
        status: driverStatusFilter || undefined,
        licenseClass: driverLicenseFilter || undefined
      }),
      apiClient.listFleetVehicles()
    ]);
    if (driverRes.success && Array.isArray(driverRes.data)) {
      setDrivers(driverRes.data);
    } else {
      setDrivers([]);
      setDriversError(driverRes.message || 'Unable to load drivers');
    }
    if (vehicleRes.success && Array.isArray(vehicleRes.data)) {
      setAssignableVehicles(vehicleRes.data.filter((row: { status?: string }) => row.status !== 'RETIRED'));
    } else {
      setAssignableVehicles([]);
    }
    setDriversLoading(false);
  }, [searchDriver, driverStatusFilter, driverLicenseFilter]);

  useEffect(() => {
    if (activeTab === 'vehicle-master') {
      loadLiveVehicles();
    }
    if (activeTab === 'driver-management') {
      loadLiveDrivers();
    }
  }, [activeTab, loadLiveVehicles, loadLiveDrivers]);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to create vehicles');
      return;
    }
    const res = await apiClient.createFleetVehicle({
      ...vehicleForm,
      registrationNumber: vehicleForm.registrationNumber.trim().toUpperCase(),
      manufacturingYear: Number(vehicleForm.manufacturingYear),
      capacity: Number(vehicleForm.capacity)
    });
    if (res.success) {
      showToast(`Vehicle ${res.data.registrationNumber} created`);
      setVehicleForm({ ...vehicleForm, registrationNumber: '' });
      await loadLiveVehicles();
    } else {
      showToast(res.message || 'Failed to create vehicle');
    }
  };

  const handleEditVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      showToast('Select a vehicle to edit');
      return;
    }
    const res = await apiClient.updateFleetVehicle(selectedVehicleId, {
      make: vehicleForm.make,
      model: vehicleForm.model,
      variant: vehicleForm.variant || undefined,
      manufacturingYear: Number(vehicleForm.manufacturingYear),
      capacity: Number(vehicleForm.capacity),
      status: vehicleForm.status,
      ownerReference: vehicleForm.ownerReference || undefined,
      insuranceReference: vehicleForm.insuranceReference || undefined,
      fitnessReference: vehicleForm.fitnessReference || undefined,
      permitReference: vehicleForm.permitReference || undefined
    });
    if (res.success) {
      showToast(`Vehicle ${res.data.registrationNumber} updated`);
      await loadLiveVehicles();
    } else {
      showToast(res.message || 'Failed to update vehicle');
    }
  };

  const handleArchiveVehicle = async (vehicleId: string) => {
    const res = await apiClient.archiveFleetVehicle(vehicleId);
    showToast(res.success ? 'Vehicle archived' : res.message || 'Archive failed');
    if (selectedVehicleId === vehicleId) setSelectedVehicleId('');
    await loadLiveVehicles();
  };

  const handleViewVehicle = async (vehicleId: string) => {
    const res = await apiClient.getFleetVehicle(vehicleId);
    if (!res.success || !res.data) {
      showToast(res.message || 'Vehicle not found');
      return;
    }
    const row = res.data;
    setSelectedVehicleId(row.id);
    setVehicleForm({
      registrationNumber: row.registrationNumber,
      vehicleType: row.vehicleType,
      make: row.make,
      model: row.model,
      variant: row.variant || '',
      manufacturingYear: row.manufacturingYear,
      fuelType: row.fuelType,
      ownershipType: row.ownershipType,
      ownerReference: row.ownerReference || '',
      capacity: row.capacity,
      capacityUnit: row.capacityUnit,
      status: row.status,
      insuranceReference: row.insuranceReference || '',
      fitnessReference: row.fitnessReference || '',
      permitReference: row.permitReference || ''
    });
    showToast(`Loaded ${row.registrationNumber}`);
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to create drivers');
      return;
    }
    const res = await apiClient.createFleetDriver({
      fullName: driverForm.fullName.trim(),
      phone: driverForm.phone.trim() || undefined,
      licenseNumber: driverForm.licenseNumber.trim().toUpperCase(),
      licenseClass: driverForm.licenseClass,
      licenseIssueDate: driverForm.licenseIssueDate || undefined,
      licenseExpiryDate: driverForm.licenseExpiryDate || undefined,
      badgeCode: driverForm.badgeCode.trim() ? driverForm.badgeCode.trim().toUpperCase() : undefined,
      status: driverForm.status,
      assignedVehicleId: driverForm.assignedVehicleId || undefined,
      notes: driverForm.notes.trim() || undefined
    });
    if (res.success) {
      showToast(`Driver ${res.data.fullName} created`);
      setDriverForm({ ...driverForm, fullName: '', licenseNumber: '', badgeCode: '' });
      await loadLiveDrivers();
    } else {
      showToast(res.message || 'Failed to create driver');
    }
  };

  const handleEditDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId) {
      showToast('Select a driver to edit');
      return;
    }
    const res = await apiClient.updateFleetDriver(selectedDriverId, {
      fullName: driverForm.fullName.trim(),
      phone: driverForm.phone.trim() || undefined,
      licenseClass: driverForm.licenseClass,
      licenseIssueDate: driverForm.licenseIssueDate || undefined,
      licenseExpiryDate: driverForm.licenseExpiryDate || undefined,
      badgeCode: driverForm.badgeCode.trim() ? driverForm.badgeCode.trim().toUpperCase() : undefined,
      status: driverForm.status,
      assignedVehicleId: driverForm.assignedVehicleId || null,
      notes: driverForm.notes.trim() || undefined
    });
    if (res.success) {
      showToast(`Driver ${res.data.fullName} updated`);
      await loadLiveDrivers();
    } else {
      showToast(res.message || 'Failed to update driver');
    }
  };

  const handleArchiveDriver = async (driverId: string) => {
    const res = await apiClient.archiveFleetDriver(driverId);
    showToast(res.success ? 'Driver archived' : res.message || 'Archive failed');
    if (selectedDriverId === driverId) setSelectedDriverId('');
    await loadLiveDrivers();
  };

  const handleViewDriver = async (driverId: string) => {
    const res = await apiClient.getFleetDriver(driverId);
    if (!res.success || !res.data) {
      showToast(res.message || 'Driver not found');
      return;
    }
    const row = res.data;
    setSelectedDriverId(row.id);
    setDriverForm({
      fullName: row.fullName,
      phone: row.phone || '',
      licenseNumber: row.licenseNumber,
      licenseClass: row.licenseClass,
      licenseIssueDate: row.licenseIssueDate || '',
      licenseExpiryDate: row.licenseExpiryDate || '',
      badgeCode: row.badgeCode || '',
      status: row.status,
      assignedVehicleId: row.assignedVehicleId || '',
      notes: row.notes || ''
    });
    showToast(`Loaded ${row.fullName}`);
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const createdTrip: TripLogRecord = {
      tripId: `TRP-2026-${Math.floor(9000 + Math.random() * 1000)}`,
      originLocation: newTripForm.origin,
      destinationLocation: newTripForm.destination,
      cargoType: newTripForm.cargo,
      tonnageLoaded: Number(newTripForm.tonnage),
      assignedVehicleNo: newTripForm.assignedVehicle,
      driverName: newTripForm.assignedDriver,
      freightAmountRs: Number(newTripForm.freight),
      fuelAdvanceLiters: Math.round(Number(newTripForm.tonnage) * 1.5),
      customerOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      podStatus: 'IN_TRANSIT',
      tripStatus: 'DISPATCHED',
      estimatedEta: 'En Route (Live GPS Active)'
    };

    setTrips([createdTrip, ...trips]);
    showToast(`Trip ${createdTrip.tripId} dispatched! OTP sent to recipient & GPS live tracking active.`);
  };

  const filteredVehicles = vehicles;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Banner Header */}
      <div className="relative bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Truck className="w-4 h-4 text-blue-400" /> Phase 18 Fleet, Logistics &amp; Transport Platform
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-full">
              Shared Core Integrated
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise Fleet &amp; Logistics OS
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed">
            16 Enterprise Fleet Modules: Multi-Fleet Organization, Vehicle Master &amp; Docs, Owner Settlements, Driver Wallets &amp; Badges, AI Route Dispatch, Vehicle Rentals, Real-Time GPS Geofencing, Fuel Theft Protection, Workshop Maintenance, Used Commercial Marketplace &amp; Ecosystem Connect.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Total Fleet Size:</span>
              <strong className="text-white">50 Heavy Vehicles</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Active On Road:</span>
              <strong className="text-emerald-400">44 Vehicles (88%)</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Fuel className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Daily Fuel Mileage:</span>
              <strong className="text-amber-300">2.85 Km / Liter</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Navigation className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">GPS Live Telemetry:</span>
              <strong className="text-purple-300">100% Signal Online</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        <button
          onClick={() => setActiveTab('fleet-org')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'fleet-org' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          1. Fleet Organization
        </button>

        <button
          onClick={() => setActiveTab('vehicle-master')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'vehicle-master' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Truck className="w-4 h-4" />
          2. Vehicle Master &amp; Docs
        </button>

        <button
          onClick={() => setActiveTab('owner-management')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'owner-management' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          3. Owner &amp; Attached Fleet
        </button>

        <button
          onClick={() => setActiveTab('driver-management')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'driver-management' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          4. Driver Wallet &amp; Badges
        </button>

        <button
          onClick={() => setActiveTab('trip-dispatch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'trip-dispatch' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Navigation className="w-4 h-4" />
          5. Trip Planning &amp; Dispatch
        </button>

        <button
          onClick={() => setActiveTab('rental-contracts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'rental-contracts' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          6. Rental Agreements &amp; Billing
        </button>

        <button
          onClick={() => setActiveTab('gps-tracking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'gps-tracking' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          7. GPS Live Tracking &amp; Geofence
        </button>

        <button
          onClick={() => setActiveTab('fuel-management')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'fuel-management' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Fuel className="w-4 h-4" />
          8. Fuel Management &amp; Anti-Theft
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'maintenance' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Wrench className="w-4 h-4" />
          9. Vehicle Service &amp; Workshop
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'marketplace' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          10. Commercial Load Marketplace
        </button>

        <button
          onClick={() => setActiveTab('customer-portal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'customer-portal' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Phone className="w-4 h-4" />
          11. Customer Transport Portal
        </button>

        <button
          onClick={() => setActiveTab('ai-analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'ai-analytics' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          12. AI Command Center &amp; Analytics
        </button>

        <button
          onClick={() => setActiveTab('ecosystem')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'ecosystem' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          13. Ecosystem &amp; Shared Core
        </button>
      </div>

      {/* TAB 1: FLEET ORGANIZATION */}
      {activeTab === 'fleet-org' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" /> Module 1: Fleet Organization &amp; Operating Divisions
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Configurable vehicle divisions supporting mining tippers, inter-state bulk trailers, low-bed heavy machinery movers, and commercial water bowsers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FLEET_GROUPS.map((group) => (
              <div key={group.id} className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl space-y-4 shadow-xl transition-all">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-blue-400">{group.id}</span>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-full">
                    {group.category} Division
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-tight">{group.name}</h3>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 text-[10px] block">Total Fleet:</span>
                    <strong className="text-white text-sm">{group.totalVehicles} Vehicles</strong>
                  </div>
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 text-[10px] block">Active On Road:</span>
                    <strong className="text-emerald-400 text-sm">{group.activeOnRoad} Active</strong>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Average Division Mileage:</span>
                    <strong className="text-amber-300">{group.averageMileageKmpl} Km / Liter</strong>
                  </div>
                  <div className="text-slate-400 space-y-1 pt-1">
                    <span className="text-slate-300 font-semibold block">Operating Zones:</span>
                    <div className="flex flex-wrap gap-1">
                      {group.operatingZones.map((zone, zIdx) => (
                        <span key={zIdx} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[10px] rounded">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VEHICLE MASTER */}
      {activeTab === 'vehicle-master' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 2 · Live PostgreSQL</span>
              <h2 className="text-xl font-bold text-white mt-1">Vehicle Master Directory &amp; Compliance Vault</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search registration or make..."
                  value={searchVehicle}
                  onChange={(e) => setSearchVehicle(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                <option value="">All statuses</option>
                {['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                <option value="">All types</option>
                {['TIPPER', 'TRAILER', 'TANKER', 'PICKUP', 'LOWBED', 'OTHER'].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button
                onClick={() => loadLiveVehicles()}
                className="px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl"
              >
                Refresh
              </button>
            </div>
          </div>

          {vehiclesError && (
            <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs">{vehiclesError}</div>
          )}
          {vehiclesLoading && <p className="text-xs text-slate-400">Loading vehicles…</p>}

          <form onSubmit={selectedVehicleId ? handleEditVehicle : handleCreateVehicle} className="grid md:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="KA-19-AB-4491" value={vehicleForm.registrationNumber} onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })} required={!selectedVehicleId} disabled={Boolean(selectedVehicleId)} />
            <select className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" value={vehicleForm.vehicleType} onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}>
              {['TIPPER', 'TRAILER', 'TANKER', 'PICKUP', 'LOWBED', 'OTHER'].map((type) => <option key={type}>{type}</option>)}
            </select>
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Make" value={vehicleForm.make} onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })} required />
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Model" value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} required />
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Variant" value={vehicleForm.variant} onChange={(e) => setVehicleForm({ ...vehicleForm, variant: e.target.value })} />
            <input type="number" className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Year" value={vehicleForm.manufacturingYear} onChange={(e) => setVehicleForm({ ...vehicleForm, manufacturingYear: Number(e.target.value) })} />
            <select className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" value={vehicleForm.fuelType} onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}>
              {['DIESEL', 'PETROL', 'CNG', 'ELECTRIC', 'HYBRID'].map((type) => <option key={type}>{type}</option>)}
            </select>
            <select className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" value={vehicleForm.ownershipType} onChange={(e) => setVehicleForm({ ...vehicleForm, ownershipType: e.target.value })}>
              {['COMPANY', 'ATTACHED', 'CONTRACTOR', 'LEASED'].map((type) => <option key={type}>{type}</option>)}
            </select>
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Owner / vendor" value={vehicleForm.ownerReference} onChange={(e) => setVehicleForm({ ...vehicleForm, ownerReference: e.target.value })} />
            <input type="number" className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Capacity" value={vehicleForm.capacity} onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: Number(e.target.value) })} />
            <select className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" value={vehicleForm.status} onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}>
              {['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED'].map((status) => <option key={status}>{status}</option>)}
            </select>
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Insurance ref" value={vehicleForm.insuranceReference} onChange={(e) => setVehicleForm({ ...vehicleForm, insuranceReference: e.target.value })} />
            <div className="md:col-span-4 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-slate-950 font-bold rounded-xl">
                {selectedVehicleId ? 'Save vehicle changes' : '+ Add Vehicle Record'}
              </button>
              {selectedVehicleId && (
                <button type="button" onClick={() => { setSelectedVehicleId(''); setVehicleForm({ ...vehicleForm, registrationNumber: '' }); }} className="px-4 py-2 bg-slate-800 text-white rounded-xl">
                  New vehicle
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((veh) => (
              <div key={veh.id} className="p-5 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl space-y-3 font-mono text-xs transition-all">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-blue-400 font-bold text-sm">{veh.registrationNumber}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    veh.status === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {veh.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{veh.make} {veh.model} {veh.variant || ''}</h4>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payload Capacity:</span>
                    <strong className="text-amber-300">{veh.capacity} {veh.capacityUnit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ownership:</span>
                    <span>{veh.ownershipType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner / vendor:</span>
                    <strong className="text-white">{veh.ownerReference || '—'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Year / fuel:</span>
                    <span className="text-purple-300">{veh.manufacturingYear} · {veh.fuelType}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-1">
                    <span className="text-slate-400">Fitness / Insurance:</span>
                    <span className="text-emerald-400">{veh.fitnessReference || veh.insuranceReference || 'Not set'}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleViewVehicle(veh.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] rounded border border-slate-800 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> View / Edit
                  </button>
                  <button
                    onClick={() => handleArchiveVehicle(veh.id)}
                    className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-[11px] rounded border border-rose-800"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
            {!vehiclesLoading && filteredVehicles.length === 0 && (
              <p className="text-xs text-slate-500 md:col-span-3">No live vehicles. Login via Shared Core, then create a record.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OWNER MANAGEMENT */}
      {activeTab === 'owner-management' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 3</span>
            <h2 className="text-xl font-bold text-white mt-1">Vehicle Owner, Attached Fleet &amp; Freight Ledger Settlement</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-blue-400">Attached Partner Fleets</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex justify-between"><span>Coastal Transport Co:</span><strong className="text-white">12 Vehicles</strong></li>
                <li className="flex justify-between"><span>Karavali Infra Movers:</span><strong className="text-white">8 Vehicles</strong></li>
                <li className="flex justify-between"><span>Independent Drivers:</span><strong className="text-white">14 Vehicles</strong></li>
              </ul>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-emerald-400">Freight Revenue Sharing</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex justify-between"><span>Standard Platform Commission:</span><strong className="text-emerald-300">8.5% Per Trip</strong></li>
                <li className="flex justify-between"><span>Owner Weekly Payouts:</span><strong className="text-white">₹14,80,000 Settled</strong></li>
                <li className="flex justify-between"><span>Pending Settlements:</span><strong className="text-amber-300">₹2,40,000</strong></li>
              </ul>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-amber-400">Digital Owner Wallet</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Instant automated freight credit transfer into owner wallets upon successful digital Proof of Delivery (POD) and customer OTP validation.
              </p>
              <button
                onClick={() => showToast('Generated Owner Freight Settlement Statement PDF')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded border border-slate-800 font-bold text-[11px]"
              >
                Simulate Wallet Settlement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DRIVER MANAGEMENT */}
      {activeTab === 'driver-management' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 4 · Live PostgreSQL</span>
              <h2 className="text-xl font-bold text-white mt-1">Driver Master Directory, Licenses &amp; Vehicle Assignment</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, license, badge..."
                  value={searchDriver}
                  onChange={(e) => setSearchDriver(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <select value={driverStatusFilter} onChange={(e) => setDriverStatusFilter(e.target.value)} className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                <option value="">All statuses</option>
                {['ACTIVE', 'INACTIVE', 'SUSPENDED'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select value={driverLicenseFilter} onChange={(e) => setDriverLicenseFilter(e.target.value)} className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                <option value="">All classes</option>
                {['LMV', 'HMV', 'HGMV', 'TRANS', 'OTHER'].map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <button onClick={() => loadLiveDrivers()} className="px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl">
                Refresh
              </button>
            </div>
          </div>

          {driversError && (
            <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs">{driversError}</div>
          )}
          {driversLoading && <p className="text-xs text-slate-400">Loading drivers…</p>}

          <form onSubmit={selectedDriverId ? handleEditDriver : handleCreateDriver} className="grid md:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Full name" value={driverForm.fullName} onChange={(e) => setDriverForm({ ...driverForm, fullName: e.target.value })} required />
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Phone" value={driverForm.phone} onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })} />
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="KA19-2022000123" value={driverForm.licenseNumber} onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })} required={!selectedDriverId} disabled={Boolean(selectedDriverId)} />
            <select className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" value={driverForm.licenseClass} onChange={(e) => setDriverForm({ ...driverForm, licenseClass: e.target.value })}>
              {['LMV', 'HMV', 'HGMV', 'TRANS', 'OTHER'].map((cls) => <option key={cls}>{cls}</option>)}
            </select>
            <input type="date" className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" value={driverForm.licenseIssueDate} onChange={(e) => setDriverForm({ ...driverForm, licenseIssueDate: e.target.value })} />
            <input type="date" className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" value={driverForm.licenseExpiryDate} onChange={(e) => setDriverForm({ ...driverForm, licenseExpiryDate: e.target.value })} />
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" placeholder="Badge / driver code" value={driverForm.badgeCode} onChange={(e) => setDriverForm({ ...driverForm, badgeCode: e.target.value })} />
            <select className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" value={driverForm.status} onChange={(e) => setDriverForm({ ...driverForm, status: e.target.value })}>
              {['ACTIVE', 'INACTIVE', 'SUSPENDED'].map((status) => <option key={status}>{status}</option>)}
            </select>
            <select className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white md:col-span-2" value={driverForm.assignedVehicleId} onChange={(e) => setDriverForm({ ...driverForm, assignedVehicleId: e.target.value })}>
              <option value="">No assigned vehicle</option>
              {assignableVehicles.map((veh) => (
                <option key={veh.id} value={veh.id}>{veh.registrationNumber} · {veh.status}</option>
              ))}
            </select>
            <input className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white md:col-span-2" placeholder="Notes" value={driverForm.notes} onChange={(e) => setDriverForm({ ...driverForm, notes: e.target.value })} />
            <div className="md:col-span-4 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-slate-950 font-bold rounded-xl">
                {selectedDriverId ? 'Save driver changes' : '+ Add Driver Record'}
              </button>
              {selectedDriverId && (
                <button type="button" onClick={() => { setSelectedDriverId(''); setDriverForm({ ...driverForm, fullName: '', licenseNumber: '', badgeCode: '', assignedVehicleId: '' }); }} className="px-4 py-2 bg-slate-800 text-white rounded-xl">
                  New driver
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drivers.map((drv) => (
              <div key={drv.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-blue-400 font-bold">{drv.licenseNumber}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    drv.status === 'SUSPENDED' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {drv.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{drv.fullName}</h4>
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class:</span>
                    <span>{drv.licenseClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Badge:</span>
                    <span className="text-amber-300">{drv.badgeCode || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span>{drv.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned vehicle:</span>
                    <strong className="text-white">
                      {assignableVehicles.find((veh) => veh.id === drv.assignedVehicleId)?.registrationNumber || drv.assignedVehicleId || '—'}
                    </strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-1">
                    <span className="text-slate-400">License expiry:</span>
                    <span className="text-emerald-400">{drv.licenseExpiryDate || '—'}</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button onClick={() => handleViewDriver(drv.id)} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] rounded border border-slate-800 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> View / Edit
                  </button>
                  <button onClick={() => handleArchiveDriver(drv.id)} className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-[11px] rounded border border-rose-800">
                    Archive
                  </button>
                </div>
              </div>
            ))}
            {!driversLoading && drivers.length === 0 && (
              <p className="text-xs text-slate-500 md:col-span-3">No drivers yet. Create a driver master record.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: TRIP PLANNING & DISPATCH */}
      {activeTab === 'trip-dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trip Creation Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-400" /> Module 5: Create &amp; Dispatch Freight Trip
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Origin Point</label>
                <input
                  type="text"
                  value={newTripForm.origin}
                  onChange={(e) => setNewTripForm({ ...newTripForm, origin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Destination Delivery Site</label>
                <input
                  type="text"
                  value={newTripForm.destination}
                  onChange={(e) => setNewTripForm({ ...newTripForm, destination: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cargo Material</label>
                <input
                  type="text"
                  value={newTripForm.cargo}
                  onChange={(e) => setNewTripForm({ ...newTripForm, cargo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tonnage</label>
                  <input
                    type="number"
                    value={newTripForm.tonnage}
                    onChange={(e) => setNewTripForm({ ...newTripForm, tonnage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Freight (₹)</label>
                  <input
                    type="number"
                    value={newTripForm.freight}
                    onChange={(e) => setNewTripForm({ ...newTripForm, freight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Heavy Tipper / Vehicle</label>
                <select
                  value={newTripForm.assignedVehicle}
                  onChange={(e) => setNewTripForm({ ...newTripForm, assignedVehicle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="KA-19-AB-4491">KA-19-AB-4491 (BharatBenz 2823R)</option>
                  <option value="KA-20-C-9912">KA-20-C-9912 (Tata Prima 2830)</option>
                  <option value="KA-19-MC-8812">KA-19-MC-8812 (Ashok Leyland 5525)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
              >
                Dispatch Vehicle &amp; Generate Digital Gatepass
              </button>
            </form>
          </div>

          {/* Active Trips Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Active Freight Trips &amp; Proof of Delivery (POD)</span>
              <span className="text-xs font-mono text-blue-400">{trips.length} Dispatched</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {trips.map((trp) => (
                <div key={trp.tripId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-400">{trp.tripId}</span>
                    <span className="text-emerald-400">₹{trp.freightAmountRs.toLocaleString()}</span>
                  </div>

                  <p className="text-white text-sm font-bold">{trp.cargoType} ({trp.tonnageLoaded} Tons)</p>
                  <p className="text-slate-400 text-[11px]">{trp.originLocation} ➔ {trp.destinationLocation}</p>

                  <div className="flex justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-1">
                    <span>Vehicle: <strong className="text-white">{trp.assignedVehicleNo}</strong></span>
                    <span className="text-amber-300">OTP: <strong>{trp.customerOtp}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: RENTAL CONTRACTS */}
      {activeTab === 'rental-contracts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 6</span>
            <h2 className="text-xl font-bold text-white mt-1">Commercial Fleet Rental Agreements &amp; Lease Billing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RENTAL_CONTRACTS.map((cnt) => (
              <div key={cnt.contractId} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-blue-400 font-bold">{cnt.contractId}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">
                    {cnt.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{cnt.clientName}</h4>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lease Type:</span>
                    <span>{cnt.rentalType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicles Allocated:</span>
                    <strong className="text-white">{cnt.vehiclesAssignedCount} Dedicated Tippers</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Lease Value:</span>
                    <strong className="text-emerald-400">₹{cnt.monthlyRentalRateRs.toLocaleString()} / Mo</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: GPS TRACKING */}
      {activeTab === 'gps-tracking' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 8</span>
            <h2 className="text-xl font-bold text-white mt-1">Real-Time Vehicle GPS Tracking &amp; Geofencing Alerts</h2>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-emerald-400 font-bold">100% Active Satellite GPS Feed</span>
              <span>Geofence Zone: Bantwal Quarry &amp; Highway Radius (50 Km)</span>
            </div>

            <div className="h-48 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-sm">
              <Compass className="w-8 h-8 text-blue-400 animate-spin mr-2" />
              <span>Google Maps GIS Layers Active — 44 Vehicles Transmitting Live Telemetry</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: FUEL MANAGEMENT */}
      {activeTab === 'fuel-management' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 9</span>
            <h2 className="text-xl font-bold text-white mt-1">Fuel Consumption Telematics &amp; AI Anti-Theft Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-slate-400 text-[10px] block">Daily Fuel Issued</span>
              <strong className="text-amber-400 text-lg">1,840 Liters</strong>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-slate-400 text-[10px] block">Fleet Average Mileage</span>
              <strong className="text-emerald-400 text-lg">2.82 Km / Liter</strong>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-slate-400 text-[10px] block">AI Anti-Theft Status</span>
              <strong className="text-blue-400 text-lg">0 Fuel Drop Anomalies</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 10</span>
            <h2 className="text-xl font-bold text-white mt-1">Vehicle Workshop Maintenance &amp; Tyre Management</h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {MAINTENANCE_LOGS.map((maint) => (
              <div key={maint.jobCardId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <strong className="text-blue-400 block">{maint.jobCardId} — {maint.vehicleNo}</strong>
                  <span className="text-white font-bold">{maint.maintenanceType}</span>
                  <p className="text-slate-400 text-[11px]">{maint.workshopName} • Odometer: {maint.odometerReadingKm} Km</p>
                </div>
                <div className="text-right">
                  <strong className="text-emerald-400 block text-sm">₹{maint.costRs.toLocaleString()}</strong>
                  <span className="text-emerald-300 text-[10px]">{maint.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Modules 11 &amp; 12</span>
            <h2 className="text-xl font-bold text-white mt-1">Commercial Load &amp; Used Vehicle Marketplace</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Loads */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-blue-400">Available Load Bids</h4>
              {FREIGHT_MARKETPLACE_LOADS.map((load) => (
                <div key={load.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <strong className="text-white block">{load.consignorName}</strong>
                  <p className="text-slate-400 text-[11px]">{load.routeFromTo} • {load.weightTons} Tons {load.materialType}</p>
                  <div className="flex justify-between text-amber-300 font-bold pt-1">
                    <span>Rate: ₹{load.offeredFreightPerTonRs} / Ton</span>
                    <span>{load.bidsReceivedCount} Bids</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Used Vehicles */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-emerald-400">Used Vehicle Listings</h4>
              {USED_VEHICLE_MARKETPLACE.map((mkt) => (
                <div key={mkt.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <strong className="text-white block">{mkt.title}</strong>
                  <p className="text-slate-400 text-[11px]">Year {mkt.manufactureYear} • {mkt.odometerKm} Km</p>
                  <div className="flex justify-between text-emerald-400 font-bold pt-1">
                    <span>₹{(mkt.askingPriceRs / 100000).toFixed(2)} Lakhs</span>
                    <span className="text-amber-300">Score: {mkt.inspectionScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: CUSTOMER PORTAL */}
      {activeTab === 'customer-portal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 13</span>
            <h2 className="text-xl font-bold text-white mt-1">Customer &amp; Consignor Transport Portal</h2>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
            <p className="text-slate-300 leading-relaxed">
              Consignors can book dedicated tippers or multi-axle trailers, track live vehicle delivery progress on interactive maps, download signed E-Way bills &amp; digital POD certificates instantly.
            </p>
            <button
              onClick={() => showToast('Simulated Customer Portal Booking Link!')}
              className="px-4 py-2 bg-blue-500 text-slate-950 font-bold rounded-xl"
            >
              Open Consignor Live Tracking Link
            </button>
          </div>
        </div>
      )}

      {/* TAB 12: AI COMMAND CENTER */}
      {activeTab === 'ai-analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Modules 14 &amp; 15</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Fleet Command Center &amp; Profitability Analytics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-blue-400">AI Route &amp; Fuel Optimization</h4>
              <p className="text-slate-300 leading-relaxed">
                AI recommends optimal bypass routes, reducing fuel burn by 6.2% across quarry-to-site transit corridors.
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-emerald-400">Fleet Profitability Score</h4>
              <p className="text-slate-300 leading-relaxed">
                Operating Net Profitability: <strong className="text-emerald-400">22.4%</strong> per freight trip.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 13: ECOSYSTEM */}
      {activeTab === 'ecosystem' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 16</span>
            <h2 className="text-xl font-bold text-white mt-1">Shared Core &amp; Ecosystem Interoperability</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-blue-400 font-bold block">Fleet ↔ Mining</span>
              <span className="text-slate-400">Automatic tipper queue linking at scalehouse weighbridge.</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-emerald-400 font-bold block">Fleet ↔ Finance</span>
              <span className="text-slate-400">Real-time freight revenue &amp; fuel expense ledger postings.</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-amber-400 font-bold block">Fleet ↔ HRMS</span>
              <span className="text-slate-400">Driver trip incentive &amp; allowance auto-calculation.</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-purple-400 font-bold block">Fleet ↔ Marketplace</span>
              <span className="text-slate-400">Live load bidding &amp; third-party transport agency integration.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
