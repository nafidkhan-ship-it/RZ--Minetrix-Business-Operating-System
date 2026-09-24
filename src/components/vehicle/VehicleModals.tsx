import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  Fuel,
  CreditCard,
  DollarSign,
  Wrench,
  Disc,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  Vehicle,
  Driver,
  VehicleOwner,
  Trip,
  FuelRecord,
  TollRecord,
  DriverBattaRecord,
  MaintenanceRecord,
  TyreRecord,
  OwnerSettlementRecord
} from '../../data/vehicleStudioData';

interface VehicleModalsProps {
  activeModal: string | null;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  owners: VehicleOwner[];
  onSaveVehicle?: (vehicle: any) => void;
  onSaveTrip?: (trip: any) => void;
  onSaveFuel?: (fuel: any) => void;
  onSaveToll?: (toll: any) => void;
  onSaveBatta?: (batta: any) => void;
  onSaveMaintenance?: (maint: any) => void;
  onSaveTyre?: (tyre: any) => void;
  onSaveSettlement?: (settlement: any) => void;
}

export const VehicleModals: React.FC<VehicleModalsProps> = ({
  activeModal,
  onClose,
  vehicles,
  drivers,
  owners,
  onSaveVehicle,
  onSaveTrip,
  onSaveFuel,
  onSaveToll,
  onSaveBatta,
  onSaveMaintenance,
  onSaveTyre,
  onSaveSettlement
}) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      {/* 1. END-TO-END WORKFLOW SIMULATOR MODAL */}
      {activeModal === 'e2e-workflow' && (
        <E2EWorkflowModal onClose={onClose} vehicles={vehicles} />
      )}

      {/* 2. ADD VEHICLE MODAL */}
      {activeModal === 'add-vehicle' && (
        <AddVehicleModal
          onClose={onClose}
          drivers={drivers}
          owners={owners}
          onSave={(v) => {
            onSaveVehicle?.(v);
            onClose();
          }}
        />
      )}

      {/* 3. ADD TRIP MODAL */}
      {activeModal === 'add-trip' && (
        <AddTripModal
          onClose={onClose}
          vehicles={vehicles}
          drivers={drivers}
          onSave={(t) => {
            onSaveTrip?.(t);
            onClose();
          }}
        />
      )}

      {/* 4. ADD FUEL MODAL */}
      {activeModal === 'add-fuel' && (
        <AddFuelModal
          onClose={onClose}
          vehicles={vehicles}
          drivers={drivers}
          onSave={(f) => {
            onSaveFuel?.(f);
            onClose();
          }}
        />
      )}

      {/* 5. ADD TOLL MODAL */}
      {activeModal === 'add-toll' && (
        <AddTollModal
          onClose={onClose}
          vehicles={vehicles}
          onSave={(t) => {
            onSaveToll?.(t);
            onClose();
          }}
        />
      )}

      {/* 6. ADD BATTA MODAL */}
      {activeModal === 'add-batta' && (
        <AddBattaModal
          onClose={onClose}
          vehicles={vehicles}
          drivers={drivers}
          onSave={(b) => {
            onSaveBatta?.(b);
            onClose();
          }}
        />
      )}

      {/* 7. ADD MAINTENANCE MODAL */}
      {activeModal === 'add-maintenance' && (
        <AddMaintenanceModal
          onClose={onClose}
          vehicles={vehicles}
          onSave={(m) => {
            onSaveMaintenance?.(m);
            onClose();
          }}
        />
      )}

      {/* 8. ADD TYRE MODAL */}
      {activeModal === 'add-tyre' && (
        <AddTyreModal
          onClose={onClose}
          vehicles={vehicles}
          onSave={(t) => {
            onSaveTyre?.(t);
            onClose();
          }}
        />
      )}

      {/* 9. ADD SETTLEMENT MODAL */}
      {activeModal === 'add-settlement' && (
        <AddSettlementModal
          onClose={onClose}
          vehicles={vehicles}
          owners={owners}
          onSave={(s) => {
            onSaveSettlement?.(s);
            onClose();
          }}
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 1. END-TO-END WORKFLOW MODAL (Item 31 in specification)
 * ------------------------------------------------------------- */
const E2EWorkflowModal: React.FC<{ onClose: () => void; vehicles: Vehicle[] }> = ({
  onClose,
  vehicles
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const STEPS = [
    { title: 'Quarry Blasting & ROM', entity: '01 Quarry Mgmt', desc: 'Granite face blasted. 800T ROM boulders loaded by Excavator EX-01 onto Tipper.' },
    { title: 'Excavator / Loader Loading', entity: '01 Quarry Mgmt', desc: 'Bucket loader fills Tipper KL-45-AB-1234 with raw granite boulders.' },
    { title: 'Vehicle Dispatch & Gate Pass', entity: '03 Vehicle Mgmt', desc: 'Automated Trip TRP-2024-001 created. Driver assigned with Fastag validation.' },
    { title: 'Weighbridge Gross Weighment', entity: '01 Weighbridge', desc: 'Gross weighment: 38.60 MT recorded. RFID tare correlation complete.' },
    { title: 'Crusher Receiving Hopper', entity: '02 Crusher Mgmt', desc: 'Tipper discharges into Primary Jaw Crusher Hopper. Net 24.20 MT registered.' },
    { title: 'Primary & Secondary Crushing', entity: '02 Crusher Mgmt', desc: 'Reduction into 20mm aggregates, 10mm metal & M-Sand stockpiles.' },
    { title: 'Finished Loading & Dispatch', entity: '02 Crusher Mgmt', desc: 'Finished aggregates loaded into commercial dumper for customer site.' },
    { title: 'Customer Weighment & e-Way Bill', entity: '03 Vehicle Mgmt', desc: 'Delivery e-Way bill #987211029 validated at customer receiver checkpoint.' },
    { title: 'Customer Digital Confirmation', entity: '03 Vehicle Mgmt', desc: 'Signed receipt captured. Delivery status moves to Customer Confirmed.' },
    { title: 'Vadaka Freight Calculation', entity: '03 Vehicle Mgmt', desc: 'Gross freight ₹16,000 less Fuel (₹4,200), Toll (₹380), Batta (₹600) = ₹10,820 Net.' },
    { title: 'Owner Syndicate Settlement', entity: '03 Vehicle Mgmt', desc: '60% / 40% independent ratios applied. Automatic bank payout ledger updated.' },
    { title: 'RZ Unified Accounting Entry', entity: 'RZ General Ledger', desc: 'Double-entry journal posted: Debited Freight Receivable, Credited Partner Payout.' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              RZ MINETRIX UNIFIED LIFECYCLE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              Interactive Simulation
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            End-to-End Mineral Traceability Pipeline
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Step {currentStep + 1} of {STEPS.length}:</span>
          <span className="font-mono text-cyan-400 font-bold">{STEPS[currentStep].title}</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-cyan-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Step Card */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-[10px] border border-cyan-500/20">
            {STEPS[currentStep].entity}
          </span>
          <span className="font-mono text-slate-500 text-[11px]">Milestone {currentStep + 1} / 12</span>
        </div>

        <h4 className="text-base font-bold text-white">{STEPS[currentStep].title}</h4>
        <p className="text-slate-300 text-xs leading-relaxed">{STEPS[currentStep].desc}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold transition cursor-pointer"
        >
          Previous Step
        </button>

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>Advance Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Full Cycle</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. ADD VEHICLE MODAL
 * ------------------------------------------------------------- */
const AddVehicleModal: React.FC<{
  onClose: () => void;
  drivers: Driver[];
  owners: VehicleOwner[];
  onSave: (v: any) => void;
}> = ({ onClose, drivers, owners, onSave }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleCode, setVehicleCode] = useState('TRK-05');
  const [vehicleType, setVehicleType] = useState('Tipper (10-Wheeler)');
  const [make, setMake] = useState('BharatBenz');
  const [model, setModel] = useState('2828C');
  const [payloadCapacityMT, setPayloadCapacityMT] = useState(24);
  const [assignedDriverName, setAssignedDriverName] = useState(drivers[0]?.name || '');
  const [ownershipType, setOwnershipType] = useState('Co-owned');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber) return;

    onSave({
      id: `veh-${Date.now()}`,
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleCode,
      vehicleType,
      make,
      model,
      yearOfManufacture: 2023,
      chassisNumber: `MB19302198${Date.now().toString().slice(-4)}`,
      engineNumber: `ENG-882910${Date.now().toString().slice(-3)}`,
      grossVehicleWeightKg: 28000,
      unladenWeightKg: 8500,
      payloadCapacityMT: Number(payloadCapacityMT),
      fuelType: 'Diesel (HSD)',
      tankCapacityLiters: 300,
      ownershipType,
      currentOdometerKm: 12000,
      assignedDriverName,
      status: 'Available',
      currentLocation: 'Crusher Yard A',
      monthTripsCount: 0,
      monthRevenue: 0,
      monthExpense: 0,
      monthNetContribution: 0,
      compliance: {
        insurance: { type: 'insurance', identifier: 'POL-NEW-99', providerOrAuthority: 'ICICI Lombard', expiryDate: '2025-08-15', status: 'Active' },
        tax: { type: 'tax', identifier: 'TAX-NEW-99', providerOrAuthority: 'RTO Kerala', expiryDate: '2025-06-30', status: 'Active' },
        permit: { type: 'permit', identifier: 'NP-NEW-99', providerOrAuthority: 'National Permit Authority', expiryDate: '2026-01-10', status: 'Active' },
        fitness: { type: 'fitness', identifier: 'FC-NEW-99', providerOrAuthority: 'Motor Vehicles Testing Stn', expiryDate: '2025-09-20', status: 'Active' },
        pollution: { type: 'pollution', identifier: 'PUC-NEW-99', providerOrAuthority: 'Green Tech Emission', expiryDate: '2025-03-15', status: 'Active' }
      },
      finance: { hasFinance: false, financeProvider: '', loanAccountNumber: '', loanAmount: 0, emiAmount: 0, totalPaid: 0, outstandingAmount: 0, interestRate: 0, nextDueDate: '', status: 'Closed' },
      ownershipRatios: [
        { ownerName: 'Person B', ownershipPercent: 60, investmentPercent: 60, revenuePercent: 60, expensePercent: 60, profitPercent: 60, lossPercent: 60 },
        { ownerName: 'Person E', ownershipPercent: 40, investmentPercent: 40, revenuePercent: 40, expensePercent: 40, profitPercent: 40, lossPercent: 40 }
      ]
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Add New Commercial Vehicle</h3>
          <p className="text-slate-400 text-[11px]">Register haulage asset to the fleet registry</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Registration # (Plate)</label>
            <input
              type="text"
              required
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. KL-07-CD-5678"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Vehicle Code</label>
            <input
              type="text"
              value={vehicleCode}
              onChange={(e) => setVehicleCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Vehicle Body Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:border-cyan-500"
            >
              <option value="Tipper (10-Wheeler)">Tipper (10-Wheeler)</option>
              <option value="Dumper (12-Wheeler)">Dumper (12-Wheeler)</option>
              <option value="Heavy Trailer (14-Wheeler)">Heavy Trailer (14-Wheeler)</option>
              <option value="Water Tanker">Water Tanker</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Payload Capacity (MT)</label>
            <input
              type="number"
              value={payloadCapacityMT}
              onChange={(e) => setPayloadCapacityMT(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Make / Manufacturer</label>
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Assigned Driver</label>
            <select
              value={assignedDriverName}
              onChange={(e) => setAssignedDriverName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:border-cyan-500"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.driverCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Ownership Model</label>
            <select
              value={ownershipType}
              onChange={(e) => setOwnershipType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:border-cyan-500"
            >
              <option value="Company Owned">Company Owned (100%)</option>
              <option value="Co-owned">Co-owned (Syndicate Multi-Partner)</option>
              <option value="Attached / Contract">Attached / Contract Carrier</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer"
          >
            Save Vehicle
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. ADD TRIP MODAL
 * ------------------------------------------------------------- */
const AddTripModal: React.FC<{
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  onSave: (t: any) => void;
}> = ({ onClose, vehicles, drivers, onSave }) => {
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0]?.vehicleNumber || '');
  const [driverName, setDriverName] = useState(drivers[0]?.name || '');
  const [customerName, setCustomerName] = useState('L&T Highway Project');
  const [pickupLocation, setPickupLocation] = useState('Crusher Plant Unit 1');
  const [destinationLocation, setDestinationLocation] = useState('NH-66 Flyover Pier 14');
  const [material, setMaterial] = useState('20mm Aggregate');
  const [tonnageMT, setTonnageMT] = useState(24.2);
  const [tripIncome, setTripIncome] = useState(16500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `trip-${Date.now()}`,
      tripNumber: `TRP-2024-${Math.floor(100 + Math.random() * 900)}`,
      vehicleNumber,
      driverName,
      tripDate: new Date().toISOString().split('T')[0],
      tripType: 'Customer Delivery',
      pickupLocation,
      destinationLocation,
      customerName,
      material,
      tonnageMT: Number(tonnageMT),
      distanceKm: 95,
      startOdometerKm: 42100,
      endOdometerKm: 42195,
      ratePerMT: Math.round(Number(tripIncome) / Number(tonnageMT)),
      tripIncome: Number(tripIncome),
      fuelCost: 4200,
      tollCost: 380,
      driverBatta: 600,
      loadingUnloadingCost: 500,
      otherExpense: 0,
      tripContribution: Number(tripIncome) - (4200 + 380 + 600 + 500),
      status: 'In Transit'
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Create New Haulage Trip</h3>
          <p className="text-slate-400 text-[11px]">Initiate dispatch and generate consignment waybill</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Vehicle</label>
            <select
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleNumber}>
                  {v.vehicleNumber} ({v.vehicleCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Assigned Driver</label>
            <select
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Customer / Consignee</label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Origin Quarry / Crusher</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Destination Site</label>
            <input
              type="text"
              value={destinationLocation}
              onChange={(e) => setDestinationLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Material</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="20mm Aggregate">20mm Aggregate</option>
              <option value="10mm Aggregate">10mm Aggregate</option>
              <option value="40mm Road Metal">40mm Road Metal</option>
              <option value="M-Sand Manufactured">M-Sand Manufactured</option>
              <option value="GMM Granular Sub-base">GMM Granular Sub-base</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Net Weight (MT)</label>
            <input
              type="number"
              step="0.1"
              value={tonnageMT}
              onChange={(e) => setTonnageMT(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Freight Income (₹)</label>
            <input
              type="number"
              value={tripIncome}
              onChange={(e) => setTripIncome(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer">
            Create Trip
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------
 * 4. ADD FUEL MODAL
 * ------------------------------------------------------------- */
const AddFuelModal: React.FC<{
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  onSave: (f: any) => void;
}> = ({ onClose, vehicles, drivers, onSave }) => {
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0]?.vehicleNumber || '');
  const [driverName, setDriverName] = useState(drivers[0]?.name || '');
  const [fuelStation, setFuelStation] = useState('Indian Oil Highway Pump');
  const [liters, setLiters] = useState(85);
  const [rate, setRate] = useState(92.4);
  const [odometerKm, setOdometerKm] = useState(42200);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = Math.round(liters * rate);
    onSave({
      id: `fuel-${Date.now()}`,
      slipNumber: `DSL-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleNumber,
      driverName,
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      fuelStation,
      fuelType: 'HSD Diesel',
      quantityLiters: Number(liters),
      ratePerLiter: Number(rate),
      totalAmount,
      odometerKm: Number(odometerKm),
      paymentMethod: 'Fuel Card',
      kmRun: 290,
      mileageKmpL: Number((290 / liters).toFixed(2)),
      costPerKm: Number((totalAmount / 290).toFixed(2))
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Log Diesel Refuelling Slip</h3>
          <p className="text-slate-400 text-[11px]">Record fuel pump slip with odometer calibration</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Vehicle</label>
            <select
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleNumber}>
                  {v.vehicleNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Driver</label>
            <select
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Fuel Station</label>
          <input
            type="text"
            value={fuelStation}
            onChange={(e) => setFuelStation(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Volume (Liters)</label>
            <input
              type="number"
              value={liters}
              onChange={(e) => setLiters(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Rate / Liter (₹)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Odometer (KM)</label>
            <input
              type="number"
              value={odometerKm}
              onChange={(e) => setOdometerKm(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">Calculated Diesel Total:</span>
          <span className="text-emerald-400 font-bold text-sm">₹{(liters * rate).toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer">
            Save Fuel Entry
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------
 * 5. ADD TOLL MODAL
 * ------------------------------------------------------------- */
const AddTollModal: React.FC<{
  onClose: () => void;
  vehicles: Vehicle[];
  onSave: (t: any) => void;
}> = ({ onClose, vehicles, onSave }) => {
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0]?.vehicleNumber || '');
  const [tollPlaza, setTollPlaza] = useState('Paliyekkara Toll Plaza');
  const [amount, setAmount] = useState(190);
  const [paymentMethod, setPaymentMethod] = useState<'Fastag' | 'Cash'>('Fastag');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `toll-${Date.now()}`,
      vehicleNumber,
      tollPlaza,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      time: '11:15',
      paymentMethod,
      fastagTagId: 'FTG-99881122',
      route: 'NH-544 Corridor'
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Add Toll / Fastag Transaction</h3>
          <p className="text-slate-400 text-[11px]">Electronic NHAI deduction or cash gate receipt</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-400 block mb-1">Vehicle</label>
          <select
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.vehicleNumber}>
                {v.vehicleNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Toll Plaza Name</label>
          <input
            type="text"
            required
            value={tollPlaza}
            onChange={(e) => setTollPlaza(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-indigo-400 font-mono font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="Fastag">Fastag RFID</option>
              <option value="Cash">Cash Receipt</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold shadow-md cursor-pointer">
            Save Toll Entry
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------
 * 6. ADD BATTA MODAL
 * ------------------------------------------------------------- */
const AddBattaModal: React.FC<{
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  onSave: (b: any) => void;
}> = ({ onClose, vehicles, drivers, onSave }) => {
  const [driverName, setDriverName] = useState(drivers[0]?.name || '');
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0]?.vehicleNumber || '');
  const [battaType, setBattaType] = useState('Trip Batta');
  const [daysOrUnits, setDaysOrUnits] = useState(1);
  const [rate, setRate] = useState(600);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `batta-${Date.now()}`,
      referenceNumber: `BAT-2024-${Math.floor(100 + Math.random() * 900)}`,
      driverName,
      vehicleNumber,
      battaType,
      date: new Date().toISOString().split('T')[0],
      daysOrUnits: Number(daysOrUnits),
      rate: Number(rate),
      amount: Number(daysOrUnits) * Number(rate),
      paymentStatus: 'Paid',
      approvedBy: 'Fleet Manager RZ'
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Log Driver Batta Allowance</h3>
          <p className="text-slate-400 text-[11px]">Daily, trip-wise or outstation food & night allowance</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Driver</label>
            <select
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Vehicle</label>
            <select
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleNumber}>
                  {v.vehicleNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Batta Type</label>
          <select
            value={battaType}
            onChange={(e) => setBattaType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
          >
            <option value="Daily Batta">Daily Batta</option>
            <option value="Trip Batta">Trip Batta</option>
            <option value="Food Allowance">Food Allowance</option>
            <option value="Night Halt">Night Halt</option>
            <option value="Outstation">Outstation</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Units / Days</label>
            <input
              type="number"
              value={daysOrUnits}
              onChange={(e) => setDaysOrUnits(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Rate (₹)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">Total Allowance:</span>
          <span className="text-amber-400 font-bold text-sm">₹{(daysOrUnits * rate).toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer">
            Approve & Save Batta
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------
 * 7. ADD MAINTENANCE MODAL
 * ------------------------------------------------------------- */
const AddMaintenanceModal: React.FC<{
  onClose: () => void;
  vehicles: Vehicle[];
  onSave: (m: any) => void;
}> = ({ onClose, vehicles, onSave }) => {
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0]?.vehicleNumber || '');
  const [category, setCategory] = useState('Oil & Filters');
  const [description, setDescription] = useState('Engine oil renewal and primary filter replacement');
  const [serviceProvider, setServiceProvider] = useState('Authorized Fleet Service Station');
  const [cost, setCost] = useState(14500);
  const [odometerKm, setOdometerKm] = useState(42000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `maint-${Date.now()}`,
      vehicleNumber,
      category,
      description,
      serviceProvider,
      technicianName: 'Suresh Kumar',
      date: new Date().toISOString().split('T')[0],
      cost: Number(cost),
      odometerKm: Number(odometerKm),
      nextServiceDate: '2025-01-15',
      nextServiceOdometerKm: Number(odometerKm) + 10000,
      partsReplaced: ['15W40 Engine Oil', 'Oil Filter', 'Air Filter'],
      status: 'Completed'
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Record Workshop Service / Repair</h3>
          <p className="text-slate-400 text-[11px]">Log parts replaced, labor, cost and next service due</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Vehicle</label>
            <select
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleNumber}>
                  {v.vehicleNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="Engine">Engine</option>
              <option value="Brakes">Brakes</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Oil & Filters">Oil & Filters</option>
              <option value="Greasing">Greasing</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Work Order Description</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-slate-400 block mb-1">Workshop / Service Provider</label>
            <input
              type="text"
              value={serviceProvider}
              onChange={(e) => setServiceProvider(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Cost (₹)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-rose-400 font-mono font-bold"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold shadow-md cursor-pointer">
            Save Service Entry
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------
 * 8. ADD TYRE MODAL
 * ------------------------------------------------------------- */
const AddTyreModal: React.FC<{
  onClose: () => void;
  vehicles: Vehicle[];
  onSave: (t: any) => void;
}> = ({ onClose, vehicles, onSave }) => {
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0]?.vehicleNumber || '');
  const [tyreNumber, setTyreNumber] = useState(`TYR-${Math.floor(10000 + Math.random() * 90000)}`);
  const [position, setPosition] = useState('Front Left');
  const [brand, setBrand] = useState('Apollo EnduTrax');
  const [cost, setCost] = useState(24000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `tyre-${Date.now()}`,
      tyreNumber,
      vehicleNumber,
      position,
      brand,
      size: '295/95 D20',
      initialTreadDepthMm: 16.0,
      currentTreadDepthMm: 16.0,
      cost: Number(cost),
      status: 'Active',
      kmRun: 0,
      costPerKm: 0,
      rotationHistory: 'New fitment to vehicle'
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Add Commercial Tyre Asset</h3>
          <p className="text-slate-400 text-[11px]">Register serial number and axle mounting location</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-400 block mb-1">Vehicle</label>
          <select
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.vehicleNumber}>
                {v.vehicleNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Serial Number</label>
            <input
              type="text"
              required
              value={tyreNumber}
              onChange={(e) => setTyreNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Axle Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="Front Left">Front Left</option>
              <option value="Front Right">Front Right</option>
              <option value="Rear Outer Left">Rear Outer Left</option>
              <option value="Rear Inner Left">Rear Inner Left</option>
              <option value="Rear Outer Right">Rear Outer Right</option>
              <option value="Rear Inner Right">Rear Inner Right</option>
              <option value="Spare">Spare</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Cost (₹)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-purple-400 font-mono font-bold"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold shadow-md cursor-pointer">
            Save Tyre
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------
 * 9. ADD SETTLEMENT MODAL
 * ------------------------------------------------------------- */
const AddSettlementModal: React.FC<{
  onClose: () => void;
  vehicles: Vehicle[];
  owners: VehicleOwner[];
  onSave: (s: any) => void;
}> = ({ onClose, vehicles, owners, onSave }) => {
  const [ownerName, setOwnerName] = useState(owners[0]?.name || '');
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0]?.vehicleNumber || '');
  const [formulaType, setFormulaType] = useState('Direct Profit Share');
  const [profitPercent, setProfitPercent] = useState(60);
  const [grossRevenue, setGrossRevenue] = useState(280000);
  const [deductions, setDeductions] = useState(145000);

  const netProfit = grossRevenue - deductions;
  const ownerShare = Math.round((netProfit * profitPercent) / 100);
  const tdsDeduction = Math.round(ownerShare * 0.01);
  const netPayable = ownerShare - tdsDeduction;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `stl-${Date.now()}`,
      settlementNumber: `STL-2024-${Math.floor(100 + Math.random() * 900)}`,
      ownerName,
      vehicleNumber,
      period: 'Sep 2024',
      settlementDate: new Date().toISOString().split('T')[0],
      formulaType,
      grossRevenue: Number(grossRevenue),
      deductions: Number(deductions),
      netProfit,
      profitPercent: Number(profitPercent),
      ownerShare,
      tdsDeduction,
      netPayable,
      status: 'Approved',
      bankReference: `RTGS-HDFC-${Math.floor(100000 + Math.random() * 900000)}`
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Generate Partner Settlement Voucher</h3>
          <p className="text-slate-400 text-[11px]">Calculate profit distribution per independent ratio rules</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Partner / Owner</label>
            <select
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              {owners.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Vehicle</label>
            <select
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleNumber}>
                  {v.vehicleNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Formula Model</label>
            <select
              value={formulaType}
              onChange={(e) => setFormulaType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="Direct Profit Share">Direct Profit Share</option>
              <option value="Revenue minus Expense">Revenue minus Expense</option>
              <option value="Fixed Return Royalty">Fixed Return Royalty</option>
              <option value="Hybrid Split Formula">Hybrid Split Formula</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Configured Profit Share %</label>
            <input
              type="number"
              value={profitPercent}
              onChange={(e) => setProfitPercent(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Gross Freight (₹)</label>
            <input
              type="number"
              value={grossRevenue}
              onChange={(e) => setGrossRevenue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Deductions (₹)</label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-rose-400 font-mono font-bold"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Net Profit Pool:</span>
            <span>₹{netProfit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Calculated Gross Share:</span>
            <span>₹{ownerShare.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>TDS Deduction (1%):</span>
            <span>-₹{tdsDeduction.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-emerald-400">
            <span>Net Payable Disbursement:</span>
            <span>₹{netPayable.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer">
            Approve & Generate Voucher
          </button>
        </div>
      </form>
    </div>
  );
};
