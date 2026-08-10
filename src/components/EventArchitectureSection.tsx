import React, { useState } from 'react';
import { Activity, ArrowRight, CheckCircle2, Zap, Radio } from 'lucide-react';

export const EventArchitectureSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const dispatchWorkflow = [
    {
      step: 1,
      title: 'Weighbridge Gate Pass Issued',
      producer: 'Mining Domain',
      event: 'Mining.GatePassIssued',
      description: 'Truck steps onto weighbridge. Operator generates Gate Pass pass_no with gross and tare weights.',
      payload: { pass_id: 'pass_01jh89a', net_tons: 28.5, vehicle_id: 'veh_998', customer_id: 'cust_442' },
      targets: ['Fleet Domain', 'Building Materials Inventory', 'Finance Domain', 'Notification Gateway']
    },
    {
      step: 2,
      title: 'Trip Log & GPS Track Initialized',
      producer: 'Fleet & Logistics Domain',
      event: 'Fleet.TripAssigned',
      description: 'Trip record initialized automatically. Driver starts transit. GPS telematics tracks geofence route.',
      payload: { trip_id: 'trip_7721', start_odometer: 142050, freight_rate: 1200 },
      targets: ['GPS Telematics Engine', 'Driver Mobile App']
    },
    {
      step: 3,
      title: 'Stockyard Aggregate Inventory Deducted',
      producer: 'Building Materials Domain',
      event: 'Materials.StockDeducted',
      description: 'Stockyard inventory for 20mm aggregate decreased by 28.5 tons immediately.',
      payload: { warehouse_id: 'yard_north', product_sku: 'AGG-20MM', qty_deducted: 28.5 },
      targets: ['Reorder Safety Engine', 'Executive Dashboard']
    },
    {
      step: 4,
      title: 'GST Tax Invoice & Ledger Journal Posted',
      producer: 'Finance Domain',
      event: 'Finance.InvoiceGenerated',
      description: 'GST Tax Invoice created. Customer Accounts Receivable debited; Quarry Revenue credited.',
      payload: { invoice_no: 'INV-2026-8812', gross_value: 34200, cgst: 1539, sgst: 1539 },
      targets: ['WhatsApp Dispatch Bot', 'Customer Portal']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Event-Driven Architecture</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">Cross-Domain Event Choreography</h2>
        <p className="text-slate-400 text-sm mt-1">
          Decoupled, high-throughput pub/sub event bus preventing direct database coupling between Business Suites.
        </p>
      </div>

      {/* Interactive Workflow Simulation */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Interactive Event Workflow: Quarry Weighbridge Dispatch
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click through the steps below to simulate how a single dispatch event cascades across 4 business domains asynchronously.
            </p>
          </div>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dispatchWorkflow.map((item, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className={isActive ? 'text-amber-400' : 'text-slate-500'}>Step {item.step}</span>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="font-bold text-xs line-clamp-1">{item.title}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        {dispatchWorkflow[activeStep] && (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {dispatchWorkflow[activeStep].event}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{dispatchWorkflow[activeStep].title}</h4>
              </div>
              <div className="text-xs text-slate-400">
                Producer: <strong className="text-amber-400">{dispatchWorkflow[activeStep].producer}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-300">{dispatchWorkflow[activeStep].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Event Payload */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  JSON Event Payload Schema
                </div>
                <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-amber-300 border border-slate-800">
                  <pre>{JSON.stringify(dispatchWorkflow[activeStep].payload, null, 2)}</pre>
                </div>
              </div>

              {/* Downstream Consumers */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Asynchronous Consumers Triggered
                </div>
                <div className="space-y-1.5 text-xs">
                  {dispatchWorkflow[activeStep].targets.map((tgt, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <Radio className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tgt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
