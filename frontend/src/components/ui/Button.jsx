"use client";
const variants = {
  primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0",
  secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
  ghost: "text-slate-400 hover:text-white hover:bg-white/5",
  danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
};
const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "p-2",
};
export default function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  return (
    <button
      className={["inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none", variants[variant], sizes[size], className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}