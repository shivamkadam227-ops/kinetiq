"use client";
import { useRouter } from "next/navigation";
import { upcomingTest } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function UpcomingTest() {
  const router = useRouter();
  return (
    <Card className="p-5 mb-4" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Upcoming Test</h3>
        <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View All</button>
      </div>
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-14 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex flex-col items-center justify-center border border-purple-500/20">
          <span className="text-[10px] font-medium text-purple-400 uppercase">{upcomingTest.date.month}</span>
          <span className="text-xl font-bold text-white">{upcomingTest.date.day}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-white">{upcomingTest.title}</h4>
            <Badge variant="orange">{upcomingTest.difficulty}</Badge>
          </div>
          <p className="text-xs text-slate-400 mb-1">{upcomingTest.questions} Questions &bull; {upcomingTest.duration}</p>
          <p className="text-xs text-slate-500">Topics: {upcomingTest.topics.join(", ")}</p>
        </div>
      </div>
      <button
        onClick={() => router.push("/test")}
        className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
      >
        Start Test
      </button>
    </Card>
  );
}