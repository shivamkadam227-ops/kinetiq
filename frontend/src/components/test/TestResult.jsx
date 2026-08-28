"use client";
import { useRouter } from "next/navigation";
import { Trophy, Eye, RotateCcw, Target, TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/ui/Card";

export default function TestResult({ score, total, questions, answers }) {
  const router = useRouter();
  const pct = Math.round((score / total) * 100);
  const strong = [];
  const weak = [];
  questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) strong.push(q);
    else weak.push(q);
  });

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Trophy size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Test Complete!</h1>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div>
            <div className="text-4xl font-bold text-white">{score}<span className="text-xl text-slate-400">/{total}</span></div>
            <p className="text-xs text-slate-500 mt-1">Score</p>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div>
            <div className="text-4xl font-bold text-white">{pct}%</div>
            <p className="text-xs text-slate-500 mt-1">Accuracy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4" hover={false}>
          <TrendingUp size={18} className="text-green-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Strong Topics</h3>
          <p className="text-xs text-slate-400">{strong.length} questions correct</p>
        </Card>
        <Card className="p-4" hover={false}>
          <TrendingDown size={18} className="text-red-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Weak Topics</h3>
          <p className="text-xs text-slate-400">{weak.length} questions incorrect</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {weak.length > 0 && (
          <button onClick={() => router.push("/simulate?concept=" + encodeURIComponent("Review: " + weak[0].question.substring(0, 50)))}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all">
            <Eye size={16} /> Visualize Weak Topics
          </button>
        )}
        <button onClick={() => router.push("/test")}
          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
          <RotateCcw size={16} /> Try Another Test
        </button>
      </div>
    </div>
  );
}