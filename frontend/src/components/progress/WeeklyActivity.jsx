"use client";
import Card from "@/components/ui/Card";

const activityData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 2.0 },
  { day: "Fri", hours: 4.1 },
  { day: "Sat", hours: 3.5 },
  { day: "Sun", hours: 1.5 },
];
const maxH = Math.max(...activityData.map((d) => d.hours));

export default function WeeklyActivity() {
  return (
    <Card className="p-5" hover={false}>
      <h3 className="text-sm font-semibold text-white mb-6">Weekly Activity</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {activityData.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] text-slate-400">{d.hours}h</span>
            <div className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-700"
              style={{ height: (d.hours / maxH * 100) + "%" }} />
            <span className="text-[10px] text-slate-500">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}