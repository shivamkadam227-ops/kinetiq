"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    onSend(message.trim());
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/[0.06]">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your question..."
          className="flex-1 px-4 py-3 bg-[#0f1129]/80 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-40"
        >
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </form>
  );
}