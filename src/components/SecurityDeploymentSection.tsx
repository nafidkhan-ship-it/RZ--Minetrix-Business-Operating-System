import React from 'react';
import { Shield, WifiOff, Cpu, Activity, Lock, RefreshCw, Server } from 'lucide-react';

export const SecurityDeploymentSection: React.FC = () => {
  const securityPillars = [
    {
      title: 'Authentication & Session Token Security',
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      items: [
        'Passwords encrypted using Argon2id with unique salt per user',
        'Stateless JWT access tokens signed via asymmetric RS256 / JWKS keys (15-min TTL)',
        'HTTP-only, Secure, SameSite=Strict cookies for refresh token rotation'
      ]
    },
    {
      title: 'RBAC & ABAC Access Control',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      items: [
        'Role-Based Access Control (RBAC) mapped to individual fine-grained permissions',
        'Attribute-Based Access Control (ABAC) restricting user visibility to assigned `branch_id` or `quarry_id`',
        'API Gateway middleware validating permissions before invoking domain microservices'
      ]
    },
    {
      title: 'Data Encryption Standards',
      icon: <Server className="w-5 h-5 text-blue-400" />,
      items: [
        'TLS 1.3 encryption for all HTTP/gRPC data in transit',
        'AES-256 encryption at rest for PostgreSQL database tables and Cloud S3 storage',
        'Key Management Service (KMS) managing tenant-specific master encryption keys'
      ]
    }
  ];

  const offlinePillars = [
    {
      title: 'Field Operator PWA & Local Store',
      icon: <WifiOff className="w-5 h-5 text-rose-400" />,
      items: [
        'Service Worker caching core application shell for zero-network operation',
        'IndexedDB local persistence storing pending weighbridge Gate Passes and trip logs',
        'Local queue timestamping with UUIDv7 ID generation'
      ]
    },
    {
      title: 'Auto-Reconciliation Engine',
      icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
      items: [
        'Background Sync API triggering queued sync upon cellular network restore',
        'Optimistic concurrency control with vector clocks for resolving data conflicts',
        'Server-authoritative validation for tax invoices and royalty calculations'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Security & Mobile Offline Engine</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">Enterprise Security & Offline Resilience</h2>
        <p className="text-slate-400 text-sm mt-1">
          Zero-trust security standards paired with robust offline-first PWA synchronization for remote quarry sites with intermittent connectivity.
        </p>
      </div>

      {/* Security Architecture Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" /> Enterprise Security Blueprint
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {securityPillars.map((p, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                {p.icon}
                <h4 className="font-bold text-white text-sm">{p.title}</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {p.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Architecture Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-rose-400" /> Remote Quarry Offline Resilience Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offlinePillars.map((p, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                {p.icon}
                <h4 className="font-bold text-white text-sm">{p.title}</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {p.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Observability & Caching Strategy */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" /> Caching & Monitoring Telemetry Strategy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Cpu className="w-4 h-4 text-amber-400 mb-1" />
            <h4 className="font-bold text-white">Redis L2 Cache</h4>
            <p className="text-slate-400 mt-1">Caches active RBAC permissions, branch list metadata, and weighbridge weigh-in buffer queues.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Activity className="w-4 h-4 text-emerald-400 mb-1" />
            <h4 className="font-bold text-white">Prometheus & Grafana</h4>
            <p className="text-slate-400 mt-1">Real-time HTTP request throughput, database connection pool saturation, and Kafka lag metrics.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Server className="w-4 h-4 text-cyan-400 mb-1" />
            <h4 className="font-bold text-white">OpenTelemetry Tracing</h4>
            <p className="text-slate-400 mt-1">Distributed transaction tracing across API Gateway, microservices, and database queries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
