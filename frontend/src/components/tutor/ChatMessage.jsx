"use client";
import { User, Bot } from "lucide-react";
import TutorActions from "./TutorActions";

export default function ChatMessage({ message, onAction }) {
  const isUser = message.role === "user";
  return (
    <div className={["flex gap-3 mb-6", isUser ? "justify-end" : ""].join(" ")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className={["max-w-[80%]", isUser ? "order-first" : ""].join(" ")}>
        <div className={[
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md" : "bg-[#0f1129]/80 border border-white/[0.06] text-slate-300 rounded-bl-md"
        ].join(" ")}>
          {message.content}
        </div>
        {!isUser && message.showActions && <TutorActions concept={message.concept} onAction={onAction} />}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}