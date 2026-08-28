"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Bot } from "lucide-react";
import ChatSidebar from "@/components/tutor/ChatSidebar";
import ChatMessage from "@/components/tutor/ChatMessage";
import ChatInput from "@/components/tutor/ChatInput";

export default function TutorPage() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your KinetiQ AI Tutor. Ask me anything about science, math, or technology — I'll explain it clearly and help you understand step by step. What would you like to learn today?", showActions: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const bottomRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(API_URL + "/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, showActions: true, concept: text }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again.", showActions: false }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    if (action === "example") handleSend("Give me a real-world example of that concept.");
    else if (action === "simplify") handleSend("Can you explain that in simpler terms?");
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="hidden lg:flex">
        <ChatSidebar activeChat={activeChat} onNewChat={() => { setMessages([{ role: "assistant", content: "Hello! What would you like to learn today?", showActions: false }]); setActiveChat(null); }} onSelectChat={setActiveChat} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">KinetiQ AI Tutor</h2>
              <p className="text-xs text-slate-500">Powered by Gemini</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} onAction={handleAction} />
          ))}
          {loading && (
            <div className="flex gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="px-4 py-3 bg-[#0f1129]/80 border border-white/[0.06] rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <ChatInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}