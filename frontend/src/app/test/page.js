"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestSetup from "@/components/test/TestSetup";
import QuestionCard from "@/components/test/QuestionCard";
import TestProgressBar from "@/components/test/TestProgress";
import TestResult from "@/components/test/TestResult";
import Card from "@/components/ui/Card";
import { sampleTestQuestions } from "@/lib/mockData";

export default function TestPage() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState("setup");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [initialTopic, setInitialTopic] = useState("");

  useEffect(() => {
    const topic = searchParams.get("topic");
    if (topic) setInitialTopic(topic);
  }, [searchParams]);

  const handleStart = (config) => {
    const qs = sampleTestQuestions.slice(0, config.count);
    setQuestions(qs);
    setAnswers({});
    setCurrentQ(0);
    setPhase("test");
  };

  const handleSelect = (answerIdx) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: answerIdx }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ((p) => p + 1);
    else {
      let score = 0;
      questions.forEach((q, i) => { if (answers[i] === q.correctAnswer) score++; });
      setPhase("result");
    }
  };

  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0);

  if (phase === "setup") {
    return (
      <div className="p-4 sm:p-6">
        <TestSetup onStart={handleStart} initialTopic={initialTopic} />
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="p-4 sm:p-6">
        <TestResult score={score} total={questions.length} questions={questions} answers={answers} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <TestProgressBar current={currentQ + 1} total={questions.length} />
      <Card className="p-6 sm:p-8" hover={false}>
        <QuestionCard question={questions[currentQ]} selectedAnswer={answers[currentQ]} onSelect={handleSelect} />
        <div className="flex justify-between mt-8">
          <button onClick={() => setCurrentQ((p) => Math.max(0, p - 1))} disabled={currentQ === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-all disabled:opacity-30">
            <ChevronLeft size={16} /> Previous
          </button>
          <button onClick={handleNext} disabled={answers[currentQ] === undefined}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-40">
            {currentQ === questions.length - 1 ? "Finish" : "Next"} <ChevronRight size={16} />
          </button>
        </div>
      </Card>
    </div>
  );
}