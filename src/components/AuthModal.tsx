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
  X,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { authService, PRECONFIGURED_PERSONAS } from '../services/authService';
import { AuthProfile, UserRole } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'PROFILE' | 'SECURITY';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'LOGIN'
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD' | 'PROFILE' | 'SECURITY'>(initialMode);
  const [currentProfile, setCurrentProfile] = useState<AuthProfile>(authService.getProfile());
  const [activeLoginTab, setActiveLoginTab] = useState<'PASSWORD' | 'PIN' | 'PERSONAS'>('PASSWORD');

  // Form Fields
  const [identifier, setIdentifier] = useState('nafidkhan@racezoneventures.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);

  // Register Fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCategory, setRegCategory] = useState<'BUSINESS_OWNER' | 'ENTERPRISE_OPERATOR' | 'TRANSPORTER' | 'PUBLIC_USER' | 'CANDIDATE'>('BUSINESS_OWNER');
  const [regPassword, setRegPassword] = useState('');

  // Forgot / Reset Password Fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null);

  useEffect(() => {
    const unsub = authService.subscribe((profile) => {
      setCurrentProfile(profile);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setMode(initialMode);
    setFeedbackMsg(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    if (activeLoginTab === 'PASSWORD') {
      const res = authService.loginWithCredentials(identifier, password, rememberDevice);
      if (res.success) {
        setFeedbackMsg({ type: 'SUCCESS', text: 'Authentication successful. Welcome to RZ® Minetrix BOS!' });
        setTimeout(() => onClose(), 800);
      } else {
        setFeedbackMsg({ type: 'ERROR', text: res.message || 'Authentication failed.' });
      }
    } else if (activeLoginTab === 'PIN') {
      const res = authService.loginWithPin(pinCode);
      if (res.success) {
        setFeedbackMsg({ type: 'SUCCESS', text: 'PIN verified. Session unlocked.' });
        setTimeout(() => onClose(), 800);
      } else {
        setFeedbackMsg({ type: 'ERROR', text: res.message || 'Invalid PIN.' });
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    if (!regFullName || !regEmail || !regPassword) {
      setFeedbackMsg({ type: 'ERROR', text: 'Please fill in all required fields.' });
      return;
    }
    const res = authService.register({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone || '+91 90000 00000',
      accountCategory: regCategory,
      password: regPassword
    });
    if (res.success) {
      setFeedbackMsg({ type: 'SUCCESS', text: 'Account registered with Free Public Access! Switching to workspace...' });
      setTimeout(() => onClose(), 900);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier) {
      setFeedbackMsg({ type: 'ERROR', text: 'Please enter your registered email or phone.' });
      return;
    }
    setFeedbackMsg({ type: 'SUCCESS', text: `Verification OTP dispatched to ${forgotIdentifier}. Enter reset code below.` });
    setMode('RESET_PASSWORD');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      setFeedbackMsg({ type: 'ERROR', text: 'Please enter verification code and new password.' });
      return;
    }
    setFeedbackMsg({ type: 'SUCCESS', text: 'Password reset successfully! You can now log in.' });
    setMode('LOGIN');
  };

  const handleQuickPersona = (personaId: string) => {
    authService.switchPersona(personaId);
    setFeedbackMsg({ type: 'SUCCESS', text: 'Switched enterprise persona context.' });
    setTimeout(() => onClose(), 600);
  };

  const handleGoogleSso = () => {
    // Google Workspace SSO architecture hook
    authService.switchPersona('USR-EXEC-001');
    setFeedbackMsg({ type: 'SUCCESS', text: 'Signed in via Google Workspace (nafidkhan@racezoneventures.com)' });
    setTimeout(() => onClose(), 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col my-8">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
                  RZ® BOS IDENTITY
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  FREE PUBLIC READY
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {mode === 'LOGIN' && 'Authentication & Sign-In'}
                {mode === 'REGISTER' && 'Create Free RZ Account'}
                {mode === 'FORGOT_PASSWORD' && 'Account Recovery'}
                {mode === 'RESET_PASSWORD' && 'Reset Password'}
                {mode === 'PROFILE' && 'Active User Profile'}
                {mode === 'SECURITY' && 'Security & Device Settings'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Ribbon */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/40 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setMode('LOGIN'); setFeedbackMsg(null); }}
            className={`pb-2.5 px-3 font-bold border-b-2 transition cursor-pointer ${
              mode === 'LOGIN' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('REGISTER'); setFeedbackMsg(null); }}
            className={`pb-2.5 px-3 font-bold border-b-2 transition cursor-pointer ${
              mode === 'REGISTER' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Register (Free)
          </button>
          <button
            onClick={() => { setMode('PROFILE'); setFeedbackMsg(null); }}
            className={`pb-2.5 px-3 font-bold border-b-2 transition cursor-pointer ${
              mode === 'PROFILE' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => { setMode('SECURITY'); setFeedbackMsg(null); }}
            className={`pb-2.5 px-3 font-bold border-b-2 transition cursor-pointer ${
              mode === 'SECURITY' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Devices
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              feedbackMsg.type === 'SUCCESS'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {feedbackMsg.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* BODY CONTENT */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {/* 1. LOGIN MODE */}
          {mode === 'LOGIN' && (
            <div className="space-y-5">
              {/* Method Switcher: Password vs PIN vs Quick Personas */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveLoginTab('PASSWORD')}
                  className={`py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeLoginTab === 'PASSWORD' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLoginTab('PIN')}
                  className={`py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeLoginTab === 'PIN' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quick PIN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLoginTab('PERSONAS')}
                  className={`py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeLoginTab === 'PERSONAS' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fast Personas
                </button>
              </div>

              {activeLoginTab === 'PASSWORD' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address or Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="nafidkhan@racezoneventures.com or +91 98470 12001"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMode('FORGOT_PASSWORD'); setFeedbackMsg(null); }}
                        className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Remember this device (30 days)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">TLS 1.3 Encrypted</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Sign In to RZ® Minetrix BOS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {activeLoginTab === 'PIN' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-center">
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                    <Key className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-white">Enter Enterprise Fast PIN</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Designed for site weighbridges, mobile tipper cabs & shop floors.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <input
                        type="password"
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••"
                        className="w-36 tracking-[0.6em] text-center font-mono text-2xl py-2 bg-slate-900 border border-amber-500/50 rounded-xl text-amber-400 focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">Try preconfigured: 4921 (Executive) or 1234 (Manager)</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Authenticate with PIN
                  </button>
                </form>
              )}

              {activeLoginTab === 'PERSONAS' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 mb-2">
                    Select any enterprise persona to instantly test RBAC permissions and user context:
                  </p>
                  <div className="space-y-2">
                    {PRECONFIGURED_PERSONAS.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleQuickPersona(p.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          currentProfile.id === p.id
                            ? 'bg-amber-500/10 border-amber-500/50 text-white'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 font-mono">
                            {p.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{p.fullName}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-amber-400">
                                {p.role}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">{p.designation} &bull; {p.branchName || p.tenantName}</div>
                          </div>
                        </div>
                        {currentProfile.id === p.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternative Auth Methods */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-slate-500">Enterprise Single Sign-On</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSso}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google Workspace SSO (Instant Match)</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. REGISTER MODE */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <strong>Free Public Access Guaranteed:</strong> Public buyers, candidates, drivers, and quarry land owners can register freely without mandatory subscription paywalls.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Mohammed Farooq"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98470 00000"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Category</label>
                <select
                  value={regCategory}
                  onChange={(e: any) => setRegCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="BUSINESS_OWNER">Quarry / Crusher Concession Owner (BOS)</option>
                  <option value="ENTERPRISE_OPERATOR">Plant Manager / Operator</option>
                  <option value="TRANSPORTER">Transporter / Fleet Owner / Driver</option>
                  <option value="PUBLIC_USER">Building Materials Buyer (Free E-Commerce)</option>
                  <option value="CANDIDATE">Job Seeker / Heavy Equipment Operator (Free Jobs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Set Secure Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                Create Account & Access Ecosystem
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD */}
          {mode === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-slate-400">
                Enter your verified email or mobile phone. We will transmit an encrypted one-time recovery code.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email / Phone</label>
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="name@rzminetrix.com or +91 98470 12001"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Dispatch Verification Code
              </button>
            </form>
          )}

          {/* 4. RESET PASSWORD */}
          {mode === 'RESET_PASSWORD' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Verification Code (OTP)</label>
                <input
                  type="text"
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="e.g. 749201"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Update Password & Return to Sign In
              </button>
            </form>
          )}

          {/* 5. ACTIVE PROFILE */}
          {mode === 'PROFILE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-extrabold flex items-center justify-center text-base shadow-md">
                    {currentProfile.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{currentProfile.fullName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {currentProfile.role}
                      </span>
                    </h3>
                    <div className="text-xs text-slate-400">{currentProfile.email} &bull; {currentProfile.phone}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{currentProfile.tenantName}</div>
                  </div>
                </div>

                <button
                  onClick={() => { authService.logout(); setFeedbackMsg({ type: 'SUCCESS', text: 'Logged out. Now using guest mode.' }); }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Designation / Department</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{currentProfile.designation || 'N/A'}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{currentProfile.department || 'Operations'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Assigned Branch / Concession</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{currentProfile.branchName || 'Global Operations Hub'}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{currentProfile.branchId || 'HQ-GLOBAL'}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">Granted RBAC Scopes ({currentProfile.permissions.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentProfile.permissions.map((perm) => (
                    <span key={perm} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. SECURITY & DEVICES */}
          {mode === 'SECURITY' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Authentication Hardening
                </h4>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Multi-Factor Authentication (MFA)</div>
                      <div className="text-[11px] text-slate-400">Require TOTP or SMS OTP upon unknown device login</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentProfile.securitySettings.isMfaEnabled}
                    onChange={(e) => authService.updateSecuritySettings({ isMfaEnabled: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Fingerprint className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Biometric WebAuthn (Touch ID / Face ID)</div>
                      <div className="text-[11px] text-slate-400">Unlock weighbridge and OTT tasks with device hardware key</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentProfile.securitySettings.isBiometricsEnabled}
                    onChange={(e) => authService.updateSecuritySettings({ isBiometricsEnabled: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              {/* Active Device Sessions */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Active Device Sessions</span>
                  <span className="text-[10px] text-slate-500 font-normal">Tenant Isolated</span>
                </h4>

                <div className="space-y-2">
                  {authService.getDeviceSessions().map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                          {sess.deviceType === 'DESKTOP' && <Laptop className="w-4 h-4" />}
                          {sess.deviceType === 'MOBILE' && <Smartphone className="w-4 h-4" />}
                          {sess.deviceType === 'TABLET' && <Tablet className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{sess.deviceName}</span>
                            {sess.isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {sess.browser} &bull; {sess.ipAddress} &bull; {sess.location}
                          </div>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          onClick={() => authService.revokeDeviceSession(sess.id)}
                          className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
