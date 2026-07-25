import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Car, Zap, Droplets, Trash2, TreePine, Upload, MapPin, Plus, CheckCircle2 } from 'lucide-react';

export const TrackerNode = () => {
  const { showToast, setWeeklyPoints, setCo2SavedKg } = useEcoSphere();
  const [activeTab, setActiveTab] = useState('Transport');

  // Transport State
  const [transitMode, setTransitMode] = useState('Electric Bus');
  const [distance, setDistance] = useState(15);

  // Energy/Water State
  const [kwh, setKwh] = useState(25);
  const [gallons, setGallons] = useState(40);
  const [billUploaded, setBillUploaded] = useState(false);

  // Waste State
  const [plasticKg, setPlasticKg] = useState(1.2);
  const [organicKg, setOrganicKg] = useState(3.5);

  // Tree State
  const [treeSpecies, setTreeSpecies] = useState('Neem Sapling');
  const [locationPin, setLocationPin] = useState('12.9716° N, 77.5946° E');

  const handleLogSubmit = (e) => {
    e.preventDefault();
    setWeeklyPoints((prev) => prev + 35);
    setCo2SavedKg((prev) => Number((prev + 2.8).toFixed(1)));
    showToast(`Logged ${activeTab} action! +35 Points added.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        {[
          { id: 'Transport', icon: Car },
          { id: 'Electricity', icon: Zap },
          { id: 'Water', icon: Droplets },
          { id: 'Waste', icon: Trash2 },
          { id: 'Tree Planting', icon: TreePine },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-mint text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.id}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleLogSubmit} className="space-y-5">
        {/* Transport Tab */}
        {activeTab === 'Transport' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Transit Mode</label>
              <select
                value={transitMode}
                onChange={(e) => setTransitMode(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-mint"
              >
                <option>Electric Bus</option>
                <option>EV Car</option>
                <option>Bicycle</option>
                <option>Walking</option>
                <option>Gasoline Car (Carpool)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Distance Traveled</span>
                <span className="text-emerald-mint font-extrabold">{distance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-emerald-mint cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Electricity Tab */}
        {activeTab === 'Electricity' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Logged Consumption (kWh)</span>
                <span className="text-emerald-mint font-extrabold">{kwh} kWh</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                value={kwh}
                onChange={(e) => setKwh(Number(e.target.value))}
                className="w-full accent-emerald-mint cursor-pointer"
              />
            </div>

            {/* OCR Upload Slot */}
            <div
              onClick={() => {
                setBillUploaded(true);
                showToast('OCR scanned utility bill: 25 kWh parsed automatically!', 'info');
              }}
              className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-mint bg-slate-50/50 hover:bg-emerald-50/30 text-center cursor-pointer transition-all space-y-2"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">
                {billUploaded ? '✅ Utility Bill Scanned via OCR' : 'Drag & Drop Utility Bill (PDF / JPG)'}
              </div>
              <p className="text-[11px] text-slate-400">System automatically extracts kWh and dates</p>
            </div>
          </div>
        )}

        {/* Water Tab */}
        {activeTab === 'Water' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Gallons Conserved / Recycled</span>
                <span className="text-emerald-mint font-extrabold">{gallons} Gal</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                value={gallons}
                onChange={(e) => setGallons(Number(e.target.value))}
                className="w-full accent-emerald-mint cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Waste Tab */}
        {activeTab === 'Waste' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Plastics & Inorganic Recycled (kg)</span>
                <span className="text-emerald-mint font-extrabold">{plasticKg} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={plasticKg}
                onChange={(e) => setPlasticKg(Number(e.target.value))}
                className="w-full accent-emerald-mint cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Organic Composted (kg)</span>
                <span className="text-emerald-mint font-extrabold">{organicKg} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.5"
                value={organicKg}
                onChange={(e) => setOrganicKg(Number(e.target.value))}
                className="w-full accent-emerald-mint cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Tree Planting Tab */}
        {activeTab === 'Tree Planting' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Sapling Species Name</label>
              <input
                type="text"
                value={treeSpecies}
                onChange={(e) => setTreeSpecies(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-mint"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Geotag PostGIS Location</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={locationPin}
                  className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-100 text-xs font-mono text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => showToast('GPS location updated via PostGIS!', 'info')}
                  className="p-3 rounded-xl bg-forest-teal text-white text-xs font-bold hover:bg-emerald-mint transition-all"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Log Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-emerald-mint text-white font-bold text-sm shadow-md hover:bg-forest-teal transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Save Log Entry to PostGIS Database</span>
        </button>
      </form>
    </div>
  );
};
