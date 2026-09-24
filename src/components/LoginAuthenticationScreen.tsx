import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Laptop,
  Tablet,
  LogOut,
  RefreshCw,
  Fingerprint,
  Users,
  Settings,
  ArrowRight,
  ShieldCheck,
  Check,
  Building2,
  Globe,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { authService, PRECONFIGURED_PERSONAS } from '../services/authService';
import { AuthProfile, UserRole } from '../types/auth';
import { ALL_DEMO_ROLES, getRoleDefinition } from '../types/rbac';
import { RZLogo } from './RZLogo';

interface LoginAuthenticationScreenProps {
  onSuccess?: () => void;
  onNavigateHome?: () => void;
}

export const LoginAuthenticationScreen: React.FC<LoginAuthenticationScreenProps> = ({
  onSuccess,
  onNavigateHome
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PIN'>('LOGIN');
  const [currentProfile, setCurrentProfile] = useState<AuthProfile>(authService.getProfile());
  const [authMethod, setAuthMethod] = useState<'PASSWORD' | 'PIN'>('PASSWORD');

  // Credentials
  const [identifier, setIdentifier] = useState('nafidkhan@racezoneventures.com');
  const [password, setPassword] = useState('••••••••••••');
  const [pinCode, setPinCode] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Demo Login Role Selector (All 24 Roles)
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('OWNER');

  // Forgot PIN state
  const [forgotEmail, setForgotEmail] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null);

  useEffect(() => {
    const unsub = authService.subscribe((profile) => {
      setCurrentProfile(profile);
    });
    return () => unsub();
  }, []);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    if (authMethod === 'PIN') {
      if (!pinCode || pinCode.length < 4) {
        setFeedbackMsg({ type: 'ERROR', text: 'Please enter your 4-digit security PIN.' });
        return;
      }
      const res = authService.loginWithPin(pinCode);
      if (res.success) {
        setFeedbackMsg({ type: 'SUCCESS', text: `Welcome, ${authService.getProfile().fullName}! Loading dashboard...` });
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 600);
      } else {
        setFeedbackMsg({ type: 'ERROR', text: res.message || 'Invalid security PIN.' });
      }
      return;
    }

    if (!identifier) {
      setFeedbackMsg({ type: 'ERROR', text: 'Please enter your Username, Mobile, or Work Email.' });
      return;
    }

    const res = authService.loginWithCredentials(identifier, password, rememberDevice);
    if (res.success) {
      setFeedbackMsg({ type: 'SUCCESS', text: `Welcome, ${authService.getProfile().fullName}! Loading dashboard...` });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 600);
    } else {
      setFeedbackMsg({ type: 'ERROR', text: res.message || 'Invalid login credentials.' });
    }
  };

  const handleDemoRoleLogin = () => {
    const updated = authService.switchRole(selectedDemoRole);
    const roleDef = getRoleDefinition(selectedDemoRole);
    setFeedbackMsg({
      type: 'SUCCESS',
      text: `${roleDef.welcomeGreeting}! Initializing ${roleDef.title} workspace...`
    });
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 500);
  };

  const handleForgotPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg({
      type: 'SUCCESS',
      text: `PIN reset link sent to ${forgotEmail || identifier}. Please check your SMS/Email.`
    });
    setTimeout(() => {
      setMode('LOGIN');
    }, 2000);
  };

  const activeRoleDef = getRoleDefinition(selectedDemoRole);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Branding Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-8 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* RZ® App Icon / Logo */}
            <div className="flex items-center gap-3">
              <RZLogo variant="full" size="lg" showText={true} />
            </div>

            <div className="mt-8">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider">
                RZ® MINETRIX BOS
              </span>
              <h2 className="text-xl font-black text-white mt-3 leading-tight">
                Business Operating System
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                One connected enterprise platform unifying Quarry extraction, Crusher plants, Vehicle fleet, Building Materials, and the universal RZ® OTT action engine.
              </p>
            </div>

            {/* Active System Safeguard Notice */}
            <div className="mt-6 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider flex items-center justify-between">
                <span>Security Assurance</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Protected
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Protected system with Row-Level Security (RLS), multi-tenant isolation, immutable audit trails, and strict RBAC policy enforcement.
              </p>
            </div>
          </div>

          <div className="mt-8 relative z-10 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>RZ® MINETRIX BOS</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit TLS
            </span>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-slate-900">
          <div>
            {/* Top Bar with Skip/Home */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Authentication & Access
                </span>
              </div>
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="text-xs text-slate-400 hover:text-amber-400 transition cursor-pointer"
                >
                  Enter Platform as Guest &rarr;
                </button>
              )}
            </div>

            {/* Feedback Alert */}
            {feedbackMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 font-medium ${
                  feedbackMsg.type === 'SUCCESS'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                }`}
              >
                {feedbackMsg.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* DEMO LOGIN PANEL (PRIMARY CALLOUT) */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Demo Login (24 Roles Available)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Instant Access
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3">
                Select any of the 24 authorized enterprise roles to test customized dashboards, navigation permissions, and cross-platform actions:
              </p>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                    Select Role:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDemoRole}
                      onChange={(e) => setSelectedDemoRole(e.target.value as UserRole)}
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                    >
                      <optgroup label="Executive & Strategic Roles">
                        <option value="SUPER_ADMIN">1. SUPER ADMIN — Full Platform Access & 9 Platforms</option>
                        <option value="OWNER">2. OWNER — Executive Overview, Finance, P&L, Fleet & OTT</option>
                        <option value="DIRECTOR">3. DIRECTOR — Business Units, Operations, Capital & Approvals</option>
                        <option value="ADMIN">4. ADMIN — Users, Roles, Permissions, Master Data & Audit</option>
                        <option value="GENERAL_MANAGER">5. GENERAL MANAGER — Executive Operations & Cross-Site Command</option>
                      </optgroup>
                      <optgroup label="Operations & Site Roles">
                        <option value="MANAGER">6. MANAGER — Quarry & Crusher Operations, Dispatches & Approvals</option>
                        <option value="SUPERVISOR">9. SUPERVISOR — Bench Production, Workers, Equipment & Weigh-Pass</option>
                        <option value="OPERATOR">10. OPERATOR — Heavy Plant, Wire-Saw, Run-Hours & Maintenance</option>
                        <option value="DRIVER">11. DRIVER — My Trips, Assigned Loads, Vehicle, Fuel & OTT</option>
                        <option value="STAFF">12. STAFF — Work Logs, Gate Slips, Attendance & Notifications</option>
                        <option value="STORE">15. STORE — Inventory, Spares, Material Issue & Low Stock Alerts</option>
                        <option value="DISPATCH">16. DISPATCH — Weighbridge Gross/Tare, Loads, Royalty E-Pass</option>
                      </optgroup>
                      <optgroup label="Commercial & Supply Chain Roles">
                        <option value="SALES">13. SALES — Quotations, Stone Price Sheets, Orders & CRM</option>
                        <option value="PURCHASE">14. PURCHASE — Suppliers, POs, Diesel, Explosives & GRN</option>
                        <option value="MARKETING">17. MARKETING — Campaigns, Stone Catalog, Enquiries & Analytics</option>
                      </optgroup>
                      <optgroup label="Finance & HR Roles">
                        <option value="ACCOUNTANT">7. ACCOUNTANT — Ledger, Invoices, GST E-Way, Receivables & P&L</option>
                        <option value="HR">8. HR — Biometric Roster, Attendance, Payroll & Wage Settlement</option>
                      </optgroup>
                      <optgroup label="External Partner & Customer Roles">
                        <option value="CONTRACTOR">18. CONTRACTOR — Work Orders, Subcontract, Job Progress & Billing</option>
                        <option value="CUSTOMER">19. CUSTOMER — Browse Materials, Laterite Stone Order & Delivery</option>
                        <option value="SUPPLIER">20. SUPPLIER — Products, Catalog Listings, Orders & Stock</option>
                        <option value="SELLER">21. SELLER — Used Machinery Listings, Buyers & Escrow Deals</option>
                        <option value="BUYER">22. BUYER — Marketplace Search, Equipment Deals & Stone Orders</option>
                        <option value="LAND_OWNER">23. LAND OWNER — Concession Discovery, Lease & Investor Enquiries</option>
                        <option value="SERVICE_PROVIDER">24. SERVICE PROVIDER — Drilling, Blasting, Wire-Saw Jobs</option>
                      </optgroup>
                    </select>
                    <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Role Details Snippet */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-400">{activeRoleDef.samplePersona.name}</span>
                    <span className="text-slate-400"> ({activeRoleDef.samplePersona.designation})</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {activeRoleDef.category}
                  </span>
                </div>

                {/* Enter Demo Button */}
                <button
                  type="button"
                  onClick={handleDemoRoleLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Enter Demo as {activeRoleDef.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* STANDARD CREDENTIALS LOGIN */}
            {mode === 'LOGIN' && (
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">Or Sign In with Credentials</span>
                  <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setAuthMethod('PASSWORD')}
                      className={`px-2 py-1 rounded font-bold cursor-pointer transition ${authMethod === 'PASSWORD' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('PIN')}
                      className={`px-2 py-1 rounded font-bold cursor-pointer transition ${authMethod === 'PIN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                      4-Digit PIN
                    </button>
                  </div>
                </div>

                <form onSubmit={handleStandardLogin} className="space-y-3">
                  {authMethod === 'PASSWORD' ? (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Username / Mobile / Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="e.g. nafidkhan@racezoneventures.com or +91 98470 12000"
                            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-medium text-slate-400">Password</label>
                          <button
                            type="button"
                            onClick={() => setMode('FORGOT_PIN')}
                            className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                          >
                            Forgot PIN / Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-slate-400">4-Digit Security PIN</label>
                        <button
                          type="button"
                          onClick={() => setMode('FORGOT_PIN')}
                          className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                        >
                          Forgot PIN?
                        </button>
                      </div>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="password"
                          maxLength={6}
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          placeholder="••••"
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                      />
                      <span>Remember device</span>
                    </label>
                    <span className="text-[10px] text-slate-500">MFA & biometric enabled</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* FORGOT PIN MODE */}
            {mode === 'FORGOT_PIN' && (
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2">Reset Security PIN / Password</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Enter your registered mobile or work email address. We will transmit an encrypted one-time verification token.
                </p>
                <form onSubmit={handleForgotPinSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. nafidkhan@racezoneventures.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('LOGIN')}
                      className="w-1/3 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2 rounded-xl bg-amber-500 text-xs font-black text-slate-950 hover:bg-amber-400 transition"
                    >
                      Send Reset Token
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
