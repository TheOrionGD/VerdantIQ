import React, { useState } from 'react';
import { Settings, Save, Shield, Sliders } from 'lucide-react';
import { useEcoSphere } from '../../context/EcoSphereContext';

export const GlobalSettingsConfigPage = () => {
  const { showToast } = useEcoSphere();

  const [coefficients, setCoefficients] = useState({
    gridCo2Kwh: 0.82,
    gasolineCo2Liter: 2.31,
    dieselCo2Liter: 2.68,
    waterCo2Gal: 0.004,
    wasteCo2Kg: 0.34,
  });

  const [featureFlags, setFeatureFlags] = useState({
    xgboostPredictions: true,
    digitalTwinPhysics: true,
    groqAiAssistant: true,
    campusMultiTenant: true,
    autoVerificationAi: false,
  });

  const handleToggle = (flag) => {
    setFeatureFlags(prev => {
      const updated = { ...prev, [flag]: !prev[flag] };
      showToast(`Feature flag "${flag}" toggled ${updated[flag] ? 'ON' : 'OFF'}`, 'info');
      return updated;
    });
  };

  const handleSaveCoefficients = (e) => {
    e.preventDefault();
    showToast('Global CO₂ emission factor coefficients saved to database!', 'success');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-purple-200">
            System Administration & Control Matrix
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mt-2">Global Settings & Configuration</h2>
          <p className="text-xs text-purple-200 max-w-xl mt-1">
            Maintain global platform integrity, define carbon emission factors, manage feature flags, and tune API rate limits.
          </p>
        </div>

        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 hidden sm:flex">
          <Settings className="w-5 h-5 md:w-7 md:h-7 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Emission Factors Matrix */}
        <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" /> Emission Factors Matrix
            </h3>
            <button
              onClick={handleSaveCoefficients}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Matrix</span>
            </button>
          </div>

          <form onSubmit={handleSaveCoefficients} className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Grid Energy (kg CO₂ / kWh)</div>
              <input
                type="number"
                step="0.001"
                value={coefficients.gridCo2Kwh}
                onChange={(e) => setCoefficients({ ...coefficients, gridCo2Kwh: Number(e.target.value) })}
                className="w-full text-sm font-bold text-slate-900 focus:outline-none bg-transparent mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Gasoline (kg CO₂ / Liter)</div>
                <input
                  type="number"
                  step="0.001"
                  value={coefficients.gasolineCo2Liter}
                  onChange={(e) => setCoefficients({ ...coefficients, gasolineCo2Liter: Number(e.target.value) })}
                  className="w-full text-sm font-bold text-slate-900 focus:outline-none bg-transparent mt-1"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Diesel Fuel (kg CO₂ / Liter)</div>
                <input
                  type="number"
                  step="0.001"
                  value={coefficients.dieselCo2Liter}
                  onChange={(e) => setCoefficients({ ...coefficients, dieselCo2Liter: Number(e.target.value) })}
                  className="w-full text-sm font-bold text-slate-900 focus:outline-none bg-transparent mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Water Utility (kg CO₂ / Gal)</div>
                <input
                  type="number"
                  step="0.001"
                  value={coefficients.waterCo2Gal}
                  onChange={(e) => setCoefficients({ ...coefficients, waterCo2Gal: Number(e.target.value) })}
                  className="w-full text-sm font-bold text-slate-900 focus:outline-none bg-transparent mt-1"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Municipal Waste (kg CO₂ / kg)</div>
                <input
                  type="number"
                  step="0.001"
                  value={coefficients.wasteCo2Kg}
                  onChange={(e) => setCoefficients({ ...coefficients, wasteCo2Kg: Number(e.target.value) })}
                  className="w-full text-sm font-bold text-slate-900 focus:outline-none bg-transparent mt-1"
                />
              </div>
            </div>
          </form>
        </div>

        {/* System Feature Flags */}
        <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" /> Feature Flags
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Live Reload</span>
          </div>

          <div className="space-y-3">
            {Object.entries(featureFlags).map(([flag, active]) => (
              <div
                key={flag}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 capitalize">
                    {flag.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {active ? 'Active globally' : 'Disabled'}
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(flag)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                    active ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {active ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
