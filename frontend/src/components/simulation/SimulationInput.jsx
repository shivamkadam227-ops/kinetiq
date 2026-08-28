"use client";
import { Sparkles, Send } from "lucide-react";

export default function SimulationInput({ query, setQuery, onSubmit, loading }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex gap-3 items-center">
      <div className="flex-1 relative">
        <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Describe a concept to simulate... e.g. "Orbital mechanics of a binary star system"'
          className="w-full pl-11 pr-4 py-3.5 bg-[#0f1129]/80 border border-white/[0.06] rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
        Simulate
      </button>
    </form>
  );
}