import React, { useState } from 'react';
import { Plus, Award, Calendar, Target, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useEcoSphere } from '../../context/EcoSphereContext';

export const CampusChallengeBuilderPage = () => {
  const { showToast } = useEcoSphere();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Transport',
    rewardPoints: 250,
    deptTarget: 'All Departments',
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    kpiGoal: 'Save 500 kg CO2 aggregate across campus',
    description: '',
  });

  const [createdChallenges, setCreatedChallenges] = useState([
    { id: 'cc1', title: 'Campus Zero Carpool Week', category: 'Transport', reward: 300, target: 'Engineering', status: 'Active' },
    { id: 'cc2', title: 'Solar Dorm Off-Grid Weekend', category: 'Energy', reward: 500, target: 'Dorms 1-4', status: 'Scheduled' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const newChallenge = {
      id: `cc${Date.now()}`,
      title: formData.title,
      category: formData.category,
      reward: Number(formData.rewardPoints),
      target: formData.deptTarget,
      status: 'Active',
    };

    setCreatedChallenges([newChallenge, ...createdChallenges]);
    showToast(`Campus Challenge "${formData.title}" deployed successfully!`, 'success');
    setFormData({
      title: '',
      category: 'Transport',
      rewardPoints: 250,
      deptTarget: 'All Departments',
      startDate: '2026-08-01',
      endDate: '2026-08-15',
      kpiGoal: 'Save 500 kg CO2 aggregate across campus',
      description: '',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-700 via-indigo-800 to-slate-900 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-sky-200">
            Multi-Tenant Engagement Studio
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">Campus Challenge Builder</h2>
          <p className="text-xs text-sky-100 max-w-xl mt-1">
            Design targeted institutional challenges, set KPI thresholds, assign point rewards, and trigger gamified member participation.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Award className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-600" /> Challenge Configuration Form
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Challenge Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Green Transit Friday / Zero Plastic Dining"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sustainability Domain</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="Transport">Transport & Mobility</option>
                  <option value="Energy">Energy Efficiency</option>
                  <option value="Waste">Waste & Recycling</option>
                  <option value="Water">Water Conservation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Point Reward Disbursement</label>
                <input
                  type="number"
                  value={formData.rewardPoints}
                  onChange={(e) => setFormData({ ...formData, rewardPoints: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Department Scope</label>
                <select
                  value={formData.deptTarget}
                  onChange={(e) => setFormData({ ...formData, deptTarget: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="All Departments">All Campus Members</option>
                  <option value="Engineering">Engineering Block</option>
                  <option value="Dorms 1-4">Residential Dorms</option>
                  <option value="Admin Hub">Admin & Faculty</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">KPI Target Benchmark</label>
                <input
                  type="text"
                  value={formData.kpiGoal}
                  onChange={(e) => setFormData({ ...formData, kpiGoal: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Challenge Instructions & Guidelines</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Specify evidence submission requirements (e.g. photo geotag of bus ticket or solar array log)."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-forest-teal hover:bg-emerald-mint text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Deploy Challenge to Institutional Portal</span>
            </button>
          </form>
        </div>

        {/* Active Campus Challenges Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> Active Campus Challenges ({createdChallenges.length})
          </h3>

          <div className="space-y-3">
            {createdChallenges.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                    {c.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Domain: {c.category}</span>
                  <span className="font-bold text-emerald-mint">+{c.reward} PTS</span>
                </div>
                <div className="text-[10px] text-slate-400">Target Scope: {c.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
