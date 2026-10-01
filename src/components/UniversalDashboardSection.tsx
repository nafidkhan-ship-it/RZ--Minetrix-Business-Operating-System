import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Pickaxe,
  Building2,
  Truck,
  GitFork,
  ShoppingBag,
  Clock,
  MessageSquare,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Users,
  Coins,
  FileText,
  DollarSign,
  Activity,
  Briefcase,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { authService } from '../services/authService';
import { SectionId } from '../types/architecture';

interface UniversalDashboardProps {
  onNavigateSection: (sectionId: SectionId) => void;
}

export const UniversalDashboardSection: React.FC<UniversalDashboardProps> = ({
  onNavigateSection
}) => {
  const currentProfile = authService.getProfile();
  const [dashboardRoleView, setDashboardRoleView] = useState<'OWNER' | 'MANAGER' | 'STAFF' | 'PUBLIC_USER'>(
    currentProfile.role === 'SUPER_ADMIN' || currentProfile.role === 'OWNER'
      ? 'OWNER'
      : currentProfile.role === 'MANAGER'
      ? 'MANAGER'
      : currentProfile.role === 'DRIVER' || currentProfile.role === 'STAFF' || currentProfile.role === 'OPERATOR'
      ? 'STAFF'
      : 'PUBLIC_USER'
  );

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Role Context Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                UNIVERSAL BOS DASHBOARD
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Context-Aware Mode
              </span>
            </div>
            <h2 className="text-base font-bold text-white">
              Executive & Operational Command Center
            </h2>
          </div>
        </div>

        {/* View Switcher for Testing/Demonstrating Contexts */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setDashboardRoleView('OWNER')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              dashboardRoleView === 'OWNER'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Owner View
          </button>
          <button
            onClick={() => setDashboardRoleView('MANAGER')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              dashboardRoleView === 'MANAGER'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manager View
          </button>
          <button
            onClick={() => setDashboardRoleView('STAFF')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              dashboardRoleView === 'STAFF'
                ? 'bg-blue-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff / Driver View
          </button>
          <button
            onClick={() => setDashboardRoleView('PUBLIC_USER')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              dashboardRoleView === 'PUBLIC_USER'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Public User (Free)
          </button>
        </div>
      </div>

      {/* 1. OWNER CONTEXT: Business overview, Sales, Purchase, Cash, Profit, Tasks, Pending, Approvals, Alerts */}
      {dashboardRoleView === 'OWNER' && (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Monthly Net Revenue</div>
              <div className="text-2xl font-black text-white font-mono mt-1">₹1.48 Cr</div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% vs last month</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Net Operating Profit</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹42.6 L</div>
              <div className="text-[11px] text-slate-400 mt-1">Margin: 28.8% EBITDA</div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Liquid Treasury & Cash</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">₹89.2 L</div>
              <div className="text-[11px] text-slate-400 mt-1">Cash in Banks + Vaults</div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Pending Executive Approvals</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">4 Actions</div>
              <div className="text-[11px] text-amber-400 mt-1">Requires digital sign-off</div>
            </div>
          </div>

          {/* Business Overview & Platforms Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Operations Health & Approvals */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Concession & Fleet Live Operations</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">ALL SYSTEMS OPERATIONAL</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div
                    onClick={() => onNavigateSection('quarry-management')}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Laterite Quarries</span>
                      <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-base font-bold text-white mt-1">4,200 Cut Stones</div>
                    <div className="text-[10px] text-emerald-400">Kasaragod Quarry Site 01 Active</div>
                  </div>

                  <div
                    onClick={() => onNavigateSection('crusher-management')}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span>VSI Crusher Plants</span>
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-base font-bold text-white mt-1">1,490 Tons Aggregates</div>
                    <div className="text-[10px] text-emerald-400">M-Sand / 20mm in high demand</div>
                  </div>

                  <div
                    onClick={() => onNavigateSection('vehicle-management')}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Logistics Fleet</span>
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="text-base font-bold text-white mt-1">38 Heavy Tippers</div>
                    <div className="text-[10px] text-cyan-400">92% On-Time Delivery Rate</div>
                  </div>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <span>Pending Financial & Operational Approvals</span>
                  <span className="text-[11px] text-slate-400">RZ® Workflow Engine</span>
                </h3>

                <div className="space-y-2 text-xs">
                  {[
                    {
                      id: 'APPR-01',
                      title: 'Commercial Quarry Land Lease Royalty Settlement (₹2,40,000)',
                      entity: 'V. Prabhakaran Nair Lease #KL-01',
                      type: 'LAND_ROYALTY'
                    },
                    {
                      id: 'APPR-02',
                      title: 'Equipment Maintenance PO: CAT 320D Excavator Hydraulic Pump (₹85,000)',
                      entity: 'Kasaragod Heavy Machinery Yard',
                      type: 'EQUIPMENT_PO'
                    },
                    {
                      id: 'APPR-03',
                      title: 'Bulk Dispatch Credit Extension: Sobha Developers (Credit limit: ₹25L)',
                      entity: 'Sobha City Infra Project',
                      type: 'CREDIT_LIMIT'
                    }
                  ].map((appr) => (
                    <div
                      key={appr.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-white">{appr.title}</div>
                        <div className="text-[11px] text-slate-400">{appr.entity}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => showToast(`Approved ${appr.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 transition cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => showToast(`Reviewed details for ${appr.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: High-Priority OTT Tasks & Alerts */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>OTT Executive Tasks</span>
                  </h3>
                  <button
                    onClick={() => onNavigateSection('rz-ott')}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open OTT</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="font-bold text-white">Review Q3 Mining Statutory Royalty Filing</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Due Tomorrow &bull; High Priority</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="font-bold text-white">Finalize Subcontractor Agreement with Malabar Earthmovers</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Contract & Job Platform &bull; Today</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="font-bold text-white">Inspect New Laterite Cutting Machine Batch</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Site Visit &bull; Kasaragod</div>
                  </div>
                </div>
              </div>

              {/* RZ Ecosystem Bridge */}
              <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/20 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>RZ® Connected Ecosystem</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  BOS is connected to RZ® Chat and RZ® OTT. Any approval, contract milestone or weighbridge alert triggers instant OTT tasks and team chats.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGER CONTEXT: Team, Tasks, Production, Jobs, Vehicles, Approvals, Follow-ups */}
      {dashboardRoleView === 'MANAGER' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Active Shift Workforce</div>
              <div className="text-2xl font-black text-white font-mono mt-1">42 / 45 Staff</div>
              <div className="text-[11px] text-emerald-400 mt-1">93.3% Shift Attendance</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Today's Production Goal</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">82% Achieved</div>
              <div className="text-[11px] text-slate-400 mt-1">Target: 2,200 Tons</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Active Job Orders</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">8 Jobs Running</div>
              <div className="text-[11px] text-slate-400 mt-1">12 Excavators deployed</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Pending Follow-ups</div>
              <div className="text-2xl font-black text-purple-400 font-mono mt-1">5 Follow-ups</div>
              <div className="text-[11px] text-purple-400 mt-1">Customer site deliveries</div>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
            <h3 className="text-sm font-bold text-white mb-3">Site Manager Daily Operations Action Queue</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Assign Tipper Tippers to Wayanad VSI Crusher Plant</div>
                  <div className="text-[11px] text-slate-400">6 tippers awaiting loading gate pass</div>
                </div>
                <button
                  onClick={() => onNavigateSection('vehicle-management')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Go to Trips
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Approve Laterite Stone Grade-A Cutting Batch #KL-88</div>
                  <div className="text-[11px] text-slate-400">1,200 cut stones ready for inventory registration</div>
                </div>
                <button
                  onClick={() => onNavigateSection('quarry-management')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Quarry Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. STAFF / DRIVER CONTEXT: My Day, Tasks, Attendance, Requests, Notifications */}
      {dashboardRoleView === 'STAFF' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Today's Assigned Trips</div>
              <div className="text-2xl font-black text-white font-mono mt-1">3 Trips</div>
              <div className="text-[11px] text-emerald-400 mt-1">Trip 1 Completed &bull; Trip 2 In Progress</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Vehicle Assigned</div>
              <div className="text-2xl font-black text-blue-400 font-mono mt-1">KL-11-BD-8901</div>
              <div className="text-[11px] text-slate-400 mt-1">10-Wheeler Heavy Tipper</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-slate-400 text-xs">Monthly Driver Payout Balance</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">₹28,400</div>
              <div className="text-[11px] text-emerald-400 mt-1">Trip Incentives included</div>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>My Day Tasks (OTT Driver View)</span>
              <button
                onClick={() => onNavigateSection('rz-ott')}
                className="text-xs text-amber-400 hover:underline"
              >
                Open Full OTT
              </button>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Trip #TRIP-4401: Load 20mm Aggregate from Wayanad Crusher</div>
                  <div className="text-[11px] text-slate-400">Destination: Calicut Bypass Roadwork &bull; Weighbridge in 20 min</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  ACTIVE TRIP
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Vehicle Daily Pre-Inspection Checklist</div>
                  <div className="text-[11px] text-slate-400">Tyre pressure, engine oil, hydraulic seals checked</div>
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">COMPLETED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PUBLIC USER CONTEXT: Orders, Jobs, Marketplace, Chat, OTT (Free Access) */}
      {dashboardRoleView === 'PUBLIC_USER' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Free Public Access Portal</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Welcome to RZ® Construction & Materials Network
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Enjoy 100% free access to building materials e-commerce, used machinery marketplace, quarry land discovery, heavy equipment job openings, RZ® Chat and RZ® OTT daily task planning!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <button
                onClick={() => onNavigateSection('building-materials-ecommerce')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 text-left transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="font-bold text-white text-xs">Buy Materials</div>
                <div className="text-[10px] text-slate-400">Laterite, M-Sand, Cement</div>
              </button>

              <button
                onClick={() => onNavigateSection('used-machinery-marketplace')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 text-left transition cursor-pointer"
              >
                <Truck className="w-4 h-4 text-blue-400 mb-1" />
                <div className="font-bold text-white text-xs">Used Machinery</div>
                <div className="text-[10px] text-slate-400">Excavators, Crushers, Tippers</div>
              </button>

              <button
                onClick={() => onNavigateSection('quarry-land-management')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 text-left transition cursor-pointer"
              >
                <FileText className="w-4 h-4 text-purple-400 mb-1" />
                <div className="font-bold text-white text-xs">Quarry Land</div>
                <div className="text-[10px] text-slate-400">Land for Sale / Lease</div>
              </button>

              <button
                onClick={() => onNavigateSection('rz-ott')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 text-left transition cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-400 mb-1" />
                <div className="font-bold text-white text-xs">Free RZ® OTT</div>
                <div className="text-[10px] text-slate-400">Universal Daily Task Planner</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
