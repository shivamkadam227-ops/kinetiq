"use client";
export default function ProgressBar({ value = 0, color = "#8b5cf6", size = "md", showLabel = false, className = "" }) {
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };
  return (
    <div className={["flex items-center gap-3", className].join(" ")}>
      <div className={["w-full bg-white/5 rounded-full overflow-hidden", heights[size]].join(" ")}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: value + "%", backgroundColor: color }}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-400 min-w-[36px] text-right">{value}%</span>}
    </div>
  );
}