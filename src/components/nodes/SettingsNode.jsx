import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { FileText, Download, Save, Bell, User, CheckCircle2 } from 'lucide-react';

export const SettingsNode = () => {
  const { showToast } = useEcoSphere();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  return (
    <div className="space-y-6">
      {/* Profile & Notification Form */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          User Settings & Alerts Configuration
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">Email Anomaly Spike Alerts</div>
              <div className="text-[11px] text-slate-500">Instant warnings when utility usage spikes &gt; 15%</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="accent-emerald-mint w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">Weekly Executive PDF Digest</div>
              <div className="text-[11px] text-slate-500">Auto-generate PDF sustainability statement every Sunday</div>
            </div>
            <input
              type="checkbox"
              checked={weeklyReports}
              onChange={(e) => setWeeklyReports(e.target.checked)}
              className="accent-emerald-mint w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Monthly PDF Statement Reports Hub */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Sustainability PDF Reports Archive (Apache PDFBox)
        </h4>

        <div className="space-y-2">
          {[
            { title: 'EcoSphere Executive Statement — July 2026', size: '2.4 MB', date: 'Jul 01, 2026' },
            { title: 'EcoSphere Executive Statement — June 2026', size: '2.1 MB', date: 'Jun 01, 2026' },
          ].map((report, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-emerald-mint" />
                <div>
                  <div className="text-xs font-bold text-slate-800">{report.title}</div>
                  <div className="text-[10px] text-slate-500">{report.date} • {report.size}</div>
                </div>
              </div>

              <button
                onClick={() => showToast(`Downloading ${report.title} PDF statement...`, 'success')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-mint text-white text-xs font-bold hover:bg-forest-teal transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
