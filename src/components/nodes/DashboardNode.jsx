import React from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Zap, Droplets, Car, AlertTriangle, ShieldCheck, TrendingUp, Sparkles, PlusCircle } from 'lucide-react';

export const DashboardNode = () => {
  const { ecoScore, weeklyPoints, co2SavedKg, waterSavedGal, alerts, dismissAlert, focusNode } = useEcoSphere();

  return (
    <div className="space-y-6">
      {/* Top Hero Grid: Central Eco-Score Dial + Gamification Pills */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Central Radial Dial Card */}
        <div className="col-span-1 md:col-span-7 p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 border border-slate-200/80 shadow-md flex flex-col sm:flex-row items-center justify-between relative overflow-hidden space-y-4 sm:space-y-0">
          <div className="space-y-2 z-10 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-mint px-3 py-1 rounded-full bg-emerald-100/60 inline-block">
              Live Sustainability Rating
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-deep-charcoal tracking-tight">Eco-Score Index</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto sm:mx-0">
              Based on real-time XGBoost ML telemetry and weekly utility logs.
            </p>

            <div className="flex items-center justify-center sm:justify-start space-x-2 pt-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +4.2% this week
              </span>
              <span className="text-xs text-slate-500 font-medium">Rank: Top 12%</span>
            </div>
          </div>

          {/* Radial Dial Indicator */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="46" stroke="#E2E8F0" strokeWidth="10" fill="transparent" className="sm:hidden" />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="#059669"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="289.02"
                strokeDashoffset={289.02 - (289.02 * ecoScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out sm:hidden"
              />
              <circle cx="64" cy="64" r="54" stroke="#E2E8F0" strokeWidth="12" fill="transparent" className="hidden sm:block" />
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="#059669"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="339.29"
                strokeDashoffset={339.29 - (339.29 * ecoScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out hidden sm:block"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-deep-charcoal">{ecoScore}</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400">Out of 100</span>
            </div>
          </div>
        </div>

        {/* Gamification Summary Badges */}
        <div className="col-span-1 md:col-span-5 grid grid-cols-2-mobile gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-mint flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Weekly Reward Points</div>
              <div className="text-xl font-extrabold text-slate-800">{weeklyPoints} PTS</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-forest-teal flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Total CO₂ Saved</div>
              <div className="text-xl font-extrabold text-slate-800">{co2SavedKg} kg</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Resource Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Electricity Widget */}
        <div
          onClick={() => focusNode('tracker')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-mint/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-sun flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-sun bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Peak Alert
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase">Electricity Consumption</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            18.4 <span className="text-xs font-semibold text-slate-400">kWh / day</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-sun h-full w-[65%]" />
          </div>
        </div>

        {/* Water Widget */}
        <div
          onClick={() => focusNode('tracker')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-mint/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-mint bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Normal
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase">Water Recycling</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {waterSavedGal} <span className="text-xs font-semibold text-slate-400">Gal saved</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-mint h-full w-[82%]" />
          </div>
        </div>

        {/* Transport Widget */}
        <div
          onClick={() => focusNode('tracker')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-mint/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-mint flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-mint bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              74% Green
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase">Transit Split</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            42 <span className="text-xs font-semibold text-slate-400">km EV / Walk</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-forest-teal h-full w-[74%]" />
          </div>
        </div>
      </div>

      {/* Dynamic AI Risk Alert Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-sun" /> AI Risk Warnings Feed
          </h4>
          <button
            onClick={() => focusNode('tracker')}
            className="text-xs font-bold text-emerald-mint hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Quick Log Activity
          </button>
        </div>

        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-sun flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-800">{alert.title}</div>
                  <div className="text-[11px] text-slate-600">{alert.desc}</div>
                </div>
              </div>

              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 px-2.5 py-1 rounded-lg bg-amber-100/80 hover:bg-amber-200 transition-all"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
