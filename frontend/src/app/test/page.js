"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestSetup from "@/components/test/TestSetup";
import QuestionCard from "@/components/test/QuestionCard";
import TestProgressBar from "@/components/test/TestProgress";
import TestResult from "@/components/test/TestResult";
import TestReview from "@/components/test/TestReview";
import Card from "@/components/ui/Card";
import { saveTestResult } from "@/lib/dataStore";

export default function TestPage() {
  const searchParams = useSearchParams();
  const { getToken } = useAuth();
  const [phase, setPhase] = useState("setup");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [initialTopic, setInitialTopic] = useState("");
  const [testConfig, setTestConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    const topic = searchParams.get("topic");
    if (topic) setInitialTopic(topic);
  }, [searchParams]);

  const handleStart = async (config) => {
    setTestConfig(config);
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const res = await fetch(API_URL + "/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          subject: config.subject,
          topic: config.topic,
          difficulty: config.difficulty,
          count: config.count,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate test");
      }
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions generated. Please try again.");
      }
      setQuestions(data.questions);
      setAnswers({});
      setCurrentQ(0);
      setPhase("test");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (answerIdx) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: answerIdx }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      // Test finished — save results
      let score = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.correctAnswer) score++;
      });
      saveTestResult({
        subject: testConfig.subject,
        topic: testConfig.topic,
        difficulty: testConfig.difficulty,
        score,
        total: questions.length,
        questions,
        answers,
      });
      setPhase("result");
    }
  };

  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0);

  if (phase === "setup") {
    return (
      <div className="p-4 sm:p-6">
        <TestSetup onStart={handleStart} initialTopic={initialTopic} loading={loading} />
        {error && (
          <div className="max-w-2xl mx-auto mt-4 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="p-4 sm:p-6">
        <TestResult
          score={score}
          total={questions.length}
          questions={questions}
          answers={answers}
          onReview={() => setPhase("review")}
          testConfig={testConfig}
        />
      </div>
    );
  }

  if (phase === "review") {
    return (
      <div className="p-4 sm:p-6">
        <TestReview
          questions={questions}
          answers={answers}
          testConfig={testConfig}
          onBack={() => setPhase("result")}
        />
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