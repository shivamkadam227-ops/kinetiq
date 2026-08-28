"use client";
import { useRouter } from "next/navigation";
import { Eye, Dumbbell } from "lucide-react";
import Card from "@/components/ui/Card";

const weakTopics = [
  { topic: "Projectile Motion", subject: "Physics" },
  { topic: "Acceleration", subject: "Physics" },
  { topic: "Integration", subject: "Mathematics" },
];

export default function WeakTopics() {
  const router = useRouter();
  return (
    <Card className="p-5" hover={false}>
      <h3 className="text-sm font-semibold text-white mb-1">Recommended for You</h3>
      <p className="text-xs text-slate-500 mb-4">Topics that need more practice</p>
      <div className="space-y-3">
        {weakTopics.map((t) => (
          <div key={t.topic} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div>
              <p className="text-sm text-white font-medium">{t.topic}</p>
              <p className="text-xs text-slate-500">{t.subject}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => router.push("/simulate?concept=" + encodeURIComponent(t.topic))}
                className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors" title="Visualize">
                <Eye size={14} />
              </button>
              <button onClick={() => router.push("/test?topic=" + encodeURIComponent(t.topic))}
                className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors" title="Practice">
                <Dumbbell size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}