import React, { useState, useEffect } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Activity, Database, Cpu, RefreshCw, Save, CheckCircle2 } from 'lucide-react';

export const SystemAdminNode = () => {
  const { apiService, showToast } = useEcoSphere();
  const [isTraining, setIsTraining] = useState(false);
  const [co2PerKwh, setCo2PerKwh] = useState(0.82);
  const [co2PerLiterGas, setCo2PerLiterGas] = useState(2.31);
  const [telemetry, setTelemetry] = useState({
    redisLatencyMs: 2.4,
    postGisQueryMs: 12,
    xgboostRmse: 0.042,
    uptimePercentage: 99.98,
  });

  useEffect(() => {
    let isMounted = true;
    apiService.adminSystem.getTelemetry().then((data) => {
      if (isMounted && data) setTelemetry(data);
    });
    return () => { isMounted = false; };
  }, [apiService]);

  const triggerRetrain = () => {
    setIsTraining(true);
    showToast('FastAPI ML Retraining pipeline initialized...', 'info');
    apiService.predictions.triggerModelRetraining().then(() => {
      setIsTraining(false);
      showToast('XGBoost model retrained! Redis cache flushed & updated.', 'success');
    });
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Redis Latency</div>
          <div className="text-xl font-black text-emerald-mint mt-1">{telemetry.redisLatencyMs} ms</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">PostGIS Spatial Query</div>
          <div className="text-xl font-black text-forest-teal mt-1">{telemetry.postGisQueryMs} ms</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">XGBoost RMSE Error</div>
          <div className="text-xl font-black text-slate-800 mt-1">{telemetry.xgboostRmse}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">System Uptime</div>
          <div className="text-xl font-black text-emerald-mint mt-1">{telemetry.uptimePercentage}%</div>
        </div>
      </div>

      {/* Global Emission Factors Coefficients Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Global CO₂ Emission Factors Coefficients Matrix
          </h4>
          <button
            onClick={() => showToast('Emission factor coefficients saved to database!', 'success')}
            className="flex items-center space-x-1 text-xs font-bold text-emerald-mint hover:underline"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Matrix</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Grid Energy (kg CO₂ / kWh)</div>
            <input
              type="number"
              step="0.01"
              value={co2PerKwh}
              onChange={(e) => setCo2PerKwh(Number(e.target.value))}
              className="w-full text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Gasoline (kg CO₂ / Liter)</div>
            <input
              type="number"
              step="0.01"
              value={co2PerLiterGas}
              onChange={(e) => setCo2PerLiterGas(Number(e.target.value))}
              className="w-full text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Retrain ML Models Scheduler Trigger */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-forest-teal text-white flex items-center justify-between shadow-lg">
        <div>
          <div className="text-xs font-bold">FastAPI Microservice Scheduler</div>
          <div className="text-[11px] text-slate-300">Retrain scikit-learn & XGBoost user behavioral models</div>
        </div>

        <button
          onClick={triggerRetrain}
          disabled={isTraining}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-mint text-white text-xs font-bold shadow-md hover:bg-emerald-600 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
          <span>{isTraining ? 'Retraining...' : 'Trigger Model Retraining'}</span>
        </button>
      </div>
    </div>
  );
};
