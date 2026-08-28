"use client";
import { Maximize2, RotateCcw, RefreshCw, Bookmark } from "lucide-react";

export default function SimulationControls({ onReset, onRegenerate, onBookmark, onFullscreen }) {
  const buttons = [
    { icon: Maximize2, label: "Fullscreen", onClick: onFullscreen },
    { icon: RotateCcw, label: "Reset", onClick: onReset },
    { icon: RefreshCw, label: "Regenerate", onClick: onRegenerate },
    { icon: Bookmark, label: "Bookmark", onClick: onBookmark },
  ];
  return (
    <div className="flex items-center gap-2">
      {buttons.map((b) => (
        <button
          key={b.label}
          onClick={b.onClick}
          title={b.label}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <b.icon size={18} />
        </button>
      ))}
    </div>
  );
}