import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { EcoSphereProvider, NODE_LAYOUT, useEcoSphere } from './context/EcoSphereContext';
import { SpatialCanvas } from './components/canvas/SpatialCanvas';
import { CanvasNodeCard } from './components/canvas/CanvasNodeCard';
import { GroqOmnibar } from './components/omnibar/GroqOmnibar';
import { DesktopView } from './components/views/DesktopView';
import { MobileView } from './components/views/MobileView';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ViewModeToggle } from './components/common/ViewModeToggle';
import { ROLES, ROLE_DETAILS, ROLE_SPATIAL_NODES } from './config/rbacConfig';
import { LogOut, Shield } from 'lucide-react';

// Auth Page
import { LoginPage } from './pages/auth/LoginPage';

// Standard User Pages
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { DigitalTwinLabPage } from './pages/user/DigitalTwinLabPage';
import { OptimizationPredictionsPage } from './pages/user/OptimizationPredictionsPage';
import { AIChatAssistantPage } from './pages/user/AIChatAssistantPage';
import { CommunityChallengesPage } from './pages/user/CommunityChallengesPage';

// Institution Admin Pages
import { InstitutionalDashboardPage } from './pages/institution/InstitutionalDashboardPage';
import { MemberGroupManagementPage } from './pages/institution/MemberGroupManagementPage';
import { CampusChallengeBuilderPage } from './pages/institution/CampusChallengeBuilderPage';
import { SubmissionVerificationDeskPage } from './pages/institution/SubmissionVerificationDeskPage';

// System Admin Pages
import { GlobalSettingsConfigPage } from './pages/admin/GlobalSettingsConfigPage';
import { MLModelTelemetryPage } from './pages/admin/MLModelTelemetryPage';
import { DatabaseStorageManagementPage } from './pages/admin/DatabaseStorageManagementPage';
import { GlobalAuditLogsPage } from './pages/admin/GlobalAuditLogsPage';

// Spatial Node Components
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

function SpatialCanvasView() {
  const { userRole } = useEcoSphere();
  const allowedSpatialNodes = ROLE_SPATIAL_NODES[userRole] || Object.keys(NODE_LAYOUT);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-spatial-grid font-sans">
      {/* 2D Spatial Canvas - Filtered by Active Role */}
      <SpatialCanvas>
        {Object.entries(NODE_LAYOUT).map(([key, config]) => {
          const NodeComponent = NODE_COMPONENTS[key];
          if (!NodeComponent) return null;

          const isNodeAllowed = allowedSpatialNodes.includes(key);
          if (!isNodeAllowed) return null;

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

      {/* Groq Central Floating Omnibar */}
      <GroqOmnibar />
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated, userRole } = useEcoSphere();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const defaultRoute = ROLE_DETAILS[userRole]?.defaultRoute || '/user/dashboard';
  return <Navigate to={defaultRoute} replace />;
}

function MainAppContent() {
  const { viewMode, isAuthenticated } = useEcoSphere();
  const location = useLocation();

  if (location.pathname === '/login') {
    if (isAuthenticated) {
      return <RootRedirect />;
    }
    return <LoginPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (viewMode === 'spatial') {
    return <SpatialCanvasView />;
  }

  const ViewWrapper = viewMode === 'mobile' ? MobileView : DesktopView;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RootRedirect />} />

      <Route element={<ViewWrapper />}>
        {/* Standard User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/digital-twin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <DigitalTwinLabPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/optimization"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <OptimizationPredictionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/assistant"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <AIChatAssistantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/community"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <CommunityChallengesPage />
            </ProtectedRoute>
          }
        />

        {/* Institution Admin Routes */}
        <Route
          path="/institution/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.INSTITUTION_ADMIN]}>
              <InstitutionalDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institution/members"
          element={
            <ProtectedRoute allowedRoles={[ROLES.INSTITUTION_ADMIN]}>
              <MemberGroupManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institution/challenges"
          element={
            <ProtectedRoute allowedRoles={[ROLES.INSTITUTION_ADMIN]}>
              <CampusChallengeBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institution/verify"
          element={
            <ProtectedRoute allowedRoles={[ROLES.INSTITUTION_ADMIN]}>
              <SubmissionVerificationDeskPage />
            </ProtectedRoute>
          }
        />

        {/* System Admin Routes */}
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
              <GlobalSettingsConfigPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/telemetry"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
              <MLModelTelemetryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/database"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
              <DatabaseStorageManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audits"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
              <GlobalAuditLogsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <EcoSphereProvider>
      <BrowserRouter>
        <MainAppContent />
      </BrowserRouter>
    </EcoSphereProvider>
  );
}
