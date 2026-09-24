import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Calendar,
  MapPin,
  Wrench,
  Search,
  FileText,
  UserCheck,
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  MARKETPLACE_INSPECTIONS,
  MarketplaceInspection
} from '../../data/usedMachineryMarketplaceData';
import { InspectionReportModal } from './InspectionReportModal';

interface InspectionManagementViewProps {
  onOpenOttModal: (contextRef?: string) => void;
}

export const InspectionManagementView: React.FC<InspectionManagementViewProps> = ({
  onOpenOttModal
}) => {
  const [inspections, setInspections] = useState<MarketplaceInspection[]>(MARKETPLACE_INSPECTIONS);
  const [selectedInspection, setSelectedInspection] = useState<MarketplaceInspection | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  // New Request Form state
  const [listingRef, setListingRef] = useState('');
  const [requestLocation, setRequestLocation] = useState('Nileshwaram Quarry Hub, Kasaragod');
  const [requestedDate, setRequestedDate] = useState('2026-09-26');

  const handleOpenReport = (insp: MarketplaceInspection) => {
    setSelectedInspection(insp);
    setIsReportOpen(true);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newInsp: MarketplaceInspection = {
      id: `INSP-RZ-${Date.now()}`,
      inspectionCode: `INS-2026-${Math.floor(800 + Math.random() * 100)}`,
      listingId: 'LST-MAC-001',
      listingTitle: listingRef || 'Heavy Earthmoving Machine Inspection',
      machineBrandModel: 'Standard Heavy Equipment',
      serialNumber: `SRN-${Date.now().toString().slice(-6)}`,
      type: 'Buyer Requested',
      inspectorName: 'Er. Rajesh K. Nair (Lead Mechanical Surveyor)',
      inspectorAgency: 'RZ Technical Survey & Machinery Audits',
      date: requestedDate,
      location: requestLocation,
      status: 'Scheduled',
      engineFindings: 'Scheduled for cold-start compression test and cylinder blow-by gauge.',
      hydraulicFindings: 'Scheduled for digital flow meter and relief valve pressure calibration.',
      mechanicalFindings: 'Slew bearing axial play and final drive oil sampling scheduled.',
      structuralFindings: 'Ultrasonic weld seam test scheduled for boom and stick.',
      documentationFindings: 'RTO physical RC smart card & fitness verification.',
      testDriveNotes: 'Pending on-site quarry test.',
      recommendedRepairs: 'To be determined during surveyor inspection.',
      estimatedImmediateMaintenanceCostRs: 0,
      certifiedWorkingHours: 4200,
      checklist: [
        { name: 'Engine Starting & Cold Cranking', category: 'Engine', status: 'Good', remarks: 'Scheduled' },
        { name: 'Hydraulic Main Pump Pressure', category: 'Hydraulics', status: 'Good', remarks: 'Scheduled' },
        { name: 'Slew Ring & Turntable Bearing', category: 'Mechanical', status: 'Good', remarks: 'Scheduled' },
        { name: 'Boom & Arm Structural Welds', category: 'Structural', status: 'Good', remarks: 'Scheduled' },
        { name: 'RTO Registration & Clear NOC', category: 'Documentation', status: 'Good', remarks: 'Scheduled' }
      ]
    };

    setInspections([newInsp, ...inspections]);
    setIsNewRequestOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Report Modal */}
      <InspectionReportModal
        inspection={selectedInspection}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">48-Point Technical Inspection Desk</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Surveyor Audited
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical diagnostic reports covering hydraulic pump pressures, engine health, slew play, and chassis weld integrity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Request Inspection</span>
          </button>
        </div>
      </div>

      {/* NEW INSPECTION MODAL */}
      {isNewRequestOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-white">Book Certified Machinery Inspection</h2>
            <button
              onClick={() => setIsNewRequestOpen(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateRequest} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Equipment / Listing Reference</label>
              <input
                type="text"
                required
                value={listingRef}
                onChange={(e) => setListingRef(e.target.value)}
                placeholder="e.g. Caterpillar 320D (RZ-LST-901)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Quarry / Site Location</label>
              <input
                type="text"
                required
                value={requestLocation}
                onChange={(e) => setRequestLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Requested Audit Date</label>
              <input
                type="date"
                required
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Schedule Surveyor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INSPECTION LISTINGS */}
      <div className="space-y-4">
        {inspections.map((insp) => (
          <div
            key={insp.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {insp.inspectionCode}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{insp.type}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{insp.date}</span>
                </div>
                <h3 className="text-base font-black text-white">{insp.listingTitle}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{insp.status}</span>
                </span>
              </div>
            </div>

            {/* Checklist summary bars */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">1. Powertrain Engine</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Sound</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">2. Hydraulic Flow & Relief</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>345 Bar Relief</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">3. Slew & Final Drives</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bearing Play OK</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">4. Structural Welds</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Gussets Intact</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">5. Documentation / RTO</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Smart RC Clear</span>
                </div>
              </div>
            </div>

            {/* Surveyor findings snippet */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-amber-400">Chief Surveyor Remarks:</div>
              <p>"{insp.engineFindings}"</p>
              <div className="text-[11px] text-slate-400 pt-1">
                Audited by {insp.inspectorName} ({insp.inspectorAgency})
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                Certified Working Hours: <span className="font-mono text-white font-bold">{insp.certifiedWorkingHours} Hrs</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenOttModal(insp.inspectionCode)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Create OTT Follow-up</span>
                </button>

                <button
                  onClick={() => handleOpenReport(insp)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>VIEW INSPECTION REPORT</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
