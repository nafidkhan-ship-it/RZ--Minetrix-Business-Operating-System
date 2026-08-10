import React from 'react';
import { Shield, Key, Database, RefreshCw, FileText, Lock, HardDrive } from 'lucide-react';

export const DatabaseBlueprintSection: React.FC = () => {
  const dbStrategies = [
    {
      title: 'Multi-Tenant Isolation Strategy (RLS)',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      description: 'Shared Database with Discriminator (`tenant_id`, `company_id`, `branch_id`) guarded by PostgreSQL Row Level Security (RLS) policies.',
      highlights: [
        'Automatic tenant session context injected via app middleware (`SET LOCAL app.current_tenant = ...`)',
        'Strict DB engine enforcement preventing accidental cross-tenant data leakage',
        'Support for isolated schema-per-tenant for Tier-1 Enterprise clients if legally mandated'
      ]
    },
    {
      title: 'Primary Key & UUIDv7 Standard',
      icon: <Key className="w-5 h-5 text-amber-400" />,
      description: '128-bit time-ordered UUIDv7 for all primary keys across every domain entity.',
      highlights: [
        'Monotonically increasing timestamps prevent B-Tree index page fragmentation',
        'Decentralized ID generation eliminates database sequence locks during high dispatch spikes',
        'Compatible with distributed sharding and offline client ID generation'
      ]
    },
    {
      title: 'Soft Delete & Shadow Audit Logs',
      icon: <RefreshCw className="w-5 h-5 text-blue-400" />,
      description: 'Zero physical row deletion in operational databases. CDC Change Data Capture tracking.',
      highlights: [
        'Standard `deleted_at` timestamp and `deleted_by` user reference on all mutable tables',
        'Automated trigger-based append-only audit tables capturing pre- and post-mutation JSON state',
        'Immutable compliance logs for tax authority audits and mining royalty inspections'
      ]
    },
    {
      title: 'Indexing & Table Partitioning',
      icon: <Database className="w-5 h-5 text-purple-400" />,
      description: 'High-performance indexing strategies and declarative range partitioning.',
      highlights: [
        'Composite B-Tree indexes on `(tenant_id, created_at DESC)` for rapid list queries',
        'GIN indexes on JSONB metadata fields (e.g. OCR extractions, widget configs)',
        'Declarative range partitioning by date for high-volume GatePass and AuditLog tables'
      ]
    },
    {
      title: 'Cloud Document Object Storage',
      icon: <HardDrive className="w-5 h-5 text-rose-400" />,
      description: 'S3-compatible Object Storage for weighbridge ticket scans, RC copies, and invoices.',
      highlights: [
        'Short-lived pre-signed URLs (15-min expiry) for secure document view/upload',
        'S3 bucket key prefixing: `s3://{tenant_id}/{entity_type}/{yyyy}/{mm}/{id}.pdf`',
        'Gemini AI OCR metadata linked to object storage keys for full-text search'
      ]
    },
    {
      title: 'Schema Migration & Versioning',
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      description: 'Zero-downtime database schema migration using ORM/SQL migration tooling.',
      highlights: [
        'Backward-compatible expand-and-contract schema migration pattern',
        'Automated CI/CD schema verification pipeline checking RLS policy integrity',
        'Drizzle/Prisma schema management with strict version control'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Database Architecture Blueprint</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">Multi-Tenant Data Strategy & Isolation</h2>
        <p className="text-slate-400 text-sm mt-1">
          Enterprise PostgreSQL row-level security, UUIDv7 primary keys, soft delete temporal tables, and partitioning standards.
        </p>
      </div>

      {/* RLS Middleware Code Example Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" /> Row-Level Security (RLS) Policy Example
        </h3>
        <p className="text-xs text-slate-300">
          Every query executed by RZ® Minetrix BOS automatically enforces tenant boundaries at the database engine level:
        </p>
        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-amber-300 border border-slate-800 overflow-x-auto">
          <pre>{`-- Enable RLS on core domain table
ALTER TABLE mining_gate_passes ENABLE ROW LEVEL SECURITY;

-- Enforce strict tenant isolation policy
CREATE POLICY tenant_isolation_policy ON mining_gate_passes
    AS RESTRICTIVE
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);`}</pre>
        </div>
      </div>

      {/* Grid of Database Architectural Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dbStrategies.map((strat, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                {strat.icon}
              </div>
              <h3 className="font-bold text-white text-sm">{strat.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{strat.description}</p>
            <ul className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              {strat.highlights.map((h, hIdx) => (
                <li key={hIdx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
