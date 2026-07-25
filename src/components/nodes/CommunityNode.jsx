import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Building2, TreePine, Droplets, Users, HeartHandshake, Plus } from 'lucide-react';

export const CommunityNode = () => {
  const { showToast } = useEcoSphere();
  const [pledged, setPledged] = useState(false);

  return (
    <div className="space-y-6">
      {/* Aggregated Institutional Impact Cards */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="text-xs font-bold text-slate-500 uppercase">Campus CO₂ Avoided</div>
          <div className="text-2xl font-black text-emerald-mint mt-1">14,850 kg</div>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
          <div className="text-xs font-bold text-slate-500 uppercase">Trees Planted</div>
          <div className="text-2xl font-black text-forest-teal mt-1">420 Trees</div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
          <div className="text-xs font-bold text-slate-500 uppercase">Water Recycled</div>
          <div className="text-2xl font-black text-sky-600 mt-1">12,400 Gal</div>
        </div>
      </div>

      {/* Department Leaderboard Rankings */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
          Institutional Department Rankings
        </h4>
        <div className="space-y-2">
          {[
            { rank: 1, dept: 'School of Environmental Sciences', score: 940, members: 120 },
            { rank: 2, dept: 'Department of Computer Science', score: 880, members: 340 },
            { rank: 3, dept: 'School of Business & Economics', score: 790, members: 210 },
          ].map((item) => (
            <div
              key={item.rank}
              className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  #{item.rank}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{item.dept}</div>
                  <div className="text-[10px] text-slate-500">{item.members} Active Members</div>
                </div>
              </div>
              <div className="text-xs font-extrabold text-emerald-mint">{item.score} PTS</div>
            </div>
          ))}
        </div>
      </div>

      {/* Green Pledge Wall Action */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-800">Campus Green Pledge 2026</div>
          <div className="text-[11px] text-slate-500">Pledge to eliminate single-use plastics this semester</div>
        </div>
        <button
          onClick={() => {
            setPledged(true);
            showToast('You pledged! +50 Points added to your profile.', 'success');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            pledged
              ? 'bg-emerald-mint text-white'
              : 'bg-forest-teal text-white hover:bg-emerald-mint shadow-md'
          }`}
        >
          {pledged ? 'Pledged ✓' : 'Sign Green Pledge'}
        </button>
      </div>
    </div>
  );
};
