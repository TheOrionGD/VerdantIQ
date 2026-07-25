import React, { useState, useRef } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { ViewModeToggle } from '../common/ViewModeToggle';
import { ROLE_DETAILS, ROLES } from '../../config/rbacConfig';
import { ZoomIn, ZoomOut, RotateCcw, ArrowLeft, Leaf, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SpatialCanvas = ({ children }) => {
  const { scale, setScale, pan, setPan, focusedNodeId, resetFocus, userRole, currentUser, logout } = useEcoSphere();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const currentRoleObj = ROLE_DETAILS[userRole] || ROLE_DETAILS[ROLES.USER];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Mouse wheel zoom logic
  const handleWheel = (e) => {
    e.preventDefault();
    if (focusedNodeId) return;

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
      {/* Top Left Branding & Active Role Badge */}
      <div className="fixed top-4 left-6 z-50 flex items-center space-x-3 pointer-events-auto">
        <div className="flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-mint to-forest-teal flex items-center justify-center shadow-md shrink-0">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 leading-tight">
              EcoSphere
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${currentRoleObj.badgeClass}`}>
                {currentRoleObj.label}
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold">{currentRoleObj.canvasTitle || 'Spatial Intelligence Canvas'}</p>
          </div>
        </div>

        {focusedNodeId && (
          <button
            onClick={resetFocus}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-mint/40 shadow-lg hover:bg-emerald-50 text-emerald-700 font-bold text-xs transition-all animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-mint" />
            <span>Exit Focus</span>
          </button>
        )}
      </div>

      {/* Top Center View Mode Switcher */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto hidden md:block">
        <ViewModeToggle />
      </div>

      {/* Top Right Zoom Controls & User Profile */}
      <div className="fixed top-4 right-6 z-50 flex items-center space-x-3 pointer-events-auto">
        {/* Zoom Controls */}
        <div className="flex items-center bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-1 shadow-lg space-x-1">
          <button
            onClick={() => setScale((s) => Math.min(1.6, s + 0.15))}
            className="p-1.5 rounded-xl text-slate-600 hover:text-emerald-mint hover:bg-slate-100 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="text-xs font-bold text-slate-600 w-10 text-center font-mono">
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={() => setScale((s) => Math.max(0.35, s - 0.15))}
            className="p-1.5 rounded-xl text-slate-600 hover:text-emerald-mint hover:bg-slate-100 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-0.5" />
          <button
            onClick={resetFocus}
            className="p-1.5 rounded-xl text-slate-600 hover:text-emerald-mint hover:bg-slate-100 transition-all"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg">
          <div
            className="w-6 h-6 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: currentRoleObj.color }}
          >
            {currentUser?.avatar || 'US'}
          </div>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline">{currentUser?.name || 'User'}</span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-1 px-3 py-2 rounded-2xl bg-white/90 hover:bg-rose-50 backdrop-blur-md border border-rose-200 text-rose-600 text-xs font-bold transition-all shadow-lg"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      {/* Main Canvas Transform Layer */}
      <div
        className="w-full h-full relative origin-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
