import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ViewModeToggle } from '../common/ViewModeToggle';
import {
  Leaf, Home, Activity, Sparkles, MessageSquare, Menu, Award, Cpu,
  BrainCircuit, ShieldCheck, Settings, ChevronRight, X, Zap, Droplets, Car,
  Trash2, TreePine, Upload, MapPin, Plus, Check, TrendingUp, AlertTriangle,
  ArrowRight, Download, Camera, QrCode, Send
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// --- MOBILE RE-DESIGNED SUB-COMPONENTS (ui-ux-pro-max-skill Mobile Typography & UX) ---

// 1. Mobile Home Dashboard
const MobileHome = () => {
  const { ecoScore, weeklyPoints, co2SavedKg, waterSavedGal, alerts, dismissAlert, setWeeklyPoints } = useEcoSphere();

  return (
    <div className="space-y-4 text-slate-900 animate-fade-in">
      {/* Hero Eco-Score Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/40 border border-slate-200/90 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
            Live Rating
          </span>
          <span className="text-xs font-bold text-slate-500">Top 12% Rank</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Eco-Score Index</h2>
            <p className="text-xs font-medium text-slate-500">XGBoost ML Verified</p>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-lg w-fit flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2% this week
            </div>
          </div>

          {/* Large Mobile Radial Score Dial */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#E2E8F0" strokeWidth="9" fill="transparent" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#059669"
                strokeWidth="9"
                fill="transparent"
                strokeDasharray="251.32"
                strokeDashoffset={251.32 - (251.32 * ecoScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-900">{ecoScore}</span>
              <span className="text-[9px] font-bold uppercase text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Mobile Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-mint flex items-center justify-center font-bold flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Points</div>
            <div className="text-base font-black text-slate-900">{weeklyPoints} PTS</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-forest-teal flex items-center justify-center font-bold flex-shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">CO₂ Saved</div>
            <div className="text-base font-black text-slate-900">{co2SavedKg} kg</div>
          </div>
        </div>
      </div>

      {/* Stacked Resource Widgets */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">Resource Telemetry</h3>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-sun flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-800">Electricity</span>
            </div>
            <span className="text-xs font-extrabold text-amber-sun bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Peak Alert
            </span>
          </div>
          <div className="text-lg font-black text-slate-900">18.4 <span className="text-xs text-slate-500 font-semibold">kWh / day</span></div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-800">Water Recycling</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-mint bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal
            </span>
          </div>
          <div className="text-lg font-black text-slate-900">{waterSavedGal} <span className="text-xs text-slate-500 font-semibold">Gal saved</span></div>
        </div>
      </div>

      {/* Mobile Risk Warnings */}
      {alerts.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">Active AI Warnings</h3>
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-sun flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{alert.title}</div>
                  <div className="text-[11px] text-slate-600">{alert.desc}</div>
                </div>
              </div>
              <button onClick={() => dismissAlert(alert.id)} className="text-xs font-bold text-amber-800 px-2.5 py-1 rounded-lg bg-amber-200/80">
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Mobile Tracker
const MobileTracker = () => {
  const { showToast, setWeeklyPoints, setCo2SavedKg } = useEcoSphere();
  const [tab, setTab] = useState('Transport');
  const [distance, setDistance] = useState(15);
  const [kwh, setKwh] = useState(25);

  const handleSubmit = (e) => {
    e.preventDefault();
    setWeeklyPoints((prev) => prev + 35);
    setCo2SavedKg((prev) => Number((prev + 2.8).toFixed(1)));
    showToast(`Logged ${tab} action! +35 Points added.`, 'success');
  };

  return (
    <div className="space-y-4 animate-fade-in text-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Daily Activity Tracker</h2>
        <span className="text-xs font-bold text-emerald-mint bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Mobile Log
        </span>
      </div>

      {/* Mobile Horizontal Pill Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {['Transport', 'Electricity', 'Water', 'Waste', 'Trees'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              tab === t ? 'bg-emerald-mint text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        {tab === 'Transport' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Transit Mode</label>
              <select className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none">
                <option>Electric Bus</option>
                <option>EV Car</option>
                <option>Bicycle</option>
                <option>Walking</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Distance Traveled</span>
                <span className="text-emerald-mint font-extrabold text-sm">{distance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-emerald-mint cursor-pointer h-3"
              />
            </div>
          </div>
        )}

        {tab === 'Electricity' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Electricity Consumption</span>
                <span className="text-emerald-mint font-extrabold text-sm">{kwh} kWh</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                value={kwh}
                onChange={(e) => setKwh(Number(e.target.value))}
                className="w-full accent-emerald-mint cursor-pointer h-3"
              />
            </div>

            <div
              onClick={() => showToast('OCR scanned utility bill: 25 kWh parsed!', 'info')}
              className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-mint bg-slate-50 text-center cursor-pointer space-y-1"
            >
              <Upload className="w-5 h-5 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Scan Utility Bill PDF / Photo</div>
              <p className="text-[10px] text-slate-400">OCR parses kWh automatically</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-2xl bg-emerald-mint text-white font-bold text-sm shadow-md hover:bg-forest-teal transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Save Log Entry (+35 PTS)</span>
        </button>
      </form>
    </div>
  );
};

// 3. Mobile Digital Twin
const MobileTwin = () => {
  const { twinUpgrades, toggleTwinUpgrade } = useEcoSphere();

  const totalCost = twinUpgrades.reduce((acc, item) => acc + item.cost, 0);
  const totalOffset = twinUpgrades.reduce((acc, item) => acc + item.co2Offset, 0);

  return (
    <div className="space-y-4 animate-fade-in text-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Digital Twin Simulator</h2>
        <span className="text-xs font-bold text-forest-teal bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          2D Mobile
        </span>
      </div>

      {/* House Schematic Mobile Container */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>2D Household Schematic</span>
          <span className="text-emerald-400">26°C Weather</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
            <span>Roof: Solar</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${twinUpgrades.some(u => u.id === 'solar') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
              {twinUpgrades.some(u => u.id === 'solar') ? 'Active' : 'Off'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
            <span>Kitchen: LEDs</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${twinUpgrades.some(u => u.id === 'led') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
              {twinUpgrades.some(u => u.id === 'led') ? 'Active' : 'Off'}
            </span>
          </div>
        </div>
      </div>

      {/* Upgrades Checklist Mobile */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">Hardware Upgrades</h3>

        {[
          { id: 'solar', name: '5kW Rooftop Solar Array', cost: 1200, offset: 140 },
          { id: 'led', name: 'LED Smart Lighting Kit', cost: 40, offset: 12 },
          { id: 'rain', name: 'Rainwater Harvester Tank', cost: 350, offset: 25 },
        ].map((up) => {
          const isAdded = twinUpgrades.some((u) => u.id === up.id);
          return (
            <div
              key={up.id}
              onClick={() => toggleTwinUpgrade(up)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isAdded ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="text-sm font-bold text-slate-900">{up.name}</div>
                <div className="text-xs text-slate-500 font-medium">Cost: ${up.cost} | Offset: +{up.offset} kg CO₂/yr</div>
              </div>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${isAdded ? 'bg-emerald-mint text-white' : 'bg-slate-100 text-slate-400'}`}>
                {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Stats Box */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 grid grid-cols-2 gap-2 text-center shadow-sm">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Simulated Cost</div>
          <div className="text-base font-black text-slate-900">${totalCost}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">CO₂ Offset</div>
          <div className="text-base font-black text-emerald-mint">+{totalOffset} kg</div>
        </div>
      </div>
    </div>
  );
};

// 4. Mobile Analytics
const mockDataMobile = [
  { day: 'M', actual: 18, predicted: 19 },
  { day: 'T', actual: 17, predicted: 18 },
  { day: 'W', actual: 21, predicted: 18 },
  { day: 'T', actual: 16, predicted: 17 },
  { day: 'F', actual: 19, predicted: 18 },
  { day: 'S', actual: 24, predicted: 22 },
  { day: 'S', actual: 22, predicted: 21 },
];

const MobileAnalytics = () => {
  const { executeOmnibarCommand } = useEcoSphere();

  return (
    <div className="space-y-4 animate-fade-in text-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Behavioral Analytics</h2>
        <span className="text-xs font-bold text-emerald-mint bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          XGBoost ML
        </span>
      </div>

      {/* Chart Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
        <div className="text-xs font-bold text-slate-500">Actual (Solid) vs ML Forecast (Dotted)</div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockDataMobile}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} />
              <YAxis stroke="#94A3B8" fontSize={10} />
              <Line type="monotone" dataKey="actual" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="predicted" stroke="#059669" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reasoning Card */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-wider text-forest-teal">Explainable AI Reasoning</div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          "On Wednesday, energy consumption spiked by <span className="font-bold text-amber-600">15.6%</span> due to thermal HVAC adjustment matching OpenWeather 34°C high."
        </p>
        <button
          onClick={() => executeOmnibarCommand('why energy spike?')}
          className="w-full py-2.5 rounded-xl bg-forest-teal text-white text-xs font-bold shadow-sm hover:bg-emerald-mint transition-all flex items-center justify-center space-x-1"
        >
          <span>Ask Omnibar to Solve Anomaly</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// 5. Mobile Groq AI Assistant
const MobileAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your Groq-powered Environmental Decision Assistant.' },
    { id: 2, sender: 'user', text: 'Compare bicycle vs train commute footprint.' },
    { id: 3, sender: 'ai', text: '🚲 Bicycle: 0 kg CO₂ | 🚆 Train: 0.28 kg CO₂. Bicycle saves 4.2 kg CO₂ daily!' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'Groq AI Recommendation: Optimizing water heating yields an immediate 8% footprint reduction.' }
      ]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[480px] justify-between space-y-3 animate-fade-in text-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Groq AI Assistant</h2>
        <span className="text-xs font-bold text-emerald-mint bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Fast Llama-3
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[85%] text-xs font-medium leading-relaxed ${m.sender === 'user' ? 'bg-forest-teal text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Groq AI Assistant..."
          className="flex-1 h-11 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none"
        />
        <button type="submit" className="h-11 px-4 rounded-xl bg-emerald-mint text-white font-bold text-xs shadow-md">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// --- MAIN MOBILE VIEW SHELL ---
export const MobileView = () => {
  const { ecoScore } = useEcoSphere();
  const [mobileTab, setMobileTab] = useState('home');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900 flex items-center justify-center p-0 md:p-6 font-sans select-none">
      {/* Smartphone Device Shell */}
      <div className="w-full h-full max-w-sm max-h-[844px] bg-slate-50 md:rounded-[48px] border-0 md:border-[10px] md:border-slate-800 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Mobile Top Status Notch Bar */}
        <div className="h-10 bg-white px-6 flex items-center justify-between border-b border-slate-100 flex-shrink-0 z-30">
          <span className="text-[11px] font-bold text-slate-800">9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto hidden md:block" />
          <span className="text-[10px] font-bold text-emerald-mint bg-emerald-50 px-2 py-0.5 rounded-full">
            5G
          </span>
        </div>

        {/* Mobile Header Bar */}
        <div className="px-4 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between z-20 shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-mint to-forest-teal flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">EcoSphere Mobile</h1>
              <p className="text-[10px] text-slate-400 font-semibold">VerdantIQ Mobile App</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-mint bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {ecoScore} Score
          </span>
        </div>

        {/* View Mode Switcher Header Strip */}
        <div className="px-3 py-2 bg-slate-100 border-b border-slate-200/80 flex items-center justify-center flex-shrink-0">
          <ViewModeToggle className="scale-90" />
        </div>

        {/* Mobile Main Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {mobileTab === 'home' && <MobileHome />}
          {mobileTab === 'tracker' && <MobileTracker />}
          {mobileTab === 'twin' && <MobileTwin />}
          {mobileTab === 'analytics' && <MobileAnalytics />}
          {mobileTab === 'ai' && <MobileAssistant />}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-30 flex-shrink-0">
          <button
            onClick={() => setMobileTab('home')}
            className={`flex flex-col items-center space-y-1 ${mobileTab === 'home' ? 'text-emerald-mint font-bold' : 'text-slate-400'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setMobileTab('tracker')}
            className={`flex flex-col items-center space-y-1 ${mobileTab === 'tracker' ? 'text-emerald-mint font-bold' : 'text-slate-400'}`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px]">Tracker</span>
          </button>

          <button
            onClick={() => setMobileTab('twin')}
            className={`flex flex-col items-center space-y-1 ${mobileTab === 'twin' ? 'text-emerald-mint font-bold' : 'text-slate-400'}`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px]">Twin</span>
          </button>

          <button
            onClick={() => setMobileTab('analytics')}
            className={`flex flex-col items-center space-y-1 ${mobileTab === 'analytics' ? 'text-emerald-mint font-bold' : 'text-slate-400'}`}
          >
            <BrainCircuit className="w-5 h-5" />
            <span className="text-[10px]">Analytics</span>
          </button>

          <button
            onClick={() => setMobileTab('ai')}
            className={`flex flex-col items-center space-y-1 ${mobileTab === 'ai' ? 'text-emerald-mint font-bold' : 'text-slate-400'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">AI</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
