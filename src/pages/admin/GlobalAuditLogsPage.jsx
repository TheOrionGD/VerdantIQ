import React, { useState } from 'react';
import { ScrollText, Search, Filter, ShieldAlert, Download, AlertOctagon, Info, AlertTriangle } from 'lucide-react';
import { useEcoSphere } from '../../context/EcoSphereContext';

export const GlobalAuditLogsPage = () => {
  const { showToast } = useEcoSphere();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  const [logs] = useState([
    { id: 'l1', level: 'CRITICAL', service: 'AUTH-GATE', action: 'Failed Admin Access Attempt', user: 'IP 192.168.1.105', time: '10 mins ago', details: 'Invalid JWT bearer signature rejected by middleware.' },
    { id: 'l2', level: 'WARNING', service: 'FASTAPI-ML', action: 'High Inference Latency Alert', user: 'System Worker', time: '25 mins ago', details: 'XGBoost batch prediction exceeded 250ms threshold.' },
    { id: 'l3', level: 'INFO', service: 'RBAC-DESK', action: 'Role Privilege Switch', user: 'alex.rivera@ecosphere.io', time: '42 mins ago', details: 'Switched active role from User to Institution Admin.' },
    { id: 'l4', level: 'INFO', service: 'COMMUNITY-DESK', action: 'Campus Challenge Publication', user: 'admin@greenhorizon.edu', time: '1 hour ago', details: 'Published challenge CC-892 ("Carpool Week").' },
    { id: 'l5', level: 'WARNING', service: 'MONGODB-STORE', action: 'Spatial Index Maintenance', user: 'MongoDB Worker', time: '3 hours ago', details: 'Reindexed 420 GeoJSON geospatial documents for optimal query performance.' },
  ]);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'All' || l.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300">
            Security & Compliance Governance
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Global Security Audit Logs
          </h2>
          <p className="text-xs text-slate-500">
            Real-time immutable security event feed tracing administrative actions, authentication attempts, and microservice errors.
          </p>
        </div>

        <button
          onClick={() => showToast('Exporting security audit log to JSON/CSV format...', 'info')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Audit Feed</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, user, or IP address..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-purple-500 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All">All Severity Levels</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="WARNING">WARNING</option>
            <option value="INFO">INFO</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-purple-600" /> Audit Log Stream ({filteredLogs.length} Events)
        </h3>

        <div className="space-y-3 font-sans">
          {filteredLogs.map((l) => (
            <div key={l.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {l.level === 'CRITICAL' && <AlertOctagon className="w-5 h-5 text-rose-600" />}
                  {l.level === 'WARNING' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  {l.level === 'INFO' && <Info className="w-5 h-5 text-sky-500" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      l.level === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      l.level === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {l.level}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{l.action}</span>
                    <span className="text-[10px] font-mono text-slate-400">[{l.service}]</span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1">{l.details}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Triggered by: <strong>{l.user}</strong></div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 text-right shrink-0">
                {l.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
