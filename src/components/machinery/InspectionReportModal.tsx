import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  Calendar,
  MapPin,
  Clock,
  Wrench,
  Layers,
  Award
} from 'lucide-react';
import { MarketplaceInspection } from '../../data/usedMachineryMarketplaceData';

interface InspectionReportModalProps {
  inspection: MarketplaceInspection | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InspectionReportModal: React.FC<InspectionReportModalProps> = ({
  inspection,
  isOpen,
  onClose
}) => {
  if (!isOpen || !inspection) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                OFFICIAL REPORT &bull; {inspection.inspectionCode}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{inspection.date}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              RZ® Comprehensive Mechanical Diagnostic & Technical Survey
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* REPORT CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Surveyor Certification Header Block */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Surveyed Machine</div>
                <div className="text-base font-black text-white">{inspection.listingTitle}</div>
                <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                  Chassis Serial: {inspection.serialNumber} &bull; Certified Meter: {inspection.certifiedWorkingHours} Hours
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Authorized Surveyor</div>
                <div className="font-bold text-amber-400">{inspection.inspectorName}</div>
                <div className="text-slate-400 text-[11px]">{inspection.inspectorAgency}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div><span className="text-slate-500">Audit Type: </span>{inspection.type}</div>
              <div><span className="text-slate-500">Location: </span>{inspection.location}</div>
              <div><span className="text-slate-500">Inspection Status: </span><span className="text-emerald-400 font-bold">{inspection.status}</span></div>
              <div><span className="text-slate-500">Est. Maint. Need: </span><span className="text-white font-mono font-bold">₹{inspection.estimatedImmediateMaintenanceCostRs.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Detailed Category Sections */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Diagnostic Test Findings by Subsystem
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>1. Powertrain & Compression Health</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{inspection.engineFindings}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>2. Hydraulic Pressure & Control Valves</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{inspection.hydraulicFindings}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>3. Mechanical Drives & Slew Ring</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{inspection.mechanicalFindings}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>4. Structural Welds & Chassis Integrity</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{inspection.structuralFindings}</p>
              </div>
            </div>
          </div>

          {/* 48-Point Checklist Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Surveyor 48-Point Inspection Verification Checklist
            </h3>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                    <th className="p-3 font-semibold">Inspection Checkpoint</th>
                    <th className="p-3 font-semibold">System Category</th>
                    <th className="p-3 font-semibold">Result</th>
                    <th className="p-3 font-semibold">Surveyor Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {inspection.checklist.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-medium text-white">{item.name}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{item.category}</td>
                      <td className="p-3">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 text-[11px]">{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Test Drive & Recommended Repairs */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-white">Live Dynamic Quarry Test Results</div>
            <p className="text-slate-300 leading-relaxed">{inspection.testDriveNotes}</p>
            <div className="pt-2 border-t border-slate-900">
              <span className="font-bold text-amber-400">Recommended Routine Maintenance: </span>
              <span className="text-slate-300">{inspection.recommendedRepairs}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Report ID: {inspection.inspectionCode} &bull; RZ Technical Audits
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
