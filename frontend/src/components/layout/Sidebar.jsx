"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Atom, MessageSquareText, ClipboardCheck, TrendingUp, Bookmark, Settings, HelpCircle, Sparkles, X } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulate", label: "Simulate", icon: Atom },
  { href: "/tutor", label: "AI Tutor", icon: MessageSquareText },
  { href: "/test", label: "Test", icon: ClipboardCheck },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "#", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
      <aside className={[
        "fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-[#0a0b1e]/95 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      ].join(" ")}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">K</div>
            <span className="text-lg font-semibold tracking-tight text-white">Kineti<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Q</span></span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-sm shadow-purple-500/10 border border-purple-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                ].join(" ")}>
                <item.icon size={20} className={isActive ? "text-purple-400" : ""} />
                {item.label}
              </Link>
            );
          })}

          <div className="my-4 border-t border-white/[0.06]" />

          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} onClick={onClose}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive ? "bg-white/5 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                ].join(" ")}>
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="px-3 pb-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-purple-400" />
              <span className="text-sm font-semibold text-white">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">Unlock unlimited simulations, tests and AI tutor.</p>
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}