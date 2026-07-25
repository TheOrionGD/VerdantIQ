import React from 'react';
import { DashboardNode } from '../../components/nodes/DashboardNode';
import { TrackerNode } from '../../components/nodes/TrackerNode';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Sparkles, Activity, ShieldCheck, Zap, Droplet, TreePine } from 'lucide-react';

export const UserDashboardPage = () => {
  const { ecoScore, weeklyPoints, co2SavedKg, waterSavedGal, treesPlanted } = useEcoSphere();

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner KPI Bar */}
      <div className="grid grid-cols-2-mobile md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 md:p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-forest-teal text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">EcoScore Index</div>
            <div className="text-2xl md:text-3xl font-black mt-1 flex items-baseline gap-1">
              {ecoScore} <span className="text-xs md:text-sm font-bold text-emerald-200">/ 100</span>
            </div>
            <div className="text-[10px] text-emerald-100 mt-1">Top 8% in Neighborhood</div>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">CO₂ Offset</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">{co2SavedKg} kg</div>
            <div className="text-[10px] font-bold text-emerald-mint mt-1">↓ 14% vs last month</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-emerald-50 text-emerald-mint flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Water Conserved</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">{waterSavedGal} gal</div>
            <div className="text-[10px] font-bold text-sky-600 mt-1">Within daily target</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Droplet className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Trees Equivalent</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">{treesPlanted} 🌲</div>
            <div className="text-[10px] font-bold text-forest-teal mt-1">{weeklyPoints} Rewards PTS</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-emerald-50 text-forest-teal flex items-center justify-center shrink-0">
            <TreePine className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Main Dashboard Node */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200/80 shadow-md">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-mint" /> Sustainability Command Center
        </h3>
        <DashboardNode />
      </div>

      {/* Daily Activity Trackers Workspace */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200/80 shadow-md">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-mint" /> Resource Usage & Activity Logger
        </h3>
        <TrackerNode />
      </div>
    </div>
  );
};
