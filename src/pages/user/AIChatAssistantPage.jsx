import React from 'react';
import { AssistantNode } from '../../components/nodes/AssistantNode';
import { MessageSquare, Sparkles, Bot } from 'lucide-react';

export const AIChatAssistantPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-mint via-forest-teal to-slate-900 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-emerald-100">
            Groq Llama-3-70B Powered
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">Sustainability AI Assistant</h2>
          <p className="text-xs text-emerald-100 max-w-xl mt-1">
            Ask complex questions regarding energy tariff optimization, rebate filings, HVAC tuning, or carbon accounting math.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Bot className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
        <AssistantNode />
      </div>
    </div>
  );
};
