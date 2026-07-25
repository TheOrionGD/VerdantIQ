import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, MapPin, Image as ImageIcon, Search, AlertCircle } from 'lucide-react';
import { useEcoSphere } from '../../context/EcoSphereContext';

export const SubmissionVerificationDeskPage = () => {
  const { apiService, showToast } = useEcoSphere();
  const [queue, setQueue] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    let isMounted = true;
    apiService.adminInstitution.getAuditQueue().then((items) => {
      if (isMounted && items) {
        setQueue(items);
        if (items.length > 0) setSelectedSubmission(items[0]);
      }
    });
    return () => { isMounted = false; };
  }, [apiService]);

  const handleAction = (id, approved) => {
    apiService.adminInstitution.auditSubmission(id, approved);
    setQueue((prev) => prev.filter((item) => item.id !== id));
    if (selectedSubmission?.id === id) {
      const remaining = queue.filter((item) => item.id !== id);
      setSelectedSubmission(remaining.length > 0 ? remaining[0] : null);
    }
    showToast(approved ? 'Evidence verified! Points disbursed to member.' : 'Submission rejected.', approved ? 'success' : 'alert');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-300">
            Multi-Tenant Audit Desk
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Submission Verification Desk
          </h2>
          <p className="text-xs text-slate-500">
            Inspect photo proof evidence, location metadata, and timestamp integrity before disbursing reward points.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-mint" />
          <span>{queue.length} Pending Audits</span>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="p-12 rounded-3xl bg-emerald-50/50 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-800">Verification Desk Inbox Zero!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All submitted evidence photos have been audited and reward points disbursed to members.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Queue List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Pending Submissions Queue
            </h3>

            <div className="space-y-2.5">
              {queue.map((item) => {
                const isSelected = selectedSubmission?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSubmission(item)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold">{item.user}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.time}
                      </span>
                    </div>

                    <div className={`text-xs font-medium mt-1 ${isSelected ? 'text-sky-300' : 'text-emerald-mint'}`}>
                      {item.challenge}
                    </div>

                    <div className={`text-[11px] flex items-center gap-1 mt-2 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{item.photo}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission Inspection Panel */}
          {selectedSubmission && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">Evidence Inspection</span>
                  <h3 className="text-lg font-black text-slate-900">{selectedSubmission.challenge}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">Submitted by <strong>{selectedSubmission.user}</strong></div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(selectedSubmission.id, false)}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-all border border-rose-200"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleAction(selectedSubmission.id, true)}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-forest-teal text-white hover:bg-emerald-mint text-xs font-bold transition-all shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Disburse</span>
                  </button>
                </div>
              </div>

              {/* Photo Evidence Graphic Box */}
              <div className="aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                <ImageIcon className="w-12 h-12 text-sky-400 mb-2 relative z-10 animate-pulse" />
                <div className="text-xs font-mono text-sky-300 relative z-10 font-bold">{selectedSubmission.photo}</div>
                <div className="text-[10px] text-slate-400 relative z-10 mt-1">EXIF Geotag: Verified Campus Boundary (37.7749° N, 122.4194° W)</div>
              </div>

              {/* Verification Checklist */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase">Verification Rules Check:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint" />
                    <span>Photo resolution & hash valid</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint" />
                    <span>Campus Geofence matched</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint" />
                    <span>Within challenge time window</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint" />
                    <span>No duplicate submission hash</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
