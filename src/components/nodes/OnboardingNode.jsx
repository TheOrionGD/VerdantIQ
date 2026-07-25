import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Users, Zap, Car, Award, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

export const OnboardingNode = () => {
  const { setEcoScore, showToast, focusNode } = useEcoSphere();
  const [step, setStep] = useState(1);
  const [members, setMembers] = useState(3);
  const [diet, setDiet] = useState('Vegetarian');
  const [elecBill, setElecBill] = useState(120);
  const [waterBill, setWaterBill] = useState(45);
  const [transitMode, setTransitMode] = useState('EV');
  const [weeklyMiles, setWeeklyMiles] = useState(85);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const calculateBaseline = () => {
    setIsSubmitted(true);
    setEcoScore(72);
    showToast('Baseline Carbon Footprint calculated! Twin initialized.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Wizard Progress Stepper */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === i
                  ? 'bg-emerald-mint text-white ring-4 ring-emerald-100 shadow-md'
                  : step > i
                  ? 'bg-forest-teal text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > i ? <Check className="w-4 h-4" /> : i}
            </div>
            <span className={`text-xs font-semibold ${step === i ? 'text-forest-teal' : 'text-slate-400'}`}>
              {i === 1 && 'Household'}
              {i === 2 && 'Utilities'}
              {i === 3 && 'Transit'}
              {i === 4 && 'Baseline'}
            </span>
            {i < 4 && <div className="w-8 h-0.5 bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Household & Diet */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Household Occupants</label>
            <div className="flex items-center space-x-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setMembers(num)}
                  className={`flex-1 py-3 rounded-2xl border font-bold text-sm transition-all ${
                    members === num
                      ? 'bg-emerald-mint text-white border-emerald-mint shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {num} {num === 5 ? '+' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Primary Dietary Pattern</label>
            <div className="grid grid-cols-3 gap-3">
              {['Vegan', 'Vegetarian', 'Mixed'].map((item) => (
                <button
                  key={item}
                  onClick={() => setDiet(item)}
                  className={`py-3 rounded-2xl border font-bold text-xs transition-all ${
                    diet === item
                      ? 'bg-forest-teal text-white border-forest-teal shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Utilities */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
              <span>Avg Monthly Electricity (kWh)</span>
              <span className="text-emerald-mint font-extrabold">{elecBill} kWh</span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              value={elecBill}
              onChange={(e) => setElecBill(Number(e.target.value))}
              className="w-full accent-emerald-mint cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
              <span>Avg Monthly Water Usage (Gallons)</span>
              <span className="text-emerald-mint font-extrabold">{waterBill} Gal</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={waterBill}
              onChange={(e) => setWaterBill(Number(e.target.value))}
              className="w-full accent-emerald-mint cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Step 3: Transit */}
      {step === 3 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Main Vehicle Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {['EV / Hybrid', 'Gasoline', 'Public Transit'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTransitMode(mode)}
                  className={`py-3 rounded-2xl border font-bold text-xs transition-all ${
                    transitMode === mode
                      ? 'bg-emerald-mint text-white border-emerald-mint shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
              <span>Weekly Commute Distance</span>
              <span className="text-emerald-mint font-extrabold">{weeklyMiles} Miles</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              value={weeklyMiles}
              onChange={(e) => setWeeklyMiles(Number(e.target.value))}
              className="w-full accent-emerald-mint cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Step 4: Baseline Summary Gauge */}
      {step === 4 && (
        <div className="space-y-5 text-center animate-fade-in">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 shadow-inner space-y-3">
            <Sparkles className="w-8 h-8 text-emerald-mint mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold text-deep-charcoal">Baseline Sustainability Score</h3>
            <div className="text-4xl font-extrabold text-forest-teal">
              72 <span className="text-sm font-semibold text-slate-500">/ 100</span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your household consumes <span className="font-bold text-emerald-mint">18% less CO₂</span> than the regional average!
            </p>
          </div>

          <button
            onClick={() => focusNode('dashboard')}
            className="w-full py-3.5 rounded-2xl bg-emerald-mint text-white font-bold text-sm shadow-lg hover:bg-forest-teal transition-all"
          >
            Launch Household Digital Twin Dashboard →
          </button>
        </div>
      )}

      {/* Stepper Navigation Buttons */}
      {step < 4 && (
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="flex items-center space-x-1 text-xs font-bold text-slate-500 disabled:opacity-30 hover:text-slate-800"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={() => {
              if (step === 3) calculateBaseline();
              setStep((s) => Math.min(4, s + 1));
            }}
            className="flex items-center space-x-1 px-5 py-2.5 rounded-xl bg-forest-teal text-white font-bold text-xs shadow-md hover:bg-emerald-mint transition-all"
          >
            <span>{step === 3 ? 'Compute Baseline' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
