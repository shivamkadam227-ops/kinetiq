"use client";
import ProgressBar from "@/components/ui/ProgressBar";

export default function TestProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">Question <span className="text-white font-semibold">{current}</span> / {total}</span>
        <span className="text-sm text-slate-400">{pct}%</span>
      </div>
      <ProgressBar value={pct} color="#8b5cf6" size="md" />
    </div>
  );
}