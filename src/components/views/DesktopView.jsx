import React from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ViewModeToggle } from '../common/ViewModeToggle';
import {
  Leaf, LayoutDashboard, Compass, Activity, BrainCircuit, Home, Cpu, Award,
  MessageSquare, Users, FileText, ShieldCheck, Settings, Bell, Sparkles, LogOut, ChevronRight
} from 'lucide-react';

// Modules imports
import { DashboardNode } from '../nodes/DashboardNode';
import { OnboardingNode } from '../nodes/OnboardingNode';
import { TrackerNode } from '../nodes/TrackerNode';
import { AnalyticsNode } from '../nodes/AnalyticsNode';
import { DigitalTwinNode } from '../nodes/DigitalTwinNode';
import { OptimizerNode } from '../nodes/OptimizerNode';
import { ChallengesNode } from '../nodes/ChallengesNode';
import { AssistantNode } from '../nodes/AssistantNode';
import { CommunityNode } from '../nodes/CommunityNode';
import { SettingsNode } from '../nodes/SettingsNode';
import { InstitutionAdminNode } from '../nodes/InstitutionAdminNode';
import { SystemAdminNode } from '../nodes/SystemAdminNode';

const DESKTOP_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Core' },
  { id: 'onboarding', label: 'Profiling Wizard', icon: Compass, category: 'Setup' },
  { id: 'tracker', label: 'Activity Tracker', icon: Activity, category: 'Logging' },
  { id: 'analytics', label: 'Predictions & ML', icon: BrainCircuit, category: 'Intelligence' },
  { id: 'digitalTwin', label: 'Digital Twin Lab', icon: Home, category: 'Simulation' },
  { id: 'optimizer', label: 'MILP Optimizer', icon: Cpu, category: 'Solver' },
  { id: 'challenges', label: 'Eco Challenges', icon: Award, category: 'Community' },
  { id: 'assistant', label: 'Groq AI Assistant', icon: MessageSquare, category: 'AI' },
  { id: 'community', label: 'Institutional Portal', icon: Users, category: 'Campus' },
  { id: 'settings', label: 'Reports & Settings', icon: FileText, category: 'User' },
  { id: 'adminInst', label: 'Campus Admin', icon: ShieldCheck, category: 'Admin' },
  { id: 'adminSys', label: 'System Telemetry', icon: Settings, category: 'Admin' },
];

const DESKTOP_COMPONENTS = {
  dashboard: DashboardNode,
  onboarding: OnboardingNode,
  tracker: TrackerNode,
  analytics: AnalyticsNode,
  digitalTwin: DigitalTwinNode,
  optimizer: OptimizerNode,
  challenges: ChallengesNode,
  assistant: AssistantNode,
  community: CommunityNode,
  settings: SettingsNode,
  adminInst: InstitutionAdminNode,
  adminSys: SystemAdminNode,
};

export const DesktopView = () => {
  const { activeDesktopPage, setActiveDesktopPage, ecoScore, weeklyPoints } = useEcoSphere();

  const ActiveComponent = DESKTOP_COMPONENTS[activeDesktopPage] || DashboardNode;
  const currentNav = DESKTOP_NAV_ITEMS.find((n) => n.id === activeDesktopPage);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-50 flex flex-col font-sans select-none">
      {/* Executive Top Header Bar */}
      <header className="h-16 px-6 bg-white border-b border-slate-200/90 flex items-center justify-between z-30 shadow-sm">
        {/* Left Logo Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-mint to-forest-teal flex items-center justify-center shadow-md">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-deep-charcoal tracking-tight flex items-center gap-2">
              EcoSphere <span className="text-xs font-bold text-emerald-mint px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">Desktop v2.4</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">VerdantIQ Sustainability Intelligence</p>
          </div>
        </div>

        {/* Center Mode Switcher Toggle Pill */}
        <ViewModeToggle />

        {/* Right Status Badges & Avatar */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-mint animate-pulse" />
            <span>AQI: 42 (Good)</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-mint" />
            <span>Score: {ecoScore}/100</span>
          </div>

          <div className="w-9 h-9 rounded-xl bg-forest-teal text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AR
          </div>
        </div>
      </header>

      {/* Main Desktop Container (Sidebar + Content Workspace) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              System Modules
            </div>

            {DESKTOP_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeDesktopPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveDesktopPage(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-mint text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <div className="text-xs font-bold text-forest-teal">Weekly Rewards</div>
            <div className="text-lg font-black text-slate-800">{weeklyPoints} PTS</div>
          </div>
        </aside>

        {/* Right Main Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/80">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Workspace Page Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-forest-teal px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200">
                  {currentNav?.category} Module
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                  {currentNav?.label}
                </h2>
              </div>
            </div>

            {/* Render Selected Module Component */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg">
              <ActiveComponent />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
