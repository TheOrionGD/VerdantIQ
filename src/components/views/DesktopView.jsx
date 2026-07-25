import React from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ViewModeToggle } from '../common/ViewModeToggle';
import { ROLE_NAVIGATION, ROLE_DETAILS, ROLES } from '../../config/rbacConfig';
import { Leaf, Sparkles, ChevronRight, Shield, LogOut, UserCheck } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export const DesktopView = ({ children }) => {
  const { userRole, currentUser, logout, ecoScore, weeklyPoints } = useEcoSphere();
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoleNav = ROLE_NAVIGATION[userRole] || ROLE_NAVIGATION[ROLES.USER];
  const currentRoleObj = ROLE_DETAILS[userRole] || ROLE_DETAILS[ROLES.USER];

  const currentNavItem = currentRoleNav.find((n) => n.path === location.pathname) || currentRoleNav[0];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-50 flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <header className="h-16 px-6 bg-white border-b border-slate-200/90 flex items-center justify-between z-30 shadow-sm">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-mint to-forest-teal flex items-center justify-center shadow-md">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              EcoSphere <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">RBAC System v3.0</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">VerdantIQ Multi-Tenant Platform</p>
          </div>
        </div>

        {/* Center Canvas / Desktop View Mode Switcher */}
        <ViewModeToggle />

        {/* Right Action Bar (User Profile & Logout) */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <div
              className="w-7 h-7 rounded-lg text-white font-bold text-[11px] flex items-center justify-center shadow-xs"
              style={{ backgroundColor: currentRoleObj.color }}
            >
              {currentUser?.avatar || 'US'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser?.name || 'User'}</div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase">{currentRoleObj.label}</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-mint" />
            <span>Score: {ecoScore}/100</span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all text-xs font-bold"
            title="Sign Out of Platform Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role-Aware Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between py-4 px-3 overflow-y-auto">
          <div className="space-y-4">
            {/* Active Role Badge Header */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Active Access Tier
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${currentRoleObj.badgeClass}`}>
                  {currentRoleObj.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                {currentRoleObj.purpose}
              </p>
            </div>

            {/* Navigation Menu */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Role Modules ({currentRoleNav.length})
              </div>

              {currentRoleNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-mint' : 'text-slate-500'}`} />
                      <span className="truncate">{item.shortLabel}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-mint shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <div className="text-xs font-bold text-forest-teal">Institutional Rewards</div>
            <div className="text-lg font-black text-slate-800">{weeklyPoints} PTS</div>
          </div>
        </aside>

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/80">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Title Header */}
            {currentNavItem && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 font-mono">
                    {currentNavItem.category}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                    {currentNavItem.label}
                  </h2>
                </div>
              </div>
            )}

            {/* Render Routed Component */}
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};
