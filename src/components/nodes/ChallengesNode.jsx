import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Award, QrCode, Upload, CheckCircle2, ShieldCheck, Trophy, Camera } from 'lucide-react';

export const ChallengesNode = () => {
  const { challenges, toggleChallenge, showToast } = useEcoSphere();
  const [showQrModal, setShowQrModal] = useState(false);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Section: Active Challenge Cards Grid */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
          Available Eco Challenges
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {challenges.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                item.joined
                  ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-teal px-2 py-0.5 rounded-full bg-forest-teal/10">
                  {item.category}
                </span>
                <h5 className="text-xs font-bold text-slate-800 mt-2">{item.title}</h5>
                <div className="text-emerald-mint font-extrabold text-xs mt-1">+{item.points} PTS</div>
              </div>

              <div className="mt-3 space-y-2">
                {item.joined && (
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-mint h-full" style={{ width: `${item.progress}%` }} />
                  </div>
                )}

                <button
                  onClick={() => toggleChallenge(item.id)}
                  className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                    item.joined
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-emerald-mint text-white hover:bg-forest-teal shadow-sm'
                  }`}
                >
                  {item.joined ? 'Active (Opt-out)' : 'Join Challenge'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Portal & Geotag / QR Scanner Slot */}
      <div className="grid grid-cols-2 gap-4">
        {/* Verification Upload Desk */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h5 className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-emerald-mint" /> Verification Evidence Portal
          </h5>

          <div
            onClick={() => {
              setEvidenceUploaded(true);
              showToast('EXIF Metadata verified: Timestamp & Geotag match challenge location!', 'success');
            }}
            className="p-5 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-mint bg-slate-50 hover:bg-emerald-50/40 text-center cursor-pointer transition-all space-y-1"
          >
            <Camera className="w-5 h-5 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-700">
              {evidenceUploaded ? '✅ EXIF Photo Verified' : 'Upload Proof Photo (JPEG)'}
            </div>
            <p className="text-[10px] text-slate-400">EXIF reader extracts GPS coordinates automatically</p>
          </div>
        </div>

        {/* Location QR Code Validator Button */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-forest-teal" /> Eco-Station QR Validator
            </h5>
            <p className="text-xs text-slate-500 mt-1">
              Scan official station QR codes at recycling hubs or tree planting events for instant verification.
            </p>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="py-2.5 rounded-xl bg-forest-teal text-white text-xs font-bold shadow-md hover:bg-emerald-mint transition-all flex items-center justify-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Camera QR Scanner</span>
          </button>
        </div>
      </div>

      {/* Mock QR Scanner Modal Overlay */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-mint flex items-center justify-center mx-auto font-bold">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Scan Station QR Code</h3>
            <div className="w-48 h-48 mx-auto border-4 border-emerald-mint rounded-2xl flex items-center justify-center bg-slate-900 text-emerald-400 font-mono text-xs">
              [ Camera Stream Active ]
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowQrModal(false);
                  showToast('QR Code Verified! +150 Points awarded 🎉', 'success');
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-mint text-white text-xs font-bold shadow-md"
              >
                Simulate QR Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
