import React from 'react';
import { OptimizerNode } from '../../components/nodes/OptimizerNode';
import { AnalyticsNode } from '../../components/nodes/AnalyticsNode';
import { Cpu, BrainCircuit } from 'lucide-react';

export const OptimizationPredictionsPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-emerald-mint" /> Predictive XGBoost Intelligence & Forecasts
          </h3>
          <span className="text-[11px] font-bold text-emerald-mint bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Explainable AI Active
          </span>
        </div>
        <AnalyticsNode />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-forest-teal" /> MILP Constraint Optimization Engine
          </h3>
          <span className="text-[11px] font-bold text-slate-500">
            PuLP Solver Microservice: Connected
          </span>
        </div>
        <OptimizerNode />
      </div>
    </div>
  );
};
