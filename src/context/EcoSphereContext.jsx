import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const EcoSphereContext = createContext();

// Node Canvas Definitions (Coordinates & Metadata for the 12 spatial cards)
export const NODE_LAYOUT = {
  dashboard: { id: 'dashboard', title: 'Personal Dashboard', category: 'Core Hub', x: 0, y: 0, w: 760, h: 560 },
  onboarding: { id: 'onboarding', title: 'Onboarding & Profiling', category: 'Setup', x: -900, y: -450, w: 560, h: 540 },
  tracker: { id: 'tracker', title: 'Daily Activity Tracker', category: 'Logging', x: -900, y: 200, w: 720, h: 560 },
  analytics: { id: 'analytics', title: 'Predictions & Analytics', category: 'Intelligence', x: 0, y: -650, w: 820, h: 560 },
  digitalTwin: { id: 'digitalTwin', title: 'Digital Twin Simulation', category: 'Simulation', x: 920, y: -450, w: 900, h: 580 },
  optimizer: { id: 'optimizer', title: 'Optimization Engine', category: 'Solver', x: 920, y: 200, w: 780, h: 560 },
  challenges: { id: 'challenges', title: 'Eco Challenges & Verification', category: 'Community', x: -900, y: 840, w: 800, h: 560 },
  assistant: { id: 'assistant', title: 'Groq AI Assistant', category: 'Decision AI', x: 0, y: 680, w: 680, h: 540 },
  community: { id: 'community', title: 'Community Portal', category: 'Institutional', x: 920, y: 840, w: 780, h: 560 },
  settings: { id: 'settings', title: 'Reports & Settings', category: 'User Desk', x: -900, y: -1050, w: 620, h: 520 },
  adminInst: { id: 'adminInst', title: 'Campus Admin Portal', category: 'Admin', x: 0, y: -1280, w: 880, h: 540 },
  adminSys: { id: 'adminSys', title: 'System Admin Console', category: 'Telemetry', x: 920, y: -1050, w: 920, h: 540 },
};

export const EcoSphereProvider = ({ children }) => {
  // View Mode State: 'spatial' | 'desktop' | 'mobile'
  const [viewMode, setViewMode] = useState('spatial');
  const [activeDesktopPage, setActiveDesktopPage] = useState('dashboard');

  // Spatial Canvas Transform State (Default 35% matching Spatial Bird's Eye Canvas View)
  const [scale, setScale] = useState(0.35);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [focusedNodeId, setFocusedNodeId] = useState(null);

  // User Sustainability Stats & Gamification
  const [ecoScore, setEcoScore] = useState(68);
  const [weeklyPoints, setWeeklyPoints] = useState(450);
  const [co2SavedKg, setCo2SavedKg] = useState(184.2);
  const [waterSavedGal, setWaterSavedGal] = useState(340);
  const [treesPlanted, setTreesPlanted] = useState(12);

  // Pulse effect indicator state for omnibar activity triggers
  const [pulsingNodeId, setPulsingNodeId] = useState(null);

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, type: 'Transport', detail: 'Electric Bus Commute', distance: '12 km', impact: '-2.4 kg CO₂', time: 'Today, 09:15 AM' },
    { id: 2, type: 'Electricity', detail: 'Solar Array Charging', distance: '8.5 kWh', impact: '-3.8 kg CO₂', time: 'Today, 11:30 AM' },
    { id: 3, type: 'Waste', detail: 'Organic Composting', distance: '3.2 kg', impact: '-1.1 kg CO₂', time: 'Yesterday' },
  ]);

  // Risk Alerts Feed
  const [alerts, setAlerts] = useState([
    { id: 'a1', title: 'Electricity Usage Spike', desc: 'Air conditioning draw increased by 18% during peak hours.', severity: 'amber' },
    { id: 'a2', title: 'Water Goal Warning', desc: 'Weekly target threshold exceeded by 40 gallons.', severity: 'amber' },
    { id: 'a3', title: 'Commute Pattern Shift', desc: '3 private vehicle trips logged this week.', severity: 'info' }
  ]);

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Alert dismissed');
  };

  // Digital Twin Active Upgrades
  const [twinUpgrades, setTwinUpgrades] = useState([
    { id: 'led', name: 'LED Conversion', category: 'Lighting', cost: 40, co2Offset: 12, status: 'active' },
    { id: 'solar', name: '5kW Rooftop Solar Array', category: 'Energy', cost: 1200, co2Offset: 140, status: 'simulated' },
  ]);

  const toggleTwinUpgrade = (upgrade) => {
    if (twinUpgrades.some(u => u.id === upgrade.id)) {
      setTwinUpgrades(prev => prev.filter(u => u.id !== upgrade.id));
      showToast(`Removed ${upgrade.name} from Digital Twin`);
    } else {
      setTwinUpgrades(prev => [...prev, upgrade]);
      showToast(`Added ${upgrade.name} to Digital Twin Simulation`);
    }
  };

  // Active Eco Challenges
  const [challenges, setChallenges] = useState([
    { id: 'c1', title: 'Commute Green 5 Days', category: 'Transport', points: 150, joined: true, progress: 60, status: 'In Progress' },
    { id: 'c2', title: 'Zero Waste Weekend', category: 'Waste', points: 200, joined: false, progress: 0, status: 'Available' },
    { id: 'c3', title: 'Plant a Native Sapling', category: 'Biodiversity', points: 300, joined: true, progress: 100, status: 'Under Review' },
  ]);

  const toggleChallenge = (id) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const joined = !c.joined;
        showToast(joined ? `Joined challenge: ${c.title}` : `Opted out of ${c.title}`);
        return { ...c, joined, progress: joined ? 10 : 0 };
      }
      return c;
    }));
  };

  // Omnibar Execution Engine
  const executeOmnibarCommand = (input) => {
    const text = input.toLowerCase().trim();

    if (!text) return;

    // Navigation Commands
    if (text.includes('twin') || text.includes('digital twin') || text.includes('house')) {
      focusNode('digitalTwin');
      showToast('Navigated to Household Digital Twin Node');
      return;
    }
    if (text.includes('dash') || text.includes('home') || text.includes('main')) {
      focusNode('dashboard');
      showToast('Centered Personal Dashboard');
      return;
    }
    if (text.includes('tracker') || text.includes('log') && (text.includes('page') || text.includes('go'))) {
      focusNode('tracker');
      showToast('Navigated to Daily Activity Tracker');
      return;
    }
    if (text.includes('predict') || text.includes('analytics') || text.includes('forecast')) {
      focusNode('analytics');
      showToast('Navigated to Analytics & Forecasts');
      return;
    }
    if (text.includes('optimiz') || text.includes('solver') || text.includes('budget')) {
      focusNode('optimizer');
      showToast('Navigated to Optimization Engine');
      return;
    }
    if (text.includes('challenge') || text.includes('leaderboard') || text.includes('qr')) {
      focusNode('challenges');
      showToast('Navigated to Eco Challenges & Verification Desk');
      return;
    }
    if (text.includes('admin') || text.includes('telemetry') || text.includes('retrain')) {
      focusNode('adminSys');
      showToast('Navigated to System Admin Telemetry Console');
      return;
    }

    // Direct Quick Log Action via Omnibar
    if (text.includes('log') || text.includes('walk') || text.includes('bus') || text.includes('kwh') || text.includes('mile')) {
      setPulsingNodeId('tracker');
      setTimeout(() => setPulsingNodeId(null), 2500);

      const newLog = {
        id: Date.now(),
        type: text.includes('bus') || text.includes('walk') || text.includes('mile') ? 'Transport' : 'Electricity',
        detail: input,
        distance: 'Direct Omnibar Entry',
        impact: '-1.8 kg CO₂',
        time: 'Just now'
      };
      setActivityLogs(prev => [newLog, ...prev]);
      setWeeklyPoints(prev => prev + 25);
      setEcoScore(prev => Math.min(100, prev + 1));
      showToast('Log recorded via Groq AI Omnibar! +25 Points Earned 🎉', 'success');
      return;
    }

    // Questioning / Explainability Command
    if (text.includes('why') || text.includes('spike') || text.includes('explain') || text.includes('how')) {
      focusNode('analytics');
      showToast('Analyzing consumption anomaly in Explainable AI module...', 'info');
      return;
    }

    // Default Assistant Fallback
    focusNode('assistant');
    showToast(`Groq AI Assistant responding to: "${input}"`);
  };

  // Center & Focus Node Navigation
  const focusNode = (nodeId) => {
    const node = NODE_LAYOUT[nodeId];
    if (!node) return;

    setFocusedNodeId(nodeId);
    setScale(1.15); // Zoom to 115% for crisp focused node view matching Image 2
    setPan({
      x: -node.x,
      y: -node.y,
    });
  };

  const resetFocus = () => {
    setFocusedNodeId(null);
    setScale(0.35); // Return to 35% spatial bird's eye view matching Image 1
    setPan({ x: 0, y: 0 });
  };

  return (
    <EcoSphereContext.Provider
      value={{
        apiService,
        viewMode,
        setViewMode,
        activeDesktopPage,
        setActiveDesktopPage,
        scale,
        setScale,
        pan,
        setPan,
        focusedNodeId,
        focusNode,
        resetFocus,
        NODE_LAYOUT,
        ecoScore,
        setEcoScore,
        weeklyPoints,
        co2SavedKg,
        waterSavedGal,
        treesPlanted,
        activityLogs,
        alerts,
        dismissAlert,
        twinUpgrades,
        toggleTwinUpgrade,
        challenges,
        toggleChallenge,
        executeOmnibarCommand,
        pulsingNodeId,
        toast,
        showToast,
      }}
    >
      {children}
    </EcoSphereContext.Provider>
  );
};

export const useEcoSphere = () => useContext(EcoSphereContext);
