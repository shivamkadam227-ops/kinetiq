"use client";
import { weeklyStats } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import { Zap, ClipboardCheck, Target } from "lucide-react";

export default function WeeklyProgress() {
  return (
    <Card className="p-5 mb-4" hover={false}>
      <h3 className="text-sm font-semibold text-white mb-4">This Week&apos;s Progress</h3>
      <div className="flex items-center gap-5">
        {/* Circular progress */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="url(#progressGrad)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - weeklyStats.overallProgress / 100)} />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{weeklyStats.overallProgress}%</span>
          </div>
        </div>
        {/* Stats */}
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400"><Zap size={14} className="text-purple-400" /> Simulations</div>
            <span className="text-sm font-semibold text-white">{weeklyStats.simulations}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400"><ClipboardCheck size={14} className="text-cyan-400" /> Tests Attempted</div>
            <span className="text-sm font-semibold text-white">{weeklyStats.testsAttempted}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400"><Target size={14} className="text-green-400" /> Accuracy</div>
            <span className="text-sm font-semibold text-white">{weeklyStats.accuracy}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}