"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, ChevronDown, ChevronUp, Eye, XCircle, CheckCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import SimulationFrame from "@/components/simulation/SimulationFrame";
import VoiceAssistant from "@/components/simulation/VoiceAssistant";
import SimulationChat from "@/components/simulation/SimulationChat";

export default function TestReview({ questions, answers, testConfig, onBack }) {
  const { getToken } = useAuth();
  const [expandedQ, setExpandedQ] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simulation, setSimulation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [simTopic, setSimTopic] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const wrongQuestions = questions
    .map((q, i) => ({ ...q, index: i, userAnswer: answers[i] }))
    .filter((q) => q.userAnswer !== q.correctAnswer);

  const handleVisualize = useCallback(async (question) => {
    const topic = question.question.substring(0, 80);
    setSimTopic(topic);
    setSimLoading(true);
    setSimulation("");
    setExplanation("");

    try {
      const token = await getToken();

      // Fetch simulation and explanation in parallel
      const [simRes, expRes] = await Promise.all([
        fetch(API_URL + "/api/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ query: "Explain and visualize: " + question.question + ". The correct answer is: " + question.options[question.correctAnswer] + ". " + question.explanation }),
        }),
        fetch(API_URL + "/api/simulation-explain", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ query: question.question + " — Correct answer: " + question.options[question.correctAnswer] + ". " + question.explanation }),
        }),
      ]);

      if (simRes.ok) {
        const simData = await simRes.json();
        setSimulation(simData.simulation);
      }
      if (expRes.ok) {
        const expData = await expRes.json();
        setExplanation(expData.explanation || "");
      }
    } catch (err) {
      console.error("Review visualization error:", err);
    } finally {
      setSimLoading(false);
    }
  }, [getToken, API_URL]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Review Wrong Answers</h1>
          <p className="text-sm text-slate-400">{wrongQuestions.length} questions to review — Click "Visualize" to see a simulation</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {wrongQuestions.map((q, idx) => (
          <Card key={idx} className="overflow-hidden" hover={false}>
            <button
              onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
              className="w-full flex items-start gap-3 p-4 text-left"
            >
              <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{q.question}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-red-400">Your answer: {q.options[q.userAnswer]}</span>
                  <span className="text-xs text-green-400">Correct: {q.options[q.correctAnswer]}</span>
                </div>
              </div>
              {expandedQ === idx ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedQ === idx && (
              <div className="px-4 pb-4 border-t border-white/[0.06] pt-3">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={14} className="text-green-400" />
                  <p className="text-sm text-slate-300">{q.explanation}</p>
                </div>
                <button
                  onClick={() => handleVisualize(q)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <Eye size={14} /> Visualize This Concept
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Simulation area */}
      {(simulation || simLoading) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Concept Visualization</h2>
            <VoiceAssistant explanation={explanation} isActive={!!simulation} />
          </div>
          <SimulationFrame simulation={simulation} loading={simLoading} />
        </div>
      )}

      {/* Chat for doubts */}
      {simulation && (
        <SimulationChat
          simulationTopic={simTopic}
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
        />
      )}
    </div>
  );
}
