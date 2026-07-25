import React from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Compass, Monitor, Smartphone } from 'lucide-react';

export const ViewModeToggle = ({ className = '' }) => {
  const { viewMode, setViewMode } = useEcoSphere();

  const modes = [
    { id: 'spatial', label: 'Spatial Canvas', icon: Compass, badge: '2D Infinite' },
    { id: 'desktop', label: 'Desktop App', icon: Monitor, badge: 'Executive' },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone, badge: 'Responsive' },
  ];

  return (
    <div className={`flex items-center bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-lg ${className}`}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = viewMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-300 ${
              isActive
                ? 'bg-emerald-mint text-white shadow-md scale-105 ring-2 ring-emerald-mint/20'
                : 'text-slate-600 hover:text-forest-teal hover:bg-slate-100/80'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};
