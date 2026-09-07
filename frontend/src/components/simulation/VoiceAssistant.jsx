"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Pause, Play, SkipForward } from "lucide-react";

export default function VoiceAssistant({ explanation, isActive }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text) => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to get a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en")) ||
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { setSpeaking(true); setPaused(false); };
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    utterance.onerror = () => { setSpeaking(false); setPaused(false); };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  // Auto-speak when explanation arrives
  useEffect(() => {
    if (explanation && isActive) {
      // Wait a moment for voices to load
      const timer = setTimeout(() => speak(explanation), 500);
      return () => clearTimeout(timer);
    }
  }, [explanation, isActive, speak]);

  const handleToggle = () => {
    if (!supported) return;
    if (speaking && !paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    } else if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      speak(explanation);
    }
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={[
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
          speaking && !paused
            ? "bg-purple-500/20 border-purple-500/30 text-purple-300"
            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white",
        ].join(" ")}
        title={speaking ? (paused ? "Resume" : "Pause") : "Play explanation"}
      >
        {speaking && !paused ? (
          <>
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              <span className="w-1 h-5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
            </div>
            <Pause size={14} />
          </>
        ) : paused ? (
          <>
            <Play size={14} /> Resume
          </>
        ) : (
          <>
            <Volume2 size={14} /> Explain
          </>
        )}
      </button>
      {speaking && (
        <button
          onClick={handleStop}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          title="Stop"
        >
          <VolumeX size={16} />
        </button>
      )}
    </div>
  );
}
