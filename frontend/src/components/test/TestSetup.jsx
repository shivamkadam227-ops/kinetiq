"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const subjects = ["Physics", "Mathematics", "Computer Science", "Chemistry", "Biology"];
const difficulties = ["Easy", "Medium", "Hard"];
const questionCounts = [5, 10, 15, 20];

export default function TestSetup({ onStart, initialTopic }) {
  const [subject, setSubject] = useState("Physics");
  const [topic, setTopic] = useState(initialTopic || "");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(10);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Test Your Knowledge</h1>
        <p className="text-slate-400">Configure your test and challenge yourself</p>
      </div>
      <Card className="p-6" hover={false}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Subject</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button key={s} onClick={() => setSubject(s)}
                  className={["px-4 py-2 rounded-xl text-sm font-medium transition-all border", subject === s ? "bg-purple-500/20 border-purple-500/30 text-purple-300" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"].join(" ")}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Topic (optional)</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Newton's Laws, Calculus, Binary Trees..."
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={["px-4 py-2 rounded-xl text-sm font-medium transition-all border flex-1", difficulty === d ? "bg-purple-500/20 border-purple-500/30 text-purple-300" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"].join(" ")}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Number of Questions</label>
            <div className="flex gap-2">
              {questionCounts.map((q) => (
                <button key={q} onClick={() => setCount(q)}
                  className={["px-4 py-2 rounded-xl text-sm font-medium transition-all border flex-1", count === q ? "bg-purple-500/20 border-purple-500/30 text-purple-300" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"].join(" ")}>
                  {q}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => onStart({ subject, topic, difficulty, count })}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all mt-2">
            <Play size={18} /> Start Test
          </button>
        </div>
      </Card>
    </div>
  );
}