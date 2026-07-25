import React, { useState, useEffect } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Home, Sun, Zap, Droplet, Car, Shield, Check, Plus, Trash2 } from 'lucide-react';

export const DigitalTwinNode = () => {
  const { apiService, twinUpgrades, toggleTwinUpgrade } = useEcoSphere();
  const [availableUpgrades, setAvailableUpgrades] = useState([]);

  useEffect(() => {
    let isMounted = true;
    apiService.digitalTwin.getAvailableUpgrades().then((upgrades) => {
      if (isMounted) setAvailableUpgrades(upgrades || []);
    });
    return () => { isMounted = false; };
  }, [apiService]);

  const totalCost = twinUpgrades.reduce((acc, item) => acc + item.cost, 0);
  const totalOffset = twinUpgrades.reduce((acc, item) => acc + item.co2Offset, 0);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left 2D House Schematic Sandbox */}
      <div className="col-span-6 space-y-4">
        <div className="p-5 rounded-3xl bg-slate-900 text-white relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-xl">
          <div className="flex items-center justify-between z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              2D Digital Twin Floorplan
            </span>
            <span className="text-xs text-slate-400">Localized Weather: 26°C Clear</span>
          </div>

          {/* Interactive House Rooms Visual Representation */}
          <div className="grid grid-cols-2 gap-3 my-4 z-10">
            {/* Roof Slot */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold">Roof: Solar</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${twinUpgrades.some(u => u.id === 'solar') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                {twinUpgrades.some(u => u.id === 'solar') ? 'Active' : 'Uninstalled'}
              </span>
            </div>

            {/* Kitchen Slot */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold">Kitchen: LEDs</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${twinUpgrades.some(u => u.id === 'led') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                {twinUpgrades.some(u => u.id === 'led') ? 'Active' : 'Uninstalled'}
              </span>
            </div>

            {/* Garden Slot */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold">Garden: Rain</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${twinUpgrades.some(u => u.id === 'rain') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                {twinUpgrades.some(u => u.id === 'rain') ? 'Active' : 'Uninstalled'}
              </span>
            </div>

            {/* Garage Slot */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold">Garage: EV</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${twinUpgrades.some(u => u.id === 'charger') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                {twinUpgrades.some(u => u.id === 'charger') ? 'Active' : 'Uninstalled'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-800 pt-2">
            Click items on right panel to add/remove virtual hardware upgrades
          </div>
        </div>
      </div>

      {/* Right Upgrade Library & ROI Calculator */}
      <div className="col-span-6 space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Simulated Hardware Upgrades Library
        </h4>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {availableUpgrades.map((upgrade) => {
            const isAdded = twinUpgrades.some((u) => u.id === upgrade.id);
            return (
              <div
                key={upgrade.id}
                onClick={() => toggleTwinUpgrade(upgrade)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isAdded
                    ? 'bg-emerald-50 border-emerald-300 text-slate-800'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{upgrade.name}</div>
                  <div className="text-[11px] text-slate-500">
                    Est. Cost: ${upgrade.cost} | Offset: {upgrade.offset} kg CO₂/yr
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isAdded ? 'bg-emerald-mint text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Scenario Evaluation Dashboard */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Simulated Investment</div>
            <div className="text-lg font-black text-slate-800">${totalCost}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Est. Annual CO₂ Offset</div>
            <div className="text-lg font-black text-emerald-mint">+{totalOffset} kg</div>
          </div>
        </div>
      </div>
    </div>
  );
};
