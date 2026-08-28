"use client";
export default function Card({ children, className = "", glow = false, hover = true, onClick, ...props }) {
  const base = "bg-[#0f1129]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl";
  const glowClass = glow ? "shadow-lg shadow-purple-500/10" : "";
  const hoverClass = hover ? "hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300" : "";
  const clickClass = onClick ? "cursor-pointer" : "";
  return (
    <div className={[base, glowClass, hoverClass, clickClass, className].join(" ")} onClick={onClick} {...props}>
      {children}
    </div>
  );
}