"use client";
import OverallProgress from "@/components/progress/OverallProgress";
import WeeklyActivity from "@/components/progress/WeeklyActivity";
import SubjectPerformance from "@/components/progress/SubjectPerformance";
import WeakTopics from "@/components/progress/WeakTopics";

export default function ProgressPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Learning Progress</h1>
        <p className="text-sm text-slate-400">Track your growth and identify areas to improve</p>
      </div>
      <OverallProgress />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WeeklyActivity />
        <SubjectPerformance />
      </div>
      <WeakTopics />
    </div>
  );
}