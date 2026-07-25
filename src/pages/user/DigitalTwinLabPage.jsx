import React from 'react';
import { DigitalTwinNode } from '../../components/nodes/DigitalTwinNode';
import { Home, Sparkles, Sliders, Cpu } from 'lucide-react';
import { useEcoSphere } from '../../context/EcoSphereContext';

export const DigitalTwinLabPage = () => {
  const { twinUpgrades } = useEcoSphere();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-forest-teal to-slate-900 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-emerald-200">
            IoT & Spatial Physics Simulation
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">Digital Twin Lab</h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Simulate thermal dynamics, solar yield, smart HVAC controls, and appliance retrofit impacts before committing capital investment.
          </p>
        </div>

        <div className="hidden lg:flex items-center space-x-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center">
            <div className="text-[10px] font-bold uppercase text-emerald-200">Simulated Upgrades</div>
            <div className="text-xl font-black text-white mt-0.5">{twinUpgrades.length} Active</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
        <DigitalTwinNode />
      </div>
    </div>
  );
};
