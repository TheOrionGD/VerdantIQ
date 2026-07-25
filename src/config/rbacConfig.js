import {
  User, Building2, ShieldAlert, LayoutDashboard, Activity, Home, Cpu, MessageSquare,
  Users, Award, ShieldCheck, FileCheck, Settings, ActivitySquare, Database, ScrollText, Sparkles
} from 'lucide-react';

export const ROLES = {
  USER: 'user',
  INSTITUTION_ADMIN: 'institution_admin',
  SYSTEM_ADMIN: 'system_admin',
};

export const DEFAULT_USERS = {
  [ROLES.USER]: {
    name: 'Alex Rivera',
    email: 'alex.rivera@ecosphere.io',
    role: ROLES.USER,
    avatar: 'AR',
    title: 'Sustainability Champion',
    institution: 'Green Household Sector 4',
  },
  [ROLES.INSTITUTION_ADMIN]: {
    name: 'Dr. Aris Thorne',
    email: 'a.thorne@campus.edu',
    role: ROLES.INSTITUTION_ADMIN,
    avatar: 'AT',
    title: 'Campus Sustainability Director',
    institution: 'Green Horizon University',
  },
  [ROLES.SYSTEM_ADMIN]: {
    name: 'Elena Rostova',
    email: 'e.rostova@admin.ecosphere.io',
    role: ROLES.SYSTEM_ADMIN,
    avatar: 'ER',
    title: 'Global System Administrator',
    institution: 'EcoSphere Core Infrastructure',
  },
};

export const ROLE_DETAILS = {
  [ROLES.USER]: {
    id: ROLES.USER,
    label: 'Standard User',
    targetAudience: 'Individuals & Households',
    purpose: 'Log resource usage, track sustainability metrics, configure digital twins, receive ML recommendations, and join challenges.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    color: '#10b981',
    canvasTitle: 'Personal Sustainability Canvas',
    icon: User,
    defaultRoute: '/user/dashboard',
  },
  [ROLES.INSTITUTION_ADMIN]: {
    id: ROLES.INSTITUTION_ADMIN,
    label: 'Institution Admin',
    targetAudience: 'Campus, Corporate & Society Representatives',
    purpose: 'Manage institutional metrics, oversee multi-tenant member data, build campus challenges, and audit submissions.',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    color: '#0284c7',
    canvasTitle: 'Campus Multi-Tenant Canvas',
    icon: Building2,
    defaultRoute: '/institution/dashboard',
  },
  [ROLES.SYSTEM_ADMIN]: {
    id: ROLES.SYSTEM_ADMIN,
    label: 'System Admin',
    targetAudience: 'Global Platform Administrators & Operators',
    purpose: 'Maintain platform integrity, monitor microservice health, tune ML parameters, and audit security logs.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    color: '#9333ea',
    canvasTitle: 'Platform Telemetry & MLOps Canvas',
    icon: ShieldAlert,
    defaultRoute: '/admin/settings',
  },
};

export const ROLE_NAVIGATION = {
  [ROLES.USER]: [
    {
      id: 'user-dashboard',
      path: '/user/dashboard',
      label: 'Personal Dashboard & Trackers',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      category: 'Personal Hub',
      nodeId: 'dashboard',
    },
    {
      id: 'user-digital-twin',
      path: '/user/digital-twin',
      label: 'Digital Twin Lab',
      shortLabel: 'Digital Twin',
      icon: Home,
      category: 'Simulation',
      nodeId: 'digitalTwin',
    },
    {
      id: 'user-optimization',
      path: '/user/optimization',
      label: 'Optimization & Predictions',
      shortLabel: 'Optimization',
      icon: Cpu,
      category: 'Intelligence',
      nodeId: 'optimizer',
    },
    {
      id: 'user-assistant',
      path: '/user/assistant',
      label: 'AI Chat Assistant',
      shortLabel: 'AI Assistant',
      icon: MessageSquare,
      category: 'Decision AI',
      nodeId: 'assistant',
    },
    {
      id: 'user-community',
      path: '/user/community',
      label: 'Community Portal & Challenges',
      shortLabel: 'Community',
      icon: Award,
      category: 'Gamification',
      nodeId: 'challenges',
    },
  ],
  [ROLES.INSTITUTION_ADMIN]: [
    {
      id: 'inst-dashboard',
      path: '/institution/dashboard',
      label: 'Institutional Dashboard',
      shortLabel: 'Overview',
      icon: Building2,
      category: 'Campus Analytics',
      nodeId: 'adminInst',
    },
    {
      id: 'inst-members',
      path: '/institution/members',
      label: 'Member & Group Management',
      shortLabel: 'Members',
      icon: Users,
      category: 'Multi-Tenant Governance',
      nodeId: 'community',
    },
    {
      id: 'inst-challenges',
      path: '/institution/challenges',
      label: 'Campus Challenge Builder',
      shortLabel: 'Challenge Builder',
      icon: ShieldCheck,
      category: 'Engagement',
      nodeId: 'challenges',
    },
    {
      id: 'inst-verify',
      path: '/institution/verify',
      label: 'Submission Verification Desk',
      shortLabel: 'Verification Desk',
      icon: FileCheck,
      category: 'Audit & Review',
      nodeId: 'adminInst',
    },
  ],
  [ROLES.SYSTEM_ADMIN]: [
    {
      id: 'sys-settings',
      path: '/admin/settings',
      label: 'Global Settings & Config',
      shortLabel: 'Global Settings',
      icon: Settings,
      category: 'Configuration',
      nodeId: 'settings',
    },
    {
      id: 'sys-telemetry',
      path: '/admin/telemetry',
      label: 'ML Model & System Telemetry',
      shortLabel: 'ML Telemetry',
      icon: ActivitySquare,
      category: 'Microservices Health',
      nodeId: 'adminSys',
    },
    {
      id: 'sys-database',
      path: '/admin/database',
      label: 'Database & Storage Desk',
      shortLabel: 'Database & PostGIS',
      icon: Database,
      category: 'Data Infrastructure',
      nodeId: 'adminSys',
    },
    {
      id: 'sys-audits',
      path: '/admin/audits',
      label: 'Global Security Audit Logs',
      shortLabel: 'Audit Logs',
      icon: ScrollText,
      category: 'Security & Compliance',
      nodeId: 'adminSys',
    },
  ],
};

// Map spatial nodes to strict role visibility
export const ROLE_SPATIAL_NODES = {
  [ROLES.USER]: ['dashboard', 'onboarding', 'tracker', 'analytics', 'digitalTwin', 'optimizer', 'challenges', 'assistant', 'community', 'settings'],
  [ROLES.INSTITUTION_ADMIN]: ['adminInst', 'community', 'challenges', 'analytics', 'dashboard'],
  [ROLES.SYSTEM_ADMIN]: ['adminSys', 'settings', 'analytics', 'optimizer', 'adminInst'],
};

export const isRouteAllowed = (role, path) => {
  if (role === ROLES.SYSTEM_ADMIN) return true;
  if (path.startsWith('/user') && role === ROLES.USER) return true;
  if (path.startsWith('/institution') && (role === ROLES.INSTITUTION_ADMIN || role === ROLES.SYSTEM_ADMIN)) return true;
  return false;
};
