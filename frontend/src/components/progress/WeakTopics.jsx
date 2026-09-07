"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Dumbbell, BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import { getWeakTopics } from "@/lib/dataStore";

export default function WeakTopics() {
  const router = useRouter();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const weak = getWeakTopics();
    // Group by topic/subject, take unique
    const seen = new Set();
    const unique = weak.filter((w) => {
      const key = w.topic + "-" + w.subject;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 5);
    setTopics(unique);
  }, []);

  if (topics.length === 0) {
    return (
      <Card className="p-5" hover={false}>
        <h3 className="text-sm font-semibold text-white mb-1">Recommended for You</h3>
        <p className="text-xs text-slate-500 mb-4">Topics that need more practice</p>
        <div className="text-center py-6">
          <BookOpen size={24} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Complete tests to discover weak topics</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5" hover={false}>
      <h3 className="text-sm font-semibold text-white mb-1">Recommended for You</h3>
      <p className="text-xs text-slate-500 mb-4">Topics that need more practice</p>
      <div className="space-y-3">
        {topics.map((t, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
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