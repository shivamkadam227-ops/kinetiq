"use client";
import { useRouter } from "next/navigation";
import { Atom, MessageSquareText, ClipboardCheck, Compass } from "lucide-react";

const actions = [
  { icon: Atom, label: "New Simulation", desc: "Visualize any concept", href: "/simulate", color: "from-indigo-500/20 to-purple-500/20", iconColor: "text-indigo-400" },
  { icon: MessageSquareText, label: "Chat with AI Tutor", desc: "Ask doubts, get explanations", href: "/tutor", color: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
  { icon: ClipboardCheck, label: "Take a Test", desc: "Test your knowledge", href: "/test", color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
  { icon: Compass, label: "Explore Topics", desc: "Browse all subjects", href: "/dashboard", color: "from-orange-500/20 to-amber-500/20", iconColor: "text-orange-400" },
];

export default function QuickActions() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => router.push(a.href)}
          className={"flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br " + a.color + " border border-white/[0.06] hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-0.5 transition-all duration-200 text-left"}
        >
          <div className={"p-2 rounded-xl bg-white/5 " + a.iconColor}>
            <a.icon size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{a.label}</div>
            <div className="text-xs text-slate-400">{a.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}