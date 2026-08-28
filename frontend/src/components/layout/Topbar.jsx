"use client";
import { UserButton } from "@clerk/nextjs";
import { Search, Bell, Flame, Menu } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#06060e]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-6">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <Menu size={20} />
        </button>
        <div className="relative flex-1 max-w-xl">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search for topics, concepts, or questions..."
            className="w-full pl-10 pr-20 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-slate-500 font-mono">Ctrl K</span>
        </div>
      </div>

      {/* Right: streak, notifications, user */}
      <div className="flex items-center gap-2 sm:gap-3 ml-4">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <Flame size={16} className="text-orange-400" />
          <span className="text-xs font-semibold text-orange-300">7 Day Streak</span>
        </div>
        <button className="relative p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
        </button>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-purple-500/20 ring-offset-2 ring-offset-[#06060e]",
            },
          }}
        />
      </div>
    </header>
  );
}