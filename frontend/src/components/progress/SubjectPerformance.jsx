"use client";
import { useState, useEffect } from "react";
import { getSubjectStats } from "@/lib/dataStore";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

const subjectColors = {
  Physics: "#8b5cf6",
  Mathematics: "#6366f1",
  "Computer Science": "#ef4444",
  Chemistry: "#f59e0b",
  Biology: "#22d3ee",
  History: "#f97316",
  Geography: "#10b981",
  Economics: "#ec4899",
};

const subjectIcons = {
  Physics: "⚛️",
  Mathematics: "📐",
  "Computer Science": "💻",
  Chemistry: "🧪",
  Biology: "🧬",
  History: "📜",
  Geography: "🌍",
  Economics: "📊",
};

export default function SubjectPerformance() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const stats = getSubjectStats();
    setSubjects(stats);
  }, []);

  if (subjects.length === 0) {
    return (
      <Card className="p-5" hover={false}>
        <h3 className="text-sm font-semibold text-white mb-5">Subject Performance</h3>
        <p className="text-sm text-slate-500 text-center py-6">Complete tests to see your subject performance</p>
      </Card>
    );
  }

  return (
    <Card className="p-5" hover={false}>
      <h3 className="text-sm font-semibold text-white mb-5">Subject Performance</h3>
      <div className="space-y-4">
        {subjects.map((s) => (
          <div key={s.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-white">{subjectIcons[s.name] || "📚"} {s.name}</span>
              <span className="text-sm font-semibold text-white">{s.progress}%</span>
            </div>
            <ProgressBar value={s.progress} color={subjectColors[s.name] || "#8b5cf6"} size="md" />
            <p className="text-[10px] text-slate-500 mt-1">{s.tests} test{s.tests !== 1 ? "s" : ""} completed</p>
          </div>
        ))}
      </div>
    </Card>
  );
}