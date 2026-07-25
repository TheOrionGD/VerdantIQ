import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Sliders, Cpu, CheckCircle2, ArrowRight, DollarSign, Target } from 'lucide-react';

export const OptimizerNode = () => {
  const { showToast, focusNode } = useEcoSphere();
  const [budget, setBudget] = useState(250);
  const [carbonTarget, setCarbonTarget] = useState(25);
  const [priority, setPriority] = useState('Balanced');

  const handleApplyStrategy = () => {
    showToast('Optimal MILP strategy synced to Dashboard goals!', 'success');
    focusNode('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Top Constraint Input Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
            <span>Target Monthly Budget</span>
            <span className="text-emerald-mint font-extrabold">${budget}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-emerald-mint cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
            <span>CO₂ Reduction Target</span>
            <span className="text-forest-teal font-extrabold">{carbonTarget}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={carbonTarget}
            onChange={(e) => setCarbonTarget(Number(e.target.value))}
            className="w-full accent-emerald-mint cursor-pointer"
          />
        </div>
      </div>

      {/* Priority Weight Switcher */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
          Optimization Priority Weight
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['Carbon First', 'Balanced', 'Cost Savings'].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                priority === p
                  ? 'bg-forest-teal text-white border-forest-teal shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Google OR-Tools MILP Output Timeline Roadmap */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-mint" /> Google OR-Tools Optimal Strategy Roadmap
          </h4>
          <span className="text-[11px] font-semibold text-emerald-mint bg-emerald-50 px-2 py-0.5 rounded-full">
            Solved in 18ms
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-emerald-mint text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Convert House Lighting to Smart LEDs</div>
                <div className="text-[11px] text-slate-500">Cost: $40 | Savings: $14/mo | Offset: 12 kg CO₂/mo</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-mint">Month 1</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-forest-teal text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Switch 2 Weekly Commutes to Electric Bus</div>
                <div className="text-[11px] text-slate-500">Cost: $0 | Savings: $35/mo | Offset: 28 kg CO₂/mo</div>
              </div>
            </div>
            <span className="text-xs font-bold text-forest-teal">Month 2</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-slate-400 text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Install Rainwater Harvesting Barrel</div>
                <div className="text-[11px] text-slate-500">Cost: $180 | Savings: $22/mo | Offset: 15 kg CO₂/mo</div>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">Month 3</span>
          </div>
        </div>
      </div>

      {/* Apply Plan Button */}
      <button
        onClick={handleApplyStrategy}
        className="w-full py-3.5 rounded-2xl bg-emerald-mint text-white font-bold text-sm shadow-md hover:bg-forest-teal transition-all flex items-center justify-center space-x-2"
      >
        <span>Apply Optimized Strategy to Dashboard Goals</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
