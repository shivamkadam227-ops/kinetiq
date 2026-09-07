"use client";
import { useState, useEffect } from "react";
import { Zap, ClipboardCheck, Target, Flame } from "lucide-react";
import Card from "@/components/ui/Card";
import { getTestStats, getStreak, getSimulationCount } from "@/lib/dataStore";

export default function OverallProgress() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const testStats = getTestStats();
    const streak = getStreak();
    const simCount = getSimulationCount();

    setStats([
      { icon: Zap, label: "Total Simulations", value: String(simCount), color: "text-purple-400" },
      { icon: ClipboardCheck, label: "Tests Completed", value: String(testStats.testsCompleted), color: "text-cyan-400" },
      { icon: Target, label: "Average Accuracy", value: testStats.avgAccuracy + "%", color: "text-green-400" },
      { icon: Flame, label: "Learning Streak", value: streak.count + " days", color: "text-orange-400" },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <Card key={s.label} className="p-5" hover={false}>
          <s.icon size={20} className={s.color + " mb-3"} />
          <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
          <p className="text-xs text-slate-400">{s.label}</p>
        </Card>
      ))}
    </div>
  );
}