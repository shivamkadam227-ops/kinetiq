"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send } from "lucide-react";

export default function AICommandBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push("/simulate?concept=" + encodeURIComponent(query.trim()));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative flex items-center">
        <Sparkles size={18} className="absolute left-4 text-purple-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Ask anything... (e.g. "Explain black holes", "Visualize binary search")'
          className="w-full pl-11 pr-14 py-4 bg-[#0f1129]/80 border border-white/[0.06] rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-40"
          disabled={!query.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}