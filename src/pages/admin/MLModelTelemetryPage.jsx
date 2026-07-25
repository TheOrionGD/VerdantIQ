import React from 'react';
import { SystemAdminNode } from '../../components/nodes/SystemAdminNode';
import { Activity, Cpu, RefreshCw, Zap } from 'lucide-react';

export const MLModelTelemetryPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-purple-200">
            Microservice Telemetry & ML Ops
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">ML Model & System Telemetry</h2>
          <p className="text-xs text-purple-200 max-w-xl mt-1">
            Monitor XGBoost prediction RMSE, Redis cache latency, PostGIS spatial query speeds, and trigger microservice retraining pipelines.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Activity className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
        <SystemAdminNode />
      </div>
    </div>
  );
};
