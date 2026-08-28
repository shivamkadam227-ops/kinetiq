"use client";
import { Plus, MessageSquare } from "lucide-react";
import { tutorConversations } from "@/lib/mockData";

export default function ChatSidebar({ activeChat, onNewChat, onSelectChat }) {
  return (
    <div className="w-full lg:w-72 bg-[#0a0b1e]/80 border-r border-white/[0.06] flex flex-col">
      <div className="p-4">
        <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
          <Plus size={16} /> New Chat
        </button>
      </div>
      <div className="px-4 pb-2">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Recent</h3>
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {tutorConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectChat(conv.id)}
            className={[
              "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
              activeChat === conv.id ? "bg-purple-500/10 border border-purple-500/20" : "hover:bg-white/5"
            ].join(" ")}
          >
            <MessageSquare size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{conv.title}</p>
              <p className="text-xs text-slate-500 truncate">{conv.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}