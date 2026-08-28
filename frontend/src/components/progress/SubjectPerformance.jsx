"use client";
import { subjectProgress } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

export default function SubjectPerformance() {
  return (
    <Card className="p-5" hover={false}>
      <h3 className="text-sm font-semibold text-white mb-5">Subject Performance</h3>
      <div className="space-y-4">
        {subjectProgress.map((s) => (
          <div key={s.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-white">{s.icon} {s.name}</span>
              <span className="text-sm font-semibold text-white">{s.progress}%</span>
            </div>
            <ProgressBar value={s.progress} color={s.color} size="md" />
          </div>
        ))}
      </div>
    </Card>
  );
}