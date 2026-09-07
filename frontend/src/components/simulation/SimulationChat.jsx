"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { MessageCircle, Send, X, Volume2, Bot, User } from "lucide-react";

export default function SimulationChat({ simulationTopic, isOpen, onToggle }) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when topic changes
  useEffect(() => {
    if (simulationTopic) {
      setMessages([{
        role: "assistant",
        content: "I'm here to help you understand this simulation about \"" + simulationTopic + "\". Ask me anything!",
      }]);
    }
  }, [simulationTopic]);

  const speakText = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en")) ||
      voices.find((v) => v.lang.startsWith("en-US"));
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(API_URL + "/api/simulation-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ simulationTopic, message: text }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      speakText(data.reply);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process your question. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105"
        title="Ask a doubt"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-[#0a0b1e]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Simulation Assistant</h3>
            <p className="text-[10px] text-slate-500">Ask doubts about this simulation</p>
          </div>
        </div>
        <button onClick={onToggle} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[340px]">
        {messages.map((msg, i) => (
          <div key={i} className={["flex gap-2", msg.role === "user" ? "justify-end" : ""].join(" ")}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={12} className="text-white" />
              </div>
            )}
            <div className={[
              "max-w-[80%] px-3 py-2 rounded-xl text-sm",
              msg.role === "user"
                ? "bg-purple-500/20 text-white rounded-br-md"
                : "bg-white/5 text-slate-300 rounded-bl-md",
            ].join(" ")}>
              {msg.content}
              {msg.role === "assistant" && i > 0 && (
                <button
                  onClick={() => speakText(msg.content)}
                  className="ml-2 inline-flex p-1 text-slate-500 hover:text-purple-400 transition-colors"
                  title="Read aloud"
                >
                  <Volume2 size={12} />
                </button>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={12} className="text-slate-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot size={12} className="text-white" />
            </div>
            <div className="px-3 py-2 bg-white/5 rounded-xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="px-3 py-3 border-t border-white/[0.06]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a doubt..."
            className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
