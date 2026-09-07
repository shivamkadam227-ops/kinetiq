"use client";
import { Maximize2, RotateCcw, RefreshCw, Bookmark, BookmarkCheck } from "lucide-react";

export default function SimulationControls({ onReset, onRegenerate, onBookmark, onFullscreen, bookmarked }) {
  const buttons = [
    { icon: Maximize2, label: "Fullscreen", onClick: onFullscreen },
    { icon: RotateCcw, label: "Reset", onClick: onReset },
    { icon: RefreshCw, label: "Regenerate", onClick: onRegenerate },
    { icon: bookmarked ? BookmarkCheck : Bookmark, label: bookmarked ? "Bookmarked" : "Bookmark", onClick: onBookmark, active: bookmarked },
  ];
  return (
    <div className="flex items-center gap-2">
      {buttons.map((b) => (
        <button
          key={b.label}
          onClick={b.onClick}
          title={b.label}
          className={[
            "p-2 rounded-xl transition-all",
            b.active
              ? "text-purple-400 bg-purple-500/10"
              : "text-slate-400 hover:text-white hover:bg-white/5",
          ].join(" ")}
        >
          <b.icon size={18} />
        </button>
      ))}
    </div>
  );
}