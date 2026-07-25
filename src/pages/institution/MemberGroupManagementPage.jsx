import React, { useState } from 'react';
import { Users, Search, Plus, UserCheck, Shield, Mail, Download, Filter } from 'lucide-react';
import { useEcoSphere } from '../../context/EcoSphereContext';

export const MemberGroupManagementPage = () => {
  const { showToast } = useEcoSphere();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const [members, setMembers] = useState([
    { id: 'm1', name: 'Dr. Aris Thorne', email: 'a.thorne@campus.edu', dept: 'Engineering', role: 'Group Leader', points: 1450, status: 'Active' },
    { id: 'm2', name: 'Sophia Lin', email: 's.lin@campus.edu', dept: 'Dorms 1-4', role: 'Student Delegate', points: 980, status: 'Active' },
    { id: 'm3', name: 'Marcus Vance', email: 'm.vance@campus.edu', dept: 'Admin Hub', role: 'Sustainability Officer', points: 2100, status: 'Active' },
    { id: 'm4', name: 'Elena Rostova', email: 'e.rostova@campus.edu', dept: 'Engineering', role: 'Member', points: 640, status: 'Active' },
    { id: 'm5', name: 'Kaelen Brody', email: 'k.brody@campus.edu', dept: 'Dorms 1-4', role: 'Member', points: 420, status: 'Pending Verification' },
  ]);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'All' || m.dept === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleInvite = (e) => {
    e.preventDefault();
    const emailInput = e.target.elements.email.value;
    const deptInput = e.target.elements.dept.value;

    if (!emailInput) return;

    const newMember = {
      id: `m${Date.now()}`,
      name: emailInput.split('@')[0].replace('.', ' '),
      email: emailInput,
      dept: deptInput,
      role: 'Member',
      points: 0,
      status: 'Invited',
    };

    setMembers([newMember, ...members]);
    e.target.reset();
    showToast(`Invitation sent to ${emailInput}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300">
            Multi-Tenant Member Governance
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Member & Group Management
          </h2>
          <p className="text-xs text-slate-500">
            Manage institutional users, department structures, leader privileges, and invite rosters.
          </p>
        </div>

        <button
          onClick={() => showToast('Exporting campus member roster to CSV...', 'info')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Roster (CSV)</span>
        </button>
      </div>

      {/* Invite New Member Box */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Quick Invite Member to Institution
        </h4>

        <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="User Email (e.g. j.doe@campus.edu)"
            className="p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-sky-400 placeholder:text-slate-400"
          />

          <select
            name="dept"
            className="p-3 rounded-xl bg-slate-800 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-sky-400"
          >
            <option value="Engineering">Engineering Block A</option>
            <option value="Dorms 1-4">Residential Dorms 1-4</option>
            <option value="Admin Hub">Admin & Library Hub</option>
          </select>

          <button
            type="submit"
            className="py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
          >
            <Mail className="w-4 h-4" />
            <span>Send Institutional Invite</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Dorms 1-4">Dorms 1-4</option>
            <option value="Admin Hub">Admin Hub</option>
          </select>
        </div>
      </div>

      {/* Members Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Member Persona</th>
                <th className="py-3.5 px-4">Department / Group</th>
                <th className="py-3.5 px-4">Role Tier</th>
                <th className="py-3.5 px-4">Eco Points</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{m.name}</div>
                    <div className="text-[11px] text-slate-400">{m.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{m.dept}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-mint">{m.points} PTS</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => showToast(`Updated privileges for ${m.name}`, 'info')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold"
                    >
                      Manage Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
