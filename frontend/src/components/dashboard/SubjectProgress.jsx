"use client";
import { subjectProgress } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

export default function SubjectProgress() {
  return (
    <Card className="p-5" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Subject Progress</h3>
        <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View All</button>
      </div>
      <div className="space-y-3.5">
        {subjectProgress.map((s) => (
          <div key={s.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{s.icon}</span>
                <span className="text-xs font-medium text-white">{s.name}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">{s.progress}%</span>
            </div>
            <ProgressBar value={s.progress} color={s.color} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
}