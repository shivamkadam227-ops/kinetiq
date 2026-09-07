"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import SimulationInput from "@/components/simulation/SimulationInput";
import SimulationFrame from "@/components/simulation/SimulationFrame";
import SimulationControls from "@/components/simulation/SimulationControls";
import VoiceAssistant from "@/components/simulation/VoiceAssistant";
import SimulationChat from "@/components/simulation/SimulationChat";
import { addBookmark, isBookmarked, saveSimulation } from "@/lib/dataStore";

export default function SimulatePage() {
  const searchParams = useSearchParams();
  const { getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [simulation, setSimulation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const fetchExplanation = useCallback(async (q, token) => {
    try {
      const res = await fetch(API_URL + "/api/simulation-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ query: q }),
      });
      if (res.ok) {
        const data = await res.json();
        setExplanation(data.explanation || "");
      }
    } catch {
      // Explanation is optional, don't block on failure
    }
  }, [API_URL]);

  const handleSimulate = useCallback(async (overrideQuery) => {
    const q = (overrideQuery || query).trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setSimulation("");
    setExplanation("");
    setBookmarked(false);
    try {
      const token = await getToken();
      const res = await fetch(API_URL + "/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Server error (" + res.status + ")");
      }
      const data = await res.json();
      setSimulation(data.simulation);
      saveSimulation({ query: q, simulation: data.simulation });

      // Fetch explanation for voice assistant (in parallel, non-blocking)
      const token2 = await getToken();
      fetchExplanation(q, token2);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [query, getToken, API_URL, fetchExplanation]);

  useEffect(() => {
    const concept = searchParams.get("concept");
    if (concept) {
      setQuery(concept);
      handleSimulate(concept);
    }
  }, []);

  const handleBookmark = () => {
    addBookmark({
      id: "sim-" + Date.now(),
      title: query,
      type: "simulation",
      subject: "Simulation",
      query: query,
    });
    setBookmarked(true);
  };

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe[title="KinetiQ Simulation"]');
    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <SimulationInput query={query} setQuery={setQuery} onSubmit={() => handleSimulate()} loading={loading} />
        </div>
        {simulation && (
          <div className="flex items-center gap-2">
            <VoiceAssistant explanation={explanation} isActive={!!simulation} />
            <SimulationControls
              onRegenerate={() => handleSimulate()}
              onReset={() => { setSimulation(""); setExplanation(""); }}
              onBookmark={handleBookmark}
              onFullscreen={handleFullscreen}
              bookmarked={bookmarked}
            />
          </div>
        )}
      </div>
      {error && (
        <div className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}
      <SimulationFrame simulation={simulation} loading={loading} />

      {/* Chat for doubts */}
      {simulation && (
        <SimulationChat
          simulationTopic={query}
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
        />
      )}
    </div>
  );
}