"use client";
import { useRouter } from "next/navigation";
import { Eye, ClipboardCheck, Lightbulb, Minimize2 } from "lucide-react";

export default function TutorActions({ concept, onAction }) {
  const router = useRouter();
  const actions = [
    { icon: Eye, label: "Visualize this", onClick: () => router.push("/simulate?concept=" + encodeURIComponent(concept || "")) },
    { icon: ClipboardCheck, label: "Test me", onClick: () => router.push("/test?topic=" + encodeURIComponent(concept || "")) },
    { icon: Lightbulb, label: "Give example", onClick: () => onAction && onAction("example") },
    { icon: Minimize2, label: "Simplify", onClick: () => onAction && onAction("simplify") },
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {actions.map((a) => (
        <button key={a.label} onClick={a.onClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/10 hover:border-purple-500/20 transition-all">
          <a.icon size={12} /> {a.label}
        </button>
      ))}
    </div>
  );
}