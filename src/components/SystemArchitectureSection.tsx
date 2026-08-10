import React from 'react';
import { ARCHITECTURE_LAYERS } from '../data/blueprintData';
import { Layers, Server, Shield, Cpu, Cloud, ArrowDown } from 'lucide-react';

export const SystemArchitectureSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Tiered Cloud Native Topology</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">Enterprise Application Architecture</h2>
        <p className="text-slate-400 text-sm mt-1">
          Decoupled 4-tier microservices architecture designed for high availability, sub-100ms API response times, and multi-tenant scaling.
        </p>
      </div>

      {/* Layered Architectural Stack Diagram */}
      <div className="space-y-4">
        {ARCHITECTURE_LAYERS.map((layer, idx) => (
          <React.Fragment key={idx}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {layer.name}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{layer.title}</h3>
                </div>
                <p className="text-xs text-slate-400 max-w-md">{layer.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {layer.components.map((comp, cIdx) => (
                  <div key={cIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-200 text-xs">{comp.name}</h4>
                      <span className="text-[10px] font-mono text-amber-400/80 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {comp.tech}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{comp.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            {idx < ARCHITECTURE_LAYERS.length - 1 && (
              <div className="flex justify-center my-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  <ArrowDown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Asynchronous Event Bus & REST / gRPC API Channels</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Cloud Infrastructure Map */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-amber-400" /> Cloud Native Production Blueprint
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Server className="w-5 h-5 text-blue-400 mb-2" />
            <h4 className="font-bold text-white">Container Runtime</h4>
            <p className="text-slate-400 mt-1">Docker / Kubernetes / GCP Cloud Run auto-scaling from 1 to 100+ replicas.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Shield className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="font-bold text-white">Database Cluster</h4>
            <p className="text-slate-400 mt-1">PostgreSQL 16 High Availability primary-replica cluster with RLS multi-tenant security.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Cpu className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="font-bold text-white">Event Streaming</h4>
            <p className="text-slate-400 mt-1">Apache Kafka / NATS JetStream for real-time dispatch, trip, and ledger event pub/sub.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Layers className="w-5 h-5 text-purple-400 mb-2" />
            <h4 className="font-bold text-white">Distributed Cache</h4>
            <p className="text-slate-400 mt-1">Redis Cluster for weighbridge queues, RBAC permissions cache, and API rate-limiting.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
