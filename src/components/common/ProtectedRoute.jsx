import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ROLE_DETAILS, ROLES } from '../../config/rbacConfig';
import { ShieldAlert, ArrowLeft, Lock, LogIn } from 'lucide-react';

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userRole, login } = useEcoSphere();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAuthorized = allowedRoles.includes(userRole) || userRole === ROLES.SYSTEM_ADMIN;

  if (!isAuthorized) {
    const requiredRoleObj = ROLE_DETAILS[allowedRoles[0]] || ROLE_DETAILS[ROLES.USER];

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-rose-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              Access Restricted (RBAC Enforcement)
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Role Permission Required
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your current active role is <strong className="text-slate-800">{ROLE_DETAILS[userRole]?.label}</strong>. You need <strong className="text-rose-700">{requiredRoleObj?.label}</strong> privileges to view route <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">{location.pathname}</code>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                login(allowedRoles[0]);
                navigate(requiredRoleObj?.defaultRoute || '/user/dashboard');
              }}
              className="w-full py-3 px-4 rounded-xl bg-forest-teal text-white text-xs font-bold hover:bg-emerald-mint transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Switch to {requiredRoleObj?.label} Persona</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all flex items-center justify-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Return to Login Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
