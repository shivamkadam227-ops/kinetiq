"use client";
import { useState, useEffect } from "react";
import { Flame, Check } from "lucide-react";
import { getStreak, getStreakDays } from "@/lib/dataStore";
import Card from "@/components/ui/Card";

export default function LearningStreak() {
  const [streakCount, setStreakCount] = useState(0);
  const [days, setDays] = useState([]);

  useEffect(() => {
    const streak = getStreak();
    setStreakCount(streak.count);
    setDays(getStreakDays());
  }, []);

  return (
    <Card className="p-5 mb-4" hover={false}>
      <div className="flex items-center gap-2 mb-1">
        <Flame size={18} className="text-orange-400" />
        <h3 className="text-sm font-semibold text-white">Learning Streak</h3>
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {streakCount} <span className="text-sm font-normal text-slate-400">{streakCount === 1 ? "Day" : "Days"}</span>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        {streakCount === 0 ? "Start learning to build your streak!" : "Keep it up! You're doing great!"}
      </p>
      <div className="flex justify-between">
        {days.map((d) => (
          <div key={d.day} className="flex flex-col items-center gap-1.5">
            <div className={[
              "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              d.completed ? "bg-green-500/20 text-green-400 border border-green-500/30" :
              d.isToday ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/30" :
              "bg-white/5 text-slate-500 border border-white/10"
            ].join(" ")}>
              {d.completed ? <Check size={16} /> : d.isToday ? "●" : ""}
            </div>
            <span className="text-[10px] text-slate-500">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}