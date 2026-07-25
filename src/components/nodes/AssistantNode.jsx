import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { MessageSquare, Sparkles, Send, Download, HelpCircle } from 'lucide-react';

export const AssistantNode = () => {
  const { showToast } = useEcoSphere();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your Groq-powered Environmental Decision Assistant. Ask me about recycling, footprint predictions, or sustainability optimization strategies!' },
    { id: 2, sender: 'user', text: 'Compare bicycle vs train commute footprint for 20km.' },
    { id: 3, sender: 'ai', text: '🚲 Bicycle: 0 kg CO₂ | 🚆 Train: 0.28 kg CO₂ | 🚗 Gasoline Car: 4.2 kg CO₂. Choosing a bicycle saves 4.2 kg CO₂ daily!' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Groq AI Recommendation: Based on your current 68 Eco-Score, optimizing your water heating schedule will yield an immediate 8% footprint reduction.`,
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const handleChip = (queryText) => {
    setInput(queryText);
  };

  return (
    <div className="flex flex-col h-[400px] justify-between space-y-4">
      {/* Scrollable Message History */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3.5 rounded-2xl max-w-sm text-xs font-medium leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-forest-teal text-white rounded-br-none shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Chips */}
      <div className="flex space-x-2 overflow-x-auto py-1">
        <button
          onClick={() => handleChip('Which plastics can I recycle?')}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-600 hover:text-emerald-mint text-[11px] font-medium whitespace-nowrap"
        >
          ♻️ Which plastics recycle?
        </button>
        <button
          onClick={() => handleChip('Compare solar array ROI')}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-600 hover:text-emerald-mint text-[11px] font-medium whitespace-nowrap"
        >
          ☀️ Solar array ROI
        </button>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Groq Environmental Decision Assistant..."
          className="flex-1 p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-mint"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-3 rounded-xl bg-emerald-mint text-white disabled:opacity-40 hover:bg-forest-teal transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
