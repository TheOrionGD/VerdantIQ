import React, { useState, useRef, useEffect } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ROLE_DETAILS, ROLES } from '../../config/rbacConfig';
import { ChevronDown, Shield, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoleSwitcher = () => {
  const { userRole, switchRole } = useEcoSphere();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const currentRoleObj = ROLE_DETAILS[userRole] || ROLE_DETAILS[ROLES.USER];
  const Icon = currentRoleObj.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (roleKey) => {
    switchRole(roleKey);
    setIsOpen(false);
    const targetRoute = ROLE_DETAILS[roleKey]?.defaultRoute;
    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  return (
    <div className="relative z-40" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all text-xs font-bold"
        title="Switch System Role (RBAC)"
      >
        <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: currentRoleObj.color }} />
        <Icon className="w-3.5 h-3.5 text-slate-700" />
        <span className="text-slate-800">{currentRoleObj.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Shield className="w-3 h-3 text-emerald-mint" />
              <span>RBAC Role Persona Switcher</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Select access tier to filter views & permissions
            </div>
          </div>

          {Object.values(ROLE_DETAILS).map((role) => {
            const RoleIcon = role.icon;
            const isSelected = userRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start space-x-3 ${
                  isSelected ? 'bg-slate-100/90 border border-slate-200' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-white"
                  style={{ backgroundColor: role.color }}
                >
                  <RoleIcon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{role.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-mint" />}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{role.targetAudience}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
