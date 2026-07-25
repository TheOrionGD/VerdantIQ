import React from 'react';
import { ChallengesNode } from '../../components/nodes/ChallengesNode';
import { CommunityNode } from '../../components/nodes/CommunityNode';
import { Award, Users, Trophy } from 'lucide-react';

export const CommunityChallengesPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-mint" /> Eco Challenges & Verification Desk
        </h3>
        <ChallengesNode />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-forest-teal" /> Community Hub & Institutional Directory
        </h3>
        <CommunityNode />
      </div>
    </div>
  );
};
