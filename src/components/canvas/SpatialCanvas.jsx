import React, { useState, useRef, useEffect } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ViewModeToggle } from '../common/ViewModeToggle';
import { ZoomIn, ZoomOut, RotateCcw, Compass, ArrowLeft, Leaf, Layers } from 'lucide-react';

export const SpatialCanvas = ({ children }) => {
  const { scale, setScale, pan, setPan, focusedNodeId, resetFocus, NODE_LAYOUT } = useEcoSphere();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mouse wheel zoom logic
  const handleWheel = (e) => {
    e.preventDefault();
    if (focusedNodeId) return; // Ignore wheel zoom when focused on a single card

    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setScale((prevScale) => Math.min(Math.max(0.35, prevScale * zoomFactor), 1.6));
  };

  // Mouse drag pan logic
  const handleMouseDown = (e) => {
    if (e.target.closest('.glass-node') || e.target.closest('.groq-omnibar')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (focusedNodeId && !e.target.closest('.rounded-3xl')) {
          resetFocus();
        }
      }}
      className={`w-screen h-screen overflow-hidden relative bg-spatial-grid select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Top Header Floating Glass Navigation & Status Bar */}
      <div className="fixed top-6 left-8 z-50 flex items-center space-x-4 pointer-events-auto">
        <div className="flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-mint to-forest-teal flex items-center justify-center shadow-md">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-deep-charcoal flex items-center gap-1.5">
              EcoSphere <span className="text-xs font-semibold text-emerald-mint px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">v2.4 Spatial</span>
            </h1>
            <p className="text-xs text-slate-gray">VerdantIQ Environmental Intelligence</p>
          </div>
        </div>

        {/* View Mode Switcher Toggle Pill */}
        <ViewModeToggle />

        {focusedNodeId && (
          <button
            onClick={resetFocus}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-mint/30 shadow-lg hover:bg-emerald-50 text-emerald-700 font-semibold text-xs transition-all animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-mint" />
            <span>Exit to Spatial Canvas</span>
          </button>
        )}
      </div>

      {/* Top Right Zoom Controls & Mini Map Indicator */}
      <div className="fixed top-6 right-8 z-50 flex items-center space-x-2 pointer-events-auto">
        <div className="flex items-center bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-1.5 shadow-lg space-x-1">
          <button
            onClick={() => setScale((s) => Math.min(1.6, s + 0.15))}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-mint hover:bg-slate-100 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="text-xs font-semibold text-slate-500 w-12 text-center">
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={() => setScale((s) => Math.max(0.35, s - 0.15))}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-mint hover:bg-slate-100 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button
            onClick={resetFocus}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-mint hover:bg-slate-100 transition-all"
            title="Reset Workspace View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Transform Layer */}
      <div
        className="w-full h-full relative origin-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
        }}
      >
        {/* Animated Data Pipeline Stream Connections (SVG Paths centered at 50% viewport) */}
        <svg
          className="absolute pointer-events-none z-0"
          style={{
            left: '50%',
            top: '50%',
            width: '1px',
            height: '1px',
            overflow: 'visible',
          }}
        >
          <defs>
            <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0F766E" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Stream 1: Onboarding -> Dashboard */}
          <path
            d="M -900 -450 C -450 -450, -450 0, 0 0"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            className="path-stream-animated"
          />

          {/* Stream 2: Tracker -> Analytics */}
          <path
            d="M -900 200 C -450 200, -450 -650, 0 -650"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            className="path-stream-animated"
          />

          {/* Stream 3: Analytics -> Optimizer */}
          <path
            d="M 0 -650 C 460 -650, 460 200, 920 200"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            className="path-stream-animated"
          />

          {/* Stream 4: Dashboard -> Digital Twin */}
          <path
            d="M 0 0 C 460 0, 460 -450, 920 -450"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            className="path-stream-animated"
          />

          {/* Stream 5: Digital Twin -> Optimizer */}
          <path
            d="M 920 -450 C 920 -100, 920 0, 920 200"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            className="path-stream-animated"
          />

          {/* Stream 6: Tracker -> Challenges */}
          <path
            d="M -900 200 C -900 500, -900 650, -900 840"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            className="path-stream-animated"
          />

          {/* Stream 7: Challenges -> Community */}
          <path
            d="M -900 840 C -100 840, 100 840, 920 840"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            className="path-stream-animated"
          />

          {/* Stream 8: Dashboard -> Assistant */}
          <path
            d="M 0 0 C 0 300, 0 450, 0 680"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            className="path-stream-animated"
          />

          {/* Stream 9: Settings -> Onboarding */}
          <path
            d="M -900 -1050 C -900 -850, -900 -650, -900 -450"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3"
            className="path-stream-animated"
          />

          {/* Stream 10: Admin Sys -> Digital Twin */}
          <path
            d="M 920 -1050 C 920 -850, 920 -650, 920 -450"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3"
            className="path-stream-animated"
          />

          {/* Stream 11: Analytics -> Admin Inst */}
          <path
            d="M 0 -650 C 0 -900, 0 -1100, 0 -1280"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3"
            className="path-stream-animated"
          />

          {/* Node Connection Points (Glowing Dots) */}
          {[
            { x: 0, y: 0 },
            { x: -900, y: -450 },
            { x: -900, y: 200 },
            { x: 0, y: -650 },
            { x: 920, y: -450 },
            { x: 920, y: 200 },
            { x: -900, y: 840 },
            { x: 0, y: 680 },
            { x: 920, y: 840 },
            { x: -900, y: -1050 },
            { x: 0, y: -1280 },
            { x: 920, y: -1050 },
          ].map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r="6"
              fill="#059669"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Floating Cards (Workspace Nodes) */}
        {children}
      </div>
    </div>
  );
};
