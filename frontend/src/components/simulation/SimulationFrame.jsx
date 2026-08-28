"use client";
import { useRef } from "react";

export default function SimulationFrame({ simulation, loading }) {
  const iframeRef = useRef(null);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0f1129]/50 border border-white/[0.06] rounded-2xl min-h-[60vh]">
        <div className="w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 animate-pulse">Generating simulation...</p>
        <p className="text-xs text-slate-600 mt-1">This may take a few seconds</p>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0f1129]/50 border border-white/[0.06] rounded-2xl min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-400">
            <circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
          </svg>
        </div>
        <p className="text-sm text-slate-500">Enter a concept above to generate an interactive simulation</p>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={simulation}
      sandbox="allow-scripts"
      className="flex-1 w-full min-h-[60vh] bg-[#0a0a0f] border border-white/[0.06] rounded-2xl"
      title="KinetiQ Simulation"
    />
  );
}