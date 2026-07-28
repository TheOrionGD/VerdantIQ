import React, { useState } from 'react';
import { Database, HardDrive, Server, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { useEcoSphere } from '../../context/EcoSphereContext';

export const DatabaseStorageManagementPage = () => {
  const { showToast } = useEcoSphere();
  const [isBackingUp, setIsBackingUp] = useState(false);

  const [dbTables] = useState([
    { name: 'user_activity_logs', engine: 'MongoDB Collection', rows: '142,850', size: '48.2 MB', spatialIdx: '2dsphere GeoJSON' },
    { name: 'digital_twin_states', engine: 'MongoDB / BSON', rows: '12,400', size: '18.4 MB', spatialIdx: 'N/A' },
    { name: 'campus_geofences', engine: 'MongoDB GeoSpatial', rows: '1,280', size: '6.1 MB', spatialIdx: '2dsphere Active' },
    { name: 'ml_xgb_checkpoints', engine: 'MongoDB Collection', rows: '850', size: '2.4 MB', spatialIdx: 'Single Field Index' },
    { name: 'audit_verifications', engine: 'MongoDB Collection', rows: '38,900', size: '14.8 MB', spatialIdx: 'Compound Index' },
  ]);

  const triggerBackup = () => {
    setIsBackingUp(true);
    showToast('Initializing mongodump BSON snapshot...', 'info');
    setTimeout(() => {
      setIsBackingUp(false);
      showToast('MongoDB database snapshot archived to S3 bucket (89.9 MB)', 'success');
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300">
            Platform Data Infrastructure
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Database & Storage Management
          </h2>
          <p className="text-xs text-slate-500">
            Monitor MongoDB connection pools, 2dsphere spatial indexes, document collection counts, and automated snapshots.
          </p>
        </div>

        <button
          onClick={triggerBackup}
          disabled={isBackingUp}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
          <span>{isBackingUp ? 'Archiving Snapshot...' : 'Trigger Database Snapshot'}</span>
        </button>
      </div>

      {/* Database KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Connection Pool</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">18 / 100</div>
            <div className="text-[10px] font-bold text-emerald-mint mt-1">Pool Health: Optimal</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Server className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total DB Size</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">89.9 MB</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Allocated: 5.0 GB</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">2dsphere Index Speed</div>
            <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">12 ms</div>
            <div className="text-[10px] font-bold text-emerald-mint mt-1">GeoSpatial Index Active</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-emerald-50 text-emerald-mint flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Last Backup</div>
            <div className="text-base md:text-lg font-black text-slate-900 mt-1">Today, 04:00 AM</div>
            <div className="text-[10px] font-bold text-emerald-mint mt-1">Automated Daily Snapshot</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Database Schema Tables */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-4 md:p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-600" /> MongoDB Document Collections & GeoSpatial Schema
        </h3>

        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <table className="w-full text-left text-xs min-w-[550px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Collection Name</th>
                <th className="py-3 px-3">Database Engine</th>
                <th className="py-3 px-3">Total Records</th>
                <th className="py-3 px-3">Storage Footprint</th>
                <th className="py-3 px-3">Spatial Indexing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {dbTables.map((t) => (
                <tr key={t.name} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.name}</td>
                  <td className="py-3 px-3 font-semibold text-slate-600">{t.engine}</td>
                  <td className="py-3 px-3 font-bold text-purple-700">{t.rows}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{t.size}</td>
                  <td className="py-3 px-3 font-bold text-emerald-mint">{t.spatialIdx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
