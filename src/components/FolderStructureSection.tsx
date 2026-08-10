import React from 'react';
import { DEVELOPMENT_ROADMAP } from '../data/blueprintData';
import { Folder, FileCode, CheckCircle2, Clock, Calendar } from 'lucide-react';

export const FolderStructureSection: React.FC = () => {
  const monorepoTree = `rz-minetrix-bos/
├── apps/
│   ├── web-portal/                   # Executive & Operational React 19 SPA
│   ├── mobile-pwa/                   # Weighbridge Kiosk & Driver PWA App
│   ├── api-gateway/                  # Nginx/Express Enterprise API Gateway
│   └── whatsapp-bot/                 # WhatsApp Business Conversational Engine
├── services/
│   ├── core-auth-service/            # Authentication, Users & RBAC
│   ├── mining-service/               # Quarry, Crusher & Weighbridge GatePass
│   ├── fleet-service/                # Vehicle ERP, Trips & GPS Telematics
│   ├── materials-service/            # Building Materials & Multi-Warehouse
│   ├── crm-service/                  # Quotations, Agreements & Complaints
│   ├── finance-service/              # Chart of Accounts, Ledger & GST Tax
│   ├── hrms-service/                 # Biometric Shift Attendance & Payroll
│   ├── ai-ocr-service/               # Gemini AI Weighbridge OCR & Voice Bot
│   └── marketplace-service/          # Online Stone E-Commerce & Machinery
├── packages/
│   ├── db-schema/                    # PostgreSQL Drizzle/Prisma Schema Models
│   ├── event-bus/                    # Shared Kafka/NATS Event Publisher Schemas
│   ├── domain-types/                 # Universal TypeScript Interfaces
│   └── ui-components/                # Shared Design System Component Library
├── infrastructure/
│   ├── docker/                       # Container Build Files
│   ├── kubernetes/                   # Helm Charts & K8s Manifests
│   └── terraform/                    # Cloud Provisioning Scripts
├── docs/
│   ├── architecture-blueprint.md     # Phase 1 Official Specification
│   └── domain-model-blueprint.md     # Phase 2 Official Database Blueprint
├── package.json
└── tsconfig.json`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Folder className="w-4 h-4" />
          <span>Repository Architecture & Roadmap</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">Project Folder Structure & Phase Roadmap</h2>
        <p className="text-slate-400 text-sm mt-1">
          Clean Architecture monorepo layout separating frontend apps, microservice domain packages, shared schemas, and deployment infrastructure.
        </p>
      </div>

      {/* Folder Structure Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-amber-400" /> Monorepo Folder Structure Specification
        </h3>
        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-amber-300 border border-slate-800 overflow-x-auto leading-relaxed">
          <pre>{monorepoTree}</pre>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" /> Master Development Roadmap
        </h3>

        <div className="relative border-l-2 border-slate-800 ml-4 space-y-6">
          {DEVELOPMENT_ROADMAP.map((item, idx) => {
            const isDone = item.status === 'Completed';
            return (
              <div key={idx} className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center ${
                  isDone ? 'border-amber-400 text-amber-400' : 'border-slate-700 text-slate-700'
                }`}>
                  {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                    isDone ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.phase} — {item.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.details}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
