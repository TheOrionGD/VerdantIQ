import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ROLE_DETAILS, ROLES } from '../../config/rbacConfig';
import { Leaf, User, Building2, ShieldAlert, ArrowRight, Lock, Sparkles, CheckCircle2, ShieldCheck, Mail, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const { login } = useEcoSphere();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personas'); // 'personas' | 'credentials'
  const [selectedRole, setSelectedRole] = useState(ROLES.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSignIn = (roleKey) => {
    login(roleKey);
    const targetRoute = ROLE_DETAILS[roleKey]?.defaultRoute || '/user/dashboard';
    navigate(targetRoute);
  };

  const handleCredentialSubmit = (e) => {
    e.preventDefault();
    login(selectedRole, { email });
    const targetRoute = ROLE_DETAILS[selectedRole]?.defaultRoute || '/user/dashboard';
    navigate(targetRoute);
  };

  return (
    <div className="min-h-screen w-screen overflow-y-auto bg-slate-950 font-sans select-none flex flex-col justify-between relative">
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="px-8 py-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-mint to-forest-teal flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              EcoSphere <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">RBAC Security v3.0</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">VerdantIQ Sustainability Intelligence Platform</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-mint" />
          <span>Spring Security JWT & Role Access Control</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-8 w-full z-20 space-y-8 my-auto">
        {/* Title Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Role-Based Authentication Desk
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Sign In to Your Sustainability Portal
          </h2>
          <p className="text-sm text-slate-400">
            Select your persona tier or sign in with institutional credentials to access your role-tailored workspace.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex space-x-1">
            <button
              onClick={() => setActiveTab('personas')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'personas'
                  ? 'bg-emerald-mint text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1-Click Persona Cards
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'credentials'
                  ? 'bg-emerald-mint text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Institutional Email Sign In
            </button>
          </div>
        </div>

        {/* Persona Cards View */}
        {activeTab === 'personas' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard User Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between space-y-6 group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    Tier 1 • Persona
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">Standard User</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Individuals or households logging resource metrics, configuring household digital twins, receiving ML recommendations, and participating in eco challenges.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint shrink-0" />
                    <span>Personal Dashboard & Activity Logger</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint shrink-0" />
                    <span>Digital Twin Simulation Lab</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint shrink-0" />
                    <span>Groq AI Assistant & MILP Solver</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRoleSignIn(ROLES.USER)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-mint hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 group-hover:shadow-emerald-900/40"
              >
                <span>Sign In as Standard User</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Institution Admin Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition-all shadow-xl flex flex-col justify-between space-y-6 group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
                    Tier 2 • Persona
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">Institution Admin</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Representatives of educational campuses, corporations, or residential societies managing multi-tenant member rosters, challenge builders, and submission verification desks.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Multi-Tenant Institutional Dashboard</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Member & Department Governance</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Submission Verification Desk Queue</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRoleSignIn(ROLES.INSTITUTION_ADMIN)}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 group-hover:shadow-sky-900/40"
              >
                <span>Sign In as Institution Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* System Admin Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all shadow-xl flex flex-col justify-between space-y-6 group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                    Tier 3 • Persona
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">System Admin</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Global platform administrators maintaining microservice telemetry, tuning XGBoost ML parameters, inspecting MongoDB document storage pools, and auditing security logs.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Global Settings & Emission Factors</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>ML Model Telemetry & Retraining</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>MongoDB Collections & Audit Logs</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRoleSignIn(ROLES.SYSTEM_ADMIN)}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 group-hover:shadow-purple-900/40"
              >
                <span>Sign In as System Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Credentials Form View */
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Access Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-mint"
                >
                  <option value={ROLES.USER}>Standard User Persona</option>
                  <option value={ROLES.INSTITUTION_ADMIN}>Institution Admin Persona</option>
                  <option value={ROLES.SYSTEM_ADMIN}>System Admin Persona</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@ecosphere.io"
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-emerald-mint placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-emerald-mint placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-mint hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>Authenticate Session</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer Status */}
      <footer className="px-8 py-6 border-t border-slate-900 text-center text-xs text-slate-500 z-20">
        EcoSphere Multi-Tenant Platform • Role-Based Access Control (RBAC) Architecture • Powered by VerdantIQ Intelligence
      </footer>
    </div>
  );
};
