import React, { useState } from 'react';
import { DOMAINS } from '../data/blueprintData';
import { BoundedContextDomain, DomainEntity } from '../types/architecture';
import { Database, Search, ChevronRight, Key, Shield, Radio, Sparkles } from 'lucide-react';

export const DomainExplorerSection: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<BoundedContextDomain>(DOMAINS[0]);
  const [selectedEntity, setSelectedEntity] = useState<DomainEntity>(DOMAINS[0].entities[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDomainChange = (domain: BoundedContextDomain) => {
    setSelectedDomain(domain);
    setSelectedEntity(domain.entities[0]);
  };

  const filteredDomains = DOMAINS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.aggregateRoots.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Phase 2 Blueprint</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">10 Domain-Driven Bounded Contexts</h2>
          <p className="text-slate-400 text-sm mt-1">
            Enterprise domain models, aggregate roots, field schemas, foreign keys, and cross-domain event producers.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search domains or entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Domain Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredDomains.map((dom) => {
          const isSelected = selectedDomain.id === dom.id;
          return (
            <button
              key={dom.id}
              onClick={() => handleDomainChange(dom)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span className="font-mono text-[10px] opacity-80">{dom.code}</span>
              <span>{dom.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Domain Overview Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {selectedDomain.code}
              </span>
              <h3 className="text-xl font-bold text-white">{selectedDomain.name}</h3>
            </div>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed max-w-3xl">
              {selectedDomain.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Aggregate Roots:</span>
            {selectedDomain.aggregateRoots.map((ag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-mono text-[11px]">
                {ag}
              </span>
            ))}
          </div>
        </div>

        {/* Entity Selector & Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
          {/* Entity List Sidebar */}
          <div className="space-y-2 lg:col-span-1 border-r border-slate-800/80 pr-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Domain Entities ({selectedDomain.entities.length})
            </div>
            {selectedDomain.entities.map((entity, idx) => {
              const isEntSelected = selectedEntity.name === entity.name;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedEntity(entity)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                    isEntSelected
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                      : 'bg-slate-950/60 hover:bg-slate-800 border border-slate-800/60 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      {entity.name}
                      {entity.aggregateRoot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Aggregate Root"></span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{entity.fields.length} Fields</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isEntSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Entity Schema Inspector */}
          <div className="lg:col-span-3 space-y-4">
            {selectedEntity ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-white">{selectedEntity.name}</h4>
                      {selectedEntity.aggregateRoot && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          AGGREGATE ROOT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{selectedEntity.description}</p>
                  </div>
                </div>

                {/* Field Schema Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Attribute</th>
                        <th className="px-4 py-3 font-semibold">Data Type</th>
                        <th className="px-4 py-3 font-semibold">Key Flags</th>
                        <th className="px-4 py-3 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {selectedEntity.fields.map((f, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="px-4 py-2.5 font-mono font-bold text-amber-300">{f.name}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px]">{f.type}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1.5">
                              {f.isPk && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold">
                                  <Key className="w-2.5 h-2.5" /> PK
                                </span>
                              )}
                              {f.isTenantKey && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                                  <Shield className="w-2.5 h-2.5" /> RLS TENANT
                                </span>
                              )}
                              {f.isFk && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-bold">
                                  FK
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-slate-400">{f.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Entity Relationships */}
                {selectedEntity.relationships.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Domain Entity Relationships
                    </h5>
                    <div className="space-y-1.5 text-xs">
                      {selectedEntity.relationships.map((rel, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2 text-slate-300">
                          <span className="font-mono text-amber-400 text-[11px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {rel.type}
                          </span>
                          <span className="font-bold text-white">{rel.targetEntity}</span>
                          <span className="text-slate-500">—</span>
                          <span className="text-slate-400">{rel.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">Select an entity to inspect schema details</div>
            )}
          </div>
        </div>

        {/* Domain Events Panel */}
        {selectedDomain.domainEvents.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" /> Domain Pub/Sub Events
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {selectedDomain.domainEvents.map((evt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-mono font-bold text-amber-400 text-xs">{evt.eventName}</div>
                  <p className="text-slate-300 text-xs mt-1">{evt.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Producer: <strong className="text-slate-300">{evt.producer}</strong></span>
                    <span>Consumers: <strong className="text-slate-300">{evt.consumers.join(', ')}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
