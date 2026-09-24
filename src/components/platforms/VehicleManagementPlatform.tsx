import React, { useState } from 'react';
import {
  Truck,
  Users,
  Navigation,
  Fuel,
  Wrench,
  Disc,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Scale,
  FileText,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  ChevronRight,
  Check
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import {
  DEMO_VEHICLES,
  DEMO_DRIVERS,
  DEMO_OWNERS,
  DEMO_TRIPS,
  DEMO_DISPATCH_LOADS,
  DEMO_DELIVERIES,
  DEMO_FUEL_RECORDS,
  DEMO_TOLL_RECORDS,
  DEMO_BATTA_RECORDS,
  DEMO_MAINTENANCE_RECORDS,
  DEMO_TYRE_RECORDS,
  DEMO_SETTLEMENTS,
  DEMO_DOCUMENTS,
  Vehicle,
  Driver,
  VehicleOwner,
  Trip,
  DispatchLoad,
  Delivery,
  FuelRecord,
  TollRecord,
  DriverBattaRecord,
  MaintenanceRecord,
  TyreRecord,
  OwnerSettlementRecord,
  VehicleDocument
} from '../../data/vehicleStudioData';

// View Imports
import { VehicleDashboardView } from '../vehicle/VehicleDashboardView';
import { VehicleListView } from '../vehicle/VehicleListView';
import { VehicleProfileView } from '../vehicle/VehicleProfileView';
import { VehicleOwnersView } from '../vehicle/VehicleOwnersView';
import { VehicleOwnershipConfigView } from '../vehicle/VehicleOwnershipConfigView';
import { VehicleDriversView } from '../vehicle/VehicleDriversView';
import { VehicleTripsView } from '../vehicle/VehicleTripsView';
import { VehicleLoadsView } from '../vehicle/VehicleLoadsView';
import { VehicleDeliveryView } from '../vehicle/VehicleDeliveryView';
import { VehicleFuelView } from '../vehicle/VehicleFuelView';
import { VehicleTollView } from '../vehicle/VehicleTollView';
import { VehicleBattaView } from '../vehicle/VehicleBattaView';
import { VehicleMaintenanceView } from '../vehicle/VehicleMaintenanceView';
import { VehicleTyresView } from '../vehicle/VehicleTyresView';
import { VehicleComplianceView } from '../vehicle/VehicleComplianceView';
import { VehicleFinanceView } from '../vehicle/VehicleFinanceView';
import { VehicleTripAccountsView } from '../vehicle/VehicleTripAccountsView';
import { VehiclePnlView } from '../vehicle/VehiclePnlView';
import { VehicleOwnerSettlementView } from '../vehicle/VehicleOwnerSettlementView';
import { VehicleDocumentsView } from '../vehicle/VehicleDocumentsView';
import { VehicleReportsView } from '../vehicle/VehicleReportsView';
import { VehicleModals } from '../vehicle/VehicleModals';

interface VehicleManagementPlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
}

export type VehicleSubpageId =
  | 'dashboard'
  | 'vehicles'
  | 'vehicle-owners'
  | 'drivers'
  | 'ownership'
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
  | 'owner-settlement'
  | 'documents'
  | 'reports';

export const VehicleManagementPlatform: React.FC<VehicleManagementPlatformProps> = ({
  onNavigateSection
}) => {
  // Navigation State
  const [activePage, setActivePage] = useState<VehicleSubpageId>('dashboard');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Data State (Stateful Studio Preview)
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEMO_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(DEMO_DRIVERS);
  const [owners, setOwners] = useState<VehicleOwner[]>(DEMO_OWNERS);
  const [trips, setTrips] = useState<Trip[]>(DEMO_TRIPS);
  const [loads, setLoads] = useState<DispatchLoad[]>(DEMO_DISPATCH_LOADS);
  const [deliveries, setDeliveries] = useState<Delivery[]>(DEMO_DELIVERIES);
  const [fuels, setFuels] = useState<FuelRecord[]>(DEMO_FUEL_RECORDS);
  const [tolls, setTolls] = useState<TollRecord[]>(DEMO_TOLL_RECORDS);
  const [battas, setBattas] = useState<DriverBattaRecord[]>(DEMO_BATTA_RECORDS);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>(DEMO_MAINTENANCE_RECORDS);
  const [tyres, setTyres] = useState<TyreRecord[]>(DEMO_TYRE_RECORDS);
  const [settlements, setSettlements] = useState<OwnerSettlementRecord[]>(DEMO_SETTLEMENTS);
  const [documents, setDocuments] = useState<VehicleDocument[]>(DEMO_DOCUMENTS);

  // Modal and Toast State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Exactly matching Specification 1. VEHICLE MANAGEMENT ENTRY: Secondary navigation
  const SUBPAGES: {
    id: VehicleSubpageId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    category?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'vehicle-owners', label: 'Vehicle Owners', icon: Users },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'ownership', label: 'Ownership', icon: Scale },
    { id: 'trips', label: 'Trips', icon: Navigation },
    { id: 'loads', label: 'Loads', icon: Package },
    { id: 'delivery', label: 'Delivery', icon: CheckCircle2 },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'toll', label: 'Toll', icon: DollarSign },
    { id: 'batta', label: 'Driver Batta', icon: DollarSign },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'tyres', label: 'Tyres', icon: Disc },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'tax', label: 'Tax', icon: FileText },
    { id: 'permit', label: 'Permit', icon: FileText },
    { id: 'fitness', label: 'Fitness', icon: CheckCircle2 },
    { id: 'pollution', label: 'Pollution', icon: ShieldCheck },
    { id: 'finance', label: 'EMI / Finance', icon: TrendingUp },
    { id: 'trip-accounts', label: 'Trip Accounts', icon: DollarSign },
    { id: 'pnl', label: 'Vehicle P&L', icon: BarChart3 },
    { id: 'owner-settlement', label: 'Owner Settlement', icon: Scale },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  // Handlers for Data Mutations
  const handleSaveVehicle = (newVeh: Vehicle) => {
    setVehicles([newVeh, ...vehicles]);
    showToast(`Vehicle ${newVeh.vehicleNumber} successfully registered`);
  };

  const handleSaveTrip = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    showToast(`Trip ${newTrip.tripNumber} created with Waybill`);
  };

  const handleSaveFuel = (newFuel: FuelRecord) => {
    setFuels([newFuel, ...fuels]);
    showToast(`Diesel slip ${newFuel.slipNumber} logged: ₹${newFuel.totalAmount}`);
  };

  const handleSaveToll = (newToll: TollRecord) => {
    setTolls([newToll, ...tolls]);
    showToast(`Toll at ${newToll.tollPlaza} recorded: ₹${newToll.amount}`);
  };

  const handleSaveBatta = (newBatta: DriverBattaRecord) => {
    setBattas([newBatta, ...battas]);
    showToast(`Batta ${newBatta.referenceNumber} disbursed: ₹${newBatta.amount}`);
  };

  const handleSaveMaintenance = (newMaint: MaintenanceRecord) => {
    setMaintenances([newMaint, ...maintenances]);
    showToast(`Service order recorded: ₹${newMaint.cost}`);
  };

  const handleSaveTyre = (newTyre: TyreRecord) => {
    setTyres([newTyre, ...tyres]);
    showToast(`Tyre ${newTyre.tyreNumber} mounted to ${newTyre.position}`);
  };

  const handleSaveSettlement = (newSettlement: OwnerSettlementRecord) => {
    setSettlements([newSettlement, ...settlements]);
    showToast(`Settlement ${newSettlement.settlementNumber} voucher generated`);
  };

  const handleUpdateDeliveryStatus = (deliveryId: string, nextStatus: any) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? { ...d, status: nextStatus } : d))
    );
    showToast(`Delivery status advanced to: ${nextStatus}`);
  };

  const handleApproveSettlement = (settlementId: string) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === settlementId ? { ...s, status: 'Paid' } : s))
    );
    showToast(`Settlement marked Paid / Disbursed via RTGS`);
  };

  const handleUpdateDriverDutyStatus = (driverId: string, nextStatus: any) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, dutyStatus: nextStatus } : d))
    );
    showToast(`Driver duty status updated to: ${nextStatus}`);
  };

  const handleUpdateOwnershipRatios = (vehicleId: string, updatedRatios: any[]) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, ownershipRatios: updatedRatios } : v))
    );
    showToast('Ownership & Profit ratios re-calibrated successfully');
  };

  // Find currently selected vehicle if any
  const currentSelectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-slate-950 px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-cyan-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Interactive Modal Controller */}
      <VehicleModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        vehicles={vehicles}
        drivers={drivers}
        owners={owners}
        onSaveVehicle={handleSaveVehicle}
        onSaveTrip={handleSaveTrip}
        onSaveFuel={handleSaveFuel}
        onSaveToll={handleSaveToll}
        onSaveBatta={handleSaveBatta}
        onSaveMaintenance={handleSaveMaintenance}
        onSaveTyre={handleSaveTyre}
        onSaveSettlement={handleSaveSettlement}
      />

      {/* Top Banner: Master Header & End-to-End Workflow Trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                03 VEHICLE MANAGEMENT &bull; RZ MINETRIX
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                Studio Preview / Demo Data
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Commercial Fleet & Transport Operations</h1>
            <p className="text-xs text-slate-400">
              End-to-end mineral logistics, Multi-owner syndicates, Vadaka profitability & RTO statutory compliance
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Item 31: End-to-End Traceability Workflow Button */}
          <button
            onClick={() => setActiveModal('e2e-workflow')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>End-to-End Traceability Workflow</span>
          </button>

          <button
            onClick={() => setActiveModal('add-vehicle')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Vehicle</span>
          </button>

          <button
            onClick={() => setActiveModal('add-trip')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ New Trip</span>
          </button>
        </div>
      </div>

      {/* SECONDARY NAVIGATION: Exactly 24 Subpages per Specification */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-inner overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {SUBPAGES.map((page, idx) => {
            const isAct = activePage === page.id && !selectedVehicleId;
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => {
                  setSelectedVehicleId(null);
                  setActivePage(page.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isAct
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SUBPAGE ROUTING */}

      {/* If a vehicle profile is selected from any subpage, render VehicleProfileView */}
      {selectedVehicleId && currentSelectedVehicle ? (
        <VehicleProfileView
          vehicle={currentSelectedVehicle}
          trips={trips}
          fuels={fuels}
          tolls={tolls}
          battas={battas}
          maintenances={maintenances}
          tyres={tyres}
          settlements={settlements}
          documents={documents}
          onBack={() => setSelectedVehicleId(null)}
          onUpdateOwnershipRatios={handleUpdateOwnershipRatios}
          onCreateOttTask={(t) => showToast(t)}
        />
      ) : (
        <>
          {/* 1. DASHBOARD */}
          {activePage === 'dashboard' && (
            <VehicleDashboardView
              vehicles={vehicles}
              drivers={drivers}
              owners={owners}
              trips={trips}
              fuels={fuels}
              tolls={tolls}
              onNavigateSubpage={(p) => setActivePage(p as any)}
              onOpenAddVehicleModal={() => setActiveModal('add-vehicle')}
              onOpenAddTripModal={() => setActiveModal('add-trip')}
              onOpenAddFuelModal={() => setActiveModal('add-fuel')}
              onOpenAddTollModal={() => setActiveModal('add-toll')}
              onOpenAddBattaModal={() => setActiveModal('add-batta')}
              onOpenAddMaintenanceModal={() => setActiveModal('add-maintenance')}
              onOpenSettlementModal={() => setActiveModal('add-settlement')}
              onSelectVehicle={(vehId) => setSelectedVehicleId(vehId)}
              onCreateOttTask={(t) => showToast(t)}
            />
          )}

          {/* 2. VEHICLES */}
          {activePage === 'vehicles' && (
            <VehicleListView
              vehicles={vehicles}
              onSelectVehicle={(vehId) => setSelectedVehicleId(vehId)}
              onOpenAddVehicleModal={() => setActiveModal('add-vehicle')}
            />
          )}

          {/* 3. VEHICLE OWNERS */}
          {activePage === 'vehicle-owners' && (
            <VehicleOwnersView
              owners={owners}
              vehicles={vehicles}
              settlements={settlements}
              onOpenOwnershipConfig={(vehId) => {
                setSelectedVehicleId(vehId);
              }}
              onOpenNewSettlementModal={() => setActiveModal('add-settlement')}
            />
          )}

          {/* 4. DRIVERS */}
          {activePage === 'drivers' && (
            <VehicleDriversView
              drivers={drivers}
              vehicles={vehicles}
              onUpdateDriverDutyStatus={handleUpdateDriverDutyStatus}
              onCreateOttTask={(t) => showToast(t)}
            />
          )}

          {/* 5. OWNERSHIP CONFIG (Independent Ratios) */}
          {activePage === 'ownership' && (
            <VehicleOwnershipConfigView
              vehicles={vehicles}
              onSaveRatios={handleUpdateOwnershipRatios}
            />
          )}

          {/* 6. TRIPS */}
          {activePage === 'trips' && (
            <VehicleTripsView
              trips={trips}
              vehicles={vehicles}
              drivers={drivers}
              onOpenNewTripModal={() => setActiveModal('add-trip')}
            />
          )}

          {/* 7. LOADS */}
          {activePage === 'loads' && (
            <VehicleLoadsView
              loads={loads}
              onOpenNewLoadModal={() => setActiveModal('add-trip')}
            />
          )}

          {/* 8. DELIVERY */}
          {activePage === 'delivery' && (
            <VehicleDeliveryView
              deliveries={deliveries}
              onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
            />
          )}

          {/* 9. FUEL */}
          {activePage === 'fuel' && (
            <VehicleFuelView
              fuels={fuels}
              vehicles={vehicles}
              onOpenFuelModal={() => setActiveModal('add-fuel')}
            />
          )}

          {/* 10. TOLL */}
          {activePage === 'toll' && (
            <VehicleTollView
              tolls={tolls}
              vehicles={vehicles}
              onOpenTollModal={() => setActiveModal('add-toll')}
            />
          )}

          {/* 11. DRIVER BATTA */}
          {activePage === 'batta' && (
            <VehicleBattaView
              battas={battas}
              drivers={drivers}
              vehicles={vehicles}
              onOpenAddBattaModal={() => setActiveModal('add-batta')}
            />
          )}

          {/* 12. MAINTENANCE */}
          {activePage === 'maintenance' && (
            <VehicleMaintenanceView
              maintenances={maintenances}
              vehicles={vehicles}
              onOpenMaintenanceModal={() => setActiveModal('add-maintenance')}
              onCreateOttTask={(t) => showToast(t)}
            />
          )}

          {/* 13. TYRES */}
          {activePage === 'tyres' && (
            <VehicleTyresView
              tyres={tyres}
              vehicles={vehicles}
              onOpenAddTyreModal={() => setActiveModal('add-tyre')}
              onRotateTyreModal={() => showToast('Tyre axle rotation sequence logged')}
            />
          )}

          {/* 14-18. STATUTORY COMPLIANCE (Insurance, Tax, Permit, Fitness, Pollution) */}
          {(activePage === 'insurance' ||
            activePage === 'tax' ||
            activePage === 'permit' ||
            activePage === 'fitness' ||
            activePage === 'pollution') && (
            <VehicleComplianceView
              vehicles={vehicles}
              onCreateOttTask={(t) => showToast(t)}
              onRenewDocument={(vehNum, doc) => showToast(`Renewal initiated for ${vehNum} (${doc})`)}
            />
          )}

          {/* 19. EMI / FINANCE */}
          {activePage === 'finance' && (
            <VehicleFinanceView
              vehicles={vehicles}
              onCreateOttTask={(t) => showToast(t)}
            />
          )}

          {/* 20. TRIP ACCOUNTS (Vadaka) */}
          {activePage === 'trip-accounts' && (
            <VehicleTripAccountsView
              trips={trips}
              vehicles={vehicles}
            />
          )}

          {/* 21. VEHICLE P&L */}
          {activePage === 'pnl' && (
            <VehiclePnlView
              vehicles={vehicles}
            />
          )}

          {/* 22. OWNER SETTLEMENT */}
          {activePage === 'owner-settlement' && (
            <VehicleOwnerSettlementView
              settlements={settlements}
              owners={owners}
              vehicles={vehicles}
              onOpenNewSettlementModal={() => setActiveModal('add-settlement')}
              onApproveSettlement={handleApproveSettlement}
            />
          )}

          {/* 23. DOCUMENTS */}
          {activePage === 'documents' && (
            <VehicleDocumentsView
              documents={documents}
              vehicles={vehicles}
              onUploadDocument={() => showToast('Upload document dialog initialized')}
            />
          )}

          {/* 24. REPORTS */}
          {activePage === 'reports' && (
            <VehicleReportsView
              vehicles={vehicles}
            />
          )}
        </>
      )}
    </div>
  );
};
