import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Search, Mic, Sparkles, Send, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const GroqOmnibar = () => {
  const { executeOmnibarCommand, toast } = useEcoSphere();
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    executeOmnibarCommand(query);
    setQuery('');
  };

  const handleChipClick = (text) => {
    setQuery(text);
    executeOmnibarCommand(text);
  };

  const toggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      setQuery('Listening: "log 10 km bike commute"...');
      setTimeout(() => {
        setIsRecording(false);
        executeOmnibarCommand('log 10 km bike commute');
        setQuery('');
      }, 2500);
    } else {
      setIsRecording(false);
      setQuery('');
    }
  };

  return (
    <div className="groq-omnibar fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-auto">
      {/* Toast Notification Alert Overlay */}
      {toast && (
        <div className="mb-3 mx-auto w-fit flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-medium shadow-2xl animate-bounce">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-mint" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
          {toast.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-sun" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Omnibar Container */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full p-2.5 shadow-2xl flex items-center space-x-3 transition-all hover:border-emerald-mint/50 focus-within:border-emerald-mint focus-within:ring-4 focus-within:ring-emerald-mint/10">
        {/* Groq AI Badge */}
        <div className="flex items-center space-x-2 pl-3 pr-2 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-mint animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-teal flex items-center gap-1">
            Groq <Sparkles className="w-3 h-3 text-emerald-mint" />
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search, navigate ('go to Twin Lab'), or log ('log 5 miles walk')..."
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none px-2"
          />

          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 rounded-full transition-all ${
              isRecording
                ? 'bg-crimson-red text-white animate-pulse'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Simulate Voice Command"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!query.trim()}
            className="p-2.5 rounded-full bg-emerald-mint text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-teal transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="mt-2.5 flex items-center justify-center space-x-2 overflow-x-auto py-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick:</span>
        <button
          onClick={() => handleChipClick('go to Twin Lab')}
          className="px-3 py-1 rounded-full bg-white/80 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-forest-teal transition-all font-medium"
        >
          ⚡ Go to Twin Lab
        </button>
        <button
          onClick={() => handleChipClick('log 5 miles walk')}
          className="px-3 py-1 rounded-full bg-white/80 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-forest-teal transition-all font-medium"
        >
          🚶 Log 5 miles walk
        </button>
        <button
          onClick={() => handleChipClick('why energy spike?')}
          className="px-3 py-1 rounded-full bg-white/80 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-forest-teal transition-all font-medium"
        >
          ❓ Why energy spike?
        </button>
        <button
          onClick={() => handleChipClick('optimize my footprint')}
          className="px-3 py-1 rounded-full bg-white/80 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-forest-teal transition-all font-medium"
        >
          🎯 Optimize Footprint
        </button>
      </div>
    </div>
  );
};
