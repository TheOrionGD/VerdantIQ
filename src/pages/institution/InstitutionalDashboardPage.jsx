import React from 'react';
import { Building2, Users, ShieldCheck, TrendingDown } from 'lucide-react';
import { InstitutionAdminNode } from '../../components/nodes/InstitutionAdminNode';

export const InstitutionalDashboardPage = () => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Institution Banner KPI Bar */}
      <div className="grid grid-cols-2-mobile md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 md:p-5 rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-sky-200">Active Tenant</div>
            <div className="text-lg md:text-xl font-black mt-1">Green Horizon Campus</div>
            <div className="text-[10px] text-sky-100 mt-1">Tier: Multi-Tenant Enterprise</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Campus Members</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">1,248</div>
            <div className="text-[10px] font-bold text-emerald-mint mt-1">↑ 42 new this week</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Campus CO₂ Abatement</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">42.8 Tons</div>
            <div className="text-[10px] font-bold text-emerald-mint mt-1">↓ 18% reduction YoY</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-emerald-50 text-emerald-mint flex items-center justify-center shrink-0">
            <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Audit Verifications</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">89% Approved</div>
            <div className="text-[10px] font-bold text-indigo-600 mt-1">3 pending review</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Campus Departmental Aggregates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Engineering Block A</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">Solar Offset Ratio</span>
              <span className="text-emerald-mint">74%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-mint rounded-full" style={{ width: '74%' }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-500">Members: 420 • Monthly CO₂: 12.4t</div>
        </div>

        <div className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Residential Dorms 1-4</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">Solar Offset Ratio</span>
              <span className="text-sky-600">58%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: '58%' }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-500">Members: 680 • Monthly CO₂: 24.1t</div>
        </div>

        <div className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Admin & Library Hub</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">Solar Offset Ratio</span>
              <span className="text-indigo-600">89%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '89%' }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-500">Members: 148 • Monthly CO₂: 6.3t</div>
        </div>
      </div>

      {/* Main Institution Desk */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200/80 shadow-md">
        <InstitutionAdminNode />
      </div>
    </div>
  );
};
