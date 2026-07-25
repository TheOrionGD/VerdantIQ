import React, { useState, useEffect } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { BrainCircuit, HelpCircle, ArrowRight, Download, Sparkles, Loader2 } from 'lucide-react';

export const AnalyticsNode = () => {
  const { apiService, executeOmnibarCommand, showToast } = useEcoSphere();
  const [range, setRange] = useState('7D');
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiService.predictions.getForecasts(range).then((res) => {
      if (isMounted) {
        setForecastData(res.forecastData || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [range, apiService]);

  return (
    <div className="space-y-6">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-emerald-mint" /> XGBoost Behavioral Model Forecasts
          </h3>
          <p className="text-xs text-slate-500">Solid line = Actual history | Dotted line = ML Prediction</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          {['7D', '30D', '6M'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                range === r ? 'bg-white text-emerald-mint shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Predictive Graph */}
      <div className="h-60 w-full bg-white p-4 rounded-2xl border border-slate-200/80 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
            <YAxis stroke="#94A3B8" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '12px',
                color: '#FFF',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Usage (kWh)"
              stroke="#0F766E"
              strokeWidth={3}
              dot={{ r: 4, fill: '#0F766E' }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="XGBoost ML Forecast (kWh)"
              stroke="#059669"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#059669' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explainable AI Reasoner Panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border border-emerald-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-mint" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-forest-teal">
              Explainable AI Intelligence
            </span>
          </div>

          <button
            onClick={() => showToast('Exporting prediction data CSV...', 'info')}
            className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-emerald-mint"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          "On <span className="font-bold text-slate-900">Wednesday</span>, electricity consumption spiked by{' '}
          <span className="font-bold text-amber-sun">15.6%</span> due to thermal HVAC adjustment matching localized OpenWeather high temperature of 34°C. Swapping to smart thermostat schedule would offset 3.2 kg CO₂."
        </p>

        <button
          onClick={() => executeOmnibarCommand('why energy spike?')}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-forest-teal text-white text-xs font-bold shadow-sm hover:bg-emerald-mint transition-all"
        >
          <span>Ask Omnibar to Solve This Anomaly</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
