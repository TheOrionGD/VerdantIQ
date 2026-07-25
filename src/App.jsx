import React from 'react';
import { EcoSphereProvider, NODE_LAYOUT, useEcoSphere } from './context/EcoSphereContext';
import { SpatialCanvas } from './components/canvas/SpatialCanvas';
import { CanvasNodeCard } from './components/canvas/CanvasNodeCard';
import { GroqOmnibar } from './components/omnibar/GroqOmnibar';
import { DesktopView } from './components/views/DesktopView';
import { MobileView } from './components/views/MobileView';

// 12 System Nodes Components Import
import { OnboardingNode } from './components/nodes/OnboardingNode';
import { DashboardNode } from './components/nodes/DashboardNode';
import { TrackerNode } from './components/nodes/TrackerNode';
import { AnalyticsNode } from './components/nodes/AnalyticsNode';
import { DigitalTwinNode } from './components/nodes/DigitalTwinNode';
import { OptimizerNode } from './components/nodes/OptimizerNode';
import { ChallengesNode } from './components/nodes/ChallengesNode';
import { AssistantNode } from './components/nodes/AssistantNode';
import { CommunityNode } from './components/nodes/CommunityNode';
import { SettingsNode } from './components/nodes/SettingsNode';
import { InstitutionAdminNode } from './components/nodes/InstitutionAdminNode';
import { SystemAdminNode } from './components/nodes/SystemAdminNode';

const NODE_COMPONENTS = {
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

function MainAppContent() {
  const { viewMode } = useEcoSphere();

  if (viewMode === 'desktop') {
    return <DesktopView />;
  }

  if (viewMode === 'mobile') {
    return <MobileView />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-spatial-grid font-sans">
      {/* 2D Spatial Infinite Canvas View */}
      <SpatialCanvas>
        {Object.entries(NODE_LAYOUT).map(([key, config]) => {
          const NodeComponent = NODE_COMPONENTS[key];
          if (!NodeComponent) return null;

          return (
            <CanvasNodeCard
              key={config.id}
              id={config.id}
              title={config.title}
              category={config.category}
              width={config.w}
              height={config.h}
              x={config.x}
              y={config.y}
            >
              <NodeComponent />
            </CanvasNodeCard>
          );
        })}
      </SpatialCanvas>

      {/* Groq AI Central Floating Omnibar */}
      <GroqOmnibar />
    </div>
  );
}

export default function App() {
  return (
    <EcoSphereProvider>
      <MainAppContent />
    </EcoSphereProvider>
  );
}
