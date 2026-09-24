import React, { useState } from 'react';
import { 
  Building2, MapPin, Plus, ShieldCheck, RefreshCw, AlertCircle, 
  CheckCircle2, Key, UserCheck, ShieldAlert, LogOut, ChevronDown
} from 'lucide-react';
import { QuarryMaster, CreateQuarryDto, QuarryType, quarryApiClient } from '../../services/quarryApiClient';
import { apiClient, AuthUser } from '../../services/apiClient';

interface QuarryActiveContextBarProps {
  quarries: QuarryMaster[];
  activeQuarry: QuarryMaster | null;
  loading: boolean;
  onSelectQuarry: (quarry: QuarryMaster) => void;
  onRefreshQuarries: () => void;
  authUser: AuthUser | null;
  onAuthChange: () => void;
}

export const QuarryActiveContextBar: React.FC<QuarryActiveContextBarProps> = ({
  quarries,
  activeQuarry,
  loading,
  onSelectQuarry,
  onRefreshQuarries,
  authUser,
  onAuthChange
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Login form state
  const [loginEmail, setLoginEmail] = useState('admin@racezoneventures.com');
  const [loginPass, setLoginPass] = useState('Admin@123');

  // Create Quarry form state
  const [formData, setFormData] = useState<CreateQuarryDto>({
    companyId: authUser?.companyId || 'comp-rz-corp-01',
    branchId: authUser?.branchId || 'br-bangalore-01',
    name: '',
    quarryType: 'HARD_ROCK',
    location: '',
    address: '',
    leaseReference: ''
  });

  const handleLogin = async (email: string, pass: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await apiClient.login(email, pass);
    setIsSubmitting(false);
    if (res.success) {
      setShowAuthModal(false);
      onAuthChange();
      onRefreshQuarries();
    } else {
      setErrorMsg(res.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    apiClient.clearAuth();
    onAuthChange();
  };

  const handleCreateQuarry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      setErrorMsg('Please specify quarry name and location');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await quarryApiClient.createQuarry(formData);
    setIsSubmitting(false);
    if (res.success && res.data) {
      setShowCreateModal(false);
      setFormData({
        companyId: authUser?.companyId || 'comp-rz-corp-01',
        branchId: authUser?.branchId || 'br-bangalore-01',
        name: '',
        quarryType: 'HARD_ROCK',
        location: '',
        address: '',
        leaseReference: ''
      });
      onRefreshQuarries();
      onSelectQuarry(res.data);
    } else {
      setErrorMsg(res.message || res.error || 'Failed to create quarry master record');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top row: Active Quarry Selector & Auth Context */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Quarry Selector */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Quarry Context</span>
              {loading && <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />}
            </div>
            {quarries.length > 0 ? (
              <select
                id="active-quarry-selector"
                value={activeQuarry?.id || ''}
                onChange={(e) => {
                  const q = quarries.find(item => item.id === e.target.value);
                  if (q) onSelectQuarry(q);
                }}
                className="mt-1 w-full bg-slate-950 border border-slate-700 text-amber-300 font-bold text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
              >
                {quarries.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.quarryType === 'LATERITE' ? 'Laterite Stone' : 'Hard Rock Granite'}) — {q.location}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-amber-400/80 font-mono mt-1">
                {loading ? 'Fetching quarry registry...' : 'No quarries found for active tenant.'}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions (Refresh, Add Quarry, Auth Status) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="refresh-quarries-btn"
            onClick={onRefreshQuarries}
            disabled={loading}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-all disabled:opacity-50"
            title="Refresh Quarry Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {apiClient.hasPermission('QUARRY_CREATE') && (
            <button
              id="open-create-quarry-btn"
              onClick={() => {
                setErrorMsg(null);
                setShowCreateModal(true);
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Quarry</span>
            </button>
          )}

          {/* User Auth Context Pill */}
          {authUser ? (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-white font-semibold block leading-tight">{authUser.name}</span>
                <span className="text-[10px] text-emerald-400">{authUser.roles.join(', ')}</span>
              </div>
              <button
                id="auth-logout-btn"
                onClick={handleLogout}
                className="ml-2 text-slate-400 hover:text-rose-400 text-[11px] p-1"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="open-auth-modal-btn"
              onClick={() => {
                setErrorMsg(null);
                setShowAuthModal(true);
              }}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Sign In Required</span>
            </button>
          )}
        </div>
      </div>

      {/* Quarry Details Sub-bar */}
      {activeQuarry && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg">
            <span className="text-slate-500 text-[10px] block">QUARRY ID</span>
            <span className="text-amber-400 font-semibold truncate block">{activeQuarry.id}</span>
          </div>
          <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg">
            <span className="text-slate-500 text-[10px] block">MINERAL TYPE</span>
            <span className="text-white font-semibold block">
              {activeQuarry.quarryType === 'LATERITE' ? 'Laterite Stone' : 'Hard Rock Granite'}
            </span>
          </div>
          <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg">
            <span className="text-slate-500 text-[10px] block">LOCATION</span>
            <span className="text-slate-300 font-semibold truncate block">{activeQuarry.location}</span>
          </div>
          <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg">
            <span className="text-slate-500 text-[10px] block">OPERATIONAL STATUS</span>
            <span className={`font-semibold inline-flex items-center gap-1 ${
              activeQuarry.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {activeQuarry.status}
            </span>
          </div>
        </div>
      )}

      {/* Modal: Create Quarry */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" /> Register Quarry Master Unit
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateQuarry} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quarry Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bantwal Laterite Quarry Bench #2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quarry Mineral Type *</label>
                  <select
                    value={formData.quarryType}
                    onChange={(e) => setFormData({ ...formData, quarryType: e.target.value as QuarryType })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="HARD_ROCK">Hard Rock / Granite Aggregate</option>
                    <option value="LATERITE">Laterite Dimension Stone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / Village *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bantwal Taluk, DK"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Statutory Lease Reference</label>
                <input
                  type="text"
                  placeholder="e.g. DMG/KA/MN-2024-8841"
                  value={formData.leaseReference}
                  onChange={(e) => setFormData({ ...formData, leaseReference: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Site Address / Access Route</label>
                <textarea
                  rows={2}
                  placeholder="Survey No. 142/2, Near Highway Junction"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Quarry...' : 'Create Quarry Master'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Authentication / Role Switch */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" /> Authenticate Security Context
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Quarry API operations require an authenticated JWT and verified tenant context. Select a predefined role or enter credentials:
            </p>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick role buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-mono block">Quick Switch Roles:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleLogin('admin@racezoneventures.com', 'Admin@123')}
                  disabled={isSubmitting}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-left"
                >
                  <strong className="text-amber-400 block text-[11px]">SUPER_ADMIN</strong>
                  <span className="text-[10px] text-slate-400">Full Access</span>
                </button>
                <button
                  onClick={() => handleLogin('manager@racezoneventures.com', 'Manager@123')}
                  disabled={isSubmitting}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-left"
                >
                  <strong className="text-emerald-400 block text-[11px]">QUARRY_MANAGER</strong>
                  <span className="text-[10px] text-slate-400">Production &amp; Gate Pass</span>
                </button>
                <button
                  onClick={() => handleLogin('owner@racezoneventures.com', 'Owner@123')}
                  disabled={isSubmitting}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-left"
                >
                  <strong className="text-blue-400 block text-[11px]">TENANT_ADMIN</strong>
                  <span className="text-[10px] text-slate-400">Company Admin</span>
                </button>
                <button
                  onClick={() => handleLogin('staff@racezoneventures.com', 'Staff@123')}
                  disabled={isSubmitting}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-left"
                >
                  <strong className="text-purple-400 block text-[11px]">OPERATOR</strong>
                  <span className="text-[10px] text-slate-400">Read-Only Logs</span>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin(loginEmail, loginPass);
                }}
                className="space-y-2.5 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In With Token'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
