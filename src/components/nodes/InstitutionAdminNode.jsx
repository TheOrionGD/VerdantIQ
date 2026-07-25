import React, { useState, useEffect } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ShieldCheck, CheckCircle2, XCircle, MapPin, Calendar, Plus } from 'lucide-react';

export const InstitutionAdminNode = () => {
  const { apiService, showToast } = useEcoSphere();
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    let isMounted = true;
    apiService.adminInstitution.getAuditQueue().then((items) => {
      if (isMounted) setQueue(items || []);
    });
    return () => { isMounted = false; };
  }, [apiService]);

  const handleAction = (id, approved) => {
    apiService.adminInstitution.auditSubmission(id, approved);
    setQueue((prev) => prev.filter((item) => item.id !== id));
    showToast(approved ? 'Submission Approved! Reward points disbursed.' : 'Submission Rejected.', approved ? 'success' : 'alert');
  };

  return (
    <div className="space-y-6">
      {/* Pending Verification Audit Queue */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-mint" /> Verification Desk Queue ({queue.length} Pending)
          </h4>
          <span className="text-[11px] font-bold text-slate-400">Multi-Tenant Institution: Green Campus</span>
        </div>

        {queue.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center text-xs font-bold text-emerald-800">
            ✅ All pending verification submissions audited!
          </div>
        ) : (
          <div className="space-y-2.5">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">{item.user} — <span className="text-emerald-mint">{item.challenge}</span></div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {item.photo} • {item.time}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAction(item.id, false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-all"
                    title="Reject Evidence"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(item.id, true)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-emerald-mint text-white text-xs font-bold hover:bg-forest-teal transition-all shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campus Challenge Deployment Panel */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <h5 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-mint" /> Deploy New Campus Challenge
        </h5>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Challenge Title (e.g. Campus Carpool Week)"
            className="p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-emerald-mint"
          />
          <input
            type="number"
            placeholder="Points Reward (e.g. 250)"
            className="p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-emerald-mint"
          />
        </div>

        <button
          onClick={() => showToast('New Campus Challenge launched successfully!', 'success')}
          className="w-full py-2.5 rounded-xl bg-forest-teal text-white text-xs font-bold hover:bg-emerald-mint transition-all shadow-sm"
        >
          Publish Campus Challenge to Members Portal
        </button>
      </div>
    </div>
  );
};
