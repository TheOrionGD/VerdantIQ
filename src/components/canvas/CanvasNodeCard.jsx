import React from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { Maximize2, Minimize2, ExternalLink } from 'lucide-react';

export const CanvasNodeCard = ({ id, title, category, children, width, height, x, y }) => {
  const { focusedNodeId, focusNode, resetFocus, pulsingNodeId } = useEcoSphere();

  const isFocused = focusedNodeId === id;
  const isAnyFocused = focusedNodeId !== null;
  const isPulsing = pulsingNodeId === id;

  const style = {
    position: 'absolute',
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    width: width ? `${width}px` : '600px',
    height: height ? `${height}px` : 'auto',
    transform: 'translate(-50%, -50%)',
    zIndex: isFocused ? 50 : 10,
  };

  return (
    <div
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        if (!isFocused) focusNode(id);
      }}
      className={`rounded-3xl transition-all duration-500 ease-out select-none cursor-pointer flex flex-col overflow-hidden ${
        isFocused
          ? 'bg-white shadow-[0_25px_60px_-15px_rgba(5,150,105,0.25)] ring-2 ring-emerald-500/40 opacity-100 scale-[1.02]'
          : isAnyFocused
          ? 'opacity-20 blur-[2px] pointer-events-none scale-95'
          : 'glass-node hover:shadow-2xl hover:-translate-y-1 opacity-100'
      } ${isPulsing ? 'ring-4 ring-emerald-mint ring-offset-4 animate-pulse-subtle' : ''}`}
    >
      {/* Header Bar matching Image 2 */}
      <div className="px-7 py-5 bg-transparent border-b border-slate-100/90 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-mint shadow-sm animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-forest-teal px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200/50">
            {category}
          </span>
          <h2 className="font-extrabold text-slate-900 text-xl tracking-tight flex items-center gap-2">
            {title}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {isFocused ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetFocus();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
              title="Zoom out to Spatial Canvas"
            >
              <Minimize2 className="w-4 h-4 text-slate-600" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                focusNode(id);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-mint hover:bg-emerald-50 transition-all"
              title="Focus & Zoom Node"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Node Content Body */}
      <div className="p-7 flex-1 overflow-y-auto overflow-x-hidden relative bg-white">
        {children}
      </div>
    </div>
  );
};
